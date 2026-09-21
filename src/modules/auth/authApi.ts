import { apiConfig } from "../../shared/config";
import {
    authErrorSchema,
    sesionActualSchema,
    type LoginPayload,
    type SesionActual,
} from "./authSchemas";
import {
    crearSesion,
    guardarSesion,
    leerSesion,
    limpiarSesion,
    validarCredenciales,
} from "./authStore";

export class AuthHttpError extends Error {
    readonly status: number | null;

    constructor(
        message: string,
        status: number | null,
    ) {
        super(message);
        this.name = "AuthHttpError";
        this.status = status;
    }
}

const RUTAS = apiConfig.authRoutes;

async function leerRespuestaDesconocida(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text) as unknown;
    } catch {
        return text;
    }
}

function detalleComoTexto(data: unknown): string | null {
    const parsed = authErrorSchema.safeParse(data);

    if (!parsed.success || typeof parsed.data.detail !== "string") {
        return null;
    }

    return parsed.data.detail;
}

function mensajePorEstado(status: number, data: unknown): string {
    const detail = detalleComoTexto(data);

    if (status === 401) {
        return detail ?? "La sesión o las credenciales no son válidas.";
    }

    if (status === 403) {
        return "La solicitud fue rechazada por la configuración de seguridad.";
    }

    if (status === 422) {
        return "Los datos enviados no tienen el formato esperado.";
    }

    if (status >= 500) {
        return "El servicio de autenticación no está disponible temporalmente.";
    }

    return detail ?? `La solicitud de autenticación falló con código ${status}.`;
}

async function authFetch(
    input: string,
    init?: RequestInit,
): Promise<{ response: Response; data: unknown }> {
    let response: Response;

    try {
        response = await fetch(input, {
            ...init,
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
                ...init?.headers,
            },
        });
    } catch {
        throw new AuthHttpError(
            "No fue posible conectar con el servicio de autenticación.",
            null,
        );
    }

    const data = await leerRespuestaDesconocida(response);

    if (!response.ok) {
        throw new AuthHttpError(mensajePorEstado(response.status, data), response.status);
    }

    return { response, data };
}

export async function login(payload: LoginPayload): Promise<SesionActual> {
    if (apiConfig.mode === "demo") {
        const usuario = validarCredenciales(payload.identificador, payload.password);

        if (!usuario) {
            throw new AuthHttpError(
                "Las credenciales no son válidas. Verifica los datos e inténtalo nuevamente.",
                401,
            );
        }

        const sesion = crearSesion(usuario);
        guardarSesion(sesion);
        return sesion;
    }

    const { data } = await authFetch(RUTAS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return sesionActualSchema.parse(data);
}

export async function obtenerSesionActual(): Promise<SesionActual | null> {
    if (apiConfig.mode === "demo") {
        return leerSesion();
    }

    try {
        const { data } = await authFetch(RUTAS.me);
        return sesionActualSchema.parse(data);
    } catch (error) {
        if (error instanceof AuthHttpError && error.status === 401) {
            return null;
        }

        throw error;
    }
}

export async function logout(): Promise<void> {
    if (apiConfig.mode === "demo") {
        limpiarSesion();
        return;
    }

    let response: Response;

    try {
        ({ response } = await authFetch(RUTAS.logout, {
            method: "POST",
        }));
    } catch (error) {
        if (error instanceof AuthHttpError && error.status === 401) {
            return;
        }

        throw error;
    }

    if (response.status !== 204) {
        throw new AuthHttpError(
            `El cierre de sesión devolvió un código inesperado: ${response.status}.`,
            response.status,
        );
    }
}