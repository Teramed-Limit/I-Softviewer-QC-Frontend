import React, { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

import SecondaryButton from '../../Components/SecondaryButton/SecondaryButton';
import { useClientMethod } from '../../hooks/signalr/useClientMethod';
import { useHub } from '../../hooks/signalr/useHub';
import { useHubMethod } from '../../hooks/signalr/useHubMethod';
import SocketService from '../../services/SocketService';
import BaseModal from '../BaseModal/BaseModal';

function SessionHub() {
    const history = useHistory();

    useHub(SocketService.getConnection());

    const [open, setOpen] = useState(false);
    const [inviter, setInviter] = useState('');
    const [inviteRoomId, setInviteRoomId] = useState('');
    const [consultationUrl, setConsultationUrl] = useState('');

    useClientMethod(SocketService.getConnection(), 'WaitForInvite', (roomInviter, roomId, url) => {
        setInviter(roomInviter);
        setInviteRoomId(roomId);
        setConsultationUrl(url);
        setOpen(true);
    });

    const { invoke: acceptInviting } = useHubMethod(SocketService.getConnection(), 'AcceptInvite');

    return (
        <>
            <BaseModal width="40%" maxHeight="80%" open={open} setOpen={setOpen}>
                <Typography sx={{ p: '16px 0' }} variant="h3" gutterBottom component="div">
                    You are invited by <span>{inviter}</span> to join consultation
                </Typography>
                <Stack sx={{ justifyContent: 'flex-end' }} direction="row" spacing={1}>
                    <SecondaryButton variant="outlined" color="primary" onClick={() => setOpen(false)}>
                        Reject
                    </SecondaryButton>
                    <SecondaryButton
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            acceptInviting(inviteRoomId).then(() => {
                                history.push({ pathname: consultationUrl });
                                setOpen(false);
                            });
                        }}
                    >
                        Accept
                    </SecondaryButton>
                </Stack>
            </BaseModal>
        </>
    );
}

export default SessionHub;
