# Auditoría SEO — REELEVO / gmvsolutions.es

**Fecha:** Marzo 2026 · **Revisado con:** estrategia SEO de contenidos + optimización para IA + keywords de ETTs

---

## Resumen ejecutivo

| Área | Estado | Prioridad |
|---|---|---|
| URLs canónicas | ✅ Corregido (bug crítico resuelto) | — |
| OG image URL | ✅ Corregido (bug crítico resuelto) | — |
| Organization schema | ✅ Añadido en homepage | — |
| Keywords ETT | ✅ Reforzado en personal-ett y homepage | — |
| Optimización para IA | 🟡 Parcial — mejoras pendientes | Alta |
| Internal linking | 🟡 Mejorable | Media |
| FAQ schema | 🔴 Pendiente | Media |
| Páginas /sop-para/ | 🔴 Pendiente (nuevo contenido) | Alta |

---

## Bugs críticos corregidos

### 1. URL de dominio incorrecto en personal-ett.astro
**Problema:** La página `/casos-de-uso/personal-ett/` tenía canonical y schema apuntando a `reelevo.gmvsolutions.es` en lugar de `gmvsolutions.es`. Esto podría causar que Google indexara el dominio equivocado para esa página.

```
ANTES: canonical="https://reelevo.gmvsolutions.es/casos-de-uso/personal-ett/"
DESPUÉS: canonical="https://gmvsolutions.es/casos-de-uso/personal-ett/"
```

### 2. OG image URL incorrecta en BaseLayout.astro
**Problema:** La imagen Open Graph por defecto apuntaba a `https://reelevo.gmvsolutions.es/og-image.jpg`. Todos los compartidos en redes sociales intentaban cargar la imagen desde el dominio incorrecto.

```
ANTES: ogImage = 'https://reelevo.gmvsolutions.es/og-image.jpg'
DESPUÉS: ogImage = 'https://gmvsolutions.es/og-image.jpg'
```

---

## Análisis página por página

### Home — `/`

**Title actual:** `REELEVO — Software SOP de documentación operativa industrial para pymes`
**Estado:** ✅ Correcto — keyword principal en posición 1, marca al inicio

**Description actualizada:**
> Software SOP de documentación operativa para pymes industriales. Captura el conocimiento de tus operarios expertos y ponlo disponible en cada máquina. Cubre bajas, incorpora personal de ETT y reduce el tiempo de onboarding sin depender de tutores.

**Schema añadido:** Organization completo con `@id`, `knowsAbout`, `address` y `areaServed: ES`

**Mejoras pendientes:**
- [ ] Añadir FAQ schema a la sección de preguntas frecuentes si se añade una en home
- [ ] Verificar que la OG image `/og-image.jpg` existe en `public/`

---

### Como funciona — `/como-funciona/`

**Title actual:** `Cómo funciona REELEVO — Software SOP para documentar procesos industriales paso a paso`
**Estado:** ✅ Bueno

**Schema actual:** HowTo con 3 steps — ✅ Correcto para esta página

**Mejoras pendientes:**
- [ ] Añadir FAQ schema en el `<head slot="head">` para que Google muestre rich results en los FAQs
  ```json
  {
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "¿Cuánto tiempo lleva implementar REELEVO?", "acceptedAnswer": {"@type": "Answer", "text": "..."}}
    ]
  }
  ```

---

### Personal ETT — `/casos-de-uso/personal-ett/`

**Title actualizado:** `Software SOP para personal ETT en fábrica — REELEVO | El trabajador temporal rinde desde el primer turno`

**Description actualizada:** Incluye ahora: "personal cedido", "campañas de producción", "picos de demanda", "empresa usuaria"

**Nueva sección añadida:** "Cuándo REELEVO marca la diferencia con personal de ETT" con vocabulario ETT natural:
- campañas y picos de producción
- alta rotación de personal temporal
- operarios polivalentes de ETT
- trabajador cedido / empresa usuaria
- contrato de puesta a disposición
- ramp-up

**Mejoras pendientes:**
- [ ] Añadir keywords `Adecco`, `Manpower`, `Randstad` como referencia conceptual si se escribe artículo de blog
- [ ] Crear artículo `/recursos/personal-ett-industria-sin-tutor/` para atacar keywords de cola larga

---

### Por qué usar REELEVO — `/por-que-usar-reelevo/`

