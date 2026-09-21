import { z } from "zod";

export const usuarioAutenticadoSchema = z.object({
    id: z.number().int().positive(),
    username: z.string().min(1),
    email: z.email(),
});

export const sesionActualSchema = z.object({
    usuario: usuarioAutenticadoSchema,
    remember_me: z.boolean(),
    expires_at: z.iso.datetime({ local: true }),
});

export const loginPayloadSchema = z.object({
    identificador: z
        .string()
        .trim()
        .min(1, "Ingresa tu usuario o correo electrónico.")
        .max(254, "El identificador es demasiado largo."),
    password: z.string().min(1, "Ingresa tu contraseña."),
    remember_me: z.literal(false),
});

export const authErrorSchema = z.object({
    detail: z.unknown(),
});

export type UsuarioAutenticado = z.infer<typeof usuarioAutenticadoSchema>;
export type SesionActual = z.infer<typeof sesionActualSchema>;
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

