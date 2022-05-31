import React, { useEffect, useRef, useState } from 'react';

import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { http } from '../../api/axios';
import { atomNotification } from '../../atoms/notification';
import GridTable from '../../Components/GridTable/GridTable';
import PrimaryButton from '../../Components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton/SecondaryButton';
import { define } from '../../constant/setting-define';
import { SVG } from '../../icon';
import { GenerateStudyUniqueId } from '../../interface/generate-study-uniqueId';
import { HISData } from '../../interface/his-data';
import { MessageType } from '../../interface/notification';
import { CreateStudyParams } from '../../interface/study-params';
import classes from './NewStudy.module.scss';

const NewStudy = () => {
    const setNotification = useSetRecoilState(atomNotification);
    const history = useHistory<CreateStudyParams>();

    const [rowData, setRowData] = useState<HISData[]>([]);
    const [selectedRow, setSelectedRow] = useState<HISData | null>(null);
    const [episodeNo, setEpisodeNo] = useState('');
    const [studyInstanceUID, setStudyInsUid] = useState('');
    const [accessionNum, setAccessionNum] = useState('');
    const gridApiRef = useRef<GridApi | null>(null);
    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onSelectionChanged = (gridApi: GridApi) => {
        setSelectedRow(gridApi.getSelectedRows()[0]);
    };

    const queryHISData = () => {
        gridApiRef.current?.showLoadingOverlay();
        http.get(`hisWell/queryHIS`, { params: { episodeNo } }).subscribe({
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

    useEffect(() => {
        http.get(`generateStudyUniqueId`).subscribe({
            next: (res: AxiosResponse<GenerateStudyUniqueId>) => {
                setStudyInsUid(res.data.studyInstanceUID);
                setAccessionNum(res.data.accessionNumber);
            },
            error: (err) => {
                setNotification({
                    messageType: MessageType.Error,
                    message: err.response?.data || 'Http request failed!',
                });
            },
        });
    }, [setNotification]);

    const onNext = () => {
        if (!selectedRow) return;
        history.push({
            pathname: '/newStudy/viewer',
            state: {
                patientId: selectedRow.documentNumber,
                patientName: selectedRow.nameEng,
                otherPatientName: selectedRow.nameChinese,
                birthdate: selectedRow.birthdate,
                sex: selectedRow.sex,
                accessionNum,
                studyInstanceUID,
                seriesInstanceUID: `${studyInstanceUID}.1`,
            },
        });
    };

    return (
        <div className={classes.container}>
            <Typography classes={{ root: classes.header }} variant="subtitle1" component="div">
                Import Study
            </Typography>
            <div className={classes.content}>
                <div className={classes.query}>
                    <TextField
                        sx={{ minWidth: 210 }}
                        label="EpisodeNo"
                        value={episodeNo}
                        size="small"
                        onChange={(e) => setEpisodeNo(e.target.value)}
                    />
                    <TextField disabled label="Accession No." size="small" value={accessionNum} />
                    <PrimaryButton size="small" startIcon={<SVG.Query2 />} onClick={queryHISData}>
                        <Typography variant="button" component="span">
                            Query
                        </Typography>
                    </PrimaryButton>
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
            </div>
            <div className={classes.footer}>
                <SecondaryButton
                    variant="contained"
                    color="primary"
                    disabled={!selectedRow}
                    size="small"
                    onClick={onNext}
                >
                    Next
                </SecondaryButton>
            </div>
        </div>
    );
};

export default NewStudy;
