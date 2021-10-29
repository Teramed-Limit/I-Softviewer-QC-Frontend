import React from 'react';

import { define } from '../../constant/setting-define';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import classes from './Setting.module.scss';

const rowData = [
    {
        UserName: 'UserName1',
        Password: 'Password1',
    },
    {
        UserName: 'UserName2',
        Password: 'Password2',
    },
];

const Setting = () => {
    return (
        <div className={classes.container}>
            {/* Dicom Send */}
            <GridTableEditor
                gridHeader="Dicom Send"
                colDef={define.dicomSend.colDef}
                formDef={define.dicomSend.formDef}
                rowData={rowData}
            />
        </div>
    );
};

export default Setting;
