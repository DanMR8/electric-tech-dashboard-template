/**
 * Repositorio del dominio "AI Ops & API Gateway".
 *
 * Encapsula la fuente de datos: hoy devuelve mocks, mañana puede llamar a
 * FastAPI sin tocar la UI. Cada función es async y refleja la forma del
 * contrato (./types.ts); un consumidor del template solo reemplaza esta
 * implementación por fetch real.
 *
 * Los números simulan un producto SaaS de observabilidad de LLMs con
 * arquitectura híbrida: enrutamiento semántico local + caché vectorial
 * (Qdrant) + fallback a nube (OpenAI). Buscan coherencia técnica entre
 * KPIs, balanceo, alertas, gráfica horaria y telemetría en vivo.
 */

import type {
    ActiveModelRow,
    MetricSummary,
    SerieEnrutamientoPorModelo,
    SystemAlert,
    TelemetriaGateway,
    TraceLog,
} from "./types";

const metricasResumen: MetricSummary[] = [
    {
        etiqueta: "Latencia p95 (TTFT)",
        valor: "122 ms",
        variacion: -8.7,
        variacionEsPositiva: false,
        sparkline: [186, 174, 169, 158, 149, 152, 141, 135, 128, 133, 126, 122],
    },
    {
        etiqueta: "Ahorro Estimado (Cómputo Local)",
        valor: "$7.4k",
        variacion: 14.8,
        variacionEsPositiva: true,
        sparkline: [28, 31, 34, 33, 38, 41, 44, 47, 51, 55, 58, 62],
    },
    {
        etiqueta: "Aciertos de Caché Semántica",
        valor: "84.6%",
        variacion: 6.3,
        variacionEsPositiva: true,
        sparkline: [70, 73, 72, 76, 79, 78, 81, 83, 82, 84, 85, 85],
    },
    {
        etiqueta: "Fallback Automático a Nube",
        valor: "6.8%",
        variacion: -12.4,
        variacionEsPositiva: false,
        sparkline: [22, 20, 18, 17, 15, 14, 12, 11, 10, 9, 7.8, 6.8],
    },
];

const modelosActivos: ActiveModelRow[] = [
    {
        id: "llama3-local",
        nombre: "Llama-3 (Local)",
        backend: "GPU CUDA · L4",
        tiempoRespuestaMs: 205,
        traficoAsignado: 38,
        estado: "operativo",
    },
    {
        id: "qwen-coder-local",
        nombre: "Qwen-2.5-Coder (Local)",
        backend: "CPU Cluster · 12 cores",
        tiempoRespuestaMs: 340,
        traficoAsignado: 22,
        estado: "operativo",
    },
    {
        id: "qdrant-cache",
        nombre: "Qdrant Caché Semántico",
        backend: "Vector DB · Docker",
        tiempoRespuestaMs: 14,
        traficoAsignado: 52,
        estado: "operativo",
    },
    {
        id: "gpt4o-mini",
        nombre: "GPT-4o mini (Fallback)",
        backend: "OpenAI · API",
        tiempoRespuestaMs: 610,
        traficoAsignado: 10,
        estado: "degradado",
    },
    {
        id: "gpt4o",
        nombre: "GPT-4o (Fallback)",
        backend: "OpenAI · API",
        tiempoRespuestaMs: 740,
        traficoAsignado: 4,
        estado: "degradado",
    },
    {
        id: "mistral7b",
        nombre: "Mistral-7B (Standby)",
        backend: "GPU CUDA · Reservado",
        tiempoRespuestaMs: 0,
        traficoAsignado: 0,
        estado: "offline",
    },
];

