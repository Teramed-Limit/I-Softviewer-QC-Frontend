import React from 'react';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import UserAccount from '../../Container/UserAccount/UserAccount';
import UserRoles from '../../Container/UserRoles/UserRoles';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return value === index ? <>{children}</> : null;
}

const User = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '6px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab icon={<GroupIcon />} label="User Account" />
                    <Tab icon={<AdminPanelSettingsIcon />} label="User Roles" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <UserAccount />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <UserRoles />
            </TabPanel>
        </Box>
    );
};

export default User;
