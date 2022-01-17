import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import cx from 'classnames';
import cornerstone, { Viewport } from 'cornerstone-core';

// import cornerstoneTools from 'cornerstone-tools';
import BaseModal from '../../Container/BaseModal/BaseModal';
import { useResize } from '../../hooks/useResize';
import { CornerstoneViewportEvent, NewImageEvent } from '../../interface/cornerstone-viewport-event';
import { ViewPortElement } from '../../interface/dicom-viewport';
import CornerstoneViewport from '../CornerstoneViewport/CornerstoneViewport';
import DicomTag from '../DicomTag/DicomTag';
import DicomViewerToolbar from '../DicomViewerToolbar/DicomViewerToolbar';
import classes from './DicomViewer.module.scss';

interface Props {
    imageIds: string[];
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
    // Scroll
    // { name: 'StackScrollMouseWheel', mode: 'active' },
];

function DicomViewer({ imageIds }: Props) {
    const viewerRef = React.useRef<HTMLDivElement>(null);

    const [initViewport] = useState<Viewport>({});
    const [renderImages, setRenderImages] = useState({});
    const [activeViewportIndex, setActiveViewportIndex] = useState(0);
    const [activeTool, setActiveTool] = useState('Wwwc');
    const [viewerHeight, setViewerHeight] = useState(0);
    const [row, setRow] = useState(2);
    const [col, setCol] = useState(2);
    const [openModal, setModalOpen] = React.useState(false);

    useEffect(() => {
        setRenderImages({});
    }, [imageIds]);

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

        if (viewerRef.current === null) return;
        setViewerHeight(viewerRef.current.offsetHeight);
    };

    const resetViewport = () => {
        const renderImage = renderImages[activeViewportIndex] as ViewPortElement;
        if (renderImage === undefined) return;
        cornerstone.reset(renderImage.element);
    };

    const onViewportActive = useCallback((index) => {
        setActiveViewportIndex(index);
    }, []);

    const onNewImage = useCallback((event: CornerstoneViewportEvent<NewImageEvent>, viewportIndex) => {
        // wwwcSynchronizer.add(viewPortElement.element);
        setRenderImages((list) => {
            return {
                ...list,
                [viewportIndex]: {
                    viewportIndex,
                    element: event.detail.element,
                    canvas: event.detail.enabledElement.canvas,
                    image: event.detail.image,
                    viewport: event.detail.viewport,
                },
            };
        });
    }, []);

    return (
        <>
            <DicomViewerToolbar
                row={row}
                col={col}
                activeTool={activeTool}
                changeLayout={changeLayout}
                resetViewport={resetViewport}
                openModal={setModalOpen}
                setActiveTool={setActiveTool}
            />
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
                                padding: '4px',
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
                                            border: '3px rgb(32,165,214,0.3) solid',
                                            borderRadius: '6px',
                                        }}
                                        viewerElement={viewerRef.current}
                                        viewPortIndex={viewportIndex}
                                        tools={tools}
                                        imageIds={[imageId]}
                                        // imageIds={imageIds}
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
            <BaseModal open={openModal} setOpen={setModalOpen}>
                <DicomTag image={renderImages[activeViewportIndex]?.image} />
            </BaseModal>
        </>
    );
}

export default DicomViewer;
