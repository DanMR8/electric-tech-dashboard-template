import {
    sesionActualSchema,
    type SesionActual,
    type UsuarioAutenticado,
} from "./authSchemas";

interface UsuarioAlmacenado extends UsuarioAutenticado {
    password: string;
}

const CLAVE_SESION = "voltdash.sesion.v1";
const CLAVE_USUARIOS = "voltdash.usuarios.v1";
const EXPIRACION_MS = 24 * 60 * 60 * 1000;

const usuariosSemilla: readonly UsuarioAlmacenado[] = [
    { id: 1, username: "demo", email: "demo@voltdash.app", password: "voltdash123" },
];

export const credencialesDemo = usuariosSemilla.map(({ username, password }) => ({
    usuario: username,
    password,
}));

function leerUsuarios(): UsuarioAlmacenado[] {
    try {
        const raw = localStorage.getItem(CLAVE_USUARIOS);

        if (raw) {
            const parsed = JSON.parse(raw) as unknown;

            if (Array.isArray(parsed)) {
                return parsed as UsuarioAlmacenado[];
            }
        }
    } catch {
        // Se regenera la semilla si el almacenamiento está corrupto.
    }

    const semilla = usuariosSemilla.map((usuario) => ({ ...usuario }));
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(semilla));
    return semilla;
}

function guardarUsuarios(usuarios: UsuarioAlmacenado[]): void {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function publicar(usuario: UsuarioAlmacenado): UsuarioAutenticado {
    return { id: usuario.id, username: usuario.username, email: usuario.email };
}

function normaIdentificador(value: string): string {
    return value.trim().toLowerCase();
}

export const crudUsuarios = {
    listar(): UsuarioAutenticado[] {
        return leerUsuarios().map(publicar);
    },

    crear(input: { username: string; email: string; password: string }): UsuarioAutenticado {
        const usuarios = leerUsuarios();
        const username = input.username.trim();
        const email = input.email.trim();

        if (!username || !email || !input.password) {
            throw new Error("Todos los campos son obligatorios.");
        }

        const yaExiste = usuarios.some(
            (usuario) =>
                normaIdentificador(usuario.username) === normaIdentificador(username) ||
                normaIdentificador(usuario.email) === normaIdentificador(email),
        );

        if (yaExiste) {
            throw new Error("El usuario o correo ya existe.");
        }

        const siguienteId = Math.max(0, ...usuarios.map((usuario) => usuario.id)) + 1;
        const nuevo: UsuarioAlmacenado = {
            id: siguienteId,
            username,
            email,
            password: input.password,
        };

        guardarUsuarios([...usuarios, nuevo]);
        return publicar(nuevo);
    },

    actualizar(
        id: number,
        cambios: Partial<Pick<UsuarioAutenticado, "username" | "email">> & {
            password?: string;
        },
    ): UsuarioAutenticado | null {
        const usuarios = leerUsuarios();
        const indice = usuarios.findIndex((usuario) => usuario.id === id);

        if (indice === -1) {
            return null;
        }

        const actualizado: UsuarioAlmacenado = {
            ...usuarios[indice],
            username: cambios.username?.trim() || usuarios[indice].username,
            email: cambios.email?.trim() || usuarios[indice].email,
            password: cambios.password ?? usuarios[indice].password,
        };

        const proximos = [...usuarios];
        proximos[indice] = actualizado;
        guardarUsuarios(proximos);
        return publicar(actualizado);
    },

    eliminar(id: number): boolean {
        const usuarios = leerUsuarios();
        const proximos = usuarios.filter((usuario) => usuario.id !== id);

        if (proximos.length === usuarios.length) {
            return false;
        }

        guardarUsuarios(proximos);
        return true;
    },
};

export function validarCredenciales(
    identificador: string,
    password: string,
): UsuarioAutenticado | null {
    const clave = normaIdentificador(identificador);
    const usuario = leerUsuarios().find(
        (candidato) =>
            normaIdentificador(candidato.username) === clave ||
            normaIdentificador(candidato.email) === clave,
    );

    if (!usuario || usuario.password !== password) {
        return null;
    }

    return publicar(usuario);
}

function isoLocal(ms: number): string {
    const fecha = new Date(ms);
    const segmento = (valor: number) => String(valor).padStart(2, "0");

    return [
        fecha.getFullYear(),
        segmento(fecha.getMonth() + 1),
        segmento(fecha.getDate()),
    ].join("-") + `T${segmento(fecha.getHours())}:${segmento(fecha.getMinutes())}:${segmento(fecha.getSeconds())}`;
}

export function crearSesion(usuario: UsuarioAutenticado): SesionActual {
    return {
        usuario,
        remember_me: false,
        expires_at: isoLocal(Date.now() + EXPIRACION_MS),
    };
}

export function guardarSesion(sesion: SesionActual): void {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function leerSesion(): SesionActual | null {
    try {
        const raw = localStorage.getItem(CLAVE_SESION);

        if (!raw) {
            return null;
        }

        const sesion = sesionActualSchema.parse(JSON.parse(raw) as unknown);

        if (new Date(sesion.expires_at).getTime() <= Date.now()) {
            localStorage.removeItem(CLAVE_SESION);
            return null;
        }

        return sesion;
    } catch {
        localStorage.removeItem(CLAVE_SESION);
        return null;
    }
}

export function limpiarSesion(): void {
    localStorage.removeItem(CLAVE_SESION);
}