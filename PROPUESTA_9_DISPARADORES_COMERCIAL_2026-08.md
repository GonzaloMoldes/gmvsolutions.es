# Propuesta — Cubrir los 9 disparadores de compra en la web comercial

**Fecha:** 2026-08-19
**Alcance:** solo páginas comerciales. El blog queda fuera (ya cubre bien lo informativo; aquí se le usa como fuente de tráfico hacia las páginas nuevas).
**Objetivo:** que los 9 motivos reales por los que una pyme industrial compra este software tengan una puerta de entrada comercial y terminen en un registro de cuenta.
**Base:** análisis de las 74 páginas publicadas (`dist/client`, ~94.000 palabras), `MAPA_FUNCIONAL_PRODUCTO.md` y `REELEVO_GUIA_MAESTRA_MENSAJE_Y_VOCABULARIO.md`.

---

# ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ESTADO: 100 % EJECUTADO

**Última actualización:** 2026-08-20 · **Las tres fases y la deuda, cerradas.** Lo que queda no es de este plan: son las decisiones de dominio y marca del anexo de Search Console

| Fase | Qué cubre | Estado | Peso |
|---|---|---|---|
| **Fase 1** — Que los 9 estén nombrados | Hub de autodiagnóstico, entrada en el menú, cuarta escena de la home, limpieza de claims | **☑ 100 %** | 0,95 j |
| **Fase 2** — Abrir el eje que falta | Las dos páginas nuevas y su entrada en el menú | **☑ 100 %** | 2,35 j |
| **Fase 3** — Adopciones y conversión | Disparadores 5, 8 y 9 · vocabulario · CTAs y medición | **☑ 100 %** | 2,30 j |
| **Deuda** — Cifras sin fuente | Stats de sector sin atribuir y claims de `/recursos/` | **☑ 100 %** | 0,70 j |

**Cálculo:** 6,40 de 6,40 jornadas estimadas = **100 %**. El denominador subió tres veces (5,60 → 6,00 → 6,30 → 6,40) porque fueron apareciendo cosas que el plan original no había visto: **M6d**, **L4** y **S1**. Se deja explícito en vez de disimularlo en el porcentaje.

### Cobertura comercial por disparador — 41 % → 72 % → 81 % → 87 % → **94 %**

Se mide con tres casillas por disparador: **①** tiene tarjeta en el hub de autodiagnóstico · **②** tiene una página de destino que lo resuelve · **③** esa página lo lleva en el H1. En ③, `◐` significa que el disparador tiene sección propia con su H2, su ancla y su CTA medido, pero comparte página con otro disparador que se queda el H1.

| # | Disparador | ① Hub | ② Destino | ③ H1 | |
|---|---|:---:|:---:|:---:|---|
| 1 | Reducir errores | ☑ | ☑ | ☑ | 100 % |
| 2 | Formar empleados nuevos | ☑ | ☑ | ☑ | 100 % |
| 3 | No depender de un trabajador concreto | ☑ | ☑ | ☑ | 100 % |
| 4 | Mantener procedimientos cuando alguien se marcha | ☑ | ☑ | ☑ | 100 % |
| 5 | Reducir tiempo de aprendizaje | ☑ | ☑ | ◐ | 83 % |
| 6 | Estandarizar operaciones | ☑ | ☑ | ◐ | 83 % |
| 7 | Que no cada uno lo haga a su manera | ☑ | ☑ | ☑ | 100 % |
| 8 | Recuperar conocimiento perdido | ☑ | ☑ | ◐ | 83 % |
| 9 | Resolver sin llamar al encargado | ☑ | ☑ | ☑ | 100 % |

**Los nueve tienen tarjeta, página y sección propia.** Los tres `◐` que quedan son deliberados, no deuda: el 5, el 6 y el 8 comparten página con un disparador hermano que se queda el H1 porque es el que la gente dice en voz alta —«hay que enseñarle todo», «tres turnos, tres criterios», «¿qué pasa cuando se vaya?»—. Convertirlos en páginas propias solo tendría sentido si la medición demuestra que traen búsqueda por su cuenta.

### Tareas

| Tarea | Qué es | Estado | Peso |
|---|---|:---:|---|
| **M2** | Hub de autodiagnóstico en `/por-que-usar-reelevo/` | ☑ | 0,50 |
| **M2b** | El hub entra en el menú: «Qué resuelve» en primer nivel | ☑ | 0,10 |
| **M1** | Cuarta escena en la home | ☑ | 0,15 |
| **L1** | Retirar los claims sin respaldo de las páginas comerciales | ☑ | 0,15 |
| **M6c₁** | `cta_trigger` en el tracker de `BaseLayout` | ☑ | 0,05 |
| **M3a** | Página `/consistencia-entre-turnos/` | ☑ | 1,00 |
| **M3b** | Página `/errores-en-planta/` | ☑ | 1,00 |
| **M3c** | Menú *Por caso de uso*: de 4 a 6 entradas | ☑ | 0,15 |
| **M3d** | Repuntar las tarjetas 1, 6 y 7 del hub · enlaces desde el blog | ☑ | 0,20 |
| **M4a** | Disparador 5 en `/casos-de-uso/onboarding-operarios/` y `/gestion-competencias/` | ☑ | 0,30 |
| **M4b** | `/portal-operario/` recolocado en el menú + solicitudes de contenido | ☑ | 0,40 |
| **M4c** | Sección «Ya se ha ido» en `/casos-de-uso/transferencia-conocimiento/` | ☑ | 0,30 |
| **M5** | Vocabulario del comprador en los H1 de las páginas tocadas | ☑ | 0,30 |
| **S1** | 301 del apex a `www` y cierre de las URLs zombis `/en/` y `/pt/` | ☑ | 0,10 |
| **M6a** | CTA con el verbo del disparador en el resto de páginas | ☑ | 0,20 |
| **M6b** | Subir a 3 CTAs las 7 páginas que siguen con uno solo | ☑ | 0,40 |
| **M6d** | Las 12 páginas que siguen con un solo CTA de registro | ☑ | 0,40 |
| **L2** | Cifras de sector sin fuente: decidir atribución o retirarlas | ☑ | 0,10 |
| **L3** | Claims de `/recursos/*` (fuera del alcance comercial estricto) | ☑ | 0,30 |
| **L4** | Tablas de comparación y ROI inventadas en `/blog/onboarding-vs-tradicional/` | ☑ | 0,30 |

> **Cómo mantener este bloque.** Al cerrar una tarea: marcar ☑, recalcular el peso acumulado sobre el denominador vigente (hoy 6,40), actualizar la barra del título (cada ▓ son 5 puntos porcentuales) y revisar si alguna casilla de la tabla de cobertura pasa de `◐` a `☑`. Estados: `☐ pendiente` · `◐ en curso o parcial` · `☑ hecho` · `⊘ descartado (con motivo)`, igual que en `PLAN_CORRECCIONES_WEB_VS_APP_2026-08.md`.

---

## 1. Resumen ejecutivo

La web vende **dos** de los nueve disparadores: *falta alguien* y *entra alguien*. Los otros siete existen en el texto, pero como argumentos de apoyo dentro de páginas que van de otra cosa, o solo en artículos del blog. El visitante que llega con uno de esos siete dolores no encuentra una página que se llame como su problema.

El hueco no son siete temas sueltos. Es **un eje comercial entero que falta** —consistencia— y **tres disparadores huérfanos** que ninguna página reclama como suya.

Lo importante: **no hay que inventar producto**. Las nueve necesidades ya tienen respaldo funcional real en la app (sección 6 de este documento). Lo que falta es nombrarlas en la web con las palabras del que compra.

**Coste estimado:** 2 páginas nuevas + 1 reescritura de página existente + 5 secciones añadidas + limpieza de 3 cifras sin respaldo. Unos 4-6 días de trabajo, repartidos en 3 fases que se pueden publicar por separado.

---

## 2. Los 9 disparadores no son 9 mercados: son 3 ejes de compra

