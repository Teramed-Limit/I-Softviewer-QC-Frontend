import React, { useEffect, useRef, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CakeIcon from '@mui/icons-material/Cake';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import WcIcon from '@mui/icons-material/Wc';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Stack, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { format } from 'date-fns';
import { AiOutlineFieldNumber } from 'react-icons/ai';
import { FaHospital } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { filter, first, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { http } from '../../api/axios';
import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import FileSelect from '../../Components/FileSelect/FileSelect';
import FreeCreateSelection from '../../Components/FreeCreateSelection/FreeCreateSelection';
import PrimaryButton from '../../Components/PrimaryButton/PrimaryButton';
import ConfirmModal from '../../Container/Modal/ConfirmModal/ConfirmModal';
import cornerstoneFileImageLoader from '../../cornerstone-extend/image-loader/cornerstoneFileImageLoader';
import { useDicomDirImport } from '../../hooks/useDicomDirImport';
import { BufferType, DicomFile, useDicomImport } from '../../hooks/useDicomImport';
import { useHttp } from '../../hooks/useHttp';
import { CreateAndModifyStudy, ImageBufferAndData } from '../../interface/create-and-modify-study-params';
import { CreateStudyParams } from '../../interface/study-params';
import { StudyQueryData } from '../../interface/study-query-data';
import { isEmptyOrNil, strToDate } from '../../utils/general';
import classes from './ImageSelect.module.scss';

type MessageModalHandle = React.ElementRef<typeof ConfirmModal>;

const ImageSelect = () => {
    const location = useLocation();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down(1600));
    const state = location.state as CreateStudyParams;

    const navigate = useNavigate();
    const { importJPG, importDcm } = useDicomImport();
    const { importDicomDir } = useDicomDirImport();
    const { httpReq } = useHttp();
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [duplicateStudyQueryData, setDuplicateStudyQueryData] = useState<StudyQueryData[]>([]);
    const [studyDate, setStudyDate] = useState<Date>(new Date());
    const [isStudyDateDisabled, setStudyDateDisabled] = useState<boolean>(false);
    const [isDateError, setIsDateError] = useState<boolean>(false);
    const [institution, setInstitution] = useState<string>('');
    const [imageFileList, setImageFileList] = useState<DicomFile[]>([]);
    const messageModalRef = useRef<MessageModalHandle>(null);
    const duplicateModalRef = useRef<MessageModalHandle>(null);

    useEffect(() => {
        if (!state) navigate('/');
    }, [navigate, state]);

    const checkStudyIsDuplicated = (dcmList: DicomFile[]) => {
        const dcm = dcmList[0];
        return http
            .get<StudyQueryData[]>(`dicomDbQuery`, {
                params: {
                    patientId: state.patientId,
                    studyDate: dcm.studyDate,
                    modality: dcm.modality,
                },
            })
            .pipe(
                switchMap((res) => {
                    if (!isEmptyOrNil(res.data)) {
                        setDuplicateStudyQueryData(res.data);
                        return (duplicateModalRef.current as MessageModalHandle).openModal().pipe(
                            filter((isConfirm) => isConfirm),
                            map(() => dcmList),
                            first(),
                        );
                    }
                    return of(dcmList);
                }),
            );
    };

    const onAddImageFile = (e) => {
        importJPG(e).subscribe((imageList: DicomFile[]) => {
            setStudyDateDisabled(false);
            setImageFileList(imageList);
            cornerstoneFileImageLoader.fileManager.init();
            setImageIds(
                imageList.map((image, index) => cornerstoneFileImageLoader.fileManager.setFile(image.file, index)),
            );
        });
    };

    const onAddDicomFile = (e) => {
        importDcm(e)
            .pipe(switchMap((dcmList: DicomFile[]) => checkStudyIsDuplicated(dcmList)))
            .subscribe((dcmList: DicomFile[]) => {
                setStudyDate(strToDate(dcmList[0].studyDate as string));
                setStudyDateDisabled(true);
                setImageFileList(dcmList);
                setImageIds(dcmList.map((dcm) => cornerstoneWADOImageLoader.wadouri.fileManager.add(dcm.file)));
            });
    };

    const onAddDicomDir = (event) => {
        importDicomDir(event).subscribe((dicomDirectory) => {
            console.log(dicomDirectory);
            // const allStudyPayload: CreateAndModifyStudy<ImageBufferAndData>[] = [];
            // Patient
            // dicomDirectory.rootDirectoryRecordCollection.forEach((patient) => {
            //     const payload: CreateAndModifyStudy<ImageBufferAndData> = {
            //         patientInfo: {},
            //         studyInfo: [],
            //         seriesInfo: [],
            //         imageInfos: [],
            //     };
            //     payload.patientInfo = {
            //         patientId: state.patientId,
            //         patientsName: state.patientName,
            //         patientsSex: state.sex,
            //         patientsBirthDate: state.birthdate,
            //         otherPatientNames: state.otherPatientName,
            //     };
            //     // Study
            //     let studyIndex = 0;
            //     patient.lowerLevelDirectoryRecordCollection.forEach((study) => {
            //         studyIndex++;
            //         const studyInstanceUid = `${generateNewStudyInstanceUID()}.${studyIndex}`;
            //         payload.studyInfo?.push({
            //             patientId: state.patientId,
            //             studyInstanceUID: studyInstanceUid,
            //             studyDescription: customDescription((study as StudyDirectoryRecordNode).studyDescription),
            //         });
            //         // Series
            //         let seriesIndex = 0;
            //         study.lowerLevelDirectoryRecordCollection.forEach((series) => {
            //             seriesIndex++;
            //             const seriesInstanceUid = `${studyInstanceUid}.${seriesIndex}`;
            //             payload.seriesInfo?.push({
            //                 studyInstanceUID: studyInstanceUid,
            //                 seriesInstanceUID: seriesInstanceUid,
            //             });
            //             // Image
            //             let imageIdx = 0;
            //             series.lowerLevelDirectoryRecordCollection.forEach((image) => {
            //                 // grab file
            //                 const dcmFile = (image as ImageDirectoryRecordNode).referencedFileID;
            //                 imageIdx++;
            //                 const sopInstanceUID = `${seriesInstanceUid}.${imageIdx}`;
            //                 payload.imageInfos?.push({
            //                     buffer: filesArray.find(
            //                         (file) =>
            //                             file.webkitRelativePath === `${startFolder}/${dcmFile.replace(/\\/g, '/')}`,
            //                     ),
            //                     type: BufferType.dcm,
            //                     seriesInstanceUID: seriesInstanceUid,
            //                     sopInstanceUID: sopInstanceUID,
            //                 });
            //             });
            //         });
            //
            //         // Collect study
            //         allStudyPayload.push(payload);
            //     });
            // });
            // console.log(allStudyPayload);
            // http.post('studyMaintenance/withFile', { ...allStudyPayload[0], sendOtherEnableNodes: false }).subscribe();
        });
    };

    // CUHK custom study desc.
    const customDescription = (oriStudyDesc: string): string => {
        let addedCustomText = isEmptyOrNil(oriStudyDesc)
            ? `${institution}, ${state.patientId}`
            : `, ${institution}, ${state.patientId}`;

        if (isEmptyOrNil(institution)) addedCustomText = '';

        return oriStudyDesc.slice(0, 64 - addedCustomText.length) + addedCustomText;
    };

    const createStudyData = (importFiles: DicomFile[]): CreateAndModifyStudy<ImageBufferAndData> => {
        return {
            patientInfo: {
                patientId: state.patientId,
                patientsName: state.patientName,
                patientsSex: state.sex,
                patientsBirthDate: state.birthdate,
                otherPatientNames: state.otherPatientName,
            },
            studyInfo: [
                {
                    modality: importFiles[0].modality,
                    accessionNumber: state.accessionNum,
                    studyInstanceUID: state.studyInstanceUID,
                    studyDate:
                        importFiles[0].type === BufferType.bmp
                            ? format(studyDate, 'yyyyMMdd')
                            : importFiles[0].studyDate,
                    studyDescription: customDescription(importFiles[0].studyDescription),
                },
            ],
            seriesInfo: [
                {
                    studyInstanceUID: state.studyInstanceUID,
                    seriesInstanceUID: state.seriesInstanceUID,
                    seriesNumber: '1',
                },
            ],
            imageInfos: importFiles.map((file, index) => {
                return {
                    buffer: file.buffer,
                    type: file.type,
                    seriesInstanceUID: state.seriesInstanceUID,
                    sopInstanceUID: `${state.seriesInstanceUID}.${index + 1}`,
                    sopClassUID: file.sopClassUID,
                    imageNumber: `${index + 1}`,
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
        <Box className={classes.container}>
            {/* Header */}
            <Box className={classes.headerInfo} sx={{ flexDirection: matches ? 'column' : 'row' }}>
                <Stack
                    direction="column"
                    spacing={1}
                    sx={{ display: 'flex', flexDirection: 'column', marginBottom: matches ? '6px' : '0' }}
                >
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="Patient Id" placement="top">
                            <span className={classes.iconText}>
                                <ContactPageIcon /> {state?.patientId}
                            </span>
                        </Tooltip>
                        <Tooltip title="Accession Number" placement="top">
                            <span className={classes.iconText}>
                                <AiOutlineFieldNumber style={{ fontSize: '24px' }} /> {state?.accessionNum}
                            </span>
                        </Tooltip>
                        <Tooltip title="Study Date (MM/DD/YYYY)" placement="top">
                            <span className={classes.iconText}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        disabled={isStudyDateDisabled}
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
                        <Tooltip title="Institution" placement="top">
                            <span className={`${classes.iconText} ${classes.w350}`}>
                                <FaHospital />
                                <FreeCreateSelection
                                    type="Institution"
                                    value={institution}
                                    onChange={(value) => setInstitution(value)}
                                />
                            </span>
                        </Tooltip>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="Patient Name">
                            <span className={classes.iconText}>
                                <AccountCircleIcon /> {state?.patientName}
                            </span>
                        </Tooltip>
                        <Tooltip title="Birth">
                            <span className={classes.iconText}>
                                <CakeIcon /> {state?.birthdate}
                            </span>
                        </Tooltip>
                        <Tooltip title="Sex">
                            <span className={classes.iconText}>
                                <WcIcon /> {state?.sex}
                            </span>
                        </Tooltip>
                    </Stack>
                </Stack>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: 'center', justifyContent: matches ? 'start' : 'end', width: '100%' }}
                >
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
                    <FileSelect directory disabled={isDateError} label="Open DICOMDIR" onChange={onAddDicomDir} />
                </Stack>
            </Box>
            {/* DicomViewer */}
            <DicomViewer imageIds={imageIds} />
            {/* Footer */}
            <Box className={classes.footer}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'end', width: '100%' }}>
                    <PrimaryButton
                        disabled={isDateError || imageFileList.length === 0}
                        variant="contained"
                        onClick={onSaveToOwnPacs}
                        startIcon={<SaveIcon sx={{ fontSize: '24px' }} />}
                    >
                        Save Order
                    </PrimaryButton>
                    <>
                        <PrimaryButton
                            disabled={isDateError || imageFileList.length === 0}
                            variant="contained"
                            onClick={() => messageModalRef?.current?.openModal()}
                            startIcon={<SendIcon sx={{ fontSize: '24px' }} />}
                        >
                            Send DICOM
                        </PrimaryButton>
                        <ConfirmModal
                            ref={messageModalRef}
                            confirmMessage="Anything submitted to VNA will not be able to be edited or deleted. Are you sure to continue?"
                            onConfirmCallback={onSaveToAllEnablePacs}
                        />
                    </>
                </Stack>
            </Box>
            {/* Duplicate warning modal */}
            <ConfirmModal
                ref={duplicateModalRef}
                confirmMessage="The study has been duplicated, do you still want to continue?"
                onConfirmCallback={() => {}}
            >
                <Typography variant="h4" gutterBottom component="div">
                    Duplicate Study:
                </Typography>
                <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                    {duplicateStudyQueryData.map((study, index) => {
                        return (
                            <Link
                                style={{ color: 'red' }}
                                to={`/qualityControl/viewer/studies/studyInstanceUID/${study.studyInstanceUID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {index + 1}. {study.patientId} - Click to redirect
                            </Link>
                        );
                    })}
                </Stack>
            </ConfirmModal>
        </Box>
    );
};

export default ImageSelect;