**Title actual:** `Por qué usar REELEVO — Protege el conocimiento operativo de tu planta industrial`
**Estado:** ✅ Bien orientado a keyword de awareness

**Mejoras pendientes:**
- [ ] Añadir mención explícita a ETT en la sección "La gran jubilación" o "Shadowing ineficiente" — conecta con el problema de onboarding de personal temporal
- [ ] Enlace interno a `/casos-de-uso/personal-ett/` desde esta página

---

### Jefe de producción — `/para-quien/jefe-de-produccion/`

**Title actual:** `REELEVO para Jefes de Producción — Software SOP para eliminar paradas por absentismo`
**Estado:** ✅ Correcto

**Mejoras pendientes:**
- [ ] En los escenarios "Presión constante / Cada incorporación nueva = 2 semanas de tutores", mencionar explícitamente personal ETT y rotación estacional
- [ ] Añadir enlace a `/casos-de-uso/personal-ett/`

---

### Recursos — artículos

**Estado general:** ✅ Article schema correcto en los artículos revisados

**Mejora transversal:** En todos los artículos, el bloque de CTA final (`highlight-box`) debería incluir keywords sobre ETT cuando el contexto lo permita, especialmente en artículos de absentismo y onboarding.

---

## Optimización para búsqueda en IA (ChatGPT, Perplexity, Copilot)

Las IAs responden mejor a sitios con:

### 1. Definiciones claras y explícitas ✅/🟡
El artículo de SOP industrial tiene buenas definiciones. Añadir en cada página principal una definición breve del concepto central:

**Ejemplo para el hero de `/como-funciona/`:**
> REELEVO es un software de documentación operativa que convierte el conocimiento de tus operarios expertos en procedimientos operativos estándar (SOPs) accesibles mediante código QR en cada máquina.

### 2. Preguntas y respuestas directas ✅
Los FAQs de `/como-funciona/` están bien estructurados. Añadir FAQ schema para que las IAs los puedan extraer directamente.

### 3. Datos citables con fuente 🟡
Las IAs citan datos cuando tienen fuente. Los datos actuales (7,2% absentismo, 40% jefes de planta...) no tienen fuente explícita. Añadir entre paréntesis la fuente aunque sea genérica:

> "7,2% de absentismo medio en pymes industriales (Ministerio de Trabajo, 2024)"

### 4. Entidades nombradas explícitamente ✅/🟡
La IA necesita entender a qué sector pertenece REELEVO. Las páginas usan bien "pymes industriales", "mecanizado", "soldadura". Hay que añadir más nombres de sectores en la homepage y `/por-que-usar-reelevo/`:

Keywords a añadir de forma natural: `mecanizado CNC`, `inyección de plástico`, `plegado de chapa`, `envasado`, `manipulado`, `logística de almacén`

### 5. FAQ explícito en homepage 🔴
La homepage no tiene sección FAQ. Las IAs y Google favorecen páginas con preguntas/respuestas directas. Candidatos a incluir en home:
- ¿Qué es REELEVO?
- ¿Para qué tipo de empresa es REELEVO?
- ¿Cuánto cuesta REELEVO?
- ¿REELEVO funciona con personal de ETT?

---

## Vocabulario ETT para posicionamiento complementario

Las ETTs se posicionan con estas keywords. REELEVO debería aparecer en el contexto de estas búsquedas como **complemento** (no competencia).

### Keywords que usan las ETTs
| Keyword ETT | Cómo conecta con REELEVO |
|---|---|
| `trabajo temporal industrial` | Personal temporal que necesita SOPs para operar desde el día 1 |
| `empresa de trabajo temporal fábrica` | Empresa usuaria que recibe trabajadores cedidos sin formación específica |
| `personal cedido manufactura` | El trabajador cedido accede al proceso sin que nadie le enseñe |
| `campaña de producción operarios` | Alta rotación estacional → coste de tutor recurrente → REELEVO lo elimina |
| `pico de producción refuerzo plantilla` | Incorporaciones urgentes que no pueden esperar formación |
| `incorporación inmediata fábrica` | El primer turno ya tiene que ser productivo |
| `operario polivalente ETT` | Polivalencia real = conoce varios procesos → necesita SOPs de cada uno |
| `alta rotación personal industrial` | Cuanto más rotan, más valor tiene el SOP del puesto |
| `contrato temporal operario` | Cada contrato nuevo = coste de tutor sin REELEVO |
| `cobertura de bajas producción ETT` | ETT como solución de baja + REELEVO como solución de conocimiento |

