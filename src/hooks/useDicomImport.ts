import dicomParser from 'dicom-parser';
import { catchError, concatMap, from, Observable, Observer, of, take, toArray } from 'rxjs';

import { hydrateBuffer } from '../utils/dicom-utils';

const INVALID_FILE = ' Invalid file.';
const INVALID_IMAGE = ' Invalid image.';

const isImage = (mimeType: string): boolean => {
    return mimeType.match(/image\/*/) !== null;
};

export const BufferType = {
    dcm: 0,
    bmp: 1,
};

export interface FileBuffer {
    file: File;
    buffer: string;
}

export interface DicomFile extends FileBuffer {
    type: number;
    sopClassUID: string;
    studyDate?: string;
    studyDescription: string;
    modality: string;
    error?: ErrorReason;
}

export interface ErrorReason {
    name: string;
    errorMessage: string;
}

export const useDicomImport = () => {
    const validateImageFile = (file: File): Observable<DicomFile> => {
        const fileReader = new FileReader();
        const { type, name } = file;
        return hydrateBuffer(file).pipe(
            concatMap((fileBuffer: FileBuffer) => {
                return new Observable((observer: Observer<DicomFile>) => {
                    fileReader.readAsDataURL(file);
                    fileReader.onload = () => {
                        if (isImage(type)) {
                            const image = new Image();
                            image.onload = () => {
                                observer.next({
                                    ...fileBuffer,
                                    sopClassUID: '1.2.840.10008.5.1.4.1.1.7',
                                    modality: 'SC',
                                    studyDescription: '',
                                    type: BufferType.bmp,
                                });
                                observer.complete();
                            };
                            image.onerror = () => {
                                observer.error({ error: { name, errorMessage: INVALID_IMAGE } });
                            };
                            image.src = fileReader.result as string;
                        } else {
                            observer.error({ error: { name, errorMessage: INVALID_IMAGE } });
                        }
                    };
                    fileReader.onerror = () => {
                        observer.error({ error: { name, errorMessage: INVALID_FILE } });
                    };
                });
            }),
        );
    };

    const validateDcmFile = (file: File): Observable<DicomFile> => {
        const fileReader = new FileReader();
        const { name } = file;
        return hydrateBuffer(file).pipe(
            concatMap((fileBuffer: FileBuffer) => {
                return new Observable((observer: Observer<DicomFile>) => {
                    fileReader.readAsArrayBuffer(file);
                    fileReader.onload = () => {
                        try {
                            const arrayBuffer = fileReader.result as ArrayBuffer;
                            const byteArray = new Uint8Array(arrayBuffer);
                            const dcmDataset = dicomParser.parseDicom(byteArray);
                            const sopClassUID = dcmDataset.string('x00080016');
                            const modality = dcmDataset.string('x00080060');
                            const studyDescription = dcmDataset.string('x00081030');
                            const studyDate = dcmDataset.string('x00080020');
                            observer.next({
                                ...fileBuffer,
                                sopClassUID,
                                modality,
                                studyDescription,
                                studyDate,
                                type: BufferType.dcm,
                            });
                            observer.complete();
                        } catch (err) {
                            observer.error({ error: { name, errorMessage: err } });
                            observer.complete();
                        }
                    };
                    fileReader.onerror = () => {
                        observer.error({ error: { name, errorMessage: INVALID_FILE } });
                    };
                });
            }),
        );
    };

    const importJPG = (files: File[]): Observable<DicomFile[]> => {
        const numberOfFiles = files.length;

        return from(files).pipe(
            concatMap((file: File) => validateImageFile(file).pipe(catchError((error: DicomFile) => of(error)))),
            take(numberOfFiles),
            toArray(),
        );
    };

    const importDcm = (files: File[]): Observable<DicomFile[]> => {
        const numberOfFiles = files.length;

        return from(files).pipe(
            concatMap((file: File) => validateDcmFile(file).pipe(catchError((error: DicomFile) => of(error)))),
            take(numberOfFiles),
            toArray(),
        );
    };

    return { importDcm, importJPG };
};
