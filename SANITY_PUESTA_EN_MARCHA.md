# Sanity: gestor de contenidos del blog

> **Estado:** proyecto `1rbyt934` conectado (fijo en el código) · panel en `/admin/` de cada despliegue

## Qué hace

- **Panel de edición** en `https://www.gmvsolutions.es/admin/` (Sanity Studio dentro de la propia web).
- **Artículos del blog** creados desde el panel: título, URL, tema, categoría, fechas, imagen destacada, cuerpo con títulos, listas, enlaces, imágenes y cajas destacadas, preguntas frecuentes y campos SEO.
- Cada artículo publicado entra solo en **/blog/**, **/sitemap.xml**, **/llms.txt**, su versión **/blog/&lt;url&gt;.md** y el aviso de «contenido nuevo» del menú, con el mismo schema (BlogPosting + FAQPage) que los artículos escritos en código.
- Los 33 artículos que había en código se migraron a Sanity (octubre de 2026): todo el blog se edita desde el panel.
- Si Sanity no responde durante el build, el sitio se publica igual sin los artículos de Sanity y el log lo avisa con `[sanity] AVISO`.

## Puesta en marcha (una sola vez)

### 1. Crear el proyecto en Sanity

1. Entra en <https://www.sanity.io/manage> (puedes registrarte con Google o GitHub).
2. **Create new project** → nombre `REELEVO`, plan gratuito.
3. Dataset: `production`, visibilidad **Public** (el contenido publicado ya es público en la web; los borradores siguen privados).
4. Copia el **Project ID** (8 caracteres, p. ej. `a1b2c3d4`).

### 2. Permitir que el panel se conecte (CORS)

En el proyecto: **API → CORS origins → Add CORS origin**, marcando **Allow credentials** en cada uno:

| Origen | Para |
|---|---|
| `https://www.gmvsolutions.es` | El panel en producción |
| `https://*.vercel.app` | El panel en las vistas previas de Vercel |
| `http://localhost:4321` | Trabajo en local |

### 3. Variables en Vercel (opcional)

El Project ID `1rbyt934` ya va fijo en `astro.config.mjs`, `sanity.config.ts` y `src/lib/sanity.ts` (no es secreto). Las variables solo hacen falta para apuntar a otro proyecto o dataset; si existen, tienen prioridad.


**Vercel → proyecto gmvsolutions-es → Settings → Environment Variables**:

| Variable | Valor | Entornos |
|---|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | el Project ID del paso 1 | Preview (y Production cuando se pase a `main`) |
| `PUBLIC_SANITY_DATASET` | `production` | Preview (y Production) |

Después, **Redeploy** del último despliegue de la rama para que las coja.

### 4. Publicar = reconstruir la web (webhook)

La web es estática: un artículo nuevo aparece cuando Vercel vuelve a construirla (1-2 minutos).

1. **Vercel → Settings → Git → Deploy Hooks** → nombre `sanity`, rama `main` (o la rama de prueba mientras dure la prueba) → copia la URL.
2. **sanity.io/manage → API → Webhooks → Create webhook**:
   - URL: la del Deploy Hook.
   - Trigger on: Create, Update, Delete.
   - Filter: `_type == "articulo"`.
   - HTTP method: POST. Sin «Drafts» (solo contenido publicado).

### 5. Dar acceso a quien vaya a escribir

**sanity.io/manage → Members → Invite** con el rol **Editor**. Entran en `/admin/` con su cuenta.

## Páginas editables (fases 1 y 2)

Además del blog, el panel tiene dos documentos únicos (se abren directamente, no se pueden duplicar ni borrar):

| En el panel | Qué controla |
|---|---|
| **Página de inicio** | Todo el texto de la home, sección a sección: SEO, portada y ficha técnica, §01 escenas, §02 cifras, §03 recorrido, §04 perfiles, §05 FAQ (también alimenta el schema FAQPage) y la llamada final. |
| **Precios** | SEO, portada, las tarjetas de los planes (precio, líneas de facturación, funciones con ✓ / × / ○, botón y nota), FAQ y llamada final. Los precios numéricos alimentan también el schema de Google. La calculadora de ROI sigue en el código. |
| **Página de preguntas frecuentes** | `/faqs/`: SEO, portada, categorías con sus preguntas y las dos llamadas a la acción. |
| **Preguntas frecuentes** | Cada pregunta es un documento propio y se elige desde las páginas que la muestran (home, precios, `/faqs/`). Corregirla una vez la corrige en todas. Su texto alimenta el bloque visible y el schema FAQPage. |
| **Ajustes generales** | Lema de marca del pie, botón «Probar gratis» de la cabecera y del menú móvil, columnas de enlaces del pie, email, dirección y LinkedIn. |

Cómo funciona:

