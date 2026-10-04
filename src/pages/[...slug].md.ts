// Sirve CUALQUIER pagina del sitio como markdown limpio en /<ruta>.md.
// Los posts del blog ya tenian el suyo en blog/[slug].md.ts; esto cubre el resto
// (producto, casos de uso, para-quien, sectores, comparativas, legal), que era el
// hallazgo P8 de la auditoria: solo 19 de 68 paginas ofrecian version markdown.
//
// La home se sirve en /index.md, porque /.md no es una URL valida.
import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { postToMarkdown, renderedToMarkdown } from '../lib/htmlToMarkdown';

// Los componentes de pagina, para renderizarlos y convertir el HTML final (con
// los textos de Sanity ya puestos) en vez del codigo fuente.
const modules = import.meta.glob('./**/*.astro', { eager: true }) as Record<string, { default: any }>;

// Fuente cruda de cada pagina (?raw devuelve el .astro como string en build).
const sources = import.meta.glob('./**/*.astro', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const ROOT_SLUG = 'index';

function slugOf(path: string): string {
  const clean = path.replace(/^\.\//, '').replace(/\.astro$/, '');
  // index.astro -> "index"; blog/index.astro -> "blog"; resto tal cual.
  if (clean === 'index') return ROOT_SLUG;
  return clean.replace(/\/index$/, '');
}

const pages = Object.fromEntries(
  Object.entries(sources)
    // Los posts del blog los sirve blog/[slug].md.ts, que tiene su propia cabecera
    // con fecha y autor. Aqui solo entra el indice del blog (blog/index.astro).
    .filter(([path]) => !/^\.\/blog\/(?!index\.astro$)/.test(path))
    .map(([path, raw]) => [slugOf(path), { raw, path }]),
);

let container: Promise<AstroContainer> | null = null;

export function getStaticPaths() {
  return Object.keys(pages).map((slug) => ({ params: { slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug as string;
  const page = pages[slug];
  if (!page) return new Response('No encontrado', { status: 404 });

  let markdown: string;
  try {
    container ??= AstroContainer.create();
    const html = await (await container).renderToString(modules[page.path].default, { partial: false });
    markdown = renderedToMarkdown(html, slug);
  } catch (err) {
    // Si una pagina no se deja renderizar aqui, se vuelve al metodo anterior.
    console.warn(`[md] ${slug}: no se pudo renderizar (${(err as Error).message}); se usa el fuente`);
    markdown = postToMarkdown(page.raw, slug).markdown;
  }
  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=604800',
    },
  });
};
