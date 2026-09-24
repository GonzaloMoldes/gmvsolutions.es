# Recursos descargables: plantilla de SOP y plantilla de instrucción de trabajo

> **Escrito:** 2026-09-23 · **Repo:** `en-construccion` (web) · **Estado:** en curso · **5/7 tareas**
>
> Dos plantillas Word para descargar a cambio de una cuenta lead
> (`ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md`). Son los primeros recursos del
> catálogo de esa función y cierran promesas que la web ya hace y no cumple.

---

## Índice

1. [Por qué estas dos](#1)
2. [Principio de diseño](#2)
3. [Plantilla de SOP](#3)
4. [Plantilla de instrucción de trabajo](#4)
5. [Formato y marca](#5)
6. [Tareas y seguimiento de cumplimiento](#6)
7. [Preguntas abiertas](#7)

---

<a id="1"></a>
## 1. Por qué estas dos

**Promesas rotas en la web** (verificado el 2026-09-23):

| CTA | Artículos | Adónde lleva hoy |
|---|---|---|
| «Descargar plantilla SOP» | `documentar-procesos-mecanizado-cnc`, `instrucciones-de-trabajo-vs-sop`, `sop-mantenimiento-preventivo-guia-plantilla`, `programa-de-mantenimiento-preventivo` | A `/blog/plantilla-sop-produccion/` |
| «Descargar plantilla SOP» | `plantilla-sop-produccion` | `href="#"` con `TODO: enlazar el archivo descargable real` y el aviso «Plantilla descargable en preparación» |

Cinco artículos terminan en un botón que no descarga nada.

**Demanda** (`analisis_keywords_reelevo_v2.xlsx`, cluster SOP / Instrucciones):

| Keyword | Volumen estimado | Intención | Prioridad |
|---|---|---|---|
| `plantilla instrucción de trabajo` | 100–500 | Lead magnet | ALTA |
| `cómo hacer instrucciones de trabajo` | 100–500 | Informacional | ALTA |
| `plantilla SOP de producción` | — (en `MATRIZ_URL_INTENCION_SPRINT1.csv`, CTA «Descargar plantilla») | Informacional | P2 |

`plantilla instrucción de trabajo` **no tiene hoy ninguna página en la web**.

Son dos plantillas y no una porque el propio blog explica que son documentos distintos
(`instrucciones-de-trabajo-vs-sop`): el SOP ordena un proceso completo —qué, quién,
cuándo—; la instrucción resuelve una tarea en un puesto —el gesto, la herramienta, el
valor—. Una plantilla híbrida contradiría el artículo que la enlaza.

---

<a id="2"></a>
## 2. Principio de diseño

Tomado de `reelevo-gancho-generador.md` §0: **no se capa el documento, se capa el
ciclo de vida.**

- La plantilla es **completa y buena**. Si es mediocre no se usa, y un lead que no la
  usa no vuelve.
- Lleva los campos que **cualquier SOP o IT bien hecha lleva según norma**: control de
  cambios, cajetín de aprobación y registro de lectura. En papel, esos campos son los
  que cuesta mantener. La plantilla no lo dice con insistencia: se los enseña.
- Una única caja honesta, «Lo que esta plantilla no hace por ti», en la página de
  instrucciones. Nada de publicidad dentro de las hojas que se imprimen.
- **Seguridad:** en los ejemplos rellenos, los valores críticos (par de apriete,
  presiones, referencias) van **entre corchetes remitiendo al manual del fabricante**.
  Un ejemplo acaba copiado en un documento plastificado junto a una máquina, y una cifra
  inventada ahí es un riesgo laboral (R6 de `PLAN_CRM_LEADS`).

Coherencia: los ejemplos rellenos son **los mismos del artículo**
`instrucciones-de-trabajo-vs-sop`, el SOP de mantenimiento preventivo de una prensa y la
IT para sustituir su filtro hidráulico. La instrucción es uno de los pasos del SOP, que es
exactamente la relación que el artículo explica.

---

<a id="3"></a>
## 3. Plantilla de SOP

**Archivo:** `src/descargables/plantilla-sop-produccion-reelevo.docx` · **Catálogo:** `plantilla-sop`

Sigue los seis bloques que promete `plantilla-sop-produccion` en su FAQ, y los amplía con
lo que su tabla comparativa atribuye al SOP (responsables, frecuencias, registros).

| Página | Contenido |
|---|---|
| **1 · Cómo usarla** | SOP o IT (pregunta filtro: *¿qué pasa si falta quien lo sabe hacer?*) · 5 pasos para rellenarla · errores que la vuelven inútil · caja «Lo que esta plantilla no hace por ti» |
| **2 · El SOP (1 página)** | Los seis bloques del FAQ, en su orden: **cabecera** (proceso, código, versión, fecha, área, puesto) · **1 objetivo y alcance** (cubre, no cubre, cuándo se aplica, registros que genera) · **2 pasos** con punto de verificación, marca de crítico e IT relacionada · **3 parámetros clave** (nominal, tolerancia, criterio de aceptación, instrumento) · **4 si algo falla** (incidencia, causa, primera acción, a quién avisar) · **5 responsables y aprobación** (ejecuta, supervisa, valida + elaborado, revisado, aprobado) |
| **3 · Control** | Control de cambios (Rev 00 rellena, resto vacías) · registro de lectura |
| **4 · Ejemplo** | SOP de mantenimiento preventivo de la prensa hidráulica, relleno, también en una página |

---

<a id="4"></a>
## 4. Plantilla de instrucción de trabajo

**Archivo:** `src/descargables/plantilla-instruccion-de-trabajo-reelevo.docx` · **Catálogo:** `plantilla-it`

Sigue la anatomía del A4 de `reelevo-gancho-generador.md` §3, para que el día que exista
el generador, lo que produzca y esta plantilla sean el mismo documento.

| Página | Contenido |
|---|---|
| **1 · Cómo usarla** | Qué es una IT · 6 reglas (una tarea, un puesto; un paso por línea en imperativo; una foto por paso; críticos marcados; autocontrol con qué hacer si sale fuera; rellenarla con el operario) · caja «Lo que esta plantilla no hace por ti» |
| **2–3 · La IT** | Cabecera (código IT, revisión, fecha, área/línea/puesto, máquina marca y modelo, categoría del operario, tiempo estimado) · objeto y alcance · EPIs obligatorios (casillas) · herramientas, útiles y materiales · parámetros de proceso · pasos con hueco de foto y marca de crítico · autocontrol (qué, instrumento, frecuencia, tolerancia, si está fuera) · ante anomalía (qué se para, a quién se avisa) · documentos asociados · aprobación |
| **4 · Control** | Histórico de revisiones · acuse de lectura del operario |
| **5–6 · Ejemplo** | IT para sustituir el filtro hidráulico de la prensa, rellena |

---

<a id="5"></a>
## 5. Formato y marca

- **Word (`.docx`)**, porque es lo que se edita en una pyme. El FAQ del artículo ya
  explica los límites de Word frente a PDF; la plantilla no los esconde.
- A4 vertical, márgenes de 1,8 cm, **Arial** (las fuentes de la web, Oswald y DM Sans, no
  están instaladas en el PC del cliente y Word las sustituiría sin avisar).
- Naranja de marca `#F4521E` sólo en títulos de sección y marcas de crítico; texto en
  `#0A0A0A`. Cabeceras de tabla en gris claro, para que se imprima bien en blanco y negro.
- Pie discreto en todas las páginas: *Plantilla gratuita de REELEVO · gmvsolutions.es* y
  número de página.
- Casillas con `☐` en fuente `Segoe UI Symbol`, que Word trae en Windows.
- Probado abriéndolo en Word y exportado a PDF para revisar cada página.

---

<a id="6"></a>
## 6. Tareas y seguimiento de cumplimiento

### 6.1 Tablero

| Fase | Alcance | Hechas | % | |
|---|---|---:|---:|---|
| **A · Los archivos** | Generador, SOP, IT, revisión visual | 4/4 | **100 %** | ██████████ |
| **B · En la web** | Catálogo, página de la IT, CTAs | 1/3 | **33 %** | ███░░░░░░░ |
| | **TOTAL** | **5/7** | **71 %** | ███████░░░ |

Leyenda: ⬜ pendiente · 🟡 en curso · ✅ completada · ⛔ bloqueada (con el motivo).
Una tarea se cierra cuando se cumple todo su «Hecho cuando»; al cerrarla se rellenan
fecha y commit y se actualiza el tablero en el mismo commit.

```bash
grep -c "^\*\*Estado:\*\* ✅" PLAN_RECURSOS_SOP_IT_2026-09.md   # completadas
```

### Fase A — Los archivos

#### R-1 · Script generador de las plantillas

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-23 · **Commit:** `cb00191`
**Estimación:** ~1 h · **Depende de:** —

**Técnica**

- `scripts/descargables/generar-plantillas.cjs`, con la librería `docx` (npm). Un único
  script genera los dos `.docx` en `src/descargables/`, para que un cambio de marca o de
  pie se aplique a los dos a la vez y el documento se pueda regenerar en vez de editarse
  a mano.
- Helpers compartidos: cabecera y pie, título de sección, tabla con anchos en DXA (la
  suma de columnas = ancho útil de 9.866 DXA), filas vacías para rellenar, casillas.
- `docx` **no** se añade a `package.json` de la web, porque no es dependencia del sitio:
  `npm i --no-save docx && node scripts/descargables/generar-plantillas.cjs`.

**Hecho cuando**

- `node scripts/descargables/generar-plantillas.cjs` genera los dos archivos sin errores.

#### R-2 · Plantilla de SOP

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-23 · **Commit:** `cb00191`
**Estimación:** ~1 h · **Depende de:** R-1

**Técnica:** contenido de §3.

**Hecho cuando**

- La página 2 (el SOP en blanco) **cabe en una página A4**, como promete el artículo.
- Contiene los seis bloques del FAQ de `plantilla-sop-produccion`.
- El ejemplo no contiene ninguna cifra crítica inventada: van entre corchetes con
  referencia al manual.

#### R-3 · Plantilla de instrucción de trabajo

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-23 · **Commit:** `cb00191`
**Estimación:** ~1 h · **Depende de:** R-1

**Técnica:** contenido de §4.

**Hecho cuando**

- Contiene todos los bloques del A4 de `reelevo-gancho-generador.md` §3 menos el
  logo del cliente y el QR, que son del generador.
- Mismo criterio de seguridad en el ejemplo que R-2.

#### R-4 · Revisión visual

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-23 · **Commit:** `cb00191`
**Estimación:** ~30 min · **Depende de:** R-2, R-3

**Técnica:** abrir ambos en Word (automatización COM), exportar a PDF y revisar página
a página: saltos de página, tablas que no se parten mal, casillas visibles, pie en
todas las páginas.

**Hecho cuando**

- Ninguna tabla se corta entre páginas de forma que se pierda su cabecera.
- Los dos PDFs de revisión se han mirado página a página.

### Fase B — En la web

#### R-5 · Alta en el catálogo de descargables

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-24 · **Commit:** pendiente
*Cierre:* hecho dentro de DL-3. `plantilla-sop` y `plantilla-it` en `src/data/descargables.ts`, módulo `procesos`; `npm run check:descargables` los valida.
**Estimación:** ~15 min · **Depende de:** DL-3 de `ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md`

**Técnica:** entradas `plantilla-sop` (`modulo: 'procesos'`) y `plantilla-it`
(`modulo: 'procesos'`) en `src/data/descargables.ts`, `mime`
`application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

**Hecho cuando:** el script de DL-3 valida ambos ids.

#### R-6 · Página «Plantilla de instrucción de trabajo»

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Estimación:** ~½ día · **Depende de:** R-3 · **Bloqueada para publicar por:** DL-4

**Técnica:** artículo nuevo `src/pages/blog/plantilla-instruccion-de-trabajo.astro`
para `plantilla instrucción de trabajo`, con la misma estructura que
`plantilla-sop-produccion` (qué incluye, cómo rellenarla, errores, FAQ con `FAQPage`),
enlazado desde `instrucciones-de-trabajo-vs-sop` y `que-es-un-sop-industrial`. Alta en
`src/lib/blog.ts` y en `MATRIZ_URL_INTENCION_SPRINT1.csv`.

**Hecho cuando:** la página compila, pasa `scripts/validate-schema.mjs` y su botón lleva
`data-descarga="plantilla-it"`.

#### R-7 · Conectar los CTAs rotos

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Estimación:** ~1 h · **Depende de:** R-5, DL-4, DL-5

**Técnica:** en `plantilla-sop-produccion.astro`, sustituir `href="#"` por el destino sin
JavaScript y añadir `data-descarga="plantilla-sop"`; quitar el `TODO` y el aviso
«Plantilla descargable en preparación». Los otros cuatro artículos siguen enlazando a esa
página, que es lo correcto: allí se explica la plantilla antes de pedir los datos.

**Hecho cuando:** ningún CTA con `data-cta-intent="descarga"` de la web apunta a `#`
para las plantillas de SOP o IT.

### 6.2 Registro de cierres

| Fecha | Tarea | Commit | Nota |
|---|---|---|---|
| 2026-09-23 | R-1 | `cb00191` | `scripts/descargables/generar-plantillas.cjs`. Genera los dos `.docx` en `src/descargables/` |
| 2026-09-23 | R-2 | `cb00191` | SOP: 4 páginas. El SOP en blanco cabe en una. «Cuándo se aplica» y «Registros» se integraron en el bloque 1 y los responsables en el 5 para que cupiera y coincidiera con los seis bloques del FAQ |
| 2026-09-23 | R-3 | `cb00191` | IT: 6 páginas (instrucciones, IT en 2, control, ejemplo en 2) |
| 2026-09-23 | R-4 | `cb00191` | Revisadas en Word → PDF página a página. Ninguna tabla pierde su cabecera al partirse; casillas ☐/☒ visibles; pie en todas las páginas |
| 2026-09-24 | R-5 | pendiente | Entradas del catálogo, validadas por `check:descargables` |

---

<a id="7"></a>
## 7. Preguntas abiertas

1. **¿Versión PDF además del Word?** Un PDF de vista previa en la página del recurso
   ayuda a decidir la descarga. Propongo generarlo desde el mismo `.docx`.
2. **¿Hasta que exista la función de descarga con cuenta, se ofrecen sin formulario?**
   La espec dice que no (D-2). Mientras tanto, los CTAs siguen como están.
