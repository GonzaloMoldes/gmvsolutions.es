# Backlog de mejoras web - REELEVO

**Version:** v2 - encaje producto-promesa  
**Fecha:** Marzo 2026  
**Uso:** backlog operativo para rehacer el mensaje comercial de la web segun el valor real de la app  
**Base:** auditoria del site + revision del repo marketing + revision de `reelevo_full_code.txt`

---

## 1. Tesis de posicionamiento

REELEVO no debe venderse primero como un simple software de SOPs.

La web debe posicionarlo como:

> sistema para planta que reduce improvisacion, ordena incorporaciones y da mas visibilidad para sostener la operacion con menos dependencia de personas clave.

Los 4 pilares que la web debe repetir con consistencia son:

1. `Menos improvisacion en el puesto`
2. `Mas visibilidad para decidir`
3. `Onboarding mas ordenado`
4. `Mas continuidad con menos dependencia`

Capas secundarias que si existen, pero no deben liderar el relato general:

- rutas de aprendizaje
- skill matrix
- firma digital y conformidad
- contribuciones y captura de conocimiento
- API, webhooks e integraciones

Capas que conviene comunicar con prudencia hasta endurecerlas mas:

- offline / PWA
- supervisor workspace como modulo protagonista
- WhatsApp como capacidad base

---

## 2. Como usar este backlog

Estados recomendados:

- `Pendiente`
- `En curso`
- `Bloqueado`
- `Parcial`
- `Hecho`

Prioridades:

- `P0` = corrige encaje producto-promesa o riesgo serio de credibilidad
- `P1` = aumenta conversion al explicar mejor el valor real
- `P2` = refuerza confianza, segmentacion o madurez comercial
- `P3` = escala captacion, autoridad o expansion enterprise

Esfuerzo estimado:

- `S` = 1-2 horas
- `M` = media jornada
- `L` = 1-2 dias
- `XL` = varios dias o depende de terceros

---

## 3. Resumen ejecutivo

| ID | Prioridad | Area | Cambio | Impacto | Estado |
|---|---|---|---|---|---|
| WEB-01 | P0 | Posicionamiento | Replantear la narrativa principal de la web | Muy alto | Hecho |
| WEB-02 | P0 | Mensaje | Reordenar la home segun los 4 pilares reales del producto | Muy alto | Hecho |
| WEB-03 | P0 | Conversion | Alinear CTAs con el flujo comercial y el flujo real de producto | Muy alto | Hecho |
| WEB-04 | P0 | Pricing | Reestructurar pricing y comparativas alrededor del core real | Muy alto | Hecho |
| WEB-05 | P0 | Credibilidad | Limpiar cualquier claim no sostenido por producto o evidencia | Muy alto | Hecho |
| WEB-06 | P1 | Buyer pages | Reescribir paginas por rol segun valor especifico por comprador | Muy alto | Hecho |
| WEB-07 | P1 | Proof | Introducir prueba visual y operativa del producto real | Muy alto | Hecho |
| WEB-08 | P1 | Trust | Crear narrativa de trazabilidad, evidencia y confianza operativa | Alto | Hecho |
| WEB-09 | P2 | Segmentacion | Crear capa especifica para calidad, compliance y sectores regulados | Alto | Hecho |
| WEB-10 | P2 | Producto avanzado | Decidir que modulos vender como core, add-on o roadmap | Alto | Hecho |
| WEB-11 | P2 | Empresa | Reforzar autoridad del equipo y la tesis de compania | Medio-alto | Hecho |
| WEB-12 | P2 | UX | Mejorar legibilidad y escaneabilidad de paginas clave | Medio | Pendiente |
| WEB-13 | P2 | SEO tecnico | Corregir dominio, canonicals, assets y schemas | Medio | Hecho |
| WEB-14 | P3 | Contenido | Reorientar contenidos SEO hacia el nuevo encaje comercial | Medio | Pendiente |

---

