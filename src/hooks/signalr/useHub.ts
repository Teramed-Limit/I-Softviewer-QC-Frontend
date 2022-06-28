import { useEffect, useState } from 'react';

import { HubConnection, HubConnectionState } from '@microsoft/signalr';

import SocketService from '../../services/SocketService';

/**
 * Start/Stop the provided hub connection (on connection change or when the component is unmounted)
 * @param {HubConnection} hubConnection The signalR hub connection
 * @return {HubConnection} the current signalr connection
 * @return {any} the signalR error in case the start does not work
 */

export function useHub(hubConnection: HubConnection) {
    const [hubConnectionState, setHubConnectionState] = useState<HubConnectionState>(
        hubConnection?.state ?? HubConnectionState.Disconnected,
    );
    const [error, setError] = useState();

    useEffect(() => {
        setError(undefined);

        if (!hubConnection) {
            setHubConnectionState(HubConnectionState.Disconnected);
            SocketService.hubConnectionState$.next(HubConnectionState.Disconnected);
            return;
        }

        let isMounted = true;
        const onStateUpdatedCallback = () => {
            if (isMounted) {
                setHubConnectionState(hubConnection?.state);
                SocketService.hubConnectionState$.next(hubConnection?.state);
            }
        };
        hubConnection.onclose(onStateUpdatedCallback);
        hubConnection.onreconnected(onStateUpdatedCallback);
        hubConnection.onreconnecting(onStateUpdatedCallback);

        if (hubConnection.state === HubConnectionState.Disconnected) {
            const startPromise = hubConnection
                .start()
                .then(onStateUpdatedCallback)
                .catch((reason) => setError(reason));
            onStateUpdatedCallback();

            return () => {
                startPromise.then(() => {
                    hubConnection?.stop();
                });
                isMounted = false;
            };
        }

        return () => {
            hubConnection?.stop();
        };
    }, [hubConnection]);

    return { hubConnectionState, error };
}
