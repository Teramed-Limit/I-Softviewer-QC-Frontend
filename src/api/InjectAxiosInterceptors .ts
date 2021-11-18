import { useEffect } from 'react';

import { useSetRecoilState } from 'recoil';

import { authInfo } from '../atoms/auth';
import { setupInterceptors } from './axios';

function InjectAxiosInterceptors() {
    const setAuth = useSetRecoilState(authInfo);

    useEffect(() => {
        setupInterceptors(() => setAuth(false));
    }, [setAuth]);

    return null;
}

export default InjectAxiosInterceptors;
