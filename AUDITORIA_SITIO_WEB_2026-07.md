# Auditoría del sitio web — www.gmvsolutions.es (REELEVO)

**Fecha:** 29 de julio de 2026
**Alcance:** dominio completo, 68 páginas HTML del build de producción (`.vercel/output/static`)
**Método:** revisión del código fuente (`src/`), análisis automatizado del HTML generado tras `npm run build`, y contraste con la checklist de [Auditoria_Sitio_Web.md](Auditoria_Sitio_Web.md)
**Leyenda de estado:** ✅ OK · ⚠️ Revisar · ❌ Falla

> **Nota sobre el método.** Todo lo marcado como ❌ está verificado sobre el HTML compilado, no inferido. Lo que requiere datos de campo (Core Web Vitals reales, comportamiento de Cookiebot en runtime, contenido del contenedor GTM) queda como ⚠️ con la comprobación concreta que hay que hacer.

---

## Resumen ejecutivo

El sitio está **muy por encima de la media en SEO técnico y en calidad de contenido**: 68 páginas, sin títulos ni descripciones duplicadas, sin enlaces internos rotos, sitemap curado coherente con los `noindex`, JSON-LD en todas las páginas, cabeceras de seguridad completas y una media de 1.399 palabras por página. El trabajo de los sprints anteriores se nota.

Los problemas serios no están en el SEO: están en **rendimiento percibido, medición de conversión y accesibilidad**.

### Los cinco hallazgos que hay que atacar primero

