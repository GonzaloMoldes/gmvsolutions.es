import { getArticulos } from './sanity';
// Registro unico de los articulos del blog. Es la FUENTE DE VERDAD para:
//   - /blog/        indice por cluster (src/pages/blog/index.astro)
//   - /sitemap.xml  entradas del blog (src/pages/sitemap.xml.ts)
//   - /llms.txt     listado para agentes de IA (src/pages/llms.txt.ts)
//
// Antes cada uno mantenia su propia lista y se desincronizaban en silencio: en
// agosto de 2026, /llms.txt escondia 8 articulos publicados a los sistemas de IA.
// Ahora hay una sola lista y la comprobacion del final del fichero rompe el build
// si un .astro del blog no esta registrado (o si hay una entrada sin fichero).
//
// Los articulos se crean en Sanity (panel /admin/) y se suman solos a esta lista.
// Uno escrito en codigo = crear su .astro + anadir su entrada en postsCodigo.

/** Fecha de la revision SEO/GEO del blog (auditoria 2026-07-27). */
export const REVISION = '2026-07-27';

/** Descripcion del blog principal, usada en /llms.txt. */
export const BASE_BLOG_LABEL =
  'Guias practicas sobre documentacion operativa, SOP, onboarding de operarios y continuidad en planta para pymes industriales';

export type ClusterKey =
  | 'sop'
  | 'onboarding'
  | 'conocimiento'
  | 'absentismo'
  | 'trazabilidad'
  | 'lean'
  | 'digitalizacion'
  | 'medicion';

export interface BlogPost {
  /** Nombre del fichero en src/pages/blog/ sin extension. Define la URL. */
  slug: string;
  cluster: ClusterKey;
  /** Etiqueta de la tarjeta del indice. Puede diferir del `category` del articulo. */
  category: string;
  /** Titulo de tarjeta. Es una version corta del <title> real en varios articulos. */
  title: string;
  /** Resumen de tarjeta y descripcion en /llms.txt. */
  desc: string;
  /** Fecha ya formateada para la tarjeta del indice. */
  dateLabel: string;
  readTime: string;
  /** lastmod del sitemap: REVISION si se reviso en la auditoria, o su fecha real. */
  lastmod: string;
  /** priority del sitemap. */
  priority: string;
  /** 'sanity' si el articulo viene del gestor de contenidos (ruta blog/[slug].astro). */
  origen?: 'codigo' | 'sanity';
}

export interface Cluster {
  key: ClusterKey;
  label: string;
}

export const clusters: Cluster[] = [
  { key: 'sop', label: 'SOP y documentación de procesos' },
  { key: 'onboarding', label: 'Onboarding de operarios' },
  { key: 'conocimiento', label: 'Competencias y conocimiento' },
  { key: 'absentismo', label: 'Absentismo y continuidad' },
  { key: 'trazabilidad', label: 'Trazabilidad y calidad' },
  { key: 'lean', label: 'Lean Manufacturing y mejora continua' },
  { key: 'digitalizacion', label: 'Digitalización de la producción' },
  { key: 'medicion', label: 'Medición y control de producción' },
];

/**
 * Articulos escritos en codigo (src/pages/blog/*.astro). Vacio desde que los 33
 * originales se migraron a Sanity (octubre de 2026): los articulos nuevos se
 * crean en el panel /admin/. Si alguna vez se escribe uno en codigo, su .astro
 * necesita su entrada aqui (lo comprueba la guardia del final del fichero).
 */
const postsCodigo: BlogPost[] = [];

// --- Articulos de Sanity --------------------------------------------------------
// Se suman a los de codigo en build. Los marcados como borrador (noindex) tienen
// pagina pero no entran en el indice, el sitemap ni /llms.txt.
const MESES_CORTOS = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'];
const etiquetaFecha = (iso: string): string => {
  const [anio, mes, dia] = iso.split('-');
  return `${parseInt(dia, 10)} ${MESES_CORTOS[parseInt(mes, 10) - 1]} ${anio}`;
};

