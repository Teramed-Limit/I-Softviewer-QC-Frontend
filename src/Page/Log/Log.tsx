import React from 'react';

import Typography from '@mui/material/Typography';

import LogByStudy from '../../Container/LogByStudy/LogByStudy';
import classes from './Log.module.scss';

const Log = () => {
    return (
        <div className={classes.container}>
            <Typography classes={{ root: classes.header }} variant="subtitle1" component="div">
                Log by Study
            </Typography>
            <div className={classes.content}>
                <LogByStudy />
            </div>
        </div>
    );
};

export default Log;