const alertasSistema: SystemAlert[] = [
    {
        id: "a1",
        nivel: "info",
        categoria: "modelo",
        titulo: "Prompt truncado por contexto",
        detalle:
            "Llama-3 recortó 1.4k tokens del prompt al alcanzar la ventana 4k; se aplicó el resumen temprano de sistema para preservar la respuesta.",
        timestamp: "hace 2 min",
    },
    {
        id: "a2",
        nivel: "warning",
        categoria: "enrutamiento",
        titulo: "Cuota OpenAI al 82% (RPM)",
        detalle:
            "El ingest de la tarde consumió el 82% de la cuota del proyecto; el balanceador desviará fallbacks a Anthropic si se agota.",
        timestamp: "hace 8 min",
    },
    {
        id: "a3",
        nivel: "info",
        categoria: "enrutamiento",
        titulo: "Bypass de caché semántica",
        detalle:
            "Qdrant reatendió la consulta con acierto (SIM 0.91): ahorró una llamada completa al LLM en 38 ms.",
        timestamp: "hace 17 min",
    },
    {
        id: "a4",
        nivel: "error",
        categoria: "modelo",
        titulo: "Mistral-7B retirado del balanceador",
        detalle:
            "Doble reinicio del worker por OOM de CUDA; el runtime quedó en standby hasta aprobación del equipo.",
        timestamp: "hace 31 min",
    },
    {
        id: "a5",
        nivel: "error",
        categoria: "seguridad",
        titulo: "Pico de HTTP 429 en una clave",
        detalle:
            "3.2k respuestas 429 en 5 min desde 'prod_frontend'; se aplicó throttling del cliente y se notificó al propietario.",
        timestamp: "hace 52 min",
    },
    {
        id: "a6",
        nivel: "info",
        categoria: "enrutamiento",
        titulo: "Caché semántica al 84%",
        detalle:
            "El 84% de las peticiones reutilizó contexto cacheado; el costo efectivo por token bajó 6.3%.",
        timestamp: "hace 1 h",
    },
];

const serieEnrutamientoPorModelo: SerieEnrutamientoPorModelo = {
    horas: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
    modelos: [
        {
            modelo: "Llama-3 (Local)",
            valores: [340, 360, 300, 240, 320, 420, 520, 600, 640, 560, 450, 380],
        },
        {
            modelo: "Qwen-2.5-Coder (Local)",
            valores: [180, 190, 160, 130, 180, 230, 270, 290, 300, 260, 220, 190],
        },
        {
            modelo: "GPT-4o mini (Fallback)",
            valores: [120, 110, 120, 140, 150, 170, 190, 200, 220, 230, 260, 250],
        },
        {
            modelo: "GPT-4o (Fallback)",
            valores: [60, 60, 70, 80, 90, 100, 110, 120, 130, 170, 210, 190],
        },
    ],
};

const telemetriaGateway: TelemetriaGateway = {
    cuotaRpm: {
        nombre: "OpenAI RPM",
        detalle: "OpenAI (Fallback)",
        porcentaje: 82,
        valorFormateado: "410 / 500 req/min",
        nota: "Queda 18% de margen; el enrutador desviará fallbacks a Anthropic si se agota.",
    },
    cachePrompts: {
        nombre: "Caché Semántica",
        detalle: "Qdrant · SIM ≥ 0.92",
        porcentaje: 84,
        valorFormateado: "8.4k / 10k peticiones",
        nota: "Los prompts con score ≥ 0.92 no tocan al LLM.",
    },
};

export function obtenerMetricasResumen(): Promise<MetricSummary[]> {
    return Promise.resolve(metricasResumen);
}

export function obtenerModelosActivos(): Promise<ActiveModelRow[]> {
    return Promise.resolve(modelosActivos);
}

export function obtenerAlertasSistema(): Promise<SystemAlert[]> {
    return Promise.resolve(alertasSistema);
}

export function obtenerSerieEnrutamientoPorModelo(): Promise<SerieEnrutamientoPorModelo> {
    return Promise.resolve(serieEnrutamientoPorModelo);
}

export function obtenerTelemetriaGateway(): Promise<TelemetriaGateway> {
    return Promise.resolve(telemetriaGateway);
}

