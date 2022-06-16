import cornerstone, { EnabledElement } from 'cornerstone-core';

import ToolHandler from './tool-event-handler';

export interface ToolEventHandler {
    handle(enableElement: EnabledElement, eventParamsJson: string);
}

export class EventHandlerContext {
    private eventHandlerList: { [props: string]: ToolEventHandler } = {};

    constructor() {
        this.eventHandlerList.Wwwc = new ToolHandler.WwcEventReceiveHandler();
    }

    public handle(imageId: string, eventName: string, eventParamsJson: string) {
        const enableElement = cornerstone.getEnabledElementsByImageId(imageId)[0];
        if (!enableElement) return;
        return this.eventHandlerList[eventName].handle(enableElement, eventParamsJson);
    }
}

const ToolSyncEventHandlerService = {
    eventHandlerContext: new EventHandlerContext(),
};

export default ToolSyncEventHandlerService;
