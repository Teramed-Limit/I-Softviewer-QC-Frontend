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
    type: number;
}

export interface ImageFile extends FileBuffer {
    error?: ErrorReason;
}

export interface DicomFile extends FileBuffer {
    dcmDataset: dicomParser.DataSet;
    error?: ErrorReason;
}

export interface ErrorReason {
    name: string;
    errorMessage: string;
}

export const useDicomImport = () => {
    const validateImageFile = (file: File): Observable<ImageFile> => {
        const fileReader = new FileReader();
        const { type, name } = file;
        return hydrateBuffer(file, BufferType.bmp).pipe(
            concatMap((fileBuffer: FileBuffer) => {
                return new Observable((observer: Observer<ImageFile>) => {
                    fileReader.readAsDataURL(file);
                    fileReader.onload = () => {
                        if (isImage(type)) {
                            const image = new Image();
                            image.onload = () => {
                                observer.next({
                                    ...fileBuffer,
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
        return hydrateBuffer(file, BufferType.dcm).pipe(
            concatMap((fileBuffer: FileBuffer) => {
                return new Observable((observer: Observer<DicomFile>) => {
                    fileReader.readAsArrayBuffer(file);
                    fileReader.onload = () => {
                        try {
                            const arrayBuffer = fileReader.result as ArrayBuffer;
                            const byteArray = new Uint8Array(arrayBuffer);
                            const dcmDataset = dicomParser.parseDicom(byteArray);
                            observer.next({
                                ...fileBuffer,
                                dcmDataset,
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

    const importJPG = (files: File[]): Observable<ImageFile[]> => {
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
