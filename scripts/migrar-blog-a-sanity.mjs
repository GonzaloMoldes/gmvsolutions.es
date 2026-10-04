// Migra los articulos del blog escritos en codigo (src/pages/blog/*.astro) a
// documentos de Sanity.
//
// HISTORICO: ya se ejecuto. Los .astro de origen se borraron en octubre de 2026
// tras importar los 33 articulos; se conserva como referencia de la conversion.
//
//   node scripts/migrar-blog-a-sanity.mjs            -> genera los ficheros
//   node scripts/migrar-blog-a-sanity.mjs --solo a,b -> solo esos slugs
//
// Salidas:
//   scripts/migracion/articulos.ndjson  documentos «articulo» (importables con
//                                       `sanity dataset import` o con
//                                       scripts/importar-a-sanity.mjs)
//   src/styles/blog-migrado.css         <style> propios de cada articulo,
//                                       reescritos bajo .post-<slug>
//
// Criterio de conversion: lo comun se vuelve editable de verdad (parrafos,
// titulos, listas, enlaces, cajas destacadas, enlaces relacionados, tablas,
// descarga); lo hecho a medida se guarda como «htmlBloque» para que se vea
// identico. Los _id son deterministas (articulo-<slug>): reimportar sustituye.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { transformSync } from 'esbuild';
import { parse } from 'node-html-parser';
import postcss from 'postcss';

const ROOT = new URL('..', import.meta.url).pathname;
const args = process.argv.slice(2);
const solo = args.includes('--solo') ? args[args.indexOf('--solo') + 1].split(',') : null;

// --- Registro del blog (entradas de codigo) ----------------------------------
const blogTs = readFileSync(`${ROOT}src/lib/blog.ts`, 'utf8');
const REVISION = blogTs.match(/export const REVISION = '([^']+)'/)[1];
const regText = blogTs.slice(blogTs.indexOf('const postsCodigo: BlogPost[] = ['));
const regArray = regText.slice(regText.indexOf('['), regText.indexOf('\n];') + 3);
const registro = new Function('REVISION', `return ${regArray}`)(REVISION);

// --- Utilidades ----------------------------------------------------------------
let n = 0;
const key = (seed) => createHash('sha1').update(`${seed}:${n++}`).digest('hex').slice(0, 12);
const avisos = [];
const aviso = (slug, msg) => avisos.push(`  · ${slug}: ${msg}`);

function partes(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('sin frontmatter');
  return { front: m[1], plantilla: m[2] };
}

// Atributos de <ArticleLayout ...>: "literal" o {expresion}.
function etiquetaLayout(plantilla) {
  const ini = plantilla.indexOf('<ArticleLayout');
  let i = ini + '<ArticleLayout'.length;
  let llaves = 0;
  let comillas = false;
  for (; i < plantilla.length; i++) {
    const c = plantilla[i];
    if (c === '"' && llaves === 0) comillas = !comillas;
    else if (!comillas && c === '{') llaves++;
    else if (!comillas && c === '}') llaves--;
    else if (!comillas && llaves === 0 && c === '>') break;
  }
  const tag = plantilla.slice(ini + '<ArticleLayout'.length, i);
  const attrs = [];
  const re = /(\w+)=(?:"([^"]*)"|\{([^}]*)\})/g;
  let m;
  while ((m = re.exec(tag))) attrs.push({ nombre: m[1], literal: m[2], expr: m[3] });
  const fin = plantilla.indexOf('</ArticleLayout>');
  return { attrs, cuerpo: plantilla.slice(i + 1, fin), resto: plantilla.slice(fin) };
}

function evaluarProps(front, attrs) {
  const js = transformSync(front.replace(/^import .*$/gm, ''), { loader: 'ts' }).code;
  const ret = attrs.map((a) => `${JSON.stringify(a.nombre)}: ${a.expr ?? JSON.stringify(a.literal)}`).join(',');
  return new Function(`${js}\nreturn {${ret}};`)();
}

// --- Inline -> spans ---------------------------------------------------------------
class NoInline extends Error {}

