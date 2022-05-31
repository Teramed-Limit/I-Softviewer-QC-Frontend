import * as React from 'react';

import SecondaryButton from '../../../Components/SecondaryButton/SecondaryButton';
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
            <SecondaryButton
                variant="outlined"
                color="primary"
                onClick={() => {
                    setOpen(false);
                    cancelActionHandler?.();
                }}
            >
                {cancelLabel}
            </SecondaryButton>
            <SecondaryButton
                variant="contained"
                color="primary"
                onClick={() => {
                    actionHandler?.();
                }}
            >
                {actionLabel}
            </SecondaryButton>
        </div>
    );
};

export default ModalFooter;
