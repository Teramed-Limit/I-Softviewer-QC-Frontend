import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import LogByStudy from '../../Container/LogByStudy/LogByStudy';
import classes from './Log.module.scss';

const Log = () => {
    // const [logBy, setLogBy] = React.useState('Study');
    //
    // const handleLogBy = (event, newValue) => {
    //     if (newValue !== null) {
    //         setLogBy(newValue);
    //     }
    // };

    return (
        <div className={classes.container}>
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                <Typography color="inherit" variant="h4" component="div">
                    Log by Study
                </Typography>
                {/* <ToggleButtonGroup sx={{ marginLeft: '8px' }} value={logBy} exclusive onChange={handleLogBy}> */}
                {/*    <ToggleButton sx={{ borderColor: 'white' }} size="small" value="Study"> */}
                {/*        Study */}
                {/*    </ToggleButton> */}
                {/*    <ToggleButton sx={{ borderColor: 'white' }} size="small" value="User"> */}
                {/*        User */}
                {/*    </ToggleButton> */}
                {/* </ToggleButtonGroup> */}
            </Box>
            <LogByStudy />
            {/* {logBy === 'User' ? <LogByUser /> : <LogByStudy />} */}
        </div>
    );
};

export default Log;
