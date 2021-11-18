import React, { useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import { GetRowNodeIdFunc } from 'ag-grid-community/dist/lib/entities/gridOptions';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import ButtonCell from './CellRenderer/ButtonCell/ButtonCell';
import CheckboxCell from './CellRenderer/CheckboxCell/CheckboxCell';
import ChipCell from './CellRenderer/ChipCell/ChipCell';
import IconCell from './CellRenderer/IconCell/IconCell';
import classes from './GridTable.module.scss';

interface TableProps {
    columnDefs: ColDef[];
    rowData: any[];
    onSelectionChanged?: (param) => void;
    onFirstDataRendered?: (param) => void;
    rowSelection?: string;
    gridReady?: (gridReadyEvent: GridReadyEvent) => void;
    getRowNodeId?: GetRowNodeIdFunc;
}

const frameworkComponents = {
    checkboxRenderer: CheckboxCell,
    buttonRenderer: ButtonCell,
    chipRenderer: ChipCell,
    iconRenderer: IconCell,
};

function GridTable({
    columnDefs,
    rowData,
    onSelectionChanged,
    onFirstDataRendered,
    rowSelection = 'multiple',
    gridReady,
    getRowNodeId,
}: TableProps) {
    const gridApi = useRef<GridApi | null>(null);

    const onGridReady = (params: GridReadyEvent) => {
        gridApi.current = params.api;
        gridReady?.(params);
    };

    return (
        <AgGridReact
            className={classes.grid}
            defaultColDef={{
                resizable: true,
            }}
            onGridReady={onGridReady}
            rowData={rowData}
            rowMultiSelectWithClick
            rowSelection={rowSelection}
            frameworkComponents={frameworkComponents}
            onFirstDataRendered={(event) => (onFirstDataRendered ? onFirstDataRendered(event.api) : null)}
            onSelectionChanged={(event) => (onSelectionChanged ? onSelectionChanged(event.api) : null)}
            getRowNodeId={getRowNodeId}
        >
            {columnDefs.map((col, index) => (
                <AgGridColumn
                    headerName={col.headerName}
                    cellStyle={col.cellStyle}
                    cellRenderer={col.cellRenderer}
                    cellRendererParams={col.cellRendererParams}
                    key={col.field}
                    field={col.field}
                    sortable
                    resizable={col.resizable || true}
                    valueFormatter={col.valueFormatter}
                    headerCheckboxSelection={rowSelection === 'multiple' && index === 0}
                    checkboxSelection={rowSelection === 'multiple' && index === 0}
                    hide={col.hide}
                    flex={col.flex}
                    width={col.width}
                />
            ))}
        </AgGridReact>
    );
}

export default GridTable;
