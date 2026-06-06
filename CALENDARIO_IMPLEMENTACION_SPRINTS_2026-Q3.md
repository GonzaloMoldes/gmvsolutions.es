# Calendario de implementacion SEO + CRO por sprints (Q3 2026)

Estado base al iniciar este calendario (2026-06-05):
- Matriz de URLs: 51/51 en estado implementado_estructura (`MATRIZ_URL_INTENCION_SPRINT1.csv`).
- Gate de publicacion por URL definido (`CHECKLIST_PUBLICACION_SEO_CRO.md`).
- Objetivo de este plan: pasar de "estructura cerrada" a "crecimiento SEO + conversion + autoridad" con ejecucion semanal y validacion por checkbox.

Documentos fuente que este calendario debe cumplir:
- `PLAN_REDUCCION_COPY_Y_SEO_SPRINTS_2026-06.md` (copy corto + reescritura de todas las paginas + reglas SEO).
- `REELEVO-posicionamiento-vs-Mapex-Azumuta.md` (categoria propia, SEO nativo ES, contenido pillar, autoridad/E-E-A-T, tecnico).

---

## 1) Objetivo operativo

Ejecutar 6 sprints (12 semanas) con entregables cerrados y validables por checkbox para:
1. Reescribir todas las paginas comerciales y editoriales en formato corto (doc copy).
2. Capturar keywords nativas en espanol y construir clusters de contenido (doc posicionamiento, seccion B).
3. Subir autoridad: directorios, backlinks, caso real (doc posicionamiento, seccion C).
4. Cerrar la base tecnica: schema, sitemap, canonical, hreflang, Core Web Vitals (doc posicionamiento, seccion D + doc copy, seccion 4).
5. Medir impacto con tablero semanal y decision quincenal.

### 1.1) Como se ejecuta cada sprint: 3 carriles en paralelo

Para cumplir AMBOS documentos en 12 semanas, cada sprint corre tres carriles simultaneos. Una persona puede cubrir varios carriles si el equipo es pequeno, respetando el limite de WIP (seccion 8).

- Carril A - Conversion & reescritura de copy (origen: doc copy, secciones 5 y 7).
- Carril B - Contenido SEO & clusters (origen: doc posicionamiento, seccion B + doc copy, blog).
- Carril C - Autoridad, E-E-A-T & tecnico (origen: doc posicionamiento, secciones C y D).

Toda tarea lleva una etiqueta de trazabilidad al documento fuente, p. ej. `[Pos 6.A1]` (Posicionamiento, plan de mejora, punto A1) o `[Copy S2]` (Plan copy, Sprint 2).

---

## 2) Equipo y roles sugeridos

- SEO strategist: keyword map, canibalizacion, Search Console, priorizacion.
- Content lead: briefs, calendario editorial, QA semantica.
- Copy/editor: reescritura y piezas nuevas.
- Frontend Astro: implementacion en pages/layouts/schema.
- Owner negocio: aprobacion final de claims y prioridad comercial.

Si el equipo es pequeno, una persona puede cubrir SEO + Content, pero mantener al menos 1 owner de negocio para aprobaciones.

---

## 3) Cadencia fija (repetible cada sprint)

- Lunes:
  - Plan semanal (45 min): foco, bloqueos, dependencias.
  - Confirmar backlog comprometido de la semana.
- Miercoles:
  - Checkpoint (30 min): estado real vs plan, decisiones rapidas.
- Viernes:
  - Cierre semanal (30 min): entregables terminados, metricas y riesgos.

Ritmo de sprint (2 semanas):
- Dia 1: plan del sprint.
- Dia 10: review + retrospectiva + siguiente commit de sprint.

---

## 4) Calendario de sprints (fechas)

- Sprint 1: 2026-06-08 -> 2026-06-21
- Sprint 2: 2026-06-22 -> 2026-07-05
- Sprint 3: 2026-07-06 -> 2026-07-19
- Sprint 4: 2026-07-20 -> 2026-08-02
- Sprint 5: 2026-08-03 -> 2026-08-16
- Sprint 6: 2026-08-17 -> 2026-08-30

