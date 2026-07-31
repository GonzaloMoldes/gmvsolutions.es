# Patrón de prueba visual para las páginas de Plataforma

**Fecha:** 31 de julio de 2026
**Qué fija este documento:** el modelo con el que se presenta el producto en una página de Plataforma, y el compromiso de que **cada una de las 15 áreas del menú «Plataforma» tenga su captura** siguiendo ese modelo.
**Página de referencia:** [/para-quien/jefe-de-produccion/](src/pages/para-quien/jefe-de-produccion.astro)

---

## Por qué existe este documento

Hoy **9 de las 15 páginas del menú Plataforma no tienen ninguna imagen del producto**. Una persona que llega a `/portal-operario/` desde Google no ve el portal del operario en ningún momento.

Las capturas reales son el activo visual más fuerte que tenemos: la competencia directa del sector usa ilustraciones genéricas o no enseña producto. Desaprovecharlo en dos tercios de las páginas comerciales es el hueco más caro que queda abierto.

Este documento fija **un solo patrón** para no tener que rediseñar el bloque cada vez.

---

## 1. El patrón

Una sección de ancho completo con dos columnas asimétricas: **la captura pesa más que el texto**.

```
┌─ eyebrow ─────────────────────────────────────────────┐
│  PRUEBA VISUAL                                        │
│  ## Lo que producción ya puede VER HOY                │
│  Párrafo corto: qué se ve y qué cambia en la          │
│  conversación diaria.                                 │
│                                                       │
│  ┌────────────────────────┐ ┌───────────────────────┐ │
│  │                        │ │  Qué aporta a X       │ │
│  │      CAPTURA           │ │                       │ │
│  │      (1.15fr)          │ │  · Punto 1            │ │
│  │                        │ │  · Punto 2            │ │
│  ├────────────────────────┤ │  · Punto 3            │ │
│  │ Pie: "Captura real del │ │  · Punto 4            │ │
│  │ producto: …"           │ │           (0.85fr)    │ │
│  └────────────────────────┘ └───────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

### Marcado

```astro
---
import Screenshot from '../components/Screenshot.astro';
---

<!-- PRUEBA VISUAL -->
<section class="section">
  <div class="section-inner">
    <div class="fade-up">
      <div class="eyebrow">Prueba visual</div>
      <h2 class="section-title">Lo que producción ya puede <em>ver hoy</em></h2>
      <p class="section-sub">
        Captura real del panel operativo. La conversación deja de ser «alguien me dijo»
        y pasa a ser «dónde se está complicando el turno».
      </p>
    </div>

    <div class="proof-grid fade-up delay-1">
      <div class="proof-card proof-shot">
        <div class="proof-frame">
          <Screenshot name="monitor-actividad" alt="…" layout="pair" />
        </div>
        <div class="proof-caption">Captura real del producto: …</div>
      </div>

      <div class="proof-card proof-points">
        <h3>Qué aporta a producción</h3>
        <div class="proof-point"><strong>Más claridad al momento:</strong> …</div>
        <div class="proof-point"><strong>Menos dependencia de llamadas:</strong> …</div>
        <div class="proof-point"><strong>Mejor criterio para reorganizar:</strong> …</div>
        <div class="proof-point"><strong>Menos tiempo perdido arrancando:</strong> …</div>
      </div>
    </div>
  </div>
