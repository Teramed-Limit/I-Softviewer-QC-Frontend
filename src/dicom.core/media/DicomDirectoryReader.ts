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

    buildDirectoryRecords(dataSet): DicomDirectoryRecord {
        this.readSequence(dataSet);

        const offsetOfTheFirstDirectoryRecordOfTheRootDirectoryEntity = dicomParser.explicitElementToString(
            dataSet,
            dataSet.elements.x00041200,
        );

        const dataset = dicomParser.explicitDataSetToJS(
            this.lookup[+offsetOfTheFirstDirectoryRecordOfTheRootDirectoryEntity + 8].dataSet as DataSet,
            this._options,
        ) as ExplicitDataSet;

        const rootRecord = this.parseDirectoryRecord(dataset);
        return rootRecord as DicomDirectoryRecord;
    }

    private readSequence = (dataSet) => {
        // directoryRecordSequence
        dataSet.elements.x00041220?.items?.forEach((seqElement: dicomParser.Element) => {
            if (!seqElement.dataSet) return;
            this.lookup[seqElement.dataOffset] = seqElement;
        });
    };

    private parseDirectoryRecord(dataset: ExplicitDataSet): DicomDirectoryRecord | undefined {
        const record = this._dicomDirectoryCreator.createRecordInstance(dataset);

        if (record === null) return undefined;

        // LowerLevel Directory Record
        if (+record.offsetOfReferencedLowerLevelDirectoryEntity === 0) {
            record.lowerLevelDirectoryRecord = undefined;
        } else {
            const lowerLevelDirectoryRecordDataset = dicomParser.explicitDataSetToJS(
                this.lookup[+record.offsetOfReferencedLowerLevelDirectoryEntity + 8].dataSet as DataSet,
                this._options,
            );
            record.lowerLevelDirectoryRecord = this.parseDirectoryRecord(lowerLevelDirectoryRecordDataset);
        }

        // Next Directory Record
        if (+record.offsetOfTheNextDirectoryRecord === 0) {
            record.nextDirectoryRecord = undefined;
        } else {
            const nextDirectoryRecordDataset = dicomParser.explicitDataSetToJS(
                this.lookup[+record.offsetOfTheNextDirectoryRecord + 8].dataSet as DataSet,
                this._options,
            );
            record.nextDirectoryRecord = this.parseDirectoryRecord(nextDirectoryRecordDataset);
        }

        if (record?.lowerLevelDirectoryRecord) {
            const lowerLevelRecords: DicomDirectoryRecord[] = [record.lowerLevelDirectoryRecord];
            let currentRecord: DicomDirectoryRecord | undefined = record.lowerLevelDirectoryRecord;
            while (currentRecord) {
                currentRecord = currentRecord.nextDirectoryRecord;
                if (currentRecord) lowerLevelRecords.push(currentRecord);
            }
            record.lowerLevelDirectoryRecordCollection = lowerLevelRecords;
        }

        return record;
    }
}