- **El diseño no se toca desde el panel.** Ilustraciones, pictogramas, captura y animaciones siguen en el código; el panel solo cambia textos, enlaces y el número de elementos de cada lista.
- **Formato:** negrita con `**así**`; en las respuestas de las preguntas, también enlaces con `[texto](/url/)` y párrafos separados por una línea en blanco. No admite HTML: lo que se escriba se muestra tal cual.
- **Planes de precios:** los límites y funciones salen de la app (`reelevo-app/lib/tier-config.ts`). Si se cambian aquí, hay que cambiarlos también allí, o la web prometerá lo que el producto no da.
- **Cifras de §02:** se escriben como se leen («7,2», «40», «3–5»); los números se animan solos.
- **Recorrido §03:** el pictograma va por orden (E-01 a E-06). Un séptimo paso sale sin pictograma.
- **Respaldo:** los textos por defecto viven en `src/data/*.default.json`. Un campo vacío en el panel, o una lista vaciada, vuelve a ese texto; si Sanity no responde en el build, la página sale entera con ellos.
- **Primera carga:** `SANITY_WRITE_TOKEN=xxxx node scripts/sembrar-paginas-sanity.mjs`. Solo crea los documentos que no existen: nunca pisa lo editado.

Ficheros: `sanity/schemaTypes/home.ts`, `precios.ts`, `paginaFaqs.ts`, `preguntaFrecuente.ts`, `ajustes.ts`, `comunes.ts` · `src/lib/contenido.ts` (lectura y mezcla) · `src/pages/index.astro`, `precios.astro`, `faqs.astro`, `src/components/Header.astro`, `Footer.astro`.

## Uso diario

1. Entra en `/admin/` → **Artículos del blog → +**.
2. Rellena la pestaña **Contenido** y la de **SEO y tarjeta**. Los campos obligatorios avisan si faltan; el título para buscadores avisa si pasa de 65 caracteres.
3. **Publish**. A los 1-2 minutos el artículo está en la web.
4. ¿Quieres verlo publicado sin que lo indexe Google todavía? Marca **Borrador (no indexar)**: tiene página, pero queda fuera del índice del blog, del sitemap y de `/llms.txt`.

Reglas que conviene respetar (las mismas que para los artículos de código):

- **No cambies la URL** de un artículo ya publicado.
- Una **respuesta directa de 40-60 palabras** al principio y en cada pregunta frecuente: es lo que más citan las IA.
- **Texto alternativo** en todas las imágenes (el panel lo exige).

## Ficheros

| Fichero | Qué es |
|---|---|
| `sanity.config.ts` | Configuración del panel |
| `sanity/schemaTypes/articulo.ts` | Campos del artículo |
| `src/lib/sanity.ts` | Lectura de Sanity en build |
| `src/lib/blog.ts` | Mezcla artículos de código y de Sanity |
| `src/pages/blog/[slug].astro` | Página de cada artículo de Sanity |
| `src/pages/blog/[slug].md.ts` | Versión markdown de cada artículo |
| `src/lib/blogMarkdown.ts` | Markdown de los artículos, compartido por los `.md` y `/llms-full.txt` |
| `src/components/portable/` | Imagen, caja destacada y enlace dentro del cuerpo |
| `vercel.json` | CSP ampliada para `*.sanity.io` (panel e imágenes) |

## Migración de los 33 artículos escritos en código

| Paso | Estado |
|---|---|
| Esquema ampliado: tablas, enlaces relacionados, cajas de dato, descarga, anclas, separador, bloque HTML, enlaces con medición CTA | Hecho |
| Conversión: `node scripts/migrar-blog-a-sanity.mjs` → `scripts/migracion/articulos.ndjson` + `src/styles/blog-migrado.css` | Hecho |
| Verificación local (modo `SANITY_FIXTURE`): 33/33 páginas con el mismo texto, enlaces, anclas, títulos, CTA, FAQ y altura; índice del blog, sitemap, `/llms.txt` y los 33 `.md` idénticos | Hecho |
| Importar a Sanity: `SANITY_WRITE_TOKEN=… node scripts/importar-a-sanity.mjs` (33 documentos en `1rbyt934/production`) | Hecho |
| Comparar la web construida desde Sanity con la de código: mismo texto, enlaces, anclas, títulos, CTA, metas, JSON-LD y alturas renderizadas (escritorio y móvil) en los 33; índice, sitemap, `/llms.txt` y los 33 `.md` idénticos | Hecho |
| Borrar los 33 `.astro` y sus entradas de `src/lib/blog.ts` | Hecho |

**No vuelvas a ejecutar `importar-a-sanity.mjs`:** sustituiría los artículos por la versión del `.ndjson` y se perderían los cambios hechos después en el panel.

Si en el futuro un artículo está en código y en Sanity a la vez, gana el de código y el log de build lo avisa con `[blog] … se usa la versión de código`.

30 de los 33 artículos quedan íntegramente editables. Los tres con maquetación a medida (`onboarding-software-pymes`, `onboarding-vs-tradicional`, `gestion-competencias-industria`) guardan esas secciones como «Bloque HTML»; su texto normal es editable igual que el resto.

**Construir sin red:** `SANITY_FIXTURE=scripts/migracion/articulos.ndjson npm run build` construye leyendo los artículos del fichero (la foto de la migración, no los cambios posteriores del panel) en vez de Sanity.

## Siguientes pasos posibles

- Hacer editables desde el panel otros bloques: preguntas frecuentes de las páginas, textos de la home, casos de cliente y testimonios.
