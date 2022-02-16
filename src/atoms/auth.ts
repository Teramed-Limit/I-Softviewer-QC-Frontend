import { atom } from 'recoil';

import { LoginResult } from '../interface/user-account';
import TokenService from '../services/TokenService';

export const isAuthorize = atom<boolean>({
    key: 'isAuthorize',
    default: TokenService.getUser(),
});

export const authInfo = atom<LoginResult>({
    key: 'authInfo',
    default: TokenService.getUserInfo(),
});
