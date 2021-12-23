import React from 'react';

import cx from 'classnames';
import { EnabledElement, EVENTS, Viewport, Image } from 'cornerstone-core';
import CornerstoneViewport from 'react-cornerstone-viewport';

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
    'Eraser',
];

interface Props {
    viewportIndex: number;
    width: string;
    height: string;
    imageId: string;
    isActive: boolean;
    activeTool: string;
    setActiveViewportIndex: (index: number) => void;
    registerRenderImage: (viewPortElement: ViewPortElement) => void;
}

const DicomViewport = ({
    width,
    height,
    imageId,
    viewportIndex,
    isActive,
    activeTool,
    setActiveViewportIndex,
    registerRenderImage,
}: Props) => {
    const onNewImage = (event: { detail: { viewport: Viewport; image: Image; enabledElement: EnabledElement } }) => {
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
                maxWidth: width,
                minWidth: width,
                height,
                maxHeight: height,
                flex: '1 1 auto',
                border: '3px black solid',
            }}
            tools={tools}
            imageIds={[imageId]}
            imageIdIndex={0}
            isPlaying={false}
            frameRate={22}
            activeTool={activeTool}
            setViewportActive={() => setActiveViewportIndex(viewportIndex)}
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
