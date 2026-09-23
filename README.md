# VoltDash

A modular web template for enterprise applications and AI-assisted products, presented as a dark, electric-styled dashboard. The reference UI is a fictional e-commerce + AI assistant operations center: KPIs, multi-series charts, conversion funnels, heatmaps, radar profiles, and live conversation analytics, all wired through mocked, type-safe data contracts.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 (`react-router-dom` v7) |
| Language | TypeScript 6 |
| Build | Vite 8 |
| UI | MUI (Material UI v9) + `@emotion` |
| Charts | Apache ECharts 6 (SVG renderer) |
| Data fetching | TanStack Query 5 |
| Forms | React Hook Form + Zod |
| Icons | Phosphor Icons |
| Package manager | pnpm |

## Why this stack

The architecture deliberately separates concerns so each concern can grow independently:

- **UI and navigation** — React + MUI + React Router.
- **Conventional HTTP data** — TanStack Query for request/response flows.
- **Forms and validation** — React Hook Form + Zod.
- **Visualization** — Apache ECharts.
- **Realtime events** — SSE, token streams, audio, and WebSocket live in a dedicated realtime layer.
- **Audio and future voice capabilities** — a bounded seam ready for TTS, mic, STT, and conversational voice.

The key idea: TanStack Query owns request/response data, while SSE, LLM tokens, audio, and WebSocket stay in a **separate realtime layer**, keeping the app from coupling to a single transport mechanism. External events can be validated with Zod and handled under strict TypeScript typing — for example `agent.status`, `tool.started`, `tool.completed`, `llm.token`, `tts.segment`, `session.completed`, `error`.

For TTS, the design does not depend on a single full audio file. It is built for segment-based playback so it can evolve toward progressive/streaming audio without reworking the interface.

## Prepared for

- REST and polling
- SSE
- Incremental response streaming
- Token-by-token LLM streaming
- Segmented TTS
- Operation cancellation and reconnection
- WebSocket
- Future mic / STT / voice-driven conversation

> "Prepared for" is not "already implemented". This template provides the foundation and the extension points; an SSE server, a TTS provider, STT, WebRTC, or LLM models belong to the solution that consumes it.

## Getting started

```bash
pnpm install
pnpm dev       # start the dev server
pnpm build     # type-check + production build
pnpm preview   # preview the production build
pnpm lint      # run ESLint
```

Demo access (when running in demo mode): `demo` / `voltdash123`.

## Routes

| Route | Module | Content |
| --- | --- | --- |
| `/` | Inicio | Assistant operations dashboard: response-time vs SLA line chart, channel distribution, conversion funnel, interaction-density heatmap, agent capabilities radar, ticket timeline, agent performance, filters and color-system reference |
| `/ecommerce` | E-commerce | E-commerce & AI assistant metrics: KPI cards with sparklines, interactions-per-channel stacked bars with time ranges, alerts and business calls-to-action |
| `/conversaciones` | Conversaciones | Support conversation log: filterable toolbar, conversation table with status and metadata |
| `/login` | Auth | Login screen with validation and demo credentials |

## Project structure

```
src/
├── app/            # Router, AppShell (sidebar + topbar + right panel), query client
├── modules/        # Feature modules: auth, visual-foundations, ecommerce, conversaciones
├── shared/
│   ├── ai-gateway/ # Typed data repository (mock implementation, swappable for a real backend)
│   ├── api/        # Http health check
│   ├── components/
│   │   └── surfaces/  # Reusable surfaces: GlassToolbar, SectionHeader, SectionPanel, StatCard
│   ├── config.ts   # Environment-driven API configuration
│   └── styles/     # Glass / solid surface presets
└── theme/          # Design tokens (dmr), color schemes, MUI + ECharts theme builders
```

## Design system

- **`theme/`** centralizes the design tokens (`dmr`) — colors, spacing, typography, motion and chart measures — plus dynamic MUI and ECharts themes. All charts and surfaces are driven exclusively by these tokens, keeping visual identity consistent across modules.
- **`shared/components/surfaces/`** provides the building blocks used across pages: glass toolbars (`GlassToolbar`), section panels (`SectionPanel`), section headers (`SectionHeader`) and KPI cards with sparklines (`StatCard`).

## Data layer

The UI only consumes typed contracts (`src/shared/ai-gateway/types.ts`). Today they are served by a mock repository (`src/shared/ai-gateway/api.ts`); a real consumer replaces that single file with actual `fetch` calls, leaving the UI untouched.

API behavior is environment-driven:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_AUTH_MODE` | `demo` | `demo` for the built-in mock auth, `http` to hit a real backend |
| `VITE_API_BASE_URL` | — | Base URL for the auth API when `VITE_AUTH_MODE=http` |
| `VITE_API_PREFIX` | `/api` | URL prefix for the auth routes |
| `VITE_HEALTH_URL` | `/health` | Health-check endpoint |