import React from 'react';

import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import { define } from '../../constant/setting-define';
import { DicomClientNode, DicomOperationNode } from '../../interface/dicom-node';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import classes from './Setting.module.scss';

const initFormData: Partial<DicomOperationNode> = {
    enable: 1,
    name: '',
    operationType: '',
    aeTitle: '',
    remoteAETitle: '',
    ipAddress: '',
    port: 200,
    moveAETitle: 'N/A',
    description: '',
    createDateTime: '',
    createUser: '',
    modifiedDateTime: '',
    modifiedUser: '',
};

const initDicomClientNodeData: Partial<DicomClientNode> = {
    acceptedTransferSyntaxesCustomize: 'False',
    aeTitle: '',
    auotRoutingDestination: '',
    compressQuality: 'LOW',
    department: '',
    description: '',
    enabledAutoRouting: 'False',
    filterRulePattern: '',
    imageCompression: 'False',
    ipAddress: '',
    // createDateTime: '',
    // createUser: '',
    // modifiedDateTime: '',
    // modifiedUser: '',
    name: '',
    needConfirmIPAddress: 'False',
    portNumber: 0,
    priority: 0,
    remoteAETitle: '',
    serviceJobTypes: 'CStoreFileSave -> DicomToThumbnail',
    transferSyntaxesCustomize: '',
    worklistMatchKeys: '',
    worklistQueryPattern: 'Database',
    worklistReturnKeys: '',
};

const Setting = () => {
    return (
        <div className={classes.container}>
            <Typography sx={{ paddingLeft: '4px' }} variant="h6" component="div">
                Client Service Providers
            </Typography>
            <Box className={classes.content}>
                <GridTableEditor
                    apiPath="configuration/dicomOperationNode"
                    identityId="name"
                    colDef={define.dicomOperationNodes.colDef}
                    formDef={define.dicomOperationNodes.formDef}
                    initFormData={initFormData}
                />
            </Box>

            <Typography sx={{ paddingLeft: '4px' }} variant="h6" component="div">
                Server Register Client Nodes
            </Typography>
            <Box className={classes.content}>
                <GridTableEditor
                    apiPath="pacsServiceNode/dicomNode"
                    identityId="name"
                    colDef={define.dicomClientNodes.colDef}
                    formDef={define.dicomClientNodes.formDef}
                    initFormData={initDicomClientNodeData}
                />
            </Box>

            <Typography sx={{ paddingLeft: '4px' }} variant="h6" component="div">
                Server Service Providers
            </Typography>
            <Box className={classes.content}>
                <GridTableEditor
                    apiPath="pacsServiceProvider/dicomProvider"
                    identityId="name"
                    colDef={define.dicomServiceProvider.colDef}
                    formDef={define.dicomServiceProvider.formDef}
                    initFormData={{}}
                />
            </Box>
        </div>
    );
};

export default Setting;
