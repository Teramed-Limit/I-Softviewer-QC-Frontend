export interface DicomQRResult {
    datasets: Tag[][];
    fileSetIDs: Tag[];
}

interface Tag {
    group: string;
    element: string;
    value: string;
    name: string;
    keyword: string;
}