## 4. Fases recomendadas

### Fase 1 - Encaje producto-promesa

Objetivo: que la web describa con precision el valor mas fuerte y mas vendible de la app.

- WEB-01
- WEB-02
- WEB-03
- WEB-04
- WEB-05

### Fase 2 - Conversion por comprador

Objetivo: que cada buyer vea su beneficio principal sin tener que inferirlo.

- WEB-06
- WEB-07
- WEB-08

### Fase 3 - Madurez y expansion

Objetivo: reforzar confianza, verticalizacion y lectura enterprise sin inflar promesas.

- WEB-09
- WEB-10
- WEB-11
- WEB-12
- WEB-13
- WEB-14

---

## 5. Backlog detallado

### WEB-01 - Replantear la narrativa principal

**Prioridad:** P0  
**Area:** Posicionamiento  
**Owner sugerido:** Founder + marketing + producto  
**Esfuerzo:** L

**Problema**

La web sigue orbitando demasiado alrededor de "documentar procesos" y "hacer experto a cualquiera".  
La app real tiene una propuesta de valor mas fuerte:

- menos dependencia cuando falta el titular
- menos tiempo perdido en tutoria repetitiva
- mas contexto para decidir y reorganizar turnos
- una base mas util para formacion, polivalencia y seguimiento interno
- continuidad operativa con un arranque asumible

**Accion**

- Definir una frase madre de posicionamiento
- Reescribir heroes y subtitulos desde esa frase
- Eliminar mensajes que resten foco al core

**Criterio de cierre**

- La propuesta principal puede resumirse en una frase clara y creible
- Cualquier buyer entiende que REELEVO no es solo documentacion

---

### WEB-02 - Reordenar la home segun los 4 pilares

**Prioridad:** P0  
**Area:** Home / conversion  
**Owner sugerido:** Marketing + front  
**Esfuerzo:** XL

**Nuevo orden recomendado**

1. Problema operativo principal
2. Hero con promesa central
3. Pilar 1: menos improvisacion
4. Pilar 2: mas visibilidad
5. Pilar 3: onboarding mas ordenado
6. Pilar 4: mas continuidad
7. Capturas reales del producto
8. Caso o prueba real
9. CTA

**Accion**

- Reducir bloques abstractos
- Convertir beneficios en bloques de producto demostrable
- Introducir capturas etiquetadas por valor, no solo por estetica

**Criterio de cierre**

- La home explica el producto y su valor en menos de 10 segundos
- El usuario entiende que hay software real detras de la promesa

---

### WEB-03 - Alinear CTAs con el flujo comercial y el flujo real

**Prioridad:** P0  
**Area:** Conversion  
**Owner sugerido:** Founder + marketing  
**Esfuerzo:** M

**Problema**

El site mezcla `Solicitar demo`, `registro`, `diagnostico`, `acceso guiado` y otros caminos sin una jerarquia limpia.

**Accion**

- Definir CTA principal unico para top of funnel
- Definir CTA secundario unico para leads mas frios
- Explicar con microcopy que ocurre despues del clic
- Alinear el nombre del CTA con el destino real

**Criterio de cierre**

- No hay friccion ni sorpresa entre CTA y destino
- Ventas recibe leads con expectativa correcta

---

### WEB-04 - Reestructurar pricing y comparativas alrededor del core real

**Prioridad:** P0  
**Area:** Pricing / credibilidad  
**Owner sugerido:** Founder + marketing + producto  
**Esfuerzo:** L

**Problema**

Pricing sigue mezclando valor core, capacidades avanzadas, integraciones y promesas que compiten entre si.

**La jerarquia correcta deberia ser**

- Core:
  - menos improvisacion
  - continuidad
  - incorporaciones mas ordenadas
  - mas claridad operativa
- Expansion:
  - polivalencia
  - seguimiento de aprendizaje
  - calidad y conformidad
  - mejora continua
