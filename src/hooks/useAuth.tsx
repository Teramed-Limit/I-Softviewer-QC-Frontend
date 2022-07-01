import { useState } from 'react';

import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { concatMap, delay, Observable, of, Subscription } from 'rxjs';

import { http } from '../api/axios';
import { isAuthorize } from '../atoms/auth';
import { userAvailableFunction } from '../atoms/user-available-function';
import { LoginResult } from '../interface/user-account';
import TokenService from '../services/TokenService';

let timer: Subscription;

export const useAuth = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const setAuth = useSetRecoilState(isAuthorize);
    const setUserAvailableFunction = useSetRecoilState(userAvailableFunction);

    const getTokenRemainingTime = () => {
        const accessToken = TokenService.getLocalAccessToken();
        if (!accessToken) {
            return 0;
        }
        const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000 - 60000);
        return expires.getTime() - Date.now();
    };

    const startTokenTimer = () => {
        const timeout = getTokenRemainingTime();
        timer = of(true)
            .pipe(
                delay(timeout),
                concatMap(() => refreshToken()),
            )
            .subscribe({
                next: () => {},
                error: () => {
                    TokenService.removeUser();
                    setAuth(false);
                    stopTokenTimer();
                    navigate('/login', { replace: true });
                },
            });
    };

    const stopTokenTimer = () => {
        timer?.unsubscribe();
    };

    const refreshToken = (): Observable<any> => {
        const localRefreshToken = TokenService.getLocalRefreshToken();

        if (!localRefreshToken) {
            TokenService.removeUser();
            setAuth(false);
            return of(null);
        }

        return http.post('userAccount/refreshtoken', { refreshToken: localRefreshToken });
    };

    const logout = () => {
        http.post('userAccount/logout').subscribe(() => {
            setAuth(false);
            TokenService.removeUser();
            stopTokenTimer();
            navigate('/login', { replace: true });
        });
    };

    const login = (username, password, navigatePath) => {
        http.post('userAccount/login', {
            username,
            password,
        }).subscribe({
            next: (res: AxiosResponse<LoginResult>) => {
                TokenService.setUser(res.data);
                setAuth(TokenService.getUser());
                setUserAvailableFunction(res.data.functionList);
                startTokenTimer();
                navigate(navigatePath, { replace: true });
            },
            error: (err) => {
                setMessage(err.response?.data);
            },
        });
    };

    const initialAuth = () => {
        if (timer === undefined && TokenService.getUser()) {
            refreshToken().subscribe({
                next: (res) => {
                    TokenService.setUser(res.data);
                    setAuth(TokenService.getUser());
                    setUserAvailableFunction(res.data.functionList);
                    startTokenTimer();
                },
                error: () => {
                    TokenService.removeUser();
                    setAuth(false);
                    stopTokenTimer();
                    navigate('/login', { replace: true });
                },
            });
        }
    };

    return { login, logout, message, initialAuth };
};
