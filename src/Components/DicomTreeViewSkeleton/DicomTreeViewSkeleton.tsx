import React from 'react';

import { Box, Skeleton, Stack } from '@mui/material';

const DicomTreeViewSkeleton = () => {
    return (
        <Box sx={{ padding: '8px' }}>
            <Stack direction="row" spacing={1} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="100%" />
            </Stack>
            <Stack direction="column" spacing={1} sx={{ display: 'flex' }}>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
            </Stack>
        </Box>
    );
};

export default DicomTreeViewSkeleton;
