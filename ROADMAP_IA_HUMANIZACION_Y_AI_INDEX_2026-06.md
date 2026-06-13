# Roadmap: Humanizar copy (<10% IA) + Subir AI Index a ~100

**Fecha:** 2026-06-12
**Dominio:** gmvsolutions.es (REELEVO · Astro + Vercel)
**Autor del análisis:** auditoría asistida sobre código real del repo `en-construccion`

> **Estado (2026-06-13):** La **capa máquina está completa** salvo B4 (aparcado): B1 (schema accionable + Organization), B2 (`llms-full.txt` + rutas `.md` + alternate links), B3 (robots.txt bots IA) y B5 (security.txt + entry-splash verificado) ✅. El copy de la home y el site está humanizado (A3/A4) y el blog tiene autoría real (A5/B1). **Pendiente:** historia de fundador en 1ª persona y testimonios reales (A5, bloqueado por fase inicial) + verificación externa (Sprint 3 #11: Originality/GPTZero, Rich Results, recrawl BuiltWith) + B4 (cuando el site venda).

---

## Contexto y objetivos

Origen: el perfil de [BuiltWith](https://builtwith.com/gmvsolutions.es) marca dos cosas que queremos mejorar:

1. **"AI Generated Copy" ≥ 40%** — BuiltWith estima que ≥40% del copy parece generado por IA.
   - **Objetivo:** bajarlo a **< 10%** humanizando la prosa.
2. **AI Index 58/100 (Moderate)** con dos sub-scores bajos:
   - AI Openness **100** ✅ (llms.txt + crawlable)
   - AI Visibility **80**
   - **AI Maturity 25** ⬅️ *lever principal (asistente IA) **aparcado** — ver B4; se mantendrá ≈25 por ahora*
   - **Agent Readiness 25** ⬅️ a subir
   - **Objetivo:** AI Index lo más alto posible. **~100 queda fuera de alcance mientras B4 esté aparcado** (Maturity no sube sin IA on-site); **objetivo realista ahora: 75-85**, vía Agent Readiness + Visibility.

> **Reframe clave:** las dos metas **NO chocan**. Son capas distintas:
> - El **% de copy IA** se evalúa sobre el **texto visible** (prosa). Se baja escribiendo más humano.
> - El **AI Index** evalúa la **capa máquina** (schema, llms.txt, tech IA detectable, robots). Se sube haciendo el site *más* legible por máquinas.
>
> Prosa más humana **+** infraestructura máquina más rica. Sin contradicción.

---

## 0. Cómo se mide cada cosa (para no trabajar a ciegas)

### Qué mueve cada sub-score del AI Index

| Sub-score | Hoy | Qué lo mueve |
|---|---|---|
| AI Openness | 100 ✅ | llms.txt + crawlable. Ya está. |
| AI Visibility | 80 | Citas/menciones en motores IA → permitir bots IA + FAQ + autoría real. |
| **AI Maturity** | **25** | **Tech IA detectable on-site.** Hoy solo ven un "OpenAI custom GPT" externo → asistente IA propio + búsqueda semántica. |
| **Agent Readiness** | **25** | **Schema accionable (`potentialAction`), API/feed, bots IA permitidos, `.md`/llms-full.** El schema actual describe pero no deja *actuar* a un agente. |

### Hallazgo importante del repo
El schema **ya es bueno**: hay `FAQPage`, `HowTo`, `Article`/`BlogPosting`, `VideoObject`, `Product`, `AggregateRating`. Por tanto Agent Readiness = 25 **no es falta de schema descriptivo**, sino:
- Falta de schema **accionable** (`potentialAction`).
- Falta de **tech IA detectable** on-site.
- Bots de IA **no mencionados** en robots.txt.

### Cómo verificar el progreso
- **Copy IA:** pasar las 10 URLs de más texto por **Originality.ai / GPTZero / Copyleaks** antes y después. Objetivo medio < 10%.
- **Schema:** **validator.schema.org** + **Rich Results Test** de Google.
- **BuiltWith:** recrawlea cada pocos días (perfil dice "Last detected Jun 10, 2026"). Re-mirar AI Index ~1-2 semanas tras desplegar.

---

## PARTE A — Bajar el copy IA a < 10% (capa prosa)

### A1. Los "tells" de IA detectados en el código

En `src/pages/index.astro` (líneas ~283-309), las *visual-proof cards* concentran los patrones que dispara un detector:

- **"demuestra que" ×3** (`La vista de trabajo demuestra que…`, `El panel de empresa demuestra que…`) → arranque simétrico de tarjeta = firma de plantilla generada.
- **Tricolon / regla de tres** por todas partes: *"menos búsqueda, menos llamadas y menos dependencia"*, *"reorganizar, detectar bloqueos y actuar"*, *"formación, continuidad y revisión interna"*. **Huella nº1** de texto LLM.
- **Comparativos-muletilla**: *"una lectura más clara"*, *"una foto más real"*, *"con más hechos"* — hedging vago repetido.
- **Em-dash decorativo** en exceso.
- **Construcción "no se queda en X: Y"** (index.astro:306).

**Lo que SÍ suena humano** y hay que replicar: el bloque *"Javi está de baja… ¿Quién arranca la llenadora?"* (index.astro:87-103). Nombre propio, hora concreta (6:30), detalle real (15 años, urgencias). Eso puntúa como humano.

### A2. Playbook de reescritura (aplicar a toda página antes de publicar)

**Lista negra (borrar/sustituir):**
`soluciones`, `potenciar`, `optimizar`, `impulsar`, `robusto`, `integral`, `escalable`, `intuitivo`, `de manera eficiente`, `permite`, `gracias a`, `demuestra que`, `no solo… sino también`, `no se queda en…`, `en el mundo actual / hoy en día`, `cabe destacar / es importante señalar`, `lectura más clara / foto más real`, y cualquier **tricolon**.

**Reglas de "burstiness" (variación = humano):**
1. Mezclar frases de **3 palabras** con frases de **25+**. Nunca tres frases seguidas de longitud parecida.
2. Empezar alguna frase con **Y / Pero / Porque**.
3. **Un dato concreto o nombre propio por bloque** (hora, cifra, máquina, sector, ciudad).
4. Una **opinión** o frase directa por sección ("Te lo digo claro:", "La verdad…").
5. Romper los pares paralelos: si dos tarjetas empiezan igual, reescribir una.

### A3. Reescrituras concretas (before → after) de la home

**Hero sub** (index.astro:47-49):
- ❌ *"Estandariza lo que hoy depende de dos o tres personas clave y toma decisiones de turno con una lectura más clara de lo que está pasando en planta."*
- ✅ *"Tu planta depende de dos o tres personas. Si una falta un martes a las seis, lo notas en la línea. REELEVO pone lo que saben en el puesto, para que el turno siga sin ellas."*

**Visual-proof card 1** (index.astro:287-290):
- ❌ *"La vista de trabajo demuestra que el proceso aparece donde hace falta, con menos búsqueda, menos llamadas y menos dependencia del titular."*
- ✅ *"El sustituto abre el puesto y el proceso ya está ahí. No llama a nadie. No espera a que Javi conteste el móvil desde casa. Arranca."*

**Visual-proof card 2** (index.astro:295-299):
- ❌ *"La vista de producción convierte la actividad del turno en una lectura más clara para reorganizar, detectar bloqueos y actuar antes."*
- ✅ *"Producción ve el turno mientras pasa, no en la reunión del día siguiente. Si la línea 3 se atasca, te enteras cuando todavía puedes mover a alguien."*

**Visual-proof card 3** (index.astro:305-308):
- ❌ *"El panel de empresa demuestra que REELEVO no se queda en consultar: ayuda a sostener formación, continuidad y revisión interna con más hechos."*
- ✅ *"Cada proceso ejecutado deja rastro: quién lo hizo, cuándo y cuánto tardó. Cuando llega la auditoría de calidad —o se jubila el de toda la vida— no empiezas de cero."*

Mismo tratamiento para los 4 *benefit-card* (index.astro:335-369): quitar los tricolons.

### A4. El multiplicador: humanizar componentes y páginas plantilla

El 40% sitewide viene de que ~70 páginas comparten la misma cadencia. Prioridad por volumen de texto e impacto:

1. **Componentes repetidos** (la cadencia se replica en cada página): tarjetas tipo *visual-proof*, *benefit*, *vs-*.
2. **Páginas plantilla de alto texto**: `vs-*` (×7), `para-quien/*` (×4), `casos-de-uso/*` (×4), landings (`onboarding-software-pymes`, `gestion-competencias`, `documentacion-procesos`).
3. **Blog** (×17) — mayor volumen de palabras y mayor riesgo.

### A5. Inyectar señal humana real (lo que más baja el %)

Esto no es "reescribir", es **añadir texto demostrablemente humano** que diluye el agregado:

- **Testimonios reales** con nombre + cargo + empresa + sector (aunque sean 1-2). Doble win: humaniza **y** habilita `Review`/`AggregateRating` legítimo.
- **Autoría real en el blog.** Hoy `ArticleLayout.astro:40` pone *"Contenido editorial de GMV Solutions"* — genérico, sin `Person`, sin byline. Cambiar por **autor real (Gonzalo Moldes), foto, mini-bio y `Person` schema con `sameAs` LinkedIn**. (También sube Agent Readiness, ver B1.)
- **Historia de fundador en primera persona** en `/sobre-nosotros` — por qué nació REELEVO, una planta concreta. La 1ª persona con detalle marca humano casi siempre.
- **Más anécdotas verbatim** estilo "Javi" en `casos-de-uso/*`.

---

## PARTE B — Subir AI Maturity + Agent Readiness a ~100 (capa máquina)

### B1. Schema **accionable** — el mayor salto de Agent Readiness

El schema describe pero no deja *actuar*. Añadir `potentialAction` y enriquecer el `SoftwareApplication` en `index.astro:17-33`:

```jsonc
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://gmvsolutions.es/#software",
  "name": "REELEVO",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, Android, iOS",
  "inLanguage": "es-ES",
  "publisher": { "@id": "https://gmvsolutions.es/#organization" },
  "featureList": [
    "Procedimientos en el puesto sin cuenta de operario",
    "Registro verificable de ejecución",
    "Monitor de actividad de turno",
    "Gestión de competencias",
    "Modo offline"
  ],
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "49", "highPrice": "149", "offerCount": "3",
    "offers": [
      { "@type": "Offer", "name": "Starter", "price": "49", "priceCurrency": "EUR",
        "priceSpecification": { "@type": "UnitPriceSpecification",
          "price": "49", "priceCurrency": "EUR",
          "billingIncrement": "1", "unitText": "MES / EMPRESA" },
        "url": "https://app.gmvsolutions.es/registro" }
      /* …Profesional 149, Enterprise… */
    ]
  },
  "potentialAction": [
    { "@type": "RegisterAction", "name": "Registrarse en REELEVO",
      "target": "https://app.gmvsolutions.es/registro" },
    { "@type": "AssessAction", "name": "Diagnóstico de riesgo operativo",
      "target": "https://diagnostico.gmvsolutions.es" }
  ]
}
```

En la **Organization** (`seo.ts:10-44`) añadir `founder` (Person), `contactPoint` y arreglar un bug detectado:

> ⚠️ **`sameAs` inconsistente:** `seo.ts:43` pone `linkedin.com/company/gmvsolutions`, pero `llms.txt` dice `linkedin.com/company/reelevo`. Un agente que cruce ambos pierde la pista de la entidad. **Unificar al real.**

```jsonc
"founder": { "@type": "Person", "name": "Gonzalo Moldes",
             "jobTitle": "Fundador", "url": "https://www.linkedin.com/in/…" },
"contactPoint": { "@type": "ContactPoint", "email": "hola@gmvsolutions.es",
  "contactType": "sales", "areaServed": "ES", "availableLanguage": "es" }
```

**Otros arreglos de consistencia (ayudan a agentes):**
- Unificar blog a **`BlogPosting`** (hoy mezcla `Article` ×11 y `BlogPosting` ×2).
- Añadir `author` (Person) y `dateModified` al schema de cada artículo desde `ArticleLayout`.
- ⚠️ El `AggregateRating` de `onboarding-software-pymes.astro:21` **debe** estar respaldado por reseñas reales o Google puede penalizar. Verificar.

### B2. Capa de contenido para agentes (llms-full + markdown) ✅ HECHO (2026-06-13)

- [x] **Actualizar `llms.txt`**: fecha a `2026-06-12`, páginas nuevas añadidas y sección `## Acciones` con URLs de registro y diagnóstico. Además, nueva sección `## Formatos para agentes` que anuncia `/llms-full.txt` y la convención `.md`.
- [x] **Crear `/llms-full.txt`**: endpoint `src/pages/llms-full.txt.ts` — volcado de una sola petición = resumen de `llms.txt` + contenido completo de los 15 posts del blog en markdown (~100 KB).
- [x] **Versiones `.md` de las páginas**: endpoint `src/pages/blog/[slug].md.ts` sirve cada post como `/blog/<slug>.md` (texto limpio). Conversor propio sin dependencias en `src/lib/htmlToMarkdown.ts` (encabezados, listas, tablas, enlaces absolutos; quita nav/`<style>`/`<script>`/`<svg>`). `ArticleLayout` emite `<link rel="alternate" type="text/markdown">` en cada post. Verificado en build: 15 `.md` sin tags HTML residuales.

### B3. robots.txt — bienvenida explícita a bots de IA

`public/robots.txt` nombra a Google/Bing/Ahrefs pero **no menciona ningún bot de IA**. Permitirlos explícitamente sube Visibility + Readiness:

```
# Motores y agentes de IA — acceso permitido
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
```
(Bytespider/scrapers abusivos se pueden seguir bloqueando.)

### B4. AI Maturity — una feature de IA **real on-site** ⛔ NO AHORA · FUTURO

> **Decisión (2026-06-12): aparcado.** No tiene sentido aún en un site que todavía **no está vendiendo**. Un asistente IA solo justifica su coste/mantenimiento cuando hay tráfico y demanda que atender. **Revisar más adelante**, cuando el site genere conversión real.
>
> **Trade-off asumido:** sin esta pieza, la **AI Maturity seguirá baja** (≈25) y el AI Index probablemente **se quedará por debajo de 100** aunque se complete todo lo demás. Se prioriza Agent Readiness + Visibility (Partes A, B1-B3, B5), que no dependen de esto.

Cuando se retome (referencia para el futuro):

- **Asistente "Pregúntale a REELEVO"**: widget de chat alimentado por un LLM con `llms.txt`/contenido como contexto (RAG). Resuelve dudas de planta, recomienda página, capta lead. IA real, detectable, y AEO puro.
- **Búsqueda semántica** sobre blog/recursos (embeddings) en vez de búsqueda por palabra.
- **Modelo:** para asistente web, **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`) da buen coste/latencia; **Opus 4.8** (`claude-opus-4-8`) si se prioriza calidad. Integración vía API de Anthropic.

### B5. Extras de readiness ✅ HECHO (2026-06-13)

- [x] **`/.well-known/security.txt`** creado (RFC 9116: `Contact`, `Expires` 2027-06-13, `Preferred-Languages`, `Canonical`). Verificado que se copia a `dist/.well-known/security.txt` en build.
- [x] **Entry-splash sin JS — verificado, sin cambios.** El HTML estático es `<html lang="es">` sin clases de splash; `entry-splash-booting`/`show-entry-splash` las gestiona solo el JS inline. Por CSS por defecto `.site-shell` está visible y `.entry-splash` oculto. Confirmado en el HTML construido: el contenido está en el DOM **y visible** sin JS. Progressive-enhancement correcto.

---

## PARTE C — Plan por sprints

### Sprint 1 (rápido, alto impacto — 1-2 días)
1. Schema accionable: `potentialAction` + `AggregateOffer` + `featureList` (B1).
2. Arreglar `sameAs` + añadir `founder`/`contactPoint` (B1).
3. robots.txt bots de IA (B3).
4. Actualizar `llms.txt` (fecha + páginas + acciones) (B2).
5. Reescribir los 7 bloques peores de la home (A3).

→ *Mueve Agent Readiness ya y limpia la home.*

### Sprint 2 (la base del % de copy — 3-5 días)
6. Humanizar componentes repetidos + páginas `vs-*` / `para-quien/*` / landings (A4).
7. Autoría real + `Person` en `ArticleLayout` + unificar `BlogPosting` (A5 + B1).
8. 1-2 testimonios reales con `Review` schema (A5).

→ *Aquí es donde el 40% baja de verdad.*

### Sprint 3 (maduración — según recursos)
9. ~~Asistente IA on-site + búsqueda semántica (B4)~~ → **⛔ aparcado, no ahora** (ver B4). Retomar cuando el site venda.
10. ✅ **HECHO (2026-06-13)** — `llms-full.txt` + rutas `.md` + `.well-known/security.txt` (B2, B5).
11. Re-test (Originality/GPTZero en 10 URLs) + revalidar schema + esperar recrawl de BuiltWith. ⬅️ *pendiente (verificación externa)*

---

## Criterios de éxito

- [ ] Copy IA medio **< 10%** en las 10 URLs de más texto (medido con Originality/GPTZero/Copyleaks).
- [ ] **Rich Results válido** para FAQ / HowTo / Product / Video (Rich Results Test).
- [x] `sameAs` y entidad LinkedIn **unificados** (`seo.ts` → `company/reelevo`; sin la inconsistencia gmvsolutions vs reelevo).
- [x] Blog unificado a `BlogPosting` con `author` Person real (Gonzalo Moldes, centralizado en `ArticleLayout`).
- [x] robots.txt permite explícitamente bots de IA reputados (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended…).
- [ ] **Agent Readiness y Visibility al alza** tras recrawl de BuiltWith. (AI Index ~100 **no es alcanzable** mientras B4 esté aparcado, porque Maturity se queda en ≈25; objetivo realista hoy: **AI Index 75-85**.)

---

## Anexo — Hallazgos de la verificación en vivo (2026-06-12)

Contraste BuiltWith vs producción real (algunos datos de BuiltWith eran erróneos/históricos):

| Señal | BuiltWith decía | Realidad en producción |
|---|---|---|
| Hosting | Portugal + Cogeco Peer 1 | **Vercel** (IPs 216.198.79.x, `X-Vercel-Cache: HIT`) |
| Universal Analytics | GA clásico activo | **No existe**; solo GA4 `G-JJCZ6M3T8Y` |
| DMARC | "DMARC Reject" | **`p=none`** (sin protección, sin `rua`) |
| SPF | — | Termina en **`?all`** (neutral, débil) |
| IPv6 | Tiene registro | Sin AAAA |

> Nota: estos puntos (DMARC `p=none`, SPF `?all`, posible Consent Mode v2, doble vía GTM+gtag) son temas de seguridad/medición **fuera del alcance de este roadmap de IA**, pero quedan registrados aquí para no perderlos. Ver conversación de auditoría del 2026-06-12.
