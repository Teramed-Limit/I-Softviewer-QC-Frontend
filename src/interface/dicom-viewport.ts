import { Image, Viewport } from 'cornerstone-core';
import { DataSet } from 'dicom-parser';

export interface ViewPortElement {
    viewportIndex: number;
    element: HTMLElement;
    image: Image | DicomImage;
    viewport: Viewport;
    initViewport: Viewport;
    canvas: HTMLCanvasElement;
}

export interface DicomImage extends Image {
    data: DataSet;
}
