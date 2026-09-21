import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export interface ControlPanelLateral {
    contenido: ReactNode | null;
    setContenido: (contenido: ReactNode | null) => void;
    abierto: boolean;
    setAbierto: (abierto: boolean) => void;
}

export const ContextoPanelLateral = createContext<ControlPanelLateral | null>(null);

export function usePanelLateral(): ControlPanelLateral {
    const contexto = useContext(ContextoPanelLateral);

    if (!contexto) {
        throw new Error("usePanelLateral debe utilizarse dentro de PanelLateralProvider.");
    }

    return contexto;
}