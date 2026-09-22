import {
    ChatCircleText,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    Robot,
    User,
    WarningCircle,
    XCircleIcon,
} from "@phosphor-icons/react";
import {
    Box,
    Chip,
    Divider,
    InputAdornment,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { usePanelLateral } from "../../app/panelContext";
import { obtenerTrazas } from "../../shared/ai-gateway/api";
import type { TraceLog, TraceStatusHttp } from "../../shared/ai-gateway/types";
import { cssPx, glassPanelStyles, solidPanelStyles } from "../../shared/styles/superficies";
import type { DmrTheme } from "../../theme/variables-visuales";

/**
 * Historial de Conversaciones (Traces & Logs).
 *
 * Vista de auditoría para inspeccionar sesiones individuales entre
 * clientes y el asistente IA.
 * - El Workspace muestra el historial con filtros simples.
 * - Al hacer clic en una fila se inyecta el DetalleSesionChat (chat
 *   forense) en el SidePanel global (usePanelLateral); sin selección se
 *   muestra un estado vacío con instrucciones. El panel se limpia al
 *   desmontar.
 * - Los datos provienen del repositorio mock (src/shared/ai-gateway/api.ts).
 * - Las superficies (glass/solid) provienen del precedente compartido
 *   src/shared/styles/superficies.ts (no formalizado aún).
 */

const estadoFiltros = [
    { valor: 200, etiqueta: "200 OK" },
    { valor: 429, etiqueta: "429 Rate Limit" },
    { valor: 500, etiqueta: "500 Error" },
] as const;

type FiltroEstado = "todos" | TraceStatusHttp;

const estilosStatus = (
    dmr: DmrTheme,
): Record<TraceStatusHttp, { subtle: string; texto: string; etiqueta: string }> => ({
    200: {
        subtle: dmr.estados.success.subtle,
        texto: dmr.estados.success.foreground,
        etiqueta: "200 OK",
    },
    429: {
        subtle: dmr.estados.warning.subtle,
        texto: dmr.estados.warning.foreground,
        etiqueta: "429 Rate Limit",
    },
    500: {
        subtle: dmr.estados.error.subtle,
        texto: dmr.estados.error.foreground,
        etiqueta: "500 Error",
    },
});

const iconoStatus = (statusHttp: TraceStatusHttp) => {
    if (statusHttp === 200) {
        return <CheckCircleIcon size={16} aria-hidden="true" />;
    }
    if (statusHttp === 429) {
        return <WarningCircle size={16} aria-hidden="true" />;
    }
    return <XCircleIcon size={16} aria-hidden="true" />;
};

/* --------------------- Panel lateral: estado vacío --------------------- */

function PanelEstadoVacio() {
    const dmr = useTheme().dmr;

    return (
        <Stack
            sx={{
                gap: cssPx(dmr.spacing.md),
                alignItems: "center",
                textAlign: "center",
                py: cssPx(dmr.spacing["3xl"]),
            }}
        >
            <ChatCircleText size={28} color={dmr.textos.tertiary} aria-hidden="true" />
            <Box>
                <Typography
                    variant="overline"
                    sx={{ color: dmr.textos.secondary, letterSpacing: "0.12em" }}
                >
                    Detalle de la Sesión
                </Typography>
                <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary }}>
                    Selecciona una sesión en el historial para inspeccionar la conversación y el
                    rendimiento del agente.
                </Typography>
            </Box>
        </Stack>
    );
}

/* ------------------ Panel lateral: Detalle de Sesión (chat) ------------------ */

function FilaTecnica({ etiqueta, valor }: { etiqueta: string; valor: string }) {
    const dmr = useTheme().dmr;

    return (
        <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between", gap: cssPx(dmr.spacing.sm) }}
        >
            <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary }}>{etiqueta}</Typography>
            <Typography sx={{ ...dmr.typography.numeric.md, color: dmr.textos.primary }}>
                {valor}
            </Typography>
        </Stack>
    );
}

