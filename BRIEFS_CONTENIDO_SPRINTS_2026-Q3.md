# Briefs de contenido - Carriles B y C (Q3 2026)
## REELEVO - Piezas pendientes de los Sprints 2 a 6

Fecha: 2026-06-06
Trazabilidad: `CALENDARIO_IMPLEMENTACION_SPRINTS_2026-Q3.md` (Carriles B/C) + objetivos de
`REELEVO-posicionamiento-vs-Mapex-Azumuta.md` (seccion 6.B) y `PLAN_REDUCCION_COPY_Y_SEO_SPRINTS_2026-06.md`.
Gate de publicacion: `CHECKLIST_PUBLICACION_SEO_CRO.md`. Fuente de URLs: `MATRIZ_URL_INTENCION_SPRINT1.csv`.

Este documento contiene los briefs accionables para que Content/Copy produzcan las piezas sin
volver a decidir estrategia. Cada brief esta cerrado: query, outline, enlaces, CTA, schema y riesgos.

---

## 0) Reglas transversales (obligatorias para todas las piezas)

### 0.1 Editorial (formato blog SEO, doc copy seccion 3.1.C)
- Resumen ejecutivo (TL;DR) arriba, antes del primer H2.
- Indice anclado (tabla de contenidos con enlaces a cada H2).
- Parrafos de 2-4 lineas. Cajas de sintesis cada 2 secciones.
- Un H1 unico y literal con la keyword primaria.
- Tono: nativo en espanol, contexto pyme industrial espanola (ETT, convenios, Kit Digital, realidad de taller).

### 0.2 SEO
- Meta title 50-60 caracteres. Meta description 140-155.
- Una intencion principal por URL. Declarar keyword primaria + secundaria.
- Enlazado en cluster: cada articulo enlaza a su hub, a 1-2 capacidades, a 1 caso de uso y a 1 conversion.
- Schema `Article` + `BreadcrumbList` (el Breadcrumb ya es automatico via `src/lib/seo.ts`; el `Article` se anade por pieza).
- Antes de publicar: pasar el gate de `CHECKLIST_PUBLICACION_SEO_CRO.md` y anadir la URL a la matriz y al sitemap.

### 0.3 Honestidad (regla critica - no negociable)
- **Prohibido inventar metricas, cifras de cliente, nombres o precios de competidores.** En el Carril A se
  eliminaron varios "casos reales" y tablas de coste fabricadas; no reintroducirlos por la puerta del blog.
- Datos permitidos: los de la "Encuesta REELEVO 2025" ya citada en el blog (con su nota de muestra) y
  fuentes externas citadas con enlace. Todo dato sin fuente verificable se reformula como hipotesis o se elimina.
- Escenarios ilustrativos permitidos solo si se etiquetan como tales ("ejemplo ilustrativo, no un caso de cliente").
- El piloto de Galicia solo se menciona con metricas cuando existan y esten verificadas.

### 0.4 Tracking de CTA
- Todo CTA del articulo usa los `data-cta` ya definidos (ver `AUDITORIA_EVENTOS_CTA_GA4.md`):
  `data-cta data-cta-intent="..." data-cta-location="body|footer" data-cta-label="..."`.
- Lead magnets: intent `descarga` -> dispara `file_download` en GA4.

---

## 1) Mapa de clusters y canibalizacion (keyword map, S1-B1)

Hubs: `/blog/` (editorial) y `/recursos/` (resumenes/descargables).

| Cluster | Hub | Articulos existentes (no canibalizar) | Piezas nuevas |
|---|---|---|---|
| SOP / documentacion | /documentacion-procesos/ | /blog/que-es-un-sop-industrial | 4 piezas Sprint 4 |
| Onboarding | /onboarding-software-pymes/ | /blog/onboarding-software-pymes, /blog/onboarding-vs-tradicional | 1 pieza Sprint 5 (onboarding 5->1) |
| Conocimiento | /gestion-competencias/ | /blog/crisis-perdida-conocimiento-planta-industrial, /blog/documentar-conocimiento-operarios-expertos | 1 pieza Sprint 5 (conocimiento tacito) |
| Absentismo / continuidad | /cobertura-turnos/ | /blog/coste-absentismo-pymes-industriales | 1 pieza Sprint 5 (plan contingencia) |
| Mantenimiento | /mantenimiento/ | - | 1 pieza Sprint 5 (SOP mantenimiento) |
| Categoria / ayudas | /vs-alternativas/ | - | 2 comparativas categoria + landing Kit Digital (Sprint 6 / Sprint 4) |

