import * as React from 'react';
import { forwardRef, useRef, useState } from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem/TreeItem';
import TreeView from '@mui/lab/TreeView/TreeView';
import { Radio, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { useSetRecoilState } from 'recoil';
import { finalize } from 'rxjs';

import { loading } from '../../../atoms/loading';
import CornerstoneViewport from '../../../Components/CornerstoneViewport/CornerstoneViewport';
import FileSelect from '../../../Components/FileSelect/FileSelect';
import SecondaryButton from '../../../Components/SecondaryButton/SecondaryButton';
import { useDicomDirImport } from '../../../hooks/useDicomDirImport';
import { BaseModalHandle, useModal } from '../../../hooks/useModal';
import { CornerstoneViewportEvent, NewImageEvent } from '../../../interface/cornerstone-viewport-event';
import { RootRecord, SeriesRecord } from '../../../interface/dicom-directory-record';
import { isEmptyOrNil } from '../../../utils/general';
import BaseModal from '../../BaseModal/BaseModal';

interface TreeItemProps {
    uniqueKey: string;
    selectedValue?: string;
    label: string;
    caption: string;
    checkBox?: boolean;
    onCheck?: (e) => void;
}

const StyledTreeItem = ({ uniqueKey, selectedValue, label, caption, checkBox = false, onCheck }: TreeItemProps) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
            {checkBox && <Radio checked={selectedValue === uniqueKey} onChange={onCheck} value={uniqueKey} />}
            <Typography variant="body1" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                {label}
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    fontSize: '16px',
                    maxWidth: '250px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                color="inherit"
            >
                {caption}
            </Typography>
        </Box>
    );
};

