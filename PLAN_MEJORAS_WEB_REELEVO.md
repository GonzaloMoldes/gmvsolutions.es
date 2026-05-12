# Plan de Mejoras Web — REELEVO (gmvsolutions.es)
**Fecha de elaboración:** Mayo 2026  
**Base:** Auditoría web (Marzo 2026) + Revisión completa del código fuente + Descripción completa de la app  
**Propósito:** Guía de trabajo concreta y priorizada para alinear la web con las capacidades reales del producto y maximizar la conversión comercial.

---

## 1. DIAGNÓSTICO VERIFICADO DEL ESTADO ACTUAL

### 1.1 Lo que la auditoría decía vs lo que existe realmente en el código

| Problema auditado | Estado actual en código | Verificado |
|---|---|---|
| Sin screenshots del producto | **FALSO** — hay carousel de 7 screenshots en `index.astro` (admin-dashboard, sop-operario, monitor-actividad, + 4 capturas de pantalla sin nombre descriptivo) | ✅ Corregido parcialmente |
| Sin página "Sobre nosotros" | **FALSO** — existe `sobre-nosotros.astro` con historia, valores y FAQs de seguridad/portabilidad | ✅ Corregido |
| "Certificación automática" en compliance | **ACTIVO** — `gestion-competencias.astro` usa el término "Trazabilidad completa - Historial de quién completó cada capacitación, cuándo, con qué resultado. Cumple requisitos de auditoría ISO." | ⚠️ Pendiente ajuste |
| Features no construidas en pricing | **CORREGIDO** — pricing actual usa `○ Según el caso` para API e integraciones, marcadas como roadmap | ✅ Corregido |
| ROI x31.7 exagerado | **CORREGIDO** — calculadora actual usa 25% de reducción conservadora, muestra ROI ×5.0 por defecto | ✅ Corregido |
| Claim "experto desde el primer día" | **CORREGIDO** — messaging actual usa "sustituto con referencia clara", "menos improvisación" | ✅ Corregido |
| "Implementación en 1 día" | **CORREGIDO** — copy actual dice "Arranque técnico ligero y asistido" | ✅ Corregido |
| Sin prueba social | **SIGUE ACTIVO** — cero testimonios, casos reales, logos de clientes | ❌ Pendiente |
| "El único que publica precios en euros" | **CORREGIDO** — ya no aparece ese claim | ✅ Corregido |

### 1.2 Brecha principal detectada: el producto es 4 veces más grande que la web

La web comunica **~25% del producto real**. El posicionamiento actual es:

> *"Onboarding software para pymes industriales con gestión de competencias en planta"*

Pero la app real incluye módulos que no tienen ninguna presencia en la web:

| Módulo real en la app | Páginas en la web | Estado |
|---|---|---|
| Flujo QR de planta + control de producción | Solo mencionado genéricamente | ❌ Sin página propia |
| Registro y sesiones de producción (unidades, paradas, validaciones) | No existe ninguna página | ❌ Sin página propia |
| Módulo Kaizen y mejora continua | No existe ninguna mención significativa | ❌ Sin página propia |
| Workflows automatizados (editor visual, ramas paralelas, aprobaciones) | No existe ninguna mención | ❌ Sin página propia |
| Mantenimiento preventivo y correctivo | Solo mencionado en `documentacion-procesos.astro` en lista de tipos de SOP | ❌ Sin página propia |
| Obras y trazabilidad por pieza/proyecto | Solo insinuado en algunas páginas | ❌ Sin página propia |
| API REST v1/v2 + OpenAPI + Webhooks | Solo en pricing como "○ Según alcance" | ❌ Sin página propia |
| Power BI Integration Kit + Power Automate Connector | No existe en la web | ❌ Sin página propia |
| Portal del operario autenticado | No existe en la web | ❌ Sin página propia |
| Gamificación y sistema de recompensas | No existe en la web | ❌ Sin página propia |
| Panel de supervisión con bandeja de entrada | No existe en la web | ❌ Sin página propia |
| Notificaciones WhatsApp (Twilio) | No existe en la web | ❌ Sin página propia |

### 1.3 Problemas de navegación

La barra de navegación actual tiene:
- `Cómo funciona` | `Por qué REELEVO` | `Casos de uso ▼` | `Para quién ▼` | `Precios` | `Recursos` | `Blog ▼`

**Problema:** No existe ninguna entrada que diga *qué hace el producto*. Un comprador que llega sin contexto no puede descubrir que existe control de producción, Kaizen o API. La única forma de conocer las funcionalidades es leyendo todo el copy de cada página.

### 1.4 Problemas en la página de video demo

`video-demo.astro` existe pero el vídeo es un **placeholder vacío** (solo un div con botón ▶ y texto). La página describe un vídeo de 6 minutos que no existe. Esto es igual de dañino a no tener screenshots: el comprador llega, hace clic en play y no pasa nada.

### 1.5 Screenshots con nombres sin sentido