---

## 5) Sprint backlog ejecutable (con validacion por checkbox)

Marca cada checkbox al completar y validar la tarea contra el gate de `CHECKLIST_PUBLICACION_SEO_CRO.md`.

---

## Sprint 1 (2026-06-08 -> 2026-06-21) - Base de medicion, gobierno editorial y tecnico

Objetivo: dejar cerrada la infraestructura de seguimiento, las reglas de produccion y la base tecnica antes de tocar contenido a escala.

### Carril A - Conversion & reescritura
- [ ] S1-A1 Confirmar taxonomia final de intencion por URL contra la matriz (comercial/editorial/legal). `[Copy 4.1]`
- [ ] S1-A2 Validar plantilla unica de briefing por URL (keyword primaria/secundaria, CTA, DoD). `[Copy S1]`
- [ ] S1-A3 Aprobar la guia editorial corta de 1 pagina (limites de hero, H2, palabras por seccion). `[Copy 3]`

### Carril B - Contenido SEO & clusters
- [ ] S1-B1 Construir keyword map por cluster: SOP, onboarding, competencias, absentismo/continuidad, ayudas. `[Pos 6.B6]`
- [ ] S1-B2 Definir mapa de canibalizacion (keyword primaria y secundarias por URL) y marcar solapes blog vs recursos. `[Copy 4.6]`
- [ ] S1-B3 Definir calendario editorial de las 8 piezas nuevas (S4 + S5) con query objetivo por pieza. `[Pos 6.B8]`

### Carril C - Autoridad, E-E-A-T & tecnico
- [ ] S1-C1 Conectar y validar Google Search Console + Bing Webmaster Tools. `[Pos 6.D19]`
- [x] S1-C2 Reconciliar inventario real de URLs vs sitemap publicado. `[Copy 4 / hallazgo tecnico 1]` (Sitemap 52 URLs; faltaba `/onboarding-software-pymes/` en la matriz: anadida. Matriz y checklist actualizados a 52.)
- [x] S1-C3 Implementar schema base del sitio: Organization + BreadcrumbList en todas las indexables. `[Pos 6.D16]` (Org + BreadcrumbList auto globales en BaseLayout via `src/lib/seo.ts`; Organization deduplicada en index. Build verde, 52 paginas.)
- [ ] S1-C4 Medir baseline de Core Web Vitals (LCP, CLS, INP) y registrar valores de partida. `[Pos 6.D18]`
- [ ] S1-C5 Abrir alta (sin publicar perfil completo) en Capterra, GetApp, G2 y SoftwareDoIt. `[Pos 6.C12]`
- [ ] S1-C6 Definir tablero semanal (impresiones, CTR, clics CTA, leads, demos). `[Calendario 6]`
- [x] S1-C7 Auditar eventos de conversion (CTA principal por plantilla de pagina). `[Copy 3.1]` (Ver `AUDITORIA_EVENTOS_CTA_GA4.md`: hoy 0 eventos; propuesta de taxonomia GA4 + listener delegado + mapeo CTA/matriz.)

Entregables:
- [ ] Dashboard semanal publicado con datos reales de >= 7 dias.
- [ ] Plantilla de briefing y guia editorial aprobadas.
- [ ] Checklist QA operativo en uso.
- [ ] Sitemap reconciliado y schema base desplegado.

Definition of Done:
- [ ] Todo nuevo trabajo usa plantilla + checklist de publicacion.
- [ ] 51/51 URLs presentes en sitemap y verificadas en Search Console.

---

## Sprint 2 (2026-06-22 -> 2026-07-05) - Ola comercial 1: core de conversion

Objetivo: reescribir el core BOFU en formato corto y afinar el mensaje de categoria/precio frente a Mapex y Azumuta.

Scope reescritura (Carril A): `/`, `/como-funciona/`, `/precios/`, `/vs-alternativas/`.

