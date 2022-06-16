import * as React from 'react';
import { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { Chip, Divider, IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { useClientMethod } from '../../hooks/signalr/useClientMethod';
import { useHubMethod } from '../../hooks/signalr/useHubMethod';
import { Room } from '../../interface/room';
import { RoomMember } from '../../interface/room-member';
import SocketService from '../../services/SocketService';
import TokenService from '../../services/TokenService';

function SessionList() {
    const [onlineList, setOnlineList] = useState<string[]>([]);
    const [roomMemberList, setRoomMemberList] = useState<RoomMember[]>([]);

    // Websocket
    const { invoke: getOnlineAccount } = useHubMethod<string[]>(SocketService.getConnection(), 'GetOnlineAccount');
    const { invoke: getRoomMember } = useHubMethod<Room>(SocketService.getConnection(), 'GetRoomMember');
    const { invoke: inviteMember } = useHubMethod(SocketService.getConnection(), 'InviteMember');

    // continuously update online user
    useClientMethod(SocketService.getConnection(), 'UpdateOnlineList', (list: string[]) => {
        setOnlineList(list.filter((x) => x !== TokenService.getUserName()));
    });

    // continuously update member in room
    useClientMethod(SocketService.getConnection(), 'UpdateRoomMember', (result: Room) => {
        if (!result) return;
        setRoomMemberList(result.memberList);
    });

    // continuously monitor session host leaving
    useClientMethod(SocketService.getConnection(), 'SessionHostLeave', (result: Room) => {});

    useEffect(() => {
        getOnlineAccount().then((list) => {
            if (!list) return;
            setOnlineList(list);
        });
        getRoomMember(TokenService.getUserName()).then((result) => {
            if (!result) return;
            setRoomMemberList(result.memberList);
        });
    }, [getOnlineAccount, getRoomMember]);

    return (
        <>
            <Typography sx={{ p: '8px 16px' }} variant="subtitle1" component="div">
                Room - {TokenService.getUserName()}
            </Typography>
            <List sx={{ pt: 0 }}>
                {roomMemberList.map((member: RoomMember) => (
                    <ListItem
                        key={member.name}
                        sx={{ minWidth: '200px' }}
                        secondaryAction={<Chip label={member.isOwner ? 'Host' : 'Member'} variant="outlined" />}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <PersonIcon sx={{ color: blue[600] }} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={member.name} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Typography sx={{ p: '8px 16px' }} variant="subtitle1" component="div">
                Invite List
            </Typography>
            <List sx={{ pt: 0 }}>
                {onlineList.map((userName) => (
                    <ListItem
                        key={userName}
                        sx={{ minWidth: '200px' }}
                        secondaryAction={
                            <IconButton
                                edge="end"
                                onClick={() =>
                                    inviteMember(
                                        TokenService.getUserName(),
                                        userName,
                                        TokenService.getUserName(),
                                        window.location.pathname,
                                    ).then()
                                }
                            >
                                <AddIcon sx={{ borderRadius: '12px', bgcolor: blue[100], color: blue[600] }} />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={userName} />
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export default SessionList;
