export const neutral = {
    950: "oklch(13% 0.014 255)",
    900: "oklch(16% 0.016 255)",
    850: "oklch(19% 0.018 255)",
    800: "oklch(22% 0.019 255)",
    750: "oklch(25% 0.020 255)",
    700: "oklch(29% 0.020 255)",
    600: "oklch(39% 0.020 255)",
    500: "oklch(51% 0.018 255)",
    400: "oklch(65% 0.015 255)",
    300: "oklch(76% 0.012 255)",
    200: "oklch(86% 0.009 255)",
    100: "oklch(93% 0.006 255)",
    50: "oklch(97% 0.003 255)",
} as const;

export const blue = {
    700: "oklch(50% 0.22 258)",
    600: "oklch(58% 0.24 258)",
    500: "oklch(66% 0.25 258)",
    400: "oklch(74% 0.20 255)",
    300: "oklch(82% 0.12 252)",
} as const;

export const cyan = {
    600: "oklch(66% 0.17 210)",
    500: "oklch(75% 0.16 210)",
    400: "oklch(82% 0.11 210)",
} as const;

export const green = {
    600: "oklch(63% 0.18 150)",
    500: "oklch(72% 0.20 150)",
    400: "oklch(80% 0.15 150)",
} as const;

export const red = {
    600: "oklch(58% 0.21 25)",
    500: "oklch(66% 0.23 25)",
    400: "oklch(74% 0.18 25)",
} as const;

export const amber = {
    600: "oklch(70% 0.17 80)",
    500: "oklch(78% 0.18 80)",
    400: "oklch(85% 0.13 80)",
} as const;

export const violet = {
    600: "oklch(58% 0.24 290)",
    500: "oklch(66% 0.24 290)",
    400: "oklch(75% 0.18 290)",
} as const;

export const textos = {
    primary: neutral[50],
    secondary: neutral[300],
    tertiary: neutral[400],
    disabled: "oklch(70% 0.010 255 / 0.42)",
    inverse: neutral[950],
    link: blue[400],
} as const;

export const primary = {
    default: blue[500],
    hover: blue[400],
    active: blue[600],
    subtle: "oklch(66% 0.25 258 / 0.14)",
    foreground: neutral[950],
    focusRing: "oklch(74% 0.20 255 / 0.42)",
} as const;

export const secondary = {
    default: cyan[500],
    hover: cyan[400],
    active: cyan[600],
    subtle: "oklch(75% 0.16 210 / 0.14)",
    foreground: neutral[950],
    focusRing: "oklch(82% 0.11 210 / 0.38)",
} as const;

export const estados = {
    success: {
        default: green[500],
        hover: green[400],
        active: green[600],
        subtle: "oklch(72% 0.20 150 / 0.14)",
        foreground: green[400],
    },
    warning: {
        default: amber[500],
        hover: amber[400],
        active: amber[600],
        subtle: "oklch(78% 0.18 80 / 0.14)",
        foreground: amber[400],
    },
    error: {
        default: red[500],
        hover: red[400],
        active: red[600],
        subtle: "oklch(66% 0.23 25 / 0.14)",
        foreground: red[400],
    },
    info: {
        default: cyan[500],
        hover: cyan[400],
        active: cyan[600],
        subtle: "oklch(75% 0.16 210 / 0.14)",
        foreground: cyan[400],
    },
    ai: {
        default: violet[500],
        hover: violet[400],
        active: violet[600],
        subtle: "oklch(66% 0.24 290 / 0.14)",
        foreground: violet[400],
    },
} as const;

export const financial = {
    positive: estados.success,
    negative: estados.error,
    neutral: {
        default: neutral[400],
        subtle: "oklch(65% 0.015 255 / 0.12)",
        foreground: neutral[300],
    },
    projected: {
        default: cyan[500],
        subtle: "oklch(75% 0.16 210 / 0.14)",
        foreground: cyan[400],
    },
} as const;