function spans(nodo, marks, markDefs, seed) {
  const out = [];
  for (const h of nodo.childNodes) {
    if (h.nodeType === 3) {
      const t = h.text.replace(/\s+/g, ' ');
      if (t) out.push({ _type: 'span', _key: key(seed), text: t, marks: [...marks] });
      continue;
    }
    if (h.nodeType !== 1) continue;
    const tag = h.rawTagName.toLowerCase();
    const attrs = Object.keys(h.attributes);
    if (tag === 'br') {
      out.push({ _type: 'span', _key: key(seed), text: '\n', marks: [...marks] });
    } else if ((tag === 'strong' || tag === 'b') && attrs.length === 0) {
      out.push(...spans(h, [...marks, 'strong'], markDefs, seed));
    } else if ((tag === 'em' || tag === 'i') && attrs.length === 0) {
      out.push(...spans(h, [...marks, 'em'], markDefs, seed));
    } else if (tag === 'code' && attrs.length === 0) {
      out.push(...spans(h, [...marks, 'code'], markDefs, seed));
    } else if (
      tag === 'a' &&
      h.getAttribute('href') &&
      attrs.every((a) => ['href', 'data-cta', 'data-cta-intent', 'data-cta-location', 'data-cta-trigger', 'data-cta-label'].includes(a) || (a === 'class' && h.getAttribute('class') === 'btn-primary'))
    ) {
      const k = key(seed);
      const g = (a) => h.getAttribute(a) || undefined;
      const cta = attrs.some((a) => a.startsWith('data-cta'))
        ? { intent: g('data-cta-intent'), location: g('data-cta-location'), trigger: g('data-cta-trigger'), label: g('data-cta-label') }
        : undefined;
      markDefs.push({ _type: 'link', _key: k, href: h.getAttribute('href'), ...(g('class') ? { clase: g('class') } : {}), ...(cta ? { cta } : {}) });
      out.push(...spans(h, [...marks, k], markDefs, seed));
    } else if (tag === 'span' && attrs.length === 0) {
      out.push(...spans(h, marks, markDefs, seed));
    } else {
      throw new NoInline(`<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}>`);
    }
  }
  return out;
}

function limpiar(lista) {
  // Une espacios entre spans y recorta los extremos del bloque.
  const r = lista.filter((s) => s.text !== '');
  for (let i = 0; i < r.length; i++) {
    if (r[i].text === '\n') continue;
    if (i === 0 || r[i - 1].text === '\n') r[i].text = r[i].text.replace(/^ +/, '');
    if (i === r.length - 1 || r[i + 1]?.text === '\n') r[i].text = r[i].text.replace(/ +$/, '');
    if (i > 0 && r[i - 1].text.endsWith(' ') && r[i].text.startsWith(' ')) r[i].text = r[i].text.slice(1);
  }
  return r.filter((s) => s.text !== '');
}

function bloque(nodo, estilo, seed, extra = {}) {
  const markDefs = [];
  const children = limpiar(spans(nodo, [], markDefs, seed));
  if (!children.length) return null;
  return { _type: 'block', _key: key(seed), style: estilo, markDefs, children, ...extra };
}

const htmlBloque = (nodo, seed, nota) => ({
  _type: 'htmlBloque',
  _key: key(seed),
  nota: nota ?? `<${nodo.rawTagName?.toLowerCase()}${nodo.getAttribute?.('class') ? ` class="${nodo.getAttribute('class')}"` : ''}>`,
  html: nodo.toString().trim(),
});

