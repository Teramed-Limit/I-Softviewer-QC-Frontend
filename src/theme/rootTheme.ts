import { createTheme } from '@mui/material/styles';

export const rootTheme = createTheme({
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        MuiButton: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiCheckbox: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    padding: '4px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    transition: 'none',
                },
            },
        },
    },
});
