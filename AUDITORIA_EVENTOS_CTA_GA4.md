# Auditoria de eventos de conversion (CTA) - GA4 / GTM / Google Ads
## REELEVO - Entregable S1-C7 (Calendario Sprint 1)

Fecha: 2026-06-05
Trazabilidad: Calendario `S1-C7`, regla `[Copy 3.1]` (CTA principal por plantilla) y `Calendario 7` (medicion de negocio).
Fuente de verdad de CTA por URL: `MATRIZ_URL_INTENCION_SPRINT1.csv` (columna `cta_principal`).

---

## 1) Estado actual (lo que hay hoy)

Tags de medicion cargados en `src/layouts/BaseLayout.astro`:
- Google Tag Manager: `GTM-M223Z398` (head + noscript).
- Google Analytics 4 (gtag.js): `G-JJCZ6M3T8Y`.
- Google Ads: `AW-18000536518`.
- Cookiebot (consent mode, `data-blockingmode="auto"`).

Llamadas existentes:
```js
gtag('js', new Date());
gtag('config', 'G-JJCZ6M3T8Y');
gtag('config', 'AW-18000536518');
```

Conclusion: solo hay inicializacion (`config`). **No existe ni un solo evento de conversion** (`gtag('event', ...)`) ni `dataLayer.push` de negocio. Los `addEventListener` del codigo son de UI (carrusel, hamburguesa, acordeon FAQ, calculadora ROI), no de analitica.

---

## 2) Inventario de CTAs (destinos reales)

| Accion | Destino | Donde aparece | Etiquetas detectadas |
|---|---|---|---|
| Registro (conversion principal) | `https://app.gmvsolutions.es/registro` | ~45 paginas (hero + cierre) y Header | "Registrarme en REELEVO", "Registrarse gratis", "Empezar en REELEVO", "Comenzar", "Registrate en REELEVO", "Registrarse en REELEVO", "Registrarme en REELEVO →", "Comenzar" |
| Diagnostico / calculadora (lead) | `https://diagnostico.gmvsolutions.es` | Solo Header (desktop + movil) | "Evaluar mi situacion" / "Diagnostico" |
| Contacto comercial (lead) | `mailto:hola@gmvsolutions.es` | `/precios` (Enterprise), `/sobre-nosotros` | "Hablar con nosotros" |
| Calculadora ROI (microconversion) | interna (JS en pagina) | `/precios`, `/como-funciona` | inputs `calcRoi` |

Clases CSS de CTA: `btn-primary`, `btn-ghost`, `btn-secondary`, `header-cta`.

---

## 3) Hallazgos y gaps

1. **Sin eventos = sin medicion de conversion.** Hoy no se puede saber cuantos clics a "Registrarme" hay por pagina, ni alimentar Google Ads con conversiones reales. El pixel de Ads (`AW-...`) esta cargado pero no dispara ninguna `conversion`.
2. **Etiquetas de CTA inconsistentes** para el mismo destino (8+ variantes de /registro). Rompe la consistencia de marca y dificulta el analisis por etiqueta.
3. **Desalineacion con la matriz.** La matriz define CTA principal por URL (p. ej. "Evaluar mi situacion" para roles, "Ver planes" en /precios, "Solicitar demo" en capacidades, "Ver caso" en casos de uso, "Descargar plantilla" en blog). En el cuerpo de la mayoria de paginas **solo existe "Registrarme"**; el CTA que la matriz marca como principal no esta implementado, por lo que no es medible.
4. **CTA secundario (diagnostico) atrapado en el Header.** La matriz lo pide como CTA principal en varias landings de rol; no esta en el cuerpo de esas paginas.
5. **Sin identificadores en los CTAs.** No hay `data-*` que permitan distinguir ubicacion (hero/cuerpo/cierre/header), tipo de pagina o intencion de la accion.
6. **Lead magnets aun inexistentes** (Sprints 4-5): conviene dejar el evento `file_download` definido desde ya para no re-tocar despues.
7. **Consent mode**: con Cookiebot en `auto`, los eventos deben respetar el consentimiento. La medicion ya depende de ello; los nuevos eventos heredan ese comportamiento.

---

## 4) Taxonomia de eventos propuesta (GA4 + Ads via GTM)

Modelo: cada CTA hace `dataLayer.push` de un evento normalizado. GTM enruta a GA4 (evento) y, para las acciones de conversion, a Google Ads (conversion). Asi se centraliza el control sin tocar el codigo de nuevo.

| Evento (GA4) | Cuando se dispara | Parametros | Conversion Ads | Marcar conversion GA4 |
|---|---|---|---|---|
| `cta_click` | Clic en cualquier `[data-cta]` | `cta_id`, `cta_label`, `cta_location` (header/hero/body/pricing/footer), `cta_intent` (registro/diagnostico/demo/contacto/descarga), `cta_destination`, `page_path`, `page_type` (de la matriz) | No (generico) | No |
| `generate_lead` | Clic en CTA de intencion `registro`, `diagnostico`, `demo` o `contacto` | mismos params + `lead_type` | **Si** | Si |
| `file_download` | Clic en lead magnet (plantilla, checklist) | `file_name`, `file_extension`, `cta_location`, `page_path` | Opcional | Si |
| `view_pricing` | Llegada/scroll a tabla de precios en `/precios` | `page_path` | No | No |
| `roi_calculated` | Uso de la calculadora ROI | `roi_value` (rango), `page_path` | No | Recomendado |

