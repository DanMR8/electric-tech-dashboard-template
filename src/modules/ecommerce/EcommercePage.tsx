import {
    ChatCircle,
    CheckCircleIcon,
    EnvelopeSimple,
    Headset,
    InstagramLogo,
    RobotIcon,
    SidebarSimpleIcon,
    StorefrontIcon,
    WarningCircleIcon,
    WhatsappLogo,
} from "@phosphor-icons/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    LinearProgress,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as echarts from "echarts";
import { useEffect, useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { usePanelLateral } from "../../app/panelContext";
import {
    obtenerAlertasSistema,
    obtenerCanalesInteraccion,
    obtenerMetricasResumen,
obtenerRendimientoConversacion,
    obtenerSerieInteracciones,
} from "../../shared/ai-gateway/api";
import type {
    CanalInteraccionRow,
    EstadoServicio,
    MedidorEnVivo,
    MetricSummary,
    SystemAlert,
} from "../../shared/ai-gateway/types";
import { apiConfig } from "../../shared/config";
import { cssPx, glassPanelStyles, solidPanelStyles } from "../../shared/styles/superficies";
import { crearTemaEcharts } from "../../theme";
import type { DmrTheme } from "../../theme/variables-visuales";

/**
 * E-commerce & Asistente IA: operaciones de venta y soporte.
 *
 * - El Workspace (centro) se renderiza aquí mismo.
 * - El SidePanel derecho es GLOBAL y lo rellena el módulo activo con
 *   usePanelLateral().setContenido(...): cualquier módulo puede pintar
 *   contenido en él sin tocar el AppShell, siempre que lo limpie al
 *   desmontar (ver useEffect). AppShell renderiza el panel solo cuando
 *   hay contenido y está abierto, con lo que no hay conflictos.
 * - Los datos viven en un repositorio mock (src/shared/ai-gateway/api.ts):
 *   la UI solo consume contratos tipados; un consumidor del template
 *   reemplaza ese archivo por su backend.
 * - Las superficies (glass/solid) provienen del precedente compartido
 *   src/shared/styles/superficies.ts (no formalizado aún).
 */

const rangosTemporales = ["1 h", "24 h", "7 d"] as const;

type RangoTemporal = (typeof rangosTemporales)[number];

/** Formatea grandes volúmenes en notación compacta local (p. ej. 4210 → "4,2 mil"). */
const formatoNumeroCompacto = (valor: number): string =>
    new Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(valor);

/* ------------------------- Estados de consulta ligeros ------------------------- */

function NotaDatosEnVacio({ texto }: { texto: string }) {
    return (
        <Typography sx={{ ...useTheme().dmr.typography.sm, color: useTheme().dmr.textos.tertiary }}>
            {texto}
        </Typography>
    );
}

/* -------------------------------- Sparkline -------------------------------- */

function MiniSparkline({ points, color }: { points: ReadonlyArray<number>; color: string }) {
    const dmr = useTheme().dmr;
    const id = useId().replace(/:/g, "");
    const min = Math.min(...points);
    const max = Math.max(...points);
    const rango = Math.max(max - min, 1);

    const puntosLinea = points
        .map((valor, indice) => {
            const x = (indice / (points.length - 1)) * 120;
            const y = 32 - ((valor - min) / rango) * 26;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg
            viewBox="0 0 120 36"
            role="presentation"
            aria-hidden="true"
            style={{
                display: "block",
                width: "100%",
                height: dmr.medidas.decorativos.sparklineAlto,
            }}
        >
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,36 ${puntosLinea} 120,36`} fill={`url(#${id})`} />
            <polyline
                points={puntosLinea}
                fill="none"
                stroke={color}
                strokeWidth={dmr.medidas.trazos.sparkline}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* -------------------------------- Tarjetas KPI -------------------------------- */

function TarjetaMetrica({
    metrica,
    color,
    softAccent,
}: {
    metrica: MetricSummary;
    color: string;
    softAccent: string;
}) {
    const theme = useTheme();
    const dmr = theme.dmr;
    // Un aumento puede ser bueno (tokens) o malo (latencia): el color del
    // delta deriva de metrica.variacionEsPositiva, no del signo.
    const mejora =
        metrica.variacion > 0
            ? metrica.variacionEsPositiva
            : !metrica.variacionEsPositiva;
    const colorDelta = mejora
        ? dmr.estados.success.foreground
        : dmr.estados.error.foreground;
    const signo = metrica.variacion > 0 ? "+" : "";

    return (
        <Card
            sx={(theme) => ({
                ...solidPanelStyles(theme),
                backgroundImage: `radial-gradient(circle at 100% 0%, ${softAccent}, transparent 48%)`,
                transition: theme.transitions.create(
                    ["transform", "border-color", "box-shadow"],
                    {
                        duration: theme.dmr.motion.duration.fast,
                        easing: theme.dmr.motion.easing.standard,
                    },
                ),
                "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: color,
                    boxShadow: `${theme.dmr.elevation.card}, 0 16px 48px ${softAccent}`,
                },
            })}
        >
            <CardContent sx={{ p: cssPx(dmr.density.comfortable.cardPadding) }}>
                <Stack sx={{ gap: cssPx(dmr.spacing.sm) }}>
                    <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary }}>
                        {metrica.etiqueta}
                    </Typography>

                    <Stack
                        direction="row"
                        sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm), flexWrap: "wrap" }}
                    >
                        <Typography sx={{ ...dmr.typography.numeric.xl, color: dmr.textos.primary }}>
                            {metrica.valor}
                        </Typography>
                        <Chip
                            size="small"
                            label={`${signo}${metrica.variacion.toFixed(1)}%`}
                            sx={{
                                height: dmr.medidas.microChips.chico,
                                fontSize: dmr.typography.micro.fontSize,
                                bgcolor: mejora
                                    ? dmr.estados.success.subtle
                                    : dmr.estados.error.subtle,
                                color: colorDelta,
                            }}
                        />
                    </Stack>

                    <MiniSparkline points={metrica.sparkline} color={color} />
                </Stack>
            </CardContent>
        </Card>
    );
}

