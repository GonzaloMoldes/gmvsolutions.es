# Roadmap de Implementación Website REELEVO
## Junio 2026 - Diciembre 2026

Objetivo del roadmap:
- Ejecutar la simplificación de contenidos y la mejora SEO/CRO del sitio.
- Posicionar REELEVO como "plataforma operativa para pyme industrial española" frente a Mapex (MES) y Azumuta (connected-worker enterprise).
- Traducir estrategia en entregables semanales, responsables, KPIs y criterios de salida.

---

## 1. Principios estratégicos (base de ejecución)

1. Una intención principal por URL.
2. Una CTA principal por página comercial.
3. Máximo 5 H2 en páginas comerciales.
4. Mensaje por categoría:
- Sin complejidad MES.
- Español nativo + contexto pyme España.
- Precio transparente por empresa.
5. Priorizar tráfico BOFU/MOFU y long-tail en español donde Mapex/Azumuta son más débiles.
6. Evitar canibalización entre /blog y /recursos con regla canónica por clúster.

---

## 2. Objetivos y métricas

### 2.1 Objetivos de negocio (90-180 días)
- +20% clics a CTA principal en páginas optimizadas.
- +15% ratio visita cualificada -> lead.
- Reducir tiempo a primer CTA visible a < 1 scroll en páginas BOFU.

### 2.2 Objetivos SEO (90-180 días)
- +15% CTR orgánico en URLs reescritas.
- +20% impresiones en clúster de comparativas y capacidades.
- Disminución de consultas canibalizadas /blog vs /recursos.
- Cobertura sitemap >= 95% de URLs indexables reales.

### 2.3 Objetivos de autoridad
- Publicación en 4 directorios (Capterra, GetApp, G2, SoftwareDoIt).
- 15-25 backlinks cualificados del ecosistema industrial español en 6 meses.

---

## 3. Modelo operativo

Equipo mínimo:
- SEO Strategist (owner de intención, arquitectura, GSC, canibalización).
- Content Lead (owner editorial y calidad de mensaje).
- Editor/Copy (reescritura y assets de contenido).
- Frontend Astro (implementación técnica, schema, CWV, plantillas).
- Growth/Partnerships (directorios, backlinks, PR sectorial).

Ritmo:
- Sprints de 2 semanas.
- Ceremonias: planning, daily corto, demo interna, retro.
- Gobernanza: checklist de publicación obligatoria por URL.

Definition of Done por página comercial:
- H1 único + keyword principal literal.
- Meta title (50-60), meta description (140-155).
- Hero: titular <= 11 palabras, subtítulo <= 22, 3 bullets, CTA principal clara.
- Max 5 H2 y 60-90 palabras por sección.
- 1 prueba por sección (dato/captura/ejemplo).
- Enlazado interno al clúster y schema válido.

---

## 4. Roadmap por fases

## Fase 0 (Semana 1): Preparación, control y baseline

Objetivo:
- Tener una base medible y sin deuda crítica de inventario.

Entregables:
1. Matriz maestra URL -> intención -> keyword primaria/secundaria -> CTA principal.
2. Inventario real de URLs vs sitemap publicado (gap report).
3. Baseline de KPIs en GSC/GA4 (CTR, impresiones, clics, leads por URL).
4. Guía editorial corta obligatoria (1 página) y plantilla de página comercial.

Dependencias:
- Acceso completo a GSC, GA4 y CMS/repo.

KPIs salida fase:
- 100% URLs activas con intención y CTA asignada.
- Reporte sitemap con plan de corrección priorizado.

---

## Fase 1 (Semanas 2-4): BOFU crítico y mensaje de categoría

Objetivo:
- Reducir fricción en páginas de decisión y clarificar posicionamiento competitivo.

Alcance URLs (ola de máximo impacto):
- /
- /como-funciona
- /precios
- /vs-alternativas
- /para-quien/gerente-propietario
- /para-quien/responsable-rrhh

