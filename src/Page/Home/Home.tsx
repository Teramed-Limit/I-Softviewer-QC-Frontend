import React from 'react';

import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import classes from './Home.module.scss';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className={classes.container}>
            <Button className={classes.inner} variant="contained" onClick={() => navigate('/newStudy')}>
                Create Study
            </Button>
            <Button className={classes.inner} variant="contained" onClick={() => navigate('/qualityControl')}>
                Quality Control
            </Button>
        </div>
    );
};

export default Home;
