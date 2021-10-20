import React, { useState } from 'react';

import CornerstoneViewport from 'react-cornerstone-viewport';

const initState = {
    activeViewportIndex: 0,
    viewports: [0, 1, 2, 3],
    tools: [
        // Mouse
        {
            name: 'Wwwc',
            mode: 'active',
            modeOptions: { mouseButtonMask: 1 },
        },
        {
            name: 'Zoom',
            mode: 'active',
            modeOptions: { mouseButtonMask: 2 },
        },
        {
            name: 'Pan',
            mode: 'active',
            modeOptions: { mouseButtonMask: 4 },
        },
        'Length',
        'Angle',
        'Bidirectional',
        'FreehandRoi',
        'Eraser',
        // Scroll
        { name: 'StackScrollMouseWheel', mode: 'active' },
        // Touch
        { name: 'PanMultiTouch', mode: 'active' },
        { name: 'ZoomTouchPinch', mode: 'active' },
        { name: 'StackScrollMultiTouch', mode: 'active' },
    ],
    imageIds: [
        'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.9.dcm',
        'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.10.dcm',
        'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm',
    ],
    // FORM
    activeTool: 'Wwwc',
    imageIdIndex: 0,
    isPlaying: false,
    frameRate: 22,
};

function Viewer() {
    const [state, setState] = useState(initState);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {state.viewports.map((viewportIndex) => (
                <CornerstoneViewport
                    key={viewportIndex}
                    style={{ minWidth: '50%', height: '256px', flex: '1' }}
                    tools={state.tools}
                    imageIds={state.imageIds}
                    imageIdIndex={state.imageIdIndex}
                    isPlaying={state.isPlaying}
                    frameRate={state.frameRate}
                    className={state.activeViewportIndex === viewportIndex ? 'active' : ''}
                    activeTool={state.activeTool}
                    setViewportActive={() => {
                        setState({
                            ...state,
                            activeViewportIndex: viewportIndex,
                        });
                    }}
                />
            ))}
        </div>
    );
}

export default Viewer;
