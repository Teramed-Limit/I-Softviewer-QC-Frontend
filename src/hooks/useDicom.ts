import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { useSetRecoilState } from 'recoil';
import { concatMap, forkJoin, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { http } from '../api/axios';
import { atomNotification } from '../atoms/notification';
import { DicomImage, DicomImagePath, DicomIOD, DicomPatient, DicomSeries, DicomStudy } from '../interface/dicom-data';
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
    // cornerstone image id list
    const [imageIdList, setImageIdList] = useState<string[]>([]);
    // [cornerstone image id: DicomImage]
    const [imageLookup, setImageLookup] = useState<Record<string, DicomImage>>({});
    const [loading, setLoading] = useState(false);

    const convertToCornerstoneSchemeUrl = (dicomImage: DicomImagePath[]) => {
        const dcmImageIds: string[] = [];
        const dcmLookup = {};
        dicomImage.forEach((images) => {
            if (images.dcmPath.includes('https')) {
                const dicomImageId = images.dcmPath.replace('https', 'dicomweb');
                dcmImageIds.push(dicomImageId);
                dcmLookup[images.sopInstanceUID] = images;
            }
            const dicomImageId = images.dcmPath.replace('http', 'dicomweb');
            dcmImageIds.push(dicomImageId);
            dcmLookup[dicomImageId] = images;
        });
        return { dcmImageIds, dcmLookup };
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
                    const dcmData = convertToCornerstoneSchemeUrl(dicomIOD.dicomImage);
                    setImageIdList(dcmData.dcmImageIds);
                    setImageLookup(dcmData.dcmLookup);
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
        imageIdList,
        imageLookup,
        loading,
    };
};
