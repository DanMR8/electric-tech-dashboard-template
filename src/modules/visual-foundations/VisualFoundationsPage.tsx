import {
    ChatCircle,
    Clock,
    ShoppingCart,
    Target,
    TrendUp,
    WarningCircle,
} from "@phosphor-icons/react";
import {
    Box,
    Button,
    Chip,
    Divider,
    LinearProgress,
    MenuItem,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useId, useRef, type ReactNode } from "react";
import * as echarts from "echarts";

// Importaciones relativas de tu tema local
import { ControlEsquemaColor, crearTemaEcharts } from "../../theme";
import { cssPx, glassPanelStyles, solidPanelStyles } from "../../shared/styles/superficies";

// const magnitudes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const;
const magnitudesNumericas = ["md", "xl", "3xl", "5xl"] as const;

// NOTA DE PUREZA DMR:
// Colores, tipografías, radios, sombras, espaciados, densidades, movimiento y también la
// geometría fina de los charts (trazos, neones, símbolos, dona, microchips y barras)
// provienen exclusivamente de theme.dmr (variable `dmr` reactiva al esquema activo).
// Escala de referencia: medidas (geometría numérica ECharts/canvas), spacing (>=4px),
// typography.micro (fuente mínima).

// 1. UTILIDADES DE ESTILOS BASE
// glassPanelStyles y solidPanelStyles viven en src/shared/styles/superficies.ts
// (precedente de estandarización no formalizado).
function SectionHeading({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow: string;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={(theme) => ({
                gap: cssPx(theme.dmr.spacing.md),
                alignItems: { xs: "flex-start", sm: "flex-end" },
                justifyContent: "space-between",
            })}
        >
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    component="p"
                    sx={(theme) => ({
                        ...theme.dmr.typography.xs,
                        color: theme.dmr.primary.default,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                    })}
                >
                    {eyebrow}
                </Typography>
                <Typography
                    component="h2"
                    sx={(theme) => ({
                        ...theme.dmr.typography["2xl"],
                        mt: cssPx(theme.dmr.spacing.xs),
                    })}
                >
                    {title}
                </Typography>
                {description ? (
                    <Typography
                        sx={(theme) => ({
                            ...theme.dmr.typography.sm,
                            color: theme.dmr.textos.secondary,
                            mt: cssPx(theme.dmr.spacing.xs),
                            maxWidth: 760,
                        })}
                    >
                        {description}
                    </Typography>
                ) : null}
            </Box>
            {action}
        </Stack>
    );
}

function Sparkline({
    points,
    color,
}: {
    points: readonly number[];
    color: string;
}) {
    const { dmr } = useTheme();
    const id = useId().replace(/:/g, "");
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
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.26" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,36 ${linePoints} 120,36`} fill={`url(#${id})`} />
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

function MetricCard({
    label,
    value,
    meta,
    glyph,
    accent,
    softAccent,
    valueColor,
    points,
}: {
    label: string;
    value: string;
    meta: string;
    glyph: ReactNode;
    accent: string;
    softAccent: string;
    valueColor: string;
    points: readonly number[];
}) {
    return (
        <Box
            sx={(theme) => ({
                ...solidPanelStyles(theme),
                p: cssPx(theme.dmr.density.default.cardPadding),
                backgroundImage: `radial-gradient(circle at 100% 0%, ${softAccent}, transparent 48%)`,
                transition: theme.transitions.create(["transform", "border-color", "box-shadow"], {
                    duration: theme.dmr.motion.duration.fast,
                    easing: theme.dmr.motion.easing.standard,
                }),
                "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: accent,
                    boxShadow: `${theme.dmr.elevation.card}, 0 16px 48px ${softAccent}`,
                },
            })}
        >
            <Stack
                direction="row"
                sx={(activeTheme) => ({
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: cssPx(activeTheme.dmr.spacing.md),
                })}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={(theme) => ({
                            ...theme.dmr.typography.sm,
                            color: theme.dmr.textos.secondary,
                        })}
                    >
                        {label}
                    </Typography>
                    <Typography
                        sx={(theme) => ({
                            ...theme.dmr.typography.numeric["2xl"],
                            color: valueColor,
                            mt: cssPx(theme.dmr.spacing.xs),
                            whiteSpace: "nowrap",
                        })}
                    >
                        {value}
                    </Typography>
                    <Typography
                        sx={(theme) => ({
                            ...theme.dmr.typography.xs,
                            color: accent,
                            mt: cssPx(theme.dmr.spacing.xs),
                        })}
                    >
                        {meta}
                    </Typography>
                </Box>
                <Box
                    sx={(theme) => ({
                        width: theme.dmr.spacing["2xl"],
                        height: theme.dmr.spacing["2xl"],
                        flex: "0 0 auto",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: cssPx(theme.dmr.radius.sm),
                        color: accent,
                        backgroundColor: softAccent,
                        border: `1px solid ${accent}`,
                        boxShadow: `0 0 26px ${softAccent}`,
                    })}
                >
                    <Typography
                        sx={(theme) => ({ ...theme.dmr.typography.sm, fontWeight: 700, display: "inline-flex", alignItems: "center" })}
                    >
                        {glyph}
                    </Typography>
                </Box>
            </Stack>
            <Box sx={(activeTheme) => ({ mt: cssPx(activeTheme.dmr.spacing.sm) })}>
                <Sparkline points={points} color={accent} />
            </Box>
        </Box>
    );
}