### Carril A - Conversion & reescritura
- [x] S2-A1 Reescribir hero de `/`: categoria + para quien + diferenciador en 3 segundos; nombrar "plataforma operativa para pyme industrial" y precio 49 EUR/mes. `[Pos 6.A1]` (Hero + doble CTA con data-cta.)
- [x] S2-A2 Eliminar keyword stuffing del copy actual ("tu onboarding software reduce...", etc.) en las 4 URLs. `[Pos 6.A2]` (Eliminada la seccion "4 pilares" de la home; verificado 0 ocurrencias en build.)
- [x] S2-A3 Reescribir `/precios/` con tabla clara y mensaje "precio publico, sin coste por operario" frente al "pide demo" rival. `[Pos 6.A3]`
- [x] S2-A4 Reescribir `/como-funciona/` a proceso en 3 pasos reales y `/vs-alternativas/` a comparador resumido + selector por caso. `[Copy 5.1]` (como-funciona: cortadas secciones "Como queda registrado" y "QR diario". vs-alternativas: cortada "Por que elegir" por canibalizacion con /por-que-usar-reelevo.)
- [x] S2-A5 Aplicar formato corto en las 4: max 5 H2, secciones de 60-90 palabras, 1 prueba por seccion. `[Copy 3.1]` (home 4 H2, como-funciona 4 H2, precios 3 H2, vs-alternativas 4 H2.)
- [x] S2-A6 Doble CTA coherente por pagina: "Registrarme" + "Evaluar mi situacion"/calculadora. `[Pos 6.A4]` (Diagnostico cableado como CTA blanda; antes solo vivia en el Header.)
- [x] S2-A7 Revisar title (50-60), meta description (140-155), H1 unico y enlazado al cluster correcto. `[Copy 3.1]` (Metadatos de las 4 ya dentro de rango; H1 unico verificado.)

### Carril B - Contenido SEO & clusters
- [x] S2-B1 Brief SEO completo del cluster SOP (4 piezas de Sprint 4): query, outline, enlaces internos. `[Pos 6.B8]` (Ver `BRIEFS_CONTENIDO_SPRINTS_2026-Q3.md` seccion 2.)
- [x] S2-B2 Especificar el lead magnet "plantilla SOP descargable" (formato, captura de email, pagina destino). `[Pos 6.B10]` (Ver `BRIEFS_CONTENIDO_SPRINTS_2026-Q3.md` seccion 6.1.)

### Carril C - Autoridad, E-E-A-T & tecnico
- [x] S2-C1 Implementar schema SoftwareApplication + Offer (precio 49 EUR/mes) en `/` y `/precios/`. `[Pos 6.D16]` (Home: SoftwareApplication+Offer; /precios: ya tenia Product+Offer.)
- [ ] S2-C2 Completar perfil de Capterra y GetApp (descripcion, capturas, categoria, precio). `[Pos 6.C12]` (Tarea de marketing, fuera del repo.)
- [ ] S2-C3 Verificar Core Web Vitals en verde tras la reescritura del core. `[Pos 6.D18]` (Medir en PageSpeed/CrUX tras desplegar.)

Entregables:
- [x] 4 URLs core publicadas en version corta.
- [ ] Documento antes/despues (copy y estructura) de las 4.
- [ ] Brief del cluster SOP cerrado.

Definition of Done:
- [x] 4/4 URLs con CTA principal dominante visible en el primer scroll.
- [x] Reduccion media de copy visible >= 30% en las 4.
- [x] 4/4 pasan el gate de `CHECKLIST_PUBLICACION_SEO_CRO.md` y build en verde. (Build: 52 paginas OK; tracking de CTA emitiendo cta_click/generate_lead.)

---

## Sprint 3 (2026-07-06 -> 2026-07-19) - Ola comercial 2: para-quien + arranque de contenido

Objetivo: reducir friccion por rol, eliminar canibalizacion interna y arrancar el cluster SOP y la captacion de backlinks.

Scope reescritura (Carril A): las 4 paginas `/para-quien/*`.

