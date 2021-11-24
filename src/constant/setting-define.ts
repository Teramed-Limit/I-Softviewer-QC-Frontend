export const define = {
    dicomSend: {
        colDef: [
            { field: 'name', headerName: 'Name', width: 160 },
            { field: 'aeTitle', headerName: 'AETitle', width: 160 },
            { field: 'ipAddress', headerName: 'IP', width: 120 },
            { field: 'portNumber', headerName: 'Port', width: 100 },
            { field: 'remoteAETitle', headerName: 'RemoteAETitle', width: 160 },
            { field: 'description', headerName: 'Description', flex: 1 },
            {
                field: 'worklistMatchKeys',
                headerName: 'Worklist MatchKeys',
                width: 180,
                cellRenderer: 'xmlViewerRenderer',
            },
            {
                field: 'worklistReturnKeys',
                headerName: 'Worklist ReturnKeys',
                width: 180,
                cellRenderer: 'xmlViewerRenderer',
            },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        {
                            field: 'name',
                            label: 'Name',
                            width: 160,
                            type: 'Text',
                            readOnly: true,
                            validation: { type: 'Required' },
                        },
                        {
                            field: 'aeTitle',
                            label: 'AETitle',
                            width: 160,
                            type: 'Text',
                            validation: { type: 'Required' },
                        },
                        { field: 'ipAddress', label: 'IP', width: 120, type: 'Text', validation: { type: 'Required' } },
                        {
                            field: 'portNumber',
                            label: 'Port',
                            width: 100,
                            type: 'Number',
                            validation: { type: 'Required' },
                        },
                        {
                            field: 'remoteAETitle',
                            label: 'RemoteAETitle',
                            width: 160,
                            type: 'Text',
                            validation: { type: 'Required' },
                        },
                        { field: 'description', label: 'Description', flex: 1, type: 'Text' },
                        {
                            field: 'worklistMatchKeys',
                            label: 'Worklist MatchKeys',
                            width: 180,
                            cellRenderer: 'xmlViewerRenderer',
                            type: 'Textarea',
                        },
                        {
                            field: 'worklistReturnKeys',
                            label: 'Worklist ReturnKeys',
                            width: 180,
                            cellRenderer: 'xmlViewerRenderer',
                            type: 'Textarea',
                        },
                    ],
                },
            ],
        },
    },
    userRoleGroup: {
        colDef: [
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
