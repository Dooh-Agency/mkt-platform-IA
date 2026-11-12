# DOOH — asistente de marketing visual

Aplicación en desarrollo para ayudar a pequeños negocios a decidir qué comunicar y crear publicaciones visuales con su identidad. [Visión](docs/vision.md) · [Plan y diagnóstico](docs/producto/plan.md) · [Hoja de ruta](docs/roadmap.md) · [Arquitectura](docs/architecture.md) · [Decisiones](docs/decisions/).

El repositorio incluye una demostración técnica de generación de texto para Café Raíz. No es todavía un producto multiusuario ni está listo para datos reales. El prototipo visual en `/prototipo` sirve para probar el recorrido con datos ficticios; no guarda ni publica contenido.

Para abrirlo localmente, ejecutar `corepack pnpm --filter @dooh/web dev` y visitar `http://localhost:3000/prototipo`. Usa únicamente datos ficticios.

La demo incluye perfil guiado, sugerencia editorial simulada, propuestas locales, edición y plantillas. No conecta ni analiza redes, no genera con IA en ese flujo y no conserva cambios al recargar. Los detalles, limitaciones y próximos pasos están en [plan de producto](docs/producto/plan.md); el sistema visual está en [DESIGN.md](DESIGN.md) y su muestra en `/sistema-diseno`.

Para trabajar con cualquier asistente, consultar [AGENTS.md](AGENTS.md). Los comandos y dependencias están documentados allí.
