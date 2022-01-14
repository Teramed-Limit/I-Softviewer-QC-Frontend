import React, { PureComponent } from 'react';

import cornerstone from 'cornerstone-core';

import './ViewportOverlay.scss';
import { helpers } from '../helpers';

const { formatPN, formatDA, formatNumberPrecision, formatTM, isValidNumber } = helpers;

function getCompression(imageId) {
    const generalImageModule = cornerstone.metaData.get('generalImageModule', imageId) || {};
    const { lossyImageCompression, lossyImageCompressionRatio, lossyImageCompressionMethod } = generalImageModule;

    if (lossyImageCompression === '01' && lossyImageCompressionRatio !== '') {
        const compressionMethod = lossyImageCompressionMethod || 'Lossy: ';
        const compressionRatio = formatNumberPrecision(lossyImageCompressionRatio, 2);
        return `${compressionMethod + compressionRatio} : 1`;
    }

    return 'Lossless / Uncompressed';
}

interface Props {
    scale: number;
    windowWidth: number | string;
    windowCenter: number | string;
    imageId: string;
    imageIndex: number;
    stackSize: number;
}

class ViewportOverlay extends PureComponent<Props> {
    render() {
        const { imageId, scale, windowWidth, windowCenter } = this.props;

        if (!imageId) {
            return null;
        }

        const zoomPercentage = formatNumberPrecision(scale * 100, 0);
        const seriesMetadata = cornerstone.metaData.get('generalSeriesModule', imageId) || {};
        const imagePlaneModule = cornerstone.metaData.get('imagePlaneModule', imageId) || {};
        const { rows, columns, sliceThickness, sliceLocation } = imagePlaneModule;
        const { seriesNumber, seriesDescription } = seriesMetadata;

        const generalStudyModule = cornerstone.metaData.get('generalStudyModule', imageId) || {};
        const { studyDate, studyTime, studyDescription } = generalStudyModule;

        const patientModule = cornerstone.metaData.get('patientModule', imageId) || {};
        const { patientId, patientName } = patientModule;

        const generalImageModule = cornerstone.metaData.get('generalImageModule', imageId) || {};
        const { instanceNumber } = generalImageModule;

        const cineModule = cornerstone.metaData.get('cineModule', imageId) || {};
        const { frameTime } = cineModule;

        const frameRate = formatNumberPrecision(1000 / frameTime, 1) || 24;
        const compression = getCompression(imageId);

        let wwwc;
        if (typeof windowWidth === 'string' && typeof windowCenter === 'string') {
            wwwc = `W: ${windowWidth} L: ${windowCenter}`;
        } else if (typeof windowWidth === 'number' && typeof windowCenter === 'number') {
            wwwc = `W: ${windowWidth.toFixed(0)} 
                      L: ${windowCenter.toFixed(0)}`;
        }

        const imageDimensions = `${columns} x ${rows}`;

        const { imageIndex, stackSize } = this.props;

        const normal = (
            <>
                <div className="top-left overlay-element">
                    <div>{formatPN(patientName)}</div>
                    <div>{patientId}</div>
                </div>
                <div className="top-right overlay-element">
                    <div>{studyDescription}</div>
                    <div>
                        {formatDA(studyDate)} {formatTM(studyTime)}
                    </div>
                </div>
                <div className="bottom-right overlay-element">
                    <div>Zoom: {zoomPercentage}%</div>
                    <div>{wwwc}</div>
                    <div className="compressionIndicator">{compression}</div>
                </div>
                <div className="bottom-left overlay-element">
                    <div>{seriesNumber >= 0 ? `Ser: ${seriesNumber}` : ''}</div>
                    <div>{stackSize > 1 ? `Img: ${instanceNumber} ${imageIndex}/${stackSize}` : ''}</div>
                    <div>
                        {frameRate >= 0 ? `${formatNumberPrecision(frameRate, 2)} FPS` : ''}
                        <div>{imageDimensions}</div>
                        <div>
                            {isValidNumber(sliceLocation) ? `Loc: ${formatNumberPrecision(sliceLocation, 2)} mm ` : ''}
                            {sliceThickness ? `Thick: ${formatNumberPrecision(sliceThickness, 2)} mm` : ''}
                        </div>
                        <div>{seriesDescription}</div>
                    </div>
                </div>
            </>
        );

        return <div className="ViewportOverlay">{normal}</div>;
    }
}

export default ViewportOverlay;
