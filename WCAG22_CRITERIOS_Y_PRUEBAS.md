# Criterios WCAG 2.2: ubicación y pruebas

## Plataforma de Comercio Electrónico Adaptativo

Este documento relaciona los criterios WCAG 2.2 asignados al grupo con su implementación actual en el proyecto **Comercio Adaptativo**.

Fecha de revisión: 14 de junio de 2026.

## Estados utilizados

| Estado | Significado |
| --- | --- |
| ✅ Implementado | Existe evidencia directa en el proyecto y puede probarse. |
| 🟡 Parcial | Existe una base funcional, pero falta completar o validar una parte. |
| ➖ No aplica | El proyecto no contiene actualmente el tipo de contenido o interacción al que se refiere el criterio. |

> Un estado “Implementado” describe la evidencia encontrada en el código. La conformidad final debe confirmarse mediante pruebas manuales, herramientas automáticas y, cuando corresponda, un lector de pantalla.

## Preparación para las pruebas

Desde la raíz del proyecto:

```bash
npm install
npm run dev
```

Abrir la URL que indique Vite, normalmente `http://localhost:5173`.

Comprobaciones técnicas:

```bash
npm run lint
npm run build
```

Rutas principales:

| Pantalla | Ruta |
| --- | --- |
| Inicio | `/` |
| Productos | `/products` |
| Comparación | `/compare` |
| Carrito | `/cart` |
| Checkout | `/checkout` |
| Inicio de sesión | `/login` |
| Registro | `/register` |
| Perfil | `/profile` |
| Pedidos | `/orders` |
| Accesibilidad | `/accessibility` |
| Mapa del sitio | `/site-map` |

---

# Mora Palma Josep

## Navegación y consistencia

| Criterio | Estado | Ubicación o evidencia | Cómo probarlo |
| --- | --- | --- | --- |
| **2.4.1 Evitar bloques repetitivos** | ✅ | `src/components/layout/AppLayout.tsx` incluye el enlace “Saltar al contenido principal” y el elemento `<main id="main-content">`. Los estilos están en `AppLayout.module.css`. | Recargar cualquier página, pulsar `Tab` una vez y comprobar que aparece el enlace. Pulsar `Enter` y verificar que el foco llega al contenido principal. |
| **2.4.2 Titulado de páginas** | ✅ | `src/components/layout/AppLayout.tsx` contiene `getPageTitle()` y actualiza `document.title` al cambiar la ruta. | Navegar por Inicio, Productos, Carrito, Checkout y Accesibilidad. Comprobar que la pestaña cambia, por ejemplo: “Productos \| Comercio Adaptativo”. |
| **2.4.4 Propósito de los enlaces** | ✅ | Navbar, Footer, Home, tarjetas de productos y estados vacíos utilizan textos como “Ver productos”, “Continuar al pago” o etiquetas ARIA específicas. | Recorrer los enlaces con `Tab` y verificar que cada texto permite entender su destino sin depender únicamente de su posición. |
| **2.4.5 Múltiples vías de navegación** | ✅ | Navegación principal en `Navbar.tsx`, navegación secundaria en `Footer.tsx`, accesos del Home y mapa completo en `SiteMapPage.tsx`. | Llegar a Productos desde el navbar, desde el Home, desde el footer y desde `/site-map`. |
| **2.4.6 Encabezados y etiquetas** | ✅ | Las páginas usan `h1`, `h2`, `aria-labelledby`, `<label htmlFor>` y nombres descriptivos. Evidencias en `HomePage.tsx`, `ProductsPage.tsx`, páginas de autenticación y `CheckoutPage.tsx`. | Inspeccionar la estructura con el panel de accesibilidad del navegador. Confirmar un solo encabezado principal por página y etiquetas comprensibles en los formularios. |
| **3.2.1 Al recibir el foco** | ✅ | Los controles no navegan ni envían formularios al recibir foco. `FeatureStackAnimation.tsx` solo actualiza una selección visual accesible. | Navegar únicamente con `Tab` y `Shift+Tab`. Confirmar que ninguna página cambia y ningún formulario se envía solo por enfocar un control. |
| **3.2.3 Navegación coherente** | ✅ | `AppLayout.tsx` monta el mismo `Navbar` y `Footer` alrededor de todas las rutas. El orden del menú permanece estable. | Abrir al menos cinco rutas y comprobar que Inicio, Productos, Carrito, Pedidos y Accesibilidad conservan el mismo orden. |
| **3.2.4 Identificación consistente** | ✅ | Las acciones repetidas mantienen nombres e iconos: agregar al carrito, comparar, eliminar, iniciar sesión y accesibilidad. | Comparar las tarjetas del catálogo con el detalle del producto y confirmar que “Agregar” conserva propósito y representación. |
| **3.2.6 Ayuda consistente** | 🟡 | El enlace de soporte aparece en `Footer.tsx` y dentro del resumen de `CheckoutPage.tsx`, mediante el mismo correo. Todavía no existe una página completa de Ayuda/Soporte. | Abrir `/checkout` y revisar el footer. Confirmar que ambos enlaces usan `soporte@comercioadaptativo.local`. Pendiente: crear una ruta de ayuda visible de forma consistente. |

