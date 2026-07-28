# Auditoría SEO/GEO del site — seguimiento de desarrollos

**Abierto:** 2026-07-28
**Alcance:** las 68 páginas de gmvsolutions.es (medido sobre el build, no sobre el código)
**Estado:** cerrados los 15 hallazgos (5 en la sesion inicial + 10 en la de cierre)

Documento vivo. Cada hallazgo tiene criterio de aceptación y comando de verificación,
para que se pueda comprobar que está cerrado sin depender de quién lo hizo.

---

## 1. Cómo se mide

Todo lo que hay aquí se verifica contra `.vercel/output/static`, no contra `src/`.
Un cambio en el `.astro` no cuenta como cerrado hasta que aparece en el HTML generado.

```bash
npx astro build && python scripts/audit-seo.py
```

[scripts/audit-seo.py](scripts/audit-seo.py) comprueba de una vez todos los indicadores
de este documento y devuelve código de salida 1 mientras quede algo abierto, así que
sirve tal cual en un hook o en CI. Su salida usa los mismos identificadores (P1, P2…)
que las tablas de abajo.

Contadores sueltos, si se quiere mirar algo concreto:

```bash
# Cobertura de schema por tipo
grep -rho '"@type":"[A-Za-z]*"' .vercel/output/static --include=index.html | sort | uniq -c | sort -rn

# Páginas con FAQPage / con versión markdown
grep -rl '"@type":"FAQPage"' .vercel/output/static --include=index.html | wc -l
grep -rl 'type="text/markdown"' .vercel/output/static --include=index.html | wc -l
```

---

## 2. Línea base (2026-07-28)

| Métrica | Valor inicial | Objetivo |
| --- | --- | --- |
| Páginas indexables | 67 (+1 noindex) | — |
| Con `FAQPage` | 23 / 68 | **48 / 68 ✔** |
| Con `.md` alternate | 19 / 68 | **64 / 68 ✔** (el resto son `noindex`) |
| Páginas huérfanas | 6 | **0 ✔** |
| Tipos de schema inválidos | 1 (`ComparisonChart`, 7 págs.) | **0 ✔** |
| Meta descriptions > 160 car. | 21 | **0 ✔** |
| Titles > 70 car. | 7 | **0 ✔** |
| Páginas ausentes de `llms.txt` | 22 | **0 ✔** |
| URLs en `sitemap.xml` | 64 | — |

Lo que ya estaba bien y **no hay que tocar**: 0 títulos duplicados, 0 descripciones
duplicadas, 68/68 con H1 único y canonical, 67/67 con `BreadcrumbList`, 0 JSON-LD
inválido sintácticamente, `hreflang` es + x-default en todas, 0 `<img>` sin `alt`,
bundle `_astro` de 56 KB, `robots.txt` con GPTBot / ClaudeBot / PerplexityBot /
OAI-SearchBot permitidos.

---

## 3. Cerrado

Sesión 2026-07-27, commit `4f3a11e`.

| # | Hallazgo | Cómo se cerró |
| --- | --- | --- |
| C1 | 3 posts fuera del sistema de schema | `gestion-competencias-industria`, `onboarding-software-pymes` y `onboarding-vs-tradicional` migrados de `BaseLayout` a `ArticleLayout`: heredan el `BlogPosting` canónico, el byline de autor y el `.md` alternate |
| C2 | 15 posts sin FAQ ni `FAQPage` | Bloque FAQ visible + schema en los 15. Blog al 100% (19/19) |
| C3 | 8 posts servían `.md` sin fecha | `extractDate` en [src/lib/htmlToMarkdown.ts](src/lib/htmlToMarkdown.ts) lee también `date="..."` del tag |
| C4 | Posts sin índice con anclas | TOC añadido donde faltaba. 0 anclas rotas |
| C5 | Sitemap con `lastmod` uniforme y URLs canonicalizadas | `lastmod` real por página; fuera las 3 `/recursos/*`; 9 `SEGMENT_LABELS` que faltaban |

---

## 4. Cerrado en la sesion de cierre (2026-07-28)

