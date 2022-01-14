import { useEffect, useState } from 'react';

import cornerstoneTools from 'cornerstone-tools';

import { cornerstoneEx as cornerstone } from '../../Components/CornerstoneViewport/interface/cornerstone-extend';

const addToBeginning = true;
const priority = -5;
const requestType = 'interaction';

export const useCornerstoneLoadImage = (viewPortElement, initialViewport, imageIdList, imageId, imageIdIndex) => {
    const [error, setError] = useState<any>(null);
    const [recordImageIdList, setRecordImageIdList] = useState<string[]>([]);

    // Update image if imageIds has changed
    useEffect(() => {
        if (!viewPortElement) return;

        // if image list is same, skip update
        if (JSON.stringify(recordImageIdList) === JSON.stringify(imageIdList)) return;
        setRecordImageIdList(imageIdList);

        // update stack toolstate
        cornerstoneTools.clearToolState(viewPortElement, 'stack');
        cornerstoneTools.addStackStateManager(viewPortElement, ['stack', 'playClip', 'referenceLines']);
        cornerstoneTools.addToolState(viewPortElement, 'stack', {
            imageIds: [...imageIdList],
            currentImageIdIndex: imageIdIndex,
        });

        // reset counter
        setError(null);

        // Load first image in stack
        const requestFn = (renderImageId, options) => {
            return cornerstone.loadAndCacheImage(renderImageId, options).then((image) => {
                if (viewPortElement === null) return;
                cornerstone.displayImage(viewPortElement, image, initialViewport);
            });
        };

        // 1. Load the image using the ImageLoadingPool
        cornerstone.imageLoadPoolManager.addRequest(
            () => requestFn(imageId, { addToBeginning, priority }),
            requestType,
            { imageId },
            priority,
            addToBeginning,
        );
    }, [imageId, imageIdIndex, imageIdList, initialViewport, recordImageIdList, viewPortElement]);

    return { error };
};