/* ------------------------- Gráfica principal (ECharts) ------------------------- */

function GraficaInteraccionesPorCanal() {
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const dmr = theme.dmr;
    const serieQuery = useQuery({
        queryKey: ["ai-gateway", "serie-canales"],
        queryFn: obtenerSerieInteracciones,
    });
    const serie = serieQuery.data;

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !serie) return;

        // 1. Limpieza de instancia previa (Strict Mode / cambio de esquema).
        let chart = echarts.getInstanceByDom(container);
        if (chart) {
            chart.dispose();
        }

        chart = echarts.init(container, crearTemaEcharts(dmr), {
            renderer: "svg",
        });

        chart.setOption({
            animationDuration: dmr.motion.duration.normal,
            animationEasing: "cubicOut",

            // Margen superior amplio para no colisionar con la leyenda.
            grid: {
                left: dmr.spacing.sm,
                right: dmr.spacing.md,
                top: dmr.spacing["4xl"],
                bottom: dmr.spacing.xs,
                containLabel: true,
            },

            legend: {
                top: 0,
                right: "center",
                icon: "circle",
                itemWidth: dmr.medidas.serieLinea.leyendaIcono,
                itemHeight: dmr.medidas.serieLinea.leyendaIcono,
                itemGap: dmr.medidas.serieLinea.leyendaGap,
                textStyle: {
                    color: dmr.textos.secondary,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.medidas.textoCanvas,
                },
            },

            tooltip: {
                trigger: "axis",
                // Línea punteada que sigue al cursor sin tapar la barra enfocada.
                axisPointer: {
                    type: "line",
                    lineStyle: {
                        type: "dashed",
                        color: dmr.borders.focus,
                        width: dmr.medidas.trazos.fino,
                    },
                },
                // Evita que el tooltip desborde la tarjeta del dashboard.
                confine: true,
                // Resumen por hora: una fila por canal + total apilado.
                formatter: (params: unknown) => {
                    const filas = (Array.isArray(params) ? params : [params]) as ReadonlyArray<{
                        marker?: string;
                        seriesName?: string;
                        value?: unknown;
                        axisValueLabel?: string;
                    }>;
                    const total = filas.reduce(
                        (acumulado, fila) => acumulado + (Number(fila.value) || 0),
                        0,
                    );
                    const cuerpo = filas
                        .map(
                            (fila) =>
                                `${fila.marker ?? ""}${fila.seriesName}: <b>${fila.value}</b>`,
                        )
                        .join("<br/>");
                    return `${filas[0]?.axisValueLabel ?? ""}<br/>${cuerpo}<hr style="margin: 6px 0;"/>Total: <b>${total}</b> interacciones/h`;
                },
            },

            xAxis: {
                type: "category",
                boundaryGap: true,
                data: serie.horas,
            },

            yAxis: {
                type: "value",
                name: "interacciones/h",
                nameTextStyle: {
                    color: dmr.textos.secondary,
                    fontFamily: dmr.typography.fontFamily.base,
                },
            },

            series: serie.canales.map((canal, indice) => ({
                name: canal.canal,
                type: "bar",
                stack: "total",
                data: canal.valores,
                barMaxWidth: dmr.spacing.xl,
                // Redondeo únicamente en la capa superior para que el borde
                // cierre la pila apilada con suavidad.
                itemStyle: {
                    color: dmr.charts.categorical[indice % dmr.charts.categorical.length],
                    borderRadius: indice === serie.canales.length - 1 ? dmr.radius.xs : 0,
                },
            })),
        });

        // Resize fluido: RequestAnimationFrame evita bloqueos al redimensionar.
        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
                chart?.resize();
            });
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            chart?.dispose();
        };
    }, [dmr, serie]);

    return (
        <Box
            ref={containerRef}
            role="img"
            aria-label="Interacciones por hora desglosadas por canal"
            sx={{
                width: "100%",
                minHeight: { xs: 320, sm: 380, lg: 420 },
            }}
        />
    );
}