</section>
```

### CSS

Hoy vive duplicado en el `<style>` de cada página que lo usa. **Al aplicarlo a la tercera página conviene extraerlo a un componente** `ProofSection.astro` en lugar de seguir copiándolo.

```css
.proof-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 24px; margin-top: 48px; }
.proof-card { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
.proof-caption { padding: 16px 18px; font-size: .8rem; color: var(--gray); line-height: 1.55; }
@media (max-width: 900px) { .proof-grid { grid-template-columns: 1fr; } }
```

> **No añadas `.proof-frame img { width:100% }` en el CSS de página.** Esa regla ya está en [global.css](src/styles/global.css) y tiene que estar ahí: el `<img>` lo genera `<Picture>`, no la página, así que una regla con ámbito de página **no le aplica** y la imagen sale a su tamaño intrínseco. Lo mismo con `height:auto`, sin el cual el atributo `height` estira la captura.

---

## 2. Reglas de escritura

| Elemento | Regla |
|---|---|
| **Eyebrow** | Siempre `Prueba visual`. No inventar variantes. |
| **H2** | Qué **ve** el rol, no qué hace el software. «Lo que producción ya puede ver hoy», no «Panel de monitorización avanzado». |
| **Párrafo** | 2 frases. Qué se ve y **qué cambia en la conversación diaria**. |
| **Pie de captura** | Empieza por «Captura real del producto:». Es la señal de que no es una ilustración. |
| **Título de puntos** | «Qué aporta a [rol o área]». |
| **Puntos** | Exactamente **4**. Cada uno abre con `<strong>` de 2-4 palabras y sigue con el beneficio concreto. |
| **Alt** | Descriptivo y específico. Nunca «captura de pantalla» ni el nombre del archivo. |

Aplica la [guía maestra de mensaje](REELEVO_GUIA_MAESTRA_MENSAJE_Y_VOCABULARIO.md): nada de «riesgo eliminado», «cero paradas» ni promesas absolutas.

---

## 3. Reglas de la captura

- **Ancho mínimo 1600 px.** El pipeline genera 480/960/1440, y de un original menor no sale el 1440.
- **PNG a `src/assets/screenshots/`**, nunca a `public/`. Desde `src/` pasa por `<Picture>` y sale en AVIF y WebP; desde `public/` se sirve tal cual.
- **Sin datos reales de cliente.** Nombres y referencias de ejemplo, coherentes con el sector.
- **Sin texto de relleno.** ⚠️ `editor-workflows.png` tiene hoy «Mejorar las cosas de mejorar» y «Blablabla» visibles. Está publicada en `/kaizen/` y hay que rehacerla.
- **Tema oscuro del producto**, para que case con el sitio.
- **Nombre = área**, no = pantalla. Y ojo: **`editor-workflows.png` muestra el panel Kaizen, y `kaizen-panel.png` muestra el editor de workflows.** Están cruzados. Cada página usa la correcta, pero al añadir capturas nuevas no te fíes del nombre.

---

## 4. Estado actual y qué falta

### Capturas disponibles (11)

`admin-dashboard` · `analitica-productividad` · `competencias-operario` · `detalle-procesos` · `editor-workflows` · `equipo-operaciones` · `gestion-productos-procesos` · `kaizen-panel` · `monitor-actividad` · `planificacion-semanal` · `sop-operario`

### Menú Plataforma — Gestión y operaciones

| Página | Capturas | Patrón | Qué falta |
|---|---|---|---|
| `/software-gestion-pyme-industrial/` | ❌ 0 | — | **Captura nueva.** Es la cabecera del menú y no tiene ninguna. |
| `/gestion-competencias/` | ✅ 2 | `screenshot-pair` | Migrar al patrón |
| `/documentacion-procesos/` | ✅ 2 | `screenshot-pair` | Migrar al patrón |
| `/control-produccion/` | ✅ 4 | `screenshot-pair` | Migrar al patrón |
| `/mantenimiento/` | ❌ 0 | — | **Captura nueva:** plan por máquina y órdenes |
| `/obras-trazabilidad/` | ❌ 0 | — | **Captura nueva:** historial por pieza y proyecto |
| `/kaizen/` | ⚠️ 1 | `screenshot-single` | Rehacer `editor-workflows` (texto de relleno) + migrar |

### Menú Plataforma — Herramientas avanzadas

| Página | Capturas | Patrón | Qué falta |
|---|---|---|---|
| `/workflows/` | ✅ 1 | `screenshot-single` | Migrar al patrón |
| `/portal-operario/` | ❌ 0 | — | **Captura nueva:** vista del operario en el puesto |
| `/firma-digital/` | ❌ 0 | — | **Captura nueva:** paso con firma |
| `/modo-offline/` | ❌ 0 | — | **Captura nueva:** indicador sin conexión |
| `/api-integraciones/` | ❌ 0 | — | **Captura nueva:** panel de integraciones o webhooks |
| `/integracion-m365/` | ❌ 0 | — | **Captura nueva:** Power BI o Teams con dato de planta |
| `/cobertura-turnos/` | ❌ 0 | — | **Captura nueva:** alerta de turno corto |
| `/calidad-y-conformidad/` | ✅ 1 | ✅ **ya usa `proof-grid`** | Nada |

### Resumen

- **9 capturas nuevas** hay que sacarlas de la aplicación
- **1 a rehacer** (`editor-workflows`, por el texto de relleno)
- **5 páginas** ya tienen imagen pero con otro patrón, a migrar
- **1 página** ya cumple: `/calidad-y-conformidad/`

---

## 5. Orden sugerido

Por retorno, no por orden de menú:

1. **`/portal-operario/`** — es lo que el operario toca a diario y no se enseña en ninguna parte
2. **`/software-gestion-pyme-industrial/`** — cabecera del menú; además la auditoría la marcó sin enlaces contextuales entrantes
3. **`/cobertura-turnos/`** y **`/mantenimiento/`** — funcionalidad concreta, fácil de capturar
4. **Rehacer `editor-workflows`** — hay texto de relleno publicado
5. **`/obras-trazabilidad/`**, **`/firma-digital/`**, **`/modo-offline/`**
6. **`/api-integraciones/`** e **`/integracion-m365/`** — las más difíciles de enseñar visualmente
7. **Migrar** las 5 que ya tienen imagen, y extraer `ProofSection.astro` al llegar a la tercera

---

## 6. Contexto

- Este patrón nació en las páginas de rol (`/para-quien/*`), donde funciona: las cuatro lo usan.
- La home ya **no** lleva capturas: el carrusel se sustituyó por el [mapa de plataforma](src/components/PlatformMap.astro). Sigue pendiente decidir si se recupera prueba visual allí — una captura grande bajo el mapa, o una por cada caso del mapa.
- Trazabilidad: [AUDITORIA_SITIO_WEB_2026-07.md](AUDITORIA_SITIO_WEB_2026-07.md), sección 1 (calidad de las imágenes) y sección 5 (prueba social).
