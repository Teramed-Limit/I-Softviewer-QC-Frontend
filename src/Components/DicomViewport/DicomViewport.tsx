import React, { useState } from 'react';

import cx from 'classnames';
import { EVENTS, Viewport } from 'cornerstone-core';
import CornerstoneViewport from 'react-cornerstone-viewport';

import { CornerstoneViewportEvent } from '../../interface/cornerstone-viewport-event';
import { ViewPortElement } from '../../interface/dicom-viewport';
import { deepCopy } from '../../utils/general';
import classes from './DicomViewport.module.scss';

// mouseButtonMask
// 1 : Left-mouse click
// 2 : Right-mouse click
// 4 : middle-mouse click

const tools = [
    {
        name: 'Wwwc',
        mode: 'active',
        modeOptions: { mouseButtonMask: 1 },
    },
    'DoubleTapFitToWindow',
    'Zoom',
    'Pan',
    'Magnify',
    'Length',
    'Probe',
    'Angle',
    'Bidirectional',
    'FreehandRoi',
    'Eraser',
    'EllipticalRoi',
    'RectangleRoi',
];

interface Props {
    viewportIndex: number;
    imageId: string;
    isActive: boolean;
    activeTool: string;
    setActiveViewportIndex: (index: number) => void;
    registerRenderImage: (viewPortElement: ViewPortElement) => void;
}

const DicomViewport = ({
    imageId,
    viewportIndex,
    isActive,
    activeTool,
    setActiveViewportIndex,
    registerRenderImage,
}: Props) => {
    const [initViewport] = useState<Viewport>({
        // voi: { windowWidth: 128, windowCenter: 128 },
    });
    const onNewImage = (event: CornerstoneViewportEvent) => {
        const { viewport, image, enabledElement } = event.detail;
        registerRenderImage({
            viewportIndex,
            element: enabledElement.element,
            canvas: enabledElement.canvas,
            image,
            viewport,
            initViewport: deepCopy(viewport),
        });
    };

    return (
        <CornerstoneViewport
            className={cx(classes.viewport, {
                [classes.active]: isActive,
            })}
            style={{
                height: '100%',
                border: '3px rgb(32,165,214,0.3) solid',
                borderRadius: '6px',
            }}
            tools={tools}
            imageIds={[imageId]}
            imageIdIndex={0}
            isPlaying={false}
            frameRate={22}
            activeTool={activeTool}
            setViewportActive={() => setActiveViewportIndex(viewportIndex)}
            initialViewport={initViewport}
            eventListeners={[
                {
                    target: 'cornerstone',
                    eventName: EVENTS.NEW_IMAGE,
                    handler: onNewImage,
                },
            ]}
            onElementEnabled={() => {}}
        />
    );
};

export default DicomViewport;