- Advanced / enterprise:
  - API
  - webhooks
  - SSO
  - integraciones

**Accion**

- Reordenar bullets y tablas por capas de valor
- Reducir comparativas a diferenciales que si son ciertos
- Separar claramente `incluido`, `segun el plan`, `a medida`, `roadmap`

**Criterio de cierre**

- Pricing refleja como se compra realmente el producto
- La comparativa transmite foco, no ansiedad por meter todo

---

### WEB-05 - Limpiar claims no sostenidos o mal jerarquizados

**Prioridad:** P0  
**Area:** Credibilidad  
**Owner sugerido:** Founder + producto  
**Esfuerzo:** M

**Problema**

Hay claims que o bien prometen demasiado o bien destacan cosas que no deberian liderar el relato.

**Claims a revisar**

- implementacion en `1 dia`
- tiempos cerrados por proceso
- uso de `certificacion` si no se explica bien el alcance
- integraciones HR o industriales si no son estandar
- offline / PWA si aun no esta suficientemente cerrado
- supervisor si la capa aun no es el eje del producto comercial

**Criterio de cierre**

- No queda ningun claim que ventas tenga que matizar a mano
- El sitio prioriza lo mas fuerte, no lo mas llamativo

---

### WEB-06 - Reescribir paginas por rol segun beneficio real

**Prioridad:** P1  
**Area:** Buyer pages  
**Owner sugerido:** Marketing + founder  
**Esfuerzo:** XL
**Estado actual:** Hecho

**Enfoque por buyer**

- `Jefe de produccion`
  - monitoreo en tiempo real
  - tiempos reales de ejecucion
  - control por maquina y operario
  - menos dependencia del tutor

- `RRHH / formacion`
  - skill matrix
  - rutas de aprendizaje
  - certificaciones activas
  - polivalencia

- `Gerencia / propiedad`
  - continuidad operativa
  - menor dependencia de personas clave
  - visibilidad de ejecucion
  - implantacion simple

**Criterio de cierre**

- Cada pagina por rol hace visible un motivo claro para comprar
- El buyer ve su lenguaje y sus KPIs

---

### WEB-07 - Introducir prueba visual y operativa del producto real

**Prioridad:** P1  
**Area:** Proof  
**Owner sugerido:** Founder + ventas + front  
**Esfuerzo:** L
**Estado actual:** Hecho

**Activos mas valiosos**

- captura del trabajo en el puesto
- captura de visibilidad operativa para produccion
- captura del seguimiento de ejecucion
- captura de aprendizaje o competencia visible
- mini flujo visual `puesto -> ejecucion -> seguimiento -> aprendizaje`

**Accion**

- Etiquetar screenshots por valor
- Añadir anotaciones a las capturas
- Convertir la demo visual en evidencia, no solo decoracion

**Criterio de cierre**

- La web demuestra el producto antes de pedir la demo
- Se ve que hay software de operaciones real, no solo marketing

---

### WEB-08 - Crear narrativa de trazabilidad y confianza operativa

**Prioridad:** P1  
**Area:** Trust / mensaje  
**Owner sugerido:** Founder + producto  
**Esfuerzo:** M
**Estado actual:** Hecho

**Problema**

La web habla de ahorro y rapidez, pero todavia no explota del todo el valor de evidencia operativa:

- quien ejecuto
- que proceso
- cuando
- cuanto tardo
- si fue identificado o de consulta
- si genero certificacion

**Accion**

- Crear un bloque de `como queda registrado`
- Explicar diferencia entre acceso de consulta y ejecucion identificada
- Conectar trazabilidad con auditoria, calidad y formacion

**Criterio de cierre**

- El comprador entiende por que REELEVO es mas que una biblioteca de SOPs
- El concepto de trazabilidad queda claro y comercialmente util

---

### WEB-09 - Crear capa especifica para calidad, compliance y sectores regulados

