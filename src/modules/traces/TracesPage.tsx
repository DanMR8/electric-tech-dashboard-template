import {
    CheckCircleIcon,
    FileSearchIcon,
    MagnifyingGlassIcon,
    WarningCircleIcon,
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
 * Explorador de Trazas (Traces & Logs).
 *
 * Vista forense para inspeccionar llamadas individuales a los modelos.
 * - El Workspace muestra el historial con filtros simples.
 * - Al hacer clic en una fila se inyecta el InspectorPayload en el
 *   SidePanel global (usePanelLateral); sin selección se muestra un
 *   estado vacío con instrucciones. El panel se limpia al desmontar.
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
        return <WarningCircleIcon size={16} aria-hidden="true" />;
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
            <FileSearchIcon size={28} color={dmr.textos.tertiary} aria-hidden="true" />
            <Box>
                <Typography
                    variant="overline"
                    sx={{ color: dmr.textos.secondary, letterSpacing: "0.12em" }}
                >
                    Inspector de Payload
                </Typography>
                <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary }}>
                    Selecciona una traza en el historial para inspeccionar su prompt, su
                    respuesta y el desglose técnico.
                </Typography>
            </Box>
        </Stack>
    );
}

/* ----------------- Paneles laterales: Inspector de Payload ----------------- */

