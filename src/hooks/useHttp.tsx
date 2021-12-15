import { useCallback, useEffect, useRef, useState } from 'react';

import { AxiosError, AxiosResponse } from 'axios';
import { AxiosObservable } from 'axios-observable/lib/axios-observable.interface';
import { useSetRecoilState } from 'recoil';

import { atomNotification } from '../atoms/notification';
import { MessageType } from '../interface/notification';

export interface HttpRequestOptions<T> {
    callOnComponentLoad?: boolean;
    showNotification?: boolean;
    whenSuccess?: (data: T) => void;
    whenError?: (err: AxiosError) => void;
    successMessage?: string;
}

const defaultOptions = {
    callOnComponentLoad: false,
    showNotification: true,
};

export const useHttp = <T extends any>(
    request$: AxiosObservable<T>,
    options: HttpRequestOptions<T> = {
        callOnComponentLoad: false,
        showNotification: true,
    },
) => {
    const setNotification = useSetRecoilState(atomNotification);
    const [response, setResponse] = useState<T>();
    const [requestOptions] = useState({ ...defaultOptions, ...options });
    const [loading, setLoading] = useState(false);
    const loaded = useRef(false);

    const requestFun = useCallback(() => {
        setLoading(true);
        const subscription = request$.subscribe({
            next: (res: AxiosResponse) => {
                setLoading(false);
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
    }, [request$, requestOptions, setNotification]);

    useEffect(() => {
        if (!requestOptions?.callOnComponentLoad) return;
        if (loaded.current) return;
        loaded.current = true;
        requestFun();
    }, [requestOptions, requestFun]);

    return { response, requestFun, loading };
};

export const useHttpEx = <T extends any>(
    request$: (...args) => AxiosObservable<T>,
    options: HttpRequestOptions<T> = {
        callOnComponentLoad: false,
        showNotification: true,
    },
) => {
    const setNotification = useSetRecoilState(atomNotification);
    const [response, setResponse] = useState<T>();
    const [requestOptions] = useState({ ...defaultOptions, ...options });
    const [loading, setLoading] = useState(false);

    const requestFun = useCallback(
        (...args) => {
            setLoading(true);
            const subscription = request$(...args).subscribe({
                next: (res: AxiosResponse) => {
                    setLoading(false);
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
        },
        [request$, requestOptions, setNotification],
    );

    return { response, requestFun, loading };
};
