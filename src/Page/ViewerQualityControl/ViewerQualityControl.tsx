import React from 'react';

import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import { useDicom } from '../../hooks/useDicom';
import { isEmptyOrNil } from '../../utils/general';

const ViewerQualityControl = () => {
    const { studyInsUID } = useParams() as { studyInsUID: string };
    const { imageIdList, imageLookup } = useDicom(studyInsUID);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f2742', p: '6px' }}>
            {!isEmptyOrNil(imageIdList) && <DicomViewer imageIds={imageIdList} imageLookup={imageLookup} />}
        </Box>
    );
};

export default ViewerQualityControl;