| Eje | Disparadores que agrupa | Estado en la web |
|---|---|---|
| **A · Continuidad** — que la planta no se pare porque falta una persona | 3 · no depender de un trabajador concreto<br>4 · mantener los procedimientos cuando alguien se marcha<br>8 · recuperar conocimiento perdido | **Sólido.** Home, `/casos-de-uso/cobertura-bajas/`, `/casos-de-uso/transferencia-conocimiento/`, `/como-funciona/`, `/cobertura-turnos/` |
| **B · Incorporación** — que alguien nuevo llegue a producir antes y sin quemar al mejor operario | 2 · formar empleados nuevos<br>5 · reducir el tiempo de aprendizaje<br>9 · resolver sin llamar al encargado | **Parcial.** El 2 está sobrerrepresentado (817 menciones). El 5 y el 9 casi no existen |
| **C · Consistencia** — que el trabajo salga igual lo haga quien lo haga | 1 · reducir errores<br>6 · estandarizar operaciones<br>7 · que no cada uno lo haga a su manera | **No existe como eje.** El 1 está al 83 % en blog, el 7 tiene 31 menciones en toda la web y 0 en la home |

Esto es lo que hay que corregir: **la web tiene dos patas y necesita tres.**

---

## 3. Dónde vivía cada disparador antes de empezar

> Foto del **2026-08-19, antes de la Fase 1**. Se deja fija como línea base: el estado actualizado está en el bloque de cobertura de la cabecera.

| # | Disparador | Página que lo posee hoy | Está en el H1 | Veredicto |
|---|---|---|---|---|
| 1 | Reducir errores | *(ninguna)* | ✗ | **Sin puerta comercial** |
| 2 | Formar empleados nuevos | `/casos-de-uso/onboarding-operarios/` | ✓ | Bien |
| 3 | No depender de un trabajador concreto | `/` + `/como-funciona/` | ✓ | Bien |
| 4 | Mantener procedimientos cuando alguien se marcha | `/casos-de-uso/transferencia-conocimiento/` | ✓ | Bien |
| 5 | Reducir tiempo de aprendizaje | *(disperso)* | ✗ | **Huérfano** |
| 6 | Estandarizar operaciones | `/documentacion-procesos/` | ✗ (dice "accesible") | Escondido tras palabra de producto |
| 7 | Que no cada uno lo haga a su manera | *(ninguna)* | ✗ | **Sin puerta comercial** |
| 8 | Recuperar conocimiento perdido | `/casos-de-uso/transferencia-conocimiento/` | ✗ (solo en clave preventiva) | Falta el ángulo curativo |
| 9 | Resolver sin llamar al encargado | `/portal-operario/` | Casi (H2 exacto) | Enterrado como funcionalidad en el menú |

---

## 4. Los seis movimientos

### ☑ M1 · La home nombra el eje que falta — *hecho 2026-08-19*

**Fichero:** [`src/pages/index.astro`](src/pages/index.astro) — bloque `#casos`, líneas 159-228.

Hoy la home plantea tres escenas: *El experto no ha venido* · *Incorporación nueva* · *La operación diaria*. Cubren los disparadores 3, 4 y 2. **Falta la cuarta escena**, que es la que abre el eje C y da entrada a los disparadores 1, 6 y 7.

Se añade un cuarto `<div class="caso">` con la misma maqueta que los tres existentes:

```
Tag:      Tres turnos, tres criterios
Título:   «La misma pieza sale
          distinta según
          quién esté.»
Desc:     La instrucción existe, pero cada uno la interpreta a su manera. El veterano
          se salta dos pasos porque «siempre lo ha hecho así», el de tarde ajusta
          distinto, el de noche improvisa. Nadie hace nada mal a propósito:
          simplemente no hay una versión única de cómo se hace.
Bullets:  · Errores que se repiten sin que nadie sepa de dónde salen
          · Mejorar es imposible si cada turno parte de un método distinto
          · La no conformidad aparece meses después y no hay rastro de qué se hizo
```

