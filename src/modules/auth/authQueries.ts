import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    AuthHttpError,
    login,
    logout,
    obtenerSesionActual,
} from "./authApi";
import type { LoginPayload, SesionActual } from "./authSchemas";

export const sesionActualQueryKey = ["auth", "sesion-actual"] as const;

export function useSesionActual() {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: sesionActualQueryKey,
        queryFn: async () => {
            const sesionAnterior = queryClient.getQueryData<SesionActual | null>(
                sesionActualQueryKey,
            );
            const sesionActual = await obtenerSesionActual();

            if (sesionAnterior && !sesionActual) {
                throw new AuthHttpError("Tu sesión expiró.", 401);
            }

            return sesionActual;
        },
        staleTime: 30_000,
        retry: (failureCount, error) => {
            if (error instanceof AuthHttpError && error.status !== null && error.status < 500) {
                return false;
            }

            return failureCount < 1;
        },
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
        onSuccess: (sesion) => {
            queryClient.setQueryData<SesionActual | null>(sesionActualQueryKey, sesion);
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData<SesionActual | null>(sesionActualQueryKey, null);
        },
    });
}
