# ADR 0001: Stack técnico del núcleo

- **Estado:** Aceptada
- **Fecha:** 2026-08-10
- **Autor(es):** Claude Code + FerBarreiro

## Contexto

El proyecto entra en Fase 1 (Núcleo) sin stack definido (ver `AGENTS.md`). Se necesita elegir un stack que sirva tanto para el dashboard/UX (Modo Simple / Modo Profesional) como para el Core (orquestador, memoria, sistema de tareas), y que además pueda integrar APIs externas de generación multimedia y de publicación en redes sociales.

Opciones evaluadas:

1. **Node.js/TypeScript full-stack** (Next.js + Node backend/worker) — un solo lenguaje end-to-end, ecosistema maduro de SDKs para APIs de redes sociales y de IA, tipado compartido entre frontend y backend.
2. **Python backend (FastAPI) + React frontend separado** — ecosistema de IA/ML más maduro históricamente (LangChain, etc.), pero dos lenguajes, dos toolchains, sin tipos compartidos.
3. **Stack heterogéneo por módulo** (ej. Python para agentes, Node para el resto) — máxima "herramienta correcta para cada trabajo", pero alto costo de coordinación para un equipo chico en Fase 1-2.

Restricciones relevantes:

- Presupuesto de Fase 2 (MVP) es acotado (USD 5k-15k según `docs/vision.md`): el costo de mantener dos stacks no se justifica todavía.
- El proyecto no entrena modelos propios ni hace ML pesado — consume APIs externas de IA (razonamiento y generación multimedia). El argumento histórico "Python porque IA" no aplica: no hay carga de cómputo local de ML.
- La mayoría de las integraciones necesarias (YouTube Data API, Meta Graph API, TikTok API, servicios de email) tienen SDKs oficiales o comunitarios de primera clase en JavaScript/TypeScript.
- El equipo actual trabaja con asistentes de IA (Claude Code) que se benefician de un tipado fuerte y consistente en todo el repo para razonar sobre el código.

## Decisión

Se adopta **TypeScript en todo el stack**, en monorepo (ver ADR 0003):

- **Frontend:** Next.js (App Router) + React + Tailwind CSS.
- **Backend/API:** route handlers de Next.js para operaciones síncronas; un proceso Node dedicado (**worker**) para el sistema de tareas asíncronas.
- **Base de datos:** PostgreSQL, con extensión `pgvector` para memoria semántica (research notes, embeddings).
- **ORM:** Prisma — prioriza velocidad de desarrollo y madurez de tooling (migraciones, Prisma Studio) sobre el rendimiento marginal de alternativas como Drizzle, aceptable en esta escala.
- **Colas de trabajo:** BullMQ sobre Redis, para los jobs asíncronos de Production/Distribution (ver arquitectura §3).
- **Storage de assets:** almacenamiento compatible con S3 (Cloudflare R2 por costo, o AWS S3) para video/audio/imágenes generados.
- **Proveedores de IA:** Anthropic (Claude) como modelo de razonamiento/orquestación por defecto, vía Claude Agent SDK. Los proveedores de generación multimedia (imagen, video, audio) se integran detrás de una interfaz propia (`packages/providers` o similar) para poder reemplazarlos sin tocar la lógica de negocio — **no se fija un proveedor único de generación multimedia en este ADR**, queda abierto y se decide por módulo cuando se implemente (Fase 2).
- **Hosting inicial:** Vercel para `apps/web`; Railway (o Fly.io) para el worker, Postgres y Redis — se prioriza time-to-MVP sobre optimización de costos de infraestructura en Fase 1-2.
- **Testing:** Vitest para unit/integration, Playwright para e2e del dashboard.
- **CI:** GitHub Actions (lint, typecheck, test, build en cada PR).

## Consecuencias

**Se gana:**
- Un solo lenguaje y toolchain, tipado compartido de punta a punta (incluye contratos entre orquestador y UI).
- Onboarding más simple para cualquier colaborador (humano o agente de IA) que trabaje en el repo.
- Acceso directo a SDKs oficiales de las plataformas que importan para Distribution.

**Se resigna:**
- Ecosistema de librerías de ML/data science específicas de Python, si en el futuro se necesitara entrenar o fine-tunear modelos propios (no previsto antes de Fase 3+).

**Queda abierto:**
- Elección concreta de proveedor(es) de generación de imagen/video/audio — se decide en un ADR propio cuando se implemente el Production layer en Fase 2, evaluando costo real por pieza de contenido.
- Decisión sobre auth (NextAuth/Auth.js vs. Clerk u otro) — se difiere hasta que multiusuario sea relevante (Fase 3); en Fase 1-2 alcanza con auth mínima de un solo operador.
