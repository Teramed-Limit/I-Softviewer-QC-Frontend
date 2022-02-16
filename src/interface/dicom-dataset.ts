export interface DicomQRResult {
    datasets: DicomDataset[][];
    fileSetIDs: DicomDataset[];
}

export interface DicomDataset {
    group: number;
    elem: number;
    value: string;
    name: string;
    keyword: string;
}