| # | Hallazgo | Como se cerro | Estado |
| --- | --- | --- | --- |
| P1 | 6 paginas huerfanas, 4 comerciales | Cabeceras de tabla enlazadas + bloque de tarjetas en `/vs-alternativas/`; `/por-que-usar-reelevo/` y `/video-demo/` al footer; enlace cruzado entre los dos sectores | ☑ |
| P2 | `ComparisonChart` no existe en schema.org | Sustituido por `WebPage` + `about` en las 7 paginas, con nota en cada archivo para que no se reintroduzca | ☑ |
| P3 | 3 `/recursos/*` duplicadas | `noindex` (decision: mantener la URL viva en vez de redirigir con 301) | ☑ |
| P4 | 21 descriptions > 160 car. y 7 titles > 70 | Reescritas conservando keyword y beneficio | ☑ |
| P5 | `sitemap-video.xml` declaraba un video inexistente | Borrado el sitemap y su linea en `robots.txt` | ☑ |
| P6 | 25 paginas comerciales sin FAQ ni `FAQPage` | Bloque FAQ + schema desde una unica lista por pagina, via `FaqSection` + `faqPageSchema()` | ☑ |
| P7 | 22 indexables ausentes de `llms.txt` | Nueva seccion "Funcionalidades" con las 16 paginas de producto; el check excluye legales y duplicados a proposito | ☑ |
| P8 | Sin `.md` fuera del blog (19/68) | `[...slug].md.ts` para todo el site; el `rel="alternate"` pasa a `BaseLayout`. Cobertura 64/68 | ☑ |
| P10 | Imagen OG unica de 359 KB | `factory-bg.jpg` recomprimida a 209 KB (la usa `.hero-bg` a 2000px) + `og-default.jpg` derivada a 1200x630 (102 KB) | ☑ |

**Decisiones tomadas que cambian el criterio de medida**

- **P3** — se descarto la redireccion 301: las URLs siguen vivas con `noindex`. El check
  solo reporta duplicados que ademas sigan siendo indexables.
- **P7** — `llms.txt` es un indice curado, no un sitemap: se excluyen las paginas legales
  y las `/recursos/*` duplicadas.
- **P10** — se descarto tener una imagen OG por seccion. Se mantiene una sola y lo que se
  mide es que exista y no pase de 150 KB.

**P11 — La CSP bloqueaba dominios que el sitio carga (2026-07-28)**

`vercel.json` no permitia `js.storylane.io` en `script-src` ni `app.storylane.io` en
`frame-src`, asi que el demo interactivo nunca podia cargar. Al revisar la politica
completa aparecieron dos bloqueos previos: `egoi.site` (el tag de Connected Sites
nunca se ejecuto) y `consentcdn.cookiebot.com` en `style-src`. Anadido el check P11,
que compara cada dominio externo del HTML contra lo que la CSP permite.

**Dominio canonico: www (2026-07-29)**

El sitio sirve en `www.gmvsolutions.es` y el apex redirige a el, pero todo el codigo
declaraba el apex: canonicals, `hreflang`, `og:url`, sitemap, `llms.txt` y los `@id`
del schema. Es decir, el canonical apuntaba a una URL que redirige. Decision: **www es
el dominio bueno**, y se han migrado las 170 referencias, incluido `site` en
`astro.config.mjs`. `/onboarding-software-pymes/` era la unica pagina sin canonical
explicito —lo heredaba de `site`— y ahora lo declara.

**Pendiente fuera del repositorio:** anadir `www.gmvsolutions.es` al grupo de dominios
en el panel de Cookiebot. Hoy `consentcdn.cookiebot.com/consentconfig/<cbid>/www.gmvsolutions.es/configuration.js`
devuelve **404**, y por eso no aparece el banner de cookies. Sin banner nadie puede
aceptar, y con `blockingmode="auto"` todo lo que dependa del consentimiento queda
bloqueado. Conviene ademas cambiar la redireccion apex -> www de 307 a 308 en Vercel.

**Defectos encontrados al verificar y corregidos de paso**

- `/blog/trazabilidad-de-un-producto/` tenia en el `FAQPage` una pregunta que no estaba
  visible en la pagina. Un schema que no coincide con el contenido visible incumple las
  directrices de Google; se anadio la respuesta que faltaba.
- `/vs-alternativas/` enlazaba a `/recursos/que-es-un-sop-industrial/`, que no existe.
  Corregido a `/blog/que-es-un-sop-industrial/`.

---

## 5. Detalle por hallazgo

### P1 — Seis páginas huérfanas

`/vs-dozuki/`, `/vs-gembadocs/`, `/vs-knowby/`, `/vs-poka/`, `/por-que-usar-reelevo/`
y `/sectores/alimentacion/` no reciben **ningún** enlace interno. Están en el sitemap,
pero nada del site apunta a ellas.

Lo relevante: `/vs-alternativas/` está en el footer, es el hub natural de las
comparativas, y no enlaza a ninguna de las cuatro `/vs-*/`. Son las páginas de mayor
intención comercial del site — quien busca "Dozuki alternativa" está evaluando compra.

**Criterio de aceptación:** 0 páginas indexables con 0 enlaces entrantes.