// --- Bloques -----------------------------------------------------------------------
function lista(nodo, seed, nivel = 1) {
  const tipo = nodo.rawTagName.toLowerCase() === 'ol' ? 'number' : 'bullet';
  const out = [];
  for (const li of nodo.childNodes) {
    if (li.nodeType === 3 && !li.text.trim()) continue;
    if (li.nodeType !== 1 || li.rawTagName.toLowerCase() !== 'li' || Object.keys(li.attributes).length) throw new NoInline('lista irregular');
    const anidadas = li.childNodes.filter((h) => h.nodeType === 1 && ['ul', 'ol'].includes(h.rawTagName.toLowerCase()));
    const markDefs = [];
    const propio = parse('<li></li>').firstChild;
    for (const h of li.childNodes) if (!anidadas.includes(h)) propio.appendChild(h.clone());
    const children = limpiar(spans(propio, [], markDefs, seed));
    if (children.length) out.push({ _type: 'block', _key: key(seed), style: 'normal', listItem: tipo, level: nivel, markDefs, children });
    for (const a of anidadas) {
      if (Object.keys(a.attributes).length) throw new NoInline('lista anidada con clase');
      out.push(...lista(a, seed, nivel + 1));
    }
  }
  return out;
}

function tabla(nodo, seed) {
  const clase = nodo.getAttribute('class');
  if (clase && !['tabla-comparativa', 'tabla-simple'].includes(clase)) throw new NoInline(`tabla ${clase}`);
  const celda = (c) => {
    if (Object.keys(c.attributes).length) throw new NoInline('celda con atributos');
    return limpiar(spans(c, [], [], seed))
      .map((s) => (s.marks.includes('strong') ? `**${s.text}**` : s.text))
      .join('');
  };
  const caption = nodo.querySelector('caption')?.text.trim();
  const thead = nodo.querySelector('thead');
  const cabecera = thead ? thead.querySelectorAll('th,td').map(celda) : [];
  const filas = (nodo.querySelector('tbody') ?? nodo)
    .querySelectorAll('tr')
    .filter((tr) => !thead || tr.parentNode !== thead)
    .map((tr) => ({ _key: key(seed), _type: 'fila', celdas: tr.querySelectorAll('td,th').map(celda) }));
  for (const s of nodo.querySelectorAll('*')) {
    if (s.querySelectorAll('a').length && ['td', 'th'].includes(s.rawTagName.toLowerCase())) throw new NoInline('enlace en celda');
  }
  return { _type: 'tabla', _key: key(seed), ...(caption ? { caption } : {}), ...(clase ? { clase } : {}), cabecera, filas };
}

function enlacesRelacionados(nodo, seed) {
  const hijos = nodo.childNodes.filter((h) => h.nodeType === 1);
  const etiqueta = nodo.querySelector('.related-links-label')?.text.trim();
  const grid = nodo.querySelector('.related-links-grid');
  if (!grid || hijos.length > 2) throw new NoInline('related-links irregular');
  const enlaces = grid.childNodes
    .filter((h) => h.nodeType === 1)
    .map((a) => {
      if (a.rawTagName.toLowerCase() !== 'a' || a.getAttribute('class') !== 'related-link-card') throw new NoInline('tarjeta irregular');
      const t = (c) => a.querySelector(`.${c}`)?.text.replace(/\s+/g, ' ').trim();
      return { _type: 'enlace', _key: key(seed), kicker: t('related-link-kicker'), titulo: t('related-link-title'), descripcion: t('related-link-desc'), href: a.getAttribute('href') };
    });
  return { _type: 'enlacesRelacionados', _key: key(seed), etiqueta, enlaces };
}

