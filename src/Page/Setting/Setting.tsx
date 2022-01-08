import React from 'react';

import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import { define } from '../../constant/setting-define';
import { DicomOperationNode } from '../../interface/dicom-node';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import classes from './Setting.module.scss';

const initFormData: Partial<DicomOperationNode> = {
    enable: 1,
};

const Setting = () => {
    return (
        <div className={classes.container}>
            <Typography sx={{ paddingLeft: '4px' }} variant="h6" component="div">
                Service Providers
            </Typography>
            <Box className={classes.content}>
                <GridTableEditor
                    apiPath="configuration/dicomOperationNode"
                    identityId="name"
                    colDef={define.dicomSend.colDef}
                    formDef={define.dicomSend.formDef}
                    initFormData={initFormData}
                />
            </Box>
        </div>
    );
};

export default Setting;
