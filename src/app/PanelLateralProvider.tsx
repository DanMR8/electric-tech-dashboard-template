import { useMemo, useState, type ReactNode } from "react";

import {
    ContextoPanelLateral,
    type ControlPanelLateral,
} from "./panelContext";

export function PanelLateralProvider({ children }: { children: ReactNode }) {
    const [contenido, setContenido] = useState<ReactNode | null>(null);
    const [abierto, setAbierto] = useState(true);

    const valor = useMemo<ControlPanelLateral>(
        () => ({ contenido, setContenido, abierto, setAbierto }),
        [contenido, abierto],
    );

    return (
        <ContextoPanelLateral.Provider value={valor}>
            {children}
        </ContextoPanelLateral.Provider>
    );
}