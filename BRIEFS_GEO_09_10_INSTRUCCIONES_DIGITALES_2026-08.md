# Briefs — Contenidos 09 y 10 de la guía GEO

## REELEVO · Clúster de instrucciones digitales (vídeo y QR)

**Fecha:** 2026-08-20
**Origen:** `guia_contenidos_GEO_REELEVO.md`, secciones 9 y 21
**Reglas de honestidad:** `BRIEFS_CONTENIDO_SPRINTS_2026-Q3.md` sección 0.3 — no negociable
**Fuente de verdad de producto:** `MAPA_FUNCIONAL_PRODUCTO.md`
**Gate de publicación:** `CHECKLIST_PUBLICACION_SEO_CRO.md`

---

## 0. Por qué estos dos y por qué ahora

Son **dos de los cuatro huecos limpios** del bloque de estado de la guía: no hay ninguna URL publicada que responda a estas consultas, así que no compiten contra nada propio. Los otros dos huecos son el 04 y el 07.

Van juntos porque comparten el mismo movimiento: la instrucción deja de ser un papel y pasa a ser algo que el operario **consume en el puesto**. El vídeo es el formato; el QR es la entrega. Escritos a la vez se enlazan entre sí de forma natural y el clúster nace cumpliendo la regla de la sección 12.

### Lo que se verificó antes de escribir los briefs

Esto es lo que condiciona qué se puede afirmar. Contrastado contra `MAPA_FUNCIONAL_PRODUCTO.md`, no contra la web:

| Capacidad | Estado real | Qué se puede decir |
|---|---|---|
| **Flujo QR** | Es **el núcleo del producto**, no una función lateral. `/m/[token]` sin cuenta, sin email, sin instalar nada. Sección 5 entera del mapa | Se puede contar con detalle. Es lo más sólido que tenemos |
| **QR por plan** | Flujo QR e impresión de QR de máquina: ✅ en **los cuatro planes, incluido Free** | Se puede decir «puedes probarlo sin pagar» sin matices |
| **Vídeo** | Existe como **contenido de un paso** — «texto, imágenes, vídeo, adjuntos» | REELEVO **aloja y versiona** el vídeo dentro del proceso |
| **Vídeo — lo que NO es** | No hay grabación, edición, subtitulado ni biblioteca de vídeo en el producto | **No insinuar** que REELEVO graba o edita. El vídeo se produce fuera y se sube |
| **Almacenamiento** | Free 2 GB · Starter 5 GB · Pro 15 GB · Enterprise ilimitado | Límite real y relevante: el vídeo pesa. Decirlo es útil, no es una debilidad |
| **Offline** | MVP: flujo QR cacheado + sincronización diferida | «Funciona sin cobertura en el flujo de ejecución», **nunca** «offline completo» (sección 13 del mapa) |

**Consecuencia para el 09:** la guía pide «construir la categoría *video-based work instructions*». Se puede, pero el artículo tiene que ser **método**, no producto: cómo se hace un buen vídeo de instrucción. El papel de REELEVO es dónde vive ese vídeo, quién lo ha visto y qué versión está publicada. Si el artículo insinúa que REELEVO es una herramienta de vídeo, reintroduce por la puerta del blog exactamente lo que el plan de correcciones limpió.

### Decisión de clúster

Ambos entran en el clúster **`sop`** de `src/lib/blog.ts`, no en uno nuevo.

Un clúster «instrucciones digitales» nacería con dos artículos, y la regla de la sección 12 pide dos hermanos del mismo clúster: sería imposible de cumplir desde el día uno. Es exactamente el problema que ya tienen `lean`, `medicion`, `absentismo` y `digitalizacion` (tarea E1). Metidos en `sop`, ese clúster pasa de 7 a 9 artículos y los dos nuevos cumplen la regla sin esfuerzo.

---

## 1. Contenido 09 — Instrucciones de trabajo en vídeo

