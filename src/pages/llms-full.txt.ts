// /llms-full.txt — volcado de una sola peticion para agentes de IA:
// el resumen curado de REELEVO (llms.txt) + el contenido completo del blog en
// markdown. Convencion emergente "llms-full" (Roadmap IA 2026-06, Parte B2).
import type { APIRoute } from 'astro';
import { postToMarkdown, type PostMarkdown } from '../lib/htmlToMarkdown';
import { buildLlmsTxt } from '../lib/llms';

// Resumen de producto/empresa ya curado: reutilizamos el mismo /llms.txt como
// intro en lugar de duplicar la informacion. Antes se leia public/llms.txt del
// disco; ahora /llms.txt tambien se genera, asi que compartimos el constructor
// y los dos ficheros no pueden divergir.

const sources = import.meta.glob('./blog/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const slugOf = (path: string) => path.replace(/^\.\/blog\//, '').replace(/\.astro$/, '');

const posts: PostMarkdown[] = Object.entries(sources)
  .filter(([path]) => !path.endsWith('index.astro'))
  .map(([path, raw]) => postToMarkdown(raw, slugOf(path)))
  .sort((a, b) => (a.date < b.date ? 1 : -1)); // mas reciente primero

export const GET: APIRoute = () => {
  const intro =
    '# REELEVO — Volcado completo para agentes de IA (llms-full)\n\n' +
    '> Este documento reune, en una sola peticion, el resumen de REELEVO y el ' +
    'contenido completo del blog en markdown. Para el resumen breve: /llms.txt — ' +
    'Cada articulo tambien esta disponible individualmente en /blog/<slug>.md\n\n' +
    '---\n\n';

  const blog =
    '\n\n---\n\n# Blog — contenido completo\n\n' +
    `${posts.length} guias practicas sobre documentacion operativa, SOPs, onboarding ` +
    'y continuidad en planta para pymes industriales.\n\n' +
    posts.map((p) => p.markdown).join('\n\n---\n\n');

  const body = `${intro}${buildLlmsTxt()}${blog}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=604800',
    },
  });
};
