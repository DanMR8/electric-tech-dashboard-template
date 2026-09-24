import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const proxyTarget = env.VITE_DEV_PROXY_TARGET || "http://127.0.0.1:8550";
    const wsTarget = proxyTarget.replace(/^http/, "ws");

    return {
        base: "/electric-tech-dashboard-template/",
        plugins: [react()],

        server: {
            host: "127.0.0.1",
            port: 5173,

            proxy: {
                "/api": {
                    target: proxyTarget,
                    changeOrigin: true,
                },

                "/health": {
                    target: proxyTarget,
                    changeOrigin: true,
                },

                "/ws": {
                    target: wsTarget,
                    ws: true,
                },
            },
        },
    };
});