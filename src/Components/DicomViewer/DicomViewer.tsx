import React, { useEffect, useLayoutEffect, useState } from 'react';

import cornerstone from 'cornerstone-core';
// import cornerstoneTools from 'cornerstone-tools';

import BaseModal from '../../Container/BaseModal/BaseModal';
import { useResize } from '../../hooks/useResize';
import { ViewPortElement } from '../../interface/dicom-viewport';
import { deepCopy } from '../../utils/general';
import DicomTag from '../DicomTag/DicomTag';
import DicomViewerToolbar from '../DicomViewerToolbar/DicomViewerToolbar';
import DicomViewport from '../DicomViewport/DicomViewport';
import classes from './DicomViewer.module.scss';

interface Props {
    imageIds: string[];
}

// Create the synchronizer
// const wwwcSynchronizer = new cornerstoneTools.Synchronizer(
//     'cornerstoneimagerendered',
//     cornerstoneTools.wwwcSynchronizer,
// );

function DicomViewer({ imageIds }: Props) {
    const viewerRef = React.useRef<HTMLDivElement>(null);

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

    const onCanvasWheel = (event) => {
        if (viewerRef.current === null) return;
        viewerRef.current.scroll({
            top: viewerRef.current.scrollTop + (event.deltaY < 0 ? -100 : 100),
            behavior: 'auto',
        });
    };

    const registerRenderImage = (viewPortElement: ViewPortElement) => {
        // wwwcSynchronizer.add(viewPortElement.element);
        viewPortElement.canvas?.addEventListener('wheel', onCanvasWheel, false);
        setRenderImages((list) => {
            return { ...list, [viewPortElement.viewportIndex]: viewPortElement };
        });
    };

    const resetViewport = () => {
        const renderImage = renderImages[activeViewportIndex] as ViewPortElement;
        if (renderImage === undefined) return;

        cornerstone.setViewport(renderImage.element, deepCopy(renderImage.initViewport));
        cornerstone.fitToWindow(renderImage.element);
    };

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
                            {viewerHeight && (
                                <DicomViewport
                                    viewportIndex={viewportIndex}
                                    isActive={activeViewportIndex === viewportIndex}
                                    imageId={imageId}
                                    activeTool={activeTool}
                                    setActiveViewportIndex={setActiveViewportIndex}
                                    registerRenderImage={registerRenderImage}
                                />
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