```bash
python -c "
import re,io,glob,os,collections
R='.vercel/output/static'; P={}
for f in glob.glob(R+'/**/index.html',recursive=True):
    u='/'+os.path.relpath(f,R).replace('\\\\','/').replace('index.html','')
    P[re.sub('//+','/',u)]=io.open(f,encoding='utf-8',errors='replace').read()
inb=collections.Counter()
for u,s in P.items():
    for l in set(re.findall(r'href=\"(/[^\"#?]*)\"',s.split('<body',1)[-1])):
        l=l if l.endswith('/') else l+'/'
        if l in P: inb[l]+=1
print('HUERFANAS:',[u for u in P if inb[u]==0 and u!='/'])"
```

### P2 — `ComparisonChart` no es un tipo válido

Siete páginas lo emiten: las seis `/vs-*/` y `/recursos/onboarding-vs-tradicional/`.
No está en el vocabulario de schema.org, así que Google descarta el bloque entero sin
avisar. Resultado: esas páginas solo tienen `Organization` + `BreadcrumbList`, ningún
schema que describa su contenido.

**Sustituto sugerido:** `FAQPage` con las preguntas de comparación (encaja con P6) más
`WebPage` con `about: [SoftwareApplication REELEVO, SoftwareApplication <competidor>]`.
No usar `Product` con `AggregateRating` salvo que haya reseñas reales verificables.

**Criterio de aceptación:** 0 apariciones de `ComparisonChart` en el build.

```bash
grep -rl 'ComparisonChart' .vercel/output/static --include=index.html | wc -l   # -> 0
```

### P3 — `/recursos/*` duplicadas

`/recursos/gestion-competencias-industria/`, `/recursos/onboarding-software-pymes/` y
`/recursos/onboarding-vs-tradicional/` canonicalizan a su gemela en `/blog/` pero siguen
generando HTML completo. Ya salieron del sitemap (C5). `/recursos/onboarding-vs-tradicional/`
son 535 palabras: la página más fina del site.

**Decisión pendiente:** `noindex`, redirección 301, o borrarlas. La 301 es la más limpia
si no hay enlaces externos apuntando a ellas; el `noindex` es lo más conservador.

### P4 — Meta descriptions y titles

21 descriptions superan los 160 caracteres y 7 titles superan los 70. Google trunca las
descriptions en ~155-160 caracteres y los titles por ancho en píxeles (~600px, unos 60
caracteres). Truncar no penaliza el posicionamiento, pero corta el mensaje justo donde
decide el clic.

Las peores, por orden:

| Página | Description |
| --- | --- |
| `/obras-trazabilidad/` | 225 |
| `/modo-offline/` | 219 |
| `/workflows/` | 217 |
| `/portal-operario/` | 213 |
| `/api-integraciones/` | 213 |
| `/firma-digital/` | 205 |
| `/software-gestion-pyme-industrial/` | 197 |
| `/documentacion-procesos/` | 192 |
| `/` | 187 |

El resto queda entre 163 y 184: reescribirlas es opcional. El caso claro es
`/por-que-usar-reelevo/`, con un `<title>` de **92 caracteres**.

**Prioridad real:** las 9 de la tabla y el title de 92. Las que rozan el límite (163-175)
pueden esperar; el script las lista igualmente porque el umbral es fijo.

**Criterio de aceptación:** ninguna description > 160 car.; ningún title > 70 car.

### P5 — Sitemap de vídeo roto

**Parcialmente cerrado (2026-07-28).** El `VideoObject` de `/video-demo/` ya no existe:
declaraba un vídeo de 6 minutos en `video.gmvsolutions.es/demo` con thumbnail en
`/video-thumbnail.jpg`, y no había ningún vídeo en la página — solo un placeholder
decorativo. Sustituido por `softwareApplicationSchema()`.

**Queda:** `public/sitemap-video.xml` sigue declarando un vídeo en `/video-demo/` y
referenciando el thumbnail inexistente, y sigue anunciado en `robots.txt`.

Ahora la decisión es más simple, porque ya sabemos que **no hay vídeo en ninguna página**:
lo que hay es un demo interactivo de Storylane, que no es un `VideoObject`. Salvo que se
grabe un vídeo real, lo correcto es borrar `sitemap-video.xml` y su línea en `robots.txt`.
Un sitemap que apunta a recursos inexistentes resta confianza en los demás.

### P6 — FAQ en producto y comparativas

26 páginas sin FAQ ni `FAQPage` — 25 indexables más `/kit-digital-pyme-industrial/`, que
hoy es `noindex` y por eso el script no la cuenta. El blog ya está al 100%; la capa
comercial a 0.

Es el hallazgo de mayor impacto en citación por IA. Cuando alguien pregunta "software
para documentar procesos en fábrica", lo que se cita es la página con respuesta
estructurada — y esa consulta debería aterrizar en producto, no en el blog.

