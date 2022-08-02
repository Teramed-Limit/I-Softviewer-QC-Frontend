export interface RecordNode<T> {
    lowerLevelRecords: T[];
    imageReferenceFileLookup: Record<string, string[]>;
}

export interface RootRecord extends RecordNode<PatientRecord> {
    lowerLevelRecords: PatientRecord[];
}

export interface PatientRecord extends RecordNode<StudyRecord> {
    patientId: string;
    patientName: string;
    patientSex: string;
    patientBirthDate: string;
    specificCharacterSet: string;
    lowerLevelRecords: StudyRecord[];
}

export interface StudyRecord extends RecordNode<SeriesRecord> {
    studyInstanceUID: string;
    studyDate: string;
    studyTime: string;
    studyID: string;
    accessionNumber: string;
    studyDescription: string;
    modality?: any;
    lowerLevelRecords: SeriesRecord[];
}

export interface SeriesRecord extends RecordNode<ImageRecord> {
    seriesInstanceUID: string;
    seriesDate: string;
    seriesTime: string;
    seriesNumber: string;
    institutionName: string;
    modality: string;
    lowerLevelRecords: ImageRecord[];
}

export interface ImageRecord {
    sopInstanceUID: string;
    instanceNumber: string;
    referencedFileID: string;
    referencedSOPInstanceUIDInFile: string;
    referencedTransferSyntaxUIDInFile: string;
}
