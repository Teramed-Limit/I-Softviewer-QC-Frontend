import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneWebImageLoader from 'cornerstone-web-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';

import cornerstoneFileImageLoader from './ImageLoader/cornerstoneFileImageLoader';

declare global {
    interface Window {
        cornerstone: any;
        cornerstoneTools: typeof cornerstoneTools;
    }
}

export default function initCornerstone() {
    // Cornertone Tools
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.init({
        /**
         * When cornerstone elements are enabled,
         * should `mouse` input events be listened for?
         */
        mouseEnabled: true,
        /**
         * When cornerstone elements are enabled,
         * should `touch` input events be listened for?
         */
        touchEnabled: false,
        /**
         * A special flag that synchronizes newly enabled cornerstone elements. When
         * enabled, their active tools are set to reflect tools that have been
         * activated with `setToolActive`.
         */
        globalToolSyncEnabled: false,
        /**
         * Most tools have an associated canvas or SVG cursor. Enabling this flag
         * causes the cursor to be shown when the tool is active, bound to left
         * click, and the user is hovering the enabledElement.
         */
        showSVGCursors: true,
    });

    // Preferences
    const fontFamily =
        'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
    cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);
    cornerstoneTools.toolStyle.setToolWidth(2);
    cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
    cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

    cornerstoneTools.store.state.touchProximity = 40;

    // IMAGE LOADER
    cornerstoneFileImageLoader.external.cornerstone = cornerstone;
    cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneWADOImageLoader.webWorkerManager.initialize({
        maxWebWorkers: navigator.hardwareConcurrency || 1,
        startWebWorkersOnDemand: true,
        taskConfiguration: {
            decodeTask: {
                initializeCodecsOnStartup: false,
                usePDFJS: false,
                strict: false,
            },
        },
    });

    // Debug
    window.cornerstone = cornerstone;
    window.cornerstoneTools = cornerstoneTools;
}
