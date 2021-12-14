import { useCallback, useEffect, useRef, useState } from 'react';

import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';

import { http } from '../api/axios';
import { dispatchCellEvent } from '../utils/general';
import { useHttp } from './useHttp';

const gridActionButtons = [
    {
        field: 'deleteAction',
        headerName: '',
        width: 40,
        cellStyle: { padding: 0 },
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
            clicked: () => {},
            type: 'clear',
            color: 'error',
        },
    },
    {
        field: 'editAction',
        headerName: '',
        width: 40,
        cellStyle: { padding: 0 },
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
            clicked: () => {},
            type: 'edit',
            color: 'primary',
        },
    },
];

interface Props<T> {
    apiPath: string;
    identityId: string;
    colDef: ColDef[];
    initFormData: T;
    updateCallBack?: () => void;
    deleteCallBack?: () => void;
    addCallBack?: () => void;
}

export const useGridTable = <T,>({
    apiPath,
    identityId,
    colDef,
    initFormData,
    addCallBack,
    updateCallBack,
    deleteCallBack,
}: Props<T>) => {
    const gridApi = useRef<GridApi | null>(null);
    const [open, setOpen] = useState(false);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [editFormData, setEditFormData] = useState<T>(initFormData);
    const [saveType, setSaveType] = useState<string>('add');

    const { response } = useHttp<T>(http.get(apiPath), {
        callOnComponentLoad: true,
        showNotification: false,
    });

    const deleteRow = useCallback(
        (cellRendererParams: ICellRendererParams) => {
            const id = cellRendererParams.data[identityId];
            http.delete(`${apiPath}/${identityId}/${id}`).subscribe({
                next: () => {
                    gridApi?.current?.applyTransaction({ remove: [cellRendererParams.data] });
                    deleteCallBack?.();
                },
            });
        },
        [apiPath, deleteCallBack, identityId],
    );

    const openEditor = useCallback((data: any, type: string) => {
        setEditFormData(data);
        setOpen(true);
        setSaveType(type);
    }, []);

    useEffect(() => {
        let mutateColDef: ColDef[] = [...gridActionButtons, ...colDef];
        mutateColDef = dispatchCellEvent(mutateColDef, 'editAction', (param) => openEditor(param.data, 'update'));
        mutateColDef = dispatchCellEvent(mutateColDef, 'deleteAction', (param) => deleteRow(param));
        setColDefs(mutateColDef);
    }, [colDef, deleteRow, openEditor]);

    const getRowNodeId = (data: T) => data[identityId];

    const gridReady = (params: GridReadyEvent) => (gridApi.current = params.api);

    const updateFormData = (fieldId: string, value: string) => {
        setEditFormData((data) => ({ ...data, [fieldId]: value }));
    };

    const saveRow = (eventType: string, formData: T) => {
        const addUser = () => {
            http.post(`${apiPath}/${identityId}`, formData).subscribe({
                next: () => {
                    setOpen(false);
                    setEditFormData(initFormData);
                    gridApi?.current?.applyTransaction({ add: [formData], addIndex: 0 });
                    addCallBack?.();
                },
            });
        };

        const updateUser = () => {
            http.post(`${apiPath}/${identityId}/${formData[identityId]}`, formData).subscribe({
                next: () => {
                    setOpen(false);
                    setEditFormData(initFormData);
                    gridApi?.current?.applyTransaction({ update: [formData] });
                    const rowNode = gridApi?.current?.getRowNode(formData[identityId]);
                    if (!rowNode) return;
                    gridApi?.current?.refreshCells({ force: true, rowNodes: [rowNode] });
                    updateCallBack?.();
                },
            });
        };

        return eventType === 'add' ? addUser() : updateUser();
    };

    return {
        gridApi,
        open,
        rowData: response,
        colDefs,
        editFormData,
        saveType,
        setOpen,
        setColDefs,
        setEditFormData,
        setSaveType,
        getRowNodeId,
        gridReady,
        updateFormData,
        saveRow,
        openEditor,
        deleteRow,
    };
};
