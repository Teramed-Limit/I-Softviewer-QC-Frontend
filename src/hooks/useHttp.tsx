import { useState } from 'react';

import { AxiosError, AxiosResponse } from 'axios';
import { AxiosObservable } from 'axios-observable/lib/axios-observable.interface';
import { useSetRecoilState } from 'recoil';

import { loading, progressStatus } from '../atoms/loading';
import { atomNotification } from '../atoms/notification';
import { MessageType } from '../interface/notification';

export interface HttpRequestOptions<T> {
    showNotification?: boolean;
    whenSuccess?: (data: T) => void;
    whenError?: (err: AxiosError) => void;
    successMessage?: string;
}

const defaultOptions = {
    showNotification: true,
};

export const useHttp = <T,>(
    options: HttpRequestOptions<T> = {
        showNotification: true,
    },
) => {
    const setNotification = useSetRecoilState(atomNotification);
    const setLoading = useSetRecoilState(loading);
    const setProgressStatus = useSetRecoilState(progressStatus);
    const [response, setResponse] = useState<T>();
    const [requestOptions] = useState({ ...defaultOptions, ...options });

    const httpReq = (request$: AxiosObservable<T>) => {
        const subscription = request$.pipe().subscribe({
            next: (res: AxiosResponse) => {
                setLoading(false);
                setProgressStatus({ showProgress: false, value: 0, message: '' });
                setResponse(res.data);
                requestOptions?.whenSuccess?.(res.data);
                if (requestOptions?.showNotification)
                    setNotification({
                        messageType: MessageType.Success,
                        message: requestOptions?.successMessage || 'Request success',
                    });
            },
            error: (err: AxiosError) => {
                setLoading(false);
                setProgressStatus({ showProgress: false, value: 0, message: '' });
                requestOptions?.whenError?.(err);
                setNotification({
                    messageType: MessageType.Error,
                    message: err.response?.data || 'Http request failed!',
                });
            },
        });

        return () => {
            subscription.unsubscribe();
        };
    };

    return { response, httpReq };
};