## Formularios, errores y estados

| Criterio | Estado | Ubicación o evidencia | Cómo probarlo |
| --- | --- | --- | --- |
| **3.2.2 Al recibir entradas** | ✅ | La búsqueda y los filtros de `ProductsPage.tsx` actualizan resultados sin navegación inesperada. Los formularios solo avanzan mediante botones explícitos. | Escribir en la búsqueda, cambiar categoría y completar campos. Comprobar que la ruta no cambia automáticamente. |
| **3.3.1 Identificación de errores** | ✅ | Login, registro y perfil usan `aria-invalid`, `aria-describedby` y `role="alert"`. Checkout añade errores por campo y un resumen enlazado. | Enviar `/checkout` vacío. Verificar que aparece el resumen, que cada campo inválido queda marcado y que los mensajes indican qué dato corregir. |
| **3.3.2 Etiquetas o instrucciones** | ✅ | Formularios de autenticación, filtros y checkout incluyen etiquetas asociadas, instrucciones, ejemplos y `autocomplete`. | Pulsar sobre cada etiqueta y comprobar que enfoca el campo correspondiente. Revisar que los campos obligatorios explican el dato esperado. |
| **3.3.3 Sugerencias ante errores** | ✅ | `validateCheckoutFields()` en `checkoutService.ts` devuelve sugerencias como longitud mínima, formato de correo y teléfono permitido. Registro informa si las contraseñas no coinciden. | Introducir correo inválido, dirección corta y teléfono con letras en `/checkout`; enviar y comprobar que cada mensaje indica cómo corregirlo. |
| **3.3.4 Prevención de errores** | ✅ | `CheckoutPage.tsx` incorpora una etapa de revisión antes de “Confirmar y registrar pedido”, con opción “Editar datos”. | Completar checkout, pulsar “Revisar pedido”, verificar todos los datos y volver con “Editar datos” antes de confirmar. |
| **3.3.7 Entrada redundante** | 🟡 | Los datos se conservan al pasar de la etapa de datos a revisión y al volver a editar dentro del checkout. Aún no se rellenan automáticamente desde el perfil autenticado. | Completar checkout, entrar en revisión y volver a editar. Confirmar que los campos mantienen sus valores. Pendiente: reutilizar datos ya guardados en el perfil. |
| **3.3.8 Autenticación accesible** | ✅ | `LoginPage.tsx` y `RegisterPage.tsx` permiten escribir o pegar credenciales, mostrar la contraseña y usar gestores mediante `autocomplete`. No existen CAPTCHA ni pruebas cognitivas. | Navegar con teclado, pegar una contraseña, usar el botón mostrar/ocultar y comprobar `autocomplete="current-password"` o `new-password`. |
| **4.1.3 Mensajes de estado** | ✅ | Catálogo, carrito, detalle, comparación, accesibilidad y formularios utilizan `role="status"`, `role="alert"` o `aria-live`. | Agregar un producto al carrito, modificar cantidad y cambiar una preferencia. Con NVDA o Narrador, comprobar que el resultado se anuncia sin mover obligatoriamente el foco. |

---

# Anderson Marlon Alvia Mero

## Estado actualizado del bloque asignado

Última verificación: 14 de junio de 2026.

