import { Box, useTheme } from "@mui/material";
import type { ReactNode, ElementType } from "react";

import { cssPx, glassPanelStyles } from "../../styles/superficies";

export interface GlassToolbarProps {
    children: ReactNode;
    glassColor?: string; // Permite inyectar colores semánticos (ej. ai.subtle)
    component?: ElementType; // Permite usar 'header', 'section' o 'div' por semántica HTML
    compact?: boolean; // Útil si en el futuro necesitas una barra más delgada
}

export function GlassToolbar({
    children,
    glassColor,
    component = "section",
    compact = false,
}: GlassToolbarProps) {
    const theme = useTheme();
    const defaultColor = glassColor || theme.dmr.primary.subtle;

    return (
        <Box
            component={component}
            sx={{
                ...glassPanelStyles(theme, defaultColor),
                p: cssPx(compact ? theme.dmr.spacing.md : theme.dmr.density.comfortable.cardPadding),
            }}
        >
            {children}
        </Box>
    );
}