En `public/screenshots/` hay 4 archivos llamados `Captura de pantalla 2026-03-31 16XXXX.png`. Estos nombres aparecen literalmente en el HTML como `alt` text del carousel y como nombres de archivo. Un nombre de archivo sin semántica no aporta nada a SEO y es una señal de producto sin pulir para quien inspecciona el código.

---

## 2. PLAN DE MEJORAS: SPRINTS DETALLADOS

---

### SPRINT 0 — Correcciones urgentes (1-2 días)
> Problemas que generan percepción negativa activa o riesgo legal. Se hacen antes que todo lo demás.

---

#### Tarea S0-1: Eliminar o reemplazar el placeholder de video demo

**Archivo:** `src/pages/video-demo.astro`

**Problema:** La página promete un vídeo de 6 minutos pero solo hay un div vacío con un botón que no hace nada. Cualquier visitante que haga clic percibirá que el producto no está terminado.

**Opción A — Si no hay vídeo grabado todavía:**  
Reemplaza el bloque `.video-placeholder` con una sección de "demo en texto" o cambia el CTA a "solicitar demo en vivo". No dejes un botón que no funciona.

Busca en `video-demo.astro` el bloque:
```html
<div class="video-placeholder">
  <div class="play-button">▶</div>
  <p>Video Demo REELEVO - 6 minutos</p>
  ...
</div>
```
Reemplázalo por:
```html
<div class="demo-cta-box">
  <p class="demo-note">La demo en vídeo está en preparación.</p>
  <p>Mientras tanto, solicita una demo en directo con el equipo y te enseñamos el producto funcionando en tu contexto.</p>
  <a href="mailto:hola@gmvsolutions.es?subject=Solicito demo en directo" class="btn-primary">Solicitar demo en directo →</a>
</div>
```

**Opción B — Si hay vídeo en Loom, YouTube o Vimeo:**  
Incrusta el embed real. Para Loom:
```html
<div class="video-wrap" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
  <iframe src="https://www.loom.com/embed/TU_ID_AQUI" 
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" 
    allowfullscreen></iframe>
</div>
```

---

#### Tarea S0-2: Renombrar los screenshots sin nombre descriptivo

**Problema:** Los archivos `Captura de pantalla 2026-03-31 16XXXX.png` aparecen como nombres de archivo en el HTML y perjudican SEO y percepción.

**Pasos:**
1. Abre la carpeta `public/screenshots/`
2. Renombra los 4 archivos de esta forma (usando los alts que aparecen en `index.astro` como referencia):
   - `Captura de pantalla 2026-03-31 161924.png` → `planificacion-semanal-operarios.png`
   - `Captura de pantalla 2026-03-31 162126.png` → `gestion-productos-procesos.png`
   - `Captura de pantalla 2026-03-31 162150.png` → `equipo-operaciones-competencias.png`
   - `Captura de pantalla 2026-03-31 162218.png` → `dashboard-produccion.png` (verifica el contenido real)
   - `Captura de pantalla 2026-03-31 162300.png` → `skill-matrix-operarios.png` (verifica el contenido real)
   - `Captura de pantalla 2026-03-31 162618.png` → `flujo-qr-maquina.png` (verifica el contenido real)
3. En `src/pages/index.astro`, actualiza las 4 referencias `src="/screenshots/Captura..."` con los nuevos nombres.

---

#### Tarea S0-3: Corregir claim de "Cumple requisitos de auditoría ISO" en gestión de competencias

**Archivo:** `src/pages/gestion-competencias.astro`

**Problema:** La página dice literalmente:
> *"Trazabilidad completa de quién completó cada capacitación, cuándo, con qué resultado. Cumple requisitos de auditoría ISO."*

ISO 9001 y similares requieren evaluación con criterios definidos, evidencia de competencia demostrada y firma de responsable. Un log de "completó los pasos en la app" no cumple eso por sí solo. La página de `calidad-y-conformidad.astro` ya tiene el approach correcto ("no es por sí solo un sustituto de tu sistema de calidad"). Hay inconsistencia.

**Busca en `gestion-competencias.astro`:**
```
Historial de quién completó cada capacitación, cuándo, con qué resultado. Cumple requisitos de auditoría ISO.
```
**Reemplaza por:**
```
Historial verificable de quién siguió cada proceso, cuándo y con qué resultado. Base útil para revisión interna y para acompañar procesos de auditoría.
```

---

### SPRINT 1 — Estructura de navegación y acceso a funcionalidades (2-3 días)
> El objetivo de este sprint es que cualquier visitante pueda descubrir qué hace el producto sin leer todo el copy.

---

#### Tarea S1-1: Añadir dropdown "Plataforma" en la navegación principal

**Archivo:** `src/components/Header.astro`

**Dónde añadirlo:** Después del link `Por qué REELEVO` y antes del dropdown `Casos de uso`.