**Prioridad:** P2  
**Area:** Segmentacion  
**Owner sugerido:** Marketing + founder  
**Esfuerzo:** L
**Estado actual:** Hecho

**Problema**

La app tiene firma digital y reporte de conformidad, pero la web no lo convierte aun en una historia comercial clara para buyers de calidad.

**Accion**

- Crear bloque o pagina de `conformidad y evidencia`
- Explicar sign-off, reporte y exportacion con prudencia legal
- Crear una buyer page para `calidad / compliance`
- Definir orden sectorial segun `dolor operativo alto + exigencia regulatoria asumible`

**Decision actual de verticalizacion**

Sectores prioritarios inmediatos:

- `Mecanizado / CNC`: fit muy alto con el dolor core de REELEVO. Mucha dependencia del titular, conocimiento tacito por maquina, cambios de turno y necesidad de cobertura rapida.
- `Metalurgia / caldereria / transformacion metalica`: buen encaje cuando el puesto depende de operarios expertos, hay procesos repetibles y la empresa necesita continuidad sin proyecto pesado.
- `Plastico`: especialmente inyeccion, extrusion y plantas con cambios de formato o parametros. Hay mucho conocimiento tacito y necesidad de incorporar gente sin romper ritmo.
- `Packaging industrial no altamente regulado`: buen puente entre operacion y consistencia, sin entrar todavia en el nivel mas duro de exigencia documental sectorial.

Sectores en `hold / fase posterior`:

- `Alimentacion`: el dolor encaja, pero la exigencia de evidencia, datos de proceso y robustez comercial es mayor. Mantener como encaje posible, no como vertical prioritario.
- `Farmaceutica`: demasiada exigencia para la fase actual del producto y del trust pack comercial.
- `Automocion Tier 1 / IATF`: puede encajar en continuidad operativa, pero el liston de control, aprobacion y trazabilidad es demasiado alto para abrirlo ahora como mensaje comercial fuerte.
- `Aeroespacial`: buyer y compliance demasiado exigentes para esta fase.

**Por que este orden**

- Primero sectores con `dolor operativo alto` y `compliance medio`
- Despues sectores con `dolor operativo alto` pero `compliance duro`
- La prioridad no debe seguir el TAM teorico, sino la velocidad real de cierre y credibilidad comercial

**Condiciones para sacar un sector de `hold`**

- Captura estructurada de datos por paso (`lote`, `temperatura`, `controles`, `unidades` o equivalentes)
- Versionado y flujo de aprobacion mas endurecidos
- Trust pack real de seguridad, backups y continuidad
- Caso piloto o prueba real en ese vertical
- Claim comercial revisado con prudencia legal

**Avance realizado**

- Creada una pieza especifica de `calidad y conformidad`
- Conectada desde el recorrido comercial de `como funciona`
- Enfoque prudente: revision interna, evidencia util y continuidad operativa sin inflar promesa legal
- Creada una landing ejecutiva para `responsable de calidad / compliance` dentro de `para quien`
- Priorizada una primera vertical real en `mecanizado / CNC`, conectada desde calidad y buyer page
- `Alimentacion` queda como exploracion de mensaje y encaje posible, no como vertical prioritario de salida

**Criterio de cierre**

- Calidad o compliance encuentra un motivo especifico para interesarse
- Existe un orden claro de verticalizacion para no abrir sectores demasiado exigentes antes de tiempo

---

### WEB-10 - Decidir que modulos vender como core, add-on o roadmap

**Prioridad:** P2  
**Area:** Producto / GTM  
**Owner sugerido:** Founder + producto  
**Esfuerzo:** M
**Estado actual:** Hecho

**Decision framework**

- `Core comercial ya`
  - continuidad operativa
  - menos improvisacion
  - mas claridad para decidir
  - onboarding mas ordenado

- `Expansion vendible`
  - rutas
  - skill matrix
  - conformidad
  - contribuciones

- `Presentar con prudencia`
  - supervisor
  - offline
  - WhatsApp

