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
                        { field: 'Name', label: 'Name', type: 'Text' },
                        { field: 'LocalAE', label: 'Local AE', type: 'Text' },
                        { field: 'ServerAE', label: 'ServerAE', type: 'Text' },
                        { field: 'Port', label: 'Port', type: 'Text' },
                        { field: 'Enabled', label: 'Enabled', type: 'Text' },
                    ],
                },
            ],
        },
    },
    userRoleGroup: {
        colDef: [
            {
                field: 'deleteAction',
                headerName: '',
                width: 40,
                cellStyle: { padding: 0 },
                cellRenderer: 'iconRenderer',
                cellRendererParams: {
                    clicked: () => {},
                    type: 'clear',
                    color: 'error',
                },
            },
            {
                field: 'editAction',
                headerName: '',
                width: 40,
                cellStyle: { padding: 0 },
                cellRenderer: 'iconRenderer',
                cellRendererParams: {
                    clicked: () => {},
                    type: 'edit',
                    color: 'primary',
                },
            },
            { field: 'roleName', headerName: 'Role Name', width: 200 },
            { field: 'description', headerName: 'Description', width: 200 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        {
                            field: 'roleName',
                            label: 'Role Name',
                            type: 'Text',
                            readOnly: true,
                            validation: { type: 'Required' },
                        },
                        { field: 'description', label: 'Description', type: 'Text' },
                    ],
                },
            ],
        },
    },
    userAccount: {
        colDef: [
            {
                field: 'deleteAction',
                headerName: '',
                width: 40,
                cellStyle: { padding: 0 },
                cellRenderer: 'iconRenderer',
                cellRendererParams: {
                    clicked: () => {},
                    type: 'clear',
                    color: 'error',
                },
            },
            {
                field: 'editAction',
                headerName: '',
                width: 40,
                cellStyle: { padding: 0 },
                cellRenderer: 'iconRenderer',
                cellRendererParams: {
                    clicked: () => {},
                    type: 'edit',
                    color: 'primary',
                },
            },
            { field: 'userID', headerName: 'User Id', width: 200 },
            { field: 'userPassword', headerName: 'Password', width: 200 },
            { field: 'doctorCName', headerName: 'Doctor CName', width: 200 },
            { field: 'doctorEName', headerName: 'Doctor EName', width: 200 },
            { field: 'roleList', headerName: 'Role Group', width: 200, cellRenderer: 'chipRenderer', flex: 1 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        {
                            field: 'userID',
                            label: 'User Id',
                            type: 'Text',
                            readOnly: true,
                            validation: { type: 'Required' },
                        },
                        { field: 'userPassword', label: 'Password', type: 'Text', validation: { type: 'Required' } },
                        { field: 'doctorCName', label: 'Doctor CName', type: 'Text' },
                        { field: 'doctorEName', label: 'Doctor EName', type: 'Text' },
                        {
                            field: 'roleList',
                            label: 'Role Group',
                            type: 'MultiSelect',
                            optionSource: {
                                type: 'http',
                                source: 'role',
                                key: 'roleName',
                            },
                        },
                    ],
                },
            ],
        },
    },
    studyData: {
        colDef: [
            { field: 'cumcNo', headerName: 'Cumc No', width: 120 },
            { field: 'episodeNo', headerName: 'EpisodeNo', width: 180 },
            { field: 'documentNumber', headerName: 'Document Number', width: 160 },
            { field: 'nameChinese', headerName: 'Chinese Name', width: 160 },
            { field: 'nameEng', headerName: 'Eng Name', width: 160 },
            { field: 'birthdate', headerName: 'Birthdate', width: 120 },
            // { field: 'admissionDate', headerName: 'admissionDate', width: 120 },
            { field: 'documentType', headerName: 'Document Type', width: 180 },
            { field: 'dept', headerName: 'Dept', width: 120 },
        ],
    },
};

// export const queryField = [
//     { field: 'PatientID', label: 'PatientID', type: 'Text' },
//     { field: 'PatientName', label: 'PatientName', type: 'Text' },
//     { field: 'AccessionNum', label: 'AccessionNum', type: 'Text' },
//     { field: 'Physician Name', label: 'PhysicianName', type: 'Text' },
//     { field: 'Modality', label: 'Modality', type: 'Text' },
//     { field: 'Exam Date', label: 'ExamDate', type: 'Text' },
// ];
