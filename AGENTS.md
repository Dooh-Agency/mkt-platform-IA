# AGENTS.md

Contexto de proyecto para agentes de IA (Codex, Claude Code y cualquier otra herramienta compatible con el estándar [AGENTS.md](https://agents.md)). Este archivo es la **fuente única de verdad** del contexto de proyecto — `CLAUDE.md` solo importa este mismo archivo, no lo dupliques.

## Qué es este proyecto

DOOH: un asistente de marketing visual, simple y proactivo para pequeños negocios, con acompañamiento opcional de la agencia. La visión completa del producto está en [`docs/vision.md`](docs/vision.md) — leela antes de proponer arquitectura o features nuevas.

Principio rector del producto (aplica también a cómo se construye): **la complejidad técnica se oculta siempre detrás de una experiencia simple.**

## Prioridad vigente (2026-11-11)

Consultar [plan y diagnóstico](docs/producto/plan.md), [roadmap](docs/roadmap.md) y [ADR 0005](docs/decisions/0005-asistente-visual.md). El caso ancla de YouTube y el orden anterior de módulos son históricos. El prototipo `/prototipo` es una simulación aislada para validar UX: no es piloto seguro, no persiste ni publica. No usar datos reales hasta implementar autenticación, aislamiento, almacenamiento seguro, soporte y recuperación. La aprobación automática de QA no sustituye la aprobación del cliente.

## Estado del repo

Fase 1 (Núcleo). Scaffolding del monorepo inicializado. En la revisión del 2026-11-11, `corepack pnpm` permitió ejecutar typecheck web y 8 pruebas existentes del core; no se ejecutó una verificación integral ni se pudo iniciar el servidor por restricciones del entorno. Antes de generar código, leé:

- [`docs/architecture.md`](docs/architecture.md) — arquitectura técnica y vista de componentes.
- [`docs/roadmap.md`](docs/roadmap.md) — etapas de crecimiento y qué corresponde a cada fase.
- [`docs/modulos.md`](docs/modulos.md) — contrato, orden y gates de los módulos. La Fase 1 es el Módulo 0 (Base Operativa).
- [`docs/decisions/0001-stack-tecnico.md`](docs/decisions/0001-stack-tecnico.md) — stack: TypeScript full-stack, Next.js, PostgreSQL + pgvector, Prisma, BullMQ/Redis, Vercel + Railway.
- [`docs/decisions/0002-orquestacion-agentes.md`](docs/decisions/0002-orquestacion-agentes.md) — orquestador propio sobre Claude Agent SDK, sin framework multi-agente de terceros.
- [`docs/decisions/0003-estructura-monorepo.md`](docs/decisions/0003-estructura-monorepo.md) — estructura de monorepo (pnpm workspaces + Turborepo, `apps/` y `packages/`).

### Estructura actual

```text
apps/
  web/      # Next.js — dashboard, dispara el pipeline de prueba (packages/core)
  worker/   # proceso Node — consume la cola de jobs (BullMQ)
packages/
  core/       # orquestador, cola de tareas, tool registry, QA gate
  db/          # schema Prisma (Project, Objective, ResearchNote, ContentPiece,
               # PublicationEvent, MetricSnapshot, Job) + seed de demo
  providers/    # adaptador de proveedor de IA intercambiable (Anthropic por defecto)
```

Todavía no existen los paquetes `agents-*` ni `ui` — se crean cuando el primer código real los necesite (ver ADR 0003). La Base Operativa integra un pipeline de texto de prueba (`runToyTextPipeline` en `packages/core`): el worker registra la herramienta `generate_text`, el pipeline la invoca mediante el tool registry, guarda el resultado en memoria y pasa un QA por tipo antes de dejarlo en estado `approved` o `failed`. El dashboard expone este flujo en Modo Simple y conserva el disparador técnico en Modo Profesional. No publica en ninguna plataforma real — eso es Distribution layer, Fase 2.

### Comandos

Requieren Node ≥20, pnpm 10.30.3, y (para `db:migrate`/correr la app real) Postgres con la extensión `pgvector` y Redis — copiá `.env.example` a `.env` y completá `DATABASE_URL`, `REDIS_URL`, `ANTHROPIC_API_KEY`.

```bash
pnpm install       # instala todo el workspace
pnpm lint           # biome check .
pnpm typecheck       # tsc --noEmit en cada paquete (vía turbo)
pnpm build            # build de apps/web y apps/worker (vía turbo)
pnpm test              # vitest en los paquetes que tienen tests (vía turbo)
pnpm db:generate         # genera el cliente Prisma
pnpm db:migrate           # corre migraciones (requiere Postgres corriendo)
pnpm db:seed               # carga datos demo (ver packages/db/prisma/seed.ts)
pnpm --filter @dooh/web dev     # dashboard en http://localhost:3000
pnpm --filter @dooh/worker dev  # worker que consume la cola BullMQ
```

## Trabajando con múltiples herramientas de IA

Este repo se trabaja indistintamente con distintas IAs de desarrollo (Claude Code, Codex, u otras). Como no comparten memoria entre sí ni entre sesiones, el contexto tiene que vivir en el repo, no en la cabeza de cada asistente:

- **Antes de arrancar una tarea grande**, leé `docs/vision.md`, este archivo y `docs/decisions/` para entender el estado y las decisiones ya tomadas.
- **Decisiones de arquitectura o de producto no triviales** (elegir un stack, un patrón, una integración externa) se registran como un ADR nuevo en `docs/decisions/` usando `docs/decisions/0000-template.md` como base. Esto evita que dos IAs en sesiones distintas re-discutan o contradigan una decisión ya tomada.
- **Si cambiás una convención de proyecto** (estructura, comandos, stack, workflow), actualizá este archivo en el mismo commit — es lo primero que va a leer la próxima sesión, sea cual sea la IA.
- **Commits atómicos y descriptivos**: cada commit debe poder entenderse sin el historial de chat que lo generó, porque la próxima sesión (de cualquier IA) solo va a tener el repo, no esta conversación.
- No asumas que la sesión anterior fue con la misma herramienta. Escribí para un lector nuevo.

## Convenciones de repo

- Ramas: `feature/<slug>`, `fix/<slug>`, `docs/<slug>`.
- Line endings normalizados vía `.gitattributes` (LF en el repo); no pelear con warnings de CRLF en Windows.
- Formato de código: ver `.editorconfig` mientras no haya un linter/formatter propio del stack.
