import React from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import LogByStudy from '../../Container/LogByStudy/LogByStudy';
import LogByUser from '../../Container/LogByUser/LogByUser';
import classes from './Log.module.scss';

const Log = () => {
    const [logBy, setLogBy] = React.useState('Study');

    const handleLogBy = (event, newValue) => {
        if (newValue !== null) {
            setLogBy(newValue);
        }
    };

    return (
        <div className={classes.container}>
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                <Typography color="inherit" variant="h4" component="div">
                    Log by
                </Typography>
                <ToggleButtonGroup sx={{ marginLeft: '8px' }} value={logBy} exclusive onChange={handleLogBy}>
                    <ToggleButton sx={{ borderColor: 'white' }} size="small" value="Study">
                        Study
                    </ToggleButton>
                    <ToggleButton sx={{ borderColor: 'white' }} size="small" value="User">
                        User
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {logBy === 'User' ? <LogByUser /> : <LogByStudy />}
        </div>
    );
};

export default Log;
