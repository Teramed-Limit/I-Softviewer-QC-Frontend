import { AxiosResponse } from 'axios';
import dicomParser from 'dicom-parser';
import { Observable, Observer } from 'rxjs';

import { TAG_DICT } from '../constant/dicom-tag-dict';
import { DICOM_UID } from '../constant/dicom-uid';
import { FileBuffer } from '../hooks/useDicomImport';
import { DicomQRResult } from '../interface/dicom-dataset';
import { TagElement } from '../interface/tag-dict';
import { getDateString, readBase64 } from './general';

export function mapUid(str) {
    const uid = DICOM_UID[str];
    if (uid) {
        return ` [ ${uid} ]`;
    }
    return '';
}

export function getTag(tag): TagElement {
    const group = tag.substring(1, 5);
    const element = tag.substring(5, 9);
    const tagIndex = `(${group},${element})`.toUpperCase();
    return TAG_DICT[tagIndex];
}

export const generateNewStudyInstanceUID = () => {
    const privateEnterpriseNumber = '1.3.6.1.4.1.54514';
    return `${privateEnterpriseNumber}.${getDateString(new Date())}.${getRandomNumberBetween(1000, 9999)}`;
};

export const hydrateDataset = (file): Promise<{ dcmDataset: dicomParser.DataSet; buffer: string }> => {
    return readBase64(file).then((result) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const byteArray = new Uint8Array(arrayBuffer);
                const dcmDataset = dicomParser.parseDicom(byteArray);
                resolve({ dcmDataset, buffer: result });
            };
            reader.readAsArrayBuffer(file);
            reader.onerror = (error) => reject(error);
        });
    });
};

export const hydrateBuffer = (file: File, type): Observable<FileBuffer> => {
    const fileReader = new FileReader();
    return new Observable((observer: Observer<FileBuffer>) => {
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            const buffer = (fileReader.result as string).split(',')[1];
            observer.next({ buffer, file, type });
            observer.complete();
        };
        fileReader.onerror = () => {};
    });
};

function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const parseDicomTagResult = (res: AxiosResponse<DicomQRResult>) => {
    const newRowData: any[] = [];
    res.data?.datasets?.forEach((study) => {
        let row = {};
        study.forEach((tag) => (row = { ...row, [tag.keyword]: tag.value }));
        newRowData.push(row);
    });
    return newRowData;
};

export const parseDicomTagToDcmUrlArray = (res: AxiosResponse<DicomQRResult>): string[] => {
    const dcmUrlList: string[] = [];
    res.data?.fileSetIDs?.forEach((tag) => {
        if (tag.value.includes('https')) {
            dcmUrlList.push(tag.value.replace('https', 'dicomweb'));
        } else {
            dcmUrlList.push(tag.value.replace('http', 'dicomweb'));
        }
    });
    return dcmUrlList;
};
