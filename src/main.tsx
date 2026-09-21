import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "./app/queryClient";
import { router } from "./app/router";
import { VoltDashThemeProvider } from "./theme";

import "./assets/fonts/inter/inter.css";
import "./assets/fonts/ibm-plex-mono/IBM Plex Mono Var-Roman.css";
import "./assets/fonts/ibm-plex-mono/IBM Plex Mono Var-Italic.css";

ReactDOM.createRoot(
    document.getElementById("root")!,
).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <VoltDashThemeProvider>
                <RouterProvider router={router} />
            </VoltDashThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
