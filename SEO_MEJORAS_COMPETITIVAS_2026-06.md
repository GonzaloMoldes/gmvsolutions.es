# Roadmap SEO operativo y checklist validado en codigo

Fecha: 2026-06-06  
Proyecto: gmvsolutions.es / REELEVO  
Objetivo: ejecutar mejoras SEO competitivas solo con tareas previamente cotejadas contra el codigo actual.

## 1) Alcance auditado en codigo (fuente de verdad)

Validacion realizada sobre:

- src/pages/vs-alternativas.astro
- src/pages/vs-dozuki.astro
- src/pages/vs-poka.astro
- src/pages/vs-gembadocs.astro
- src/pages/vs-knowby.astro
- src/pages/vs-mes-tradicional.astro
- src/pages/vs-excel-papel.astro
- src/layouts/BaseLayout.astro
- src/lib/seo.ts
- src/pages/sitemap.xml.ts
- public/robots.txt

## 2) Checklist de estado actual (completadas vs pendientes)

### Tecnico SEO transversal

- [x] Organization JSON-LD global implementado.
- [x] Breadcrumb JSON-LD automatico implementado.
- [x] robots.txt declara sitemap.xml y sitemap-video.xml.
- [ ] lastmod dinamico por URL en sitemap (actualmente fijo global).

### Cluster comparativas (vs)

- [x] Todas las paginas vs existentes tienen schema base (ComparisonChart o CollectionPage).
- [x] Todas las paginas vs auditadas tienen bloque CTA final.
- [x] Humanizacion de cierres CTA aplicada en las vs principales.
- [ ] FAQPage schema en todas las vs (solo hay estructura parcial en vs-alternativas, no FAQPage completo).
- [ ] Estandar de enlaces internos BOFU consistente en todas las vs.

### Cobertura de intencion competitiva

- [x] Existen paginas por competidor: dozuki, poka, gembadocs, knowby.
- [x] Existen comparativas por categoria: mes tradicional y excel/papel.
- [ ] No existe aun cluster especifico por intencion de marca (precios, opiniones, alternativas por competidor).
- [ ] No existen aun nuevas landings por problema BOFU definidas en este plan.

## 3) Backlog de tareas especificas (cotejado y ejecutable)

## P0 - Sprint 1 (alto impacto, 0-2 semanas)

### T-001 - FAQPage en todas las comparativas vs
Estado: Pendiente

Accion:

- Anadir bloque FAQ visible y schema FAQPage en:
  - src/pages/vs-dozuki.astro
  - src/pages/vs-poka.astro
  - src/pages/vs-gembadocs.astro
  - src/pages/vs-knowby.astro
  - src/pages/vs-mes-tradicional.astro
  - src/pages/vs-excel-papel.astro
  - src/pages/vs-alternativas.astro (completar FAQPage, no solo CollectionPage/ItemList)

Criterio de cierre:

- Cada pagina incluye FAQs visibles en HTML.
- Cada pagina emite JSON-LD FAQPage valido.
- Build pasa sin errores.

### T-002 - Estandar de enlaces internos BOFU en todas las vs
Estado: Pendiente

Accion:

- Homogeneizar en el bloque final de cada vs al menos 4 enlaces:
  - /precios/
  - /casos-de-uso/onboarding-operarios/
  - /casos-de-uso/cobertura-bajas/
  - /para-quien/jefe-de-produccion/

Nota de validacion:

- Actualmente este patron esta fuerte en src/pages/vs-alternativas.astro, pero no uniforme en todas.

Criterio de cierre:

- Los 7 archivos vs tienen el mismo set minimo de enlaces BOFU.
- No hay enlaces rotos en build.

### T-003 - Snippets orientados a decision en todas las vs
Estado: Pendiente

Accion:

- Revisar y ajustar title y description en los 7 archivos vs para incluir:
  - contexto pyme industrial espanola,
  - criterio de decision (precio, implantacion, adopcion),
  - diferenciador concreto.

Criterio de cierre:

- No hay titulos duplicados entre vs.
- Descriptions sin duplicidad y alineadas a intencion BOFU.

## P1 - Sprint 2 (alto impacto, 2-4 semanas)

### T-004 - lastmod de sitemap no estatico
Estado: Pendiente

Accion:

