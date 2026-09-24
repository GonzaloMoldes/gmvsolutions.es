// src/lib/descarga-consentimiento.ts
// Textos legales del formulario de descarga (ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md
// §4.4 y §10) y la VERSIÓN que se envía a la app con cada consentimiento.
//
// Viven juntos a propósito: la app guarda `consentimiento_texto_version` para poder
// acreditar QUÉ texto aceptó cada persona (RGPD art. 7.1). Si se cambia una coma de
// TEXTO_CONSENTIMIENTO_COMERCIAL sin cambiar la versión, lo registrado deja de
// corresponder a lo que se mostró.
//
// ⚠️ Borrador técnico pendiente de revisión legal (DL-14). No publicar sin ella.

/** Cambiar SIEMPRE que cambie cualquiera de los dos textos. Formato: fecha del cambio. */
export const VERSION_TEXTOS_DESCARGA = '2026-09-24'

/** Aviso obligatorio de leer: base jurídica, medidas precontractuales (art. 6.1.b). */
export const AVISO_CUENTA_LEAD =
  'Al descargar se crea una cuenta de REELEVO sin activar con estos datos. Puedes completarla cuando quieras o pedir que la borremos.'

/** Casilla opcional, sin marcar por defecto: consentimiento para el correo comercial (LSSI art. 21). */
export const TEXTO_CONSENTIMIENTO_COMERCIAL =
  'Quiero recibir 3 correos sobre cómo REELEVO resuelve esto. Puedo darme de baja en cualquier momento.'
