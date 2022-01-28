import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import { Viewport } from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import debounce from 'lodash.debounce';
import ReactResizeDetector from 'react-resize-detector';

import { useBindCornerstoneElementEvent } from '../../hooks/cornerstone/useBindCornerstoneElementEvent';
import { useBindCornerstoneEvent } from '../../hooks/cornerstone/useBindCornerstoneEvent';
import { useCornerstoneLoadImage } from '../../hooks/cornerstone/useCornerstoneLoadImage';
import { useCornerstoneToolStateLoadHandler } from '../../hooks/cornerstone/useCornerstoneToolStateLoadHandler';
import { useRegisterCornerstoneTools } from '../../hooks/cornerstone/useRegisterCornerstoneTools';
import {
    CanvasMouseWheelEvent,
    CornerstoneViewportEvent,
    ImageProgressEvent,
    ImageRenderedEvent,
} from '../../interface/cornerstone-viewport-event';
import ImageScrollbar from './ImageScrollbar/ImageScrollbar';
import { cornerstoneEx as cornerstone } from './interface/cornerstone-extend';
import LoadingIndicator from './LoadingIndicator/LoadingIndicator';
import ViewportOrientationMarkers from './ViewportOrientationMarkers/ViewportOrientationMarkers';
import ViewportOverlay from './ViewportOverlay/ViewportOverlay';

import './CornerstoneViewport.scss';

const requestType = 'interaction';
const scrollToIndex = cornerstoneTools.importInternal('util/scrollToIndex');

interface Props {
    // unique index
    viewPortIndex: number;
    // container element
    viewerElement: HTMLElement;
    // imageUrl list
    imageIds: string[];
    // initial viewport
    initialViewport?: Viewport;
    // enable Webgl render
    enableWebgl?: boolean;
    // marker tools
    tools?: any;
    activeTool?: string;
    // marker direction
    orientationMarkers?: string[];
    // should show overlay
    isOverlayVisible?: boolean;
    // should prefetch
    isStackPrefetchEnabled?: boolean;
    // CINE
    isPlaying: boolean;
    frameRate: number; // Between 1 and ?
    // Called when viewport should be set to active
    setViewportActive: (viewPortIndex: number) => void;
    // Cornerstone Events
    onNewImageCallBack?: (event, viewportIndex) => void;
    onElementEnabled?: (event) => void;
    onElementDisable?: (event) => void;
    startLoadHandler?: (element) => void;
    endLoadHandler?: (element, image) => void;
    /** false to enable automatic viewport resizing */
    enableResizeDetector?: boolean;
    /** rate at witch to apply resize mode's logic */
    resizeRefreshRateMs?: number;
    /** whether resize refresh behavior is exhibited as throttle or debounce */
    resizeRefreshMode?: 'throttle' | 'debounce';
    // miscellaneous
    style?: any;
    className?: string;
    children?: React.ReactNode;
    loadIndicatorDelay?: number;
    onNewImageDebounceTime?: number;
}