function convertir(nodos, seed) {
  const out = [];
  let suelto = [];
  const vaciarSuelto = () => {
    if (!suelto.length) return;
    const p = parse('<p></p>').firstChild;
    suelto.forEach((h) => p.appendChild(h.clone()));
    try {
      const b = bloque(p, 'normal', seed);
      if (b) out.push(b);
    } catch (e) {
      if (!(e instanceof NoInline)) throw e;
      out.push(htmlBloque(p, seed, 'texto suelto'));
    }
    suelto = [];
  };
  for (const h of nodos) {
    if (h.nodeType === 8) continue;
    if (h.nodeType === 3) {
      if (h.text.trim()) suelto.push(h);
      continue;
    }
    const tag = h.rawTagName;
    const t = tag.toLowerCase();
    const clase = h.getAttribute('class');
    if (['strong', 'em', 'b', 'i', 'a', 'span', 'code', 'br'].includes(t)) {
      suelto.push(h);
      continue;
    }
    vaciarSuelto();
    try {
      if (tag === 'DescargaConCuenta') {
        out.push({ _type: 'descarga', _key: key(seed) });
      } else if (t === 'p' && !clase && !h.getAttribute('id')) {
        const b = bloque(h, 'normal', seed);
        if (b) out.push(b);
      } else if (['h2', 'h3', 'h4'].includes(t) && !clase) {
        if (h.getAttribute('id')) out.push({ _type: 'ancla', _key: key(seed), id: h.getAttribute('id') });
        const b = bloque(h, t, seed);
        if (b) out.push(b);
      } else if (['ul', 'ol'].includes(t) && !clase) {
        out.push(...lista(h, seed));
      } else if (t === 'blockquote' && !clase) {
        const ps = h.childNodes.filter((x) => x.nodeType === 1);
        if (ps.length && ps.every((x) => x.rawTagName.toLowerCase() === 'p')) ps.forEach((p) => out.push(bloque(p, 'blockquote', seed)));
        else out.push(bloque(h, 'blockquote', seed));
      } else if (t === 'hr') {
        out.push({ _type: 'separador', _key: key(seed) });
      } else if (t === 'table') {
        out.push(tabla(h, seed));
      } else if (t === 'div' && ['highlight-box', 'data-card'].includes(clase) && !h.getAttribute('id')) {
        const contenido = convertir(h.childNodes, seed);
        if (contenido.some((c) => c._type !== 'block')) throw new NoInline('destacado complejo');
        out.push({ _type: 'destacado', _key: key(seed), ...(clase === 'data-card' ? { estilo: 'data-card' } : {}), contenido });
      } else if (t === 'div' && clase === 'related-links') {
        out.push(enlacesRelacionados(h, seed));
      } else if (['div', 'section'].includes(t) && !clase && Object.keys(h.attributes).length === 0) {
        out.push(...convertir(h.childNodes, seed));
      } else if (['section', 'div'].includes(t) && !clase && h.getAttribute('id')) {
        out.push({ _type: 'ancla', _key: key(seed), id: h.getAttribute('id') });
        out.push(...convertir(h.childNodes, seed));
      } else {
        out.push(htmlBloque(h, seed));
      }
    } catch (e) {
      if (!(e instanceof NoInline)) throw e;
      out.push(htmlBloque(h, seed, `${clase ? `.${clase}` : `<${t}>`} · ${e.message}`));
    }
  }
  vaciarSuelto();
  return out.filter(Boolean);
}

// Si todo el cuerpo esta dentro de un unico envoltorio con clase (p. ej.
// .content-inner), se convierte su interior y la clase pasa a «contenedor».
function desenvolver(raiz) {
  const elems = raiz.childNodes.filter((h) => h.nodeType === 1);
  const texto = raiz.childNodes.filter((h) => h.nodeType === 3 && h.text.trim());
  if (elems.length === 1 && !texto.length && ['div', 'article', 'section'].includes(elems[0].rawTagName.toLowerCase()) && elems[0].getAttribute('class') && !['highlight-box', 'related-links'].includes(elems[0].getAttribute('class'))) {
    return { contenedor: elems[0].getAttribute('class'), nodos: elems[0].childNodes };
  }
  return { contenedor: undefined, nodos: raiz.childNodes };
}

// --- CSS propio de cada articulo -----------------------------------------------
function cssPrefijado(css, slug) {
  const raiz = postcss.parse(css);
  raiz.walkRules((r) => {
    if (r.parent?.type === 'atrule' && /keyframes/.test(r.parent.name)) return;
    r.selectors = r.selectors.map((s) => `.post-${slug} ${s.replace(/:global\(([^)]*)\)/g, '$1').trim()}`);
  });
  return raiz.toString();
}

