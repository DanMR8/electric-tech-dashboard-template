import { zodResolver } from "@hookform/resolvers/zod";
import {
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    LockKeyIcon,
    MoonStarsIcon,
    ShieldCheckIcon,
} from "@phosphor-icons/react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { ControlEsquemaColor } from "../../theme";
import { AuthHttpError } from "./authApi";
import { useLogin } from "./authQueries";
import { loginPayloadSchema, type LoginPayload } from "./authSchemas";
import { credencialesDemo } from "./authStore";

interface LoginLocationState {
    from?: string;
    sesionExpirada?: boolean;
}

function resolverEstadoNavegacion(value: unknown): LoginLocationState {
    if (!value || typeof value !== "object") {
        return {};
    }

    const record = value as Record<string, unknown>;

    return {
        from: typeof record.from === "string" ? record.from : undefined,
        sesionExpirada: record.sesionExpirada === true,
    };
}

function resolverDestino(from: string | undefined): string {
    if (!from || !from.startsWith("/") || from.startsWith("//") || from === "/login") {
        return "/";
    }

    return from;
}

function mensajeLoginError(error: unknown): string {
    if (!(error instanceof AuthHttpError)) {
        return "La respuesta del servicio no tiene el formato esperado.";
    }

    if (error.status === 401) {
        return "Las credenciales no son válidas. Verifica los datos e inténtalo nuevamente.";
    }

    return error.message;
}