**Código a añadir:**
```html
<div class="nav-dropdown">
  <span class="nav-dropdown-trigger">
    Plataforma
    <svg viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4 4-4"/></svg>
  </span>
  <div class="nav-dropdown-menu">
    <a href="/documentacion-procesos/">
      Procesos y SOPs
      <span class="nav-sub-label">Instrucciones accesibles en máquina</span>
    </a>
    <a href="/gestion-competencias/">
      Skill Matrix y competencias
      <span class="nav-sub-label">Quién sabe hacer qué en planta</span>
    </a>
    <a href="/calidad-y-conformidad/">
      Calidad y conformidad
      <span class="nav-sub-label">Evidencia operativa útil</span>
    </a>
    <a href="/integraciones/">
      Integraciones y API
      <span class="nav-sub-label">Power BI, Power Automate, API REST</span>
    </a>
  </div>
</div>
```

**Nota:** La página `/integraciones/` se crea en el Sprint 2. Hasta entonces, el link puede apuntar a `/precios/#enterprise` provisionalmente.

---

#### Tarea S1-2: Añadir enlace a "Calidad y conformidad" en la navegación

**Archivo:** `src/components/Header.astro`

La página `calidad-y-conformidad.astro` existe pero no aparece en la navegación. Es una página de valor para responsables de calidad (uno de los 4 buyer personas clave). 

**Acción:** En el dropdown "Para quién", añade:
```html
<a href="/calidad-y-conformidad/">
  Responsable de calidad
  <span class="nav-sub-label">Evidencia útil y conformidad</span>
</a>
```
> Nota: el dropdown actual ya tiene `/para-quien/responsable-calidad/`. Revisa si es más apropiado actualizar esa página o mantener ambas con distintos enfoques (la de `para-quien` es del perfil, `calidad-y-conformidad` es de la funcionalidad).

---

#### Tarea S1-3: Actualizar el hero principal para salir del frame de "onboarding software"

**Archivo:** `src/pages/index.astro`

**Problema actual:** El title, la meta description, el eyebrow y el H1 repiten "onboarding software" 6 veces en las primeras 80 líneas. Esto posiciona REELEVO como una herramienta de RRHH para onboarding, ignorando que el 80% del uso diario es control de producción y ejecución en planta.

**Cambio en el eyebrow** (busca):
```
Onboarding software industrial · Software de recursos humanos · menos improvisación
```
**Reemplaza por:**
```
Plataforma operativa industrial · menos improvisación · más continuidad en planta
```

**Cambio en H1** (busca):
```
Onboarding software para pymes industriales<br>
con gestión de competencias<br>
<em>en planta</em>.
```
**Reemplaza por:**
```
La operación de tu planta<br>
documentada, trazada y mejorada<br>
<em>desde el QR de cada máquina</em>.
```

**Cambio en el párrafo de descripción** (busca el bloque hero-sub que empieza con "REELEVO es un onboarding software"):
```html
<p class="hero-sub fade-up delay-2">
  REELEVO es un onboarding software diseñado para pymes industriales. Ordena incorporaciones, gestiona competencias operativas, reduce dependencia de operarios clave y mejora documentación de procesos.<br>
  <strong>Producción gana contexto para decidir, RRHH ordena mejor el onboarding, la empresa visualiza qué competencias tiene cada equipo y se refuerza la documentación en planta</strong>.
</p>
```
**Reemplaza por:**
```html
<p class="hero-sub fade-up delay-2">
  REELEVO es una plataforma operativa para pymes industriales. Digitaliza cómo trabajan, aprenden y mejoran los equipos en planta: procesos accesibles desde QR, control de producción, gestión de competencias, mejora continua y datos para decidir.<br>
  <strong>Sin papel, sin dependencia de personas clave, sin proyectos pesados.</strong>
</p>
```

---

#### Tarea S1-4: Actualizar la sección "4 pilares" del home

**Archivo:** `src/pages/index.astro`

**Problema actual:** Los 4 pilares del home repiten "onboarding software" de forma redundante y no muestran el alcance real del producto.

**Busca la sección con class `steps-grid steps-grid-four` y reemplaza el contenido de los 4 step-card por:**

```html
<div class="step-card">
  <div class="step-card-icon">📲</div>
  <h3 class="step-card-title">1. Procesos accesibles donde hacen falta</h3>
  <p class="step-card-desc">
    El operario escanea el QR de la máquina y encuentra el proceso paso a paso, con instrucciones, vídeos y guías de incidencias. Sin app, sin contraseña, sin buscar nada.
  </p>
</div>
<div class="step-card">
  <div class="step-card-icon">📊</div>
  <h3 class="step-card-title">2. Control de producción y trazabilidad</h3>
  <p class="step-card-desc">
    Cada sesión de trabajo queda registrada: quién hizo qué, cuándo, en qué máquina y con qué resultado. Visibilidad real de la operación sin pedir esfuerzo extra al operario.
  </p>
</div>
<div class="step-card">
  <div class="step-card-icon">🧠</div>
  <h3 class="step-card-title">3. Gestión de competencias y conocimiento</h3>
  <p class="step-card-desc">
    Visualiza quién está certificado en qué proceso. Detecta dónde el conocimiento está concentrado en una sola persona. Incorporaciones más ordenadas y menos dependencia del tutor.
  </p>
</div>
<div class="step-card">
  <div class="step-card-icon">💡</div>
  <h3 class="step-card-title">4. Mejora continua desde la planta</h3>
  <p class="step-card-desc">
    El operario propone mejoras desde el flujo QR. El supervisor las gestiona en un panel Kaizen. Las buenas ideas se convierten en estándares, no en conversaciones de pasillo.
  </p>
</div>
```

