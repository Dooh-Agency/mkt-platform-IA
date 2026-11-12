# Sistema de diseño — DOOH

**Estado:** primera propuesta para desarrollo, 12 de noviembre de 2026. Basada en el prototipo web existente, la captura compartida y la visión del producto. Los valores del tema oscuro son propuestos y requieren revisión visual. No corresponde a un proyecto Stitch; no hay ID de Stitch.

## 1. Identidad y atmósfera

DOOH es un asistente de marketing para personas que conocen su negocio y usan aplicaciones cotidianas, pero no necesariamente dominan el diseño o las redes. La interfaz debe sentirse serena, cercana y profesional: superficies limpias, poco ruido, jerarquía clara y acciones comprensibles. El contenido del negocio es el protagonista.

Diseñar para celular primero y adaptar después a pantallas mayores. Usar español rioplatense, verbos concretos y decisiones graduales. No exigir conocimientos de prompts, agentes, métricas o diseño para completar una tarea. El control permanece en el usuario: revisar antes de publicar y distinguir prototipos de funciones reales.

### Estado actual del proyecto

- `apps/web/app/prototipo/page.tsx`: prototipo Kanso con recomendaciones ilustrativas, edición, variantes y selección de composiciones. La interfaz usa tokens semánticos junto con algunas medidas y colores específicos de las piezas.
- `apps/web/app/page.tsx`: demo técnica distinta, con colores y controles Tailwind propios.
- `apps/web/app/tokens.css`: variables CSS de esta propuesta, importadas globalmente desde `layout.tsx`.
- El prototipo de publicaciones utiliza tokens semánticos para su interfaz y permite alternar tema durante la sesión. Las piezas y sus miniaturas conservan colores de ejemplo. El dashboard técnico todavía no está migrado; falta validar todos los flujos y accesibilidad antes de considerar completo el sistema.
- El verde y los neutros pertenecen a la **interfaz DOOH**. Los colores, logos, tipografías y recursos de cada marca se guardarán y aplicarán por separado en las piezas; no sustituir la paleta de navegación por la marca de un cliente.

## 2. Paleta semántica

Los nombres representan funciones; los valores pueden variar por tema. Los tonos de estado no se usan como único indicador: acompañar con texto e ícono cuando corresponda.

| Uso | Variable | Claro | Oscuro |
| --- | --- | --- | --- |
| Fondo cálido de aplicación | `--color-background` | #F6F3EF | #131B18 |
| Superficie principal de tarjetas | `--color-surface` | #FFFFFF | #1C2822 |
| Superficie secundaria | `--color-surface-muted` | #F1F5F1 | #27372E |
| Superficie para ideas o selección | `--color-surface-accent` | #E3EEE6 | #30483A |
| Texto principal | `--color-text` | #24332F | #F1F5F1 |
| Texto secundario | `--color-text-muted` | #52615C | #C1CEC4 |
| Acción principal | `--color-primary` | #294F3F | #A7D9B7 |
| Texto sobre acción principal | `--color-text-on-primary` | #FFFFFF | #10271A |
| Borde de controles | `--color-border` | #C4D2C7 | #809589 |
| Separador discreto | `--color-border-subtle` | #E2E8E3 | #52675A |
| Foco de teclado | `--color-focus` | #155DCC | #A8CAFF |
| Éxito / fondo | `--color-success` / `--color-success-surface` | #1D6A3B / #E1F3E6 | #A8E2B8 / #173D26 |
| Advertencia / fondo | `--color-warning` / `--color-warning-surface` | #795000 / #FFF1CE | #FFE0A0 / #48340B |
| Error / fondo | `--color-danger` / `--color-danger-surface` | #A22424 / #FFEDED | #FFB4AB / #531F20 |
| Información / fondo | `--color-info` / `--color-info-surface` | #1555A8 / #E8F1FF | #B2CEFF / #18365F |

Las variables adicionales incluyen hover, activo, deshabilitado, superposición y sombras. Para texto normal, apuntar a contraste de al menos 4,5:1; para indicadores y bordes que identifican controles, al menos 3:1 frente a colores adyacentes. El foco debe ser visible y diferenciarse de la selección. Los pares principales y de estados fueron comprobados numéricamente, no constituyen una auditoría completa de accesibilidad.

### Tema claro y oscuro

Por defecto los tokens siguen la preferencia del sistema. `data-theme="light"` o `data-theme="dark"` en `<html>` permite una elección explícita y prevalece sobre el sistema. El prototipo incluye un selector de tema de sesión; la preferencia no se persiste. No activar modo oscuro en una pantalla hasta migrar también sus superficies, textos, controles, imágenes y estados; evitar mezclar fondos claros fijos con texto oscuro del tema contrario.

## 3. Tipografía

Usar la pila sans-serif del sistema (`--font-sans`), evitando descargas y manteniendo legibilidad nativa. Monoespaciada solo para valores técnicos que el usuario realmente necesite ver. No se ha elegido una tipografía comercial de marca para DOOH.