export const charts = {
    categorical: [
        blue[500],
        cyan[500],
        violet[500],
        green[500],
        amber[500],
        "oklch(72% 0.20 335)",
        "oklch(74% 0.16 190)",
        "oklch(80% 0.15 110)",
    ],
    axis: neutral[500],
    axisLabel: neutral[400],
    gridLine: "oklch(88% 0.010 255 / 0.08)",
    tooltip: {
        background: "oklch(15% 0.035 250 / 0.97)",
        border: "oklch(78% 0.10 250 / 0.16)",
        text: neutral[50],
    },
    positive: green[500],
    negative: red[500],
    projected: cyan[500],
} as const;

const baseFontFamily = '"InterVariable", Inter, system-ui, sans-serif';
const numericFontFamily =
    '"IBM Plex Mono Var", ui-monospace, SFMono-Regular, Consolas, monospace';

export const typography = {
    fontFamily: {
        base: baseFontFamily,
        numeric: numericFontFamily,
    },
    micro: { fontFamily: baseFontFamily, fontSize: "0.625rem", lineHeight: 1.3, fontWeight: 400, letterSpacing: "0.01em" },
    xs: { fontFamily: baseFontFamily, fontSize: "0.6875rem", lineHeight: 1.35, fontWeight: 400, letterSpacing: "0.01em" },
    sm: { fontFamily: baseFontFamily, fontSize: "0.75rem", lineHeight: 1.4, fontWeight: 400, letterSpacing: "0.005em" },
    md: { fontFamily: baseFontFamily, fontSize: "0.875rem", lineHeight: 1.5, fontWeight: 400, letterSpacing: "0" },
    lg: { fontFamily: baseFontFamily, fontSize: "1rem", lineHeight: 1.5, fontWeight: 500, letterSpacing: "-0.005em" },
    xl: { fontFamily: baseFontFamily, fontSize: "1.125rem", lineHeight: 1.4, fontWeight: 600, letterSpacing: "-0.01em" },
    "2xl": { fontFamily: baseFontFamily, fontSize: "1.25rem", lineHeight: 1.35, fontWeight: 600, letterSpacing: "-0.012em" },
    "3xl": { fontFamily: baseFontFamily, fontSize: "1.5rem", lineHeight: 1.3, fontWeight: 600, letterSpacing: "-0.015em" },
    "4xl": { fontFamily: baseFontFamily, fontSize: "1.75rem", lineHeight: 1.25, fontWeight: 600, letterSpacing: "-0.02em" },
    "5xl": { fontFamily: baseFontFamily, fontSize: "2rem", lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.025em" },
    "6xl": { fontFamily: baseFontFamily, fontSize: "2.5rem", lineHeight: 1.15, fontWeight: 700, letterSpacing: "-0.03em" },
} as const;

type TypographyMagnitude = keyof Omit<typeof typography, "fontFamily">;

function numericStyle(
    magnitude: TypographyMagnitude,
    fontWeight: 500 | 600 | 700,
    letterSpacing: string,
) {
    return {
        ...typography[magnitude],
        fontFamily: numericFontFamily,
        fontWeight,
        fontVariantNumeric: "tabular-nums lining-nums",
        letterSpacing,
    };
}

export const numericTypography = {
    micro: numericStyle("micro", 500, "0.015em"),
    xs: numericStyle("xs", 500, "0.015em"),
    sm: numericStyle("sm", 500, "0.01em"),
    md: numericStyle("md", 500, "0.005em"),
    lg: numericStyle("lg", 500, "0"),
    xl: numericStyle("xl", 600, "-0.005em"),
    "2xl": numericStyle("2xl", 600, "-0.01em"),
    "3xl": numericStyle("3xl", 600, "-0.012em"),
    "4xl": numericStyle("4xl", 700, "-0.015em"),
    "5xl": numericStyle("5xl", 700, "-0.02em"),
    "6xl": numericStyle("6xl", 700, "-0.025em"),
} as const;

export const spacing = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
    "3xl": 48,
    "4xl": 64,
} as const;

export const comfortableDensity = {
    controlHeight: 44,
    cardPadding: spacing.xl,
    sectionGap: spacing["2xl"],
    contentGap: spacing.xl,
} as const;

