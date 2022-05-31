import React, { useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { http } from '../../api/axios';
import CStoreNodeModal from '../../Container/Modal/CStoreNodeModal/CStoreNodeModal';
import MergeModal from '../../Container/Modal/MergeModal/MergeModal';
import WorklistModal from '../../Container/Modal/WorklistModal/WorklistModal';
import WithElementVisibility from '../../HOC/WithElementVisiblity/WithElementVisibility';
import { SVG } from '../../icon';
import { StudyQueryData } from '../../interface/study-query-data';
import SecondaryButton from '../SecondaryButton/SecondaryButton';

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
                <Box sx={{ flex: '1 1 100%' }} component="div">
                    <Typography sx={{ color: '#FF940F' }} variant="body1Bold" component="span">
                        {`${selectedRow.length}`}&nbsp;
                    </Typography>
                    <Typography variant="body1Bold" component="span">
                        selected
                    </Typography>
                </Box>

                <Stack sx={{ flex: 'none' }} direction="row" spacing={1}>
                    <WithElementVisibility
                        wrappedComp={
                            <SecondaryButton
                                id="qualityControlToolbar__chip-merge"
                                disabled={selectedRow.length !== 2}
                                startIcon={<SVG.Merge />}
                                onClick={() => mergeModalRef?.current?.openModal()}
                            >
                                Merge
                            </SecondaryButton>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <SecondaryButton
                                id="qualityControlToolbar__chip-mapping"
                                variant="contained"
                                disabled={selectedRow.length !== 1}
                                startIcon={<SVG.Mapping />}
                                onClick={() => worklistModalRef?.current?.openModal()}
                            >
                                Mapping
                            </SecondaryButton>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <SecondaryButton
                                id="qualityControlToolbar__button-sendPacs"
                                disabled={selectedRow.length === 0}
                                variant="contained"
                                onClick={() => storeNodeModalRef?.current?.openModal()}
                                startIcon={<SVG.Send />}
                            >
                                Send DICOM
                            </SecondaryButton>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <SecondaryButton
                                id="qualityControlToolbar__button-export"
                                variant="contained"
                                startIcon={<SVG.Export />}
                                disabled={selectedRow.length === 0}
                                onClick={() => downloadLinkRef?.current?.click()}
                            >
                                Export
                                <a style={{ display: 'none' }} ref={downloadLinkRef} href={studyDownloadUrl} download>
                                    download
                                </a>
                            </SecondaryButton>
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
