/**
 * Precedente de estandarización de superficies (aún NO formalizado).
 *
 * Utilidades de estilo extraídas de VisualFoundationsPage para reutilizarse
 * en los demás módulos (Inicio, Trazas, ...). Son fábricas que consumen
 * exclusivamente tokens de theme.dmr; si más adelante se formaliza el
 * Design System, migran a un paquete propio sin cambiar los call sites.
 */

import type { Theme } from "@mui/material/styles";

/** Convierte un valor numérico del sistema de medidas en un string px. */
export const cssPx = (value: number) => `${value}px`;

/** Panel sólido base: tarjeta con borde sutil, fondo y elevación tokenizados. */
export function solidPanelStyles(theme: Theme) {
    const dmr = theme.dmr;

    return {
        position: "relative",
        minWidth: 0,
        overflow: "hidden",
        borderRadius: cssPx(dmr.radius.md),
        border: `1px solid ${dmr.borders.subtle}`,
        backgroundColor: dmr.superficies.card,
        boxShadow: dmr.elevation.card,
    } as const;
}

/** Panel vítreo con destello superior y acento radial suave (hero/header). */
export function glassPanelStyles(theme: Theme, softAccent: string) {
    const dmr = theme.dmr;

    return {
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        color: dmr.textos.primary,
        backgroundColor: dmr.glass.background,
        backgroundImage: [
            `linear-gradient(135deg, ${dmr.glass.highlight}, transparent 38%)`,
            `radial-gradient(circle at 100% 0%, ${softAccent}, transparent 46%)`,
        ].join(", "),
        border: `1px solid ${dmr.glass.border}`,
        boxShadow: `${dmr.elevation.floating}, inset 0 1px 0 ${dmr.glass.highlight}`,
        backdropFilter: `blur(${dmr.glass.blur}) saturate(${dmr.glass.saturate})`,
        WebkitBackdropFilter: `blur(${dmr.glass.blur}) saturate(${dmr.glass.saturate})`,
        borderRadius: cssPx(dmr.radius.lg),
        "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            background: `linear-gradient(115deg, transparent 18%, ${dmr.glass.highlight} 48%, transparent 72%)`,
            opacity: 0.38,
            transform: "translateX(-58%)",
        },
    } as const;
}