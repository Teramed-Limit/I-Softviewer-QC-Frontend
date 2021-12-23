import { atom } from 'recoil';

import { dbQueryField } from '../constant/setting-define';

export const initQueryParams = (fields) => {
    let params = {};
    fields.map((field) => field.field).forEach((id) => (params = { ...params, [id]: '' }));
    return params;
};

export const atomStudyQueryCondition = atom({
    key: 'studyQueryCondition',
    default: initQueryParams(dbQueryField),
});

export const atomStudyQueryResult = atom<any[]>({
    key: 'studyQueryResult',
    default: [],
});
