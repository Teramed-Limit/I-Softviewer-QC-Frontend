import { explicitDataSetToJSType } from 'dicom-parser';
import { Observable, take } from 'rxjs';

import { readBase64$ } from '../../utils/general';

export enum DirectoryRecordNodeType {
    PATIENT = 'PATIENT',
    STUDY = 'STUDY',
    SERIES = 'SERIES',
    IMAGE = 'IMAGE',
    SRDOCUMENT = 'SR DOCUMENT',
}

export type ExplicitDataSet = Record<string, explicitDataSetToJSType | explicitDataSetToJSType[]>;

interface IDicomDirectoryRecord {
    type: DirectoryRecordNodeType;
    offsetOfReferencedLowerLevelDirectoryEntity: number;
    offsetOfTheNextDirectoryRecord: number;
    nextDirectoryRecord?: DicomDirectoryRecord | null;
    lowerLevelDirectoryRecord?: DicomDirectoryRecord | null;
    lowerLevelDirectoryRecordCollection?: DicomDirectoryRecord[] | null;
    parseDataset: (dataset: explicitDataSetToJSType) => string;
}

export abstract class DicomDirectoryRecord implements IDicomDirectoryRecord {
    offsetOfReferencedLowerLevelDirectoryEntity: number;
    offsetOfTheNextDirectoryRecord: number;
    nextDirectoryRecord?: DicomDirectoryRecord;
    lowerLevelDirectoryRecord?: DicomDirectoryRecord;
    lowerLevelDirectoryRecordCollection: DicomDirectoryRecord[] = [];
    type: DirectoryRecordNodeType;

    protected constructor(dataset: ExplicitDataSet) {
        this.offsetOfReferencedLowerLevelDirectoryEntity = +this.parseDataset(
            dataset.offsetOfReferencedLowerLevelDirectoryEntity,
        );
        this.offsetOfTheNextDirectoryRecord = +this.parseDataset(dataset.offsetOfTheNextDirectoryRecord);
        this.type = dataset.directoryRecordType as DirectoryRecordNodeType;
    }

    parseDataset(value: explicitDataSetToJSType | explicitDataSetToJSType[]): string {
        if (typeof value === 'string') return value;
        return '';
    }
}

export class PatientDirectoryRecordNode extends DicomDirectoryRecord {
    patientID: string;
    patientName: string;
    patientBirthDate: string;
    patientSex: string;
    specificCharacterSet: string;

    constructor(dataSet: ExplicitDataSet) {
        super(dataSet);
        this.patientBirthDate = this.parseDataset(dataSet.patientBirthDate);
        this.patientID = this.parseDataset(dataSet.patientBirthDate);
        this.patientName = this.parseDataset(dataSet.patientName);
        this.patientSex = this.parseDataset(dataSet.patientSex);
        this.specificCharacterSet = this.parseDataset(dataSet.specificCharacterSet);
    }
}

export class StudyDirectoryRecordNode extends DicomDirectoryRecord {
    accessionNumber: string;
    studyDate: string;
    studyDescription: string;
    studyID: string;
    studyInstanceUID: string;
    studyTime: string;

    constructor(dataSet) {
        super(dataSet);
        this.accessionNumber = this.parseDataset(dataSet.accessionNumber);
        this.studyDate = this.parseDataset(dataSet.studyDate);
        this.studyDescription = this.parseDataset(dataSet.studyDescription);
        this.studyID = this.parseDataset(dataSet.studyID);
        this.studyInstanceUID = this.parseDataset(dataSet.studyInstanceUID);
        this.studyTime = this.parseDataset(dataSet.studyTime);
    }
}

export class SeriesDirectoryRecordNode extends DicomDirectoryRecord {
    institutionName: string;
    modality: string;
    seriesInstanceUID: string;
    seriesNumber: string;
    specificCharacterSet: string;