### Carril A - Conversion & reescritura
- [x] S3-A1 Reescribir `/para-quien/gerente-propietario/` (recorte objetivo -45%): continuidad de negocio y riesgo operativo. `[Copy 5.4]` (Cortada seccion "Precio fijo" duplicada; bullets exec 5->3.)
- [x] S3-A2 Reescribir `/para-quien/jefe-de-produccion/` (-40%): visibilidad de turno, carga y desvios. `[Copy 5.4]` (Reescrito H1/hero con keyword stuffing eliminado; cortada seccion "Implementacion".)
- [x] S3-A3 Reescribir `/para-quien/responsable-rrhh/` (-45%): onboarding operativo y curva de autonomia. `[Copy 5.4]` (Cortadas secciones "Encaje RRHH" y "Plan de implementacion".)
- [x] S3-A4 Reescribir `/para-quien/responsable-calidad/` (-30%): evidencia de ejecucion y conformidad. `[Copy 5.4]` (Fusionados los 2 bloques de cross-link en uno.)
- [x] S3-A5 Una sola promesa y una CTA principal por rol; eliminar solapamiento entre roles. `[Calendario S3]` (CTA principal = diagnostico segun matriz, cableado con data-cta.)
- [x] S3-A6 Anadir microcaso por rol (3-5 lineas, realista y verificable). `[Calendario S3]` (Microcaso ilustrativo etiquetado como escenario, sin inventar cliente/metricas.)

### Carril B - Contenido SEO & clusters
- [ ] S3-B1 Redactar y QA de los 2 primeros articulos del cluster SOP (estructura escaneable + TLDR + indice). `[Pos 6.B8]`
- [ ] S3-B2 Implementar schema Article + breadcrumbs + CTA inline/final en esos 2 articulos. `[Pos 6.D16]`
- [ ] S3-B3 Activar el lead magnet "plantilla SOP" y enlazarlo desde el hub `/blog` y `/recursos`. `[Pos 6.B10]`

### Carril C - Autoridad, E-E-A-T & tecnico
- [ ] S3-C1 Completar perfil de G2 y SoftwareDoIt y solicitar primeras resenas del piloto. `[Pos 6.C12]`
- [ ] S3-C2 Construir lista de 20 targets de backlinks (clusters gallegos, AFM, asociaciones pyme, camaras, prensa industrial local). `[Pos 6.C13]`
- [ ] S3-C3 Redactar borrador del caso de exito del piloto de Galicia (a la espera de metricas). `[Pos 6.A5]`

Entregables:
- [x] 4 landings por rol en formato corto y publicadas.
- [ ] 2 articulos del cluster SOP publicados. (Carril B, pendiente de redaccion.)
- [ ] Lead magnet SOP activo y lista de 20 targets de backlinks. (Carriles B/C, pendiente.)

Definition of Done:
- [x] 4/4 roles con mensaje unico y sin canibalizacion semantica. (Build verde 52 paginas; stuffing y CTA verificados en HTML.)
- [ ] Cada articulo con 3+ enlaces internos y 2 CTAs funcionales. (Aplica a los articulos del Carril B, pendiente.)

---

## Sprint 4 (2026-07-20 -> 2026-08-02) - Capacidades de producto + cluster SOP completo + Kit Digital

Objetivo: convertir las paginas de funcionalidad en argumentos concretos y cerrar el cluster SOP, abriendo la carta "ayudas Espana".

Scope reescritura (Carril A): las 8 capacidades principales `/documentacion-procesos/`, `/gestion-competencias/`, `/calidad-y-conformidad/`, `/cobertura-turnos/`, `/control-produccion/`, `/mantenimiento/`, `/workflows/`, `/portal-operario/`.

