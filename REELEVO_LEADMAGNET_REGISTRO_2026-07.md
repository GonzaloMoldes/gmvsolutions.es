# Lead magnet de registro en Reelevo — Modal newsletter + alta de cuenta

> **Fecha:** 2026-07-01
> **Estado:** Código completo y desplegable · **apagado** tras flag (`PUBLIC_NEWSLETTER_MODAL`) hasta tener credenciales y el endpoint de alta de la app.
> **Objetivo:** Captar leads desde la web con un único gesto que (1) suscribe a la newsletter (E-goi, doble opt-in) y (2) crea la cuenta de empresa en la app.
> **Stack:** Astro 6 (web estática → híbrida con `@astrojs/vercel`) + función serverless + E-goi API + endpoint de alta de la app (Supabase).

---

## 0. Qué es y qué NO es

El lead magnet es un **modal de alta combinada**: un popup en la web pública que, con `nombre + empresa + email + consentimiento`, da de alta al visitante en la newsletter **y** dispara la creación de su cuenta de empresa en Reelevo. La "recompensa" del lead magnet no es un PDF descargable: es **empezar a usar el producto** (cuenta creada) + recibir los contenidos del blog.

Lo que **no** es:

- No es un formulario de newsletter "a secas": además crea cuenta.
- No crea el tenant *desde la web*. La web **no** toca Supabase: invoca un endpoint de la app, que es la dueña del alta (Auth + RLS). Reimplementar la creación de empresa en la web sería frágil y peligroso para producción.
- No captura contraseña en la web de marketing (decisión deliberada, ver §7).

---

## 1. Arquitectura y flujo

```
Visitante  ──▶  Modal (nombre, empresa, email, consentimiento RGPD)
                     │  POST /api/suscribir/   (mismo origen → cumple CSP)
                     ▼
            Función serverless en Vercel  (secretos solo en servidor)
                     ├─▶ E-goi REST API: alta en lista con status 'unconfirmed'
                     │       → E-goi envía el correo de DOBLE OPT-IN
                     └─▶ APP_REGISTRO_URL (Bearer secret): crea la empresa
                             → la app envía su correo de activación / magic link
                     ▼
            Modal: "Revisa tu correo para confirmar y activar la cuenta"
```

Por qué así:

- **Mismo origen (`/api/suscribir/`)**: el navegador solo habla con su propio dominio, así que no hay que tocar la CSP (`connect-src 'self'`) ni lidiar con CORS.
- **Secretos en el servidor**: las claves de E-goi y el secreto de la app viven como variables de entorno en Vercel, nunca en el JS del cliente.
- **La app es la dueña del tenant**: la web solo orquesta; la creación de empresa (Supabase Auth + RLS + datos por defecto + correo) la hace la app.

---

## 2. Archivos

| Archivo | Rol |
|---|---|
| [src/components/NewsletterModal.astro](src/components/NewsletterModal.astro) | UI del modal + lógica de cliente (disparadores, validación, fetch, estados). |
| [src/pages/api/suscribir.ts](src/pages/api/suscribir.ts) | Endpoint serverless (`prerender = false`). E-goi + llamada al alta de la app. |
| [astro.config.mjs](astro.config.mjs) | Adaptador `@astrojs/vercel`. El sitio sigue estático salvo las rutas `prerender=false`. |
| [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) | Monta el modal **solo si** `PUBLIC_NEWSLETTER_MODAL === 'on'`. |
| [.env.example](.env.example) | Plantilla de variables de entorno. |

---

## 3. Variables de entorno

Configurar en Vercel → *Project → Settings → Environment Variables* (Production + Preview):

| Variable | Tipo | Para qué |
|---|---|---|
| `PUBLIC_NEWSLETTER_MODAL` | pública | `on` muestra el modal; cualquier otro valor lo oculta (no se renderiza). |
| `EGOI_API_KEY` | secreta | Apikey de la API de E-goi (**no** el ID de Connected Sites del pixel). |
| `EGOI_LIST_ID` | secreta | ID numérico de la lista de newsletter en E-goi. |
| `APP_REGISTRO_URL` | secreta | Endpoint de alta de empresa en la app (lo expone el repo de la app). |
| `APP_REGISTRO_SECRET` | secreta | Secreto compartido (Bearer) para autenticar la llamada anterior. |

Mientras falte cualquiera de las 4 secretas, el endpoint responde `503 not_configured` y el modal muestra un error controlado. **Nada se crea a medias.**

---

## 4. Contrato del endpoint de alta de la app (pendiente en el repo de la app)

Esta es la pieza que **no vive en este repo**. La app (Supabase) debe exponer una ruta server-to-server:

- **Método:** `POST`
- **Auth:** cabecera `Authorization: Bearer <APP_REGISTRO_SECRET>`
- **Body:** `{ "email": string, "nombre": string, "empresa": string, "source": "newsletter_modal" }`
- **Comportamiento esperado:**
  - **Idempotente por email**: si ya existe cuenta, responder `200` o `409` sin duplicar (no es un error para la web).
  - Crear la empresa/tenant en estado **pendiente de activación**.
  - Enviar **su propio** correo de activación / magic link / set-password (la web no maneja credenciales).
  - Aplicar rate limiting (el alta interactiva ya lo tiene).
