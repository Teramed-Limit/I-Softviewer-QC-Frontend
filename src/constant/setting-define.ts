export const define = {
    dicomSend: {
        colDef: [
            { field: 'name', headerName: 'Name', width: 160 },
            { field: 'operationType', headerName: 'Type', width: 160 },
            { field: 'aeTitle', headerName: 'AETitle', width: 160 },
            { field: 'ipAddress', headerName: 'IP', width: 120 },
            { field: 'port', headerName: 'Port', width: 100 },
            { field: 'remoteAETitle', headerName: 'Remote AETitle', width: 160 },
            { field: 'enable', headerName: 'Enable', width: 100, cellRenderer: 'checkboxRenderer' },
            { field: 'description', headerName: 'Description', flex: 1 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        {
                            field: 'name',
                            label: 'Name',
                            type: 'Text',
                            readOnly: true,
                            validation: { type: 'Required' },
                        },
                        {
                            field: 'operationType',
                            label: 'Type',
                            type: 'SingleSelect',
                            optionSource: {
                                type: 'static',
                                source: 'dicomOperationType',
                            },
                            validation: { type: 'Required' },
                        },
                        { field: 'aeTitle', label: 'AE Title', type: 'Text', validation: { type: 'Required' } },
                        { field: 'ipAddress', label: 'IP', type: 'Text', validation: { type: 'Required' } },
                        { field: 'port', label: 'Port', type: 'Number', validation: { type: 'Required' } },
                        {
                            field: 'sendingAETitle',
                            label: 'Sending AE Title',
                            type: 'Text',
                            validation: { type: 'Required' },
                        },
                        { field: 'description', label: 'Description', type: 'Text' },
                        { field: 'enable', label: 'Enable', type: 'Checkbox' },
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
                                labelKey: 'roleName',
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
    patientStudy: {
        colDef: [
            { field: 'patientId', headerName: 'Patient Id', width: 160 },
            {
                field: 'patientsName',
                headerName: 'Patient Name',
                width: 160,
            },
            {
                field: 'accessionNumber',
                headerName: 'AccessionNumber',
                width: 160,
                pinned: 'left',
                cellRenderer: 'linkRenderer',
                cellRendererParams: {
                    urlPath: '/qualityControl/viewer/studies/studyInstanceUID/{studyInstanceUID}',
                },
            },
            {
                field: 'state',
                headerName: 'State',
                width: 250,
                pinned: 'left',
                cellRenderer: 'qcChipRenderer',
            },
            {
                field: 'advanced',
                headerName: 'Advanced',
                width: 140,
                pinned: 'left',
                cellRenderer: 'buttonRenderer',
                cellRendererParams: {
                    clicked: () => {},
                    color: 'primary',
                    variant: 'contained',
                    label: 'Advanced',
                },
            },
            { field: 'patientsSex', headerName: 'Sex', type: 'Text', width: 120 },
            { field: 'patientsBirthDate', headerName: 'BirthDate', width: 120 },
            { field: 'studyInstanceUID', headerName: 'StudyInstanceUID', hide: true, width: 120 },
            { field: 'studyDescription', headerName: 'StudyDescription', flex: 1, minWidth: 200 },
            { field: 'modality', headerName: 'Modality', width: 120 },
            // { field: 'referringPhysiciansName', headerName: 'Referring Physicians Name', width: 120 },
            { field: 'performingPhysiciansName', headerName: 'Performing Physician', width: 200 },
            { field: 'studyDate', headerName: 'Study Date', width: 120 },
        ],
    },
    series: {
        colDef: [
            { field: 'seriesModality', headerName: 'Modality', width: 160 },
            { field: 'state', headerName: 'Status', width: 250, cellRenderer: 'qcChipRenderer' },
            { field: 'seriesDescription', headerName: 'Description', flex: 1 },
            { field: 'seriesInstanceUID', headerName: 'SeriesInstanceUID', hide: true },
        ],
    },
    images: {
        colDef: [
            { field: 'imageNumber', headerName: 'Image No', width: 120 },
            { field: 'sopInstanceUID', headerName: 'SOPInstanceUID', flex: 1 },
            { field: 'sopClassUID', headerName: 'SOPClassUID', hide: true },
            { field: 'filePath', headerName: 'FilePath', hide: true },
        ],
    },
    imageTags: {
        colDef: [
            { field: 'tag', headerName: 'Tag', flex: 1 },
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'value', headerName: 'Value', flex: 1 },
        ],
    },
};

export const queryField = [
    { field: 'patientId', label: 'Patient ID', type: 'Text' },
    { field: 'patientsName', label: 'Patient Name', type: 'Text' },
    { field: 'patientsSex', label: 'Sex', type: 'Text' },
    { field: 'patientsBirthDate', label: 'BirthDate', type: 'Text' },
    { field: 'studyInstanceUID', label: 'StudyInstanceUID', type: 'Text' },
    { field: 'accessionNumber', label: 'AccessionNumber', type: 'Text' },
    { field: 'studyDescription', label: 'StudyDescription', type: 'Text' },
    {
        field: 'modality',
        label: 'Modality',
        type: 'SingleSelect',
        optionSource: { type: 'static', source: 'modality' },
    },
    { field: 'referringPhysiciansName', label: 'Referring Physicians Name', type: 'Text' },
    { field: 'performingPhysiciansName', label: 'Performing Physicians Name', type: 'Text' },
    { field: 'studyDate', label: 'Study Date', type: 'DataRange' },
];