### Carril A - Conversion & reescritura
- [x] S4-A1 Reescribir las 8 capacidades a formato corto (recorte -25% a -35%), una intencion y H1 literal por URL. `[Copy 5.2]` (Cortados casos fabricados y secciones redundantes; eyebrows con keyword stuffing limpiados.)
- [x] S4-A2 Optimizar title/H1/contenido hacia las keywords nativas en espanol de la matriz (vs URLs en ingles de Azumuta). `[Pos 6.B6]` (H1/title ya alineados; limpiado contenido en ingles/erratas.)
- [x] S4-A3 Ajustar enlaces cruzados capacidad <-> caso de uso y capacidad <-> rol. `[Copy 4.4]` (Cross-links a casos de uso y a paginas por rol en cada capacidad.)

### Carril B - Contenido SEO & clusters
- [x] S4-B1 Publicar los 2 articulos restantes del cluster SOP. `[Pos 6.B8]` (Cluster SOP completo: 4 articulos publicados (documentar CNC, instrucciones vs SOP, comparativa software SOP, plantilla SOP) + SOP mantenimiento.)
- [x] S4-B2 Cerrar enlazado del cluster SOP: hub -> articulo -> capacidad -> conversion. `[Copy 4.4]` (Cada articulo enlaza a /blog, a 2-3 capacidades/casos y a CTA; bloque related-links + CTA.)

### Carril C - Autoridad, E-E-A-T & tecnico
- [ ] S4-C1 Publicar landing de ayudas: Kit Digital / Kit Consulting / Activa Industria 4.0 para pyme industrial. `[Pos 6.B9]` (Brief listo: `BRIEFS_CONTENIDO_SPRINTS_2026-Q3.md` seccion 5; pendiente contenido + verificacion legal de claims.)
- [ ] S4-C2 Lanzar outreach a los primeros 10 targets de backlinks (nota de prensa de lanzamiento + piloto). `[Pos 6.C13]` (Pendiente: marketing.)
- [x] S4-C3 Implementar schema SoftwareApplication en las 8 capacidades reescritas. `[Copy 4.5]` (7/8 con SoftwareApplication; calidad-y-conformidad usa WebPage por su enfoque prudente, sin overclaim de software.)

Entregables:
- [x] 8 capacidades optimizadas y publicadas. (Build verde 52 paginas; data-cta y pageType=capacidad verificados en HTML.)
- [ ] Cluster SOP completo (4 articulos) y enlazado. (Carril B, pendiente.)
- [ ] Landing de ayudas/Kit Digital publicada. (Carril C, pendiente.)

Definition of Done:
- [x] 8/8 capacidades pasan el gate de publicacion y build en verde. (CTA principal "Solicitar demo" + secundaria registro, ambas con data-cta.)
- [ ] Cluster SOP con enlazado completo hub -> articulo -> capacidad -> CTA. (Aplica al Carril B, pendiente.)

---

## Sprint 5 (2026-08-03 -> 2026-08-16) - Casos de uso + sectores + cluster conocimiento/absentismo

Objetivo: dominar queries long-tail locales, reescribir casos y sectores, y conectar contenido con casos de uso.

Scope reescritura (Carril A): 4 casos de uso (`/casos-de-uso/*`) + 2 sectores (`/sectores/alimentacion/`, `/sectores/mecanizado-cnc/`).

### Carril A - Conversion & reescritura
- [x] S5-A1 Reescribir los 4 casos de uso con formato "problema -> solucion -> resultado -> implementacion en 3 pasos" (recorte -20%). `[Copy 5.5]` (Ya seguian el formato; limpiado keyword stuffing "onboarding software" en hero/H1.)
- [x] S5-A2 Reescribir los 2 sectores (alimentacion, mecanizado CNC) con foco vertical y trazabilidad (recorte -25%). `[Copy 5.6]` (H1 realineado al keyword de sector; CTA principal = diagnostico.)
- [x] S5-A3 Enlazar cada caso/sector a su capacidad y a su rol correspondiente. `[Copy 4.4]` (Bloque "Relacionado" con enlaces a capacidad + rol en cada caso; sectores enlazan a rol/capacidad.)

