import React, { useEffect, useRef, useState } from 'react';

import { FormControlLabel, Stack, Switch } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AxiosError } from 'axios';
import { AxiosObservable } from 'axios-observable';
import { useSetRecoilState } from 'recoil';
import { concatMap, from, tap, toArray } from 'rxjs';

import { http } from '../../api/axios';
import { atomNotification } from '../../atoms/notification';
import DicomTreeView from '../../Components/DicomTreeView/DicomTreeView';
import DicomTreeViewSkeleton from '../../Components/DicomTreeViewSkeleton/DicomTreeViewSkeleton';
import { define } from '../../constant/setting-define';
import { DicomImagePath, DicomIOD, DicomPatient, DicomSeries, DicomStudy } from '../../interface/dicom-data';
import { MessageType } from '../../interface/notification';
import { DicomTagData } from '../../interface/tag-dict';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import { deepCopy, isEmptyOrNil } from '../../utils/general';
import classes from './AdvancedQualityControl.module.scss';

const initDicomIOD = {
    dicomPatient: {},
    dicomStudy: [],
    dicomSeries: [],
    dicomImage: [],
};

const AdvancedQualityControl = () => {
    const setNotification = useSetRecoilState(atomNotification);
    // const { studyInsUID } = useParams<{ studyInsUID: string }>();
    const [dicomData, setDicomData] = useState<DicomIOD>(initDicomIOD);
    const [sopInstanceUID, setSopInstanceUID] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>('');
    const [enableApi, setEnableApi] = useState(false);
    const [filterRow, setFilterRow] = useState(true);
    const [loading, setLoading] = useState(false);
    const activateFilterRef = useRef(true);

    useEffect(() => {
        setLoading(true);
        const dicomIOD: DicomIOD = deepCopy(initDicomIOD);
        const studyInstanceUID = '1.2.826.0.1.3680043.6.21455.15878.20190806073929.992.236';
        const subscription = http
            // Study
            .get<DicomStudy>(`dicomDbQuery/studyInstanceUID/${studyInstanceUID}`)
            .pipe(
                tap((studyRes) => (dicomIOD.dicomStudy = [studyRes.data])),
                // Patient
                concatMap((studyRes) => http.get<DicomPatient>(`dicomDbQuery/patientId/${studyRes.data.patientId}`)),
                tap((patientRes) => (dicomIOD.dicomPatient = patientRes.data)),
                // Series
                concatMap(() => http.get<DicomSeries[]>(`dicomDbQuery/studyInstanceUID/${studyInstanceUID}/series`)),
                tap((seriesRes) => (dicomIOD.dicomSeries = seriesRes.data)),
                concatMap((seriesRes) => from(seriesRes.data.map((seriesData) => seriesData.seriesInstanceUID))),
                // Image
                concatMap((seriesInstanceUID) =>
                    http.get<DicomImagePath[]>(`dicomDbQuery/seriesInstanceUID/${seriesInstanceUID}/images`),
                ),
                tap((imageRes) => (dicomIOD.dicomImage = [...dicomIOD.dicomImage, ...imageRes.data])),
                toArray(),
            )
            .subscribe({
                next: () => {
                    setDicomData(dicomIOD);
                    setLoading(false);
                },
                error: (err: AxiosError) => {
                    setLoading(false);
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        return () => {
            subscription.unsubscribe();
        };
    }, [setNotification]);

    useEffect(() => {
        if (isEmptyOrNil(sopInstanceUID)) return;
        const subscription = http
            .get(`imageRenderer/sopInstanceUID/${sopInstanceUID}/jpg`)
            .subscribe((res) => setThumbnailUrl(res.data));
        return () => {
            subscription.unsubscribe();
        };
    }, [sopInstanceUID]);

    const filterEditableTag = ({ data }) => {
        if (!activateFilterRef.current) return true;
        return (data as DicomTagData).editable;
    };

    const modifyTagRequest = (formData): AxiosObservable<any> => {
        return http.post(`dicomTag/sopInstanceUID/${sopInstanceUID}`, {
            ...formData,
            dicomImage: dicomData.dicomImage,
        });
    };

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <Stack sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: '1 1 50%' }}>
                <Typography className={classes.header} color="inherit" variant="h6" component="div">
                    Study information
                </Typography>
                {loading ? (
                    <DicomTreeViewSkeleton />
                ) : (
                    <DicomTreeView
                        dicomIOD={dicomData}
                        onImageSelected={(selectedSopInstanceUID) => {
                            setEnableApi(true);
                            setSopInstanceUID(selectedSopInstanceUID);
                        }}
                    />
                )}
            </Stack>
            <Stack sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: '1 1 50%', ml: '16px' }}>
                <div className={classes.body}>
                    <div>
                        <Typography className={classes.header} color="inherit" variant="h6" component="div">
                            Image tags
                            <FormControlLabel
                                label="Only Editable"
                                control={
                                    <Switch
                                        defaultChecked
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setFilterRow(event.target.checked);
                                            activateFilterRef.current = event.target.checked;
                                        }}
                                    />
                                }
                            />
                        </Typography>
                    </div>
                    <div className={`ag-theme-alpine ${classes.tableContainer}`}>
                        <GridTableEditor
                            apiPath={`dicomTag/sopInstanceUID/${sopInstanceUID}`}
                            externalUpdateRowApi={modifyTagRequest}
                            enableApi={enableApi}
                            identityId="tag"
                            subIdentityId="id"
                            enableDelete={false}
                            enableButtonBar={false}
                            colDef={define.imageTags.colDef}
                            formDef={define.imageTags.formDef}
                            initFormData={{}}
                            filterRow={filterRow}
                            filterRowFunction={filterEditableTag}
                            isFilterActivate={() => true}
                        />
                    </div>
                    <Typography className={classes.header} color="inherit" variant="h6" component="div">
                        Image thumbnail
                    </Typography>
                    <div className={classes.image}>
                        <img src={thumbnailUrl} alt="" loading="lazy" />
                    </div>
                </div>
            </Stack>
        </Box>
    );
};

export default AdvancedQualityControl;
