// scripts/check-descargables.mjs
// DL-3 (ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md) · Falla el build si un botón pide un
// recurso que no existe. Sin esto, el error aparece en producción: el visitante deja sus
// datos y la descarga devuelve 404.
//
// Comprueba:
//   1. Cada `data-descarga="<id>"` de src/ apunta a un id de src/data/descargables.ts.
//   2. Cada entrada del catálogo tiene su archivo en src/descargables/.
//   3. Ningún archivo del catálogo está en public/: allí tendría URL fija y se podría
//      descargar sin dejar datos, que es lo que la función impide.
//   4. `data-descarga` sólo con valor literal. Un valor calculado (`data-descarga={x}`)
//      no se puede comprobar aquí, así que no se admite.
//
// Lee el catálogo como texto en vez de importarlo: es TypeScript, y el Node del build
// no garantiza poder importar .ts. El formato que espera es el del propio catálogo
// (`'id': {` … `archivo: '…'`); si alguien lo cambia, el script falla diciendo que no
// encuentra entradas, no deja pasar nada.

import fs from 'node:fs'
import path from 'node:path'

const RAIZ = process.cwd()
const CATALOGO = path.join(RAIZ, 'src', 'data', 'descargables.ts')
const DIR_ARCHIVOS = path.join(RAIZ, 'src', 'descargables')
const DIR_PUBLIC = path.join(RAIZ, 'public')
const EXTENSIONES = new Set(['.astro', '.md', '.mdx', '.html', '.ts', '.tsx', '.js'])

const errores = []

// ── Catálogo ─────────────────────────────────────────────────────────────────
const fuente = fs.readFileSync(CATALOGO, 'utf8')
const cuerpo = fuente.slice(fuente.indexOf('export const DESCARGABLES'))
const catalogo = new Map()
for (const m of cuerpo.matchAll(/'([a-z0-9-]+)':\s*\{([^}]*)\}/g)) {
  const archivo = m[2].match(/archivo:\s*'([^']+)'/)?.[1]
  catalogo.set(m[1], archivo)
}
if (catalogo.size === 0) {
  errores.push(`No se ha encontrado ninguna entrada en ${path.relative(RAIZ, CATALOGO)}. ¿Ha cambiado su formato?`)
}

for (const [id, archivo] of catalogo) {
  if (!archivo) { errores.push(`El recurso «${id}» no tiene 'archivo' en el catálogo.`); continue }
  if (!fs.existsSync(path.join(DIR_ARCHIVOS, archivo))) {
    errores.push(`El recurso «${id}» apunta a src/descargables/${archivo}, que no existe.`)
  }
}

// ── Nada del catálogo en public/ ────────────────────────────────────────────
function recorrer(dir, visitar) {
  if (!fs.existsSync(dir)) return
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, e.name)
    if (e.isDirectory()) recorrer(ruta, visitar)
    else visitar(ruta)
  }
}
const archivosCatalogo = new Set([...catalogo.values()].filter(Boolean))
recorrer(DIR_PUBLIC, ruta => {
  if (archivosCatalogo.has(path.basename(ruta))) {
    errores.push(`${path.relative(RAIZ, ruta)} es un recurso del catálogo y está en public/: tendría URL pública sin pasar por el formulario.`)
  }
})

// ── Botones ─────────────────────────────────────────────────────────────────
let botones = 0
recorrer(path.join(RAIZ, 'src'), ruta => {
  if (!EXTENSIONES.has(path.extname(ruta))) return
  // Sin comentarios: la documentación del atributo (`data-descarga="<id>"`) no es un botón.
  // El `//` sólo cuenta como comentario a principio de línea o tras un espacio, para no
  // comerse el resto de una URL («https://…»).
  const texto = fs.readFileSync(ruta, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1')
  const rel = path.relative(RAIZ, ruta)
  for (const m of texto.matchAll(/data-descarga\s*=\s*(["'{])([^"'}]*)/g)) {
    // El propio componente lee el atributo con querySelector('[data-descarga]'):
    // eso no es un botón, no lleva `=`, y no casa con este patrón.
    if (m[1] === '{') {
      errores.push(`${rel}: data-descarga con valor calculado ({${m[2]}}). Sólo se admite un id literal.`)
      continue
    }
    botones++
    if (!catalogo.has(m[2])) {
      errores.push(`${rel}: data-descarga="${m[2]}" no está en src/data/descargables.ts.`)
    }
  }
})

if (errores.length) {
  console.error(`\n[DL-3] ❌ ${errores.length} problema(s) con los recursos descargables:\n`)
  for (const e of errores) console.error(`   ✗ ${e}`)
  console.error('')
  process.exit(1)
}
console.log(`[DL-3] ✅ ${catalogo.size} recurso(s) en el catálogo, ${botones} botón(es) con data-descarga, ninguno en public/.`)
