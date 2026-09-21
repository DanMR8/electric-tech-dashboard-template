import {
    CheckCircleIcon,
    SidebarSimpleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { usePanelLateral } from "../../app/panelContext";
import { apiConfig } from "../../shared/config";
import { getHealth } from "../../shared/api/healthApi";

function PanelEstadoSistema() {
    const theme = useTheme();
    const healthQuery = useQuery({
        queryKey: ["system", "health"],
        queryFn: getHealth,
    });

    const estado = healthQuery.isError
        ? "Sin conexión"
        : healthQuery.data
          ? "Operativo"
          : "Comprobando…";

    return (
        <Stack sx={{ gap: theme.dmr.spacing.md }}>
            <Typography
                variant="overline"
                sx={{ color: theme.dmr.primary.default, letterSpacing: "0.12em" }}
            >
                Estado del sistema
            </Typography>

            <Chip
                size="small"
                color={
                    healthQuery.isError
                        ? "error"
                        : healthQuery.data
                          ? "success"
                          : "default"
                }
                label={estado}
                sx={{ alignSelf: "flex-start" }}
            />

            <Divider sx={{ borderColor: theme.dmr.borders.subtle }} />

            <Stack sx={{ gap: theme.dmr.spacing.xs }}>
                <Typography sx={{ color: theme.dmr.textos.secondary }}>Modo de integración</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                    {apiConfig.mode.toUpperCase()}
                </Typography>
            </Stack>

            <Stack sx={{ gap: theme.dmr.spacing.xs }}>
                <Typography sx={{ color: theme.dmr.textos.secondary }}>Entorno</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                    {healthQuery.data?.environment ?? "local"}
                </Typography>
            </Stack>
        </Stack>
    );
}

export function HomePage() {
    const { setContenido, abierto, setAbierto } = usePanelLateral();
    const healthQuery = useQuery({
        queryKey: ["system", "health"],
        queryFn: getHealth,
    });

    useEffect(() => {
        setContenido(<PanelEstadoSistema />);

        return () => setContenido(null);
    }, [setContenido]);

    const etiquetaPanel = abierto ? "Ocultar panel lateral" : "Mostrar panel lateral";

    return (
        <Stack sx={{ gap: 3 }}>
            <Stack
                direction="row"
                sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h4" component="h1">
                        VoltDash
                    </Typography>

                    <Typography sx={(theme) => ({ color: theme.dmr.textos.secondary })}>
                        Nueva plataforma web
                    </Typography>
                </Box>

                <Tooltip title={etiquetaPanel}>
                    <IconButton
                        color="inherit"
                        onClick={() => setAbierto(!abierto)}
                        aria-label={etiquetaPanel}
                        aria-expanded={abierto}
                        aria-controls="panel-lateral"
                        sx={{
                            display: { xs: "none", lg: "inline-flex" },
                        }}
                    >
                        <SidebarSimpleIcon size={20} aria-hidden="true" />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Card>
                <CardContent>
                    <Stack sx={{ gap: 2 }}>
                        <Typography variant="h6">
                            Verificación de arquitectura
                        </Typography>

                        {healthQuery.isPending && (
                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    gap: 2,
                                    alignItems: "center",
                                }}
                            >
                                <CircularProgress size={22} />

                                <Typography>
                                    Verificando conexión con FastAPI…
                                </Typography>
                            </Stack>
                        )}

                        {healthQuery.isError && (
                            <Alert
                                severity="error"
                                icon={
                                    <WarningCircleIcon
                                        size={22}
                                        weight="fill"
                                        color="currentColor"
                                    />
                                }
                            >
                                No fue posible conectar con FastAPI:{" "}
                                {healthQuery.error instanceof Error
                                    ? healthQuery.error.message
                                    : "Error desconocido"}
                            </Alert>
                        )}

                        {healthQuery.data && (
                            <Alert
                                severity="success"
                                icon={
                                    <CheckCircleIcon
                                        size={22}
                                        weight="fill"
                                        color="currentColor"
                                    />
                                }
                            >
                                <Stack
                                    sx={{
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row",
                                        },
                                        gap: 1,
                                        alignItems: {
                                            xs: "flex-start",
                                            sm: "center",
                                        },
                                    }}
                                >
                                    <Box component="span">
                                        {apiConfig.mode === "demo"
                                            ? "El dashboard opera en modo demo, sin backend."
                                            : "Frontend y backend conectados."}
                                    </Box>

                                    <Chip
                                        size="small"
                                        label={healthQuery.data.environment ?? apiConfig.mode}
                                        sx={(theme) => ({
                                            bgcolor: theme.dmr.estados.success.subtle,
                                            color: theme.dmr.estados.success.foreground,
                                        })}
                                    />
                                </Stack>
                            </Alert>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}