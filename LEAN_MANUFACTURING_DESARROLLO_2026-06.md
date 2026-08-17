# Lean Manufacturing en Reelevo — Plan de desarrollo

> **Fecha:** 2026-06-29
> **Origen:** análisis del artículo de Mecalux ["Metodología Lean"](https://www.mecalux.es/blog/metodologia-lean) cruzado con el estado real del producto.
> **Alcance de este documento:** SOLO los conceptos Lean que encajan con el dominio de Reelevo (ejecución y estandarización de planta / *Lean Manufacturing*) y que **todavía no están desarrollados o lo están a medias**.
> **Fuera de alcance (no desarrollar):** *Lean Logistics* del artículo — almacenes, transelevadores, picking, logística inversa, SGA, inventario, transporte. No es el producto y no se aborda aquí.

---

## 0. Cómo leer este documento

Reelevo ya es una herramienta Lean fuerte en el pilar de **personas + mejora continua + andon/jidoka**. Este plan no reescribe eso: identifica los **5 huecos** que completan la propuesta Lean del producto, ordenados por relación valor/esfuerzo y por encaje con la lógica que ya existe.

Cada iniciativa documenta: objetivo Lean · encaje en la lógica actual (tablas/ficheros reales) · tareas · beneficios · riesgo de NO implementar · riesgo de implementar · flag/tier.

---

## 1. Resumen ejecutivo

| # | Iniciativa | Concepto Lean | Esfuerzo | Prioridad | Encaje |
|---|---|---|---|---|---|
| L1 | **Calidad real en OEE (captura de rechazos/scrap)** | Desperdicio: Defectos · 5 principios (flujo) | M | 🔴 Alta | Cierra un dato falso ya en producción |
| L2 | **Clasificación de desperdicios (8 mudas / TIMWOODS)** | Eliminación de desperdicios | S-M | 🟠 Media-alta | Reusa `production_stops` + `kaizen_items` |
| L3 | **Tablero Kanban de gestión visual** | Principio 2 (kanban) · gestión visual | M | 🟠 Media-alta | El pipeline kaizen ya existe como datos |
| L4 | **Value Stream Map ligero (VSM)** | Principio 2 (value stream mapping) | L | 🟡 Media | Tiempos de ciclo ya se capturan |
| L5 | **Takt time + señal pull** | Principio 4 (sistema pull) | M-L | 🟡 Media | `production_plan_assignments` ya tiene demanda |

Esfuerzo: S ≈ 1-3 días · M ≈ 1-2 semanas · L ≈ 3-4 semanas (1 dev).

**Secuencia recomendada:** L1 → L2 → L3 → L4 → L5. L1 desbloquea datos de calidad que L2/L4 reaprovechan; L3 es transversal y se puede solapar.

---

## 2. Lo que YA está cubierto (referencia, no desarrollar)

Para evitar trabajo redundante, esto ya existe y cumple Lean:

- **Mejora continua (Kaizen):** módulo completo — `kaizen_items` con ciclo `capturada→analizando→aprobada→en_ejecucion→verificacion→estandarizada→cerrada`, root causes (5 porqués), acciones, reglas de automatización, impacto, plantillas y benchmarks. Ver [app/empresa/kaizen/page.tsx](app/empresa/kaizen/page.tsx) y migraciones `20260422000001..011_kaizen_*.sql`.
- **Andon / Jidoka (parar ante el defecto):** `production_stops` — el operario pulsa "Error", se crea item en bandeja del supervisor, cadena operario→supervisor→admin y `incorporated_into_step_id` para estandarizar la solución en el proceso. Ver [supabase/migrations/01_production_stops.sql](supabase/migrations/01_production_stops.sql).
- **Estandarización del trabajo:** `processes` / `process_steps` / `process_versions` con versionado y certificación por versión.
- **Desarrollo de personas (habilidades no aprovechadas):** skill-matrix, gamificación, rewards, contribuciones del operario desde el QR.
- **Medición de eficiencia:** OEE diario (`oee_daily_snapshots`, [lib/oee.ts](lib/oee.ts)) — **con la salvedad de L1**.

---

## 3. Iniciativas

### L1 · Calidad real en OEE — captura de rechazos / scrap 🔴

**Objetivo Lean:** atacar el desperdicio **Defectos** y completar el OEE. Hoy el pilar Calidad del OEE está **hardcodeado a 100%** ([lib/oee.ts:160](lib/oee.ts#L160): `const qualityPct = 100.0 // sin datos de rechazo por ahora`), por lo que el OEE actual es realmente Disponibilidad × Rendimiento. Es un dato engañoso que ya se muestra al cliente.

**Encaje en la lógica actual:**
- `qr_scan_sessions.units_produced` ya existe; falta el contador de unidades NOK.
- `production_stops` ya captura incidencias; los defectos pueden modelarse como subtipo o tabla hermana.
- Conecta con `trazabilidad` y `recalls` (ya en el repo): un defecto detectado debería poder enlazar a la pieza/lote.
- `computeOEEForDay` ya calcula sobre sesiones; solo hay que sustituir el `100.0` por `(producidas − rechazadas) / producidas`.

**Tareas:**
1. **BD:** migración `ALTER TABLE qr_scan_sessions ADD COLUMN units_rejected integer NOT NULL DEFAULT 0`; nueva tabla `quality_rejections` (motivo, cantidad, foto, lote/pieza, `process_step_id`, `qr_scan_session_id`) con RLS por `company_id`.
2. **RPC/UI QR:** en el flujo de producción del operario, añadir "registrar rechazo" (cantidad + motivo + foto opcional). Reusa el patrón de `production_stops`.
3. **OEE:** en [lib/oee.ts](lib/oee.ts) calcular `qualityPct = unitsProduced > 0 ? (unitsProduced − unitsRejected) / unitsProduced * 100 : 100`. Recalcular snapshots vía cron `oee-snapshot`.
4. **Dashboard:** desglose de OEE con Calidad real y top motivos de rechazo (Pareto). Auto-sugerir kaizen ante recurrencia (regla `error_pattern` ya soportada en `kaizen_automation_rules`).
5. **Tests:** unit de `computeOEEForDay` con rechazos; e2e del registro de rechazo en QR.

**Beneficios:** OEE veraz (vendible y auditable), Pareto de defectos accionable, base para SPC futuro, enlace defecto↔trazabilidad↔recall.

**Riesgo de NO implementar:** se sigue mostrando un OEE inflado → pérdida de confianza del cliente cuando audite, y el desperdicio nº1 de Lean (defectos) queda sin medir.

**Riesgo de implementar:** los snapshots históricos quedan con Calidad=100% (marcar `quality_estimated=true` para no romper series); fricción si el registro de rechazo no es ágil en el QR (mitigar con UI de 2 toques).

**Flag/tier:** sin flag nuevo (es corrección de un módulo ya activo); el desglose avanzado puede ir en tier Pro.

---

### L2 · Clasificación de los 8 desperdicios (TIMWOODS) 🟠

**Objetivo Lean:** hacer **visible y medible la eliminación de desperdicios** — el primer ideal Lean. El artículo lista 8: Transporte, Inventario, Movimiento, Espera, Sobreprocesamiento, Sobreproducción, Defectos, Habilidades. Reelevo puede instrumentar los que ocurren en planta (Espera, Movimiento, Sobreprocesamiento, Defectos, Habilidades; Transporte/Inventario/Sobreproducción quedan informativos).

**Encaje en la lógica actual:**
- `kaizen_items` ya tiene `impact_type` (`seguridad|calidad|tiempo|ergonomia|material|mantenimiento`). Se añade una **dimensión ortogonal** `waste_type`.
- `production_stops` ya clasifica incidencias; añadir `waste_type` permite agregarlas.
- El cron `kaizen-reminders` y las reglas de automatización ya existen para explotarlo.

**Tareas:**
1. **BD:** `CREATE TYPE lean_waste_type AS ENUM ('transporte','inventario','movimiento','espera','sobreproceso','sobreproduccion','defectos','talento')`; columna `waste_type` en `kaizen_items` y `production_stops` (nullable).
2. **UI captura:** selector de tipo de desperdicio al crear kaizen/parada (opcional, no bloqueante).
3. **Mapeo automático:** derivar `waste_type` por defecto desde la fuente (p. ej. parada por avería→`espera`; rechazo→`defectos`) editable.
4. **Panel "Desperdicios":** dashboard en `empresa` con distribución por tipo, tendencia y coste estimado (horas/€). Reusa `v_production_stop_stats`.
5. **Tests:** agregación por `waste_type`.

**Beneficios:** lenguaje Lean explícito para el cliente, priorización de kaizen por tipo de muda, base de reporting para consultoras Lean (diferenciador comercial).

**Riesgo de NO implementar:** la "eliminación de desperdicios" queda implícita; el cliente no puede demostrar reducción de mudas a su dirección/auditor.

**Riesgo de implementar:** taxonomía mal entendida por operarios → datos ruidosos (mitigar con defaults automáticos y campo opcional); riesgo de "otro selector más" en el QR (mantenerlo fuera del camino crítico del operario, en supervisor/admin).

**Flag/tier:** `feat_lean_waste` (Pro+).

---

### L3 · Tablero Kanban de gestión visual 🟠

**Objetivo Lean:** principio 2 (tableros kanban) + gestión visual del flujo de trabajo. Hoy el pipeline kaizen existe como **datos y estados** (`kaizen_item_status`) pero se consume como lista, no como tablero visual con columnas y WIP.

**Encaje en la lógica actual:**
- `kaizen_item_status` (8 estados) → columnas naturales del tablero.
- `kaizen_item_events` (`status_changed`, `from_status`, `to_status`) ya registra transiciones → drag&drop solo dispara el cambio de estado existente vía la API `PATCH /api/empresa/kaizen/items/[id]`.
- `production_plan_assignments` puede alimentar un segundo tablero (plan de producción por día/turno).

**Tareas:**
1. **UI:** vista Kanban (columnas por estado, tarjetas = `kaizen_items`) reutilizando el endpoint de cambio de estado ya existente. Drag → `PATCH status`.
2. **WIP limits:** límite configurable por columna en `company_kaizen_settings`; aviso visual al excederlo (control visual Lean).
3. **Filtros:** por planta, máquina, owner, `waste_type` (L2), prioridad.
4. **(Opcional) Tablero de producción:** vista kanban de `production_plan_assignments` por turno (Pendiente / En curso / Hecho).
5. **Tests:** que el drag dispare la transición correcta y respete RLS/tier.

**Beneficios:** adopción (lo visual vende y se usa más), WIP limit = control de sobrecarga, cero modelo de datos nuevo (bajo riesgo, alto impacto percibido).

**Riesgo de NO implementar:** el motor kaizen, ya potente, se infrautiliza por UX de lista; menor stickiness.

**Riesgo de implementar:** puramente frontend, riesgo bajo; cuidar rendimiento con muchos items (paginar/virtualizar columnas) y consistencia de RLS en el PATCH masivo.

**Flag/tier:** sin flag nuevo; es una vista alternativa del módulo kaizen ya existente.

---

### L4 · Value Stream Map ligero (VSM) 🟡

**Objetivo Lean:** principio 2, **value stream mapping** — visualizar el flujo de materiales/información de un producto/proceso, identificar tiempo de valor añadido (VA) vs no añadido (NVA) y cuellos de botella.

**Encaje en la lógica actual:**
- Los **tiempos de ciclo reales ya se capturan**: `qr_scan_sessions.duration_secs` por proceso/máquina, y `process_steps` da el desglose por paso.
- `process_productivity_config.expected_duration_seconds` ya define el ciclo ideal (usado por OEE).
- `production_stops.total_stop_seconds` aporta el tiempo de espera/NVA.
- Falta SOLO la **clasificación VA/NVA/NNVA por paso** y la **vista de mapa**.

**Tareas:**
1. **BD:** `ALTER TABLE process_steps ADD COLUMN value_class text CHECK (value_class IN ('VA','NVA','NNVA'))` (NNVA = necesario pero sin valor).
2. **UI clasificación:** en el editor de proceso, marcar cada paso como VA/NVA/NNVA.
3. **Cálculo:** por proceso/producto, agregar lead time (Σ duraciones reales + esperas), tiempo VA, % VA = VA/lead time, e identificar el paso cuello de botella (mayor `avg duration`).
4. **Vista VSM:** diagrama horizontal de pasos con barras de tiempo, % VA y marcadores de paradas/defectos por paso (reusa L1/L2).
5. **Tests:** cálculo de % VA y cuello de botella con datos sintéticos.

**Beneficios:** diagnóstico Lean clásico que hoy se hace en papel/Excel, dentregable directo para consultoría Lean, prioriza dónde aplicar kaizen (cuello de botella).

**Riesgo de NO implementar:** Reelevo tiene los datos de tiempo pero no los convierte en el artefacto Lean más reconocible → oportunidad de diferenciación perdida.

**Riesgo de implementar:** la calidad del VSM depende de que haya volumen de sesiones (poco dato → mapa pobre; mostrar aviso de confianza); la clasificación VA/NVA requiere criterio del cliente (ofrecer plantillas/guía).

**Flag/tier:** `feat_lean_vsm` (Pro/Enterprise).

---

### L5 · Takt time + señal pull 🟡

**Objetivo Lean:** principio 4, **sistema pull** — producir al ritmo de la demanda real, no por anticipado. El takt time (= tiempo disponible / demanda) marca ese ritmo y se compara con el tiempo de ciclo real.

**Encaje en la lógica actual:**
- La **demanda ya existe**: `production_plan_assignments.quantity_target` por `plan_date`/`shift`/`product`.
- El **tiempo disponible** ya se calcula en OEE desde `company_shift_config` (turnos, descansos) — ver [lib/oee.ts:45-79](lib/oee.ts#L45-L79).
- El **tiempo de ciclo real** sale de `qr_scan_sessions.duration_secs` / `units_produced`.
- Es sobre todo **cálculo + visualización**, reaprovechando tres fuentes ya presentes.

**Tareas:**
1. **Cálculo:** `takt = tiempo_disponible_turno / quantity_target`. Extraer el tiempo disponible a un helper compartido con `lib/oee.ts` (evitar duplicar la lógica de turnos).
2. **Comparación takt vs ciclo real:** semáforo por máquina/proceso (ciclo > takt → no se llega a la demanda; ciclo ≪ takt → riesgo de sobreproducción).
3. **Señal pull en planificación:** en [app/empresa/planificacion/page.tsx](app/empresa/planificacion/page.tsx), indicador de ritmo y alerta de desajuste; opcional alerta vía cron (reusar patrón de `hour-deviation-alerts`).
4. **Tests:** cálculo de takt con turnos partidos / cruce de medianoche (ya contemplado en OEE).

**Beneficios:** introduce el pensamiento pull sin un MES completo; detecta sobreproducción (muda) y subcapacidad; refuerza la planificación que ya existe.

**Riesgo de NO implementar:** el principio pull queda sin cubrir (hoy es 0%); la planificación sigue siendo "push por plan" sin contraste con capacidad.

**Riesgo de implementar:** sensible a la calidad de `quantity_target` y de la config de turnos (si el cliente no los mantiene, el takt engaña → exigir datos mínimos antes de mostrarlo); no confundir con scheduling MES completo (mantener alcance acotado).

**Flag/tier:** `feat_lean_takt` (Pro+).

---

## 4. Consideraciones transversales

- **Multi-tenant / RLS:** toda tabla nueva (`quality_rejections`, columnas `waste_type`, `value_class`) lleva `company_id` + RLS por `app_metadata.company_id`, siguiendo el patrón de `production_stops`. Ver `scripts/check-tenant-rls.mjs`.
- **Migraciones:** formato `YYYYMMDDNNNNNN_descripcion.sql`, idempotentes, según `supabase/MIGRATION_GUIDE.md`.
- **Feature flags / tier:** seguir el patrón `feat_kaizen` (default `false`) y `tier_config` para gating comercial.
- **Reutilización:** L1, L4 y L5 comparten el cálculo de tiempo de turno hoy embebido en `lib/oee.ts`; extraerlo a `lib/shift-time.ts` antes de L5 para no triplicar la lógica.
- **i18n:** etiquetas Lean (mudas, VA/NVA) por el sistema de traducciones ya existente (`procesos/[id]/traducciones`, `configuracion/idiomas`).

---

## 5. Trazabilidad con el artículo (qué principio cubre cada iniciativa)

| Concepto del artículo | Estado previo | Cubierto por |
|---|---|---|
| Eliminación de desperdicios (ideal 1) | Parcial | L1 (defectos), L2 (8 mudas), L5 (sobreproducción) |
| Mejora continua (ideal 2) | ✅ Ya cubierto | Kaizen existente |
| Aporte de valor / personas (ideal 3) | ✅ Ya cubierto | Skill-matrix, gamificación, kaizen |
| Principio 1 — identificar valor | Parcial | L4 (clasificación VA/NVA) |
| Principio 2 — VSM / kanban | ❌ Faltaba | L3 (kanban), L4 (VSM) |
| Principio 3 — flujo óptimo | ✅ Ya cubierto | Procesos/workflows/versionado |
| Principio 4 — sistema pull | ❌ Faltaba | L5 (takt + pull) |
| Principio 5 — progreso constante | ✅ Ya cubierto | Kaizen + OEE |
| Desperdicio: Defectos | Parcial | L1 |
| Desperdicio: Habilidades | ✅ Ya cubierto | Skill-matrix |
| Desperdicios logísticos (Transporte/Inventario) | Fuera de alcance | — (no es el producto) |