| # | Hallazgo | Impacto | Sección |
|---|---|---|---|
| 1 | El *splash* de entrada oculta la web **4,32 s** en la primera visita de cada sesión | LCP en rojo para la mayoría de sesiones reales | [3](#3-rendimiento-técnico) |
| 2 | **299 CTAs sin medir**, incluido el botón principal del header en las 68 páginas | GA4/Ads miden una fracción de la conversión real | [7](#7-conversión-y-analítica) |
| 3 | Los mega-menús **no son accesibles por teclado**: 24 enlaces inalcanzables en escritorio | Fallo WCAG 2.1.1 (nivel A) | [8](#8-accesibilidad) |
| 4 | **~3,0 MB de PNG** en el carrusel de la home, sin WebP/AVIF ni `srcset` | Coste de datos y LCP en móvil | [3](#3-rendimiento-técnico) |
| 5 | La política de cookies **no declara Microsoft Clarity ni E-goi**, que sí cargan en todas las páginas | Riesgo RGPD/LSSI-CE real | [10](#10-cumplimiento-legal) |

### Puntuación por bloque

| Bloque | Nota | Comentario |
|---|---|---|
| 1. Primera impresión y branding | 8/10 | Identidad sólida y coherente; el splash juega en contra |
| 2. UX y navegación | 6/10 | Arquitectura excelente, ejecución con dos bugs y sin buscador |
| 3. Rendimiento técnico | 4/10 | Splash + imágenes sin optimizar anulan un buen trabajo de CSS |
| 4. SEO on-page | 9/10 | El punto más fuerte del sitio |
| 5. Contenido | 8/10 | Copy de mucho nivel; falta prueba social y citar fuentes |
| 6. Confianza y credibilidad | 6/10 | Legales bien, pero sin contacto visible ni prueba social |
| 7. Conversión y analítica | 4/10 | La instrumentación existe pero cubre el 41% de los CTAs |
| 8. Accesibilidad | 4/10 | Fallos de nivel A: teclado, contraste, carrusel |
| 9. Seguridad | 6/10 | Cabeceras ejemplares; 9 CVEs altos en dependencias de build y sin *rate limiting* |
| 10. Cumplimiento legal | 6/10 | Textos correctos, inventario de cookies desactualizado |

---

## 1. Primera impresión y branding

| Punto a revisar | Estado | Notas |
|---|---|---|
| Coherencia de colores, tipografías y logo con la identidad corporativa | ✅ OK | Sistema de diseño consolidado en [global.css](src/styles/global.css#L7-L25): paleta de 14 tokens, tres tipografías con rol definido (Oswald titulares / DM Sans texto / DM Mono etiquetas). Aplicación consistente en las 68 páginas. |
| Calidad y originalidad de las imágenes | ✅ OK | Todas las imágenes son capturas reales del producto (15 en `public/screenshots/`) más una foto de fondo industrial. Cero banco de imágenes genérico. Es un diferencial frente a la competencia del sector. |
| Propuesta de valor clara y visible en los primeros 5 segundos | ❌ **Falla** | El contenido es excelente —«Controla tu planta sin la complejidad de un sistema MES» con subtítulo concreto y tres pruebas numéricas— pero **no se ve durante los primeros 4,32 s**. Ver hallazgo 1 en la sección 3. Sin el splash, este punto sería un OK claro. |
| Consistencia del tono de voz en todos los textos | ✅ OK | Registro uniforme: directo, en segunda persona, sin jerga de consultoría. Los escenarios («Es martes a las 6:30. Javi lleva 15 años en esa máquina») son el mejor activo de copy del sitio. |

---

## 2. UX y navegación

| Punto a revisar | Estado | Notas |
|---|---|---|
| Menú claro, con jerarquía lógica de contenidos | ✅ OK | Cuatro entradas de primer nivel con dos mega-menús de dos columnas ([Header.astro](src/components/Header.astro#L11-L163)). Agrupación por *plataforma / caso de uso / rol* correcta para 68 páginas. |
| CTAs visibles, contrastados y repetidos | ✅ OK | Naranja `#F4521E` sobre negro = 5,7:1. Dos intenciones bien diferenciadas: registro (frío→producto) y diagnóstico (frío→lead). Repetición adecuada sin saturar. |
| Formularios simples, sin campos innecesarios | ⚠️ Revisar | Solo hay un formulario en todo el sitio ([NewsletterModal.astro](src/components/NewsletterModal.astro)) con 3 campos + consentimiento: diseño correcto. Pero **está apagado**: se renderiza solo si `PUBLIC_NEWSLETTER_MODAL === 'on'` y no aparece en el build actual. Hoy el sitio **no tiene ningún formulario de captación propio**; todo depende de subdominios externos. |
| Experiencia adaptada a móvil | ❌ **Falla** | Los *breakpoints* son correctos (960/900/600 px), pero **el menú móvil tiene un bug de JavaScript**: los 28 enlaces llaman a `onclick="closeMobile()"` y esa función **no existe en el HTML compilado** (0 coincidencias de `function closeMobile`). Astro compila el `<script>` de [Header.astro:231-243](src/components/Header.astro#L231-L243) como módulo con ámbito propio, así que la función nunca llega al ámbito global. Cada toque en el menú lanza un `ReferenceError` y el menú no se cierra visualmente antes de navegar. |
| Buscador interno si el volumen de contenido lo justifica | ⚠️ Revisar | **No existe** (0 elementos `role="search"` o `type="search"`). Con 68 páginas y un blog de 20 artículos, ya lo justifica. Pangea o un índice estático generado en *build* resolverían esto sin backend. |
| Tiempo hasta encontrar la información clave (test de "3 clics") | ✅ OK | Toda página de producto, caso de uso, rol y sector está a ≤2 clics desde la home. Migas de pan visibles y coherentes con el JSON-LD ([Breadcrumbs.astro](src/components/Breadcrumbs.astro)). |

### Detalle adicional

- **Duplicado del menú en el DOM.** El header (28 enlaces) y el menú móvil (28 enlaces) se renderizan siempre los dos. Son ~56 enlaces antes del contenido en cada una de las 68 páginas. Sin *skip link*, un usuario de teclado o lector de pantalla los recorre enteros en cada navegación (ver sección 8).
- **Atributo `class` duplicado.** [Header.astro:144](src/components/Header.astro#L144) emite `<span class="nav-dropdown-trigger" class={...}>`. En el HTML compilado queda literalmente `<span class="nav-dropdown-trigger" class>`: HTML inválido y el resaltado `nav-active` de «Recursos» **nunca funciona**.
- **Sin página 404 personalizada.** No existe `src/pages/404.astro` ni `404.html` en el build. Cualquier enlace roto externo, URL antigua o error tipográfico cae en la página genérica de Vercel: sin cabecera, sin navegación y sin marca.

---

## 3. Rendimiento técnico

| Punto a revisar | Estado | Notas |
|---|---|---|
| Velocidad de carga (Core Web Vitals: LCP, CLS, INP) | ❌ **Falla** | Ver los tres hallazgos de abajo. |
| Imágenes optimizadas y en formatos modernos (WebP/AVIF) | ❌ **Falla** | **0 imágenes en WebP o AVIF.** Los 12 formatos detectados en el HTML son PNG. Ver detalle. |
| Sin errores 404 ni enlaces rotos | ✅ OK | 0 enlaces internos rotos sobre ~1.900 enlaces analizados. Sitemap sin URLs muertas y sin `noindex` dentro. Único caso especial: `javascript:Cookiebot.renew()` en la política de cookies (funciona, pero conviene sustituirlo por un `<button>`). |
| HTTPS correctamente configurado, sin contenido mixto | ✅ OK | 0 enlaces `http://`. HSTS con `max-age=63072000; includeSubDomains; preload` en [vercel.json](vercel.json). |
| Compatibilidad entre navegadores y dispositivos | ⚠️ Revisar | `backdrop-filter` se usa en header y menú móvil **sin el prefijo `-webkit-`** (0 coincidencias en global.css): en Safari anterior a la 18 el desenfoque no se aplica. No rompe nada —el fondo sólido `rgba(10,10,10,.92)` sigue ahí— pero degrada el acabado. |

### Hallazgo 1 — El splash de entrada bloquea la página 4,32 segundos

**Es el problema más grave del sitio.**

El mecanismo está repartido entre [BaseLayout.astro:69-117](src/layouts/BaseLayout.astro#L69-L117), [BaseLayout.astro:275-322](src/layouts/BaseLayout.astro#L275-L322) y [global.css:36-81](src/styles/global.css#L36-L81):

1. Un script inline añade `show-entry-splash` al `<html>` antes de pintar nada.
2. Ese estado aplica `opacity:0; visibility:hidden; pointer-events:none` a `.site-shell` — **es decir, a la web entera**: header, hero, contenido y footer.
3. Los temporizadores de JavaScript la devuelven a la vista tras `220 + 3000 + 920 + 180 = **4.320 ms**`.

Consecuencias medibles:

- **LCP ≈ 4,4–5 s** en toda primera visita de sesión. El umbral «bueno» son 2,5 s. Como el splash bloquea la interacción (`pointer-events:none` + `overflow:hidden`), no hay input de usuario que congele antes la métrica.
- Se muestra **una vez por sesión** (`sessionStorage`), y la mayoría de las sesiones de CrUX son precisamente primeras visitas. El dato de campo que ve Google es el malo.
- **`prefers-reduced-motion` no ayuda:** [global.css:362-365](src/styles/global.css#L362-L365) desactiva las transiciones, pero **no los temporizadores**. Un usuario con movimiento reducido ve 4,32 s de pantalla negra sin siquiera la animación que la justificaba.
- El *failsafe* de `visibilitychange` añade otros **1.500 ms** si la pestaña se abrió en segundo plano ([BaseLayout.astro:296-300](src/layouts/BaseLayout.astro#L296-L300)) — el caso típico de abrir enlaces en pestañas nuevas.

**Recomendación.** Reducir el bloqueo a ≤800 ms, o —mejor— invertir el planteamiento: pintar la web desde el primer momento y superponer el splash como capa que se desvanece, en lugar de esconder `.site-shell`. Se conserva el efecto de marca y el LCP pasa a medirse sobre contenido real. Como mínimo, respetar `prefers-reduced-motion` saltándose el splash por completo.

### Hallazgo 2 — ~3,0 MB de capturas PNG en la home

El carrusel de la home carga 9 PNG sin optimizar:

| Archivo | Peso | Dimensiones reales | Ancho mostrado |
|---|---|---|---|
| `sop-operario.png` | **829 KB** | 1869×921 | ≤900 px |
| `monitor-actividad.png` | **744 KB** | 1869×921 | ≤900 px |
| `admin-dashboard.png` | **635 KB** | 1849×921 | ≤900 px |
| `detalle-procesos.png` | 179 KB | 1866×952 | ≤900 px |
| `equipo-operaciones.png` | 161 KB | 1865×953 | ≤900 px |
| `gestion-productos-procesos.png` | 150 KB | 1866×952 | ≤900 px |
| `analitica-productividad.png` | 140 KB | 1862×952 | ≤900 px |
| `competencias-operario.png` | 96 KB | 1863×952 | ≤900 px |
| `planificacion-semanal.png` | 86 KB | 1866×954 | ≤900 px |
| **Total carrusel** | **~3,0 MB** | | |

Además, en otras páginas: `matrizpolivalencia.png` (294 KB) y `matrizpolivalencia2.png` (234 KB).

Los tres problemas se acumulan:

1. **PNG para capturas de pantalla de interfaz.** Convertidas a WebP con calidad 82 pesarían aproximadamente una quinta parte. En AVIF, menos aún.
2. **Se sirven al doble de resolución de la que se muestran** y sin `srcset`: un móvil de 390 px de ancho descarga los 1.869 px.
3. **No pasan por el pipeline de imagen de Astro.** Están en `public/`, así que se copian tal cual. Moverlas a `src/assets/` y usar `<Image>`/`<Picture>` generaría WebP/AVIF y `srcset` automáticamente.

### Hallazgo 3 — CLS y descubrimiento tardío del fondo

- **24 imágenes de contenido sin `width`/`height`.** Reparto: `/` (9), `/control-produccion/` (4), `/documentacion-procesos/` (2), `/gestion-competencias/` (2), y una en cada una de `/calidad-y-conformidad/`, `/kaizen/`, `/workflows/` y las cuatro de `/para-quien/`. Sin dimensiones el navegador no reserva espacio → **desplazamiento de diseño (CLS)** al cargar cada una.
- **`factory-bg.jpg` (209 KB, 2000×1142) es un fondo CSS** ([global.css:146-149](src/styles/global.css#L146-L149)) a pantalla completa en las 68 páginas. Al ser `background-image` no admite `srcset` ni `preload` desde el HTML, y es candidato claro a elemento LCP en las páginas sin captura sobre el pliegue.
- **Contrapunto positivo:** `inlineStylesheets: 'always'` elimina la petición bloqueante de CSS y las fuentes de Google cargan de forma asíncrona con `preload`+`onload`. Es la decisión correcta. El coste —31 KB de CSS repetidos en cada página, que llevan la media de HTML a 74 KB— es asumible y compensa.

---

## 4. SEO on-page

**El bloque más sólido del sitio.**

| Punto a revisar | Estado | Notas |
|---|---|---|
| Títulos y meta descripciones únicos por página | ✅ OK | **0 títulos duplicados y 0 descripciones duplicadas** en 68 páginas. Ninguna página sin título ni sin descripción. Único matiz: 12 títulos superan los 60 caracteres y se truncarán en resultados de escritorio (lista abajo). |
| Estructura de encabezados coherente | ✅ OK | **Exactamente un H1 por página en las 68.** Solo dos saltos de jerarquía: `/faqs/` (H1→H3) y `/vs-knowby/` (H2→H4). |
| URLs limpias y descriptivas | ✅ OK | Slugs en español, con palabra clave, sin parámetros. `trailingSlash: 'always'` aplicado con coherencia y canonicals alineados en 65 de 68 (las 3 excepciones son intencionadas). |
| Datos estructurados (schema.org) donde aplique | ⚠️ Revisar | Cobertura excelente —**0 páginas sin JSON-LD, 0 errores de sintaxis**— pero hay tres detalles que corregir (abajo). |
| Sitemap.xml y robots.txt correctos y actualizados | ✅ OK | 64 URLs, `lastmod` en todas, 0 indexables fuera del sitemap, 0 URLs muertas, 0 `noindex` dentro. `robots.txt` con política explícita para bots de IA (GPTBot, ClaudeBot, PerplexityBot permitidos; Bytespider bloqueado) y `llms.txt` + `llms-full.txt` publicados: por delante del 99% del sector. |
| Enlazado interno coherente entre páginas relacionadas | ⚠️ Revisar | 7 páginas reciben enlaces solo desde header/footer, ninguno contextual desde el cuerpo de otra página (lista abajo). |

**Inventario JSON-LD del sitio:** Organization ×68 · BreadcrumbList ×67 · FAQPage ×48 · BlogPosting ×20 · WebPage ×20 · SoftwareApplication ×17 · CollectionPage ×3 · HowTo, WebSite, Product, Guide, AboutPage ×1.

### Correcciones de schema

1. **`Organization.logo` apunta a un SVG.** [seo.ts:17](src/lib/seo.ts#L17) usa `${BASE_URL}/favicon.svg`. Google **no admite SVG** para el logo de Organization (solo JPG, PNG o GIF, mínimo 112×112 px). El logo no es elegible para resultados enriquecidos. Corrección de un minuto: apuntar a un PNG del logo.
2. **`Product` de /precios/ desconectado del grafo.** El nodo `Product` de la página de precios no lleva `@id` ni referencia al `${BASE_URL}/#software` que emite `softwareApplicationSchema()`. Para los buscadores son dos entidades distintas. Añadir `"@id": "https://www.gmvsolutions.es/#software"` las unifica.
3. **`AggregateOffer` declara `offerCount: '3'`** pero /precios/ solo publica dos ofertas con precio (49 € y 149 €; Enterprise es «según alcance»). Bajarlo a 2 o dar precio al tercer plan.

### Títulos por encima de 60 caracteres

`/mantenimiento/` (70) · `/documentacion-procesos/` (69) · `/blog/coste-absentismo-pymes-industriales/` (69) · `/vs-poka/` (67) · `/blog/lean-manufacturing/` (66) · `/vs-gembadocs/` (66) · `/` (64) · `/blog/conocimiento-tacito-taller-industrial/` (63) · `/blog/onboarding-digital-errores-manuales/` (63) · `/blog/onboarding-vs-tradicional/` (62) · `/vs-alternativas/` (61) · `/vs-knowby/` (61)

### Páginas sin enlaces contextuales entrantes

`/software-gestion-pyme-industrial/` · `/firma-digital/` · `/por-que-usar-reelevo/` · `/recursos/` · y las tres legales.

Las tres primeras son comerciales y merecen enlaces desde el cuerpo de artículos y páginas afines. Que `/software-gestion-pyme-industrial/` —cabecera del mega-menú de plataforma— no reciba ni un enlace contextual en 68 páginas es una oportunidad desaprovechada.

### Señales mixtas en `noindex`

- Las tres páginas de `/recursos/*` combinan `noindex` **y** `canonical` hacia `/blog/*`. Son señales contradictorias: con `noindex`, Google ignora el canonical. Elegir una: o redirección 301 a `/blog/`, o canonical sin `noindex`.
- **`/kit-digital-pyme-industrial/` es `noindex` pero está enlazada desde el footer en las 68 páginas.** Se gasta enlazado interno en una página que no se quiere indexar.

---

## 5. Contenido

| Punto a revisar | Estado | Notas |
|---|---|---|
| Sin errores gramaticales u ortográficos | ✅ OK | Revisión sobre la home, precios, legales y varios artículos: sin errores. Única salvedad, tildes ausentes en algún dato de schema (`operacion` en el texto de prueba del hero de la home). |
| Textos orientados a beneficios, no solo a características | ✅ OK | Es el punto fuerte del contenido. Cada bloque abre con la situación real («El experto no ha venido», «Es su primer día») antes de nombrar la funcionalidad. |
| Prueba social: testimonios, casos de uso, logos de clientes | ❌ **Falla** | **Cero testimonios, cero logos de cliente, cero casos con nombre.** Las 4 páginas de `/casos-de-uso/` son escenarios genéricos, y 6 páginas marcan sus ejemplos como «ilustrativo». Es coherente con una empresa fundada en 2025 y honesto —mejor eso que inventarlos— pero es el mayor hueco de conversión del sitio. |
| Contenido actualizado | ⚠️ Revisar | Blog activo (20 artículos) y copyright dinámico. Dos avisos: la política de cookies dice «Última actualización: **marzo 2026**» cuando el sitio ha incorporado Clarity y E-goi desde entonces; y **16 de los 20 artículos comparten `dateModified: 2026-07-27`**, patrón de actualización masiva que Google descuenta. |
| Consistencia terminológica en todo el site | ✅ OK | Vocabulario alineado con [REELEVO_GUIA_MAESTRA_MENSAJE_Y_VOCABULARIO.md](REELEVO_GUIA_MAESTRA_MENSAJE_Y_VOCABULARIO.md): «SOP», «continuidad operativa», «puesto», «relevo». Sin sinónimos que compitan. |

### Datos sin fuente citada

La home afirma «7,2 % de absentismo», «3-5 días de aprendizaje» y «40 % de jefes de planta llaman al experto», presentados como «datos del sector industrial español». **No hay ni una sola referencia** (0 apariciones de «Fuente» en la home).

Son las cifras que sostienen el argumento comercial. Sin fuente citada:
- pierden fuerza ante un comprador industrial escéptico,
- restan en E-E-A-T, justo el eje donde Google evalúa contenido con reclamos cuantitativos,
- y ningún motor de IA las citará sin procedencia.

Añadir «Fuente: INE / Randstad Research, 2025» bajo cada dato es trabajo de una hora con retorno alto.

---

## 6. Confianza y credibilidad

| Punto a revisar | Estado | Notas |
|---|---|---|
| Página "sobre nosotros" con información real y verificable | ✅ OK | `/sobre-nosotros/` existe, con fundador identificado y enlazado a su LinkedIn desde el `Organization` schema ([seo.ts:44-50](src/lib/seo.ts#L44-L50)). Persona real y verificable. |
| Datos de contacto visibles (teléfono, email, dirección) | ❌ **Falla** | **`mailto:` aparece en 4 de 68 páginas** (`/precios/`, `/sobre-nosotros/`, `/kit-digital-pyme-industrial/` y un artículo). **`tel:` en 0.** El footer —el sitio donde todo el mundo busca el contacto— **no tiene ni email ni teléfono ni dirección**, solo enlaces de navegación y legales. No existe página `/contacto/`. Para vender software B2B a pymes industriales, donde la llamada sigue pesando, es un freno directo. |
| Política de privacidad, aviso legal y cookies conformes a RGPD | ⚠️ Revisar | Las tres existen y están bien redactadas (responsable, NIF, domicilio, derechos, AEPD, plazos, base legal, interés legítimo, transferencias). El problema es el inventario de cookies desactualizado: ver sección 10. |
| Certificados, sellos o menciones en prensa si los hay | ⚠️ Revisar | Solo el sello «creado en Galicia» ([GaliciaSeal.astro](src/components/GaliciaSeal.astro)) y la mención a Kit Digital. Sin certificaciones ni menciones. Normal en fase temprana; convendría añadir en cuanto haya (ENS, ISO, agente digitalizador, premios). |

---

## 7. Conversión y analítica

| Punto a revisar | Estado | Notas |
|---|---|---|
| Tracking correcto (GA4/GTM) sin bloqueos por CSP | ⚠️ Revisar | La CSP de [vercel.json](vercel.json) autoriza correctamente todos los dominios necesarios (GTM, GA4, Ads, Clarity, Cookiebot, Storylane, E-goi). Pero conviven **GTM (`GTM-M223Z398`) y `gtag.js` directo (`G-JJCZ6M3T8Y`)** en [BaseLayout.astro:122-138](src/layouts/BaseLayout.astro#L122-L138). Si el contenedor GTM incluye además una etiqueta de configuración GA4, **cada visita cuenta dos `page_view`**. Verificar en GTM y dejar una sola vía. |
| Eventos de conversión bien definidos y verificados | ❌ **Falla** | Ver detalle. |
| Funnel de usuario claro en cada página | ✅ OK | Cada página tiene una acción principal evidente y `data-page-type` en el `<body>` permite segmentar por tipo de página. La arquitectura de intenciones (registro / diagnóstico / demo / descarga) está bien pensada. |
| Mapas de calor o grabaciones de sesión revisados periódicamente | ⚠️ Revisar | Microsoft Clarity instalado (`x6zuugdflb`). No hay evidencia en el repositorio de revisión periódica ni de hallazgos incorporados. |

### Hallazgo — El 59% de los CTAs no genera ningún evento

El *listener* delegado de [BaseLayout.astro:250-273](src/layouts/BaseLayout.astro#L250-L273) está bien construido: captura clics en `[data-cta]`, empuja `cta_click` al dataLayer y añade `generate_lead` para las intenciones de lead. **El problema es la cobertura del atributo `data-cta`:**

| Destino | Enlaces totales | Con `data-cta` | **Sin medir** |
|---|---|---|---|
| `app.gmvsolutions.es` (registro) | 225 | 62 | **163** |
| `diagnostico.gmvsolutions.es` | 172 | 36 | **136** |
| `mailto:` | 5 | 3 | 2 |
| **Total** | **402** | **101** | **301** |

**La causa está localizada.** Los CTAs sitewide del [Header.astro](src/components/Header.astro) —«Registrarme en REELEVO» y «Evaluar mi situación», cada uno duplicado en escritorio y menú móvil— **no llevan `data-cta`**. Son 4 enlaces × 68 páginas = **272 de los 301 sin medir**. Los números encajan exactamente: 136 = 68×2 en diagnóstico, y otros 136 del header en registro.

Traducido: **el botón naranja principal, el más visible del sitio y presente en las 68 páginas, no dispara `cta_click` ni `generate_lead`.** GA4 y Google Ads están optimizando sobre una muestra parcial y sesgada hacia los CTAs del cuerpo de página.

**31 páginas no tienen ni un solo CTA medido hacia la app**, incluidas 13 del blog, `/faqs/`, `/sobre-nosotros/`, `/video-demo/`, `/por-que-usar-reelevo/`, `/firma-digital/`, `/kaizen/`, `/modo-offline/`, `/obras-trazabilidad/`, `/integracion-m365/` y `/api-integraciones/`.

**Corrección:** añadir `data-cta data-cta-intent="registro" data-cta-location="header"` (y `"diagnostico"`) a los cuatro enlaces del Header. Cuatro atributos arreglan el 90% del problema.

Intenciones actualmente declaradas: `registro` (62), `diagnostico` (36), `demo` (25), `producto` (6), `navegacion` (6), `descarga` (5), `contacto` (3).

---

## 8. Accesibilidad

| Punto a revisar | Estado | Notas |
|---|---|---|
| Contraste de color suficiente (WCAG AA) | ❌ **Falla** | Ver tabla de contrastes. |
| Textos alternativos en todas las imágenes relevantes | ✅ OK | **0 imágenes sin atributo `alt`.** Los 68 `alt=""` corresponden al logo del splash, que es decorativo: uso correcto. Los textos alternativos de las capturas son descriptivos y específicos. |
| Navegación completa por teclado | ❌ **Falla** | Ver detalle. |
| Tamaños de fuente legibles en todos los dispositivos | ⚠️ Revisar | Base de 16 px y titulares con `clamp()`: correcto. Pero hay bastante texto entre 0,58 y 0,72 rem (9–11,5 px): `.hero-cta-note`, `.cta-note`, `.screenshot-caption`, `.footer-legal`, `.nav-sub-label`, `.mobile-section-title`. Combinado con el bajo contraste, resulta ilegible para presbicia — perfil frecuente entre gerentes y jefes de planta, que es exactamente el público objetivo. |

### Fallo de teclado — mega-menús inalcanzables

Los disparadores de los cuatro desplegables son `<span class="nav-dropdown-trigger">` ([Header.astro:18](src/components/Header.astro#L18), [93](src/components/Header.astro#L93), [143](src/components/Header.astro#L143)): **no son elementos enfocables**. Los menús se abren solo con `:hover` ([global.css:95](src/styles/global.css#L95)) y en estado cerrado llevan `visibility:hidden`, que **excluye su contenido del orden de tabulación**.

Resultado: **24 enlaces de navegación (todo «Plataforma» y «Soluciones») son inalcanzables con teclado en escritorio.** Es un fallo de **WCAG 2.1.1 Teclado, nivel A** — el nivel más básico.

Atenuante: en móvil el menú hamburguesa sí los expone, así que el contenido no es inaccesible de forma absoluta. Pero un usuario de escritorio que navegue con teclado (o con lector de pantalla) no llega a ellos.

**Corrección:** convertir los `<span>` en `<button aria-expanded="false" aria-controls="...">` y abrir el menú con `:focus-within` además de `:hover`.

### Contrastes por debajo de AA

Ratios calculados componiendo el alfa sobre el fondo real (`--surface` ≈ `#131313`):

| Token / clase | Color | Ratio | Mínimo AA | Dónde se usa |
|---|---|---|---|---|
| `--gray2` | `rgba(255,255,255,.30)` | **2,7:1** | 4,5:1 | `.footer-legal a`, `.footer-copy`, `.cta-eyebrow`, `.cta-note`, `.hero-cta-note`, `.nav-sub-label`, `.scenario-before`, `.micro-case-note`, migas de pan |
| `.screenshot-caption` | `rgba(255,255,255,.35)` | **3,2:1** | 4,5:1 | Pies de las 9 capturas de la home |
| `.breadcrumbs__sep` | `--gray2` a 0,6 opacidad | **~1,9:1** | 3:1 | Separadores de migas en las 67 páginas |
| `--gray` | `rgba(255,255,255,.55)` | 6,2:1 | 4,5:1 | ✅ Cumple |
| `--orange` | `#F4521E` | 5,7:1 | 4,5:1 | ✅ Cumple |

Los enlaces de **aviso legal, privacidad y cookies** están entre lo peor contrastado del sitio (2,7:1 a 11,5 px). Subir `--gray2` a `rgba(255,255,255,.45)` (≈4,6:1) resolvería la mayoría de casos de una sola vez.

### Otros fallos verificados

- **Carrusel sin pausa.** Avanza solo cada 10 s ([index.astro:753](src/pages/index.astro#L753)) y **no hay control de pausa/parada**. Fallo de **WCAG 2.2.2 Pausar, detener, ocultar, nivel A**, que exige un mecanismo de pausa para todo contenido en movimiento que dure más de 5 s. Tampoco respeta `prefers-reduced-motion`. Los botones anterior/siguiente y los puntos sí tienen `aria-label` correctos.
- **Acordeón de FAQ sin estado.** Los 20 `<button class="faq-question">` de `/faqs/` **no llevan `aria-expanded` ni `aria-controls`** (0 coincidencias). Un lector de pantalla no puede saber si la respuesta está abierta o cerrada. Fallo de WCAG 4.1.2. El componente [FaqSection.astro](src/components/FaqSection.astro) usado en las otras 47 páginas es estático (`h3` + `p`) y sí es accesible: el problema está solo en `/faqs/`.
- **Sin *skip link*.** Ninguna de las 68 páginas ofrece «saltar al contenido», con ~56 enlaces de navegación repetidos antes del `<main>`.
- **Sin estilos de foco propios.** [global.css](src/styles/global.css) no define `:focus` ni `:focus-visible` en ningún sitio. Se depende del anillo por defecto del navegador, que sobre fondo casi negro tiene visibilidad desigual. Además, [NewsletterModal.astro:316-319](src/components/NewsletterModal.astro#L316-L319) hace `outline:none` en los campos y lo sustituye solo por un cambio de color de borde.
- **Errores de formulario no anunciados.** El `<p id="nl-error">` del modal cambia de contenido sin `role="alert"` ni `aria-live`: un lector de pantalla no lo verbaliza.
- **`scroll-behavior:smooth` sin excepción** para `prefers-reduced-motion` ([global.css:27](src/styles/global.css#L27)).

---

## 9. Seguridad

| Punto a revisar | Estado | Notas |
|---|---|---|
| Certificado SSL válido y renovado automáticamente | ✅ OK | Gestionado por Vercel, renovación automática. HSTS con `preload`. |
| Cabeceras de seguridad activas (CSP, HSTS, X-Frame-Options) | ✅ OK | Conjunto completo y bien afinado en [vercel.json](vercel.json): CSP con `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, más HSTS 2 años con `includeSubDomains; preload`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`. Por encima de la media del sector. Única observación: `script-src` incluye `'unsafe-inline'`, inevitable con GTM y Cookiebot pero conviene tenerlo presente. |
| Backups periódicos y plan de recuperación | ✅ OK | Sitio estático versionado en Git y desplegado en Vercel: cada commit es un punto de restauración con *rollback* inmediato. Adecuado para un sitio sin base de datos. |
| Plugins, librerías y dependencias actualizados | ❌ **Falla** | Las 3 dependencias directas están al día (`astro ^6.4.8`, `@astrojs/vercel 10.0.8`, `@sanity/client ^7.20.0`) y el build no da avisos, pero **el árbol transitivo acumula 11 vulnerabilidades, 9 de ellas altas**. Ver detalle. |

### Vulnerabilidades en dependencias transitivas

`npm audit` reporta **11 vulnerabilidades (9 altas, 1 moderada, 1 baja)**, todas heredadas — ninguna en las 3 dependencias directas:

| Paquete | Severidad | Problema |
|---|---|---|
| `sharp` <0.35.0 | Alta | CVEs heredados de libvips (CVE-2026-33327/33328/35590/35591) |
| `postcss` ≤8.5.17 | Alta | *Path traversal* al autocargar *source maps* → lectura arbitraria de `.map` |
| `svgo` 4.0.0-4.0.1 | Alta | El plugin `removeScripts` deja scripts ejecutables intactos |
| `path-to-regexp` (vía `@vercel/routing-utils`) | Alta | — |
| `tar` ≤7.5.20 | Moderada | Desbordamiento de pila no capturable con rutas largas |

**Matiz importante sobre el riesgo real:** todas son dependencias de **tiempo de compilación**, no de servicio. El sitio se genera estáticamente, así que este código **no se ejecuta atendiendo tráfico**: la exposición es el entorno de build, no la web publicada. No es «la web es vulnerable», es «la cadena de herramientas tiene CVEs conocidos».

Dicho eso, no es descartable: `svgo` y `sharp` procesan imágenes y SVG durante el build, y ganan relevancia justo cuando se aborde el paso de las capturas a WebP/AVIF (Lote A), que es precisamente cuando `sharp` empezará a hacer trabajo real.

`npm audit fix` resuelve `postcss`, `svgo`, `tar` y `path-to-regexp` sin romper nada. `sharp` requiere `astro@7.1.6`, que es un cambio mayor y merece su propia ventana.

### Puntos a reforzar

1. **`/api/suscribir` sin límite de peticiones.** [suscribir.ts](src/pages/api/suscribir.ts) valida entrada y usa un *honeypot*, pero **no tiene *rate limiting*, ni CAPTCHA, ni verificación de origen**. Un script puede llamarlo en bucle y dar de alta contactos en E-goi y tenants en la app. La validación es correcta y las claves nunca salen al navegador —el diseño servidor-a-servidor es acertado— pero falta el control de abuso. Recomendación: límite por IP (Vercel KV o Upstash) y verificación de `Origin` antes de encender `PUBLIC_NEWSLETTER_MODAL`.
2. **`@sanity/client` es dependencia de producción y no se usa.** [sonity.ts](src/lib/sonity.ts) existe pero ninguna página importa contenido de Sanity. Superficie de dependencias innecesaria: retirar o documentar por qué se mantiene.
3. **`security.txt` correcto.** Formato RFC 9116, `Expires` válido hasta junio de 2027, contacto y canonical presentes.

---

## 10. Cumplimiento legal

| Punto a revisar | Estado | Notas |
|---|---|---|
| Banner de cookies funcional y configurado correctamente | ⚠️ Revisar | Cookiebot con `data-blockingmode="auto"` y cargado como primer script: configuración correcta. Pero el iframe de Storylane no está protegido — ver abajo. |
| Aviso legal y condiciones de uso publicados | ✅ OK | `/legal/aviso-legal/` con responsable, NIF, domicilio y email de contacto. |
| Política de privacidad conforme a RGPD/LOPD-GDD | ⚠️ Revisar | Estructura completa y bien redactada: responsable, finalidad, base legal, interés legítimo, plazos de conservación, derechos, reclamación ante la AEPD y transferencias internacionales. Falta nombrar a tres encargados que sí tratan datos. |

### Hallazgo — Inventario de cookies desactualizado

Tres servicios cargan en **las 68 páginas** desde [BaseLayout.astro:140-162](src/layouts/BaseLayout.astro#L140-L162) y **ninguno aparece en la política de cookies**:

| Servicio | Qué hace | Cookies | ¿Declarado? |
|---|---|---|---|
| **Microsoft Clarity** (`x6zuugdflb`) | Mapas de calor y **grabación de sesión** | `_clck`, `_clsk` | ❌ **No** |
| **E-goi Connected Sites** (`1782951_gmvsolutions.es.js`) | Seguimiento de comportamiento tipo Matomo | `_mtm*`, `_pk_*` | ❌ **No** |
| **Storylane** (`/video-demo/`, `/como-funciona/`) | Demo interactivo de terceros | Propias del proveedor | ❌ **No** |

La política solo enumera Cookiebot, `_ga`/`_ga_*`/`_gid` y `_gcl_au`. **La grabación de sesión de Clarity es más invasiva que la analítica corriente** y su omisión es la más relevante de las tres. La página tampoco menciona a Clarity, E-goi ni Google Ads como encargados del tratamiento, ni identifica Estados Unidos como destino de transferencias.

Agravantes:
- La política declara «Última actualización: **marzo 2026**», anterior a la incorporación de Clarity y E-goi.
- El inventario está **escrito a mano** en lugar de usar el script `CookieDeclaration` de Cookiebot (0 coincidencias en el HTML), que se autoactualiza al detectar nuevas cookies. Volverá a quedar obsoleto.

**Corrección:** sustituir la lista manual por el widget `CookieDeclaration` de Cookiebot y añadir Clarity, E-goi, Google Ads y Storylane a la política de privacidad como encargados, con mención expresa de las transferencias a EE. UU.

### Consentimiento del iframe de Storylane

En [StorylaneDemo.astro](src/components/StorylaneDemo.astro) el `<script>` lleva correctamente `data-cookieconsent="marketing"`, pero **el `<iframe src="https://app.storylane.io/demo/...">` no lleva ninguna marca de consentimiento**. Storylane no es un proveedor que Cookiebot reconozca de serie en modo automático, así que es probable que **el iframe cargue antes de que el usuario acepte**, estableciendo cookies de terceros sin consentimiento previo. Verificar en producción con el panel de red y, si se confirma, aplicar `data-cookieconsent="marketing"` al iframe o cargarlo bajo demanda tras el consentimiento.

### Verificación pendiente de bloqueo previo

El modo automático de Cookiebot debería impedir que GTM, gtag, Clarity y E-goi se ejecuten antes del consentimiento, pero **los cuatro son scripts inline** y el bloqueo automático es menos fiable ahí que con scripts externos reconocidos. **Comprobar en producción**, con el navegador en incógnito y sin aceptar el banner, que ni `_ga`, ni `_clck`, ni `_mtm` se escriben. Es la comprobación con más riesgo sancionador de toda la auditoría y no se puede resolver desde el código.

---

## Plan de acción priorizado

Ordenado como pide la guía: primero confianza y conversión, después SEO y rendimiento, y al final acabados.

### P0 — Esta semana (impacto alto, esfuerzo bajo)

| # | Acción | Esfuerzo | Sección |
|---|---|---|---|
| 1 | Añadir `data-cta` a los 4 CTAs del Header → recupera 272 eventos de conversión por cada 68 páginas vistas | 15 min | 7 |
| 2 | Declarar Clarity, E-goi y Storylane en la política de cookies y privacidad | 2 h | 10 |
| 3 | Verificar en producción que no se escriben cookies antes del consentimiento | 30 min | 10 |
| 4 | Reducir el splash a ≤800 ms y saltarlo con `prefers-reduced-motion` | 1 h | 3 |
| 5 | Corregir el `class` duplicado de [Header.astro:144](src/components/Header.astro#L144) | 2 min | 2 |
| 6 | Arreglar `closeMobile` (mover el listener al script del módulo, quitar los `onclick`) | 30 min | 2 |
| 7 | Añadir email y teléfono al footer | 30 min | 6 |

### P1 — Este mes (impacto alto, esfuerzo medio)

| # | Acción | Esfuerzo | Sección |
|---|---|---|---|
| 8 | Convertir las capturas a WebP/AVIF con `<Image>` de Astro y `srcset` (~3,0 MB → ~500 KB en la home) | 4 h | 3 |
| 9 | Hacer los mega-menús operables con teclado (`<button>` + `aria-expanded` + `:focus-within`) | 3 h | 8 |
| 10 | Subir `--gray2` a `rgba(255,255,255,.45)` y `.screenshot-caption` a `.55` | 30 min | 8 |
| 11 | Añadir botón de pausa al carrusel y respetar `prefers-reduced-motion` | 1 h | 8 |
| 12 | Poner `width`/`height` a las 24 imágenes de contenido (elimina CLS) | 1 h | 3 |
| 13 | Crear `src/pages/404.astro` con marca y navegación | 1 h | 2 |
| 14 | Citar la fuente de los tres datos de la home | 1 h | 5 |
| 15 | `aria-expanded` + `aria-controls` en los 20 acordeones de `/faqs/` | 1 h | 8 |
| 16 | Verificar en GTM que no hay doble `page_view` con gtag directo | 30 min | 7 |
| 16b | `npm audit fix` (resuelve 4 de las 5 vulnerabilidades sin romper nada) | 15 min | 9 |

### P2 — Próximo trimestre

| # | Acción | Esfuerzo | Sección |
|---|---|---|---|
| 17 | Conseguir 2-3 testimonios o casos con nombre real de cliente | — | 5 |
| 18 | *Rate limiting* en `/api/suscribir` antes de activar el modal | 3 h | 9 |
| 19 | Buscador interno (índice estático generado en *build*) | 6 h | 2 |
| 20 | Skip link + estilos `:focus-visible` propios | 2 h | 8 |
| 21 | Acortar los 12 títulos que pasan de 60 caracteres | 1 h | 4 |
| 22 | Enlaces contextuales hacia las 3 páginas comerciales sin entrantes | 2 h | 4 |
| 23 | `Organization.logo` a PNG y unificar `Product` con `#software` por `@id` | 30 min | 4 |
| 24 | `og:type="article"` + `article:published_time` en los 20 posts del blog | 2 h | 4 |
| 25 | Resolver la señal mixta `noindex` + `canonical` de `/recursos/*` | 1 h | 4 |
| 26 | Quitar `/kit-digital-pyme-industrial/` (noindex) del footer sitewide | 5 min | 4 |
| 27 | Prefijo `-webkit-backdrop-filter` y retirada de `@sanity/client` si no se usa | 30 min | 3, 9 |

---

## Anexo — Datos del análisis

**Build analizado:** 29/07/2026, `npm run build` sin errores, 68 páginas HTML + 68 versiones markdown.

```
Páginas HTML                      68
URLs en sitemap                   64  (4 noindex excluidas correctamente)
Títulos duplicados                 0
Descripciones duplicadas           0
Páginas sin H1                     0
Páginas con más de un H1           0
Enlaces internos rotos             0
Páginas sin JSON-LD                0
JSON-LD con errores de sintaxis    0
Imágenes sin alt                   0
Media de palabras por página   1.399
Media de peso HTML             74 KB  (31 KB de CSS inline por página)
Imágenes en WebP/AVIF              0
Imágenes sin width/height         24
CTAs sin data-cta                301  de 402
Páginas sin skip link          68/68
Enlaces de menú sin acceso por teclado   24
```

**Herramientas del repositorio no ejecutadas en esta auditoría** (complementan lo anterior): [scripts/audit-seo.py](scripts/audit-seo.py), [scripts/copy-audit.mjs](scripts/copy-audit.mjs), [scripts/validate-schema.mjs](scripts/validate-schema.mjs).

**Pendiente de medición en campo** (no obtenible desde el código): Core Web Vitals reales en PageSpeed Insights y CrUX, comportamiento efectivo del bloqueo previo de Cookiebot, y contenido del contenedor GTM `GTM-M223Z398`.

**Próxima revisión recomendada:** octubre de 2026, o antes si se activa el modal de registro o se publica el vídeo demo.