### Carril B - Contenido SEO & clusters
- [x] S5-B1 Producir 4 articulos del cluster conocimiento/absentismo con TLDR + indice anclado. `[Pos 6.B8]` (Publicados: conocimiento tacito, reducir onboarding 5->1, plan de contingencia de bajas, SOP mantenimiento. Todos con TLDR + indice anclado.)
- [x] S5-B2 Enlaces cruzados de los articulos con `/casos-de-uso/*` y `/para-quien/*`. `[Copy 4.4]` (Related-links a casos de uso, paginas por rol y producto en cada articulo.)
- [ ] S5-B3 Activar segundo lead magnet (plantilla matriz de competencias en Excel o checklist de contingencia). `[Pos 6.B10]` (Brief listo: `BRIEFS_CONTENIDO_SPRINTS_2026-Q3.md` seccion 6.2; recomendada matriz de competencias.)
- [ ] S5-B4 Difusion en LinkedIn (2-3 posts por articulo). `[Pos 6.C15]`

### Carril C - Autoridad, E-E-A-T & tecnico
- [ ] S5-C1 Outreach a los 10 targets de backlinks restantes y seguimiento de los primeros 10. `[Pos 6.C13]`
- [ ] S5-C2 Publicar el caso de exito del piloto de Galicia con metricas reales en cuanto existan. `[Pos 6.A5]`

Entregables:
- [x] 4 casos de uso + 2 sectores reescritos y publicados. (Build verde 52 paginas; pageType y data-cta verificados.)
- [ ] 4 articulos del cluster conocimiento/absentismo publicados. (Carril B, pendiente.)
- [ ] Segundo lead magnet activo. (Carril B, pendiente.)

Definition of Done:
- [ ] Cluster enlazado completo (hub -> articulo -> caso -> conversion). (Aplica al Carril B, pendiente.)
- [x] 6/6 paginas reescritas pasan el gate de publicacion. (CTA por intencion segun matriz; stuffing eliminado.)

---

## Sprint 6 (2026-08-17 -> 2026-08-30) - Comparativas, consolidacion editorial, autoridad y cierre trimestral

Objetivo: cerrar la reescritura (comparativas + blog/recursos), publicar comparativas de categoria, dejar la base tecnica completa y preparar Q4.

Scope reescritura (Carril A): 4 comparativas `/vs-*` + consolidacion `/blog` y `/recursos`.

### Carril A - Conversion & reescritura
- [x] S6-A1 Reescribir `/vs-dozuki/`, `/vs-gembadocs/`, `/vs-knowby/`, `/vs-poka/` con tabla comparativa estandar de 5 criterios fijos (recorte -25%). `[Copy 5.3]` (Tabla unica de 5 criterios; cortadas secciones de coste/ROI con cifras fabricadas; CTA + pageType.)
- [x] S6-A2 Reestructurar indices `/blog` y `/recursos` por intencion y reforzar breadcrumbs/taxonomia. `[Copy 5.7]` (Blog reagrupado por cluster con indice anclado; /recursos con indice de navegacion; breadcrumbs VISIBLES en todo el sitio via `Breadcrumbs.astro` (coherente con el JSON-LD) y unificados en los articulos.)
- [x] S6-A3 Definir canonicals en contenidos espejo `/blog` vs `/recursos` segun la matriz (resumen -> fuente). `[Copy 4 / hallazgo tecnico 2]` (Verificado: los 3 `/recursos/*` resumen ya apuntan su canonical al `/blog/*` fuente.)

### Carril B - Contenido SEO & clusters
- [x] S6-B1 Publicar 2 comparativas de categoria: "REELEVO vs MES tradicional" y "REELEVO vs Excel y papel". `[Pos 6.B7]` (Publicadas: `/vs-mes-tradicional/` y `/vs-excel-papel/`, con tabla de 5 criterios, enfoque educativo y CTA; en sitemap y matriz.)
- [x] S6-B2 Anadir resumenes ejecutivos (TLDR) a los articulos largos que aun no lo tengan. `[Copy 5.7]` (Los 8 articulos nuevos llevan TLDR (highlight-box) + indice anclado.)