---

### SPRINT 2 — Nuevas páginas de funcionalidades críticas (5-7 días)
> Crear páginas que describan módulos del producto que hoy no tienen presencia en la web. Empezar por los de mayor impacto comercial.

---

#### Tarea S2-1: Crear página `/integraciones/`

**Archivo a crear:** `src/pages/integraciones.astro`

**Por qué es prioritaria:** El Power BI Integration Kit con queries M y medidas DAX y el conector para Power Automate son diferenciadores enterprise que no existen en ningún sitio de la web. Un decision maker de IT/Operaciones que busca integrabilidad necesita esta página.

**Estructura de la página:**

```
HERO
  Eyebrow: "Integraciones y API"
  H1: "REELEVO conectado con tu ecosistema tecnológico"
  Subtítulo: "API REST documentada, pack nativo de Power BI, conector Power Automate y webhooks en tiempo real. Datos operativos listos para donde los necesites."
  CTAs: [Registrarme] [Contactar para Enterprise]

SECCIÓN 1: Power BI Integration Kit
  H2: "Tus datos operativos en Power BI en menos de una hora"
  Descripción:
    - Paquete completo con queries Power Query (M) listas para usar
    - 4 vistas preconfiguradas: Operaciones, Calidad, Formación/Compliance y Skill Matrix
    - Medidas DAX base incluidas
    - Soporte para refresh manual, programado o activado por evento (webhook)
    - Compatible con el conector de Power Automate
  CTA: "Disponible en plan Enterprise — Contactar"

SECCIÓN 2: Power Automate Custom Connector  
  H2: "Automatiza flujos con Power Automate"
  Descripción:
    - Conector personalizado importable directamente en Power Automate
    - Compatible con todos los eventos de webhooks de REELEVO
    - Plantillas de flujo para escenarios comunes: notificación en Teams al completar producción, alerta de cobertura de turno, actualización automática de informe Power BI
    - Publicación de alertas en canales de Microsoft Teams
  CTA: "Disponible en plan Enterprise — Contactar"

SECCIÓN 3: API REST
  H2: "API documentada para integrar con ERP, MES o BI"
  Descripción:
    - API v1: lectura de procesos, operarios, completions y certificaciones (plan Pro+)
    - API v2: contrato OpenAPI completo con lectura y escritura (plan Enterprise)
    - Autenticación por API key con permisos configurables por clave
    - Especificación OpenAPI filtrada para Power BI y Power Automate
  CTA: "Ver documentación de API — Registrarme"

SECCIÓN 4: Webhooks
  H2: "Eventos en tiempo real con webhooks"
  Descripción:
    - Configuración de webhooks para eventos clave: proceso completado, certificación emitida, propuesta Kaizen creada, workflow completado, producción validada
    - Firma de payload con HMAC para verificación de autenticidad
    - Logs de entregas y reintento automático ante fallos
    - Hasta 5 webhooks activos en plan Pro, sin límite en Enterprise

TABLA DE PLANES
  Qué está disponible en cada plan (Starter / Profesional / Enterprise)

CTA FINAL
  "¿Necesitas un conector específico? Cuéntanos tu caso."
  [mailto:hola@gmvsolutions.es]
```

**Añadir a la navegación:** En el dropdown "Plataforma" que se crea en S1-1, actualizar el href provisional a `/integraciones/`.

**Añadir al sitemap:** En `src/pages/sitemap.xml.ts`, añadir la URL de integraciones.

---

#### Tarea S2-2: Crear página `/control-produccion/`

**Archivo a crear:** `src/pages/control-produccion.astro`

**Por qué es prioritaria:** El registro de sesiones de producción, unidades, paradas y validaciones de supervisor es el **uso diario más frecuente** de la app. Sin una página que lo explique, el producto parece una herramienta de documentación pasiva.

**Estructura de la página:**

