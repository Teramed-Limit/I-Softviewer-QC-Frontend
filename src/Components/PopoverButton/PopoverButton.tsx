import React from 'react';

import { Button, Popover } from '@mui/material';

interface Props {
    label?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'text' | 'outlined' | 'contained';
    children: React.ReactNode;
    renderCustomButton?: ((props: any) => React.ReactNode) | undefined;
}

const PopoverButton = ({
    label = 'select',
    size = 'small',
    variant = 'contained',
    children,
    renderCustomButton,
}: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const closePopover = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    const id = open ? 'popover' : undefined;

    return (
        <>
            {renderCustomButton != null ? (
                renderCustomButton({ onClick: openPopover })
            ) : (
                <Button size={size} variant={variant} onClick={openPopover}>
                    {label}
                </Button>
            )}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {children}
            </Popover>
        </>
    );
};

export default PopoverButton;
