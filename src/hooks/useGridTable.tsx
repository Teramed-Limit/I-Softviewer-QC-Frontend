import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AxiosError, AxiosResponse } from 'axios';
import { AxiosObservable } from 'axios-observable';
import { useSetRecoilState } from 'recoil';

import { http } from '../api/axios';
import { atomNotification } from '../atoms/notification';
import BaseModal from '../Container/BaseModal/BaseModal';
import { FormDef } from '../interface/form-define';
import { MessageType } from '../interface/notification';
import FormEditor from '../Layout/FormEditor/FormEditor';
import classes from '../Layout/GridTableEditor/GridTableEditor.module.scss';
import { isEmptyOrNil } from '../utils/general';

export type DeleteRowClick = (cellRendererParams: ICellRendererParams) => void;
export type EditRowClick = (formData: any, type: string) => void;

const gridDeleteActionButton = (onClick: DeleteRowClick): ColDef[] => [
    {
        field: 'deleteAction',
        headerName: '',
        width: 40,
        cellStyle: { padding: 0 },
        cellRenderer: 'deleteRowRenderer',
        cellRendererParams: {
            onClick,
        },
    },
];

const gridEditActionButton = (onClick: EditRowClick): ColDef[] => [
    {
        field: 'editAction',
        headerName: '',
        width: 40,
        cellStyle: { padding: 0 },
        cellRenderer: 'editRowRenderer',
        cellRendererParams: {
            onClick,
        },
    },
];

interface Props<T> {
    formDef: FormDef;
    apiPath: string;
    externalUpdateRowApi?: (formData: any) => AxiosObservable<any>;
    enableApi: boolean;
    identityId: string;
    subIdentityId: string;
    colDef: ColDef[];
    initFormData: T;
    enableEdit: boolean;
    enableDelete: boolean;
    updateCallBack?: () => void;
    deleteCallBack?: () => void;
    addCallBack?: () => void;
}

export const useGridTable = <T,>({
    formDef,
    apiPath,
    externalUpdateRowApi,
    enableApi,
    identityId,
    subIdentityId,
    colDef,
    enableEdit,
    enableDelete,
    initFormData,
    addCallBack,
    updateCallBack,
    deleteCallBack,
}: Props<T>) => {
    const gridApi = useRef<GridApi | null>(null);
    const setNotification = useSetRecoilState(atomNotification);
    const [formIsValid, setFormIsValid] = useState(false);
    const [open, setOpen] = useState(false);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [editFormData, setEditFormData] = useState<T>(initFormData);
    const [saveType, setSaveType] = useState<string>('add');
    const [rowData, setRowData] = useState([]);

    const getRowData = useCallback(
        () =>
            http.get(apiPath).subscribe({
                next: (res: AxiosResponse) => {
                    setRowData(res.data);
                    gridApi?.current?.onFilterChanged();
                },
                error: (err: AxiosError) => {
                    setRowData([]);
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            }),
        [apiPath, setNotification],
    );

    useEffect(() => {
        if (!enableApi) return;
        const subscription = getRowData();
        return subscription.unsubscribe;
    }, [apiPath, enableApi, getRowData, setNotification]);

    const openEditor = useCallback((formData, type: string) => {
        setEditFormData(formData);
        setOpen(true);
        setSaveType(type);
    }, []);

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

    const addRow = useCallback(
        (formData) => {
            http.post(`${apiPath}/${identityId}`, formData).subscribe({
                next: () => {
                    setOpen(false);
                    setEditFormData(initFormData);
                    gridApi?.current?.applyTransaction({ add: [formData], addIndex: 0 });
                    addCallBack?.();
                },
            });
        },
        [apiPath, identityId, initFormData, addCallBack],
    );

    const updateRow = useCallback(
        (formData) => {
            const requestObs = externalUpdateRowApi
                ? externalUpdateRowApi(formData)
                : http.post(`${apiPath}/${identityId}/${formData[identityId]}`, formData);

            requestObs.subscribe({
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
        },
        [apiPath, externalUpdateRowApi, identityId, initFormData, updateCallBack],
    );

    useEffect(() => {
        let mutateColDef: ColDef[] = [...colDef];

        if (enableEdit) {
            mutateColDef = [...gridEditActionButton(openEditor), ...mutateColDef];
        }

        if (enableDelete) {
            mutateColDef = [...gridDeleteActionButton(deleteRow), ...mutateColDef];
        }

        setColDefs(mutateColDef);
    }, [colDef, deleteRow, enableDelete, enableEdit, openEditor]);

    const getRowNodeId = (data: T) => {
        if (!isEmptyOrNil(subIdentityId)) {
            return `${data[identityId]}_${data[subIdentityId]}`;
        }
        return data[identityId];
    };

    const gridReady = (params: GridReadyEvent) => (gridApi.current = params.api);

    const updateFormData = (fieldId: string, value: string) => {
        setEditFormData((data) => ({ ...data, [fieldId]: value }));
    };

    const rendererFormEditor = (): JSX.Element => {
        return (
            <BaseModal width="80%" maxHeight="80%" open={open} setOpen={setOpen}>
                <FormEditor
                    saveType={saveType}
                    formDef={formDef}
                    formData={editFormData}
                    formDataChanged={updateFormData}
                    formInvalidChanged={setFormIsValid}
                />
                <div className={classes.footer}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            setEditFormData(initFormData);
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!formIsValid}
                        variant="contained"
                        color="primary"
                        onClick={() => (saveType === 'add' ? addRow(editFormData) : updateRow(editFormData))}
                    >
                        Save
                    </Button>
                </div>
            </BaseModal>
        );
    };

    return {
        gridApi,
        rowData,
        colDefs,
        openEditor,
        getRowNodeId,
        gridReady,
        rendererFormEditor,
    };
};
