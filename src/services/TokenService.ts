import { LoginResult } from '../interface/user-account';

const getLocalRefreshToken = () => {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    return user?.refreshToken;
};

const getLocalAccessToken = () => {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    return user?.accessToken;
};

const getUserName = () => {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    return user?.username;
};

const updateLocalAccessToken = (token) => {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    user.accessToken = token;
    localStorage.setItem('user', JSON.stringify(user));
};

const getUser = (): boolean => {
    if (!localStorage.getItem('user') || localStorage.getItem('user') === undefined) {
        return false;
    }
    return JSON.parse(<string>localStorage.getItem('user'));
};

const getUserInfo = (): LoginResult => {
    return JSON.parse(<string>localStorage.getItem('user'));
};

const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

const removeUser = () => {
    localStorage.removeItem('user');
};

const TokenService = {
    getUserName,
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    getUserInfo,
    setUser,
    removeUser,
};

export default TokenService;
