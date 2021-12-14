export interface Notification {
    messageType: MessageType;
    message: string;
}

export enum MessageType {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}
