import { Image, Viewport } from 'cornerstone-core';

export interface CornerstoneViewportEvent extends Event {
    detail: EventDetails;
}

export interface EventDetails {
    viewport: Viewport;
    element: HTMLElement;
    image: Image;
    oldImage: Image;
    enabledElement;
    frameRate: number;
}
