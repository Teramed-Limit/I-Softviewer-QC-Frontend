import { createTheme } from '@mui/material/styles';

export const rootTheme = createTheme({
    transitions: {
        duration: {
            shortest: 74,
            shorter: 100,
            short: 125,
            // most basic recommended timing
            standard: 150,
            // this is to be used in complex animations
            complex: 160,
            // recommended when something is entering screen
            enteringScreen: 100,
            // recommended when something is leaving screen
            leavingScreen: 80,
        },
        easing: {
            easeInOut: 'cubic-bezier(0.2, 0, 0.1, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.1, 1)',
            easeIn: 'cubic-bezier(0.2, 0, 1, 1)',
            sharp: 'cubic-bezier(0.2, 0, 0.3, 1)',
        },
    },
    components: {
        MuiInput: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
        },
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
        MuiDialog: {
            styleOverrides: {
                root: {
                    transition: 'none',
                },
            },
        },
        // MuiFormControl: {
        //     styleOverrides: {
        //         root: {
        //             height: '32px',
        //         },
        //     },
        // },
        // MuiInputBase: {
        //     styleOverrides: {
        //         root: {
        //             height: '32px',
        //         },
        //     },
        // },
    },
});