Implementación:
1. Reescritura corta (recorte 30-45% según URL) y estructura 5 H2.
2. Refuerzo explícito del diferencial:
- Ligero para pyme.
- Sin complejidad MES.
- Precio por empresa visible.
3. Optimización de snippets SEO y enlaces internos.
4. QA CRO: primer CTA visible en <= 1 scroll.

KPIs salida fase:
- Reducción media copy visible >= 30%.
- +10% CTR orgánico inicial en páginas intervenidas (tendencia 4-6 semanas).
- Mejor tasa de clic a CTA principal en el grupo intervenido.

---

## Fase 2 (Semanas 5-8): Páginas por rol, capacidades y casos de uso

Objetivo:
- Convertir navegación en argumentos concretos por escenario de compra.

Alcance:
- Páginas por rol restantes:
  - /para-quien/jefe-de-produccion
  - /para-quien/responsable-calidad
- Capacidades (8 prioritarias):
  - /documentacion-procesos
  - /gestion-competencias
  - /control-produccion
  - /cobertura-turnos
  - /mantenimiento
  - /kaizen
  - /workflows
  - /api-integraciones
- Casos de uso (4):
  - /casos-de-uso/cobertura-bajas
  - /casos-de-uso/onboarding-operarios
  - /casos-de-uso/personal-ett
  - /casos-de-uso/transferencia-conocimiento

Implementación:
1. Patrón fijo por URL: problema -> solución en 3 pasos -> resultado -> qué incluye/no incluye -> CTA.
2. Microcaso real de 3 líneas en cada página de rol.
3. Enlaces cruzados capacidad <-> caso de uso.
4. Limpieza de solapamientos semánticos onboarding/competencias/SOP.

KPIs salida fase:
- 100% páginas intervenidas con mensaje único y sin solapamiento evidente.
- Mejora CTR interno hacia demo/diagnóstico.
- Reducción de rebote relativo en grupo optimizado.

---

## Fase 3 (Semanas 9-12): Comparativas, sectores y consolidación técnica SEO

Objetivo:
- Capturar intención comparativa de alta conversión y cerrar deuda técnica de indexación.

Alcance:
- Comparativas:
  - /vs-dozuki
  - /vs-gembadocs
  - /vs-knowby
  - /vs-poka
- Sectores:
  - /sectores/alimentacion
  - /sectores/mecanizado-cnc
- Técnico:
  - sitemap completo
  - canonical por clúster
  - schema y breadcrumbs

Implementación:
1. Tabla comparativa estandarizada en 5 criterios fijos.
2. Enfoque comparativo honesto orientado a pyme España.
3. Regla canónica /blog vs /recursos por temática espejo.
4. Validación de schema:
- SoftwareApplication/Product en páginas de producto.
- FAQPage solo donde aplique.
- Article en blog.
- BreadcrumbList en indexables.

KPIs salida fase:
- Cobertura sitemap >= 95% URLs indexables.
- Reducción de URLs excluidas por duplicidad/canonical incorrecta.
- Mejora CTR en cluster comparativas.

---

## Fase 4 (Meses 4-6): Autoridad, contenido pilar y moat competitivo

Objetivo:
- Construir autoridad y capturar long-tail defensible en español nativo.

Bloques de trabajo:
1. Páginas pilar (3 iniciales):
- Guía digitalización de planta para pyme industrial española.
- Matriz de competencias (guía + plantilla Excel).
- Cómo cubrir bajas y picos sin parar la línea.

2. Cluster "España" (diferenciador competitivo):
- Kit Digital / ayudas digitalización / contexto pyme española.

3. Lead magnets:
- Plantilla matriz competencias.
- Checklist onboarding operario.
- Plantilla SOP básica.

4. Autoridad externa:
- Alta en directorios (4/4).
- Campaña backlinks con asociaciones, clusters, prensa sectorial.
- Caso de éxito de Galicia con métricas verificables.

KPIs salida fase:
- 3 pilares indexados y con crecimiento sostenido de impresiones.
- 4 directorios activos.
- 15-25 backlinks cualificados.
- Primeras keywords long-tail en top 10/20 según baseline.

---

## 5. Plan de sprints detallado (12 semanas)

