import { createTheme } from "@mui/material/styles";

import type { DmrTheme } from "./variables-visuales";

export function crearTemaMui(dmrTheme: DmrTheme) {
    const controlHeight = dmrTheme.density.default.controlHeight;

    return createTheme({
        cssVariables: { nativeColor: true },
        dmr: dmrTheme,
        palette: {
            mode: "dark",
            primary: {
                main: dmrTheme.primary.default,
                light: dmrTheme.primary.hover,
                dark: dmrTheme.primary.active,
                contrastText: dmrTheme.primary.foreground,
            },
            secondary: {
                main: dmrTheme.secondary.default,
                light: dmrTheme.secondary.hover,
                dark: dmrTheme.secondary.active,
                contrastText: dmrTheme.secondary.foreground,
            },
            success: {
                main: dmrTheme.estados.success.default,
                light: dmrTheme.estados.success.hover,
                dark: dmrTheme.estados.success.active,
                contrastText: dmrTheme.textos.inverse,
            },
            warning: {
                main: dmrTheme.estados.warning.default,
                light: dmrTheme.estados.warning.hover,
                dark: dmrTheme.estados.warning.active,
                contrastText: dmrTheme.textos.inverse,
            },
            error: {
                main: dmrTheme.estados.error.default,
                light: dmrTheme.estados.error.hover,
                dark: dmrTheme.estados.error.active,
                contrastText: dmrTheme.textos.inverse,
            },
            info: {
                main: dmrTheme.estados.info.default,
                light: dmrTheme.estados.info.hover,
                dark: dmrTheme.estados.info.active,
                contrastText: dmrTheme.textos.inverse,
            },
            background: {
                default: dmrTheme.superficies.background,
                paper: dmrTheme.superficies.card,
            },
            text: {
                primary: dmrTheme.textos.primary,
                secondary: dmrTheme.textos.secondary,
                disabled: dmrTheme.textos.disabled,
            },
            divider: dmrTheme.borders.subtle,
            action: {
                hover: dmrTheme.superficies.hover,
                selected: dmrTheme.primary.subtle,
                disabled: dmrTheme.textos.disabled,
                disabledBackground: dmrTheme.superficies.interactive,
                focus: dmrTheme.primary.focusRing,
            },
        },
        spacing: dmrTheme.spacing.xs,
        shape: { borderRadius: dmrTheme.radius.md },
        typography: {
            fontFamily: dmrTheme.typography.fontFamily.base,
            fontSize: 14,
            h1: dmrTheme.typography["6xl"],
            h2: dmrTheme.typography["5xl"],
            h3: dmrTheme.typography["4xl"],
            h4: dmrTheme.typography["3xl"],
            h5: dmrTheme.typography["2xl"],
            h6: dmrTheme.typography.xl,
            subtitle1: dmrTheme.typography.lg,
            subtitle2: dmrTheme.typography.md,
            body1: dmrTheme.typography.md,
            body2: dmrTheme.typography.sm,
            button: {
                ...dmrTheme.typography.md,
                fontWeight: dmrTheme.typography.lg.fontWeight,
                textTransform: "none",
            },
            caption: dmrTheme.typography.xs,
            overline: {
                ...dmrTheme.typography.xs,
                fontWeight: dmrTheme.typography.xl.fontWeight,
                textTransform: "uppercase",
            },
        },
        transitions: {
            duration: {
                shortest: dmrTheme.motion.duration.fast,
                shorter: dmrTheme.motion.duration.fast,
                short: dmrTheme.motion.duration.fast,
                standard: dmrTheme.motion.duration.normal,
                complex: dmrTheme.motion.duration.slow,
                enteringScreen: dmrTheme.motion.duration.slow,
                leavingScreen: dmrTheme.motion.duration.normal,
            },
            easing: {
                easeInOut: dmrTheme.motion.easing.standard,
                easeOut: dmrTheme.motion.easing.emphasized,
                easeIn: dmrTheme.motion.easing.standard,
                sharp: dmrTheme.motion.easing.emphasized,
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    html: { backgroundColor: dmrTheme.superficies.background },
                    body: {
                        backgroundColor: dmrTheme.superficies.background,
                        color: dmrTheme.textos.primary,
                        fontFamily: dmrTheme.typography.fontFamily.base,
                    },
                    "*::selection": {
                        backgroundColor: dmrTheme.primary.subtle,
                        color: dmrTheme.textos.primary,
                    },
                    "@media (prefers-reduced-motion: reduce)": {
                        "*, *::before, *::after": {
                            animationDuration: "0.01ms !important",
                            animationIterationCount: "1 !important",
                            scrollBehavior: "auto !important",
                            transitionDuration: "0.01ms !important",
                        },
                    },
                },
            },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        minHeight: controlHeight,
                        borderRadius: dmrTheme.radius.sm,
                        transition: `background-color ${dmrTheme.motion.duration.fast}ms ${dmrTheme.motion.easing.standard}, border-color ${dmrTheme.motion.duration.fast}ms ${dmrTheme.motion.easing.standard}, color ${dmrTheme.motion.duration.fast}ms ${dmrTheme.motion.easing.standard}`,
                        "&:focus-visible": {
                            outline: `2px solid ${dmrTheme.borders.focus}`,
                            outlineOffset: dmrTheme.spacing.xs,
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: dmrTheme.radius.md,
                        backgroundColor: dmrTheme.superficies.card,
                        backgroundImage: "none",
                        boxShadow: dmrTheme.elevation.card,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: "none" },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        minHeight: controlHeight,
                        borderRadius: dmrTheme.radius.sm,
                        backgroundColor: dmrTheme.superficies.interactive,
                        transition: `background-color ${dmrTheme.motion.duration.fast}ms ${dmrTheme.motion.easing.standard}, border-color ${dmrTheme.motion.duration.fast}ms ${dmrTheme.motion.easing.standard}`,
                        "&:hover": { backgroundColor: dmrTheme.superficies.hover },
                        "&.Mui-focused": {
                            boxShadow: `0 0 0 3px ${dmrTheme.primary.focusRing}`,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: dmrTheme.borders.default,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: dmrTheme.borders.strong,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: dmrTheme.borders.focus,
                        },
                    },
                    input: dmrTheme.typography.md,
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: { color: dmrTheme.textos.secondary },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    select: { minHeight: "auto" },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        ...dmrTheme.typography.xs,
                        backgroundColor: dmrTheme.glass.background,
                        border: `1px solid ${dmrTheme.glass.border}`,
                        borderRadius: dmrTheme.radius.sm,
                        boxShadow: dmrTheme.elevation.floating,
                        backdropFilter: `blur(${dmrTheme.glass.blur}) saturate(${dmrTheme.glass.saturate})`,
                        color: dmrTheme.textos.primary,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: dmrTheme.radius.lg,
                        backgroundColor: dmrTheme.superficies.cardElevated,
                        boxShadow: dmrTheme.elevation.dialog,
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: dmrTheme.superficies.panel,
                        borderColor: dmrTheme.borders.subtle,
                        boxShadow: dmrTheme.elevation.panel,
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderColor: dmrTheme.borders.subtle,
                        color: dmrTheme.textos.secondary,
                    },
                    head: {
                        ...dmrTheme.typography.sm,
                        color: dmrTheme.textos.tertiary,
                        fontWeight: dmrTheme.typography.xl.fontWeight,
                    },
                    sizeSmall: {
                        padding: dmrTheme.spacing.sm,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: dmrTheme.radius.pill,
                        minHeight: dmrTheme.density.compact.controlHeight,
                    },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: { borderRadius: dmrTheme.radius.sm },
                    colorSuccess: {
                        backgroundColor: dmrTheme.estados.success.subtle,
                        color: dmrTheme.estados.success.foreground,
                        "& .MuiAlert-icon": { color: dmrTheme.estados.success.default },
                    },
                    colorError: {
                        backgroundColor: dmrTheme.estados.error.subtle,
                        color: dmrTheme.estados.error.foreground,
                        "& .MuiAlert-icon": { color: dmrTheme.estados.error.default },
                    },
                    colorWarning: {
                        backgroundColor: dmrTheme.estados.warning.subtle,
                        color: dmrTheme.estados.warning.foreground,
                        "& .MuiAlert-icon": { color: dmrTheme.estados.warning.default },
                    },
                    colorInfo: {
                        backgroundColor: dmrTheme.estados.info.subtle,
                        color: dmrTheme.estados.info.foreground,
                        "& .MuiAlert-icon": { color: dmrTheme.estados.info.default },
                    },
                },
            },
        },
    });
}
