import type { DmrTheme } from "./variables-visuales";

declare module "@mui/material/styles" {
    interface Theme {
        dmr: DmrTheme;
    }

    interface ThemeOptions {
        dmr?: DmrTheme;
    }
}

export {};
