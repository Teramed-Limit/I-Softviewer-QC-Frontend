export interface UserAccountInfo {
    userID: string;
    userPassword: string;
    doctorCode: string;
    doctorCName: string;
    doctorEName: string;
    isSupervisor: string;
    roleList: string;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    title: string;
    qualification: string;
    signatureBase64: string;
}

export interface UpdateUserAccountInfo extends UserAccountInfo {
    confirmPassword: string;
}

export interface LoginResult {
    username: string;
    accessToken: string;
    refreshToken: string;
}