| Resultado | Cantidad | Observación |
| --- | ---: | --- |
| ✅ Implementado | 11 | Existe evidencia directa en componentes, estilos y recursos públicos del proyecto. |
| 🟡 Parcial | 5 | Requiere una mejora adicional o una validación manual documentada para declarar conformidad completa. |
| ➖ No aplica | 2 | La aplicación no contiene actualmente ese tipo de contenido. |

> La incorporación de `AccessiblePromoVideo.tsx` actualiza la evidencia multimedia del Home. El componente ofrece controles nativos, subtítulos en español, pista de descripciones y una transcripción completa visible y descargable.

## Alternativas textuales y multimedia

| Criterio | Estado | Ubicación o evidencia | Cómo probarlo |
| --- | --- | --- | --- |
| **1.1.1 Contenido no textual** | ✅ | Las imágenes informativas de productos usan el nombre como `alt`; el logo principal del Home tiene alternativa textual; iconos, logos repetidos y la torre visual decorativa usan `aria-hidden="true"` o `alt=""`. Evidencias en `HomePage.tsx`, `ProductCard.tsx`, `ProductDetailPage.tsx`, `Navbar.tsx`, `Footer.tsx` y `AccessiblePromoVideo.tsx`. | Desactivar imágenes o revisar el árbol de accesibilidad. Confirmar que los productos conservan su nombre y que los iconos decorativos no generan anuncios repetidos. |
| **1.2.1 Solo audio y solo vídeo (grabado)** | ➖ | El recurso promocional contiene audio y vídeo sincronizados, por lo que no pertenece a las categorías “solo audio” o “solo vídeo”. Como apoyo adicional, dispone de transcripción en `AccessiblePromoVideo.tsx` y `/media/comercio-adaptativo-transcripcion.txt`. | Abrir el Home y desplegar “Leer transcripción del video”. Confirmar que el contenido hablado está disponible como texto y que también puede descargarse. |
| **1.2.2 Subtítulos grabados** | ✅ | `src/components/media/AccessiblePromoVideo.tsx` incluye `<track kind="subtitles" default>` enlazado con `/media/comercio-adaptativo-subtitulos.vtt`, identificado en español mediante `srcLang="es"`. | Reproducir el video del Home, activar CC/subtítulos desde los controles nativos y comprobar que las cinco intervenciones aparecen en el momento correspondiente. |
| **1.2.3 Audiodescripción o alternativa multimedia** | ✅ | El componente incorpora `<track kind="descriptions">` con `/media/comercio-adaptativo-audiodescripcion.vtt` y una alternativa multimedia completa mediante `<details>/<summary>`. La transcripción mantiene el contenido esencial en HTML real. | Desplegar “Leer transcripción del video”, recorrerla con teclado y lector de pantalla, y compararla con la narración y las escenas mostradas en el video. |
| **1.2.4 Subtítulos en directo** | ➖ | No existen transmisiones en directo. | Aplicará únicamente si se añaden emisiones en vivo. |
| **1.2.5 Audiodescripción grabada** | 🟡 | Existe `/media/comercio-adaptativo-audiodescripcion.vtt` y está enlazado mediante `kind="descriptions"`. Sin embargo, el soporte para reproducir pistas VTT de descripción varía entre navegadores y no garantiza una narración audible. Falta una versión del MP4 con audiodescripción integrada o una pista de audio seleccionable para declarar conformidad completa. | Probar el video en Chrome, Firefox y Edge con tecnología de apoyo. El criterio solo pasa a ✅ cuando las descripciones visuales puedan escucharse durante el video, no únicamente leerse. |

## Color, contraste y texto

