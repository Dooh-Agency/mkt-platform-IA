# Plan de producto, diagnóstico y piloto

Actualizado: 2026-11-11. Fuente de trabajo para futuras sesiones. La visión y el orden de prioridades se definen en [visión](../vision.md), [roadmap](../roadmap.md) y [ADR 0005](../decisions/0005-asistente-visual.md).

## Diagnóstico al inicio

Diagnóstico inicial basado en revisión de código, sin ejecución integral. El 2026-11-11 se confirmó que `corepack pnpm` está disponible: pasaron el typecheck web y 8 pruebas existentes del core. No se pudo iniciar el servidor de desarrollo por una restricción del entorno; el prototipo no se verificó visualmente. El repositorio ya tenía cambios locales en el seed, el workspace y migraciones; preservarlos.

| Capacidad | Estado y evidencia |
| --- | --- |
| Web, worker, cola y proveedor de texto | Código implementado, sin verificar en ejecución. Existe pipeline de texto de prueba con persistencia y QA básico. |
| Café Raíz | Demo fija; formulario por objetivo, frecuencia y tema, y listado de títulos/estados. No es onboarding ni experiencia completa de edición. |
| QA | Demo parcial: validaciones de título, longitud y presencia de asset. No valida hechos, marca ni calidad. `approved` automático no equivale a aprobación del cliente. |
| Research, publicación y métricas | Hay modelos de datos; eso no implica investigación, publicación o analítica operativas. |
| Marca, productos, editor, exportación, sugerencias, conexión social | Pendientes para el producto funcional. Un prototipo puede simular parte del flujo sin implementarlas. |
| Usuarios, permisos y aislamiento | Pendientes. El slug de demo es fijo y no hay autenticación ni controles por negocio identificados. |
| Reintentos, seguimiento y costos | Parciales o pendientes: no asumir que una cola y una tabla de jobs resuelven recuperación, costos ni seguimiento de extremo a extremo. |
| Agent SDK | El ADR 0002 lo propone; el código revisado usa llamadas directas al SDK de Anthropic. No asumir que está integrado ni incorporarlo sin justificar la necesidad. |

Aprovechar el monorepo, la separación web/worker, adaptadores de proveedor, esquema inicial y entorno ficticio. Ampliar progresivamente según resultados del piloto.

## Recorrido objetivo

1. Alta progresiva: nombre, rubro, qué ofrece y contacto; logo, colores, tipografía y fotos opcionales y editables después.
2. Inicio con acción principal e ideas pertinentes; pendientes, borradores y biblioteca accesibles.
3. Intención: mostrar producto, promoción, novedad, negocio, pregunta frecuente, fecha especial o idea propia.
4. Solicitar solo datos necesarios: foto, nombre, características, precio opcional y contacto. Nunca completar información comercial no proporcionada como si fuera cierta.
5. Composición de marca con imagen, texto editable y texto de publicación; tocar para cambiar, elegir composición, guardado visible, deshacer y recuperación.
6. Vista por canal/formato orientativa con aclaración de variación; descarga y copia. Luego aprobación humana explícita, publicación o programación cuando estén disponibles.
7. Más adelante: lectura sencilla de resultados reales y recomendaciones con hechos y supuestos diferenciados.

Estados de producto a diseñar: borrador, listo para revisar, aprobado por cliente, programado, publicado y error; distinguir el control automático del acto de aprobación. La secuencia y nombres finales requieren diseño.

## Prueba inicial

Seleccionar 3–5 clientes disponibles, con diferentes habilidades digitales, preferentemente algunos con productos y fotos. El segmento de productos es hipótesis, no decisión cerrada. Recoger autorización apropiada y usar material ficticio si la herramienta aún no protege datos reales.

Observar sin guiar: configurar negocio, cargar o seleccionar foto/logo, crear una pieza, tocar imagen y texto, comprender la vista previa, aceptar o descartar sugerencia y explicar cómo la publicaría. En etapa funcional observar también descarga/copia y recuperación. Registrar tiempo, finalización independiente, ayudas, bloqueos, calidad percibida, comprensión, intención de volver y disposición a pagar. Acordar umbrales antes de realizar la prueba; no presentarlos como resultados.

Preguntar: ¿cómo elegís qué publicar hoy? ¿Qué te lleva tiempo? ¿Esta pieza representa tu marca? ¿Qué esperabas al tocar imagen o texto? ¿Qué revisarías antes de publicar? ¿La sugerencia es pertinente? ¿Qué servicio contratarías y por qué? Registrar evidencia y citas con consentimiento.