function GraficaTiempoRespuesta() {
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const dmr = theme.dmr;

        // 1. Limpieza de instancia previa
        // Evita el warning "There is a chart instance already initialized"
        // cuando se cambia dinámicamente entre modo oscuro/claro o en React Strict Mode.
        let chart = echarts.getInstanceByDom(container);
        if (chart) {
            chart.dispose();
        }

        chart = echarts.init(container, crearTemaEcharts(dmr), {
            renderer: "svg", // Mantenemos SVG para una responsividad nítida en móviles
        });

        chart.setOption({
            animationDuration: dmr.motion.duration.normal,
            animationEasing: "cubicOut",

            // 2. Grid Responsivo
            // Se amplía el margen superior ('4xl') para que la gráfica no colisione
            // con la leyenda en pantallas estrechas.
            grid: {
                left: dmr.spacing.sm,
                right: dmr.spacing.md,
                top: dmr.spacing["4xl"],
                bottom: dmr.spacing.md,
                containLabel: true,
            },

            // 3. Tooltip Integrado
            // Se inyecta la tipografía base y colores textuales para que no se sienta genérico.
            tooltip: {
                trigger: "axis",
                backgroundColor: dmr.glass.background,
                borderColor: dmr.borders.subtle,
                padding: [dmr.spacing.sm, dmr.spacing.md],
                textStyle: {
                    color: dmr.textos.primary,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.medidas.textoCanvas,
                },
                axisPointer: {
                    type: "line",
                    lineStyle: {
                        color: dmr.borders.focus,
                        type: "dashed",
                    },
                },
                extraCssText: [
                    `backdrop-filter: blur(${dmr.glass.blur}) saturate(${dmr.glass.saturate})`,
                    `box-shadow: ${dmr.elevation.floating}`,
                    `border-radius: ${dmr.radius.sm}px`,
                ].join(";"),
            },

            // 4. Leyenda Adaptativa
            // 'center' asegura que en móviles no se desborde hacia la derecha cortando el texto.
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
            xAxis: {
                type: "category",
                data: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
                boundaryGap: false,
                axisTick: { show: false },
                axisLine: {
                    lineStyle: { color: dmr.borders.subtle }
                },
                axisLabel: {
                    color: dmr.textos.tertiary,
                    margin: 12, // Añade respiro entre la línea del eje y la etiqueta
                }
            },
            yAxis: {
                type: "value",
                splitLine: {
                    lineStyle: {
                        color: dmr.borders.subtle,
                        type: "dashed"
                    }
                },
                axisLabel: {
                    color: dmr.textos.tertiary,
                    formatter: (value: number) => `${value} ms`,
                },
            },
            series: [
                {
                    name: "Tiempo Medio de Respuesta",
                    type: "line",
                    smooth: 0.35, // Suavizado orgánico para telemetría
                    showSymbol: false,
                    symbol: "circle",
                    symbolSize: dmr.medidas.serieLinea.simbolo,
                    data: [185, 240, 210, 480, 650, 340, 290, 265],
                    lineStyle: {
                        width: dmr.medidas.trazos.medio,
                        color: dmr.primary.default,
                        // Añadimos sombra neón nativa en el trazo para mantener la estética 'Electric'
                        shadowColor: dmr.primary.subtle,
                        shadowBlur: dmr.medidas.neones.brillante,
                        shadowOffsetY: dmr.medidas.neones.desplazamientoY,
                    },
                    itemStyle: {
                        color: dmr.primary.default,
                        borderColor: dmr.superficies.card,
                        borderWidth: dmr.medidas.trazos.fino,
                    },
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: dmr.primary.subtle },
                                { offset: 1, color: "transparent" },
                            ],
                        },
                    },
                    // 5. Interacción visual (Hover)
                    // Hace que la línea brille más cuando el usuario enfoca los datos.
                    emphasis: {
                        focus: "series",
                        itemStyle: {
                            shadowBlur: dmr.medidas.neones.suave,
                            shadowColor: dmr.primary.subtle,
                        }
                    }
                },
                {
                    name: "SLA Máximo Permitido (800 ms)",
                    type: "line",
                    smooth: 0,
                    showSymbol: false,
                    data: [800, 800, 800, 800, 800, 800, 800, 800],
                    lineStyle: {
                        width: dmr.medidas.trazos.fino,
                        type: "dashed",
                        color: dmr.estados.error.default,
                        opacity: 0.8,
                    },
                    itemStyle: {
                        color: dmr.estados.error.default,
                    },
                },
            ],
        });

        // 6. Fluidez de Redimensionamiento
        // Envolver resize en requestAnimationFrame evita bloqueos de UI al redimensionar.
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
    }, [theme]);

    return (
        <Box
            ref={containerRef}
            role="img"
            aria-label="Tiempo medio de respuesta del soporte frente al SLA máximo permitido"
            sx={{
                width: "100%",
                // Altura explícita escalonada para asegurar la visibilidad perfecta en móviles
                minHeight: {
                    xs: 320,
                    sm: 360,
                    md: 400,
                },
            }}
        />
    );
}

/* --------------------------- Embudo: Conversión --------------------------- */

function GraficaEmbudoConversion() {
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const dmr = theme.dmr;

        let chart = echarts.getInstanceByDom(container);
        if (chart) {
            chart.dispose();
        }

        chart = echarts.init(container, crearTemaEcharts(dmr), {
            renderer: "svg",
        });

        // Escala de conversión: cada etapa expresa porcentaje de las visitas totales.
        const datos = [
            { value: 100, name: "Visitas Totales" },
            { value: 75, name: "Interacción con Bot" },
            { value: 50, name: "Recomendación IA" },
            { value: 35, name: "Checkout Asistido" },
            { value: 20, name: "Venta Cerrada" },
        ].map((etapa, indice) => ({
            ...etapa,
            itemStyle: {
                color: dmr.charts.categorical[indice % dmr.charts.categorical.length],
            },
        }));

        chart.setOption({
            animationDuration: dmr.motion.duration.normal,
            animationEasing: "cubicOut",

            tooltip: {
                trigger: "item",
                backgroundColor: dmr.glass.background,
                borderColor: dmr.borders.subtle,
                padding: [dmr.spacing.sm, dmr.spacing.md],
                textStyle: {
                    color: dmr.textos.primary,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.medidas.textoCanvas,
                },
                extraCssText: [
                    `backdrop-filter: blur(${dmr.glass.blur}) saturate(${dmr.glass.saturate})`,
                    `box-shadow: ${dmr.elevation.floating}`,
                    `border-radius: ${dmr.radius.sm}px`,
                ].join(";"),
                formatter: (params: unknown) => {
                    const etapa = params as { name?: string; value?: number };
                    if (typeof etapa.value === "number") {
                        return `${etapa.name}<br/><b>${etapa.value} sesiones</b> · ${etapa.value}% del total`;
                    }
                    return etapa.name ?? "";
                },
            },

            series: [
                {
                    type: "funnel" as const,
                    top: dmr.spacing.lg,
                    bottom: dmr.spacing.lg,
                    left: dmr.spacing.sm,
                    right: dmr.spacing.sm,
                    minSize: "15%",
                    maxSize: "100%",
                    sort: "descending",
                    gap: dmr.spacing.xs,
                    label: {
                        position: "inside",
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: dmr.typography.fontFamily.base,
                        formatter: "{c} · {b}",
                    },
                    itemStyle: {
                        borderColor: dmr.superficies.card,
                        borderWidth: 2,
                    },
                    emphasis: {
                        focus: "self" as const,
                        itemStyle: {
                            borderColor: dmr.textos.primary,
                            borderWidth: 2,
                            shadowBlur: dmr.medidas.neones.suave,
                            shadowColor: dmr.primary.subtle,
                        },
                    },
                    data: datos,
                },
            ],
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
    }, [theme]);

    return (
        <Box
            ref={containerRef}
            role="img"
            aria-label="Embudo de conversión: de las visitas totales a la venta cerrada, con la interacción del bot y las recomendaciones de la IA en cada etapa"
            sx={{
                width: "100%",
                minHeight: { xs: 360, md: 420 },
            }}
        />
    );
}

