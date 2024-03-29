import React from 'react';

import { lighten } from '@mui/material';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
    interface Palette {
        neutral: Palette['primary'];
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }
}

declare module '@mui/material/styles' {
    interface TypographyVariants {
        body1Bold: React.CSSProperties;
        body3Bold: React.CSSProperties;
        button2: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        body1Bold?: React.CSSProperties;
        body3Bold?: React.CSSProperties;
        button2?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        body1Bold: true;
        body3Bold: true;
        button2: true;
    }
}

export const rootTheme = createTheme({
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl'],
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
        unit: 'px',
    },
    direction: 'ltr',
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    // background: '#1E3E62',
                    '& label': {
                        fontWeight: 700,
                        background: 'linear-gradient(143.56deg, #91EAE4 -24.45%, #86A8E7 41.76%, #7F7FD5 110.97%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    },
                    '& label.Mui-focused': {
                        WebkitTextFillColor: '#DBDBDB',
                    },
                    '& label.MuiInputLabel-shrink': {
                        WebkitTextFillColor: '#DBDBDB',
                    },
                    '& input': {
                        color: '#DBDBDB',
                        background: '#1E3E62',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderWidth: 2,
                            borderColor: '#494949',
                        },
                        '&:hover fieldset': {
                            borderColor: lighten('#494949', 0.5),
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#DBDBDB',
                            borderLeftWidth: '6px',
                        },
                    },
                    '& .MuiFormHelperText-root': {
                        fontSize: '1rem',
                    },
                },
            },
        },
        MuiInput: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    background: '#1E3E62',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {},
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableTouchRipple: true,
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
                variant: 'contained',
            },
            styleOverrides: {
                sizeSmall: { height: '44px' },
                sizeMedium: { height: '56px' },
                sizeLarge: { height: '68px' },
                containedPrimary: {
                    color: '#fff',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    padding: '8px',
                    color: '#fff',
                    fontWeight: 700,
                },
                sizeSmall: { fontSize: '14px' },
                sizeMedium: { fontSize: '18px' },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    '@media (min-width:900px)': {
                        paddingLeft: '16px',
                        paddingRight: '16px',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#132F4C',
                },
            },
        },
        MuiLink: {
            defaultProps: {
                underline: 'none',
            },
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    '&.MuiTypography-body1 > svg': {
                        marginTop: 2,
                    },
                    '& svg:last-child': {
                        marginLeft: 2,
                    },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 5,
                    '&:hover, &:focus': {
                        backgroundColor: '',
                    },
                },
            },
        },
        MuiSelect: {
            defaultProps: {},
            styleOverrides: {
                select: {
                    background: '#1E3E62',
                },
                iconFilled: {
                    top: 'calc(50% - .25em)',
                },
            },
        },
        MuiTab: {
            defaultProps: {
                disableTouchRipple: true,
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0A1929',
                    '&[href]': {
                        textDecorationLine: 'none',
                    },
                },
                outlined: {
                    display: 'block',
                    borderColor: '#265D97',
                    backgroundColor: '#132F4C',
                    'a&, button&': {
                        '&:hover': {
                            boxShadow: '1px 1px 20px 0 rgb(90 105 120 / 20%)',
                        },
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '8px 16px',
                    borderColor: '#132F4C',
                },
                head: {
                    color: '#fff',
                    fontWeight: 700,
                },
                body: {
                    color: '#B2BAC2',
                },
            },
        },
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0A1929',
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 700,
                    color: '#CDD2D7',
                    borderColor: '#1E4976',
                    '&.Mui-selected': {
                        color: '#fff',
                        borderColor: 'undefined !important',
                        backgroundColor: '#132F4C',
                        '&:hover': {
                            backgroundColor: '#173A5E',
                        },
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    paddingTop: 7,
                    paddingBottom: 7,
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
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#5090D3',
            contrastText: '#fff',
        },
        divider: '#132F4C',
        background: {
            default: '#0C4079',
            paper: '#0A1929',
        },
        common: {
            black: '#1D1D1D',
            white: '#fff',
        },
        text: {
            primary: '#fff',
            secondary: '#B2BAC2',
            disabled: 'rgba(255, 255, 255, 0.5)',
        },
        grey: {
            '50': '#F3F6F9',
            '100': '#E7EBF0',
            '200': '#E0E3E7',
            '300': '#CDD2D7',
            '400': '#B2BAC2',
            '500': '#A0AAB4',
            '600': '#6F7E8C',
            '700': '#3E5060',
            '800': '#2D3843',
            '900': '#1A2027',
            A100: '#f5f5f5',
            A200: '#eeeeee',
            A400: '#bdbdbd',
            A700: '#616161',
        },
        error: {
            '50': '#FFF0F1',
            '100': '#FFDBDE',
            '200': '#FFBDC2',
            '300': '#FF99A2',
            '400': '#FF7A86',
            '500': '#FF505F',
            '600': '#EB0014',
            '700': '#C70011',
            '800': '#94000D',
            '900': '#570007',
            main: '#EB0014',
            light: '#FF99A2',
            dark: '#C70011',
            contrastText: '#fff',
        },
        success: {
            '50': '#E9FBF0',
            '100': '#C6F6D9',
            '200': '#9AEFBC',
            '300': '#6AE79C',
            '400': '#3EE07F',
            '500': '#21CC66',
            '600': '#1DB45A',
            '700': '#1AA251',
            '800': '#178D46',
            '900': '#0F5C2E',
            main: '#1DB45A',
            light: '#6AE79C',
            dark: '#1AA251',
            contrastText: '#fff',
        },
        warning: {
            '50': '#FFF9EB',
            '100': '#FFF3C1',
            '200': '#FFECA1',
            '300': '#FFDC48',
            '400': '#F4C000',
            '500': '#DEA500',
            '600': '#D18E00',
            '700': '#AB6800',
            '800': '#8C5800',
            '900': '#5A3600',
            main: '#DEA500',
            light: '#FFDC48',
            dark: '#AB6800',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057',
            light: 'rgb(247, 51, 120)',
            dark: 'rgb(171, 0, 60)',
            contrastText: '#fff',
        },
        info: {
            main: '#29b6f6',
            light: '#4fc3f7',
            dark: '#0288d1',
            contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        neutral: {
            main: '#ff940f',
            contrastText: '#fff',
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
        action: {
            active: '#fff',
            hover: 'rgba(255, 255, 255, 0.08)',
            hoverOpacity: 0.08,
            selected: 'rgba(255, 255, 255, 0.16)',
            selectedOpacity: 0.16,
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(255, 255, 255, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
        },
    },
    unstable_strictMode: true,
    typography: {
        fontFamily: "'PT Sans Narrow', sans-serif",
        htmlFontSize: 16,
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '52px',
        },
        h2: {
            fontSize: '28px',
            fontWeight: 700,
            fontStyle: 'normal',
            lineHeight: '36px',
        },
        h3: {
            fontSize: '24px',
            fontWeight: 700,
        },
        h4: {
            fontSize: '20px',
            fontWeight: 400,
        },
        h5: {
            fontSize: '16px',
            fontWeight: 400,
        },
        h6: {
            fontSize: '12px',
            fontWeight: 400,
        },
        button: {
            textTransform: 'none',
            fontSize: '20px',
            fontWeight: 700,
            fontStyle: 'normal',
            lineHeight: '26px',
        },
        button2: {
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 700,
            fontStyle: 'normal',
            lineHeight: '18px',
        },
        subtitle1: {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '31px',
            color: '#b6b6b6',
        },
        body1: {
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 400,
            fontStyle: 'normal',
            lineHeight: '25px',
        },
        body1Bold: {
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            fontStyle: 'normal',
            lineHeight: '25px',
        },
        body2: {
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 400,
            fontStyle: 'normal',
            lineHeight: '21px',
        },
        body3Bold: {
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            fontStyle: 'normal',
            lineHeight: '16px',
        },
        caption: {
            display: 'inline-block',
            fontSize: '0.75rem',
            lineHeight: 1.5,
            letterSpacing: 0,
            fontWeight: 700,
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.57,
        },
        overline: {
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 2.66,
            textTransform: 'uppercase',
        },
    },
    mixins: {
        toolbar: {
            minHeight: 56,
            '@media (min-width:0px) and (orientation: landscape)': {
                minHeight: 48,
            },
            '@media (min-width:600px)': {
                minHeight: 64,
            },
        },
    },
    shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
        '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
        '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
        '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
        '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
        '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
        '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
        '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
        '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
        '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
        '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
        '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
        '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
        '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
        '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
        '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
        '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
        '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
        '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
        '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
        '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
        '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
        '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
    ],
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
    zIndex: {
        mobileStepper: 1000,
        speedDial: 1050,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
    },
});
