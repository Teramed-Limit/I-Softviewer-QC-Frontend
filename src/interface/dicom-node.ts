export interface DicomNode {
    name: string;
    aeTitle: string;
    ipAddress: string;
    portNumber: number;
    remoteAETitle: string;
    needConfirmIPAddress: string;
    imageCompression: number;
    compressQuality: number;
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
    worklistQueryPattern: number;
    department: string;
}
