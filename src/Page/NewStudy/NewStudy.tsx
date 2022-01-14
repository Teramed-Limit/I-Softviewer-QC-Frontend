import React, { useRef, useState } from 'react';

import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { http } from '../../api/axios';
import { atomNotification } from '../../atoms/notification';
import GridTable from '../../Components/GridTable/GridTable';
import { define } from '../../constant/setting-define';
import { HISData } from '../../interface/his-data';
import { MessageType } from '../../interface/notification';
import { CreateStudyParams } from '../../interface/study-params';
import { generateNewStudyInstanceUID } from '../../utils/dicom-utils';
import { generateAccessionNum } from '../../utils/general';
import classes from './NewStudy.module.scss';

const NewStudy = () => {
    const setNotification = useSetRecoilState(atomNotification);
    const history = useHistory<CreateStudyParams>();
    const [rowData, setRowData] = useState<HISData[]>([]);
    const [selectedRow, setSelectedRow] = useState<HISData | null>(null);
    const [episodeNo, setEpisodeNo] = useState('');
    const [dept, setDept] = useState('');
    const [randomAccessionNum] = useState(generateAccessionNum());
    const gridApiRef = useRef<GridApi | null>(null);
    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onSelectionChanged = (gridApi: GridApi) => {
        setSelectedRow(gridApi.getSelectedRows()[0]);
    };

    const queryHISData = () => {
        gridApiRef.current?.showLoadingOverlay();
        http.get(`hisWell/queryHIS`, { params: { episodeNo, dept } }).subscribe({
            next: (res: AxiosResponse<HISData[]>) => {
                setRowData(res.data);
                gridApiRef.current?.hideOverlay();
            },
            error: (err) => {
                gridApiRef.current?.hideOverlay();
                setNotification({
                    messageType: MessageType.Error,
                    message: err.response?.data || 'Http request failed!',
                });
            },
        });
    };

    const onNext = () => {
        if (selectedRow === null) return;
        const studyInstanceUID = generateNewStudyInstanceUID();
        history.push({
            pathname: '/newStudy/viewer',
            state: {
                patientId: selectedRow.episodeNo,
                patientName: selectedRow.nameEng,
                otherPatientName: selectedRow.nameChinese,
                birthdate: selectedRow.birthdate,
                sex: selectedRow.sex,
                accessionNum: randomAccessionNum,
                studyInstanceUID,
                seriesInstanceUID: `${studyInstanceUID}.1`,
            },
        });
    };

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <div className={classes.header}>
                    <TextField
                        label="EpisodeNo"
                        value={episodeNo}
                        size="small"
                        onChange={(e) => setEpisodeNo(e.target.value)}
                    />
                    <TextField label="Dept" size="small" value={dept} onChange={(e) => setDept(e.target.value)} />
                    <TextField disabled label="Accession No." size="small" value={randomAccessionNum} />
                    <Button variant="contained" onClick={() => queryHISData()}>
                        Query
                    </Button>
                </div>

                <div className={`ag-theme-dark ${classes.body}`}>
                    <GridTable
                        rowSelection="single"
                        columnDefs={define.hisStudy.colDef}
                        rowData={rowData}
                        onSelectionChanged={onSelectionChanged}
                        gridReady={gridReady}
                    />
                </div>

                <div className={classes.footer}>
                    <Button disabled={selectedRow === null} variant="contained" onClick={() => onNext()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NewStudy;
