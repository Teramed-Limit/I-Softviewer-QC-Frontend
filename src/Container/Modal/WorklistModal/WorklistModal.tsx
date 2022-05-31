import * as React from 'react';
import { forwardRef, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';

import ConditionQuerier from '../../../Components/ConditonQuerier/ConditionQuerier';
import classes from '../../../Components/DicomQueryRetrieve/DicomQueryRetrieve.module.scss';
import GridTable from '../../../Components/GridTable/GridTable';
import { defaultWorklistQueryFields, define, worklistQueryFields } from '../../../constant/setting-define';
import { useDicomStudyQC } from '../../../hooks/useDicomQC';
import { useDicomQuery } from '../../../hooks/useDicomQuery';
import { BaseModalHandle, useModal } from '../../../hooks/useModal';
import { StudyQueryData } from '../../../interface/study-query-data';
import BaseModal from '../../BaseModal/BaseModal';

type WorklistModalProps = { selectedRow: StudyQueryData[] };

const WorklistModal = forwardRef<BaseModalHandle, WorklistModalProps>((props, ref) => {
    const gridApiRef = useRef<GridApi | null>(null);
    const { modalOpen, setModalOpen } = useModal(ref);
    const { mappingStudy } = useDicomStudyQC(() => setModalOpen(false));
    const { onQuery, onValueChanged, datasets, rowData, queryPairData } = useDicomQuery(
        'searchDcmService/worklist',
        gridApiRef,
    );
    const [colDefs] = useState<ColDef[]>(define.worklist.colDef);
    const [selectedMappingRowIdx, setSelectedMappingRowIdx] = useState<number | null>(null);

    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onGridRowSelect = (gridApi: GridApi) => {
        if (gridApi.getSelectedNodes().length === 0) {
            setSelectedMappingRowIdx(null);
            return;
        }

        setSelectedMappingRowIdx(gridApi.getSelectedNodes()[0].rowIndex);
    };

    const onMapping = () => {
        if (selectedMappingRowIdx === null) {
            return;
        }

        mappingStudy({
            dataset: datasets[selectedMappingRowIdx],
            patientId: props.selectedRow[0].patientId,
            studyInstanceUID: props.selectedRow[0].studyInstanceUID,
        });
    };

    return (
        <BaseModal
            width="80%"
            maxHeight="80%"
            height="100%"
            open={modalOpen}
            setOpen={setModalOpen}
            footer={{
                actionLabel: 'Mapping',
                actionHandler: onMapping,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    height: '100%',
                    flexDirection: 'column',
                    border: '2px solid #265568',
                    borderRadius: '6px',
                }}
            >
                <ConditionQuerier
                    fields={worklistQueryFields}
                    defaultQueryFields={defaultWorklistQueryFields}
                    queryPairData={queryPairData}
                    onQuery={onQuery}
                    onQueryPairDataChanged={onValueChanged}
                />
                <div className={`ag-theme-dark ${classes.tableContainer}`}>
                    <GridTable
                        checkboxSelect={false}
                        columnDefs={colDefs}
                        rowData={rowData}
                        gridReady={gridReady}
                        rowSelection="single"
                        onSelectionChanged={onGridRowSelect}
                    />
                </div>
            </Box>
        </BaseModal>
    );
});

export default WorklistModal;
