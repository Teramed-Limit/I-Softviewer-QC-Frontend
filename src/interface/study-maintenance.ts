import { DicomDataset } from './dicom-dataset';

export interface MergeRequestParams {
    modifyUser?: string;
    fromStudyUID: string;
    toStudyUID: string;
}

export interface SpiltRequestParams {
    modifyUser?: string;
    studyInstanceUID: string;
    afterSplitStudyToDeleteOldFiles: true;
}

export interface MappingRequestParams {
    modifyUser?: string;
    dataset: DicomDataset[];
    patientId: string;
    studyInstanceUID: string;
}

export interface UnMappingRequestParams {
    modifyUser?: string;
    patientId: string;
    studyInstanceUID: string;
}
