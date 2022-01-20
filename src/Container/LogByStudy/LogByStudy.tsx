import * as React from 'react';
import { useRef } from 'react';

import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { useRecoilState } from 'recoil';

import { http } from '../../api/axios';
import { atomStudyQueryCondition, atomStudyQueryResult } from '../../atoms/study-query';
import ConditionQuerier from '../../Components/ConditonQuerier/ConditionQuerier';
import StudyOperateTimeline from '../../Components/StudyOperateTimeline/StudyOperateTimeline';
import { dbQueryField, defaultQueryFields, define } from '../../constant/setting-define';

const LogByStudy = () => {
    const [queryPairData, setQueryPairData] = useRecoilState(atomStudyQueryCondition);
    const [rowData, setRowData] = useRecoilState(atomStudyQueryResult);
    const gridApiRef = useRef<GridApi | null>(null);

    const onValueChanged = (value: any, fieldId: string) => {
        setQueryPairData((data) => ({ ...data, [fieldId]: value }));
    };

    const gridReady = (params: GridReadyEvent) => (gridApiRef.current = params.api);

    const onQuery = () => {
        gridApiRef.current?.deselectAll();
        gridApiRef.current?.showLoadingOverlay();
        http.get(`dicomDbQuery`, { params: { ...queryPairData } }).subscribe({
            next: (res) => {
                setRowData(res.data);
                gridApiRef.current?.hideOverlay();
            },
            error: () => {
                gridApiRef.current?.hideOverlay();
            },
        });
    };

    return (
        <StudyOperateTimeline
            rowData={rowData}
            colDef={define.logByStudy.colDef}
            gridReady={gridReady}
            queryConditionComponent={
                <ConditionQuerier
                    fields={dbQueryField}
                    defaultQueryFields={defaultQueryFields}
                    queryPairData={queryPairData}
                    onQuery={onQuery}
                    onQueryPairDataChanged={onValueChanged}
                />
            }
        />
    );
};

export default LogByStudy;