- **Respuestas:** `2xx` ok · `409` ya existe (ok) · `4xx/5xx` → la web devuelve `account_failed` al modal.

> Hoy `app.gmvsolutions.es/registro` es una **página** interactiva de alta, no una API. Hay que añadir esta ruta (o una Edge Function de Supabase) en el repo de la app.

---

## 5. RGPD y consentimiento

- **Consentimiento explícito**: checkbox obligatorio con enlace a [/legal/privacidad/](src/pages/legal/privacidad.astro). El endpoint rechaza el alta sin `consent: true`.
- **Doble opt-in**: el contacto entra en E-goi como `unconfirmed`; E-goi envía el correo de confirmación. No hay envío hasta que el usuario confirma.
- **Cookiebot** ya gobierna el consentimiento de cookies a nivel de sitio.
- El texto del modal informa de que se enviará un correo para confirmar la suscripción **y** activar la cuenta.

---

## 6. UX del modal

- **Disparadores** (lo que ocurra primero): retardo de 12 s, scroll ≥ 55 % de la página, o exit-intent (ratón sale por arriba).
- **Tope de frecuencia** (`localStorage`):
  - `subscribed` → no se vuelve a mostrar nunca.
  - `dismissed` → no se muestra durante 14 días tras cerrarlo.
- **No compite con el splash de entrada** (se suprime mientras está visible).
- **Accesibilidad**: `role="dialog"`, `aria-modal`, foco atrapado (Tab cíclico), `Esc` cierra, devuelve el foco al cerrar, respeta `prefers-reduced-motion`.
- **Anti-bots**: campo honeypot oculto; si viene relleno, el servidor finge éxito y no hace nada.
- **Diseño**: usa los tokens del sitio (`--orange`, Oswald/DM Mono) para integrarse con la estética existente.

---

## 7. Decisiones de diseño

- **Se piden `nombre + empresa`, no solo email.** Para crear una empresa *real* y no tenants basura, el formulario recoge los datos mínimos del alta. Esto convierte el "popup de newsletter" en un **alta combinada compacta**.
- **No se captura contraseña en la web de marketing.** Es mala práctica manejar credenciales en el sitio estático. El alta se crea pendiente y **la app** envía el correo de activación / set-password. (Si se quisiera capturar contraseña en el modal, habría que revisar este punto.)
- **Apagado por defecto tras flag.** Permite desplegar el código sin exponer un formulario a medias a tráfico real.
- **Fallo parcial explícito.** Si E-goi va bien pero el alta de la app falla, el endpoint devuelve `account_failed` (la newsletter ya quedó registrada). Conviene vigilar estos casos en logs.

---

## 8. Analítica

- `newsletter_modal_view` → `dataLayer` al abrirse el modal.
- `generate_lead` (con `lead_type: 'registro'`, `cta_location: 'newsletter_modal'`) → `dataLayer` al completar el alta con éxito. Encaja con el patrón de eventos CTA ya existente en [BaseLayout.astro](src/layouts/BaseLayout.astro) y con la auditoría [AUDITORIA_EVENTOS_CTA_GA4.md](AUDITORIA_EVENTOS_CTA_GA4.md).

---

## 9. Cómo activarlo (checklist)

- [ ] Crear la lista de newsletter en E-goi y obtener `EGOI_LIST_ID` + `EGOI_API_KEY`.
- [ ] Implementar el endpoint de alta en el repo de la app (ver §4) y generar `APP_REGISTRO_SECRET`.
- [ ] Configurar las 4 variables secretas + `APP_REGISTRO_URL` en Vercel.
- [ ] Probar en Preview: alta correcta, email ya existente (idempotencia), honeypot, sin consentimiento.
- [ ] Verificar que llegan los dos correos (confirmación E-goi + activación de la app).
- [ ] Poner `PUBLIC_NEWSLETTER_MODAL=on` y desplegar.
- [ ] Revisar conversión y `account_failed` en logs los primeros días.

---

## 10. Pendientes / mejoras futuras

- **Endpoint de alta en la app** (bloqueante para la mitad de "crear cuenta"). Sin él, el modal solo suscribe a la newsletter.
- Variante A/B del copy y de los disparadores (retardo vs exit-intent) para optimizar conversión.
- Posible segundo punto de captura inline (no solo popup) en artículos del blog de alto tráfico.
- Considerar rate limiting / captcha en `/api/suscribir` si aparece abuso (hoy: honeypot + validación).
- Si en el futuro el modal llamara a servicios externos desde el navegador, habría que ampliar `connect-src` en [vercel.json](vercel.json) (hoy no hace falta: todo es mismo origen).

---

*Documento creado el 2026-07-01. Actualizar el estado a medida que se configure y active.*
