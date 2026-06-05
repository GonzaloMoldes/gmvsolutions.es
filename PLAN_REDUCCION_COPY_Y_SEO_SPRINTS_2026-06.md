# Plan Maestro de Simplificación de Contenidos + SEO
## REELEVO (junio 2026)

Autor: Consultoría senior web + SEO (30+ años)
Fecha: 2026-06-05
Objetivo: hacer la web más escueta, específica y orientada a intención de búsqueda y conversión.

---

## 1) Resumen ejecutivo

El sitio tiene una base sólida de arquitectura temática, pero está sobreextendido en copy en muchas páginas clave.

Diagnóstico rápido (medición por archivos Astro):
- 53 páginas activas.
- Varias páginas de alto impacto superan 900 líneas (home, pricing, para-quién, comparativas).
- Muchas landings de producto tienen 6-9 secciones H2: demasiado para lectura ejecutiva y para usuarios de escaneo rápido.

Decisión estratégica recomendada:
- Reescribir el sitio bajo un modelo de mensaje corto por bloques, con promesa concreta por página.
- Limitar cada página comercial a una intención principal y una CTA principal.
- Separar claramente: páginas de conversión (cortas), páginas de consideración (medias), páginas SEO editorial (largas pero altamente estructuradas).

Impacto esperado en 90 días:
- Mejora de legibilidad y scroll-depth útil en páginas BOFU/MOFU.
- Mejor alineación intención-keyword por URL.
- Incremento de CTR orgánico por snippets más directos.
- Mejor conversión en CTAs por menor ruido narrativo.

---

## 2) Problemas raíz detectados

1. Exceso de texto en páginas comerciales
- Se fuerza explicación larga donde el usuario solo necesita: problema, solución, prueba, siguiente paso.

2. Mezcla de intenciones en la misma URL
- Varias páginas intentan educar, comparar y vender a la vez.

3. Jerarquía visual y semántica extensa
- Muchas páginas con demasiados H2 para una decisión rápida.

4. Riesgo de canibalización temática
- Onboarding, competencias y SOP aparecen en múltiples URLs con foco similar.

5. CTA principal no siempre dominante
- Hay páginas con múltiples caminos simultáneos sin jerarquía clara.

---

## 3) Nuevo estándar editorial (obligatorio)

### 3.1 Reglas de copy corto por tipo de página

A. Página comercial principal (home, producto, comparativas, para-quién)
- Meta title: 50-60 caracteres.
- Meta description: 140-155 caracteres.
- Hero:
  - 1 titular (máx 11 palabras).
  - 1 subtítulo (máx 22 palabras).
  - 3 bullets de valor (máx 9 palabras cada uno).
  - 1 CTA principal + 1 secundaria.
- Cuerpo:
  - 4-5 secciones H2 máximo.
  - 60-90 palabras por sección.
  - 1 prueba por sección (dato, captura, ejemplo o proceso).

B. Página de caso de uso
- 4 secciones H2 máximo:
  - Escenario
  - Cómo se resuelve
  - Resultado esperado
  - Implementación en 3 pasos

C. Página de blog SEO
- Mantener extensión larga, pero con:
  - Resumen ejecutivo arriba (TL;DR).
  - Índice anclado.
  - Párrafos de 2-4 líneas.
  - Cajas de síntesis cada 2 secciones.

### 3.2 Patrón de estructura único (comercial)

1. Qué problema resuelve esta página.
2. Cómo lo resuelve REELEVO (en 3 pasos).
3. Qué cambia en operación (resultado medible).
4. Qué incluye y qué no incluye.
5. CTA final único.

---

## 4) Reglas SEO transversales

1. Una intención principal por URL.
2. Un H1 único y literal con keyword principal.
3. Evitar repetir exactamente el mismo enfoque entre páginas hermanas.
4. Enlazado interno en clúster:
- Hub (tema)
- Hijo (caso o rol)
- Soporte (blog)

5. Esquemas recomendados:
- Product/SoftwareApplication en páginas producto.
- FAQPage solo donde haya preguntas reales.
- Article en blog.
- BreadcrumbList en todas las páginas indexables.