- `Enterprise`
  - API
  - webhooks
  - SSO
  - integraciones

**Criterio de cierre**

- Toda la web sigue una misma jerarquia de producto
- No hay modulos confundiendo el relato principal

---

### WEB-11 - Reforzar autoridad del equipo y tesis de compania

**Prioridad:** P2  
**Area:** Empresa / confianza  
**Owner sugerido:** Founder  
**Esfuerzo:** M
**Estado actual:** Hecho

**Accion**

- Explicar por que esta compania ataca este problema
- Dar cara a quienes estan detras
- Explicar por que un proveedor pequeno puede ser ventaja en pyme industrial
- Aterrizar soporte, implantacion y acompanamiento

**Criterio de cierre**

- La pagina de empresa suma confianza en vez de solo cercania

---

### WEB-12 - Mejorar legibilidad y escaneabilidad

**Prioridad:** P2  
**Area:** UX  
**Owner sugerido:** Front + diseno  
**Esfuerzo:** M

**Accion**

- Reducir uppercase en bloques largos
- Subir contraste
- Acortar bloques de texto
- Introducir mas resumenes visuales
- Hacer que cada bloque responda a una sola idea

**Criterio de cierre**

- La lectura es mas clara para buyer senior y entornos B2B

---

### WEB-13 - Corregir SEO tecnico, canonicals y activos

**Prioridad:** P2  
**Area:** SEO tecnico / higiene  
**Owner sugerido:** Dev  
**Esfuerzo:** S
**Estado actual:** Hecho

**Problema**

Hay tareas de higiene tecnica que afectan percepcion y orden:

- mezcla de `www` y no-`www`
- canonicals inconsistentes
- referencias a assets inexistentes
- schemas y metadatos mejorables

**Criterio de cierre**

- Dominio canonico unificado
- No hay referencias rotas
- Los schemas apuntan a activos reales

---

### WEB-14 - Reorientar contenidos SEO al nuevo encaje comercial

**Prioridad:** P3  
**Area:** Contenido / SEO  
**Owner sugerido:** Marketing + founder  
**Esfuerzo:** XL

**Accion**

- Pasar de contenidos solo informativos a contenidos que refuercen la tesis comercial
- Priorizar temas como:
  - trazabilidad en planta
  - certificacion por ejecucion
  - productividad por proceso
  - onboarding industrial
  - continuidad operativa
- Revisar uso de encuestas o datos propios no metodologizados

**Criterio de cierre**

- SEO y ventas empujan en la misma direccion

---

## 6. Quick wins recomendados ahora

- [x] Definir la frase madre de posicionamiento
- [x] Reordenar la home en torno a `menos improvisacion -> mas visibilidad -> onboarding ordenado -> continuidad`
- [x] Unificar el CTA principal del site
- [x] Reescribir el bloque principal de pricing segun capas `core / expansion / enterprise`
- [x] Crear un bloque explicando diferencia entre `consulta` y `ejecucion identificada`
- [x] Preparar capturas del flujo real de trabajo y visibilidad operativa para la home

---

## 7. Guardrails para no desalinear el mensaje

- No vender `offline` como factor principal hasta que este endurecido
- No liderar con `supervisor` hasta que su producto este mas cerrado comercialmente
- No inflar integraciones como si fueran estandar si son `segun el caso`
- No usar `certificacion` sin explicar que nace de ejecucion real y umbrales configurables
- No volver a una narrativa de `software para documentar procesos` como mensaje principal

---

## 8. Definicion de exito

Este backlog estara bien ejecutado cuando la web consiga estas 5 cosas:

1. Explicar REELEVO como software de ejecucion operativa, no solo de documentacion
2. Hacer visible el valor diferencial en continuidad, claridad operativa y orden en planta
3. Dar a cada buyer una razon clara para comprar
4. Reducir el trabajo correctivo de ventas en las llamadas
5. Elevar la credibilidad sin inflar promesas