| Uso | Variable | Tamaño orientativo | Peso |
| --- | --- | --- | --- |
| Ayuda secundaria | `--font-size-caption` | 12 px | 400–500; reservar para textos breves |
| Etiquetas y detalles | `--font-size-small` | 14 px | 400–600 |
| Texto y formularios | `--font-size-body` | 16 px | 400 |
| Texto destacado | `--font-size-lead` | 18 px | 400–600 |
| Título de sección | `--font-size-heading-sm` | 20 px | 600 |
| Título de pantalla | `--font-size-heading-md` / `--font-size-heading-lg` | 24 / 32 px | 600–700 |

Los `rem` respetan el tamaño de texto elegido en el navegador; no bloquear el zoom. Altura de línea normal 1,5 y títulos ajustados 1,2. Evitar mayúsculas extensas y subtítulos diminutos como único elemento de orientación.

## 4. Componentes y comportamiento

- **Acción primaria:** verde profundo en claro, verde suave en oscuro, texto contrastado, bordes redondeados; una acción principal clara por contexto. Mantener estados de foco, hover, carga, error y deshabilitado distinguibles.
- **Acción secundaria:** contorno y superficie neutra, sin competir con la principal. Los iconos por sí solos requieren nombre accesible; no usar iconos decorativos que simulen funciones de una red.
- **Tarjetas:** blancas en claro, verde carbón en oscuro; esquinas generosas de 16 px, borde discreto y sombra suave. Reservar la superficie acentuada para recomendaciones o selecciones.
- **Campos:** etiqueta visible, tipografía mínima recomendada de 16 px en móviles, contorno claro, foco visible, error cercano al campo e instrucciones en lenguaje cotidiano. No usar solo el placeholder como etiqueta.
- **Botones y objetivos táctiles:** mínimo objetivo 44 × 44 px, con separación suficiente; no reducir el área interactiva para lograr una apariencia más compacta. Usar elementos semánticos y navegación por teclado.
- **Recomendaciones:** título, motivo comprensible y acción directa; distinguir dato de hipótesis. No presentar ideas editoriales como tendencias reales ni garantizar resultados.
- **Publicación:** medio arriba y texto abajo. Herramientas de imagen sobre o junto a la pieza con contraste adecuado; navegación de alternativas de texto y diseños independiente. Mantener la versión propia mientras se exploran opciones, y avisar si una acción la reemplaza.
- **Plantillas:** conservar imagen y texto al cambiar de composición; explicar si alguna pieza queda oculta o no entra. Exponer color solo si afecta el diseño elegido. La vista previa es orientativa y puede diferir de la red real.
- **Estados y recuperación:** explicar guardado, progreso y errores; ofrecer una acción de recuperación. No afirmar que una capacidad, IA o publicación existe si es simulada.

### Jerarquía del prototipo

La identidad del negocio encabeza la pantalla; preferencias y acceso técnico se agrupan en «Opciones». Las ideas aparecen en un carrusel compacto y la publicación conserva protagonismo. Los controles anterior/siguiente se ubican junto al contador de propuestas; «Usar esta propuesta» es la acción principal del momento y la vista previa una acción secundaria. Mantener visible el aviso de simulación y diferenciar lo que se puede usar de las acciones futuras. Los controles deben conservar nombres accesibles y áreas táctiles cómodas.

## 5. Composición y espaciado

La escala `--space-*` se basa en 4 px: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48 y 64 px. Usar 16 px como margen mínimo orientativo en móvil, 12–16 px entre elementos relacionados y 24–32 px entre secciones. Ajustar por contexto manteniendo la escala; no confundir estos valores con radios, tamaños tipográficos o bordes.

En teléfono, una columna y controles cercanos al contenido que modifican; evitar desbordes horizontales accidentales. Los carruseles intencionales deben mostrar que hay más contenido y disponer de navegación accesible. En pantallas mayores, ampliar márgenes y mostrar contenido en columnas solo cuando mejore la lectura. La pieza de publicación tiene un ancho de referencia de 470 px y el contenido de la aplicación de 1024 px; no son dimensiones obligatorias para todas las pantallas.

## 6. Reglas de accesibilidad y validación

Comprobar con teclado, lector de pantalla, zoom y preferencia de movimiento reducido. El contenido no debe depender del color, un gesto único o una animación. Ofrecer controles accesibles para carruseles, estado de selección y avisos con semántica apropiada. Verificar contraste sobre fotografías y recortes en ambos temas; los subtítulos y alternativas de contenido multimedia son trabajo pendiente. Respetar áreas seguras del dispositivo y evitar que el teclado o barras del navegador oculten las acciones.

Antes de dar una pantalla por terminada: revisar en ancho móvil y escritorio; temas claro/oscuro; texto largo y traducciones; foco, estados y contraste; carga, fallo y recuperación; y conservación de cambios. Probar con clientes, sin presentar metas propuestas como resultados observados.

## 7. Uso en código y migración

Importación global actual: `apps/web/app/layout.tsx` carga `tokens.css` y luego `globals.css`. Ejemplo: `color: var(--color-text); background: var(--color-surface); padding: var(--space-4); font-family: var(--font-sans);`. Los tokens no dependen de Tailwind; al integrar Tailwind mapear utilidades semánticas a estas variables, evitando duplicar valores en cada componente.

Secuencia sugerida: acordar visualmente la paleta con DOOH; terminar de verificar superficies y controles del prototipo en claro/oscuro y móvil; migrar el dashboard; evaluar persistir la preferencia de tema. Mantener referencias de diseño propias de cada negocio aisladas de los tokens de la plataforma.
