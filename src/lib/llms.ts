// Construccion del /llms.txt publicado.
//
// El texto curado (producto, precios, comparativas, USP...) vive en
// src/content/llms-base.md y se edita a mano. Este modulo solo sustituye dos
// marcadores por contenido generado desde el registro del blog:
//
//   <!--BLOG-->     listado completo de articulos, agrupado por cluster
//   <!--UPDATED-->  fecha del articulo mas reciente
//
// Motivo: hasta agosto de 2026 la lista del blog se mantenia a mano dentro de
// public/llms.txt y se quedo 8 articulos por detras, ocultandolos a los sistemas
// de IA que leen este fichero. Generandola, esa deriva ya no puede ocurrir.
import base from '../content/llms-base.md?raw';
import { posts, clusters, BASE_BLOG_LABEL } from './blog';

const BASE_URL = 'https://www.gmvsolutions.es';

/** Listado de articulos por cluster, en formato de enlace de llms.txt. */
function blogSection(): string {
  const lineas: string[] = [
    '### Blog',
    `- [Blog principal](${BASE_URL}/blog/) — ${BASE_BLOG_LABEL}`,
    '',
  ];

  for (const c of clusters) {
    const delCluster = posts.filter((p) => p.cluster === c.key);
    if (!delCluster.length) continue;
    lineas.push(`#### ${c.label}`);
    for (const p of delCluster) {
      lineas.push(`- [${p.title}](${BASE_URL}/blog/${p.slug}/) — ${p.desc}`);
    }
    lineas.push('');
  }

  return lineas.join('\n').trimEnd();
}

/** Fecha ISO del articulo mas reciente, para la cabecera del documento. */
function ultimaActualizacion(): string {
  return posts.map((p) => p.lastmod).sort().at(-1) ?? '';
}

export function buildLlmsTxt(): string {
  return base
    .replace('<!--BLOG-->', blogSection())
    .replace('<!--UPDATED-->', ultimaActualizacion())
    .trim();
}
