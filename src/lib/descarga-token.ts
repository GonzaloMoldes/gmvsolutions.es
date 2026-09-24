// src/lib/descarga-token.ts
// Token de descarga de un recurso (ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md §4.3, DL-5).
//
// Lo emite POST /api/descarga/ SÓLO después de que la app confirme el lead (200/409), y
// lo exige GET /api/descarga/<recurso>/. Es lo que hace que el archivo no tenga URL fija:
// sin token no hay descarga, y el token dura 10 minutos y vale para un único recurso.
//
// Formato: `<carga>.<firma>`
//   carga = base64url(JSON {"r": <recurso>, "exp": <segundos unix>})
//   firma = base64url(HMAC-SHA256(carga, DESCARGA_TOKEN_SECRET))
//
// No lleva datos personales: sólo el recurso y la caducidad. Aunque se comparta, deja de
// valer en 10 minutos y no dice nada de quién lo pidió.

import { createHmac, timingSafeEqual } from 'node:crypto'

export const TTL_TOKEN_SEGUNDOS = 600

export type MotivoRechazo = 'formato' | 'firma' | 'caducado' | 'recurso'
export type ResultadoToken = { ok: true } | { ok: false; motivo: MotivoRechazo }

function firmar(carga: string, secreto: string): string {
  return createHmac('sha256', secreto).update(carga).digest('base64url')
}

export function firmarToken(recurso: string, secreto: string, ahoraMs = Date.now(), ttlSegundos = TTL_TOKEN_SEGUNDOS): string {
  const exp = Math.floor(ahoraMs / 1000) + ttlSegundos
  const carga = Buffer.from(JSON.stringify({ r: recurso, exp })).toString('base64url')
  return `${carga}.${firmar(carga, secreto)}`
}

export function verificarToken(token: string, recursoEsperado: string, secreto: string, ahoraMs = Date.now()): ResultadoToken {
  const partes = token.split('.')
  if (partes.length !== 2 || !partes[0] || !partes[1]) return { ok: false, motivo: 'formato' }
  const [carga, firma] = partes

  // La firma se comprueba ANTES de leer la carga: no se interpreta nada que no hayamos
  // firmado nosotros. timingSafeEqual lanza si las longitudes difieren, así que se
  // comprueban antes (mismo criterio que coincideSecreto en la app).
  const esperada = Buffer.from(firmar(carga, secreto))
  const recibida = Buffer.from(firma)
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) {
    return { ok: false, motivo: 'firma' }
  }

  let datos: { r?: unknown; exp?: unknown }
  try {
    datos = JSON.parse(Buffer.from(carga, 'base64url').toString('utf8'))
  } catch {
    return { ok: false, motivo: 'formato' }
  }
  if (typeof datos.r !== 'string' || typeof datos.exp !== 'number') return { ok: false, motivo: 'formato' }
  if (datos.exp * 1000 < ahoraMs) return { ok: false, motivo: 'caducado' }
  if (datos.r !== recursoEsperado) return { ok: false, motivo: 'recurso' }
  return { ok: true }
}
