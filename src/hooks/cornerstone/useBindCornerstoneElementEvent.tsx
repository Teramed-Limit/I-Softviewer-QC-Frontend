import { useEffect } from 'react';

import cornerstoneTools from 'cornerstone-tools';

import { cornerstoneEx as cornerstone } from '../../Components/CornerstoneViewport/interface/cornerstone-extend';

export const useBindCornerstoneElementEvent = (
    element,
    onNewImage,
    onImageRendered,
    onViewportActive,
    onCanvasWheel,
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
        };
    }, [element, onCanvasWheel, onImageRendered, onNewImage, onViewportActive]);

    return {};
};
