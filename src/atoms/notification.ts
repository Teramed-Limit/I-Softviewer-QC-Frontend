import { atom } from 'recoil';

import { MessageType } from '../interface/notification';

export const atomNotification = atom({
    key: 'notification',
    default: {
        messageType: MessageType.Success,
        message: '',
    },
});
