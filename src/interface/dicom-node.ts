export interface DicomNode {
    name: string;
    operationType: string;
    aeTitle: string;
    sendingAETitle: string;
    hostName: string;
    ipAddress: string;
    port: number;
    description: string;
    createDateTime: string;
    createUser: string;
    modifiedDateTime: string;
    modifiedUser: string;
    enable: number;
}
