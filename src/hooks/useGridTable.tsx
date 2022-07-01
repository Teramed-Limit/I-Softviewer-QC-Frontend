import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ColDef, ColumnApi } from 'ag-grid-community';
import { GetRowIdParams } from 'ag-grid-community/dist/lib/entities/iCallbackParams';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AxiosError, AxiosResponse } from 'axios';
import { AxiosObservable } from 'axios-observable';
import { useSetRecoilState } from 'recoil';

import { http } from '../api/axios';
import { loading } from '../atoms/loading';
import { atomNotification } from '../atoms/notification';
import BaseModal from '../Container/BaseModal/BaseModal';
import { FormDef } from '../interface/form-define';
import { MessageType } from '../interface/notification';
import FormEditor from '../Layout/FormEditor/FormEditor';
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
    // base api scheme, corresponds to backend api controller
    apiPath: string;
    // if api has different format, user can define their own api path
    externalUpdateRowApi?: (formData: any) => AxiosObservable<any>;
    // use prop `enable` to control whether to get row data when the component renders
    enableApi: boolean;
    // following restapi
    // Create(Post) : {apiPath}/{identityId} e.g. api/role/name
    // Read(Get)   : {apiPath}/{identityId} e.g. api/role/name
    // Update(Post) : {apiPath}/{identityId}/{row identityId of value} e.g. api/role/name/admin
    // Delete(Delete) : {apiPath}/{identityId}/{row identityId of value} e.g. api/role/name/admin
    // each row of unique id and apiPath CRUD
    identityId: string;
    // use `subIdentityId` if `identityId` is not
    subIdentityId: string;
    // define of grid cell
    colDef: ColDef[];
    // define of form editor
    formDef: FormDef;
    // init form data when insert new row
    initFormData: T;
    // edit button cell visibility
    enableEdit: boolean;
    // delete button cell visibility
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
    const gridApi = useRef<GridApi>();
    const columnApi = useRef<ColumnApi>();
    const setNotification = useSetRecoilState(atomNotification);
    const [, setFormIsValid] = useState(false);
    const [open, setOpen] = useState(false);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const [editFormData, setEditFormData] = useState<T>(initFormData);
    const [saveType, setSaveType] = useState<string>('add');
    const [rowData, setRowData] = useState([]);
    const setLoading = useSetRecoilState(loading);

    // get initial rowdata from api
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

    // use prop `enable` to control whether to get row data when the component renders
    useEffect(() => {
        if (!enableApi) return;
        const subscription = getRowData();
        return subscription.unsubscribe;
    }, [apiPath, enableApi, getRowData, setNotification]);

    // open form editor and initialize
    const openEditor = useCallback((formData, type: string) => {
        setEditFormData(formData);
        setOpen(true);
        setSaveType(type);
    }, []);

    // each row of unique id, use on ag-grid grid rowdata CRUD, Filter etc...
    const getRowId = useCallback(
        (params: GetRowIdParams) => {
            if (!isEmptyOrNil(subIdentityId)) {
                return `${params.data[identityId]}_${params.data[subIdentityId]}`;
            }

            return params.data[identityId];
        },
        [identityId, subIdentityId],
    );

    // delete row api
    const deleteRow = useCallback(
        (cellRendererParams: ICellRendererParams) => {
            setLoading(true);
            const id = cellRendererParams.data[identityId];
            http.delete(`${apiPath}/${identityId}/${id}`).subscribe({
                next: () => {
                    gridApi?.current?.applyTransaction({ remove: [cellRendererParams.data] });
                    deleteCallBack?.();
                    setLoading(false);
                },
                error: (err) => {
                    setLoading(false);
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        },
        [apiPath, deleteCallBack, identityId, setLoading, setNotification],
    );

    // insert row api
    const addRow = useCallback(
        (formData) => {
            setLoading(true);
            http.post(`${apiPath}/${identityId}`, formData).subscribe({
                next: () => {
                    setOpen(false);
                    setEditFormData(initFormData);
                    gridApi?.current?.applyTransaction({ add: [formData], addIndex: 0 });
                    addCallBack?.();
                    setLoading(false);
                },
                error: (err) => {
                    setLoading(false);
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        },
        [apiPath, identityId, initFormData, addCallBack, setLoading, setNotification],
    );

    // update row api
    const updateRow = useCallback(
        (formData) => {
            setLoading(true);
            const requestObs = externalUpdateRowApi
                ? externalUpdateRowApi(formData)
                : http.post(`${apiPath}/${identityId}/${formData[identityId]}`, formData);

            requestObs.subscribe({
                next: () => {
                    setOpen(false);
                    setEditFormData(initFormData);
                    gridApi?.current?.applyTransaction({ update: [formData] });
                    const rowNode = gridApi?.current?.getRowNode(
                        getRowId({
                            level: 0,
                            api: gridApi.current,
                            columnApi: columnApi.current,
                            context: undefined,
                            data: formData,
                        } as GetRowIdParams),
                    );
                    if (!rowNode) return;
                    gridApi?.current?.refreshCells({ force: true, rowNodes: [rowNode] });
                    updateCallBack?.();
                    setLoading(false);
                },
                error: (err) => {
                    setLoading(false);
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        },
        [
            apiPath,
            externalUpdateRowApi,
            getRowId,
            identityId,
            initFormData,
            setLoading,
            setNotification,
            updateCallBack,
        ],
    );

    // dispatch edit event and delete event on cell button
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

    // callback when ag-grid all api are available
    const gridReady = (params: GridReadyEvent) => {
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
    };

    const updateFormData = useCallback((fieldId: string, value: string) => {
        setEditFormData((data) => ({ ...data, [fieldId]: value }));
    }, []);

    // component of form editor
    const rendererFormEditor = (): JSX.Element => {
        return (
            <BaseModal
                width="80%"
                maxHeight="80%"
                open={open}
                setOpen={setOpen}
                footer={{
                    actionHandler: () => (saveType === 'add' ? addRow(editFormData) : updateRow(editFormData)),
                }}
            >
                <FormEditor
                    saveType={saveType}
                    formDef={formDef}
                    formData={editFormData}
                    formDataChanged={updateFormData}
                    formInvalidChanged={setFormIsValid}
                />
            </BaseModal>
        );
    };

    return {
        gridApi,
        rowData,
        colDefs,
        openEditor,
        getRowId,
        gridReady,
        rendererFormEditor,
    };
};
