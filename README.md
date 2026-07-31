# DOOH Agency AI Platform

Plataforma de agentes de IA para producir, distribuir y optimizar contenido multimedia de forma casi autónoma para PyMEs, comercios locales y profesionales independientes sin equipo de marketing propio.

> "El usuario administra su negocio. La IA administra la complejidad."

## Estado actual

Proyecto en **Fase 1 – Núcleo** (ver [Roadmap](docs/vision.md#roadmap)). Todavía no hay stack técnico definido ni código de producto; este repo arranca como base documental y de contexto para trabajar con asistentes de IA (Claude Code, Codex, etc.).

## Documentación

- [`docs/vision.md`](docs/vision.md) — Documento fundacional de producto (filosofía, arquitectura conceptual, capas, roadmap y modelo de costos).
- [`docs/decisions/`](docs/decisions/) — Registro de decisiones de arquitectura/producto (ADRs), para que cualquier IA que retome el proyecto entienda por qué se tomó cada decisión sin depender del historial de chat.

## Trabajar en este repo con cualquier IA

Este proyecto está pensado para trabajarse indistintamente con Claude Code, Codex o cualquier otra herramienta de desarrollo asistido por IA:

- [`AGENTS.md`](AGENTS.md) — fuente única de verdad del contexto de proyecto (estado, convenciones, cómo coordinar entre sesiones/herramientas distintas).
- [`CLAUDE.md`](CLAUDE.md) — importa `AGENTS.md` directamente, no hay contenido duplicado que pueda desincronizarse.

Cualquier cambio de convención, stack o estructura se documenta en `AGENTS.md` en el mismo commit que lo introduce.
