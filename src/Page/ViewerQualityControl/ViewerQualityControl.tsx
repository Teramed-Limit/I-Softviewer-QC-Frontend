import React from 'react';

import { useParams } from 'react-router-dom';

import classes from './ViewerQualityControl.module.scss';

const ViewerQualityControl = () => {
    const { studyInsUID } = useParams<{ studyInsUID: string }>();
    return (
        <div className={classes.Template}>
            <h1>ViewerQualityControl component</h1>
            <h3>ID: {studyInsUID}</h3>
        </div>
    );
};

export default ViewerQualityControl;