export const defaultDensity = {
    controlHeight: 40,
    cardPadding: spacing.lg,
    sectionGap: spacing.xl,
    contentGap: spacing.lg,
} as const;

export const compactDensity = {
    controlHeight: 36,
    cardPadding: spacing.md,
    sectionGap: spacing.lg,
    contentGap: spacing.md,
} as const;

export const radius = {
    none: 0,
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    pill: 999,
} as const;

// Medidas finas: geometría numérica que ECharts/canvas/SVG consumen como valores
// (no como cadenas CSS). Complementan a spacing (mínimo 4px) y tipografía (mínimo micro).
export const medidas = {
    trazos: {
        fino: 2,
        medio: 3,
        sparkline: 2.4,
    },
    neones: {
        suave: 10,
        brillante: 12,
        desplazamientoY: 4,
    },
    serieLinea: {
        simbolo: 6,
        leyendaIcono: 10,
        leyendaGap: 16,
    },
    decorativos: {
        dona: 160,
        sparklineAlto: 46,
    },
    microChips: {
        chico: 20,
        medio: 22,
    },
    barras: {
        fina: 4,
        media: 5,
    },
    textoCanvas: 12,
} as const;

export const variablesMovimiento = {
    duration: { fast: 150, normal: 300, slow: 375 },
    easing: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        emphasized: "cubic-bezier(0, 0, 0.2, 1)",
    },
} as const;

export const variablesLayout = {
    topBarHeight: 64,
    sidebarExpandedWidth: 240,
    sidebarCollapsedWidth: 72,
    rightPanelWidth: 360,
    // mainContentPaddingDefault: 24,
    // mainContentPaddingCompact: 16,
    mainContentPaddingDefault: 10,
    mainContentPaddingCompact: 5,
} as const;

export interface DmrSuperficies {
    background: string;
    workspace: string;
    panel: string;
    card: string;
    cardElevated: string;
    interactive: string;
    hover: string;
    floating: string;
    overlay: string;
}

export interface DmrGlass {
    background: string;
    border: string;
    highlight: string;
    blur: string;
    saturate: string;
}

export interface DmrBorders {
    subtle: string;
    default: string;
    strong: string;
    focus: string;
}

export interface DmrElevation {
    background: string;
    panel: string;
    card: string;
    floating: string;
    dialog: string;
}

export interface DmrCharts {
    categorical: readonly string[];
    axis: string;
    axisLabel: string;
    gridLine: string;
    tooltip: {
        background: string;
        border: string;
        text: string;
    };
    positive: string;
    negative: string;
    projected: string;
}

export interface DmrTypography {
    fontFamily: typeof typography.fontFamily;
    micro: typeof typography.micro;
    xs: typeof typography.xs;
    sm: typeof typography.sm;
    md: typeof typography.md;
    lg: typeof typography.lg;
    xl: typeof typography.xl;
    "2xl": typeof typography["2xl"];
    "3xl": typeof typography["3xl"];
    "4xl": typeof typography["4xl"];
    "5xl": typeof typography["5xl"];
    "6xl": typeof typography["6xl"];
    numeric: typeof numericTypography;
}

export interface DmrTheme {
    primitivos: {
        neutral: typeof neutral;
        blue: typeof blue;
        cyan: typeof cyan;
        green: typeof green;
        red: typeof red;
        amber: typeof amber;
        violet: typeof violet;
    };
    superficies: DmrSuperficies;
    glass: DmrGlass;
    textos: typeof textos;
    borders: DmrBorders;
    primary: typeof primary;
    secondary: typeof secondary;
    estados: typeof estados;
    financial: typeof financial;
    charts: DmrCharts;
    typography: DmrTypography;
    spacing: typeof spacing;
    radius: typeof radius;
    medidas: typeof medidas;
    density: {
        comfortable: typeof comfortableDensity;
        default: typeof defaultDensity;
        compact: typeof compactDensity;
    };
    elevation: DmrElevation;
    motion: typeof variablesMovimiento;
    layout: typeof variablesLayout;
}
