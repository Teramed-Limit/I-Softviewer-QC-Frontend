import dicomParser, { DataSet, Element } from 'dicom-parser';

import { DicomDirectoryCreator } from './DicomDirectoryCreator';
import { DicomDirectoryRecord, ExplicitDataSet } from './DicomDirectoryRecord';

export class DicomDirectoryReader {
    private _dicomDirectoryCreator: DicomDirectoryCreator = new DicomDirectoryCreator();
    private _options = {
        omitPrivateAttibutes: false,
        maxElementLength: 128,
    };
    lookup: Record<string, Element> = {};

    buildDirectoryRecords(dataSet, fileLookup): DicomDirectoryRecord {
        this.readSequence(dataSet);

        const offsetOfTheFirstDirectoryRecordOfTheRootDirectoryEntity = dicomParser.explicitElementToString(
            dataSet,
            dataSet.elements.x00041200,
        );

        const dataset = dicomParser.explicitDataSetToJS(
            this.lookup[+offsetOfTheFirstDirectoryRecordOfTheRootDirectoryEntity + 8].dataSet as DataSet,
            this._options,
        ) as ExplicitDataSet;

        const rootRecord = this.parseDirectoryRecord(dataset, fileLookup);
        return rootRecord as DicomDirectoryRecord;
    }

    private readSequence = (dataSet) => {
        // directoryRecordSequence
        dataSet.elements.x00041220?.items?.forEach((seqElement: dicomParser.Element) => {
            if (!seqElement.dataSet) return;
            this.lookup[seqElement.dataOffset] = seqElement;
        });
    };

    private parseDirectoryRecord(dataset: ExplicitDataSet, fileLookup): DicomDirectoryRecord | null {
        const record = this._dicomDirectoryCreator.createRecordInstance(dataset, fileLookup);

        if (record === null) return null;

        // LowerLevel Directory Record
        if (+record.offsetOfReferencedLowerLevelDirectoryEntity === 0) {
            record.lowerLevelDirectoryRecord = null;
        } else {
            const lowerLevelDirectoryRecordDataset = dicomParser.explicitDataSetToJS(
                this.lookup[+record.offsetOfReferencedLowerLevelDirectoryEntity + 8].dataSet as DataSet,
                this._options,
            );
            record.lowerLevelDirectoryRecord = this.parseDirectoryRecord(lowerLevelDirectoryRecordDataset, fileLookup);
        }

        // Next Directory Record
        if (+record.offsetOfTheNextDirectoryRecord === 0) {
            record.nextDirectoryRecord = null;
        } else {
            const nextDirectoryRecordDataset = dicomParser.explicitDataSetToJS(
                this.lookup[+record.offsetOfTheNextDirectoryRecord + 8].dataSet as DataSet,
                this._options,
            );
            record.nextDirectoryRecord = this.parseDirectoryRecord(nextDirectoryRecordDataset, fileLookup);
        }

        if (record?.lowerLevelDirectoryRecord) {
            const lowerLevelRecords: any[] = [record.lowerLevelDirectoryRecord];
            let currentRecord: DicomDirectoryRecord | null | undefined = record.lowerLevelDirectoryRecord;
            while (currentRecord !== null) {
                currentRecord = currentRecord?.nextDirectoryRecord;
                if (currentRecord) lowerLevelRecords.push({ ...currentRecord });
            }
            record.lowerLevelDirectoryRecordCollection = lowerLevelRecords;
        }

        return record;
    }
}
