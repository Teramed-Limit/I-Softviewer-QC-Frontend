export interface CustomizedField {
    group: number;
    elem: number;
    value: string;
}

export interface PatientInfo {
    customizedFields?: CustomizedField[];
    patientId?: string;
    patientsName?: string;
    patientsSex?: string;
    patientsBirthDate?: string;
    patientsBirthTime?: string;
    otherPatientNames?: string;
    otherPatientId?: string;
}

export interface StudyInfo {
    customizedFields?: CustomizedField[];
    studyInstanceUID?: string;
    patientId?: string;
    studyDate?: string;
    studyTime?: string;
    referringPhysiciansName?: string;
    studyID?: string;
    accessionNumber?: string;
    studyDescription?: string;
    modality?: string;
    performingPhysiciansName?: string;
    nameofPhysiciansReading?: string;
    procedureID?: string;
}

export interface SeriesInfo {
    customizedFields?: CustomizedField[];
    seriesInstanceUID?: string;
    studyInstanceUID?: string;
    seriesModality?: string;
    seriesDate?: string;
    seriesTime?: string;
    seriesNumber?: string;
    seriesDescription?: string;
    patientPosition?: string;
    bodyPartExamined?: string;
}

export interface ImageInfo {
    sopInstanceUID?: string;
    seriesInstanceUID?: string;
    sopClassUID?: string;
    imageNumber?: string;
    imageDate?: string;
    imageTime?: string;
    windowWidth?: string;
    windowCenter?: string;
}

export interface ImageBufferAndData extends ImageInfo {
    buffer: any;
    type: number;
}

export interface CreateAndModifyStudy<T extends ImageInfo> {
    patientInfo?: PatientInfo;
    studyInfo?: StudyInfo[];
    seriesInfo?: SeriesInfo[];
    imageInfos?: T[];
}
