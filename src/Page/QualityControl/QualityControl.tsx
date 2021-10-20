import React from 'react';

import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

import classes from './QualityControl.module.scss';

const QualityControl = () => {
    const history = useHistory();

    return (
        <div className={classes.Template}>
            <h1>QualityControl component</h1>
            <Button variant="contained" onClick={() => history.push('/qualityControl/viewer/studies/12345')}>
                Viewer
            </Button>
            <Button variant="contained" onClick={() => history.push('/qualityControl/advanced/studies/67891')}>
                Advanced
            </Button>
        </div>
    );
};

export default QualityControl;