```
HERO
  Eyebrow: "Control de producción"
  H1: "Cada turno registrado. Cada pieza trazada. Cero papel."
  Subtítulo: "El operario registra unidades, paradas e incidencias desde el QR de la máquina. El supervisor valida. Los datos aparecen en el dashboard sin ningún trabajo extra."
  CTAs: [Registrarme] [Ver cómo funciona]

SECCIÓN 1: El flujo en 3 pasos
  Paso 1: El operario inicia sesión desde el QR de la máquina
    → Introduce su nombre y PIN de empresa. No necesita cuenta ni app.
    → Selecciona el proceso y arranca la sesión de producción.
  Paso 2: Registra el trabajo mientras lo hace
    → Unidades producidas, paradas con causa y duración, incidencias reportadas.
    → Si algo es diferente al SOP oficial, puede registrar la variación.
    → Si hay un problema, activa la guía de troubleshooting inline.
  Paso 3: El supervisor valida y los datos están disponibles
    → El supervisor revisa y valida las sesiones desde el portal supervisor.
    → El dashboard muestra KPIs en tiempo real: unidades, tiempo, eficiencia.
    → Exportación a CSV disponible para cualquier análisis externo.

SECCIÓN 2: Trazabilidad por pieza y por obra
  H2: "Cada pieza, un QR. Cada obra, su historial completo."
  Descripción:
    - Generación automática de QR por pieza terminada
    - Consulta del historial completo escaneando el QR de la pieza: quién la produjo, cuándo, en qué proceso y dentro de qué obra
    - Agrupación de producción por obra/proyecto con avance real vs planificado
    - Etiquetas QR imprimibles con datos de trazabilidad
  Caso de uso: "Ideal para empresas que fabrican por encargo, proyecto o certificación de calidad"

SECCIÓN 3: Dashboard y analítica
  H2: "Datos de producción en tiempo real, sin reportes manuales"
  Lista de KPIs disponibles:
    - Sesiones activas ahora mismo en planta
    - Unidades producidas por turno, proceso, operario y máquina
    - Productividad por operario (unidades/hora vs objetivo)
    - Paradas: causa, duración, frecuencia
    - Tasa de completado por proceso
  Screenshots: usar las capturas existentes de monitor-actividad.png y admin-dashboard.png

SECCIÓN 4: Planificación de producción
  H2: "Planifica el trabajo, REELEVO lo convierte en agenda del operario"
  Descripción breve de asignaciones semanales, notificaciones por WhatsApp y vista del plan desde el portal del operario.

CTA FINAL
```

---

#### Tarea S2-3: Crear página `/mejora-continua/`

**Archivo a crear:** `src/pages/mejora-continua.astro`

**Por qué es relevante comercialmente:** El ciclo Kaizen completo integrado con el flujo QR es diferenciador. Ningún competidor (Dozuki, Poka, GembaDocs) tiene este ciclo a este precio. El sistema de gamificación con puntos y recompensas económicas es único en el segmento pyme.

**Estructura de la página:**

```
HERO
  Eyebrow: "Kaizen y mejora continua"
  H1: "La mejor idea de hoy es el estándar de mañana"
  Subtítulo: "El operario propone una mejora desde el QR de la máquina. El supervisor la gestiona. Las buenas ideas se convierten en SOPs actualizados. Con recompensas para quien mejora."
  CTAs: [Registrarme] [Ver cómo funciona]

SECCIÓN 1: El ciclo completo en 4 fases
  Fase 1 — Captura (desde planta)
    → Botón "💡 Proponer mejora" accesible en el flujo QR de producción
    → Formulario rápido: descripción, tipo de impacto (seguridad / calidad / tiempo / ergonomía / material / mantenimiento) y foto opcional
    → Se registra automáticamente: proceso, máquina, operario y fecha
  Fase 2 — Revisión (panel empresa)
    → Vista Kanban: Capturada → Revisada → En implementación → Estandarizada
    → Priorización por tipo de impacto y coste de implementación
    → Asignación de responsable por propuesta
  Fase 3 — Implementación
    → Registro de acciones tomadas
    → Actualización del SOP cuando la mejora se implementa
    → Notificación al operario que propuso la mejora
  Fase 4 — Recompensa
    → Sistema de puntos configurable por tipo de impacto
    → Recompensa económica opcional asociada a propuestas implementadas
    → El operario ve su historial y sus puntos desde el portal personal

SECCIÓN 2: Panel Kaizen
  H2: "Visibilidad completa del ciclo de mejora"
  Descripción del panel con KPIs: propuestas por mes, tasa de implementación, tiempo medio de ciclo, impacto estimado
  Exportación a CSV

SECCIÓN 3: Sistema de recompensas
  H2: "Las mejoras se reconocen, no solo se archivan"
  Descripción del sistema de puntos y recompensas económicas configurables

CTA FINAL
  "Incluido en plan Profesional — Sin coste adicional"
```

---

### SPRINT 3 — Prueba social y credibilidad (en paralelo con Sprint 2)
> Sin prueba social, el resto de mejoras tienen impacto limitado en conversión. Este sprint puede ejecutarse en paralelo.

---

#### Tarea S3-1: Añadir bloque de "primer piloto" en home y pricing

Mientras no hay clientes con testimonios formales, es mejor ser transparente y usar lo que sí existe. 

**Archivo:** `src/pages/index.astro`

**Dónde:** Justo antes del bloque de screenshots (sección `id="producto"`), añadir:

