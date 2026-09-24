# Descarga con cuenta lead — especificación web + app

> **Escrita:** 2026-09-23 · **Repos:** `en-construccion` (web) y `reelevo-app` (app y admin) · **Estado:** en curso · **4/14 tareas**
>
> Especifica una función que se activa **sólo en los botones que se marquen** en la
> web: al pulsar, el visitante deja sus datos, **se le crea una cuenta lead en
> REELEVO**, y sólo entonces descarga el recurso directamente desde la web. Después,
> si lo ha consentido, entra en una **secuencia de 3 correos de calentamiento** que
> termina invitándole a completar su cuenta, pidiéndole sólo lo que falta.
>
> Este documento vive **idéntico en los dos repos**: en la raíz de la web y en
> `docs/` de la app. Si se cambia en uno, se copia al otro.

---

## Relación con los documentos anteriores

| Documento | Qué pasa con él |
|---|---|
| [`ESPEC_CUENTAS_LEAD_APP_2026-09.md`](ESPEC_CUENTAS_LEAD_APP_2026-09.md) | **Su §2 (modelo A, `companies.estado='lead'`) queda sustituida** por la decisión de §2 de este documento. El resto —idempotencia por email, `409` sin degradar cuentas, RGPD— sigue vigente y aquí se reutiliza |
| `PLAN_CRM_LEADS_2026-09-02.md` (sólo en `reelevo-app/docs/`) | Es el **plan de ejecución del modelo de leads** en la app. Este documento es un consumidor más de ese plan: donde una tarea ya existe allí, aquí se cita por su identificador (`T-03`, `T-04`…) en vez de repetirla |
| `PLAN_GENERADOR_INSTRUCCIONES_2026-09.md` | El generador es **otro origen** del mismo mecanismo. Lo que se construye aquí le sirve sin cambios |

---

## Índice

