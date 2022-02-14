const modalityOptions = [
    'AR',
    'BI',
    'BMD',
    'EPS',
    'CR',
    'CT',
    'DMS',
    'DG',
    'DX',
    'ECG',
    'EEG',
    'EMG',
    'EOG',
    'ES',
    'XC',
    'GM',
    'HD',
    'IO',
    'IVOCT',
    'IVUS',
    'KER',
    'LS',
    'LEN',
    'MR',
    'MG',
    'NM',
    'OAM',
    'OPM',
    'OP',
    'OPT',
    'OPTBSV',
    'OPTENF',
    'OPV',
    'OCT',
    'OSS',
    'PX',
    'POS',
    'PT',
    'RF',
    'RG',
    'RESP',
    'RTIMAGE',
    'SC',
    'SM',
    'SRF',
    'TG',
    'US',
    'BDUS',
    'VA',
    'XA',
];

const dicomOperationTypeOptions = ['C-STORE', 'Query-Retrieve', 'Worklist'];

const dicomServiceProviderTypeOptions = [
    { key: 'Store SCP', label: 'Store SCP' },
    { key: 'Worklist SCP', label: 'Worklist SCP' },
    { key: 'QR Modal SCP', label: 'QR Modal SCP' },
    { key: 'Storage Commitment SCP', label: 'Storage Commitment SCP' },
];

const cStoreJobTypeOptions = [
    'None Job',
    'CStoreFileSave',
    'CStoreFileSave -> DicomToThumbnail',
    'CStoreFileSave -> DicomToThumbnail -> RoutingDicom',
    'RoutingDicom',
    'RoutingDicomAfterDeleteFile',
    'CUHKCustomzedPID -> RoutingDicomAfterDeleteFile',
];

const booleanStringOptions = ['True', 'False'];

const compressQualityOptions = ['HIGH', 'MIDDLE', 'LOW'];

const wlmQryPatternOptions = ['Database', 'HIS SDK'];

export const StaticOptionMapper = {
    modality: modalityOptions,
    dicomOperationType: dicomOperationTypeOptions,
    dicomServiceProviderType: dicomServiceProviderTypeOptions,
    cStoreJobType: cStoreJobTypeOptions,
    booleanStringType: booleanStringOptions,
    compressQuality: compressQualityOptions,
    wlmQryPattern: wlmQryPatternOptions,
};
