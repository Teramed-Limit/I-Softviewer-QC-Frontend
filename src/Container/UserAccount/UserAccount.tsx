import React from 'react';

import { define } from '../../constant/setting-define';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import classes from './UserAccount.module.scss';

const initFormData = {
    createDateTime: '',
    createUser: '',
    doctorCName: '',
    doctorCode: '',
    doctorEName: '',
    isSupervisor: '',
    modifiedDateTime: '',
    modifiedUser: '',
    qualification: '',
    roleList: [],
    signatureBase64: '',
    title: '',
    userID: '',
    userPassword: '',
    confirmPassword: '',
};

const UserAccount = () => {
    return (
        <div className={classes.container}>
            <GridTableEditor
                apiPath="userAccount"
                identityId="userID"
                colDef={define.userAccount.colDef}
                formDef={define.userAccount.formDef}
                initFormData={initFormData}
            />
        </div>
    );
};

export default UserAccount;