export function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const loginMutation = useLogin();
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const navigationState = resolverEstadoNavegacion(location.state);

    const {
        register,
        handleSubmit,
        formState: { errors },
        resetField,
        setError,
        setFocus,
    } = useForm<LoginPayload>({
        resolver: zodResolver(loginPayloadSchema),
        defaultValues: {
            identificador: "",
            password: "",
            remember_me: false,
        },
    });

    const onSubmit = handleSubmit((payload) => {
        loginMutation.mutate(payload, {
            onSuccess: () => {
                navigate(resolverDestino(navigationState.from), { replace: true });
            },
            onError: (error) => {
                setError("root", { message: mensajeLoginError(error) });

                if (error instanceof AuthHttpError && error.status === 401) {
                    resetField("password");
                    setFocus("password");
                }
            },
        });
    });

    return (
        <Box
            component="main"
            sx={(theme) => ({
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
                p: {
                    xs: `${theme.dmr.spacing.lg}px`,
                    md: `${theme.dmr.spacing.xl}px`,
                },
                bgcolor: theme.dmr.superficies.background,
                backgroundImage: [
                    `radial-gradient(circle at 12% 14%, ${theme.dmr.primary.subtle}, transparent 30%)`,
                    `radial-gradient(circle at 88% 82%, ${theme.dmr.estados.ai.subtle}, transparent 28%)`,
                ].join(", "),
            })}
        >
            <Box
                sx={(theme) => ({
                    position: "absolute",
                    top: {
                        xs: `${theme.dmr.spacing.lg}px`,
                        md: `${theme.dmr.spacing.xl}px`,
                    },
                    right: {
                        xs: `${theme.dmr.spacing.lg}px`,
                        md: `${theme.dmr.spacing.xl}px`,
                    },
                })}
            >
                <ControlEsquemaColor>
                    {({ esquema, setEsquema }) => (
                        <Stack
                            direction="row"
                            sx={(theme) => ({
                                alignItems: "center",
                                gap: `${theme.dmr.spacing.xs}px`,
                                p: `${theme.dmr.spacing.xs}px`,
                                bgcolor: theme.dmr.glass.background,
                                border: `1px solid ${theme.dmr.glass.border}`,
                                borderRadius: `${theme.dmr.radius.pill}px`,
                                boxShadow: theme.dmr.elevation.floating,
                                backdropFilter: `blur(${theme.dmr.glass.blur}) saturate(${theme.dmr.glass.saturate})`,
                            })}
                        >
                            <MoonStarsIcon size={18} aria-hidden="true" />
                            <Button
                                size="small"
                                variant={esquema === "dark" ? "contained" : "text"}
                                onClick={() => setEsquema("dark")}
                                aria-pressed={esquema === "dark"}
                            >
                                Dark
                            </Button>
                            <Button
                                size="small"
                                variant={esquema === "deepDark" ? "contained" : "text"}
                                onClick={() => setEsquema("deepDark")}
                                aria-pressed={esquema === "deepDark"}
                            >
                                Deep
                            </Button>
                        </Stack>
                    )}
                </ControlEsquemaColor>
            </Box>

            <Paper
                elevation={0}
                sx={(theme) => ({
                    width: "100%",
                    maxWidth: 960,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.9fr) minmax(360px, 1.1fr)" },
                    overflow: "hidden",
                    bgcolor: theme.dmr.superficies.card,
                    border: `1px solid ${theme.dmr.borders.default}`,
                    borderRadius: `${theme.dmr.radius.lg}px`,
                    boxShadow: theme.dmr.elevation.dialog,
                })}
            >
                <Box
                    sx={(theme) => ({
                        display: { xs: "none", md: "flex" },
                        minHeight: 580,
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: `${theme.dmr.spacing["2xl"]}px`,
                        bgcolor: theme.dmr.superficies.panel,
                        borderRight: `1px solid ${theme.dmr.borders.subtle}`,
                        backgroundImage: `radial-gradient(circle at 20% 0%, ${theme.dmr.primary.subtle}, transparent 44%)`,
                    })}
                >
                    <Stack sx={(theme) => ({ gap: `${theme.dmr.spacing.lg}px` })}>
                        <Box
                            sx={(theme) => ({
                                width: theme.dmr.spacing["3xl"],
                                height: theme.dmr.spacing["3xl"],
                                display: "grid",
                                placeItems: "center",
                                color: theme.dmr.primary.foreground,
                                bgcolor: theme.dmr.primary.default,
                                borderRadius: `${theme.dmr.radius.md}px`,
                            })}
                        >
                            <ShieldCheckIcon size={28} weight="duotone" aria-hidden="true" />
                        </Box>
                        <Box>
                            <Typography component="p" color="primary" variant="overline">
                                VOLTDASH WEB
                            </Typography>
                            <Typography component="h1" variant="h3" sx={{ mt: 1 }}>
                                Inteligencia financiera, acceso seguro.
                            </Typography>
                            <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 400 }}>
                                Vista de demostración autocontenida: las credenciales se validan
                                en el navegador, sin necesidad de un servidor.
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack sx={(theme) => ({ gap: `${theme.dmr.spacing.sm}px` })}>
                        {[
                            "Sin dependencia de backend",
                            "Sesión persistida localmente en el navegador",
                            "Credenciales de ejemplo visibles en el formulario",
                        ].map((item) => (
                            <Stack
                                key={item}
                                direction="row"
                                sx={(theme) => ({
                                    alignItems: "center",
                                    gap: `${theme.dmr.spacing.sm}px`,
                                    color: theme.dmr.textos.secondary,
                                })}
                            >
                                <ShieldCheckIcon size={17} weight="fill" color="currentColor" aria-hidden="true" />
                                <Typography variant="body2">{item}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Box>

                <Box
                    component="form"
                    noValidate
                    onSubmit={onSubmit}
                    sx={(theme) => ({
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        p: {
                            xs: `${theme.dmr.spacing.xl}px`,
                            sm: `${theme.dmr.spacing["2xl"]}px`,
                        },
                    })}
                >
                    <Box sx={{ mb: 4 }}>
                        <Stack
                            direction="row"
                            sx={(theme) => ({
                                display: { xs: "flex", md: "none" },
                                alignItems: "center",
                                gap: `${theme.dmr.spacing.sm}px`,
                                mb: `${theme.dmr.spacing.lg}px`,
                            })}
                        >
                            <LockKeyIcon size={24} weight="duotone" aria-hidden="true" />
                            <Typography variant="h6">VoltDash</Typography>
                        </Stack>
                        <Typography component="h2" variant="h4">
                            Inicia sesión
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Usa tu nombre de usuario o correo electrónico.
                        </Typography>
                    </Box>

                    <Stack sx={(theme) => ({ gap: `${theme.dmr.spacing.lg}px` })}>
                        <Alert
                            severity="info"
                            icon={<KeyIcon size={20} weight="duotone" aria-hidden="true" />}
                            sx={{
                                alignItems: "flex-start",
                                "& .MuiAlert-message": { width: "100%", minWidth: 0 },
                            }}
                        >
                            <Stack
                                sx={(theme) => ({
                                    gap: `${theme.dmr.spacing.xs}px`,
                                    width: "100%",
                                    minWidth: 0,
                                })}
                            >
                                <Typography
                                    sx={(theme) => ({
                                        ...theme.dmr.typography.sm,
                                        fontWeight: 700,
                                    })}
                                >
                                    Credenciales de demostración
                                </Typography>
                                {credencialesDemo.map(({ usuario, password }) => (
                                    <Stack
                                        key={usuario}
                                        direction="row"
                                        useFlexGap
                                        sx={(theme) => ({
                                            alignItems: "center",
                                            gap: `${theme.dmr.spacing.sm}px`,
                                            minWidth: 0,
                                            flexWrap: "wrap",
                                        })}
                                    >
                                        <Typography
                                            sx={(theme) => ({
                                                ...theme.dmr.typography.numeric.sm,
                                                fontWeight: 600,
                                            })}
                                        >
                                            {usuario}
                                        </Typography>
                                        <Typography
                                            aria-hidden="true"
                                            sx={(theme) => ({
                                                ...theme.dmr.typography.xs,
                                                color: theme.dmr.textos.tertiary,
                                            })}
                                        >
                                            /
                                        </Typography>
                                        <Typography
                                            sx={(theme) => ({
                                                ...theme.dmr.typography.numeric.sm,
                                                color: theme.dmr.textos.secondary,
                                            })}
                                        >
                                            {password}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Alert>

                        {navigationState.sesionExpirada ? (
                            <Alert severity="warning">
                                Tu sesión expiró. Inicia sesión nuevamente.
                            </Alert>
                        ) : null}

                        {errors.root?.message ? (
                            <Alert severity="error">{errors.root.message}</Alert>
                        ) : null}

                        <TextField
                            {...register("identificador")}
                            label="Usuario o correo electrónico"
                            autoComplete="username"
                            autoFocus
                            fullWidth
                            disabled={loginMutation.isPending}
                            error={Boolean(errors.identificador)}
                            helperText={errors.identificador?.message}
                        />

                        <TextField
                            {...register("password")}
                            label="Contraseña"
                            type={mostrarPassword ? "text" : "password"}
                            autoComplete="current-password"
                            fullWidth
                            disabled={loginMutation.isPending}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={() => setMostrarPassword((visible) => !visible)}
                                                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            >
                                                {mostrarPassword ? (
                                                    <EyeSlashIcon size={20} aria-hidden="true" />
                                                ) : (
                                                    <EyeIcon size={20} aria-hidden="true" />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loginMutation.isPending}
                            startIcon={
                                loginMutation.isPending ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : (
                                    <LockKeyIcon size={19} weight="bold" aria-hidden="true" />
                                )
                            }
                        >
                            {loginMutation.isPending ? "Comprobando acceso…" : "Entrar"}
                        </Button>

                        <Typography
                            variant="caption"
                            sx={(theme) => ({
                                color: theme.dmr.textos.tertiary,
                                textAlign: "center",
                            })}
                        >
                            La opción de mantener la sesión iniciada no está habilitada actualmente.
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

