import { atom } from 'recoil';

import { RoleFunction } from '../interface/user-role';

export const userAvailableFunction = atom<RoleFunction[]>({
    key: 'userAvailableFunction',
    default: [],
});