/* --------------------- Heatmap: Densidad por Horario --------------------- */

function GraficaHeatmapHorarios() {
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const dmr = theme.dmr;

        let chart = echarts.getInstanceByDom(container);
        if (chart) {
            chart.dispose();
        }

        chart = echarts.init(container, crearTemaEcharts(dmr), {
            renderer: "svg",
        });

        // Días de la semana y horas del día para la malla del heatmap.
        const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
        const horas = Array.from({ length: 24 }, (_, hora) => `${String(hora).padStart(2, "0")}:00`);

        // Mock determinista: picos laborales (lunes a viernes) entre 10h y 18h
        // que alcanzan el tope de la escala (100), actividad moderada diurna y
        // mínima nocturna para aprovechar todo el gradiente del visualMap.
        const datos: Array<[number, number, number]> = [];
        dias.forEach((_, indiceDia) => {
            horas.forEach((_, hora) => {
                const picoLaboral = indiceDia < 5 && hora >= 10 && hora <= 18;
                const activoDiurno = hora >= 8 && hora <= 21;
                const valor = picoLaboral
                    ? 68 + ((hora * 3 + indiceDia * 2) % 33)
                    : activoDiurno
                      ? 22 + ((hora + indiceDia) % 18)
                      : 3 + ((hora + indiceDia) % 9);
                datos.push([hora, indiceDia, valor]);
            });
        });

        chart.setOption({
            animationDuration: dmr.motion.duration.normal,
            animationEasing: "cubicOut",

            tooltip: {
                position: "top",
                backgroundColor: dmr.glass.background,
                borderColor: dmr.borders.subtle,
                padding: [dmr.spacing.sm, dmr.spacing.md],
                textStyle: {
                    color: dmr.textos.primary,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.medidas.textoCanvas,
                },
                extraCssText: [
                    `backdrop-filter: blur(${dmr.glass.blur}) saturate(${dmr.glass.saturate})`,
                    `box-shadow: ${dmr.elevation.floating}`,
                    `border-radius: ${dmr.radius.sm}px`,
                ].join(";"),
                formatter: (params: unknown) => {
                    const punto = params as { value?: [number, number, number] };
                    const [hora, dia, valor] = punto.value ?? [0, 0, 0];
                    return `${dias[dia]}, ${horas[hora]}<br/><b>${valor}</b> interacciones`;
                },
            },

            grid: {
                left: dmr.spacing.sm,
                right: dmr.spacing.md,
                top: dmr.spacing["4xl"],
                bottom: 80,
                containLabel: true,
            },

            xAxis: {
                type: "category",
                data: horas,
                splitArea: { show: true },
                axisTick: { show: false },
                axisLine: { lineStyle: { color: dmr.borders.subtle } },
                axisLabel: {
                    color: dmr.textos.tertiary,
                    interval: 2, // Muestra una etiqueta cada 2 horas para no saturar
                },
            },

            yAxis: {
                type: "category",
                data: dias,
                inverse: true,
                splitArea: { show: true },
                axisTick: { show: false },
                axisLine: { lineStyle: { color: dmr.borders.subtle } },
                axisLabel: { color: dmr.textos.tertiary },
            },

            // Visual map visible y calculable: escala 0 → primary.default (picos)
            // pasando por la superficie interactiva y el tono sutil del primario.
            visualMap: {
                type: "continuous",
                min: 0,
                max: 100,
                calculable: true,
                orient: "horizontal",
                left: "center",
                bottom: 0,
                itemWidth: 12,
                itemHeight: 140,
                inRange: {
                    color: [dmr.superficies.interactive, dmr.primary.subtle, dmr.primary.default],
                },
                textStyle: {
                    color: dmr.textos.secondary,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.typography.xs.fontSize,
                },
            },

            series: [
                {
                    name: "Interacciones",
                    type: "heatmap" as const,
                    data: datos,
                    itemStyle: {
                        borderRadius: cssPx(dmr.radius.xs),
                        borderWidth: dmr.medidas.trazos.fino,
                        borderColor: dmr.superficies.card,
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: dmr.medidas.neones.suave,
                            shadowColor: dmr.primary.subtle,
                            borderColor: dmr.primary.default,
                        },
                    },
                },
            ],
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
    }, [theme]);

    return (
        <Box
            ref={containerRef}
            role="img"
            aria-label="Densidad de interacciones del asistente por hora del día y día de la semana"
            sx={{
                width: "100%",
                minHeight: { xs: 360, md: 420 },
            }}
        />
    );
}

/* ----------------------- Radar: Perfil de Capacidades ----------------------- */