function BloqueCodigo({ titulo, contenido }: { titulo: string; contenido: string }) {
    const dmr = useTheme().dmr;

    return (
        <Box>
            <Typography
                sx={{
                    ...dmr.typography.micro,
                    color: dmr.textos.tertiary,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    mb: cssPx(dmr.spacing.xs),
                }}
            >
                {titulo}
            </Typography>
            <Box
                component="pre"
                sx={{
                    ...dmr.typography.xs,
                    fontFamily: dmr.typography.fontFamily.numeric,
                    color: dmr.textos.primary,
                    bgcolor: dmr.superficies.background,
                    border: `1px solid ${dmr.borders.subtle}`,
                    borderRadius: cssPx(dmr.radius.sm),
                    p: cssPx(dmr.spacing.md),
                    m: 0,
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}
            >
                {contenido}
            </Box>
        </Box>
    );
}

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

function InspectorPayload({ traza }: { traza: TraceLog }) {
    const dmr = useTheme().dmr;
    const estado = estilosStatus(dmr)[traza.statusHttp];

    return (
        <Stack sx={{ gap: cssPx(dmr.density.comfortable.contentGap) }}>
            <Stack
                direction="row"
                sx={{ alignItems: "flex-start", justifyContent: "space-between", gap: cssPx(dmr.spacing.sm) }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="overline"
                        sx={{ color: dmr.primary.default, letterSpacing: "0.12em" }}
                    >
                        Inspector de Payload
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
                    label={traza.modelo}
                    sx={{
                        height: dmr.medidas.microChips.medio,
                        fontSize: dmr.typography.micro.fontSize,
                        color: dmr.estados.ai.foreground,
                        bgcolor: dmr.estados.ai.subtle,
                    }}
                />
                <Chip
                    size="small"
                    label={traza.backend}
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

            <BloqueCodigo titulo="Prompt del sistema" contenido={traza.payload.systemPrompt} />
            <BloqueCodigo titulo="Prompt del usuario" contenido={traza.payload.userPrompt} />
            <BloqueCodigo titulo="Respuesta (Completion)" contenido={traza.payload.completionText} />

            <Divider sx={{ borderColor: dmr.borders.subtle }} />

            <Box>
                <Typography
                    variant="overline"
                    sx={{ color: dmr.textos.secondary, letterSpacing: "0.12em", mb: cssPx(dmr.spacing.md) }}
                >
                    Desglose técnico
                </Typography>
                <Stack sx={{ gap: cssPx(dmr.spacing.sm) }}>
                    <FilaTecnica etiqueta="Temperatura" valor={traza.payload.temperature.toFixed(1)} />
                    <FilaTecnica etiqueta="Tokens entrada" valor={String(traza.payload.promptTokens)} />
                    <FilaTecnica etiqueta="Tokens salida" valor={String(traza.payload.completionTokens)} />
                    <FilaTecnica etiqueta="Total tokens" valor={String(traza.totalTokens)} />
                    <FilaTecnica etiqueta="Latencia" valor={`${traza.latenciaMs} ms`} />
                    <FilaTecnica etiqueta="Costo estimado" valor={traza.payload.costo} />
                </Stack>
            </Box>
        </Stack>
    );
}

/* ----------------------------- Página principal ----------------------------- */

export function TracesPage() {
    const dmr = useTheme().dmr;
    const { setContenido, setAncho } = usePanelLateral();
    const [busqueda, setBusqueda] = useState("");
    const [modeloFiltro, setModeloFiltro] = useState<"todos" | string>("todos");
    const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>("todos");
    const [trazaSeleccionada, setTrazaSeleccionada] = useState<TraceLog | null>(null);

    const trazasQuery = useQuery({
        queryKey: ["ai-gateway", "trazas"],
        queryFn: obtenerTrazas,
    });

    const opcionesModelos = useMemo(() => {
        const modelos = trazasQuery.data?.map((traza) => traza.modelo) ?? [];
        return [...new Set(modelos)];
    }, [trazasQuery.data]);

    const trazasFiltradas = useMemo(() => {
        const datos = trazasQuery.data ?? [];
        const texto = busqueda.trim().toLocaleLowerCase();

        return datos.filter((traza) => {
            const coincideEstudio = busqueda.trim() === "";
            const coincideBusqueda =
                coincideEstudio ||
                traza.id.toLocaleLowerCase().includes(texto) ||
                traza.modelo.toLocaleLowerCase().includes(texto) ||
                traza.backend.toLocaleLowerCase().includes(texto);
            const coincideModelo = modeloFiltro === "todos" || traza.modelo === modeloFiltro;
            const coincideEstado = estadoFiltro === "todos" || traza.statusHttp === estadoFiltro;

            return coincideBusqueda && coincideModelo && coincideEstado;
        });
    }, [trazasQuery.data, busqueda, modeloFiltro, estadoFiltro]);

    // El SidePanel es global: aquí se pinta el inspector de la traza activa
    // (o el estado vacío). La limpieza al desmontar evita heredar contenido.
    // El inspector de payload prefiere un panel angosto (columna de lectura
    // densa), dejando el ancho del workspace a la tabla; el estado vacío
    // vuelve al ancho estándar y al desmontar se restaura todo.
    useEffect(() => {
        if (trazaSeleccionada) {
            setAncho("angosto");
            setContenido(<InspectorPayload traza={trazaSeleccionada} />);
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
                    Explorador de Trazas
                </Typography>
                <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary, mt: cssPx(dmr.spacing.xs) }}>
                    Traces &amp; Logs · historial de llamadas a los modelos de IA
                </Typography>
            </Box>

            {/* 2. Barra de filtros vítrea: buscador, modelo y estado HTTP. */}
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
                        placeholder="Buscar por ID, modelo o backend…"
                        aria-label="Buscar traza"
                        startAdornment={
                            <InputAdornment position="start" sx={{ color: dmr.textos.secondary }}>
                                <MagnifyingGlassIcon size={18} aria-hidden="true" />
                            </InputAdornment>
                        }
                        sx={{ flex: "1 1 260px", minWidth: 0, ...dmr.typography.sm }}
                    />

                    <Select
                        value={modeloFiltro}
                        onChange={(event) => setModeloFiltro(event.target.value)}
                        displayEmpty
                        aria-label="Filtrar por modelo"
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
                        <MenuItem value="todos">Todos los modelos</MenuItem>
                        {opcionesModelos.map((modelo) => (
                            <MenuItem key={modelo} value={modelo}>
                                {modelo}
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
                        {trazasFiltradas.length} de {trazasQuery.data?.length ?? 0} trazas
                    </Typography>
                </Stack>
            </Box>

            {/* 3. Tabla de historial de llamadas (panel sólido estandarizado). */}
            <Box
                component="section"
                sx={(theme) => ({
                    ...solidPanelStyles(theme),
                    p: cssPx(theme.dmr.density.comfortable.cardPadding),
                })}
            >
                {trazasQuery.isPending ? (
                    <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.tertiary }}>
                        Cargando historial de trazas…
                    </Typography>
                ) : trazasQuery.isError ? (
                    <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.tertiary }}>
                        No fue posible cargar el historial de trazas.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small" aria-label="Historial de llamadas a modelos">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Traza</TableCell>
                                    <TableCell>Modelo</TableCell>
                                    <TableCell align="right">Estado</TableCell>
                                    <TableCell align="right">Latencia</TableCell>
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
                                                        {traza.modelo}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}
                                                    >
                                                        {traza.backend}
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
                                                No hay trazas que coincidan con los filtros.
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