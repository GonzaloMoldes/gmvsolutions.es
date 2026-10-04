// Sirve cada post del blog como markdown limpio en /blog/<slug>.md.
// Los agentes de IA prefieren markdown a HTML (Roadmap IA 2026-06, Parte B2).
import type { APIRoute } from 'astro';
import { markdownArticulos } from '../../lib/blogMarkdown';

export function getStaticPaths() {
  return markdownArticulos.map(({ slug, markdown }) => ({ params: { slug }, props: { markdown } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(props.markdown as string, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=604800',
    },
  });
