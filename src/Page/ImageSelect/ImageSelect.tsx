import React, { useEffect, useRef, useState } from 'react';

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
import { format } from 'date-fns';
import { AiOutlineFieldNumber } from 'react-icons/all';
import { useHistory, useLocation } from 'react-router-dom';

import { http } from '../../api/axios';
import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import FileSelect from '../../Components/FileSelect/FileSelect';
import ConfirmModal from '../../Container/Modal/ConfirmModal/ConfirmModal';
import cornerstoneFileImageLoader from '../../cornerstone-extend/image-loader/cornerstoneFileImageLoader';
import { DicomFile, useDicomImport } from '../../hooks/useDicomImport';
import { useHttp } from '../../hooks/useHttp';
import { CreateAndModifyStudy, ImageBufferAndData } from '../../interface/create-and-modify-study-params';
import { CreateStudyParams } from '../../interface/study-params';
import classes from './ImageSelect.module.scss';

type MessageModalHandle = React.ElementRef<typeof ConfirmModal>;

const ImageSelect = () => {
    const location = useLocation<CreateStudyParams>();
    const history = useHistory();
    const { importJPG, importDcm } = useDicomImport();
    const { httpReq } = useHttp();
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [studyDate, setStudyDate] = useState<Date>(new Date());
    const [isDateError, setIsDateError] = useState<boolean>(false);
    const [imageFileList, setImageFileList] = useState<DicomFile[]>([]);
    const messageModalRef = useRef<MessageModalHandle>(null);

    useEffect(() => {
        if (!location.state) history.push('/');
    }, [history, location.state]);

    const onAddImageFile = (e) => {
        importJPG(e).subscribe((imageList: DicomFile[]) => {
            setImageFileList(imageList);
            cornerstoneFileImageLoader.fileManager.init();
            setImageIds(
                imageList.map((image, index) => cornerstoneFileImageLoader.fileManager.setFile(image.file, index)),
            );
        });
    };

    const onAddDicomFile = (e) => {
        importDcm(e).subscribe((dcmList: DicomFile[]) => {
            setImageFileList(dcmList);
            setImageIds(dcmList.map((dcm) => cornerstoneWADOImageLoader.wadouri.fileManager.add(dcm.file)));
        });
    };

    const createStudyData = (importFiles: DicomFile[]): CreateAndModifyStudy<ImageBufferAndData> => {
        return {
            patientInfo: {
                patientId: location?.state.patientId,
                patientsName: location?.state.patientName,
                patientsSex: location?.state.sex,
                patientsBirthDate: location?.state.birthdate,
                otherPatientNames: location?.state.otherPatientName,
            },
            studyInfo: [
                {
                    modality: importFiles[0].modality,
                    accessionNumber: location.state.accessionNum,
                    studyInstanceUID: location.state.studyInstanceUID,
                    studyDate: format(studyDate, 'yyyyMMdd'),
                    studyTime: format(studyDate, 'HHmmss'),
                },
            ],
            seriesInfo: [
                {
                    studyInstanceUID: location.state.studyInstanceUID,
                    seriesInstanceUID: location.state.seriesInstanceUID,
                    seriesDate: format(studyDate, 'yyyyMMdd'),
                    seriesTime: format(studyDate, 'HHmmss'),
                    seriesNumber: '1',
                },
            ],
            imageInfos: importFiles.map((file, index) => {
                return {
                    buffer: file.buffer,
                    type: file.type,
                    seriesInstanceUID: location.state.seriesInstanceUID,
                    sopInstanceUID: `${location.state.seriesInstanceUID}.${index + 1}`,
                    sopClassUID: file.sopClassUID,
                    imageNumber: `${index + 1}`,
                    imageDate: format(studyDate, 'yyyyMMdd'),
                    imageTime: format(studyDate, 'HHmmss'),
                };
            }),
        };
    };

    const onSaveToOwnPacs = () => {
        const studyData = createStudyData(imageFileList);
        httpReq(http.post('studyMaintenance', { ...studyData, sendOtherEnableNodes: false }));
    };

    const onSaveToAllEnablePacs = () => {
        const studyData = createStudyData(imageFileList);
        httpReq(http.post('studyMaintenance', { ...studyData, sendOtherEnableNodes: true }));
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
                        <Tooltip title="Study Date (MM/DD/YYYY)">
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
                        disabled={isDateError || imageFileList.length === 0}
                        variant="contained"
                        color="success"
                        onClick={onSaveToOwnPacs}
                        startIcon={<SaveIcon />}
                    >
                        Save Order
                    </Button>
                    <>
                        <Button
                            disabled={isDateError || imageFileList.length === 0}
                            variant="contained"
                            color="error"
                            onClick={() => messageModalRef?.current?.openModal()}
                            startIcon={<SendIcon />}
                        >
                            Send DICOM
                        </Button>
                        <ConfirmModal
                            ref={messageModalRef}
                            confirmMessage="Anything submitted to VNA will not be able to be edited or deleted. Are you sure to continue?"
                            onConfirmCallback={onSaveToAllEnablePacs}
                        />
                    </>
                </Stack>
            </Box>
            <DicomViewer imageIds={imageIds} />
        </Box>
    );
};

export default ImageSelect;
