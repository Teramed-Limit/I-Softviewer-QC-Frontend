import cornerstoneTools from 'cornerstone-tools';

import WwwcToolSyncTool from './WwwcToolSync';

export enum ViewerSessionMode {
    Standalone = 1,
    Online,
}

export const ToolMap = {
    Wwwc: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.WwwcTool,
        [ViewerSessionMode.Online]: cornerstoneTools.WwwcTool,
    },
    Zoom: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.ZoomTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    Pan: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.PanTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    Magnify: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.MagnifyTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    Length: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.LengthTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    Probe: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.ProbeTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    Angle: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.AngleTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    Bidirectional: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.BidirectionalTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    FreehandRoi: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.FreehandRoiTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    Eraser: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.EraserTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    EllipticalRoi: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.EllipticalRoiTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    RectangleRoi: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.RectangleRoiTool,
        [ViewerSessionMode.Online]: WwwcToolSyncTool,
    },
    StackScrollMouseWheel: {
        [ViewerSessionMode.Standalone]: cornerstoneTools.StackScrollMouseWheelTool,
        [ViewerSessionMode.Online]: cornerstoneTools.StackScrollMouseWheelTool,
    },
};