function GraficaRadarPerfil() {
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const dmr = theme.dmr;

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

            tooltip: {
                trigger: "item",
                backgroundColor: dmr.glass.background,
                borderColor: dmr.borders.subtle,
                padding: [dmr.spacing.sm, dmr.spacing.md],
                textStyle: {
                    color: dmr.textos.primary,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.medidas.textoCanvas,
                },
                extraCssText: [
                    `backdrop-filter: blur(${dmr.glass.blur}) saturate(${dmr.glass.saturate})`,
                    `box-shadow: ${dmr.elevation.floating}`,
                    `border-radius: ${dmr.radius.sm}px`,
                ].join(";"),
            },

            legend: {
                bottom: 0,
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

            radar: {
                indicator: [
                    { name: "Resolución", max: 100 },
                    { name: "Empatía", max: 100 },
                    { name: "Velocidad", max: 100 },
                    { name: "Precisión", max: 100 },
                    { name: "Retención", max: 100 },
                ],
                radius: "66%",
                splitNumber: 4,
                axisName: {
                    color: dmr.textos.tertiary,
                    fontFamily: dmr.typography.fontFamily.base,
                    fontSize: dmr.medidas.textoCanvas,
                },
                splitLine: {
                    lineStyle: { color: dmr.borders.subtle },
                },
                splitArea: {
                    areaStyle: { color: [dmr.superficies.interactive, "transparent"] },
                },
                axisLine: {
                    lineStyle: { color: dmr.borders.subtle },
                },
            },

            series: [
                {
                    name: "Asistente IA (GPT-4)",
                    type: "radar" as const,
                    symbolSize: dmr.medidas.serieLinea.simbolo,
                    data: [
                        {
                            name: "Asistente IA (GPT-4)",
                            value: [92, 82, 96, 95, 88],
                        },
                    ],
                    lineStyle: {
                        color: dmr.primary.default,
                        width: dmr.medidas.trazos.medio,
                    },
                    itemStyle: {
                        color: dmr.primary.default,
                    },
                    areaStyle: {
                        color: dmr.primary.subtle,
                        opacity: 0.7,
                    },
                },
                {
                    name: "Soporte Humano Promedio",
                    type: "radar" as const,
                    symbolSize: dmr.medidas.serieLinea.simbolo,
                    data: [
                        {
                            name: "Soporte Humano Promedio",
                            value: [85, 93, 58, 78, 71],
                        },
                    ],
                    lineStyle: {
                        color: dmr.estados.ai.default,
                        width: dmr.medidas.trazos.medio,
                        type: "dashed",
                    },
                    itemStyle: {
                        color: dmr.estados.ai.default,
                    },
                    areaStyle: {
                        color: dmr.estados.ai.subtle,
                        opacity: 0.6,
                    },
                },
            ],
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
    }, [theme]);

    return (
        <Box
            ref={containerRef}
            role="img"
            aria-label="Radar que compara las capacidades del asistente IA frente al soporte humano promedio"
            sx={{
                width: "100%",
                minHeight: { xs: 320, md: 380 },
            }}
        />
    );
}

/* ------------------------- Timeline: Auditoría de Ticket ------------------------- */

type EventoTicket = {
    titulo: string;
    detalle: string;
    color: string;
};

function TimelineActividad({ eventos }: { eventos: readonly EventoTicket[] }) {
    const dmr = useTheme().dmr;

    return (
        <Stack sx={{ gap: 0 }}>
            {eventos.map((evento, indice) => {
                const ultimo = indice === eventos.length - 1;
                return (
                    <Stack
                        key={evento.titulo}
                        direction="row"
                        sx={{ gap: cssPx(dmr.spacing.md), alignItems: "stretch" }}
                    >
                        {/* Riel: nodo + conector vertical. */}
                        <Stack sx={{ alignItems: "center", flexShrink: 0, width: cssPx(dmr.spacing.lg) }}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    flexShrink: 0,
                                    borderRadius: cssPx(dmr.radius.pill),
                                    bgcolor: evento.color,
                                    border: `2px solid ${evento.color}`,
                                    boxShadow: `0 0 0 4px ${evento.color}26`,
                                }}
                            />
                            {!ultimo ? (
                                <Box
                                    sx={{
                                        width: 2,
                                        flex: 1,
                                        minHeight: cssPx(dmr.spacing["2xl"]),
                                        my: cssPx(dmr.spacing.xs),
                                        bgcolor: dmr.borders.subtle,
                                    }}
                                />
                            ) : null}
                        </Stack>

                        {/* Contenido del evento. */}
                        <Box sx={{ pb: ultimo ? 0 : cssPx(dmr.spacing.xl), minWidth: 0 }}>
                            <Typography sx={{ ...dmr.typography.sm, fontWeight: 600, color: dmr.textos.primary }}>
                                {evento.titulo}
                            </Typography>
                            <Typography
                                sx={{
                                    ...dmr.typography.xs,
                                    color: dmr.textos.tertiary,
                                    mt: cssPx(dmr.spacing.xs),
                                }}
                            >
                                {evento.detalle}
                            </Typography>
                        </Box>
                    </Stack>
                );
            })}
        </Stack>
    );
}

