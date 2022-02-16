import { useCallback } from 'react';

import { AxiosError } from 'axios';
import { AxiosObservable } from 'axios-observable';
import { useSetRecoilState } from 'recoil';

import { http } from '../api/axios';
import { loading } from '../atoms/loading';
import { atomNotification } from '../atoms/notification';
import { atomUpToDateQueryResult } from '../atoms/study-query';
import { MessageType } from '../interface/notification';
import {
    MappingRequestParams,
    MergeRequestParams,
    SpiltRequestParams,
    UnMappingRequestParams,
} from '../interface/study-maintenance';
import TokenService from '../services/TokenService';

const baseApiScheme = 'studyMaintenance';

export const useDicomStudyQC = (successCallback?: () => void) => {
    const setLoading = useSetRecoilState(loading);
    const setNotification = useSetRecoilState(atomNotification);
    const setNeedRefreshQuery = useSetRecoilState(atomUpToDateQueryResult);

    // http common handler
    const requestHandler = useCallback(
        (observable: AxiosObservable<any>, type: string) => {
            observable.subscribe({
                next: () => {
                    setLoading(false);
                    successCallback?.();
                    setNeedRefreshQuery(true);
                    setNotification({
                        messageType: MessageType.Success,
                        message: `${type} study success`,
                    });
                },
                error: (err: AxiosError) => {
                    setLoading(false);
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        },
        [setLoading, setNeedRefreshQuery, setNotification, successCallback],
    );

    // mark study as deleted
    const deleteStudy = useCallback(
        (studyInsUid: string) => {
            requestHandler(http.delete(`${baseApiScheme}/${studyInsUid}`), 'delete');
        },
        [requestHandler],
    );

    // mapping study
    const mappingStudy = useCallback(
        (requestParams: MappingRequestParams) => {
            if (!requestParams.patientId || !requestParams.studyInstanceUID) {
                setNotification({
                    messageType: MessageType.Error,
                    message: 'Missing studyInstanceUID or patientId',
                });
                return;
            }
            requestHandler(
                http.put(`${baseApiScheme}/mapping`, { ...requestParams, modifyUser: TokenService.getUserName() }),
                'Mapping',
            );
        },
        [requestHandler, setNotification],
    );

    // reset mapping study
    const unMappingStudy = useCallback(
        (requestParams: UnMappingRequestParams) => {
            if (!requestParams.patientId || !requestParams.studyInstanceUID) {
                setNotification({
                    messageType: MessageType.Error,
                    message: 'Missing studyInstanceUID or patientId',
                });
                return;
            }
            requestHandler(
                http.put(`${baseApiScheme}/unmapping`, { ...requestParams, modifyUser: TokenService.getUserName() }),
                'Unmapping',
            );
        },
        [requestHandler, setNotification],
    );

    // merge study
    const mergeStudy = useCallback(
        (requestParams: MergeRequestParams) => {
            if (!requestParams.fromStudyUID || !requestParams.toStudyUID) {
                setNotification({
                    messageType: MessageType.Error,
                    message: 'Missing merge studyInstanceUID',
                });
                return;
            }
            requestHandler(
                http.put(`${baseApiScheme}/merge`, { ...requestParams, modifyUser: TokenService.getUserName() }),
                'Merge',
            );
        },
        [requestHandler, setNotification],
    );

    // spilt merging study
    const spiltStudy = useCallback(
        (requestParams: SpiltRequestParams) => {
            if (!requestParams.studyInstanceUID) {
                setNotification({
                    messageType: MessageType.Error,
                    message: 'Missing studyInstanceUID',
                });
                return;
            }
            requestHandler(
                http.put(`${baseApiScheme}/split`, { ...requestParams, modifyUser: TokenService.getUserName() }),
                'Spilt',
            );
        },
        [requestHandler, setNotification],
    );

    return { deleteStudy, mappingStudy, unMappingStudy, mergeStudy, spiltStudy };
};