| Criterio | Estado | Ubicación o evidencia | Cómo probarlo |
| --- | --- | --- | --- |
| **1.4.1 Uso del color** | ✅ | Los estados usan texto, iconos, bordes y atributos además del color: stock, errores, selección para comparar, pasos del checkout y preferencias. | Activar comparación, provocar errores y revisar stock. Confirmar que el significado se entiende leyendo el texto incluso en escala de grises. |
| **1.4.3 Contraste mínimo (4.5:1)** | 🟡 | Las variables de color y el modo de alto contraste están definidos en `src/index.css`; los CSS Modules, incluido `AccessiblePromoVideo.module.css`, adaptan texto y superficies. Falta registrar mediciones manuales de todas las combinaciones principales para confirmar la relación mínima de `4.5:1`. | Medir texto normal, enlaces, botones, mensajes y texto del video con Accessibility Insights o Colour Contrast Analyser. Repetir en modo normal y Alto contraste y guardar los resultados. |
| **1.4.4 Cambio de tamaño del texto (200%)** | ✅ | Diseño basado en `rem`, layouts flexibles y breakpoints. `/accessibility` incluye tamaños Grande y Muy grande. | Aplicar zoom del navegador al `200%` en Home, Productos, Login y Checkout. Confirmar que no desaparece contenido ni funcionalidad. |
| **1.4.5 Imágenes de texto** | ✅ | El contenido esencial está escrito en HTML. La imagen de marca se utiliza como logotipo, excepción permitida para identidad visual. | Desactivar CSS o inspeccionar encabezados y botones; confirmar que los textos funcionales no forman parte de imágenes. |
| **1.4.10 Reajuste de elementos** | ✅ | CSS responsive en todos los módulos; se probó el Home a `320px` sin desplazamiento horizontal. `index.css` incluye protección adicional para palabras largas. | Usar viewport de `320 × 640` o zoom `400%` a 1280 CSS px. Revisar Home, catálogo, carrito, checkout y autenticación sin scroll horizontal de página. |
| **1.4.11 Contraste no textual** | 🟡 | Controles, bordes, foco y estados activos tienen diferenciación visual en `index.css`, `UiComponents.module.css` y los módulos de cada feature. El reproductor también presenta un foco visible de `4px`. Falta documentar mediciones que acrediten `3:1` en todos los componentes esenciales. | Medir bordes de inputs, foco, botones, radios, controles de cantidad, reproductor y estados seleccionados respecto al fondo adyacente. Guardar evidencia de cada resultado igual o superior a `3:1`. |
| **1.4.12 Espaciado del texto** | ✅ | `/accessibility` activa `data-text-spacing="increased"`; `index.css` modifica letras, palabras y líneas y permite que controles crezcan. | Activar “Espaciado ampliado”. Recorrer todas las páginas y confirmar que no se corta texto ni se superponen controles. |
| **1.4.13 Contenido al pasar el cursor o recibir foco** | 🟡 | El menú de perfil se abre por botón y se cierra con `Escape`. `Tooltip.tsx` aparece con hover o foco y es persistente mientras se mantiene la interacción, pero todavía no incorpora cierre explícito con `Escape`. | Abrir el menú de perfil y pulsar `Escape`. Probar tooltips cuando se integren en pantallas. Pendiente: permitir descartar cada tooltip sin mover el cursor o el foco. |

## Tiempo, movimiento y orientación

| Criterio | Estado | Ubicación o evidencia | Cómo probarlo |
| --- | --- | --- | --- |
| **1.3.4 Orientación de la pantalla** | ✅ | No hay bloqueo de orientación. Los layouts responden mediante media queries. | Girar un teléfono o emular portrait/landscape. Confirmar que la aplicación funciona en ambas orientaciones. |
| **1.4.2 Control del audio** | ✅ | `AccessiblePromoVideo.tsx` no utiliza `autoplay` y conserva `<video controls>`, permitiendo reproducir, pausar, silenciar y modificar el volumen mediante controles nativos. | Recargar el Home y confirmar que no se reproduce sonido automáticamente. Iniciar el video y comprobar pausa, volumen y silencio con ratón y teclado. |
| **2.2.1 Tiempo ajustable** | ✅ | No existen sesiones con límite, cuenta regresiva ni formularios que expiren. | Permanecer varios minutos en formularios y comprobar que los datos no desaparecen por tiempo. |
| **2.2.2 Poner en pausa, detener u ocultar** | 🟡 | `FeatureStackAnimation.tsx` pausa la rotación con hover o foco y la detiene con `prefers-reduced-motion` o la opción Movimiento reducido. Falta un botón visible permanente de pausa/reanudación. | Observar la sección “Todo lo importante…” durante más de 5 segundos; enfocar una característica y comprobar que se pausa. Activar Movimiento reducido. Pendiente: añadir control visible de pausa. |

---

# Delgado Parraga Rolando

## Estructura semántica e idioma

