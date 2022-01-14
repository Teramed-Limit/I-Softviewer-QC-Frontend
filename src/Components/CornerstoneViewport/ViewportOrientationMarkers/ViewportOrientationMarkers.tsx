import React, { PureComponent } from 'react';

import cornerstoneTools from 'cornerstone-tools';

import './ViewportOrientationMarkers.scss';
import { cornerstoneEx as cornerstone } from '../interface/cornerstone-extend';

/**
 *
 * Computes the orientation labels on a Cornerstone-enabled Viewport element
 * when the viewport settings change (e.g. when a horizontal flip or a rotation occurs)
 *
 * @param {*} rowCosines
 * @param {*} columnCosines
 * @param {*} rotationDegrees
 * @param {*} isFlippedVertically
 * @param {*} isFlippedHorizontally
 * @returns
 */
function getOrientationMarkers(rowCosines, columnCosines, rotationDegrees, isFlippedVertically, isFlippedHorizontally) {
    const { getOrientationString, invertOrientationString } = cornerstoneTools.orientation;
    const rowString = getOrientationString(rowCosines);
    const columnString = getOrientationString(columnCosines);
    const oppositeRowString = invertOrientationString(rowString);
    const oppositeColumnString = invertOrientationString(columnString);

    const markers = {
        top: oppositeColumnString,
        left: oppositeRowString,
        right: rowString,
        bottom: columnString,
    };

    // If any vertical or horizontal flips are applied, change the orientation strings ahead of
    // the rotation applications
    if (isFlippedVertically) {
        markers.top = invertOrientationString(markers.top);
        markers.bottom = invertOrientationString(markers.bottom);
    }

    if (isFlippedHorizontally) {
        markers.left = invertOrientationString(markers.left);
        markers.right = invertOrientationString(markers.right);
    }

    // Swap the labels accordingly if the viewport has been rotated
    // This could be done in a more complex way for intermediate rotation values (e.g. 45 degrees)
    if (rotationDegrees === 90 || rotationDegrees === -270) {
        return {
            top: markers.left,
            left: invertOrientationString(markers.top),
            right: invertOrientationString(markers.bottom),
            bottom: markers.right, // left
        };
    }
    if (rotationDegrees === -90 || rotationDegrees === 270) {
        return {
            top: invertOrientationString(markers.left),
            left: markers.top,
            bottom: markers.left,
            right: markers.bottom,
        };
    }
    if (rotationDegrees === 180 || rotationDegrees === -180) {
        return {
            top: invertOrientationString(markers.top),
            left: invertOrientationString(markers.left),
            bottom: invertOrientationString(markers.bottom),
            right: invertOrientationString(markers.right),
        };
    }

    return markers;
}

interface Props {
    imageId: string;
    rotationDegrees: number;
    isFlippedVertically: boolean;
    isFlippedHorizontally: boolean;
    orientationMarkers: string[];
}

class ViewportOrientationMarkers extends PureComponent<Props> {
    static defaultProps = {
        orientationMarkers: ['top', 'left'],
    };

    render() {
        const { imageId, rotationDegrees, isFlippedVertically, isFlippedHorizontally, orientationMarkers } = this.props;

        if (!imageId) {
            return null;
        }

        const { rowCosines, columnCosines } = cornerstone.metaData.get('imagePlaneModule', imageId) || {
            rowCosines: [],
            columnCosines: [],
        };

        if (!rowCosines || !columnCosines) {
            return null;
        }

        const markers = getOrientationMarkers(
            rowCosines,
            columnCosines,
            rotationDegrees,
            isFlippedVertically,
            isFlippedHorizontally,
        );

        const getMarkers = (oriMarkers) =>
            oriMarkers.map((m) => (
                <div className={`${m}-mid orientation-marker`} key={`${m}-mid orientation-marker`}>
                    {markers[m]}
                </div>
            ));

        return <div className="ViewportOrientationMarkers noselect">{getMarkers(orientationMarkers)}</div>;
    }
}

export default ViewportOrientationMarkers;
