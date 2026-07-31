# AGENTS.md

Contexto de proyecto para agentes de IA (Codex, Claude Code y cualquier otra herramienta compatible con el estándar [AGENTS.md](https://agents.md)). Este archivo es la **fuente única de verdad** del contexto de proyecto — `CLAUDE.md` solo importa este mismo archivo, no lo dupliques.

## Qué es este proyecto

DOOH Agency AI Platform: una plataforma de agentes de IA que produce, distribuye y optimiza contenido multimedia para PyMEs y negocios sin equipo de marketing propio. La visión completa del producto está en [`docs/vision.md`](docs/vision.md) — leela antes de proponer arquitectura o features nuevas.

Principio rector del producto (aplica también a cómo se construye): **la complejidad técnica se oculta siempre detrás de una experiencia simple.**

## Estado del repo

Fase 1 (Núcleo), sin stack técnico definido todavía. No asumas frameworks, lenguajes ni estructura de carpetas: confirmalo con el usuario antes de generar código o scaffolding de un stack específico. Cuando se defina, esta sección se actualiza con comandos de build/test/lint y estructura de carpetas.

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
