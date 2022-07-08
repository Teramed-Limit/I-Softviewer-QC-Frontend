import * as React from 'react';
import { forwardRef } from 'react';

import { Typography } from '@mui/material';

import { BaseModalHandle, useModal } from '../../../hooks/useModal';
import BaseModal from '../../BaseModal/BaseModal';

type ConfirmModalProps = {
    children?: React.ReactNode;
    confirmMessage: string;
    onConfirmCallback: () => void;
};

const ConfirmModal = forwardRef<BaseModalHandle, ConfirmModalProps>((props, ref) => {
    const { modalOpen, setModalOpen, modalActionSubject$ } = useModal(ref);

    const onConfirm = () => {
        props.onConfirmCallback();
        modalActionSubject$.next(true);
        setModalOpen(false);
    };

    return (
        <BaseModal
            width="40%"
            maxHeight="80%"
            open={modalOpen}
            setOpen={(v) => {
                setModalOpen(v);
                modalActionSubject$.next(false);
            }}
            footer={{
                actionLabel: 'Confirm',
                actionHandler: onConfirm,
            }}
        >
            <Typography variant="h3" gutterBottom component="div">
                {props.confirmMessage}
            </Typography>
            {props.children}
        </BaseModal>
    );
});

export default ConfirmModal;
