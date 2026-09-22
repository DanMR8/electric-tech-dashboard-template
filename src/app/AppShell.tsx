import {
    Alert,
    Backdrop,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    HouseIcon,
    ListIcon,
    SignOutIcon,
    StorefrontIcon,
    TreeStructureIcon,
    XIcon,
} from "@phosphor-icons/react";
import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useLogout, useSesionActual } from "../modules/auth";
import { PanelLateralProvider } from "./PanelLateralProvider";
import { usePanelLateral } from "./panelContext";

interface AppShellProps {
    sidePanel?: ReactNode;
    floatingLayer?: ReactNode;
}

const enlacesNavegacion = [
    { etiqueta: "Inicio", ruta: "/", Icono: HouseIcon },
    { etiqueta: "E-commerce", ruta: "/ecommerce", Icono: StorefrontIcon },
    { etiqueta: "Conversaciones", ruta: "/conversaciones", Icono: TreeStructureIcon },
] as const;

function NavegacionLateral({
    contraida,
    onNavigate,
}: {
    contraida: boolean;
    onNavigate?: () => void;
}) {
    const location = useLocation();
    // Ruta con foco/hover: permite escalar el peso del icono de forma
    // dinámica (regular -> bold -> fill en la pestaña seleccionada).
    const [enHover, setEnHover] = useState<string | null>(null);

    return (
        <List
            component="nav"
            aria-label="Navegación principal"
            sx={(theme) => ({
                py: `${theme.dmr.spacing.md}px`,
            })}
        >
            {enlacesNavegacion.map(({ etiqueta, ruta, Icono }) => {
                const seleccionada = location.pathname === ruta;

                return (
                    <Tooltip
                        key={ruta}
                        title={contraida ? etiqueta : ""}
                        placement="right"
                    >
                        <ListItemButton
                            component={NavLink}
                            to={ruta}
                            selected={seleccionada}
                            onClick={onNavigate}
                            onMouseEnter={() => setEnHover(ruta)}
                            onMouseLeave={() => setEnHover(null)}
                            onFocus={() => setEnHover(ruta)}
                            onBlur={() => setEnHover(null)}
                            aria-label={contraida ? etiqueta : undefined}
                            sx={(theme) => ({
                                minHeight: theme.dmr.density.default.controlHeight,
                                mx: `${theme.dmr.spacing.sm}px`,
                                mb: `${theme.dmr.spacing.xs}px`,
                                px: `${theme.dmr.spacing.md}px`,
                                justifyContent: contraida ? "center" : "flex-start",
                                borderRadius: `${theme.dmr.radius.sm}px`,
                                overflow: "hidden",
                                "&:hover svg": {
                                    transform: "scale(1.12)",
                                },
                            })}
                        >
                            <ListItemIcon
                                sx={(theme) => ({
                                    minWidth: 0,
                                    mr: contraida ? 0 : `${theme.dmr.spacing.md}px`,
                                    justifyContent: "center",
                                    color: seleccionada
                                        ? theme.dmr.primary.default
                                        : "inherit",
                                    transition: `color ${theme.dmr.motion.duration.normal}ms ${theme.dmr.motion.easing.standard}`,
                                    "& svg": {
                                        transition: `transform ${theme.dmr.motion.duration.fast}ms ${theme.dmr.motion.easing.standard}`,
                                    },
                                })}
                            >
                                <Icono
                                    size={20}
                                    aria-hidden="true"
                                    weight={
                                        seleccionada
                                            ? "fill"
                                            : enHover === ruta
                                              ? "bold"
                                              : "regular"
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={etiqueta}
                                sx={{
                                    display: contraida ? "none" : "block",
                                    whiteSpace: "nowrap",
                                }}
                            />
                        </ListItemButton>
                    </Tooltip>
                );
            })}
        </List>
    );
}

function AppShellLayout({ sidePanel, floatingLayer }: AppShellProps) {
    const theme = useTheme();
    const { contenido, abierto, setAbierto, ancho } = usePanelLateral();
    const panel = contenido ?? sidePanel;
    const navigate = useNavigate();
    const sesionQuery = useSesionActual();
    const logoutMutation = useLogout();
    const esMovil = useMediaQuery(theme.breakpoints.down("md"));
    const esPantallaCompacta = useMediaQuery(theme.breakpoints.between("md", "lg"));
    const esPanelEscritorio = useMediaQuery(theme.breakpoints.up("lg"));
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    // 1. Estado de la navegación.
    // En escritorio el Sidebar vive siempre visible y se colapsa a íconos.
    // En móvil el Sidebar desaparece y se abre como Drawer superpuesto.
    useEffect(() => {
        if (!mobileNavigationOpen) {
            return;
        }

        const cerrarConEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMobileNavigationOpen(false);
            }
        };

        window.addEventListener("keydown", cerrarConEscape);
        return () => window.removeEventListener("keydown", cerrarConEscape);
    }, [mobileNavigationOpen]);

    // Auto-colapso del Sidebar según el viewport: en pantallas medianas
    // (md..lg) queda contraído a íconos y en lg+ se expande. El botón
    // manual sigue funcionando hasta que se cruza el breakpoint.
    const [prevPantallaCompacta, setPrevPantallaCompacta] = useState(esPantallaCompacta);
    if (prevPantallaCompacta !== esPantallaCompacta) {
        setPrevPantallaCompacta(esPantallaCompacta);
        setSidebarCollapsed(esPantallaCompacta);
    }

    // El panel lateral derecho abre por defecto solo en escritorio amplio;
    // en vista móvil queda cerrado y se abre bajo demanda como Drawer
    // superpuesto (evita tapar el contenido recién cargado).
    const [prevPanelEscritorio, setPrevPanelEscritorio] = useState(esPanelEscritorio);
    if (prevPanelEscritorio !== esPanelEscritorio) {
        setPrevPanelEscritorio(esPanelEscritorio);
        setAbierto(esPanelEscritorio);
    }

    // El mismo control cambia de comportamiento según el viewport:
    // móvil alterna el Drawer, escritorio colapsa/expande el Sidebar flotante.
    const alternarNavegacion = () => {
        if (esMovil) {
            setMobileNavigationOpen((abierta) => !abierta);
            return;
        }

        setSidebarCollapsed((contraida) => !contraida);
    };

    const cerrarSesion = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => navigate("/login", { replace: true }),
        });
    };

    const etiquetaNavegacion = esMovil
        ? mobileNavigationOpen
            ? "Cerrar navegación"
            : "Abrir navegación"
        : sidebarCollapsed
          ? "Expandir navegación"
          : "Contraer navegación";
    const sidebarWidth = sidebarCollapsed
        ? theme.dmr.layout.sidebarCollapsedWidth
        : theme.dmr.layout.sidebarExpandedWidth;
    const panelWidth =
        ancho === "angosto"
            ? theme.dmr.layout.rightPanelWidthNarrow
            : ancho === "ancho"
              ? theme.dmr.layout.rightPanelWidthWide
              : theme.dmr.layout.rightPanelWidth;

    return (
        // 2. Fondo total de la aplicación autenticada.
        // El padding perimetral deja respirar a las "tarjetas" flotantes:
        // el Sidebar (izquierda) y el bloque TopBar + Workspace (derecha).
        <Box
            sx={(currentTheme) => ({
                width: "100%",
                minWidth: 0,
                minHeight: "100dvh",
                height: "100dvh",
                boxSizing: "border-box",
                overflow: "hidden",
                bgcolor: currentTheme.dmr.superficies.background,
                p: {
                    xs: 0,
                    md: `${currentTheme.dmr.spacing.sm}px`,
                    lg: `${currentTheme.dmr.spacing.md}px`,
                },
            })}
        >
            {/* 3. Contenedor maestro: hermanos [Sidebar] [Bloque derecho].
                El bloque derecho ocupa el ancho restante y apila en columna
                el TopBar tipo Hero y el Main Workspace con scroll propio. */}
            <Box
                sx={(currentTheme) => ({
                    position: "relative",
                    display: "flex",
                    alignItems: "stretch",
                    gap: {
                        xs: 0,
                        md: `${currentTheme.dmr.spacing.md}px`,
                    },
                    width: "100%",
                    height: "100%",
                    minWidth: 0,
                    minHeight: 0,
                    overflow: "hidden",
                })}
            >
                {/* 4. Sidebar independiente y flotante (solo escritorio).
                    No toca los bordes gracias al padding del fondo, tiene
                    radio grande y elevación flotante para aislarse del resto. */}
                <Box
                    id="navegacion-escritorio"
                    component="aside"
                    aria-label="Navegación principal"
                    sx={(currentTheme) => ({
                        display: { xs: "none", md: "flex" },
                        flexDirection: "column",
                        flex: "0 0 auto",
                        width: sidebarWidth,
                        height: "100%",
                        minWidth: 0,
                        minHeight: 0,
                        overflow: "hidden",
                        bgcolor: currentTheme.dmr.superficies.panel,
                        border: `1px solid ${currentTheme.dmr.borders.subtle}`,
                        borderRadius: `${currentTheme.dmr.radius.lg}px`,
                        boxShadow: currentTheme.dmr.elevation.floating,
                        transition: `width ${currentTheme.dmr.motion.duration.normal}ms ${currentTheme.dmr.motion.easing.standard}`,
                    })}
                >
                    {/* 5. Cabecera del Sidebar: aquí vive ahora el control de
                        colapso, alineado verticalmente con el Hero. */}
                    <Box
                        sx={(currentTheme) => ({
                            flex: "0 0 auto",
                            display: "grid",
                            placeItems: "center",
                            minHeight: currentTheme.dmr.layout.topBarHeight,
                            px: `${currentTheme.dmr.spacing.sm}px`,
                            borderBottom: `1px solid ${currentTheme.dmr.borders.subtle}`,
                            backgroundImage: `radial-gradient(circle at 50% 0%, ${currentTheme.dmr.primary.subtle}, transparent 72%)`,
                        })}
                    >
                        <Tooltip title={etiquetaNavegacion}>
                            <IconButton
                                color="inherit"
                                onClick={alternarNavegacion}
                                aria-label={etiquetaNavegacion}
                                aria-controls="navegacion-escritorio"
                                aria-expanded={!sidebarCollapsed}
                                sx={(currentTheme) => ({
                                    width: currentTheme.dmr.density.compact.controlHeight,
                                    height: currentTheme.dmr.density.compact.controlHeight,
                                    "&:focus-visible": {
                                        outline: `2px solid ${currentTheme.dmr.borders.focus}`,
                                        outlineOffset: currentTheme.dmr.spacing.xs,
                                    },
                                })}
                            >
                                <ListIcon size={22} aria-hidden="true" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* 6. Lista de navegación con scroll propio para que la
                        cabecera del Sidebar permanezca fija. */}
                    <Box
                        sx={{
                            flex: "1 1 auto",
                            minHeight: 0,
                            overflowY: "auto",
                            overflowX: "hidden",
                        }}
                    >
                        <NavegacionLateral contraida={sidebarCollapsed} />
                    </Box>
                </Box>

                {/* 7. Bloque derecho: columna [Hero TopBar] + [Main Workspace].
                    Ya no es una sola tarjeta: Hero y Workspace conviven como
                    superficies independientes, con un hueco de respiración
                    (spacing.sm) entre ambos en escritorio. */}
                <Box
                    sx={(currentTheme) => ({
                        display: "flex",
                        flexDirection: "column",
                        flex: "1 1 0%",
                        gap: {
                            xs: 0,
                            md: `${currentTheme.dmr.spacing.sm}px`,
                        },
                        minWidth: 0,
                        minHeight: 0,
                        overflow: "hidden",
                    })}
                >
                    {/* 8. TopBar tipo Hero: ahora es una tarjeta propia que
                        flota sobre el fondo, separada del Workspace por el
                        hueco del bloque derecho. Ya no contiene el botón de
                        menú; solo en móvil aparece un botón compacto que abre
                        el Drawer, ya que el Sidebar flotante está oculto. */}
                    <Box
                        component="header"
                        sx={(currentTheme) => ({
                            flex: "0 0 auto",
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            minHeight: `${currentTheme.dmr.layout.topBarHeight}px`,
                            px: {
                                xs: `${currentTheme.dmr.spacing.lg}px`,
                                md: `${currentTheme.dmr.spacing.xl}px`,
                            },
                            gap: `${currentTheme.dmr.spacing.md}px`,
                            bgcolor: currentTheme.dmr.superficies.panel,
                            backgroundImage:
                                `radial-gradient(circle at 8% 0%, ${currentTheme.dmr.primary.subtle}, transparent 38%)`,
                            border: {
                                xs: "none",
                                md: `1px solid ${currentTheme.dmr.borders.subtle}`,
                            },
                            borderBottom: {
                                xs: `1px solid ${currentTheme.dmr.borders.subtle}`,
                                md: "none",
                            },
                            borderRadius: {
                                xs: 0,
                                md: `${currentTheme.dmr.radius.lg}px`,
                            },
                            boxShadow: {
                                xs: "none",
                                md: currentTheme.dmr.elevation.panel,
                            },
                            zIndex: currentTheme.zIndex.drawer + 1,
                        })}
                    >
                        <Stack
                            direction="row"
                            sx={(currentTheme) => ({
                                alignItems: "center",
                                gap: `${currentTheme.dmr.spacing.md}px`,
                                minWidth: 0,
                                flex: 1,
                            })}
                        >
                            {esMovil ? (
                                <Tooltip title={etiquetaNavegacion}>
                                    <IconButton
                                        color="inherit"
                                        onClick={alternarNavegacion}
                                        aria-label={etiquetaNavegacion}
                                        aria-controls="navegacion-movil"
                                        aria-expanded={mobileNavigationOpen}
                                        sx={(currentTheme) => ({
                                            width: currentTheme.dmr.density.compact.controlHeight,
                                            height: currentTheme.dmr.density.compact.controlHeight,
                                            "&:focus-visible": {
                                                outline: `2px solid ${currentTheme.dmr.borders.focus}`,
                                                outlineOffset: currentTheme.dmr.spacing.xs,
                                            },
                                        })}
                                    >
                                        {mobileNavigationOpen ? (
                                            <XIcon size={22} aria-hidden="true" />
                                        ) : (
                                            <ListIcon size={22} aria-hidden="true" />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            ) : null}

                            {/* Identidad del sistema con tipografía destacada. */}
                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    component="p"
                                    sx={(currentTheme) => ({
                                        ...currentTheme.dmr.typography.xs,
                                        color: currentTheme.dmr.primary.default,
                                        fontWeight: 700,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        whiteSpace: "nowrap",
                                    })}
                                >
                                    Dashboard
                                </Typography>
                                <Typography
                                    component="h1"
                                    noWrap
                                    sx={(currentTheme) => ({
                                        ...currentTheme.dmr.typography.xl,
                                        fontWeight: 700,
                                    })}
                                >
                                    VoltDash
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Controles de sesión siempre a la derecha. */}
                        <Stack
                            direction="row"
                            sx={{ alignItems: "center", gap: 1 }}
                        >
                            {sesionQuery.data ? (
                                <>
                                    <Typography
                                        sx={(currentTheme) => ({
                                            ...currentTheme.dmr.typography.sm,
                                            display: { xs: "none", md: "block" },
                                            color: currentTheme.dmr.textos.secondary,
                                        })}
                                    >
                                        {sesionQuery.data.usuario.username}
                                    </Typography>
                                    <Button
                                        color="inherit"
                                        onClick={cerrarSesion}
                                        disabled={logoutMutation.isPending}
                                        startIcon={
                                            <SignOutIcon size={18} aria-hidden="true" />
                                        }
                                    >
                                        {logoutMutation.isPending ? "Saliendo…" : "Salir"}
                                    </Button>
                                </>
                            ) : null}
                        </Stack>
                    </Box>

                    {/* 9. Cuerpo flexible debajo del Hero: tarjeta propia que
                        contiene el Main (Outlet + scroll vertical
                        independiente) y, en escritorio amplio, el panel
                        contextual opcional. */}
                    <Box
                        sx={(currentTheme) => ({
                            flex: "1 1 auto",
                            display: "flex",
                            minWidth: 0,
                            minHeight: 0,
                            overflow: "hidden",
                            bgcolor: currentTheme.dmr.superficies.workspace,
                            border: {
                                xs: "none",
                                md: `1px solid ${currentTheme.dmr.borders.subtle}`,
                            },
                            borderRadius: {
                                xs: 0,
                                md: `${currentTheme.dmr.radius.lg}px`,
                            },
                            boxShadow: {
                                xs: "none",
                                md: currentTheme.dmr.elevation.panel,
                            },
                        })}
                    >
                        <Box
                            component="main"
                            sx={(currentTheme) => ({
                                flex: "1 1 auto",
                                minWidth: 0,
                                minHeight: 0,
                                overflowX: "hidden",
                                overflowY: "auto",
                                bgcolor: currentTheme.dmr.superficies.workspace,
                                p: {
                                    xs: `${currentTheme.dmr.layout.mainContentPaddingCompact}px`,
                                    md: `${currentTheme.dmr.layout.mainContentPaddingDefault}px`,
                                },
                            })}
                        >
                            {logoutMutation.isError ? (
                                <Alert
                                    severity="error"
                                    sx={(currentTheme) => ({
                                        mb: `${currentTheme.dmr.spacing.lg}px`,
                                    })}
                                >
                                    No fue posible cerrar la sesión. Comprueba la conexión e inténtalo nuevamente.
                                </Alert>
                            ) : null}
                            <Outlet />
                        </Box>

                        {/* Panel lateral global: lo rellena la página activa
                            vía usePanelLateral, o el prop sidePanel como legado.
                            Visible solo en escritorio amplio y si está abierto.
                            El ancho lo decide el contenido (ancho/estandar/angosto)
                            para adaptarse a la distribución de cada módulo. */}
                        {panel && abierto ? (
                            <Box
                                id="panel-lateral"
                                component="aside"
                                sx={(currentTheme) => ({
                                    display: { xs: "none", lg: "block" },
                                    flex: "0 0 auto",
                                    width: panelWidth,
                                    minWidth: 0,
                                    minHeight: 0,
                                    overflowX: "hidden",
                                    overflowY: "auto",
                                    bgcolor: currentTheme.dmr.superficies.panel,
                                    borderLeft: `1px solid ${currentTheme.dmr.borders.subtle}`,
                                    p: `${currentTheme.dmr.spacing.lg}px`,
                                    transition: `width ${currentTheme.dmr.motion.duration.normal}ms ${currentTheme.dmr.motion.easing.standard}`,
                                })}
                            >
                                {panel}
                            </Box>
                        ) : null}
                    </Box>
                </Box>

                <Backdrop
                    open={esMovil && mobileNavigationOpen}
                    onClick={() => setMobileNavigationOpen(false)}
                    sx={(currentTheme) => ({
                        position: "absolute",
                        top: `${currentTheme.dmr.layout.topBarHeight}px`,
                        zIndex: currentTheme.zIndex.drawer - 1,
                        bgcolor: currentTheme.dmr.superficies.overlay,
                    })}
                />

                <Drawer
                    id="navegacion-movil"
                    variant="persistent"
                    anchor="left"
                    open={esMovil && mobileNavigationOpen}
                    sx={(currentTheme) => ({
                        display: { xs: "block", md: "none" },
                        position: "absolute",
                        inset: 0,
                        top: `${currentTheme.dmr.layout.topBarHeight}px`,
                        zIndex: currentTheme.zIndex.drawer,
                        pointerEvents: "none",
                    })}
                    slotProps={{
                        paper: {
                            "aria-label": "Navegación principal",
                            sx: {
                                position: "absolute",
                                top: 0,
                                width: `${theme.dmr.layout.sidebarExpandedWidth}px`,
                                height: `calc(100dvh - ${theme.dmr.layout.topBarHeight}px)`,
                                overflowX: "hidden",
                                overflowY: "auto",
                                pointerEvents: "auto",
                                borderRight: `1px solid ${theme.dmr.borders.subtle}`,
                            },
                        },
                    }}
                >
                    <NavegacionLateral
                        contraida={false}
                        onNavigate={() => setMobileNavigationOpen(false)}
                    />
                </Drawer>

                {/* Panel lateral en móvil: superpuesto como Drawer derecho.
                    En escritorio amplio vive inline (aside); por debajo de lg
                    se desliza sobre el contenido y se cierra al elegir fuera.
                    El ancho respeta el ancho declarado por el módulo activo. */}
                {panel && abierto && !esPanelEscritorio ? (
                    <Drawer
                        id="panel-lateral-movil"
                        variant="temporary"
                        anchor="right"
                        open={true}
                        onClose={() => setAbierto(false)}
                        sx={(currentTheme) => ({
                            display: { xs: "block", lg: "none" },
                            position: "absolute",
                            inset: 0,
                            top: `${currentTheme.dmr.layout.topBarHeight}px`,
                            zIndex: currentTheme.zIndex.drawer,
                            pointerEvents: "none",
                        })}
                        slotProps={{
                            paper: {
                                "aria-label": "Panel lateral",
                                sx: {
                                    position: "absolute",
                                    top: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    width: `min(${panelWidth}px, 100%)`,
                                    height: `calc(100dvh - ${theme.dmr.layout.topBarHeight}px)`,
                                    overflow: "hidden",
                                    pointerEvents: "auto",
                                    borderLeft: `1px solid ${theme.dmr.borders.subtle}`,
                                    bgcolor: theme.dmr.superficies.panel,
                                },
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            sx={(currentTheme) => ({
                                flex: "0 0 auto",
                                justifyContent: "flex-end",
                                bgcolor: currentTheme.dmr.superficies.panel,
                                px: `${currentTheme.dmr.spacing.lg}px`,
                            })}
                        >
                            <Tooltip title="Cerrar panel lateral">
                                <IconButton
                                    color="inherit"
                                    onClick={() => setAbierto(false)}
                                    aria-label="Cerrar panel lateral"
                                    sx={(currentTheme) => ({
                                        width: currentTheme.dmr.density.compact.controlHeight,
                                        height: currentTheme.dmr.density.compact.controlHeight,
                                        "&:focus-visible": {
                                            outline: `2px solid ${currentTheme.dmr.borders.focus}`,
                                            outlineOffset: currentTheme.dmr.spacing.xs,
                                        },
                                    })}
                                >
                                    <XIcon size={20} aria-hidden="true" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Box
                            sx={(currentTheme) => ({
                                flex: "1 1 auto",
                                minHeight: 0,
                                overflowY: "auto",
                                overflowX: "hidden",
                                p: `${currentTheme.dmr.spacing.lg}px`,
                            })}
                        >
                            {panel}
                        </Box>
                    </Drawer>
                ) : null}

                {/* 10. Capa reservada para futuros elementos flotantes. */}
                {floatingLayer ? (
                    <Box
                        sx={(currentTheme) => ({
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            zIndex: currentTheme.zIndex.tooltip,
                        })}
                    >
                        <Box sx={{ pointerEvents: "auto" }}>{floatingLayer}</Box>
                    </Box>
                ) : null}
            </Box>
        </Box>
    );
}

export function AppShell({ sidePanel, floatingLayer }: AppShellProps) {
    return (
        <PanelLateralProvider>
            <AppShellLayout sidePanel={sidePanel} floatingLayer={floatingLayer} />
        </PanelLateralProvider>
    );
}