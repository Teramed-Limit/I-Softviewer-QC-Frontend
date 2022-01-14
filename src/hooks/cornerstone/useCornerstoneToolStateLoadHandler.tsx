import { useCallback, useEffect, useRef } from 'react';

import cornerstoneTools from 'cornerstone-tools';

const { loadHandlerManager } = cornerstoneTools;

export const useCornerstoneToolStateLoadHandler = (
    viewPortElement,
    startLoadHandler,
    endLoadHandler,
    loadIndicatorDelay,
    setIsLoading,
) => {
    const loadHandlerTimeout = useRef<any>();
    /**
     * There is a "GLOBAL/DEFAULT" load handler for start/end/error,
     * and one that can be defined per element. We use start/end handlers in this
     * component to show the "Loading..." indicator if a loading request is taking
     * longer than expected.
     *
     * Because we're using the "per element" handler, we need to call the user's
     * handler within our own (if it's set). Load Handlers are not well documented,
     * but you can find [their source here]{@link https://github.com/cornerstonejs/cornerstoneTools/blob/master/src/stateManagement/loadHandlerManager.js}
     *
     * @param {boolean} [clear=false] - true to remove previously set load handlers
     * @memberof CornerstoneViewport
     * @returns {undefined}
     */
    const setupLoadHandlers = useCallback(() => {
        if (!viewPortElement) return;
        // We use this to "flip" `isLoading` to true, if our startLoading request
        // takes longer than our "loadIndicatorDelay"
        const onStartLoad = (targetElement) => {
            clearTimeout(loadHandlerTimeout.current);

            // Call user defined loadHandler
            if (startLoadHandler) {
                startLoadHandler(targetElement);
            }

            // We're taking too long. Indicate that we're "Loading".
            loadHandlerTimeout.current = setTimeout(() => {
                setIsLoading(true);
            }, loadIndicatorDelay);
        };

        const onEndLoad = (targetElement, image) => {
            clearTimeout(loadHandlerTimeout.current);

            // Call user defined loadHandler
            if (endLoadHandler) {
                endLoadHandler(targetElement, image);
            }
            setIsLoading(false);
        };

        loadHandlerManager.setStartLoadHandler(onStartLoad, viewPortElement);
        loadHandlerManager.setEndLoadHandler(onEndLoad, viewPortElement);
    }, [endLoadHandler, loadIndicatorDelay, setIsLoading, startLoadHandler, viewPortElement]);

    useEffect(() => {
        setupLoadHandlers();
        return () => {
            if (!viewPortElement) return;
            loadHandlerManager.removeHandlers(viewPortElement);
        };
    }, [setupLoadHandlers, viewPortElement]);

    return {};
};