/* ------------------- Bento grid de canales de interacción ------------------- */

const coloresEstadoServicio = (
    dmr: DmrTheme,
): Record<EstadoServicio, { subtle: string; texto: string; etiqueta: string }> => ({
    operativo: {
        subtle: dmr.estados.success.subtle,
        texto: dmr.estados.success.foreground,
        etiqueta: "Operativo",
    },
    degradado: {
        subtle: dmr.estados.warning.subtle,
        texto: dmr.estados.warning.foreground,
        etiqueta: "Degradado",
    },
    offline: {
        subtle: dmr.estados.error.subtle,
        texto: dmr.estados.error.foreground,
        etiqueta: "Offline",
    },
});

/** Icono contextual por canal de contacto (propiedad `canal` del contrato). */
function IconoCanal({ canal, size = 20 }: { canal: string; size?: number }) {
    const dmr = useTheme().dmr;
    const propiedades = {
        size,
        color: dmr.primary.default,
        weight: "fill" as const,
        "aria-hidden": true as const,
    };

    switch (canal) {
        case "WhatsApp":
            return <WhatsappLogo {...propiedades} />;
        case "Instagram DM":
            return <InstagramLogo {...propiedades} />;
        case "Email":
            return <EnvelopeSimple {...propiedades} />;
        case "Teléfono":
        case "Chat · Teléfono":
            return <Headset {...propiedades} />;
        default:
            return <ChatCircle {...propiedades} />;
    }
}

