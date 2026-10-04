// Sube a Sanity los articulos generados por scripts/migrar-blog-a-sanity.mjs.
//
//   SANITY_WRITE_TOKEN=xxxx node scripts/importar-a-sanity.mjs [--dry]
//
// El token se crea en sanity.io/manage → API → Tokens (permiso Editor). Los _id
// son deterministas (articulo-<slug>): repetir la importacion sustituye los
// documentos en vez de duplicarlos. Alternativa sin este script:
//   npx sanity dataset import scripts/migracion/articulos.ndjson production --replace
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

const token = process.env.SANITY_WRITE_TOKEN;
const dry = process.argv.includes('--dry');
if (!token && !dry) {
  console.error('Falta SANITY_WRITE_TOKEN (token con permiso Editor).');
  process.exit(1);
}
const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '1rbyt934',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

const docs = readFileSync(new URL('./migracion/articulos.ndjson', import.meta.url), 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l));

console.log(`${docs.length} articulos para ${client.config().projectId}/${client.config().dataset}${dry ? ' (simulacion)' : ''}`);
if (dry) process.exit(0);

// De 10 en 10 para no pasar el tamaño maximo de una transaccion.
for (let i = 0; i < docs.length; i += 10) {
  const tx = client.transaction();
  for (const d of docs.slice(i, i + 10)) tx.createOrReplace(d);
  await tx.commit({ visibility: 'async' });
  console.log(`  ${Math.min(i + 10, docs.length)}/${docs.length}`);
}
const total = await client.fetch('count(*[_type == "articulo"])');
console.log(`Hecho. Articulos en Sanity: ${total}`);
