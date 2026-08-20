// /llms.txt — resumen curado de REELEVO para agentes de IA.
//
// Antes era un fichero estatico en public/llms.txt cuya lista de articulos se
// mantenia a mano; en agosto de 2026 se habia quedado 8 articulos por detras.
// Ahora se sirve desde aqui: el texto curado sigue en src/content/llms-base.md
// y la parte que puede desincronizarse (el listado del blog) se genera desde
// src/lib/blog.ts. Ver src/lib/llms.ts.
import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '../lib/llms';

export const GET: APIRoute = () =>
  new Response(`${buildLlmsTxt()}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=604800',
    },
  });
