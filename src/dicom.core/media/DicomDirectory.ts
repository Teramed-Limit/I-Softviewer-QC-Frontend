import dicomParser, { DataSet } from 'dicom-parser';
import { Observable, Observer } from 'rxjs';

import { DicomDirectoryReader } from './DicomDirectoryReader';
import { DicomDirectoryRecord } from './DicomDirectoryRecord';

export class DicomDirectory {
    rootDirectoryRecord: DicomDirectoryRecord | undefined = undefined;
    rootDirectoryRecordCollection: DicomDirectoryRecord[] = [];

    private _dicomDirectoryReader: DicomDirectoryReader = new DicomDirectoryReader();

    load(dicomDirFile: Blob) {
        const fileReader = new FileReader();
        return new Observable((observer: Observer<DataSet>) => {
            fileReader.readAsArrayBuffer(dicomDirFile);
            fileReader.onload = () => {
                const arrayBuffer = fileReader.result as ArrayBuffer;
                const byteArray = new Uint8Array(arrayBuffer);
                const dataSet = dicomParser.parseDicom(byteArray);

                // parseDicomDirectory
                this.rootDirectoryRecord = this._dicomDirectoryReader.buildDirectoryRecords(dataSet);
                this._collectPatientRecord();

                observer.next(dataSet);
                observer.complete();
            };
            fileReader.onerror = () => {};
        });
    }

    private _collectPatientRecord() {
        if (!this.rootDirectoryRecord) return;

        this.rootDirectoryRecordCollection.push(this.rootDirectoryRecord);
        let currentRecord: DicomDirectoryRecord | null | undefined = this.rootDirectoryRecord;
        while (currentRecord != null) {
            currentRecord = currentRecord.nextDirectoryRecord;
            if (currentRecord) this.rootDirectoryRecordCollection.push(currentRecord);
        }
    }
}
