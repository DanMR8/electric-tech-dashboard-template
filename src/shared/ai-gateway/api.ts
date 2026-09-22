/**
 * Repositorio del dominio "E-commerce & Asistente IA".
 *
 * Encapsula la fuente de datos: hoy devuelve mocks, mañana puede llamar a
 * FastAPI sin tocar la UI. Cada función es async y refleja la forma del
 * contrato (./types.ts); un consumidor del template solo reemplaza esta
 * implementación por fetch real.
 *
 * Los números simulan una tienda en línea con asistente IA: canales de
 * interacción (Web, WhatsApp, Instagram, voz), impacto del bot en ventas
 * y soporte, y alertas de negocio. Busca coherencia entre KPIs, la tabla
 * de canales, alertas, la gráfica horaria y la conversación en vivo. Las trazas
 * son conversaciones reales de clientes con el asistente.
 */

import type {
    CanalInteraccionRow,
    MetricSummary,
    RendimientoConversacion,
    SerieInteraccionesPorCanal,
    SystemAlert,
    TraceLog,
} from "./types";

const metricasResumen: MetricSummary[] = [
    {
        etiqueta: "Clientes Alcanzados (24h)",
        valor: "12.4k",
        variacion: 18.6,
        variacionEsPositiva: true,
        sparkline: [6.2, 6.8, 7.1, 7.9, 8.4, 9.0, 9.6, 10.1, 10.8, 11.3, 11.9, 12.4],
    },
    {
        etiqueta: "Ventas Asistidas por IA",
        valor: "$18.9k",
        variacion: 21.3,
        variacionEsPositiva: true,
        sparkline: [8.9, 9.6, 10.2, 11.0, 12.1, 12.9, 13.8, 14.7, 15.9, 16.8, 17.8, 18.9],
    },
    {
        etiqueta: "Tasa de Finalización de Conversación",
        valor: "76.4%",
        variacion: 8.9,
        variacionEsPositiva: true,
        sparkline: [62, 64, 66, 65, 68, 70, 71, 73, 74, 75, 76, 76.4],
    },
    {
        etiqueta: "Satisfacción del Cliente (CSAT)",
        valor: "4.6 / 5",
        variacion: 3.1,
        variacionEsPositiva: true,
        sparkline: [4.0, 4.1, 4.2, 4.1, 4.3, 4.3, 4.4, 4.5, 4.4, 4.5, 4.6, 4.6],
    },
];

const canalesInteraccion: CanalInteraccionRow[] = [
    {
        id: "chatbot-web",
        nombre: "Chatbot Ventas (Web)",
        canal: "Web",
        tipoAsistencia: "Bot IA",
        asistente: "Bot IA · GPT-4o mini",
        tiempoRespuestaMs: 850,
        traficoAsignado: 44,
        interacciones: 4210,
        tasaResolucion: 88.2,
        estado: "operativo",
    },
    {
        id: "bot-whatsapp",
        nombre: "Asistente Devoluciones (WhatsApp)",
        canal: "WhatsApp",
        tipoAsistencia: "Bot IA",
        asistente: "Bot IA · Twilio",
        tiempoRespuestaMs: 1200,
        traficoAsignado: 23,
        interacciones: 2180,
        tasaResolucion: 82.5,
        estado: "operativo",
    },
    {
        id: "soporte-humano",
        nombre: "Soporte Humano (Fallback)",
        canal: "Chat · Teléfono",
        tipoAsistencia: "Humano",
        asistente: "Agentes CX · Helpdesk",
        tiempoRespuestaMs: 4800,
        traficoAsignado: 12,
        interacciones: 1160,
        tasaResolucion: 71.0,
        estado: "degradado",
    },
    {
        id: "instagram-bot",
        nombre: "Bot Instagram DM",
        canal: "Instagram DM",
        tipoAsistencia: "Bot IA",
        asistente: "Bot IA · Meta API",
        tiempoRespuestaMs: 1400,
        traficoAsignado: 9,
        interacciones: 890,
        tasaResolucion: 79.4,
        estado: "operativo",
    },
    {
        id: "email-bot",
        nombre: "Asistente de Facturación (Email)",
        canal: "Email",
        tipoAsistencia: "Bot IA",
        asistente: "Bot IA · Facturación",
        tiempoRespuestaMs: 1900,
        traficoAsignado: 8,
        interacciones: 745,
        tasaResolucion: 74.8,
        estado: "degradado",
    },
    {
        id: "voice-ia",
        nombre: "IVR Inteligente (Voz)",
        canal: "Teléfono",
        tipoAsistencia: "Bot IA + Humano",
        asistente: "IVR · ASR/TTS + derivación",
        tiempoRespuestaMs: 2600,
        traficoAsignado: 4,
        interacciones: 410,
        tasaResolucion: 68.9,
        estado: "operativo",
    },
];

