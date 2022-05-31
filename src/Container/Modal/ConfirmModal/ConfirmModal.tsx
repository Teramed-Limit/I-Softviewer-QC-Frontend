import * as React from 'react';
import { forwardRef } from 'react';

import { Typography } from '@mui/material';

import { BaseModalHandle, useModal } from '../../../hooks/useModal';
import BaseModal from '../../BaseModal/BaseModal';

type ConfirmModalProps = { confirmMessage: string; onConfirmCallback: () => void };

const ConfirmModal = forwardRef<BaseModalHandle, ConfirmModalProps>((props, ref) => {
    const { modalOpen, setModalOpen } = useModal(ref);

    const onConfirm = () => {
        props.onConfirmCallback();
        setModalOpen(false);
    };

    return (
        <BaseModal
            width="40%"
            maxHeight="80%"
            open={modalOpen}
            setOpen={setModalOpen}
            footer={{
                actionLabel: 'Confirm',
                actionHandler: onConfirm,
            }}
        >
            <Typography variant="h3" gutterBottom component="div">
                {props.confirmMessage}
            </Typography>
        </BaseModal>
    );
});

export default ConfirmModal;
