// scripts/test-descarga-token.test.ts
// DL-5 · Tests del token de descarga. La web no tiene framework de tests; se usa el
// runner nativo de Node (>= 22.18 importa TypeScript sin compilar):
//
//   npm run test:descarga
//
// Los cuatro casos que pide el «Hecho cuando» de DL-5: válido, caducado, de otro
// recurso y con la firma alterada. Más los de formato, que son los que llegarían de
// alguien probando URLs a mano.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { firmarToken, verificarToken, TTL_TOKEN_SEGUNDOS } from '../src/lib/descarga-token.ts'

const SECRETO = 'secreto-de-prueba'
const T0 = Date.parse('2026-09-24T12:00:00Z')

test('válido: mismo recurso, dentro de plazo', () => {
  const t = firmarToken('plantilla-sop', SECRETO, T0)
  assert.deepEqual(verificarToken(t, 'plantilla-sop', SECRETO, T0 + 60_000), { ok: true })
})

test('caduca a los 10 minutos, no antes', () => {
  const t = firmarToken('plantilla-sop', SECRETO, T0)
  assert.equal(TTL_TOKEN_SEGUNDOS, 600)
  assert.deepEqual(verificarToken(t, 'plantilla-sop', SECRETO, T0 + 599_000), { ok: true })
  assert.deepEqual(verificarToken(t, 'plantilla-sop', SECRETO, T0 + 601_000), { ok: false, motivo: 'caducado' })
})

test('un token de un recurso no abre otro', () => {
  const t = firmarToken('plantilla-sop', SECRETO, T0)
  assert.deepEqual(verificarToken(t, 'plantilla-it', SECRETO, T0), { ok: false, motivo: 'recurso' })
})

test('firma alterada: rechazado', () => {
  const [carga, firma] = firmarToken('plantilla-sop', SECRETO, T0).split('.')
  const otra = (firma[0] === 'A' ? 'B' : 'A') + firma.slice(1)
  assert.deepEqual(verificarToken(`${carga}.${otra}`, 'plantilla-sop', SECRETO, T0), { ok: false, motivo: 'firma' })
})

test('carga alterada (cambiar el recurso o alargar la caducidad): rechazado por firma', () => {
  const [, firma] = firmarToken('plantilla-sop', SECRETO, T0).split('.')
  const falsa = Buffer.from(JSON.stringify({ r: 'plantilla-it', exp: 9_999_999_999 })).toString('base64url')
  assert.deepEqual(verificarToken(`${falsa}.${firma}`, 'plantilla-it', SECRETO, T0), { ok: false, motivo: 'firma' })
})

test('firmado con otro secreto: rechazado', () => {
  const t = firmarToken('plantilla-sop', 'otro-secreto', T0)
  assert.deepEqual(verificarToken(t, 'plantilla-sop', SECRETO, T0), { ok: false, motivo: 'firma' })
})

test('formatos inválidos: rechazados sin lanzar', () => {
  for (const t of ['', 'sinpunto', '.solofirma', 'solocarga.', 'a.b.c']) {
    const r = verificarToken(t, 'plantilla-sop', SECRETO, T0)
    assert.equal(r.ok, false, `«${t}» debería rechazarse`)
  }
})
