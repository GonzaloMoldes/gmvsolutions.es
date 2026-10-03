# Sanity: gestor de contenidos del blog

> **Estado:** proyecto `1rbyt934` conectado (fijo en el código) · panel en `/admin/` de cada despliegue

## Qué hace

- **Panel de edición** en `https://www.gmvsolutions.es/admin/` (Sanity Studio dentro de la propia web).
- **Artículos del blog** creados desde el panel: título, URL, tema, categoría, fechas, imagen destacada, cuerpo con títulos, listas, enlaces, imágenes y cajas destacadas, preguntas frecuentes y campos SEO.
- Cada artículo publicado entra solo en **/blog/**, **/sitemap.xml**, **/llms.txt**, su versión **/blog/&lt;url&gt;.md** y el aviso de «contenido nuevo» del menú, con el mismo schema (BlogPosting + FAQPage) que los artículos escritos en código.
- Los 30 artículos actuales siguen en código y no cambian. Si un artículo de Sanity repite la URL de uno de código, el build falla a propósito.
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
| `src/pages/blog/[slug].md.ts` | Versión markdown (también para los de Sanity) |
| `src/components/portable/` | Imagen, caja destacada y enlace dentro del cuerpo |
| `vercel.json` | CSP ampliada para `*.sanity.io` (panel e imágenes) |

## Siguientes pasos posibles

- Migrar los 30 artículos actuales a Sanity (script de importación).
- Hacer editables desde el panel otros bloques: preguntas frecuentes de las páginas, textos de la home, casos de cliente y testimonios.
