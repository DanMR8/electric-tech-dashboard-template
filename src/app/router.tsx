import { Navigate, createBrowserRouter } from "react-router-dom";

import {
    LoginPage,
    RutaProtegida,
    RutaSoloAnonimos,
} from "../modules/auth";
import { HomePage } from "../modules/home/HomePage";
import { VisualFoundationsPage } from "../modules/visual-foundations/VisualFoundationsPage";
import { AppShell } from "./AppShell";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <RutaSoloAnonimos />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
        ],
    },
    {
        path: "/",
        element: <AppShell />,
        children: [
            {
                element: <RutaProtegida />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                ],
            },
            {
                path: "visual-foundations",
                element: <VisualFoundationsPage />,
            },
            {
                path: "*",
                element: <Navigate replace to="/" />,
            },
        ],
    },
]);
