# Cuentas en estado `lead` — especificación para `reelevo-app`

> **Escrita:** 2026-09-02 · **Repo destino:** `reelevo-app` · **Estado:** no iniciado · **0/9 tareas**
>
> Especifica el escenario en el que un visitante que usa una herramienta gratuita
> de la web deja su email y **queda dado de alta como cuenta de REELEVO sin
> activar**, con un estado nuevo llamado `lead`.
>
> El consumidor de esto es el generador de instrucciones de trabajo
> (`PLAN_GENERADOR_INSTRUCCIONES_2026-09.md`, tarea `G8`), pero el mecanismo debe
> servir para cualquier herramienta de captación futura.

> **⚠️ 2026-09-23 · §2 sustituida.** El modelo A (`companies.estado='lead'`) se
> descarta: `companies.status` ya existe y tiene 103 lecturas en la app, 61 sin filtro
> por estado. El lead vive en `marketing_leads` generalizada y se ve como lead en el
> admin mediante una vista. Ver `ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md` §2 y
> `PLAN_CRM_LEADS_2026-09-02.md` §3 (en `reelevo-app/docs/`). El resto de esta
> espec sigue vigente donde no contradiga a esas dos.

---

## Aviso sobre esta especificación

Está escrita **desde el repositorio de la web**, sin acceso a `reelevo-app`. Lo
que sé de la app viene de lo que la propia web publica y documenta en
`src/pages/seguridad.astro`:

- Next.js con `app/api/…`, Supabase Auth con JWT y comprobación de rol en cada
  ruta y cada endpoint
- Postgres con **RLS activo** (81 migraciones)
- `lib/company-permissions.ts` con **7 roles de empresa**: `admin_empresa`,
  `plant_manager`, `gestor_empresa`, `responsable`, `supervisor`, `tecnico`,
  `operario`
- `lib/tier-config.ts` con los límites de plan
- `app/api/cron/gdpr-cleanup` con purga automática
- **Cloudflare Turnstile** en el registro de empresa
- Registro de auditoría e **histórico de correos enviados**
- Sentry y PostHog

Todo lo que aquí se afirma sobre nombres de tabla, columnas o funciones concretas
está marcado como **[verificar]**. La forma es firme; los identificadores hay que
contrastarlos contra el esquema real antes de escribir la migración.

---

## Índice

