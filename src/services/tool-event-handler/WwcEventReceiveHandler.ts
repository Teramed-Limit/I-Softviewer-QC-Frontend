import cornerstone, { EnabledElement } from 'cornerstone-core';

import { ToolEventHandler } from '../ToolSyncEventHandlerService';

export default class implements ToolEventHandler {
    public handle(enableElement: EnabledElement, eventParamsJson: string) {
        cornerstone.setViewport(enableElement.element, {
            ...enableElement.viewport,
            voi: JSON.parse(eventParamsJson),
        });
    }
}
