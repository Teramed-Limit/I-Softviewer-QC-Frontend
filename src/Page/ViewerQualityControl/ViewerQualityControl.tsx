import React from 'react';

import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import { useDicom } from '../../hooks/useDicom';

const ViewerQualityControl = () => {
    const { studyInsUID } = useParams<{ studyInsUID: string }>();
    const { dcmUrlList } = useDicom(studyInsUID);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f2742', p: '6px' }}>
            <DicomViewer imageIds={dcmUrlList} />
        </Box>
    );
};

export default ViewerQualityControl;