DOOH puede preparar propuestas, sugerencias editoriales y recursos manualmente, explicando qué está simulado. Avanzar si los clientes entienden y valoran el recorrido y las dificultades observadas son abordables; si no, iterar la propuesta.

## Proactividad y datos

Empezar con reglas de perfil, calendario por país/rubro revisado y contenido aportado. Registrar aceptación o descarte y preferencias explícitas, visibles y modificables; no requiere ML complejo. No llamar tendencia a una sugerencia editorial. Las tendencias requieren fuente fiable, fecha y verificación. El análisis de redes requiere permiso y datos disponibles; separar hechos, interpretación, recomendación y ausencia de información. No atribuir ventas ni prometer resultados sin evidencia.

## Alternativas técnicas a evaluar

- Plantillas propias acotadas: control de UX; se deben resolver capas, recorte, texto, historial, guardado y exportación.
- Biblioteca de lienzo como Konva: brinda primitivas, no un editor terminado; probar móvil, tipografías y fidelidad de exportación.
- SDK comercial integrado como IMG.LY: probar simplificación, desempeño móvil y licencia/costo.
- Canva: Autofill y exportación pueden apoyar un flujo; verificar planes, permisos, licencias y si editar implica salir a Canva. No asumir edición integrada ni disponibilidad universal.

Antes de seleccionar red/proveedor verificar requisitos vigentes, cuentas y permisos, revisión de app, formatos, programación, métricas, límites/costos, desconexión y recuperación. Primero Instagram/Facebook solo si coincide con los clientes. No publicar sin autorización explícita. Investigar fuentes oficiales de nuevo al decidir.

## Seguridad y operación antes de datos reales

Autenticación, autorización y aislamiento entre negocios en consultas, archivos, trabajos y registros; almacenamiento protegido; autorización y política clara de tratamiento y proveedores; respaldos y recuperación probados; límites de carga, monitoreo, errores comprensibles y soporte designado. Revisar explícitamente los permisos de acceso de DOOH. No postergar aislamiento y seguridad al SaaS.

## Costos y decisiones abiertas

Medir tiempo humano de setup, plantillas y soporte; costos por generación y reintentos, almacenamiento, infraestructura, licencias, integración y mantenimiento; uso mensual, aceptación y margen. Los importes históricos no son presupuestos.

Por decidir: participantes y segmento; primer formato y canal; límites del editor y número de composiciones; recursos disponibles; nivel de servicio y soporte; qué sugerencias serán editoriales; editor/proveedores; métricas y umbrales de validación; precios y alcance del setup. Crear ADR cuando se adopte una decisión no trivial.

## Ajuste del prototipo — 2026-11-11

Fernanda indicó que la vista debe parecerse a una publicación de red social: imagen o video arriba, con texto dentro de la pieza, y mensaje e invitación a actuar claramente separados abajo. El prototipo simula esa estructura; no guarda ni publica. La vista es orientativa y no representa un formato oficial exacto. La carga de videos locales no incorpora subtítulos; validar accesibilidad antes de un piloto funcional.

## Feedback sobre la experiencia — 2026-11-11

Fernanda quiere el nombre del negocio como identidad principal y menos información de implementación en la interfaz. El diferencial debe ser visible: sugerencias relevantes, generación de contenido y herramientas para mejorar o crear imágenes con IA, aplicando criterio profesional de agencia. El prototipo usa ideas editoriales fijas de ejemplo; las acciones de imagen con IA están indicadas como futuras y no hacen llamadas reales. Priorizar en etapas posteriores propuestas fundamentadas en perfil, objetivos y datos confiables; revisión, permisos, costos y control del usuario. No confundir ejemplos con recomendaciones personalizadas ni tendencias reales.

## Primer caso de exploración: Kanso

Kanso desarrolla vajilla en gres para locales gastronómicos. Según Fernanda, generalmente trabaja sobre piezas ya producidas en serie; el desarrollo personalizado para clientes concretos es menos frecuente. Públicos: restaurantes, hoteles, chefs, cafeterías y consumidores particulares. Objetivos iniciales simultáneos: generar consultas, mostrar el trabajo, atraer clientes gastronómicos y vender productos. Estos objetivos se podrán priorizar y cambiar con evidencia; no asumir que uno excluye los demás.

Instagram indicado: https://www.instagram.com/kanso.ar/. El acceso web fue limitado el 2026-11-11; no se inspeccionaron publicaciones ni métricas. La web pública https://www.kanso.ar/ describe diseño de vajilla gastronómica y también menciona diseño a medida; la descripción de Fernanda aclara la importancia relativa actual de las líneas. Validar catálogo, fotos, voz, canales de venta, disponibilidad y públicos prioritarios antes de afirmar detalles. No usar precios, testimonios o características sin confirmación.