### Carril C - Autoridad, E-E-A-T & tecnico
- [ ] S6-C1 Dejar activos y verificados los 4 perfiles de directorio (Capterra, GetApp, G2, SoftwareDoIt). `[Pos 6.C12]` (Pendiente: marketing.)
- [x] S6-C2 Dejar la arquitectura hreflang preparada (solo ES hoy) sin URLs sin localizar. `[Pos 6.D17]` (hreflang es + x-default en BaseLayout, referenciando el canonical de cada pagina.)
- [ ] S6-C3 Validar cobertura en Search Console (URLs enviadas, indexadas y excluidas) y revisar canibalizacion. `[Copy 4 / hallazgo tecnico 3]` (Pendiente: requiere GSC.)
- [ ] S6-C4 Informe Q3: resultados, aprendizajes y backlog priorizado Q4 con fechas. `[Calendario 10]` (Pendiente.)

Entregables:
- [x] 4 comparativas `/vs-*` reescritas + 2 comparativas de categoria publicadas. (4 `/vs-*` + `/vs-mes-tradicional/` + `/vs-excel-papel/`.)
- [x] Arquitectura editorial blog/recursos consolidada con canonicals. (Canonicals resumen -> fuente verificados.)
- [ ] 4 perfiles de directorio activos e informe de cierre trimestral. (Pendiente: marketing.)

Definition of Done:
- [ ] Sin consultas canibalizadas criticas en Search Console entre `/blog` y `/recursos`. (Requiere GSC; canonicals ya mitigan.)
- [~] 53 paginas del sitio reescritas o validadas en formato corto. (Carril A completo: 26 paginas comerciales reescritas en S2-S6; blog/recursos/legal/otras quedan como contenido editorial.)
- [ ] Pipeline Q4 definido y priorizado con fechas. (Pendiente.)

---

## 5.1) Trazabilidad: objetivo de origen -> sprint

| Objetivo de los documentos fuente | Donde se ejecuta |
|---|---|
| Reescritura core BOFU (/, como-funciona, precios, vs-alternativas) `[Copy S2]` | Sprint 2, Carril A |
| Reescritura paginas por rol `[Copy S3]` | Sprint 3, Carril A |
| Reescritura 8 capacidades `[Copy S4]` | Sprint 4, Carril A |
| Reescritura 4 casos de uso + 2 sectores `[Copy S4/S5]` | Sprint 5, Carril A |
| Reescritura 4 comparativas + consolidacion blog/recursos `[Copy S5/S6]` | Sprint 6, Carril A |
| Afinar hero + quitar keyword stuffing + precio visible `[Pos 6.A1-A3]` | Sprint 2, Carril A |
| Doble CTA + lead magnets `[Pos 6.A4, 6.B10]` | Sprints 2-5 |
| Keywords nativas ES vs Azumuta `[Pos 6.B6]` | Sprints 1 (map) y 4 (aplicacion) |
| Pillar pages / clusters de contenido `[Pos 6.B8]` | Sprints 3-5, Carril B |
| Paginas de comparacion de categoria `[Pos 6.B7]` | Sprint 6, Carril B |
| Landing Kit Digital / ayudas `[Pos 6.B9]` | Sprint 4, Carril C |
| Directorios (Capterra/GetApp/G2/SoftwareDoIt) `[Pos 6.C12]` | Sprints 1-3 (alta/perfil), 6 (verificado) |
| Backlinks ecosistema industrial `[Pos 6.C13]` | Sprints 3-5, Carril C |
| Caso de exito Galicia `[Pos 6.A5]` | Sprints 3 (borrador), 5 (publicado) |
| Schema (SoftwareApplication/Offer/Org/FAQ/Breadcrumb) `[Pos 6.D16]` | Sprints 1-4, Carril C |
| hreflang preparado `[Pos 6.D17]` | Sprint 6, Carril C |
| Core Web Vitals en verde `[Pos 6.D18]` | Sprints 1 (baseline), 2 (verificacion) |
| GSC + Bing + sitemap + cobertura `[Pos 6.D19 / Copy 4]` | Sprints 1 y 6, Carril C |
| Canonical blog vs recursos `[Copy hallazgo tecnico 2]` | Sprint 6, Carril A |

