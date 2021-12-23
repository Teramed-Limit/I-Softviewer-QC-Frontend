import React, { useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, RowNode } from 'ag-grid-community';
import { GetRowNodeIdFunc } from 'ag-grid-community/dist/lib/entities/gridOptions';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import ButtonCell from './CellRenderer/ButtonCell/ButtonCell';
import CheckboxCell from './CellRenderer/CheckboxCell/CheckboxCell';
import ChipCell from './CellRenderer/ChipCell/ChipCell';
import DeleteRowCell from './CellRenderer/DeleteRowCell/DeleteRowCell';
import EditRowCell from './CellRenderer/EditRowCell/EditRowCell';
import LinkCell from './CellRenderer/LinkCell/LinkCell';
import QCChipCell from './CellRenderer/QCChipCell/QCChipCell';
import TagCell from './CellRenderer/TagCell/TagCell';
import XmlViewerCell from './CellRenderer/XmlViewerCell/XmlViewerCell';
import classes from './GridTable.module.scss';

interface TableProps {
    columnDefs: ColDef[];
    rowData: any[];
    context?: any;
    onSelectionChanged?: (param) => void;
    onFirstDataRendered?: (param) => void;
    rowSelection?: string;
    gridReady?: (gridReadyEvent: GridReadyEvent) => void;
    getRowNodeId?: GetRowNodeIdFunc;
    checkboxSelect?: boolean;
    filterRowFunction?: (node: RowNode) => boolean;
    isFilterActivate?: () => boolean;
}

const frameworkComponents = {
    tagRenderer: TagCell,
    checkboxRenderer: CheckboxCell,
    buttonRenderer: ButtonCell,
    editRowRenderer: EditRowCell,
    deleteRowRenderer: DeleteRowCell,
    chipRenderer: ChipCell,
    qcChipRenderer: QCChipCell,
    xmlViewerRenderer: XmlViewerCell,
    linkRenderer: LinkCell,
};

function GridTable({
    columnDefs,
    rowData,
    context,
    onSelectionChanged,
    onFirstDataRendered,
    rowSelection = 'multiple',
    gridReady,
    getRowNodeId,
    checkboxSelect = true,
    filterRowFunction,
    isFilterActivate,
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
            isExternalFilterPresent={isFilterActivate}
            doesExternalFilterPass={filterRowFunction}
            onGridReady={onGridReady}
            rowData={rowData}
            rowMultiSelectWithClick={checkboxSelect}
            rowSelection={rowSelection}
            frameworkComponents={frameworkComponents}
            onFirstDataRendered={(event) => (onFirstDataRendered ? onFirstDataRendered(event.api) : null)}
            onSelectionChanged={(event) => (onSelectionChanged ? onSelectionChanged(event.api) : null)}
            getRowNodeId={getRowNodeId}
            context={context}
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
                    pinned={col.pinned}
                    valueFormatter={col.valueFormatter}
                    headerCheckboxSelection={checkboxSelect && rowSelection === 'multiple' && index === 0}
                    checkboxSelection={checkboxSelect && rowSelection === 'multiple' && index === 0}
                    hide={col.hide}
                    flex={col.flex}
                    width={col.width}
                    minWidth={col.minWidth}
                />
            ))}
        </AgGridReact>
    );
}

export default GridTable;
