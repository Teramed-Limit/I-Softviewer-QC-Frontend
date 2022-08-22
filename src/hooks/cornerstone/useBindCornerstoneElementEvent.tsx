import { useEffect } from 'react';

import cornerstoneTools from 'cornerstone-tools';
import { fromEvent, throttleTime } from 'rxjs';

import { cornerstoneEx as cornerstone } from '../../Components/CornerstoneViewport/interface/cornerstone-extend';

export const useBindCornerstoneElementEvent = (
    element,
    onNewImage,
    onImageRendered,
    onViewportActive,
    onCanvasWheel,
    onMeasurementModified,
    onMeasurementRemoved,
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
        element.addEventListener(cornerstoneTools.EVENTS.STACK_SCROLL, onViewportActive);
        element.addEventListener(cornerstoneTools.EVENTS.MOUSE_WHEEL, onCanvasWheel);
        // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_ADDED, log);
        const measurementModified$ = fromEvent(element, cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED)
            .pipe(throttleTime(500, undefined, { leading: true, trailing: true }))
            .subscribe(onMeasurementModified);
        // element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED, log);
        element.addEventListener(cornerstoneTools.EVENTS.MEASUREMENT_REMOVED, onMeasurementRemoved);

        return () => {
            // cornerstone
            element.removeEventListener(cornerstone.EVENTS.NEW_IMAGE, onNewImage);
            element.removeEventListener(cornerstone.EVENTS.IMAGE_RENDERED, onImageRendered);
            // cornerstoneTools
            element.removeEventListener(cornerstoneTools.EVENTS.MOUSE_CLICK, onViewportActive);
            element.removeEventListener(cornerstoneTools.EVENTS.MOUSE_DOWN, onViewportActive);
            element.removeEventListener(cornerstoneTools.EVENTS.STACK_SCROLL, onViewportActive);
            element.removeEventListener(cornerstoneTools.EVENTS.MOUSE_WHEEL, onCanvasWheel);
            // element.removeEventListener(cornerstoneTools.EVENTS.MEASUREMENT_ADDED, log);
            measurementModified$.unsubscribe();
            // element.removeEventListener(cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED, log);
            element.removeEventListener(cornerstoneTools.EVENTS.MEASUREMENT_REMOVED, onMeasurementRemoved);
        };
    }, [
        element,
        onCanvasWheel,
        onImageRendered,
        onMeasurementModified,
        onMeasurementRemoved,
        onNewImage,
        onViewportActive,
    ]);

    return {};
};
