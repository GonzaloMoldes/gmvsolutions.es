// Sirve cada post del blog como markdown limpio en /blog/<slug>.md.
// Los agentes de IA prefieren markdown a HTML (Roadmap IA 2026-06, Parte B2).
import type { APIRoute } from 'astro';
import { postToMarkdown } from '../../lib/htmlToMarkdown';

// Fuente cruda de cada post (?raw devuelve el .astro como string en build).
const sources = import.meta.glob('./*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const slugOf = (path: string) => path.replace(/^\.\//, '').replace(/\.astro$/, '');

const posts = Object.fromEntries(
  Object.entries(sources)
    .filter(([path]) => !path.endsWith('index.astro'))
    .map(([path, raw]) => [slugOf(path), raw]),
);

export function getStaticPaths() {
  return Object.keys(posts).map((slug) => ({ params: { slug } }));
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const raw = posts[slug];
  if (!raw) return new Response('No encontrado', { status: 404 });

  const { markdown } = postToMarkdown(raw, slug);
  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=604800',
    },
  });
};
