# Contenidos por citas en IA — plan de las cinco acciones

> **Diagnóstico:** 2026-09-20 · **Ejecutado:** 2026-09-20 · **Estado:** cerrado · **5/5 tareas**

Origen: un panel de *grounding queries* (herramienta de visibilidad en IA, no
identificada por nombre) que mide qué preguntas citan contenido de REELEVO en
respuestas generadas por IA, y con qué **cuota de citas** frente al resto de
fuentes citadas para esa misma pregunta. No es tráfico de Search Console: es
qué tan a menudo la IA elige una página de REELEVO como fuente cuando alguien
pregunta por ese tema.

## 1. Los datos de partida

| Query | Intención | Tema | Citas | Cuota |
|---|---|---|---:|---:|
| programa de mantenimiento preventivo | — | — | 65 | 12,38% |
| soluciones onboarding pymes | Informational | Onboarding & Training | 51 | 14,29% |
| onboarding digital pymes adquisición acti… *(truncada)* | Research | Customer Onboarding | 49 | 30,43% |
| manual de mantenimiento preventivo | — | — | 39 | 20,10% |
| emisión instantánea onboarding pymes | Informational | Onboarding & Training | 26 | **38,81%** |
| protocolo de mantenimiento | — | — | 11 | 30,56% |
| twi significado | — | — | 9 | 14,29% |
| plataformas onboarding reducción errores… *(truncada)* | Research | Onboarding & Training | 7 | 19,44% |
| soluciones de onboarding para pymes | Informational | Onboarding & Training | 5 | 10,42% |

