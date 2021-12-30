import React, { useCallback, useEffect, useRef, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { http } from '../../api/axios';
import { atomStudyQueryCondition, atomStudyQueryResult } from '../../atoms/study-query';
import ConditionQuerier from '../../Components/ConditonQuerier/ConditionQuerier';
import DicomQueryRetrieve from '../../Components/DicomQueryRetrieve/DicomQueryRetrieve';
import GridTable from '../../Components/GridTable/GridTable';
import { dbQueryField, defaultQueryFields, define } from '../../constant/setting-define';
import BaseModal from '../../Container/BaseModal/BaseModal';
import { dispatchCellEvent } from '../../utils/general';
import classes from './QualityControl.module.scss';

const QualityControl = () => {
    const history = useHistory();
    const [queryPairData, setQueryPairData] = useRecoilState(atomStudyQueryCondition);
    const [rowData, setRowData] = useRecoilState(atomStudyQueryResult);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const gridApiRef = useRef<GridApi | null>(null);
    const [openQRModal, setOpenQRModal] = useState(false);
    const [, setSelectedRow] = useState<any[]>([]);

    const onValueChanged = (value: any, fieldId: string) => {
        setQueryPairData((data) => ({ ...data, [fieldId]: value }));
    };

    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onQuery = () => {
        gridApiRef.current?.showLoadingOverlay();
        http.get(`dicomDbQuery`, { params: { ...queryPairData } }).subscribe({
            next: (res) => {
                setRowData(res.data);
                gridApiRef.current?.hideOverlay();
            },
            error: () => {
                gridApiRef.current?.hideOverlay();
            },
        });
    };

    const onAdvancedClick = useCallback(
        (param: ICellRendererParams) => {
            history.push({
                pathname: `/qualityControl/advanced/studies/studyInstanceUID/${param.data.studyInstanceUID}`,
                state: { patientId: param.data.patientId, patientName: param.data.patientName },
            });
        },
        [history],
    );

    const onViewerClick = useCallback(
        (param: ICellRendererParams) => {
            history.push({
                pathname: `/qualityControl/viewer/studies/studyInstanceUID/${param.data.studyInstanceUID}`,
            });
        },
        [history],
    );

    const onSelectionChanged = (gridApi: GridApi) => {
        setSelectedRow(gridApi.getSelectedRows());
    };

    const onNewStudy = () => history.push('/newStudy');

    useEffect(() => {
        let mutateColDef: ColDef[] = [...define.patientStudy.colDef];
        mutateColDef = dispatchCellEvent(mutateColDef, 'advanced', onAdvancedClick);
        mutateColDef = dispatchCellEvent(mutateColDef, 'patientId', onViewerClick);
        setColDefs(mutateColDef);
    }, [onViewerClick, onAdvancedClick]);

    return (
        <div className={classes.container}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px' }}>
                <Typography color="inherit" variant="h4" component="div">
                    Study List
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        className={classes.toolbarBtn}
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenQRModal(true)}
                    >
                        Query-Retrieve Study
                    </Button>
                    <Button
                        className={classes.toolbarBtn}
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={onNewStudy}
                    >
                        Import Study
                    </Button>
                </Stack>
            </Box>

            <ConditionQuerier
                fields={dbQueryField}
                defaultQueryFields={defaultQueryFields}
                queryPairData={queryPairData}
                onQuery={onQuery}
                onQueryPairDataChanged={onValueChanged}
            />
            <div className={`ag-theme-alpine ${classes.tableContainer}`}>
                <GridTable
                    checkboxSelect={false}
                    columnDefs={colDefs}
                    rowData={rowData}
                    onSelectionChanged={onSelectionChanged}
                    gridReady={gridReady}
                />
            </div>

            {/* <GridTableToolbar selectedRow={selectedRow} /> */}

            <BaseModal width="80%" height="80%" open={openQRModal} setOpen={setOpenQRModal}>
                <DicomQueryRetrieve />
            </BaseModal>
        </div>
    );
};

export default QualityControl;
