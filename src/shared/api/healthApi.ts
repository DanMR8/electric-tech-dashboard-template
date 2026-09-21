import { z } from "zod";

import { apiConfig } from "../config";

const healthBackendSchema = z.object({
    status: z.literal("ok"),
    environment: z.string().optional(),
    timestamp: z.string().optional(),
});

export interface HealthInfo {
    status: "ok";
    timestamp: string;
    environment?: string;
}

export async function getHealth(): Promise<HealthInfo> {
    if (apiConfig.mode === "demo") {
        return { status: "ok", timestamp: new Date().toISOString() };
    }

    const response = await fetch(apiConfig.healthUrl, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(
            `El servicio de salud respondió con código ${response.status}`,
        );
    }

    const rawData: unknown = await response.json();
    const data = healthBackendSchema.parse(rawData);

    return {
        status: data.status,
        timestamp: data.timestamp ?? new Date().toISOString(),
        ...(data.environment ? { environment: data.environment } : {}),
    };
}