Páginas afectadas: `/api-integraciones/`, `/calidad-y-conformidad/`, `/cobertura-turnos/`,
`/control-produccion/`, `/documentacion-procesos/`, `/firma-digital/`, `/gestion-competencias/`,
`/integracion-m365/`, `/kaizen/`, `/kit-digital-pyme-industrial/`, `/mantenimiento/`,
`/modo-offline/`, `/obras-trazabilidad/`, `/onboarding-software-pymes/`, `/por-que-usar-reelevo/`,
`/portal-operario/`, `/precios/`, `/video-demo/`, `/vs-alternativas/`, `/vs-dozuki/`,
`/vs-excel-papel/`, `/vs-gembadocs/`, `/vs-knowby/`, `/vs-mes-tradicional/`, `/vs-poka/`,
`/workflows/`.

**Patrón a seguir** (el mismo del blog): respuestas duplicadas en HTML visible y en el
JSON-LD, 4-5 preguntas por página, escritas contra el contenido real de esa página.
Ver [src/pages/blog/onboarding-digital-errores-manuales.astro](src/pages/blog/onboarding-digital-errores-manuales.astro)
como referencia.

**Aviso:** en las `/vs-*/` las respuestas no deben inventar precios ni funciones del
competidor. Quedarse en criterios, como ya hace
[software-sop-para-fabricas-comparativa](src/pages/blog/software-sop-para-fabricas-comparativa.astro).

### P7 — `llms.txt` incompleto

Faltan 22 páginas indexables, entre ellas diez de producto (`/control-produccion/`,
`/mantenimiento/`, `/kaizen/`, `/modo-offline/`, `/firma-digital/`, `/api-integraciones/`,
`/integracion-m365/`, `/obras-trazabilidad/`, `/calidad-y-conformidad/`, `/cobertura-turnos/`)
y `/faqs/`, que es justo la página con más contenido pregunta-respuesta del site.

**Riesgo de mantenimiento:** `llms.txt` es un archivo estático en `public/`, así que se
desincroniza cada vez que se publica algo. Merece la pena evaluar generarlo como endpoint
(`src/pages/llms.txt.ts`) igual que ya se hace con `llms-full.txt`.

### P8 — `.md` fuera del blog

19 de 68 páginas. El endpoint [src/pages/blog/\[slug\].md.ts](src/pages/blog/[slug].md.ts)
solo cubre `/blog/`. Las 48 páginas de producto, caso de uso y sector no ofrecen versión
markdown, que es el formato que prefieren los agentes.

El conversor [src/lib/htmlToMarkdown.ts](src/lib/htmlToMarkdown.ts) ya es genérico; lo que
falta es un endpoint equivalente para el resto de rutas.

### P9 — H2 declarativos en la capa comercial

Casi todas las páginas de producto tienen 0 de 4-5 H2 en formato pregunta. No hace falta
convertirlos todos: basta con que el **primer párrafo de cada sección responda de forma
autónoma en 40-60 palabras**, que es el fragmento que se extrae.

### P10 — Imagen OG única

`factory-bg.jpg` (359 KB) en las 68 páginas. Cada compartición en LinkedIn o WhatsApp se
ve idéntica. Mínimo razonable: una por sección (blog / producto / comparativas), y
comprimir la actual.

---

## 6. Registro de cambios

| Fecha | Qué | Commit |
| --- | --- | --- |
| 2026-07-27 | C1-C5: migración de layout, FAQ en 15 posts, fix `extractDate`, TOC, sitemap. Publicado `onboarding-digital-errores-manuales` e indexado `digitalizar-produccion-pyme-industrial` | `4f3a11e` |
| 2026-07-28 | Auditoría completa del site (68 páginas). Apertura de este documento y de [scripts/audit-seo.py](scripts/audit-seo.py) | — |
| 2026-07-28 | Cierre de P1, P2, P3, P4, P5, P6, P7, P8 y P10. Auditoría en 0 hallazgos abiertos | `f0e027a`, `29ccf5c` + este |
| 2026-07-28 | Demo interactivo de Storylane en `/video-demo/` y `/como-funciona/` vía [StorylaneDemo.astro](src/components/StorylaneDemo.astro). Retirado el `VideoObject` falso (P5 parcial) | — |

**Leyenda de estado:** ☐ abierto · ◐ parcial · ☑ cerrado · ✗ descartado (con motivo)

---

## 7. Cómo cerrar un hallazgo

1. Aplicar el cambio en `src/`.
2. `npx astro build && python scripts/audit-seo.py` — el indicador debe bajar a 0.
3. Marcar ☑ en la tabla de la sección 4 y mover la fila a la sección 3 con el commit.
4. Añadir la línea al registro de cambios.

Si un hallazgo se decide **no** arreglar, no se borra: se marca como descartado con el
motivo. Un indicador que desaparece sin explicación reaparece en la siguiente auditoría.
