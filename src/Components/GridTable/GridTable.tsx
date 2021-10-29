import React, { useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

interface TableProps {
    columnDefs: ColDef[];
    rowData: any[];
    onSelectionChanged?: (param) => void;
    onFirstDataRendered?: (param) => void;
    rowSelection?: string;
}

function GridTable({
    columnDefs,
    rowData,
    onSelectionChanged,
    onFirstDataRendered,
    rowSelection = 'multiple',
}: TableProps) {
    const gridApi = useRef<GridApi | null>(null);

    const onGridReady = (params: GridReadyEvent) => (gridApi.current = params.api);

    return (
        <AgGridReact
            defaultColDef={{
                resizable: true,
            }}
            onGridReady={onGridReady}
            rowData={rowData}
            rowMultiSelectWithClick
            rowSelection={rowSelection}
            suppressRowClickSelection
            onFirstDataRendered={(event) => (onFirstDataRendered ? onFirstDataRendered(event.api) : null)}
            onSelectionChanged={(event) => (onSelectionChanged ? onSelectionChanged(event.api) : null)}
        >
            {columnDefs.map((col, index) => (
                <AgGridColumn
                    headerName={col.headerName}
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
