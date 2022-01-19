export interface DicomIOD {
    dicomPatient: Partial<DicomPatient>;
    dicomStudy: DicomStudy[];
    dicomSeries: DicomSeries[];
    dicomImage: DicomImagePath[];
}
export interface DicomPatient {
    patientId: string;
    patientsName: string;
    patientsSex: string;
    patientsBirthDate: string;
    patientsBirthTime: string;
    otherPatientNames: string;
    otherPatientId: string;
    ethnicGroup: string;
    patientComments: string;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    documentNumber: string;
}

export interface DicomStudy {
    studyInstanceUID: string;
    patientId: string;
    studyDate: string;
    studyTime: string;
    referringPhysiciansName?: any;
    studyID: string;
    accessionNumber: string;
    studyDescription: string;
    modality: string;
    performingPhysiciansName: string;
    nameofPhysiciansReading: string;
    studyStatus: string;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    procedureID: string;
    referencedStudyInstanceUID: string;
}

export interface DicomSeries {
    seriesInstanceUID: string;
    studyInstanceUID: string;
    seriesModality: string;
    seriesDate: string;
    seriesTime?: any;
    seriesNumber: string;
    seriesDescription: string;
    patientPosition?: any;
    bodyPartExamined?: any;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    referencedStudyInstanceUID: string;
    referencedSeriesInstanceUID: string;
}

export interface DicomImage {
    sopInstanceUID: string;
    seriesInstanceUID: string;
    sopClassUID: string;
    imageNumber: string;
    imageDate?: any;
    imageTime?: any;
    filePath: string;
    storageDeviceID: string;
    imageStatus: string;
    windowWidth: number;
    windowCenter: number;
    keyImage: string;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    haveSendToRemote: string;
    referencedSOPInstanceUID: string;
    referencedSeriesInstanceUID: string;
    dcmPath: string;
    jpgPath: string;
}

export interface DicomImagePath {
    dcmPath: string;
    jpgPath: string;
    imageFullPath: string;
    sopInstanceUID: string;
    sopClassUID: string;
    imageNumber: string;
    imageDate: string;
    imageTime: string;
    filePath: string;
    storageDeviceID: string;
    imageStatus: string;
    patientId: string;
    patientsName: string;
    studyInstanceUID: string;
    studyDate: string;
    studyTime: string;
    accessionNumber: string;
    studyDescription: string;
    seriesModality: string;
    bodyPartExamined?: any;
    patientPosition: string;
    storagePath: string;
    storageDescription: string;
    seriesInstanceUID: string;
}