Regla anticanibalizacion: cada pieza nueva ataca una query long-tail distinta y enlaza (no compite) con el
articulo existente del mismo cluster. Si dos piezas comparten intencion, definir canonical a la principal.

---

## 2) Cluster SOP - 4 articulos (Sprint 4, S4-B1)

Objetivo de cluster: poseer en castellano nativo las queries que Azumuta tiene en ingles
("digital work instructions", "SOP software"). Cada articulo enlaza a `/documentacion-procesos/`.

### 2.1 Articulo SOP-1
- **URL**: `/blog/documentar-procesos-mecanizado-cnc/`
- **Intencion**: informacional (how-to) -> consideracion.
- **Keyword primaria**: "como documentar procesos de mecanizado CNC"
- **Secundarias**: "SOP mecanizado CNC", "instrucciones de trabajo CNC paso a paso"
- **Meta title** (<=60): `Cómo documentar procesos de mecanizado CNC paso a paso`
- **Meta description** (<=155): `Guía práctica para documentar SOPs de mecanizado CNC: qué capturar en arranques, cambios de referencia y troubleshooting, y cómo dejarlo accesible en el puesto.`
- **H1**: `Cómo documentar procesos de mecanizado CNC paso a paso`
- **TL;DR**: 3-4 lineas: por que documentar CNC, que capturar, como mantenerlo vivo.
- **Outline (H2)**:
  1. Por que los procesos CNC se quedan en la cabeza del titular (problema).
  2. Que documentar: arranque/parada, parametros, cambio de referencia, troubleshooting (lista accionable).
  3. Como capturarlo sin parar la maquina (el experto documenta mientras ejecuta).
  4. Como mantener el SOP vivo (versionado, mejora desde planta).
  5. Plantilla y siguientes pasos (CTA + lead magnet).
- **Prueba por seccion**: captura de producto (sop-operario.png), checklist, no inventar tiempos.
- **Enlaces internos**: hub `/blog/` + `/documentacion-procesos/` + `/sectores/mecanizado-cnc/` + caso `/casos-de-uso/transferencia-conocimiento/` + CTA `/video-demo/`.
- **Lead magnet**: Plantilla SOP de produccion (ver seccion 6.1).
- **CTA**: "Descargar plantilla SOP" (descarga) + "Solicitar demo" (demo).
- **Canibalizacion**: complementa `/blog/que-es-un-sop-industrial` (este es how-to por sector, aquel es definicion). Enlazar entre si.

### 2.2 Articulo SOP-2
- **URL**: `/blog/instrucciones-de-trabajo-vs-sop/`
- **Intencion**: informacional (comparativa de conceptos).
- **Keyword primaria**: "instrucciones de trabajo vs SOP"
- **Secundarias**: "diferencia instruccion de trabajo y procedimiento", "que necesita mi taller"
- **Meta title**: `Instrucciones de trabajo vs SOP: qué necesita tu taller`
- **Meta description**: `Instrucción de trabajo, SOP, procedimiento: qué significan, en qué se diferencian y cuál necesita una pyme industrial para reducir errores y dependencia del experto.`
- **H1**: `Instrucciones de trabajo vs SOP: qué necesita tu taller`
- **Outline (H2)**: 1) Definiciones claras (tabla). 2) Cuando basta una instruccion de trabajo. 3) Cuando necesitas un SOP completo. 4) Como conviven en planta. 5) Como empezar sin burocratizar.
- **Enlaces**: `/documentacion-procesos/` + `/workflows/` + `/blog/que-es-un-sop-industrial` + CTA.
- **Lead magnet**: Plantilla SOP de produccion.
- **Canibalizacion**: captura la query "vs" que no cubre el articulo de definicion.

