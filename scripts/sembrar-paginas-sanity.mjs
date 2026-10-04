// Crea en Sanity los documentos unicos de pagina (home, ajustes) con los textos
// por defecto de src/data/*.default.json.
//
//   SANITY_WRITE_TOKEN=xxxx node scripts/sembrar-paginas-sanity.mjs [--dry]
//
// Usa createIfNotExists: si el documento ya existe en Sanity NO lo toca, asi que
// se puede ejecutar sin miedo a pisar lo editado desde /admin/. Para una pagina
// nueva basta con añadir su JSON a PAGINAS.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createClient } from '@sanity/client';

const PAGINAS = [
  { _id: 'home', _type: 'home', fichero: '../src/data/home.default.json' },
  { _id: 'ajustes', _type: 'ajustes', fichero: '../src/data/ajustes.default.json' },
];

// Tipo de cada elemento de lista, por ruta del campo (sin indices). Tiene que
// coincidir con los defineArrayMember de sanity/schemaTypes/home.ts y ajustes.ts.
const TIPOS = {
  '.hero.ficha': 'dato',
  '.escenas.tarjetas': 'tarjeta',
  '.datos.cifras': 'cifra',
  '.recorrido.pasos': 'paso',
  '.roles.items': 'perfil',
  '.faq.items': 'pregunta',
  '.columnasPie': 'columna',
  '.columnasPie.enlaces': 'enlacePie',
};

// Sanity exige un _key unico y un _type en cada objeto de una lista. La clave
// se deriva del contenido para que sea estable entre ejecuciones.
function conClaves(valor, ruta = '') {
  if (Array.isArray(valor)) {
    return valor.map((v, i) => {
      const hijo = conClaves(v, ruta);
      if (hijo && typeof hijo === 'object' && !Array.isArray(hijo)) {
        const _type = TIPOS[ruta];
        if (!_type) throw new Error(`Falta el tipo de los elementos de ${ruta} en TIPOS`);
        const _key = createHash('sha1').update(ruta + i + JSON.stringify(v)).digest('hex').slice(0, 12);
        return { _key, _type, ...hijo };
      }
      return hijo;
    });
  }
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, conClaves(v, `${ruta}.${k}`)]));
  }
  return valor;
}

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

const docs = PAGINAS.map(({ _id, _type, fichero }) => ({
  _id,
  _type,
  ...conClaves(JSON.parse(readFileSync(new URL(fichero, import.meta.url), 'utf8'))),
}));

if (dry) {
  for (const d of docs) console.log(`${d._id}: ${Object.keys(d).length - 2} secciones/campos`);
  process.exit(0);
}

const tx = client.transaction();
for (const d of docs) tx.createIfNotExists(d);
await tx.commit();
for (const d of docs) {
  const existente = await client.getDocument(d._id);
  console.log(`${d._id}: ${existente?._createdAt === existente?._updatedAt ? 'listo' : 'ya existía, no se ha tocado'}`);
}
