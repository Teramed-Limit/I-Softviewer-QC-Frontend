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
import { DicomFile, FileBuffer, ImageFile, useDicomImport } from '../../hooks/useDicomImport';
import { useHttp } from '../../hooks/useHttp';
import { CreateAndModifyStudy, ImageBufferAndData } from '../../interface/create-and-modify-study-params';
import { CreateStudyInfo } from '../../interface/create-study-info';
import { PatientRecord, RootRecord, SeriesRecord, StudyRecord } from '../../interface/dicom-directory-record';
import { HISStudyParams } from '../../interface/study-params';
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
    const hisPatientInfo = location.state as HISStudyParams;

    const navigate = useNavigate();
    const { importJPG, importDcm } = useDicomImport();

    const { httpReq } = useHttp();
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [duplicateStudyQueryData, setDuplicateStudyQueryData] = useState<StudyQueryData[]>([]);
    const [studyDate, setStudyDate] = useState<Date>(new Date());
    const [isStudyDateDisabled, setStudyDateDisabled] = useState<boolean>(false);
    const [isDateError, setIsDateError] = useState<boolean>(false);
    const [institutionValue, setInstitutionValue] = useState<string>('');
    const [institutionLabel, setInstitutionLabel] = useState<string>('');
    const [imageFileList, setImageFileList] = useState<FileBuffer[]>([]);
    const [createStudyInfo, setCreateStudyInfo] = useState<CreateStudyInfo>();
    const messageModalRef = useRef<MessageModalHandle>(null);
    const duplicateModalRef = useRef<MessageModalHandle>(null);
    const patientIdModalRef = useRef<MessageModalHandle>(null);
    const dicomDirectoryModalRef = useRef<DicomDirModalHandle>(null);

    useEffect(() => {
        if (!hisPatientInfo) navigate('/');
    }, [navigate, hisPatientInfo]);

    const checkDcmPatentIdIsEqualHISDocumentNumber = (patientId: string, documentNumber: string) => {
        if (patientId === documentNumber) {
            return of(true);
        } else {
            return (patientIdModalRef.current as MessageModalHandle).openModal().pipe(
                first(),
                filter((isConfirm) => isConfirm),
                map(() => true),
            );
        }
    };

    const checkStudyIsDuplicated = (selectStudyInfo: CreateStudyInfo) => {
        return http
            .get<StudyQueryData[]>(`dicomDbQuery`, {
                params: {
                    patientId: hisPatientInfo.patientId,
                    studyDate: selectStudyInfo.studyDate,
                    modality: selectStudyInfo.modality,
                },
            })
            .pipe(
                switchMap((res) => {
                    if (!isEmptyOrNil(res.data)) {
                        setDuplicateStudyQueryData(res.data);
                        return (duplicateModalRef.current as MessageModalHandle).openModal().pipe(
                            first(),
                            filter((isConfirm) => isConfirm),
                            map(() => true),
                        );
                    }
                    return of(true);
                }),
            );
    };

    const onAddImageFile = (e) => {
        if (!e.target.files.length) return;
        const files = e?.target?.files as File[];
        importJPG(files).subscribe((imageList: ImageFile[]) => {
            setStudyDateDisabled(false);
            setImageFileList(imageList);
            cornerstoneFileImageLoader.fileManager.init();
            setImageIds(
                imageList.map((image, index) => cornerstoneFileImageLoader.fileManager.setFile(image.file, index)),
            );
            setCreateStudyInfo({
                patientId: hisPatientInfo.patientId,
                sopClassUID: '1.2.840.10008.5.1.4.1.1.7',
                studyDate: format(studyDate, 'yyyyMMdd'),
                modality: 'SC',
                studyDescription: '',
            });
        });
    };

    const onAddDicomFile = (e) => {
        if (!e.target.files.length) return;
        const files = e?.target?.files as File[];
        importDcm(files).subscribe((dcmList: DicomFile[]) => {
            setStudyDate(strToDate(dcmList[0].dcmDataset.string('x00080020') as string));
            setStudyDateDisabled(true);
            setImageFileList(dcmList);
            setImageIds(dcmList.map((dcm) => cornerstoneWADOImageLoader.wadouri.fileManager.add(dcm.file)));
            setCreateStudyInfo({
                patientId: dcmList[0].dcmDataset.string('x00100020'),
                sopClassUID: dcmList[0].dcmDataset.string('x00080016'),
                studyDate: dcmList[0].dcmDataset.string('x00080020'),
                modality: dcmList[0].dcmDataset.string('x00080060'),
                studyDescription: dcmList[0].dcmDataset.string('x00081030'),
            });
        });
    };

    const onAddDicomDirStudy = (rootRecord: RootRecord, studyInstanceUid: string) => {
        let patientRecord: PatientRecord | undefined;
        let studyRecord: StudyRecord | undefined;
        rootRecord.lowerLevelRecords.forEach((patRecord) => {
            studyRecord = patRecord.lowerLevelRecords.find((stdRecord) => {
                patientRecord = patRecord;
                return stdRecord.studyInstanceUID === studyInstanceUid;
            });
        });
        if (!studyRecord || !patientRecord) return;
        debugger;
        const seriesRecord: SeriesRecord = studyRecord.lowerLevelRecords[0];
        setCreateStudyInfo({
            patientId: patientRecord.patientId,
            sopClassUID: '',
            studyDate: studyRecord.studyDate,
            modality: seriesRecord.modality,
            studyDescription: studyRecord.studyDescription,
        });
    };

    // CUHK custom study desc.
    const customDescription = (oriStudyDesc: string, episodeNo: string): string => {
        let addedCustomText;

        if (isEmptyOrNil(institutionValue))
            addedCustomText = isEmptyOrNil(oriStudyDesc) ? `${episodeNo}` : `, ${episodeNo}`;
        else
            addedCustomText = isEmptyOrNil(oriStudyDesc)
                ? `${institutionValue}, ${episodeNo}`
                : `, ${institutionValue}, ${episodeNo}`;

        return (oriStudyDesc || '').slice(0, 64 - addedCustomText.length) + addedCustomText;
    };

    const createStudyData = (
        importFiles: FileBuffer[],
        selectStudyInfo: CreateStudyInfo,
    ): CreateAndModifyStudy<ImageBufferAndData> => {
        return {
            patientInfo: {
                patientId: hisPatientInfo.patientId,
                patientsName: hisPatientInfo.patientName,
                patientsSex: hisPatientInfo.sex,
                patientsBirthDate: hisPatientInfo.birthdate,
                otherPatientNames: hisPatientInfo.otherPatientName,
            },
            studyInfo: [
                {
                    modality: selectStudyInfo.modality,
                    accessionNumber: hisPatientInfo.accessionNum,
                    studyInstanceUID: hisPatientInfo.studyInstanceUID,
                    studyDate: selectStudyInfo.studyDate,
                    studyDescription: customDescription(selectStudyInfo.studyDescription, hisPatientInfo.episodeNo),
                    // institution
                    customizedFields: [{ group: 8, elem: 128, value: institutionLabel }],
                },
            ],
            seriesInfo: [
                {
                    studyInstanceUID: hisPatientInfo.studyInstanceUID,
                    seriesInstanceUID: hisPatientInfo.seriesInstanceUID,
                    seriesNumber: '1',
                },
            ],
            imageInfos: importFiles.map((file, index) => {
                return {
                    buffer: file.buffer,
                    type: file.type,
                    seriesInstanceUID: hisPatientInfo.seriesInstanceUID,
                    sopInstanceUID: `${hisPatientInfo.seriesInstanceUID}.${index + 1}`,
                    sopClassUID: selectStudyInfo.sopClassUID,
                    imageNumber: `${index + 1}`,
                };
            }),
        };
    };

    const onSaveToPacs = (sendOtherEnableNodes: boolean) => {
        if (!createStudyInfo) return;
        httpReq(
            of(createStudyInfo).pipe(
                switchMap(() =>
                    checkDcmPatentIdIsEqualHISDocumentNumber(createStudyInfo.patientId, hisPatientInfo.patientId),
                ),
                switchMap(() => checkStudyIsDuplicated(createStudyInfo)),
                switchMap(() => {
                    setLoading(true);
                    const studyData = createStudyData(imageFileList, createStudyInfo);
                    return http.post('studyMaintenance', { ...studyData, sendOtherEnableNodes });
                }),
            ),
        );
    };

    const onSaveDicomDirToPacs = (selectedStudiesFormData: FormData[]) => {
        if (!createStudyInfo) return;

        const modifyTag: Record<string, string>[] = [
            { '0010,0010': hisPatientInfo.patientName },
            { '0010,0020': hisPatientInfo.patientId },
            { '0010,0030': hisPatientInfo.birthdate },
            { '0010,0040': hisPatientInfo.sex },
            { '0010,1001': hisPatientInfo.otherPatientName },
            { '0008,0050': hisPatientInfo.accessionNum },
            { '0008,1030': customDescription(createStudyInfo.studyDescription, hisPatientInfo.episodeNo) },
        ];

        const sendPacs$ = checkDcmPatentIdIsEqualHISDocumentNumber(
            createStudyInfo.patientId,
            hisPatientInfo.patientId,
        ).pipe(
            concatMap(() => checkStudyIsDuplicated(createStudyInfo)),
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
                                <ContactPageIcon /> {hisPatientInfo?.patientId}
                            </span>
                        </Tooltip>
                        <Tooltip title="Accession Number" placement="top">
                            <span className={classes.iconText}>
                                <AiOutlineFieldNumber style={{ fontSize: '24px' }} /> {hisPatientInfo?.accessionNum}
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
                                    value={institutionValue}
                                    onChange={(value, label) => {
                                        setInstitutionValue(value);
                                        setInstitutionLabel(label);
                                    }}
                                />
                            </span>
                        </Tooltip>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="Patient Name">
                            <span className={classes.iconText}>
                                <AccountCircleIcon /> {hisPatientInfo?.patientName}
                            </span>
                        </Tooltip>
                        <Tooltip title="Birth">
                            <span className={classes.iconText}>
                                <CakeIcon /> {hisPatientInfo?.birthdate}
                            </span>
                        </Tooltip>
                        <Tooltip title="Sex">
                            <span className={classes.iconText}>
                                <WcIcon /> {hisPatientInfo?.sex}
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
                        onClick={() => onSaveToPacs(false)}
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
                            onConfirmCallback={() => onSaveToPacs(true)}
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
                                key={study.studyInstanceUID}
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
            {/* PatientId not equal warning modal */}
            <ConfirmModal
                ref={patientIdModalRef}
                confirmMessage="The Patient ID of DICOM image does not equal to selected patient, do you want to continue?"
                onConfirmCallback={() => {}}
            >
                <Typography variant="h4" gutterBottom component="div">
                    DICOM image: {createStudyInfo?.patientId}
                </Typography>
                <Typography variant="h4" gutterBottom component="div">
                    Selected patient: {hisPatientInfo?.patientId}
                </Typography>
            </ConfirmModal>
            {/* Dicom Directory modal */}
            <DicomDirectoryModal
                ref={dicomDirectoryModalRef}
                onSelectedStudyPreparedCallback={onAddDicomDirStudy}
                onDicomDirSendCallback={onSaveDicomDirToPacs}
            />
        </Box>
    );
};

export default ImageSelect;
