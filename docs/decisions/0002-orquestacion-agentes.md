# ADR 0002: Enfoque de orquestación de agentes

- **Estado:** Aceptada
- **Fecha:** 2026-08-10
- **Autor(es):** Claude Code + FerBarreiro

## Contexto

El Core del sistema (`docs/vision.md`, `docs/architecture.md`) necesita un orquestador de agentes que coordine las capas Intelligence, Production, Distribution y Optimization, con memoria compartida y control de calidad entre pasos.

Opciones evaluadas:

1. **Framework de orquestación multi-agente existente** (LangGraph, CrewAI, AutoGen, etc.) — arranque rápido, patrones ya resueltos (grafos de estado, handoffs entre agentes), pero imponen su propio modelo mental y su propia forma de manejar memoria/herramientas, que puede no calzar con el modelo de capas fijas del producto (Intelligence → Production → Distribution → Optimization, con QA como gate).
2. **Orquestador propio, liviano, construido sobre el Claude Agent SDK** — el SDK aporta las primitivas de agente/herramienta/loop de razonamiento; la lógica de *qué pipeline correr y en qué orden* (que es específica del dominio de este producto) se implementa a medida sobre el sistema de tareas del Core.
3. **Orquestador propio sin ningún SDK de agentes** (llamadas directas a la API de Anthropic) — máximo control, pero reimplementa funcionalidad que el Agent SDK ya resuelve (manejo de herramientas, streaming, loops de tool-use).

Consideraciones:

- El producto no necesita grafos de conversación multi-agente abiertos: necesita **pipelines relativamente fijos y auditables** (research → producción → QA → publicación → analítica), lo cual es más simple que el caso general que resuelven frameworks como LangGraph/CrewAI.
- El principio de producto "ocultar la complejidad" exige que el comportamiento del sistema sea predecible y depurable — una capa de orquestación propia y simple es más fácil de razonar y de debuggear que la abstracción genérica de un framework de terceros pensado para casos más generales.
- Atarse a un framework de orquestación de terceros en Fase 1 es una dependencia difícil de revertir más adelante si el framework no escala con las necesidades específicas del producto (colas propias, QA gates, memoria relacional).
- El Claude Agent SDK ya resuelve el problema de "ejecutar un agente que usa herramientas" sin imponer un modelo de orquestación multi-agente — es la capa correcta para *un* agente, no para coordinar *varios* agentes entre sí.

## Decisión

Se construye un **orquestador propio y liviano** como parte del Core, con estas piezas:

- **Pipelines como definiciones explícitas de pasos** (no grafos genéricos): cada pipeline (ej. "Content Production Engine") es una secuencia/DAG simple de pasos declarados en código, donde cada paso es un job.
- **Cada agente individual usa el Claude Agent SDK** para su propio loop de razonamiento + uso de herramientas — el SDK resuelve "cómo piensa y actúa un agente", el orquestador propio resuelve "qué agente corre cuándo, con qué datos, y qué pasa si falla".
- **El sistema de tareas (BullMQ, ver ADR 0001) es el mecanismo de ejecución real**: cada paso del pipeline se despacha como job asíncrono, reintentable, con estado visible en la base de datos (no en memoria de proceso).
- **QA es un tipo de paso más en el pipeline**, no un chequeo especial — así se garantiza que ningún pipeline pueda "saltearlo" por accidente.
- **El registro de herramientas (tool registry) es propio**, mapeado sobre el mecanismo de herramientas del Agent SDK, para poder habilitar/deshabilitar herramientas por agente y por proyecto sin tocar código de cada agente.

Framework de orquestación multi-agente de terceros (LangGraph, CrewAI, etc.): **no se adopta por ahora**. Se revisita si el orquestador propio no escala (por ejemplo, si aparecen necesidades reales de coordinación dinámica entre agentes que el modelo de pipelines fijos no puede expresar).

## Consecuencias

**Se gana:**
- Control total sobre cómo se ejecutan, reintentan y auditan los pipelines — crítico para el QA gate y para la trazabilidad de costos por pieza de contenido.
- Sin dependencia de terceros para la pieza más central del producto (el orquestador), reduciendo riesgo de que un cambio breaking en un framework externo bloquee el roadmap.
- El modelo de pipelines fijos calza 1:1 con la arquitectura de capas ya definida en `docs/architecture.md`.

**Se resigna:**
- Hay que construir y mantener piezas que un framework ya resolvería (definición de pipelines, manejo de estado entre pasos, reintentos) — más trabajo inicial en Fase 1.
- No hay comunidad/documentación externa a la que recurrir para patrones de orquestación; el conocimiento queda concentrado en este repo y sus ADRs.

**Queda abierto:**
- Si en Fase 3 aparece la necesidad real de coordinación dinámica entre agentes (no pipelines fijos), se evalúa introducir un framework en ese momento, con un ADR nuevo que documente por qué el modelo de pipelines fijos dejó de alcanzar.