/** Reconstrucción forense de la sesión como ventana de chat. */
function DetalleSesionChat({ traza }: { traza: TraceLog }) {
    const dmr = useTheme().dmr;
    const estado = estilosStatus(dmr)[traza.statusHttp];
    const esFallo = traza.statusHttp === 429 || traza.statusHttp === 500;

    return (
        <Stack sx={{ gap: cssPx(dmr.density.comfortable.contentGap) }}>
            {/* Cabecera del panel: título + ID y chips de estado y plataforma. */}
            <Stack
                direction="row"
                sx={{
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: cssPx(dmr.spacing.sm),
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="overline"
                        sx={{ color: dmr.primary.default, letterSpacing: "0.12em" }}
                    >
                        Detalle de Sesión
                    </Typography>
                    <Typography sx={{ ...dmr.typography.md, fontWeight: 600, color: dmr.textos.primary }}>
                        {traza.id}
                    </Typography>
                </Box>
                <Chip
                    size="small"
                    icon={iconoStatus(traza.statusHttp)}
                    label={estado.etiqueta}
                    sx={{
                        height: dmr.medidas.microChips.medio,
                        fontSize: dmr.typography.micro.fontSize,
                        bgcolor: estado.subtle,
                        color: estado.texto,
                        "& .MuiChip-icon": { color: estado.texto },
                    }}
                />
            </Stack>

            <Stack direction="row" sx={{ gap: cssPx(dmr.spacing.sm), flexWrap: "wrap" }}>
                <Chip
                    size="small"
                    label={traza.canal}
                    sx={{
                        height: dmr.medidas.microChips.medio,
                        fontSize: dmr.typography.micro.fontSize,
                        color: dmr.estados.ai.foreground,
                        bgcolor: dmr.estados.ai.subtle,
                    }}
                />
                <Chip
                    size="small"
                    label={traza.asistente}
                    sx={{
                        height: dmr.medidas.microChips.medio,
                        fontSize: dmr.typography.micro.fontSize,
                        color: dmr.textos.secondary,
                        bgcolor: dmr.superficies.interactive,
                    }}
                />
                <Typography sx={{ ...dmr.typography.micro, color: dmr.textos.tertiary, alignSelf: "center" }}>
                    {traza.timestamp}
                </Typography>
            </Stack>

            <Divider sx={{ borderColor: dmr.borders.subtle }} />

            {/* Ventana de chat: contexto, turno del cliente y respuesta del bot. */}
            <Stack sx={{ gap: cssPx(dmr.spacing.lg), p: cssPx(dmr.spacing.md) }}>
                {/* Mensaje 1: contexto / system prompt. */}
                <Box
                    sx={{
                        alignSelf: "center",
                        maxWidth: "90%",
                        border: `1px dashed ${dmr.borders.subtle}`,
                        borderRadius: cssPx(dmr.radius.sm),
                        p: cssPx(dmr.spacing.sm),
                    }}
                >
                    <Typography
                        sx={{
                            ...dmr.typography.micro,
                            color: dmr.textos.tertiary,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            textAlign: "center",
                        }}
                    >
                        Instrucciones de contexto del bot
                    </Typography>
                    <Typography
                        sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary, textAlign: "center" }}
                    >
                        {traza.payload.contextoAsistente}
                    </Typography>
                </Box>

                {/* Mensaje 2: burbuja del cliente (derecha). */}
                <Stack
                    sx={{
                        alignSelf: "flex-end",
                        maxWidth: "85%",
                        gap: cssPx(dmr.spacing.xs),
                        bgcolor: dmr.primary.default,
                        borderRadius: cssPx(dmr.radius.lg),
                        borderBottomRightRadius: 0,
                        p: cssPx(dmr.spacing.md),
                    }}
                >
                    <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.xs) }}>
                        <User size={14} weight="fill" color={dmr.primary.foreground} aria-hidden="true" />
                        <Typography
                            sx={{ ...dmr.typography.micro, fontWeight: 600, color: dmr.primary.foreground }}
                        >
                            Cliente
                        </Typography>
                    </Stack>
                    <Typography sx={{ ...dmr.typography.sm, color: dmr.primary.foreground }}>
                        {traza.payload.mensajeCliente}
                    </Typography>
                </Stack>

                {/* Mensaje 3: burbuja del asistente IA (izquierda). */}
                <Stack
                    sx={{
                        alignSelf: "flex-start",
                        maxWidth: "85%",
                        gap: cssPx(dmr.spacing.xs),
                        bgcolor: dmr.estados.ai.subtle,
                        border: `1px solid ${dmr.estados.ai.default}`,
                        borderRadius: cssPx(dmr.radius.lg),
                        borderBottomLeftRadius: 0,
                        p: cssPx(dmr.spacing.md),
                    }}
                >
                    <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.xs) }}>
                        <Robot size={14} weight="fill" color={dmr.estados.ai.foreground} aria-hidden="true" />
                        <Typography
                            sx={{ ...dmr.typography.micro, fontWeight: 600, color: dmr.estados.ai.foreground }}
                        >
                            Asistente IA
                        </Typography>
                    </Stack>
                    <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.primary }}>
                        {traza.payload.respuestaAsistente}
                    </Typography>
                </Stack>

                {/* Alerta de fallo: rate limit o error del servicio. */}
                {esFallo ? (
                    <Stack
                        direction="row"
                        sx={{
                            alignSelf: "flex-start",
                            alignItems: "center",
                            gap: cssPx(dmr.spacing.sm),
                            maxWidth: "85%",
                            bgcolor: dmr.estados.error.subtle,
                            color: dmr.estados.error.foreground,
                            borderRadius: cssPx(dmr.radius.sm),
                            p: cssPx(dmr.spacing.sm),
                        }}
                    >
                        <WarningCircle size={16} weight="fill" aria-hidden="true" />
                        <Typography sx={{ ...dmr.typography.xs, color: dmr.estados.error.foreground }}>
                            El bot falló o la sesión fue escalada a un humano.
                        </Typography>
                    </Stack>
                ) : null}
            </Stack>

            <Divider sx={{ borderColor: dmr.borders.subtle }} />

            {/* Pie del panel: desglose técnico de la conversación. */}
            <Box>
                <Typography
                    variant="overline"
                    sx={{ color: dmr.textos.secondary, letterSpacing: "0.12em", mb: cssPx(dmr.spacing.md) }}
                >
                    Desglose técnico
                </Typography>
                <Stack sx={{ gap: cssPx(dmr.spacing.sm) }}>
                    <FilaTecnica etiqueta="Temperatura" valor={traza.payload.temperature.toFixed(1)} />
                    <FilaTecnica etiqueta="Tokens entrada" valor={String(traza.payload.tokensEntrada)} />
                    <FilaTecnica etiqueta="Tokens salida" valor={String(traza.payload.tokensSalida)} />
                    <FilaTecnica etiqueta="Total tokens" valor={String(traza.totalTokens)} />
                    <FilaTecnica etiqueta="Latencia" valor={`${traza.latenciaMs} ms`} />
                    <FilaTecnica etiqueta="Costo estimado" valor={traza.payload.costo} />
                </Stack>
            </Box>
        </Stack>
    );
}

