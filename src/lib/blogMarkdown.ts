// Markdown de cada articulo del blog, para /blog/<slug>.md y /llms-full.txt.
// Los agentes de IA prefieren markdown a HTML (Roadmap IA 2026-06, Parte B2).
//
// Junta las dos fuentes: los .astro escritos en codigo (se convierten desde su
// HTML) y los articulos de Sanity (desde su Portable Text), con la misma cabecera.
import { postToMarkdown } from './htmlToMarkdown';
import { articulosSanityActivos } from './blog';
import { portableToMarkdown } from './portableToMarkdown';

export interface MarkdownArticulo {
  slug: string;
  /** Fecha de publicacion ISO, para ordenar. */
  date: string;
  markdown: string;
}

// Fuente cruda de cada post (?raw devuelve el .astro como string en build).
const sources = import.meta.glob('../pages/blog/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const slugOf = (path: string) => path.replace(/^.*\/blog\//, '').replace(/\.astro$/, '');

const deCodigo: MarkdownArticulo[] = Object.entries(sources)
  // index es el indice; [slug] es la ruta de los articulos de Sanity (van aparte).
  .filter(([path]) => !path.endsWith('index.astro') && !path.includes('['))
  .map(([path, raw]) => {
    const slug = slugOf(path);
    const { date, markdown } = postToMarkdown(raw, slug);
    return { slug, date, markdown };
  });

const deSanity: MarkdownArticulo[] = articulosSanityActivos
  .filter((a) => !a.noindex)
  .map((a) => ({
    slug: a.slug,
    date: a.publishedAt,
    // Misma cabecera que postToMarkdown (src/lib/htmlToMarkdown.ts).
    markdown:
      `# ${a.title}\n\n` +
      (a.description ? `> ${a.description}\n\n` : '') +
      `**URL:** https://www.gmvsolutions.es/blog/${a.slug}\n` +
      `**Publicado:** ${a.publishedAt}\n` +
      `**Autor:** Gonzalo Moldes — Fundador de REELEVO\n\n---\n\n` +
      portableToMarkdown(a.body) +
      (a.faqs?.length && a.mostrarFaqs !== false
        ? `\n\n## Preguntas frecuentes\n\n${a.faqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}`
        : '') +
      '\n',
  }));

/** Todos los articulos con markdown, del mas reciente al mas antiguo (empate: por URL). */
export const markdownArticulos: MarkdownArticulo[] = [...deCodigo, ...deSanity].sort(
  (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
);