```text
TÍTULO:              Cómo crear instrucciones de trabajo en vídeo
PILAR:               SOP e instrucciones de trabajo
INTENCIÓN:           Informacional práctica (how-to). Sin giro comercial.
CONSULTA PRINCIPAL:  cómo hacer instrucciones de trabajo en vídeo
CONSULTAS SECUNDARIAS:
                     - instrucciones de trabajo audiovisuales
                     - grabar un procedimiento de trabajo
                     - vídeo instructivo para operarios
                     - cuánto debe durar un vídeo de formación en planta
AUDIENCIA:           Producción y RRHH. El que ya ha decidido documentar y
                     ahora se pregunta en qué formato.
PROBLEMA QUE RESUELVE:
                     El procedimiento escrito no transmite el gesto. Hay
                     operaciones que solo se entienden viéndolas, y quien
                     lo intenta graba con el móvil un vídeo de nueve
                     minutos que nadie vuelve a abrir.
OBJETIVO:            Ser la referencia en castellano de "instrucción de
                     trabajo en vídeo" y alimentar al pilar (contenido 12).
CTA:                 Informacional -> registro suave, sin presión.
                     "Empieza por el proceso que más veces has explicado"
ARTÍCULOS A ENLAZAR: /blog/que-es-un-sop-industrial/            (mismo clúster)
                     /blog/instrucciones-de-trabajo-vs-sop/     (mismo clúster)
                     /blog/qr-instrucciones-de-trabajo/         (mismo clúster, contenido 10)
                     /blog/digitalizar-conocimiento-planta-industrial/ (otro clúster: pilar)
                     /blog/conocimiento-tacito-taller-industrial/      (otro clúster)
PÁGINA DE REELEVO:   /documentacion-procesos/  (principal)
                     /workflows/               (secundaria)
FECHA:               por asignar
RESPONSABLE:         por asignar
ESTADO:              ☐ pendiente
```

- **URL:** `/blog/instrucciones-de-trabajo-en-video/`
- **Meta title** (≤60): `Cómo crear instrucciones de trabajo en vídeo`
- **Meta description** (≤155): `Cuándo el vídeo funciona mejor que el texto y cuándo no, cuánto debe durar, cómo grabarlo en planta y cómo evitar que quede obsoleto en seis meses.`
- **H1:** `Cómo crear instrucciones de trabajo en vídeo`
- **Cluster en `blog.ts`:** `sop`

### Respuesta principal, en el primer párrafo

La guía obliga (sección 4.2) a que la respuesta aparezca antes de cualquier introducción. Esta es la tesis, y debe leerse en las primeras cuatro líneas:

> El vídeo funciona cuando el problema es **un gesto que no se puede describir**: la presión justa, el sonido que avisa de que la pieza va mal, el orden en que se sueltan dos amarres. Para todo lo demás —parámetros, tolerancias, checklists— el texto gana, porque se consulta en tres segundos y el vídeo obliga a mirarlo entero. La mayoría de procedimientos necesitan las dos cosas, no una.

### Outline (H2)

1. **Cuándo el vídeo gana al texto, y cuándo pierde.** La tabla de decisión del artículo. Gesto, secuencia física y montaje → vídeo. Valores, tolerancias, criterios de aceptación y cualquier cosa que se consulte a mitad de tarea → texto.
2. **Cuánto debe durar.** Uno por operación, no uno por proceso. Si no cabe en 60-90 segundos, el problema no es el vídeo: es que estás grabando varios pasos juntos.
3. **La estructura de un vídeo que sí se ve.** Qué se va a hacer → el gesto en plano cerrado → el error típico → cómo se sabe que ha salido bien.
4. **Cómo grabarlo en planta sin montar un estudio.** Móvil sobre trípode, plano fijo, el experto ejecutando su trabajo real. Luz y ruido: los dos motivos por los que un vídeo de taller no se entiende.
5. **La voz: quién narra y qué dice.** El veterano explica mientras hace; alguien de fuera pregunta «¿por qué así?». Esa pregunta es la que saca el conocimiento tácito, y es la parte que no está en ningún manual.
6. **Revisión antes de publicar.** Que lo vea alguien que no sabe hacer la operación. Si no puede reproducirla, falta un paso: el experto se lo ha saltado sin darse cuenta.
7. **El problema real: mantenerlo vivo.** Un vídeo obsoleto es peor que un texto obsoleto, porque parece autoridad. Control de versiones, quién lo ha visto y qué se hace cuando cambia el proceso.
8. **Dónde vive el vídeo para que alguien lo vea.** Una carpeta compartida es donde los vídeos van a morir. Tiene que estar en el puesto, en el paso al que pertenece. *(Aquí entra REELEVO, y solo aquí.)*
9. **Preguntas frecuentes.**

### Lo que NO debe afirmar

- Que el vídeo **sustituye** a la documentación escrita. La guía lo prohíbe explícitamente y además es falso en planta.
- Que REELEVO graba, edita o subtitula vídeo. **No lo hace.** Se sube ya producido.
- Cifras de retención o de eficacia del formato vídeo sin fuente externa enlazada. Si no hay fuente, se reformula como criterio: «se entiende mejor», no «un 65 % mejor».

### Conexión con REELEVO, en un solo bloque