/* ----------------------------- Página principal ----------------------------- */

export function ConversacionesPage() {
    const dmr = useTheme().dmr;
    const { setContenido, setAncho } = usePanelLateral();
    const [busqueda, setBusqueda] = useState("");
    const [canalFiltro, setCanalFiltro] = useState<"todos" | string>("todos");
    const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>("todos");
    const [trazaSeleccionada, setTrazaSeleccionada] = useState<TraceLog | null>(null);

    const trazasQuery = useQuery({
        queryKey: ["ai-gateway", "trazas"],
        queryFn: obtenerTrazas,
    });

    const opcionesCanales = useMemo(() => {
        const canales = trazasQuery.data?.map((traza) => traza.canal) ?? [];
        return [...new Set(canales)];
    }, [trazasQuery.data]);

    const trazasFiltradas = useMemo(() => {
        const datos = trazasQuery.data ?? [];
        const texto = busqueda.trim().toLocaleLowerCase();

        return datos.filter((traza) => {
            const coincideEstudio = busqueda.trim() === "";
            const coincideBusqueda =
                coincideEstudio ||
                traza.id.toLocaleLowerCase().includes(texto) ||
                traza.canal.toLocaleLowerCase().includes(texto) ||
                traza.asistente.toLocaleLowerCase().includes(texto);
            const coincideModelo = canalFiltro === "todos" || traza.canal === canalFiltro;
            const coincideEstado = estadoFiltro === "todos" || traza.statusHttp === estadoFiltro;

            return coincideBusqueda && coincideModelo && coincideEstado;
        });
    }, [trazasQuery.data, busqueda, canalFiltro, estadoFiltro]);

    // El SidePanel es global: aquí se pinta el chat forense de la sesión
    // activa (o el estado vacío). La limpieza al desmontar evita heredar
    // contenido. El chat forense prefiere un panel amplio para respirar
    // las burbujas y el desglose técnico; el estado vacío vuelve al ancho
    // estándar y al desmontar se restaura todo.
    useEffect(() => {
        if (trazaSeleccionada) {
            setAncho("ancho");
            setContenido(<DetalleSesionChat traza={trazaSeleccionada} />);
        } else {
            setAncho("estandar");
            setContenido(<PanelEstadoVacio />);
        }

        return () => {
            setAncho("estandar");
            setContenido(null);
        };
    }, [trazaSeleccionada, setAncho, setContenido]);

    return (
        <Stack sx={{ gap: cssPx(dmr.density.comfortable.sectionGap) }}>
            {/* 1. Header del módulo. */}
            <Box>
                <Typography component="h1" sx={{ ...dmr.typography["3xl"], color: dmr.textos.primary }}>
                    Historial de Conversaciones
                </Typography>
                <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary, mt: cssPx(dmr.spacing.xs) }}>
                    Auditoría de sesiones y resolución del Asistente IA
                </Typography>
            </Box>

            {/* 2. Barra de filtros vítrea: buscador, canal y estado. */}
            <Box
                component="section"
                sx={(theme) => ({
                    ...glassPanelStyles(theme, theme.dmr.estados.ai.subtle),
                    p: cssPx(theme.dmr.density.comfortable.cardPadding),
                })}
            >
                <Stack
                    direction="row"
                    sx={{ gap: cssPx(dmr.spacing.md), flexWrap: "wrap", alignItems: "center" }}
                >
                    <OutlinedInput
                        value={busqueda}
                        onChange={(event) => setBusqueda(event.target.value)}
                        placeholder="Buscar por ID, canal o asistente…"
                        aria-label="Buscar sesión"
                        startAdornment={
                            <InputAdornment position="start" sx={{ color: dmr.textos.secondary }}>
                                <MagnifyingGlassIcon size={18} aria-hidden="true" />
                            </InputAdornment>
                        }
                        sx={{ flex: "1 1 260px", minWidth: 0, ...dmr.typography.sm }}
                    />

                    <Select
                        value={canalFiltro}
                        onChange={(event) => setCanalFiltro(event.target.value)}
                        displayEmpty
                        aria-label="Filtrar por canal"
                        sx={{
                            minWidth: 220,
                            bgcolor: dmr.superficies.interactive,
                            borderRadius: cssPx(dmr.radius.sm),
                            color: dmr.textos.primary,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: dmr.borders.default,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: dmr.borders.strong,
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: dmr.borders.focus,
                            },
                        }}
                    >
                        <MenuItem value="todos">Todos los canales</MenuItem>
                        {opcionesCanales.map((canal) => (
                            <MenuItem key={canal} value={canal}>
                                {canal}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        value={estadoFiltro}
                        onChange={(event) => setEstadoFiltro(event.target.value as FiltroEstado)}
                        displayEmpty
                        aria-label="Filtrar por estado HTTP"
                        sx={{
                            minWidth: 180,
                            bgcolor: dmr.superficies.interactive,
                            borderRadius: cssPx(dmr.radius.sm),
                            color: dmr.textos.primary,
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: dmr.borders.default,
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: dmr.borders.focus,
                            },
                        }}
                    >
                        <MenuItem value="todos">Todos los estados</MenuItem>
                        {estadoFiltros.map((opcion) => (
                            <MenuItem key={opcion.valor} value={opcion.valor}>
                                {opcion.etiqueta}
                            </MenuItem>
                        ))}
                    </Select>

                    <Typography sx={{ ...dmr.typography.micro, color: dmr.textos.tertiary, marginLeft: "auto" }}>
                        {trazasFiltradas.length} de {trazasQuery.data?.length ?? 0} sesiones
                    </Typography>
                </Stack>
            </Box>

            {/* 3. Tabla del historial de sesiones (panel sólido estandarizado). */}
            <Box
                component="section"
                sx={(theme) => ({
                    ...solidPanelStyles(theme),
                    p: cssPx(theme.dmr.density.comfortable.cardPadding),
                })}
            >
                {trazasQuery.isPending ? (
                    <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.tertiary }}>
                        Cargando historial de conversaciones…
                    </Typography>
                ) : trazasQuery.isError ? (
                    <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.tertiary }}>
                        No fue posible cargar el historial de conversaciones.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small" aria-label="Historial de conversaciones">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sesión</TableCell>
                                    <TableCell>Canal / Asistente</TableCell>
                                    <TableCell align="right">Estado</TableCell>
                                    <TableCell align="right">Duración</TableCell>
                                    <TableCell align="right">Tokens</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {trazasFiltradas.map((traza) => {
                                    const seleccionada = trazaSeleccionada?.id === traza.id;
                                    const estado = estilosStatus(dmr)[traza.statusHttp];

                                    return (
                                        <TableRow
                                            key={traza.id}
                                            hover
                                            selected={seleccionada}
                                            onClick={() => setTrazaSeleccionada(traza)}
                                            aria-selected={seleccionada}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell>
                                                <Stack sx={{ gap: cssPx(dmr.spacing.xs) }}>
                                                    <Typography
                                                        sx={{
                                                            ...dmr.typography.numeric.sm,
                                                            fontWeight: 600,
                                                            color: seleccionada
                                                                ? dmr.primary.default
                                                                : dmr.textos.primary,
                                                        }}
                                                    >
                                                        {traza.id}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ ...dmr.typography.micro, color: dmr.textos.tertiary }}
                                                    >
                                                        {traza.timestamp}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Stack sx={{ gap: cssPx(dmr.spacing.xs) }}>
                                                    <Typography
                                                        sx={{
                                                            ...dmr.typography.md,
                                                            fontWeight: 600,
                                                            color: dmr.textos.primary,
                                                        }}
                                                    >
                                                        {traza.canal}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}
                                                    >
                                                        {traza.asistente}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell align="right">
                                                <Chip
                                                    size="small"
                                                    icon={iconoStatus(traza.statusHttp)}
                                                    label={estado.etiqueta}
                                                    sx={{
                                                        height: dmr.medidas.microChips.chico,
                                                        fontSize: dmr.typography.micro.fontSize,
                                                        bgcolor: estado.subtle,
                                                        color: estado.texto,
                                                        "& .MuiChip-icon": { color: estado.texto },
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell
                                                align="right"
                                                sx={{ ...dmr.typography.numeric.md, color: dmr.textos.secondary }}
                                            >
                                                {traza.latenciaMs} ms
                                            </TableCell>

                                            <TableCell
                                                align="right"
                                                sx={{ ...dmr.typography.numeric.md, color: dmr.textos.secondary }}
                                            >
                                                {traza.totalTokens}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {trazasFiltradas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography
                                                sx={{ ...dmr.typography.sm, color: dmr.textos.tertiary, py: cssPx(dmr.spacing.md) }}
                                            >
                                                No hay sesiones que coincidan con los filtros.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Stack>
    );
}