import React from 'react';

import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { FaLayerGroup, FaListAlt, FaServer } from 'react-icons/fa';

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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return value === index ? <>{children}</> : null;
}

const Setting = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '6px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab icon={<FaLayerGroup />} label="Client Service Providers" />
                        <Tab icon={<FaListAlt />} label="Register Client Nodes" />
                        <Tab icon={<FaServer />} label="Server Service Providers" />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Box className={classes.content}>
                        <GridTableEditor
                            apiPath="configuration/dicomOperationNode"
                            identityId="name"
                            colDef={define.dicomOperationNodes.colDef}
                            formDef={define.dicomOperationNodes.formDef}
                            initFormData={initFormData}
                        />
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Box className={classes.content}>
                        <GridTableEditor
                            apiPath="pacsServiceNode/dicomNode"
                            identityId="name"
                            colDef={define.dicomClientNodes.colDef}
                            formDef={define.dicomClientNodes.formDef}
                            initFormData={initDicomClientNodeData}
                        />
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Box className={classes.content}>
                        <GridTableEditor
                            apiPath="pacsServiceProvider/dicomProvider"
                            identityId="name"
                            colDef={define.dicomServiceProvider.colDef}
                            formDef={define.dicomServiceProvider.formDef}
                            initFormData={{}}
                        />
                    </Box>
                </TabPanel>
            </Box>
        </>
    );
};

export default Setting;
