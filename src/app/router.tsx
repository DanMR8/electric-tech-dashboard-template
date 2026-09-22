import { Navigate, createBrowserRouter } from "react-router-dom";

import {
    LoginPage,
    RutaProtegida,
    RutaSoloAnonimos,
} from "../modules/auth";
import { ConversacionesPage } from "../modules/conversaciones/ConversacionesPage";
import { EcommercePage } from "../modules/ecommerce/EcommercePage";
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
                        element: <VisualFoundationsPage />,
                    },
                    {
                        path: "ecommerce",
                        element: <EcommercePage />,
                    },
                    {
                        path: "conversaciones",
                        element: <ConversacionesPage />,
                    },
                ],
            },
            {
                path: "visual-foundations",
                element: <Navigate replace to="/" />,
            },
            {
                path: "*",
                element: <Navigate replace to="/" />,
            },
        ],
    },
]);
