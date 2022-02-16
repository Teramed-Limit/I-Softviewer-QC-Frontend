import React, { useImperativeHandle, useRef, useState } from 'react';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AgReactComponent } from 'ag-grid-react/lib/interfaces';

import ConfirmModal from '../../../../Container/Modal/ConfirmModal/ConfirmModal';
import WithElementVisibility from '../../../../HOC/WithElementVisiblity/WithElementVisibility';
import { useDicomStudyQC } from '../../../../hooks/useDicomQC';
import { StudyQueryData } from '../../../../interface/study-query-data';

interface Props extends ICellRendererParams {
    label: string;
    value: string[];
    data: StudyQueryData;
}

type ConfirmModalHandle = React.ElementRef<typeof ConfirmModal>;

const QCChipCell = React.forwardRef<AgReactComponent, Props>((props, ref) => {
    const [isMerged] = useState(props.data?.merged || false);
    const [isMapped] = useState(props.data?.mapped || false);
    const [noQCOperation] = useState(!props.data?.merged && !props.data?.mapped);
    const { unMappingStudy, spiltStudy } = useDicomStudyQC();
    const unMappingModalRef = useRef<ConfirmModalHandle>(null);
    const spiltModalRef = useRef<ConfirmModalHandle>(null);

    useImperativeHandle(ref, () => ({
        getReactContainerStyle() {
            return {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            };
        },
    }));

    const onUnMapping = () => {
        unMappingStudy({
            patientId: props.data?.patientId,
            studyInstanceUID: props.data?.studyInstanceUID,
        });
    };

    const onSpilt = () => {
        spiltStudy({
            studyInstanceUID: props.data?.studyInstanceUID,
            afterSplitStudyToDeleteOldFiles: true,
        });
    };

    const rollBackComp = () => {
        return (
            <Tooltip title="Rollback">
                <AutorenewIcon
                    sx={{
                        color: ' rgba(0, 0, 0, 0.87) !important',
                        '& :hover': {
                            color: 'rgba(255, 255, 255) !important',
                        },
                    }}
                />
            </Tooltip>
        );
    };

    return (
        <Stack direction="row" spacing={1}>
            {noQCOperation && <Chip sx={{ width: '120px' }} label="Not Edited" />}
            {isMerged && (
                <>
                    <WithElementVisibility
                        wrappedComp={
                            <Chip
                                id="qcChipCell__chip-spilt"
                                sx={{ width: '120px' }}
                                label="Merged"
                                color="warning"
                                onDelete={() => spiltModalRef?.current?.openModal()}
                                deleteIcon={rollBackComp()}
                            />
                        }
                    />
                    <ConfirmModal
                        ref={spiltModalRef}
                        confirmMessage="Are you sure you want to spilt study?"
                        onConfirmCallback={onSpilt}
                    />
                </>
            )}
            {isMapped && (
                <>
                    <WithElementVisibility
                        wrappedComp={
                            <Chip
                                id="qcChipCell__chip-unmapping"
                                sx={{
                                    bgcolor: (theme) => theme.palette.primary.light,
                                    width: '120px',
                                }}
                                label="Mapped"
                                color="info"
                                onDelete={() => unMappingModalRef?.current?.openModal()}
                                deleteIcon={rollBackComp()}
                            />
                        }
                    />
                    <ConfirmModal
                        ref={unMappingModalRef}
                        confirmMessage="Are you sure you want to unmapping study?"
                        onConfirmCallback={onUnMapping}
                    />
                </>
            )}
        </Stack>
    );
});

export default QCChipCell;
