import { useCallback } from 'react';

import { ColDef } from 'ag-grid-community';

export const useGridColDef = () => {
    const dispatchCellEvent = useCallback(
        (colDefs: ColDef[], fieldId: string, clickEvent: (param) => void): ColDef[] => {
            const foundColDef = colDefs.find((col) => col.field === fieldId);
            if (foundColDef === undefined) {
                return colDefs;
            }

            foundColDef.cellRendererParams.clicked = clickEvent;
            return colDefs;
        },
        [],
    );

    const assignCellVisibility = useCallback(
        (colDefs: ColDef[], fieldId: string, checkAvailable: (compareId) => boolean): ColDef[] => {
            const foundColDef = colDefs.find((col) => col.field === fieldId);
            if (foundColDef === undefined || foundColDef.colId === undefined) {
                return colDefs;
            }

            foundColDef.hide = !checkAvailable(foundColDef.colId);
            return colDefs;
        },
        [],
    );

    return { dispatchCellEvent, assignCellVisibility };
};
