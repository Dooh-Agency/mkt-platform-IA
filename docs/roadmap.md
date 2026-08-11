# Roadmap por Etapas — DOOH Agency AI Platform
## v1.0

> Detalla en entregables técnicos concretos las 4 fases definidas en `docs/vision.md`. Cada fase tiene una **definición de "hecho"** (Definition of Done) verificable — no se avanza a la siguiente fase sin cumplirla. Los costos estimados son los de `docs/vision.md`; acá se agrega el *cómo*.

---

## Fase 1 — Núcleo (actual)

**Objetivo:** tener la base técnica sobre la que todo lo demás se construye, sin producir contenido real todavía.

### Entregables

1. **Repo y stack** — monorepo funcional (ver ADR 0001), CI corriendo lint/test/build en cada PR.
2. **Orquestador mínimo** — capaz de ejecutar un pipeline lineal de 2-3 pasos como jobs asíncronos (ver ADR 0002), con reintentos y logging.
3. **Memoria compartida** — esquema de base de datos inicial (`Project`, `ContentPiece`, `Job` como mínimo) con acceso desde el orquestador.
4. **Registro de herramientas** — forma de declarar "esta función/API es una herramienta disponible para tal agente", aunque solo haya 1-2 herramientas reales al principio.
5. **QA básico** — al menos una validación automática antes de cualquier "publicación" simulada (ej: longitud de texto, formato de archivo).
6. **UX esqueleto** — layout de Modo Simple / Modo Profesional, aunque las pantallas estén vacías o mockeadas.

### Definition of Done

Un pipeline de juguete ("generar un texto corto a partir de un tema") corre de punta a punta: entra por Modo Simple, pasa por el orquestador, ejecuta un job real contra un modelo de IA, se guarda en memoria, pasa QA, y se ve el resultado en el dashboard. **No hace falta que publique en ninguna red todavía.**

### Fuera de alcance en Fase 1

Producción multimedia real (video/audio), publicación en redes, analítica, multiusuario.

---

## Fase 2 — MVP

**Objetivo:** validar el caso de uso ancla (canal de YouTube) de punta a punta con contenido real, con una persona operando en Modo Profesional.

Costo estimado: USD 5.000–15.000 (según `docs/vision.md`).

### Entregables

1. **Intelligence layer real** — research + SEO sobre un tema dado, usando al menos una fuente externa (búsqueda web / API de tendencias).
2. **Guionado** — generación de guion estructurado a partir del research.
3. **Generación multimedia** — al menos: video largo, shorts derivados, artículo, imágenes. Integración con proveedores externos de generación (ver ADR 0001, capa de proveedores intercambiables).
4. **Edición automática mínima** — ensamblado de shorts a partir del video largo (corte, subtítulos), no edición manual.
5. **Publicación** — al menos YouTube + una red social más, con credenciales gestionadas de forma segura.
6. **Dashboard** — estado de cada pieza de contenido (`draft` → `qa_pending` → `published`), sin necesidad de mirar logs crudos.

### Definition of Done

El canal de YouTube de DOOH publica al menos **una tanda completa de contenido** (video + shorts + artículo + posts sociales) generada y publicada por la plataforma, con intervención humana solo en aprobación (QA), no en producción manual.

### Riesgos a monitorear

- Costo real de APIs de generación multimedia por pieza de contenido (puede invalidar el modelo de costos si no se mide desde el día 1).
- Calidad de salida sin curaduría humana fuerte — define qué tan estricto debe ser el QA gate antes de Fase 3.

---

## Fase 3 — Plataforma

**Objetivo:** pasar de "un proyecto que uso yo" a "una plataforma que pueden usar varios negocios", con aprendizaje entre ciclos.

Costo estimado: USD 30.000–80.000.

### Entregables

1. **Multiusuario / multi-proyecto** — aislamiento de datos por `Project`, roles básicos.
2. **Gestión de campañas** — agrupar piezas de contenido bajo objetivos de campaña con calendario.
3. **Analítica agregada** — dashboards de CTR/retención/conversión/ROI por proyecto y por pieza.
4. **Aprendizaje continuo** — el Optimization layer retroalimenta al Intelligence layer de forma automática (ver arquitectura §3, paso 7) sin intervención manual.
5. **Modo Simple productivizado** — onboarding tipo "wizard" para un usuario sin conocimiento técnico, probado con al menos un cliente externo a DOOH.

### Definition of Done

Un negocio externo a DOOH (cliente piloto) opera la plataforma en Modo Simple sin soporte manual del equipo durante al menos un ciclo completo de contenido.

---

## Fase 4 — SaaS

**Objetivo:** comercialización real.

Costo estimado: USD 100.000–250.000.

### Entregables

1. Facturación y planes (billing, límites de uso).
2. Seguridad y compliance a nivel producción (auditorías, cifrado, políticas de datos por cliente).
3. Escalabilidad de la infraestructura de jobs/colas para múltiples proyectos concurrentes.
4. Panel de administración interno (soporte, monitoreo, gestión de cuentas).
5. Estrategia de comercialización y pricing validada con usuarios reales de Fase 3.

### Definition of Done

Un usuario externo puede darse de alta, pagar, y operar la plataforma sin que nadie del equipo de DOOH intervenga manualmente en ningún paso.

---

## Cómo se usa este documento

- Cada fase se cierra con una revisión: ¿se cumplió la Definition of Done? Si no, no se avanza — se ajusta el alcance o se extiende la fase.
- Decisiones técnicas nuevas que surjan durante una fase se documentan como ADR en `docs/decisions/`, no se agregan silenciosamente acá.
- Este roadmap se revisa y actualiza al cierre de cada fase, o antes si un supuesto clave (costo, proveedor, plazo) cambia materialmente.
