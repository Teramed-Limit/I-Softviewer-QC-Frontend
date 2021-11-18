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
    setUser,
    removeUser,
};

export default TokenService;
