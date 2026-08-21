# ADR 0004: Crecimiento modular controlado

- **Estado:** Aceptada
- **Fecha:** 2026-08-21
- **Autor(es):** FerBarreiro + Codex

## Contexto

La plataforma debe crecer de forma pausada, verificable y apta para demos y
pilotos. Incorporar generación multimedia, publicación y analítica antes de
validar las bases comunes aumentaría el riesgo operativo, el costo y la
complejidad visible para el usuario.

Se evaluaron dos enfoques:

1. Construir funcionalidades como productos o servicios independientes desde
   el inicio.
2. Mantener un producto base único y agregar capacidades como módulos sobre un
   núcleo común.

## Decisión

Se adopta un **monolito modular**. La Base Operativa (Módulo 0) provee datos de
cliente, memoria, tareas, orquestación, registro de herramientas, QA,
trazabilidad y UX Simple/Profesional. Los módulos de negocio se incorporan de
forma incremental y no se convierten en servicios separados antes de que el
volumen lo justifique.

Cada módulo debe declarar: propósito, entradas/salidas persistidas,
herramientas autorizadas, pipeline, QA específico, costos observables, caso de
prueba con Cliente demo y estado de disponibilidad.

El orden inicial es:

1. Módulo 0 — Base Operativa.
2. Módulo 1 — Plan de contenido y copys.
3. Módulo 2 — Research y estrategia.
4. Módulo 3 — Producción visual.
5. Módulo 4 — Distribución asistida.
6. Módulo 5 — Optimización.

## Consecuencias

**Se gana:** validación progresiva, operación trazable, menor costo de cambio y
una experiencia simple que no expone la complejidad técnica de los módulos.

**Se resigna:** la automatización completa llega más tarde; durante los
primeros pilotos habrá revisión humana y algunas tareas asistidas.

**Queda abierto:** pricing definitivo, proveedores multimedia y el momento de
extraer un módulo como servicio independiente. La monetización puede comenzar
con pilotos pagos del Módulo 1; se vuelve más escalable al sumar distribución.
