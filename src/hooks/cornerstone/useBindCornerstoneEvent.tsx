import { useEffect } from 'react';

import { cornerstoneEx as cornerstone } from '../../Components/CornerstoneViewport/interface/cornerstone-extend';

const nullVoid = () => {};

export const useBindCornerstoneEvent = (
    viewPortElement,
    onElementEnable,
    onElementDisable,
    onImageLoadProgress,
    OnImageLoaded,
    setIsLoading,
) => {
    useEffect(() => {
        if (!viewPortElement) return;

        // element enable/disable
        // Trigger on enable.js (cornerstone-master)
        cornerstone.events.addEventListener(cornerstone.EVENTS.ELEMENT_ENABLED, onElementEnable || nullVoid);
        // Trigger on disable.js (cornerstone-master)
        cornerstone.events.addEventListener(cornerstone.EVENTS.ELEMENT_DISABLED, nullVoid);

        // cornerstone xhrRequest
        // Trigger on xhrRequest.js (cornerstoneWADOImageLoader.js)
        cornerstone.events.addEventListener('cornerstoneimageloadstart', () => setIsLoading(true));
        cornerstone.events.addEventListener('cornerstoneimageloadprogress', onImageLoadProgress);
        cornerstone.events.addEventListener('cornerstoneimageloadend', nullVoid);

        // image loader load
        // Trigger on imageLoader.js (cornerstone-master)
        cornerstone.events.addEventListener('cornerstoneimageloaded', OnImageLoaded);
        cornerstone.events.addEventListener('cornerstoneimageloadfailed', nullVoid);

        return () => {
            // element enable/disable
            cornerstone.events.removeEventListener(cornerstone.EVENTS.ELEMENT_ENABLED, onElementEnable);
            cornerstone.events.removeEventListener(cornerstone.EVENTS.ELEMENT_DISABLED, onElementDisable);

            // cornerstone xhrRequest
            cornerstone.events.removeEventListener('cornerstoneimageloadstart', nullVoid);
            cornerstone.events.removeEventListener('cornerstoneimageloadprogress', onImageLoadProgress);
            cornerstone.events.removeEventListener('cornerstoneimageloadend', nullVoid);

            // image loader load
            cornerstone.events.removeEventListener('cornerstoneimageloaded', OnImageLoaded);
            cornerstone.events.removeEventListener('cornerstoneimageloadfailed', nullVoid);
        };
    }, [OnImageLoaded, onElementDisable, onElementEnable, onImageLoadProgress, setIsLoading, viewPortElement]);

    return {};
};
