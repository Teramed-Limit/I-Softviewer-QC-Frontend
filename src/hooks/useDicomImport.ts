import dicomParser from 'dicom-parser';
import { catchError, concatMap, from, Observable, Observer, of, take, toArray } from 'rxjs';

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
        const { name, type } = file;
        return new Observable((observer: Observer<ImageFile>) => {
            if (isImage(type)) {
                observer.next({
                    type: BufferType.bmp,
                    file,
                });
                observer.complete();
            } else {
                observer.error({ error: { name, errorMessage: INVALID_IMAGE } });
            }
        });
    };

    const validateDcmFile = (file: File): Observable<DicomFile> => {
        const fileReader = new FileReader();
        const { name } = file;
        return new Observable((observer: Observer<DicomFile>) => {
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = () => {
                try {
                    const arrayBuffer = fileReader.result as ArrayBuffer;
                    const byteArray = new Uint8Array(arrayBuffer);
                    const dcmDataset = dicomParser.parseDicom(byteArray);
                    observer.next({
                        type: BufferType.dcm,
                        file,
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
