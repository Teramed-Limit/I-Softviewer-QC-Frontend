import React, { useCallback, useEffect, useRef, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { DateRange } from '@mui/lab/DateRangePicker/RangeTypes';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { useHistory } from 'react-router-dom';

import { http } from '../../api/axios';
import GridTable from '../../Components/GridTable/GridTable';
import GridTableToolbar from '../../Components/GridTableToolbar/GridTableToolbar';
import TransferList from '../../Components/TransferList/TransferList';
import { define, queryField } from '../../constant/setting-define';
import BaseModal from '../../Container/BaseModal/BaseModal';
import { EditorDefaultValue, EditorMapper } from '../../Layout/FormEditor/Editor/editorMapper';
import { dateToStr, dispatchCellEvent, isEmptyOrNil } from '../../utils/general';
import classes from './QualityControl.module.scss';

const allQueryCondIds = queryField.map((cond) => cond.field);
const defaultQueryCondIds = ['patientId', 'accessionNumber', 'modality', 'studyDate'];
const allQueryConds = queryField.filter((field) => defaultQueryCondIds.includes(field.field));

const QualityControl = () => {
    const history = useHistory();
    const gridApiRef = useRef<GridApi | null>(null);
    const [open, setOpen] = useState(false);
    const [queryCondition, setQueryCondition] = useState(allQueryConds);
    const [queryPairData, setQueryPairData] = useState({});
    const [selectedConditionIds, setSelectedConditionIds] = useState(defaultQueryCondIds);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [rowData, setRowData] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any[]>([]);

    const onValueChanged = (value: any, fieldId: string) => {
        setQueryPairData((data) => ({ ...data, [fieldId]: value }));
    };

    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onQuery = useCallback(() => {
        gridApiRef.current?.showLoadingOverlay();
        const queryParams = new URLSearchParams('');
        Object.entries(queryPairData).forEach(([key, value]) => {
            if (key === 'studyDate') {
                const dataRange = value as DateRange<Date>;
                if (isEmptyOrNil(dataRange[0]) || isEmptyOrNil(dataRange[1])) return;
                queryParams.append(key, `${dateToStr(dataRange[0])}-${dateToStr(dataRange[1])}`);
                return;
            }

            if (isEmptyOrNil(value)) return;
            queryParams.append(key, value as string);
        });

        http.get(`dicom/studies?${queryParams.toString()}`).subscribe((res) => {
            setRowData(res.data);
            gridApiRef.current?.hideOverlay();
        });
    }, [queryPairData]);

    const onQueryConditionChanged = (itemList: string[]) => {
        const queryConditions = queryField.filter((field) => !itemList.includes(field.field));
        setQueryCondition(queryConditions);
        setSelectedConditionIds(queryConditions.map((field) => field.field));
        setOpen(false);
    };

    const onSelectionChanged = (gridApi: GridApi) => {
        setSelectedRow(gridApi.getSelectedRows());
    };

    const onNewStudy = () => {
        history.push('/newStudy');
    };

    useEffect(() => {
        let mutateColDef: ColDef[] = [...define.patientStudy.colDef];
        mutateColDef = dispatchCellEvent(mutateColDef, 'advanced', (param: ICellRendererParams) =>
            history.push({
                pathname: `/qualityControl/advanced/studies/studyInstanceUID/${param.data.studyInstanceUID}`,
                state: {
                    patientId: param.data.patientId,
                    patientName: param.data.patientName,
                },
            }),
        );
        setColDefs(mutateColDef);
    }, [history]);

    useEffect(() => {
        onQuery();
    }, [onQuery]);

    return (
        <div className={classes.container}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px' }}>
                <Typography color="inherit" variant="h4" component="div">
                    Study List
                </Typography>
                <Button
                    className={classes.toolbarBtn}
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={onNewStudy}
                >
                    New Study
                </Button>
            </Box>

            <div className={classes.queryCondition}>
                <IconButton size="small" onClick={() => setOpen(true)}>
                    <SettingsIcon />
                </IconButton>
                {queryCondition.map((field) => {
                    const RenderComponent = EditorMapper[field.type];
                    const value = queryPairData[field.field] || EditorDefaultValue[field.type];

                    return (
                        <Box key={field.field} sx={{ flex: field.type === 'DataRange' ? 2 : 1 }}>
                            <RenderComponent field={field} value={value} isValid onValueChanged={onValueChanged} />
                        </Box>
                    );
                })}
                <Button variant="contained" color="primary" onClick={onQuery}>
                    Query
                </Button>
            </div>

            <div className={`ag-theme-alpine ${classes.tableContainer}`}>
                <GridTable
                    checkboxSelect={false}
                    columnDefs={colDefs}
                    rowData={rowData}
                    onSelectionChanged={onSelectionChanged}
                    gridReady={gridReady}
                />
            </div>

            <GridTableToolbar selectedRow={selectedRow} />

            <BaseModal width="auto" maxHeight="auto" open={open} setOpen={setOpen}>
                <TransferList
                    itemList={allQueryCondIds}
                    selectItemList={selectedConditionIds}
                    onTransferListChanged={onQueryConditionChanged}
                />
            </BaseModal>
        </div>
    );
};

export default QualityControl;
