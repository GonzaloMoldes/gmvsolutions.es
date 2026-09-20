# Generador gratuito de instrucciones de trabajo — guía de desarrollo

> **Revisión del documento fuente:** 2026-09-02 · **Estado:** no iniciado · **0/15 tareas**
>
> **Decisiones tomadas el 2026-09-02:** la herramienta cuelga de `/recursos/` y no
> de un hub nuevo ([§4](#4)) · el correo va por Resend con plantilla propia y no
> por el doble opt-in de E-goi ([§3.3](#3)) · cada lead se da de alta en la app
> como cuenta en estado `lead` ([§3.4](#3), y `ESPEC_CUENTAS_LEAD_APP_2026-09.md`).
>
> Parte de `reelevo-gancho-generador.md`, lo contrasta contra la web y la app que
> hay hoy, y lo convierte en algo construible. El documento fuente es bueno en
> estrategia y le faltan tres cosas: no sabe qué existe ya, no dimensiona el
> riesgo legal de su entrada principal, y su escalera de precios contradice la
> publicada.

---

## Índice

1. [Lo que hay que decidir antes de nada](#1)
2. [Lo que ya existe y encaja](#2)
3. [Tres correcciones al documento fuente](#3)
4. [Dónde va en la web](#4)
5. [Arquitectura](#5)
6. [Riesgos](#6)
7. [Tareas](#7)
8. [Métricas](#8)
9. [Lo que este plan no incluye](#9)

---

<a id="1"></a>
## 1. Lo que hay que decidir antes de nada

El principio del documento fuente —**no se capa el documento, se capa el ciclo de
vida**— es correcto y no lo toco. Redactar se hace una vez, mantener se hace
siempre, y esa es la frontera natural entre lo gratis y lo de pago.

Lo que sí cambia después de mirar la web:

**El gancho no es nuevo. Es una promesa que ya hicimos y no cumplimos.** Hay
cinco páginas del blog empujando hacia una plantilla descargable que no existe.
Dos de ellas tienen el enlace muerto —`href="#"`— con el texto *«Plantilla
descargable en preparación. Mientras tanto, pídenosla por la demo y te la
enviamos»*. Las otras tres mandan tráfico a la primera.

| Página | Qué hace hoy |
|---|---|
| `/blog/plantilla-sop-produccion/` | Enlace muerto + «en preparación» |
| `/blog/plan-contingencia-bajas-produccion/` | Enlace muerto + «en preparación» |
| `/blog/instrucciones-de-trabajo-vs-sop/` | Enlaza a la primera |
| `/blog/documentar-procesos-mecanizado-cnc/` | Enlaza a la primera |
| `/blog/sop-mantenimiento-preventivo-guia-plantilla/` | Enlaza a la primera |

Eso cambia el orden de las prioridades. **La distribución ya está montada y está
desperdiciándose ahora mismo.** El generador no necesita construirse un público:
necesita ponerse donde el público ya está llegando y se está yendo con las manos
vacías.

Corolario práctico: si el generador se retrasa, la tarea barata de cerrar esas
dos promesas rotas con un PDF estático vale por sí sola (tarea **G1**).

---

<a id="2"></a>
## 2. Lo que ya existe y encaja

No hay que inventar casi nada de infraestructura. Inventario real:

| Pieza | Dónde | Qué aporta al generador |
|---|---|---|
| Rutas on-demand | `astro.config.mjs`, adaptador Vercel | El sitio es estático **salvo** las rutas con `export const prerender = false`. Hoy solo `/api/suscribir`. El generador añade las suyas sin tocar el resto. |
| Captación de email | `src/pages/api/suscribir.ts` | El **patrón** sirve: llamada servidor-a-servidor con secreto compartido, honeypot, 503 controlado si faltan variables. El **transporte no**: aquí va Resend, no E-goi ([§3.3](#3)). |
| `noindex` | `BaseLayout.astro`, prop `noindex` | Imprescindible para las páginas alojadas de cada instrucción. |
| Sitemap curado | `src/pages/sitemap.xml.ts` | Array `staticPages` a mano. Las páginas generadas **no entran**; las de la herramienta sí. |
| Convención de CTA | `data-cta-intent` / `-location` / `-label` | Ya existe `intent="descarga"`. La medición se engancha sola. |
| Plan Free | `/precios/` | 3 máquinas, 10 operarios, **5 procesos**, sin tarjeta, no caduca. |
| Clúster de contenido | 4 artículos de blog | `instrucciones-de-trabajo-vs-sop`, `qr-instrucciones-de-trabajo`, `instrucciones-de-trabajo-en-video`, `plantilla-sop-produccion`. Cubren exactamente la intención del generador. |
| Página comercial | `/documentacion-procesos/` | El destino natural del que ya generó y quiere mantener. |

**Lo que no existe y hay que montar:** subida de ficheros, llamada al modelo,
composición de PDF, almacenamiento, página alojada del QR, y el endpoint de
captación sin alta de cuenta.

---

<a id="3"></a>
## 3. Tres correcciones al documento fuente

### 3.1 El «Nivel 0 a 0 €» ya existe, y no es lo que el documento cree

El documento propone añadir un nivel gratuito de **5 instrucciones**. El plan
Free publicado ya da **5 procesos**, sin tarjeta y sin caducar. No hay que crear
un nivel: hay que **usar el que hay como destino del generador**.

Pero además el documento afirma *«Gratis para siempre — no prueba, no 60 días, no
tarjeta»*, y `/precios/` publica hoy justo lo contrario: **60 días de plan Pro
completo al registrarse**, y al terminar la cuenta cae a Free.

Las dos cosas no pueden convivir en la misma web sin que alguien las lea juntas y
concluya que no nos aclaramos. **Hay que decidir cuál es la oferta** antes de
escribir una línea de la landing, porque la promesa de la landing depende de eso.
Mi recomendación: mantener los 60 días de Pro (ya están publicados, ya están en
`tier-config.ts` de la app, y son más generosos) y que el generador entregue a esa
puerta. El documento fuente escribió su escalera sin mirar la existente.

> **Ojo al duplicado:** los límites de plan están escritos **dos veces**, en
> `/precios/` de esta web y en `reelevo-app/lib/tier-config.ts`. Ya hay un
> comentario en `precios.astro` avisándolo. Cualquier cambio toca los dos.

### 3.2 El vídeo no puede ser la vía principal del MVP

El documento pone el vídeo como vía **A**, la de mayor conversión esperada. Es
verdad que es la de menos esfuerzo para el usuario, y es la peor para empezar,
por dos motivos independientes:

**Técnico.** Una función serverless de Vercel acepta un cuerpo de petición de
**4,5 MB**. Un vídeo de 30–90 s del móvil son 20–100 MB. No entra. Hay que subir
a almacenamiento con URL firmada y procesar aparte — trabajo real, no un detalle.

**Legal.** Un vídeo de un operario trabajando es dato personal de un tercero que
no es nuestro usuario: cara, manos, voz, puesto. Ver [§6.1](#6).

La consecuencia no es descartarlo, es **respetar el orden que el propio documento
propone en su §12**: texto y foto primero, vídeo en la fase 3. Lo que hay que
corregir es la promesa de la landing, que en el documento ya habla de vídeo desde
el día 1.

### 3.3 El correo no va por el doble opt-in de E-goi

El documento fuente da por hecho el circuito actual. **Decisión tomada: no.**

E-goi está montado con doble opt-in —el contacto entra como `unconfirmed` y
espera a que confirme— y si la descarga depende de esa confirmación perdemos a
la mitad en el peor momento. El correo del generador va por **Resend con
plantilla propia**, igual que los avisos de la plataforma, para que quien recibe
el PDF vea el mismo remitente y el mismo formato que verá luego dentro de
REELEVO.

**La separación sigue siendo la misma, y es la legalmente limpia:**

- **El PDF se entrega en el acto**, por Resend. Es el servicio que el usuario ha
  pedido: correo transaccional, no marketing, y no necesita opt-in.
- **La secuencia comercial** (los disparadores de §8 del documento fuente) sí
  necesita consentimiento, y ese es el único que va a lista.

### 3.4 El lead no es un contacto de newsletter: es una cuenta sin activar

**Decisión tomada.** Cada email captado por la herramienta se da de alta en la
app como **cuenta con estado `lead`**: creada y visible, pero sin activar y sin
acceso. Cuando esa persona decide entrar, no rellena nada otra vez y **la
instrucción que generó ya está dentro**. Es lo que el documento fuente pide en su
§10 —*«cero pantalla vacía»*— llevado hasta el final.

Esto no se construye aquí. Requiere un estado nuevo en el modelo de cuentas de
la app y tiene su propia especificación:

> **`ESPEC_CUENTAS_LEAD_APP_2026-09.md`** — el escenario completo para el
> desarrollo en `reelevo-app`.

Esta web solo llama a su endpoint, igual que `/api/suscribir` ya llama al de alta
de empresa.

---

<a id="4"></a>
## 4. Dónde va en la web

### URLs

**Decisión tomada: cuelga de `/recursos/`, no de un hub nuevo.** Se centraliza
todo en un único menú.

| URL | Qué es | Indexable |
|---|---|---|
| `/recursos/` | Hub, ya existe | Sí |
| `/recursos/generador-instrucciones-de-trabajo/` | La herramienta y su landing | Sí |
| `/api/generar-instruccion` | Generación (on-demand) | — |
| `/api/instruccion-descarga` | Captación + entrega + alta del lead | — |
| `/it/<slug-largo-aleatorio>/` | Página alojada a la que apunta el QR | **No** |

Encaja sin inventar nada: `/recursos/<slug>/` **ya es un patrón vivo** —hoy
cuelgan `onboarding-software-pymes`, `gestion-competencias-industria` y
`onboarding-vs-tradicional`—, así que la herramienta entra donde el visitante ya
busca material y hereda los enlaces internos que el hub ya tiene.

La URL lleva el término que se busca —*instrucción de trabajo*— y no *generador
de SOP*. El clúster de blog está escrito en ese vocabulario, y la página que
distingue los dos términos (`instrucciones-de-trabajo-vs-sop`) es de las que más
empujan.

Ventaja añadida sobre mi propuesta anterior: cuando llegue el segundo imán
—la matriz de polivalencia— entra como un hermano más, sin crear contenedor ni
redirigir nada.

### Navegación

**Ninguna entrada nueva.** `RECURSOS` sigue con sus tres —Recursos, Blog,
FAQs— y la herramienta se alcanza desde el hub. La barra ya tiene siete
elementos y esto es captación, no una razón para comprar.

Lo que sí hay que tocar es **cómo se presenta el hub**. Hoy se anuncia en
`Header.astro` como *«Guías y materiales descargables»* y su H1 es *«Centro de
conocimiento»*: ninguna de las dos cosas dice *herramienta*. El subtítulo del
menú pasa a algo como *«Guías, plantillas y herramientas gratuitas»*, y la
herramienta ocupa **el primer bloque de la página**, por encima de *Explora por
intención*. Es lo único de ese hub que hace algo en vez de contarlo.

### Enlazado interno — por orden de valor

1. **Las dos promesas rotas** (`plantilla-sop-produccion`,
   `plan-contingencia-bajas-produccion`): sustituir el `href="#"` por la
   herramienta. Es donde hay intención de descarga declarada y ahora mismo se
   pierde entera.
2. **Los tres artículos que enlazan a la primera**: repuntar al generador.
3. **`/recursos/`**: tarjeta en el hub.
4. **`/documentacion-procesos/`**: enlace en la línea de *Relacionado*. Es el
   camino de vuelta, del que generó al que quiere mantener.
5. **`/precios/`**: mencionar que el plan Free acoge lo generado. Cierra el aro.

---

<a id="5"></a>
## 5. Arquitectura

### Principio

El documento fuente acierta en *«no montarlo como microsite aparte»*. Encaja con
lo que hay: **la landing y el formulario son estáticos en esta web**, la
generación va por rutas `prerender = false`, y **la cuenta la crea la app**, que
es la dueña del tenant (Supabase Auth + RLS), igual que ya hace `/api/suscribir`.

### Flujo del MVP

```
Landing en /recursos/…  →  formulario (texto + foto)
        ↓  POST mismo origen  (la CSP es enforcing: el navegador
        ↓                      solo habla con su propio origen)
/api/generar-instruccion   →  modelo  →  borrador estructurado (JSON)
        ↓
Vista previa en el navegador — el usuario CORRIGE
        ↓
/api/instruccion-descarga
        ├→  PDF en el acto, por Resend con plantilla propia   (transaccional)
        ├→  alta en la app como cuenta estado `lead`,         (servidor-a-servidor)
        │   con la instrucción generada dentro
        └→  lista comercial SOLO si marcó el consentimiento
```

El alta del lead sigue el patrón que ya usa `/api/suscribir`: llamada
servidor-a-servidor con secreto compartido, sin exponer nada al navegador. La
diferencia es que **no crea una cuenta activa**, sino una en estado `lead`. El
contrato de ese endpoint está en `ESPEC_CUENTAS_LEAD_APP_2026-09.md`.

### Decisiones técnicas que hay que tomar y no están en el documento fuente

| Asunto | Opciones | Recomendación |
|---|---|---|
| Composición del PDF | Puppeteer en servidor · librería (`pdf-lib`) · HTML + `@media print` | **HTML + print** para el MVP: el A4 y el A3 son maquetación, ya sabemos hacerla, y no añade dependencia pesada a una función serverless. |
| Almacenamiento | Supabase Storage (ya en el stack) | Supabase. No introducir un cuarto proveedor. |
| Subida de vídeo (fase 3) | URL firmada directa a Storage | Obligatorio: 4,5 MB de límite en la función. |
| Estado del borrador | En el navegador hasta la descarga | Menos dato guardado es menos riesgo y menos RGPD. |

---

<a id="6"></a>
## 6. Riesgos

Ordenados por lo que costaría equivocarse, no por probabilidad.

### 6.1 El vídeo es dato personal de alguien que no es nuestro usuario

Un vídeo de un operario trabajando identifica a esa persona. Quien lo sube es el
responsable del tratamiento; nosotros seríamos **encargado**. Eso implica contrato
de encargo, base jurídica, información a la plantilla y —en España— el deber de
informar a la representación de los trabajadores. No es videovigilancia, pero sí
es tratamiento de datos de empleados.

Y hay un segundo salto: **mandar ese vídeo a un modelo de un tercero** es una
comunicación a un subencargado, probablemente fuera de la UE.

`/seguridad/` dice hoy: *«En infraestructura dentro de la Unión Europea, sobre
Supabase y Vercel. Algunos servicios auxiliares pueden implicar proveedores
internacionales bajo las garantías contractuales adecuadas.»* La frase está bien
construida y deja sitio, pero **un vídeo de trabajadores no es un «servicio
auxiliar»**. Si se activa la vía de vídeo hay que decirlo explícitamente ahí.

> **Mitigación que además mejora el producto:** que el vídeo **no se almacene**.
> Se procesa, se extraen los fotogramas que el usuario elige, y el original se
> descarta. Lo que se guarda son imágenes que el usuario ha aprobado una a una.

### 6.2 Un parámetro inventado por el modelo puede hacer daño a alguien

Este es el riesgo grave y el documento fuente no lo menciona.

Su §3 pide que el A4 incluya *«parámetros de proceso en tabla (rpm, avance,
presión, par de apriete, temperatura…)»* y *«EPIs obligatorios»*. Un modelo
generativo, ante «cambio de mordazas en torno CNC», **rellenará esa tabla con
números plausibles**. Serán inventados. Y el documento va a acabar plastificado
en una máquina, delante de un operario que asume que alguien lo ha validado.

Un par de apriete inventado no es un error de contenido: es un riesgo laboral.

**Regla de diseño, no negociable:** el modelo produce **estructura y redacción**.
No produce **cifras ni EPIs**. Los parámetros salen como campos vacíos marcados
`— a completar por el responsable —`, y los EPIs salen como una lista de casillas
que el usuario marca. Esto además refuerza la tesis del documento: el hueco es
visible y se cierra con el producto.

Y encima, todo borrador sale marcado **BORRADOR — PENDIENTE DE VALIDACIÓN** hasta
que el usuario confirma. El cajetín *Elaborado / Revisado / Aprobado* del
documento fuente no puede salir en blanco *y además* sin marca de borrador: sería
un documento con apariencia de aprobado que no lo está.

### 6.3 Las instrucciones de trabajo son confidenciales

Una IT describe cómo fabrica una empresa. El documento fuente propone alojar cada
una en una página a la que apunta un QR, y no dice nada de protegerla.

Requisitos mínimos: **slug largo aleatorio** (no correlativo, nada de `IT-001`),
`noindex, nofollow`, fuera del sitemap, y `Referrer-Policy` que no filtre la URL.
Y decírselo al usuario: que sabe que quien tenga el enlace, entra.

### 6.4 El QR eterno es un compromiso eterno

*«El QR gratuito no caduca nunca»* es la decisión correcta comercialmente y hay
que entender lo que se firma: cada QR gratuito es una pegatina en una máquina de
alguien, para siempre. Coste de alojamiento permanente y, si algún día se apaga,
una máquina con un QR muerto en una planta.

No cambia la decisión. Sí obliga a documentar la política de conservación y una
vía de exportación, y a no prometerlo con más énfasis del que podemos sostener.

### 6.5 Herramienta gratis con coste por uso = abuso

Cada generación cuesta dinero. Sin registro previo, el suelo del abuso es el
tráfico. Mitigación: límite por IP y por dominio de email, `Retry-After`, tope
diario global con degradación controlada, y **el email por delante en la vía de
vídeo**, que es la cara. En texto y foto el coste es bajo y se puede mantener la
regla del documento fuente de generar antes de pedir nada.

### 6.6 Riesgo SEO: contenido generado que se indexa

Miles de páginas de instrucciones ajenas indexadas serían contenido pobre y
duplicado apuntando a nuestro dominio. El sitemap es curado a mano, así que el
riesgo no es que entren solas: es que alguien las añada sin pensar. Queda escrito:
**`/it/*` nunca entra en `sitemap.xml.ts`.**

### 6.7 Riesgo de posicionamiento comercial

Un generador gratuito bueno puede **canibalizar** la percepción del producto de
pago: «ya tengo mis instrucciones, ¿para qué pago?». Es exactamente el riesgo que
el principio de *capar el ciclo de vida* mitiga, y sobrevive solo si la salida
gratuita es **honestamente estática**: sin control de versiones, sin acuse, sin
multiidioma. Si por hacerla atractiva se le añade cualquiera de esas tres, el
gancho se convierte en el producto.

---

<a id="7"></a>
## 7. Tareas

### Fase 0 — Antes de escribir código

**G0 · Volumen de búsqueda**
**Estado:** ⬜ pendiente · **~30 min**
Lo que pide el documento fuente en su §13. Comprobar en Keyword Planner:
`instrucción de trabajo ISO 9001`, `plantilla instrucción de trabajo`,
`ejemplo de instrucción de trabajo`, `matriz de polivalencia`, `hoja de proceso`.
Decide cuál de los dos generadores va primero y qué término lleva la URL.

**G1 · Cerrar las dos promesas rotas** ← *independiente de todo lo demás*
**Estado:** ⬜ pendiente · **~2 h**
`plantilla-sop-produccion` y `plan-contingencia-bajas-produccion` tienen enlaces
muertos hoy. Publicar un PDF estático decente en `/public/` y enlazarlo. Si el
generador se retrasa seis meses, esto ya está cobrando. Si llega, se reemplaza.

**G2 · Decidir la oferta**
**Estado:** ⬜ pendiente · **~1 h**
Resolver la contradicción de [§3.1](#3): 60 días de Pro (publicado) frente a
«gratis para siempre» (documento fuente). Es decisión de negocio, no técnica, y
bloquea el texto de la landing.

### Fase 1 — MVP (el documento fuente estima 4–6 semanas)

**G3 · Landing dentro de `/recursos/`**
**Estado:** ⬜ pendiente · **~1 día**
`/recursos/generador-instrucciones-de-trabajo/`, con la plantilla editorial de
`PLANTILLA_PAGINA_COMERCIAL.md`: bloque dominante = la herramienta, no el texto.
Alta en `sitemap.xml.ts` y en `llms.txt`.
Incluye retocar el hub: la herramienta como primer bloque de `/recursos/`, por
encima de *Explora por intención*, y el subtítulo del menú en `Header.astro` de
*«Guías y materiales descargables»* a *«Guías, plantillas y herramientas
gratuitas»*.

**G4 · Formulario de entrada**
**Estado:** ⬜ pendiente · **~2 días**
Texto y foto. Tres campos obligatorios y ni uno más: máquina o puesto, categoría
del operario, sector. Sin registro previo.

**G5 · `/api/generar-instruccion`**
**Estado:** ⬜ pendiente · **~3 días**
`prerender = false`. Devuelve JSON estructurado. **Aplica la regla de [§6.2](#6):
ni cifras ni EPIs inventados.** Límite por IP y tope global. Clave del modelo solo
en servidor, como ya hace `/api/suscribir`.

**G6 · Vista previa editable**
**Estado:** ⬜ pendiente · **~3 días**
Donde el usuario corrige. Es el corazón del producto: *«corregir cuesta diez veces
menos que escribir»*. Aquí se marcan los EPIs y se rellenan los parámetros.

**G7 · Composición del A4 y el A3**
**Estado:** ⬜ pendiente · **~4 días**
HTML + `@media print`. El A3 con su propia regla: se entiende a dos metros. Marca
de agua **BORRADOR** hasta que el usuario valide.

**G8 · `/api/instruccion-descarga`**
**Estado:** ⬜ pendiente · **~2 días** · *depende de `EA1`–`EA4` de la espec de la app*
Email, honeypot y validación calcados de `/api/suscribir`. **Entrega el PDF en el
acto por Resend con plantilla propia**, no por E-goi ([§3.3](#3)). Da de alta la
cuenta en estado `lead` con la instrucción dentro ([§3.4](#3)). La lista comercial
solo si marcó el consentimiento, y es lo único que necesita opt-in.

**G8b · Resend en esta web**
**Estado:** ⬜ pendiente · **~4 h**
Resend no está hoy en este repo: no aparece en `package.json` ni en el código.
Hay que añadir el cliente, la clave como variable de entorno de Vercel y la
plantilla del correo de entrega, alineada con las de la plataforma. Mismo
comportamiento que `/api/suscribir` si falta la configuración: 503 controlado y
nada a medias.

**G9 · Enlazado interno**
**Estado:** ⬜ pendiente · **~2 h**
**Redirigir al generador los enlaces de plantilla que hoy no llevan a ninguna
parte o llevan a una página que tampoco la tiene.** Las cinco de [§1](#1):
sustituir los dos `href="#"` y repuntar los tres que van a
`/blog/plantilla-sop-produccion/`. Más `/recursos/`,
`/documentacion-procesos/` y `/precios/`. Con la convención `data-cta` que ya
existe, manteniendo `intent="descarga"` para no romper la serie histórica.

**G10 · Aviso legal y privacidad**
**Estado:** ⬜ pendiente · **~1 día** · *bloqueante para publicar*
Qué se guarda, cuánto, quién lo ve. Disclaimer de que el borrador requiere
validación humana ([§6.2](#6)). Revisión de `/legal/privacidad/`.

### Fase 2 — El QR (el documento fuente: +3 semanas)

**G11 · Página alojada y etiqueta**
**Estado:** ⬜ pendiente · **~1 semana**
`/it/<slug-aleatorio>/` con `noindex`, fuera del sitemap, slug no adivinable
([§6.3](#6)). Etiqueta lista para pegatina.

**G12 · Disparador del primer escaneo**
**Estado:** ⬜ pendiente · **~3 días**
*«Tu instrucción IT-001 se ha abierto 14 veces esta semana.»* Contador **anónimo**:
el plan gratuito dice explícitamente que no registra quién abre, y hay que
cumplirlo.

### Fase 3 — Vídeo (el documento fuente: +4 semanas)

**G13 · Subida y proceso de vídeo**
**Estado:** ⬜ pendiente · **~2 semanas**
URL firmada directa a Storage ([§5](#5)). **Email obligatorio antes de generar**
([§6.5](#6)). El original no se conserva ([§6.1](#6)).

**G14 · Actualizar `/seguridad/`**
**Estado:** ⬜ pendiente · **~2 h** · *bloqueante para publicar G13*
Declarar el subencargado de IA y el tratamiento de imágenes de trabajadores.
Hoy esa página no lo cubre.

---

<a id="8"></a>
## 8. Métricas

Las del documento fuente son buenas. Lo que añado es dónde se enganchan: la web ya
manda `page_type` a GA4 desde `BaseLayout` y ya tiene la convención
`data-cta-intent` / `-location` / `-label`, con `intent="descarga"` en uso. No hay
que montar medición nueva.

| Métrica | Qué te dice |
|---|---|
| Visita → generación iniciada | Si la promesa de la landing funciona |
| Iniciada → completada | Si el input pesa demasiado |
| Completada → email dejado | Si el pack vale lo que pides por él |
| **Instrucciones por cuenta** | **El predictor real de conversión a pago** |
| Escaneos por cuenta | Si llegó al taller o se quedó en la oficina |
| Intentos de editar bloqueados | Intención de compra pura |

La segunda instrucción generada es el momento de activación. Si la mayoría se
queda en una, el problema no es el precio: es que el pack no les sirvió.

Una que el documento fuente no pide y conviene: **cuántos parámetros deja el
usuario sin rellenar**. Si casi nadie los completa, el A4 está saliendo a planta
con huecos y eso es [§6.2](#6) otra vez.

---

<a id="9"></a>
## 9. Lo que este plan no incluye

- **El generador de matriz de polivalencia.** El documento fuente lo sitúa dos
  meses después. `G0` puede darle la vuelta al orden si el volumen de búsqueda lo
  justifica.
- **La secuencia completa de emails.** Los cinco disparadores de §8 del documento
  fuente son trabajo de marketing sobre E-goi, no de esta web. Aquí solo queda
  montado el disparador 1 (`G12`), que es el único que depende de nuestro código.
- **Los cambios en la app.** El alta de cuenta y los límites de plan viven en
  `reelevo-app`. Aquí se invoca su endpoint, como ya hace `/api/suscribir`.
- **La elección del proveedor de modelo.** Decisión con implicaciones legales
  ([§6.1](#6)) que conviene tomar con el criterio de RGPD por delante del de
  precio.