1. [Qué se construye](#1)
2. [Decisiones tomadas](#2)
3. [El recorrido completo](#3)
4. [Web: los botones de descarga](#4)
5. [Contrato web → app](#5)
6. [App: el lead](#6)
7. [Admin: dónde se ven los leads](#7)
8. [La secuencia de calentamiento](#8)
9. [Completar la cuenta](#9)
10. [Legal y RGPD](#10)
11. [Tareas y seguimiento de cumplimiento](#11)
12. [Preguntas abiertas](#12)

---

<a id="1"></a>
## 1. Qué se construye

Cuatro piezas, dos en cada repo:

| Pieza | Repo | Qué hace |
|---|---|---|
| **Botón de descarga con cuenta** | web | Un atributo que se pone en cualquier botón. Abre el formulario, crea el lead y entrega el archivo |
| **Alta de lead** | app | `POST /api/leads/alta`, servidor-a-servidor. Crea o actualiza el lead y registra qué descargó |
| **Vista de leads en el admin** | app | Los leads en `Marketing › Leads` y, con etiqueta **Lead**, en el listado de `Empresas` |
| **Secuencia de calentamiento** | app | 3 correos comerciales, sólo con consentimiento. El tercero lleva al registro con los datos ya puestos |

---

<a id="2"></a>
## 2. Decisiones tomadas

Tomadas el 2026-09-23. No se reabren sin motivo nuevo.

### D-1 · El lead vive en su propia tabla, no en `companies`

`companies` tiene **103 lecturas** en el código y **61 no filtran por `status`**
(medido el 2026-09-23, mismo comando que `PLAN_CRM_LEADS` §H-4). Meter `'lead'` en
`companies.status` obligaría a auditar las 103 y dejaría abierta la puerta a que un
lead cuente como cliente en una métrica el día que alguien olvide un filtro.

Por eso el lead se guarda en **`marketing_leads`, generalizada** (`PLAN_CRM_LEADS`
modelo C, tarea `T-03`) y **se ve como lead en el admin** mediante una vista que sólo
lee el admin (§7). La fila de `companies` nace cuando la persona completa su cuenta,
no antes.

> Lo que se pidió —«la cuenta empresa aparece como lead»— se cumple en lo que se ve.
> Lo que cambia es dónde se guarda, y eso es invisible para el equipo comercial.

### D-2 · Sin lead no hay descarga

El archivo se entrega **siempre después** de que la app confirme que el lead existe.
Si la app no responde o rechaza el alta, **no hay descarga** y el visitante ve un
error con opción de reintentar.

La única excepción es el `409`: el email ya es de una cuenta activa. Es un cliente, y
**recibe el archivo** sin que se toque su cuenta (§5).

> Esto **sustituye** lo que decía la espec anterior («se entrega el PDF igual»). El
> coste: si la app cae, la web deja de entregar recursos. Se acepta porque el recurso
> es el precio del lead, y regalarlo sin lead invalida la función.

### D-3 · La descarga es directa, desde la web

Nada de «te lo enviamos por correo». Tras el alta, el navegador descarga el archivo.
Los archivos **no pueden estar en `public/`**: una URL fija se comparte y la función
deja de tener sentido (§4.3).

### D-4 · El consentimiento comercial es una casilla aparte y opcional

La descarga **no depende** de marcarla. Quien no la marca tiene su lead y su archivo,
pero **no entra en la secuencia**. Motivo legal en §10.

### D-5 · Sólo en los botones que se marquen

La función no se activa por página ni por plantilla, sino **botón a botón**, con un
atributo (§4.1). Una página sin botones marcados no carga ni el formulario ni su script.

---

<a id="3"></a>
## 3. El recorrido completo

```
 WEB                                      APP
 ───                                      ───
 Botón marcado  data-descarga="plantilla-ot"
   │
   ▼
 Formulario: nombre · email · empresa
   · aviso de que se crea una cuenta (obligatorio)
   · casilla comercial (opcional)
   · Turnstile · honeypot
   │
   ▼
 POST /api/descarga  (función Vercel)
   │ valida, Turnstile, límite por IP
   │
   ├──── POST /api/leads/alta ───────────►  marketing_leads
   │     Bearer LEADS_ALTA_SECRET             origen = 'descarga_web'
   │                                          + fila en marketing_lead_descargas
   │◄─── 200 / 409 ────────────────────────   (si consintió: secuencia paso 0)
   │
   ▼
 Token de descarga (10 min)
   │
   ▼
 GET /api/descarga/plantilla-ot?t=…  →  el archivo
 Pantalla: «Listo. Tu cuenta está creada»
                                          │
                                          ▼
                                   Correo 0 · cuenta creada (transaccional) [§12.1]
                                          │
                          ¿consintió? ── no ──► fin, salvo que vuelva por su cuenta
                                          │ sí
                                          ▼
                                   Correo 1 · problemas         D+1
                                   Correo 2 · capacidades       D+4
                                   Correo 3 · prueba gratuita   D+9  ── CTA
                                          │
                                          ▼
                                   /registro?lead=<token>
                                   nombre, email y empresa ya puestos
                                   pide CIF y contraseña
                                          │
                                          ▼
                                   companies (fila nueva) · trial 60 días
                                   lead: estado 'convertido', company_id
                                   la secuencia se detiene
```

Los plazos D+1, D+4 y D+9 son una propuesta (§12.2).

---

<a id="4"></a>
## 4. Web: los botones de descarga

### 4.1 Cómo se marca un botón

Un atributo en cualquier enlace o botón, con el identificador del recurso:

```astro
<a href="/recursos/plantilla-orden-trabajo/" data-descarga="plantilla-ot">
  Descargar la plantilla
</a>
```

- El `href` es el **destino sin JavaScript**: la página del recurso, no el archivo.
  Si el script no carga, el enlace sigue llevando a algún sitio útil.
- Con el script cargado, el clic se intercepta y abre el formulario.
- **Sólo los elementos con `data-descarga` activan la función.** Cualquier otro botón
  de la misma página se comporta como siempre.

El componente `<DescargaConCuenta />` se incluye **sólo en las páginas que tengan algún
botón marcado**, no en `BaseLayout`. Así una página sin botones no carga nada.
Mismo criterio que `NewsletterModal`, que hoy se monta desde el layout con un
interruptor (`PUBLIC_NEWSLETTER_MODAL`), pero a nivel de página.

### 4.2 El catálogo de recursos

Un único archivo, `src/data/descargables.ts`, con un objeto por recurso:

| Campo | Ejemplo | Para qué |
|---|---|---|
| `id` | `plantilla-ot` | El valor de `data-descarga`. Estable: lo guarda la app |
| `titulo` | Plantilla de órdenes de trabajo | El formulario y el admin |
| `archivo` | `plantilla-orden-trabajo.xlsx` | Nombre del archivo servido |
| `tipo` | `plantilla` · `guia` | Agrupar en el admin |
| `modulo` | `mantenimiento` | A qué parte de la app lleva al completar la cuenta (§9.3) |

Un `data-descarga` con un `id` que no está en el catálogo **falla en el build**, no
en producción. Se comprueba con un script en `scripts/`, como los que ya hay.

### 4.3 Dónde viven los archivos y cómo se sirven

- Los archivos van **fuera de `public/`**, en `src/descargables/`, e incluidos en la
  función de Vercel. El límite de tamaño de la función (50 MB) sobra para PDFs y
  hojas de cálculo.
- Tras el `200`/`409` de la app, `POST /api/descarga` devuelve un **token firmado**
  (HMAC con `DESCARGA_TOKEN_SECRET`) con el `id` del recurso y **10 minutos** de validez.
- `GET /api/descarga/[recurso]?t=…` comprueba el token y sirve el archivo con
  `Content-Disposition: attachment`.
- Un token caducado o de otro recurso devuelve `403` y la página vuelve a mostrar el
  formulario.

### 4.4 El formulario

| Campo | Obligatorio | Nota |
|---|---|---|
| Nombre | Sí | |
| Email de trabajo | Sí | Normalizado a minúsculas |
| Empresa | Sí | Se guarda como **empresa declarada**, no como razón social |
| Aviso de cuenta | Sí, como lectura | «Al descargar se crea una cuenta de REELEVO sin activar con estos datos.» Con enlace a la política de privacidad |
| Casilla comercial | **No** | «Quiero recibir 3 correos sobre cómo REELEVO resuelve esto.» Sin marcar por defecto |
| Turnstile | Sí | Validado **en la web**, que es quien recibe la petición del navegador |
| Honeypot | Oculto | Mismo patrón que `/api/suscribir` |

Estados de la pantalla: formulario → enviando → **«Listo. Tu cuenta está creada»** con
la descarga ya en marcha y un botón para repetirla → error con reintento.

### 4.5 `POST /api/descarga` en la web

Mismo esqueleto que `src/pages/api/suscribir.ts` de la web:
`prerender = false`, `503` si falta configuración, honeypot, validación, y llamada
servidor-a-servidor. Añade Turnstile y un límite por IP antes de llamar a la app.

Variables nuevas en Vercel (web):

| Variable | Para qué |
|---|---|
| `LEADS_ALTA_URL` | `https://<app>/api/leads/alta` |
| `LEADS_ALTA_SECRET` | Secreto compartido con la app |
| `DESCARGA_TOKEN_SECRET` | Firma de los tokens de descarga. **Sólo en la web** |
| `TURNSTILE_SECRET_KEY` | Si no existe ya en la web |

> **Deuda que se cierra de paso:** `/api/suscribir` llama hoy a `APP_REGISTRO_URL`,
> que **no existe en la app** (verificado el 2026-09-23: ninguna referencia en
> `reelevo-app`). Debe pasar a llamar a `/api/leads/alta` con
> `origen: 'newsletter_modal'`. Un único endpoint para todos los orígenes.

#### Decisiones de implementación (DL-5, 2026-09-24)

Tomadas al construir los endpoints. Cada una dice qué cambia respecto a lo que esta espec
decía antes y por qué.

| # | Decisión | Por qué | Consecuencia |
|---|---|---|---|
| **I-1** | **Límite por IP en memoria de la función**, best-effort (10 peticiones / 10 min por IP) | La web no tiene Redis y montarlo sólo para esto no compensa | Con varias instancias cada una cuenta por su lado. **La protección real contra altas masivas es Turnstile + el tope diario y por dominio de la app (T-04)**, que sí son compartidos |
| **I-2** | **Honeypot relleno → 502, sin lead ni descarga** | `/api/suscribir` finge éxito ante un bot; aquí fingir éxito obligaría a entregar el archivo, que es justo lo que se protege | El bot recibe el mismo error que si la app hubiera fallado: no aprende qué lo delató |
| **I-3** | **Textos legales y su versión en un módulo propio** (`src/lib/descarga-consentimiento.ts`) | La app guarda `consentimiento_texto_version` para acreditar qué texto se aceptó (RGPD art. 7.1) | No se puede cambiar la redacción sin tocar el archivo donde está la versión |
| **I-4** | **Rutas con barra final**: `/api/descarga/` y `/api/descarga/<recurso>/?t=…` | El sitio tiene `trailingSlash: always`, igual que `/api/suscribir/` | El componente (DL-4) tiene que llamar con la barra |
| **I-5** | **Token sin datos personales**: sólo recurso y caducidad, HMAC-SHA256 | Si alguien comparte el enlace, en 10 minutos no vale y no dice de quién era | Cada descarga necesita pasar otra vez por el formulario; la app ya reconoce al lead por su email |

**Pendiente de comprobar fuera de local** (entra en DL-14): en una **preview de Vercel**, que
la función lee `src/descargables/` desde `process.cwd()`. El build lo deja todo en
`.vercel/output/functions/_render.func/src/descargables/`, pero la ruta en tiempo de
ejecución sólo se confirma desplegando.

### 4.6 Secretos y configuración en Vercel

Toda variable secreta de esta función, **dónde vive, cómo se generó y cuándo se configuró**.
El procedimiento paso a paso, la verificación con `curl` y la rotación están en
`reelevo-app/docs/DEPENDENCIAS_MANUALES_GONZALO.md` **§25**, que es donde el repo de la app
lleva las acciones que se hacen fuera del código. **El valor de un secreto no se anota nunca**
en ningún documento: sólo el método y la fecha. Se guarda en el gestor de contraseñas.

**Método de generación** de todos los secretos propios de esta función (256 bits, sin
caracteres `+/=` que se rompan al copiar):

```bash
node -e "console.log(require(crypto).randomBytes(32).toString(base64url))"
```

| Variable | Proyecto(s) | Para qué | Lo lee | Generación | Estado |
|---|---|---|---|---|---|
| `LEADS_ALTA_SECRET` | **app y web, mismo valor** | La web se identifica ante `POST /api/leads/alta` | app: `getLeadsAltaSecret()` → `coincideSecreto()` (`lib/cron-auth.ts`, `timingSafeEqual`) · web: `/api/descarga`, `/api/suscribir` | comando de arriba | ⬜ pendiente de crear (DEPENDENCIAS nº 25b) |
| `LEADS_ALTA_URL` | web | URL del endpoint de la app | web: `/api/descarga` | no es secreta | 🟡 leída por el código (DL-5); falta configurarla en Vercel |
| `DESCARGA_TOKEN_SECRET` | **sólo web** | Firma HMAC de los tokens de descarga de 10 min | web: `firmarToken()` / `verificarToken()` de `src/lib/descarga-token.ts` | comando de arriba | 🟡 leída por el código (DL-5); falta crearla y configurarla en Vercel |
| `LEAD_TOKEN_SECRET` | **sólo app** | Firma de los enlaces de baja y de completar la cuenta | app: `lib/lead-token.ts` | comando de arriba | ⬜ (DL-9) |
| `TURNSTILE_SECRET_KEY` | web | Verificación de Turnstile en el formulario | web: `/api/descarga` (`siteverify`) | la da Cloudflare, no se genera. En local: clave de pruebas `1x0000000000000000000000000000000AA` | 🟡 leída por el código (DL-5); falta crear el widget en Cloudflare y configurarla |
| `PUBLIC_TURNSTILE_SITE_KEY` | web | Clave pública del widget en el formulario | web: `<DescargaConCuenta />` | la da Cloudflare junto con la secreta | ⬜ (DL-4) |

Reglas:

- **Production** lleva un valor; **Preview y Development** otro distinto, generado igual. Una
  preview nunca puede crear leads en producción aunque apunte mal `LEADS_ALTA_URL`.
- Las variables se marcan como **Sensitive** en Vercel y sólo se leen al desplegar: tras
  añadirlas hay que **redesplegar**.
- Un secreto que sólo usa un proyecto (`DESCARGA_TOKEN_SECRET`, `LEAD_TOKEN_SECRET`) **no
  se copia al otro**. Cuantos menos sitios lo tengan, menos sitios por donde se filtra.
- Cada alta o rotación se anota en el **registro de configuración** de DEPENDENCIAS §25 con
  fecha, proyecto, entorno y método.

**Registro de hitos de configuración:**

| Fecha | Qué | Dónde | Quién | Verificación |
|---|---|---|---|---|
| 2026-09-24 | Migración `20260924000001` aplicada | Supabase, SQL Editor (producción) | Gonzalo | Script contra la base real, 14/14 ✅ |
| 2026-09-24 | `LEADS_ALTA_SECRET` declarada como variable opcional | `reelevo-app`: `lib/env-schema.ts`, `lib/runtime-env.ts`, `.env.example` | código | `check:env-example` ✅ |
| 2026-09-24 | `LEADS_ALTA_URL`, `LEADS_ALTA_SECRET`, `DESCARGA_TOKEN_SECRET`, `TURNSTILE_SECRET_KEY` leídas por la web | `en-construccion`: `src/pages/api/descarga/` | código | e2e local 20/20 ✅ |
| — | `LEADS_ALTA_SECRET` creada y configurada | Vercel, app y web | Gonzalo | `curl` sin secreto → `401` |
| — | Variables de la web configuradas (`LEADS_ALTA_URL`, `DESCARGA_TOKEN_SECRET`, Turnstile) | Vercel, web | Gonzalo | `curl -X POST <web>/api/descarga/` → `422`, no `503` |

---

<a id="5"></a>
## 5. Contrato web → app

`POST /api/leads/alta` — tarea `T-04` de `PLAN_CRM_LEADS`, con lo que este origen
añade. Autenticación: `Authorization: Bearer LEADS_ALTA_SECRET`, comparación en tiempo
constante. **Nunca desde el navegador.**

### Petición

```json
{
  "email": "juan@talleres-ejemplo.es",
  "nombre": "Juan",
  "empresa_declarada": "Talleres Ejemplo SL",
  "origen": "descarga_web",
  "origen_ref": "plantilla-ot",
  "modulo": "mantenimiento",
  "consentimiento_comercial": true,
  "consentimiento_texto_version": "2026-09-23",
  "pagina": "/recursos/plantilla-orden-trabajo/",
  "utm": { "source": "google", "medium": "organic", "campaign": null }
}
```

`consentimiento_texto_version` identifica **qué texto** aceptó. Sin eso, el
consentimiento no se puede acreditar (RGPD art. 7.1), que es la regla de
`lib/consent-record.ts`.

### Respuesta

| Código | Cuándo | La web |
|---|---|---|
| `200` `{ "lead": "creado" }` | Email nuevo | Entrega el archivo |
| `200` `{ "lead": "actualizado" }` | Ya era lead → añade la descarga | Entrega el archivo |
| `409` | El email es de una **cuenta activa** | **Entrega el archivo.** No se toca la cuenta |
| `422` | Falta un campo o el email es inválido | Error en el formulario |
| `429` | Tope diario superado | Error: «inténtalo más tarde». **Sin descarga** (D-2) |
| `401` | Secreto incorrecto | Error genérico y aviso en logs |
| `503` | App sin configurar | Error genérico |

### Reglas

- **La clave es el email**, normalizado. Nunca el nombre de empresa.
- **Un lead que vuelve** con otro recurso no crea otro lead: se añade una fila en
  `marketing_lead_descargas` y se actualiza `ultimo_contacto_en`.
- **El consentimiento sólo se añade, nunca se retira por omisión.** Si consintió la
  primera vez y la segunda no marca la casilla, sigue consentido. Se retira con el
  enlace de baja (§8.4), que es un acto explícito.
- **`409` no escribe nada** en la cuenta activa. Es el invariante I-1 de `PLAN_CRM_LEADS`.
- **Si la persona se dio de baja** y vuelve a marcar la casilla, **vuelve a quedar
  consentida**: es un consentimiento nuevo, con su fecha y su versión de texto.

---

<a id="6"></a>
## 6. App: el lead

### 6.1 Sobre qué se construye

`marketing_leads` existe (`20260408000014_marketing_leads.sql`) pero sólo entiende el
flujo de la tarjeta con QR: `visitor_hash` es `NOT NULL` con clave foránea a
`marketing_visitor_sessions`. `PLAN_CRM_LEADS` `T-03` la generaliza. Este origen
necesita de esa migración:

| Columna | Viene de `T-03` | La añade este origen |
|---|---|---|
| `origen`, `origen_ref` | ✓ | |
| `estado` (`nuevo · contactado · cualificado · convertido · descartado`) | ✓ | |
| `company_id` | ✓ | |
| `consentimiento_comercial` + fecha | ✓ | + `consentimiento_texto_version` |
| `utm_*`, `ultimo_contacto_en` | ✓ | |
| `visitor_hash` opcional | ✓ | |
| `empresa_declarada` | | ✓ (hoy la columna se llama `empresa`: se reutiliza, no se duplica) |
| `secuencia_paso` (0–3), `secuencia_siguiente_en` | | ✓ |
| `baja_comercial_en` | | ✓ |

Y una tabla hija:

```
marketing_lead_descargas
  id · lead_id → marketing_leads · recurso · pagina · descargado_en
```

Una fila por descarga. Es lo que el admin muestra como «qué se ha llevado».

### 6.2 RLS

Igual que hoy: **sólo `admin_reelevo` lee**, y **sólo el rol de servicio escribe**.
Un lead no tiene usuario de Auth, así que ninguna sesión de cliente lo alcanza.

### 6.3 Anti-abuso

- Turnstile y límite por IP en la web (§4.5).
- **Tope diario global** en la app, con el `createFailureRateLimiter` que ya usa el
  registro. Si se supera: `429`, sin lead y sin descarga (D-2).
- Límite por **dominio de email**: más de N altas del mismo dominio en una hora se
  rechazan. **[decidir N — propongo 20]**

---

<a id="7"></a>
## 7. Admin: dónde se ven los leads

### 7.1 `Marketing › Leads` — la zona de leads

Ya existe: `/admin/marketing/leads`, sobre `AdminMarketingLeadsView`. Hoy sólo
muestra leads de la tarjeta con QR. Con `PLAN_CRM_LEADS` `T-09` gana el filtro por
origen. Este origen añade:

| Columna | Contenido |
|---|---|
| Origen | **Descarga web** |
| Recursos | Lo que ha descargado, de `marketing_lead_descargas` |
| Consentimiento | Sí / No / Dado de baja, con fecha |
| Secuencia | `2/3 · próximo el 28-sep`, o `detenida: convertido` |
| Estado | `nuevo` … `convertido`, editable (`T-10`) |

### 7.2 `Empresas` — el lead aparece como cuenta con etiqueta **Lead**

En `/admin/empresas`, los leads **sin convertir** aparecen en el listado con la
etiqueta **Lead**, junto a las cuentas reales. Se consigue con una **vista de sólo
lectura del admin**:

```
admin_empresas_y_leads
  = companies (con su status)
  ∪ marketing_leads sin company_id, mostrados con status 'lead'
```

- La vista es `security_invoker` y hereda la RLS de las dos tablas: **sólo
  `admin_reelevo` ve las filas de lead**.
- **Sólo la usa el listado de Empresas del admin.** Ninguna métrica, conteo, informe
  ni correo del producto la lee. Lo vigila el gate `T-14` de `PLAN_CRM_LEADS`.
- El clic en una fila de lead abre **la ficha del lead** en `Marketing › Leads`, no
  una ficha de empresa, porque la empresa todavía no existe.
- Los contadores de cabecera del listado (activas, piloto, inactivas) **no suman
  leads**. Los leads tienen su propio contador, aparte.
- Cuando el lead se convierte, desaparece como lead y aparece su empresa real, con
  «**Vino de:** descarga · Plantilla de OT» en su ficha (`T-11`).

---

<a id="8"></a>
## 8. La secuencia de calentamiento

### 8.1 Los tres correos

Sólo para leads con `consentimiento_comercial = true` y sin `baja_comercial_en`.

| # | Cuándo | Tema | Objetivo | CTA |
|---|---|---|---|---|
| **1** | D+1 | **Los problemas que resuelve REELEVO** | Que se reconozca en el problema: conocimiento que vive en la cabeza de dos personas, formación que depende de quién esté ese día, papeles que nadie actualiza | Ninguno de activación. Enlace a un artículo del blog relacionado con el recurso descargado |
| **2** | D+4 | **Las capacidades** | Cómo lo resuelve: procesos documentados, portal del operario, competencias, mantenimiento. Priorizar el `modulo` del recurso que descargó | Ninguno de activación. Enlace a la página del módulo |
| **3** | D+9 | **La prueba gratuita** | 60 días de prueba, sin tarjeta, y **su cuenta ya está a medio crear** | **«Finaliza la configuración de tu cuenta»** → `/registro?lead=<token>` |

El texto sigue `REELEVO_GUIA_MAESTRA_MENSAJE_Y_VOCABULARIO.md`. Los días de prueba del
correo 3 se leen de `TRIAL_DURATION_DAYS`, **nunca escritos a mano**: el registro ya
tuvo un correo que prometía 14 días cuando la cuenta tenía 60.

### 8.2 Cómo se envían

- **Plantillas en `lib/email-templates.ts`**, como las demás, con una categoría nueva
  `marketing`. Así el asunto y la introducción se editan desde
  `Admin › Gestión de correos`, que ya lo permite con `email_template_overrides`.
- **Cron diario** `app/api/cron/lead-nurturing`, con `assertCronAuthorized` y
  `withCronRun`, como `trial-expiry`, y registrado en `vercel.json`.
  `cron-governance.test.ts` descubre la ruta solo y hace fallar CI si le falta
  cualquiera de los dos.
- En cada pasada: leads con `secuencia_siguiente_en <= ahora`, envía el correo del
  paso, avanza `secuencia_paso` y calcula la siguiente fecha.
- **Todo envío queda en `email_sent_log`**, que es lo que hace `lib/email.ts` al pasar
  `templateName`. Un lead que dice «no me ha llegado nada» se comprueba ahí.

### 8.3 Cuándo se detiene

| Condición | Efecto |
|---|---|
| Completa su cuenta (§9) | Se detiene **en ese momento**. No recibe el correo 3 si ya es cliente |
| Pulsa «darse de baja» | Se detiene y no vuelve a empezar salvo nuevo consentimiento |
| El email ya era de una cuenta activa (`409`) | Nunca empieza |
| El lead se purga (§10.3) | Desaparece con él |
| Estado `descartado` en el admin | Se detiene. Comercial ha decidido que no |

Un lead que descarga otro recurso a mitad de la secuencia **no la reinicia**. Queda
registrada la descarga y la secuencia sigue su curso.

### 8.4 La baja — hay que construirla

**Hoy la app no tiene mecanismo de baja de correos** (verificado: ninguna referencia a
`unsubscribe` ni `List-Unsubscribe` en `lib/` ni `app/api/`). Hasta ahora no hacía
falta, porque todos los correos eran transaccionales. Estos no lo son.

- **Enlace de baja visible** en el pie de los tres correos, con token firmado.
- **Cabeceras `List-Unsubscribe` y `List-Unsubscribe-Post`** (baja en un clic), que
  Gmail y Yahoo exigen a remitentes de correo comercial. `SendEmailParams` de
  `lib/email.ts` **no admite cabeceras hoy**: hay que añadirlo.
- `GET /api/leads/baja?t=…` muestra la confirmación, y el `POST` de la cabecera
  ejecuta la baja sin pantalla.
- La baja **sólo afecta a los correos comerciales**. El lead sigue existiendo y puede
  completar su cuenta.

### 8.5 Remitente

Recomendación: enviar la secuencia desde **un subdominio aparte** del transaccional
(p. ej. `novedades.` frente al dominio que envía confirmaciones y avisos). Si un
correo comercial acumula quejas de spam, no arrastra la entregabilidad de los
correos de confirmación de registro. **[decidir, §12.3]**

---

<a id="9"></a>
## 9. Completar la cuenta

Dos caminos, y **los dos terminan en el mismo sitio** (`PLAN_CRM_LEADS` `T-06` y `T-08`).

### 9.1 Desde el correo — el que se diseña aquí

1. El CTA del correo 3 (o del correo 0) lleva a `/registro?lead=<token>`.
2. El token es **firmado, sólo contiene el `id` del lead**, y caduca a los **30 días**.
   No lleva email ni nombre: la URL no expone datos personales.
3. `/registro` valida el token contra la app y **rellena nombre, email y empresa**. El
   email queda **bloqueado**: es la identidad del lead.
4. La persona sólo añade lo que falta: **CIF y contraseña**. Sector y teléfono, como
   hoy, opcionales.
5. `company-registration` recibe el token junto con el resto y:
   - crea la empresa y el usuario `admin_empresa` como ahora;
   - como el token **sólo se entrega por correo**, abrirlo demuestra que el buzón es
     suyo: el email cuenta como **verificado**, el trial arranca ya y **no hace falta
     el correo de confirmación**. Es un paso menos, y es el premio de haber sido lead;
   - marca el lead `convertido` con su `company_id` y detiene la secuencia;
   - anota el origen en el registro de auditoría.
6. Llega a la app **en el módulo del recurso que descargó** (§9.3).

Token caducado o manipulado: `/registro` se abre vacío, sin error alarmante, y entra
en juego el camino 9.2.

### 9.2 Registro normal con el mismo email

Quien vuelve meses después y se registra sin el enlace. `company-registration`
**busca un lead con ese email antes de crear** y, si lo encuentra, lo enlaza. Como no
ha llegado por el enlace del correo, **sigue haciendo falta la confirmación por email**
(`generateLink`, T-077): conocer el email de un lead no puede ahorrar la prueba de
propiedad.

Sin este paso, esa persona aparecería dos veces en el admin y el lead no constaría
como convertido. Es la tarea que `PLAN_CRM_LEADS` señala como «la que más fácil se
olvida».

### 9.3 Dónde aterriza

El `modulo` del recurso (§4.2) decide la primera pantalla tras el alta. Quien
descargó la plantilla de OT entra en Mantenimiento, no en un panel vacío. Si el lead
tiene varias descargas, manda la más reciente.

---

<a id="10"></a>
## 10. Legal y RGPD

### 10.1 Dos bases jurídicas, dos casillas

| Tratamiento | Base | En el formulario |
|---|---|---|
| Crear la cuenta lead y entregar el archivo | Lo que la persona ha pedido (art. 6.1.b RGPD, medidas precontractuales a petición del interesado) | Aviso informativo, obligatorio de leer |
| Los 3 correos de calentamiento | **Consentimiento** (art. 21 LSSI: correo comercial a quien no es cliente) | Casilla aparte, **opcional**, sin marcar |

Condicionar la descarga al consentimiento comercial haría que ese consentimiento no
fuera libre (art. 7.4 RGPD). Por eso la casilla es opcional (D-4).

### 10.2 Registro del consentimiento

Fecha, versión del texto aceptado e IP truncada según `lib/consent-record.ts`
(`truncarIp`: /24 en IPv4). La baja se registra igual.

### 10.3 Caducidad y supresión

- **Purga:** `gdpr-cleanup` tiene que alcanzar a `marketing_leads` y
  `marketing_lead_descargas`. Hoy **no purga `marketing_leads`**, que ya es un
  incumplimiento (`PLAN_CRM_LEADS` H-5, `T-01`). Leads sin convertir y sin contacto
  en N meses. **[decidir N, §12.4]**
- **Supresión por email**, no por usuario de Auth: un lead no tiene usuario.
- **Privacidad** (`/legal/privacidad/` en la web): qué se crea al descargar, que los
  correos comerciales sólo llegan con consentimiento, cuánto vive el lead y cómo
  borrarlo. **Bloqueante para publicar.**

---

<a id="11"></a>
## 11. Tareas y seguimiento de cumplimiento

### 11.1 Tablero

| Fase | Alcance | Repo | Hechas | % | |
|---|---|---|---:|---:|---|
| **A · El lead de descarga** | Esquema y endpoint | app | 2/2 | **100 %** | ██████████ |
| **B · El botón** | Catálogo, componente, endpoints, suscribir | web | 2/4 | **50 %** | █████░░░░░ |
| **C · Admin** | Leads y Empresas | app | 0/2 | **0 %** | ░░░░░░░░░░ |
| **D · Secuencia** | Baja, plantillas, cron | app | 0/3 | **0 %** | ░░░░░░░░░░ |
| **E · Completar la cuenta** | Token y aterrizaje | app | 0/2 | **0 %** | ░░░░░░░░░░ |
| **F · Publicable** | Legal y prueba completa | web + app | 0/1 | **0 %** | ░░░░░░░░░░ |
| | **TOTAL** | | **4/14** | **29 %** | ███░░░░░░░ |

**Requisitos de `PLAN_CRM_LEADS`** (se siguen en ese documento, aquí sólo se vigila
que estén antes de la tarea que los necesita):

| Tarea | Qué aporta | La necesita | Estado en `PLAN_CRM_LEADS` |
|---|---|---|---|
| `T-01` | Purga de `marketing_leads` en `gdpr-cleanup` | DL-1 | ✅ |
| `T-03` | `marketing_leads` generalizada | DL-1 | ✅ |
| `T-04` | `POST /api/leads/alta` | DL-2, DL-6 | ✅ |
| `T-06` | El registro reconoce leads | DL-12 | ⬜ |
| `T-09` | Filtro por origen en el panel | DL-7 | ⬜ |
| `T-11` | Enlace lead ↔ cuenta | DL-8 | ⬜ |
| `T-13` | Privacidad | DL-14 | ⬜ |
| `T-14` | Gate de aislamiento | DL-8 | ⬜ |

### 11.2 Cómo se cuenta y cómo se cierra una tarea

- Una tarea está **completada** cuando se cumple **todo** su «Hecho cuando». No «casi».
- Al cerrarla, **en el mismo commit** que el código: se cambia su línea de estado a
  `✅ completada`, se rellenan **fecha** y **commit**, y se actualiza el tablero de §11.1.
- Este documento está duplicado en los dos repos: el cierre se copia al otro en el
  mismo día.
- Recuento sacado del documento, no de memoria:

```bash
grep -c "^\*\*Estado:\*\* ⬜" ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md   # pendientes
grep -c "^\*\*Estado:\*\* 🟡" ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md   # en curso
grep -c "^\*\*Estado:\*\* ✅" ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md   # completadas
```

Leyenda: ⬜ pendiente · 🟡 en curso · ✅ completada · ⛔ bloqueada (con el motivo).

---

### Fase A — App: el lead de descarga

#### DL-1 · Extensiones de esquema para el origen `descarga_web`

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-24 · **Commit:** `bf0aff8a` (reelevo-app)
*Cierre:* aplicada junto con `T-03` en `reelevo-app/supabase/migrations/20260924000001_t03_dl1_marketing_leads_generalizar.sql`. Verificado contra la base real el 2026-09-24 (14/14): columnas y backfill, anon sin INSERT ni SELECT, índice único por email normalizado, CHECK de origen, cascada de descargas y FK de sesión con SET NULL.
Desvío sobre la técnica de abajo: `marketing_lead_descargas` queda **sin políticas** (sólo
`service_role`, patrón de `consent_log`), porque el admin lee por rutas de API con
`service_role`. Por eso la prueba de RLS es «anon/authenticated no leen», no «admin_reelevo sí».
**Repo:** app · **Estimación:** ~3 h · **Depende de:** `T-01`, `T-03`

**Técnica**

- Migración nueva `supabase/migrations/<fecha>_marketing_leads_descarga_web.sql`:
  - `ALTER TABLE marketing_leads ADD COLUMN`:
    `consentimiento_texto_version text`,
    `secuencia_paso smallint NOT NULL DEFAULT 0 CHECK (secuencia_paso BETWEEN 0 AND 3)`,
    `secuencia_siguiente_en timestamptz`,
    `baja_comercial_en timestamptz`.
  - `CREATE TABLE marketing_lead_descargas (id bigserial PK, lead_id bigint NOT NULL
    REFERENCES marketing_leads(id) ON DELETE CASCADE, recurso text NOT NULL,
    modulo text, pagina text, descargado_en timestamptz NOT NULL DEFAULT now())`.
  - Índices: `marketing_lead_descargas(lead_id)` y parcial
    `marketing_leads(secuencia_siguiente_en) WHERE secuencia_paso < 3 AND baja_comercial_en IS NULL`
    (lo que lee el cron de DL-11).
  - RLS en `marketing_lead_descargas`: `SELECT` sólo `admin_reelevo`, mismo predicado
    que las políticas vigentes de `marketing_leads`; sin políticas de escritura (sólo
    rol de servicio).
- `ON DELETE CASCADE` hace que la purga de `T-01` arrastre las descargas sin tocar
  `gdpr-cleanup`.
- Regenerar `lib/database.types.ts`.

**Hecho cuando**

- La migración aplica sobre una copia de producción sin errores y es reversible.
- Test de RLS: una sesión `admin_empresa` no lee `marketing_lead_descargas`; una
  `admin_reelevo` sí.
- Test: borrar un lead borra sus descargas.

#### DL-2 · Origen `descarga_web` en `POST /api/leads/alta`

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-24 · **Commit:** `5fbaba42` (reelevo-app)
*Cierre (con `T-04`):* `app/api/leads/alta/route.ts` + `lib/leads/alta.ts`. 29 tests (ruta y regla de consentimiento); prueba de mutación: romper la regla del 409 hace fallar 2. Consultas validadas en solo lectura contra la base real. Límites iniciales: 500 altas nuevas/día y 20/hora por dominio de empresa (buzones públicos exentos del segundo), fail-closed. Ruta añadida al baseline de service-client con justificación (393 → 394). **Para que funcione en producción falta desplegar y configurar `LEADS_ALTA_SECRET` en Vercel** (mismo valor en la web).
Desvíos sobre la técnica de abajo: la lógica pura vive en `lib/leads/alta.ts` (un `route.ts` de Next sólo puede exportar handlers); el `409` cubre también cuentas `inactiva` (registradas sin confirmar); y `logAudit` no guarda el email.
**Repo:** app · **Estimación:** ~4 h · **Depende de:** `T-04`, DL-1

**Técnica**

- En la ruta de `T-04` (`app/api/leads/alta/route.ts`), rama para `origen='descarga_web'`:
  - Validación con Zod v4 del cuerpo de §5; `origen_ref` debe ser un slug
    (`^[a-z0-9-]{1,64}$`).
  - Búsqueda de cuenta activa por email en `profiles`/`companies`: si existe →
    `409` y **ninguna escritura**.
  - Upsert del lead por email normalizado + `origen` (índice único de `T-03`).
  - `INSERT` en `marketing_lead_descargas` en cada llamada.
  - Consentimiento: si llega `true`, se escriben `consentimiento_comercial`,
    su fecha, `consentimiento_texto_version`, y se limpia `baja_comercial_en`;
    si llega `false`, **no se toca** lo guardado.
  - Si queda consentido y `secuencia_paso = 0` sin fecha → `secuencia_siguiente_en = now() + 1 día`.
- Anti-abuso con `createFailureRateLimiter` (`lib/failure-rate-limit.ts`),
  `failClosed: true`: namespace `leads_alta_global` (tope diario) y
  `leads_alta_dominio` (N por dominio y hora). Superado → `429`.
- `logAudit('CREATE' | 'UPDATE', 'marketing_leads', …)` sin `company_id`.

**Hecho cuando**

- `route.test.ts` cubre: creado, actualizado con segunda descarga, `409` **sin
  escritura** (se comprueba que la cuenta no cambia), `422`, `401`, `429`.
- Test: un segundo alta con `consentimiento_comercial:false` no retira el consentimiento.

---

### Fase B — Web: el botón

#### DL-3 · Catálogo de recursos y archivos privados

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-24 · **Commit:** `abb02c5`
*Cierre:* catálogo en `src/data/descargables.ts` con `plantilla-sop` y `plantilla-it` (módulo `procesos`, que existe como `/empresa/procesos` en la app). `scripts/check-descargables.mjs` encadenado en `npm run build` y como `npm run check:descargables`: probado con un id inexistente, un valor calculado y un archivo en `public/`, los tres detectados; ignora comentarios. `npm run build` verificado: 0 `.docx` en la salida estática y los dos dentro de `.vercel/output/functions/_render.func/src/descargables/`.
Desvíos sobre la técnica de abajo: `includeFiles` incluye **la carpeta entera** (`readdirSync`) en vez de una lista, para no desincronizarse del catálogo; el script lee el catálogo como texto porque el Node del build no garantiza importar `.ts`; y además de `.astro` revisa `.md`, `.mdx`, `.html`, `.ts`, `.tsx` y `.js`.
**Repo:** web · **Estimación:** ~2 h · **Depende de:** —

**Técnica**

- `src/data/descargables.ts`: `export const DESCARGABLES = { 'plantilla-ot': { titulo,
  archivo, tipo: 'plantilla' | 'guia', modulo, mime } } as const` y el tipo
  `DescargableId = keyof typeof DESCARGABLES`.
- Archivos en `src/descargables/` (fuera de `public/`). En `astro.config.mjs`, con el
  adaptador `@astrojs/vercel` ya configurado, incluirlos en la función con
  `includeFiles` para que `fs` los encuentre en tiempo de ejecución.
- `scripts/check-descargables.mjs`: recorre `src/**/*.astro`, extrae cada
  `data-descarga="…"` y falla si el id no está en el catálogo o si su archivo no existe.
  Se encadena en `package.json`: `"build": "node scripts/check-descargables.mjs && astro build"`.

**Hecho cuando**

- Un `data-descarga="no-existe"` rompe `npm run build` con un mensaje que nombra la
  página y el id.
- `dist/` no contiene ningún archivo de `src/descargables/` accesible por URL.

#### DL-4 · Componente `<DescargaConCuenta />`

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** web · **Estimación:** ~1 día · **Depende de:** DL-3

**Técnica**

- `src/components/DescargaConCuenta.astro`: un `<dialog>` con el formulario de §4.4 y
  un `<script>` que hace `document.querySelectorAll('[data-descarga]')` e intercepta
  el clic (`preventDefault`) sólo en esos elementos.
- Se importa **en cada página** que tenga botones, no en `BaseLayout.astro`.
- Turnstile con `PUBLIC_TURNSTILE_SITE_KEY`; su script se carga al abrir el diálogo,
  no al cargar la página. Revisar la CSP de `vercel.json` para
  `challenges.cloudflare.com` en `script-src` y `frame-src`.
- Envío con `fetch('/api/descarga', { method: 'POST' })` al mismo origen. Con
  `200`: se lanza la descarga navegando a `/api/descarga/<id>?t=<token>` y se muestra
  «Listo. Tu cuenta está creada» con botón para repetir.
- UTM leídos de la URL de entrada y guardados en `sessionStorage` (con `try/catch`).
- Accesibilidad: foco al primer campo al abrir, `Esc` cierra, errores con
  `aria-describedby`, estado de envío anunciado con `aria-live`.
- Eventos GA4 según `AUDITORIA_EVENTOS_CTA_GA4.md`: `descarga_abrir`,
  `descarga_lead_ok`, `descarga_error`.

**Hecho cuando**

- En una página con dos botones, sólo el marcado abre el formulario.
- Sin JavaScript, el botón marcado lleva a su `href`.
- Se completa con teclado solo; el lector de pantalla anuncia errores y éxito.

#### DL-5 · `POST /api/descarga` y `GET /api/descarga/[recurso]`

**Estado:** ✅ completada · **Completada:** sí · **Fecha:** 2026-09-24 · **Commit:** `45fadde`
*Cierre:* `src/pages/api/descarga/index.ts` (POST) y `src/pages/api/descarga/[recurso].ts` (GET), token en `src/lib/descarga-token.ts`, textos legales y su versión en `src/lib/descarga-consentimiento.ts`. **7 tests del token** (`npm run test:descarga`, runner nativo de Node). **Recorrido de extremo a extremo en local, 20/20**, con `astro dev` y una app simulada: contrato de §5 recibido tal cual por la app, el `.docx` servido byte a byte, 403 sin token / con token de otro recurso / manipulado / caducado, 409 → descarga como cliente, 500 y app caída → 502 sin descarga, 429 propagado, y validación, Turnstile y honeypot sin llegar a llamar a la app. `npm run build` y `tsc` (0 errores en todo el proyecto) en verde.
Desvíos sobre la técnica de abajo: (1) **límite por IP en memoria, best-effort**: la web no tiene Redis; la protección real son Turnstile y los topes compartidos de la app (T-04). (2) **Honeypot → 502** en vez del éxito fingido de `/api/suscribir`: aquí un éxito fingido tendría que entregar el archivo. (3) Timeout con `AbortSignal.timeout`. (4) Los textos del formulario y su versión viven en un módulo propio para que no puedan cambiar por separado.
**Pendiente de comprobar en una preview de Vercel** (dentro de DL-14): que la función lee `src/descargables/` desde `process.cwd()`. El build ya muestra los archivos en `_render.func/src/descargables/`.
**Repo:** web · **Estimación:** ~1 día · **Depende de:** DL-2, DL-3

**Técnica**

- `src/pages/api/descarga.ts` (`prerender = false`), esqueleto de `suscribir.ts`:
  1. `503` si falta `LEADS_ALTA_URL`, `LEADS_ALTA_SECRET`, `DESCARGA_TOKEN_SECRET` o
     `TURNSTILE_SECRET_KEY`.
  2. Honeypot, validación, `recurso` debe existir en `DESCARGABLES`.
  3. Verificación Turnstile contra `siteverify` con la IP del cliente.
  4. Límite por IP (Upstash si está disponible en la web; si no, se documenta aquí
     cuál se usa y por qué).
  5. `fetch(LEADS_ALTA_URL)` con `Authorization: Bearer`, timeout de 8 s con
     `AbortController`.
  6. `200`/`409` → token `base64url(recurso.exp).hmacSHA256` con `exp = now + 600 s`,
     firmado con `node:crypto`. Cualquier otro código → error sin token.
- `src/pages/api/descarga/[recurso].ts`: verifica firma con `timingSafeEqual`,
  caducidad y que el recurso del token coincide con el de la ruta; lee el archivo y
  responde con `Content-Type` del catálogo, `Content-Disposition: attachment` y
  `Cache-Control: private, no-store`. `403` si algo falla.

**Hecho cuando**

- Tests (Vitest en la web, o script de `scripts/`) de: token válido, caducado, de otro
  recurso y con firma alterada.
- Con la app caída, el formulario muestra error y **no** hay descarga.
- `curl` al `GET` sin token devuelve `403`.

#### DL-6 · `/api/suscribir` al endpoint nuevo

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** web · **Estimación:** ~1 h · **Depende de:** `T-04`

**Técnica**

- En `src/pages/api/suscribir.ts`: sustituir `APP_REGISTRO_URL`/`APP_REGISTRO_SECRET`
  por `LEADS_ALTA_URL`/`LEADS_ALTA_SECRET`, y el cuerpo por el contrato de §5 con
  `origen: 'newsletter_modal'` y `consentimiento_comercial: true` (el modal ya lo exige).
- Quitar las variables viejas de Vercel una vez desplegado.

**Hecho cuando**

- Un alta desde el modal crea un lead con `origen='newsletter_modal'` visible en el admin.

---

### Fase C — Admin

#### DL-7 · Columnas de descarga en `Marketing › Leads`

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** app · **Estimación:** ~4 h · **Depende de:** `T-09`, DL-1

**Técnica**

- `GET` de `app/api/admin/marketing/leads/route.ts`: añadir al `select`
  `descargas:marketing_lead_descargas(recurso, descargado_en)` y las columnas de DL-1.
- `components/admin/AdminMarketingLeadsView.tsx` (358 líneas): columnas Recursos,
  Consentimiento (Sí / No / Baja + fecha) y Secuencia (`n/3 · próximo <fecha>` o motivo
  de parada), visibles cuando el filtro de origen incluye `descarga_web`.
- Exportación CSV existente: añadir las mismas columnas.

**Hecho cuando**

- Un lead con dos descargas muestra las dos; uno dado de baja lo muestra con fecha.

#### DL-8 · Leads en el listado de `Empresas` con etiqueta **Lead**

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** app · **Estimación:** ~1 día · **Depende de:** DL-1, `T-11`, `T-14`

**Técnica**

- Migración: `CREATE VIEW admin_empresas_y_leads WITH (security_invoker = true)` =
  `SELECT id::text, name, status, created_at, 'empresa' AS tipo FROM companies
  UNION ALL SELECT 'lead-'||id, empresa, 'lead', created_at, 'lead' FROM marketing_leads
  WHERE company_id IS NULL AND estado <> 'descartado'`.
- `app/admin/empresas/_tabs/ClientesTab.tsx` (564 líneas) hoy lee `companies` directo
  desde el cliente (línea 128) y permite cambiar el estado (línea 217). Cambios:
  - Leer de `admin_empresas_y_leads`.
  - Filas `tipo='lead'`: badge **Lead**, **sin selector de estado** y sin acciones de
    empresa; el clic navega a `/admin/marketing/leads?lead=<id>`.
  - Contadores (líneas 251–252): `lead` con contador propio, fuera de los de empresa.
  - Añadir `lead` a `COMPANY_STATUS_COLORS` sólo para pintar, **no** a
    `COMPANY_STATUS` de `lib/constants.ts`.
- Añadir `admin_empresas_y_leads` a la lista permitida del gate `T-14`: sólo
  `ClientesTab` puede leerla.

**Hecho cuando**

- Un lead sin convertir aparece como **Lead** y su clic abre su ficha de lead.
- Test: el `update` de estado nunca se invoca con un id de lead.
- El gate `T-14` falla si otro fichero lee la vista.

---

### Fase D — Secuencia

#### DL-9 · Baja de correos comerciales

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** app · **Estimación:** ~1 día · **Depende de:** DL-1 · **Bloquea:** DL-11

**Técnica**

- `lib/email.ts`: añadir `headers?: Record<string, string>` a `SendEmailParams` y
  pasarlo a Resend. Test en `lib/email.test.ts`.
- `lib/lead-token.ts`: firma y verificación HMAC (`LEAD_TOKEN_SECRET`) con propósito
  (`baja` | `completar`), id del lead y caducidad; `timingSafeEqual`. Lo reutiliza DL-12.
- `app/api/leads/baja/route.ts`:
  - `GET ?t=` → página de confirmación («Te has dado de baja de los correos comerciales»).
  - `POST ?t=` → baja sin pantalla, para `List-Unsubscribe-Post: List-Unsubscribe=One-Click`.
  - Ambos: `baja_comercial_en = now()`, `secuencia_siguiente_en = null`, auditoría.
- Token de baja **sin caducidad** (una baja tiene que funcionar siempre).
- Añadir la ruta a la lista pública de `proxy.ts` si hace falta.

**Hecho cuando**

- Tests: `GET` y `POST` marcan la baja; token alterado → `400` sin cambios.
- Un correo de prueba recibido en Gmail muestra el enlace «Cancelar suscripción».

#### DL-10 · Las tres plantillas de calentamiento

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** app · **Estimación:** ~1 día · **Depende de:** —

**Técnica**

- `lib/email-templates.ts`: `leadCalentamiento1`, `leadCalentamiento2`,
  `leadCalentamiento3({ nombre, recurso, modulo, completarUrl, trialDays, bajaUrl })`,
  mismo layout que las plantillas de plataforma, con pie de baja.
- `trialDays` se recibe de `TRIAL_DURATION_DAYS` (`lib/billing.ts`); ningún número de
  días escrito a mano.
- Categoría nueva `marketing` en el registro de plantillas de
  `app/api/admin/email-templates/route.ts` y en `CATEGORY_META` de
  `app/admin/email-management/_tabs/EditarTab.tsx`, para editar asunto e intro con
  `email_template_overrides`.
- Textos contra `REELEVO_GUIA_MAESTRA_MENSAJE_Y_VOCABULARIO.md`.

**Hecho cuando**

- Test de plantillas: cada una contiene el enlace de baja; la 3 contiene `completarUrl`
  y los días de `TRIAL_DURATION_DAYS`.
- Las tres aparecen en `Admin › Gestión de correos › Editar` y el envío de prueba funciona.

#### DL-11 · Cron `lead-nurturing`

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** app · **Estimación:** ~1 día · **Depende de:** DL-9, DL-10

**Técnica**

- `app/api/cron/lead-nurturing/route.ts`: `assertCronAuthorized` + `withCronRun('lead-nurturing', …)`,
  igual que `trial-expiry`.
- Selección: `consentimiento_comercial = true AND baja_comercial_en IS NULL AND
  company_id IS NULL AND estado <> 'descartado' AND secuencia_paso < 3 AND
  secuencia_siguiente_en <= now()`, en lotes de 100.
- Por lead: comprobar de nuevo que el email no es de una cuenta activa (pudo
  registrarse por el camino 9.2 sin enlazar) → si lo es, detener.
- Enviar el paso `secuencia_paso + 1` con `sendEmail` (con `await`, no `Silent`,
  para saber si falló) con `templateName` → queda en `email_sent_log`.
- Sólo si el envío fue bien: `secuencia_paso++` y `secuencia_siguiente_en` según §8.1
  (paso 1→2: +3 días; 2→3: +5 días; tras 3: `null`).
- Registro en `vercel.json` (diario). `cron-governance.test.ts` lo vigila solo.

**Hecho cuando**

- `route.test.ts`: envía el paso correcto, no avanza si Resend falla, no envía a
  leads sin consentimiento, dados de baja, convertidos o descartados.
- Un lead de prueba en preproducción recibe los tres correos con los plazos acelerados.

---

### Fase E — Completar la cuenta

#### DL-12 · Token de lead en `/registro`

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** app · **Estimación:** ~1 día · **Depende de:** `T-06`, DL-9 (`lib/lead-token.ts`)

**Técnica**

- `app/api/leads/prellenado/route.ts` `GET ?t=`: verifica token `completar`
  (30 días) y devuelve `{ nombre, email, empresa }`, o `404` si el lead ya está
  convertido o no existe. Rate-limit por IP.
- `components/public/RegistroView.tsx` (847 líneas): si hay `?lead=`, llama al
  prellenado, rellena el formulario, deja el email `readOnly`, y envía `lead_token`
  en el cuerpo. Token inválido → formulario vacío, sin error visible.
- `app/api/company-registration/route.ts`, flujo email/contraseña:
  - Si llega `lead_token` válido **y** `contact_email` coincide con el del lead →
    `emailVerificado: true` en `completeCompanyOnboarding` (trial inmediato) y crear
    el usuario con `email_confirm: true` en vez de `generateLink({ type: 'signup' })`,
    sin enviar `confirmarEmailRegistro`.
  - Si no coinciden → se ignora el token y sigue el flujo normal (T-077).
  - En ambos casos, tras crear la empresa: lead `estado='convertido'`,
    `company_id`, `secuencia_siguiente_en = null`, y `logAudit` con el origen.
  - Comentario en el código explicando por qué aquí sí se da el email por verificado
    (el token sólo viaja por correo), como exige el estilo de T-077.

**Hecho cuando**

- Tests de `company-registration`: con token válido no se envía confirmación y el
  trial queda activo; con token de otro email se exige confirmación; con token
  alterado, flujo normal.
- Un lead convertido deja de recibir la secuencia.

#### DL-13 · Aterrizaje por módulo

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** app + web · **Estimación:** ~3 h · **Depende de:** DL-12

**Técnica**

- El módulo viaja en el lead: la web lo envía en el contrato de §5 y DL-2 lo guarda
  en `marketing_lead_descargas.modulo` (columna creada en DL-1).
- `company-registration` devuelve `redirect_to` según el módulo de la descarga más
  reciente (`mantenimiento` → `/empresa/mantenimiento`, sin módulo →
  `/empresa/dashboard`), con lista cerrada de destinos.
- `RegistroView` navega a `redirect_to` tras el alta.

**Hecho cuando**

- Quien descargó la plantilla de OT entra en Mantenimiento; un módulo desconocido
  lleva al dashboard.

---

### Fase F — Antes de publicar

#### DL-14 · Textos legales y prueba de extremo a extremo

**Estado:** ⬜ pendiente · **Completada:** no · **Fecha:** — · **Commit:** —
**Repo:** web + app · **Estimación:** ~4 h · **Depende de:** todas las anteriores, `T-13` · **Bloquea:** publicar

**Técnica**

- Web: texto del aviso y de la casilla del formulario con su
  `consentimiento_texto_version`; `/legal/privacidad/` con qué se crea, los correos
  sólo con consentimiento, retención y cómo suprimir.
- Prueba en preproducción del recorrido de §3 con un buzón real: descarga, tres
  correos (plazos acelerados), baja desde Gmail, conversión por 9.1 y por 9.2.
- Resultado de la prueba anotado aquí, con fecha.

**Hecho cuando**

- Se cumplen los criterios A-1 a A-8 de §11.3, cada uno comprobado y fechado.

---

### 11.3 Criterios de aceptación

| # | Se cumple cuando | Comprobado | Fecha |
|---|---|---|---|
| **A-1** | Sin respuesta `200`/`409` de la app **no se descarga nada**, ni adivinando la URL | ⬜ | — |
| **A-2** | Un botón sin `data-descarga` en la misma página se comporta como siempre | ⬜ | — |
| **A-3** | Un email de cuenta activa descarga el archivo y **su cuenta no cambia** | ⬜ | — |
| **A-4** | Un lead sin consentimiento **no recibe ningún correo comercial** | ⬜ | — |
| **A-5** | La baja detiene la secuencia en el siguiente envío, y en un clic desde Gmail | ⬜ | — |
| **A-6** | Quien completa la cuenta desde el correo 3 **no pasa por confirmar email** y entra en el módulo de su recurso | ⬜ | — |
| **A-7** | Quien se registra sin enlace con el mismo email **no crea un duplicado** y su lead consta como convertido | ⬜ | — |
| **A-8** | Ninguna métrica, conteo ni correo de producto incluye leads. El gate `T-14` lo comprueba | ⬜ | — |

### 11.4 Registro de cierres

Una línea por tarea cerrada, en orden. Es la historia del proyecto sin tener que
leer el `git log`.

| Fecha | Tarea | Commit | Repo | Nota |
|---|---|---|---|---|
| 2026-09-24 | DL-1 | `bf0aff8a` | app | Migración `20260924000001` aplicada y verificada contra la base real (14/14) |
| 2026-09-24 | DL-2 | `5fbaba42` | app | `POST /api/leads/alta` con 29 tests. Falta desplegar y configurar `LEADS_ALTA_SECRET` |
| 2026-09-24 | DL-3 | `abb02c5` | web | Catálogo, `check-descargables` en el build y archivos empaquetados en la función |
| 2026-09-24 | DL-5 | `45fadde` | web | Endpoints de descarga con token de 10 min. e2e local 20/20. Falta configurar variables y probar en preview |

---

<a id="12"></a>
## 12. Preguntas abiertas

Ninguna bloquea empezar por la Fase A. Todas deben cerrarse antes de DL-14.

1. **¿Correo 0 transaccional?** Un único correo inmediato: «Tu cuenta está creada;
   complétala cuando quieras», con el enlace de §9.1. Sin él, **quien no consiente no
   recibe nunca el enlace** y sólo puede convertir por el camino 9.2. Es un correo
   sobre la cuenta que ha pedido crear, no promoción, pero conviene que legal lo
   confirme. **Propongo incluirlo.**
2. **¿Plazos D+1, D+4, D+9?** Propuesta. El tercero cae a los ~10 días, cuando el
   recurso descargado ya se ha usado o se ha olvidado.
3. **¿Subdominio aparte para el correo comercial?** (§8.5). Necesita DNS y dominio
   verificado en Resend.
4. **¿Cuántos meses vive un lead sin convertir?** `PLAN_CRM_LEADS` §8.2 propone usar el
   mismo criterio que `contact_form_responses` en `gdpr-cleanup`.
5. **¿Qué recursos salen primero?** La guía y la plantilla de OT mencionadas **aún no
   existen como archivo** en la web (no hay ningún PDF, XLSX ni DOCX en el repo).
6. **¿Se pide teléfono?** Hoy no. Cada campo extra baja la conversión del formulario;
   el teléfono se puede pedir al completar la cuenta.
