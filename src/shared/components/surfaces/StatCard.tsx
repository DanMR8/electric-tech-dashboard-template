import { Box, Card, Stack, Typography, Chip, useTheme } from "@mui/material";
import { useId, type ReactNode } from "react";

import { cssPx, solidPanelStyles } from "../../styles/superficies";

// --- 1. Utilidad Auxiliar: Sparkline ---
// Extraído de tus vistas. Mantenemos la lógica intacta pero la encapsulamos
// para no ensuciar las vistas principales.
interface SparklineProps {
    points: readonly number[];
    color: string;
}

function Sparkline({ points, color }: SparklineProps) {
    const { dmr } = useTheme();
    // ID estable y sin ':' (los ':' invalidan el selector de fragmento `url(#…)`).
    const gradienteId = useId().replace(/:/g, "");
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = Math.max(max - min, 1);

    const linePoints = points
        .map((value, index) => {
            const x = (index / (points.length - 1)) * 120;
            const y = 32 - ((value - min) / range) * 26;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg
            viewBox="0 0 120 36"
            role="presentation"
            aria-hidden="true"
            style={{ display: "block", width: "100%", height: dmr.medidas.decorativos.sparklineAlto }}
        >
            <defs>
                <linearGradient id={gradienteId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.26" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,36 ${linePoints} 120,36`} fill={`url(#${gradienteId})`} />
            <polyline
                points={linePoints}
                fill="none"
                stroke={color}
                strokeWidth={dmr.medidas.trazos.sparkline}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// --- 2. COMPONENTE PRINCIPAL: StatCard ---

export interface StatCardProps {
    label: string; // Título de la métrica (ej. "Ventas Asistidas")
    value: string | number; // Valor principal (ej. "$48.2k")
    meta?: string; // Texto secundario (ej. "+18.6% vs. semana anterior")
    glyph?: ReactNode; // Ícono decorativo superior derecho (opcional)

    // Variación estilo "Chip" (como en EcommercePage)
    variationValue?: number; // El porcentaje numérico de variación
    variationIsPositive?: boolean; // Para forzar el color success o error independientemente del signo

    // Configuración visual
    accentColor: string; // Color principal (borde hover, línea sparkline)
    softAccentColor: string; // Color de fondo sutil (gradiente radial)
    valueColor?: string; // Color explícito para el valor (por defecto usa primary text)

    // Datos de la gráfica (opcional)
    sparklinePoints?: readonly number[];
}

export function StatCard({
    label,
    value,
    meta,
    glyph,
    variationValue,
    variationIsPositive,
    accentColor,
    softAccentColor,
    valueColor,
    sparklinePoints,
}: StatCardProps) {
    const theme = useTheme();
    const { dmr } = theme;

    // La variación: el signo refleja el valor numérico (+ positivo, sin signo
    // negativo) y el color deriva de si es una mejora o un detrimento, de forma
    // independiente (una latencia +5% se pinta error con signo '+', por ejemplo).
    const hasVariationChip = variationValue !== undefined;
    const esMejora = variationIsPositive ?? (hasVariationChip && variationValue > 0);
    const signoVariacion = hasVariationChip && variationValue > 0 ? "+" : "";
    const estiloVariacion = esMejora
        ? { bg: dmr.estados.success.subtle, texto: dmr.estados.success.foreground }
        : { bg: dmr.estados.error.subtle, texto: dmr.estados.error.foreground };

    return (
        <Card
            sx={{
                ...solidPanelStyles(theme),
                p: cssPx(dmr.density.comfortable.cardPadding),
                backgroundImage: `radial-gradient(circle at 100% 0%, ${softAccentColor}, transparent 48%)`,
                transition: theme.transitions.create(["transform", "border-color", "box-shadow"], {
                    duration: dmr.motion.duration.fast,
                    easing: dmr.motion.easing.standard,
                }),
                "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: accentColor,
                    boxShadow: `${dmr.elevation.card}, 0 16px 48px ${softAccentColor}`,
                },
            }}
        >
            <Stack
                direction="row"
                sx={{
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: cssPx(dmr.spacing.md),
                }}
            >
                {/* Bloque de Información */}
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            ...dmr.typography.sm,
                            color: dmr.textos.secondary,
                        }}
                    >
                        {label}
                    </Typography>

                    <Stack
                        direction="row"
                        sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm), flexWrap: "wrap", mt: cssPx(dmr.spacing.xs) }}
                    >
                        <Typography
                            sx={{
                                ...dmr.typography.numeric["2xl"], // Utilizamos un tamaño uniforme para impacto
                                color: valueColor || dmr.textos.primary,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {value}
                        </Typography>

                        {/* Renderizado opcional del Chip de variación (estilo EcommercePage) */}
                        {hasVariationChip && (
                            <Chip
                                size="small"
                                label={`${signoVariacion}${variationValue.toFixed(1)}%`}
                                sx={{
                                    height: dmr.medidas.microChips.chico,
                                    fontSize: dmr.typography.micro.fontSize,
                                    bgcolor: estiloVariacion.bg,
                                    color: estiloVariacion.texto,
                                }}
                            />
                        )}
                    </Stack>

                    {/* Texto Meta (estilo VisualFoundationsPage) */}
                    {meta && (
                        <Typography
                            sx={{
                                ...dmr.typography.xs,
                                color: accentColor,
                                mt: cssPx(dmr.spacing.xs),
                            }}
                        >
                            {meta}
                        </Typography>
                    )}
                </Box>

                {/* Bloque Decorativo: Ícono (Glyph) */}
                {glyph && (
                    <Box
                        sx={{
                            width: dmr.spacing["2xl"],
                            height: dmr.spacing["2xl"],
                            flex: "0 0 auto",
                            display: "grid",
                            placeItems: "center",
                            borderRadius: cssPx(dmr.radius.sm),
                            color: accentColor,
                            backgroundColor: softAccentColor,
                            border: `1px solid ${accentColor}`,
                            boxShadow: `0 0 26px ${softAccentColor}`,
                        }}
                    >
                        <Typography
                            component="span"
                            sx={{ display: "inline-flex", alignItems: "center" }}
                        >
                            {glyph}
                        </Typography>
                    </Box>
                )}
            </Stack>

            {/* Sparkline Opcional en el fondo de la tarjeta */}
            {sparklinePoints && sparklinePoints.length > 0 && (
                <Box sx={{ mt: cssPx(dmr.spacing.sm) }}>
                    <Sparkline points={sparklinePoints} color={accentColor} />
                </Box>
            )}
        </Card>
    );
}