import { atom } from 'recoil';

export const loading = atom({
    key: 'loading',
    default: false,
});

export const progressStatus = atom({
    key: 'progressStatus',
    default: { showProgress: false, value: 0, message: '' },
});
