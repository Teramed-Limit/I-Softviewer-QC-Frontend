import React, { useState } from 'react';

import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';

import { http } from '../../api/axios';
import GridTable from '../../Components/GridTable/GridTable';
import { define } from '../../constant/setting-define';
import { HISData } from '../../interface/his-data';
import { StudyParams } from '../../interface/study-params';
import { generateAccessionNum } from '../../utils/general';
import classes from './NewStudy.module.scss';

const NewStudy = () => {
    const history = useHistory<StudyParams>();
    const [rowData, setRowData] = useState<HISData[]>([]);
    const [selectedRow, setSelectedRow] = useState<HISData | null>(null);
    const [episodeNo, setEpisodeNo] = useState('');
    const [dept, setDept] = useState('');
    const [randomAccessionNum, setRandomAccessionNum] = useState(generateAccessionNum());

    const onSelectionChanged = (gridApi: GridApi) => {
        setSelectedRow(gridApi.getSelectedRows()[0]);
    };

    const queryHISData = () => {
        http.get(`hisWell/queryHIS/episodeNo/${episodeNo}/dept/${dept}`).subscribe((res: AxiosResponse<HISData[]>) => {
            setRowData(res.data);
        });
    };

    const onNext = () => {
        if (selectedRow === null) return;

        history.push({
            pathname: '/newStudy/viewer',
            state: {
                accessionNum: 'sssssss',
                patientId: selectedRow.documentNumber,
                patientName: selectedRow.nameEng,
                birthdate: selectedRow.birthdate,
                sex: selectedRow.sex,
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

                <div className={`ag-theme-alpine ${classes.body}`}>
                    <GridTable
                        rowSelection="single"
                        columnDefs={define.studyData.colDef}
                        rowData={rowData}
                        onSelectionChanged={onSelectionChanged}
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
