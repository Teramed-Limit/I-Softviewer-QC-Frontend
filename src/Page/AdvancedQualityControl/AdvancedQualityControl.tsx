import React from 'react';

import { Box, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';

const AdvancedQualityControl = () => {
    const { studyInsUID } = useParams<{ studyInsUID: string }>();

    return (
        <Stack spacing={2}>
            <Box>Item 1</Box>
            <Box>Item 2</Box>
            <Box>Item 3</Box>
        </Stack>
    );
};

export default AdvancedQualityControl;
