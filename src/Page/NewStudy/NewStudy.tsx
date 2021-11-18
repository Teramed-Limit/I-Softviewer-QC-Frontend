import React from 'react';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';

import { StudyParams } from '../../interface/study-params';
import classes from './NewStudy.module.scss';

const NewStudy = () => {
    const history = useHistory<StudyParams>();

    return (
        <div className={classes.container}>
            <Stack className={classes.sidebar} direction="column" spacing={2}>
                <Button variant="contained">Query Worklist</Button>
                <Button variant="contained">Query HIS</Button>
                <Button variant="contained">Query PACS</Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        history.push({
                            pathname: '/newStudy/viewer',
                            state: {
                                patientId: 'P001',
                            },
                        });
                    }}
                >
                    Next
                </Button>
            </Stack>
            <div className={classes.content} />
        </div>
    );
};

export default NewStudy;