**Nota de maqueta:** `.casos` está definido en [`src/styles/global.css:245`](src/styles/global.css#L245) como `grid-template-columns: repeat(3, minmax(0,1fr))`. Con cuatro tarjetas quedaría una huérfana en la segunda fila. La clase es global y la usan otras páginas, así que **no se toca**: se sobreescribe solo en la home con `grid-template-columns: repeat(2, minmax(0,1fr))` a partir de ~900 px, que además da más ancho al titular entrecomillado y lo hace más legible.

**Lo que NO se toca:** el hero, el sub-hero de tres tarjetas (Continuidad / Visibilidad / 60 días) ni el bloque de datos del sector. El ancla de la prueba gratuita se acaba de colocar y funciona; esta propuesta no la mueve.

**Ejecutado.** Cuarta tarjeta añadida con ese copy y rejilla en 2×2 mediante estilo scoped en la propia home. Se ajustó también el `section-sub` del bloque, que anunciaba solo tres focos («Bajas, incorporaciones y turnos sin trazabilidad»), para que incluya el cuarto.

---

### ☑ M2 · `/por-que-usar-reelevo/` pasa a ser el hub de autodiagnóstico de los 9 — *hecho 2026-08-19*

**Fichero:** [`src/pages/por-que-usar-reelevo.astro`](src/pages/por-que-usar-reelevo.astro) (489 líneas, reescritura de contenido — se conserva maqueta y estilos).

Es la mejor página para esto y hoy está desaprovechada: su H1 está escrito en lenguaje de proveedor (*«¿Tu planta depende de onboarding informal y competencias invisibles?»* — nadie busca eso ni lo dice) y **tiene un solo CTA en toda la página**, el más bajo de todo el sitio comercial junto con `/kaizen/` y `/modo-offline/`.

**H1 nuevo:** «¿Cuál de estos nueve problemas tienes hoy?»

**Subtítulo:** «Casi ninguna pyme industrial los tiene los nueve. Con dos basta para que la planta vaya a trompicones. Elige el tuyo y verás qué cambia exactamente.»

La sección `#desafio` (hoy tres `challenge-card`) pasa a ser una rejilla de **nueve tarjetas**, cada una con el dolor en las palabras del cliente, una línea de qué cambia y un enlace a la página que lo resuelve:

| # | Título de la tarjeta (voz del cliente) | Qué cambia | Enlaza a |
|---|---|---|---|
| 1 | «Cometemos errores que se podrían evitar» | El criterio correcto está delante en el momento de decidir, no en un plastificado de 2023 | `/errores-en-planta/` *(nueva)* |
| 2 | «Cada vez que entra alguien hay que enseñárselo todo» | El proceso está en la máquina desde el primer día. El tutor deja de repetir lo mismo | `/casos-de-uso/onboarding-operarios/` |
| 3 | «Si falta Martínez, ese puesto no arranca» | Lo que sabe Martínez está en el puesto, no solo en su cabeza | `/casos-de-uso/cobertura-bajas/` |
| 4 | «Cuando alguien se va, se lleva su forma de trabajar» | El proceso queda escrito, versionado y accesible antes de que se marche | `/casos-de-uso/transferencia-conocimiento/` |
| 5 | «Tarda semanas en ir solo» | Ves en qué paso se atasca y cuánto tarda frente al titular, en vez de estimarlo | `/gestion-competencias/` |
| 6 | «Cada uno tiene su método» | Una sola versión vigente, y quien esté certificado recibe el aviso cuando cambia | `/consistencia-entre-turnos/` *(nueva)* |
| 7 | «No hay dos turnos que lo hagan igual» | REELEVO señala qué procesos tienen más variación entre personas | `/consistencia-entre-turnos/` *(nueva)* |
| 8 | «El que sabía esto ya no está» | Grabas al que queda haciéndolo y sale un proceso editable. También desde tus Word y PDF | `/casos-de-uso/transferencia-conocimiento/` |
| 9 | «Me llaman para todo» | El operario resuelve en el puesto lo que hoy resuelve una llamada al encargado | `/portal-operario/` |

Tras la rejilla, CTA de registro. Y otro al cierre. **De 1 CTA a 3.**

**Ejecutado.** Publicado con las nueve tarjetas y cuatro CTAs de registro. Tres cosas salieron distintas de lo previsto:

1. **Los CTAs de esta página no estaban medidos.** El inventario decía «1 CTA» y resultó ser el botón del menú móvil: los tres enlaces a registro que había en el cuerpo **no llevaban `data-cta`**, así que ninguna alta procedente de esta página aparecía en GA4. Ahora los cuatro están instrumentados.
2. **Destinos interinos.** La tarjeta 1 apunta a `/calidad-y-conformidad/` en vez de a `/documentacion-procesos/`: encaja mejor con «errores» hasta que exista `/errores-en-planta/`. Las tarjetas 6 y 7 sí van a `/documentacion-procesos/`. Los tres enlaces están marcados con un comentario en el `.astro` para no olvidarlos en la Fase 2.
3. **Se eliminó la tabla de riesgos** (sección `#riesgos`, tres filas). Repetía en lenguaje de proveedor lo que las tarjetas 2, 3 y 5 ya dicen en lenguaje de cliente, y dejaba la página demasiado larga por encima del primer CTA. También se retiró de la banda de prueba el reclamo *«Diagnóstico de riesgo en 2 minutos»*, que prometía algo que no existe, y el bloque de cifras se realineó con la oferta vigente (60 días de Pro sin tarjeta → plan Free) en lugar de anclar en 49 €.

Además se añadió una FAQ nueva —*«¿Tengo que resolver los nueve a la vez?»*— porque es la objeción inmediata al ver una rejilla de nueve problemas, y sin respuesta la página desanima en vez de convertir.

---

### ☑ M2b · El hub entra en el menú — *hecho 2026-08-19*

**El fallo:** el hub se publicó sin puerta de entrada. `/por-que-usar-reelevo/` **no estaba en el menú de cabecera**: solo colgaba del footer, en la columna «REELEVO», y ninguna página del sitio la enlazaba de forma contextual. Aparecía en las 74 páginas del build únicamente porque el pie es global. Una página de autodiagnóstico a la que solo se llega por el footer no diagnostica a nadie.

Rastro de que llevaba tiempo así: la página ya declaraba `activeNav="por-que-usar-reelevo"`, pero el `Header` solo reconoce `como-funciona`, `precios` y `recursos`/`blog`. Ese atributo no hacía nada desde hace tiempo.

**La solución elegida** (de tres opciones: primer nivel · tercera columna dentro de *Soluciones* · dejarlo en el footer):

```
ANTES  REELEVO   Cómo funciona  Plataforma▾  Soluciones▾  Precios  Recursos▾   [Probar gratis]
AHORA  REELEVO   Qué resuelve  Cómo funciona  Plataforma▾  Soluciones▾  Precios  Recursos▾   [Probar gratis]
```

Va **antes** de «Cómo funciona» a propósito: el visitante decide primero si reconoce su problema, y solo después le interesa el mecanismo. Añadido también como primer enlace del menú móvil, y el `activeNav` ya funciona.

**Un mismo nombre en todas partes.** La página se llamaba de tres formas distintas a la vez: «Por qué usar REELEVO» en el footer, otra en la miga y un H1 diferente. Ahora el enlace del header, el del footer y la miga dicen **«Qué resuelve»**; el `<title>` conserva *«Por qué usar REELEVO en tu pyme industrial»* para búsqueda. Ficheros: [`Header.astro`](src/components/Header.astro), [`Footer.astro`](src/components/Footer.astro#L37), [`seo.ts`](src/lib/seo.ts#L115) (`SEGMENT_LABELS`, que alimenta la miga visible y el `BreadcrumbList`).

**Pendiente relacionado (Fase 2):** el hub sigue sin enlaces contextuales. Deberían apuntarle la home —tras las cuatro escenas— y cada página de caso de uso, con un «¿tu problema es otro? mira los nueve».

**Por qué esta página es la de mayor retorno del plan:** es la única que puede cubrir los nueve disparadores de golpe sin crear nueve páginas, funciona como distribuidor interno hacia las páginas que sí convierten, y permite medir en GA4 qué dolor mueve realmente a la gente (ver M6).

---

### ☑ M3 · Dos páginas nuevas que abren el eje C — *cerrada 2026-08-20*

#### ☑ M3.a — `/consistencia-entre-turnos/` — *publicada 2026-08-19*

Cubre los disparadores **6 y 7**. Entra en el menú *Soluciones › Por caso de uso* como quinta entrada.

```
H1:   Tres turnos haciendo la misma pieza de tres maneras
Sub:  No es indisciplina. Es que la instrucción está en un plastificado de hace
      tres años y cada uno ha aprendido de alguien distinto.
```

Estructura (misma que `/casos-de-uso/cobertura-bajas/`, que ya funciona):

1. **De dónde sale la variación.** Tres causas concretas: se aprende por transmisión oral, conviven versiones distintas del mismo procedimiento, y el veterano tiene atajos que nunca se escribieron.
2. **Qué cambia.** Una sola versión vigente publicada; el operario la abre desde el QR de la máquina; cuando cambia, los que están certificados en ese proceso reciben el aviso y confirman la lectura.
3. **Cómo se detecta lo que ya está descuadrado.** El mapa de riesgo de conocimiento marca los procesos que dependen de una sola persona, los que llevan tiempo sin revisar y **los que tienen alta variación**. Las estadísticas muestran duración y anomalías por operario y por máquina; las horas avisan de desviaciones superiores al 10 %.
4. **Lo que esto no es.** No es un sistema de control de personal ni sirve para vigilar a nadie: la variación se mira por proceso, para arreglar el proceso. *(Esta sección es obligatoria: sin ella, el eje C se lee como fiscalización y bloquea la venta al jefe de producción.)*
5. **FAQ** — «¿Y si mi mejor operario tiene un método mejor?» (respuesta: se propone como Kaizen y pasa a ser el estándar), «¿Hay que documentarlo todo?» (no: se empieza por los procesos con más variación).
6. **CTA:** «Empieza por el proceso que cada turno hace distinto».

**Ejecutado.** 1.442 palabras, en línea con las páginas comerciales comparables. Las seis secciones salieron como estaban previstas, con estas concreciones:

- **URL de primer nivel**, `/consistencia-entre-turnos/`, aunque vive en el menú de casos de uso. Mismo criterio que `/cobertura-turnos/`, que también es top-level y cuelga de un grupo del menú.
- **Las tres causas de la variación** quedaron como tres escenas con el patrón *sin REELEVO / con REELEVO* que ya usa `/casos-de-uso/cobertura-bajas/`: el atajo del veterano · el plastificado y el PDF que se contradicen en el paso 7 · cada uno aprendió con un maestro distinto.
- **Captura de producto** en la sección de evidencia: el registro detallado de ejecuciones (`detalle-procesos`), que muestra el mismo proceso ejecutado por personas distintas con su duración y sus pasos. Es la prueba visual de que la variación se ve, sin necesidad de afirmar ninguna cifra.
- **Sin cifras inventadas.** La banda de datos no lleva porcentajes: usa tres anclas cualitativas —*Una versión · Tres turnos · Variación visible*— porque no hay dato propio que respalde un número aquí. Es el patrón que ya usa la tercera casilla de `/casos-de-uso/cobertura-bajas/`.
- **La sección de límites se quedó como estaba planificada** y es la que más peso comercial tiene: *«Esto no es un sistema de control de personal»*, con el bloque «Sí es / No es». La regla que la sostiene está escrita como comentario en el propio `.astro` para que no se pierda en futuras ediciones: **la variación se mira por proceso, nunca por persona**.
- **Cinco FAQ**, encabezadas por la objeción real del jefe de producción: *«¿Y si mi mejor operario tiene un método mejor que el que está escrito?»*.

**Enlazada desde:** el menú (escritorio y móvil), las tarjetas 6 y 7 del hub, el sitemap, y tres artículos del blog que ya hablaban de variabilidad sin tener a dónde mandar al lector — [`lean-manufacturing`](src/pages/blog/lean-manufacturing.astro), [`twi-formacion-operarios-en-el-puesto`](src/pages/blog/twi-formacion-operarios-en-el-puesto.astro) y [`medir-tiempos-de-produccion`](src/pages/blog/medir-tiempos-de-produccion.astro).

**Efecto lateral en la maqueta:** esos tres artículos pasaron de 3 a 4 tarjetas de «Sigue explorando», y la rejilla estaba a tres columnas, así que la cuarta quedaba huérfana. Resuelto en [`ArticleLayout.astro`](src/layouts/ArticleLayout.astro) con `:has(> :nth-child(4))`, que reparte 2×2 **solo** cuando hay cuatro. Los bloques de tres no cambian.

#### ☑ M3.b — `/errores-en-planta/` — *publicada 2026-08-20*

Cubre el disparador **1**. Sexta entrada en *Por caso de uso*.

```
H1:   El error que se repite no es de la persona. Es del procedimiento que no estaba.
Sub:  Cuando el mismo fallo aparece cada dos semanas no es despiste: es que el
      criterio correcto no estaba disponible en el puesto en el momento de decidir.
```

1. **Los tres que más se repiten.** Arranque mal parametrizado tras un cambio de turno · paso que se salta en un cambio de referencia · control que se firma sin haberse hecho.
2. **Qué cambia en el puesto.** Checklist con foto obligatoria en los pasos críticos, campos de captura, registro de paradas con motivo y de unidades rechazadas, validación del supervisor y firma digital de la ejecución.
3. **Del error al cambio de proceso.** El operario propone la corrección desde el móvil (Kaizen), el supervisor la revisa y, si vale, pasa a ser el estándar. El error deja de repetirse porque cambia el procedimiento, no porque se le llame la atención a alguien.
4. **Lo que no prometemos.** No elimina el error humano. Reduce la parte del error que viene de no tener el criterio delante y de que nadie se entere hasta que llega la reclamación.
5. **FAQ + CTA:** «Empieza por el error que más se te repite».

**Ejecutado.** 1.465 palabras, misma estructura que `/consistencia-entre-turnos/`, publicada en `/errores-en-planta/`.

- **Los tres errores** quedaron concretos, no genéricos: el arranque con los parámetros del turno anterior · el ajuste de cambio de referencia que nadie escribió porque es obvio para los veteranos · el parte de control rellenado entero al final del turno con la misma letra.
- **El bloque de mecanismos** se apoya en el flujo QR real: paso con foto de evidencia, medición que hay que introducir, espera bloqueada, aprobación del supervisor, paradas con motivo, unidades rechazadas y confirmación de lectura al publicar versión nueva.
- **Captura:** la ejecución paso a paso en el móvil del operario (`sop-operario`), que muestra la confirmación *«¿Has completado este paso correctamente?»* con la alternativa *«Hay un problema»* y el paso siguiente todavía bloqueado. Es la prueba visual de las dos cosas que vende la página.
- **El Pareto de rechazos no se menciona** en ninguna parte: existe como API pero no tiene pantalla (regla 13 del mapa funcional). Verificado en el HTML publicado.
- **La sección de límites dice literalmente que esto no elimina el error humano**, y añade que tampoco lee sensores ni corrige parámetros de máquina — la confusión con IoT/SCADA es habitual en este disparador y contestarla por delante ahorra una objeción en la llamada.
- **Cinco FAQ**, incluidas las dos incómodas: *«¿Y si el operario marca "sí, correcto" sin haber mirado?»* y *«¿Esto no acaba sirviendo para señalar al operario que se equivocó?»*.

**Relación con el blog, resuelta en los dos sentidos:** el artículo [`errores-humanos-produccion`](src/pages/blog/errores-humanos-produccion.astro) —2.816 palabras, el que más trata el tema— enlaza ahora a la página como «la versión operativa de este artículo», y la página enlaza al artículo desde el hero con el botón secundario «Por qué ocurren →». Lo mismo con [`onboarding-digital-errores-manuales`](src/pages/blog/onboarding-digital-errores-manuales.astro) y [`control-de-calidad-en-excel`](src/pages/blog/control-de-calidad-en-excel.astro). El artículo explica el porqué y la página resuelve el qué hacer: no compiten por la misma intención.

> **Relación con el blog:** ya existe [`/blog/errores-humanos-produccion/`](src/pages/blog/errores-humanos-produccion.astro) (2.816 palabras, 65 menciones del tema). No se canibalizan: el artículo explica *por qué ocurren* y la página nueva *cómo dejar de pagarlos*. El artículo debe enlazar a la página desde su cierre, y la página al artículo desde la FAQ. Lo mismo entre `/consistencia-entre-turnos/` y los artículos de Lean, TWI y SOP.

---

### ☑ M4 · Adoptar los tres disparadores huérfanos — *hecho 2026-08-20*

No necesitan página propia. Necesitan que una página existente los reclame con un H2 explícito.

#### ☑ Disparador 5 — reducir el tiempo de aprendizaje → lo adopta `/casos-de-uso/onboarding-operarios/`

Hoy la web dice que un operario nuevo tarda 3-5 días y que REELEVO reduce el tiempo «un 40 %», pero **no dice cómo se sabe**. Se añade una sección:

```
H2:   ¿Cuánto tarda hoy en ir solo? ¿Y cómo lo sabes?
Copy: Hoy es una impresión del encargado. Con las rutas de aprendizaje ves en qué
      paso va cada persona, cuánto tarda en ejecutar el proceso y cómo se compara
      con el tiempo del titular. Ese número deja de ser una estimación y pasa a
      ser un dato que puedes mirar el martes siguiente.
```

Refuerzo del mismo ángulo en `/gestion-competencias/`, que ya tiene el producto detrás (skill matrix, rutas con seguimiento, certificaciones).

**Ejecutado.** La sección quedó en `#cuanto-tarda` con tres cosas concretas que se pueden mirar: en qué paso se atasca —no «va lento», sino que el paso 4 le lleva el triple—, cuánto lleva recorrido en la ruta, y cómo va frente al titular ejecutando el mismo proceso en la misma máquina. Cierra con la frase que evita vender humo: *«el número no baja por mirarlo; baja cuando ves que hay un paso donde se atasca todo el mundo y arreglas ese paso»*, que además enlaza el disparador 5 con el eje de consistencia. En `/gestion-competencias/` va un bloque corto —la matriz dice quién sabe, faltaba cuánto le queda al que aprende— que enlaza al ancla anterior.

#### ☑ Disparador 9 — resolver sin llamar al encargado → lo adopta `/portal-operario/`

La página ya tiene el H2 exacto: *«Un operario sin contexto depende siempre del encargado»*. El problema es de **colocación**: cuelga de *Plataforma › Herramientas avanzadas* con la etiqueta «Agenda, progreso y reconocimiento», que es descripción de funcionalidad. Nadie con ese dolor la va a encontrar.

- Añadirla también a *Soluciones › Por caso de uso* con la etiqueta **«Menos interrupciones al encargado»**.
- Añadir una función que hoy no se cuenta en ninguna página comercial: **solicitudes de contenido** — el operario pide desde su portal el procedimiento que falta, en lugar de llamar. Es literalmente el disparador 9 y está sin vender.
- Recuperar en la página el dato que ya está en la home (40 % de jefes de planta llaman al experto aunque esté de baja) y cerrarlo con una promesa, que hoy se queda en el aire.

**Ejecutado.** Entra en *Por caso de uso* como **«Menos interrupciones al encargado»** —etiqueta de dolor, no de funcionalidad— y sigue también en *Plataforma*, donde ya estaba. Se le activó el `activeNav`, que estaba vacío. Las **solicitudes de contenido** entran como sexta tarjeta del portal, destacada: *«Pedir el procedimiento que falta»*, con el argumento que cierra el disparador — la lista de lo que hay que documentar deja de salir de una reunión y pasa a escribirla quien lo echa en falta. El bloque de riesgo, que terminaba en el aire, ahora cierra explicando que las interrupciones no bajan porque nadie pregunte, sino porque la respuesta ya está en el puesto.

**Cambio de CTA no previsto en el plan:** el hero lideraba con «Solicitar demo» en botón primario y dejaba el registro en el secundario. Es al revés que en el resto del sitio y contradice el *«sin llamada comercial»* de la home. Invertido: registro primario, demo como enlace secundario. Lo mismo en `/gestion-competencias/`, que tenía el mismo patrón.

#### ☑ Disparador 8 — recuperar conocimiento perdido → sección nueva en `/casos-de-uso/transferencia-conocimiento/`

Todo el sitio trata este disparador en clave **preventiva** («captura antes de que se vayan»). Pero el que compra suele llegar tarde: ya perdió al que sabía. Ese visitante hoy no encuentra respuesta.

```
H2:   Ya se ha ido. ¿Se puede recuperar lo que sabía?
Copy: En parte, sí, y antes de lo que parece. Grabas en vídeo al que se quedó
      haciendo el proceso, o subes los Word, PDF e instrucciones que ya tienes
      sueltos, y la importación asistida propone un proceso paso a paso que tú
      revisas y apruebas. No recuperas su cabeza: recuperas el procedimiento,
      que es lo que necesitas para que el puesto vuelva a arrancar.
```

**Esta es la respuesta comercial más fuerte que tenéis y no está contada como recuperación en ninguna parte.** La importación asistida por IA desde vídeo aparece hoy solo como respuesta a la objeción «pasar mis procedimientos me costará meses» en `/documentacion-procesos/`, que es un uso mucho más pequeño del que permite.

**Ejecutado.** La sección `#ya-se-fue` va **justo después de la línea de tiempo**, que es donde el visitante que llega tarde se siente peor: esa línea le acaba de decir que debería haber empezado hace seis meses, y hasta ahora la página no le ofrecía nada. Tres vías de rescate: lo que sí dejó escrito (Word y PDF sueltos → importación asistida) · lo que sabe el que se quedó (se le graba en vídeo aunque lo haga peor: corregir un borrador es más rápido que partir de una hoja en blanco) · lo que va apareciendo al trabajar (solicitudes de contenido). Cierra sin inflar: *«no vas a recuperarlo todo, y quien te diga lo contrario no ha estado en una planta»*.

También se amplió la `meta description`, que solo tenía el ángulo preventivo: quien busca porque ya ha perdido a la persona no se reconocía en el snippet. Y los CTA de la página quedaron etiquetados por disparador —`04` en hero y cierre, `08` en la sección nueva— para poder comparar cuál de los dos ángulos convierte.

---

### ☑ M5 · Vocabulario: la palabra técnica en el `<title>`, la del comprador en el H1 — *hecho 2026-08-20*

> Aplicado en las tres páginas que lo necesitaban. El detalle de qué H1 cambió y cuál se dejó intacto está en el **Anexo III**.

La web habla en lenguaje de producto donde el comprador habla en lenguaje de dolor. Regla a aplicar en las páginas tocadas por este plan:

| Se dice hoy | Lo dice el comprador así |
|---|---|
| onboarding de operarios | el primer día · que vaya solo · enseñarle |
| continuidad operativa | que el turno arranque sin él |
| variabilidad entre operarios | cada uno lo hace a su manera |
| trazabilidad de ejecución | saber quién hizo qué |
| transferencia de conocimiento | que no se lo lleve cuando se vaya |
| gestión de competencias | quién sabe hacer qué |
| documentación operativa accesible | el procedimiento, delante, en la máquina |

**La regla no es eliminar el vocabulario técnico** —hace falta para SEO y para la búsqueda por IA—, sino colocarlo: `<title>` y `<meta description>` mantienen la keyword; el **H1 y la primera frase** van en las palabras del que tiene el problema. Es exactamente lo que ya pide la sección 4 de la guía maestra («la primera frase siempre debe responder qué mejora compra la empresa») y lo que las páginas de casos de uso ya hacen bien —«Cuando Martínez está de baja, la línea no puede esperar»— mientras las páginas de producto no.

---

### ☑ M6 · Que esto se traduzca en registros — *cerrada 2026-08-20*

**a) CTA con el verbo del disparador.** La oferta no cambia (60 días del plan Pro, sin tarjeta), pero el botón deja de decir lo mismo en todas partes:

| Página | CTA de cierre |
|---|---|
| `/errores-en-planta/` | Empieza por el error que más se te repite |
| `/consistencia-entre-turnos/` | Empieza por el proceso que cada turno hace distinto |
| `/casos-de-uso/cobertura-bajas/` | Empieza por el puesto que hoy depende de una sola persona |
| `/portal-operario/` | Empieza por el proceso que más llamadas genera |

**b) ☑ Subir a 3 CTAs las páginas que hoy tienen 1** — *hecho 2026-08-20*.

