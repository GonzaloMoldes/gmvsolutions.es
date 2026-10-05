# Visitas Leads (APK Android)

App sencilla para registrar las visitas comerciales desde la tablet, guardar todo en un
**Excel** y mandar el **seguimiento por email o WhatsApp** a cada lead.

## Qué hace

- **Registrar visitas** con las mismas columnas que la plantilla semanal
  (`PORTO VALLA – GONZALO – SEMANA`): tipo, PVS, fecha, fecha firma, razón social,
  persona de contacto, teléfono, población, provincia, correo, situación, PVP entrada,
  PVP total, volver (Sí/No), % y fecha de trabajo realizado.
- **Excel automático**: cada vez que guardas, la app reescribe
  `Descargas/VisitasLeads/Visitas_Leads.xlsx` con:
  - una hoja **TODAS** con todas las visitas,
  - una hoja por semana, con el mismo nombre que usas ahora (`1º JUNIO`, `2º JUNIO`…),
  - los mismos desplegables (Tipo, Provincia, Volver, %), fechas y euros con formato,
    filtros y cabecera fija,
  - una columna extra **SEGUIMIENTO ENVIADO** (p. ej. `Email 05/10/2026`).
- **Seguimiento tras la visita**: al guardar una visita nueva se prepara el mensaje solo:
  - si la lead tiene **correo** → email (asunto y texto con plantilla),
  - si solo tiene **móvil** (6xx/7xx) → WhatsApp,
  - si solo hay fijo → no se envía nada (queda el botón *Llamar*).

  Se abre la app de correo o WhatsApp con el mensaje ya escrito y solo hay que pulsar
  *Enviar*. Las visitas tipo *Visita Patrimonio* no generan mensaje.
- **Botones** *Abrir Excel* y *Compartir* (enviarlo por correo, Drive, WhatsApp…).
- **Ajustes**: tu nombre, empresa, teléfono y correo, textos de las plantillas
  (variables `{contacto}`, `{empresa}`, `{poblacion}`, `{fecha}`, `{comercial}`,
  `{miEmpresa}`, `{miTelefono}`, `{miEmail}`), nombre del Excel y respuestas rápidas
  de *Situación*.

Los datos se guardan dentro de la tablet (no se suben a ningún servidor).

## Instalarla en la tablet

1. En la tablet, abre la página de **Releases** del repositorio:
   <https://github.com/GonzaloMoldes/gmvsolutions.es/releases>
   y descarga el último `VisitasLeads-1.0.N.apk`.
2. Ábrelo. Android pedirá permitir *Instalar apps desconocidas* para el navegador
   (o el gestor de archivos): actívalo y pulsa **Instalar**.
3. Para actualizar, instala la APK nueva encima: se conservan las visitas.

> No desinstales la app para actualizar: al desinstalar se borran las visitas guardadas
> dentro de la app (el Excel de Descargas sí se queda).

Requisitos: Android 8.0 o superior.

## Compilar

La APK se compila sola con GitHub Actions
(`.github/workflows/visitas-leads-apk.yml`) en cada cambio dentro de
`apps/visitas-leads/`, y se publica en *Releases*.

En local (con Android Studio o el SDK de Android instalado):

```bash
cd apps/visitas-leads
./gradlew assembleRelease
# → app/build/outputs/apk/release/app-release.apk
```

La APK se firma con `app/visitas.keystore` (incluida a propósito para que todas las
versiones tengan la misma firma y se puedan instalar encima).

## Estructura

- `app/src/main/assets/` — interfaz (HTML/CSS/JS). Se puede probar abriendo
  `index.html` en un navegador (guarda en `localStorage`).
- `app/src/main/java/.../MainActivity.java` — WebView + puente con Android
  (guardar datos, escribir el Excel en Descargas, abrir correo/WhatsApp).
- `app/src/main/java/.../XlsxWriter.java` — generador de `.xlsx` sin dependencias.
