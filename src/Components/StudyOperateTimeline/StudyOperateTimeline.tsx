import * as React from 'react';
import { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Typography from '@mui/material/Typography';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';

import { http } from '../../api/axios';
import { StudyOperationRecord } from '../../interface/study-operation-record';
import { StudyQueryResult } from '../../interface/study-query-result';
import GridTable from '../GridTable/GridTable';
import classes from './StudyOperateTimeline.module.scss';

const OperationType = {
    ImportStudy: <SaveIcon />,
    RetrieveStudy: <ImportExportIcon />,
    ModifyTag: <EditIcon />,
    SendToPacs: <SendIcon />,
};

interface Props {
    queryConditionComponent: JSX.Element;
    rowData: any[];
    colDef: ColDef[];
    highlightUser?: string;
    gridReady: (params: GridReadyEvent) => void;
}

const StudyOperateTimeline = ({
    queryConditionComponent,
    colDef,
    rowData,
    highlightUser = undefined,
    gridReady,
}: Props) => {
    const [operationRecordList, setOperationRecordList] = useState<StudyOperationRecord[]>([]);

    const onSelectionChanged = (gridApi: GridApi) => {
        if (gridApi.getSelectedNodes().length === 0) {
            setOperationRecordList([]);
            return;
        }

        const { studyInstanceUID } = gridApi.getSelectedNodes()[0].data as StudyQueryResult;
        http.get(`log/studyInstanceUID/${studyInstanceUID}`).subscribe({
            next: (res) => setOperationRecordList(res.data),
            error: () => {},
        });
    };

    return (
        <>
            {queryConditionComponent}
            <div className={classes.rowContainer}>
                <div className={`${classes.tableContainer} ag-theme-dark`}>
                    <GridTable
                        checkboxSelect={false}
                        columnDefs={colDef}
                        rowData={rowData}
                        onSelectionChanged={onSelectionChanged}
                        gridReady={gridReady}
                    />
                </div>

                <div className={classes.timelineContainer}>
                    <Timeline position="right">
                        {operationRecordList.map((operationRecord, index) => {
                            let color;
                            if (highlightUser && highlightUser !== operationRecord.operator) color = 'grey';
                            else color = operationRecord.isSuccess ? 'success' : 'error';

                            return (
                                <TimelineItem key={index.toString()}>
                                    <TimelineOppositeContent
                                        sx={{ m: 'auto 0', flex: 'none' }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        <div>{operationRecord.dateTime}</div>
                                        <div>{operationRecord.operator}</div>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot color={color}>
                                            {OperationType[operationRecord.operation]}
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography variant="h6" component="span">
                                            {operationRecord.operationName}
                                        </Typography>
                                        <Typography>{operationRecord.description}</Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            );
                        })}
                    </Timeline>
                </div>
            </div>
        </>
    );
};

export default StudyOperateTimeline;
