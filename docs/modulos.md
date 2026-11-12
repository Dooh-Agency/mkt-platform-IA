> **Prioridad actualizada (2026-11-11):** [ADR 0005](decisions/0005-asistente-visual.md) adelanta la experiencia visual completa y la validación con clientes frente al orden histórico de módulos de abajo. Mantener los gates, adaptados al alcance real; las capacidades listadas no se presumen implementadas. Acceso seguro y aislamiento son requisitos previos al uso de datos reales.

# Modelo de módulos

Este documento traduce el ADR 0004 a una guía de desarrollo y validación. El
usuario siempre opera una única plataforma: los módulos son capacidades internas
que se habilitan de forma controlada.

## Módulo 0 — Base Operativa

No se comercializa por separado. Permite que todo módulo posterior reutilice el
contexto del cliente, ejecute trabajo asíncrono, guarde evidencia y sea
verificable.

Incluye:

- Project y Objective como contexto de negocio.
- Memoria y trazabilidad en PostgreSQL.
- Jobs y reintentos con BullMQ.
- Registro de herramientas con permisos explícitos por ejecución.
- QA por tipo de contenido como gate obligatorio.
- Modo Simple para definir intención y Modo Profesional para inspección.
- Cliente demo idempotente (`Café Raíz`) para demo y pruebas manuales.

## Módulos posteriores

| Módulo | Resultado para el cliente | Estado de monetización |
| --- | --- | --- |
| 1. Plan de contenido y copys | Una semana de contenido listo para revisar | Piloto pago posible |
| 2. Research y estrategia | Contenido basado en audiencia, temas y oportunidades | Mayor diferenciación |
| 3. Producción visual | Imágenes, carruseles y piezas visuales aprobables | Amplía el valor del plan |
| 4. Distribución asistida | Contenido preparado, programado y luego publicado | Suscripción más escalable |
| 5. Optimización | Próximos planes ajustados por métricas reales | Retención y mejora continua |

## Contrato mínimo de un módulo

Antes de habilitar un módulo debe existir una definición breve que responda:

1. ¿Qué resultado concreto obtiene el cliente?
2. ¿Qué datos usa y cuáles persiste?
3. ¿Qué herramientas y proveedores puede invocar?
4. ¿Qué jobs componen su pipeline y cómo se reintentan?
5. ¿Qué reglas de QA bloquean su salida?
6. ¿Cómo se observan costo, estado y errores?
7. ¿Cómo se demuestra en Café Raíz sin datos reales?

## Gates de habilitación

Un módulo progresa en este orden: `experimental` → `interno` → `piloto` →
`disponible`.

Para avanzar debe aprobar los cinco gates:

1. **Técnico:** jobs, persistencia y reintentos verificables.
2. **Calidad:** QA específico y pruebas de éxito/fallo.
3. **UX:** se entiende en Modo Simple sin hablar de agentes o prompts.
4. **Costo:** registra proveedor, uso y costo cuando corresponda.
5. **Demo:** se puede recorrer con el Cliente demo.
