import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type AnchoPanelLateral = "angosto" | "estandar" | "ancho";

export interface ControlPanelLateral {
    contenido: ReactNode | null;
    setContenido: (contenido: ReactNode | null) => void;
    abierto: boolean;
    setAbierto: (abierto: boolean) => void;
    ancho: AnchoPanelLateral;
    setAncho: (ancho: AnchoPanelLateral) => void;
}

export const ContextoPanelLateral = createContext<ControlPanelLateral | null>(null);

export function usePanelLateral(): ControlPanelLateral {
    const contexto = useContext(ContextoPanelLateral);

    if (!contexto) {
        throw new Error("usePanelLateral debe utilizarse dentro de PanelLateralProvider.");
    }

    return contexto;
}