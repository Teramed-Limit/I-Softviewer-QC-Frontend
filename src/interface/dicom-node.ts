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
