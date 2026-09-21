export type ApiMode = "demo" | "http";

export interface ApiConfig {
    mode: ApiMode;
    authRoutes: {
        login: string;
        me: string;
        logout: string;
    };
    healthUrl: string;
}

function normalizarPrefijo(value: string): string {
    return value.replace(/\/+$/, "");
}

function valorEnv(clave: string): string {
    const valor = import.meta.env[clave];

    return typeof valor === "string" ? valor : "";
}

export const apiConfig: ApiConfig = (() => {
    const modoBruto = valorEnv("VITE_AUTH_MODE").toLowerCase();
    const mode: ApiMode = modoBruto === "http" ? "http" : "demo";
    const baseUrl = normalizarPrefijo(valorEnv("VITE_API_BASE_URL"));
    const prefix = normalizarPrefijo(valorEnv("VITE_API_PREFIX") || "/api");
    const base = `${baseUrl}${prefix}`;

    return {
        mode,
        authRoutes: {
            login: `${base}/auth/login`,
            me: `${base}/auth/me`,
            logout: `${base}/auth/logout`,
        },
        healthUrl: valorEnv("VITE_HEALTH_URL") || "/health",
    };
})();