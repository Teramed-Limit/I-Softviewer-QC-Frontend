import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { useSetRecoilState } from 'recoil';
import { concatMap, forkJoin, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { http } from '../api/axios';
import { atomNotification } from '../atoms/notification';
import { DicomImagePath, DicomIOD, DicomPatient, DicomSeries, DicomStudy } from '../interface/dicom-data';
import { MessageType } from '../interface/notification';
import { deepCopy } from '../utils/general';

const initDicomIOD = {
    dicomPatient: {},
    dicomStudy: [],
    dicomSeries: [],
    dicomImage: [],
};

export const useDicom = (studyInsUID: string) => {
    const setNotification = useSetRecoilState(atomNotification);
    const [dicomData, setDicomData] = useState<DicomIOD>(initDicomIOD);
    const [dcmUrlList, setDcmUrlList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const convertToCornerstoneSchemeUrl = (dicomImage: DicomImagePath[]): string[] => {
        return dicomImage.map((images) => {
            if (images.dcmPath.includes('https')) {
                return images.dcmPath.replace('https', 'dicomweb');
            }
            return images.dcmPath.replace('http', 'dicomweb');
        });
    };

    useEffect(() => {
        setLoading(true);
        const dicomIOD: DicomIOD = deepCopy(initDicomIOD);
        const subscription = http
            // Study
            .get<DicomStudy>(`dicomDbQuery/studyInstanceUID/${studyInsUID}`)
            .pipe(
                tap((studyRes) => (dicomIOD.dicomStudy = [studyRes.data])),
                // Patient
                concatMap((studyRes) => http.get<DicomPatient>(`dicomDbQuery/patientId/${studyRes.data.patientId}`)),
                tap((patientRes) => (dicomIOD.dicomPatient = patientRes.data)),
                // Series
                concatMap(() => http.get<DicomSeries[]>(`dicomDbQuery/studyInstanceUID/${studyInsUID}/series`)),
                tap((seriesRes) => (dicomIOD.dicomSeries = seriesRes.data)),
                map((seriesRes) => seriesRes.data.map((seriesData) => seriesData.seriesInstanceUID)),
                // Image
                concatMap((seriesInstanceUIDList) =>
                    forkJoin(
                        seriesInstanceUIDList.map((seriesInstanceUID) =>
                            http.get<DicomImagePath[]>(
                                `dicomDbQuery/seriesInstanceUID/${seriesInstanceUID}/imagePathList`,
                            ),
                        ),
                    ),
                ),
            )
            .subscribe({
                next: (imageResList) => {
                    imageResList.forEach((imageRes) => {
                        dicomIOD.dicomImage = [...dicomIOD.dicomImage, ...imageRes.data];
                    });
                    setDicomData(dicomIOD);
                    setDcmUrlList(convertToCornerstoneSchemeUrl(dicomIOD.dicomImage));
                    setLoading(false);
                },
                error: (err: AxiosError) => {
                    setLoading(false);
                    setNotification({
                        messageType: MessageType.Error,
                        message: err.response?.data || 'Http request failed!',
                    });
                },
            });
        return () => {
            subscription.unsubscribe();
        };
    }, [setNotification, studyInsUID]);

    return {
        dicomPatient: dicomData.dicomPatient,
        dicomStudy: dicomData.dicomStudy,
        dicomSeries: dicomData.dicomSeries,
        dicomImage: dicomData.dicomImage,
        dicomData,
        dcmUrlList,
        loading,
    };
};
