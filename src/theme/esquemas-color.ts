import {
    amber,
    blue,
    charts,
    comfortableDensity,
    compactDensity,
    cyan,
    defaultDensity,
    estados,
    financial,
    green,
    neutral,
    numericTypography,
    primary,
    radius,
    red,
    secondary,
    spacing,
    textos,
    typography,
    variablesLayout,
    variablesMovimiento,
    violet,
} from "./variables-visuales";
import type {
    DmrBorders,
    DmrElevation,
    DmrGlass,
    DmrSuperficies,
    DmrTheme,
} from "./variables-visuales";

export type DmrColorScheme = "dark" | "deepDark";

export const darkSuperficies: DmrSuperficies = {
    background: "oklch(14% 0.028 250)",
    workspace: "oklch(16.5% 0.032 250)",
    panel: "oklch(19% 0.038 250)",
    card: "oklch(21.5% 0.044 250)",
    cardElevated: "oklch(25% 0.055 250)",
    interactive: "oklch(23% 0.050 250)",
    hover: "oklch(28% 0.070 250)",
    floating: "oklch(22.5% 0.055 250 / 0.92)",
    overlay: "oklch(5% 0.012 250 / 0.80)",
};

export const deepDarkSuperficies: DmrSuperficies = {
    background: "#01050B",
    workspace: "#020A13",
    panel: "#05111E",
    card: "#081726",
    cardElevated: "#0D2034",
    interactive: "#0A1B2D",
    hover: "#12304E",
    floating: "rgb(8 23 38 / 0.94)",
    overlay: "rgb(0 0 0 / 0.84)",
};

export const darkBorders: DmrBorders = {
    subtle: "oklch(78% 0.08 250 / 0.07)",
    default: "oklch(78% 0.08 250 / 0.12)",
    strong: "oklch(78% 0.10 250 / 0.21)",
    focus: blue[400],
};

export const deepDarkBorders: DmrBorders = {
    subtle: "oklch(78% 0.08 250 / 0.05)",
    default: "oklch(78% 0.08 250 / 0.10)",
    strong: "oklch(78% 0.10 250 / 0.18)",
    focus: blue[400],
};

export const darkGlass: DmrGlass = {
    background: "oklch(22.5% 0.055 250 / 0.80)",
    border: "oklch(78% 0.11 250 / 0.16)",
    highlight: "oklch(88% 0.06 250 / 0.07)",
    blur: "18px",
    saturate: "130%",
};

export const deepDarkGlass: DmrGlass = {
    background: "rgb(8 23 38 / 0.86)",
    border: "oklch(78% 0.11 250 / 0.13)",
    highlight: "oklch(88% 0.06 250 / 0.05)",
    blur: "20px",
    saturate: "125%",
};

export const darkElevation: DmrElevation = {
    background: "none",
    panel: "0 1px 2px rgb(0 0 0 / 0.14)",
    card: "0 1px 2px rgb(0 0 0 / 0.16), 0 8px 24px rgb(0 0 0 / 0.10)",
    floating: "0 8px 24px rgb(0 0 0 / 0.24), 0 18px 48px rgb(0 0 0 / 0.18)",
    dialog: "0 16px 40px rgb(0 0 0 / 0.34), 0 32px 80px rgb(0 0 0 / 0.28)",
};

export const deepDarkElevation: DmrElevation = {
    background: "none",
    panel: "0 1px 2px rgb(0 0 0 / 0.22)",
    card: "0 2px 6px rgb(0 0 0 / 0.22), 0 10px 28px rgb(0 0 0 / 0.14)",
    floating: "0 10px 28px rgb(0 0 0 / 0.34), 0 22px 56px rgb(0 0 0 / 0.24)",
    dialog: "0 18px 48px rgb(0 0 0 / 0.46), 0 36px 96px rgb(0 0 0 / 0.34)",
};

export const deepDarkChartOverrides = {
    gridLine: "oklch(78% 0.08 250 / 0.07)",
    tooltip: {
        background: "rgb(2 10 19 / 0.98)",
        border: "oklch(78% 0.10 250 / 0.14)",
        text: neutral[50],
    },
} as const;

const baseTheme = {
    primitivos: { neutral, blue, cyan, green, red, amber, violet },
    textos,
    primary,
    secondary,
    estados,
    financial,
    typography: { ...typography, numeric: numericTypography },
    spacing,
    density: {
        comfortable: comfortableDensity,
        default: defaultDensity,
        compact: compactDensity,
    },
    radius,
    motion: variablesMovimiento,
    layout: variablesLayout,
} as const;

export const dmrThemes: Record<DmrColorScheme, DmrTheme> = {
    dark: {
        ...baseTheme,
        superficies: darkSuperficies,
        borders: darkBorders,
        glass: darkGlass,
        elevation: darkElevation,
        charts,
    },
    deepDark: {
        ...baseTheme,
        superficies: deepDarkSuperficies,
        borders: deepDarkBorders,
        glass: deepDarkGlass,
        elevation: deepDarkElevation,
        charts: { ...charts, ...deepDarkChartOverrides },
    },
};