## Sprint 1 (Semanas 1-2)
- Matriz intención-keyword-CTA para todas las URLs.
- Auditoría titles/H1/descriptions.
- Inventario URLs vs sitemap.
- Plantilla editorial comercial + checklist QA.

## Sprint 2 (Semanas 3-4)
- Reescritura y publicación: /, /como-funciona, /precios, /vs-alternativas.
- Ajustes snippets + interlinking.
- QA de primer CTA visible.

## Sprint 3 (Semanas 5-6)
- Reescritura: /para-quien/gerente-propietario, /para-quien/responsable-rrhh, /para-quien/jefe-de-produccion, /para-quien/responsable-calidad.
- Microcasos por rol.

## Sprint 4 (Semanas 7-8)
- Reescritura 8 capacidades + 4 casos de uso.
- Enlazado capacidad <-> caso.
- Limpieza de solapamientos semánticos.

## Sprint 5 (Semanas 9-10)
- Comparativas: /vs-dozuki, /vs-gembadocs, /vs-knowby, /vs-poka.
- Sectores: /sectores/alimentacion, /sectores/mecanizado-cnc.
- Estandarización comparativa 5 criterios.

## Sprint 6 (Semanas 11-12)
- Consolidación /blog y /recursos.
- Canonical por clúster + breadcrumbs + schema.
- Validación final sitemap/indexación y reporte before/after.

---

## 6. Backlog priorizado

P0 (inmediato)
- Páginas BOFU críticas (home, como-funciona, precios, vs-alternativas).
- Páginas por rol más extensas (gerente, RRHH).
- Inventario sitemap y corrección de cobertura.
- Matriz intención-keyword-CTA global.

P1
- Capacidades y casos de uso.
- Comparativas y sectores.
- Canonical y consolidación /blog vs /recursos.

P2
- Páginas pilar y lead magnets.
- Directorios y backlinks sectoriales.
- Iteración avanzada de schema/CWV.

---

## 7. Dependencias y riesgos

Riesgos principales:
1. Falta de disciplina editorial: volver al copy largo.
2. Canibalización por coexistencia /blog y /recursos sin regla canónica estricta.
3. Cuello de botella en copy/aprobación legal.
4. Retraso en autoridad externa (backlinks/directorios) y prueba social.

Mitigaciones:
1. Checklist de publicación obligatorio + rechazo automático si no cumple.
2. Owner único de taxonomía y canonical.
3. SLA de revisión legal para páginas legales y claims sensibles.
4. Pipeline mensual de partnerships/PR con objetivo mínimo de enlaces.

---

## 8. Cuadro RACI simplificado

- SEO Strategist: matriz intención, arquitectura, interlinking, canibalización, GSC.
- Content Lead: narrativa por categoría, QA editorial, consistencia de voz.
- Editor/Copy: reescrituras por lote, snippets, assets de contenido.
- Frontend Astro: implementación, schema, breadcrumbs, sitemap, CWV.
- Growth/Partnerships: directorios, backlinks, PR y prueba social.
- Dirección: priorización final, aprobación de claims y recursos.

---

## 9. Dashboard mínimo semanal

Métricas por URL clusterizada:
1. Impresiones orgánicas.
2. CTR orgánico.
3. Posición media.
4. Clics en CTA principal.
5. Leads generados por plantilla de página.
6. Estado indexación (enviada/indexada/excluida).

Cadencia:
- Weekly: seguimiento operativo.
- Monthly: revisión estratégica y reasignación de backlog.
- Quarterly: auditoría de canibalización y update de matriz keyword-intención.

---

## 10. Criterio de éxito final

Se considera ejecución exitosa cuando:
1. Cada URL comercial comunica una sola promesa principal y un siguiente paso claro en < 10 segundos.
2. No hay solapamientos críticos de intención entre páginas hermanas.
3. El sitio gana tracción orgánica en long-tail español de pyme industrial (donde Mapex/Azumuta son más débiles).
4. La operación editorial puede mantener calidad y consistencia sin rehacer arquitectura cada trimestre.
