// Crea en Sanity los documentos de pagina (home, precios, faqs, ajustes) y las
// preguntas frecuentes reutilizables, con los textos de src/data/*.default.json.
//
//   SANITY_WRITE_TOKEN=xxxx node scripts/sembrar-paginas-sanity.mjs [--dry]
//
// Usa createIfNotExists: si un documento ya existe en Sanity NO lo toca, asi que
// se puede ejecutar sin miedo a pisar lo editado desde /admin/. Para una pagina
// nueva basta con añadir su JSON a PAGINAS (y sus listas a TIPOS).
//
// Unica excepcion, la migracion de la fase 2: si la home todavia tiene sus FAQ
// escritas dentro (fase 1) y nadie la ha editado desde que se creo, sus FAQ se
// sustituyen por referencias a las preguntas reutilizables.
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createClient } from '@sanity/client';

const PAGINAS = [
  { _id: 'home', _type: 'home', fichero: '../src/data/home.default.json' },
  { _id: 'precios', _type: 'precios', fichero: '../src/data/precios.default.json' },
  { _id: 'paginaFaqs', _type: 'paginaFaqs', fichero: '../src/data/faqs.default.json' },
  { _id: 'ajustes', _type: 'ajustes', fichero: '../src/data/ajustes.default.json' },
  // Paginas de funcionalidad: una por JSON de src/data/paginas/.
  ...readdirSync(new URL('../src/data/paginas/', import.meta.url))
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const slug = f.replace(/\.json$/, '');
      const { tipo = 'funcionalidad' } = JSON.parse(readFileSync(new URL(`../src/data/paginas/${f}`, import.meta.url), 'utf8'));
      return { _id: `pagina-${slug}`, _type: 'paginaFuncionalidad', fichero: `../src/data/paginas/${f}`, extra: { ruta: `/${slug.replace(/--/g, '/')}/`, tipo } };
    }),
];

// Tipo de cada elemento de lista, por ruta del campo (sin indices). Tiene que
// coincidir con los defineArrayMember de sanity/schemaTypes/*.ts.
const TIPOS = {
  '.hero.ficha': 'dato',
  '.escenas.tarjetas': 'tarjeta',
  '.datos.cifras': 'cifra',
  '.recorrido.pasos': 'paso',
  '.roles.items': 'perfil',
  '.columnasPie': 'columna',
  '.columnasPie.enlaces': 'enlacePie',
  '.planes': 'plan',
  '.planes.caracteristicas': 'caracteristica',
  '.categorias': 'categoria',
  '.hero.botones': 'boton',
  '.ctaFinal.botones': 'boton',
};

// Listas de preguntas: en el JSON van escritas ({ id, q, a }); en Sanity, cada
// una es un documento «preguntaFrecuente» y la pagina guarda una referencia.
const REFERENCIAS = new Set(['.faq.items', '.categorias.preguntas']);

const preguntas = new Map();

// Sanity exige un _key unico y un _type en cada objeto de una lista. La clave
// se deriva del contenido para que sea estable entre ejecuciones.
function convertir(valor, ruta = '') {
  if (Array.isArray(valor)) {
    return valor.map((v, i) => {
      const _key = createHash('sha1').update(ruta + i + JSON.stringify(v)).digest('hex').slice(0, 12);
      if (REFERENCIAS.has(ruta)) {
        const { id, q, a } = v;
        if (!id) throw new Error(`Pregunta sin id en ${ruta}: ${q}`);
        const previa = preguntas.get(id);
        if (previa && (previa.q !== q || previa.a !== a)) throw new Error(`Dos textos distintos para la pregunta ${id}`);
        preguntas.set(id, { _id: id, _type: 'preguntaFrecuente', q, a });
        return { _key, _type: 'reference', _ref: id };
      }
      const hijo = convertir(v, ruta);
      if (hijo && typeof hijo === 'object' && !Array.isArray(hijo)) {
        const _type = TIPOS[ruta];
        if (!_type) throw new Error(`Falta el tipo de los elementos de ${ruta} en TIPOS`);
        return { _key, _type, ...hijo };
      }
      return hijo;
    });
  }
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, convertir(v, `${ruta}.${k}`)]));
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

const docs = PAGINAS.map(({ _id, _type, fichero, extra }) => ({
  _id,
  _type,
  ...extra,
  ...convertir(JSON.parse(readFileSync(new URL(fichero, import.meta.url), 'utf8'))),
}));

if (dry) {
  for (const d of docs) console.log(`${d._id}: ${Object.keys(d).length - 2} secciones/campos`);
  console.log(`${preguntas.size} preguntas frecuentes`);
  process.exit(0);
}

// Que habia antes de esta ejecucion, para el resumen final.
const ids = [...docs.map((d) => d._id), ...preguntas.keys()];
const previos = new Set((await client.getDocuments(ids)).filter(Boolean).map((d) => d._id));

// Primero las preguntas: las paginas las referencian. «tipo» y «ruta» son de
// solo lectura en el panel: se completan tambien en las paginas ya creadas.
const fijos = docs.filter((d) => d._type === 'paginaFuncionalidad');
const tx = client.transaction();
for (const p of preguntas.values()) tx.createIfNotExists(p);
for (const d of docs) tx.createIfNotExists(d);
for (const d of fijos) tx.patch(d._id, (p) => p.setIfMissing({ tipo: d.tipo, ruta: d.ruta }));
await tx.commit();

// Migracion de la fase 2 (ver cabecera).
const home = await client.getDocument('home');
const borrador = await client.getDocument('drafts.home');
const inline = home?.faq?.items?.some((it) => it._type !== 'reference');
const migrados = new Set();
if (inline) {
  if (home._createdAt === home._updatedAt && !borrador) {
    const nueva = docs.find((d) => d._id === 'home');
    await client.patch('home').ifRevisionId(home._rev).set({ 'faq.items': nueva.faq.items }).commit();
    migrados.add('home');
    console.log('home: FAQ pasadas a preguntas reutilizables');
  } else {
    console.log('home: AVISO, tiene FAQ escritas dentro pero ya se ha editado; no se migra solo.');
  }
}

const nuevos = [...docs, ...preguntas.values()].filter((d) => !previos.has(d._id));
console.log(`Creados: ${nuevos.length} (${nuevos.filter((d) => d._type !== 'preguntaFrecuente').length} páginas, ${nuevos.filter((d) => d._type === 'preguntaFrecuente').length} preguntas).`);
console.log(`Ya existían y no se han tocado: ${docs.length + preguntas.size - nuevos.length - migrados.size}${migrados.size ? ` · migrados: ${[...migrados].join(', ')}` : ''}.`);