/** Tarjeta del bento grid: una ficha inmersiva por canal de interacción. */
function TarjetaCanal({ canal }: { canal: CanalInteraccionRow }) {
    const theme = useTheme();
    const dmr = theme.dmr;
    const estado = coloresEstadoServicio(dmr)[canal.estado];
    const tasaResolucion = Math.round(canal.tasaResolucion);

    return (
        <Box
            component="article"
            sx={(theme) => ({
                ...solidPanelStyles(theme),
                display: "flex",
                flexDirection: "column",
                gap: cssPx(theme.dmr.spacing.lg),
                p: cssPx(theme.dmr.density.comfortable.cardPadding),
            })}
        >
            {/* Cabecera: icono del canal + nombre y asistente. */}
            <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.md), minWidth: 0 }}>
                <Box
                    sx={{
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        width: cssPx(dmr.spacing["3xl"]),
                        height: cssPx(dmr.spacing["3xl"]),
                        borderRadius: cssPx(dmr.radius.md),
                        bgcolor: dmr.primary.subtle,
                        color: dmr.primary.default,
                    }}
                >
                    <IconoCanal canal={canal.canal} />
                </Box>
                <Stack sx={{ gap: cssPx(dmr.spacing.xs), minWidth: 0 }}>
                    <Typography
                        noWrap
                        sx={{ ...dmr.typography.md, fontWeight: 600, color: dmr.textos.primary }}
                    >
                        {canal.nombre}
                    </Typography>
                    <Typography noWrap sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}>
                        {canal.asistente}
                    </Typography>
                </Stack>
            </Stack>

            {/* Métrica principal: tasa de resolución en un medidor circular. */}
            <Stack sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm) }}>
                <Box sx={{ position: "relative", width: 112, height: 112, display: "grid", placeItems: "center" }}>
                    <CircularProgress
                        variant="determinate"
                        value={canal.tasaResolucion}
                        size={104}
                        thickness={5}
                        aria-label={`Tasa de resolución de ${canal.nombre}`}
                        sx={{ color: dmr.primary.default }}
                    />
                    <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                        <Typography
                            sx={{ ...dmr.typography.numeric.lg, fontWeight: 600, color: dmr.textos.primary }}
                        >
                            {tasaResolucion}%
                        </Typography>
                    </Box>
                </Box>
                <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary }}>
                    Tasa de resolución
                </Typography>
            </Stack>

            {/* Pie: volumen, latencia y estado del servicio. */}
            <Box sx={{ mt: "auto" }}>
                <Divider sx={{ borderColor: dmr.borders.subtle, mb: cssPx(dmr.spacing.md) }} />
                <Stack
                    direction="row"
                    sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: cssPx(dmr.spacing.md),
                        flexWrap: "wrap",
                    }}
                >
                    <Stack sx={{ gap: cssPx(dmr.spacing.xs) }}>
                        <Typography sx={{ ...dmr.typography.micro, color: dmr.textos.tertiary }}>
                            Volumen
                        </Typography>
                        <Typography sx={{ ...dmr.typography.numeric.md, color: dmr.textos.primary }}>
                            {formatoNumeroCompacto(canal.interacciones)}
                        </Typography>
                    </Stack>

                    <Stack sx={{ gap: cssPx(dmr.spacing.xs) }}>
                        <Typography sx={{ ...dmr.typography.micro, color: dmr.textos.tertiary }}>
                            Latencia
                        </Typography>
                        <Typography sx={{ ...dmr.typography.numeric.md, color: dmr.textos.primary }}>
                            {canal.tiempoRespuestaMs} ms
                        </Typography>
                    </Stack>

                    <Chip
                        size="small"
                        label={estado.etiqueta}
                        sx={{
                            height: dmr.medidas.microChips.chico,
                            fontSize: dmr.typography.micro.fontSize,
                            bgcolor: estado.subtle,
                            color: estado.texto,
                        }}
                    />
                </Stack>
            </Box>
        </Box>
    );
}

/** Bento grid reemplaza la tabla: fichas inmersivas de rendimiento por canal. */
function GridCanalesInteraccion() {
    const theme = useTheme();
    const dmr = theme.dmr;
    const canalesQuery = useQuery({
        queryKey: ["ai-gateway", "canales"],
        queryFn: obtenerCanalesInteraccion,
    });

    return (
        <Box component="section">
            <Stack sx={{ gap: cssPx(dmr.spacing.md), maxWidth: 720 }}>
                <Typography sx={{ ...dmr.typography.lg, fontWeight: 600, color: dmr.textos.primary }}>
                    Rendimiento por Canal de Asistencia
                </Typography>
                <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary }}>
                    Tasa de resolución, volumen atendido y latencia de cada canal. Son datos
                    ilustrativos de la operación diaria.
                </Typography>
            </Stack>

            {canalesQuery.isPending ? (
                <NotaDatosEnVacio texto="Cargando canales de interacción…" />
            ) : canalesQuery.isError ? (
                <NotaDatosEnVacio texto="No fue posible cargar los canales de interacción." />
            ) : (
                <Box
                    sx={{
                        mt: cssPx(dmr.spacing.lg),
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                            xl: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: cssPx(dmr.spacing.lg),
                    }}
                >
                    {canalesQuery.data.map((canal: CanalInteraccionRow) => (
                        <TarjetaCanal key={canal.id} canal={canal} />
                    ))}
                </Box>
            )}
        </Box>
    );
}

/* ----------------- Panel lateral global: conversación en vivo ----------------- */

