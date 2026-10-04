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

// Mismo valor por defecto que astro.config.mjs (el Project ID es publico).
const projectId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined) || '1rbyt934';
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
  cardCategory?: string;
  cardReadTime?: string;
  priority?: string;
  orden?: number;
  mostrarFaqs?: boolean;
  contenedor?: string;
  noindex?: boolean;
  mainImage?: { asset?: unknown; alt?: string };
  body: unknown[];
  faqs?: { q: string; a: string }[];
}

const CAMPOS = `{
  _id, title, seoTitle, "slug": slug.current, cluster, category, publishedAt,
  updatedAt, readTime, description, cardTitle, cardDesc, cardCategory, cardReadTime, priority,
  orden, mostrarFaqs, contenedor, noindex, mainImage,
  body, faqs[]{ q, a }
}`;

let cache: Promise<ArticuloSanity[]> | null = null;

/**
 * Articulos publicados en Sanity (sin borradores del editor), del mas reciente
 * al mas antiguo. Una sola peticion por build: el resultado se reutiliza.
 */
export function getArticulos(): Promise<ArticuloSanity[]> {
  // Modo fixture: lee los articulos de un .ndjson local en vez de Sanity. Sirve
  // para revisar la migracion o trabajar sin red (SANITY_FIXTURE=ruta.ndjson).
  const fixture = import.meta.env.SANITY_FIXTURE as string | undefined;
  if (fixture) {
    cache ??= import('node:fs/promises')
      .then((fs) => fs.readFile(fixture, 'utf8'))
      .then((txt) =>
        txt.split('\n').filter(Boolean).map((l) => {
          const d = JSON.parse(l);
          return { ...d, slug: d.slug?.current ?? d.slug } as ArticuloSanity;
        }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
      );
    return cache;
  }
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

const cacheDocs = new Map<string, Promise<Record<string, unknown> | null>>();

/**
 * Documento unico publicado (home, ajustes...) por su _id, o null si no existe,
 * con una proyeccion GROQ opcional (p. ej. para resolver referencias),
 * si Sanity no responde o en modo fixture. Igual que con los articulos, un
 * fallo nunca rompe el build: quien llama cae a sus valores por defecto.
 */
export function getDocumento(id: string, proyeccion = ''): Promise<Record<string, unknown> | null> {
  if (!client || import.meta.env.SANITY_FIXTURE) return Promise.resolve(null);
  let p = cacheDocs.get(id);
  if (!p) {
    p = client
      .fetch<Record<string, unknown> | null>(`*[_id == $id][0]${proyeccion}`, { id })
      .catch((err: Error) => {
        console.warn(`\n[sanity] AVISO: no se pudo leer «${id}»: ${err.message}\n[sanity] Se usan los textos por defecto del codigo.\n`);
        return null;
      });
    cacheDocs.set(id, p);
  }
  return p;
}
