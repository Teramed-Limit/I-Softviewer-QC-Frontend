export const define = {
    dicomSend: {
        colDef: [
            { field: 'Name', headerName: 'Name', width: 200 },
            { field: 'LocalAE', headerName: 'Local AE', width: 200 },
            { field: 'ServerAE', headerName: 'Server AE', width: 200 },
            { field: 'Port', headerName: 'Port', width: 200 },
            { field: 'Enabled', headerName: 'Enabled', width: 80 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        { field: 'Name', label: 'Name' },
                        { field: 'LocalAE', label: 'Local AE' },
                        { field: 'ServerAE', label: 'ServerAE' },
                        { field: 'Port', label: 'Port' },
                        { field: 'Enabled', label: 'Enabled' },
                    ],
                },
            ],
        },
    },
    userRoleGroup: {
        colDef: [
            { field: 'GroupName', headerName: 'Group Name', width: 200 },
            { field: 'Description', headerName: 'Description', width: 200 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        { field: 'GroupName', label: 'Group Name' },
                        { field: 'Description', label: 'Description' },
                    ],
                },
            ],
        },
    },
    userAccount: {
        colDef: [
            { field: 'UserName', headerName: 'User Name', width: 200 },
            { field: 'Password', headerName: 'Password', width: 200 },
            { field: 'PasswordExpiringDate', headerName: 'Password Expiring Date', width: 200 },
        ],
        formDef: {
            sections: [
                {
                    fields: [{ field: 'UserName', label: 'User Name' }],
                },
                {
                    fields: [
                        { field: 'Password', label: 'Password' },
                        { field: 'ConfirmPassword', label: 'ConfirmPassword' },
                        { field: 'PasswordExpiringDate', label: 'Password Expiring Date' },
                    ],
                },
            ],
        },
    },
    studyData: {
        colDef: [
            { field: 'PatientID', headerName: 'PatientID', width: 200 },
            { field: 'PatientName', headerName: 'PatientName', width: 200 },
            { field: 'Birthday', headerName: 'Birthday', width: 200 },
            { field: 'Sex', headerName: 'Sex', width: 200 },
            { field: 'Exam Date', headerName: 'ExamDate', width: 200 },
            { field: 'Physician Name', headerName: 'PhysicianName', width: 200 },
            { field: 'Description', headerName: 'Description', width: 200 },
            { field: 'Modality', headerName: 'Modality', width: 200 },
            { field: 'AccessionNum', headerName: 'AccessionNum', width: 200 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        { field: 'PatientID', label: 'PatientID', width: 200 },
                        { field: 'PatientName', label: 'PatientName', width: 200 },
                        { field: 'Birthday', label: 'Birthday', width: 200 },
                        { field: 'Sex', label: 'Sex', width: 200 },
                        { field: 'Exam Date', label: 'ExamDate', width: 200 },
                    ],
                },
                {
                    fields: [
                        { field: 'Physician Name', label: 'PhysicianName' },
                        { field: 'Description', label: 'Description' },
                        { field: 'Modality', label: 'Modality' },
                        { field: 'AccessionNum', label: 'AccessionNum' },
                    ],
                },
            ],
        },
    },
};
