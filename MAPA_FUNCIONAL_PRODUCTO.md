# REELEVO — Mapa funcional del producto

> **Propósito de este documento:** servir de fuente única para adaptar la web comercial a lo que la app **realmente hace hoy**.
> Todo lo que aparece aquí está verificado contra el código del repositorio, no contra documentación previa.
>
> **Fecha de verificación:** 2026-08-17 · **Rama:** `feat/trazabilidad-fase-1`
>
> ⚠️ `lib/product-truth.ts` está **desactualizado** (marca como `not_started` módulos que ya existen: skill decay, ROI, kaizen). No usarlo como referencia comercial. Este documento lo sustituye.

---

## Índice

1. [Qué es REELEVO en una frase](#1-qué-es-reelevo-en-una-frase)
2. [El problema que resuelve](#2-el-problema-que-resuelve)
3. [Cómo funciona — el modelo mental](#3-cómo-funciona--el-modelo-mental)
4. [Esquema de la app — 4 portales](#4-esquema-de-la-app--4-portales)
5. [El flujo QR (el núcleo del producto)](#5-el-flujo-qr-el-núcleo-del-producto)
6. [Mapa de módulos por área funcional](#6-mapa-de-módulos-por-área-funcional)
7. [Roles y permisos](#7-roles-y-permisos)
8. [Planes y qué incluye cada uno](#8-planes-y-qué-incluye-cada-uno)
9. [Integraciones](#9-integraciones)
10. [Lo que la app hace sola (automatizaciones)](#10-lo-que-la-app-hace-sola-automatizaciones)
11. [Plataforma para IT: API, webhooks, SCIM, SSO](#11-plataforma-para-it-api-webhooks-scim-sso)
12. [Seguridad y cumplimiento](#12-seguridad-y-cumplimiento)
13. [Qué NO se debe vender todavía](#13-qué-no-se-debe-vender-todavía)
14. [Traducción de funciones a mensajes de web](#14-traducción-de-funciones-a-mensajes-de-web)
15. [Cifras del producto](#15-cifras-del-producto)

---

## 1. Qué es REELEVO en una frase

**REELEVO es el software que convierte la ejecución de planta en datos: el operario escanea un QR en la máquina, la app le guía paso a paso por el proceso correcto, y cada acción queda registrada con evidencia — quién, qué, cuándo, en qué máquina, con qué resultado.**

Categoría de mercado: **software operativo industrial / digitalización de operaciones de planta** (frontera entre SOP digital, MES ligero y gestión de competencias).

Referencias competitivas: Dozuki (SOPs digitales), Tulip (operaciones), MaintainX / Limble (mantenimiento), Azumuta (competencias).

---

## 2. El problema que resuelve

| Dolor real en planta | Cómo lo resuelve REELEVO |
|---|---|
| El procedimiento vive en un papel plastificado desactualizado, o en la cabeza del operario veterano | Procesos digitales versionados, accesibles desde el QR de la máquina, siempre en la última versión |
| Nadie sabe qué se hizo realmente en el turno de noche | Cada sesión queda registrada: operario, máquina, proceso, duración, unidades, paradas, rechazos |
| Cuando se va un operario clave, el conocimiento se va con él | Skill matrix, rutas de aprendizaje, certificaciones, detección de conocimiento en riesgo y de cobertura de turnos |
| El operario no tiene ordenador, ni email, ni ganas de aprender otro sistema | Acceso por QR + código personal. Sin cuenta, sin email, sin contraseña, sin instalar nada |
| Un cliente reclama un lote y hay que reconstruir a mano qué pasó | Trazabilidad por pieza y lote, informe PDF, gestión de recalls y cuarentena |
| Las mejoras que propone la gente de planta se pierden | Kaizen: contribuciones desde el móvil, tablero, motor de reglas, recompensas y medición de impacto |
| La dirección no tiene datos fiables para decidir | OEE, productividad, rendimiento, ROI, Lean (TIMWOODS, VSM, takt), reportes PDF automáticos por email |
| El mantenimiento preventivo se hace "cuando toca" | Planes preventivos, órdenes automáticas, histórico por máquina |

---

## 3. Cómo funciona — el modelo mental

```
   1. SE PREPARA                2. SE EJECUTA              3. SE MIDE               4. SE MEJORA
   ─────────────                ─────────────              ──────────               ────────────

   La empresa carga             El operario escanea        Cada sesión              La planta propone
   sus máquinas,                el QR de la máquina        alimenta KPIs,           mejoras (Kaizen),
   procesos y                   y ejecuta el proceso       OEE, trazabilidad        el sistema detecta
   operarios                    paso a paso                y cumplimiento           riesgos y avisa
        │                             │                          │                        │
        ▼                             ▼                          ▼                        ▼
   Portal EMPRESA              Flujo QR / Portal          Portal EMPRESA           Kaizen + crons
   (o importación IA)          OPERARIO                   Portal SUPERVISOR        + workflows
```

**Las cuatro fases usan el mismo dato.** No hay doble captura: lo que el operario ejecuta es lo que alimenta la analítica, la trazabilidad, el OEE y la nómina de horas.

---

## 4. Esquema de la app — 4 portales

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          REELEVO                                        │
├─────────────────┬─────────────────┬──────────────────┬──────────────────┤
│  PORTAL         │  PORTAL         │  PORTAL          │  FLUJOS QR       │
│  EMPRESA        │  SUPERVISOR     │  OPERARIO        │  PÚBLICOS        │
│  /empresa       │  /supervisor    │  /operario       │  /m, /pieza, …   │
├─────────────────┼─────────────────┼──────────────────┼──────────────────┤
│ Cliente:        │ Cliente:        │ Cliente:         │ Cliente:         │
│ dirección,      │ jefe de turno   │ operario con     │ operario en      │
│ producción,     │ / responsable   │ móvil propio     │ máquina, o       │
│ calidad, RRHH   │ de línea        │                  │ cliente final    │
│                 │                 │                  │                  │
│ 88 pantallas    │ Validación,     │ Agenda, semana,  │ Sin login o con  │
│ Escritorio      │ aprobaciones,   │ contribuciones,  │ código personal  │
│                 │ rutas           │ recompensas      │ Móvil, PWA       │
└─────────────────┴─────────────────┴──────────────────┴──────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   PORTAL ADMIN        │  ← interno REELEVO, no se vende
                    │   /admin (43 pant.)   │     (soporte, billing, marketing)
                    └───────────────────────┘
```

| Portal | Ruta | Para quién | Qué hace |
|---|---|---|---|
| **Empresa** | `/empresa` | Dirección, producción, calidad, RRHH, IT | Configurar, gestionar y analizar toda la operación. 88 pantallas |
| **Supervisor** | `/supervisor` | Jefe de turno / línea | Validar ejecuciones, aprobar pasos, seguir rutas de aprendizaje |
| **Operario** | `/operario` | Operario con móvil | Su agenda, su semana, sus procesos, sus contribuciones y recompensas |
| **QR públicos** | `/m/[token]`, `/pieza/[token]`, `/proceso-*` | Operario en máquina, cliente final | Ejecutar procesos y consultar trazabilidad sin cuenta |
| **Admin** | `/admin` | Equipo REELEVO | Operación interna: empresas, billing, soporte, logs, marketing |

---

## 5. El flujo QR (el núcleo del producto)

Es el diferencial: **el operario no necesita cuenta, email ni contraseña.**

```
  📱 ESCANEA QR PEGADO EN LA MÁQUINA
             │
             ▼
  /m/[token] ──── ¿qué máquina es? ¿qué procesos tiene activos?
             │
             ▼
  🔑 IDENTIFICACIÓN
     ├── Código personal (8 caracteres)  → identifica al operario
     └── PIN de empresa (4 dígitos)      → sesión anónima
             │
             ▼  sesión válida 24 h en el dispositivo
  📋 SELECCIÓN
     ├── ¿La máquina tiene obras activas? → elige obra y asignación
     └── Si no → elige proceso (ordenados por frecuencia de uso)
             │
             ▼
  ▶️  EJECUCIÓN PASO A PASO
     ├── Contenido del paso: texto, imágenes, vídeo, adjuntos
     ├── Tipos de paso: tarea manual · medición · aprobación de
     │   supervisor · espera bloqueada · retrabajo
     ├── Checklist con evidencia (foto)
     ├── Campos de captura personalizados
     ├── Registro de unidades producidas y rechazadas
     ├── Registro de paradas de máquina con motivo
     ├── Quiz de validación de conocimiento (si está configurado)
     ├── Confirmación de lectura de nueva versión del proceso
     ├── Reportar avería / reportar problema / sugerir mejora
     └── Idioma del operario (es · en · pt + traducciones del proceso)
             │
             ▼
  ✅ CIERRE
     ├── Firma digital / sign-off
     ├── Certificación automática del operario en esa versión
     └── QR de pieza generado (trazabilidad)
             │
             ▼
  👷 VALIDACIÓN DEL SUPERVISOR (si está activada)
     └── /supervisor/validar → la sesión queda validada o rechazada
```

**Modos de sesión:** estándar · formación · aprendizaje · anónima.

**Offline (MVP):** el flujo QR funciona con contenido cacheado y sincronización diferida (PWA con service worker). No cubre todavía todos los flujos → ver [sección 13](#13-qué-no-se-debe-vender-todavía).

**Otras entradas QR:**

| Ruta | Qué es |
|---|---|
| `/maquina/[id]` | Ficha de máquina: historial, paradas, procesos |
| `/pieza/[token]` | **Página pública de trazabilidad de una pieza** — obra, producto, operarios que intervinieron, ejecuciones, lote. Opción de descarga de informe PDF activable por la empresa |
| `/proceso-aprendizaje/[id]` | Flujo formativo interactivo |
| `/proceso-produccion/[id]` | Flujo de producción con captura de datos |
| `/proceso-anonimo/[id]` | Proceso consultable por enlace, sin login |
| `/m/visitante` | Recorrido demo para visitantes (uso comercial) |
| `/nps/[token]` | Encuesta NPS pública |

---

## 6. Mapa de módulos por área funcional

### 🏭 Bloque 1 · Ejecución en planta

| Módulo | Ruta | Qué hace |
|---|---|---|
| Máquinas | `/empresa/maquinas` | Alta, edición, grupos, códigos QR, impresión de QR y PDF |
| Generación de QR | `/empresa/qrs`, `/empresa/maquinas/qr-print` | Gestión y reimpresión de QR de máquina |
| Procesos | `/empresa/procesos` | Alta, edición, pasos, adjuntos, publicación, versionado |
| Traducciones de proceso | `/empresa/procesos/[id]/traducciones` | Proceso en varios idiomas para plantilla multinacional |
| Importación | `/empresa/importar` | Carga de procesos desde Word, PDF **y vídeo**, con asistencia de IA (Claude) |
| Productos | `/empresa/productos` | Productos y procesos vinculados |
| Plantas y áreas | `/empresa/plantas` | Multi-planta, áreas, comparador entre plantas |

### 🎓 Bloque 2 · Conocimiento y competencias

| Módulo | Ruta | Qué hace |
|---|---|---|
| Operarios | `/empresa/operarios` | Alta, perfil, skills, certificaciones, importación masiva |
| Skill matrix | `/empresa/skill-matrix` | Matriz de competencias operario × proceso |
| Rutas de aprendizaje | `/empresa/rutas` | Itinerarios formativos y asignaciones, con seguimiento |
| Cobertura de turnos | `/empresa/cobertura-turnos` | Mapa de riesgo: qué turnos quedan sin nadie capacitado |
| Riesgo de conocimiento | `/empresa/knowledge-risk` | Procesos que dependen de una sola persona, sin revisar, o con alta variación |
| Base de conocimiento | `/empresa/knowledge-base` | Artículos y documentación operativa |
| Solicitudes de contenido | `/empresa/solicitudes` | El operario pide un procedimiento que falta |
| Skill decay | *(automático)* | Detección de competencias que se degradan por falta de uso (hitos 60/90/180 días, configurables) |
| Caducidad de certificaciones | *(automático)* | Email diario con lo que vence en ≤7 días; el webhook `certification.expiring` se emite en los hitos 7/3/1 |

### 📦 Bloque 3 · Producción y planificación

| Módulo | Ruta | Qué hace |
|---|---|---|
| Planificación | `/empresa/planificacion` | Plan de producción, órdenes, asignaciones |
| Turnos | `/empresa/turnos`, `/empresa/planificacion/turnos` | Configuración de turnos y asignación de máquinas |
| Producción | `/empresa/produccion` | Seguimiento de producción |
| Monitoreo en vivo | `/empresa/monitoreo` | Quién está trabajando ahora, en qué máquina y en qué proceso |
| Validación | `/empresa/validacion` | Revisión y firma de ejecuciones |
| Obras | `/empresa/obras` | Proyectos/obras con piezas, operarios asignados y QR de pieza |
| Horas | `/empresa/operarios/horas` | Horas por operario y categoría, con alertas de desviación >10% |

### 🔍 Bloque 4 · Trazabilidad y calidad

| Módulo | Ruta | Qué hace |
|---|---|---|
| Dashboard de trazabilidad | `/empresa/trazabilidad` | % de cadena completa (30 días), piezas con lote, piezas en cuarentena, recalls activos |
| Recalls | `/empresa/recalls` | Gestión de retiradas con severidad: **obligatorio · precautorio · informativo** |
| QR de pieza | `/empresa/obras/[id]/piece-qrs/print` | Generación e impresión de QR por pieza |
| Informe público de pieza | `/pieza/[token]` | Página pública + PDF descargable (activable por la empresa) |
| Búsqueda por lote | `/empresa/busqueda` | Búsqueda global, incluida búsqueda por lote |
| Pareto de calidad | *(API)* | Análisis Pareto de rechazos |

### 🔧 Bloque 5 · Mantenimiento

| Módulo | Ruta | Qué hace |
|---|---|---|
| Mantenimiento | `/empresa/mantenimiento` | Planes preventivos, órdenes de trabajo, dashboard |
| Órdenes automáticas | *(automático)* | Generación diaria de órdenes según los planes configurados |

### 📊 Bloque 6 · Analítica y decisión

| Módulo | Ruta | Qué hace |
|---|---|---|
| Dashboard | `/empresa/dashboard` | KPIs de la empresa |
| Estadísticas | `/empresa/estadisticas` | Producción, duración, anomalías, con filtros avanzados |
| Productividad | `/empresa/productividad` | KPIs de productividad y logs detallados |
| Rendimiento | `/empresa/rendimiento` | Rendimiento por operario y por máquina |
| **OEE** | `/empresa/oee` | Disponibilidad × Rendimiento × Calidad, por máquina y planta. Snapshot diario automático |
| **ROI** | `/empresa/roi` | Tiempo ahorrado y retorno, con resumen semanal por email |
| **Lean** | *(en OEE y Kaizen)* | Reparto de desperdicios TIMWOODS, Value Stream Map (%VA), takt time y señal pull |
| Comparador de plantas | `/empresa/plantas/comparar` | Benchmark entre plantas del grupo |
| Reportes programados | `/empresa/configuracion/reportes` | PDFs semanales/mensuales enviados por email automáticamente |
| Exportación | *(transversal)* | CSV y Excel |

### 💡 Bloque 7 · Mejora continua (Kaizen)

| Módulo | Ruta | Qué hace |
|---|---|---|
| Tablero Kaizen | `/empresa/kaizen/tablero` | Flujo de mejoras en formato tablero |
| Revisiones | `/empresa/kaizen/revisiones` | Bandeja de revisión y aprobación |
| Reportes Kaizen | `/empresa/kaizen/reportes` | Scorecard, analítica y benchmarks |
| Contribuciones | `/empresa/contribuciones` | Propuestas de mejora enviadas por operarios |
| Recompensas | `/empresa/gamificacion`, `/operario/recompensas` | Puntos, badges y configuración de premios |
| Motor de reglas | *(automático)* | Clasifica, puntúa y crea acciones automáticamente cada día |
| Insights con IA | *(automático, semanal)* | Claude analiza los procesos y genera propuestas Kaizen pre-rellenadas |
| Medición de impacto | *(en Kaizen)* | Métricas de impacto y ROI de cada mejora implantada |

Ciclo completo del operario: **captura desde el móvil → revisión del supervisor → estandarización → cierre → impacto medido.**

### ⚙️ Bloque 8 · Automatización (workflows)

| Módulo | Ruta | Qué hace |
|---|---|---|
| Workflows | `/empresa/workflows` | Editor visual de flujos (DAG, arrastrar y soltar) |
| Editor | `/empresa/workflows/[id]/editor` | **17 tipos de nodo**: inicio, fin, proceso, operación, máquina, tarea manual, medición, aprobación de supervisor, decisión, checkpoint, incidencia, retrabajo, espera bloqueada, retardo, split paralelo, join paralelo, nota |
| Programación | *(en el editor)* | Disparo manual, por intervalo, semanal, mensual por día o por n-ésimo día de la semana |
| Estadísticas | `/empresa/workflows/[id]/stats` | Rendimiento de cada flujo |
| Aprobaciones | `/supervisor/aprobaciones` | Bandeja de aprobaciones pendientes |

### 🔌 Bloque 9 · Plataforma e IT

Ver [sección 11](#11-plataforma-para-it-api-webhooks-scim-sso).

### 🏢 Bloque 10 · Administración de la cuenta

| Módulo | Ruta | Qué hace |
|---|---|---|
| Usuarios y roles | `/empresa/usuarios` | Invitaciones, roles y permisos granulares |
| Facturación | `/empresa/billing` | Plan, facturas, método de pago (Stripe) |
| Configuración | `/empresa/configuracion` | Empresa, apariencia, notificaciones |
| Idiomas | `/empresa/configuracion/idiomas` | Idiomas habilitados (es · en · pt) |
| Onboarding | `/empresa/onboarding` | Asistente de puesta en marcha con progreso |
| Privacidad y baja | `/empresa/privacidad`, `/empresa/baja` | RGPD: datos, exportación y baja |

---

## 7. Roles y permisos

**8 roles** (7 de empresa + 1 interno de REELEVO). Control de acceso a nivel de ruta y de API.

| Rol | Alcance | Qué puede hacer |
|---|---|---|
| `admin_reelevo` | Global (interno) | Todo el panel `/admin`, impersonación, billing global |
| `admin_empresa` | Empresa | Control total: billing, usuarios, API keys, webhooks, SSO, SCIM, integraciones |
| `plant_manager` | Una planta | Su planta: dashboard, turnos, monitoreo, reportes |
| `gestor_empresa` | Configurable | Permisos por área: productividad · procesos · máquinas · operarios · planificación · reportes |
| `responsable` | Empresa | Panel completo salvo billing, API keys, webhooks e integraciones |
| `supervisor` | Empresa | Validación, procesos, máquinas, estadísticas, rutas, Kaizen |
| `tecnico` | Empresa | Procesos, contenidos, Kaizen, validación técnica |
| `operario` | Empresa | Portal operario y flujo QR |

> **Argumento de venta:** un cliente puede dar acceso a jefes de línea sin exponer facturación, y dar permisos "a la carta" a un gestor sin crear un rol nuevo.

---

## 8. Planes y qué incluye cada uno

Fuente: `lib/tier-config.ts` (fuente de verdad del código, misma que alimenta `/pricing`).

### Límites

| | **Free** | **Starter** | **Pro** | **Enterprise** |
|---|---|---|---|---|
| **Precio** | 0 € | **49 €/mes** · 490 €/año | **129 €/mes** · 1.290 €/año | A medida |
| Máquinas | 3 | 5 | 25 | Ilimitadas |
| Operarios | 10 | 20 | 100 | Ilimitados |
| Procesos | 5 | Ilimitados | Ilimitados | Ilimitados |
| Pasos por proceso | 6 | 12 | 25 | Ilimitados |
| Usuarios admin | 1 | 1 | 5 | Ilimitados |
| Usuarios supervisor | 0 | 2 | 10 | Ilimitados |
| Obras | — | 3 (50 piezas) | 20 (500 piezas) | Ilimitadas |
| Workflows | — | 3 (10 pasos) | 20 (50 pasos) | Ilimitados |
| Planes de mantenimiento | — | 10 | 50 | Ilimitados |
| Reportes programados | — | 2 | 10 | Ilimitados |
| Kaizen / mes | — | — | 100 | Ilimitados |
| API keys · llamadas/mes | — | — | 3 · 10.000 | Ilimitadas |
| Webhooks | — | — | 5 | Ilimitados |
| Almacenamiento | 2 GB | 5 GB | 15 GB | Ilimitado |

### Funcionalidades

| Función | Free | Starter | Pro | Enterprise |
|---|:---:|:---:|:---:|:---:|
| Flujo QR y ejecución de procesos | ✅ | ✅ | ✅ | ✅ |
| Gestión de máquinas, operarios y procesos | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Impresión de QR de máquina | ✅ | ✅ | ✅ | ✅ |
| Estadísticas y exportación CSV | — | ✅ | ✅ | ✅ |
| Productividad y monitoreo en vivo | — | ✅ | ✅ | ✅ |
| Importación masiva (máquinas y operarios) | — | ✅ | ✅ | ✅ |
| Gestión de usuarios | — | ✅ | ✅ | ✅ |
| Certificaciones de operario | — | ✅ | ✅ | ✅ |
| Planificación y validación de producción | — | ✅ | ✅ | ✅ |
| Obras | — | ✅ | ✅ | ✅ |
| **Mantenimiento preventivo** | — | ✅ | ✅ | ✅ |
| **Cobertura de turnos** | — | ✅ | ✅ | ✅ |
| Temas y notificaciones por email | — | ✅ | ✅ | ✅ |
| **Vídeo en procesos** | — | — | ✅ | ✅ |
| **Versionado de procesos** | — | — | ✅ | ✅ |
| **Firmas digitales e informes de cumplimiento** | — | — | ✅ | ✅ |
| **Kaizen** | — | — | ✅ | ✅ |
| **Contribuciones de operario** | — | — | ✅ | ✅ |
| **Lean** (TIMWOODS · VSM · takt) | — | — | ✅ | ✅ |
| **Time tracking y alertas de horas** | — | — | ✅ | ✅ |
| **Reportes PDF programados** | — | — | ✅ | ✅ |
| **API pública y webhooks** | — | — | ✅ | ✅ |
| Analítica avanzada e informes personalizados | — | — | ✅ | ✅ |
| Histórico de producción · operaciones en lote | — | — | ✅ | ✅ |
| **SSO / SAML** | — | — | — | ✅ |
| **White label** | — | — | — | ✅ |
| **Soporte prioritario** | — | — | — | ✅ |
| Documentación de API | — | — | — | ✅ |

> ⚠️ **Decisión de pricing pendiente:** los módulos de **trazabilidad y recalls** están controlados solo por rol, no por plan. Hoy son accesibles en cualquier tier. Si van a ser argumento de Pro, hay que añadir el gating antes de anunciarlos como diferencial de plan.

---

## 9. Integraciones

| Integración | Tipo | Cómo funciona | Ruta de configuración |
|---|---|---|---|
| **SAP HR** | ERP / RRHH | Sincronización diaria de empleados | *(conector)* |
| **SAP Production** | ERP | Sincronización de órdenes cada 4 h | *(conector)* |
| **Holded** | ERP / facturación | Productos y órdenes bajo demanda | `/empresa/configuracion/integraciones/holded` |
| **Factorial** | RRHH | Sincronización de personal | `…/factorial` |
| **MachineMetrics** | IoT industrial | Webhook entrante de telemetría | `…/machinemetrics` |
| **MTConnect** | IoT industrial | Telemetría de máquina | `…/mtconnect` |
| **Microsoft 365** | Ofimática | SSO y entregas a Teams | `…/microsoft-365` |
| **Power BI** | BI | Pack de dataset y plantilla listos para usar | `…/microsoft-365/power-bi` |
| **Power Automate** | Automatización | Swagger y plantillas de flujo dedicadas | `/api/v2/power-automate` |
| **WhatsApp (Twilio)** | Mensajería | Notificaciones a operarios y responsables | `…/whatsapp` |
| **Stripe** | Pagos | Suscripciones y facturación | `/empresa/billing` |

> No todas están activas en todos los entornos. Antes de anunciar una integración concreta en la web, confirmar que la configuración externa del cliente está completa.

---

## 10. Lo que la app hace sola (automatizaciones)

**32 procesos automáticos** funcionando sin intervención. Este es un argumento fuerte de web: *"REELEVO no espera a que entres"*.

| Automatismo | Frecuencia | Qué hace |
|---|---|---|
| Consolidación de horas | Diaria | Convierte sesiones QR en horas de trabajo por operario |
| Snapshot de OEE | Diaria | Calcula OEE por máquina y planta |
| Cierre de sesiones huérfanas | Diaria | Cierra sesiones abiertas sin actividad |
| Motor de reglas Kaizen | Diaria | Clasifica, puntúa y crea acciones sobre las mejoras propuestas |
| Riesgo de cobertura de turnos | Diaria | Detecta turnos sin personal capacitado |
| Skill decay | Diaria | Avisa de competencias que se están perdiendo |
| Órdenes de mantenimiento | Diaria | Crea las órdenes preventivas del día |
| Señales de conocimiento | Diaria | Detecta procesos sin revisar o con variación anómala |
| Caducidad de certificaciones | Diaria | Avisa antes del vencimiento |
| Alertas de anomalías | Diaria | Alerta de procesos con tasa de anomalía alta |
| Completitud de trazabilidad | Diaria | Vigila que la cadena de lote no tenga huecos |
| Alertas de almacenamiento | Diaria | Avisa antes de llegar al límite del plan |
| Caducidad de API keys | Diaria | Avisa antes de que expire una clave |
| Encuesta NPS | Diaria | Envía la encuesta en la ventana adecuada |
| Insights con IA (Claude) | Semanal | Analiza procesos y genera propuestas de mejora |
| Resumen semanal | Semanal | Email de productividad al responsable |
| Resumen de ROI | Semanal | Email con tiempo ahorrado y eficiencia |
| Reportes programados | Semanal | Genera y envía los PDFs configurados |
| Desviación de horas | Semanal | Alerta de operarios con >10% de desviación |
| Recordatorios Kaizen | Semanal | Recuerda mejoras pendientes de revisión |
| Planificador de workflows | Cada 5 min | Lanza los flujos programados |
| Entrega de webhooks | Cada 5 min | Envía eventos a los sistemas del cliente, con reintentos |
| Notificación de nueva versión | Horaria | Avisa a los operarios certificados de un cambio de proceso |
| Sincronización SAP | Diaria / 4 h | Personal y órdenes de producción |
| Limpieza RGPD | Mensual | Purga de datos según política de retención |

*(Se listan las más relevantes comercialmente; el resto son internas de REELEVO: salud de clientes, informes internos, gestión de trials.)*

---

## 11. Plataforma para IT: API, webhooks, SCIM, SSO

Este bloque es el que **desbloquea ventas a empresas con departamento de IT**.

### API pública

| Versión | Base | Estado | Endpoints |
|---|---|---|---|
| **v2** | `/api/v2` | Actual | Máquinas, procesos, personal, completions, certificaciones, producción, skill matrix, incidencias, estado de máquina, telemetría, logs de acceso |
| **v1** | `/api/v1` | Legacy mantenida | Máquinas, procesos, personal, certificaciones, obras, órdenes de trabajo, productividad, monitorización |
| **Power Automate** | `/api/v2/power-automate` | Activa | Swagger y plantillas de flujo listas |
| **Power BI** | `/api/v2/docs/power-bi.*` | Activa | Pack de dataset y definición de plantilla |

- Autenticación por **API key** (`Authorization: Bearer`), con **scopes**, rate limiting y analítica de uso.
- Documentación OpenAPI publicada en `/api-docs`.
- Gestión de claves en `/empresa/configuracion/api-keys`, con avisos automáticos de caducidad.

### Webhooks salientes — 21 eventos

```
process.completed          staff.certified                kaizen.item.created
process.failed             staff.certification_revoked    kaizen.item.approved
process.version_created    certification.expiring         kaizen.item.standardized
session.started            skill.decay_detected           kaizen.item.closed
session.abandoned          shift.coverage_risk            kaizen.impact.verified
machine.status_changed     quality.issue_detected         piece.generated
approval.requested         approval.resolved              dataset.refresh_available
```

Entrega cada 5 minutos con reintentos y registro de entregas. Destino HTTP genérico o **Microsoft Teams** con tarjeta formateada.

### Identidad corporativa

- **SCIM 2.0** — aprovisionamiento automático de usuarios desde Okta, Azure AD o JumpCloud. Configuración en `/empresa/configuracion/scim`.
- **SSO / SAML** — plan Enterprise.

---

## 12. Seguridad y cumplimiento

| Aspecto | Qué hay |
|---|---|
| Aislamiento de datos | Row Level Security en Postgres: cada empresa solo ve lo suyo |
| Autenticación | Supabase Auth con JWT; guards por rol en cada ruta y API |
| Sesión de operario | Token de corta vida (24 h), sin credenciales permanentes en el dispositivo |
| PIN de empresa | Hasheado con bcrypt en base de datos, mediante trigger |
| Auditoría | Log de auditoría, logs de aplicación, logs de acceso, histórico de emails |
| Anti-bot | Cloudflare Turnstile en el registro de empresa (verificado 2026-08-18: no está en el login) |
| Cabeceras de seguridad | CSP, cabeceras HTTP endurecidas, sin exposición de stack |
| RGPD | Purga automática mensual, exportación de datos, flujo de baja, aviso legal, política de cookies y consentimiento |
| Observabilidad | Sentry (errores), PostHog (producto), UptimeRobot (disponibilidad), health checks |
| Hosting | UE (Supabase + Vercel) |

---

## 13. Qué NO se debe vender todavía

Honestidad comercial: estas capacidades **existen en el código pero no están listas para prometerlas en la web**.

| Capacidad | Estado real | Regla comercial |
|---|---|---|
| **Módulo EHS** (incidencias de seguridad, LOTO, EPI) | API completa y testeada, **sin interfaz de usuario** en el portal empresa | No anunciar. Es backend disponible para integradores, no un módulo usable por el cliente |
| **Verificación de EPI en el flujo QR** | Endpoint `/api/qr/ppe-check` existe, **sin pantalla que lo consuma** | No anunciar |
| **Offline** | MVP: flujo QR cacheado + sincronización diferida | Vender como *"funciona sin cobertura en el flujo de ejecución"*, **no** como *"offline completo"* |
| **Quiz / evaluación** | Endpoint de quiz en flujo QR + generación desde proceso | Se puede mencionar como validación de conocimiento, **no** como sistema de evaluación y recertificación completo |
| **Trazabilidad y recalls** | Funcional, pero **sin gating por plan** | No presentarlo todavía como diferencial de Pro (ver aviso en la sección 8) |
| **Plantillas de proceso compartidas** | No existe | No prometer una biblioteca de plantillas entre clientes |

---

## 14. Traducción de funciones a mensajes de web

Guía para pasar de "lo que hace" a "lo que le importa al que compra".

### Titular principal

> **La ejecución de tu planta, convertida en datos.**
> Tus operarios escanean un QR en la máquina y ejecutan el proceso correcto. Tú ves qué se hizo, quién lo hizo y qué salió — sin papel y sin depender de la memoria de nadie.

### Bloques de la home

| Bloque | Mensaje | Prueba (función real) |
|---|---|---|
| **1. Cero fricción en planta** | "Tus operarios no necesitan cuenta, ni email, ni contraseña. Escanean y trabajan." | Acceso por QR + código personal de 8 caracteres o PIN de empresa. Funciona en su propio móvil. PWA con soporte offline en el flujo de ejecución |
| **2. El procedimiento correcto, siempre** | "Se acabó el papel plastificado de hace tres años." | Procesos versionados, con confirmación de lectura de la nueva versión y notificación automática a los operarios certificados. Contenido con texto, imagen, vídeo y adjuntos. Traducciones por idioma |
| **3. Evidencia, no confianza** | "Cada acción queda registrada: quién, qué, cuándo, en qué máquina, con qué resultado." | Checklist con foto, campos de captura, unidades producidas y rechazadas, paradas con motivo, firma digital, validación del supervisor |
| **4. El conocimiento deja de irse con la gente** | "Sabes quién sabe hacer qué — y qué pasa si mañana falta." | Skill matrix, certificaciones con caducidad, rutas de aprendizaje, detección de skill decay, mapa de cobertura de turnos y análisis de riesgo de conocimiento |
| **5. Trazabilidad hasta la pieza** | "Un cliente pregunta por un lote y respondes en un minuto, no en una semana." | Trazabilidad por pieza y lote, QR por pieza, página pública con informe PDF, gestión de recalls con severidad y cuarentena |
| **6. Datos para decidir, no para archivar** | "OEE real, ROI medido y análisis Lean sobre datos de ejecución, no sobre estimaciones." | OEE por máquina y planta con snapshot diario, ROI, TIMWOODS, VSM, takt time, comparador de plantas y reportes PDF automáticos por email |
| **7. La mejora la propone quien está en la máquina** | "Las ideas de planta dejan de perderse en un buzón." | Kaizen: contribución desde el móvil, tablero, motor de reglas automático, recompensas e impacto medido. Insights semanales generados con IA |
| **8. Se conecta con lo que ya tienes** | "No sustituye tu ERP: le da el dato de planta que le falta." | API pública v1/v2, 21 eventos de webhook, SCIM 2.0, SSO, SAP, Holded, Factorial, MachineMetrics, MTConnect, Power BI, Power Automate, Teams, WhatsApp |
| **9. Empiezas hoy** | "Una línea, un turno, un QR. Sin permanencia." | Plan Free real (3 máquinas, 10 operarios, 5 procesos), asistente de onboarding e importación asistida por IA desde tus Word, PDF o vídeos |

### Objeciones y respuestas

| Objeción típica | Respuesta apoyada en producto |
|---|---|
| *"Mis operarios no van a usar una app"* | No instalan nada ni crean cuenta. Escanean el QR que ya está pegado en la máquina y meten un código de 8 caracteres |
| *"En mi nave no hay cobertura"* | El flujo de ejecución funciona con contenido cacheado y sincroniza al recuperar señal |
| *"Ya tengo un ERP / MES"* | REELEVO no lo sustituye. Aporta el dato de ejecución que el ERP no captura, y lo entrega por API y webhooks |
| *"Pasar mis procedimientos costará meses"* | Importación asistida por IA desde Word, PDF y vídeo |
| *"Tengo varias plantas"* | Multi-planta con rol `plant_manager`, comparador entre plantas y consolidación de grupo |
| *"Mi plantilla es multinacional"* | Interfaz y procesos en español, inglés y portugués, con traducción por proceso e idioma preferido por operario |
| *"¿Y mis datos?"* | Alojados en la UE, aislados por RLS, con auditoría, purga RGPD automática y flujo de exportación y baja |

### Qué NO decir

- ❌ "Offline total" → decir "funciona sin cobertura en el flujo de ejecución"
- ❌ "Módulo de seguridad / EHS" → no existe como interfaz
- ❌ "Biblioteca de plantillas de procesos" → no existe
- ❌ "Sistema de evaluación y recertificación" → hay quiz, no un módulo completo
- ❌ Cifras de clientes, ahorro o ROI medio → no hay datos reales que las respalden

---

## 15. Cifras del producto

Contadas sobre el repositorio a fecha 2026-08-17:

| Métrica | Valor |
|---|---|
| Pantallas totales | 169 |
| Pantallas del portal empresa | 88 |
| Pantallas del portal admin (interno) | 43 |
| Endpoints de API | 424 |
| Endpoints del runtime QR | 34 |
| Procesos automáticos (crons) | 32 |
| Eventos de webhook | 21 |
| Tipos de nodo de workflow | 17 |
| Roles | 8 |
| Idiomas | 3 (es · en · pt) |
| Migraciones de base de datos | 235 |
| Portales de usuario | 4 |

### Stack (por si la web lo menciona)

Next.js 16 (App Router) · React 19 · TypeScript · Supabase (Postgres + Auth + Storage + RLS) · Vercel · Stripe · Resend · Twilio · Anthropic Claude · Upstash Redis · PostHog · Sentry · Cloudflare Turnstile.

---

## Anexo · Cómo mantener este documento

Cuando cambie el producto, verificar contra el código y no contra otros documentos:

| Dato | Dónde se verifica |
|---|---|
| Planes, precios, límites y funciones | `lib/tier-config.ts` |
| Roles y permisos | `lib/company-permissions.ts` |
| Eventos de webhook | `lib/webhooks.ts` |
| Automatismos | `app/api/cron/` |
| Pantallas | `find app -name "page.tsx"` |
| Endpoints públicos | `app/api/v1/`, `app/api/v2/` |
| Copy de pricing en vivo | `components/public/PricingView.tsx` |
| Copy de landing en vivo | `app/landing-content.tsx` |