interface Props {
    onSelectedStudyPreparedCallback: (rootRecord: RootRecord, studyInstanceUid: string) => void;
    onDicomDirSendCallback: (selectedStudiesFormData: FormData[]) => void;
}
const DicomDirectoryModal = forwardRef<BaseModalHandle, Props>((props, ref) => {
    const { parseDicomDir } = useDicomDirImport();
    const setLoading = useSetRecoilState(loading);
    const [dicomDirRecord, setDicomDirRecord] = useState<RootRecord>();
    const [fileLookup, setFileLookup] = useState<Record<string, File>>({});
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [selectedStudyInstanceUid, setSelectedStudyInstanceUid] = useState<string>('');
    const [isBtnDisable, setBtnDisable] = useState<boolean>(true);
    const [nodeExpanded, setNodeExpanded] = useState<string[]>([]);
    const { modalOpen, setModalOpen } = useModal(ref);
    const filesCache = useRef<Record<string, string>>({});

    const resetViewport = (event: CornerstoneViewportEvent<NewImageEvent>) => {
        cornerstone.reset(event.detail.element);
    };

    const onParseDicomDir = (event) => {
        setLoading(true);
        parseDicomDir(event)
            .pipe(finalize(() => setLoading(false)))
            .subscribe((res) => {
                const defaultExpandNodeIdList = res.dicomDirectoryRecord?.lowerLevelRecords.map(
                    (record) => record.patientId,
                );
                setNodeExpanded(defaultExpandNodeIdList);
                setDicomDirRecord(res.dicomDirectoryRecord);
                setFileLookup(res.fileLookup);
                // Clean up and reset state
                setImageIds([]);
                setBtnDisable(true);
                setSelectedStudyInstanceUid('');
                filesCache.current = {};
                cornerstoneWADOImageLoader.wadouri.fileManager.purge();
                setLoading(false);
            });
    };

    const onStudySelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!dicomDirRecord) return;
        setSelectedStudyInstanceUid(e.target.value);
        setBtnDisable(isEmptyOrNil(e.target.value));
        props.onSelectedStudyPreparedCallback(dicomDirRecord, e.target.value);
    };

    const onDisplayDicomImage = (series: SeriesRecord) => {
        const newImageIdList: string[] = [];
        series.lowerLevelRecords.forEach((image) => {
            if (filesCache.current[image.referencedFileID]) {
                newImageIdList.push(filesCache.current[image.referencedFileID]);
                return;
            }
            const newImageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileLookup[image.referencedFileID]);
            newImageIdList.push(newImageId);
            filesCache.current[image.referencedFileID] = newImageId;
        });
        setImageIds(newImageIdList);
    };

    const onPrepareFormData = (sendOtherEnableNodes: boolean) => {
        if (!dicomDirRecord) return;

        const selectedStudiesFormData: FormData[] = [];

        const form = new FormData();
        form.append('DicomDirRecord', JSON.stringify(dicomDirRecord));
        form.append('SendOtherEnableNodes', sendOtherEnableNodes ? '1' : '0');
        form.append('StudyInstanceUid', selectedStudyInstanceUid);

        dicomDirRecord?.imageReferenceFileLookup[selectedStudyInstanceUid].forEach((fileName) => {
            form.append('DicomFiles', fileLookup[fileName]);
        });
        selectedStudiesFormData.push(form);

        props.onDicomDirSendCallback(selectedStudiesFormData);
    };

    return (
        <BaseModal width="80%" maxHeight="80%" open={modalOpen} setOpen={setModalOpen}>
            <Stack direction="row" spacing={1}>
                <Stack direction="column" spacing={1}>
                    <FileSelect directory label="Select the directory with DICOMDIR" onChange={onParseDicomDir} />
                    <Box
                        sx={{
                            height: '400px',
                            width: '500px',
                            flexGrow: 1,
                            border: '2px #666060 solid',
                            backgroundColor: 'black',
                        }}
                    >
                        {dicomDirRecord && (
                            <TreeView
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                defaultExpanded={dicomDirRecord ? nodeExpanded : []}
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    overflowY: 'auto',
                                }}
                            >
                                {dicomDirRecord?.lowerLevelRecords.map((patient) => {
                                    return (
                                        <TreeItem
                                            key={patient.patientId}
                                            nodeId={patient.patientId}
                                            label={
                                                <StyledTreeItem
                                                    uniqueKey={patient.patientId}
                                                    label={patient.patientId}
                                                    caption={patient.patientName}
                                                />
                                            }
                                        >
                                            {patient?.lowerLevelRecords.map((study, stIndex) => {
                                                return (
                                                    <TreeItem
                                                        key={study.studyInstanceUID}
                                                        nodeId={study.studyInstanceUID}
                                                        label={
                                                            <StyledTreeItem
                                                                uniqueKey={study.studyInstanceUID}
                                                                checkBox
                                                                selectedValue={selectedStudyInstanceUid}
                                                                onCheck={onStudySelected}
                                                                label={`Study ${stIndex + 1}`}
                                                                caption={study.studyDescription}
                                                            />
                                                        }
                                                    >
                                                        {study?.lowerLevelRecords.map((series, seIndex) => {
                                                            return (
                                                                <TreeItem
                                                                    key={series.seriesInstanceUID}
                                                                    nodeId={series.seriesInstanceUID}
                                                                    label={
                                                                        <StyledTreeItem
                                                                            uniqueKey={series.seriesInstanceUID}
                                                                            label={`Series ${seIndex + 1}`}
                                                                            caption={series.modality}
                                                                        />
                                                                    }
                                                                    onClick={() => onDisplayDicomImage(series)}
                                                                ></TreeItem>
                                                            );
                                                        })}
                                                    </TreeItem>
                                                );
                                            })}
                                        </TreeItem>
                                    );
                                })}
                            </TreeView>
                        )}
                    </Box>
                </Stack>
                <Stack direction="column" spacing={1} sx={{ flexGrow: '1' }}>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ display: 'flex', alignItems: 'center', height: '44px' }}
                    >
                        Image Preview
                    </Typography>
                    <CornerstoneViewport
                        style={{
                            height: `${300}px`,
                            minHeight: `${300}px`,
                            flex: `1 1 auto`,
                            padding: '2px',
                            border: '2px #666060 solid',
                        }}
                        tools={[{ name: 'StackScrollMouseWheel', mode: 'active' }]}
                        imageIds={imageIds}
                        isPlaying={false}
                        frameRate={22}
                        viewPortIndex={0}
                        onNewImageCallBack={(event) => resetViewport(event)}
                    />
                </Stack>
            </Stack>
            <Stack direction="row-reverse" spacing={1} sx={{ mt: '6px' }}>
                <SecondaryButton
                    variant="contained"
                    color="primary"
                    disabled={isBtnDisable}
                    onClick={() => {
                        onPrepareFormData(true);
                    }}
                >
                    Save DICOM
                </SecondaryButton>
                <SecondaryButton
                    variant="contained"
                    color="primary"
                    disabled={isBtnDisable}
                    onClick={() => {
                        onPrepareFormData(false);
                    }}
                >
                    Send Order
                </SecondaryButton>

                <SecondaryButton
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        setModalOpen(false);
                    }}
                >
                    Close
                </SecondaryButton>
            </Stack>
        </BaseModal>
    );
});

export default DicomDirectoryModal;
