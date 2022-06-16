import React, { useCallback, useLayoutEffect, useState } from 'react';

import cx from 'classnames';
import cornerstone, { Viewport } from 'cornerstone-core';

// import cornerstoneTools from 'cornerstone-tools';
import { ViewerSessionMode } from '../../cornerstone-extend/tools';
import { useResize } from '../../hooks/useResize';
import { CornerstoneViewportEvent, NewImageEvent, RenderImage } from '../../interface/cornerstone-viewport-event';
import CornerstoneViewport from '../CornerstoneViewport/CornerstoneViewport';
import DicomViewerToolbar from '../DicomViewerToolbar/DicomViewerToolbar';
import classes from './DicomViewer.module.scss';

interface Props {
    viewerSessionMode: ViewerSessionMode;
    imageIds: string[];
    externalTools?: React.ReactNode;
}

// Create the synchronizer
// const wwwcSynchronizer = new cornerstoneTools.Synchronizer(
//     'cornerstoneimagerendered',
//     cornerstoneTools.wwwcSynchronizer,
// );

const tools = [
    {
        name: 'Wwwc',
        mode: 'active',
        modeOptions: { mouseButtonMask: 1 },
    },
    // 'DoubleTapFitToWindow',
    // {
    //     name: 'Zoom',
    //     mode: 'active',
    //     modeOptions: { mouseButtonMask: 2 },
    // },
    // {
    //     name: 'Pan',
    //     mode: 'active',
    //     modeOptions: { mouseButtonMask: 4 },
    // },
    // 'Magnify',
    // 'Length',
    // 'Probe',
    // 'Angle',
    // 'Bidirectional',
    // 'FreehandRoi',
    // 'Eraser',
    // 'EllipticalRoi',
    // 'RectangleRoi',
    // // Scroll
    // { name: 'StackScrollMouseWheel', mode: 'active' },
];

const DicomViewer = ({ imageIds, externalTools, viewerSessionMode }: Props) => {
    const viewerRef = React.useRef<HTMLDivElement>(null);

    const [row, setRow] = useState(2);
    const [col, setCol] = useState(2);
    const [initViewport] = useState<Viewport>({});
    const [renderImages, setRenderImages] = useState<{ [keys: string]: RenderImage }>({});
    const [activeViewportIndex, setActiveViewportIndex] = useState(0);
    const [activeViewport, setActiveViewport] = useState<RenderImage>();
    const [activeTool, setActiveTool] = useState('Wwwc');
    const [viewerHeight, setViewerHeight] = useState(0);

    useResize(() => {
        if (viewerRef.current === null) return;
        setViewerHeight(viewerRef.current.offsetHeight);
    }, 0);

    useLayoutEffect(() => {
        if (viewerRef.current === null) return;
        setTimeout(() => {
            if (viewerRef.current === null) return;
            setViewerHeight(viewerRef.current.offsetHeight);
        }, 1000);
    }, []);

    const changeLayout = (selRow: number, selCol: number) => {
        setRow(selRow);
        setCol(selCol);
    };

    const onViewportActive = useCallback(
        (index) => {
            setActiveViewportIndex(index);
            if (renderImages[index]) setActiveViewport(renderImages[index]);
        },
        [renderImages],
    );

    const onNewImage = useCallback((event: CornerstoneViewportEvent<NewImageEvent>, viewportIndex) => {
        // wwwcSynchronizer.add(viewPortElement.element);
        setRenderImages((list) => {
            return {
                ...list,
                [viewportIndex]: {
                    viewportIndex,
                    element: event.detail.element,
                    canvas: event.detail.enabledElement.canvas,
                } as RenderImage,
            };
        });
    }, []);

    const resetViewport = useCallback(() => {
        if (activeViewport === undefined) return;
        cornerstone.reset(activeViewport.element);
    }, [activeViewport]);

    return (
        <>
            <DicomViewerToolbar
                row={row}
                col={col}
                activeTool={activeTool}
                changeLayout={changeLayout}
                setActiveTool={setActiveTool}
                resetViewport={resetViewport}
            >
                {externalTools}
            </DicomViewerToolbar>
            <div className={classes.viewer} ref={viewerRef}>
                <div
                    className={classes.grid}
                    style={{
                        gridTemplateRows: `repeat(${row}, ${100 / row}%)`,
                        gridTemplateColumns: `repeat(${col}, ${100 / col}%)`,
                    }}
                >
                    {imageIds.map((imageId, viewportIndex) => (
                        <div
                            key={imageId}
                            style={{
                                height: `${viewerHeight / row}px`,
                                minHeight: `${viewerHeight / row}px`,
                                maxHeight: `${viewerHeight / row}px`,
                                flex: `1 1 auto`,
                                padding: '2px',
                            }}
                        >
                            {viewerRef.current && viewerHeight !== 0 && (
                                <>
                                    <CornerstoneViewport
                                        className={cx(classes.viewport, {
                                            [classes.active]: activeViewportIndex === viewportIndex,
                                        })}
                                        style={{
                                            height: '100%',
                                            border: '2px #666060 solid',
                                        }}
                                        viewerElement={viewerRef.current}
                                        viewPortIndex={viewportIndex}
                                        viewerSessionMode={viewerSessionMode}
                                        tools={tools}
                                        imageIds={[imageId]}
                                        isPlaying={false}
                                        frameRate={22}
                                        activeTool={activeTool}
                                        setViewportActive={onViewportActive}
                                        initialViewport={initViewport}
                                        onNewImageCallBack={onNewImage}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default DicomViewer;
