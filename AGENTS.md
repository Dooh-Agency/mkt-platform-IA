# AGENTS.md

Contexto de proyecto para agentes de IA (Codex, Claude Code y cualquier otra herramienta compatible con el estándar [AGENTS.md](https://agents.md)). Este archivo es la **fuente única de verdad** del contexto de proyecto — `CLAUDE.md` solo importa este mismo archivo, no lo dupliques.

## Qué es este proyecto

DOOH Agency AI Platform: una plataforma de agentes de IA que produce, distribuye y optimiza contenido multimedia para PyMEs y negocios sin equipo de marketing propio. La visión completa del producto está en [`docs/vision.md`](docs/vision.md) — leela antes de proponer arquitectura o features nuevas.

Principio rector del producto (aplica también a cómo se construye): **la complejidad técnica se oculta siempre detrás de una experiencia simple.**

## Estado del repo

Fase 1 (Núcleo). Scaffolding del monorepo inicializado y verificado (lint/typecheck/build/test en verde). Antes de generar código, leé:

- [`docs/architecture.md`](docs/architecture.md) — arquitectura técnica y vista de componentes.
- [`docs/roadmap.md`](docs/roadmap.md) — etapas de crecimiento y qué corresponde a cada fase. La Fase 1 todavía no cierra: falta el registro de herramientas real, más QA por tipo de contenido, y el UX de Modo Simple.
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

Todavía no existen los paquetes `agents-*` ni `ui` — se crean cuando el primer código real los necesite (ver ADR 0003). El pipeline implementado hoy es un pipeline de juguete (`runToyTextPipeline` en `packages/core`) que valida el Core de punta a punta: genera texto vía un job real, lo guarda en memoria, pasa el QA gate, y lo deja en estado `approved` o `failed`. No publica en ninguna plataforma real — eso es Distribution layer, Fase 2.

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
