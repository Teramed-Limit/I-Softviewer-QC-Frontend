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
import { ImFolderOpen } from 'react-icons/im';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { concatMap, filter, first, from, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { http } from '../../api/axios';
import { loading, progressStatus } from '../../atoms/loading';
import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import FileSelect from '../../Components/FileSelect/FileSelect';
import FreeCreateSelection from '../../Components/FreeCreateSelection/FreeCreateSelection';
import PrimaryButton from '../../Components/PrimaryButton/PrimaryButton';
import ConfirmModal from '../../Container/Modal/ConfirmModal/ConfirmModal';
import DicomDirectoryModal from '../../Container/Modal/DicomDirectoryModal/DicomDirectoryModal';
import cornerstoneFileImageLoader from '../../cornerstone-extend/image-loader/cornerstoneFileImageLoader';
import { BufferType, DicomFile, useDicomImport } from '../../hooks/useDicomImport';
import { useHttp } from '../../hooks/useHttp';
import { CreateAndModifyStudy, ImageBufferAndData } from '../../interface/create-and-modify-study-params';
import { RootRecord } from '../../interface/dicom-directory-record';
import { CreateStudyParams } from '../../interface/study-params';
import { StudyQueryData } from '../../interface/study-query-data';
import { isEmptyOrNil, strToDate } from '../../utils/general';
import classes from './ImageSelect.module.scss';

type MessageModalHandle = React.ElementRef<typeof ConfirmModal>;
type DicomDirModalHandle = React.ElementRef<typeof DicomDirectoryModal>;

const ImageSelect = () => {
    const setProgressStatus = useSetRecoilState(progressStatus);
    const setLoading = useSetRecoilState(loading);
    const location = useLocation();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down(1600));
    const state = location.state as CreateStudyParams;

    const navigate = useNavigate();
    const { importJPG, importDcm } = useDicomImport();

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
    const dicomDirectoryModalRef = useRef<DicomDirModalHandle>(null);

    useEffect(() => {
        if (!state) navigate('/');
    }, [navigate, state]);

    const checkStudyIsDuplicated = (compareStudyDate, compareModality, returnResult) => {
        return http
            .get<StudyQueryData[]>(`dicomDbQuery`, {
                params: {
                    patientId: state.patientId,
                    studyDate: compareStudyDate,
                    modality: compareModality,
                },
            })
            .pipe(
                switchMap((res) => {
                    if (!isEmptyOrNil(res.data)) {
                        setDuplicateStudyQueryData(res.data);
                        return (duplicateModalRef.current as MessageModalHandle).openModal().pipe(
                            first(),
                            filter((isConfirm) => isConfirm),
                            map(() => returnResult),
                        );
                    }
                    return of(returnResult);
                }),
            );
    };

    const onAddImageFile = (e) => {
        if (!e.target.files.length) return;
        const files = e?.target?.files as File[];
        importJPG(files).subscribe((imageList: DicomFile[]) => {
            setStudyDateDisabled(false);
            setImageFileList(imageList);
            cornerstoneFileImageLoader.fileManager.init();
            setImageIds(
                imageList.map((image, index) => cornerstoneFileImageLoader.fileManager.setFile(image.file, index)),
            );
        });
    };

    const onAddDicomFile = (e) => {
        if (!e.target.files.length) return;
        const files = e?.target?.files as File[];
        importDcm(files)
            .pipe(
                switchMap((dcmList: DicomFile[]) =>
                    checkStudyIsDuplicated(dcmList[0].studyDate, dcmList[0].modality, dcmList),
                ),
            )
            .subscribe((dcmList: DicomFile[]) => {
                setStudyDate(strToDate(dcmList[0].studyDate as string));
                setStudyDateDisabled(true);
                setImageFileList(dcmList);
                setImageIds(dcmList.map((dcm) => cornerstoneWADOImageLoader.wadouri.fileManager.add(dcm.file)));
            });
    };

    // CUHK custom study desc.
    const customDescription = (oriStudyDesc: string): string => {
        let addedCustomText;

        if (isEmptyOrNil(institution))
            addedCustomText = isEmptyOrNil(oriStudyDesc) ? `${state.patientId}` : `, ${state.patientId}`;
        else
            addedCustomText = isEmptyOrNil(oriStudyDesc)
                ? `${institution}, ${state.patientId}`
                : `, ${institution}, ${state.patientId}`;

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
        setLoading(true);
        const studyData = createStudyData(imageFileList);
        httpReq(http.post('studyMaintenance', { ...studyData, sendOtherEnableNodes: false }));
    };

    const onSaveToAllEnablePacs = () => {
        setLoading(true);
        const studyData = createStudyData(imageFileList);
        httpReq(http.post('studyMaintenance', { ...studyData, sendOtherEnableNodes: true }));
    };

    const onSaveDicomDirToPacs = (selectedStudiesFormData: FormData[], rootRecord: RootRecord) => {
        const modifyTag: Record<string, string>[] = [
            { '0010,0010': state.patientName },
            { '0010,0020': state.patientId },
            { '0010,0030': state.birthdate },
            { '0010,0040': state.sex },
            { '0010,1001': state.otherPatientName },
            { '0008,0050': state.accessionNum },
            { '0008,1030': customDescription(rootRecord.lowerLevelRecords[0].lowerLevelRecords[0].studyDescription) },
        ];

        const studyRecord = rootRecord.lowerLevelRecords[0].lowerLevelRecords[0];
        const seriesRecord = rootRecord.lowerLevelRecords[0].lowerLevelRecords[0].lowerLevelRecords[0];
        const sendPacs$ = checkStudyIsDuplicated(studyRecord.studyDate, seriesRecord.modality, null).pipe(
            concatMap(() => from(selectedStudiesFormData)),
            concatMap((formData) => {
                setLoading(true);
                formData.append('ModifyTag', JSON.stringify(modifyTag));
                formData.append('NewInstanceUid', '1');
                return http.post('studyMaintenance/dicomDir', formData, {
                    onUploadProgress: (progressEvent) => {
                        const progressValue = (progressEvent.loaded / progressEvent.total) * 100;
                        setProgressStatus({
                            showProgress: true,
                            value: progressValue,
                            message:
                                progressValue === 100
                                    ? 'Processing files take a while please do not close the browser'
                                    : 'Uploading files...',
                        });
                    },
                });
            }),
        );

        httpReq(sendPacs$);
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
                    <PrimaryButton
                        size="small"
                        startIcon={<ImFolderOpen style={{ fontSize: '24px' }} />}
                        onClick={() => dicomDirectoryModalRef?.current?.openModal()}
                    >
                        <Typography variant="button" component="span">
                            Open DICOMDIR
                        </Typography>
                    </PrimaryButton>
                </Stack>
            </Box>
            {/* DicomViewer */}
            <DicomViewer imageIds={imageIds} />
            {/* Footer */}
            <Box className={classes.footer}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'end', width: '100%' }}>
                    <PrimaryButton
                        size="small"
                        disabled={isDateError || imageFileList.length === 0}
                        variant="contained"
                        onClick={onSaveToOwnPacs}
                        startIcon={<SaveIcon sx={{ fontSize: '24px' }} />}
                    >
                        <Typography variant="button" component="span">
                            Save Order
                        </Typography>
                    </PrimaryButton>
                    <>
                        <PrimaryButton
                            size="small"
                            disabled={isDateError || imageFileList.length === 0}
                            variant="contained"
                            onClick={() => messageModalRef?.current?.openModal()}
                            startIcon={<SendIcon sx={{ fontSize: '24px' }} />}
                        >
                            <Typography variant="button" component="span">
                                Send DICOM
                            </Typography>
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
            {/* Dicom Directory modal */}
            <DicomDirectoryModal ref={dicomDirectoryModalRef} onDicomDirPrepared={onSaveDicomDirToPacs} />
        </Box>
    );
};

export default ImageSelect;
