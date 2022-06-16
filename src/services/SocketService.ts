import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ReplaySubject } from 'rxjs';

import TokenService from './TokenService';

let connection: HubConnection;
const hubConnectionState$ = new ReplaySubject<HubConnectionState>();

const getConnection = () => {
    if (connection) return connection;

    connection = new HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_REST_API}/hubs/chat`, {
            accessTokenFactory: () => TokenService.getLocalAccessToken(),
        })
        .withAutomaticReconnect()
        .build();

    hubConnectionState$.next(connection.state);
    return connection;
};

const SocketService = {
    getConnection,
    hubConnectionState$,
};

export default SocketService;