### 2.3 Articulo SOP-3
- **URL**: `/blog/software-sop-para-fabricas-comparativa/`
- **Intencion**: comercial-informacional (alta intencion).
- **Keyword primaria**: "software SOP para fabricas"
- **Secundarias**: "mejor software SOP industrial", "software instrucciones de trabajo digitales"
- **Meta title**: `Software SOP para fábricas: cómo elegir (2026)`
- **Meta description**: `Qué mirar al elegir software SOP industrial: idioma, precio, adopción del operario e implantación. Criterios para pyme industrial española, sin jerga enterprise.`
- **H1**: `Software SOP para fábricas: cómo elegir en 2026`
- **Outline (H2)**: 1) Que resuelve un software SOP. 2) 5 criterios de eleccion (los mismos de las paginas /vs-*). 3) Senales de que una herramienta es demasiado (enterprise). 4) Senales de que te quedas corto (Excel/papel). 5) Como probarlo con bajo riesgo.
- **Enlaces**: `/vs-alternativas/` + las 4 `/vs-*` + `/precios/` + CTA registro.
- **Honestidad**: NO inventar precios de competidores; remitir a "bajo demanda / consultar" y al criterio.
- **Canibalizacion**: hub editorial que alimenta a las paginas `/vs-*` (estas son las que rankean por marca).

### 2.4 Articulo SOP-4 (pilar + lead magnet)
- **URL**: `/blog/plantilla-sop-produccion/`
- **Intencion**: informacional con descarga (lead magnet host).
- **Keyword primaria**: "plantilla SOP de produccion"
- **Secundarias**: "plantilla procedimiento operativo estandar", "modelo SOP industrial descargable"
- **Meta title**: `Plantilla SOP de producción (descarga gratis)`
- **Meta description**: `Plantilla de SOP de producción lista para usar: estructura, campos imprescindibles y ejemplo. Descárgala y adáptala a los procesos críticos de tu planta.`
- **H1**: `Plantilla SOP de producción para descargar`
- **Outline (H2)**: 1) Que incluye un buen SOP (estructura). 2) Como rellenarla (campo a campo). 3) Errores frecuentes. 4) De la plantilla al SOP vivo en planta (puente a producto). + descarga.
- **Lead magnet**: ES la pagina host de la Plantilla SOP (seccion 6.1).
- **Enlaces**: `/documentacion-procesos/` + los 3 articulos SOP anteriores + CTA descarga + CTA demo.

**Cierre de cluster (S4-B2)**: enlazado hub `/blog/` -> articulo -> `/documentacion-procesos/` -> CTA conversion en las 4 piezas.

---

## 3) Cluster conocimiento / absentismo - 4 articulos (Sprint 5, S5-B1)

### 3.1 Articulo CON-1
- **URL**: `/blog/conocimiento-tacito-taller-industrial/`
- **Keyword primaria**: "conocimiento tacito" (+ "taller industrial")
- **Secundarias**: "dependencia de personas clave", "saber hacer operario"
- **Meta title**: `Conocimiento tácito: por qué tu taller depende de él`
- **Meta description**: `Qué es el conocimiento tácito en planta, por qué crea dependencia de personas clave y cómo empezar a capturarlo antes de que una baja o jubilación lo haga visible.`
- **H1**: `Qué es el conocimiento tácito y por qué tu taller depende de él`
- **Outline (H2)**: 1) Que es el conocimiento tacito (definicion + ejemplos planta). 2) Por que no esta en los manuales. 3) El riesgo: bajas, jubilaciones, rotacion. 4) Como empezar a capturarlo (metodo). 5) Que cambia cuando deja de vivir en una cabeza.
- **Enlaces**: `/gestion-competencias/` + caso `/casos-de-uso/transferencia-conocimiento/` + `/blog/documentar-conocimiento-operarios-expertos` + CTA.
- **Canibalizacion**: este es el "que es" (definicion/educativo); `documentar-conocimiento-operarios-expertos` es el "como" (metodo). Enlazar y diferenciar foco.

