import * as React from 'react';

import { Typography } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

interface Props extends ButtonProps {
    iconPos?: 'left' | 'right' | 'top' | 'bottom';
}

const StyleButton = styled(Button)<ButtonProps>(({ variant }) => ({
    textTransform: 'none',
    background: '#113F71',
    border: variant === 'contained' ? '1px solid rgba(89, 193, 198, 0.3)' : 'none',
    borderRadius: '4px',
    fontFamily: "'PT Sans Narrow', sans-serif",
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '26px',

    '&:hover': {
        opacity: 0.6,
        backgroundColor: 'transparent',
    },

    '&:active': {
        opacity: 0.4,
    },

    '&:disabled': {
        opacity: 0.2,
    },
}));

function MenuAppButton(props: Props) {
    return (
        <StyleButton {...props}>
            <Typography
                style={
                    {
                        WebkitTextFillColor: 'transparent',
                    } as React.CSSProperties
                }
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: '#B6B6B6',
                    background: 'linear-gradient(143.56deg, #91EAE4 -24.45%, #86A8E7 41.76%, #7F7FD5 110.97%)',
                    backgroundClip: 'text',
                }}
                variant="button2"
                component="span"
            >
                {props.children}
            </Typography>
        </StyleButton>
    );
}

export default MenuAppButton;