const trazasHistorial: TraceLog[] = [
    {
        id: "tr-0042",
        timestamp: "14:37:02",
        modelo: "Llama-3 (Local)",
        backend: "GPU CUDA · L4",
        statusHttp: 200,
        latenciaMs: 205,
        totalTokens: 486,
        payload: {
            systemPrompt:
                "Eres el copiloto de mitigación de un gateway de LLMs: resume la alerta activa en hasta tres viñetas y sugiere el siguiente paso operativo.",
            userPrompt:
                "Resume la alerta 'Cuota OpenAI al 82%' y sugiere el siguiente paso operativo.",
            completionText:
                "• Cuota del proyecto al 82% por el ingest de la tarde.\n• Margen restante de 18% (≈90 req/min).\n• Siguiente paso: habilitar Anthropic como destino de fallback.",
            temperature: 0.4,
            promptTokens: 286,
            completionTokens: 200,
            costo: "$0.012",
        },
    },
    {
        id: "tr-0043",
        timestamp: "14:36:18",
        modelo: "GPT-4o mini (Fallback)",
        backend: "OpenAI · API",
        statusHttp: 429,
        latenciaMs: 1240,
        totalTokens: 212,
        payload: {
            systemPrompt:
                "Sirves como API de resúmenes de tickets de soporte del producto.",
            userPrompt: "Genera el resumen del incidente INC-2217.",
            completionText:
                "[429] Límite de RPM del proyecto por la clave 'prod_frontend'. Reintento con backoff exponencial en 4 s.",
            temperature: 0.7,
            promptTokens: 180,
            completionTokens: 32,
            costo: "$0.004",
        },
    },
    {
        id: "tr-0044",
        timestamp: "14:35:47",
        modelo: "Qwen-2.5-Coder (Local)",
        backend: "CPU Cluster · 12 cores",
        statusHttp: 200,
        latenciaMs: 340,
        totalTokens: 1052,
        payload: {
            systemPrompt:
                "Eres un codificador experto en TypeScript, ECharts y Material UI.",
            userPrompt:
                "Refactoriza el tooltip de la gráfica principal para que use los tokens de tipografía de dmr.",
            completionText:
                "tooltip: {\n  trigger: 'axis',\n  valueFormatter: (v) => `${v} peticiones/h`,\n  textStyle: dmr.typography.xs,\n}",
            temperature: 0.2,
            promptTokens: 820,
            completionTokens: 232,
            costo: "$0.006",
        },
    },
    {
        id: "tr-0045",
        timestamp: "14:34:55",
        modelo: "GPT-4o (Fallback)",
        backend: "OpenAI · API",
        statusHttp: 500,
        latenciaMs: 12,
        totalTokens: 415,
        payload: {
            systemPrompt:
                "Punto de control de calidad automático de respuestas de LLM.",
            userPrompt:
                "Evalúa la última completion de Llama-3 en el canal de producción.",
            completionText:
                "[500] El proveedor cerró el stream durante el backend request; la muestra quedó pendiente de reproceso.",
            temperature: 0.0,
            promptTokens: 415,
            completionTokens: 0,
            costo: "$0.006",
        },
    },
    {
        id: "tr-0046",
        timestamp: "14:33:31",
        modelo: "Qdrant Caché Semántico",
        backend: "Vector DB · Docker",
        statusHttp: 200,
        latenciaMs: 24,
        totalTokens: 318,
        payload: {
            systemPrompt:
                "Pipeline de embeddings del catálogo de documentos del gateway.",
            userPrompt:
                "Embebe el fragmento 'política de retención de trazas'.",
            completionText:
                "Embedding 384-dim generado (hash e7f2a9…) y guardado en la colección 'docs' de Qdrant.",
            temperature: 0.0,
            promptTokens: 298,
            completionTokens: 20,
            costo: "$0.002",
        },
    },
    {
        id: "tr-0047",
        timestamp: "14:32:14",
        modelo: "Mistral-7B (Standby)",
        backend: "GPU CUDA · Reservado",
        statusHttp: 200,
        latenciaMs: 340,
        totalTokens: 584,
        payload: {
            systemPrompt:
                "Clasificador de logs del producto de observabilidad de LLMs.",
            userPrompt:
                "Clasifica la entrada 'rate limit alto detectado en prod_frontend' y marca la prioridad.",
            completionText:
                "Prioridad alta · origen: pasarela · acción recomendada: rotar el límite del proyecto o avisar al propietario.",
            temperature: 0.3,
            promptTokens: 402,
            completionTokens: 182,
            costo: "$0.006",
        },
    },
];

export function obtenerTrazas(): Promise<TraceLog[]> {
    return Promise.resolve(trazasHistorial);
}