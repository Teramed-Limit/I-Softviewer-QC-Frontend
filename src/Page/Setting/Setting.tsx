import React from 'react';

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
