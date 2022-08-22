import cornerstone, { EnabledElementLayer, Image, LUT, vec2, VOI } from 'cornerstone-core';

export interface NewImageEvent {
    viewport: Viewport;
    element: HTMLElement;
    image: Image;
    oldImage: Image;
    enabledElement: EnabledElement;
    frameRate: number;
}

export interface ImageLoadedEvent {
    image: Image;
}

export interface ImageProgressEvent {
    imageId: string;
    loaded: number;
    percentComplete: number;
    total: number;
    url: string;
}

export interface ImageRenderedEvent {
    canvasContext: CanvasRenderingContext2D;
    element: HTMLElement;
    enabledElement: EnabledElement;
    image: Image;
    renderTimeInMs: number;
    viewport: Viewport;
}

export interface CanvasMouseWheelEvent {
    detail: WheelEvent;
    direction: number;
    element: HTMLElement;
    image: Image;
    imageX: number;
    imageY: number;
    pageX: number;
    pageY: number;
    pixelX: number;
    pixelY: number;
    spinX: number;
    spinY: number;
}

export interface Viewport {
    scale: number;
    translation: vec2;
    voi: VOI;
    invert: boolean;
    pixelReplication: boolean;
    hflip: boolean;
    vflip: boolean;
    rotation: number;
    modalityLUT: LUT;
    voiLUT: LUT;
    colormap: unknown;
    labelmap: boolean;
}

export interface EnabledElement {
    canvas: HTMLCanvasElement;
    data: any;
    element: HTMLElement;
    image: Image;
    invalid: boolean;
    lastImageTimeStamp: number;
    layers: EnabledElementLayer[];
    needsRedraw: boolean;
    options: any;
    viewport: Viewport;
    uuid: string;
    toolStateManager: any;
    renderingTools: RenderingTools;
}

export interface RenderingTools {
    lastRenderedImageId: string;
    lastRenderedIsColor: boolean;
    lastRenderedViewport: Viewport;
    renderCanvas: HTMLCanvasElement;
    renderCanvasContext: CanvasRenderingContext2D;
    renderCanvasData: RenderCanvasData;
}

export interface RenderCanvasData {
    data: Uint8ClampedArray;
    colorSpace: string;
    height: number;
    width: number;
}

export interface EnableWebGLOption {
    // 'webgl'
    renderer: 'webgl';
    desynchronized: boolean;
    preserveDrawingBuffer: boolean;
}

export interface RenderImage {
    viewportIndex: number;
    element: HTMLElement;
    canvas: HTMLCanvasElement;
    image: cornerstone.Image;
    viewport: Viewport;
}

export interface MeasurementModified {
    element: HTMLElement;
    measurementData: MeasurementData;
    toolName: string;
    toolType: string;
}

export interface MeasurementRemoved {
    element: HTMLElement;
    measurementData: MeasurementData;
    toolName: string;
    toolType: string;
}

export interface MeasurementData {
    active: boolean;
    invalidated: boolean;
    handles: any;
    uuid: string;
    visible: boolean;
}

export interface MeasurementDTO {
    toolName: string;
    measurementData: MeasurementData;
}