Primer recorrido simulado: sugerencia editorial «Presentá una pieza» para público gastronómico basada en el perfil provisto; pedir nombre y atributo opcional, generar una propuesta por plantilla editable, elegir foto y revisar. El ejemplo no usa IA ni análisis de redes; no persiste ni publica. Se advierte antes de reemplazar los textos. Siguientes recorridos posibles: proceso, presentación de la marca y venta; adaptar por objetivo y público, sin asumir métricas.

Análisis posterior autorizado: conectar la cuenta compatible, obtener permisos y datos disponibles, distinguir observación (período y muestra), hipótesis y sugerencia; evitar atribuir resultados comerciales sin evidencia. Guardar decisiones de aceptación/descarte y permitir revisarlas. Las fotos reales solo se usarán en un entorno que cumpla las condiciones de seguridad del piloto.

## Ajuste de edición contextual — 2026-11-11

Fernanda propone unificar la edición alrededor de la publicación. El prototipo agrupa opciones de imagen junto a la pieza y alternativa de texto junto al copy; la vista previa oculta controles. Validar si los usuarios descubren el botón de edición y entienden dónde cambiar la foto y el texto, especialmente en celular. Las herramientas de imagen IA siguen simuladas; no hay persistencia ni publicación. El color solo modifica el fondo sin imagen, no la foto cargada.

## Acceso a herramientas IA y alternativas de texto — 2026-11-11

Fernanda solicita un botón con símbolo de IA sobre la imagen, disponible para pulsar y mostrar «Esta función estará disponible próximamente». En el futuro abrirá opciones para mejorar o crear imagen, animar y crear video, según capacidades reales. Las propuestas de texto deben poder recorrerse y seleccionarse; en el prototipo son ejemplos predefinidos, no generación real. No sustituir el texto actual hasta elegir una propuesta. Validar experiencia, preservación de datos y viabilidad antes de conectar proveedores.

## Texto completo de publicación — 2026-11-11

Se prioriza un único campo editable que reúne mensaje e invitación final. Las propuestas de ejemplo se muestran y seleccionan completas; el texto actual solo se reemplaza al elegir. En una etapa posterior evaluar la acción opcional de cambiar únicamente la invitación y la generación según objetivo, público y contenido. No está implementada generación de texto por IA en el prototipo. Validar comprensión en pruebas con usuarios.

## Alternativas integradas — 2026-11-11

La selección de propuestas está visible desde el inicio. Cada alternativa combina título de imagen y texto completo; al recorrerlas se muestra temporalmente el conjunto, conservando la versión propia en la sesión. «Volver a mi versión» la recupera y «Usar esta propuesta» reemplaza ambos textos para editarlos. Los ejemplos son fijos y no están personalizados ni generados por IA; el guardado persistente aún no existe. Validar con usuarios que distingan explorar de elegir y que puedan recuperar su versión.

## Ideas en carrusel — 2026-11-11

Fernanda pide mostrar las ideas en una fila horizontal para reducir altura, especialmente en celular. El prototipo permite deslizar y usar flechas; se muestra parte de la siguiente tarjeta y una indicación. Validar descubrimiento y uso con teclado y en dispositivos móviles.

## Explorar y editar propuestas — 2026-11-11

Fernanda indica que primero se recorran propuestas y luego se edite la seleccionada. Se evita mostrar dos veces el texto: al explorar se ve solo la propuesta completa y cambia su título sobre la imagen; al seleccionarla se abre la edición. Se conserva la posibilidad de volver a la versión de la sesión y de explorar de nuevo. Generar más propuestas es una función futura indicada como tal.

## Vista de propuestas — 2026-11-11

Fernanda solicitó quitar los íconos decorativos de red y el recuadro adicional de propuestas. El texto queda integrado a la publicación con navegación anterior/siguiente y selección explícita; se conserva el regreso a la versión propia.

## Exploración de plantillas — 2026-11-11

Se prueban tres composiciones: foto protagonista, foto con bloque de color y placa de texto. Cambiar diseño conserva imagen/video y textos en la sesión; la placa oculta el recurso pero lo conserva. El color aparece solo cuando afecta el fondo visible y son ejemplos, no identidad real. El archivo se cambia directamente sobre la pieza. Las miniaturas son representaciones esquemáticas; las plantillas y edición aún no tienen persistencia ni exportación. Validar recortes, texto largo, video y uso móvil antes del piloto.

## Generación local de propuestas — 2026-11-12

