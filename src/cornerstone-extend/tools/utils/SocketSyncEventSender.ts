import SocketService from '../../../services/SocketService';

export class SocketSyncEventSender {
    sync(eventName, roomId, imageId, jsonValue) {
        SocketService.getConnection()
            .invoke(
                'ViewPortSyncEvent',
                // Event Name
                eventName,
                // RoomId
                roomId,
                // Image Id
                imageId,
                // Image change value
                jsonValue,
            )
            .then();
    }
}
