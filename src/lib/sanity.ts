// Lectura de contenidos de Sanity en build.
//
// Sin PUBLIC_SANITY_PROJECT_ID todo devuelve listas vacias: el sitio compila
// igual que antes. Con el, los articulos publicados en Sanity se suman al blog
// (src/lib/blog.ts los mezcla con los escritos en codigo).
//
// No se usa el modulo virtual «sanity:client» de @sanity/astro a proposito: solo
// existe cuando la integracion esta activa, y este fichero se importa siempre.
import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || 'production';

export const sanityEnabled = Boolean(projectId);

const client: SanityClient | null = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false })
  : null;

const builder = client ? createImageUrlBuilder(client) : null;

/** URL de una imagen de Sanity, recortada y en formato automatico (WebP/AVIF). */
export function urlImagen(source: unknown, ancho = 1200): string | undefined {
  if (!builder || !source) return undefined;
  return builder.image(source as never).width(ancho).auto('format').fit('max').url();
}

export interface ArticuloSanity {
  _id: string;
  title: string;
  seoTitle?: string;
  slug: string;
  cluster: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readTime?: string;
  description: string;
  cardTitle?: string;
  cardDesc: string;
  noindex?: boolean;
  mainImage?: { asset?: unknown; alt?: string };
  body: unknown[];
  faqs?: { q: string; a: string }[];
}

const CAMPOS = `{
  _id, title, seoTitle, "slug": slug.current, cluster, category, publishedAt,
  updatedAt, readTime, description, cardTitle, cardDesc, noindex, mainImage,
  body, faqs[]{ q, a }
}`;

let cache: Promise<ArticuloSanity[]> | null = null;

/**
 * Articulos publicados en Sanity (sin borradores del editor), del mas reciente
 * al mas antiguo. Una sola peticion por build: el resultado se reutiliza.
 */
export function getArticulos(): Promise<ArticuloSanity[]> {
  if (!client) return Promise.resolve([]);
  cache ??= client
    .fetch<ArticuloSanity[]>(
      `*[_type == "articulo" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) ${CAMPOS}`,
    )
    .then((lista) => lista.filter((a) => a.title && a.slug && a.publishedAt && a.cluster))
    // Si Sanity no responde (ID mal copiado, red, caida) el sitio se publica
    // igual, sin los articulos de Sanity, en vez de romper el build: un build
    // roto deja servido el despliegue anterior y el panel /admin/ no aparece.
    .catch((err: Error) => {
      console.warn(`\n[sanity] AVISO: no se pudieron leer los articulos (proyecto ${projectId}, dataset ${dataset}): ${err.message}\n[sanity] El sitio se construye SIN los articulos de Sanity.\n`);
      return [];
    });
  return cache;
}