6. Gestión de canibalización:
- Definir keyword primaria y secundarias por página en una matriz de control.
- Revisar trimestralmente Search Console por consultas solapadas.

### Hallazgos técnicos críticos detectados

1. Cobertura parcial del sitemap
- El sitemap actual no refleja todas las URLs activas del árbol de páginas. Hay riesgo de indexación incompleta en páginas nuevas o de soporte.

2. Duplicidad de rutas blog/recursos
- Existen contenidos equivalentes en /blog/* y /recursos/* que pueden repartirse señales SEO si no se consolidan con canonical y enlazado explícito.

3. Riesgo de priorización desalineada
- Hay URLs largas y estratégicas fuera del foco principal de rastreo en comparación con páginas de menor intención comercial.

Acción técnica prioritaria:
- Sprint 1: reconciliar inventario real de URLs vs sitemap publicado.
- Sprint 2: definir regla canónica por clúster (fuente principal + página resumen).
- Sprint 3: validar cobertura en Search Console (URLs enviadas, indexadas y excluidas).

---

## 5) Propuesta de cambios página por página (todas las páginas)

Formato:
- Enfoque nuevo: qué debe decir esa página en una frase.
- Recorte recomendado: cuánto reducir contenido visible.
- Acción SEO: ajuste de keyword/intención.

### 5.1 Páginas core del sitio

1. / (index.astro)
- Enfoque nuevo: Plataforma operativa para continuidad en planta, no solo onboarding.
- Recorte recomendado: -35% del cuerpo actual.
- Acción SEO: keyword principal "software operaciones planta industrial"; secundarias "documentación operativa", "continuidad operativa".

2. /como-funciona (como-funciona.astro)
- Enfoque nuevo: proceso de uso en 3 pasos reales.
- Recorte recomendado: -40% y dejar 5 secciones máximo.
- Acción SEO: keyword principal "cómo funciona REELEVO" + entidad de marca.

3. /precios (precios.astro)
- Enfoque nuevo: planes por nivel de operación, no lista extensa de features.
- Recorte recomendado: -30% copy, mantener tabla clara.
- Acción SEO: keyword principal "precio software SOP industrial".

4. /por-que-usar-reelevo (por-que-usar-reelevo.astro)
- Enfoque nuevo: diferenciación en 5 puntos comparables.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "por qué usar REELEVO" + semántica de alternativa.

5. /sobre-nosotros (sobre-nosotros.astro)
- Enfoque nuevo: credibilidad, método, compromiso de implementación.
- Recorte recomendado: -30%.
- Acción SEO: reforzar E-E-A-T con hitos verificables.

6. /video-demo (video-demo.astro)
- Enfoque nuevo: demo real o CTA inequívoca a demo guiada.
- Recorte recomendado: -20% texto explicativo redundante.
- Acción SEO: VideoObject válido solo si el video existe y se reproduce.

7. /recursos (recursos.astro)
- Enfoque nuevo: hub editorial con filtros por problema.
- Recorte recomendado: -25% copy de introducción.
- Acción SEO: keyword principal "recursos documentación operativa industrial".

8. /faqs (faqs.astro)
- Enfoque nuevo: respuestas cortas por bloque temático.
- Recorte recomendado: -35% (respuesta larga a respuesta directa).
- Acción SEO: FAQ schema solo para preguntas visibles e indexables.

9. /onboarding-software-pymes (onboarding-software-pymes.astro)
- Enfoque nuevo: landing BOFU de onboarding industrial para pyme.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "onboarding software pymes industriales".

### 5.2 Páginas de producto/capacidades

10. /documentacion-procesos (documentacion-procesos.astro)
- Enfoque nuevo: SOP útil en puesto de trabajo.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "documentación de procesos industriales".

11. /gestion-competencias (gestion-competencias.astro)
- Enfoque nuevo: mapa de competencias operativas con evidencia.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "gestión de competencias industriales".

12. /calidad-y-conformidad (calidad-y-conformidad.astro)
- Enfoque nuevo: evidencia operativa para auditoría interna.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "trazabilidad operativa calidad industrial".

13. /cobertura-turnos (cobertura-turnos.astro)
- Enfoque nuevo: detectar huecos de cobertura antes del turno.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "cobertura de turnos producción".

14. /control-produccion (control-produccion.astro)
- Enfoque nuevo: visibilidad diaria de producción en tiempo real.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "control de producción pyme industrial".

15. /mantenimiento (mantenimiento.astro)
- Enfoque nuevo: mantenimiento operativo integrado al trabajo real.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "mantenimiento preventivo y correctivo industrial".

16. /kaizen (kaizen.astro)
- Enfoque nuevo: mejora continua capturada y ejecutada.
- Recorte recomendado: -35%.
- Acción SEO: keyword principal "kaizen digital planta industrial".

17. /workflows (workflows.astro)
- Enfoque nuevo: flujos operativos con control de aprobación.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "workflows operativos industriales".

18. /portal-operario (portal-operario.astro)
- Enfoque nuevo: punto único de acceso para ejecución del operario.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "portal del operario industrial".

19. /firma-digital (firma-digital.astro)
- Enfoque nuevo: firma operativa y trazabilidad del acto.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "firma digital operativa industrial".

20. /modo-offline (modo-offline.astro)
- Enfoque nuevo: continuidad operativa con conectividad limitada.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "software industrial modo offline".

21. /api-integraciones (api-integraciones.astro)
- Enfoque nuevo: conectividad con ecosistema existente sin fricción.
- Recorte recomendado: -35%.
- Acción SEO: keyword principal "API software industrial".

22. /integracion-m365 (integracion-m365.astro)
- Enfoque nuevo: explotación de datos de planta en stack Microsoft.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "integración Power BI planta industrial".

23. /obras-trazabilidad (obras-trazabilidad.astro)
- Enfoque nuevo: trazabilidad por obra/proyecto/pieza.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "trazabilidad industrial por obra".

### 5.3 Comparativas

24. /vs-alternativas (vs-alternativas.astro)
- Enfoque nuevo: comparador resumido + selector por caso.
- Recorte recomendado: -40%.
- Acción SEO: keyword principal "alternativas a software SOP industrial".

25. /vs-dozuki (vs-dozuki.astro)
- Enfoque nuevo: comparación en 5 criterios operativos.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "REELEVO vs Dozuki".

26. /vs-gembadocs (vs-gembadocs.astro)
- Enfoque nuevo: diferencias para pyme industrial española.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "REELEVO vs GembaDocs".

27. /vs-knowby (vs-knowby.astro)
- Enfoque nuevo: comparación en adopción operativa real.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "REELEVO vs Knowby".

28. /vs-poka (vs-poka.astro)
- Enfoque nuevo: comparación por escalabilidad y contexto pyme.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "REELEVO vs Poka".

### 5.4 Páginas por rol

29. /para-quien/gerente-propietario (gerente-propietario.astro)
- Enfoque nuevo: continuidad del negocio y riesgo operativo.
- Recorte recomendado: -45% (actual muy extensa).
- Acción SEO: keyword principal "software operaciones pyme industrial".

30. /para-quien/jefe-de-produccion (jefe-de-produccion.astro)
- Enfoque nuevo: visibilidad de turno, carga y desvíos.
- Recorte recomendado: -40%.
- Acción SEO: keyword principal "herramienta jefe de producción".

31. /para-quien/responsable-rrhh (responsable-rrhh.astro)
- Enfoque nuevo: onboarding operativo y curva de autonomía.
- Recorte recomendado: -45%.
- Acción SEO: keyword principal "onboarding operarios RRHH industrial".

32. /para-quien/responsable-calidad (responsable-calidad.astro)
- Enfoque nuevo: evidencia de ejecución y conformidad verificable.
- Recorte recomendado: -30%.
- Acción SEO: keyword principal "software calidad operativa industrial".

### 5.5 Casos de uso

33. /casos-de-uso/cobertura-bajas (cobertura-bajas.astro)
- Enfoque nuevo: sustitución sin caída de ritmo.
- Recorte recomendado: -20%.
- Acción SEO: keyword principal "cubrir bajas en planta industrial".

34. /casos-de-uso/onboarding-operarios (onboarding-operarios.astro)
- Enfoque nuevo: incorporación estandarizada en puesto.
- Recorte recomendado: -20%.
- Acción SEO: keyword principal "onboarding operarios planta".

35. /casos-de-uso/personal-ett (personal-ett.astro)
- Enfoque nuevo: productividad temprana de personal temporal.
- Recorte recomendado: -20%.
- Acción SEO: keyword principal "onboarding personal ETT industrial".

36. /casos-de-uso/transferencia-conocimiento (transferencia-conocimiento.astro)
- Enfoque nuevo: capturar conocimiento crítico antes de fuga.
- Recorte recomendado: -20%.
- Acción SEO: keyword principal "transferencia de conocimiento industrial".

### 5.6 Sectores

37. /sectores/alimentacion (alimentacion.astro)
- Enfoque nuevo: estandarización y trazabilidad para alimentación.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "software SOP industria alimentaria".

38. /sectores/mecanizado-cnc (mecanizado-cnc.astro)
- Enfoque nuevo: continuidad operativa en mecanizado CNC.
- Recorte recomendado: -25%.
- Acción SEO: keyword principal "software operaciones mecanizado CNC".

### 5.7 Blog (hijo de /blog)

39. /blog (blog/index.astro)
- Enfoque nuevo: índice claro por intención (SOP, onboarding, competencias, absentismo).
- Recorte recomendado: -20%.
- Acción SEO: fortalecer taxonomía y breadcrumbs.

40. /blog/coste-absentismo-pymes-industriales
- Enfoque nuevo: impacto económico + plantilla de cálculo.
- Recorte recomendado: mantener longitud, mejorar síntesis.
- Acción SEO: keyword principal "coste absentismo pyme industrial".

41. /blog/crisis-perdida-conocimiento-planta-industrial
- Enfoque nuevo: diagnóstico + plan 90 días.
- Recorte recomendado: mantener longitud, añadir resumen ejecutivo.
- Acción SEO: keyword principal "pérdida de conocimiento en planta".

42. /blog/documentar-conocimiento-operarios-expertos
- Enfoque nuevo: método de captura en 4 fases.
- Recorte recomendado: mantener longitud, cortar redundancia.
- Acción SEO: keyword principal "documentar conocimiento operarios expertos".

43. /blog/gestion-competencias-industria
- Enfoque nuevo: guía práctica con matriz accionable.
- Recorte recomendado: -20%.
- Acción SEO: keyword principal "gestión de competencias industria".

44. /blog/onboarding-software-pymes
- Enfoque nuevo: guía de compra + ROI realista.
- Recorte recomendado: -20%.
- Acción SEO: keyword principal "onboarding software pymes".

45. /blog/onboarding-vs-tradicional
- Enfoque nuevo: comparativa ejecutiva con decisión por escenario.
- Recorte recomendado: -30% (actual muy extensa).
- Acción SEO: keyword principal "onboarding software vs tradicional".

46. /blog/que-es-un-sop-industrial
- Enfoque nuevo: definición + plantilla + ejemplo práctico.
- Recorte recomendado: mantener longitud, mejorar estructura escaneable.
- Acción SEO: keyword principal "qué es un SOP industrial".

### 5.8 Recursos (subrutas)

47. /recursos/gestion-competencias-industria (recursos/gestion-competencias-industria.astro)
- Enfoque nuevo: landing resumen que envía a versión completa.
- Recorte recomendado: -25%.
- Acción SEO: evitar canibalización con /blog/gestion-competencias-industria.

48. /recursos/onboarding-software-pymes (recursos/onboarding-software-pymes.astro)
- Enfoque nuevo: hub de recursos onboarding, no artículo duplicado.
- Recorte recomendado: -25%.
- Acción SEO: canonical y diferenciación de intención frente a /blog/onboarding-software-pymes.

49. /recursos/onboarding-vs-tradicional (recursos/onboarding-vs-tradicional.astro)
- Enfoque nuevo: resumen comparativo + CTA a artículo largo.
- Recorte recomendado: -20%.
- Acción SEO: consolidar intención con canonical claro.

50. /recursos/[slug] (recursos/[slug]/.astro)
- Enfoque nuevo: plantilla robusta para evitar duplicidades de metadatos.
- Recorte recomendado: no aplica (template).
- Acción SEO: validación automática de title/H1/description/canonical por item.

### 5.9 Páginas legales

51. /legal/aviso-legal (legal/aviso-legal.astro)
- Enfoque nuevo: legal claro y actualizado.
- Recorte recomendado: no recortar sin revisión jurídica.
- Acción SEO: noindex opcional según estrategia legal.

52. /legal/cookies (legal/cookies.astro)
- Enfoque nuevo: explicación de consentimiento y gestión.
- Recorte recomendado: no recortar sin revisión legal.
- Acción SEO: mantener index o noindex según política global.

53. /legal/privacidad (legal/privacidad.astro)
- Enfoque nuevo: tratamiento y derechos de datos en lenguaje claro.
- Recorte recomendado: no recortar sin revisión jurídica.
- Acción SEO: idem legales.

---

## 6) Priorización operativa por impacto

### Ola 1 (impacto máximo inmediato)
- /, /como-funciona, /precios, /vs-alternativas
- /para-quien/gerente-propietario
- /para-quien/responsable-rrhh

### Ola 2 (conversión por vertical y rol)
- /documentacion-procesos, /gestion-competencias, /control-produccion, /cobertura-turnos
- /para-quien/jefe-de-produccion, /para-quien/responsable-calidad
- /casos-de-uso/* (las 4)

### Ola 3 (autoridad y consolidación SEO)
- /kaizen, /mantenimiento, /workflows, /api-integraciones, /integracion-m365
- /blog/* y /recursos/* para limpieza de canibalización

---

## 7) Sprints detallados (12 semanas)

Supuesto: sprints de 2 semanas, equipo mínimo de 4 perfiles:
- SEO strategist
- Content lead
- Editor/copy
- Frontend Astro

### Sprint 1 (Semanas 1-2): Base de simplificación y control SEO

Objetivo:
- Definir estándares obligatorios de longitud, estructura y metadata.

Tareas:
1. Crear matriz keyword-intención por cada URL.
2. Definir plantillas cortas por tipo de página.
3. Auditar titles, H1 y descriptions actuales.
4. Definir CTA principal por página.

Entregables:
- Matriz maestra URL -> keyword primaria/secundaria.
- Guía editorial corta (1 página).
- Backlog de reescritura priorizado.

KPI de sprint:
- 100% URLs con intención asignada.
- 100% URLs con CTA principal definida.

### Sprint 2 (Semanas 3-4): Reescritura BOFU crítica

Objetivo:
- Reducir fricción en páginas de compra/decisión.

Tareas:
1. Reescritura: /, /como-funciona, /precios, /vs-alternativas.
2. Simplificar bloques a 5 H2 máximo por página.
3. Reescribir hero + prueba + CTA final de cada una.
4. Ajuste de metadatos y enlazado interno.

Entregables:
- 4 páginas publicadas en versión corta.
- Snippets SEO renovados.

KPI de sprint:
- Reducción media de copy visible >= 30%.
- Tiempo hasta primer CTA visible < 1 scroll.

### Sprint 3 (Semanas 5-6): Páginas por rol

Objetivo:
- Que cada buyer vea su valor en menos de 10 segundos.

Tareas:
1. Reescribir 4 páginas /para-quien.
2. Eliminar solapamientos entre roles.
3. Añadir microcaso por rol (3 líneas).
4. CTA único por rol.

Entregables:
- 4 páginas por rol reestructuradas.

KPI de sprint:
- 4/4 páginas con mensaje único y sin canibalización semántica.

### Sprint 4 (Semanas 7-8): Producto y casos de uso

Objetivo:
- Convertir páginas de funcionalidad en argumentos concretos.

Tareas:
1. Reescribir 8 páginas de capacidades principales.
2. Reescribir 4 casos de uso con formato "problema -> solución -> resultado".
3. Ajustar enlaces cruzados capacidad <-> caso.

Entregables:
- 12 páginas optimizadas (8 capacidades + 4 casos).

KPI de sprint:
- Reducción de rebote en grupo optimizado.
- Mayor CTR interno hacia CTA demo/diagnóstico.

### Sprint 5 (Semanas 9-10): Comparativas y sectores

Objetivo:
- Mejorar captación de tráfico de alta intención comparativa.

Tareas:
1. Simplificar /vs-dozuki, /vs-gembadocs, /vs-knowby, /vs-poka.
2. Estandarizar tabla comparativa en 5 criterios fijos.
3. Reescribir /sectores/alimentacion y /sectores/mecanizado-cnc.

Entregables:
- 6 páginas con formato comparativo/sector uniforme.

KPI de sprint:
- Mejora de CTR orgánico en páginas vs.

### Sprint 6 (Semanas 11-12): Blog, recursos y consolidación técnica

Objetivo:
- Evitar canibalización editorial y reforzar clústeres.

Tareas:
1. Reestructurar índices /blog y /recursos.
2. Añadir resúmenes ejecutivos en artículos largos.
3. Definir canonicals en contenidos espejo /blog vs /recursos.
4. Revisar schema y breadcrumbs.

Entregables:
- Arquitectura editorial consolidada.
- Informe final antes/después.

KPI de sprint:
- Disminución de consultas canibalizadas en Search Console.
- Aumento de páginas con rich results elegibles.

---

## 8) Backlog de implementación técnica y contenido

Prioridad P0
- Reescritura corta home, cómo funciona, precios, vs-alternativas.
- Reescritura páginas por rol más extensas (gerente, RRHH).
- Claridad de CTA principal por URL.

Prioridad P1
- Capacidades y casos de uso.
- Normalización comparativas y sectores.

Prioridad P2
- Consolidación blog/recursos.
- Ajustes avanzados schema/canonical.

---

## 9) Gobernanza: reglas para no volver a sobreextender el sitio

1. Ninguna página comercial nueva se publica con más de 5 H2.
2. Ninguna sección comercial supera 90 palabras sin prueba.
3. Cualquier nueva URL debe declarar:
- intención
- keyword primaria
- keyword secundaria
- CTA principal

4. Revisión trimestral de:
- canibalización
- CTR snippets
- profundidad de scroll útil
- conversiones por plantilla de página

---

## 10) KPIs de negocio y SEO (90 días)

Negocio:
- +20% en clic a CTA principal en páginas optimizadas.
- +15% en ratio de visita cualificada a lead.

SEO:
- +15% CTR orgánico en URLs reescritas.
- +20% impresiones en clúster comparativas y capacidades.
- Reducción de consultas duplicadas entre /blog y /recursos.

UX de lectura:
- Mayor ratio de lectura de hero + primer bloque.
- Menor abandono antes del primer CTA.

---

## 11) Orden recomendado de ejecución inmediata

Semana 1:
- Definir matriz keyword-intención y reglas editoriales.

Semanas 2-4:
- Reescribir home, cómo funciona, precios, vs-alternativas, gerente, RRHH.

Semanas 5-8:
- Reescribir capacidades + casos de uso.

Semanas 9-12:
- Comparativas restantes + sectores + consolidación blog/recursos.

---

## 12) Criterio de éxito final

La web se considerará optimizada cuando:
- Cada página diga una sola cosa principal con lenguaje directo.
- El usuario entienda valor y siguiente paso en menos de 10 segundos.
- El mapa SEO no tenga solapamientos críticos por intención.
- El equipo pueda mantener consistencia editorial sin rehacer cada trimestre.