**Corrección al diagnóstico original.** El inventario decía que esas siete páginas tenían «un solo CTA». Al abrirlas resultó que **tienen dos** —hero y cierre— y que **ninguno emitía evento**: lo que el inventario contaba era el botón del menú móvil, el único con `data-cta` de toda la página. El problema no era falta de CTAs, era que sus registros eran invisibles en GA4. Es el mismo fallo que tenía `/por-que-usar-reelevo/`, así que no era un caso aislado sino un patrón.

Hecho en `/kaizen/`, `/modo-offline/`, `/obras-trazabilidad/`, `/firma-digital/`, `/api-integraciones/` e `/integracion-m365/`: los dos CTAs existentes quedan instrumentados y se añade uno intermedio, con texto propio de cada página en vez de un «Registrarse gratis» genérico —«Probarlo en tu nave» en offline, «Crear la primera obra» en obras, «Activarlo en un proceso» en firma—. Se coloca justo después de la sección donde la página ya ha explicado el mecanismo, que es donde el lector decide si le interesa.

Además se instrumentaron cuatro páginas que estaban **a cero**: `/faqs/`, `/onboarding-software-pymes/`, `/sobre-nosotros/` y `/video-demo/`. Y `/recursos/`, que no tenía ningún botón en el hero, ya lo tiene.