El vídeo se sube como contenido de un paso del proceso. Con eso: se ve en la máquina, no en una carpeta; queda versionado, así que al cambiar el proceso el operario recibe la confirmación de lectura de la versión nueva; y queda registro de quién lo ha consultado.

**El límite que hay que decir:** el vídeo pesa, y el almacenamiento va por plan (2 GB en Free, 5 en Starter, 15 en Pro). Un vídeo de 90 segundos a resolución de móvil ronda los 15-25 MB. Decirlo evita la conversación incómoda de después y demuestra que sabemos de lo que hablamos.

### Canibalización

El pilar (contenido 12) tiene un H2 llamado «Cuándo el vídeo ayuda y cuándo estorba». **Se queda como está**, en nivel resumen, y pasa a enlazar aquí para el desarrollo. Este artículo es el detalle; el pilar es el mapa. Sin ese enlace, los dos compiten por la misma consulta.

---

## 2. Contenido 10 — QR para instrucciones de trabajo

```text
TÍTULO:              Cómo usar códigos QR para las instrucciones de trabajo
PILAR:               SOP / operaciones digitales
INTENCIÓN:           Informacional con transición comercial natural.
CONSULTA PRINCIPAL:  códigos QR para instrucciones de trabajo
CONSULTAS SECUNDARIAS:
                     - QR en máquinas de producción
                     - cómo poner un QR en una máquina
                     - acceso a procedimientos desde el puesto
                     - instrucciones de trabajo sin ordenador
AUDIENCIA:           Producción y mantenimiento. Jefe de planta que ya tiene
                     procedimientos y sabe que nadie los abre.
PROBLEMA QUE RESUELVE:
                     El procedimiento existe, está actualizado y vive en una
                     carpeta del servidor a la que el operario no llega: no
                     tiene ordenador, ni email, ni ganas de otro sistema.
                     Así que llama al encargado.
OBJETIVO:            Posicionar la característica más diferencial del
                     producto sin que el artículo sea un folleto.
CTA:                 "Imprime el primer QR y pégalo en una máquina"
                     -> registro (el flujo QR está en el plan Free)
ARTÍCULOS A ENLAZAR: /blog/instrucciones-de-trabajo-en-video/    (mismo clúster, contenido 09)
                     /blog/que-es-un-sop-industrial/             (mismo clúster)
                     /blog/software-sop-para-fabricas-comparativa/ (mismo clúster)
                     /blog/digitalizar-conocimiento-planta-industrial/ (otro clúster: pilar)
                     /blog/trazabilidad-de-un-producto/          (otro clúster)
PÁGINA DE REELEVO:   /portal-operario/       (principal)
                     /documentacion-procesos/ (secundaria)
FECHA:               por asignar
RESPONSABLE:         por asignar
ESTADO:              ☐ pendiente
```

- **URL:** `/blog/qr-instrucciones-de-trabajo/`
- **Meta title** (≤60): `Códigos QR para instrucciones de trabajo en planta`
- **Meta description** (≤155): `Cómo funciona un QR pegado en la máquina para dar al operario el procedimiento correcto: qué resuelve, qué información muestra, límites y cómo implantarlo.`
- **H1:** `Cómo usar códigos QR para las instrucciones de trabajo`
- **Cluster en `blog.ts`:** `sop`

### Respuesta principal, en el primer párrafo

> Un QR pegado en la máquina resuelve **el problema de la última distancia**: el procedimiento ya existe y está bien, pero el operario no llega hasta él. Escanea con su móvil, ve la instrucción de esa máquina en su versión vigente y ejecuta. No necesita cuenta, ni ordenador, ni instalar nada. Lo que el QR no resuelve es que el procedimiento esté mal escrito: si el contenido no sirve, el QR solo lo hace más accesible.

### Outline (H2) — sigue la estructura que pide la guía

1. **Qué problema resuelve (y cuál no).** La última distancia entre el procedimiento y el puesto. El QR es un canal de entrega, no un método de documentación.
2. **Cómo funciona, paso a paso.** El recorrido real: escanear → identificarse → elegir el proceso → ejecutar paso a paso → cerrar con registro.
3. **Ejemplo en una máquina concreta.** Un centro de mecanizado con cambio de referencia. Qué ve el operario al escanear a las 6:05 de la mañana cuando el encargado aún no ha llegado.
4. **Qué información puede mostrar un QR.** Procedimiento del proceso, contenido del paso (texto, imagen, vídeo, adjuntos), checklist con evidencia, campos de captura, historial de la máquina.
5. **Ventajas frente al papel plastificado.** Siempre la versión vigente · no hay que repartir nada al actualizar · queda registro de quién ejecutó qué · el idioma lo elige el operario.
6. **Limitaciones, dichas en serio.** Esta sección es la que da credibilidad al artículo y **no se puede suavizar**:
   - Necesita cobertura o wifi. Hay soluciones con contenido cacheado, pero conviene medir la señal antes de prometer nada.
   - El QR físico se ensucia, se despega y se raya. Etiqueta resistente y plan de reposición.
   - No sustituye a la formación. Guía a quien ya sabe algo; no convierte a un novato en operario.
   - Si el procedimiento está desactualizado, el QR reparte el error más rápido.
