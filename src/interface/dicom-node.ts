export interface DicomOperationNode {
    name: string;
    operationType: string;
    aeTitle: string;
    remoteAETitle: string;
    ipAddress: string;
    port: number;
    moveAETitle: string;
    description: string;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    enable: number;
}

export interface DicomClientNode {
    imageCompression: string;
    compressQuality: string;
    worklistQueryPattern: string;
    name: string;
    aeTitle: string;
    ipAddress: string;
    portNumber: number;
    remoteAETitle: string;
    needConfirmIPAddress: string;
    description: string;
    priority: number;
    acceptedTransferSyntaxesCustomize: string;
    transferSyntaxesCustomize: string;
    worklistMatchKeys: string;
    worklistReturnKeys: string;
    serviceJobTypes: string;
    enabledAutoRouting: string;
    auotRoutingDestination: string;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    filterRulePattern: string;
    department: string;
}

export interface DicomServiceProvider {
    dicomServiceType: string;
    name: string;
    aeTitle: string;
    port: number;
}
