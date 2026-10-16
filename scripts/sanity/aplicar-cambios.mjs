// Aplica en Sanity un fichero de cambios (p. ej. scripts/sanity/cambios-2026-10-16.json).
//
//   node scripts/sanity/aplicar-cambios.mjs scripts/sanity/cambios-2026-10-16.json            -> simulacion
//   SANITY_WRITE_TOKEN=xxxx node scripts/sanity/aplicar-cambios.mjs <fichero> --aplicar       -> escribe
//
// Reglas para no pisar lo editado desde el panel /admin/:
// - "cambios": cada uno trae el valor "from" que habia cuando se preparo. Si el
//   campo ya no vale eso (alguien lo edito), se salta y se informa.
// - "crear": createIfNotExists. Si el documento ya existe, no se toca.
// - "insertar": solo si el documento sigue en la revision "rev" con la que se
//   preparo y el texto no esta ya dentro.
// Cada documento se parchea con ifRevisionID: si cambia entre la lectura y la
// escritura, Sanity rechaza el parche en vez de sobrescribir.
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

const [, , fichero, ...flags] = process.argv;
const aplicar = flags.includes('--aplicar');
if (!fichero) {
  console.error('Uso: node scripts/sanity/aplicar-cambios.mjs <fichero.json> [--aplicar]');
  process.exit(1);
}
const token = process.env.SANITY_WRITE_TOKEN;
if (aplicar && !token) {
  console.error('Falta SANITY_WRITE_TOKEN (token con permiso Editor).');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '1rbyt934',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
  perspective: 'published',
});

const spec = JSON.parse(readFileSync(fichero, 'utf8'));

// Lee un valor con la sintaxis de rutas de los parches: a.b, a[_key=="x"].b
function leer(doc, ruta) {
  let v = doc;
  for (const parte of ruta.match(/[^.[\]]+(\[_key=="[^"]+"\])?/g) ?? []) {
    const m = parte.match(/^([^[]+)(?:\[_key=="([^"]+)"\])?$/);
    if (!m || v == null) return undefined;
    v = v[m[1]];
    if (m[2] !== undefined) v = Array.isArray(v) ? v.find((x) => x?._key === m[2]) : undefined;
  }
  return v;
}

const ids = [...new Set([
  ...spec.cambios.map((c) => c.id),
  ...spec.insertar.map((c) => c.id),
  ...spec.crear.map((d) => d._id),
])];
const docs = new Map((await client.fetch('*[_id in $ids]', { ids })).map((d) => [d._id, d]));

const resumen = { aplicados: 0, saltados: [], creados: [], yaExistian: [], insertados: 0 };
const porDoc = new Map(); // id -> { set: {}, insert: [] }
const parche = (id) => porDoc.get(id) ?? porDoc.set(id, { set: {}, insert: [] }).get(id);

for (const c of spec.cambios) {
  const doc = docs.get(c.id);
  const actual = doc ? leer(doc, c.path) : undefined;
  if (!doc || actual !== c.from) {
    resumen.saltados.push(`${c.id} · ${c.path} (${doc ? 'editado desde que se preparo' : 'no existe'})`);
    continue;
  }
  parche(c.id).set[c.path] = c.to;
  resumen.aplicados++;
}

for (const ins of spec.insertar) {
  const doc = docs.get(ins.id);
  const textos = ins.items.map((b) => (b.children ?? []).map((s) => s.text).join(''));
  const yaEsta = doc && JSON.stringify(doc.body ?? []).includes(JSON.stringify(textos[0]).slice(1, 60));
  if (!doc || doc._rev !== ins.rev || yaEsta) {
    resumen.saltados.push(`${ins.id} · insercion (${!doc ? 'no existe' : yaEsta ? 'ya insertado' : 'editado desde que se preparo'})`);
    continue;
  }
  parche(ins.id).insert.push(ins);
  resumen.insertados++;
}

for (const d of spec.crear) (docs.has(d._id) ? resumen.yaExistian : resumen.creados).push(d._id);

console.log(`${aplicar ? 'APLICANDO' : 'SIMULACION'} · ${client.config().projectId}/${client.config().dataset}`);
console.log(`  campos a cambiar: ${resumen.aplicados} en ${[...porDoc.values()].filter((p) => Object.keys(p.set).length).length} documentos`);
console.log(`  inserciones: ${resumen.insertados}`);
console.log(`  documentos nuevos: ${resumen.creados.join(', ') || '—'}`);
if (resumen.yaExistian.length) console.log(`  ya existian (no se tocan): ${resumen.yaExistian.join(', ')}`);
if (resumen.saltados.length) console.log(`  saltados:\n    ${resumen.saltados.join('\n    ')}`);
if (!aplicar) {
  console.log('\nNada escrito. Repite con --aplicar y SANITY_WRITE_TOKEN para escribir.');
  process.exit(0);
}

for (const d of spec.crear) if (!docs.has(d._id)) await client.createIfNotExists(d);
for (const [id, p] of porDoc) {
  let patch = client.patch(id).ifRevisionId(docs.get(id)._rev);
  if (Object.keys(p.set).length) patch = patch.set(p.set);
  for (const ins of p.insert) patch = patch.insert('after', ins.insertAfter, ins.items);
  await patch.commit();
}
console.log('\nHecho. Si el webhook de Vercel esta configurado, la web se reconstruye sola en 1-2 minutos.');