```html
<div class="pilot-band fade-up">
  <div class="pilot-band-inner">
    <div class="pilot-label">Estado del producto</div>
    <p class="pilot-text">
      REELEVO está en fase de implantación activa con primeras empresas industriales en España. 
      Si quieres ser de los primeros y recibir implantación asistida directa del equipo fundador, 
      ahora es el momento.
    </p>
    <a href="mailto:hola@gmvsolutions.es?subject=Quiero ser empresa piloto" class="pilot-cta">
      Hablar con el equipo →
    </a>
  </div>
</div>
```

**CSS a añadir en `src/styles/global.css`:**
```css
.pilot-band { background: #fff8f0; border: 1px solid #ffe0b2; border-radius: 12px; padding: 24px 32px; margin: 0 auto 48px; max-width: 860px; }
.pilot-band-inner { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.pilot-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--orange); }
.pilot-text { flex: 1; font-size: .88rem; color: var(--gray1); margin: 0; }
.pilot-cta { font-size: .82rem; font-weight: 600; color: var(--orange); text-decoration: none; white-space: nowrap; }
.pilot-cta:hover { text-decoration: underline; }
```

---

#### Tarea S3-2: Añadir sección de testimonios placeholder en home

Crea un bloque que puedas actualizar fácilmente cuando llegue el primer testimonio real.

**En `index.astro`**, añade esta sección después del bloque de datos estadísticos:

```html
<!-- ═══ SOCIAL PROOF ═══ -->
<section class="section section-center" id="clientes">
  <div class="section-inner">
    <div class="fade-up">
      <div class="eyebrow">Primeros clientes</div>
      <h2 class="section-title">Empresas que ya <em>están usando REELEVO</em></h2>
    </div>
    <!-- 
      PLACEHOLDER: Reemplazar con testimonios reales cuando estén disponibles.
      Formato sugerido:
      <div class="testimonial-grid">
        <blockquote class="testimonial-card">
          <p>"Texto del testimonio real aquí. Específico, con un resultado concreto."</p>
          <footer>
            <strong>Nombre Apellido</strong>
            <span>Cargo, Nombre de la empresa, sector</span>
          </footer>
        </blockquote>
      </div>
    -->
    <div class="testimonial-placeholder fade-up delay-1">
      <p class="testimonial-placeholder-text">Estamos implantando con nuestras primeras empresas industriales. En cuanto podamos compartir resultados reales, los publicaremos aquí.</p>
      <a href="mailto:hola@gmvsolutions.es?subject=Quiero ser empresa piloto REELEVO" class="btn-ghost">Ser de los primeros →</a>
    </div>
  </div>
</section>
```

---

#### Tarea S3-3: Actualizar "Sobre nosotros" con información de equipo más concreta

**Archivo:** `src/pages/sobre-nosotros.astro`

La página existe pero es genérica. No hay ningún nombre, cara, experiencia concreta ni LinkedIn. Para una pyme que va a confiar su conocimiento operativo a un proveedor, saber quién está detrás importa.

**Añadir (cuando sea viable):**
- Nombre/s del equipo fundador con foto y una línea de experiencia relevante en industria
- Enlace a LinkedIn del/los fundadores
- Número de empresas actualmente usando la plataforma (aunque sea 3 o 5)
- Ciudad/ubicación real (A Coruña ya aparece en el schema)

**Mínimo viable ahora mismo:** Añadir una línea concreta como:
```
"Somos [X] personas con base en A Coruña. Hemos trabajado directamente con empresas industriales en [sectores concretos] y construimos REELEVO para resolver el problema que vimos repetidamente."
```

---

### SPRINT 4 — Optimización de página de precios (2 días)

---

#### Tarea S4-1: Mapear módulos reales a planes en la tabla de pricing

**Archivo:** `src/pages/precios.astro`

**Problema actual:** Los planes usan frases abstractas como "Más claridad para producción y coordinación del turno" sin especificar qué módulos incluyen. Un comprador que quiere Kaizen o la API no puede saber si está en Starter, Profesional o Enterprise.

**Cambio propuesto para el plan Starter (busca el bloque de plan-features del Starter):**

Reemplaza las features abstractas por una lista que referencie módulos reales:
```html
<div class="plan-feature"><span class="check">✓</span>Flujo QR en planta (máquinas, SOPs, troubleshooting)</div>
<div class="plan-feature"><span class="check">✓</span>Hasta 5 máquinas o puestos, 6 procesos por máquina</div>
<div class="plan-feature"><span class="check">✓</span>Operarios ilimitados (sin coste por usuario)</div>
<div class="plan-feature"><span class="check">✓</span>Control básico de producción (sesiones, unidades)</div>
<div class="plan-feature"><span class="check">✓</span>Skill Matrix básica</div>
<div class="plan-feature"><span class="check">✓</span>Estadísticas básicas y exportación CSV</div>
<div class="plan-feature"><span class="cross">×</span>Kaizen y mejora continua</div>
<div class="plan-feature"><span class="cross">×</span>Workflows automatizados</div>
<div class="plan-feature"><span class="cross">×</span>API e integraciones</div>
```