function FilaAlerta({ alerta }: { alerta: SystemAlert }) {
    const dmr = useTheme().dmr;

    // Las notificaciones de enrutamiento IA se pintan con estados.ai;
    // el resto mapea por severidad sobre los estados del sistema.
    const esEnrutamiento = alerta.categoria === "enrutamiento";
    const colores = esEnrutamiento
        ? {
              subtle: dmr.estados.ai.subtle,
              borde: dmr.estados.ai.default,
              texto: dmr.estados.ai.foreground,
          }
        : alerta.nivel === "error"
          ? {
                subtle: dmr.estados.error.subtle,
                borde: dmr.estados.error.default,
                texto: dmr.estados.error.foreground,
            }
          : alerta.nivel === "warning"
            ? {
                  subtle: dmr.estados.warning.subtle,
                  borde: dmr.estados.warning.default,
                  texto: dmr.estados.warning.foreground,
              }
            : {
                  subtle: dmr.estados.info.subtle,
                  borde: dmr.estados.info.default,
                  texto: dmr.estados.info.foreground,
              };

    const icono = esEnrutamiento ? (
        <RobotIcon size={16} weight="fill" color={colores.texto} aria-hidden="true" />
    ) : alerta.nivel === "error" || alerta.nivel === "warning" ? (
        <WarningCircleIcon
            size={16}
            weight={alerta.nivel === "error" ? "fill" : "regular"}
            color={colores.texto}
            aria-hidden="true"
        />
    ) : (
        <CheckCircleIcon size={16} color={colores.texto} aria-hidden="true" />
    );

    return (
        <Box
            sx={{
                border: `1px solid ${colores.borde}`,
                borderLeft: `${cssPx(dmr.medidas.trazos.medio)}px solid ${colores.borde}`,
                borderRadius: cssPx(dmr.radius.sm),
                bgcolor: colores.subtle,
                p: cssPx(dmr.spacing.md),
            }}
        >
            <Stack direction="row" sx={{ gap: cssPx(dmr.spacing.sm), alignItems: "flex-start" }}>
                <Box sx={{ mt: cssPx(dmr.spacing.xs) }}>{icono}</Box>

                <Stack sx={{ gap: cssPx(dmr.spacing.xs), minWidth: 0, flex: 1 }}>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            gap: cssPx(dmr.spacing.sm),
                        }}
                    >
                        <Typography sx={{ ...dmr.typography.sm, fontWeight: 600, color: dmr.textos.primary }}>
                            {alerta.titulo}
                        </Typography>
                        <Typography
                            sx={{ ...dmr.typography.micro, color: dmr.textos.tertiary, flexShrink: 0 }}
                        >
                            {alerta.timestamp}
                        </Typography>
                    </Stack>
                    <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.secondary }}>
                        {alerta.detalle}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