**262 citas en total.** Dos filas quedan truncadas en la captura de origen; sin
el texto completo de la query no se puede diagnosticar con precisión, así que
no se tocan en este plan ([§4](#4)).

## 2. El diagnóstico

No falta contenido sobre estos temas — [ya existen 29 posts en el blog](src/lib/blog.ts)
y varios cubren justo estos asuntos. Lo que separa una fila con mucho volumen y
poca cuota de una fila ya bien servida es si **la página responde con las
mismas palabras con las que se pregunta**.

- **Desajuste de vocabulario.** *programa de mantenimiento preventivo* (65
  citas, 12,38%) y *manual de mantenimiento preventivo* (39, 20,10%) — el
  único post existente sobre el tema se llama y está estructurado como *SOP*,
  que en el vocabulario del sector es un objeto distinto: el procedimiento de
  una tarea, no el plan que cubre toda la planta. La IA no cita poco porque el
  contenido sea flojo; cita poco porque contesta otra pregunta.
- **Desajuste de forma.** *soluciones onboarding pymes* (51, 14,29%) y su
  práctico duplicado *soluciones de onboarding para pymes* (5, 10,42%) — existe
  [onboarding-software-pymes.astro](src/pages/blog/onboarding-software-pymes.astro),
  pero es una guía de compra (problema → solución → ROI → checklist), no un
  listado de opciones. El único tramo que se parece a "soluciones" es un H2 en
  sexta posición de ocho.
- **Ángulo que ya funciona y no se explota.** *emisión instantánea onboarding
  pymes* (26, **38,81%**) es, con diferencia, la mejor cuota de toda la tabla.
  Es la IA reconociendo el ángulo de generación instantánea — que es
  exactamente lo que construye
  [`PLAN_GENERADOR_INSTRUCCIONES_2026-09.md`](PLAN_GENERADOR_INSTRUCCIONES_2026-09.md).
  Aquí no hay que crear autoridad, hay que ampliarla antes de que la
  herramienta salga.
- **Query puramente definicional, mal ubicada.** *twi significado* (9,
  14,29%) ya tiene su respuesta exacta en el FAQ de
  [twi-formacion-operarios-en-el-puesto.astro](src/pages/blog/twi-formacion-operarios-en-el-puesto.astro),
  pero después de ocho H2 previos. Las IA citan lo que encuentran cerca del
  principio y en formato pregunta-respuesta directa.

## 3. Tareas

### C1 · Post nuevo — Programa de mantenimiento preventivo
**Estado:** ✅ hecho · **Impacto esperado:** el mayor de la tabla

[`/blog/programa-de-mantenimiento-preventivo/`](src/pages/blog/programa-de-mantenimiento-preventivo.astro) —
1.707 palabras, 10 min de lectura, `FAQPage` con 4 preguntas.

Diferenciado a propósito del post hermano, no un duplicado: ese resuelve **una
tarea** (el SOP), este resuelve **la planta** (el programa que decide qué SOPs
existen y cuándo se ejecutan). Se enlazan entre sí en los dos sentidos —el
hermano ya tenía la tarjeta de *relacionado* con 3 huecos y el CSS preveía un
cuarto (`:has(> :nth-child(4))`), así que no hizo falta tocar el layout.

Estructura: qué es → en qué se diferencia del SOP → inventario y criticidad de
máquinas → calendario → responsable de programa → indicadores → errores que lo
hacen fracasar → cómo lo resuelve REELEVO → FAQ. El FAQ incluye una pregunta
que absorbe también *protocolo de mantenimiento* (11 citas, 30,56% — ya
razonable, no necesitaba post propio) aclarando que programa/plan/protocolo se
usan como sinónimos en la práctica.

Posicionamiento honesto: el post dice explícitamente que REELEVO **no es un
GMAO**, siguiendo el mismo criterio que ya usa `/mantenimiento/` en su sección
*Hasta dónde llega*. No hay que inflar la capacidad del producto para ganar una
cita.

Registrado en `src/lib/blog.ts` (única fuente de verdad para `/blog/`,
`sitemap.xml` y `llms.txt` — el guardia anti-deriva del propio fichero rompe el
build si un post no está registrado). Build verificado: página generada,
`FAQPage` presente, alta en sitemap, enlace recíproco confirmado.

---

### C2 · Restructurar la sección "soluciones" de onboarding-software-pymes
**Estado:** ✅ hecho · **Cubre 2 filas:** 51 + 5 citas

El H2 `Tipos de onboarding software`, que era el tramo que ya respondía a
"soluciones", estaba en sexta posición de ocho secciones y eran tres párrafos
sueltos sin estructura comparable. Se movió a tercera posición —justo después
de "El problema"—, se renombró a *"Soluciones de onboarding para pymes"* y se
reescribió como tabla de tres columnas (tipo de solución / para qué sirve /
dónde se queda corta en planta), reutilizando el componente `.roi-table` que
ya existía en la página para no añadir CSS nuevo.

El resto de la página no cambió de fondo: el H2 que antes se llamaba
*"La solución"* pasó a *"Nuestro enfoque"*, para no competir en título con la
nueva sección de "soluciones" en plural.

Verificado: 0 referencias rotas al ancla antigua `#tipos` (no las había en
ningún otro fichero), las 7 anclas del índice de contenidos resuelven a un
`id` existente.

---

### C3 · Reforzar el ángulo que ya gana
**Estado:** ✅ hecho · **Mejor cuota de toda la tabla — 38,81%**

**El diagnóstico original de este plan estaba incompleto** y conviene dejarlo
corregido: al ejecutar la tarea se buscó en todo el sitio dónde podía estar
naciendo esa cuota, y no era una insinuación del futuro generador de
instrucciones. Ya existía la frase ganadora, **literal**, en
[onboarding-digital-errores-manuales.astro](src/pages/blog/onboarding-digital-errores-manuales.astro):
*"el cambio se refleja al instante en todos los puestos sin reimprimir nada"*.
Es el ángulo de **actualización instantánea de una versión ya existente**, no
de generación desde cero — dos cosas relacionadas pero distintas.

Se reforzó lo que ya funciona en vez de crear un ángulo especulativo:
- La frase se abrió con un titular extraíble: *"La emisión de una nueva
  versión es instantánea"* — "emisión" es, además, vocabulario literal de
  calidad ISO (la fecha de emisión de una revisión de un documento
  controlado), que es probablemente por donde entra la cita.
- Se añadió una pregunta de FAQ —con su entrada en el schema `FAQPage`— que
  usa esa misma palabra: *"¿Cómo se emite una nueva versión de una
  instrucción de trabajo en onboarding digital?"*.

La relación con `PLAN_GENERADOR_INSTRUCCIONES_2026-09.md` que se planteaba
aquí queda para cuando esa herramienta exista y tenga su propio contenido; no
había que esperar para reforzar lo que ya está citándose hoy.

---

### C4 · Subir la definición de TWI
**Estado:** ✅ hecho · **El más barato de los cinco**

Se añadió una frase corta y extraíble al principio del TL;DR de
[twi-formacion-operarios-en-el-puesto.astro](src/pages/blog/twi-formacion-operarios-en-el-puesto.astro):
*"TWI significa Training Within Industry"*, antes de la explicación más larga
que ya había. El FAQ al final del post no se tocó — la definición ya estaba
bien escrita ahí, solo hacía falta que también apareciera arriba.

---

### C5 · H2 "Manual de mantenimiento preventivo" en el post hermano
**Estado:** ✅ hecho · **39 citas, 20,10% de cuota**

Se añadió el H2 *"¿Manual, SOP o procedimiento?"* en
[sop-mantenimiento-preventivo-guia-plantilla.astro](src/pages/blog/sop-mantenimiento-preventivo-guia-plantilla.astro),
justo después de la sección introductoria, aclarando que los tres términos
describen el mismo documento — sin necesidad de reescribir el resto del post,
que ya cubre el contenido. Se sumó al índice de anclas y se añadió una
pregunta de FAQ a juego, con su entrada en el schema `FAQPage`.

Aprovechando la edición, esta sección enlaza hacia
[programa-de-mantenimiento-preventivo.astro](src/pages/blog/programa-de-mantenimiento-preventivo.astro)
(C1) para quien busque el nivel de planta en vez del documento de una tarea —
cierra el clúster en los dos sentidos.

## 4. Lo que se queda fuera, a propósito

Las dos filas truncadas en la captura de origen —*"onboarding digital pymes
adquisición acti…"* (49 citas, 30,43%) y *"plataformas onboarding reducción
errores…"* (7, 19,44%)— ya tienen cuota razonable y el texto cortado no permite
diagnosticar con precisión qué palabra falta. No se tocan hasta tener el texto
completo de la query; adivinar el resto de la frase y escribir contra esa
suposición sería el mismo error que C1 vino a corregir en sentido contrario.

## 5. Cómo verificar que funcionó

No hay forma de comprobarlo desde este repositorio: la métrica vive en la
herramienta de origen del panel, no en Search Console ni en Vercel Analytics.

- **Qué mirar:** la cuota de *programa de mantenimiento preventivo* en el
  mismo panel, pasadas unas semanas desde que Google/los motores de IA
  reindexen el post nuevo. No hay una cadencia conocida de reindexación de
  estos paneles — revisar en la próxima consulta disponible, sin fecha fija.
- **Señal secundaria en este repo:** Search Console, para ver si la URL nueva
  empieza a recibir impresiones por *programa de mantenimiento preventivo* y
  variantes. Coincide con la ventana de revisión ya prevista en
  `PLAN_SIMPLIFICACION_EDITORIAL_WEB_2026-08.md` (2-3 semanas).