**Para el plan Profesional:**
```html
<div class="plan-feature"><span class="check">✓</span>Todo lo del plan Starter</div>
<div class="plan-feature"><span class="check">✓</span>Hasta 3 plantas, 20 máquinas o puestos</div>
<div class="plan-feature"><span class="check">✓</span>Kaizen y mejora continua con panel Kanban</div>
<div class="plan-feature"><span class="check">✓</span>Sistema de recompensas y gamificación</div>
<div class="plan-feature"><span class="check">✓</span>Workflows automatizados (editor visual)</div>
<div class="plan-feature"><span class="check">✓</span>Control de producción avanzado y validación supervisor</div>
<div class="plan-feature"><span class="check">✓</span>Trazabilidad por pieza y obras/proyectos</div>
<div class="plan-feature"><span class="check">✓</span>API v1 (lectura)</div>
<div class="plan-feature"><span class="check">✓</span>Reportes programados y exportación Excel</div>
<div class="plan-feature"><span class="roadmap">○</span>Integraciones con software de RRHH <span class="plan-badge-roadmap">Según el caso</span></div>
```

**Para el plan Enterprise:**
```html
<div class="plan-feature"><span class="check">✓</span>Todo lo del plan Profesional</div>
<div class="plan-feature"><span class="check">✓</span>Plantas, máquinas y puestos a medida</div>
<div class="plan-feature"><span class="check">✓</span>API v2 completa (lectura + escritura, OpenAPI)</div>
<div class="plan-feature"><span class="check">✓</span>Webhooks (hasta ilimitados)</div>
<div class="plan-feature"><span class="check">✓</span>Power BI Integration Kit (queries M + medidas DAX)</div>
<div class="plan-feature"><span class="check">✓</span>Power Automate Custom Connector</div>
<div class="plan-feature"><span class="roadmap">○</span>SSO / directorio corporativo <span class="plan-badge-roadmap">Según el caso</span></div>
<div class="plan-feature"><span class="roadmap">○</span>Integraciones ERP <span class="plan-badge-roadmap">Según alcance</span></div>
<div class="plan-feature"><span class="check">✓</span>Acuerdo de soporte dedicado</div>
<div class="plan-feature"><span class="check">✓</span>Implementación asistida completa</div>
```

---

#### Tarea S4-2: Añadir enlace a nueva página de integraciones desde pricing

**En `precios.astro`**, en el bloque del plan Enterprise, añadir después de la lista de features:

```html
<div class="plan-integration-link">
  <a href="/integraciones/">Ver detalle de integraciones y API →</a>
</div>
```

---

### SPRINT 5 — Optimizaciones de contenido existente (2-3 días)
> Mejoras de páginas que ya existen pero tienen contenido que necesita actualización.

---

#### Tarea S5-1: Actualizar la página "Cómo funciona" para mostrar el flujo QR de producción

**Archivo:** `src/pages/como-funciona.astro`

La página describe el flujo desde "el experto captura conocimiento" hasta "el sustituto lo usa". Es correcto pero incompleto — no muestra que el uso diario del flujo QR no es solo para sustitutos: es para **todos los operarios en cada turno**.

**Añadir una sección adicional** entre los pasos existentes:

```
NUEVO PASO 2.5: El operario usa el QR cada día (no solo en emergencias)
  → El QR en la máquina es el punto de entrada al trabajo diario
  → El operario registra la sesión de producción, las unidades y las paradas
  → Si hay un problema, activa el troubleshooting inline
  → Si tiene una idea de mejora, la propone en 30 segundos
  → Todo queda registrado sin ningún esfuerzo adicional
```

---

#### Tarea S5-2: Actualizar la tabla comparativa de `vs-alternativas.astro`

**Archivo:** `src/pages/vs-alternativas.astro`

La auditoría señaló que la tabla comparativa es tendenciosa (✓ a todo en REELEVO, × a casi todo en la competencia). Revisando el código, la tabla actual tiene algunas mejoras pero sigue poniendo × en "Monitor tiempo real" para Dozuki y Poka, que sí tienen dashboards.

**Acción:** Revisar fila por fila y usar ⚪ (parcial) en lugar de × cuando la competencia tiene algo aunque sea diferente. Protege la credibilidad de las comparativas que sí son diferenciadores reales.

**Filas a revisar (busca en el código y ajusta):**
- "Monitor tiempo real" — Poka sí tiene dashboard, cambiar × a ⚪
- "Guía de incidencias integrada" — Dozuki tiene documentos separados, eso es ⚪ no ×

---

#### Tarea S5-3: Limpiar sección de Recursos

**Archivo:** `src/pages/recursos.astro`

La auditoría señalaba "recursos vacíos con próximamente". En el código actual los `topic-card` de la sección recursos tienen links a páginas que existen. **Verificar** que:
1. Todos los links en `recursos.astro` apuntan a páginas que existen y tienen contenido real
2. No hay ningún "próximamente" o link roto

**Acción:** Abre la página en `http://localhost:4321/recursos/` y haz clic en cada link. Elimina o sustituye cualquier link que lleve a una página vacía o con poco contenido.

---