function CornerstoneViewport({
    viewerElement,
    imageIds,
    viewPortIndex,
    activeTool,
    tools = [],
    children,
    enableWebgl = false,
    isStackPrefetchEnabled = false,
    isPlaying = false,
    frameRate,
    initialViewport = undefined,
    setViewportActive,
    onNewImageCallBack = undefined,
    onNewImageDebounceTime = 0,
    onElementEnabled = undefined,
    onElementDisable = undefined,
    startLoadHandler,
    endLoadHandler,
    loadIndicatorDelay = 45,
    enableResizeDetector = true,
    resizeRefreshRateMs = 200,
    resizeRefreshMode = 'debounce',
    style,
    className,
    orientationMarkers = ['top', 'left'],
    isOverlayVisible = true,
}: Props) {
    const element = useRef<HTMLDivElement>(null);
    // Viewport state
    const [viewPortElement, setEnableElement] = useState<HTMLDivElement>();
    const [imageIdList] = useState(imageIds);
    const [imageId] = useState(imageIds[0]);
    const [imageIdIndex, setImageIdIndex] = useState(0);
    const [imageProgress, setImageProgress] = useState(0);
    const [, setNumImagesLoaded] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    // Overlay
    const [scale, setScale] = useState(1);
    const [windowWidth, setWindowWidth] = useState(255);
    const [windowCenter, setWindowCenter] = useState(127);
    // Orientation Markers
    const [rotationDegree, setRotationDegree] = useState(0);
    const [isFlippedVertically, setIsFlippedVertically] = useState<boolean>(false);
    const [isFlippedHorizontally, setIsFlippedHorizontally] = useState<boolean>(false);

    // image loader load
    const onImageLoaded = useCallback(() => {
        if (!element.current) return;
        // We need better cache reporting a layer up
        setNumImagesLoaded((preValue) => preValue + 1);
        setImageProgress(100);
    }, []);

    // xhr request
    const onImageLoadProgress = useCallback((event: CornerstoneViewportEvent<ImageProgressEvent>) => {
        if (!element.current) return;
        setImageProgress(event.detail.percentComplete);
    }, []);

    // cornerstone tools event
    const onViewportActive = useCallback(() => setViewportActive(viewPortIndex), [setViewportActive, viewPortIndex]);

    // image render
    const onNewImage = useMemo(
        () =>
            debounce((event) => {
                if (!element.current) return;

                const newImageId = event.detail.image.imageId;
                const currentImageIdIndex = imageIdList.indexOf(newImageId);
                setImageIdIndex(currentImageIdIndex);

                if (onNewImageCallBack) onNewImageCallBack(event, viewPortIndex);
            }, onNewImageDebounceTime),
        [imageIdList, onNewImageCallBack, onNewImageDebounceTime, viewPortIndex],
    );

    // image draw complete
    const onImageRendered = useCallback((event: CornerstoneViewportEvent<ImageRenderedEvent>) => {
        if (!element.current) return;
        const { viewport } = event.detail;
        setScale(viewport.scale);
        setWindowWidth(viewport.voi.windowWidth);
        setWindowCenter(viewport.voi.windowCenter);
        setRotationDegree(viewport.rotation);
        setIsFlippedVertically(viewport.vflip);
        setIsFlippedHorizontally(viewport.hflip);
        setIsLoading(false);
    }, []);

    // canvas mouse wheel
    const onCanvasWheel = useCallback(
        (event: CornerstoneViewportEvent<CanvasMouseWheelEvent>) => {
            viewerElement.scroll({
                top: viewerElement.scrollTop + (event.detail.detail.deltaY < 0 ? -100 : 100),
                behavior: 'auto',
            });
        },
        [viewerElement],
    );

    const imageSliderOnInputCallback = useCallback(
        (value) => {
            if (!element.current) return;
            setViewportActive(viewPortIndex);
            scrollToIndex(element.current, value);
        },
        [setViewportActive, viewPortIndex],
    );

    const onResize = useCallback(() => {
        if (!element.current) return;
        cornerstone.resize(element.current);
    }, []);

    // Enable element
    useEffect(() => {
        if (element.current === null || element.current === viewPortElement) return;

        cornerstone.enable(element.current, enableWebgl ? { renderer: 'webgl' } : {});
        setEnableElement(element.current);

        return () => {
            if (!viewPortElement) return;

            if (isStackPrefetchEnabled) {
                cornerstoneTools.stackPrefetch.disable(viewPortElement);
            }

            cornerstoneTools.clearToolState(viewPortElement, 'stackPrefetch');
            cornerstoneTools.stopClip(viewPortElement);
            cornerstone.imageLoadPoolManager.clearRequestStack(requestType);
            cornerstone.imageLoadPoolManager.destroy();
            cornerstone.disable(viewPortElement);
        };
    }, [enableWebgl, isStackPrefetchEnabled, viewPortElement]);

    // Binding event
    useBindCornerstoneElementEvent(viewPortElement, onNewImage, onImageRendered, onViewportActive, onCanvasWheel);
    useBindCornerstoneEvent(
        viewPortElement,
        onElementEnabled,
        onElementDisable,
        onImageLoadProgress,
        onImageLoaded,
        setIsLoading,
    );
    useCornerstoneToolStateLoadHandler(
        viewPortElement,
        startLoadHandler,
        endLoadHandler,
        loadIndicatorDelay,
        setIsLoading,
    );

    // Fetch and load image
    const { error } = useCornerstoneLoadImage(viewPortElement, initialViewport, imageIdList, imageId, imageIdIndex);

    // Register using tools
    useRegisterCornerstoneTools(viewPortElement, tools, activeTool);

    // Update when StackPrefetch enabled
    useEffect(() => {
        if (!viewPortElement) return;
        if (isStackPrefetchEnabled) cornerstoneTools.stackPrefetch.enable(viewPortElement);
    }, [isStackPrefetchEnabled, viewPortElement]);

    // Update clip
    useEffect(() => {
        if (!viewPortElement) return;
        if (isPlaying) {
            const validFrameRate = Math.max(frameRate, 1);
            cornerstoneTools.playClip(viewPortElement, validFrameRate);
        }
    }, [viewPortElement, frameRate, isPlaying, isStackPrefetchEnabled]);

    useEffect(() => {
        return () => onNewImage.cancel();
    }, [onNewImage]);

    return (
        <div style={style} className={classNames('viewport-wrapper', className)}>
            {enableResizeDetector && element.current != null && (
                <ReactResizeDetector
                    handleWidth
                    handleHeight
                    skipOnMount
                    refreshMode={resizeRefreshMode}
                    refreshRate={resizeRefreshRateMs}
                    onResize={onResize}
                    targetDomEl={element.current}
                />
            )}
            <div
                ref={element}
                className="viewport-element"
                onContextMenu={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}
            >
                {(isLoading || error) && <LoadingIndicator error={error} percentComplete={imageProgress} />}
                {/* This classname is important in that it tells `cornerstone` to not
                 * create a new canvas element when we "enable" the `viewport-element`
                 */}
                <canvas className="cornerstone-canvas" />
                {/* Overlay */}
                {imageId && isOverlayVisible && (
                    <ViewportOverlay
                        imageIndex={imageIdIndex + 1}
                        stackSize={imageIdList.length}
                        scale={scale}
                        windowWidth={windowWidth}
                        windowCenter={windowCenter}
                        imageId={imageId}
                    />
                )}
                {/* Orientation Markers */}
                <ViewportOrientationMarkers
                    imageId={imageId}
                    rotationDegrees={rotationDegree}
                    isFlippedVertically={isFlippedVertically}
                    isFlippedHorizontally={isFlippedHorizontally}
                    orientationMarkers={orientationMarkers}
                />
            </div>
            {viewPortElement && (
                <ImageScrollbar
                    onInputCallback={imageSliderOnInputCallback}
                    max={imageIdList.length - 1}
                    height={`${viewPortElement.clientHeight - 20}px`}
                    value={imageIdIndex}
                />
            )}
            {children}
        </div>
    );
}

export default React.memo(CornerstoneViewport);
