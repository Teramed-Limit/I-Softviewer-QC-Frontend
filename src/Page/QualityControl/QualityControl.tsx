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
import { atomStudyQueryCondition, atomStudyQueryResult, atomUpToDateQueryResult } from '../../atoms/study-query';
import ConditionQuerier from '../../Components/ConditonQuerier/ConditionQuerier';
import DicomQueryRetrieve from '../../Components/DicomQueryRetrieve/DicomQueryRetrieve';
import GridTable from '../../Components/GridTable/GridTable';
import GridTableToolbar from '../../Components/GridTableToolbar/GridTableToolbar';
import { dbQueryField, defaultQueryFields, define } from '../../constant/setting-define';
import BaseModal from '../../Container/BaseModal/BaseModal';
import WithElementVisibility from '../../HOC/WithElementVisiblity/WithElementVisibility';
import { useGridColDef } from '../../hooks/useGridColDef';
import { useRoleFunctionAvailable } from '../../hooks/useRoleFunctionAvailable';
import classes from './QualityControl.module.scss';

const QualityControl = () => {
    const history = useHistory();
    // query state management
    const [queryPairData, setQueryPairData] = useRecoilState(atomStudyQueryCondition);
    const [needRefreshQuery, setNeedRefreshQuery] = useRecoilState(atomUpToDateQueryResult);
    const [rowData, setRowData] = useRecoilState(atomStudyQueryResult);
    // function available
    const { checkAvailable } = useRoleFunctionAvailable();
    // dispatch event for cell event
    const { dispatchCellEvent, assignCellVisibility } = useGridColDef();
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [openQRModal, setOpenQRModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any[]>([]);
    const gridApiRef = useRef<GridApi | null>(null);

    const onValueChanged = (value: any, fieldId: string) => {
        setQueryPairData((data) => ({ ...data, [fieldId]: value }));
    };

    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onQuery = useCallback(() => {
        gridApiRef.current?.showLoadingOverlay();
        http.get(`dicomDbQuery`, { params: { ...queryPairData } }).subscribe({
            next: (res) => {
                setRowData(res.data);
                gridApiRef.current?.deselectAll();
                gridApiRef.current?.hideOverlay();
            },
            error: () => {
                gridApiRef.current?.hideOverlay();
            },
        });
    }, [queryPairData, setRowData]);

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
        mutateColDef = assignCellVisibility(mutateColDef, 'advanced', checkAvailable);
        setColDefs(mutateColDef);
    }, [onViewerClick, onAdvancedClick, checkAvailable, dispatchCellEvent, assignCellVisibility]);

    // triggering query to refresh (e.g. mapping, merge, qr)
    useEffect(() => {
        if (needRefreshQuery) {
            onQuery();
            setNeedRefreshQuery(false);
        }
    }, [needRefreshQuery, onQuery, setNeedRefreshQuery]);

    return (
        <div className={classes.container}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px' }}>
                <Typography color="inherit" variant="h4" component="div">
                    Study List
                </Typography>
                <Stack direction="row" spacing={1}>
                    <WithElementVisibility
                        wrappedComp={
                            <Button
                                id="qualityControl__button-qrStudy"
                                className={classes.toolbarBtn}
                                variant="contained"
                                color="secondary"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenQRModal(true)}
                            >
                                Query-Retrieve Study
                            </Button>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <Button
                                id="qualityControl__button-newStudy"
                                className={classes.toolbarBtn}
                                variant="contained"
                                color="secondary"
                                startIcon={<AddIcon />}
                                onClick={onNewStudy}
                            >
                                Import Study
                            </Button>
                        }
                    />
                </Stack>
            </Box>

            <ConditionQuerier
                fields={dbQueryField}
                defaultQueryFields={defaultQueryFields}
                queryPairData={queryPairData}
                onQuery={onQuery}
                onQueryPairDataChanged={onValueChanged}
            />

            <div className={`${classes.tableContainer} ag-theme-dark`}>
                <GridTable
                    checkboxSelect={false}
                    columnDefs={colDefs}
                    rowData={rowData}
                    onSelectionChanged={onSelectionChanged}
                    gridReady={gridReady}
                />
            </div>

            <GridTableToolbar selectedRow={selectedRow} />

            <BaseModal width="80%" height="80%" open={openQRModal} setOpen={setOpenQRModal}>
                <DicomQueryRetrieve />
            </BaseModal>
        </div>
    );
};

export default QualityControl;
