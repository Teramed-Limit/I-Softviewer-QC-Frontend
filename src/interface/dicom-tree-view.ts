import { DicomImage, DicomSeries, DicomStudy } from './dicom-data';

export interface TreeAttribute {
    isOpen: boolean;
}

export interface DicomIODTreeView {
    dicomStudy: DicomStudyTree[];
    dicomSeries: DicomSeriesTree[];
    dicomImage: DicomImageTree[];
}

export interface DicomStudyTree extends DicomStudy, TreeAttribute {}

export interface DicomSeriesTree extends DicomSeries, TreeAttribute {}

export interface DicomImageTree extends DicomImage, TreeAttribute {}
