import * as React from 'react';

import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyleButton = styled(Button)(({ variant }) => ({
    textTransform: 'none',
    background: 'linear-gradient(180deg, #CC6200 0%, #FF920E 22.4%, #FF940F 52.08%, #FF910E 72.92%, #CC6200 100%)',
    border: variant === 'contained' ? '1px solid #6D6D6D' : 'none',
    borderRadius: '6px',
    fontFamily: "'PT Sans Narrow', sans-serif",
    padding: '9px 24px',

    '&:hover': {
        opacity: 0.8,
    },

    '&:active': {
        opacity: 0.6,
    },

    '&:disabled': {
        opacity: 0.4,
    },
}));

function PrimaryButton(props: ButtonProps) {
    return (
        <StyleButton {...props} variant="contained" disableRipple>
            {props.children}
        </StyleButton>
    );
}

export default PrimaryButton;
