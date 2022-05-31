import * as React from 'react';

import { darken } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyleButton = styled(Button)<ButtonProps>(({ variant }) => {
    let border;
    let background;
    switch (variant) {
        case 'contained':
            border = '1px solid rgba(89, 193, 198, 0.3)';
            background = '#113F71';
            break;
        case 'outlined':
            border = '1px solid rgba(89, 193, 198, 0.3)';
            background = 'transparent';
            break;
        case 'text':
            border = 'transparent';
            background = 'transparent';
            break;
        default:
            border = '1px solid rgba(89, 193, 198, 0.3)';
            background = '#113F71';
    }

    return {
        textTransform: 'none',
        background,
        border,
        borderRadius: '4px',
        fontFamily: "'PT Sans Narrow', sans-serif",
        fontSize: '20px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '26px',
        color: '#B6B6B6',
        width: '167px',
        height: '44px',

        '&:active': {
            background: darken('#B6B6B6', 0.8),
            opacity: 0.4,
        },

        '&:disabled': {
            background: '#0B2D51',
            opacity: '0.4',
        },
    };
});

function SecondaryButton(props: ButtonProps) {
    return (
        <StyleButton {...props} disableRipple>
            {props.children}
        </StyleButton>
    );
}

export default SecondaryButton;
