/**
 * Contrato de datos del dominio "AI Ops & API Gateway".
 *
 * Son interfaces puras, sin dependencias de UI ni de theme:
 * los componentes las consumen y deciden cómo pintar cada campo
 * con los tokens de diseño (theme.dmr).
 *
 * Los contratos modelan un producto SaaS de observabilidad de LLMs
 * (arquitectura híbrida local + nube): enrutamiento semántico, caché
 * de prompts, cuotas de proveedores externos y fallbacks a la nube.
 * Viven junto al repositorio (./api.ts) para que el consumidor del
 * template reemplace mocks por su backend tocando un solo paquete.
 */

/** Estado operativo de un servicio dentro del mesh de enrutamiento. */
export type EstadoModelo = "operativo" | "degradado" | "offline";

/** Tarjeta de KPI: valor principal, variación y sparkline de tendencia. */
export interface MetricSummary {
    etiqueta: string;
    valor: string;
    /** Variación porcentual frente al periodo anterior (p. ej. 12.4 → +12.4%). */
    variacion: number;
    /**
     * true si un aumento es una mejora (define el color del delta).
     * Ej.: latencia y fallbacks mejoran al bajar → variacionEsPositiva = false;
     * ahorro y aciertos de caché mejoran al subir → true.
     */
    variacionEsPositiva: boolean;
    /** Serie de puntos del sparkline de tendencia. */
    sparkline: ReadonlyArray<number>;
}

/** Fila de la tabla de servicios activos y balanceo de carga. */
export interface ActiveModelRow {
    id: string;
    nombre: string;
    /**
     * Backend de ejecución (p. ej. "GPU CUDA · L4", "CPU Cluster",
     * "OpenAI · API" o "Vector DB · Docker").
     */
    backend: string;
    /** Tiempo de respuesta medio en milisegundos (0 si el servicio está offline). */
    tiempoRespuestaMs: number;
    /**
     * Proporción de peticiones que atraviesan el servicio (0-100).
     * Los hops internos (caché vectorial) pueden superar el 100% conjunto:
     * no es una partición probabilística del total, sino presencia por request.
     */
    traficoAsignado: number;
    estado: EstadoModelo;
}

/** Categoría de una alerta; 'enrutamiento' se pinta con el token estados.ai. */
export type CategoriaAlerta =
    | "enrutamiento"
    | "infraestructura"
    | "modelo"
    | "seguridad";

/** Nivel de severidad de una alerta del feed lateral. */
export type NivelAlerta = "info" | "warning" | "error";

/** Elemento del feed lateral "Monitor de Alertas Inteligentes". */
export interface SystemAlert {
    id: string;
    nivel: NivelAlerta;
    categoria: CategoriaAlerta;
    titulo: string;
    detalle: string;
    /** Marca de tiempo legible (p. ej. "hace 2 min"). */
    timestamp: string;
}

/** Serie horaria de la gráfica "Peticiones Enrutadas por Modelo". */
export interface SerieEnrutamientoPorModelo {
    /** Etiquetas del eje X (p. ej. "00", "02", "04"). */
    horas: ReadonlyArray<string>;
    /** Series apiladas: un conjunto de valores por cada modelo enrutado. */
    modelos: ReadonlyArray<{
        modelo: string;
        /** Peticiones enrutadas a ese modelo por hora. */
        valores: ReadonlyArray<number>;
    }>;
}

/** Medidor radial del panel en vivo del gateway (cuota o tasa). */
export interface MedidorEnVivo {
    /** Nombre corto que acompaña al valor (p. ej. "OpenAI RPM"). */
    nombre: string;
    /** Proveedor o recurso sobre el que aplica (p. ej. "OpenAI (Fallback)"). */
    detalle: string;
    /** Valor porcentual del medidor (0-100). */
    porcentaje: number;
    /** Fila de estado formateada (p. ej. "410 / 500 req/min"). */
    valorFormateado: string;
    /** Nota opcional de contexto (p. ej. "Riesgo de 429 por cuota"). */
    nota?: string;
}

/** Medidores en vivo del panel lateral del Home. */
export interface TelemetriaGateway {
    /** Cuota de requests por minuto del proveedor externo. */
    cuotaRpm: MedidorEnVivo;
    /** Tasa de acierto de la caché semántica de prompts. */
    cachePrompts: MedidorEnVivo;
}

/** Estado HTTP de una llamada a un modelo de IA. */
export type TraceStatusHttp = 200 | 429 | 500;

/** Detalles técnicos que muestra el Inspector de Payload. */
export interface TracePayload {
    /** Instrucciones del sistema enviadas al modelo. */
    systemPrompt: string;
    /** Prompt del usuario enviado en la petición. */
    userPrompt: string;
    /** Respuesta (completion) devuelta por el modelo. */
    completionText: string;
    /** Temperatura usada en el muestreo. */
    temperature: number;
    /** Tokens consumidos únicamente por el prompt. */
    promptTokens: number;
    /** Tokens generados en la respuesta. */
    completionTokens: number;
    /** Costo estimado de la llamada (p. ej. "$0.014"). */
    costo: string;
}

/** Fila del historial de llamadas del Explorador de Trazas. */
export interface TraceLog {
    id: string;
    /** Marca de tiempo legible (p. ej. "14:32:01"). */
    timestamp: string;
    modelo: string;
    backend: string;
    statusHttp: TraceStatusHttp;
    latenciaMs: number;
    totalTokens: number;
    /** Payload anidado para inspeccionar en el panel lateral. */
    payload: TracePayload;
}