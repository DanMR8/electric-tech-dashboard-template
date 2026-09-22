import { useMemo, useState, type ReactNode } from "react";

import {
    ContextoPanelLateral,
    type AnchoPanelLateral,
    type ControlPanelLateral,
} from "./panelContext";

export function PanelLateralProvider({ children }: { children: ReactNode }) {
    const [contenido, setContenido] = useState<ReactNode | null>(null);
    const [abierto, setAbierto] = useState(true);
    const [ancho, setAncho] = useState<AnchoPanelLateral>("estandar");

    const valor = useMemo<ControlPanelLateral>(
        () => ({ contenido, setContenido, abierto, setAbierto, ancho, setAncho }),
        [contenido, abierto, ancho],
    );

    return (
        <ContextoPanelLateral.Provider value={valor}>
            {children}
        </ContextoPanelLateral.Provider>
    );
}