// --- Principal ---------------------------------------------------------------------
const docs = [];
const css = [];
const resumen = [];
for (const [orden, entrada] of registro.entries()) {
  const slug = entrada.slug;
  if (solo && !solo.includes(slug)) continue;
  const src = readFileSync(`${ROOT}src/pages/blog/${slug}.astro`, 'utf8');
  const { front, plantilla } = partes(src);
  const { attrs, cuerpo, resto } = etiquetaLayout(plantilla);
  const props = evaluarProps(front, attrs);

  if (/\{[^}]*\}/.test(cuerpo.replace(/<style[\s\S]*?<\/style>/g, ''))) aviso(slug, 'el cuerpo tiene expresiones {…}: revisar');
  const canonical = `https://www.gmvsolutions.es/blog/${slug}/`;
  if (props.canonical && props.canonical !== canonical) aviso(slug, `canonical distinta: ${props.canonical}`);

  // Los <style> van a blog-migrado.css; dentro del cuerpo estorbarian al desenvolver.
  const raiz = parse(cuerpo.replace(/<style[^>]*>[\s\S]*?<\/style>/g, ''), { comment: false, blockTextElements: { script: true, style: true, pre: true } });
  const { contenedor, nodos } = desenvolver(raiz);
  const body = convertir(nodos, slug);

  // FAQ: del schema de la pagina. Ya estan escritas en el cuerpo, asi que no se repiten.
  const schemas = [props.schema].flat().filter(Boolean);
  const faqPage = schemas.find((s) => s['@type'] === 'FAQPage');
  const otros = schemas.filter((s) => s['@type'] !== 'FAQPage');
  if (otros.length) aviso(slug, `schema extra que no se migra: ${otros.map((s) => s['@type']).join(', ')}`);
  const faqs = (faqPage?.mainEntity ?? []).map((q) => ({ _type: 'faq', _key: key(slug), q: q.name, a: q.acceptedAnswer?.text }));

  const estilos = [...(src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g))].map((m) => m[1]).join('\n');
  if (estilos.trim()) css.push(`/* ${slug} */\n${cssPrefijado(estilos, slug)}`);

  const fecha = props.date;
  const actualizado = props.dateModified || (entrada.lastmod !== fecha ? entrada.lastmod : undefined);
  docs.push({
    _id: `articulo-${slug}`,
    _type: 'articulo',
    title: props.title,
    ...(props.seoTitle ? { seoTitle: props.seoTitle } : {}),
    slug: { _type: 'slug', current: slug },
    cluster: entrada.cluster,
    category: props.category,
    ...(entrada.category !== props.category ? { cardCategory: entrada.category } : {}),
    publishedAt: fecha,
    ...(actualizado ? { updatedAt: actualizado } : {}),
    readTime: props.readTime,
    ...(entrada.readTime !== props.readTime ? { cardReadTime: entrada.readTime } : {}),
    description: props.description,
    ...(entrada.title !== props.title ? { cardTitle: entrada.title } : {}),
    cardDesc: entrada.desc,
    priority: entrada.priority,
    orden,
    mostrarFaqs: false,
    ...(contenedor ? { contenedor } : {}),
    noindex: Boolean(props.noindex),
    body,
    faqs,
  });
  const html = body.filter((b) => b._type === 'htmlBloque').length;
  resumen.push(`${slug.padEnd(48)} ${String(body.length).padStart(4)} bloques · ${String(html).padStart(2)} HTML · ${faqs.length} FAQ${contenedor ? ` · contenedor .${contenedor}` : ''}`);
  void resto;
}

mkdirSync(`${ROOT}scripts/migracion`, { recursive: true });
writeFileSync(`${ROOT}scripts/migracion/articulos.ndjson`, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
writeFileSync(
  `${ROOT}src/styles/blog-migrado.css`,
  `/* Estilos propios de los articulos migrados desde src/pages/blog/*.astro.\n   Lo genera scripts/migrar-blog-a-sanity.mjs: cada regla va bajo .post-<url>. */\n\n${css.join('\n\n')}\n`,
);
console.log(resumen.join('\n'));
console.log(`\n${docs.length} articulos -> scripts/migracion/articulos.ndjson`);
if (avisos.length) console.log(`\nAvisos:\n${avisos.join('\n')}`);