El prototipo ofrece formularios para presentar pieza, mostrar proceso e inspirar a un espacio. Existe una ruta exclusiva de desarrollo local preparada para solicitar tres propuestas al proveedor Anthropic y validar su estructura; no está conectada a la interfaz de la demo. La solicitud transmite al proveedor el tema y el detalle ingresados; usar datos de prueba. No publica ni guarda contenido. La clave local estaba vacía durante la revisión: se comprobó el formulario, la validación de entrada y el mensaje de configuración faltante, pero no la generación real ni sus costos. No abrir esta ruta a clientes: faltan autenticación, aislamiento, límites, observabilidad, política de datos y manejo de proveedor para producción. Verificar conectividad, modelo y calidad antes de declarar validado el flujo.

## Prueba del recorrido sin IA — 2026-11-12

Fernanda prioriza corregir el flujo antes de decidir la conexión a IA. El formulario ofrece un solo botón, «Generar propuestas»: en la demo crea localmente tres ejemplos basados en la intención y los datos ingresados, sin IA ni envío al proveedor. La conexión de prueba existe en el código pero no está activa en el flujo; la versión funcional deberá integrar IA con configuración y seguridad apropiadas. Comprobar las tres intenciones y edición antes de avanzar. No guardar datos ni publicar desde el prototipo.

## Perfil del negocio en la demo — 2026-11-12

El prototipo tiene alta editable en cuatro pasos: negocio y oferta, objetivos y audiencia, tono y datos de contacto, identidad con logo, colores y tipografía. Incluye Kanso como ejemplo inicial, permite cerrar y retomar desde «Mi perfil» y conserva datos solo mientras la página siga abierta. El nombre y el logo se muestran en la publicación; los colores se aplican al fondo de las plantillas cuando son visibles. El usuario puede completar lo demás aunque todavía no personalice las recomendaciones o los textos. Instagram se registra solo como texto; no conecta cuentas. Logo de prueba limitado a PNG/JPG/WebP de hasta 3 MB. Las propuestas siguen siendo ejemplos de Kanso y no constituyen IA ni análisis de redes. No hay autenticación, separación entre clientes ni almacenamiento persistente; no usar datos sensibles o reales antes del trabajo de seguridad.

## Análisis de red: acceso en demo — 2026-11-12

Fernanda solicita un botón para analizar la red y sugerir la próxima comunicación o acción. La demo muestra un ejemplo editorial para Kanso que conduce a crear una publicación; aclara que no hay cuenta conectada ni análisis o métricas reales. «Ahora no» solo oculta el ejemplo durante el estado actual. Futuro: conexión autorizada, permisos, disponibilidad por red y fecha, observaciones verificables, separación de datos e hipótesis, privacidad, errores y acciones de aceptar o descartar. No inventar métricas ni sugerir que los datos provienen de Instagram.

## Próximo trabajo

1. Recorrer en celular el alta, el análisis simulado y las tres ideas hasta la selección y edición; registrar problemas de comprensión y accesibilidad.
2. Seleccionar clientes, preparar consentimiento y guía de prueba; acordar criterios. Hasta contar con la base segura, usar únicamente datos y recursos ficticios.
3. Validar editor, plantillas, texto largo, recorte y alcance con una prueba técnica pequeña. Decidir cómo guardar, recuperar, descargar y copiar.
4. Diseñar autenticación, aislamiento y almacenamiento seguro antes del piloto funcional; incorporar personalización real, proveedor de IA y redes por etapas, con permisos, costos y controles verificados.

## Estado de referencia de la demo — 2026-11-12

- `/prototipo` integra el perfil guiado, el acceso a una recomendación editorial simulada y tres ideas con formularios. «Generar propuestas» construye ejemplos locales; navegar alternativas actualiza el título de la pieza y el texto. Al elegir una se puede editar y cambiar la composición.
- Hay tres composiciones, cambio de imagen desde la pieza y controles de color cuando se ven. La identidad y los recursos permanecen en memoria de la página, sin persistencia ni publicación. Los objetivos, tono y red ingresados no personalizan aún las propuestas ni conectan Instagram.
- `/sistema-diseno` muestra la paleta y controles; `DESIGN.md` y `apps/web/app/tokens.css` documentan los criterios visuales. La demo permite cambiar el tema durante la sesión; quedan pendientes revisión móvil y accesibilidad completas y migración del dashboard técnico.
- La ruta local `api/propuestas` es experimental y no está conectada al botón de la demo. No se verificó una generación real y no debe exponerse como servicio para clientes.
- Las notas anteriores conservan la evolución de decisiones; ante diferencias sobre la interfaz, este estado y el código vigente prevalecen. No confundir una simulación con una integración, persistencia, análisis o validación con clientes.
