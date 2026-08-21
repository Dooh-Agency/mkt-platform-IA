# Arquitectura Técnica — DOOH Agency AI Platform
## v1.0

> Este documento traduce la visión de producto (`docs/vision.md`) en una arquitectura técnica concreta. Las decisiones que fija se registran como ADRs individuales en `docs/decisions/`; este documento las conecta en una vista de conjunto y se actualiza cuando una decisión cambia.

---

## 1. Principios de arquitectura

Se derivan directamente del principio de producto ("la IA administra la complejidad"):

1. **Separación estricta entre orquestación y ejecución.** El Core decide *qué* hacer y *en qué orden*; los agentes/herramientas de cada capa solo saben ejecutar su tarea. Ningún agente de Production sabe de Distribution, ni viceversa.
2. **Todo trabajo pesado es asíncrono.** Generar un video, publicar en 5 plataformas o esperar analítica de una API externa son operaciones de minutos u horas, no de una request HTTP. La arquitectura es *job-based* desde el día uno, no se agrega después.
3. **Memoria como fuente de verdad, no el chat.** El estado del proyecto (qué se investigó, qué se generó, qué se publicó, qué funcionó) vive en la base de datos, no en el contexto de un agente. Cualquier agente debe poder "olvidar" y recuperar el estado leyendo memoria compartida.
4. **Proveedores de IA intercambiables.** Ni el modelo de razonamiento ni los modelos de generación multimedia son decisiones permanentes. La capa de agentes habla contra interfaces propias, no contra SDKs de proveedores específicos en el código de negocio.
5. **Monolito modular antes que microservicios.** En Fase 1-2 el costo de coordinación de microservicios no se justifica. Se separa por *módulos* dentro de un mismo repo/deploy, con fronteras claras que permiten extraer un servicio el día que el volumen lo exija.

---

## 2. Vista de componentes

```text
┌─────────────────────────────────────────────────────────────────┐
│                         apps/web (Next.js)                      │
│   Modo Simple / Modo Profesional · Dashboard · Onboarding       │
└───────────────────────────┬───────────────────────────────────-─┘
                             │ API interna (route handlers / tRPC)
┌───────────────────────────▼─────────────────────────────────────┐
│                            CORE                                 │
│  ┌───────────────┐ ┌──────────────┐ ┌───────────────────────┐   │
│  │ Orquestador    │ │ Memoria       │ │ Registro de           │  │
│  │ de agentes     │ │ compartida    │ │ herramientas          │  │
│  │ (pipelines)    │ │ (Postgres +   │ │ (tool registry)       │  │
│  │                │ │  pgvector)    │ │                       │  │
│  └───────────────┘ └──────────────┘ └───────────────────────┘   │
│  ┌───────────────┐ ┌──────────────────────────────────────┐     │
│  │ Sistema de     │ │ QA / control de calidad              │     │
│  │ tareas (jobs)  │ │ (validaciones antes de publicar)     │     │
│  └───────────────┘ └──────────────────────────────────────┘     │
└──────┬─────────────────┬──────────────────┬─────────────────┬───┘
       │                 │                  │                 │
┌──────▼──────┐   ┌──────▼──────┐   ┌───────▼───────┐  ┌──────▼──────┐
│ Intelligence │   │ Production  │   │ Distribution  │  │Optimization │
│  agents      │   │  agents     │   │   agents      │  │  agents     │
└──────┬──────┘   └──────┬──────┘   └───────┬───────┘  └──────┬──────┘
       │                 │                  │                 │
  APIs externas     APIs de gen.        APIs de redes     APIs de
  (búsqueda,        multimedia          sociales /        analítica
  research)         (imagen/video/      email             (YouTube,
                     audio/texto)                          Meta, etc.)
```

Cada capa (Intelligence / Production / Distribution / Optimization) es un **paquete de agentes**, no un servicio propio: comparten proceso con el Core en Fase 1-2 y se ejecutan como *jobs* despachados por el sistema de tareas. Se separan a servicios independientes recién si el volumen de un módulo específico lo justifica (ver ADR 0001).

---

## 3. Flujo del caso de uso ancla: Content Production Engine

Este es el pipeline que valida toda la arquitectura (ver `docs/vision.md`, sección "El canal de YouTube").

