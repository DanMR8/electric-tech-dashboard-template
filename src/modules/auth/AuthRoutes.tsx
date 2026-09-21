import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthHttpError } from "./authApi";
import { useSesionActual } from "./authQueries";

function EstadoBootstrap({
    error,
    onRetry,
}: {
    error?: boolean;
    onRetry?: () => void;
}) {
    return (
        <Box
            sx={(theme) => ({
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                p: `${theme.dmr.spacing.lg}px`,
                bgcolor: theme.dmr.superficies.background,
            })}
        >
            {error ? (
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={onRetry}>
                            Reintentar
                        </Button>
                    }
                >
                    No fue posible comprobar tu sesión. Revisa la conexión e inténtalo nuevamente.
                </Alert>
            ) : (
                <Stack sx={{ alignItems: "center", gap: 2 }}>
                    <CircularProgress size={28} />
                    <Typography sx={(theme) => ({ color: theme.dmr.textos.secondary })}>
                        Comprobando sesión…
                    </Typography>
                </Stack>
            )}
        </Box>
    );
}

export function RutaProtegida() {
    const location = useLocation();
    const sesionQuery = useSesionActual();

    if (sesionQuery.isPending) {
        return <EstadoBootstrap />;
    }

    if (sesionQuery.isError) {
        if (sesionQuery.error instanceof AuthHttpError && sesionQuery.error.status === 401) {
            return (
                <Navigate
                    replace
                    to="/login"
                    state={{
                        from: `${location.pathname}${location.search}`,
                        sesionExpirada: true,
                    }}
                />
            );
        }

        return <EstadoBootstrap error onRetry={() => void sesionQuery.refetch()} />;
    }

    if (!sesionQuery.data) {
        return (
            <Navigate
                replace
                to="/login"
                state={{
                    from: `${location.pathname}${location.search}`,
                    sesionExpirada: false,
                }}
            />
        );
    }

    return <Outlet />;
}

export function RutaSoloAnonimos() {
    const sesionQuery = useSesionActual();

    if (sesionQuery.isPending) {
        return <EstadoBootstrap />;
    }

    if (sesionQuery.isError) {
        if (sesionQuery.error instanceof AuthHttpError && sesionQuery.error.status === 401) {
            return <Outlet />;
        }

        return <EstadoBootstrap error onRetry={() => void sesionQuery.refetch()} />;
    }

    if (sesionQuery.data) {
        return <Navigate replace to="/" />;
    }

    return <Outlet />;
}