const alertasSistema: SystemAlert[] = [
    {
        id: "a1",
        nivel: "info",
        categoria: "ventas",
        titulo: "Pico de consultas por la campaña Black Friday",
        detalle:
            "Las consultas sobre envíos crecieron 3.2x en la última hora; el bot absorbió el 78% sin escalar a humano.",
        timestamp: "hace 2 min",
    },
    {
        id: "a2",
        nivel: "warning",
        categoria: "soporte",
        titulo: "WhatsApp escaló 15 casos a soporte humano",
        detalle:
            "El Asistente de Devoluciones derivó 15 conversaciones por dudas de facturación en la última hora.",
        timestamp: "hace 8 min",
    },
    {
        id: "a3",
        nivel: "info",
        categoria: "ventas",
        titulo: "El bot cerró 42 ventas directas hoy",
        detalle:
            "Checkout asistido: 42 pedidos completados sin intervención humana; ticket promedio de $64.",
        timestamp: "hace 17 min",
    },
    {
        id: "a4",
        nivel: "error",
        categoria: "soporte",
        titulo: "Baja tasa de resolución en facturación",
        detalle:
            "El Asistente de Facturación resolvió el 74.8% (-6 pts vs. semana pasada); se activó la revisión del flujo.",
        timestamp: "hace 31 min",
    },
    {
        id: "a5",
        nivel: "warning",
        categoria: "campana",
        titulo: "Enganche de la campaña por debajo del objetivo",
        detalle:
            "El CTR del banner de la campaña cayó 18%; el bot redirige las consultas al catálogo en oferta.",
        timestamp: "hace 52 min",
    },
    {
        id: "a6",
        nivel: "info",
        categoria: "enrutamiento",
        titulo: "Derivación eficiente hacia humanos",
        detalle:
            "Solo el 12% de las interacciones requirió un agente; el resto se resolvió en el primer contacto.",
        timestamp: "hace 1 h",
    },
];

const serieInteracciones: SerieInteraccionesPorCanal = {
    horas: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
    canales: [
        {
            canal: "Chatbot Web",
            valores: [310, 280, 250, 240, 300, 420, 560, 680, 720, 640, 520, 410],
        },
        {
            canal: "WhatsApp Bot",
            valores: [170, 160, 140, 130, 180, 240, 300, 340, 360, 320, 280, 220],
        },
        {
            canal: "Instagram DM",
            valores: [90, 80, 70, 80, 110, 150, 190, 210, 220, 200, 160, 120],
        },
        {
            canal: "Soporte Humano",
            valores: [60, 50, 45, 50, 80, 110, 130, 140, 150, 130, 110, 90],
        },
    ],
};

const rendimientoConversacion: RendimientoConversacion = {
    inicioConversacion: {
        nombre: "Inicio de Conversación",
        detalle: "Bot · Web y WhatsApp",
        porcentaje: 78,
        valorFormateado: "498 / 640 visitas inician chat",
        nota: "Solo el 6% abandona antes del primer mensaje.",
    },
    checkoutAsistido: {
        nombre: "Compra Asistida (Checkout)",
        detalle: "Tasa sobre conversaciones",
        porcentaje: 62,
        valorFormateado: "62% llegan al checkout",
        nota: "38% restante: soporte o salida sin compra.",
    },
};

export function obtenerMetricasResumen(): Promise<MetricSummary[]> {
    return Promise.resolve(metricasResumen);
}

export function obtenerCanalesInteraccion(): Promise<CanalInteraccionRow[]> {
    return Promise.resolve(canalesInteraccion);
}

export function obtenerAlertasSistema(): Promise<SystemAlert[]> {
    return Promise.resolve(alertasSistema);
}

export function obtenerSerieInteracciones(): Promise<SerieInteraccionesPorCanal> {
    return Promise.resolve(serieInteracciones);
}

export function obtenerRendimientoConversacion(): Promise<RendimientoConversacion> {
    return Promise.resolve(rendimientoConversacion);
}

