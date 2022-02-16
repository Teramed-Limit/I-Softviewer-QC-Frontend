import React, { useEffect, useRef, useState } from 'react';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { http } from '../../api/axios';
import CStoreNodeModal from '../../Container/Modal/CStoreNodeModal/CStoreNodeModal';
import MergeModal from '../../Container/Modal/MergeModal/MergeModal';
import WorklistModal from '../../Container/Modal/WorklistModal/WorklistModal';
import WithElementVisibility from '../../HOC/WithElementVisiblity/WithElementVisibility';
import { StudyQueryData } from '../../interface/study-query-data';

interface Props {
    selectedRow: StudyQueryData[];
}

type MergeModalHandle = React.ElementRef<typeof MergeModal>;
type WorklistModalHandle = React.ElementRef<typeof WorklistModal>;
type CStoreNodeModalHandle = React.ElementRef<typeof CStoreNodeModal>;

const GridTableToolbar = ({ selectedRow }: Props) => {
    const mergeModalRef = useRef<MergeModalHandle>(null);
    const worklistModalRef = useRef<WorklistModalHandle>(null);
    const storeNodeModalRef = useRef<CStoreNodeModalHandle>(null);

    const [studyDownloadUrl, setStudyDownloadUrl] = useState('');
    const downloadLinkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (selectedRow.length === 0) return;
        setStudyDownloadUrl(
            `${http.defaults.baseURL}/exportDicom/dcm/studyInstanceUID/${selectedRow[0].studyInstanceUID}`,
        );
    }, [selectedRow]);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {selectedRow.length} selected
                </Typography>

                <Stack sx={{ flex: 'none' }} direction="row" spacing={1}>
                    <WithElementVisibility
                        wrappedComp={
                            <Chip
                                id="qualityControlToolbar__chip-merge"
                                sx={{ minWidth: 120 }}
                                disabled={selectedRow.length !== 2}
                                label="Merge"
                                color="warning"
                                onClick={() => mergeModalRef?.current?.openModal()}
                            />
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <Chip
                                id="qualityControlToolbar__chip-mapping"
                                sx={{
                                    minWidth: 120,
                                    bgcolor: (theme) => theme.palette.primary.light,
                                }}
                                disabled={selectedRow.length !== 1}
                                label="Mapping"
                                color="info"
                                onClick={() => worklistModalRef?.current?.openModal()}
                            />
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <Button
                                id="qualityControlToolbar__button-sendPacs"
                                disabled={selectedRow.length === 0}
                                variant="contained"
                                color="error"
                                onClick={() => storeNodeModalRef?.current?.openModal()}
                                startIcon={<SendIcon />}
                            >
                                Send DICOM
                            </Button>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <Button
                                id="qualityControlToolbar__button-export"
                                disabled={selectedRow.length !== 1}
                                variant="contained"
                                color="success"
                                onClick={() => downloadLinkRef?.current?.click()}
                                startIcon={<FileDownloadIcon />}
                            >
                                Export
                                <a style={{ display: 'none' }} ref={downloadLinkRef} href={studyDownloadUrl} download>
                                    download
                                </a>
                            </Button>
                        }
                    />
                </Stack>
            </Box>

            {/* Merge modal */}
            <MergeModal ref={mergeModalRef} selectedRow={selectedRow} />

            {/* Mapping modal */}
            <WorklistModal ref={worklistModalRef} selectedRow={selectedRow} />

            {/* CStoreNode modal */}
            <CStoreNodeModal ref={storeNodeModalRef} selectedRow={selectedRow} />
        </>
    );
};

export default GridTableToolbar;
