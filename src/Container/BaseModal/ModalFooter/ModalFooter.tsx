import * as React from 'react';

import { Button } from '@mui/material';

import classes from './ModalFooter.module.scss';

interface Props {
    actionLabel?: string;
    cancelLabel?: string;
    setOpen: (isOpen: boolean) => void;
    actionHandler?: () => void;
    cancelActionHandler?: () => void;
}

const ModalFooter = ({
    setOpen,
    cancelActionHandler,
    actionHandler,
    cancelLabel = 'Cancel',
    actionLabel = 'Save',
}: Props) => {
    return (
        <div className={classes.footer}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                    setOpen(false);
                    cancelActionHandler?.();
                }}
            >
                {cancelLabel}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    actionHandler?.();
                }}
            >
                {actionLabel}
            </Button>
        </div>
    );
};

export default ModalFooter;