const conversacionesHistorial: TraceLog[] = [
    {
        id: "tr-0042",
        timestamp: "14:37:02",
        canal: "Chatbot Ventas (Web)",
        asistente: "Bot IA · GPT-4o mini",
        statusHttp: 200,
        latenciaMs: 850,
        totalTokens: 486,
        payload: {
            contextoAsistente:
                "Eres el asistente de ventas de la tienda: responde sobre envíos, promociones y disponibilidad con tono cercano.",
            mensajeCliente:
                "¿El pedido #88431 llega antes del viernes? Necesito el regalo para fin de semana.",
            respuestaAsistente:
                "¡Sí! Con envío exprés 24h llega el jueves antes de las 14:00. ¿Te preparo el checkout con el descuento del 10%?",
            temperature: 0.6,
            tokensEntrada: 286,
            tokensSalida: 200,
            costo: "$0.012",
        },
    },
    {
        id: "tr-0043",
        timestamp: "14:36:18",
        canal: "Asistente Devoluciones (WhatsApp)",
        asistente: "Bot IA · Twilio",
        statusHttp: 429,
        latenciaMs: 1240,
        totalTokens: 212,
        payload: {
            contextoAsistente:
                "Gestionas solicitudes de devolución vía WhatsApp con empatía y pasos claros.",
            mensajeCliente: "La zapatilla me quedó chica, ¿cómo la devuelvo?",
            respuestaAsistente:
                "[429] Límite de mensajes del proveedor alcanzado. Reintento con backoff en 4 s; la conversación quedó en cola.",
            temperature: 0.6,
            tokensEntrada: 180,
            tokensSalida: 32,
            costo: "$0.004",
        },
    },
    {
        id: "tr-0044",
        timestamp: "14:35:47",
        canal: "Chatbot Ventas (Web)",
        asistente: "Bot IA · GPT-4o mini",
        statusHttp: 200,
        latenciaMs: 340,
        totalTokens: 1052,
        payload: {
            contextoAsistente:
                "Recomiendas productos del catálogo comparando precio, stock y valoraciones.",
            mensajeCliente: "¿Qué notebook me conviene por $900: el Acer o el Lenovo?",
            respuestaAsistente:
                "El Lenovo tiene mejor batería (+40%) y el Acer mejor pantalla. Por $879 te sumo garantía extendida: ¿lo agrego al carrito?",
            temperature: 0.3,
            tokensEntrada: 820,
            tokensSalida: 232,
            costo: "$0.006",
        },
    },
    {
        id: "tr-0045",
        timestamp: "14:34:55",
        canal: "Asistente de Facturación (Email)",
        asistente: "Bot IA · Facturación",
        statusHttp: 500,
        latenciaMs: 12,
        totalTokens: 415,
        payload: {
            contextoAsistente:
                "Resuelves consultas de facturación y emites comprobantes cuando el cliente lo pide.",
            mensajeCliente: "Necesito la factura A del pedido 87912.",
            respuestaAsistente:
                "[500] El proveedor de facturación falló al generar el comprobante; el caso se escaló a un agente humano.",
            temperature: 0.0,
            tokensEntrada: 415,
            tokensSalida: 0,
            costo: "$0.008",
        },
    },
    {
        id: "tr-0046",
        timestamp: "14:33:31",
        canal: "Bot Instagram DM",
        asistente: "Bot IA · Meta API",
        statusHttp: 200,
        latenciaMs: 24,
        totalTokens: 318,
        payload: {
            contextoAsistente:
                "Atiendes consultas rápidas de catálogo y horarios por mensaje directo.",
            mensajeCliente: "¿Tienen envío gratis este mes?",
            respuestaAsistente:
                "Sí, envío gratis en compras desde $39. Te dejo el enlace del catálogo con las ofertas de la semana.",
            temperature: 0.4,
            tokensEntrada: 298,
            tokensSalida: 20,
            costo: "$0.002",
        },
    },
    {
        id: "tr-0047",
        timestamp: "14:32:14",
        canal: "IVR Inteligente (Voz)",
        asistente: "IVR · ASR/TTS + derivación",
        statusHttp: 200,
        latenciaMs: 340,
        totalTokens: 584,
        payload: {
            contextoAsistente:
                "Clasificas intenciones de llamadas de atención al cliente para encaminar al área correcta.",
            mensajeCliente: "Necesito reactivar mi cuenta; me aparece suspendida.",
            respuestaAsistente:
                "Intención: recuperación de cuenta · área: soporte técnico · prioridad alta · sugerencia: verificación SMS antes de transferir.",
            temperature: 0.3,
            tokensEntrada: 402,
            tokensSalida: 182,
            costo: "$0.006",
        },
    },
];

export function obtenerTrazas(): Promise<TraceLog[]> {
    return Promise.resolve(conversacionesHistorial);
}