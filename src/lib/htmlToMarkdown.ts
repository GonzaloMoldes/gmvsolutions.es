// Conversor HTML -> Markdown para servir el contenido del blog en texto limpio
// (rutas /blog/<slug>.md y /llms-full.txt). Los agentes de IA prefieren markdown
// a HTML: sube "Agent Readiness". Sin dependencias externas; el HTML del blog usa
// un vocabulario acotado (h2-h4, p, ul/ol/li, strong/em/a, hr, table, blockquote).
// Trazabilidad: Roadmap IA 2026-06, Parte B2.

import { BASE_URL } from './seo';

// ── Utilidades de bajo nivel ───────────────────────────────────────────────

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

function decodeEntities(text: string): string {
  const named: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&rarr;': '→',
    '&larr;': '←',
    '&deg;': '°',
    '&euro;': '€',
    '&aacute;': 'á',
    '&eacute;': 'é',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
    '&ntilde;': 'ñ',
  };
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&[a-z]+;|&#39;/gi, (m) => named[m.toLowerCase()] ?? m);
}

// Convierte una URL relativa del sitio en absoluta; deja intactas las externas,
// mailto: y los anclajes (#...). Asi el markdown es util fuera de contexto.
function absolutize(href: string): string {
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  if (href.startsWith('/')) return `${BASE_URL}${href}`;
  return href;
}

// Inline: negrita, cursiva, codigo, enlaces y saltos. Se aplica al texto ya
// extraido de cada bloque. Idempotente sobre markdown ya generado.
function inline(text: string): string {
  return text
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
      const clean = stripTags(label).replace(/\s+/g, ' ').trim();
      return `[${clean}](${absolutize(href)})`;
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, c) => `**${stripTags(c).trim()}**`)
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, c) => `*${stripTags(c).trim()}*`)
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${stripTags(c).trim()}\``)
    .replace(/<br\b[^>]*\/?>/gi, '  \n');
}

