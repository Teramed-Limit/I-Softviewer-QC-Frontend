import { useCallback, useState } from 'react';

import { useSetRecoilState } from 'recoil';

import { http } from '../api/axios';
import { atomNotification } from '../atoms/notification';
import { initQueryParams } from '../atoms/study-query';
import { qrQueryField } from '../constant/setting-define';
import { DicomDataset, DicomQRResult } from '../interface/dicom-dataset';
import { MessageType } from '../interface/notification';
import { parseDicomTagResult } from '../utils/dicom-utils';
import { isEmptyOrNil } from '../utils/general';

export interface QueryField {
    queryName: string;
    [prop: string]: string;
}

export const useDicomQuery = (urlScheme: string, gridApiRef) => {
    const setNotification = useSetRecoilState(atomNotification);
    const [rowData, setRowData] = useState<any[]>([]);
    const [datasets, setDatasets] = useState<DicomDataset[][]>([]);
    const [queryPairData, setQueryPairData] = useState<QueryField>({ ...initQueryParams(qrQueryField), queryName: '' });

    const onValueChanged = (value: any, fieldId: string) => {
        setQueryPairData((data) => ({ ...data, [fieldId]: value }));
    };

    const validateQRRequest = useCallback(() => {
        return isEmptyOrNil(queryPairData.queryName);
    }, [queryPairData.queryName]);

    const onQuery = () => {
        if (validateQRRequest()) {
            setNotification({
                messageType: MessageType.Error,
                message: 'Query Target must be selected',
            });
            return;
        }

        gridApiRef.current?.showLoadingOverlay();
        http.get<DicomQRResult>(urlScheme, { params: { ...queryPairData } }).subscribe({
            next: (res) => {
                setRowData(parseDicomTagResult(res));
                setDatasets(res.data.datasets);
                gridApiRef.current?.hideOverlay();
            },
            error: (err) => {
                setNotification({
                    messageType: MessageType.Error,
                    message: err.response?.data || 'Http request failed!',
                });
                gridApiRef.current?.hideOverlay();
            },
        });
    };

    return { onQuery, onValueChanged, validateQRRequest, rowData, datasets, queryPairData };
};
