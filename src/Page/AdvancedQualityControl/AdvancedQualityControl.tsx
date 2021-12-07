import React, { useState } from 'react';

import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

import GridTable from '../../Components/GridTable/GridTable';
import TreeView from '../../Components/TreeView/TreeView';
import { define } from '../../constant/setting-define';
import classes from './AdvancedQualityControl.module.scss';

const AdvancedQualityControl = () => {
    const { studyInsUID } = useParams<{ studyInsUID: string }>();
    const [rowData, setRowData] = useState<any[]>([]);

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <Stack
                spacing={1}
                sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: '3 1 auto', maxWidth: '40%' }}
            >
                <TreeView />
            </Stack>

            <Stack
                spacing={2}
                sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: '2 1 40%', ml: '16px' }}
            >
                <div className={classes.body}>
                    <Typography className={classes.header} color="inherit" variant="h6" component="div">
                        Image tags & thumbnail
                    </Typography>
                    <div className={`ag-theme-alpine ${classes.tableContainer}`}>
                        <GridTable checkboxSelect={false} columnDefs={define.imageTags.colDef} rowData={rowData} />
                    </div>
                </div>
            </Stack>
        </Box>
    );
};

export default AdvancedQualityControl;
