# Plan de correcciones — Web comercial vs. producto real

> **Propósito:** lista ejecutable de tareas para alinear la web (`reelevo-site`, Astro) con lo que la app **hace hoy**, según `MAPA_FUNCIONAL_PRODUCTO.md`.
>
> **Auditoría:** 2026-08-17 · **Última actualización:** 2026-08-18 · **Estado:** las 5 fases cerradas · **34/35 tareas** · solo queda `A9`, que es una decisión del cliente
>
> Este documento se actualiza **a medida que se implementa**: cada tarea lleva su estado, y los hallazgos que aparecen al ejecutarla se recogen en su apartado de cierre. Si al hacer una tarea se descubre que el diagnóstico era incorrecto, se corrige aquí en vez de dejarlo solo en el código (ver C2).
>
> **Fuentes de verdad usadas (no documentación previa):**
> - `MAPA_FUNCIONAL_PRODUCTO.md` (este repo)
> - `reelevo-app/lib/tier-config.ts` — planes, precios, límites y features
> - `reelevo-app/lib/webhooks.ts` — eventos reales de webhook
>
> Todas las afirmaciones marcadas ✅ VERIFICADO se comprobaron contra el código de la app, no solo contra el mapa.

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Convenciones de trabajo](#2-convenciones-de-trabajo)
3. [Bloque A · Precios y planes (P0 — crítico)](#bloque-a--precios-y-planes-p0--crítico)
4. [Bloque B · Promesas que el producto no cumple (P0)](#bloque-b--promesas-que-el-producto-no-cumple-p0)
5. [Bloque C · Incoherencias internas del sitio (P1)](#bloque-c--incoherencias-internas-del-sitio-p1)
6. [Bloque D · Capacidades reales que la web no cuenta (P2)](#bloque-d--capacidades-reales-que-la-web-no-cuenta-p2)
7. [Bloque E · Higiene técnica y schema (P1)](#bloque-e--higiene-técnica-y-schema-p1)
8. [Secuencia de ejecución](#8-secuencia-de-ejecución)
9. [Ficheros afectados](#9-ficheros-afectados)
10. [Anexo I · Tabla de verdad de planes](#anexo-i--tabla-de-verdad-de-planes)
11. [Anexo II · Eventos de webhook reales](#anexo-ii--eventos-de-webhook-reales)
12. [Anexo III · Reglas de lenguaje](#anexo-iii--reglas-de-lenguaje)
13. [Anexo IV · Cómo re-verificar](#anexo-iv--cómo-re-verificar)

---

## 1. Resumen ejecutivo

| Bloque | Qué resuelve | Tareas | Hechas | Prioridad |
|---|---|---:|---:|---|
| **A** | Precios y planes que no coinciden con el código | 9 | 8 | **P0** |
| **B** | Promesas comerciales que el producto no cumple | 5 | 5 | **P0** |
| **C** | El sitio se contradice a sí mismo | 5 | 5 | P1 |
| **D** | Módulos reales sin presencia comercial | 12 | 12 | P2 |
| **E** | Schema, metadatos y consistencia técnica | 4 | 4 | P1 |
| | **Total** | **35** | **34** | |

### Estado a 2026-08-18

**Las cinco fases están cerradas** y el build pasa. Con eso:

- Ninguna afirmación de la web contradice ya `tier-config.ts` ni `webhooks.ts`.
- `/precios` publica los **cuatro** planes reales (Free · Starter · Pro · Enterprise) con sus límites verificados y el precio anual, y es la **única** URL del sitio con tarjetas de plan.
- Las promesas de offline, webhooks y resultados están acotadas a lo que el producto hace.
- Dos páginas nuevas —**`/oee/`** y **`/seguridad/`**— y bloques nuevos en siete páginas existentes cubren las capacidades que la app tenía y la web no contaba: importación con IA, recalls y trazabilidad de lote, conectores ERP e IoT, detección automática de riesgo de conocimiento, las 32 automatizaciones, multi-planta, multiidioma, control de horas y portal del supervisor.
- `public/llms.txt` regenerado, para que lo que leen los agentes de IA coincida con lo que lee una persona.

**Riesgo original (resuelto):** la web vendía **operarios ilimitados** y un plan **Profesional de 149 €** cuando el producto limita la plantilla (10 / 20 / 100) y el plan cuesta **129 €**. Era el único error que el cliente descubría *después* de pagar.

**Oportunidad original (aprovechada):** el **plan Free** (3 máquinas, 10 operarios, 5 procesos) existía en el producto y no aparecía en ninguna página, pese a que todos los CTA decían "Registrarse gratis". Ya está publicado.

**Lo único pendiente es `A9`,** que no es trabajo de web sino una decisión de producto: si trazabilidad y recalls se capan por plan o quedan abiertos. Mientras no se decida, la web los presenta como capacidad transversal sin atribuirlos a ningún plan — que es lo correcto bajo cualquiera de las dos opciones.

**Sigue abierto, fuera del alcance de las tareas:** no hay ningún commit —todo vive en el working tree— y **ninguna página se ha revisado renderizada** tras los cambios de maquetación de las fases 2 a 5.

### Trabajo posterior al plan (2026-08-18)

Al revisar la cobertura del mapa frente al sitio ya corregido aparecieron huecos que **el bloque D no había inventariado**. Conviene tenerlo presente: cerrar este plan al 100% no equivale a cubrir el mapa entero.

| Hecho | Qué era |
|---|---|
| ☑ `/workflows/` — 17 tipos de nodo | La página mostraba **8** de los 17 y no daba la cifra. Verificado en el código y completado; el número del titular cuadra con las tarjetas |
| ☑ Corrección del mapa | Turnstile (ver más arriba) |

**Huecos del mapa que siguen sin cobertura comercial**, por si se abre un plan posterior:

- **Solicitudes de contenido** (`/empresa/solicitudes`): el operario pide un procedimiento que falta. Buen argumento de adopción, 0 menciones.
- **Base de conocimiento** (`/empresa/knowledge-base`): artículos y documentación operativa. 0 menciones.
- **Gamificación y recompensas**: puntos, badges y premios. Menciones sueltas, sin desarrollo.
- **Detalles del flujo QR**: modos de sesión (estándar · formación · aprendizaje · anónima), campos de captura personalizados, tipos de paso (medición, espera bloqueada, retrabajo), confirmación de lectura de nueva versión.
- **NPS**: marginal comercialmente; se deja fuera a propósito.

### Hallazgos que aparecieron durante la implementación

Tres cosas que la auditoría inicial no podía ver porque solo miró `tier-config.ts` y el copy:

| # | Hallazgo | Dónde quedó recogido |
|---|---|---|
| 1 | **El gating de la API no es el que dicen los flags.** v1 y v2 comparten wrapper y el único gate efectivo es `maxApiCallsMonthly`. Pro sí tiene v2, Power BI y Power Automate | [C2](#-c2--unificar-qué-incluye-pro-en-materia-de-api) y Anexo I |
| 2 | **El service worker no precachea contenido.** Supabase está excluido del caché a propósito; lo que hay es caché oportunista de lo ya visitado | [B1](#-b1--reescribir-la-página-de-modo-offline) |
| 3 | **La calculadora de ROI usaba `1788` = 149 × 12**, el precio antiguo. El `grep` de "149" no podía verlo porque estaba multiplicado | [B4](#-b4--retirar-las-cifras-de-resultado-sin-respaldo) |
| 4 | **`lib/oee.ts` distingue el dato medido del supuesto** (`quality_estimated`, y `null` si falta configuración). Se convirtió en argumento de venta propio | Fase 4 |
| 5 | **Los recalls se acotan por lote, orden, fecha u obra.** No estaba en el mapa y es lo que hace concreto el argumento | Fase 5 |

### Correcciones al `MAPA_FUNCIONAL_PRODUCTO.md`

Una imprecisión real del mapa, ya corregida allí el 2026-08-18:

| Decía el mapa | Dice el código |
|---|---|
| "Cloudflare Turnstile en registro **y login**" | Solo en el registro. Verificado: `app/api/company-registration/route.ts` y `components/public/RegistroView.tsx` son las **únicas** apariciones en `app/` y `components/`; las tres vistas de login (`AdminLoginView`, `EmpresaLoginView`, `OperarioLoginView`) no lo usan |

Además se precisó, sin que fuera un error, la fila de caducidad de certificaciones: el email es diario para todo lo que vence en ≤7 días, y los hitos **7/3/1** corresponden a la emisión del webhook `certification.expiring` (`WEBHOOK_EXPIRY_MILESTONES`).

> ⚠️ **Dos hallazgos que esta revisión dio por buenos y eran falsos.** Se registraron aquí y se comunicaron como correcciones al mapa antes de comprobarlos a fondo:
>
> - *"El mapa dice 8 roles y `COMPANY_ROLES` tiene 7"* — **el mapa era correcto**: dice literalmente "8 roles (7 de empresa + 1 interno de REELEVO)", que es exactamente lo que hay.
> - *"El mapa dice avisos a 7/3/1 días y el cron usa una sola ventana de ≤7"* — **el mapa era correcto**: los hitos 7/3/1 existen, aplicados al webhook.
>
> Ninguno de los dos llegó a la web, porque lo publicado (7 roles vendibles, aviso a 7 días) es cierto en ambos casos. La lección es la misma que con el `1788`: **leer el fichero entero antes de declarar un error**, y con más motivo si la afirmación va a modificar la fuente de verdad de otro equipo.

---

## 2. Convenciones de trabajo

**Estados:** `☐ pendiente` · `◐ en curso` · `☑ hecho` · `⊘ descartado (con motivo)`

> **Cómo leer cada tarea:** el apartado **"Hoy:"** describe el estado en la fecha de auditoría (**2026-08-17**), no el estado actual. En las tareas ya marcadas `☑` ese texto es el registro de lo que había, y lo que se hizo aparece en **"Acción"** o en la nota de cierre.

**Definition of Done por tarea:**
1. El cambio no contradice `tier-config.ts` ni el mapa funcional.
2. Si la tarea toca copy de plan o precio, se comprueba también el JSON-LD de esa página.
3. Si la tarea elimina una afirmación, se busca la misma afirmación en el resto del sitio (`grep`) antes de cerrarla.
4. `npm run build` pasa sin errores.

**Regla de oro:** ninguna afirmación nueva entra en la web si no se puede señalar dónde vive en el código de la app.

---

## Bloque A · Precios y planes (P0 — crítico)

> Estado actual: **tres tablas de precios distintas** en la web, ninguna coincide con `tier-config.ts`.

### ☑ A1 · Publicar el plan Free

**Hoy:** `/precios` empieza en Starter 49 €. No existe mención al plan gratuito en ninguna página.
**Real ✅ VERIFICADO:** `free` existe con `priceMonthly: 0` — 3 máquinas · 10 operarios · 5 procesos · 6 pasos/proceso · 1 admin · 2 GB. Incluye dashboard, gestión de máquinas/operarios/procesos, impresión de QR y flujo QR completo.

**Acción:** añadir cuarta tarjeta "Free · 0 €" como primera columna en `/precios`, con los límites reales y el CTA de registro.

- **Ficheros:**
  - `src/pages/precios.astro` (bloque `<!-- PLANES -->`, ~L127-209)
  - `src/pages/vs-alternativas.astro:337` — hoy dice "49€ - 129€"; al publicar Free pasa a "0€ - 129€"
  - `src/pages/index.astro` (`lowPrice`) y `src/lib/seo.ts` (`lowPrice`) — decidir si el rango del schema arranca en 0 o en 49
- **Aceptación:** la rejilla pasa a 4 columnas; la tarjeta Free lista los 5 límites verificados; ningún CTA "Registrarse gratis" del sitio lleva a una página donde el gratis no exista; el rango de precio es el mismo en las 4 ubicaciones.
- **Esfuerzo:** M

---

### ☑ A2 · Corregir el precio del plan Pro: 149 € → 129 €

**Hoy:** 149 €/mes en tarjeta, en el JSON-LD de `/precios` y en el `SoftwareApplication` de la home.
**Real ✅ VERIFICADO:** `pro.priceMonthly: 129`.

**Acción:** sustituir 149 → 129 en los cuatro sitios.

- **Ficheros:**
  - `src/pages/precios.astro:164` (tarjeta)
  - `src/pages/precios.astro:48` (JSON-LD `Product`)
  - `src/pages/index.astro:66` (JSON-LD `SoftwareApplication`)
  - `src/lib/seo.ts` → `softwareApplicationSchema()`, `highPrice: '149'`
- **Aceptación:** `grep -rn "149" src/` no devuelve ninguna coincidencia de precio. El precio visible y el del schema coinciden (requisito de Google para rich results).
- **Esfuerzo:** S

---

### ☑ A3 · Eliminar la promesa de "operarios ilimitados"

**Hoy:** aparece en cuatro sitios como argumento central de venta.
**Real ✅ VERIFICADO:** `staff` = 10 (Free) · 20 (Starter) · 100 (Pro) · −1 (Enterprise). **Solo Enterprise es ilimitado.**

**Acción:** sustituir la promesa por el argumento verdadero, que sigue siendo bueno: *el precio no escala con el número de personas, pero cada plan define cuánta plantilla puedes dar de alta.*

| Ubicación | Copy actual | Copy propuesto |
|---|---|---|
| `precios.astro:141` | "Operarios ilimitados (sin coste)" | "Hasta 20 operarios dados de alta" |
| `precios.astro:20` (FAQ) | "se paga por empresa, y los operarios son ilimitados" | "Se paga por empresa, no por licencia de usuario. Cada plan incluye un número de operarios dados de alta (20 en Starter, 100 en Pro, sin límite en Enterprise), pero no se factura por cada uno." |
| `por-que-usar-reelevo.astro:200` | "Operarios ilimitados desde 49€/mes" | "Precio por empresa desde 49 €/mes, sin licencia por usuario" |
| `faqs.astro` (bloque "pyme pequeña") | "Da igual si tienes 10 operarios o 100" | "El precio es fijo por empresa; el plan define cuánta plantilla puedes registrar" |

- **Aceptación:** `grep -rniE "operarios ilimitados|usuarios ilimitados" src/` devuelve 0 resultados.
- **Esfuerzo:** S · **Riesgo si no se hace:** reclamación de cliente que ya ha pagado.

---

### ☑ A4 · Eliminar los límites de plantas inventados

**Hoy:** Starter "1 planta / centro de trabajo", Profesional "hasta 3 plantas / centros".
**Real ✅ VERIFICADO:** `tier-config.ts` **no tiene ninguna clave de plantas**. El multi-planta y el comparador (`/empresa/plantas/comparar`) no están capados por plan.

**Acción:** eliminar ambas líneas y la fila "× Múltiples plantas" de Starter. Si se quiere conservar el multi-planta como argumento de plan superior, primero hay que implementar el gating en la app (ver A9).

- **Ficheros:** `src/pages/precios.astro:138`, `:148`, `:168`
- **Aceptación:** ninguna tarjeta de plan menciona un número de plantas.
- **Esfuerzo:** S

---

### ☑ A5 · Corregir los límites de máquinas, procesos y pasos

**Hoy:** Starter "6 procesos por máquina"; Profesional "hasta 20 máquinas".
**Real ✅ VERIFICADO:**
- Starter: 5 máquinas · procesos **ilimitados** · **12 pasos por proceso**
- Pro: **25 máquinas** · procesos ilimitados · **25 pasos por proceso**

El "6" de la web parece un resto del límite de **pasos** del plan Free (6), aplicado por error a los procesos.

**Acción:** reemplazar por los límites reales. El eje limitado son los **pasos por proceso**, no los procesos.

- **Ficheros:** `src/pages/precios.astro:140` (Starter), `:169` (Pro)
- **Aceptación:** los límites de la web se pueden leer uno a uno en `tier-config.ts`.
- **Esfuerzo:** S

---

### ☑ A6 · Dejar de infravender el plan Starter

**Hoy:** Starter marca con "×" productividad avanzada y reporting.
**Real ✅ VERIFICADO:** Starter tiene en `true`: `productivity`, `monitoring`, `analyticsFilters`, `statistics`, `exportCsv`, `maintenance`, `shiftCoverage`, `obras`, `productionPlanning`, `productionValidation`, `staffCertifications`, `bulkImportMachines/Staff`, `usersManagement`, `machineQrPdf`, `emailNotifications`.

**Acción:** añadir a la tarjeta Starter las capacidades que sí incluye — en especial **monitoreo en vivo**, **mantenimiento preventivo**, **cobertura de turnos** y **obras**, que hoy no se atribuyen a ningún plan concreto.

> ⚠️ **Excepción a vigilar:** `scheduledReports` es `false` en Starter aunque `maxScheduledReports: 2`. Manda el flag de feature: **no anunciar reportes programados en Starter.**

- **Ficheros:** `src/pages/precios.astro:137-151`
- **Aceptación:** cada "✓" y cada "×" de Starter se corresponde con su flag en `tier-config.ts`.
- **Esfuerzo:** M

---

### ☑ A7 · Mover "Soporte prioritario" de Profesional a Enterprise

**Hoy:** aparece como incluido en el plan de 149 €.
**Real ✅ VERIFICADO:** `prioritySupport: false` en Pro, `true` solo en Enterprise.

- **Ficheros:** `src/pages/precios.astro:176`
- **Aceptación:** "Soporte prioritario" solo aparece en la tarjeta Enterprise.
- **Esfuerzo:** S

---

### ☑ A8 · Publicar el precio anual

**Hoy:** solo precio mensual. "Facturación mensual · Sin compromiso".
**Real ✅ VERIFICADO:** `priceAnnual`: 490 € (Starter) y 1.290 € (Pro) — equivale a **dos meses gratis**.

**Acción:** añadir conmutador mensual/anual o, como mínimo, la línea "490 €/año (2 meses gratis)" bajo cada precio.

- **Ficheros:** `src/pages/precios.astro:134-135`, `:164-165`
- **Aceptación:** ambos precios anuales visibles; el JSON-LD sigue declarando el mensual como `price`.
- **Esfuerzo:** M

---

### ☐ A9 · Decidir el gating de trazabilidad y recalls antes de venderlo por plan

**Contexto:** el mapa funcional (sección 8) avisa de que **trazabilidad y recalls están controlados solo por rol, no por plan** — hoy son accesibles en cualquier tier.

**Acción — decisión de producto, no de web:**
- **Opción 1:** implementar el gating en `tier-config.ts` y entonces anunciarlos como diferencial de Pro.
- **Opción 2:** dejarlos abiertos y presentarlos como capacidad transversal, sin atribuirlos a un plan.

Mientras no se decida, **la web no debe atribuirlos a ningún plan**. Bloquea parte del Bloque D (D4).

- **Ficheros:** decisión previa; luego `src/pages/precios.astro` y `/obras-trazabilidad/`
- **Esfuerzo:** decisión + S en web

---

## Bloque B · Promesas que el producto no cumple (P0)

### ☑ B1 · Reescribir la página de modo offline

**Hoy:** `/modo-offline/` vende paridad total: *"el operario sigue trabajando exactamente igual"*, *"sin que el operario haga nada"*, y declara cacheados "agenda del día, listas de productos y máquinas, recursos multimedia".
**Real:** offline es **MVP**: flujo QR con contenido cacheado y sincronización diferida (PWA + service worker). **No cubre todos los flujos.**

**Regla del mapa:** vender como *"funciona sin cobertura en el flujo de ejecución"*, **nunca** como *"offline completo"*.

**Acción:**
1. Acotar el alcance en el H1 y en los tres pasos del flujo: el que funciona sin cobertura es **el flujo de ejecución del proceso**.
2. Revisar la lista "Qué queda cacheado" y dejar solo lo que el service worker cachea de verdad (verificar contra el código de la PWA antes de publicar).
3. Añadir una línea honesta de límites — es lo que hace creíble al resto de la página.

- **Ficheros:** `src/pages/modo-offline.astro` (~L120-180), más el H1 y el `description`
- **Aceptación:** ninguna frase afirma paridad completa sin conexión; la lista de contenido cacheado está verificada.
- **Esfuerzo:** M

#### Cierre — qué se encontró al verificar `public/sw.js`

El paso 2 de la acción (verificar el caché real antes de publicar) cambió el mensaje de la página. Lo que hace el service worker:

| Estrategia | Qué cubre |
|---|---|
| CacheFirst | `/_next/static/`, imágenes locales, fuentes de Google |
| NetworkFirst con respaldo en caché | páginas HTML y respuestas **GET** de `/api/*` |
| Precache | **solo** la página `/offline` |
| Background sync | cola de sesiones pendientes, reintento al volver la red |

**Lo decisivo:** el SW **excluye Supabase a propósito** (`// Supabase: siempre red (datos en tiempo real)`). Como el dato de procesos vive en Supabase, **no hay precache de contenido de ningún tipo**: lo que queda disponible sin red es lo que ese dispositivo ya había cargado.

Por tanto la lista que publicaba la web —"SOPs y procesos frecuentes · Agenda del día · Listas de productos y máquinas · Recursos multimedia"— describía un precache deliberado **que no existe**.

**Copy publicado:** "qué sigue disponible sin cobertura" (la app, lo ya abierto, lo ya visto, la cola de registros) + un bloque explícito de **qué no**: un proceso que ese dispositivo no haya abierto nunca necesita conexión la primera vez.

**Alcance real de la tarea:** además de `/modo-offline/`, la misma promesa se repetía en `src/pages/portal-operario.astro` ("Funciona sin conexión") y en `src/pages/documentacion-procesos.astro` ("Disponible offline en máquina", "Offline si no hay wifi"). Corregidas las tres.

---

### ☑ B2 · Corregir la descripción de los webhooks

**Hoy:** `/api-integraciones/` dice *"webhooks en tiempo real"*, *"sin polling, sin consultas periódicas"*.
**Real:** la entrega es por cron **cada 5 minutos**, con reintentos y registro de entregas.

**Acción:** cambiar "en tiempo real" por "entrega cada 5 minutos, con reintentos y log de entregas". Sigue siendo mejor que el polling del cliente, y es cierto.

> ✅ Lo que **sí** es correcto y conviene mantener: la firma **HMAC-SHA256** del payload (verificado en `lib/webhooks.ts`, formato compatible con GitHub/Stripe).

- **Ficheros:** `src/pages/api-integraciones.astro` — líneas **7** (`description`), **14** (FAQ, que además alimenta el `FAQPage` del head), **41** (hero), **97** (H2) y **105-106** (tarjeta Capa 1)
- **Aceptación:** no queda ninguna afirmación de "tiempo real" ni de "sin polling" aplicada a webhooks. Ojo: la línea 14 se emite también como JSON-LD, así que corregirla arregla texto visible y schema a la vez.
- **Esfuerzo:** S

---

### ☑ B3 · Sustituir los eventos de webhook inventados

**Hoy:** la web lista cinco eventos, dos de los cuales **no existen**: "Producción validada" y "Workflow completado".
**Real ✅ VERIFICADO** (`lib/webhooks.ts`): ver [Anexo II](#anexo-ii--eventos-de-webhook-reales). Son 21 eventos reales y ninguno es esos dos.

**Acción:** sustituir por eventos reales de alto valor comercial: `process.completed`, `shift.coverage_risk`, `skill.decay_detected`, `quality.issue_detected`, `certification.expiring`, `piece.generated`. Y decir que son **21 eventos**, que es un argumento mejor que cinco.

- **Ficheros:** `src/pages/api-integraciones.astro:108-112` (los inventados son el **111** y el **112**)
- **Aceptación:** cada etiqueta de evento de la web existe literalmente en `lib/webhooks.ts`.
- **Esfuerzo:** S

---

### ☑ B4 · Retirar las cifras de resultado sin respaldo

**Regla del mapa:** ❌ *"Cifras de clientes, ahorro o ROI medio → no hay datos reales que las respalden"*.

**Hoy:**

| Ubicación | Afirmación |
|---|---|
| `onboarding-software-pymes.astro:184` | "−70%" |
| `onboarding-software-pymes.astro:192-197` | "30-40%" → "70-80% de autonomía desde el primer día" |
| `onboarding-software-pymes.astro:212` | "−80%" horas de tutor |
| `onboarding-software-pymes.astro:218-228` | "Se paga en 1-2 meses" |
| `precios.astro:257` | "Ahorro estimado con REELEVO (~25%)" |
| `precios.astro:263` | "ROI estimado ×5.0" |
| `faqs.astro:379` | "La experiencia con nuestros clientes muestra..." |
| `onboarding-software-pymes.astro:273-296` | "Pymes industriales que usan REELEVO" + badges de sector |

**Acción:**
1. Eliminar las métricas comparativas antes/después de `/onboarding-software-pymes/`.
2. La calculadora de ROI de `/precios` **puede quedarse** si se reetiqueta con claridad como *estimación con hipótesis del usuario*, sin atribuir el ahorro a REELEVO como dato medido. Cambiar "Ahorro estimado con REELEVO (~25%)" por "Escenario con una reducción hipotética del 25%".
3. Reformular la FAQ para que no implique cartera de clientes.
4. Cambiar el titular "Pymes industriales que usan REELEVO" por "Sectores para los que está diseñado".

> El patrón correcto ya existe en el sitio: `/para-quien/*` y `/video-demo/` etiquetan sus casos como *"escenario ilustrativo, no testimonio real"*. Aplicar el mismo criterio en todo el sitio, incluida la historia de `/kaizen/` (los "35 seg por ciclo").

- **Aceptación:** ninguna cifra de resultado se presenta como observada en clientes.
- **Esfuerzo:** M

#### Cierre — qué se publicó

El bloque de `/onboarding-software-pymes/` se titulaba literalmente **"Resultados medidos"** y ninguna de sus cifras estaba medida en ningún cliente. Se sustituyó por cuatro contrastes cualitativos de mecanismo (cómo aprende una incorporación · qué pasa cuando falta el titular · el tiempo del que enseña · qué queda del turno), cerrados con esta nota, que convierte la ausencia de datos en señal de credibilidad en lugar de esconderla:

> *No publicamos porcentajes de mejora ni ROI medio porque todavía no tenemos una base de clientes que los respalde: el día que la tengamos, los publicaremos diciendo de dónde salen.*

La calculadora de `/precios` se mantuvo, reetiquetada: "Escenario con una reducción del 25%", "Relación con el coste anual", y una nota que empieza por *"Esto no es un ahorro medido"*.

#### 🐛 Error de cálculo encontrado al hacer esta tarea

El script de la calculadora usaba `const reelevo = 1788` — es decir **149 × 12**, el precio antiguo del plan Pro. El `grep -rn "149"` de la tarea A2 no podía detectarlo porque el número aparecía ya multiplicado.

Consecuencia: durante todo ese tiempo la página calculó el ROI y el payback contra un coste anual **inflado un 39%** respecto al real (1.290 €). Corregido, y el texto de payback del script actualizado, porque **sobrescribía en el `onload`** el copy que se había suavizado en el HTML.

> **Lección para futuras tareas de precio:** un `grep` del importe no basta. Hay que buscar también sus múltiplos y las constantes derivadas (`* 12`, totales anuales, comparativas).

---

### ☑ B5 · Borrar la tabla de precios obsoleta de /onboarding-software-pymes

**Hoy:** una segunda tabla de precios con **79 €/mes**, "Acceso 1 operario", "Acceso 5 operarios", "Máquinas ilimitadas", "Usuarios ilimitados". **Todos los datos son falsos** y además contradicen `/precios` dentro del mismo sitio.

**Acción:** eliminar el bloque completo y sustituirlo por un enlace a `/precios/`. Una sola página es dueña del precio.

- **Ficheros:** `src/pages/onboarding-software-pymes.astro:294-344` (sección `<!-- PRECIOS -->` completa)
- **Aceptación:** `/precios/` es la única URL del sitio con tarjetas de plan.
- **Esfuerzo:** S

---

## Bloque C · Incoherencias internas del sitio (P1)

### ☑ C1 · Unificar el nombre del plan: "Pro"

`/precios` lo llama **Profesional**; `/api-integraciones` e `/integracion-m365` lo llaman **Pro**; `/onboarding-software-pymes` lo llama **Professional**. En la app se llama **Pro**.

- **Ficheros:** `precios.astro:163`, `api-integraciones.astro:209`, `integracion-m365.astro` (cabecera de su tabla de planes), `onboarding-software-pymes.astro:316` (se elimina con B5)
- **Esfuerzo:** S

---

### ☑ C2 · Unificar qué incluye Pro en materia de API

**Contradicción actual dentro del sitio:**

| Capacidad | `/precios` | `/api-integraciones` | `/integracion-m365` | Código ✅ |
|---|---|---|---|---|
| API keys y webhooks | "○ según alcance", solo Enterprise | Pro ✓ | Pro ✓ | **Pro `true`** |
| Kit Power BI | no aparece | Enterprise only | **Pro ✓** | no está en `tier-config` |
| Power Automate | no aparece | Enterprise only | **Pro ✓** | no está en `tier-config` |
| API v2 completa + docs | no aparece | Enterprise only | — | **Enterprise** (`api`, `apiDocs`) |

> ⚠️ **Corrección sobre la primera lectura de este plan.** El diagnóstico inicial se hizo solo con los flags de `tier-config.ts` y daba por buena la tabla de `/api-integraciones` (API v2 y Power BI como Enterprise). Al abrir el código de las rutas resultó ser al revés: **la tabla correcta era la de `/integracion-m365`.**

**Real ✅ VERIFICADO en el código de las rutas, no solo en los flags:**

1. Los endpoints de **v2 usan el mismo wrapper de autenticación que los de v1** (`withApiV1Auth`, ver `app/api/v2/machines/route.ts`).
2. Ese wrapper **no comprueba** `apiV1Endpoints`, `api` ni `apiDocs`. Lo único que comprueba es `checkApiCallsMonthlyLimit`.
3. Los flags `api` y `apiDocs` no se consumen en ninguna ruta de la API: solo aparecen en `/api/billing/check-feature` y en rutas de debug.
4. El pack de **Power BI** y el conector de **Power Automate** viven bajo `app/api/v2/docs/` — es decir, se abren con la misma clave de API.

**Conclusión:** el gate real de toda la API pública es **`maxApiCallsMonthly`**, que vale `0` en Free y Starter, `10.000` en Pro y `-1` en Enterprise. Por tanto:

| | Free | Starter | Pro | Enterprise |
|---|:---:|:---:|:---:|:---:|
| API REST v1 **y v2** | — | — | ✅ | ✅ |
| Claves de API | — | — | 3 | Ilimitadas |
| Llamadas/mes | — | — | 10.000 | Sin límite |
| Webhooks activos | — | — | 5 | Ilimitados |
| Kit Power BI · Power Automate · Teams | — | — | ✅ | ✅ |

**Acción realizada:** tabla única en las tres páginas, con los límites reales en vez de ticks. Se añadió nota explícita de que Free y Starter no tienen API.

> **Pendiente de decidir:** la fila "Documentación de API dedicada" se dejó como Enterprise porque el flag `apiDocs` existe, aunque **no se aplica en ninguna ruta**. Es la única fila de la tabla que no está respaldada por comportamiento real. O se implementa el gate, o se sube a Pro.

- **Esfuerzo:** M

---

### ☑ C3 · Alinear el CTA "Registrarse gratis" con la existencia del plan Free

Doce páginas usan "Registrarse gratis" mientras `/precios` empieza en 49 €. Depende de **A1**: una vez publicado el plan Free, el CTA pasa a ser cierto. Verificar entonces que el mensaje de apoyo ("Sin tarjeta de crédito") también lo es.

- **Esfuerzo:** S (tras A1)

---

### ☑ C4 · Revisar el copy de plan en /api-integraciones e /integracion-m365 tras A2-A8

Ambas páginas tienen tablas de plan propias que quedarán desincronizadas al corregir `/precios`.

- **Esfuerzo:** S

---

### ☑ C5 · Añadir la nota de alcance a la historia de /kaizen

`kaizen.astro:276-279` presenta "35 seg ahorrados por ciclo · estandarizados en 4 días" como resultado. Es un relato ilustrativo bien construido; solo le falta la etiqueta que ya usan `/para-quien/*`.

- **Esfuerzo:** S

---

## Bloque D · Capacidades reales que la web no cuenta (P2)

> Estas no son errores: son ventas que no se están haciendo. Ordenadas por valor comercial según la sección 14 del mapa.

### ☑ D1 · OEE y analítica de decisión

**Hueco:** **cero páginas de producto mencionan OEE.** Solo aparece en artículos de blog y en `/vs-mes-tradicional`.
**Real:** `/empresa/oee` — Disponibilidad × Rendimiento × Calidad por máquina y planta, con **snapshot diario automático**. Más `/empresa/roi` (tiempo ahorrado, resumen semanal por email) y Lean (TIMWOODS, VSM %VA, takt, señal pull).

**Acción:** ampliar `/control-produccion/` con un bloque de OEE, o crear `/oee-lean/` como página de capacidad. Mensaje del mapa: *"OEE real, ROI medido y análisis Lean sobre datos de ejecución, no sobre estimaciones."*

- **Esfuerzo:** L · **Prioridad dentro del bloque: 1ª**

---

### ☑ D2 · Importación asistida por IA (Word, PDF y vídeo)

**Hueco:** 0 menciones en toda la web.
**Real:** `/empresa/importar` — carga de procesos desde Word, PDF **y vídeo** con asistencia de Claude.

**Por qué importa:** es la respuesta directa a la objeción nº 4 del mapa — *"pasar mis procedimientos costará meses"*. Es probablemente el argumento de conversión más desaprovechado del sitio.

**Acción:** bloque destacado en `/documentacion-procesos/` + mención en `/como-funciona/` + respuesta en `/faqs/`.

- **Esfuerzo:** M · **Prioridad dentro del bloque: 2ª**

---

### ☑ D3 · Seguridad, RGPD y plataforma para IT

**Hueco:** no hay página de seguridad. RLS y RGPD aparecen sueltos en una FAQ.
**Real:** RLS en Postgres, Supabase Auth con guards por rol y API, PIN hasheado con bcrypt, log de auditoría y de accesos, Cloudflare Turnstile, CSP, purga RGPD mensual, exportación y baja, hosting en la UE, Sentry/PostHog/UptimeRobot.

**Por qué importa:** el mapa marca este bloque como *"el que desbloquea ventas a empresas con departamento de IT"*.

**Acción:** crear `/seguridad/` y enlazarla desde el footer y desde `/api-integraciones/`.

- **Esfuerzo:** L · **Prioridad dentro del bloque: 3ª**

---

### ☑ D4 · Trazabilidad de pieza, lote, recalls y cuarentena

**Hueco:** 0 menciones de recall, cuarentena o búsqueda por lote. `/calidad-y-conformidad/` no habla de nada de esto.
**Real:** dashboard de trazabilidad (% cadena completa 30 días, piezas con lote, cuarentena, recalls activos), recalls con severidad **obligatorio · precautorio · informativo**, QR por pieza, **página pública `/pieza/[token]` con PDF descargable**, búsqueda por lote, Pareto de calidad.

**Depende de A9** para poder atribuirlo o no a un plan.

**Acción:** ampliar `/obras-trazabilidad/` y `/calidad-y-conformidad/`. Mensaje del mapa: *"un cliente pregunta por un lote y respondes en un minuto, no en una semana."*

- **Esfuerzo:** L

---

### ☑ D5 · Integraciones reales más allá de Microsoft

**Hueco:** `/api-integraciones/` solo habla de Power BI, Power Automate y Teams. **Cero menciones** de SAP, Holded, Factorial, MachineMetrics, MTConnect o WhatsApp.
**Real:** SAP HR (sync diaria), SAP Production (cada 4 h), Holded, Factorial, MachineMetrics (webhook de telemetría), MTConnect, WhatsApp vía Twilio, Stripe.

> ⚠️ Aviso del mapa: *"antes de anunciar una integración concreta, confirmar que la configuración externa del cliente está completa."* Presentarlas como conectores disponibles, no como plug-and-play universal.

**Acción:** rejilla de integraciones en `/api-integraciones/`, agrupada por tipo (ERP · RRHH · IoT industrial · BI · mensajería).

- **Esfuerzo:** M

---

### ☑ D6 · Gestión del conocimiento: skill decay, riesgo y caducidades

**Hueco:** `/gestion-competencias/` habla de matriz y certificaciones, pero no de la parte automática.
**Real:** skill decay con hitos configurables 60/90/180 días, `/empresa/knowledge-risk` (procesos que dependen de una sola persona, sin revisar o con alta variación), avisos de caducidad de certificación a 7/3/1 días, `/empresa/cobertura-turnos`.

**Acción:** bloque "lo que detecta solo" en `/gestion-competencias/` y en `/cobertura-turnos/`.

- **Esfuerzo:** M

---

### ☑ D7 · Las 32 automatizaciones

**Hueco:** 0 menciones.
**Real:** 32 crons en producción. El mapa lo propone como argumento propio: *"REELEVO no espera a que entres."*

**Acción:** sección en `/como-funciona/` con las 12-15 más comerciales (consolidación de horas, snapshot OEE, órdenes de mantenimiento, riesgo de cobertura, skill decay, caducidades, alertas de anomalías, reportes PDF, insights con IA semanales).

- **Esfuerzo:** M

---

### ☑ D8 · Multi-planta, comparador y rol plant_manager

**Hueco:** 1 mención suelta de "multiplanta" en todo el sitio.
**Real:** `/empresa/plantas`, comparador `/empresa/plantas/comparar`, rol `plant_manager` con alcance de una planta. Responde a la objeción *"tengo varias plantas"*.

- **Esfuerzo:** M

---

### ☑ D9 · Roles y permisos granulares

**Hueco:** 0 menciones.
**Real:** 8 roles con control a nivel de ruta y de API. Argumento del mapa: *"dar acceso a jefes de línea sin exponer facturación, y permisos a la carta a un gestor sin crear un rol nuevo."*

**Acción:** bloque en `/seguridad/` (D3) o en `/software-gestion-pyme-industrial/`.

- **Esfuerzo:** S

---

### ☑ D10 · Multiidioma (es · en · pt)

**Hueco:** el portugués no se menciona **nunca**. El inglés, de pasada.
**Real:** interfaz en 3 idiomas, traducciones por proceso (`/empresa/procesos/[id]/traducciones`) e idioma preferido por operario. Responde a la objeción *"mi plantilla es multinacional"*.

- **Esfuerzo:** S

---

### ☑ D11 · Horas, time tracking y desviaciones

**Hueco:** tratamiento marginal.
**Real:** consolidación diaria de sesiones QR en horas por operario y categoría, con alerta semanal de desviación >10%. Es un argumento fuerte para gerencia y RRHH.

- **Esfuerzo:** M

---

### ☑ D12 · SCIM 2.0 y portal del supervisor

**Hueco:** SCIM 0 menciones; el portal supervisor no tiene página propia pese a ser uno de los 4 portales.
**Real:** SCIM 2.0 (Okta, Azure AD, JumpCloud) en `/empresa/configuracion/scim`; portal supervisor con validación de ejecuciones, bandeja de aprobaciones y seguimiento de rutas.

- **Esfuerzo:** M

---

## Bloque E · Higiene técnica y schema (P1)

### ☑ E1 · Corregir el `AggregateOffer` de la home

`index.astro:41-42` declara `offerCount: "3"` pero solo lista **2** ofertas, y el rango es 49-149.
**Acción:** tras A1 y A2 → `lowPrice: "0"` (o 49 si se prefiere excluir el Free del rango), `highPrice: "129"`, `offerCount` coherente con las ofertas listadas.

- **Esfuerzo:** S

---

### ☑ E2 · Corregir `softwareApplicationSchema()` en seo.ts

`src/lib/seo.ts` propaga `highPrice: '149'` a **todas** las páginas de capacidad que lo importan. Un solo cambio corrige muchas páginas a la vez.

- **Esfuerzo:** S

---

### ☑ E3 · Revisar el `featureList` del schema de la home

Hoy: procedimientos sin cuenta · registro verificable · monitor de turno · competencias · **modo offline**.
**Acción:** dejar "modo offline" acotado (coherente con B1) y añadir las capacidades verificadas que faltan (OEE, trazabilidad por pieza, API y webhooks).

- **Esfuerzo:** S

---

### ☑ E4 · Actualizar `llms-full.txt` y los metadatos de descripción

Tras cerrar los bloques A-D, regenerar la descripción del producto en `src/pages/llms-full.txt.ts` y revisar los `description` de las páginas tocadas, para que lo que leen los modelos coincida con lo que lee una persona.

- **Esfuerzo:** S

---

## 8. Secuencia de ejecución

> **Principio de secuencia:** las tarjetas de plan de `/precios` son **una sola pieza**. Editarlas primero línea a línea y rehacer después la rejilla para meter el plan Free significa tocar el mismo bloque dos veces y perder el primer trabajo. Por eso el saneamiento solo toca **texto dentro de la estructura existente**, y todo lo que altera la estructura de `/precios` va junto en un único trabajo.

### ☑ Fase 1 — Saneamiento: que la web no afirme nada falso (P0) · *cerrada 2026-08-17*

`A3` · `A2`+`E2` · `B5` · `A4` · `A5` · `A7` · `B3` · `B2`

> **Alcance real, mayor que el planificado.** Los `grep` de cierre destaparon tres restos que el plan no contemplaba: la misma promesa de "operarios ilimitados" en **dos artículos de blog** (el plan solo cubría `src/pages/*.astro`), un cuarto rango de precio en `vs-alternativas.astro:337` ("49€ - 149€"), y **85 líneas de CSS muerto** en `onboarding-software-pymes.astro` tras borrar el bloque de precios. Los tres corregidos.

Todo es reemplazo o borrado de texto. **Cero cambios de estructura, cero diseño.** Orden dentro de la fase, por daño potencial:

| # | Tarea | Por qué va aquí |
|---|---|---|
| 1 | **A3** operarios ilimitados | Único error que el cliente descubre **después de pagar** |
| 2 | **A2 + E2** 149 → 129 | Precio falso + schema inválido. `seo.ts` propaga el error a todas las páginas de capacidad: una línea arregla muchas |
| 3 | **B5** tabla de 79 € obsoleta | Borrado completo de bloque |
| 4 | **A4** plantas inventadas | Borrado de 3 líneas |
| 5 | **A5** procesos/máquinas | Reemplazo por límites reales |
| 6 | **A7** soporte prioritario | Mover a Enterprise |
| 7 | **B3** eventos inventados | 2 etiquetas que no existen en el código |
| 8 | **B2** "tiempo real" | 5 ubicaciones, una de ellas alimenta el `FAQPage` |

**Criterio de salida:** ninguna afirmación de la web contradice `tier-config.ts` ni `webhooks.ts`. Los tres `grep` del [Anexo IV](#anexo-iv--cómo-re-verificar) salen limpios.

---

### ☑ Fase 2 — `/precios` como pieza única (P0 + P1) · *cerrada 2026-08-18*

`A1` · `A6` · `A8` · `E1` · luego `C1` · `C2` · `C4` · `C3`

Un solo trabajo sobre la rejilla de planes: **cuatro** tarjetas (Free · Starter · Pro · Enterprise), precio anual y las features de Starter corregidas de una vez. Después, propagar la misma tabla de disponibilidad a `/api-integraciones` e `/integracion-m365`.

**Criterio de salida:** `/precios` es la única URL con tarjetas de plan y refleja los 4 tiers con sus límites verificados. El CTA "Registrarse gratis" ya es cierto. ✅

> **Lo que cambió el diagnóstico:** al verificar el gating de la API resultó que **la tabla correcta era la de `/integracion-m365`**, no la de `/api-integraciones` como daba por supuesto este plan. Ver [C2](#-c2--unificar-qué-incluye-pro-en-materia-de-api).
>
> En CSS: rejilla a 4 columnas con salto intermedio a 2×2 en 1200px, para que las tarjetas no cayeran a ~180px de ancho antes de pasar a columna única.

---

### ☑ Fase 3 — Honestidad de alcance (P0 + P1) · *cerrada 2026-08-18*

`B1` (offline) · `B4` (cifras sin respaldo) · `C5` · `E3`

Independiente de `/precios`: se puede solapar con la Fase 2 si hay dos personas.

**Criterio de salida:** ninguna página afirma paridad offline ni presenta cifras de resultado como observadas. ✅

> Aparecieron dos cosas no previstas: el service worker **no precachea contenido** (ver B1) y la calculadora de ROI calculaba contra el **precio antiguo** (ver B4).

---

### ☑ Fase 4 — Los huecos que más venden (P2) · *cerrada 2026-08-18*

`D2` (importación IA) · `D1` (OEE y Lean) · `D3` (seguridad e IT) · ~~`A9`~~ (decisión pendiente del cliente)

Contenido nuevo. `D2` primero por relación esfuerzo/impacto: responde a la objeción que más frena la compra y no tenía ninguna mención.

**Lo publicado:**

| Tarea | Dónde | Qué se verificó antes de escribir |
|---|---|---|
| **D2** | Bloque en `/documentacion-procesos/#importar`, nota en `/como-funciona/`, FAQ | `import/start` (PDF y DOCX, 10 MB, Claude Sonnet), `video-to-steps` (hasta 15 frames, FFmpeg WASM en el navegador, Claude vision), estado `needs_review` con approve/reject |
| **D1** | Página nueva **`/oee/`** | `lib/oee.ts` (fórmulas de los 3 factores), cron `oee-snapshot`, `lib/lean/waste-types.ts` (los 8 TIMWOODS), `value-stream.ts` (VA/NNVA/NVA), `takt.ts` (semáforo), `roi-weekly-summary` |
| **D3 + D9 + SCIM de D12** | Página nueva **`/seguridad/`** | 81 migraciones con RLS, trigger bcrypt del PIN, `lib/security-headers.ts`, 7 roles de `company-permissions.ts`, cron `gdpr-cleanup`, rutas SCIM, Sentry y PostHog en `package.json` |

**Criterio de salida:** las tres capacidades tienen presencia comercial, enlazadas desde menú, footer y sitemap, y cada afirmación se puede señalar en el código. ✅

> **Una corrección al mapa funcional detectada al verificar D3.** El mapa decía *"Cloudflare Turnstile en registro **y login**"*: Turnstile solo aparece en `app/api/company-registration` y `RegistroView.tsx`, **no en el login**. Corregido en el mapa el 2026-08-18.
>
> Sobre los roles, la web publica **7** porque es la cifra vendible (los roles de empresa). El mapa habla de 8 incluyendo `admin_reelevo`, que es interno: **ambas cifras son correctas en su contexto**, no hay contradicción. *(Una versión anterior de esta nota lo presentaba como error del mapa; no lo era.)*
>
> **Hallazgo comercial en `lib/oee.ts`:** el cálculo marca `quality_estimated` cuando no hay ningún rechazo registrado, y deja disponibilidad y rendimiento en `null` si faltan el tiempo planificado o el ciclo ideal. Es decir, **la app distingue el dato medido del supuesto**. Eso se convirtió en una sección propia de `/oee/` ("REELEVO te dice cuándo el número es una suposición"), porque es un argumento de credibilidad que ninguna herramienta del sector suele dar.

---

### ☑ Fase 5 — Cobertura completa (P2) · *cerrada 2026-08-18*

`D4` · `D5` · `D6` · `D7` · `D8` · `D10` · `D11` · `D12` · `E4` · ~~`A9`~~ (decisión pendiente del cliente)

`D9` y la parte de SCIM de `D12` se cerraron dentro de `/seguridad/` en la Fase 4.

**Lo publicado, todo sobre páginas existentes:**

| Tarea | Dónde | Qué se verificó antes de escribir |
|---|---|---|
| **D4** | Bloque en `/calidad-y-conformidad/#recalls` | `recalls/route.ts`: severidades `informative·precautionary·mandatory` y alcance por `lot_reference·production_order·date_range·obra`; cron `traceability-completeness` |
| **D5** | Rejilla de conectores en `/api-integraciones/` | Carpetas reales de `configuracion/integraciones/` (factorial, holded, machinemetrics, mtconnect, microsoft-365, whatsapp) + crons `sap-hr-sync` y `sap-production-sync` |
| **D6** | Bloque en `/gestion-competencias/` | Crons `skill-decay` (60/90/180), `cert-expiry`, `knowledge-signals`, `shift-coverage-risk` |
| **D7** | Bloque en `/como-funciona/` | Recuento de `app/api/cron/`: **32 crons** reales |
| **D8·D10·D11** | Bloque en `/software-gestion-pyme-industrial/` | `app/empresa/plantas` + `/comparar`, rol `plant_manager`, i18n es·en·pt, cron `hour-deviation-alerts` (>10%) |
| **D12** | Bloque en `/portal-operario/` | `app/supervisor/`: validar, aprobaciones, rutas + `supervisor_inbox` |
| **E4** | `public/llms.txt` | Arrastraba las mismas falsedades ya corregidas en el sitio |

**Criterio de salida:** el bloque D está cubierto y `llms.txt` coincide con la web. ✅

> **Sobre la caducidad de certificaciones.** La web publica "los próximos 7 días", que es exactamente lo que hace el email diario de `cert-expiry`. Los hitos 7/3/1 del mapa también existen, pero aplican al webhook `certification.expiring`. *(Esta nota decía originalmente que el mapa estaba equivocado; era una lectura incompleta del cron — ver el aviso del [resumen ejecutivo](#correcciones-al-mapa_funcional_productomd).)*
>
> **Hallazgo de producto en `recalls/route.ts`:** el alcance de una retirada se acota por lote, orden de producción, rango de fechas u obra. Eso no estaba en el mapa y es el detalle que convierte "tenemos recalls" en un argumento concreto: es lo que evita retirar de más o de menos.
>
> **Nota sobre A9:** D4 se escribió sin atribuir trazabilidad a ningún plan, que es válido decidas lo que decidas. Si finalmente se capa a Pro, basta con añadir una línea de plan al bloque y una fila a `/precios`.

`E4` va al final a propósito: regenerar `llms-full.txt` antes de cerrar el contenido obliga a rehacerlo.

---

## 9. Ficheros afectados

### Ya modificados (fases 1-3)

| Fichero | Tareas |
|---|---|
| `src/pages/precios.astro` | A1-A8, B4, C1, C2 |
| `src/pages/index.astro` | A2, E1, E3 |
| `src/lib/seo.ts` | A2, E2 |
| `src/pages/api-integraciones.astro` | B2, B3, C1, C2, C4 |
| `src/pages/integracion-m365.astro` | C2, C4 |
| `src/pages/onboarding-software-pymes.astro` | B4, B5 |
| `src/pages/modo-offline.astro` | B1 |
| `src/pages/faqs.astro` | A3, B4 |
| `src/pages/por-que-usar-reelevo.astro` | A3 |
| `src/pages/portal-operario.astro` | B1 *(no previsto)* |
| `src/pages/documentacion-procesos.astro` | B1 *(no previsto)* |
| `src/pages/kaizen.astro` | C5 |
| `src/pages/vs-alternativas.astro` | A1, A2 *(no previsto)* |
| `src/pages/sobre-nosotros.astro` | C1 *(no previsto)* |
| `src/pages/blog/crisis-perdida-conocimiento-planta-industrial.astro` | A3 *(no previsto)* |
| `src/pages/blog/que-es-un-sop-industrial.astro` | A3 *(no previsto)* |
| `src/pages/oee.astro` **(nuevo)** | D1 |
| `src/pages/seguridad.astro` **(nuevo)** | D3, D9, D12 parcial |
| `src/pages/documentacion-procesos.astro` | D2 |
| `src/pages/como-funciona.astro` | D2 |
| `src/components/Header.astro` · `Footer.astro` | enlaces de `/oee/` y `/seguridad/` |
| `src/pages/sitemap.xml.ts` · `src/lib/seo.ts` | alta de las dos páginas nuevas y sus etiquetas de breadcrumb |

> Seis ficheros que el plan no había anticipado. Cinco de ellos aparecieron por la regla 3 del DoD —buscar la misma afirmación en el resto del sitio antes de cerrar una tarea—, y **dos están fuera de `src/pages/*.astro`**, que era el alcance que el plan daba por bueno. Al auditar copy, el blog cuenta.

### Pendientes (fases 4-5)

| Fichero | Tareas |
|---|---|
| `src/pages/control-produccion.astro` | D1 |
| `src/pages/documentacion-procesos.astro` | D2 |
| `src/pages/como-funciona.astro` | D2, D7 |
| `src/pages/api-integraciones.astro` | D5 |
| `src/pages/gestion-competencias.astro` | D6 |
| `src/pages/cobertura-turnos.astro` | D6 |
| `src/pages/obras-trazabilidad.astro` | D4 |
| `src/pages/calidad-y-conformidad.astro` | D4 |
| `src/pages/faqs.astro` | D2 |
| `src/pages/software-gestion-pyme-industrial.astro` | D8, D9 |
| `src/pages/seguridad.astro` **(nuevo)** | D3, D9, D12 |
| `src/pages/oee-lean.astro` **(nuevo, opcional)** | D1 |
| `src/components/Header.astro` · `Footer.astro` | enlaces de páginas nuevas (D1, D3) |
| `src/pages/llms-full.txt.ts` | E4 |
| `src/pages/sitemap.xml.ts` | páginas nuevas |

---

## Anexo I · Tabla de verdad de planes

✅ Copiado literalmente de `reelevo-app/lib/tier-config.ts` el 2026-08-17. **Esta tabla manda sobre cualquier copy de la web.**

### Límites

| | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Precio mensual | **0 €** | **49 €** | **129 €** | A medida |
| Precio anual | — | **490 €** | **1.290 €** | A medida |
| Máquinas | 3 | 5 | 25 | Ilimitadas |
| Operarios | 10 | 20 | 100 | Ilimitados |
| Procesos | 5 | Ilimitados | Ilimitados | Ilimitados |
| Pasos por proceso | 6 | 12 | 25 | Ilimitados |
| Usuarios admin | 1 | 1 | 5 | Ilimitados |
| Usuarios supervisor | 0 | 2 | 10 | Ilimitados |
| Obras (piezas) | — | 3 (50) | 20 (500) | Ilimitadas |
| Workflows (pasos) | — | 3 (10) | 20 (50) | Ilimitados |
| Planes de mantenimiento | — | 10 | 50 | Ilimitados |
| API keys · llamadas/mes | — | — | 3 · 10.000 | Ilimitadas |
| Webhooks | — | — | 5 | Ilimitados |
| Kaizen / mes | — | — | 100 | Ilimitados |
| Almacenamiento | 2 GB | 5 GB | 15 GB | Ilimitado |
| **Plantas** | **sin límite en ningún plan** | | | |

### Funcionalidades (flags reales)

| Función | Free | Starter | Pro | Enterprise |
|---|:---:|:---:|:---:|:---:|
| Flujo QR y ejecución | ✅ | ✅ | ✅ | ✅ |
| Dashboard · gestión de máquinas/operarios/procesos | ✅ | ✅ | ✅ | ✅ |
| Impresión de QR de máquina | ✅ | ✅ | ✅ | ✅ |
| Estadísticas · exportación CSV | — | ✅ | ✅ | ✅ |
| Productividad · monitoreo en vivo | — | ✅ | ✅ | ✅ |
| Importación masiva · gestión de usuarios | — | ✅ | ✅ | ✅ |
| Certificaciones de operario | — | ✅ | ✅ | ✅ |
| Planificación y validación de producción · obras | — | ✅ | ✅ | ✅ |
| Mantenimiento preventivo · cobertura de turnos | — | ✅ | ✅ | ✅ |
| Vídeo en procesos · versionado | — | — | ✅ | ✅ |
| Firmas digitales · informes de cumplimiento | — | — | ✅ | ✅ |
| Kaizen · contribuciones de operario | — | — | ✅ | ✅ |
| Lean (TIMWOODS · VSM · takt) | — | — | ✅ | ✅ |
| Time tracking y alertas de horas | — | — | ✅ | ✅ |
| Reportes PDF programados | — | — | ✅ | ✅ |
| API keys · webhooks · endpoints v1 · analítica de uso | — | — | ✅ | ✅ |
| Analítica avanzada · informes personalizados | — | — | ✅ | ✅ |
| **API v2 completa · documentación de API** | — | — | **—** | ✅ |
| **Soporte prioritario** | — | — | **—** | ✅ |
| SSO / SAML · white label | — | — | — | ✅ |

**Trampas conocidas:**
- `scheduledReports` es `false` en Starter pese a `maxScheduledReports: 2`. Manda el flag: **no anunciar en Starter**.
- Trazabilidad y recalls **no tienen gating de plan** (ver A9).
- **Los flags de API mienten sobre el comportamiento real.** `api` y `apiDocs` figuran como Enterprise, pero no se comprueban en ninguna ruta: v1 y v2 comparten `withApiV1Auth` y el único gate efectivo es `maxApiCallsMonthly` (0 en Free y Starter). En la práctica **Pro tiene v2, Power BI y Power Automate**. Ver C2.
- Regla general que se deriva de lo anterior: **para todo lo que sea API, un flag de `tier-config.ts` no basta como fuente** — hay que abrir la ruta y ver qué comprueba.

---

## Anexo II · Eventos de webhook reales

✅ Verificado en `reelevo-app/lib/webhooks.ts`:

```
process.completed          staff.certified                kaizen.item.created
process.failed             staff.certification_revoked    kaizen.item.approved
process.version_created    certification.expiring         kaizen.item.standardized
session.started            skill.decay_detected           kaizen.item.closed
session.abandoned          shift.coverage_risk            kaizen.impact.verified
machine.status_changed     quality.issue_detected         piece.generated
approval.requested         approval.resolved              dataset.refresh_available
```

**No existen:** `production.validated` · `workflow.completed` (ambos anunciados hoy en la web).

**Entrega:** cada 5 minutos, con reintentos y log. Firma **HMAC-SHA256** (`t=timestamp,v1=firma`). Destino HTTP genérico o tarjeta formateada de Microsoft Teams.

---

## Anexo III · Reglas de lenguaje

Del mapa funcional, sección 13 y "Qué NO decir". **Aplicar como checklist antes de publicar cualquier página.**

| ❌ No decir | ✅ Decir |
|---|---|
| "Offline total" | "Funciona sin cobertura en el flujo de ejecución" |
| "Operarios ilimitados" | "Precio por empresa, sin licencia por usuario" |
| "Webhooks en tiempo real" | "Entrega cada 5 minutos con reintentos" |
| "Módulo de seguridad / EHS" | *(no mencionar: existe la API, no la interfaz)* |
| "Verificación de EPI en el flujo QR" | *(no mencionar: no hay pantalla que lo consuma)* |
| "Biblioteca de plantillas de procesos" | *(no existe)* |
| "Sistema de evaluación y recertificación" | "Quiz de validación de conocimiento" |
| Cifras de clientes, ahorro o ROI medio | Escenarios etiquetados como ilustrativos |
| Trazabilidad/recalls como diferencial de Pro | Capacidad transversal, hasta que se decida el gating |

---

## Anexo IV · Cómo re-verificar

Este plan caduca en cuanto cambie el producto. Para revalidarlo:

| Dato | Dónde se comprueba |
|---|---|
| Planes, precios, límites y features | `reelevo-app/lib/tier-config.ts` |
| Eventos de webhook y firma | `reelevo-app/lib/webhooks.ts` |
| Roles y permisos | `reelevo-app/lib/company-permissions.ts` |
| Automatismos | `reelevo-app/app/api/cron/` |
| Pantallas existentes | `find app -name "page.tsx"` |
| Endpoints públicos | `reelevo-app/app/api/v1/`, `app/api/v2/` |

> ⚠️ **No usar `lib/product-truth.ts`**: el propio mapa funcional lo marca como desactualizado (da por `not_started` módulos que ya existen).

**Comandos de comprobación rápida sobre esta web:**

```bash
# Ninguna promesa de ilimitados que el producto no cumpla.
# Excepcion legitima: la tarjeta Enterprise de /precios, donde SI es cierto
# (todos los limites del tier enterprise son -1).
grep -rniE "operarios ilimitados|usuarios ilimitados|máquinas ilimitadas" src/

# Ningún resto del precio incorrecto
grep -rn "149" src/

# Nombre del plan unificado: debe salir "Pro", nunca "Profesional"/"Professional"
grep -rn "plan Profesional\|>Profesional<\|\"Profesional\"" src/

# Una sola página con tarjetas de plan
grep -rln "plan-price\|pricing-card" src/pages/

# Los cuatro planes deben estar los cuatro
grep -oE 'plan-name">[A-Za-z]+' src/pages/precios.astro
```