```text
1. Usuario define objetivo/audiencia/tono/frecuencia (Modo Simple)
        │
2. Intelligence agent investiga tema + SEO   ──▶ escribe a Memoria
        │
3. Orquestador arma plan de contenido (guion, formatos derivados)
        │
4. Production agents generan en paralelo:
   video largo · shorts · artículo · carrusel · imágenes · newsletter
        │  (cada uno es un job independiente, reintentable)
        │
5. QA valida salidas (duración, formato, checklist de marca)
        │
6. Distribution agents publican/programan por plataforma
        │
7. Optimization agents leen métricas (CTR, retención, engagement)
        │  ──▶ escriben a Memoria (retroalimenta paso 2 del próximo ciclo)
```

Puntos de diseño clave:

- Los pasos 4 corren en **paralelo como jobs de cola**, no secuencialmente en una sola función — es el primer motivo real para tener un sistema de colas desde Fase 1.
- El paso 5 (QA) es un **gate obligatorio**: nada pasa a Distribution sin aprobar validaciones automáticas (y, en Fase 1-2, revisión humana opcional).
- El paso 7 no es un reporte estático: escribe de vuelta a la Memoria compartida para que el próximo ciclo de investigación (paso 2) parta de datos reales, no solo del prompt del usuario. Esto es lo que hace al sistema "aprender" con el tiempo.

---

## 4. Datos y memoria

Modelo de datos mínimo para arrancar (se refina en implementación, no es un ADR):

- **Project** — un negocio/cliente (en Fase 1, el propio canal de YouTube de DOOH).
- **Objective** — objetivo declarado por el usuario (Modo Simple) o configuración avanzada (Modo Profesional).
- **ResearchNote** — salidas del Intelligence layer, con embeddings para búsqueda semántica (pgvector).
- **ContentPiece** — una pieza generada (video, short, artículo, etc.), con estado (`draft`, `qa_pending`, `approved`, `published`, `failed`) y referencia a los assets en storage.
- **PublicationEvent** — qué se publicó, dónde, cuándo, con qué resultado.
- **MetricSnapshot** — métricas periódicas por `ContentPiece` y por canal.
- **Job** — unidad de trabajo asíncrono (tipo, payload, estado, reintentos), lo maneja la cola pero se refleja en Postgres para trazabilidad.

La memoria compartida **no es un blob de texto libre**: es esta base relacional + búsqueda vectorial sobre `ResearchNote` y `ContentPiece`. Los agentes leen/escriben contra esta estructura, no contra un archivo de contexto ad hoc.

---

## 5. Seguridad y control de calidad

- Ningún agente de Distribution publica sin pasar el gate de QA (§3).
- Las credenciales de plataformas externas (YouTube, Meta, etc.) se guardan cifradas y se acceden solo desde el módulo de Distribution — Intelligence/Production nunca las tocan.
- Modo Profesional expone logs de decisiones de cada agente (qué prompt, qué modelo, qué costo) para auditoría; Modo Simple los oculta pero los sigue registrando.

---

## 6. Qué NO se resuelve en Fase 1

Explícito para evitar sobre-ingeniería temprana (ver principio de "no diseñar para hipotéticos" del proyecto):

- Multiusuario / multi-tenant real → Fase 3.
- Facturación y billing → Fase 4.
- Aprendizaje continuo automatizado (auto-ajuste de estrategia sin intervención) → Fase 3+.
- Extracción de agentes a microservicios separados → solo si un módulo específico se vuelve cuello de botella.

---

## 7. Documentos relacionados

- Visión de producto: [`docs/vision.md`](vision.md)
- Roadmap por etapas: [`docs/roadmap.md`](roadmap.md)
- Modelo y gates de módulos: [`docs/modulos.md`](modulos.md)
- Decisiones de stack y orquestación: [`docs/decisions/`](decisions/)

---

## 8. Crecimiento modular

La plataforma se desarrolla como un monolito modular (ADR 0004). El Core y las
apps son la **Base Operativa**: ofrecen contexto de cliente, tareas,
herramientas, QA, trazabilidad y UX común. Las capacidades de negocio se suman
como módulos con pipelines y contratos explícitos, pero no se convierten en
servicios separados de forma preventiva.

El primer módulo comercial será el plan de contenido y copys; investigación,
producción visual, distribución y optimización se incorporan solo cuando el
módulo anterior haya superado sus gates técnico, de calidad, UX, costo y demo.
