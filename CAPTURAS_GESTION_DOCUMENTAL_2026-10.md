# Capturas: gestión documental e instrucciones de trabajo

**Fecha:** 16 de octubre de 2026
**Para qué:** acompañar `/blog/gestion-instrucciones-prl-e-it/` con una captura real de cada área de la gestión documental.

## Lo que ya lleva el artículo

El blog vive en Sanity, y en Sanity ya hay ocho capturas de la app nueva, subidas el 8 de octubre para el artículo «Cómo digitalizar las instrucciones de trabajo de una fábrica». El artículo de PRL reutiliza dos:

| Punto del artículo | Captura (Sanity) |
|---|---|
| 1. Un único registro de instrucciones, con versiones | `como-digitalizar-instrucciones-de-trabajo-07-versiones-confirmaciones.png` |
| 7. Evidencia para auditoría e inspección | `como-digitalizar-instrucciones-de-trabajo-08-estadisticas.png` |

## Las que faltan

Ninguna de las ocho enseña la parte de gestión documental (instrucciones de PRL, calidad o políticas, pendientes, test, acuse o informe). No se pudieron sacar desde la sesión de trabajo: `app.gmvsolutions.es` está bloqueado por la red del entorno y no hay credenciales de una cuenta demo.

| # | Nombre sugerido | Área de la app | Qué tiene que verse | Dónde va en el artículo |
|---|---|---|---|---|
| 1 | `gestion-documental-01-registro.png` | Gestión documental · listado | Instrucciones mezcladas por tipo (PRL, calidad, política, instrucción de trabajo de máquina), cada una con su versión vigente | Punto 1, en lugar de la de versiones o junto a ella |
| 2 | `gestion-documental-02-pendientes.png` | Detalle de una instrucción | Quién ha aceptado la versión vigente y quién está pendiente | Punto 2 |
| 3 | `gestion-documental-03-lectura-test-acuse.png` | Portal del trabajador (móvil) | La instrucción abierta con el test de comprensión y el botón de aceptar | Punto 4 |
| 4 | `gestion-documental-04-certificacion.png` | Ficha del trabajador | Certificaciones en instrucciones de PRL con su fecha de caducidad | Punto 5 |
| 5 | `gestion-documental-05-bloqueo.png` | Flujo QR | El aviso que impide arrancar sin aceptar la última versión o con la habilitación caducada | Punto 6 |
| 6 | `gestion-documental-06-informe-acuses.png` | Informe PDF periódico | La página de acuses: trabajador, instrucción, versión, fecha y vía | Punto 7, en lugar de la de estadísticas |

Reglas: mismo formato que las del 8 de octubre (2880 × 1800, interfaz real), **sin datos reales de cliente** y sin texto de relleno.

## Cómo se añaden

En `/admin/` → Artículo del blog → «Gestión documental de PRL e instrucciones de trabajo» → en el punto correspondiente, **Añadir → Imagen**, con texto alternativo descriptivo y un pie que empiece por «Captura real del producto:». Publicar reconstruye la web.
