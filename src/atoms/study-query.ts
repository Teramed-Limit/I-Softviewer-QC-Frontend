import { ColumnState } from 'ag-grid-community/dist/lib/columns/columnModel';
import { format, add } from 'date-fns';
import { atom } from 'recoil';

import { dbQueryField, defaultQueryFields } from '../constant/setting-define';
import { StudyQueryData } from '../interface/study-query-data';

export const initQueryParams = (fields, initialParams: any = {}) => {
    let params = {};
    fields.map((field) => field.field).forEach((id) => (params = { ...params, [id]: '' }));
    return { ...params, ...initialParams };
};

export const atomStudyQueryCondition = atom({
    key: 'studyQueryCondition',
    default: initQueryParams(dbQueryField, {
        studyDate: `${format(add(new Date(), { months: -1 }), 'yyyyMMdd')}-${format(new Date(), 'yyyyMMdd')}`,
    }),
});

export const atomStudyQueryFields = atom({
    key: 'studyQueryFields',
    default: defaultQueryFields,
});

export const atomStudyQueryResult = atom<StudyQueryData[]>({
    key: 'studyQueryResult',
    default: [],
});

export const atomStudyQuerySorting = atom<ColumnState[]>({
    key: 'atomStudyQuerySorting',
    default: [],
});

export const atomUpToDateQueryResult = atom<boolean>({
    key: 'upToDateQueryResult',
    default: true,
});