function PanelConversacionEnVivo() {
    const theme = useTheme();
    const dmr = theme.dmr;
    const gaugeRef = useRef<HTMLDivElement>(null);
    const conversacionQuery = useQuery({
        queryKey: ["ai-gateway", "conversacion"],
        queryFn: obtenerRendimientoConversacion,
    });
    const alertasQuery = useQuery({
        queryKey: ["ai-gateway", "alertas"],
        queryFn: obtenerAlertasSistema,
    });
    const conversacion = conversacionQuery.data;

    useEffect(() => {
        const container = gaugeRef.current;
        if (!container || !conversacion) return;

        let chart = echarts.getInstanceByDom(container);
        if (chart) {
            chart.dispose();
        }

        chart = echarts.init(container, crearTemaEcharts(dmr), {
            renderer: "svg",
        });

        const medidores: ReadonlyArray<{ medidor: MedidorEnVivo; color: string }> = [
            { medidor: conversacion.inicioConversacion, color: dmr.primary.default },
            { medidor: conversacion.checkoutAsistido, color: dmr.secondary.default },
        ];

        chart.setOption({
            animationDuration: dmr.motion.duration.normal,
            animationEasing: "cubicOut",

            series: medidores.map(({ medidor, color }, indice) => ({
                name: medidor.nombre,
                type: "gauge" as const,
                min: 0,
                max: 100,
                radius: "82%",
                center: [indice === 0 ? "26%" : "74%", "52%"],
                startAngle: 210,
                endAngle: -30,
                splitNumber: 0,
                axisLine: {
                    lineStyle: {
                        width: dmr.medidas.trazos.medio * 2,
                        color: [[1, color]],
                    },
                },
                pointer: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                title: {
                    show: true,
                    offsetCenter: [0, "92%"],
                    color: dmr.textos.secondary,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.typography.xs.fontSize,
                },
                detail: {
                    valueAnimation: true,
                    formatter: "{value}%",
                    color: dmr.textos.primary,
                    fontFamily: dmr.typography.fontFamily.numeric,
                    fontSize: dmr.typography.numeric.lg.fontSize,
                    fontWeight: 600,
                    offsetCenter: [0, "68%"],
                },
                data: [{ value: medidor.porcentaje, name: medidor.nombre }],
            })),
        });

        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
                chart?.resize();
            });
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            chart?.dispose();
        };
    }, [dmr, conversacion]);

    const inicioConversacion = conversacion?.inicioConversacion;
    const checkoutAsistido = conversacion?.checkoutAsistido;

    return (
        <Stack sx={{ gap: cssPx(dmr.density.comfortable.contentGap) }}>
            <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "space-between", gap: cssPx(dmr.spacing.sm) }}
            >
                <Typography
                    variant="overline"
                    sx={{ color: dmr.textos.secondary, letterSpacing: "0.12em" }}
                >
                    Alertas en vivo
                </Typography>
                <Chip
                    size="small"
                    label="EN VIVO"
                    sx={{
                        height: dmr.medidas.microChips.chico,
                        fontSize: dmr.typography.micro.fontSize,
                        color: dmr.estados.success.foreground,
                        bgcolor: dmr.estados.success.subtle,
                    }}
                />
            </Stack>

            {/* Inicio de conversación y compra asistida. */}
            <Card>
                <CardContent sx={{ p: cssPx(dmr.density.compact.cardPadding) }}>
                    <Box
                        ref={gaugeRef}
                        role="img"
                        aria-label="Inicio de conversación y compra asistida por IA"
                        sx={{ width: "100%", minHeight: 168 }}
                    />

                    <Divider sx={{ borderColor: dmr.borders.subtle, my: cssPx(dmr.spacing.md) }} />

                    <Stack sx={{ gap: cssPx(dmr.spacing.sm) }}>
                        <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm) }}>
                            <WarningCircleIcon size={18} color={dmr.primary.default} aria-hidden="true" />
                            <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.primary, flex: 1 }}>
                                {inicioConversacion?.detalle ?? "Bot · Web y WhatsApp"}
                            </Typography>
                            <Typography sx={{ ...dmr.typography.numeric.sm, color: dmr.textos.secondary }}>
                                {inicioConversacion?.valorFormateado ?? "—"}
                            </Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={inicioConversacion?.porcentaje ?? 0}
                            aria-label="Visitas que inician conversación con el asistente"
                            sx={{
                                height: dmr.medidas.barras.media,
                                borderRadius: cssPx(dmr.radius.pill),
                                bgcolor: dmr.superficies.interactive,
                                "& .MuiLinearProgress-bar": { bgcolor: dmr.primary.default },
                            }}
                        />
                        {inicioConversacion?.nota ? (
                            <Typography sx={{ ...dmr.typography.xs, color: dmr.estados.warning.foreground }}>
                                {inicioConversacion.nota}
                            </Typography>
                        ) : null}

                        <Stack
                            direction="row"
                            sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm), mt: cssPx(dmr.spacing.xs) }}
                        >
                            <CheckCircleIcon size={18} color={dmr.secondary.default} aria-hidden="true" />
                            <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.primary, flex: 1 }}>
                                {checkoutAsistido?.nombre ?? "Compra Asistida (Checkout)"}
                            </Typography>
                            <Typography sx={{ ...dmr.typography.numeric.sm, color: dmr.textos.secondary }}>
                                {checkoutAsistido?.valorFormateado ?? "—"}
                            </Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={checkoutAsistido?.porcentaje ?? 0}
                            aria-label="Conversaciones que llegan al checkout con el asistente"
                            sx={{
                                height: dmr.medidas.barras.media,
                                borderRadius: cssPx(dmr.radius.pill),
                                bgcolor: dmr.superficies.interactive,
                                "& .MuiLinearProgress-bar": { bgcolor: dmr.secondary.default },
                            }}
                        />
                    </Stack>
                </CardContent>
            </Card>

            <Divider sx={{ borderColor: dmr.borders.subtle }} />

            {/* Feed de alertas: estados.ai.subtle para las de enrutamiento. */}
            <Box>
                <Stack
                    direction="row"
                    sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm), mb: cssPx(dmr.spacing.md) }}
                >
                    <Typography
                        variant="overline"
                        sx={{ color: dmr.textos.secondary, letterSpacing: "0.12em", flex: 1 }}
                    >
                        Alertas del negocio
                    </Typography>
                    <Chip
                        size="small"
                        label={`${alertasQuery.data?.length ?? 0} activas`}
                        sx={{
                            height: dmr.medidas.microChips.chico,
                            fontSize: dmr.typography.micro.fontSize,
                            color: dmr.estados.warning.foreground,
                            bgcolor: dmr.estados.warning.subtle,
                        }}
                    />
                </Stack>

                {alertasQuery.isPending ? (
                    <NotaDatosEnVacio texto="Cargando alertas inteligentes…" />
                ) : alertasQuery.isError ? (
                    <NotaDatosEnVacio texto="No fue posible cargar las alertas." />
                ) : (
                    <Stack sx={{ gap: cssPx(dmr.spacing.sm) }}>
                        {alertasQuery.data.map((alerta) => (
                            <FilaAlerta key={alerta.id} alerta={alerta} />
                        ))}
                    </Stack>
                )}
            </Box>
        </Stack>
    );
}

