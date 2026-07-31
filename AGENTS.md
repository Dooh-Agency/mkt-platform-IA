# AGENTS.md

Guía de contexto para agentes de IA (Codex y compatibles) trabajando en este repositorio.

## Qué es este proyecto

DOOH Agency AI Platform: una plataforma de agentes de IA que produce, distribuye y optimiza contenido multimedia para PyMEs y negocios sin equipo de marketing. La visión completa del producto está en [`docs/vision.md`](docs/vision.md) — leela antes de proponer arquitectura o features nuevas.

Principio rector del producto (aplica también a cómo se construye): **la complejidad técnica se oculta siempre detrás de una experiencia simple.**

## Estado del repo

Fase 1 (Núcleo), sin stack técnico definido todavía. No asumas frameworks, lenguajes ni estructura de carpetas: confirmalo con el usuario antes de empezar a generar código o scaffolding de un stack específico.

## Cómo trabajar acá

- Este repo se usa indistintamente con Codex y Claude Code (ver [`CLAUDE.md`](CLAUDE.md)). Si cambiás una convención de proyecto (estructura, comandos, stack), actualizá ambos archivos para que no queden desincronizados.
- Cuando se defina el stack técnico, documentar acá: comandos de build/test/lint, estructura de carpetas y convenciones de código.
- Mantené `docs/vision.md` como fuente de verdad del producto; si una decisión técnica contradice la visión, señalalo en vez de improvisar una solución.
