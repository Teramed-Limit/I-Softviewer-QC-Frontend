import { useEffect } from 'react';

import cornerstoneTools from 'cornerstone-tools';
import { DebouncedFunc } from 'lodash';

import { cornerstoneEx as cornerstone } from '../../Components/CornerstoneViewport/interface/cornerstone-extend';
import {
    CanvasMouseWheelEvent,
    CornerstoneViewportEvent,
    ImageRenderedEvent,
    NewImageEvent,
} from '../../interface/cornerstone-viewport-event';

// const logger = (c) => console.log(c);

export const useBindCornerstoneElementEvent = (
    element: HTMLDivElement | undefined,
    onNewImage: DebouncedFunc<(event: CornerstoneViewportEvent<NewImageEvent>) => void>,
    onImageRendered: (event: CornerstoneViewportEvent<ImageRenderedEvent>) => void,
    onCanvasWheel: (event: CornerstoneViewportEvent<CanvasMouseWheelEvent>) => void,
    onViewportActive: () => void,
) => {
    useEffect(() => {
        if (!element) return;

        // Trigger on displayImage.js (cornerstone-master)
        element.addEventListener(cornerstone.EVENTS.NEW_IMAGE, onNewImage);
        // Trigger on drawImageSync.js (cornerstone-master)
        element.addEventListener(cornerstone.EVENTS.IMAGE_RENDERED, onImageRendered);

        // cornerstoneTools
        // Set Viewport Active
        element.addEventListener(cornerstoneTools.EVENTS.MOUSE_CLICK, onViewportActive);
        element.addEventListener(cornerstoneTools.EVENTS.MOUSE_DOWN, onViewportActive);
        element.addEventListener(cornerstoneTools.EVENTS.TOUCH_PRESS, onViewportActive);
        element.addEventListener(cornerstoneTools.EVENTS.TOUCH_START, onViewportActive);
        element.addEventListener(cornerstoneTools.EVENTS.STACK_SCROLL, onViewportActive);
        element.addEventListener(cornerstoneTools.EVENTS.MOUSE_WHEEL, onCanvasWheel);

        // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_ADDED, logger);
        // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED, logger);
        // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED, logger);
        // element.addEventListener(cornerstoneTools.EVENTS.MOUSE_DOWN_ACTIVATE, logger);

        return () => {
            // cornerstone
            element.removeEventListener(cornerstone.EVENTS.NEW_IMAGE, onNewImage);
            element.removeEventListener(cornerstone.EVENTS.IMAGE_RENDERED, onImageRendered);
            // cornerstoneTools
            element.removeEventListener(cornerstoneTools.EVENTS.MOUSE_CLICK, onViewportActive);
            element.removeEventListener(cornerstoneTools.EVENTS.MOUSE_DOWN, onViewportActive);
            element.removeEventListener(cornerstoneTools.EVENTS.TOUCH_PRESS, onViewportActive);
            element.removeEventListener(cornerstoneTools.EVENTS.TOUCH_START, onViewportActive);
            element.removeEventListener(cornerstoneTools.EVENTS.STACK_SCROLL, onViewportActive);
            element.removeEventListener(cornerstoneTools.EVENTS.MOUSE_WHEEL, onCanvasWheel);

            // element.removeEventListener(cornerstoneTools.EVENTS.MEASUREMENT_ADDED, logger);
            // element.removeEventListener(cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED, logger);
            // element.removeEventListener(cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED, logger);
            // element.removeEventListener(cornerstoneTools.EVENTS.MOUSE_DOWN_ACTIVATE, logger);
        };
    }, [element, onCanvasWheel, onImageRendered, onNewImage, onViewportActive]);

    return {};
};