### 3.2 Articulo CON-2
- **URL**: `/blog/reducir-onboarding-operarios-cinco-a-un-dia/`
- **Keyword primaria**: "reducir onboarding de operarios"
- **Secundarias**: "acelerar incorporacion operarios", "curva de autonomia operario"
- **Meta title**: `Onboarding de operarios: de 5 días a 1 (cómo)`
- **Meta description**: `Cómo acortar la curva de autonomía de un operario nuevo con el proceso en el puesto y matriz de competencias, sin saturar al tutor. Método práctico para pyme industrial.`
- **H1**: `Onboarding de operarios: cómo reducir la curva de 5 días a 1`
- **Outline (H2)**: 1) Por que el onboarding tradicional tarda. 2) Que ralentiza al nuevo (diagnostico). 3) El proceso en el puesto como acelerador. 4) Matriz de competencias para saber cuando es autonomo. 5) Plan 90 dias.
- **Honestidad**: el "5 dias a 1" es un titular de beneficio; en el cuerpo, presentarlo como objetivo/metodo, no como metrica garantizada. Evitar "-80%" sin fuente.
- **Enlaces**: `/onboarding-software-pymes/` + `/casos-de-uso/onboarding-operarios/` + `/para-quien/responsable-rrhh/` + `/blog/onboarding-vs-tradicional` + CTA.
- **Canibalizacion**: foco en "reducir la curva" (operativo), distinto de la "guia de compra" (`onboarding-software-pymes`) y de la "comparativa de metodo" (`onboarding-vs-tradicional`).

### 3.3 Articulo CON-3
- **URL**: `/blog/plan-contingencia-bajas-produccion/`
- **Keyword primaria**: "plan de contingencia para bajas"
- **Secundarias**: "cubrir bajas en produccion", "continuidad operativa baja imprevista"
- **Meta title**: `Plan de contingencia para bajas en producción`
- **Meta description**: `Cómo montar un plan de contingencia para bajas en planta: detectar puestos sensibles, documentar lo crítico y cubrir sin parar la línea. Checklist descargable incluido.`
- **H1**: `Plan de contingencia para bajas en producción`
- **Outline (H2)**: 1) Por que una baja desordena el turno. 2) Detectar puestos de riesgo (single point of failure). 3) Documentar lo critico primero. 4) Activar la cobertura (matriz + proceso en puesto). 5) Checklist de contingencia (descarga).
- **Lead magnet**: Checklist de contingencia ante bajas (seccion 6.2, opcion A).
- **Enlaces**: `/cobertura-turnos/` + `/casos-de-uso/cobertura-bajas/` + `/blog/coste-absentismo-pymes-industriales` + CTA.
- **Canibalizacion**: foco "plan/checklist" (accionable), distinto del articulo de "coste del absentismo" (economico).

### 3.4 Articulo CON-4
- **URL**: `/blog/sop-mantenimiento-preventivo-guia-plantilla/`
- **Keyword primaria**: "SOP de mantenimiento preventivo"
- **Secundarias**: "plan de mantenimiento preventivo plantilla", "checklist mantenimiento maquina"
- **Meta title**: `SOP de mantenimiento preventivo: guía + plantilla`
- **Meta description**: `Cómo documentar un SOP de mantenimiento preventivo: qué tareas incluir, cada cuánto y cómo integrarlo en la agenda del operario. Con plantilla descargable.`
- **H1**: `SOP de mantenimiento preventivo: guía y plantilla`
- **Outline (H2)**: 1) Por que el preventivo se olvida. 2) Estructura de un SOP de mantenimiento. 3) Frecuencias y responsables. 4) Integrarlo en el trabajo diario (no en un Excel aparte). 5) Plantilla (descarga).
- **Enlaces**: `/mantenimiento/` + `/control-produccion/` + `/blog/que-es-un-sop-industrial` + CTA.
- **Lead magnet**: Plantilla SOP (reutiliza la de produccion, variante mantenimiento).

**Cierre (S5-B2)**: enlaces cruzados con `/casos-de-uso/*` y `/para-quien/*`. Difusion LinkedIn (S5-B4): 2-3 posts por articulo, angulo problema -> idea -> enlace.

---

## 4) Comparativas de categoria - 2 piezas (Sprint 6, S6-B1)

Objetivo: capturar al que busca MES/digitalizacion y descubre que es demasiado o demasiado poco.
Estas son paginas (no blog): formato comercial corto (max 5 H2), tabla de 5 criterios, CTA dominante.