7. **Buenas prácticas de implantación.** Un QR por máquina, no por proceso · a la altura de los ojos y fuera de la zona de virutas · material resistente · impreso desde el sistema, nunca generado a mano · plan de reimpresión.
8. **Cómo empezar con una sola máquina.** Elegir la que más llamadas al encargado genera, no la más importante. Dos semanas, un proceso, y comparar.
9. **Preguntas frecuentes.**

### La regla que la guía marca en negrita para esta pieza

**«Evitar convertir el artículo en una página de venta. Debe ser útil incluso para alguien que no vaya a comprar REELEVO.»**

Cómo se cumple en la práctica: los puntos 1 a 8 se escriben de forma que sirvan con **cualquier** herramienta. Alguien que llegue con un generador de QR gratuito y un PDF en Drive tiene que salir del artículo sabiendo dónde pegar la etiqueta, qué material aguanta el taladrina y por qué un QR por máquina es mejor que uno por proceso. REELEVO aparece **una vez**, en el punto 8, como la vía corta.

### Conexión con REELEVO

Es el núcleo del producto, así que aquí sí se puede ser concreto: el operario escanea, se identifica con un código personal —sin cuenta, sin email, sin contraseña—, elige el proceso, ejecuta paso a paso y al cerrar queda la firma, la certificación automática en esa versión y el QR de pieza para la trazabilidad.

**El dato que hace el CTA honesto:** el flujo QR y la impresión de QR de máquina están en **los cuatro planes, incluido el Free**. Se puede invitar a imprimir el primer QR sin ninguna letra pequeña.

**El límite que hay que respetar:** offline es un MVP —flujo QR cacheado con sincronización diferida—. Se dice «funciona sin cobertura en el flujo de ejecución». **Nunca** «funciona offline».

### Canibalización

Ninguna directa: no hay artículo de QR. Ojo con `/blog/trazabilidad-de-un-producto/`, que menciona QR cinco veces pero para trazabilidad de pieza, que es otra cosa. Se enlazan entre sí dejando clara la frontera: **QR de máquina** entrega la instrucción, **QR de pieza** acredita lo que se hizo.

---

## 3. Qué hay que tocar además de escribir

| Tarea | Fichero | Por qué |
|---|---|---|
| Registrar los dos artículos | `src/lib/blog.ts` | Es el registro único: sin entrada no aparecen en el índice, ni en el sitemap, ni en `/llms.txt`. El propio `blog.ts` avisa de los que falten |
| Enlace desde el pilar | `src/pages/blog/digitalizar-conocimiento-planta-industrial.astro` | Su H2 de vídeo pasa a enlazar al 09. Evita que compitan |
| Enlace desde el 01 y el 03 | `que-es-un-sop-industrial.astro`, `instrucciones-de-trabajo-vs-sop.astro` | Cierra el clúster `sop` en las dos direcciones y sube el cumplimiento de E1 |
| Re-medir E1 | — | Al entrar dos artículos en `sop`, cambia el denominador de la regla de la sección 12 |
| Actualizar el bloque de estado | `guia_contenidos_GEO_REELEVO.md` | 09 y 10 pasan a ☑. Suma 2,00 j: el porcentaje va de 56 % a ~70 % |

---

## 4. Antes de publicar

Pasa el gate de `CHECKLIST_PUBLICACION_SEO_CRO.md` y, además, estas tres que son propias de estas dos piezas:

1. **Ninguna afirmación de producto que el mapa funcional no respalde.** En concreto: REELEVO no graba vídeo, y offline es un MVP.
2. **El artículo 10 sirve a quien no compra.** Léelo quitando mentalmente el bloque de REELEVO: si deja de ser útil, hay que reescribirlo.
3. **Cada uno enlaza a 2 del mismo clúster, 1 de otro y 1 página de producto** (sección 12 de la guía). En los briefs de arriba ya están elegidos.
