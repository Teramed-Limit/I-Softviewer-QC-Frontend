import React from 'react';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';

import { define } from '../../constant/setting-define';
import { StudyParams } from '../../interface/study-params';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
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
            <div className={classes.content}>
                <GridTableEditor
                    formHeader="Study Data"
                    colDef={define.studyData.colDef}
                    formDef={define.studyData.formDef}
                    rowData={[]}
                />
            </div>
        </div>
    );
};

export default NewStudy;
