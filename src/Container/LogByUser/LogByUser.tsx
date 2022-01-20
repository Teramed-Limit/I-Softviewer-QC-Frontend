import * as React from 'react';
import { useRef, useState } from 'react';

import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';

import { http } from '../../api/axios';
import StudyOperateTimeline from '../../Components/StudyOperateTimeline/StudyOperateTimeline';
import { define } from '../../constant/setting-define';
import { StudyOperationRecord } from '../../interface/study-operation-record';
import classes from './LogByUser.module.scss';

const LogByUser = () => {
    const [rowData, setRowData] = useState<StudyOperationRecord[]>([]);
    const [user, setUser] = useState('');
    const userRef = useRef('');
    const gridApiRef = useRef<GridApi | null>(null);

    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onQuery = () => {
        gridApiRef.current?.deselectAll();
        gridApiRef.current?.showLoadingOverlay();
        http.get(`log/userName/${user}`).subscribe({
            next: (res) => {
                if (res.data) userRef.current = user;
                setRowData(res.data);
                gridApiRef.current?.hideOverlay();
            },
            error: () => {
                setRowData([]);
                gridApiRef.current?.hideOverlay();
            },
        });
    };

    return (
        <>
            <StudyOperateTimeline
                rowData={rowData}
                colDef={define.logByUser.colDef}
                highlightUser={userRef.current}
                gridReady={gridReady}
                queryConditionComponent={
                    <div className={classes.queryContainer}>
                        <TextField label="User" value={user} size="small" onChange={(e) => setUser(e.target.value)} />
                        <Button variant="contained" onClick={() => onQuery()}>
                            Query
                        </Button>
                    </div>
                }
            />
        </>
    );
};

export default LogByUser;