/* -------------------------------- Página ---------------------------------- */

/** CTA del header: abre el panel lateral (conversación en vivo + alertas). */
function BotonPanelLateral({ abierto, onClick }: { abierto: boolean; onClick: () => void }) {
    const theme = useTheme();
    const dmr = theme.dmr;
    const etiqueta = abierto ? "Ocultar panel lateral" : "Mostrar panel lateral";

    return (
        <Tooltip title={etiqueta} arrow>
            <Button
                variant="contained"
                onClick={onClick}
                aria-label={etiqueta}
                aria-expanded={abierto}
                aria-controls="panel-lateral"
                startIcon={<SidebarSimpleIcon size={18} weight="fill" aria-hidden="true" />}
                sx={(theme) => ({
                    height: dmr.density.compact.controlHeight,
                    px: cssPx(dmr.spacing.md),
                    borderRadius: cssPx(dmr.radius.pill),
                    bgcolor: dmr.primary.default,
                    color: dmr.primary.foreground,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.typography.sm.fontSize,
                    fontWeight: 600,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    boxShadow: `0 0 0 1px ${dmr.primary.subtle}, 0 8px 24px ${dmr.primary.subtle}`,
                    transition: theme.transitions.create(
                        ["transform", "box-shadow", "background-color"],
                        {
                            duration: dmr.motion.duration.fast,
                            easing: dmr.motion.easing.standard,
                        },
                    ),
                    "&:hover": {
                        bgcolor: dmr.primary.default,
                        transform: "translateY(-2px)",
                        boxShadow: `0 0 0 1px ${dmr.primary.default}, 0 14px 36px ${dmr.primary.subtle}`,
                    },
                    "&:focus-visible": {
                        outline: `2px solid ${dmr.borders.focus}`,
                        outlineOffset: cssPx(dmr.spacing.xs),
                    },
                })}
            >
                Alertas en vivo
            </Button>
        </Tooltip>
    );
}

