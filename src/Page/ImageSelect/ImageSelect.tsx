import React, { useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CakeIcon from '@mui/icons-material/Cake';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import WcIcon from '@mui/icons-material/Wc';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Button, Stack, TextField, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { DataSet } from 'dicom-parser';
import * as R from 'ramda';
import { AiOutlineFieldNumber } from 'react-icons/all';
import { useHistory, useLocation } from 'react-router-dom';

import { http } from '../../api/axios';
import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import FileSelect from '../../Components/FileSelect/FileSelect';
import cornerstoneFileImageLoader from '../../cornerstone-extend/image-loader/cornerstoneFileImageLoader';
import { useHttp } from '../../hooks/useHttp';
import {
    CreateAndModifyStudy,
    ImageBufferAndData,
    SeriesInfo,
    StudyInfo,
} from '../../interface/create-and-modify-study-params';
import { CreateStudyParams } from '../../interface/study-params';
import { hydrateDataset } from '../../utils/dicom-utils';
import { dateToStr, getExtension, toImageInfo } from '../../utils/general';
import classes from './ImageSelect.module.scss';

const BufferType = {
    '.dcm': 0,
    '.bmp': 1,
    '.jpg': 2,
    '.png': 3,
};

const ImageSelect = () => {
    const location = useLocation<CreateStudyParams>();
    const history = useHistory();
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [studyDate, setStudyDate] = useState<Date>(new Date());
    const [isDateError, setIsDateError] = useState<boolean>(false);
    const [createStudyData, setCreateStudyData] = useState<CreateAndModifyStudy<ImageBufferAndData>>({
        patientInfo: undefined,
        imageInfos: [],
        seriesInfo: [],
        studyInfo: [],
        sendOtherEnableNodes: false,
    });
    const { requestFun: onSaveToOwnPacs } = useHttp(
        http.post('studyMaintenance', { ...createStudyData, sendOtherEnableNodes: false }),
        { successMessage: 'Save study success' },
    );
    const { requestFun: onSaveToAllEnablePacs } = useHttp(
        http.post('studyMaintenance', { ...createStudyData, sendOtherEnableNodes: true }),
        { successMessage: 'Send images to PACS success' },
    );

    useEffect(() => {
        if (!location.state) history.push('/');
        setCreateStudyData({
            patientInfo: {
                patientId: location.state.patientId,
                patientsName: location.state.patientName,
                patientsSex: location.state.sex,
                patientsBirthDate: location.state.birthdate,
                otherPatientNames: location.state.otherPatientName,
            },
            studyInfo: [],
            seriesInfo: [],
            imageInfos: [],
            sendOtherEnableNodes: false,
        });
    }, [history, location.state]);

    const onAddImageFile = async (e) => {
        if (!e.target.files.length) return;

        const results: Promise<ImageBufferAndData>[] = [];

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files.item(i);
            const bufferType = BufferType[getExtension(file.name.toLowerCase())];
            results.push(
                toImageInfo(file, bufferType, location.state.seriesInstanceUID, '1.2.840.10008.5.1.4.1.1.7', i),
            );
        }

        const imageInfos = await Promise.all(results);

        setImageIds(cornerstoneFileImageLoader.fileManager.setSelectedFiles(e.target.files));
        setCreateStudyData((data) => ({
            ...data,
            studyInfo: [
                {
                    modality: 'SC',
                    accessionNumber: location.state.accessionNum,
                    studyInstanceUID: location.state.studyInstanceUID,
                    studyDate: dateToStr(studyDate),
                },
            ],
            seriesInfo: [
                {
                    studyInstanceUID: location.state.studyInstanceUID,
                    seriesInstanceUID: location.state.seriesInstanceUID,
                },
            ],
            imageInfos,
        }));
    };

    const onAddDicomFile = async (e) => {
        if (!e.target.files.length) return;

        const results: Promise<{ dcmDataset: DataSet; buffer: string }>[] = [];

        const initImageIds: any[] = [];

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files.item(i);
            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            initImageIds.push(imageId);
            results.push(hydrateDataset(file));
        }

        const datasetList = await Promise.all(results);

        const createStudy = {
            studyInfo: [] as StudyInfo[],
            seriesInfo: [] as SeriesInfo[],
            imageInfos: [] as ImageBufferAndData[],
        };

        datasetList.forEach(({ dcmDataset, buffer }, index) => {
            const sopClassUID = dcmDataset.string('x00080016');
            const modality = dcmDataset.string('x00080060');

            const addInstanceInfo = (key, value, list) => {
                const uid = R.path([key], value);
                const hasInstanceUID = R.filter(R.propEq(key, uid), list);
                if (hasInstanceUID.length === 0) {
                    list.push(value);
                }
            };

            const imageInfo: ImageBufferAndData = {
                sopInstanceUID: `${location.state.seriesInstanceUID}.${index + 1}`,
                seriesInstanceUID: location.state.seriesInstanceUID,
                sopClassUID,
                buffer,
                type: BufferType['.dcm'],
            };
            addInstanceInfo('sopInstanceUID', imageInfo, createStudy.imageInfos);

            const seriesInfo: SeriesInfo = {
                seriesInstanceUID: location.state.seriesInstanceUID,
                studyInstanceUID: location.state.studyInstanceUID,
            };
            addInstanceInfo('seriesInstanceUID', seriesInfo, createStudy.seriesInfo);

            const studyInfo: StudyInfo = {
                patientId: location.state.patientId,
                accessionNumber: location.state.accessionNum,
                studyInstanceUID: location.state.studyInstanceUID,
                studyDate: dateToStr(studyDate),
                modality,
            };
            addInstanceInfo('studyInstanceUID', studyInfo, createStudy.studyInfo);
        });

        setImageIds(initImageIds);
        setCreateStudyData((data) => ({ ...data, ...createStudy }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignContent: 'space-between', width: '100%', margin: '8px 0' }}>
                <Stack direction="column" spacing={1} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="Patient Id">
                            <span className={classes.iconText}>
                                <ContactPageIcon /> {location.state?.patientId}
                            </span>
                        </Tooltip>
                        <Tooltip title="Accession Number">
                            <span className={classes.iconText}>
                                <AiOutlineFieldNumber style={{ fontSize: '24px' }} /> {location.state?.accessionNum}
                            </span>
                        </Tooltip>
                        <Tooltip title="Study Date">
                            <span className={classes.iconText}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        views={['day']}
                                        value={studyDate}
                                        onChange={(newValue) => {
                                            if (newValue !== null) setStudyDate(newValue);
                                        }}
                                        InputProps={{
                                            classes: { root: classes.rowReverse },
                                        }}
                                        onError={(reason) => {
                                            if (reason) setIsDateError(true);
                                            else setIsDateError(false);
                                        }}
                                        renderInput={(params) => <TextField {...params} variant="standard" />}
                                    />
                                </LocalizationProvider>
                            </span>
                        </Tooltip>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="Patient Name">
                            <span className={classes.iconText}>
                                <AccountCircleIcon /> {location.state?.patientName}
                            </span>
                        </Tooltip>
                        <Tooltip title="Birth">
                            <span className={classes.iconText}>
                                <CakeIcon /> {location.state?.birthdate}
                            </span>
                        </Tooltip>
                        <Tooltip title="Sex">
                            <span className={classes.iconText}>
                                <WcIcon /> {location.state?.sex}
                            </span>
                        </Tooltip>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'end', width: '100%' }}>
                    <FileSelect
                        disabled={isDateError}
                        label="Open Image Files"
                        accept="image/bmp, image/png, image/jpeg"
                        onChange={onAddImageFile}
                    />
                    <FileSelect
                        disabled={isDateError}
                        label="Open DICOM Files"
                        accept=".dcm"
                        onChange={onAddDicomFile}
                    />
                    <Button
                        disabled={isDateError}
                        variant="contained"
                        color="success"
                        onClick={onSaveToOwnPacs}
                        startIcon={<SaveIcon />}
                    >
                        Save Order
                    </Button>
                    <Button
                        disabled={isDateError}
                        variant="contained"
                        color="error"
                        onClick={onSaveToAllEnablePacs}
                        startIcon={<SendIcon />}
                    >
                        Send DICOM
                    </Button>
                </Stack>
            </Box>
            <DicomViewer imageIds={imageIds} />
        </Box>
    );
};

export default ImageSelect;
