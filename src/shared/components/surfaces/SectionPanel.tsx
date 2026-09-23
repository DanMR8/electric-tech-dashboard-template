import { Box, Stack, Typography, useTheme } from "@mui/material";
import type { ReactNode } from "react";

import { cssPx, solidPanelStyles, glassPanelStyles } from "../../styles/superficies";

// --- 1. COMPONENTE: SectionHeader ---
// Extraído de VisualFoundationsPage y estandarizado
export interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
    const { dmr } = useTheme();

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
                gap: cssPx(dmr.spacing.md),
                alignItems: { xs: "flex-start", sm: "flex-end" },
                justifyContent: "space-between",
                mb: cssPx(dmr.spacing.lg), // Margen inferior estandarizado para separar del contenido
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                {eyebrow && (
                    <Typography
                        component="p"
                        sx={{
                            ...dmr.typography.xs,
                            color: dmr.primary.default,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                        }}
                    >
                        {eyebrow}
                    </Typography>
                )}
                <Typography component="h2" sx={{ ...dmr.typography["2xl"], mt: eyebrow ? cssPx(dmr.spacing.xs) : 0 }}>
                    {title}
                </Typography>
                {description && (
                    <Typography
                        sx={{
                            ...dmr.typography.sm,
                            color: dmr.textos.secondary,
                            mt: cssPx(dmr.spacing.xs),
                            maxWidth: 760,
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </Box>
            {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
        </Stack>
    );
}

// --- 2. COMPONENTE: SectionPanel ---
// Reemplaza los <Box component="section"> repetitivos
export interface SectionPanelProps {
    children: ReactNode;
    variant?: "solid" | "glass";
    glassColor?: string; // Solo requerido si variant es 'glass'
    header?: SectionHeaderProps; // Permite inyectar el header directamente
    noPadding?: boolean;
}

export function SectionPanel({
    children,
    variant = "solid",
    glassColor,
    header,
    noPadding = false,
}: SectionPanelProps) {
    const theme = useTheme();
    const { dmr } = theme;

    const baseStyles = variant === "solid"
        ? solidPanelStyles(theme)
        : glassPanelStyles(theme, glassColor || dmr.primary.subtle);

    return (
        <Box
            component="section"
            sx={{
                ...baseStyles,
                p: noPadding ? 0 : cssPx(dmr.density.comfortable.cardPadding),
                display: "flex",
                flexDirection: "column",
            }}
        >
            {header && <SectionHeader {...header} />}
            <Box sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    );
}