**Resultado:** 93 CTAs de registro medidos en las 49 páginas comerciales. Antes de la Fase 1 la cifra real era mucho menor y ni siquiera se sabía, porque el propio inventario estaba midiendo el menú.

**c) ☑ M6d — Lo que este trabajo destapó** — *hecho 2026-08-20, ver sección propia más abajo*. Quedaban **12 páginas con un solo CTA de registro**: `/cobertura-turnos/`, `/control-produccion/`, `/faqs/`, `/gestion-competencias/`, `/mantenimiento/`, `/portal-operario/`, `/seguridad/`, `/sobre-nosotros/`, `/software-gestion-pyme-industrial/`, `/video-demo/`, `/vs-mes-tradicional/` y `/workflows/`. Varias de ellas reparten el espacio con CTAs de *demo*, así que no es solo añadir botones: hay que decidir por página si el objetivo es la cuenta o la llamada. Con el objetivo fijado —más registros— la respuesta por defecto debería ser la cuenta, pero conviene revisarlo página a página antes de tocarlas.

Fuera de alcance por motivo propio: `/kit-digital-pyme-industrial/` (hoy `noindex`, pendiente de verificación legal, y sus CTAs son de contacto a propósito) y las tres de `/recursos/*` que canonicalizan a su equivalente en `/blog/`.

**c) Medir qué dolor convierte.** ☑ *Fontanería hecha 2026-08-19.* Ya existía la instrumentación `data-cta-intent` / `data-cta-location` / `data-cta-label`; se ha añadido un campo más al `payload` del listener de [`BaseLayout.astro`](src/layouts/BaseLayout.astro):

```html
data-cta-trigger="07"   <!-- 01..09, el disparador de la pagina o de la tarjeta -->
```

Las nueve tarjetas del hub ya lo llevan. Falta ponérselo a los CTAs de las páginas de las Fases 2 y 3.

Con eso, en GA4 se puede responder en un mes a la pregunta que hoy no se puede responder: **de los nueve motivos de compra, ¿cuáles traen registros y cuáles solo traen visitas?** Esa respuesta es la que debe decidir dónde se invierte el contenido del trimestre siguiente, en lugar de decidirlo por volumen de búsqueda.

> **Aviso de medición:** el listener dispara `cta_click` con el **clic**, no con el alta completada — está comentado así en el propio `BaseLayout`. `cta_trigger` sirve para comparar interés relativo entre dolores, no para contar cuentas creadas. Para eso hace falta cruzarlo con el alta real en la app.

---

## 5. Deuda que este plan tiene que limpiar

Varias afirmaciones incumplen la regla B4 del `PLAN_CORRECCIONES_WEB_VS_APP_2026-08.md` («retirar las cifras de resultado sin respaldo») y sobrevivieron a aquella pasada. Están precisamente en el disparador 5, que es el que este plan quiere reforzar — si se refuerza sobre ellas, se amplifica el problema.

### ☑ L1 · Claims de resultado retirados de las páginas comerciales — *hecho 2026-08-19*

Al buscarlos aparecieron cinco, no tres. Todos afirmaban un **resultado de REELEVO** sin dato detrás:

