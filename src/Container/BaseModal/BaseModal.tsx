import * as React from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface Props {
    open: boolean;
    setOpen: (isOpen: boolean) => void;
    children?: React.ReactNode;
}

const BaseModal = ({ open, setOpen, children }: Props) => {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>{children}</Box>
        </Modal>
    );
};

export default BaseModal;