export function EcommercePage() {
    const theme = useTheme();
    const dmr = theme.dmr;
    const { setContenido, abierto, setAbierto, setAncho } = usePanelLateral();
    const [rango, setRango] = useState<RangoTemporal>("24 h");
    const metricasQuery = useQuery({
        queryKey: ["ai-gateway", "metricas-resumen"],
        queryFn: obtenerMetricasResumen,
    });

    // El SidePanel es global: este módulo pinta su gateway en vivo y lo
    // limpia al desmontar para que ninguna otra ruta herede su contenido.
    // La telemetría (dos medidores + feed de alertas) prefiere un panel
    // ancho para respirar; al desmontar se restaura el ancho estándar.
    useEffect(() => {
        setAncho("ancho");
        setContenido(<PanelConversacionEnVivo />);

        return () => {
            setAncho("estandar");
            setContenido(null);
        };
    }, [setAncho, setContenido]);

    const coloresMetricas = [
        { color: dmr.primary.default, softAccent: dmr.primary.subtle },
        { color: dmr.secondary.default, softAccent: dmr.secondary.subtle },
        { color: dmr.estados.success.default, softAccent: dmr.estados.success.subtle },
        { color: dmr.estados.ai.default, softAccent: dmr.estados.ai.subtle },
    ] as const;

    return (
        <Stack sx={{ gap: cssPx(dmr.density.comfortable.sectionGap) }}>
            {/* 1. Header vítreo: título amigable + controles visuales rápidos. */}
            <Box
                component="header"
                sx={(theme) => ({
                    ...glassPanelStyles(theme, theme.dmr.primary.subtle),
                    p: cssPx(theme.dmr.spacing.lg),
                })}
            >
                <Stack
                    direction="row"
                    sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: cssPx(dmr.spacing.md),
                        flexWrap: "wrap",
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm) }}>
                            <StorefrontIcon size={22} color={dmr.primary.default} aria-hidden="true" />
                            <Typography component="h1" sx={{ ...dmr.typography["3xl"], color: dmr.textos.primary }}>
                                E-commerce &amp; Asistente IA
                            </Typography>
                        </Stack>
                        <Typography
                            sx={{
                                ...dmr.typography.sm,
                                color: dmr.textos.secondary,
                                mt: cssPx(dmr.spacing.xs),
                            }}
                        >
                            Operaciones de venta y soporte · rendimiento del asistente y sus canales
                        </Typography>
                    </Box>

                    <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm), flexWrap: "wrap" }}>
                        {rangosTemporales.map((opcion) => (
                            <Chip
                                key={opcion}
                                label={opcion}
                                size="small"
                                onClick={() => setRango(opcion)}
                                aria-pressed={rango === opcion}
                                sx={{
                                    height: dmr.density.compact.controlHeight,
                                    fontSize: dmr.typography.sm.fontSize,
                                    cursor: "pointer",
                                    bgcolor:
                                        rango === opcion
                                            ? dmr.primary.subtle
                                            : dmr.superficies.interactive,
                                    color: rango === opcion ? dmr.primary.default : dmr.textos.secondary,
                                    border: `1px solid ${rango === opcion ? dmr.borders.focus : dmr.borders.subtle}`,
                                }}
                            />
                        ))}

                        <Chip
                            size="small"
                            label={`Modo ${apiConfig.mode}`}
                            sx={{
                                height: dmr.density.compact.controlHeight,
                                fontWeight: 600,
                                bgcolor: dmr.estados.success.subtle,
                                color: dmr.estados.success.foreground,
                            }}
                        />

                        <BotonPanelLateral abierto={abierto} onClick={() => setAbierto(!abierto)} />
                    </Stack>
                </Stack>
            </Box>

            {/* 2. Gráfica principal: interacciones por canal (apiladas). */}
            <Box
                component="section"
                sx={(theme) => ({
                    ...solidPanelStyles(theme),
                    p: cssPx(theme.dmr.density.comfortable.cardPadding),
                })}
            >
                <Stack sx={{ gap: cssPx(dmr.spacing.lg) }}>
                    <Box>
                        <Typography
                            variant="overline"
                            sx={{ color: dmr.primary.default, letterSpacing: "0.12em" }}
                        >
                            Canales
                        </Typography>
                        <Typography sx={{ ...dmr.typography.lg, fontWeight: 600, color: dmr.textos.primary }}>
                            Interacciones por Canal
                        </Typography>
                    </Box>
                    <GraficaInteraccionesPorCanal />
                </Stack>
            </Box>

            {/* 3. Tarjetas de métricas (KPIs) con sparkline. */}
            {metricasQuery.isPending ? (
                <NotaDatosEnVacio texto="Cargando métricas…" />
            ) : metricasQuery.isError ? (
                <NotaDatosEnVacio texto="No fue posible cargar las métricas." />
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                            xl: "repeat(4, minmax(0, 1fr))",
                        },
                        gap: cssPx(dmr.density.comfortable.contentGap),
                    }}
                >
                    {metricasQuery.data
                        .map((metrica: MetricSummary, indice: number) => (
                            <TarjetaMetrica
                                key={metrica.etiqueta}
                                metrica={metrica}
                                color={coloresMetricas[indice].color}
                                softAccent={coloresMetricas[indice].softAccent}
                            />
                        ))}
                </Box>
            )}

            {/* 4. Bento grid de canales de interacción. */}
            <GridCanalesInteraccion />
        </Stack>
    );
}