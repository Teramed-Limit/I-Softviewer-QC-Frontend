import React, { useEffect, useState } from 'react';

import { HubConnectionState } from '@microsoft/signalr';
import GroupIcon from '@mui/icons-material/Group';
import { Box } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import { distinctUntilChanged } from 'rxjs';

import DicomViewer from '../../Components/DicomViewer/DicomViewer';
import IconButton from '../../Components/IconButton/IconButton';
import SessionList from '../../Components/SessionList/SessionList';
import { ViewerSessionMode } from '../../cornerstone-extend/tools';
import { useClientMethod } from '../../hooks/signalr/useClientMethod';
import { useHubMethod } from '../../hooks/signalr/useHubMethod';
import { useDicom } from '../../hooks/useDicom';
import SocketService from '../../services/SocketService';
import TokenService from '../../services/TokenService';
import ToolSyncEventHandlerService from '../../services/ToolSyncEventHandlerService';

// import classes from './ViewerSession.module.scss';

const ViewerSession = () => {
    const history = useHistory();

    const [connectionState, setConnectionState] = useState<HubConnectionState>(HubConnectionState.Disconnected);

    const { invoke: leaveRoom } = useHubMethod(SocketService.getConnection(), 'LeaveRoom');

    const { studyInsUID, roomId } = useParams<{ studyInsUID: string; roomId: string }>();

    const { dcmUrlList } = useDicom(studyInsUID);

    const [isRoomOwner] = useState(roomId === TokenService.getUserName());

    // Session host not exist then leave room
    useClientMethod(SocketService.getConnection(), 'SessionHostLeave', () => {
        onLeaveRoom();
    });

    // Check room exist or not
    useEffect(() => {}, []);

    // Monitor hub connection state
    useEffect(() => {
        const subscription = SocketService.hubConnectionState$
            .asObservable()
            .pipe(distinctUntilChanged())
            .subscribe(setConnectionState);
        return () => subscription.unsubscribe();
    }, []);

    // Leave the room
    const onLeaveRoom = () => {
        leaveRoom(roomId, isRoomOwner).then(() => {
            history.push({
                pathname: `/qualityControl/viewer/studies/studyInstanceUID/${studyInsUID}`,
            });
        });
    };

    // ViewPort receive by others
    useClientMethod(SocketService.getConnection(), 'ViewPortRefreshV2', (imageId, eventName, eventParamsJson) => {
        ToolSyncEventHandlerService.eventHandlerContext.handle(imageId, eventName, eventParamsJson);
    });

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f2742', p: '6px' }}>
                <Box sx={{ p: '8px 0' }}>Consultating...</Box>
                {isRoomOwner && connectionState === HubConnectionState.Connected && <SessionList />}
                <DicomViewer
                    viewerSessionMode={ViewerSessionMode.Online}
                    imageIds={dcmUrlList}
                    externalTools={
                        <>
                            <IconButton
                                isActive={false}
                                IconComp={<GroupIcon />}
                                label="Leave Consultation"
                                onClick={() => onLeaveRoom()}
                            />
                        </>
                    }
                />
            </Box>
        </>
    );
};

export default ViewerSession;
