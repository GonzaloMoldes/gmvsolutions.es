// Pre-auditoria de copy IA: (1) ranking de paginas por texto visible para saber
// que 10 URLs pasar por Originality/GPTZero; (2) escaneo de "tells" de IA del
// roadmap (A2) sobre el codigo fuente. No sustituye a un detector real: orienta.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const SRC = 'src/pages';

function walk(dir, ext, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, ext, out);
    else if (name.endsWith(ext)) out.push(p);
  }
  return out;
}

// Texto visible aproximado: quita head/script/style/nav/footer y tags.
function visibleText(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, ' ')
    .replace(/<(script|style|nav|footer|header)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const wc = (t) => (t.match(/\S+/g) || []).length;
const urlOf = (p) => '/' + p.replace(/\\/g, '/').replace(/^dist\//, '').replace(/index\.html$/, '');

// ── 1. Ranking por texto visible ──
const ranked = walk(DIST, '.html')
  .map((f) => ({ url: urlOf(f), words: wc(visibleText(readFileSync(f, 'utf-8'))) }))
  .sort((a, b) => b.words - a.words);

console.log('\n=== 10 URLs con más texto visible (candidatas a detector IA) ===');
ranked.slice(0, 10).forEach((r, i) => console.log(`  ${String(i + 1).padStart(2)}. ${String(r.words).padStart(5)} palabras  https://gmvsolutions.es${r.url}`));

// ── 2. Escaneo de tells sobre el codigo fuente ──
const TELLS = [
  'demuestra que', 'lectura más clara', 'foto más real', 'no se queda en',
  'de manera eficiente', 'en el mundo actual', 'hoy en día', 'cabe destacar',
  'es importante señalar', 'no solo', 'sino también', 'potenciar', 'optimizar',
  'impulsar', 'robusto', 'integral', 'escalable', 'intuitivo', 'soluciones',
  'gracias a',
];

const srcFiles = walk(SRC, '.astro');
const hits = {};
for (const f of srcFiles) {
  const text = readFileSync(f, 'utf-8').toLowerCase();
  for (const tell of TELLS) {
    const re = new RegExp(tell.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const n = (text.match(re) || []).length;
    if (n) (hits[tell] ||= []).push({ f: f.replace(/\\/g, '/'), n });
  }
}

console.log('\n=== "Tells" de IA encontrados en src/pages (A2) ===');
const found = Object.entries(hits).sort((a, b) => b[1].reduce((s, x) => s + x.n, 0) - a[1].reduce((s, x) => s + x.n, 0));
if (!found.length) {
  console.log('  ninguno ✅');
} else {
  for (const [tell, list] of found) {
    const total = list.reduce((s, x) => s + x.n, 0);
    console.log(`\n  "${tell}" — ${total} en ${list.length} fichero(s):`);
    list.forEach((x) => console.log(`      ${x.n}×  ${x.f}`));
  }
}
console.log('');
