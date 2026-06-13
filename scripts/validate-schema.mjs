// Validacion local de JSON-LD sobre dist/ (proxy del Rich Results Test).
// Extrae todos los <script type="application/ld+json">, parsea y comprueba
// campos requeridos por tipo + flags (AggregateRating sin reviews, etc.).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const LD_RE = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

const stats = {};
const errors = [];
const flags = [];

function bump(type) {
  stats[type] = (stats[type] || 0) + 1;
}

// Devuelve true si falta cualquiera de las claves (en el primer nivel).
function missing(obj, keys) {
  return keys.filter((k) => obj[k] === undefined || obj[k] === null || obj[k] === '');
}

function checkNode(node, file) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach((n) => checkNode(n, file));
  const type = node['@type'];
  if (!type) return;
  const types = Array.isArray(type) ? type : [type];

  for (const t of types) {
    bump(t);
    switch (t) {
      case 'FAQPage': {
        const q = node.mainEntity || [];
        if (!Array.isArray(q) || q.length === 0) flags.push(`${file}: FAQPage sin mainEntity`);
        else
          q.forEach((item, i) => {
            const m = missing(item, ['name']);
            if (m.length) flags.push(`${file}: FAQ Q${i} sin ${m.join(',')}`);
            if (!item.acceptedAnswer?.text) flags.push(`${file}: FAQ Q${i} sin acceptedAnswer.text`);
          });
        break;
      }
      case 'HowTo': {
        const m = missing(node, ['name']);
        if (m.length) flags.push(`${file}: HowTo sin ${m.join(',')}`);
        if (!Array.isArray(node.step) || node.step.length === 0) flags.push(`${file}: HowTo sin step[]`);
        break;
      }
      case 'BlogPosting':
      case 'Article': {
        const m = missing(node, ['headline', 'datePublished', 'author']);
        if (m.length) flags.push(`${file}: ${t} sin ${m.join(',')}`);
        break;
      }
      case 'VideoObject': {
        const m = missing(node, ['name', 'thumbnailUrl', 'uploadDate']);
        if (m.length) flags.push(`${file}: VideoObject sin ${m.join(',')}`);
        break;
      }
      case 'SoftwareApplication':
      case 'Product': {
        const m = missing(node, ['name']);
        if (m.length) flags.push(`${file}: ${t} sin ${m.join(',')}`);
        if (!node.offers && !node.aggregateRating) flags.push(`${file}: ${t} sin offers ni aggregateRating`);
        break;
      }
      case 'AggregateRating': {
        flags.push(`${file}: ⚠️ AggregateRating presente (ratingValue=${node.ratingValue}, count=${node.reviewCount ?? node.ratingCount}) — exige reseñas reales`);
        break;
      }
      case 'BreadcrumbList': {
        if (!Array.isArray(node.itemListElement) || node.itemListElement.length === 0)
          flags.push(`${file}: BreadcrumbList sin itemListElement`);
        break;
      }
    }
    // recursión a nodos anidados con aggregateRating, etc.
  }
  // Busca AggregateRating anidado aunque el nodo padre no sea Product.
  if (node.aggregateRating) checkNode({ '@type': 'AggregateRating', ...node.aggregateRating }, file);
}

const files = walk(DIST);
let blocks = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf-8');
  let m;
  while ((m = LD_RE.exec(html))) {
    blocks++;
    const raw = m[1].trim();
    try {
      const json = JSON.parse(raw);
      checkNode(json, file.replace(/\\/g, '/'));
    } catch (e) {
      errors.push(`${file.replace(/\\/g, '/')}: JSON inválido — ${e.message}`);
    }
  }
}

console.log(`\n=== JSON-LD en dist/ ===`);
console.log(`HTML escaneados: ${files.length} · bloques JSON-LD: ${blocks}`);
console.log(`\n--- Tipos encontrados ---`);
Object.entries(stats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([t, n]) => console.log(`  ${String(n).padStart(4)}  ${t}`));

console.log(`\n--- Errores de parseo (${errors.length}) ---`);
errors.length ? errors.forEach((e) => console.log(`  ✗ ${e}`)) : console.log('  ninguno ✅');

console.log(`\n--- Avisos / campos faltantes (${flags.length}) ---`);
flags.length ? [...new Set(flags)].forEach((f) => console.log(`  • ${f}`)) : console.log('  ninguno ✅');
console.log('');
