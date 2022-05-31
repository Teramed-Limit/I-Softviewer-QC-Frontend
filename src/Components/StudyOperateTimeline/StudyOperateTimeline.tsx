import * as React from 'react';
import { useState } from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Drawer, TextareaAutosize } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ColDef } from 'ag-grid-community';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';

import { http } from '../../api/axios';
import { StudyOperationRecord } from '../../interface/study-operation-record';
import { StudyQueryData } from '../../interface/study-query-data';
import GridTable from '../GridTable/GridTable';
import classes from './StudyOperateTimeline.module.scss';

// const OperationType = {
//     ImportStudy: <SaveIcon />,
//     RetrieveStudy: <ImportExportIcon />,
//     ModifyTag: <EditIcon />,
//     SendToPacs: <SendIcon />,
// };

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
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [drawerDetails, setDrawerDetails] = React.useState('');

    const onSelectionChanged = (gridApi: GridApi) => {
        if (gridApi.getSelectedNodes().length === 0) {
            setOperationRecordList([]);
            return;
        }

        const { qcGuid } = gridApi.getSelectedNodes()[0].data as StudyQueryData;
        http.get(`log/qcGuid/${qcGuid}`).subscribe({
            next: (res) => setOperationRecordList(res.data),
            error: () => {},
        });
    };

    const onDrawerOpen = (index: number) => {
        setDrawerOpen(true);
        setDrawerDetails(operationRecordList[index].description);
        return true;
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
                                            {/* {OperationType[operationRecord.operation]} */}
                                        </TimelineDot>
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                        <Typography sx={{ color: '#ffb860' }} variant="h2" component="div">
                                            {operationRecord.operationName}
                                        </Typography>
                                        {operationRecord.description.length > 120 ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className={classes.linkButton}
                                                    onClick={() => onDrawerOpen(index)}
                                                >
                                                    Details
                                                </button>
                                                <Drawer
                                                    anchor="right"
                                                    open={drawerOpen}
                                                    onClose={() => setDrawerOpen(false)}
                                                >
                                                    <div className={classes.drawerContainer}>
                                                        <Typography variant="h3" component="div">
                                                            Details
                                                        </Typography>
                                                        {drawerOpen && (
                                                            <TextareaAutosize
                                                                className={classes.details}
                                                                disabled
                                                                value={drawerDetails}
                                                            />
                                                        )}
                                                    </div>
                                                </Drawer>
                                            </>
                                        ) : (
                                            <Typography variant="body1" component="div">
                                                {operationRecord.description}
                                            </Typography>
                                        )}
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
