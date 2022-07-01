import React, { useEffect, useRef, useState } from 'react';

import { FormControlLabel, Stack, Switch } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AxiosObservable } from 'axios-observable';
import { useParams } from 'react-router-dom';

import { http } from '../../api/axios';
import DicomTreeView from '../../Components/DicomTreeView/DicomTreeView';
import DicomTreeViewSkeleton from '../../Components/DicomTreeViewSkeleton/DicomTreeViewSkeleton';
import { define } from '../../constant/setting-define';
import { useDicom } from '../../hooks/useDicom';
import { DicomTagData } from '../../interface/tag-dict';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import { isEmptyOrNil } from '../../utils/general';
import classes from './AdvancedQualityControl.module.scss';

const AdvancedQualityControl = () => {
    const { studyInsUID } = useParams() as { studyInsUID: string };
    const [sopInstanceUID, setSopInstanceUID] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>('');
    const [enableApi, setEnableApi] = useState(false);
    const [filterRow, setFilterRow] = useState(true);
    const activateFilterRef = useRef(true);
    const { dicomData, loading: fetchTreeViewLoading } = useDicom(studyInsUID);

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

    // const modifyDcmTagRequest = (formData): AxiosObservable<any> => {
    //     return http.post(`dicomTag/sopInstanceUID/${sopInstanceUID}`, {
    //         ...formData,
    //         dicomImage: dicomData.dicomImage,
    //     });
    // };

    // const applyDicomTagOnSeries = (formData): AxiosObservable<any> => {
    //     return http.post(`dicomTag/seriesInstanceUID/${seriesInstanceUID}`, {
    //         ...formData,
    //         dicomImage: dicomData.dicomImage,
    //     });
    // };

    const applyDicomTagOnStudy = (formData): AxiosObservable<any> => {
        return http.post(`dicomTag/studyInstanceUID/${studyInsUID}`, {
            ...formData,
            dicomImage: dicomData.dicomImage,
        });
    };

    return (
        <Box sx={{ display: 'flex', height: '100%', p: '8px' }}>
            <Stack sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: '1 1 35%' }}>
                <Typography className={classes.header} variant="subtitle1" component="div">
                    Study information
                </Typography>
                {fetchTreeViewLoading ? (
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
            <Stack sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: '1 1 65%', ml: '16px' }}>
                <div className={classes.body}>
                    <div>
                        <Typography className={classes.header} variant="subtitle1" component="div">
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
                    <div className={`ag-theme-dark ${classes.tableContainer}`}>
                        <GridTableEditor
                            apiPath={`dicomTag/sopInstanceUID/${sopInstanceUID}`}
                            externalUpdateRowApi={applyDicomTagOnStudy}
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
                    <Typography
                        sx={{ marginTop: '8px' }}
                        className={classes.header}
                        variant="subtitle1"
                        component="div"
                    >
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
