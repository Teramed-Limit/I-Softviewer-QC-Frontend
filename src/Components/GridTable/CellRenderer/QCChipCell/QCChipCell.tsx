import React, { useRef, useState } from 'react';

import Stack from '@mui/material/Stack';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

import ConfirmModal from '../../../../Container/Modal/ConfirmModal/ConfirmModal';
import WithElementVisibility from '../../../../HOC/WithElementVisiblity/WithElementVisibility';
import { useDicomStudyQC } from '../../../../hooks/useDicomQC';
import { SVG } from '../../../../icon';
import { StudyQueryData } from '../../../../interface/study-query-data';
import SecondaryButton from '../../../SecondaryButton/SecondaryButton';

interface Props extends ICellRendererParams {
    label: string;
    value: string[];
    data: StudyQueryData;
}

type ConfirmModalHandle = React.ElementRef<typeof ConfirmModal>;

const QCChipCell = (props: Props) => {
    const [isMerged] = useState(props.data?.merged || false);
    const [isMapped] = useState(props.data?.mapped || false);
    const [noQCOperation] = useState(!props.data?.merged && !props.data?.mapped);
    const { unMappingStudy, spiltStudy } = useDicomStudyQC();
    const unMappingModalRef = useRef<ConfirmModalHandle>(null);
    const spiltModalRef = useRef<ConfirmModalHandle>(null);

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

    return (
        <Stack direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
            {noQCOperation && (
                <SecondaryButton
                    disabled
                    sx={{
                        '&:disabled': {
                            color: '#B6B6B6',
                            background: 'rgba(109, 109, 109, 0.2)',
                            border: '1px solid rgba(182, 182, 182, 0.2)',
                            opacity: '1',
                        },
                    }}
                >
                    Not Edited
                </SecondaryButton>
            )}
            {isMerged && (
                <>
                    <WithElementVisibility
                        wrappedComp={
                            <SecondaryButton
                                id="qcChipCell__chip-spilt"
                                variant="contained"
                                startIcon={<SVG.Spilt />}
                                onClick={() => spiltModalRef?.current?.openModal()}
                            >
                                Spilt
                            </SecondaryButton>
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
                            <SecondaryButton
                                id="qcChipCell__chip-unmapping"
                                variant="contained"
                                startIcon={<SVG.UnMapping />}
                                onClick={() => unMappingModalRef?.current?.openModal()}
                            >
                                UnMapping
                            </SecondaryButton>
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
};

export default QCChipCell;
