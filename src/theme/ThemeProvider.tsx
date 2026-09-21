import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { crearTemaMui } from "./crear-tema-mui";
import { dmrThemes, type DmrColorScheme } from "./esquemas-color";

interface ControlEsquemaColor {
    esquema: DmrColorScheme;
    setEsquema: (esquema: DmrColorScheme) => void;
}

const ContextoEsquemaColor = createContext<ControlEsquemaColor | null>(null);

export function VoltDashThemeProvider({ children }: { children: ReactNode }) {
    const [esquema, setEsquema] = useState<DmrColorScheme>("dark");
    const muiTheme = useMemo(() => crearTemaMui(dmrThemes[esquema]), [esquema]);
    const control = useMemo(() => ({ esquema, setEsquema }), [esquema]);

    return (
        <ContextoEsquemaColor value={control}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ContextoEsquemaColor>
    );
}

export function ControlEsquemaColor({
    children,
}: {
    children: (control: ControlEsquemaColor) => ReactNode;
}) {
    const control = useContext(ContextoEsquemaColor);

    if (!control) {
        throw new Error("ControlEsquemaColor debe utilizarse dentro de VoltDashThemeProvider.");
    }

    return <>{children(control)}</>;
}
