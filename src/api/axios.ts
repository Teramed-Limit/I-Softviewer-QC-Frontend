import Axios from 'axios-observable';

import TokenService from '../services/TokenService';

export const http = Axios.create({
    baseURL: `${process.env.REACT_APP_REST_API}/api`,
});

export const setupInterceptors = (expireToken: () => void) => {
    http.interceptors.request.use((config) => {
        const newConfig = { ...config };
        const token = TokenService.getLocalAccessToken();
        if (token) {
            newConfig.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    http.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = { ...err.config };

            if (originalConfig.url !== 'userAccount/login' && err.response) {
                // Access Token was expired
                if (err.response.status === 401) {
                    TokenService.removeUser();
                    expireToken();
                }
            }

            return Promise.reject(err);
        },
    );
};