// Texto de una celda de tabla: inline + sin tags + sin saltos + pipes escapados.
function cellText(html: string): string {
  return decodeEntities(stripTags(inline(html)))
    .replace(/\s+/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

function tableToMarkdown(table: string): string {
  const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((r) => r[1]);
  if (!rows.length) return '';

  const cellsOf = (row: string) =>
    [...row.matchAll(/<(th|td)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((c) => cellText(c[2]));

  const head = cellsOf(rows[0]);
  const cols = head.length || 1;
  const body = rows.slice(1).map(cellsOf);

  const line = (cells: string[]) => `| ${Array.from({ length: cols }, (_, i) => cells[i] ?? '').join(' | ')} |`;
  const sep = `| ${Array.from({ length: cols }, () => '---').join(' | ')} |`;

  return ['', line(head), sep, ...body.map(line), ''].join('\n');
}

function listItems(inner: string, type: 'ul' | 'ol'): string {
  const items = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => m[1]);
  return items
    .map((raw, i) => {
      const marker = type === 'ol' ? `${i + 1}.` : '-';
      const text = decodeEntities(stripTags(inline(raw))).replace(/\s*\n\s*/g, ' ').trim();
      return `${marker} ${text}`;
    })
    .join('\n');
}

// Elimina por completo un <div class="...cls..."> incluyendo divs anidados,
// contando profundidad (regex no equilibra tags). Para quitar bloques de pura
// navegacion (related-links) que ensucian el markdown.
function removeBlockByClass(html: string, cls: string): string {
  const openRe = new RegExp(`<div\\b[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'i');
  let result = html;
  let m: RegExpExecArray | null;
  while ((m = openRe.exec(result))) {
    const start = m.index;
    const tagRe = /<\/?div\b[^>]*>/gi;
    tagRe.lastIndex = start + m[0].length;
    let depth = 1;
    let end = result.length;
    let t: RegExpExecArray | null;
    while (depth > 0 && (t = tagRe.exec(result))) {
      depth += t[0].startsWith('</') ? -1 : 1;
      end = tagRe.lastIndex;
    }
    result = result.slice(0, start) + result.slice(end);
  }
  return result;
}

// ── Conversor principal ─────────────────────────────────────────────────────

export function htmlToMarkdown(html: string): string {
  // Normaliza CRLF -> LF; si no, los \r intercalados rompen el colapso de
  // lineas en blanco (\n{3,}) y el markdown queda con huecos enormes.
  let s = html.replace(/\r\n?/g, '\n');

  // 1. Fuera comentarios y bloques no textuales.
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<(style|script|svg|noscript)\b[\s\S]*?<\/\1>/gi, '');

  // 2. Fuera navegacion decorativa (tarjetas de enlaces relacionados).
  s = removeBlockByClass(s, 'related-links');

  // 3. Tablas -> markdown (antes que el resto, consumen su propio HTML).
  s = s.replace(/<table\b[\s\S]*?<\/table>/gi, (m) => tableToMarkdown(m));

  // 4. Encabezados.
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, lvl, txt) => `\n\n${'#'.repeat(Number(lvl))} ${inline(txt).replace(/\s+/g, ' ').trim()}\n\n`);

  // 5. Listas.
  s = s.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => `\n${listItems(inner, 'ul')}\n`);
  s = s.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => `\n${listItems(inner, 'ol')}\n`);

  // 6. Citas.
  s = s.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const body = decodeEntities(stripTags(inline(inner))).trim();
    return `\n${body.split('\n').map((l) => `> ${l.trim()}`).join('\n')}\n`;
  });

  // 7. Separadores y parrafos.
  s = s.replace(/<hr\b[^>]*\/?>/gi, '\n\n---\n\n');
  s = s.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, txt) => `\n\n${inline(txt).trim()}\n\n`);

  // 8. Desenvuelve contenedores restantes (conserva su texto).
  s = s.replace(/<\/?(div|section|article|header|footer|figure|figcaption|main|span|nav|aside)\b[^>]*>/gi, '\n');

  // 9. Inline suelto fuera de bloques + limpieza final.
  s = inline(s);
  s = s.replace(/<[^>]+>/g, '');
  s = decodeEntities(s);
  s = s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  return s;
}

// ── Extraccion desde el .astro fuente ───────────────────────────────────────

// Lee `const <name> = "..."` (o comillas simples / backticks) del frontmatter.
function extractConst(raw: string, name: string): string | undefined {
  const m = raw.match(new RegExp(`const\\s+${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\`([^\`]*)\`)`));
  return m ? (m[1] ?? m[2] ?? m[3]) : undefined;
}

function extractDate(raw: string): string | undefined {
  return extractConst(raw, 'date') ?? raw.match(/"datePublished"\s*:\s*"([^"]+)"/)?.[1];
}

// Contenido entre el layout (ArticleLayout / BaseLayout) y su cierre.
function extractBody(raw: string): string {
  let template = raw;
  if (template.startsWith('---')) {
    const end = template.indexOf('\n---', 3);
    if (end !== -1) template = template.slice(template.indexOf('\n', end + 1) + 1);
  }
  const open = template.match(/<(ArticleLayout|BaseLayout)\b[\s\S]*?>/);
  if (!open) return template;
  const close = template.lastIndexOf(`</${open[1]}>`);
  return template.slice(open.index! + open[0].length, close === -1 ? undefined : close);
}

export interface PostMarkdown {
  title: string;
  description: string;
  date: string;
  canonical: string;
  markdown: string;
}

// Convierte un .astro de blog en markdown con cabecera (titulo, resumen, meta).
export function postToMarkdown(raw: string, slug: string): PostMarkdown {
  const title = extractConst(raw, 'title') ?? slug;
  const description = extractConst(raw, 'description') ?? '';
  const canonical = (extractConst(raw, 'canonical') ?? `${BASE_URL}/blog/${slug}/`).replace(/\/$/, '');
  const date = extractDate(raw) ?? '';

  const header =
    `# ${title}\n\n` +
    (description ? `> ${description}\n\n` : '') +
    `**URL:** ${canonical}\n` +
    (date ? `**Publicado:** ${date}\n` : '') +
    `**Autor:** Gonzalo Moldes — Fundador de REELEVO\n\n---\n\n`;

  return {
    title,
    description,
    date,
    canonical,
    markdown: `${header}${htmlToMarkdown(extractBody(raw))}\n`,
  };
}
