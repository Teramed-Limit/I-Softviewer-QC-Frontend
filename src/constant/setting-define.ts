export const define = {
    dicomOperationNodes: {
        colDef: [
            { field: 'name', headerName: 'Name', width: 160 },
            { field: 'operationType', headerName: 'Type', width: 160 },
            { field: 'aeTitle', headerName: 'AETitle', width: 160 },
            { field: 'remoteAETitle', headerName: 'Remote AETitle', width: 160 },
            { field: 'ipAddress', headerName: 'IP', width: 120 },
            { field: 'port', headerName: 'Port', width: 100 },
            { field: 'moveAETitle', headerName: 'Move AETitle', width: 160 },
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
                        { field: 'aeTitle', label: 'AETitle', type: 'Text', validation: { type: 'Required' } },
                        {
                            field: 'remoteAETitle',
                            label: 'Remote AETitle',
                            type: 'Text',
                            validation: { type: 'Required' },
                        },
                        { field: 'ipAddress', label: 'IP', type: 'Text', validation: { type: 'Required' } },
                        { field: 'port', label: 'Port', type: 'Number', validation: { type: 'Required' } },
                        {
                            field: 'moveAETitle',
                            label: 'Move AETitle',
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
    dicomClientNodes: {
        colDef: [
            { field: 'name', headerName: 'Name', width: 160 },
            { field: 'aeTitle', headerName: 'AETitle', width: 160 },
            { field: 'ipAddress', headerName: 'IP', width: 120 },
            { field: 'portNumber', headerName: 'Port', width: 100 },
            { field: 'remoteAETitle', headerName: 'Remote AETitle', width: 160 },
            { field: 'description', headerName: 'Description', width: 160 },
            { field: 'compressQuality', headerName: 'Compress Quality', width: 200 },
            { field: 'enabledAutoRouting', headerName: 'Enabled AutoRouting', width: 200 },
            { field: 'filterRulePattern', headerName: 'Filter Rule Pattern', width: 200 },
            { field: 'imageCompression', headerName: 'Image Compression', width: 200 },
            { field: 'needConfirmIPAddress', headerName: 'NeedConfirm IPAddress', width: 200 },
            { field: 'priority', headerName: 'Priority', width: 160 },
            { field: 'serviceJobTypes', headerName: 'ServiceJobTypes', width: 160 },
            {
                field: 'worklistMatchKeys',
                headerName: 'Worklist MatchKeys',
                width: 200,
                cellRenderer: 'xmlViewerRenderer',
            },
            {
                field: 'worklistReturnKeys',
                headerName: 'Worklist ReturnKeys',
                width: 200,
                cellRenderer: 'xmlViewerRenderer',
            },
            { field: 'worklistQueryPattern', headerName: 'Worklist QueryPattern', width: 200 },
            {
                field: 'acceptedTransferSyntaxesCustomize',
                headerName: 'Accepted TransferSyntaxes Customize',
                width: 200,
            },
            { field: 'auotRoutingDestination', headerName: 'Auot Routing Destination', width: 200 },
            { field: 'department', headerName: 'Department', width: 160 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        {
                            field: 'name',
                            type: 'Text',
                            label: 'Name',
                            readOnly: true,
                            validation: { type: 'Required' },
                        },
                        { field: 'aeTitle', type: 'Text', label: 'AETitle', validation: { type: 'Required' } },
                        { field: 'ipAddress', type: 'Text', label: 'IP', validation: { type: 'Required' } },
                        { field: 'portNumber', type: 'Number', label: 'Port', validation: { type: 'Required' } },
                        {
                            field: 'remoteAETitle',
                            type: 'Text',
                            label: 'Server AETitle',
                            validation: { type: 'Required' },
                        },
                        { field: 'description', type: 'Text', label: 'Description' },
                        {
                            field: 'compressQuality',
                            label: 'Compress Quality',
                            type: 'SingleSelect',
                            optionSource: {
                                type: 'static',
                                source: 'compressQuality',
                            },
                            validation: { type: 'Required' },
                        },
                        {
                            field: 'enabledAutoRouting',
                            label: 'Enabled AutoRouting',
                            type: 'SingleSelect',
                            optionSource: {
                                type: 'static',
                                source: 'booleanStringType',
                            },
                            validation: { type: 'Required' },
                        },
                        {
                            field: 'imageCompression',
                            label: 'Image Compression',
                            type: 'SingleSelect',
                            optionSource: {
                                type: 'static',
                                source: 'booleanStringType',
                            },
                            validation: { type: 'Required' },
                        },
                        {
                            field: 'needConfirmIPAddress',
                            label: 'NeedConfirm IPAddress',
                            type: 'SingleSelect',
                            optionSource: {
                                type: 'static',
                                source: 'booleanStringType',
                            },
                            validation: { type: 'Required' },
                        },
                        { field: 'priority', type: 'Number', label: 'Priority' },
                        {
                            field: 'serviceJobTypes',
                            type: 'SingleSelect',
                            label: 'ServiceJobTypes',
                            optionSource: {
                                type: 'static',
                                source: 'cStoreJobType',
                            },
                            validation: { type: 'Required' },
                        },
                        { field: 'worklistMatchKeys', type: 'Textarea', label: 'Worklist MatchKeys' },
                        { field: 'worklistReturnKeys', type: 'Textarea', label: 'Worklist ReturnKeys' },
                        {
                            field: 'worklistQueryPattern',
                            type: 'SingleSelect',
                            label: 'Worklist QueryPattern',
                            optionSource: {
                                type: 'static',
                                source: 'wlmQryPattern',
                            },
                            validation: { type: 'Required' },
                        },
                        // { field: 'filterRulePattern', type: 'Text', label: 'Filter Rule Pattern' },
                        {
                            field: 'acceptedTransferSyntaxesCustomize',
                            label: 'Accepted TransferSyntaxes Customize',
                            type: 'SingleSelect',
                            optionSource: {
                                type: 'static',
                                source: 'booleanStringType',
                            },
                            validation: { type: 'Required' },
                        },
                        // {
                        //     field: 'auotRoutingDestination',
                        //     type: 'Text',
                        //     label: 'Auto Routing Destination',
                        // },
                        // { field: 'department', type: 'Text', label: 'Department' },
                    ],
                },
            ],
        },
    },
    dicomServiceProvider: {
        colDef: [
            { field: 'name', headerName: 'Name', width: 160 },
            { field: 'dicomServiceType', headerName: 'Type', width: 160 },
            { field: 'aeTitle', headerName: 'AETitle', width: 160 },
            { field: 'port', headerName: 'Port', width: 100 },
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
                            field: 'dicomServiceType',
                            label: 'Type',
                            type: 'SingleSelect',
                            optionSource: {
                                type: 'static',
                                source: 'dicomServiceProviderType',
                                labelKey: 'label',
                                key: 'key',
                            },
                            validation: { type: 'Required' },
                        },
                        { field: 'aeTitle', label: 'AETitle', type: 'Text', validation: { type: 'Required' } },
                        { field: 'port', label: 'Port', type: 'Number', validation: { type: 'Required' } },
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
            { field: 'doctorCName', headerName: 'User CName', width: 200 },
            { field: 'doctorEName', headerName: 'User EName', width: 200 },
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
                        { field: 'doctorCName', label: 'User CName', type: 'Text' },
                        { field: 'doctorEName', label: 'User EName', type: 'Text' },
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
    hisStudy: {
        colDef: [
            { field: 'cumcNo', headerName: 'Cumc No', width: 120 },
            { field: 'episodeNo', headerName: 'EpisodeNo', width: 180 },
            { field: 'documentNumber', headerName: 'Document Number', width: 200 },
            { field: 'nameChinese', headerName: 'Chinese Name', width: 160 },
            { field: 'nameEng', headerName: 'Eng Name', width: 160 },
            { field: 'birthdate', headerName: 'Birthdate', width: 120 },
            // { field: 'admissionDate', headerName: 'admissionDate', width: 120 },
            { field: 'documentType', headerName: 'Document Type', width: 180 },
            { field: 'dept', headerName: 'Current Location', width: 200 },
        ],
    },
    patientStudy: {
        colDef: [
            {
                field: 'patientId',
                headerName: 'Patient Id',
                width: 160,
                pinned: 'left',
                cellRenderer: 'linkRenderer',
                cellRendererParams: { clicked: () => {} },
            },
            { field: 'patientsName', headerName: 'Patient Name', width: 160 },
            { field: 'accessionNumber', headerName: 'AccessionNumber', width: 180 },
            { field: 'studyID', headerName: 'studyID', hide: true, width: 120, pinned: 'left' },
            {
                field: 'state',
                headerName: 'State',
                width: 270,
                pinned: 'left',
                cellRenderer: 'qcChipRenderer',
            },
            {
                field: 'advanced',
                colId: 'qualityControl__gridCol-advanced',
                headerName: 'Advanced',
                width: 140,
                pinned: 'right',
                cellRenderer: 'linkRenderer',
                cellRendererParams: { clicked: () => {}, isStaticLabel: true, label: 'Advanced' },
            },
            { field: 'patientsSex', headerName: 'Sex', width: 100 },
            { field: 'patientsBirthDate', headerName: 'BirthDate', width: 130 },
            { field: 'studyDate', headerName: 'Study Date', width: 130 },
            { field: 'studyDescription', headerName: 'StudyDescription', flex: 1, minWidth: 200 },
            { field: 'modality', headerName: 'Modality', width: 120 },
            // { field: 'performingPhysiciansName', headerName: 'Performing Physician', width: 200 },
            { field: 'referringPhysicianName', headerName: 'Referring Physician', width: 200 },
            { field: 'studyInstanceUID', headerName: 'StudyInstanceUID', hide: true, width: 120 },
        ],
    },
    worklist: {
        colDef: [
            { field: 'patientID', headerName: 'Patient Id', width: 160 },
            { field: 'patientName', headerName: 'Patient Name', width: 160 },
            { field: 'otherPatientNames', headerName: 'Other Name', width: 160 },
            { field: 'accessionNumber', headerName: 'AccessionNumber', width: 180 },
            { field: 'scheduledProcedureStepStartDate', headerName: 'Study Date', width: 120 },
            { field: 'patientSex', headerName: 'Sex', width: 120 },
            { field: 'patientBirthDate', headerName: 'BirthDate', width: 120 },
            { field: 'requestedProcedureDescription', headerName: 'StudyDescription', flex: 1, minWidth: 200 },
            { field: 'modality', headerName: 'Modality', width: 120 },
            { field: 'scheduledPerformingPhysicianName', headerName: 'Performing Physician', width: 200 },
            { field: 'studyInstanceUID', headerName: 'StudyInstanceUID', hide: true, width: 120 },
        ],
    },
    qrStudy: {
        colDef: [
            { field: 'patientID', headerName: 'Patient Id', width: 160 },
            { field: 'patientName', headerName: 'Patient Name', width: 160 },
            { field: 'accessionNumber', headerName: 'AccessionNumber', width: 160 },
            { field: 'studyID', headerName: 'studyID', hide: true, width: 120, pinned: 'left' },
            { field: 'patientSex', headerName: 'Sex', width: 120 },
            { field: 'patientBirthDate', headerName: 'BirthDate', width: 120 },
            { field: 'studyDate', headerName: 'Study Date', width: 120 },
            { field: 'studyDescription', headerName: 'StudyDescription', flex: 1, minWidth: 200 },
            { field: 'modality', headerName: 'Modality', width: 120 },
            { field: 'referringPhysicianName', headerName: 'Referring Physician', width: 200 },
            { field: 'studyInstanceUID', headerName: 'StudyInstanceUID', hide: true, width: 120 },
            {
                field: 'retrieve',
                headerName: '',
                width: 100,
                pinned: 'right',
                cellRenderer: 'buttonRenderer',
                cellRendererParams: {
                    clicked: () => {},
                    color: 'primary',
                    variant: 'contained',
                    label: 'Retrieve',
                },
            },
        ],
    },
    imageTags: {
        colDef: [
            { field: 'id', headerName: 'id', hide: true },
            { field: 'tag', headerName: 'Tag', flex: 1, cellRenderer: 'tagRenderer' },
            { field: 'vr', headerName: 'VR', width: 80 },
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'value', headerName: 'Value', flex: 1 },
        ],
        formDef: {
            sections: [
                {
                    fields: [
                        { field: 'tag', label: 'Tag', type: 'Text', readOnly: true },
                        { field: 'vr', label: 'VR', type: 'Text', readOnly: true },
                        { field: 'name', label: 'Name', type: 'Text', readOnly: true },
                        { field: 'value', label: 'Value', type: 'Text' },
                    ],
                },
            ],
        },
    },
    logByStudy: {
        colDef: [
            { field: 'patientId', headerName: 'Patient Id', width: 160 },
            { field: 'patientsName', headerName: 'Patient Name', width: 160 },
            { field: 'accessionNumber', headerName: 'AccessionNumber', width: 180 },
            { field: 'studyID', headerName: 'studyID', hide: true, width: 120 },
            { field: 'studyDate', headerName: 'Study Date', width: 120 },
            { field: 'modality', headerName: 'Modality', width: 120 },
            { field: 'studyDescription', headerName: 'StudyDescription', flex: 1, minWidth: 200 },
            { field: 'qcGuid', hide: true, width: 120 },
        ],
    },
    logByUser: {
        colDef: [
            { field: 'patientId', headerName: 'PatientId', width: 160 },
            { field: 'accessionNumber', headerName: 'AccessionNo.', width: 200 },
            { field: 'studyDate', headerName: 'StudyDate', width: 140 },
            { field: 'modality', headerName: 'Modality', width: 100 },
            { field: 'studyDescription', headerName: 'StudyDescription', flex: 1, minWidth: 200 },
            { field: 'qcGuid', hide: true, width: 120 },
        ],
    },
};

export const defaultQueryFields = ['patientId', 'accessionNumber', 'modality', 'studyDate'];
export const dbQueryField = [
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

export const defaultQRQueryFields = ['patientId', 'accessionNumber', 'modality', 'studyDate', 'queryName'];
export const qrQueryField = [
    ...dbQueryField,
    ...[
        {
            field: 'queryName',
            label: 'Query Target',
            type: 'SingleSelect',
            disabled: true,
            defaultSelectFirstItem: true,
            optionSource: {
                type: 'http',
                source: 'configuration/dicomOperationNode/operationType/Query-Retrieve',
                key: 'name',
                labelKey: 'name',
            },
        },
    ],
];

export const defaultWorklistQueryFields = ['patientId', 'accessionNumber', 'modality', 'studyDate', 'queryName'];
export const worklistQueryFields = [
    ...dbQueryField,
    ...[
        {
            field: 'queryName',
            label: 'Query Target',
            type: 'SingleSelect',
            disabled: true,
            defaultSelectFirstItem: true,
            optionSource: {
                type: 'http',
                source: 'configuration/dicomOperationNode/operationType/Worklist',
                key: 'name',
                labelKey: 'name',
            },
        },
    ],
];
