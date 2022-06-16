import { useEffect } from 'react';

import cornerstoneTools from 'cornerstone-tools';

import { ToolMap, ViewerSessionMode } from '../../cornerstone-extend/tools';

const AVAILABLE_TOOL_MODES = ['active', 'passive', 'enabled', 'disabled'];

const TOOL_MODE_FUNCTIONS = {
    active: cornerstoneTools.setToolActiveForElement,
    passive: cornerstoneTools.setToolPassiveForElement,
    enabled: cornerstoneTools.setToolEnabledForElement,
    disabled: cornerstoneTools.setToolDisabledForElement,
};

const addAndConfigureInitialToolsForElement = (tools, viewerSessionMode, element) => {
    for (let i = 0; i < tools.length; i++) {
        const tool = typeof tools[i] === 'string' ? { name: tools[i] } : { ...tools[i] };

        if (!ToolMap[tool.name]) continue;
        tool.toolClass = tool.toolClass || ToolMap[tool.name][viewerSessionMode];

        if (tool.toolClass) {
            const toolAlreadyAddedToElement = cornerstoneTools.getToolForElement(element, tool.name);
            // eslint-disable-next-line no-continue
            if (toolAlreadyAddedToElement) continue;

            cornerstoneTools.addToolForElement(element, tool.toolClass, tool.props || {});

            const hasInitialMode = tool.mode && AVAILABLE_TOOL_MODES.includes(tool.mode);

            if (hasInitialMode) {
                // TODO: We may need to check `tool.props` and the tool class's prototype
                // to determine the name it registered with cornerstone. `tool.name` is not
                // reliable.
                const setToolModeFn = TOOL_MODE_FUNCTIONS[tool.mode];
                setToolModeFn(element, tool.name, tool.modeOptions || {});
            }
        } else {
            console.warn(`Unable to add tool with name '${tool.name}'.`);
        }
    }
};

const trySetActiveTool = (element, activeToolName) => {
    if (!element || !activeToolName) {
        return;
    }

    const validTools = cornerstoneTools.store.state.tools.filter((tool) => tool.element === element);
    const validToolNames = validTools.map((tool) => tool.name);

    if (!validToolNames.includes(activeToolName)) {
        console.warn(
            `Trying to set a tool active that is not "added". Available tools include: ${validToolNames.join(', ')}`,
        );
    }

    cornerstoneTools.setToolActiveForElement(element, activeToolName, {
        mouseButtonMask: 1,
    });
};

export const useRegisterCornerstoneTools = (
    viewPortElement,
    viewerSessionMode: ViewerSessionMode,
    tools,
    activeTool,
) => {
    // Register tools
    useEffect(() => {
        if (!viewPortElement) return;
        addAndConfigureInitialToolsForElement(tools, viewerSessionMode, viewPortElement);
    }, [viewPortElement, tools, viewerSessionMode]);

    // Update when tool changed
    useEffect(() => {
        if (!viewPortElement) return;
        trySetActiveTool(viewPortElement, activeTool);
    }, [viewPortElement, activeTool]);

    return {};
};