- Actualizar src/pages/sitemap.xml.ts para dejar de usar un unico lastmod fijo.
- Opcion minima: lastmod por build.
- Opcion recomendada: fecha por URL desde fuente de contenido.

Nota de validacion:

- Hoy existe const lastmod fijo en src/pages/sitemap.xml.ts.

Criterio de cierre:

- lastmod deja de ser constante global.
- Build y endpoint /sitemap.xml correctos.

### T-005 - Landings BOFU por problema (no marca)
Estado: Pendiente

Accion:

- Crear 2 nuevas paginas con intencion BOFU real (rutas propuestas):
  - /alternativa-onboarding-operarios/
  - /software-sop-cobertura-bajas/

Nota:

- Estas rutas no existen en el repo actual (validado).

Criterio de cierre:

- Paginas creadas con schema, CTA y enlaces internos.
- Incluidas en sitemap y enlazadas desde comparativas.

### T-006 - Bloques de evidencia cuantificada en comparativas
Estado: Pendiente

Accion:

- Anadir en cada vs un bloque "evidencia" con supuestos claros:
  - tiempo de arranque,
  - esfuerzo de adopcion,
  - impacto operativo esperado,
  - escenario ETT/rotacion cuando aplique.

Criterio de cierre:

- 1 bloque de evidencia por cada archivo vs.
- Sin claims ambiguos sin contexto.

## P2 - Sprint 3 (4-8 semanas)

### T-007 - Refresh trimestral y control de canibalizacion
Estado: Pendiente

Accion:

- Crear checklist trimestral por URL vs:
  - title/description,
  - intencion principal,
  - enlazado interno,
  - fecha de ultima revision.

Criterio de cierre:

- Checklist operativo documentado.
- Primera pasada completada en todo el cluster vs.

### T-008 - Expansion semantica long-tail conectada a comparativas
Estado: Pendiente

Accion:

- Publicar 2 contenidos satelite y enlazar desde vs:
  - onboarding industrial,
  - transferencia de conocimiento o matriz de habilidades.

Criterio de cierre:

- 2 URLs nuevas publicadas e indexables.
- Enlaces bidireccionales con al menos 3 comparativas.

## 4) Roadmap de implementacion (calendario)

## Semana 1

- T-001 (FAQPage en 7 vs)
- T-002 (estandar enlaces BOFU)
- T-003 (snippets BOFU)

Entregable semana 1:

- Cluster vs con schema FAQ y enlazado interno uniforme.

## Semana 2

- T-004 (sitemap lastmod no estatico)
- T-006 (bloques de evidencia en vs)

Entregable semana 2:

- Mejora tecnica de frescura SEO + comparativas con prueba concreta.

## Semana 3

- T-005 (2 landings BOFU por problema)

Entregable semana 3:

- Nuevas rutas BOFU publicadas e integradas en enlazado y sitemap.

## Semana 4

- T-007 (checklist trimestral y canibalizacion)
- T-008 (2 satelites long-tail enlazados)

Entregable semana 4:

- Sistema de mantenimiento SEO + expansion semantica conectada a conversion.

## 5) KPI y control de avance

KPI objetivo a 90 dias:

- +30% impresiones no-marca en cluster comparativo.
- +20% CTR promedio en paginas /vs-*/.
- +15% clics organicos a paginas BOFU (vs + precios + casos de uso).
- 5-10 keywords competitivas en top 10.

Control semanal (check rapido):

- Numero de tareas cerradas por ID.
- Numero de URLs vs con FAQPage activo.
- Numero de URLs vs con set completo de enlaces BOFU.
- Estado de build despues de cada lote de cambios.

## 6) Registro de completadas (actualizable)

Completadas al 2026-06-06:

- [x] C-001 Organization + Breadcrumb sitewide activos.
- [x] C-002 Sitemaps declarados en robots.
- [x] C-003 Paginas vs base publicadas (competidor y categoria).
- [x] C-004 Cierres CTA humanizados en cluster vs principal.

Pendientes prioritarias:

- [ ] P-001 FAQPage en todo el cluster vs.
- [ ] P-002 Estandar BOFU de enlaces internos en todas las vs.
- [ ] P-003 lastmod no estatico en sitemap.
- [ ] P-004 Nuevas landings BOFU por problema.