1. [Qué problema resuelve](#1)
2. [La decisión de modelo](#2)
3. [El estado `lead`](#3)
4. [Contrato del endpoint](#4)
5. [El ciclo de vida](#5)
6. [Lo que hay que blindar](#6)
7. [Correo](#7)
8. [Tareas](#8)
9. [Preguntas abiertas](#9)

---

<a id="1"></a>
## 1. Qué problema resuelve

Hoy, quien usa una herramienta gratuita de la web y deja su email acaba en una
lista de correo. Si más tarde decide probar REELEVO, **empieza de cero**:
formulario otra vez, cuenta nueva, y una aplicación vacía.

Se pierden dos cosas, y la segunda es la que importa:

1. **El contexto comercial.** El equipo no ve a esa persona en el mismo sitio
   donde ve las cuentas. Está en otro sistema.
2. **El trabajo que la persona ya hizo.** Generó una instrucción de trabajo real,
   de una máquina real de su planta. Ese es el mejor activo de activación que
   vamos a tener nunca, y hoy se tira.

Con el estado `lead`, cuando esa persona entra **su instrucción ya está dentro**.
Cero pantalla vacía.

---

<a id="2"></a>
## 2. La decisión de modelo

Hay dos formas de hacer esto y conviene dejar escrito por qué se elige una.

| | **A · Fila en `companies` con `estado='lead'`** | **B · Tabla `leads` aparte** |
|---|---|---|
| Aparece junto a las cuentas | Sí, que es lo pedido | No, hay que unir dos fuentes |
| Riesgo sobre lo que ya funciona | **Alto**: toda consulta, conteo, métrica y listado con ámbito de empresa pasa a poder ver filas que no son clientes | Bajo: no toca nada existente |
| Promoción a cuenta real | Cambio de estado | Copiar datos y arriesgar duplicados |
| Coste de implantación | Medio, concentrado en el blindaje | Bajo al principio, mayor al promover |

**Se elige A**, que es lo pedido y lo que da la visibilidad que se busca. Pero se
elige **con una condición que no es opcional**, porque es donde está todo el
riesgo:

> **La exclusión de los `lead` se implanta una sola vez, en la política de RLS y
> en una vista, no repartida por las consultas.** Si se deja que cada consulta se
> acuerde de filtrar, alguna se olvidará, y el síntoma será un lead contando como
> cliente en una métrica de negocio o apareciendo en el panel de alguien.

Ver [§6.1](#6).

---

<a id="3"></a>
## 3. El estado `lead`

### 3.1 La columna

En `companies` **[verificar nombre]**, columna `estado` con `CHECK` cerrado:

| Valor | Significado |
|---|---|
| `lead` | Captada por una herramienta. Sin usuario, sin acceso, no es cliente |
| `activa` | Cuenta normal. **Valor por defecto y backfill de todo lo existente** |
| `suspendida` | Reservado, si ya existe algo equivalente se reutiliza **[verificar]** |

La migración debe **backfillear a `activa` todas las filas actuales** y solo
después poner el `NOT NULL`. Una cuenta existente que se quedara en `NULL` o en
`lead` por accidente perdería el acceso: es el peor fallo posible de este cambio
y el que hay que probar primero.

### 3.2 Lo que caracteriza a un `lead`

- **No tiene usuario en Supabase Auth.** No ha puesto contraseña ni ha
  confirmado nada. No puede iniciar sesión porque no hay con qué.
- **Es invisible para RLS.** Como toda política es de la forma «el usuario
  pertenece a esta empresa» y no hay usuario, ninguna sesión la alcanza. Solo la
  llega el rol de servicio, que es exactamente lo que queremos.
- **No consume plan.** No se le asigna tier ni entra en ningún conteo de
  facturación ni de límites.

### 3.3 Datos que guarda

| Campo | Para qué |
|---|---|
| `email` | Identidad del lead. **Único, normalizado a minúsculas** |
| `nombre` | Trato en el correo |
| `empresa_declarada` | Lo que escribió. **No es la razón social verificada**, y por eso se guarda aparte del nombre de empresa real |
| `origen` | `generador_it`, y lo que venga después. Sin esto no se sabe qué herramienta capta |
| `payload` (JSON) | **La instrucción generada.** Es lo que se materializa al activar |
| `consentimiento_comercial` | Booleano + fecha. Separado de la entrega del PDF |
| `utm_*` | Atribución |
| `creado_en`, `ultimo_contacto_en` | Para la caducidad de [§6.3](#6) |

`payload` como JSON y no como proceso real: mientras es un lead **no debe existir
nada en las tablas de negocio**. Materializar al activar, no antes. Si no,
tenemos procesos huérfanos de empresas que no son clientes, y eso ensucia
estadísticas y purgas.

---

<a id="4"></a>
## 4. Contrato del endpoint

Nuevo: `POST /api/leads/alta` **[verificar convención de rutas]**

Mismo esquema de autenticación que el alta de empresa que ya consume
`/api/suscribir` de la web: **servidor-a-servidor con secreto compartido en
`Authorization: Bearer`**. Nunca desde el navegador.

### Petición

```json
{
  "email": "juan@empresa.es",
  "nombre": "Juan",
  "empresa_declarada": "Talleres Ejemplo SL",
  "origen": "generador_it",
  "consentimiento_comercial": false,
  "payload": { "tipo": "instruccion_trabajo", "version": 1, "contenido": { } },
  "utm": { "source": "google", "medium": "organic", "campaign": null }
}
```

### Respuesta

| Código | Cuándo | Qué hace la web |
|---|---|---|
| `200` | Lead creado | Sigue: entrega el PDF |
| `200` | Ya existía como `lead` → **actualiza y añade el payload** | Igual |
| `409` | El email ya es de una cuenta **activa** | **Entrega el PDF igual.** No es un error |
| `422` | Email inválido o falta un campo | Error controlado |
| `401` | Secreto incorrecto | Error controlado, avisar |
| `503` | No configurado | La web responde su propio 503, como ya hace |

### Idempotencia — la regla que evita el desastre

**La clave es el email, nunca el nombre de empresa.** Dos personas de la misma
empresa que usan la herramienta son dos leads distintos, y está bien: son dos
contactos comerciales reales. Intentar deduplicar por nombre de empresa produciría
fusiones incorrectas —*«Talleres Ejemplo»* y *«talleres ejemplo sl»*— y es
irreversible.

El caso `409` importa mucho: **un cliente actual que usa la herramienta gratuita
no puede degradarse a `lead`.** Es la vía más rápida de romper una cuenta que
paga. Un `lead` puede promoverse a `activa`; **`activa` nunca retrocede a
`lead`**, y eso conviene garantizarlo con un trigger, no con disciplina.

---

<a id="5"></a>
## 5. El ciclo de vida

```
   herramienta de la web
            │
            ▼
   POST /api/leads/alta ───────────► companies (estado='lead')
            │                        sin usuario Auth · sin tier
            │                        payload = la instrucción
            ▼
   Resend: entrega del PDF          (transaccional, sin opt-in)
            │
            ▼
   ┌── la persona decide entrar ──────────────────┐
   │                                              │
   ▼                                              ▼
 activa la cuenta                          nunca vuelve
   │                                              │
   ├─ crea usuario Auth (admin_empresa)           ▼
   ├─ estado: lead → activa              purga a los N meses
   ├─ asigna tier                        (gdpr-cleanup)
   └─ materializa el payload
      → su instrucción ya está dentro
```

### La activación

Puede llegar por dos caminos, y **los dos tienen que acabar en el mismo sitio**:

1. Pulsa el enlace del correo de activación.
2. Se registra por su cuenta en la app, meses después, con ese mismo email.

El segundo es el que se olvida y el que da el fallo feo: si el registro normal no
comprueba si ese email ya existe como `lead`, creará una segunda empresa y la
persona **no verá la instrucción que generó**, que era todo el objetivo. El flujo
de registro existente tiene que consultar el estado antes de crear.

En la activación:

- Se crea el usuario en Supabase Auth y se le da **`admin_empresa`**: es quien
  levanta la cuenta.
- `estado` pasa a `activa` y se asigna el tier que corresponda **[verificar cuál:
  depende de la decisión pendiente entre plan Free y los 60 días de Pro,
  `PLAN_GENERADOR_INSTRUCCIONES_2026-09.md` §3.1, tarea `G2`]**.
- Se materializa el `payload` como proceso real.
- Queda anotado en el registro de auditoría.

---

<a id="6"></a>
## 6. Lo que hay que blindar

### 6.1 Que un `lead` no se cuele donde hay clientes

El riesgo principal de la opción A. Tres capas, y las tres:

1. **RLS.** Las políticas de empresa añaden `estado <> 'lead'`. Como los leads no
   tienen usuario, en la práctica ya son inalcanzables por sesión, pero se pone
   explícito para que siga siendo verdad el día que alguien invente un flujo que
   sí les asocie un usuario.
2. **Vista `companies_activas`** con el filtro aplicado, y que **el código de
   producto lea de la vista**, no de la tabla. Los leads se consultan a propósito
   y por su nombre.
3. **Métricas.** Revisar uno a uno los conteos de negocio —altas, cuentas
   activas, informes internos, lo que se mande a PostHog— y decidir en cada uno
   si incluye leads. La respuesta casi siempre es no, pero tiene que ser una
   decisión, no un descuido.

### 6.2 Que el endpoint no sea una puerta para llenar la base de datos

Es una vía nueva para crear filas en `companies` desde fuera. Con el secreto
compartido no es pública, pero **el formulario de la web sí lo es**, y detrás está
esto.

- **Límite por IP y por dominio de email** en la web, antes de llamar.
- **Cloudflare Turnstile**, que ya se usa en el registro de empresa. Si protege
  el alta normal, protege esta.
- Tope diario global con degradación controlada: si se pasa, se entrega el PDF y
  **no** se crea el lead. Se pierde un lead, no se cae el servicio.

### 6.3 RGPD: un lead es dato personal sin contrato

No hay relación contractual. La base jurídica de guardarlo es interés legítimo
para atender lo que ha pedido; la del correo comercial es el consentimiento, y
por eso van separados en [§3.3](#3).

- **Caducidad obligatoria.** Un `lead` que nunca activa **no puede vivir
  indefinidamente**. Extender `app/api/cron/gdpr-cleanup` para purgarlos pasados
  N meses sin contacto. **[decidir N — propongo 12]**
- **Derecho de supresión.** Tiene que alcanzar a los leads, no solo a las cuentas
  activas. Si el circuito actual busca por usuario de Auth, **no los encontrará**,
  porque un lead no tiene usuario. Hay que buscar por email.
- **Información.** La política de privacidad debe decir que dejar el email en una
  herramienta crea una cuenta sin activar. Es exacto y no cuesta nada decirlo;
  descubrirlo por su cuenta sí costaría.

### 6.4 Que no se le trate como cliente por error

Un `lead` no debe recibir nada pensado para cuentas activas: avisos de producto,
correos de ciclo de vida, encuestas, notificaciones de plan. El filtro va **en el
origen de cada envío**, no en la plantilla.

---

<a id="7"></a>
## 7. Correo

**Resend con plantilla propia**, alineada con las de la plataforma. El motivo es
de producto, no técnico: quien recibe el PDF debe ver **el mismo remitente y el
mismo formato** que verá luego dentro de REELEVO. Si el primer correo parece de
otra empresa, el segundo parece spam.

| Correo | Cuándo | Tipo | Necesita opt-in |
|---|---|---|---|
| Entrega del PDF | Al descargar | Transaccional | **No** |
| Activar la cuenta | Con el anterior o justo después | Transaccional | **No** |
| Secuencia comercial | Después | Marketing | **Sí** |

Los dos primeros son el servicio que la persona ha pedido. El tercero es otra
cosa y se trata como otra cosa.

Los envíos deben quedar en el **histórico de correos enviados** que la app ya
tiene, igual que los demás. Un lead que dice que no le llegó el PDF tiene que
poder comprobarse.

---

<a id="8"></a>
## 8. Tareas

**EA1 · Migración del estado**
**Estado:** ⬜ pendiente · **~4 h**
Columna `estado` con `CHECK`, backfill a `activa`, `NOT NULL` después. Trigger que
impide `activa → lead`. Índice por `email` normalizado.

**EA2 · Blindaje**
**Estado:** ⬜ pendiente · **~1 día** · *no separable de EA1*
Políticas RLS con `estado <> 'lead'`, vista `companies_activas`, y repaso de las
consultas de producto para que lean de la vista. [§6.1](#6).

**EA3 · `POST /api/leads/alta`**
**Estado:** ⬜ pendiente · **~1 día**
Contrato de [§4](#4). Secreto compartido, idempotencia por email, `409` sin
degradar cuentas activas, Turnstile.

**EA4 · Correos con Resend**
**Estado:** ⬜ pendiente · **~1 día**
Plantillas de entrega y de activación, alineadas con las de plataforma y
registradas en el histórico de envíos.

**EA5 · Activación**
**Estado:** ⬜ pendiente · **~1 día**
`lead → activa`, usuario Auth con `admin_empresa`, asignación de tier,
materialización del `payload`, entrada de auditoría.

**EA6 · El registro normal reconoce leads**
**Estado:** ⬜ pendiente · **~4 h** · *el que más fácil se olvida*
El alta de empresa existente consulta si el email ya está como `lead` y **reclama
esa fila** en vez de crear otra. Sin esto, quien vuelve meses después pierde su
instrucción y aparece duplicado.

**EA7 · Purga y supresión**
**Estado:** ⬜ pendiente · **~4 h**
`gdpr-cleanup` purga leads sin contacto pasados N meses. El circuito de supresión
busca **por email**, no por usuario de Auth. [§6.3](#6).

**EA8 · Visibilidad comercial**
**Estado:** ⬜ pendiente · **~1 día**
Que los leads se vean donde se ven las cuentas, **etiquetados sin ambigüedad** y
con su origen. Es la razón por la que se eligió la opción A: si no se ve, no
compensa el riesgo asumido.

**EA9 · Privacidad**
**Estado:** ⬜ pendiente · **~2 h** · *bloqueante para publicar*
Política de privacidad: qué se crea al dejar el email, cuánto vive, cómo se borra.
Coordinado con `/legal/privacidad/` de la web.

---

<a id="9"></a>
## 9. Preguntas abiertas

Ninguna bloquea empezar por `EA1`, pero todas deben cerrarse antes de publicar.

1. **¿Qué tier recibe al activar?** Depende de la decisión pendiente entre el plan
   Free y los 60 días de Pro (`PLAN_GENERADOR_INSTRUCCIONES_2026-09.md` §3.1).
2. **¿Cuántos meses vive un lead sin activar?** Propongo 12.
3. **¿Nombre real de la tabla y de la columna de estado?** Puede que ya exista
   algo equivalente en las 81 migraciones. **Mirar antes de crear**: un segundo
   campo de estado paralelo al que ya hubiera sería peor que no hacer nada.
4. **¿Varios leads del mismo dominio de email?** Se guardan por separado —son
   contactos distintos— pero al activar el segundo hay que decidir si se une a la
   empresa del primero o levanta la suya. El documento fuente del generador
   señala justamente ese caso como **señal de compra fuerte** (su disparador 5).
5. **¿Qué pasa si un lead activa con un email distinto del que dejó?** No hay
   forma de enlazarlos automáticamente sin riesgo. Propongo no intentarlo.
