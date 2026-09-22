/**
 * Contrato de datos del dominio "E-commerce & Asistente IA".
 *
 * Son interfaces puras, sin dependencias de UI ni de theme:
 * los componentes las consumen y deciden cómo pintar cada campo
 * con los tokens de diseño (theme.dmr).
 *
 * Modelan el monitor de experiencia del cliente de una tienda en
 * línea: canales de interacción (Web, WhatsApp, Instagram, voz),
 * impacto del bot en ventas y soporte, y embudo de conversación
 * (quién inicia el chat vs quién llega a comprar). Está pensado
 * para un perfil de negocio / Customer Success.
 *
 * El directorio conserva el nombre legacy "ai-gateway": la
 * semántica de los tipos ya es de negocio y única (sin aliases
 * de compatibilidad).
 */

/** Estado operativo de un canal de interacción. */
export type EstadoServicio = "operativo" | "degradado" | "offline";

/** Tarjeta de KPI: valor principal, variación y sparkline de tendencia. */
export interface MetricSummary {
    etiqueta: string;
    valor: string;
    /** Variación porcentual frente al periodo anterior (p. ej. 12.4 → +12.4%). */
    variacion: number;
    /** true si un aumento es una mejora (define el color del delta). */
    variacionEsPositiva: boolean;
    /** Serie de puntos del sparkline de tendencia. */
    sparkline: ReadonlyArray<number>;
}

/**
 * Fila de la tabla principal: un canal por donde los clientes
 * interactúan con la tienda o con el asistente IA.
 */
export interface CanalInteraccionRow {
    id: string;
    /** Nombre comercial del canal (título de la fila en la UI). */
    nombre: string;
    /** Canal de contacto (p. ej. "Web", "WhatsApp", "Instagram DM", "Teléfono"). */
    canal: string;
    /** Tipo de asistencia (p. ej. "Bot IA", "Humano", "Bot IA + Humano"). */
    tipoAsistencia: string;
    /** Asistente o equipo que atiende el canal (subtítulo de la fila). */
    asistente: string;
    /** Tiempo de respuesta medio de la asistencia en milisegundos. */
    tiempoRespuestaMs: number;
    /**
     * Proporción de interacciones del periodo atendidas por el canal (0-100).
     * No es una partición probabilística del total: mide presencia relativa.
     */
    traficoAsignado: number;
    /** Conversaciones registradas en las últimas 24 h. */
    interacciones: number;
    /** Tasa de resolución sin escalamiento a un agente humano (%). */
    tasaResolucion: number;
    estado: EstadoServicio;
}

/** Categoría de una alerta de negocio; 'enrutamiento' se pinta con el token estados.ai. */
export type CategoriaAlerta =
    | "enrutamiento"
    | "ventas"
    | "soporte"
    | "campana";

/** Nivel de severidad de una alerta del feed lateral. */
export type NivelAlerta = "info" | "warning" | "error";

/** Elemento del feed lateral de alertas del negocio. */
export interface SystemAlert {
    id: string;
    nivel: NivelAlerta;
    categoria: CategoriaAlerta;
    titulo: string;
    detalle: string;
    /** Marca de tiempo legible (p. ej. "hace 2 min"). */
    timestamp: string;
}

/** Barra apilada de la gráfica principal: interacciones de un canal por hora. */
export interface SerieCanal {
    /** Nombre del canal (leyenda de la serie). */
    canal: string;
    /** Interacciones del canal por hora. */
    valores: ReadonlyArray<number>;
}

/** Serie horaria de la gráfica apilada de interacciones por canal. */
export interface SerieInteraccionesPorCanal {
    /** Etiquetas del eje X (p. ej. "00", "02", "04"). */
    horas: ReadonlyArray<string>;
    /** Series apiladas: valores por hora para cada canal. */
    canales: ReadonlyArray<SerieCanal>;
}

/** Medidor radial del panel en vivo (fase del trayecto o tasa). */
export interface MedidorEnVivo {
    /** Nombre corto que acompaña al valor (p. ej. "Inicio de Conversación"). */
    nombre: string;
    /** Contexto sobre el que aplica (p. ej. "Bot · Web y WhatsApp"). */
    detalle: string;
    /** Valor porcentual del medidor (0-100). */
    porcentaje: number;
    /** Fila de estado formateada (p. ej. "498 / 640 visitas inician chat"). */
    valorFormateado: string;
    /** Nota opcional de contexto (p. ej. "Antes del primer mensaje solo abandona el 6%"). */
    nota?: string;
}

/**
 * Conversación en vivo del panel lateral del Home:
 * cuántos clientes inician el chat vs cuántos llegan a completar
 * una compra asistida.
 */
export interface RendimientoConversacion {
    /** Fase inicial del trayecto: clientes que inician la conversación. */
    inicioConversacion: MedidorEnVivo;
    /** Fase final del trayecto: compra o checkout asistido por IA. */
    checkoutAsistido: MedidorEnVivo;
}

/** Estado HTTP de una conversación registrado en trazas. */
export type TraceStatusHttp = 200 | 429 | 500;

/** Contenido de una conversación individual que muestra el Inspector de Payload. */
export interface ContenidoConversacion {
    /** Instrucciones o contexto del asistente que atiende la conversación. */
    contextoAsistente: string;
    /** Mensaje del cliente en la conversación. */
    mensajeCliente: string;
    /** Respuesta del asistente (completion) devuelta en la conversación. */
    respuestaAsistente: string;
    /** Temperatura usada en el muestreo del asistente. */
    temperature: number;
    /** Tokens consumidos únicamente por el contexto. */
    tokensEntrada: number;
    /** Tokens generados en la respuesta. */
    tokensSalida: number;
    /** Costo estimado de la conversación (p. ej. "$0.012"). */
    costo: string;
}

/**
 * Fila del historial de conversaciones del Explorador de Trazas:
 * cada registro es un intercambio concreto entre un cliente y el
 * asistente a través de un canal.
 */
export interface TraceLog {
    id: string;
    /** Marca de tiempo legible (p. ej. "14:32:01"). */
    timestamp: string;
    /** Canal donde ocurrió la conversación (p. ej. "Chatbot Ventas (Web)"). */
    canal: string;
    /** Asistente o equipo que atendió la conversación. */
    asistente: string;
    statusHttp: TraceStatusHttp;
    latenciaMs: number;
    totalTokens: number;
    /** Contenido anidado para inspeccionar en el panel lateral. */
    payload: ContenidoConversacion;
}