| Criterio | Estado | Ubicación o evidencia | Cómo probarlo |
| --- | --- | --- | --- |
| **1.3.1 Información y relaciones** | ✅ | Uso de `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`, listas, tablas con encabezados, `fieldset`, `legend`, `label` y listas de descripción. | Desactivar CSS y comprobar que la estructura y relaciones siguen siendo comprensibles. Revisar con el árbol de accesibilidad. |
| **1.3.2 Secuencia significativa** | ✅ | El orden del DOM coincide con el orden visual. Checkout presenta pasos, formulario y resumen en una secuencia lógica; el CSS cambia columnas sin alterar el DOM. | Navegar con `Tab` y usar lector de pantalla. Confirmar que el orden sigue la lectura visual en escritorio y móvil. |
| **1.3.3 Características sensoriales** | ✅ | Las instrucciones usan nombres y acciones, no dependen únicamente de “el botón de la derecha”, forma, sonido o color. | Leer instrucciones y errores sin observar el diseño. Confirmar que indican el campo o la acción por su nombre. |
| **1.3.5 Identificación del propósito del campo** | ✅ | Login, registro, perfil y checkout usan `type`, `name` y `autocomplete` como `email`, `name`, `tel`, `street-address` y `address-level2`. | Inspeccionar los campos o probar autocompletado del navegador y un gestor de contraseñas. |
| **3.1.1 Idioma de la página** | ✅ | `index.html` declara `<html lang="es">`. | Inspeccionar el elemento raíz o utilizar un lector de pantalla y comprobar pronunciación en español. |
| **3.1.2 Idioma de las partes** | ➖ | El contenido visible está redactado en español; no existen bloques extensos en otro idioma que requieran `lang` propio. | Si se añade texto en otro idioma, marcarlo con `lang`, por ejemplo `<span lang="en">Gaming</span>`. |
| **4.1.2 Nombre, función y valor** | ✅ | Botones iconográficos incluyen `aria-label`; menús usan `aria-expanded`; selecciones usan `aria-pressed`; modal, switch, alertas y estados tienen roles apropiados. | Revisar con NVDA/Narrador los botones mostrar contraseña, cantidad, eliminar, comparar, menú de perfil y preferencias. Confirmar nombre, rol y estado. |

## Teclado y foco

| Criterio | Estado | Ubicación o evidencia | Cómo probarlo |
| --- | --- | --- | --- |
| **2.1.1 Teclado** | ✅ | Todas las acciones utilizan enlaces, botones y controles nativos. La torre interactiva del Home utiliza botones y responde al foco. | Desconectar el ratón y completar navegación, búsqueda, comparación, carrito, login y checkout usando teclado. |
| **2.1.2 Sin trampas para el foco** | ✅ | El menú de perfil se cierra con `Escape`; `Modal.tsx` contiene el foco mientras está abierto, se cierra con `Escape` y devuelve el foco al elemento anterior. | Abrir menú o modal, recorrer con `Tab`, pulsar `Escape` y comprobar que es posible continuar por la página. |
| **2.1.4 Atajos de teclado de caracteres** | ➖ | La aplicación no implementa atajos activados por una sola letra, número o signo. | Pulsar letras mientras ningún campo tiene foco y confirmar que no se ejecutan acciones. |
| **2.4.3 Orden del foco** | ✅ | El DOM mantiene una secuencia predecible. `AppLayout.tsx` mueve el foco al contenido principal después de una navegación. Checkout mueve el foco al resumen de errores o al título del paso. | Recorrer cada pantalla con `Tab`; confirmar una secuencia lógica y verificar el foco después de cambiar de ruta o enviar checkout con errores. |
| **2.4.7 Foco visible** | ✅ | `src/index.css` define un contorno global de `3px`; componentes específicos refuerzan foco en controles personalizados. | Navegar con `Tab` por todas las páginas y comprobar que siempre se distingue visualmente el elemento enfocado. |
| **2.4.11 Foco no oculto (mínimo)** | ✅ | `html` y elementos con `id` usan compensación para el navbar sticky; el contenido recibe foco y se desplaza al inicio al cambiar de ruta. | Navegar por teclado detrás del encabezado fijo y activar enlaces internos del resumen de errores. Confirmar que el control enfocado no queda completamente tapado. |

