import {
    ArrowsClockwiseIcon,
    GaugeIcon,
    ProhibitIcon,
    TimerIcon,
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
    // Tooltip,
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

function GraficaLatenciaInferencia() {
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
                    name: "Latencia p95 Histórica",
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
            aria-label="Monitoreo de latencia de generación (TTFT) frente al SLA máximo permitido"
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

// 3. VISTA PRINCIPAL: DASHBOARD DE OPERACIONES IA
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

    // Métricas de operación del gateway de inferencia
    const metricasSistema = [
        {
            label: "Cache Hit Rate",
            value: "84.2%",
            meta: "Promedio de aciertos de la última hora",
            glyph: <GaugeIcon size={20} weight="fill" />,
            accent: dmr.primary.default,
            softAccent: dmr.primary.subtle,
            valueColor: dmr.textos.primary,
            points: [78, 79, 81, 80, 83, 85, 84, 82, 84, 85, 84, 84],
        },
        {
            label: "Peticiones Procesadas",
            value: "4,250",
            meta: "Peticiones atendidas por el gateway (24h)",
            glyph: <ArrowsClockwiseIcon size={20} weight="fill" />,
            accent: dmr.estados.success.default,
            softAccent: dmr.estados.success.subtle,
            valueColor: dmr.estados.success.foreground,
            points: [30, 45, 42, 60, 55, 70, 68, 80, 75, 85, 82, 90],
        },
        {
            label: "Latencia Media (p50)",
            value: "240 ms",
            meta: "Percentil 50 del tiempo a primer token",
            glyph: <TimerIcon size={20} weight="fill" />,
            accent: dmr.estados.warning.default,
            softAccent: dmr.estados.warning.subtle,
            valueColor: dmr.estados.warning.foreground,
            points: [182, 190, 186, 212, 240, 226, 205, 196, 210, 204, 192, 188],
        },
        {
            label: "Tasa de Rate Limits (HTTP 429)",
            value: "0.85%",
            meta: "Umbral objetivo: <1.0% de peticiones rechazadas",
            glyph: <ProhibitIcon size={20} weight="fill" />,
            accent: dmr.estados.error.default,
            softAccent: dmr.estados.error.subtle,
            valueColor: dmr.estados.error.foreground,
            points: [1.2, 1.1, 1.3, 0.9, 0.8, 1.0, 1.4, 0.9, 0.8, 0.8, 0.8, 0.8],
        },
    ] as const;

    const nodosCluster = [
        ["GPU Node 01 (Llama-3)", "Activo", "GPU Local (CUDA)", "14 GB", "98", dmr.estados.success.foreground],
        ["GPU Node 02 (Mistral-7B)", "Mantenimiento", "GPU Local (CUDA)", "---", "64", dmr.estados.info.foreground],
        ["CPU Cluster (Embeddings)", "Activo", "CPU Cluster", "---", "85", dmr.estados.success.foreground],
        ["Qdrant Vector DB", "Revisión", "Vector DB (Docker)", "8 GB", "72", dmr.estados.warning.foreground],
        ["OpenAI (Fallback)", "Fuera Línea", "API Remota", "---", "0", dmr.estados.error.foreground],
    ] as const;

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
                                    label="APEX DESIGN SYSTEM"
                                    size="small"
                                    sx={{
                                        color: dmr.primary.default,
                                        bgcolor: dmr.primary.subtle,
                                        border: `1px solid ${dmr.primary.default}`,
                                    }}
                                />
                                <Chip label="AI OPS FOUNDATIONS" size="small" variant="outlined" sx={{ borderColor: dmr.borders.default }} />
                                <Chip label="LLM TELEMETRY" size="small" variant="outlined" sx={{ borderColor: dmr.borders.default }} />
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
                                Base visual para el monitoreo de clústeres de inferencia y telemetría de LLMs.
                            </Typography>
                            <Typography
                                sx={{
                                    ...dmr.typography.md,
                                    color: dmr.textos.secondary,
                                    maxWidth: 700,
                                    mt: cssPx(dmr.spacing.md),
                                }}
                            >
                                Panel de observación para operaciones de IA. Analiza la latencia de inferencia, el enrutamiento del tráfico y la salud de los nodos de cómputo de forma segura y centralizada.
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
                                    ["12", "Nodos"],
                                    ["800ms", "SLA p95"],
                                    ["24h", "Ventana"],
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

                {/* 2. GRÁFICA DE LATENCIA Y DISTRIBUCIÓN DE TRÁFICO */}
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
                                eyebrow="Latencia de Inferencia"
                                title="Latencia de Generación (TTFT)"
                                description="Revisión analítica de la latencia recolectada respecto al SLA máximo permitido del gateway."
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
                                <GraficaLatenciaInferencia />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={(activeTheme) => ({ ...solidPanelStyles(activeTheme), p: { xs: cssPx(activeTheme.dmr.spacing.lg), md: cssPx(activeTheme.dmr.spacing.xl) } })}>
                        <SectionHeading eyebrow="Enrutamiento" title="Distribución de Tráfico de Inferencia" description="Proporción del tráfico enrutado por tipo de cómputo." />
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
                                    ["Modelos Locales (GPU)", "40%", dmr.primary.default],
                                    ["Modelos CPU", "25%", dmr.secondary.default],
                                    ["RAG / Embeddings", "20%", dmr.estados.warning.default],
                                    ["OpenAI (Fallback)", "15%", dmr.estados.success.default],
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

                {/* 3. MÉTRICAS DE OPERACIÓN */}
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
                    {metricasSistema.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </Box>

                {/* 4. TABLA DE NODOS E INFORME IA */}
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
                                eyebrow="Registro de Infraestructura"
                                title="Resumen de Nodos del Clúster"
                                description="Datos agregados de los nodos del clúster durante el periodo seleccionado."
                                action={<Chip label="Última actualización: 14:00" size="small" variant="outlined" sx={{ borderColor: dmr.borders.default }} />}
                            />
                        </Box>

                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nodo de Inferencia</TableCell>
                                        <TableCell>Estado del Nodo</TableCell>
                                        <TableCell align="right">Backend / Entorno</TableCell>
                                        <TableCell align="right">VRAM Usada</TableCell>
                                        <TableCell sx={{ minWidth: 120 }}>Uso de Capacidad</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {nodosCluster.map(([nodo, estado, backend, vram, capacidad, color]) => (
                                        <TableRow key={nodo} hover>
                                            <TableCell>
                                                <Typography sx={{ ...dmr.typography.sm, fontWeight: 600 }}>{nodo}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={estado} size="small" sx={{ height: dmr.medidas.microChips.chico, fontSize: dmr.typography.micro.fontSize, bgcolor: dmr.superficies.interactive, border: `1px solid ${color}`, color }} />
                                            </TableCell>
                                            <TableCell align="right" sx={dmr.typography.numeric.sm}>{backend}</TableCell>
                                            <TableCell align="right" sx={dmr.typography.numeric.sm}>{vram}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" sx={{ alignItems: "center", gap: cssPx(dmr.spacing.sm) }}>
                                                    <LinearProgress variant="determinate" value={Number.parseFloat(capacidad)} sx={{ flex: 1, height: dmr.medidas.barras.media, borderRadius: cssPx(dmr.radius.pill), bgcolor: dmr.superficies.interactive, "& .MuiLinearProgress-bar": { bgcolor: color } }} />
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
                                        <Typography sx={{ ...dmr.typography.lg, fontWeight: 700 }}>Agente de Operaciones</Typography>
                                        <Chip label="OBSERVABILITY" size="small" sx={{ height: dmr.medidas.microChips.medio, color: dmr.estados.ai.foreground, bgcolor: dmr.estados.ai.subtle }} />
                                    </Stack>
                                    <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.secondary }}>Asistente de operaciones de inferencia</Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ p: cssPx(dmr.spacing.lg), borderRadius: cssPx(dmr.radius.md), bgcolor: dmr.superficies.interactive, border: `1px solid ${dmr.borders.default}` }}>
                                <Typography sx={{ ...dmr.typography.md, fontWeight: 600 }}>Saturación detectada en la memoria KV Cache del Nodo GPU 02.</Typography>
                                <Typography sx={{ ...dmr.typography.sm, color: dmr.textos.secondary, mt: cssPx(dmr.spacing.sm) }}>
                                    Los datos de la última ventana muestran presión creciente en el contexto KV del nodo. Se sugiere incrementar el umbral de fallback a la nube en el próximo pico de tráfico para proteger la latencia p95 del clúster.
                                </Typography>
                            </Box>

                            <Stack direction="row" useFlexGap sx={{ gap: cssPx(dmr.spacing.sm), flexWrap: "wrap" }}>
                                {["Ajustar Umbral de Fallback", "Ver Historial del Nodo", "Exportar Trazas"].map((label) => (
                                    <Chip key={label} label={label} variant="outlined" sx={{ color: dmr.textos.secondary, borderColor: dmr.glass.border }} />
                                ))}
                            </Stack>
                        </Stack>
                    </Box>
                </Box>

                {/* 5. FILTROS DE DESPLIEGUE Y TIPOGRAFÍA */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "minmax(0, 1fr)", xl: "minmax(0, 1.2fr) minmax(0, 0.8fr)" },
                        gap: cssPx(dmr.spacing.xl),
                    }}
                >
                    <Box sx={(activeTheme) => ({ ...solidPanelStyles(activeTheme), p: { xs: cssPx(activeTheme.dmr.spacing.lg), md: cssPx(activeTheme.dmr.spacing.xl) } })}>
                        <SectionHeading eyebrow="Despliegue y Reportes" title="Filtros de Entorno" description="Parámetros para la extracción de trazas históricas y observabilidad de la inferencia." />

                        <Stack sx={{ gap: cssPx(dmr.spacing.lg), mt: cssPx(dmr.spacing.xl) }}>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: cssPx(dmr.spacing.md) }}>
                                <TextField select label="Filtrar por Entorno de Despliegue" defaultValue="produccion" fullWidth>
                                    <MenuItem value="produccion">Producción</MenuItem>
                                    <MenuItem value="staging">Staging</MenuItem>
                                    <MenuItem value="edge">Local Edge</MenuItem>
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
                                    Exportar Trazas CSV
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
                        <SectionHeading eyebrow="Lectura Técnica" title="Precisión Numérica" description="Fuentes monoespaciadas para la lectura correcta de métricas de latencia y rendimiento (p95, t/s)." />
                        <Stack sx={{ gap: cssPx(dmr.spacing.lg), mt: cssPx(dmr.spacing.xl) }}>
                            {magnitudesNumericas.map((magnitude) => (
                                <Box key={magnitude}>
                                    <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}>{magnitude} (Telemetría)</Typography>
                                    <Typography sx={dmr.typography.numeric[magnitude]}>p95 385ms</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Box>

                {/* FOOTER */}
                <Box component="footer" sx={{ display: "flex", justifyContent: "space-between", py: cssPx(dmr.spacing.md), borderTop: `1px solid ${dmr.borders.subtle}` }}>
                    <Typography sx={{ ...dmr.typography.xs, color: dmr.textos.tertiary }}>Apex Design System · AI Ops Foundations</Typography>
                </Box>
            </Stack>
        </Box>
    );
}