/* 3. VISTA PRINCIPAL: KITCHEN SINK DE E-COMMERCE & AI */
export function VisualFoundationsPage() {
    const theme = useTheme();
    const dmr = theme.dmr;

    const superficies = [
        ["Background", dmr.superficies.background],
        ["Workspace", dmr.superficies.workspace],
        ["Panel", dmr.superficies.panel],
        ["Card", dmr.superficies.card],
        ["Elevated", dmr.superficies.cardElevated],
        ["Interactive", dmr.superficies.interactive],
        ["Hover", dmr.superficies.hover],
        ["Floating", dmr.superficies.floating],
    ] as const;

    const estadosVisuales = [
        ["Primary", dmr.primary.default, dmr.primary.subtle],
        ["Secondary", dmr.secondary.default, dmr.secondary.subtle],
        ["Success", dmr.estados.success.default, dmr.estados.success.subtle],
        ["Warning", dmr.estados.warning.default, dmr.estados.warning.subtle],
        ["Error", dmr.estados.error.default, dmr.estados.error.subtle],
        ["Info", dmr.estados.info.default, dmr.estados.info.subtle],
        ["Analysis", dmr.estados.ai.default, dmr.estados.ai.subtle],
    ] as const;

    // Métricas del negocio: ventas y soporte asistidos por IA.
    const metricasComerciales = [
        {
            label: "Ventas Asistidas",
            value: "$48.2k",
            meta: "+18.6% vs. semana anterior",
            glyph: <ShoppingCart size={20} weight="fill" />,
            accent: dmr.primary.default,
            softAccent: dmr.primary.subtle,
            valueColor: dmr.textos.primary,
            points: [20, 24, 22, 30, 28, 34, 38, 36, 42, 40, 46, 48],
        },
        {
            label: "CSAT (Soporte)",
            value: "4.8 / 5",
            meta: "Calificación promedio del agente",
            glyph: <ChatCircle size={20} weight="fill" />,
            accent: dmr.estados.success.default,
            softAccent: dmr.estados.success.subtle,
            valueColor: dmr.estados.success.foreground,
            points: [4.2, 4.4, 4.4, 4.6, 4.5, 4.7, 4.7, 4.8, 4.7, 4.8, 4.8, 4.8],
        },
        {
            label: "Tasa de Retención",
            value: "87.4%",
            meta: "Clientes que vuelven a comprar",
            glyph: <TrendUp size={20} weight="fill" />,
            accent: dmr.secondary.default,
            softAccent: dmr.secondary.subtle,
            valueColor: dmr.secondary.foreground,
            points: [80, 81, 84, 83, 85, 86, 85, 87, 86, 87, 87, 87],
        },
        {
            label: "Escalamientos a Humano",
            value: "3.2%",
            meta: "Sesiones escaladas en el día",
            glyph: <WarningCircle size={20} weight="fill" />,
            accent: dmr.estados.error.default,
            softAccent: dmr.estados.error.subtle,
            valueColor: dmr.estados.error.foreground,
            points: [4.0, 3.8, 4.1, 3.6, 3.4, 3.6, 3.5, 3.2, 3.4, 3.2, 3.3, 3.2],
        },
    ] as const;

    // Equipo de atención: agentes automáticos y humanos.
    const agentesEquipo = [
        ["Aura · Bot Web", "Activo", "Web · Automático", "4.8", 92, dmr.estados.success.foreground],
        ["Iris · Bot Instagram", "Mantenimiento", "Instagram DM · Automático", "4.6", 64, dmr.estados.info.foreground],
        ["Tier-1 Soporte Humano", "Activo", "Chat · Agente humano", "4.9", 85, dmr.estados.success.foreground],
        ["Supervisor de Turno", "Revisión", "Equipo · En vivo", "4.7", 72, dmr.estados.warning.foreground],
        ["Fallback Offline", "Fuera Línea", "Sin canal asignado", "—", 0, dmr.estados.error.foreground],
    ] as const;

    // Timeline de ejemplo para la auditoría de una devolución asistida.
    const eventosTicket: readonly EventoTicket[] = [
        {
            titulo: "Chat iniciado vía WhatsApp",
            detalle: "Cliente ID #4821 · Intención general · 09:12",
            color: dmr.textos.tertiary,
        },
        {
            titulo: "Bot IA clasifica intención: Devolución",
            detalle: "Confianza del 96% · Asistente Aura · 09:14",
            color: dmr.primary.default,
        },
        {
            titulo: "Validación de política de reembolso exitosa",
            detalle: "Ticket #R-8821 aprobado · Garantía 30 días · 09:31",
            color: dmr.estados.success.default,
        },
        {
            titulo: "Escalado a humano para cierre financiero",
            detalle: "Derivado a Mariana R. (Finanzas) · 10:47",
            color: dmr.estados.warning.default,
        },
    ];

    return (
        <Box
            sx={{
                position: "relative",
                minWidth: 0,
                isolation: "isolate",
                pb: { xs: cssPx(dmr.spacing.xl), md: cssPx(dmr.spacing["3xl"]) },
                p: {
                    xs: 0,
                    md: cssPx(dmr.spacing.xl),
                    lg: cssPx(dmr.spacing.sm),
                },
                borderRadius: cssPx(dmr.radius.lg),
                backgroundImage: [
                    `radial-gradient(circle at 12% 0%, ${dmr.primary.subtle}, transparent 26%)`,
                    `radial-gradient(circle at 88% 10%, ${dmr.estados.ai.subtle}, transparent 24%)`,
                    `radial-gradient(circle at 62% 100%, ${dmr.secondary.subtle}, transparent 22%)`,
                ].join(", "),
            }}
        >
            <Box
                aria-hidden="true"
                sx={{
                    position: "absolute",
                    top: -140,
                    right: -120,
                    zIndex: -1,
                    width: dmr.layout.rightPanelWidth,
                    height: dmr.layout.rightPanelWidth,
                    borderRadius: cssPx(dmr.radius.pill),
                    background: dmr.estados.ai.subtle,
                    filter: `blur(${dmr.spacing["4xl"]}px)`,
                    pointerEvents: "none",
                }}
            />

            <Stack
                sx={{
                    gap: { xs: cssPx(dmr.spacing.xl), md: cssPx(dmr.spacing["2xl"]) },
                }}
            >
                {/* 1. HEADER */}
                <Box
                    component="header"
                    sx={(activeTheme) => ({
                        ...glassPanelStyles(activeTheme, activeTheme.dmr.primary.subtle),
                        p: {
                            xs: cssPx(activeTheme.dmr.spacing.lg),
                            md: cssPx(activeTheme.dmr.spacing.xl),
                        },
                    })}
                >
                    <Stack
                        direction={{ xs: "column", lg: "row" }}
                        sx={{
                            position: "relative",
                            gap: { xs: cssPx(dmr.spacing.xl), lg: cssPx(dmr.spacing["2xl"]) },
                            alignItems: { xs: "stretch", lg: "center" },
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ minWidth: 0, maxWidth: 820 }}>
                            <Stack
                                direction="row"
                                useFlexGap
                                sx={{
                                    alignItems: "center",
                                    gap: cssPx(dmr.spacing.sm),
                                    flexWrap: "wrap",
                                    mb: cssPx(dmr.spacing.md),
                                }}
                            >
                                <Chip
                                    label="UI KIT & ANALYTICS"
                                    size="small"
                                    sx={{
                                        color: dmr.primary.default,
                                        bgcolor: dmr.primary.subtle,
                                        border: `1px solid ${dmr.primary.default}`,
                                    }}
                                />
                                <Chip label="E-COMMERCE & AI" size="small" variant="outlined" sx={{ borderColor: dmr.borders.default }} />
                                <Chip label="SALES + SUPPORT" size="small" variant="outlined" sx={{ borderColor: dmr.borders.default }} />
                            </Stack>

                            <Typography
                                component="h1"
                                sx={{
                                    ...dmr.typography["5xl"],
                                    maxWidth: 760,
                                    backgroundImage: `linear-gradient(105deg, ${dmr.textos.primary} 18%, ${dmr.primary.default} 58%, ${dmr.estados.ai.default})`,
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                }}
                            >
                                UI Kit &amp; Componentes Analíticos · E-commerce &amp; AI UI Foundations
                            </Typography>
                            <Typography
                                sx={{
                                    ...dmr.typography.md,
                                    color: dmr.textos.secondary,
                                    maxWidth: 700,
                                    mt: cssPx(dmr.spacing.md),
                                }}
                            >
                                Vitrina integral de operaciones comerciales e inteligencia artificial: mide ventas
                                asistidas, tiempo de respuesta del soporte y el rendimiento de tus agentes en un
                                kit visual integrado.
                            </Typography>
                        </Box>

                        <Stack sx={{ minWidth: { xs: 0, lg: 320 }, gap: cssPx(dmr.spacing.md) }}>
                            <ControlEsquemaColor>
                                {({ esquema, setEsquema }) => (
                                    <Box
                                        sx={{
                                            p: cssPx(dmr.spacing.sm),
                                            borderRadius: cssPx(dmr.radius.md),
                                            backgroundColor: dmr.superficies.interactive,
                                            border: `1px solid ${dmr.borders.default}`,
                                            boxShadow: `inset 0 1px 0 ${dmr.glass.highlight}`,
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            sx={{
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: cssPx(dmr.spacing.md),
                                            }}
                                        >
                                            <Box>
                                                <Typography sx={{ ...dmr.typography.sm, fontWeight: 600 }}>Modo Visual</Typography>
                                                <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}>
                                                    {esquema === "deepDark" ? "Contraste Alto" : "Análisis Base"}
                                                </Typography>
                                            </Box>
                                            <Switch
                                                checked={esquema === "deepDark"}
                                                onChange={(_, checked) => setEsquema(checked ? "deepDark" : "dark")}
                                            />
                                        </Stack>
                                    </Box>
                                )}
                            </ControlEsquemaColor>

                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: cssPx(dmr.spacing.sm) }}>
                                {[
                                    ["12.4k", "Clientes"],
                                    ["38s", "Resp. Media"],
                                    ["4.8", "CSAT"],
                                ].map(([value, label]) => (
                                    <Box
                                        key={label}
                                        sx={{
                                            p: cssPx(dmr.spacing.sm),
                                            textAlign: "center",
                                            borderRadius: cssPx(dmr.radius.sm),
                                            bgcolor: dmr.superficies.interactive,
                                            border: `1px solid ${dmr.borders.subtle}`,
                                        }}
                                    >
                                        <Typography sx={dmr.typography.numeric.lg}>{value}</Typography>
                                        <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}>{label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Stack>
                    </Stack>
                </Box>

                {/* 2. TIEMPO DE RESPUESTA Y DISTRIBUCIÓN DE CANALES */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            xl: "minmax(0, 1.85fr) minmax(320px, 0.85fr)",
                        },
                        gap: cssPx(dmr.spacing.xl),
                        alignItems: "stretch",
                    }}
                >
                    <Box sx={(activeTheme) => solidPanelStyles(activeTheme)}>
                        <Box sx={{ p: { xs: cssPx(dmr.spacing.lg), md: cssPx(dmr.spacing.xl) } }}>
                            <SectionHeading
                                eyebrow="Soporte en Vivo"
                                title="Tiempo de Respuesta del Asistente"
                                description="Revisión analítica del tiempo medio de respuesta del soporte frente al SLA máximo permitido (800 ms)."
                                action={
                                    <Box sx={{ display: "flex", gap: cssPx(dmr.spacing.xs), p: cssPx(dmr.spacing.xs), borderRadius: cssPx(dmr.radius.sm), bgcolor: dmr.superficies.interactive }}>
                                        {["15m", "1h", "24h", "7d"].map((period) => (
                                            <Button key={period} size="small" variant={period === "1h" ? "contained" : "text"} sx={{ minWidth: 44 }}>
                                                {period}
                                            </Button>
                                        ))}
                                    </Box>
                                }
                            />
                            <Box sx={{ mt: cssPx(dmr.spacing.lg) }}>
                                <GraficaTiempoRespuesta />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={(activeTheme) => ({ ...solidPanelStyles(activeTheme), p: { xs: cssPx(activeTheme.dmr.spacing.lg), md: cssPx(activeTheme.dmr.spacing.xl) } })}>
                        <SectionHeading eyebrow="Canales" title="Distribución de Canales" description="Proporción de interacciones atendidas por cada canal de venta y soporte." />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: cssPx(dmr.spacing.xl), mt: cssPx(dmr.spacing.xl), alignItems: "center" }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: dmr.medidas.decorativos.dona,
                                    aspectRatio: "1",
                                    borderRadius: cssPx(dmr.radius.pill),
                                    background: `conic-gradient(
                                        ${dmr.primary.default} 0 40%,
                                        ${dmr.secondary.default} 40% 65%,
                                        ${dmr.estados.warning.default} 65% 85%,
                                        ${dmr.estados.success.default} 85% 100%
                                    )`,
                                    boxShadow: `0 0 30px ${dmr.primary.subtle}`,
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        inset: "25%",
                                        borderRadius: cssPx(dmr.radius.pill),
                                        backgroundColor: dmr.superficies.card,
                                        border: `1px solid ${dmr.borders.default}`,
                                    },
                                }}
                            >
                                <Box sx={{ position: "absolute", inset: 0, zIndex: 1, display: "grid", placeItems: "center", textAlign: "center" }}>
                                    <Box>
                                        <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}>Total</Typography>
                                        <Typography sx={dmr.typography.numeric.xl}>100%</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Stack sx={{ gap: cssPx(dmr.spacing.md), width: "100%" }}>
                                {[
                                    ["Web", "40%", dmr.primary.default],
                                    ["WhatsApp", "25%", dmr.secondary.default],
                                    ["Instagram DM", "20%", dmr.estados.warning.default],
                                    ["Soporte Humano", "15%", dmr.estados.success.default],
                                ].map(([label, value, color]) => (
                                    <Box key={label}>
                                        <Stack direction="row" sx={{ justifyContent: "space-between", mb: cssPx(dmr.spacing.xs) }}>
                                            <Typography sx={dmr.typography.sm}>{label}</Typography>
                                            <Typography sx={dmr.typography.numeric.sm}>{value}</Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={Number.parseFloat(value)} sx={{ height: dmr.medidas.barras.fina, bgcolor: dmr.superficies.interactive, "& .MuiLinearProgress-bar": { bgcolor: color } }} />
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Box>

                {/* 2b. EMBUDO DE CONVERSIÓN + DENSIDAD DE INTERACCIONES POR HORARIO */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            xl: "minmax(320px, 1fr) minmax(0, 2fr)",
                        },
                        gap: cssPx(dmr.spacing.xl),
                        alignItems: "stretch",
                    }}
                >
                    <Box sx={(activeTheme) => solidPanelStyles(activeTheme)}>
                        <Box sx={{ p: { xs: cssPx(dmr.spacing.lg), md: cssPx(dmr.spacing.xl) } }}>
                            <SectionHeading
                                eyebrow="Conversión"
                                title="Embudo de Conversión"
                                description="Recorrido del cliente desde la visita hasta la venta cerrada, con la aportación del asistente IA en cada etapa."
                            />
                            <Box sx={{ mt: cssPx(dmr.spacing.lg) }}>
                                <GraficaEmbudoConversion />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={(activeTheme) => solidPanelStyles(activeTheme)}>
                        <Box sx={{ p: { xs: cssPx(dmr.spacing.lg), md: cssPx(dmr.spacing.xl) } }}>
                            <SectionHeading
                                eyebrow="Volumen por Horario"
                                title="Densidad de Interacciones por Horario"
                                description="Mapa de calor de la demanda del asistente: picos laborales entre 10h y 18h con demanda mínima nocturna."
                            />
                            <Box sx={{ mt: cssPx(dmr.spacing.lg) }}>
                                <GraficaHeatmapHorarios />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* 3. MÉTRICAS DE OPERACIÓN COMERCIAL */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            sm: "repeat(2, minmax(0, 1fr))",
                            xl: "repeat(4, minmax(0, 1fr))",
                        },
                        gap: cssPx(dmr.spacing.lg),
                    }}
                >
                    {metricasComerciales.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </Box>

                {/* 4. RENDIMIENTO DE AGENTES E INFORME IA */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            xl: "minmax(0, 1.4fr) minmax(0, 0.6fr)",
                        },
                        gap: cssPx(dmr.spacing.xl),
                        alignItems: "stretch",
                    }}
                >
                    <Box sx={(activeTheme) => solidPanelStyles(activeTheme)}>
                        <Box sx={{ p: { xs: cssPx(dmr.spacing.lg), md: cssPx(dmr.spacing.xl) }, pb: cssPx(dmr.spacing.md) }}>
                            <SectionHeading
                                eyebrow="Equipo de Atención"
                                title="Rendimiento de Agentes"
                                description="Datos agregados del desempeño de los agentes automáticos y humanos durante el periodo seleccionado."
                                action={<Chip label="Última actualización: 14:00" size="small" variant="outlined" sx={{ borderColor: dmr.borders.default }} />}
                            />
                        </Box>

                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Agente</TableCell>
                                        <TableCell>Estado del Agente</TableCell>
                                        <TableCell>Canal / Equipo</TableCell>
                                        <TableCell align="right">CSAT</TableCell>
                                        <TableCell sx={{ minWidth: 120 }}>Uso de Capacidad</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {agentesEquipo.map(([agente, estado, canal, csat, capacidad, color]) => (
                                        <TableRow key={agente} hover>
                                            <TableCell>
                                                <Typography sx={{ ...dmr.typography.sm, fontWeight: 600 }}>{agente}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={estado} size="small" sx={{ height: dmr.medidas.microChips.chico, fontSize: dmr.typography.micro.fontSize, bgcolor: dmr.superficies.interactive, border: `1px solid ${color}`, color }} />
                                            </TableCell>
                                            <TableCell sx={dmr.typography.sm}>{canal}</TableCell>
                                            <TableCell align="right" sx={dmr.typography.numeric.sm}>{csat}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm) }}>
                                                    <LinearProgress variant="determinate" value={capacidad} sx={{ flex: 1, height: dmr.medidas.barras.media, borderRadius: cssPx(dmr.radius.pill), bgcolor: dmr.superficies.interactive, "& .MuiLinearProgress-bar": { bgcolor: color } }} />
                                                    <Typography sx={dmr.typography.numeric.xs}>{capacidad}%</Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box
                        sx={(activeTheme) => ({
                            ...glassPanelStyles(activeTheme, activeTheme.dmr.estados.ai.subtle),
                            p: { xs: cssPx(activeTheme.dmr.spacing.lg), md: cssPx(activeTheme.dmr.spacing.xl) },
                            borderColor: activeTheme.dmr.estados.ai.default,
                        })}
                    >
                        <Stack sx={{ height: "100%", gap: cssPx(dmr.spacing.lg) }}>
                            <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.md) }}>
                                <Box
                                    sx={{
                                        width: dmr.spacing["3xl"],
                                        height: dmr.spacing["3xl"],
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: cssPx(dmr.radius.pill),
                                        color: dmr.textos.primary,
                                        background: `linear-gradient(135deg, ${dmr.estados.ai.default}, ${dmr.primary.default})`,
                                    }}
                                >
                                    <Typography sx={{ ...dmr.typography.sm, fontWeight: 700 }}>A</Typography>
                                </Box>
                                <Box>
                                    <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm) }}>
                                        <Typography sx={{ ...dmr.typography.lg, fontWeight: 700 }}>Agente Comercial AI</Typography>
                                        <Chip label="COMMERCE OPS" size="small" sx={{ height: dmr.medidas.microChips.medio, color: dmr.estados.ai.foreground, bgcolor: dmr.estados.ai.subtle }} />
                                    </Stack>
                                    <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.secondary }}>Asistente de ventas y soporte multicanal</Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ p: cssPx(dmr.spacing.lg), borderRadius: cssPx(dmr.radius.md), bgcolor: dmr.superficies.interactive, border: `1px solid ${dmr.borders.default}` }}>
                                <Typography sx={{ ...dmr.typography.md, fontWeight: 600 }}>Pico de demanda en WhatsApp durante el horario laboral.</Typography>
                                <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary, mt: cssPx(dmr.spacing.sm) }}>
                                    La última ventana muestra alta intención de compra entre las 10h y las 18h. Se sugiere reforzar la cola de soporte humano hacia el cierre del día para mantener el tiempo de respuesta dentro del SLA.
                                </Typography>
                            </Box>

                            <Stack direction="row" useFlexGap sx={{ gap: cssPx(dmr.spacing.sm), flexWrap: "wrap" }}>
                                {["Revisar Cola de Soporte", "Ver Historial del Ticket", "Exportar Conversaciones"].map((label) => (
                                    <Chip key={label} label={label} variant="outlined" sx={{ color: dmr.textos.secondary, borderColor: dmr.glass.border }} />
                                ))}
                            </Stack>
                        </Stack>
                    </Box>
                </Box>

                {/* 4b. RADAR DE CAPACIDADES + TIMELINE DE TICKET */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            xl: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
                        },
                        gap: cssPx(dmr.spacing.xl),
                        alignItems: "stretch",
                    }}
                >
                    <Box
                        sx={(activeTheme) => ({
                            ...glassPanelStyles(activeTheme, activeTheme.dmr.primary.subtle),
                            p: { xs: cssPx(activeTheme.dmr.spacing.lg), md: cssPx(activeTheme.dmr.spacing.xl) },
                        })}
                    >
                        <SectionHeading
                            eyebrow="Perfil de Rendimiento"
                            title="Radar de Capacidades del Agente"
                            description="Comparación entre el asistente IA y el soporte humano promedio en las métricas de calidad del negocio."
                            action={
                                <Box
                                    sx={{
                                        width: dmr.spacing["2xl"],
                                        height: dmr.spacing["2xl"],
                                        flex: "0 0 auto",
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: cssPx(dmr.radius.pill),
                                        color: dmr.primary.default,
                                        bgcolor: dmr.primary.subtle,
                                        border: `1px solid ${dmr.primary.default}`,
                                        boxShadow: `0 0 26px ${dmr.primary.subtle}`,
                                    }}
                                >
                                    <Target size={20} weight="fill" aria-hidden="true" />
                                </Box>
                            }
                        />
                        <Box sx={{ mt: cssPx(dmr.spacing.lg) }}>
                            <GraficaRadarPerfil />
                        </Box>
                    </Box>

                    <Box sx={(activeTheme) => ({ ...solidPanelStyles(activeTheme), p: { xs: cssPx(activeTheme.dmr.spacing.lg), md: cssPx(activeTheme.dmr.spacing.xl) } })}>
                        <SectionHeading
                            eyebrow="Auditoría en Vivo"
                            title="Timeline del Ticket #R-8821"
                            description="Seguimiento de una devolución atendida por el bot y escalada a finanzas para el cierre."
                            action={
                                <Box
                                    sx={{
                                        width: dmr.spacing["2xl"],
                                        height: dmr.spacing["2xl"],
                                        flex: "0 0 auto",
                                        display: "grid",
                                        placeItems: "center",
                                        borderRadius: cssPx(dmr.radius.pill),
                                        color: dmr.textos.secondary,
                                        bgcolor: dmr.superficies.interactive,
                                        border: `1px solid ${dmr.borders.default}`,
                                    }}
                                >
                                    <Clock size={20} weight="fill" aria-hidden="true" />
                                </Box>
                            }
                        />
                        <Box sx={{ mt: cssPx(dmr.spacing.xl) }}>
                            <TimelineActividad eventos={eventosTicket} />
                        </Box>
                    </Box>
                </Box>

                {/* 5. FILTROS DE OPERACIÓN Y TIPOGRAFÍA */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "minmax(0, 1fr)", xl: "minmax(0, 1.2fr) minmax(0, 0.8fr)" },
                        gap: cssPx(dmr.spacing.xl),
                    }}
                >
                    <Box sx={(activeTheme) => ({ ...solidPanelStyles(activeTheme), p: { xs: cssPx(activeTheme.dmr.spacing.lg), md: cssPx(activeTheme.dmr.spacing.xl) } })}>
                        <SectionHeading eyebrow="Despliegue y Reportes" title="Filtros de Operación Comercial" description="Parámetros para el análisis del desempeño del asistente en ventas y soporte." />

                        <Stack sx={{ gap: cssPx(dmr.spacing.lg), mt: cssPx(dmr.spacing.xl) }}>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: cssPx(dmr.spacing.md) }}>
                                <TextField select label="Canal de Interacción" defaultValue="whatsapp" fullWidth>
                                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                                    <MenuItem value="web">Web</MenuItem>
                                    <MenuItem value="instagram">Instagram DM</MenuItem>
                                    <MenuItem value="humano">Soporte Humano</MenuItem>
                                </TextField>
                                <TextField select label="Ventana de Análisis" defaultValue="1h" fullWidth>
                                    <MenuItem value="15m">Últimos 15 minutos</MenuItem>
                                    <MenuItem value="1h">Última hora</MenuItem>
                                    <MenuItem value="24h">Últimas 24 horas</MenuItem>
                                </TextField>
                            </Box>
                            <Stack direction="row" useFlexGap sx={{ gap: cssPx(dmr.spacing.sm), flexWrap: "wrap" }}>
                                <Button variant="contained">Aplicar Filtros</Button>
                                <Button
                                    variant="outlined"
                                    sx={(activeTheme) => ({
                                        color: activeTheme.dmr.secondary.default,
                                        borderColor: activeTheme.dmr.secondary.default,
                                    })}
                                >
                                    Exportar Sesiones CSV
                                </Button>
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: cssPx(dmr.spacing.xl), borderColor: dmr.borders.subtle }} />

                        <SectionHeading eyebrow="Design System" title="Sistema de Colores y Estados" />
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: cssPx(dmr.spacing.sm), mt: cssPx(dmr.spacing.lg) }}>
                            {superficies.slice(0, 4).map(([label, background]) => (
                                <Box key={label} sx={{ p: cssPx(dmr.spacing.sm), borderRadius: cssPx(dmr.radius.sm), bgcolor: background, border: `1px solid ${dmr.borders.default}` }}>
                                    <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.secondary }}>{label}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Stack direction="row" useFlexGap sx={{ gap: cssPx(dmr.spacing.sm), flexWrap: "wrap", mt: cssPx(dmr.spacing.md) }}>
                            {estadosVisuales.map(([label, color, backgroundColor]) => (
                                <Chip key={label} label={label} sx={{ color, bgcolor: backgroundColor, border: `1px solid ${color}` }} />
                            ))}
                        </Stack>
                    </Box>

                    <Box sx={(activeTheme) => ({ ...glassPanelStyles(activeTheme, activeTheme.dmr.primary.subtle), p: { xs: cssPx(activeTheme.dmr.spacing.lg), md: cssPx(activeTheme.dmr.spacing.xl) } })}>
                        <SectionHeading eyebrow="Lectura Técnica" title="Precisión Numérica" description="Fuentes monoespaciadas para la lectura correcta de métricas comerciales (CSAT, retención, escalamientos)." />
                        <Stack sx={{ gap: cssPx(dmr.spacing.lg), mt: cssPx(dmr.spacing.xl) }}>
                            {magnitudesNumericas.map((magnitude) => (
                                <Box key={magnitude}>
                                    <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}>{magnitude} (Métricas Comerciales)</Typography>
                                    <Typography sx={dmr.typography.numeric[magnitude]}>CSAT 4.8</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Box>

                {/* FOOTER */}
                <Box component="footer" sx={{ display: "flex", justifyContent: "space-between", py: cssPx(dmr.spacing.md), borderTop: `1px solid ${dmr.borders.subtle}` }}>
                    <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}>Apex Design System · E-commerce &amp; AI Foundations</Typography>
                </Box>
            </Stack>
        </Box>
    );
}