Notas:
- `generate_lead` es un evento recomendado de GA4: usarlo da mejor modelado y compatibilidad con Ads.
- `page_type` se toma de la columna `tipo` de la matriz (core/capacidad/comparativa/rol/caso_uso/sector/blog/legal) para segmentar conversion por plantilla (cumple "CTA principal por plantilla" de S1-C7).
- Distinguir `cta_intent` permite separar la conversion "dura" (registro) de la "blanda" (diagnostico/contacto).

---

## 5) Modelo de implementacion recomendado

Enfoque de minimo mantenimiento para un sitio estatico Astro: **un unico listener delegado global** + atributos `data-cta-*` en los enlaces.

### 5.1 Marcado en los CTAs (en cada `<a>`)
```html
<a href="https://app.gmvsolutions.es/registro"
   class="btn-primary"
   data-cta
   data-cta-intent="registro"
   data-cta-location="hero"
   data-cta-label="Registrarme en REELEVO">
   Registrarme en REELEVO
</a>
```
- `data-cta` marca el elemento como rastreable.
- `data-cta-intent` clasifica la accion (deriva si es `generate_lead`).
- `data-cta-location` indica el bloque (hero/body/pricing/footer/header).
- `data-cta-label` etiqueta canonica (alineada con `cta_principal` de la matriz).

### 5.2 Listener global (una vez, en BaseLayout o un componente Analytics)
```js
// Delegado: captura clics en cualquier [data-cta] sin tocar cada pagina.
document.addEventListener('click', (e) => {
  const cta = e.target.closest('[data-cta]');
  if (!cta) return;
  const intent = cta.dataset.ctaIntent || 'otro';
  const payload = {
    cta_id: cta.id || null,
    cta_label: cta.dataset.ctaLabel || cta.textContent.trim(),
    cta_location: cta.dataset.ctaLocation || 'body',
    cta_intent: intent,
    cta_destination: cta.getAttribute('href'),
    page_path: location.pathname,
    page_type: document.body.dataset.pageType || null,
  };
  window.dataLayer = window.dataLayer || [];
  // Evento generico
  window.dataLayer.push({ event: 'cta_click', ...payload });
  // Evento de lead para intenciones de conversion
  if (['registro', 'diagnostico', 'demo', 'contacto'].includes(intent)) {
    window.dataLayer.push({ event: 'generate_lead', lead_type: intent, ...payload });
  }
});
```
- `page_type` se expone como `data-page-type` en `<body>` (lo aporta BaseLayout desde una prop, mapeable a la columna `tipo` de la matriz).

### 5.3 Configuracion en GTM (no requiere mas codigo)
- Trigger "Custom Event" = `cta_click` -> GA4 Event tag `cta_click` con los parametros.
- Trigger "Custom Event" = `generate_lead` -> GA4 Event tag `generate_lead` (marcar como conversion) + Google Ads Conversion tag (`AW-18000536518`, accion "Lead").
- Variables de capa de datos para cada parametro (`cta_intent`, `cta_location`, etc.).

---

## 6) Mapeo CTA principal -> evento (alineado con la matriz)

| tipo de pagina (matriz) | CTA principal (matriz) | intent | Evento de conversion |
|---|---|---|---|
| core `/` | Registrarme | registro | `generate_lead` |
| core `/precios` | Ver planes -> Registrarme | registro | `generate_lead` |
| core `/como-funciona` | Evaluar mi situacion | diagnostico | `generate_lead` |
| comparativa `/vs-*` | Comparar / Registrarme | registro | `generate_lead` |
| rol `/para-quien/*` | Evaluar mi situacion | diagnostico | `generate_lead` |
| capacidad | Solicitar demo | demo | `generate_lead` |
| caso_uso | Ver caso -> Registrarme | registro | `generate_lead` |
| sector | Evaluar mi situacion | diagnostico | `generate_lead` |
| blog | Descargar plantilla | descarga | `file_download` |

---

## 7) Plan de implementacion (checklist)

Base tecnica (habilita S2-T5 "verificar eventos CTA"):
- [ ] Crear componente/inline script de analitica con el listener delegado global.
- [ ] Exponer `data-page-type` en `<body>` desde BaseLayout (prop `pageType`).
- [ ] Anadir `data-cta` + `data-cta-intent` + `data-cta-location` + `data-cta-label` a los CTAs de las 4 paginas core (Sprint 2).
- [ ] Unificar etiquetas de CTA de /registro a una sola canonica por contexto.

Configuracion GTM/GA4/Ads (tarea de marketing, fuera del repo):
- [ ] Crear variables de dataLayer para los parametros.
- [ ] Crear GA4 event tags `cta_click` y `generate_lead`.
- [ ] Marcar `generate_lead` (y `file_download`) como conversion en GA4.
- [ ] Crear Google Ads Conversion tag enlazada a `generate_lead`.
- [ ] Validar consent mode (Cookiebot) sobre los nuevos eventos.

Validacion:
- [ ] GTM Preview: comprobar que cada CTA core dispara `cta_click` (+ `generate_lead` donde aplica) con parametros correctos.
- [ ] GA4 DebugView: ver eventos en tiempo real con `cta_location` y `page_type`.
- [ ] Registrar en el dashboard semanal (S1-C6) los eventos como columnas de conversion.

---

## 8) Resumen ejecutivo

- Hoy: 0 eventos de conversion pese a tener GA4 + Ads + GTM listos.
- Riesgo: se esta optimizando conversion (Sprints 2-6) sin poder medirla; Google Ads no recibe conversiones.
- Accion minima de alto impacto: implementar el listener delegado + atributos `data-cta` (empezando por las 4 core en Sprint 2) y crear las 2 GA4 event tags en GTM.
- Resultado: medicion de "CTA principal por plantilla" alineada con la matriz, lista para alimentar el dashboard semanal y las conversiones de Ads.