    constructor(dataSet) {
        super(dataSet);
        this.institutionName = this.parseDataset(dataSet.institutionName);
        this.modality = this.parseDataset(dataSet.modality);
        this.seriesInstanceUID = this.parseDataset(dataSet.seriesInstanceUID);
        this.seriesNumber = this.parseDataset(dataSet.seriesNumber);
        this.specificCharacterSet = this.parseDataset(dataSet.specificCharacterSet);
    }
}

export class ImageDirectoryRecordNode extends DicomDirectoryRecord {
    columns: string;
    rows: string;
    frameOfReferenceUID: string;
    imageOrientationPatient: string;
    imagePositionPatient: string;
    imageType: string;
    instanceNumber: string;
    pixelSpacing: string;
    referencedFileID: string;
    referencedImageSequence: string;
    referencedSOPClassUIDInFile: string;
    referencedSOPInstanceUIDInFile: string;
    referencedTransferSyntaxUIDInFile: string;
    specificCharacterSet: string;

    constructor(dataSet) {
        super(dataSet);
        this.columns = this.parseDataset(dataSet.columns);
        this.rows = this.parseDataset(dataSet.rows);
        this.frameOfReferenceUID = this.parseDataset(dataSet.frameOfReferenceUID);
        this.imageOrientationPatient = this.parseDataset(dataSet.imageOrientationPatient);
        this.imagePositionPatient = this.parseDataset(dataSet.imagePositionPatient);
        this.imageType = this.parseDataset(dataSet.imageType);
        this.instanceNumber = this.parseDataset(dataSet.instanceNumber);
        this.pixelSpacing = this.parseDataset(dataSet.pixelSpacing);
        this.referencedFileID = this.parseDataset(dataSet.referencedFileID);
        this.referencedImageSequence = this.parseDataset(dataSet.referencedImageSequence);
        this.referencedSOPClassUIDInFile = this.parseDataset(dataSet.referencedSOPClassUIDInFile);
        this.referencedSOPInstanceUIDInFile = this.parseDataset(dataSet.referencedSOPInstanceUIDInFile);
        this.referencedTransferSyntaxUIDInFile = this.parseDataset(dataSet.referencedTransferSyntaxUIDInFile);
        this.specificCharacterSet = this.parseDataset(dataSet.specificCharacterSet);
    }

    readBuffer$(fileLookup: Record<string, File>): Observable<string> {
        const file = fileLookup[`${this.referencedFileID.replace(/\\/g, '/')}`];
        return readBase64$(file).pipe(take(1));
    }
}

export class SRDocDirectoryRecordNode extends DicomDirectoryRecord {
    contentDate: string;
    contentTime: string;
    instanceNumber: string;
    referencedFileID: string;
    referencedSOPClassUIDInFile: string;
    referencedSOPInstanceUIDInFile: string;
    referencedTransferSyntaxUIDInFile: string;
    specificCharacterSet: string;

    constructor(dataSet) {
        super(dataSet);
        this.contentDate = this.parseDataset(dataSet.contentDate);
        this.contentTime = this.parseDataset(dataSet.contentTime);
        this.instanceNumber = this.parseDataset(dataSet.instanceNumber);
        this.referencedFileID = this.parseDataset(dataSet.referencedFileID);
        this.referencedSOPClassUIDInFile = this.parseDataset(dataSet.referencedSOPClassUIDInFile);
        this.referencedSOPInstanceUIDInFile = this.parseDataset(dataSet.referencedSOPInstanceUIDInFile);
        this.referencedTransferSyntaxUIDInFile = this.parseDataset(dataSet.referencedTransferSyntaxUIDInFile);
        this.specificCharacterSet = this.parseDataset(dataSet.specificCharacterSet);
    }

    readBuffer$(fileLookup: Record<string, File>): Observable<string> {
        const file = fileLookup[`${this.referencedFileID.replace(/\\/g, '/')}`];
        return readBase64$(file).pipe(take(1));
    }
}
