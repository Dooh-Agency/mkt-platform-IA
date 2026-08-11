# ADR 0003: Estructura de repositorio (monorepo)

- **Estado:** Aceptada
- **Fecha:** 2026-08-10
- **Autor(es):** Claude Code + FerBarreiro

## Contexto

Definido el stack (ADR 0001) y el enfoque de orquestación (ADR 0002), hace falta una estructura de repo que separe con claridad el dashboard (UX), el Core (orquestador/memoria/tareas), los agentes por capa, y las integraciones con proveedores externos — sin caer en microservicios prematuros (ver `docs/architecture.md`, principio 5).

Opciones evaluadas:

1. **Monorepo con workspaces** (pnpm workspaces + Turborepo) — un repo, múltiples paquetes con fronteras de código explícitas, build cacheado incremental.
2. **Un solo paquete Next.js sin separación interna** — más simple al inicio, pero mezcla UI, orquestador y agentes en una sola carpeta `src/`, dificultando después extraer cualquier pieza a servicio propio.
3. **Polyrepo** (repos separados por módulo desde ahora) — máxima independencia de deploy, pero costo de coordinación alto para un equipo chico en Fase 1-2, y contradice la recomendación de "monolito modular" de la arquitectura.

## Decisión

Se adopta un **monorepo con pnpm workspaces + Turborepo**, con esta estructura inicial:

```text
DOOH-Mkt-Platform/
├── apps/
│   ├── web/          # Next.js — dashboard, Modo Simple/Profesional
│   └── worker/        # proceso Node — consume la cola de jobs (BullMQ)
├── packages/
│   ├── core/           # orquestador, sistema de tareas, tool registry, QA
│   ├── memory/          # acceso a Postgres/pgvector (memoria compartida)
│   ├── agents-intelligence/
│   ├── agents-production/
│   ├── agents-distribution/
│   ├── agents-optimization/
│   ├── providers/       # adaptadores a proveedores externos de IA (intercambiables)
│   ├── db/               # esquema Prisma + migraciones
│   └── ui/                # componentes compartidos del dashboard
├── docs/
└── ...configs raíz (turbo.json, pnpm-workspace.yaml, tsconfig base)
```

Reglas de frontera:

- `apps/web` y `apps/worker` son los únicos puntos de entrada ejecutables; todo lo demás son paquetes de librería.
- Los paquetes `agents-*` no se importan entre sí directamente — toda coordinación pasa por `packages/core` (el orquestador), reforzando en código el principio de arquitectura "ningún agente de una capa sabe de otra".
- `packages/providers` es la única capa que conoce SDKs de terceros de generación multimedia — `agents-production` depende de la interfaz de `providers`, nunca del SDK del proveedor directamente.

No se crean paquetes vacíos "por si acaso": cada `package/` se crea cuando el primer código real que lo necesita se escribe, no antes.

## Consecuencias

**Se gana:**
- Fronteras de código explícitas que reflejan la arquitectura de capas, sin el costo operativo de microservicios reales.
- Cualquier paquete (ej. `agents-production`) puede extraerse a servicio independiente el día que el volumen lo justifique, sin reescribir su lógica interna — solo cambia cómo se invoca.
- Build y test incrementales vía Turborepo (cachea lo que no cambió).

**Se resigna:**
- Un poco más de configuración inicial (workspaces, tsconfig por paquete) comparado con un único paquete Next.js.

**Queda abierto:**
- Si en Fase 3-4 algún paquete necesita deploy y escalado independiente (ej. `agents-production` por carga de generación multimedia), se documenta esa extracción en un ADR nuevo cuando ocurra.
