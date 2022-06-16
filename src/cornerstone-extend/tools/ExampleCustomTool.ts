import cornerstoneTools from 'cornerstone-tools';

import { ViewportToolMouseMoveEvent } from '../../interface/cornerstone-viewport-event';
const WwwcTool = cornerstoneTools.WwwcTool;
// const BaseTool = cornerstoneTools.import('utils/BaseTool');

export default class ExampleCustomTool extends WwwcTool {
    protected name: string;

    constructor(props = {}) {
        const defaultProps = {};
        super(props, defaultProps);
        this.name = 'CustomToolTemplate';
    }

    mouseDragCallback(evt: CustomEvent<ViewportToolMouseMoveEvent>) {
        // console.log('mouseDragCallback');
        // super.mouseDragCallback(evt);
    }

    /**
     * Callback that takes priority if the tool is active, before `MOUSE_DOWN`
     * events are processed. Does nothing by default.
     */
    preMouseDownCallback(evt) {
        // console.log('preMouseDownCallback', evt);
    }

    /**
     * Callback that takes priority if the tool is active, after `MOUSE_DOWN`
     * events are processed. Does nothing by default.
     */
    postMouseDownCallback(evt) {
        // console.log('postMouseDownCallback', evt);
    }

    /**
     * `Active` - `activeCallback (element)`
     * `Passive` - `passiveCallback (element)`
     * `Enabled` - `enabledCallback (element)`
     * `Disabled` - `disabledCallback (element)`
     */
    activeCallback(element) {
        // console.log(`activeCallback`, element);
    }

    passiveCallback(element) {
        // console.log(`passiveCallback`, element);
    }

    enabledCallback(element) {
        // console.log(`enabledCallback`, element);
    }

    disabledCallback(element) {
        // console.log(`disabledCallback`, element);
    }
}
