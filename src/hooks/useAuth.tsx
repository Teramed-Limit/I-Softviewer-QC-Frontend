import { useState } from 'react';

import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { concatMap, delay, Observable, of, Subscription } from 'rxjs';

import { http } from '../api/axios';
import { isAuthorize } from '../atoms/auth';
import { userAvailableFunction } from '../atoms/user-available-function';
import { LoginResult } from '../interface/user-account';
import TokenService from '../services/TokenService';

let timer: Subscription;

export const useAuth = () => {
    const history = useHistory();
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
                    history.replace({ pathname: '/login' });
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
            history.replace({ pathname: '/login' });
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
                history.replace(navigatePath);
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
                    history.replace({ pathname: '/login' });
                },
            });
        }
    };

    return { login, logout, message, initialAuth };
};
