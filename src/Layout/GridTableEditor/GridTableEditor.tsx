import React, { useEffect } from 'react';

import { ColDef, RowNode } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AxiosObservable } from 'axios-observable';

import GridTable from '../../Components/GridTable/GridTable';
import SecondaryButton from '../../Components/SecondaryButton/SecondaryButton';
import { useGridTable } from '../../hooks/useGridTable';
import { FormDef } from '../../interface/form-define';
import classes from './GridTableEditor.module.scss';

interface Props {
    apiPath: string;
    externalUpdateRowApi?: (formData: any) => AxiosObservable<any>;
    enableApi?: boolean;
    filterRow?: boolean;
    identityId: string;
    subIdentityId?: string;
    colDef: ColDef[];
    formDef: FormDef;
    enableButtonBar?: boolean;
    enableEdit?: boolean;
    enableDelete?: boolean;
    initFormData: any;
    addCallBack?: () => void;
    updateCallBack?: () => void;
    deleteCallBack?: () => void;
    onSelectionChanged?: (gridApi: GridApi) => void;
    filterRowFunction?: (node: RowNode) => boolean;
    isFilterActivate?: () => boolean;
}

const GridTableEditor = ({
    apiPath,
    externalUpdateRowApi,
    enableApi = true,
    identityId,
    subIdentityId = '',
    filterRow = false,
    colDef,
    formDef,
    enableButtonBar = true,
    enableEdit = true,
    enableDelete = true,
    initFormData,
    deleteCallBack,
    addCallBack,
    updateCallBack,
    onSelectionChanged,
    filterRowFunction,
    isFilterActivate,
}: Props) => {
    const { gridApi, rowData, colDefs, getRowId, gridReady, openEditor, rendererFormEditor } = useGridTable<any[]>({
        formDef,
        externalUpdateRowApi,
        apiPath,
        enableApi,
        identityId,
        subIdentityId,
        colDef,
        deleteCallBack,
        addCallBack,
        updateCallBack,
        initFormData,
        enableEdit,
        enableDelete,
    });

    useEffect(() => {
        gridApi?.current?.onFilterChanged();
    }, [filterRow, gridApi]);

    return (
        <>
            <div className={`ag-theme-dark ${classes.gridContainer}`}>
                <div className={classes.buttonGroup}>
                    {enableButtonBar && (
                        <SecondaryButton
                            sx={{ width: 'auto' }}
                            variant="text"
                            onClick={() => openEditor(initFormData, 'add')}
                        >
                            Add Row
                        </SecondaryButton>
                    )}
                </div>
                <GridTable
                    rowSelection="single"
                    columnDefs={colDefs}
                    rowData={rowData || []}
                    gridReady={gridReady}
                    getRowId={getRowId}
                    onSelectionChanged={onSelectionChanged}
                    isFilterActivate={isFilterActivate}
                    filterRowFunction={filterRowFunction}
                />
            </div>
            {rendererFormEditor()}
        </>
    );
};

export default GridTableEditor;
