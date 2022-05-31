import * as React from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import ModalFooter from './ModalFooter/ModalFooter';

interface Props {
    open: boolean;
    setOpen: (isOpen: boolean) => void;
    children?: React.ReactNode;
    width?: string;
    height?: string;
    maxHeight?: string;
    footer?: {
        // action string
        actionLabel?: string;
        // cancel string
        cancelLabel?: string;
        // action callback
        actionHandler?: () => void;
        // cancel callback
        cancelActionHandler?: () => void;
    };
}

const BaseModal = ({
    open,
    setOpen,
    children,
    width = '70%',
    height = 'auto',
    maxHeight,
    footer = undefined,
}: Props) => {
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
                    border: '2px solid #444444',
                    borderRadius: '4px',
                    p: 4,
                }}
            >
                {children}
                {footer && (
                    <ModalFooter
                        setOpen={setOpen}
                        actionLabel={footer.actionLabel}
                        cancelLabel={footer.cancelLabel}
                        actionHandler={footer.actionHandler}
                        cancelActionHandler={footer.cancelActionHandler}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default BaseModal;