### 4.1 REELEVO vs MES tradicional
- **URL**: `/vs-mes-tradicional/` (anadir a matriz como tipo `comparativa`, P1)
- **Keyword primaria**: "alternativa ligera a un MES para pymes"
- **Secundarias**: "cuando no necesitas un MES", "MES para pyme industrial"
- **Meta title**: `¿MES pero eres pyme? Alternativa ligera | REELEVO`
- **Meta description**: `¿Buscas un MES y eres pyme industrial? Quizá no lo necesitas. Compara el enfoque MES con una plataforma operativa ligera: precio, implantación y adopción real.`
- **H1**: `¿Buscas un MES pero eres pyme? Quizá no lo necesitas`
- **Outline (H2, <=5)**: 1) Que es un MES y para quien. 2) Senales de que un MES te sobra. 3) Tabla 5 criterios (MES tradicional vs REELEVO). 4) Que si necesitas (continuidad, onboarding, visibilidad). 5) Como empezar ligero.
- **Honestidad**: educativa, no denigrar al MES; "demasiado para pyme" no "malo". Sin precios inventados.
- **Enlaces**: `/vs-alternativas/` + `/control-produccion/` + `/precios/` + CTA registro/diagnostico.
- **Schema**: `ComparisonChart` (como las otras /vs-).

### 4.2 REELEVO vs Excel y papel
- **URL**: `/vs-excel-papel/` (anadir a matriz, tipo `comparativa`, P1)
- **Keyword primaria**: "digitalizar planta sin Excel"
- **Secundarias**: "fabrica sin papel pyme", "alternativa a Excel en produccion"
- **Meta title**: `Dejar el Excel y el papel en planta | REELEVO`
- **Meta description**: `El rival real del día a día es el Excel y el papel. Compara qué ganas al digitalizar procesos, partes y competencias en una pyme industrial, sin un proyecto pesado.`
- **H1**: `Adiós al Excel y al papel en planta`
- **Outline (H2, <=5)**: 1) El coste oculto del Excel y el papel. 2) Donde fallan (acceso, version, trazabilidad). 3) Tabla 5 criterios (Excel/papel vs REELEVO). 4) Que cambia en planta. 5) Migracion sin dolor.
- **Enlaces**: `/documentacion-procesos/` + `/control-produccion/` + `/blog/coste-absentismo-pymes-industriales` + CTA.
- **Nota**: es el ataque al statu quo (doc posicionamiento 5.3); la mayoria del trafico real esta aqui.

---

## 5) Landing de ayudas / Kit Digital (Sprint 4, S4-C1)

- **URL**: `/kit-digital-pyme-industrial/` (anadir a matriz, tipo `landing`, P1)
- **Intencion**: comercial alta (cluster ayudas Espana).
- **Keyword primaria**: "Kit Digital digitalizacion planta industrial"
- **Secundarias**: "ayudas digitalizacion pyme industrial", "Activa Industria 4.0", "Kit Consulting"
- **Meta title**: `Kit Digital para digitalizar tu planta industrial`
- **Meta description**: `Cómo aprovechar el Kit Digital y otras ayudas para digitalizar procesos, onboarding y competencias en tu pyme industrial. Qué cubren y cómo empezar con REELEVO.`
- **H1**: `Digitaliza tu planta industrial con el Kit Digital`
- **Outline (H2, <=5)**: 1) Que ayudas existen (Kit Digital, Kit Consulting, Activa Industria 4.0). 2) Que pueden cubrir en digitalizacion de planta. 3) Como encaja REELEVO. 4) Pasos para solicitarlo. 5) CTA (diagnostico + contacto).
- **CTA**: "Evaluar mi situacion" (diagnostico) + "Hablar con nosotros" (contacto/mailto).
- **VERIFICACION LEGAL OBLIGATORIA (bloqueante)**: no afirmar que REELEVO es "solucion elegible" ni
  "agente digitalizador" sin confirmarlo oficialmente. Si no esta confirmado, redactar en condicional
  ("puede encajar en el marco de...") y enlazar a las fuentes oficiales (acelerapyme / red.es). Owner de
  negocio aprueba claims antes de publicar.
- **Schema**: `WebPage` + `FAQPage` si hay preguntas reales sobre ayudas.

---

## 6) Lead magnets (S2-B2, S5-B3)

