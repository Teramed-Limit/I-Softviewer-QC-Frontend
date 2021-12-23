import React from 'react';

import Typography from '@mui/material/Typography';

import { define } from '../../constant/setting-define';
import { DicomNode } from '../../interface/dicom-node';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import classes from './Setting.module.scss';

const initFormData: Partial<DicomNode> = {
    enable: 1,
};

const Setting = () => {
    return (
        <div className={classes.container}>
            <Typography sx={{ paddingLeft: '4px' }} variant="h6" component="div">
                Service Providers
            </Typography>
            <GridTableEditor
                apiPath="configuration/dicomNode"
                identityId="name"
                colDef={define.dicomSend.colDef}
                formDef={define.dicomSend.formDef}
                initFormData={initFormData}
            />
        </div>
    );
};

export default Setting;