const articulosSanity = await getArticulos();
const slugsCodigo = new Set(postsCodigo.map((p) => p.slug));
// Transicion de la migracion: mientras un articulo exista a la vez en codigo y
// en Sanity, gana el de codigo (su .astro sigue generando la pagina) y se avisa.
// Al borrar el .astro, la version de Sanity pasa a servirse sola.
const duplicados = new Set(articulosSanity.filter((a) => slugsCodigo.has(a.slug)).map((a) => a.slug));
if (duplicados.size) {
  console.warn(`[blog] ${duplicados.size} articulos estan en codigo y en Sanity; se usa la version de codigo: ${[...duplicados].join(', ')}`);
}
/** Articulos de Sanity que generan pagina propia (sin los que aun estan en codigo). */
export const articulosSanityActivos = articulosSanity.filter((a) => !duplicados.has(a.slug));

// Orden editorial: primero los que tienen «orden» (los migrados conservan el de
// este registro), despues el resto por fecha de publicacion, como cuando se
// anadian al final de la lista.
const postsSanity: BlogPost[] = [...articulosSanityActivos]
  .sort((a, b) =>
    a.orden != null && b.orden != null ? a.orden - b.orden
      : a.orden != null ? -1
      : b.orden != null ? 1
      : a.publishedAt.localeCompare(b.publishedAt),
  )
  .filter((a) => !a.noindex)
  .map((a) => ({
    slug: a.slug,
    cluster: a.cluster as ClusterKey,
    category: a.cardCategory || a.category,
    title: a.cardTitle || a.title,
    desc: a.cardDesc,
    dateLabel: etiquetaFecha(a.publishedAt),
    readTime: a.cardReadTime || a.readTime || '8 min.',
    lastmod: a.updatedAt || a.publishedAt,
    priority: a.priority || '0.8',
    origen: 'sanity' as const,
  }));

/** Todos los articulos publicados: los de codigo y los de Sanity. */
export const posts: BlogPost[] = [...postsCodigo, ...postsSanity];

/** URL absoluta canonica de un articulo. */
export const postUrl = (p: BlogPost) => `/blog/${p.slug}/`;

// --- Contenido nuevo ---------------------------------------------------------
/** Dias durante los que un articulo recien publicado se marca como nuevo. */
export const NEW_POST_DAYS = 7;

const MESES: Record<string, string> = {
  'ene.': '01', 'feb.': '02', 'mar.': '03', 'abr.': '04', 'may.': '05', 'jun.': '06',
  'jul.': '07', 'ago.': '08', 'sept.': '09', 'oct.': '10', 'nov.': '11', 'dic.': '12',
};

/** Fecha de publicacion ISO (YYYY-MM-DD), derivada de `dateLabel` ("30 sept. 2026"). */
export const publishedISO = (p: BlogPost): string => {
  const [dia, mes, anio] = p.dateLabel.split(' ');
  const mm = MESES[mes];
  if (!mm || !/^\d{1,2}$/.test(dia) || !/^\d{4}$/.test(anio)) {
    throw new Error(`[blog] dateLabel no reconocido en ${p.slug}: "${p.dateLabel}"`);
  }
  return `${anio}-${mm}-${dia.padStart(2, '0')}`;
};

/** Publicacion mas reciente del blog, para el aviso de contenido nuevo del menu. */
export const latestPublishedISO = posts.map(publishedISO).sort().at(-1)!;

// --- Guardia anti-deriva -----------------------------------------------------
// Se ejecuta en build. Compara el registro con los ficheros reales del directorio
// del blog y falla si no coinciden, en cualquiera de los dos sentidos.
const archivos = import.meta.glob('../pages/blog/*.astro');

const slugsEnDisco = new Set(
  Object.keys(archivos)
    .map((ruta) => ruta.replace(/^.*\/blog\//, '').replace(/\.astro$/, ''))
    .filter((slug) => slug !== 'index' && !slug.startsWith('[')),
);
const slugsRegistrados = new Set(postsCodigo.map((p) => p.slug));

const sinRegistrar = [...slugsEnDisco].filter((s) => !slugsRegistrados.has(s));
const sinFichero = [...slugsRegistrados].filter((s) => !slugsEnDisco.has(s));

if (sinRegistrar.length || sinFichero.length) {
  const partes = [
    sinRegistrar.length
      ? `articulos sin entrada en src/lib/blog.ts: ${sinRegistrar.join(', ')}`
      : '',
    sinFichero.length
      ? `entradas sin fichero .astro: ${sinFichero.join(', ')}`
      : '',
  ].filter(Boolean);
  throw new Error(`[blog] El registro y src/pages/blog/ no coinciden. ${partes.join(' | ')}`);
}
