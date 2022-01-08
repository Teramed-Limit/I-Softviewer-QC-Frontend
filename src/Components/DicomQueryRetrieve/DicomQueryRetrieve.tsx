import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { ICellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { AxiosError } from 'axios';
import { useSetRecoilState } from 'recoil';

import { http } from '../../api/axios';
import { atomNotification } from '../../atoms/notification';
import { initQueryParams } from '../../atoms/study-query';
import { defaultQRQueryFields, define, qrQueryField } from '../../constant/setting-define';
import { useGridColDef } from '../../hooks/useGridColDef';
import { DicomQRResult } from '../../interface/dicom-dataset';
import { MessageType } from '../../interface/notification';
import { parseDicomTagResult } from '../../utils/dicom-utils';
import { isEmptyOrNil } from '../../utils/general';
import ConditionQuerier from '../ConditonQuerier/ConditionQuerier';
import GridTable from '../GridTable/GridTable';
import classes from './DicomQueryRetrieve.module.scss';
import '../../styles/ag-grid/ag-theme-custom-dark.scss';

interface QueryField {
    queryName: string;
    [prop: string]: string;
}

const DicomQueryRetrieve = () => {
    const setNotification = useSetRecoilState(atomNotification);
    const { dispatchCellEvent } = useGridColDef();
    const [queryPairData, setQueryPairData] = useState<QueryField>({ ...initQueryParams(qrQueryField), queryName: '' });
    const [rowData, setRowData] = useState<any[]>([]);
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const gridApiRef = useRef<GridApi | null>(null);
    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onValueChanged = (value: any, fieldId: string) => {
        setQueryPairData((data) => ({ ...data, [fieldId]: value }));
    };

    const invalidateQRRequest = useCallback(() => {
        return isEmptyOrNil(queryPairData.queryName);
    }, [queryPairData.queryName]);

    const onQuery = () => {
        if (invalidateQRRequest()) {
            setNotification({
                messageType: MessageType.Error,
                message: 'Query Target must be selected',
            });
            return;
        }

        gridApiRef.current?.showLoadingOverlay();
        http.get<DicomQRResult>(`searchDcmService/qrfind`, { params: { ...queryPairData } }).subscribe({
            next: (res) => {
                setRowData(parseDicomTagResult(res));
                gridApiRef.current?.hideOverlay();
            },
            error: () => {
                gridApiRef.current?.hideOverlay();
            },
        });
    };

    const onMoveStudy = useCallback(
        (param: ICellRendererParams) => {
            if (invalidateQRRequest()) {
                setNotification({
                    messageType: MessageType.Error,
                    message: 'Query Target must be selected',
                });
                return;
            }

            http.get(`searchDcmService/qrmove`, {
                params: {
                    patientId: param.data.patientID,
                    studyInstanceUID: param.data.studyInstanceUID,
                    queryName: queryPairData.queryName,
                },
            }).subscribe({
                next: () => {
                    setNotification({
                        messageType: MessageType.Success,
                        message: 'Retrieve study success.',
                    });
                },
                error: (err: AxiosError) => {
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        },
        [queryPairData.queryName, setNotification, invalidateQRRequest],
    );

    useEffect(() => {
        let mutateColDef: ColDef[] = [...define.qrStudy.colDef];
        mutateColDef = dispatchCellEvent(mutateColDef, 'retrieve', onMoveStudy);
        setColDefs(mutateColDef);
        gridApiRef.current?.setColumnDefs(mutateColDef);
    }, [dispatchCellEvent, onMoveStudy]);

    return (
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <ConditionQuerier
                fields={qrQueryField}
                defaultQueryFields={defaultQRQueryFields}
                queryPairData={queryPairData}
                onQuery={onQuery}
                onQueryPairDataChanged={onValueChanged}
            />
            <div className={`ag-theme-dark ${classes.tableContainer}`}>
                <GridTable checkboxSelect={false} columnDefs={colDefs} rowData={rowData} gridReady={gridReady} />
            </div>
        </Box>
    );
};

export default DicomQueryRetrieve;
