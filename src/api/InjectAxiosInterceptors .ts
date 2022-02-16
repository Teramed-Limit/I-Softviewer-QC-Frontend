import { useEffect } from 'react';

import { useSetRecoilState } from 'recoil';

import { isAuthorize } from '../atoms/auth';
import { setupInterceptors } from './axios';

function InjectAxiosInterceptors() {
    const setAuth = useSetRecoilState(isAuthorize);

    useEffect(() => {
        setupInterceptors(() => setAuth(false));
    }, [setAuth]);

    return null;
}

export default InjectAxiosInterceptors;
