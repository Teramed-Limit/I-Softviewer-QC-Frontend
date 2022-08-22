import React, { useCallback, useEffect, useState } from 'react';

import { Pagination } from '@mui/material';
import cx from 'classnames';
import cornerstone, { Viewport } from 'cornerstone-core';

import { http } from '../../api/axios';
import { useDicomMeasurement } from '../../hooks/useDicomMeasurement';
import { MeasurementDTO, NewImageEvent, RenderImage } from '../../interface/cornerstone-viewport-event';
import { DicomImage } from '../../interface/dicom-data';
import { isEmptyOrNil } from '../../utils/general';
import CornerstoneViewport from '../CornerstoneViewport/CornerstoneViewport';
import DicomViewerToolbar from '../DicomViewerToolbar/DicomViewerToolbar';
import classes from './DicomViewer.module.scss';

interface Props {
    imageIds: string[];
    imageLookup?: Record<string, DicomImage>;
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

function DicomViewer({ imageIds, imageLookup = {} }: Props) {
    const [row, setRow] = useState(2);
    const [col, setCol] = useState(2);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(Math.ceil(imageIds.length / 2 / 2));
    const [displayImageIds, setDisplayImageIds] = useState<string[]>([]);
    const [initViewport] = useState<Viewport>({});
    const [renderImages, setRenderImages] = useState<{ [keys: string]: RenderImage }>({});
    const [activeViewportIndex, setActiveViewportIndex] = useState(0);
    const [activeViewport, setActiveViewport] = useState<RenderImage>();
    const [activeTool, setActiveTool] = useState('Wwwc');

    // Dicom measurement
    const measurementLookup: Record<string, MeasurementDTO[]> = {};
    Object.entries(imageLookup).forEach(
        ([k, v]) => (measurementLookup[k] = v.measurementData ? JSON.parse(v.measurementData) : []),
    );
    const { imageIdMeasurementList, placeMeasurement, onMeasurementModified, onMeasurementRemoved } =
        useDicomMeasurement(measurementLookup);

    const changeLayout = (selRow: number, selCol: number) => {
        setRow(selRow);
        setCol(selCol);
        setPageCount(Math.ceil(imageIds.length / selRow / selCol));
        setPage(1);
        onPageSelect(1, selRow * selCol);
    };

    const saveMeasurement = useCallback(() => {
        if (!activeViewport) return;
        const measurementData = imageIdMeasurementList[activeViewport.image.imageId];
        const sopInstanceUid = imageLookup[activeViewport.image.imageId].sopInstanceUID;
        if (!sopInstanceUid || !measurementData) return;
        http.post(`/dicomMeasurement/sopInstanceUid/${sopInstanceUid}`, {
            measurementData: JSON.stringify(measurementData),
        }).subscribe();
    }, [activeViewport, imageIdMeasurementList, imageLookup]);

    const onPageSelect = useCallback(
        (pageNumber: number, displayCount: number) => {
            const chunks: string[][] = [];
            for (let i = 0; i < imageIds.length; i += displayCount) {
                const chunk = imageIds.slice(i, i + displayCount);
                chunks.push(chunk);
            }
            setPage(pageNumber);
            setDisplayImageIds(chunks[pageNumber - 1]);
        },
        [imageIds],
    );

    const onViewportActive = useCallback(
        (index) => {
            setActiveViewportIndex(index);
            if (renderImages[index]) setActiveViewport(renderImages[index]);
        },
        [renderImages],
    );

    const onNewImage = useCallback(
        (event: CustomEvent<NewImageEvent>, viewportIndex) => {
            // wwwcSynchronizer.add(viewPortElement.element);
            cornerstone.reset(event.detail.element);
            setRenderImages((list) => {
                return {
                    ...list,
                    [viewportIndex]: {
                        viewportIndex,
                        element: event.detail.element,
                        canvas: event.detail.enabledElement.canvas,
                        image: event.detail.image,
                        viewport: event.detail.viewport,
                    } as RenderImage,
                };
            });

            // place measurement
            placeMeasurement(event.detail.image.imageId, event.detail.element);
        },
        [placeMeasurement],
    );

    useEffect(() => {
        if (isEmptyOrNil(imageIds)) return;
        onPageSelect(1, 4);
    }, [imageIds, onPageSelect]);

    return (
        <>
            <DicomViewerToolbar
                row={row}
                col={col}
                activeImage={activeViewport}
                activeTool={activeTool}
                changeLayout={changeLayout}
                saveMeasurement={saveMeasurement}
                setActiveTool={setActiveTool}
            />
            <div className={classes.viewer}>
                <div
                    className={classes.grid}
                    style={{
                        gridTemplateRows: `repeat(${row}, ${100 / row}%)`,
                        gridTemplateColumns: `repeat(${col}, ${100 / col}%)`,
                    }}
                >
                    {displayImageIds.map((imageId, viewportIndex) => (
                        <CornerstoneViewport
                            key={viewportIndex}
                            className={cx(classes.viewport, {
                                [classes.active]: activeViewportIndex === viewportIndex,
                            })}
                            style={{
                                height: `${100}%`,
                                flex: `1 1 auto`,
                                padding: '2px',
                                border: '2px #666060 solid',
                            }}
                            viewPortIndex={viewportIndex}
                            tools={tools}
                            imageIds={[imageId]}
                            isPlaying={false}
                            frameRate={22}
                            activeTool={activeTool}
                            setViewportActive={onViewportActive}
                            initialViewport={initViewport}
                            onNewImageCallBack={onNewImage}
                            onMeasurementModified={onMeasurementModified}
                            onMeasurementRemoved={onMeasurementRemoved}
                        />
                    ))}
                </div>
            </div>
            <Pagination
                className={classes.pagination}
                boundaryCount={3}
                siblingCount={3}
                page={page}
                count={pageCount}
                color={'neutral' as any}
                onChange={(event, pageNum: number) => onPageSelect(pageNum, row * col)}
            />
        </>
    );
}

export default DicomViewer;