#### Tarea S5-4: Actualizar la página de sectores con los módulos de mantenimiento

**Archivos:** `src/pages/sectores/mecanizado-cnc.astro` y `src/pages/sectores/alimentacion.astro`

El módulo de mantenimiento preventivo/correctivo integrado con la planificación es altamente relevante para estos sectores. Añadir una sección en cada página de sector que mencione:

```
"Mantenimiento integrado con la producción"
→ Las órdenes de mantenimiento aparecen en la misma agenda que las de producción
→ El operario sabe cuándo toca mantenimiento sin necesidad de un sistema separado
→ Histórico de mantenimiento por máquina accesible desde el hub QR
```

---

### SPRINT 6 — SEO y sitemap (1 día)
> Asegurar que las nuevas páginas están correctamente indexadas y el sitemap está actualizado.

---

#### Tarea S6-1: Actualizar sitemap con nuevas URLs

**Archivo:** `src/pages/sitemap.xml.ts`

Después de crear las páginas de los sprints anteriores, añadir al sitemap:
- `/integraciones/`
- `/control-produccion/`
- `/mejora-continua/`

**Verificar que todas las páginas existentes también están en el sitemap.**

---

#### Tarea S6-2: Actualizar meta titles y descriptions de las páginas existentes para reflejar el nuevo posicionamiento

Las páginas de `gestion-competencias.astro` y `documentacion-procesos.astro` tienen titles orientados a SEO de keywords pero hay que asegurarse de que cuando se actualice el copy en sprints anteriores, los meta también se actualicen.

**Checklist de meta a revisar:**
- `gestion-competencias.astro` — title y description actuales están bien para SEO
- `documentacion-procesos.astro` — title y description actuales están bien para SEO  
- `index.astro` — actualizar description para reflejar el nuevo posicionamiento más amplio (actualmente dice "onboarding software... gestión de competencias")

---

## 3. RESUMEN EJECUTIVO DE SPRINTS

| Sprint | Nombre | Días estimados | Impacto |
|---|---|---|---|
| S0 | Correcciones urgentes | 1-2 días | 🔴 Crítico — elimina percepción negativa activa |
| S1 | Navegación y posicionamiento | 2-3 días | 🟠 Alto — cualquier visitante puede descubrir el producto |
| S2 | Nuevas páginas de funcionalidades | 5-7 días | 🟠 Alto — captura demanda de Kaizen, producción e integraciones |
| S3 | Prueba social y credibilidad | 2-3 días | 🟠 Alto — el factor de conversión más limitante ahora mismo |
| S4 | Optimización de pricing | 2 días | 🟡 Medio — mejora la conversión de visitantes que llegan a precios |
| S5 | Optimizaciones de contenido | 2-3 días | 🟡 Medio — mejora la calidad del contenido existente |
| S6 | SEO y sitemap | 1 día | 🟢 Bajo-Medio — visibilidad a largo plazo |

**Total estimado:** 15-21 días de trabajo, ejecutables en paralelo por áreas (contenido, código, SEO).

---

## 4. ORDEN DE EJECUCIÓN RECOMENDADO

```
Semana 1:
  Día 1-2:   S0 completo (correcciones urgentes — son rápidas y urgentes)
  Día 3-4:   S1-1 al S1-4 (navegación y posicionamiento del hero)
  Día 5:     S3-1 al S3-2 (prueba social placeholder)

Semana 2:
  Día 1-3:   S2-1 (página integraciones — la más valiosa comercialmente)
  Día 4-5:   S2-2 (página control de producción)

Semana 3:
  Día 1-2:   S2-3 (página mejora continua / Kaizen)
  Día 3-4:   S4-1 al S4-2 (optimización pricing)
  Día 5:     S5-1 al S5-4 (optimizaciones de contenido existente)

Semana 4:
  Día 1:     S6 completo (sitemap y SEO)
  Día 2-3:   S3-3 (sobre nosotros — cuando haya más info disponible)
  Resto:     Revisión general y pruebas de navegación
```

---

## 5. CRITERIOS DE ÉXITO

Después de aplicar estas mejoras, un visitante que llega a la web por primera vez debería poder:

1. **En 10 segundos (hero):** Entender que REELEVO es una plataforma operativa industrial, no solo una herramienta de onboarding/RRHH
2. **En 30 segundos (navegación):** Descubrir que existen módulos de producción, Kaizen e integraciones
3. **En 2 minutos (pricing):** Saber exactamente qué módulos incluye cada plan sin ambigüedad
4. **Antes de abandonar:** Encontrar al menos una referencia a integraciones con Power BI/ERP si es un decision maker de IT/Operaciones
5. **Sin dudas:** Confirmar que el producto existe y funciona (screenshots reales, vídeo demo real o demo en directo como alternativa honesta)

---

*Documento generado en base a revisión del código fuente completo del proyecto Astro en `c:\Users\gonza\OneDrive\Documentos\GitHub\en-construccion`, auditoría web de Marzo 2026 y descripción completa de la aplicación REELEVO de Mayo 2026.*
