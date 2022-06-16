import React from 'react';

import GroupIcon from '@mui/icons-material/Group';
import { Box } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';

import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import IconButton from '../../Components/IconButton/IconButton';
import { ViewerSessionMode } from '../../cornerstone-extend/tools';
import { useDicom } from '../../hooks/useDicom';
import TokenService from '../../services/TokenService';

const ViewerQualityControl = () => {
    const history = useHistory();
    const { studyInsUID } = useParams<{ studyInsUID: string }>();
    const { dcmUrlList } = useDicom(studyInsUID);

    const openSession = () => {
        history.push({
            pathname: `${window.location.pathname}/roomId/${TokenService.getUserName()}`,
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f2742', p: '6px' }}>
            <DicomViewer
                viewerSessionMode={ViewerSessionMode.Standalone}
                imageIds={dcmUrlList}
                externalTools={
                    <IconButton
                        isActive={false}
                        IconComp={<GroupIcon />}
                        label="Open Session"
                        onClick={() => openSession()}
                    />
                }
            />
        </Box>
    );
};

export default ViewerQualityControl;