---

## 6) Tablero de seguimiento (campos minimos)

Columnas Kanban:
- Backlog
- Ready
- En progreso
- QA
- Publicado
- Medido

Campos por tarea:
- ID (ej: S4-A1)
- Carril (A/B/C)
- URL/Pieza
- Owner
- Prioridad (P0/P1/P2)
- Fecha inicio
- Fecha fin objetivo
- Estado
- Dependencias
- Etiqueta de origen (ej: [Pos 6.B6])
- KPI esperado
- Resultado real

---

## 7) KPIs de control por sprint

Minimo revisar en cada cierre:
- Produccion:
  - Tareas comprometidas vs completadas (% cumplimiento sprint).
  - URLs/piezas publicadas.
- SEO:
  - Impresiones, clics y CTR por cluster.
  - Queries nuevas en top 20.
- Negocio:
  - Clics a CTA principal.
  - Leads captados (formularios + lead magnets).
  - Demos solicitadas desde trafico organico.

Umbrales de alerta:
- Cumplimiento sprint < 70% por 2 sprints seguidos.
- CTR organico cae > 15% en URLs reescritas.
- Cero crecimiento de queries nuevas en 4 semanas.

---

## 8) Riesgos y mitigacion

- Riesgo: exceso de trabajo editorial sin capacidad tecnica.
  - Mitigacion: limitar WIP a 2 URLs/piezas simultaneas por owner y carril.
- Riesgo: los 3 carriles compiten por la misma persona en equipo pequeno.
  - Mitigacion: priorizar Carril A (reescritura) sobre B/C en semanas con conflicto; B/C nunca bloquean la reescritura.
- Riesgo: canibalizacion blog vs recursos.
  - Mitigacion: canonical estricto + enlazado explicito + una intencion por URL.
- Riesgo: publicar mucho sin distribuir.
  - Mitigacion: checklist de difusion obligatorio en cierre de cada articulo.
- Riesgo: metricas no confiables.
  - Mitigacion: validar eventos y fuentes en Sprint 1 antes de escalar.

---

## 9) Checklist de arranque (semana del 2026-06-08)

- [ ] Crear board con columnas, carriles y campos de este documento.
- [ ] Cargar tareas S1-A1 a S1-C7 con owner, carril y fecha.
- [ ] Bloquear reuniones fijas (lunes, miercoles, viernes).
- [ ] Publicar dashboard base con datos de la semana.
- [ ] Aprobacion final del owner de negocio sobre alcance Sprint 1.

---

## 10) Criterio de exito al final del ciclo (2026-08-30)

- Ejecucion:
  - [ ] 6/6 sprints cerrados con review documentada.
- Reescritura (doc copy):
  - [ ] 53/53 paginas en formato corto (core, roles, capacidades, casos, sectores, comparativas, blog/recursos).
  - [ ] Reduccion media de copy visible >= 30% en paginas comerciales.
- Contenido y autoridad (doc posicionamiento):
  - [ ] 8 articulos nuevos publicados (cluster SOP + conocimiento/absentismo).
  - [ ] 2 comparativas de categoria + 1 landing de ayudas publicadas.
  - [ ] 3 activos de captacion (2 lead magnets + 1 landing ayudas).
  - [ ] 4 perfiles de directorio activos + campana de backlinks en curso (20 targets).
- Tecnico:
  - [ ] Schema, sitemap, canonical y hreflang resueltos; Core Web Vitals en verde.
- SEO:
  - [ ] Crecimiento sostenido de impresiones y queries en clusters objetivo (Search Console).

Este documento es el calendario operativo de referencia para ejecucion semanal y se valida marcando cada checkbox al cumplir y aprobar la tarea contra `CHECKLIST_PUBLICACION_SEO_CRO.md`.
