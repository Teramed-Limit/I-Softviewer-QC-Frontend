export interface StudyQueryData {
    patientId: string;
    patientsName: string;
    patientsSex: string;
    patientsBirthDate: string;
    patientsBirthTime?: string;
    studyInstanceUID: string;
    studyDate: string;
    referringPhysiciansName?: any;
    accessionNumber: string;
    studyDescription: string;
    modality: string;
    performingPhysiciansName: string;
    merged: number;
    mapped: number;
    deleted: number;
    qcGuid: string;
}
