import React, { useCallback, useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ColDef, ColumnApi, RowNode } from 'ag-grid-community';
import { ColumnState } from 'ag-grid-community/dist/lib/columns/columnModel';
import { GetRowIdParams } from 'ag-grid-community/dist/lib/entities/iCallbackParams';
import {
    FirstDataRenderedEvent,
    GridReadyEvent,
    SelectionChangedEvent,
    SortChangedEvent,
} from 'ag-grid-community/dist/lib/events';
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
    sortingOrder?: ColumnState[];
    onSelectionChanged?: (param) => void;
    onFirstDataRendered?: (param) => void;
    onSortChanged?: (param: SortChangedEvent) => void;
    rowSelection?: string;
    gridReady?: (gridReadyEvent: GridReadyEvent) => void;
    getRowId?: (params: GetRowIdParams) => string;
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
    sortingOrder,
    context,
    onSelectionChanged,
    onFirstDataRendered,
    onSortChanged,
    rowSelection = 'multiple',
    gridReady,
    getRowId,
    checkboxSelect = true,
    filterRowFunction,
    isFilterActivate,
}: TableProps) {
    const gridApi = useRef<GridApi | null>(null);
    const columnApi = useRef<ColumnApi | null>(null);

    const onGridReady = (params: GridReadyEvent) => {
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
        gridReady?.(params);
    };

    const handleFirstDataRendered = useCallback(
        (event: FirstDataRenderedEvent) => {
            const allColumnIds: string[] = [];
            event.columnApi.getAllColumns()?.forEach((column) => {
                if (!column.getColDef().cellRenderer) allColumnIds.push(column.getId());
            });
            // Apply auto size
            event.columnApi.autoSizeColumns(allColumnIds, false);
            // Apply sorting
            event.columnApi.applyColumnState({
                state: sortingOrder,
                defaultState: { sort: null },
            });
            onFirstDataRendered?.(event.api);
        },
        [onFirstDataRendered, sortingOrder],
    );

    const handleSelectionChanged = useCallback(
        (event: SelectionChangedEvent) => {
            onSelectionChanged?.(event.api);
        },
        [onSelectionChanged],
    );

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
            onFirstDataRendered={(event) => handleFirstDataRendered(event)}
            onSelectionChanged={(event) => handleSelectionChanged(event)}
            onSortChanged={(event) => onSortChanged?.(event)}
            getRowId={getRowId}
            context={context}
            alwaysMultiSort
        >
            {columnDefs.map((col, index) => (
                <AgGridColumn
                    headerName={col.headerName}
                    cellStyle={{ ...col.cellStyle, display: 'flex', alignCenter: 'center' }}
                    cellRenderer={frameworkComponents[col.cellRenderer]}
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
