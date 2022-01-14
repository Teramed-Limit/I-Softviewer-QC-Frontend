import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

const { getNumberValue, getValue } = cornerstoneWADOImageLoader.wadors.metaData;

export function wadoRsMetaDataProvider(type, imageId) {
    const metaData = cornerstoneWADOImageLoader.wadors.metaDataManager.get(imageId);

    if (!metaData) {
        return;
    }

    if (metaData[type] !== undefined && metaData[type].Value !== undefined && metaData[type].Value.length) {
        return metaData[type].Value[0];
    }

    const typeCleaned = type.replace('x', '');
    if (
        metaData[typeCleaned] !== undefined &&
        metaData[typeCleaned].Value !== undefined &&
        metaData[typeCleaned].Value.length
    ) {
        return metaData[typeCleaned].Value[0];
    }

    if (type === 'generalImageModule') {
        return {
            sopInstanceUid: getValue(metaData['00080018']),
            instanceNumber: getNumberValue(metaData['00200013']),
            lossyImageCompression: getValue(metaData['00282110']),
            lossyImageCompressionRatio: getValue(metaData['00282112']),
            lossyImageCompressionMethod: getValue(metaData['00282114']),
        };
    }

    if (type === 'patientModule') {
        return {
            patientName: getValue(metaData['00100010']),
            patientId: getValue(metaData['00100020']),
            patientSex: getValue(metaData['00100040']),
            patientBirthDate: getValue(metaData['00100030']),
        };
    }

    if (type === 'spacingBetweenSlices') {
        return getValue(metaData['00180088']);
    }

    if (type === 'generalStudyModule') {
        return {
            studyDescription: getValue(metaData['00081030']),
            studyDate: getValue(metaData['00080020']),
            studyTime: getValue(metaData['00080030']),
            accessionNumber: getValue(metaData['00080050']),
        };
    }

    if (type === 'cineModule') {
        return {
            frameTime: getNumberValue(metaData['00181063']),
        };
    }
}
