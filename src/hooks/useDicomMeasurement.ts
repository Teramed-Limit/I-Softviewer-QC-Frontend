import { useCallback, useState } from 'react';

import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import * as R from 'ramda';

import { MeasurementDTO, MeasurementModified, MeasurementRemoved } from '../interface/cornerstone-viewport-event';
import { isEmptyOrNil } from '../utils/general';

export const useDicomMeasurement = (lookup: Record<string, MeasurementDTO[]>) => {
    const [imageIdMeasurementList, setImageIdMeasurementList] = useState<Record<string, MeasurementDTO[]>>(lookup);

    const placeMeasurement = useCallback(
        (imageId: string, element: HTMLElement) => {
            imageIdMeasurementList[imageId]?.forEach((measurement) => {
                const toolStateManager = cornerstoneTools.getElementToolStateManager(element);
                toolStateManager.add(element, measurement.toolName, measurement.measurementData);
                cornerstone.updateImage(element);
            });
        },
        [imageIdMeasurementList],
    );

    const onMeasurementModified = useCallback((event: CustomEvent<MeasurementModified>) => {
        setImageIdMeasurementList((imageIdsMeasurement) => {
            // Find image id
            const image = cornerstone.getImage(event.detail.element);
            if (!image) return imageIdsMeasurement;
            // Check imageId exist
            const existMeasurementList = imageIdsMeasurement[image.imageId] || [];
            // New measurement
            const newMeasurement: MeasurementDTO = {
                toolName: event.detail.toolName,
                measurementData: event.detail.measurementData,
            };
            // Find same uuid measurement
            const sameUUID = (x) => x.measurementData.uuid === event.detail.measurementData.uuid;
            const existMeasurementIdx = R.findIndex(sameUUID)(existMeasurementList);
            // Replace existence measurement
            if (existMeasurementIdx !== -1) {
                return {
                    ...imageIdsMeasurement,
                    [image.imageId]: R.update(existMeasurementIdx, newMeasurement, existMeasurementList),
                };
            }
            // Append
            return {
                ...imageIdsMeasurement,
                [image.imageId]: R.append(newMeasurement, existMeasurementList),
            };
        });
    }, []);

    const onMeasurementRemoved = useCallback((event: CustomEvent<MeasurementRemoved>) => {
        setImageIdMeasurementList((imageIdsMeasurement) => {
            // Find image id
            const image = cornerstone.getImage(event.detail.element);
            if (!image) return imageIdsMeasurement;
            // If not exist, return
            const existMeasurementList = imageIdsMeasurement[image.imageId];
            if (isEmptyOrNil(existMeasurementList)) return imageIdsMeasurement;
            // Find same uuid measurement and delete it
            const sameUUID = (x) => x.measurementData.uuid !== event.detail.measurementData.uuid;
            const mutateList = R.filter(sameUUID, existMeasurementList);
            return { ...imageIdsMeasurement, [image.imageId]: mutateList };
        });
    }, []);

    return { imageIdMeasurementList, placeMeasurement, onMeasurementRemoved, onMeasurementModified };
};