## Puntero, gestos y táctil

| Criterio | Estado | Ubicación o evidencia | Cómo probarlo |
| --- | --- | --- | --- |
| **2.5.1 Gestos del puntero** | ✅ | No se requieren gestos multipunto ni trayectorias. Las acciones se realizan con clic o toque simple. | Probar catálogo, cantidad, comparación y checkout con un solo toque. |
| **2.5.2 Cancelación del puntero** | 🟡 | La mayoría de acciones se ejecuta con `onClick`, es decir, al soltar el puntero. `Modal.tsx` cierra el fondo mediante `onMouseDown`, lo que debe cambiarse a `onClick` antes de declarar conformidad completa. | Mantener presionado sobre un botón, mover fuera y soltar: no debe activarse. Pendiente: repetir la prueba sobre el fondo de un modal después de corregirlo. |
| **2.5.3 Etiqueta en el nombre** | ✅ | El nombre accesible conserva el texto visible. Los botones solo icono usan etiquetas que describen exactamente su acción, por ejemplo “Eliminar [producto]” o “Mostrar contraseña”. | Con lector de pantalla, comparar el texto visible con el nombre anunciado. Probar también comandos de voz usando la etiqueta visible. |
| **2.5.4 Actuación por movimiento** | ➖ | No se usan acelerómetro, giros, sacudidas ni movimientos del dispositivo. | Confirmar que todas las acciones tienen controles visibles y no dependen de mover el dispositivo. |
| **2.5.7 Movimiento de arrastre** | ➖ | No existen funciones que requieran arrastrar elementos. | Confirmar que carrito, comparación y controles se operan con clic/toque simple. Si se añade drag-and-drop, deberá existir alternativa sin arrastre. |

---

# Pruebas transversales recomendadas

## 1. Prueba completa con teclado

1. Recargar la página.
2. No usar el ratón.
3. Pulsar `Tab`, `Shift+Tab`, `Enter`, `Espacio` y `Escape`.
4. Recorrer navbar, formularios, productos, carrito, checkout, accesibilidad y footer.
5. Verificar foco visible, orden lógico, ausencia de trampas y objetivos operables.

## 2. Prueba con lector de pantalla

En Windows se puede usar **NVDA** o **Narrador**:

1. Revisar encabezados, regiones y enlaces.
2. Completar login, registro y checkout.
3. Provocar errores.
4. Agregar y eliminar productos.
5. Confirmar que alertas, cambios de cantidad y mensajes de estado se anuncian.

## 3. Prueba responsive y reajuste

Probar como mínimo:

- `320 × 640`
- `768 × 1024`
- `1280 × 720`
- Zoom de navegador al `200%`
- Orientación vertical y horizontal

No debe existir pérdida de información, superposición ni desplazamiento horizontal de toda la página.

## 4. Prueba del menú de accesibilidad

En `/accessibility`:

1. Activar texto Grande y Muy grande.
2. Activar Alto contraste.
3. Activar Espaciado ampliado.
4. Activar Movimiento reducido.
5. Recargar la página y confirmar persistencia mediante `localStorage`.
6. Restablecer preferencias.

## 5. Herramientas automáticas

Ejecutar en las páginas principales:

- Lighthouse Accessibility.
- axe DevTools.
- Accessibility Insights for Web.
- WAVE.

Las herramientas automáticas ayudan a encontrar problemas, pero no sustituyen las pruebas manuales de teclado, foco, comprensión, mensajes y lector de pantalla.

# Pendientes prioritarios detectados

1. Crear una página completa y persistente de Ayuda/Soporte para reforzar **3.2.6**.
2. Precargar datos del perfil en checkout para completar **3.3.7**.
3. Añadir una versión del video con audiodescripción narrada o una pista de audio seleccionable para completar **1.2.5**.
4. Permitir cerrar tooltips con `Escape` para completar **1.4.13**.
5. Añadir un botón visible de pausa/reanudación a la animación del Home para completar **2.2.2**.
6. Cambiar el cierre del fondo de `Modal.tsx` de `onMouseDown` a `onClick` para completar **2.5.2**.
7. Ejecutar una auditoría manual de contraste con valores medidos para completar **1.4.3** y **1.4.11**.
