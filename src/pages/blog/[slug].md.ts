// Sirve cada post del blog como markdown limpio en /blog/<slug>.md.
// Los agentes de IA prefieren markdown a HTML (Roadmap IA 2026-06, Parte B2).
import type { APIRoute } from 'astro';
import { postToMarkdown } from '../../lib/htmlToMarkdown';
import { articulosSanityActivos } from '../../lib/blog';
import { portableToMarkdown } from '../../lib/portableToMarkdown';

// Fuente cruda de cada post (?raw devuelve el .astro como string en build).
const sources = import.meta.glob('./*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const slugOf = (path: string) => path.replace(/^\.\//, '').replace(/\.astro$/, '');

const posts = Object.fromEntries(
  Object.entries(sources)
    // index es el indice; [slug] es la ruta de los articulos de Sanity (van aparte).
    .filter(([path]) => !path.endsWith('index.astro') && !path.includes('['))
    .map(([path, raw]) => [slugOf(path), raw]),
);

// Articulos de Sanity: su markdown sale del Portable Text, no del .astro.
const articulos = articulosSanityActivos;
const sanityMd = Object.fromEntries(
  articulos
    .filter((a) => !a.noindex)
    .map((a) => [
      a.slug,
      // Misma cabecera que postToMarkdown (src/lib/htmlToMarkdown.ts).
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
    ]),
);

export function getStaticPaths() {
  return [...Object.keys(posts), ...Object.keys(sanityMd)].map((slug) => ({ params: { slug } }));
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const raw = posts[slug];
  const markdown = raw ? postToMarkdown(raw, slug).markdown : sanityMd[slug];
  if (!markdown) return new Response('No encontrado', { status: 404 });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=604800',
    },
  });
};
