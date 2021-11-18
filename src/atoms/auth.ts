import { atom } from 'recoil';

import TokenService from '../services/TokenService';

export const authInfo = atom({
    key: 'authInfo',
    default: TokenService.getUser(),
});