### 6.1 Plantilla SOP de produccion (lead magnet 1)
- **Formato**: plantilla editable (Excel + PDF). Estructura: cabecera (proceso, maquina, version, fecha),
  pasos numerados con campo de verificacion, parametros clave, troubleshooting, firma/responsable.
- **Pagina host**: `/blog/plantilla-sop-produccion/` (SOP-4).
- **Captura de email**: formulario simple (email + empresa). Almacenamiento segun politica de privacidad existente.
- **Evento**: clic en descarga -> `file_download` (intent `descarga`) -> marcar conversion en GA4.
- **Enlaza desde**: hub `/blog`, `/recursos`, articulos SOP-1, SOP-2, SOP-4, CON-4.

### 6.2 Segundo lead magnet (elegir una opcion)
- **Opcion A - Checklist de contingencia ante bajas** (PDF): puestos sensibles, que documentar primero,
  pasos de activacion de cobertura. Pagina host: `/blog/plan-contingencia-bajas-produccion/` (CON-3).
- **Opcion B - Plantilla matriz de competencias (Excel)**: operarios x procesos con niveles
  (entrenando/apto/experto) y deteccion de single point of failure. Pagina host: `/gestion-competencias/`
  o un nuevo `/recursos/plantilla-matriz-competencias/`.
- **Recomendacion**: Opcion B (matriz de competencias) por mayor intencion comercial y reutilizacion;
  conecta directo con `/gestion-competencias/` y `/para-quien/responsable-rrhh/`.

---

## 7) Definicion de "listo" por pieza (resumen del gate)

Antes de publicar cualquier pieza de este documento:
- [ ] Title 50-60 y meta description 140-155 dentro de rango.
- [ ] H1 unico con keyword primaria; TL;DR + indice anclado (articulos).
- [ ] Enlaces internos del cluster colocados (hub + capacidad + caso/rol + conversion).
- [ ] CTA(s) con atributos `data-cta` correctos.
- [ ] Schema `Article`/`ComparisonChart`/`WebPage` segun tipo.
- [ ] Sin claims no verificables; datos con fuente; escenarios etiquetados como ilustrativos.
- [ ] URL nueva anadida a `MATRIZ_URL_INTENCION_SPRINT1.csv` y al sitemap (`src/pages/sitemap.xml.ts`).
- [ ] Lead magnet (si aplica) con evento `file_download` validado.
- [ ] Aprobacion del owner de negocio para claims sensibles (especial: landing Kit Digital).

---

## 8) Resumen de produccion

| Pieza | URL | Sprint | Tipo | Lead magnet |
|---|---|---|---|---|
| SOP-1 documentar CNC | /blog/documentar-procesos-mecanizado-cnc/ | S4 | blog | Plantilla SOP |
| SOP-2 instrucciones vs SOP | /blog/instrucciones-de-trabajo-vs-sop/ | S4 | blog | Plantilla SOP |
| SOP-3 software SOP fabricas | /blog/software-sop-para-fabricas-comparativa/ | S4 | blog | - |
| SOP-4 plantilla SOP | /blog/plantilla-sop-produccion/ | S4 | blog + host | Plantilla SOP |
| CON-1 conocimiento tacito | /blog/conocimiento-tacito-taller-industrial/ | S5 | blog | - |
| CON-2 onboarding 5->1 | /blog/reducir-onboarding-operarios-cinco-a-un-dia/ | S5 | blog | - |
| CON-3 plan contingencia | /blog/plan-contingencia-bajas-produccion/ | S5 | blog + host | Checklist contingencia |
| CON-4 SOP mantenimiento | /blog/sop-mantenimiento-preventivo-guia-plantilla/ | S5 | blog | Plantilla SOP |
| Categoria vs MES | /vs-mes-tradicional/ | S6 | comparativa | - |
| Categoria vs Excel/papel | /vs-excel-papel/ | S6 | comparativa | - |
| Landing Kit Digital | /kit-digital-pyme-industrial/ | S4 | landing | - |
| Lead magnet 1 | (host SOP-4) | S4 | descargable | Plantilla SOP |
| Lead magnet 2 | (matriz competencias / contingencia) | S5 | descargable | si |

Total: 10 paginas/articulos nuevos + 2 lead magnets. Todas amplian el arbol actual de 52 URLs; recordar
actualizar matriz, sitemap y checklist a medida que se publiquen.
