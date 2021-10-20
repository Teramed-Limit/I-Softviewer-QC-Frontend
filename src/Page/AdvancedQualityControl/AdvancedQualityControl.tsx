import React from 'react';

import { useParams } from 'react-router-dom';

import classes from './AdvancedQualityControl.module.scss';

const AdvancedQualityControl = () => {
    const { studyInsUID } = useParams<{ studyInsUID: string }>();
    return (
        <div className={classes.Template}>
            <h1>AdvancedQualityControl component</h1>
            <h3>ID: {studyInsUID}</h3>
        </div>
    );
};

export default AdvancedQualityControl;