| Fichero | Qué decía | Cómo quedó |
|---|---|---|
| [`onboarding-software-pymes.astro:55`](src/pages/onboarding-software-pymes.astro#L55) | «Reduce el tiempo de aprendizaje de operarios nuevos en un 40 %» | «Deja de estimar cuánto tarda un operario nuevo en ir solo: lo ves paso a paso» |
| [`onboarding-software-pymes.astro:87`](src/pages/onboarding-software-pymes.astro#L87) | «los nuevos cometen errores 40 % más frecuentes que los titulares» | Reescrito sin cifra, describiendo el mecanismo (decide por criterio propio sin instrucción en el puesto) |
| [`vs-knowby.astro:232`](src/pages/vs-knowby.astro#L232) | «Reducen tiempo de aprendizaje 40 %» | «Ven en qué paso se atasca cada incorporación» |
| [`vs-knowby.astro:234`](src/pages/vs-knowby.astro#L234) | «Se pagan los 49 €/mes en la primera semana» | «Precio por empresa, sin licencia por operario» |
| [`video-demo.astro:256`](src/pages/video-demo.astro#L256) | «reduce costos de incorporación en un 40 %» | Reescrito sin cifra |

### ☑ L2 · Cifras de sector sin fuente — *resuelta 2026-08-20*

> Diagnóstico de partida. La decisión y lo que se hizo con cada cifra están en **«L2 y L4 · Cifras atribuidas»**, más abajo.

Categoría distinta y decisión vuestra: no son claims de producto, son datos del **problema**, y ahí una cifra sí ayuda a vender. El asunto es que unas están atribuidas y otras no, dentro de la misma web:

- [`casos-de-uso/cobertura-bajas.astro:44`](src/pages/casos-de-uso/cobertura-bajas.astro#L44) — «40 % de los responsables llaman directamente al experto» → **bien: cita "Encuesta REELEVO, 2025"**. Es el patrón a seguir.
- [`casos-de-uso/onboarding-operarios.astro:49`](src/pages/casos-de-uso/onboarding-operarios.astro#L49) — «+40 % más errores operativos durante los primeros días» → sin fuente.
- «3-5 días hasta que una incorporación rinde como el titular» (home, `/casos-de-uso/onboarding-operarios/`, `/blog/que-es-un-sop-industrial/`) → sin fuente, aunque la home dice genéricamente «son datos del sector industrial español».
- **Aparecido el 2026-08-20 al instrumentar los CTAs:** [`onboarding-software-pymes.astro`](src/pages/onboarding-software-pymes.astro#L98) tiene un bloque entero de cálculo de coste sin ninguna fuente — «3,2 horas de producción perdida por baja», «150-300 €/hora de línea parada», «79 bajas/año», «38.000-76.000 €/año en paradas» y «produce al 60 % de capacidad». Es la concentración más alta de cifras sin respaldo que queda en el sitio comercial. No lo he tocado porque un cálculo de coste puede defenderse si se presenta como *estimación con supuestos explícitos* —«para una planta de 40 personas, asumiendo X»— en vez de como dato. Esa decisión es vuestra: o se etiqueta como estimación con sus supuestos, o se retira.

**Qué hacer:** o se les pone la misma atribución que al 40 % de la encuesta, o se retiran. No las he tocado porque no puedo inventar la fuente.

### ☑ L3 · `/recursos/*` y su canónica — *hecho 2026-08-20*

[`recursos/onboarding-software-pymes.astro`](src/pages/recursos/onboarding-software-pymes.astro) acumulaba cuatro cifras del mismo tipo, más **una tabla de ROI entera inventada** (tiempo de onboarding, coste de tutoría, errores iniciales, retención a 6 meses, con su columna de «ahorro») y un ejemplo cerrado en «16.800 €/año frente a 49 €/mes».

**Hallazgo al abrirlo:** esa página es `noindex` y canonicaliza a [`/blog/onboarding-software-pymes/`](src/pages/blog/onboarding-software-pymes.astro), **que tiene exactamente las mismas cifras** y sí se indexa. Arreglar solo el duplicado invisible no habría servido de nada, así que se corrigieron las dos. Es la única vez en todo este trabajo que se ha entrado en el blog, y por ese motivo.

**Cómo quedó.** En vez de borrar la tabla de ROI se le dio la vuelta, que además vende mejor: deja de comparar «sin / con / ahorro» con números inventados y pasa a listar **los cuatro datos que el lector necesita para calcularlo con su propia planta** — días hasta que va solo · horas de tutoría · errores de las primeras semanas · incorporaciones al año —, con una columna de dónde saca hoy cada dato y otra de dónde lo verá después. Encabezado por la frase que sostiene el cambio:

> *No vamos a decirte cuánto vas a ahorrar: no tenemos tus números y cualquier cifra que pusiéramos aquí sería inventada.*

Y cerrado con la vuelta honesta: *«si sale pequeño, no compres nada: tu problema está en otro sitio»*. Una tabla que el prospecto rellena con sus datos convence a su director financiero; una tabla con nuestros números inventados, no.

### ☑ L2 y L4 · Cifras atribuidas — *hecho 2026-08-20*

**Decisión del cliente (2026-08-20): las cifras salen de la Encuesta REELEVO.** Existe y está documentada en [`coste-absentismo-pymes-industriales`](src/pages/blog/coste-absentismo-pymes-industriales.astro): *Encuesta REELEVO 2025 sobre dependencia operativa en pymes industriales españolas, n=347, empresas de 10-200 empleados del sector manufacturero*. Ese es el formato de atribución que ya usaba `/casos-de-uso/cobertura-bajas/` y el que se ha extendido al resto.

| Dónde | Qué se hizo |
|---|---|
| **Home**, bloque «El coste que nadie mide» | El sub decía «son datos del sector industrial español», genérico. Ahora nombra la encuesta y las tres cifras llevan la fuente completa al pie |
| `/casos-de-uso/onboarding-operarios/` | Las dos cifras de la banda (3-5 días · +40 % de errores) llevan «Encuesta REELEVO, 2025» |
| `/documentacion-procesos/` | El bloque «Dato: 77 % / 23 % / 10 %» lleva la fuente completa |
| `/blog/onboarding-vs-tradicional/` | La tabla comparativa lleva la fuente, con una precisión que faltaba: **compara plantas con y sin software de onboarding, no proveedores concretos** |

**Una distinción que se mantiene deliberadamente:** una encuesta de mercado respalda datos del **problema**, no resultados de producto. Donde había aritmética derivada se ha etiquetado como tal en vez de venderla como dato observado:

- En `/onboarding-software-pymes/`, el bloque de coste separa ahora lo medido de lo calculado: las 3,2 h por baja y los 150-300 €/hora se citan a la encuesta; los 480-960 € y los 38.000-76.000 €/año quedan marcados como **cálculo derivado**, con sus supuestos visibles y una invitación a cambiarlos por los propios.
- En `/blog/onboarding-vs-tradicional/`, el cálculo ya decía «Supongamos»; ahora aclara que los tiempos de partida son de la encuesta y los totales son un cálculo, no un dato observado.

Es la diferencia entre una cifra que un director financiero acepta y una que le hace cerrar la pestaña.

### ☑ M6d · Todos los CTAs a creación de cuenta — *hecho 2026-08-20*

**Decisión del cliente (2026-08-20): todos los CTAs para creación de cuenta.** Once páginas lideraban su hero y su cierre con «Solicitar demo» en botón primario y dejaban el registro en el secundario:

`/cobertura-turnos/` · `/control-produccion/` · `/gestion-competencias/` · `/mantenimiento/` · `/software-gestion-pyme-industrial/` · `/workflows/` · `/portal-operario/` · `/calidad-y-conformidad/` · `/documentacion-procesos/` · `/como-funciona/` · `/video-demo/`

En todas, el registro pasa a primario y el demo se queda como enlace secundario con intención `navegacion`: sigue estando y sigue midiéndose, pero deja de competir como objetivo de conversión. Y se añadió el CTA intermedio que faltaba en `/faqs/`, `/seguridad/`, `/sobre-nosotros/`, `/video-demo/` y `/vs-mes-tradicional/`.

**Resultado: 106 CTAs de registro medidos, ninguna página comercial con menos de dos, y ninguna con un CTA de demo compitiendo.** Se conserva a propósito el único `demo` que queda: el enlace de respaldo *«¿No ves el demo? Ábrelo en una pestaña nueva»* dentro de [`StorylaneDemo.astro`](src/components/StorylaneDemo.astro), que no es una llamada a la acción sino el plan B por si el iframe no carga.

Quedan cuatro páginas sin CTA de registro, y es correcto: `/kit-digital-pyme-industrial/` (hoy `noindex`, con CTAs de contacto a propósito) y las tres de `/recursos/*` que canonicalizan a `/blog/`.

### ☑ M5 · Lo que quedaba — *cerrado 2026-08-20*

Un barrido de claims de resultado sobre las 74 páginas publicadas dejó tres focos más. **Los tres se resolvieron después, al cerrar L2 y L4**, con la decisión de atribuir a la Encuesta REELEVO en lugar de retirar. Se deja la tabla original para que se vea de dónde venía cada uno:

| Dónde | Qué había | Por qué no se tocó entonces |
|---|---|---|
| [`/blog/onboarding-vs-tradicional/`](src/pages/blog/onboarding-vs-tradicional.astro) | Una tabla comparativa completa con retención inventada (60-65 % vs 75-85 %), tasas de error (45 % vs 12 %), costes por incorporación y un cálculo de ROI con cifras cerradas (7.200 €, 2.400 €, 375 €, −1.500 €) | Es **blog**, que queda fuera del alcance que fijaste. Y es una reescritura de la pieza entera, no un retoque: el artículo está construido sobre esa tabla |
| [`/onboarding-software-pymes.astro:98`](src/pages/onboarding-software-pymes.astro#L98) | El bloque «¿Cuánto cuesta un mal onboarding?»: 3,2 h por baja, 150-300 €/hora, 79 bajas/año, 38.000-76.000 €/año | Ver **L2**: puede defenderse como estimación con supuestos explícitos, y esa es una decisión vuestra, no mía |
| [`/documentacion-procesos/`](src/pages/documentacion-procesos.astro) | «Del 23 % que sí, menos del 10 % de sus procedimientos se consultan habitualmente» | Dato de sector sin fuente. Mismo caso que **L2**: o se atribuye o se retira |

No son claims de producto como los de **L1** —que eran indefendibles y por eso se retiraron sin preguntar—, sino cifras del problema. Ahí una cifra ayuda a vender, y la diferencia entre defendible e indefendible es tener una fuente.

**Cómo se cerró.** La decisión llegó el 2026-08-20: las cifras salen de la Encuesta REELEVO 2025 y se atribuyen. Los tres focos quedaron así —la tabla comparativa de `/blog/onboarding-vs-tradicional/` con su fuente y la precisión de que compara plantas con y sin software, no proveedores; el bloque de coste de `/onboarding-software-pymes/` separando lo medido de lo calculado; y el «77 % / 23 % / 10 %» de `/documentacion-procesos/` con la fuente completa al pie—. El detalle está en **«L2 y L4 · Cifras atribuidas»**.

---

## 6. Respaldo de producto por disparador

Comprobado contra `MAPA_FUNCIONAL_PRODUCTO.md`. Ningún mensaje de esta propuesta necesita funcionalidad que no exista hoy.

| # | Disparador | Función real que lo respalda |
|---|---|---|
| 1 | Reducir errores | Checklist con foto y campos de captura · paradas con motivo · unidades rechazadas · validación del supervisor · firma digital · Kaizen con motor de reglas |
| 2 | Formar empleados nuevos | Rutas de aprendizaje con seguimiento · flujo QR sin cuenta ni contraseña · proceso con texto, imagen y vídeo · quiz de validación |
| 3 | No depender de un trabajador concreto | `knowledge-risk`: procesos que dependen de una sola persona · mapa de cobertura de turnos · skill matrix |
| 4 | Mantener procedimientos cuando alguien se marcha | Procesos versionados y publicados · certificaciones con caducidad · skill decay · alertas automáticas |
| 5 | Reducir tiempo de aprendizaje | Duración por sesión y por operario · rutas con progreso · comparación con el titular · estadísticas de rendimiento |
| 6 | Estandarizar operaciones | Versionado con confirmación de lectura · aviso automático a los certificados al publicar versión nueva · traducciones por proceso |
| 7 | Que no cada uno lo haga a su manera | `knowledge-risk` detecta **alta variación** entre ejecuciones · anomalías en estadísticas · desviación de horas > 10 % |
| 8 | Recuperar conocimiento perdido | **Importación asistida por IA desde Word, PDF y vídeo** · base de conocimiento · solicitudes de contenido |
| 9 | Resolver sin llamar al encargado | Flujo QR en la máquina sin login · troubleshooting dentro del proceso · portal del operario con su agenda · solicitudes de contenido |

**Cuidado con estos tres al escribir** (regla 13 del mapa funcional):
- El **Pareto de rechazos** solo existe como API, sin pantalla. No mencionarlo en `/errores-en-planta/`.
- El **quiz** es validación de conocimiento, no un sistema de evaluación y recertificación.
- El **offline** funciona en el flujo de ejecución, no es «offline total».

---

## 7. Secuencia

### ☑ Fase 1 — Que los 9 estén nombrados — *cerrada 2026-08-19*

1. ☑ M2 — hub de autodiagnóstico en `/por-que-usar-reelevo/`
2. ☑ M2b — el hub entra en el menú como «Qué resuelve», en primer nivel
3. ☑ M1 — cuarta escena en la home
4. ☑ L1 — limpieza de los cinco claims de resultado sin respaldo
5. ☑ M6c₁ — campo `cta_trigger` en el tracker de [`BaseLayout.astro`](src/layouts/BaseLayout.astro), para que el atributo `data-cta-trigger` llegue a GA4 desde el primer día. Sin esto el hub estaría publicado pero no se sabría qué dolor convierte

**Los nueve disparadores ya están nombrados en la web con las palabras del comprador**, sin haber creado ninguna página. Las tarjetas 1, 6 y 7 del hub apuntan a destinos interinos hasta la Fase 2.

Verificado con `npm run build`: compila; la home renderiza cuatro escenas; el hub sirve las nueve tarjetas con sus nueve `data-cta-trigger` y cuatro CTAs de registro instrumentados; la barra de navegación abre con «Qué resuelve» y marca el estado activo al entrar en el hub.

### ☑ Fase 2 — Abrir el eje que falta — *cerrada 2026-08-20*

6. ☑ M3.a — `/consistencia-entre-turnos/`, publicada y enlazada
7. ☑ M3.b — `/errores-en-planta/`, publicada y enlazada
8. ☑ Menú: *Por caso de uso* pasa de 4 a 6 entradas · seis artículos del blog enlazan a las páginas nuevas · las nueve tarjetas del hub apuntan ya a su destino definitivo

Verificado con `npm run build`: ambas páginas compilan con su `FAQPage`, sus CTAs llevan `data-cta-trigger` (`07` y `01`), están en el sitemap con su `lastmod` real y suman nueve enlaces contextuales entrantes además del menú.

### ☑ Fase 3 — Adopciones y conversión — *cerrada 2026-08-20*

9.  ☑ M4 — las tres secciones nuevas (disparadores 5, 8 y 9) y la recolocación de `/portal-operario/` en el menú
10. ☑ M5 — vocabulario en los H1 de las tres páginas que lo necesitaban (Anexo III)
11. ☑ M6 — CTA etiquetado por disparador, las siete páginas instrumentadas y las 12 de M6d con segundo CTA de registro

Verificado con `npm run build`: las cuatro páginas tocadas compilan y sirven sus CTA con el disparador correcto (`04`+`08`, `09`, `02`+`05`, `05`), y los dos heros que lideraban en demo lideran ahora en registro.

---

## 8. Cómo se sabrá si ha funcionado

No prometemos porcentajes. Se miden cuatro cosas a 30 y 60 días desde la publicación de cada fase:

1. **Registros por disparador** (`data-cta-trigger`) — la pregunta de fondo: ¿el eje C convierte, o la gente solo compra continuidad?
2. **Uso del hub** — clics desde `/por-que-usar-reelevo/` hacia las páginas de destino. Si nadie hace clic, el problema es que los dolores no están escritos en las palabras del cliente y hay que reescribir las tarjetas, no la estructura.
3. **Entradas orgánicas a las dos páginas nuevas** frente a los artículos de blog equivalentes, para confirmar que no se canibalizan.
4. **Registros totales** — el número que importa, contra la línea base de los 60 días previos.

---

## Anexo · Datos del análisis de partida

Recuento sobre las 74 páginas publicadas, separando cuerpo de texto y titulares (`title`, H1, H2), y excluyendo cabecera, pie y navegación.

| # | Disparador | Menciones | Páginas | En titulares | % en blog |
|---|---|---|---|---|---|
| 2 | Formar empleados nuevos | 817 | 74 | 159 | 53 % |
| 4 | Mantener procedimientos cuando alguien se marcha | 419 | 74 | 46 | 49 % |
| 6 | Estandarizar operaciones | 401 | 59 | 94 | 66 % |
| 1 | Reducir errores | 270 | 50 | 31 | **83 %** |
| 3 | No depender de un trabajador concreto | 207 | 58 | 27 | 45 % |
| 8 | Recuperar conocimiento perdido | 160 | 74 | 26 | 58 % |
| 9 | Resolver sin llamar al encargado | 93 | 41 | 10 | 48 % |
| 5 | Reducir tiempo de aprendizaje | **38** | 21 | 6 | 32 % |
| 7 | Que no cada uno lo haga a su manera | **31** | 16 | **3** | 71 % |

Reparto de palabras: home 1.631 · páginas comerciales 45.372 · blog y recursos 47.274.

---

## Anexo · Lo que dice Search Console (2026-08-20)

Datos aportados por el cliente: exportación de GSC, **últimos 3 meses, búsqueda web**.

### El titular

**5 clics. Los cinco en la home. Cero clics en las otras 73 páginas.** Con ~258 impresiones y un CTR del 1,3 %.

### Reparto de las impresiones

| Grupo | URLs | Clics | % de impresiones |
|---|---|---|---|
| Home (apex + www) | 2 | 5 | 48 % |
| Resto del sitio en español | 33 | 0 | 22 % |
| **URLs `/en/` que no existen en el código** | 18 | 0 | 21 % |
| Páginas legales | 4 | 0 | 8 % |
| `/pt/` inexistentes y otros subdominios | 4 | 0 | 2 % |

### Cinco hallazgos, por orden de gravedad

**1. El 63 % de las impresiones son de otra empresa.** De las consultas listadas, 163 de 204 impresiones son `gmv`, `gmv smart mobility suite`, `life gmv`, `moviloc gmv`, `gmv telefono`, `gmv boecillo`. Son búsquedas de **GMV Innovating Solutions**, la tecnológica aeroespacial de Boecillo. Gente que busca a otra empresa, ve este dominio y no hace clic. Eso hunde el CTR del dominio entero y le dice a Google que el sitio no responde a lo que la gente busca.

**2. No se rankea ni por la propia marca.** La consulta `reelevo` sale en **posición 13,33** con 3 impresiones. Buscar tu propio producto y no salir el primero es el síntoma más claro de que Google todavía no reconoce la marca como una entidad.

**3. Hay 20 URLs indexadas que no existen en este repositorio.** Dieciocho `/en/` y dos `/pt/`. No hay carpetas `en` ni `pt` en `src/pages`, `astro.config.mjs` no tiene configuración de i18n y el propio `BaseLayout` dice *«hreflang: arquitectura lista (hoy solo ES)»*. Son restos de una versión anterior del sitio. Lo llamativo: **son las que mejor posicionan** — `/en/gestion-competencias/` en posición 4,43 y `/en/casos-de-uso/onboarding-operarios/` en 7,86, mejor que cualquier página en español. Y la única consulta comercial con volumen real, `manufacturing competency management` (18 impresiones), aterriza en una de ellas.

**4. Apex y `www` están ambos indexados, sin redirección.** `vercel.json` no tiene ni una regla de `redirects`. Siete rutas aparecen indexadas en las dos versiones —incluida la home—, partiendo la poca señal que hay. El `canonical` apunta a `www`, que ayuda, pero no sustituye a un 301.

**5. Ninguna página comercial recibe tráfico.** De las que este plan quería reescribir: `/documentacion-procesos/` 2 impresiones · `/control-produccion/` 3 · `/gestion-competencias/` 1 · `/oee/`, `/software-gestion-pyme-industrial/`, `/kaizen/`, `/workflows/`, `/obras-trazabilidad/` y `/api-integraciones/` ni aparecen.

### Consecuencia para M5

**M5 queda desbloqueado y sin riesgo.** No hay ningún H1 que esté protegiendo tráfico, porque no hay tráfico. La duda que bloqueaba la tarea —«¿perderemos posiciones si cambiamos el H1?»— tiene respuesta: no hay posiciones que perder. Se pueden reescribir todos.

### Consecuencia para `REELEVO_MIGRACION_SUBDOMINIO.md`

Ese documento dice, textualmente:

> *El mayor riesgo es **SEO**: todo el ranking actual vive en `gmvsolutions.es`. Si GMV ocupa el apex de golpe sin redirecciones, se pierde esa autoridad.*

**Los datos desmienten esa premisa.** No hay ranking que perder: cinco clics en tres meses, ninguno en página interior. Eso invierte la decisión — la migración a `reelevo.gmvsolutions.es` es mucho más barata de lo que ese plan asume, y el conflicto de marca con GMV es un coste que se paga todos los días. Además `reelevo.gmvsolutions.es` **ya aparece en los datos**, así que el subdominio existe.

### Lo que esto significa para esta propuesta

El trabajo de los nueve disparadores sigue siendo correcto y hay que mantenerlo: sin él, cuando llegue tráfico no habría dónde aterrizarlo. Pero **su retorno está bloqueado detrás de un problema de indexación y de marca**, no de contenido. Escribir más páginas antes de resolver eso es llenar un almacén con la puerta cerrada.

Orden sugerido antes de seguir con contenido:

1. **301 de apex a `www`** (o directamente al subdominio, si se decide migrar). Son diez líneas en `vercel.json`.
2. **Decidir la migración de subdominio.** Nunca va a ser más barata que ahora.
3. **Cerrar las 20 URLs zombis** `/en/` y `/pt/`: 301 a su equivalente en español, o 410 si no lo tienen.
4. **Mirar el informe de indexación de GSC**: de las 62 URLs del sitemap, cuántas están realmente indexadas. Con 33 páginas españolas apareciendo en el informe de rendimiento, la sospecha es que hay bastantes sin indexar.
5. Solo después, M5 y el resto del contenido.


---

## Anexo II · S1 — Redirecciones (2026-08-20)

Salido del anexo de Search Console. Es infraestructura, no contenido, pero condiciona todo lo demás: sin esto, la señal del sitio sigue partida en dos dominios y hay veinte URLs muertas ocupando sitio.

Tres reglas nuevas en [`vercel.json`](vercel.json), que **no tenía ninguna**:

| Regla | Qué hace |
|---|---|
| `/en/:path*` → `https://www.gmvsolutions.es/:path*` | Las 18 URLs inglesas indexadas van a su equivalente español |
| `/pt/:path*` → `https://www.gmvsolutions.es/:path*` | Las 2 portuguesas, igual |
| `/:path*` con `host = gmvsolutions.es` → `www` | El apex deja de servir contenido y pasa la señal a `www`, que es lo que dice el `canonical` |

Verificado antes de darlo por bueno:

- **Ningún salto encadenado.** Las reglas de `/en/` y `/pt/` apuntan al destino absoluto en `www`, así que `gmvsolutions.es/en/x` llega a `www.gmvsolutions.es/x` en **un solo 301**, no en dos.
- **Ningún bucle.** El `has: host` hace coincidencia exacta con el apex, así que `www` no se redirige a sí mismo.
- **Ningún 301 que acabe en 404.** Se comprobaron las 18 URLs zombis una por una contra el `dist`: las 18 tienen destino real.

### ⚠️ Lo que hay que comprobar en Vercel

Estas reglas **solo se aplican si el dominio apex está conectado a este proyecto**. Si `gmvsolutions.es` (sin `www`) apunta a otro sitio o no está en *Settings → Domains* de este proyecto, la tercera regla nunca llega a ejecutarse y el apex seguirá indexándose. Merece un minuto de comprobación después del despliegue:

```
curl -I https://gmvsolutions.es/precios/
```

Debe responder `301` con `location: https://www.gmvsolutions.es/precios/`.

---

## Anexo III · M5 — Vocabulario (2026-08-20)

Desbloqueado por los datos de Search Console: ninguna de las páginas candidatas recibe clics, así que no había posiciones que proteger. De las diez páginas de producto, solo tres tenían el H1 escrito en lenguaje de proveedor; el resto ya hablaba de dolores. La regla aplicada: **el `<title>` conserva la keyword intacta, el H1 y la primera frase pasan a las palabras del comprador.**

| Página | Antes | Ahora |
|---|---|---|
| `/documentacion-procesos/` | «Documentación de procesos industriales accesible» | **«El procedimiento no sirve si está en una carpeta del servidor»** |
| `/gestion-competencias/` | «Gestión de competencias para pymes industriales» | **«¿Quién puede cubrir ese puesto el lunes?»** |
| `/calidad-y-conformidad/` | «Más claridad para revisar lo que pasa en planta» | **«¿Qué pasó con este lote?» y la respuesta tarda tres días** |

Los tres `<title>` siguen siendo los mismos: *«Documentación y gestión de procesos industriales para pymes»*, *«Gestion de competencias industriales para pymes»* y *«Trazabilidad operativa de calidad industrial»*. La keyword sigue donde la busca el motor; el dolor, donde lo lee la persona.