### Estrategia de contenido complementario ETT
Artículo propuesto: **"Por qué las empresas que trabajan con ETTs industriales necesitan SOPs"**
- Keyword: `ETT industrial + SOP`, `trabajo temporal fábrica formación`
- Argumento: La ETT aporta el capital humano, REELEVO aporta el conocimiento del puesto — son complementarios
- Incluir: testimonio o caso de empresa usuaria con alta rotación estacional
- Enlazar a: `/casos-de-uso/personal-ett/`

---

## Internal linking — estado actual y mejoras

### Mapa de enlaces actuales (simplificado)
```
/ → /como-funciona, /para-quien/*, /precios
/como-funciona → (sin enlaces salientes a recursos)
/recursos/* → /recursos/, diagnostico.gmvsolutions.es
/casos-de-uso/personal-ett/ → /como-funciona
/para-quien/jefe-de-produccion/ → diagnostico.gmvsolutions.es
```

### Mejoras de internal linking pendientes

| Página origen | Añadir enlace a | Contexto |
|---|---|---|
| `/como-funciona/` | `/casos-de-uso/personal-ett/` | FAQ "¿Se puede usar con ETTs?" |
| `/como-funciona/` | `/recursos/que-es-un-sop-industrial/` | FAQ "¿Cuánto tiempo lleva?" |
| `/por-que-usar-reelevo/` | `/casos-de-uso/personal-ett/` | Sección "Shadowing ineficiente" |
| `/para-quien/jefe-de-produccion/` | `/casos-de-uso/personal-ett/` | Escenario incorporaciones |
| `/para-quien/responsable-rrhh/` | `/casos-de-uso/onboarding-operarios/` | Natural desde RRHH |
| `/recursos/coste-absentismo-*` | `/casos-de-uso/cobertura-bajas/` | Al final del artículo |
| Todos los artículos | `/precios/` | CTA inline a mitad del artículo |

---

## Checklist de mejoras técnicas pendientes

### Urgente
- [ ] Verificar que `/og-image.jpg` existe en `public/` (la URL ahora está corregida pero el archivo debe existir)
- [ ] Añadir `sitemap.xml` al archivo `robots.txt` si no está
- [ ] Verificar en Search Console que no hay URLs de `reelevo.gmvsolutions.es` indexadas

### Media prioridad
- [ ] FAQ schema en `/como-funciona/` (los 18 FAQs ya están, solo falta el schema)
- [ ] Añadir `dateModified` a todos los artículos de recursos
- [ ] Breadcrumb schema en artículos: `Inicio > Recursos > Título`
- [ ] Enlace a `/casos-de-uso/personal-ett/` desde al menos 3 páginas más

### Baja prioridad
- [ ] Twitter/X card: verificar dominio en Twitter Card Validator
- [ ] `hreflang` si se planica versión en inglés en el futuro
- [ ] Verificar Core Web Vitals en Search Console (Vercel + Astro static debería estar bien)

---

## Keywords ETT a añadir orgánicamente en futuro contenido

Estas palabras deben aparecer de forma **natural** en los artículos del plan de contenidos:

**Sector ETT / trabajo temporal:**
`trabajo temporal`, `personal cedido`, `empresa usuaria`, `ETT industrial`, `trabajador temporal`, `campaña temporal`, `pico de demanda`, `refuerzo de plantilla`, `rotación estacional`, `alta rotación`, `contrato de puesta a disposición`, `incorporación inmediata`

**Sector industrial que busca ETTs:**
`operario polivalente`, `personal de línea`, `manipulado industrial`, `operario de almacén`, `personal de producción`, `cubrir baja operario`, `sustitución durante campaña`

**Relación REELEVO — ETT:**
`onboarding trabajador temporal`, `formación personal ETT`, `instrucciones máquina trabajador nuevo`, `procedimiento operativo para sustitutos`

---

## Relación con documentos de estrategia

- Plan de contenidos: `REELEVO_ESTRATEGIA_SEO_CONTENIDOS.md`
- Plan de backlinking: `REELEVO_ESTRATEGIA_BACKLINKING.md`
- Este documento: `REELEVO_AUDITORIA_SEO.md`
