import * as React from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

interface Props {
    open: boolean;
    setOpen: (isOpen: boolean) => void;
    children?: React.ReactNode;
    width?: string;
    height?: string;
    maxHeight?: string;
}

const BaseModal = ({ open, setOpen, children, width = '70%', height = 'auto', maxHeight }: Props) => {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute' as const,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width,
                    height,
                    maxHeight,
                    overflow: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                {children}
            </Box>
        </Modal>
    );
};

export default BaseModal;
