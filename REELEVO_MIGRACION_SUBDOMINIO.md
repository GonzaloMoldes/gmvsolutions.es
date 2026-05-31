# Migración: gmvsolutions.es → reelevo.gmvsolutions.es

> **Estado:** Pendiente de ejecutar
> **Objetivo:** Mover el sitio de Reelevo del dominio principal `gmvsolutions.es` al subdominio `reelevo.gmvsolutions.es`, dejando el apex (`gmvsolutions.es` / `www`) libre para la web corporativa de GMV.
> **Stack actual:** Astro + Vercel. Dominio cableado en el código (`site:` en `astro.config.mjs` + ~177 ocurrencias en `src/` + archivos en `public/`).

---

## Resumen del cambio

Esto es, técnicamente, una **migración de sitio** (cambio de dominio). No es solo cambiar DNS: el dominio está escrito en canonicals, Open Graph, JSON-LD, sitemap, `robots.txt` y `llms.txt`. Hay que coordinar **3 frentes** para no perder posicionamiento:

1. Hosting y DNS (Vercel + proveedor de dominio)
2. Cambios en el código (canonicals, sitemap, metadatos)
3. SEO (301, Search Console, "Cambio de dirección")

El mayor riesgo es **SEO**: todo el ranking actual vive en `gmvsolutions.es`. Si GMV ocupa el apex de golpe sin redirecciones, se pierde esa autoridad.

---

## Frente 1 — Hosting y DNS

### Vercel (proyecto de Reelevo)
*Settings → Domains:*
1. Añadir `reelevo.gmvsolutions.es` y marcarlo como dominio de **producción**.
2. `gmvsolutions.es` y `www.gmvsolutions.es`:
   - **Fase transición:** dejarlos en el proyecto de Reelevo con **redirección 301** hacia `reelevo.gmvsolutions.es` (mismas rutas).
   - **Fase final:** retirarlos de Reelevo para que GMV los use en su propio proyecto.

### Proveedor de DNS (donde se gestiona gmvsolutions.es)
- Añadir registro **CNAME**: `reelevo` → `cname.vercel-dns.com` (Vercel indica el valor exacto al añadir el dominio).
- Apex `gmvsolutions.es` y `www`: mantener apuntando a Vercel durante la transición (para servir las 301); repuntar a GMV en la fase final.

> ⚠️ **Pendiente:** confirmar qué proveedor de DNS se usa para detallar los pasos exactos del panel.

---

## Frente 2 — Cambios en el código

Buscar-y-reemplazar global: `https://gmvsolutions.es` → `https://reelevo.gmvsolutions.es`

### Archivos clave
| Archivo | Qué contiene |
|---|---|
| `astro.config.mjs` | `site:` — regenera el sitemap entero al cambiarlo |
| `src/layouts/BaseLayout.astro` | canonical por defecto (`Astro.url.href`) y `ogImage` (línea ~24) |
| `src/layouts/ArticleLayout.astro` | metadatos de artículos |
| `src/pages/sitemap.xml.ts` | generación de sitemap |
| `src/pages/**/*.astro` | canonicals, Open Graph y JSON-LD (datos estructurados) — el grueso de las ~177 ocurrencias |
| `public/robots.txt` | URL del sitemap y reglas |
| `public/llms.txt` | enlaces internos (muchas ocurrencias) |
| `public/sitemap-video.xml` | URLs de vídeo |

### Notas
- Hacerlo **de una sola vez** y desplegar. Dejar canonicals apuntando al dominio viejo confunde a Google y puede causar contenido duplicado.
- Revisar también logos/assets de marketing en la raíz (`reelevo-*.html`, tarjetas, flyers) si llevan la URL impresa — no afectan al SEO web pero conviene actualizarlos antes de reimprimir.
- Recomendado: hacerlo en una **rama** y revisar el diff antes de mergear.

---

## Frente 3 — SEO (lo más delicado)

Orden recomendado para **no perder ranking**:

1. **Primero** migrar Reelevo al subdominio con **301 desde el apex** hacia las rutas equivalentes en `reelevo.gmvsolutions.es`.
2. Dar de alta `reelevo.gmvsolutions.es` como **nueva propiedad en Google Search Console**.
3. Usar la herramienta **"Cambio de dirección"** (Change of Address) en Search Console.
4. **Reenviar el sitemap nuevo** (`https://reelevo.gmvsolutions.es/sitemap-index.xml`).
5. Esperar a que Google reindexe (semanas/meses, según volumen).
6. **Solo después** montar la web de GMV en el apex.

### El conflicto a tener en cuenta
El apex **no puede a la vez** redirigir a Reelevo *y* servir la web de GMV. Por eso el orden importa: las 301 deben convivir un tiempo antes de que GMV ocupe el dominio. Si GMV necesita el apex antes de que Google haya migrado el ranking, se asume pérdida temporal de posiciones.

### Checklist post-migración SEO
- [ ] 301 funcionando (probar varias URLs antiguas → nuevas)
- [ ] Canonicals apuntan ya al subdominio (ver código fuente de varias páginas)
- [ ] Sitemap nuevo accesible y enviado a Search Console
- [ ] "Cambio de dirección" confirmado en Search Console
- [ ] Actualizar URL en Google Analytics / GTM si aplica
- [ ] Actualizar enlaces en redes sociales, firmas de email, Google Business Profile, directorios y backlinks que controles
- [ ] Revisar CSP en `vercel.json` por si hay referencias al dominio (actualmente no las hay, pero verificar)
- [ ] Actualizar cualquier integración externa que tenga la URL hardcodeada (formularios, webhooks, etc.)

---

## Orden de ejecución sugerido (resumen)

1. Crear rama y aplicar **Frente 2** (cambios de código). Revisar diff.
2. Configurar `reelevo.gmvsolutions.es` en Vercel + CNAME en DNS (**Frente 1**).
3. Desplegar el código nuevo en el subdominio.
4. Configurar **301** desde el apex → subdominio.
5. Search Console: nueva propiedad + "Cambio de dirección" + sitemap (**Frente 3**).
6. Monitorizar reindexación unas semanas.
7. Liberar el apex y montar la web de GMV.

---

*Documento creado el 2026-05-31. Actualizar el estado a medida que se ejecuten los pasos.*
