import React from 'react';

import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

import classes from './Home.module.scss';

const Home = () => {
    const history = useHistory();

    return (
        <div className={classes.container}>
            <Button className={classes.inner} variant="contained" onClick={() => history.push('/newStudy')}>
                Create Study
            </Button>
            <Button className={classes.inner} variant="contained" onClick={() => history.push('/qualityControl')}>
                Quality Control
            </Button>
        </div>
    );
};

export default Home;
