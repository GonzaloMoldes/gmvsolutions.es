// Registro de /recursos/: solo contenido con archivo descargable (regla editorial
// de octubre de 2026; ver src/lib/blog.ts, «Blog y Recursos»).
//
// Dos origenes:
//   - Paginas escritas en codigo en src/pages/recursos/ (recursosCodigo).
//   - Articulos de Sanity con bloque de descarga: su URL sigue en /blog/<slug>/.
// Anadir un recurso en codigo = crear su pagina + su entrada aqui + su archivo en
// el catalogo de src/data/descargables.ts.
import { DESCARGABLES, type DescargableId } from '../data/descargables';
import { articulosSanityActivos, slugsRecurso } from './blog';

export interface Recurso {
  url: string;
  titulo: string;
  desc: string;
  /** Formato del archivo, para la etiqueta de la tarjeta. */
  formato: string;
  /** Fecha de publicacion ISO (YYYY-MM-DD): decide el aviso de contenido nuevo. */
  publicado: string;
}

const formatoDe = (archivo: string) =>
  archivo.endsWith('.xlsx') ? 'Excel' : archivo.endsWith('.docx') ? 'Word' : archivo.endsWith('.pdf') ? 'PDF' : 'Archivo';

const recursosCodigo: (Omit<Recurso, 'formato'> & { descargable: DescargableId })[] = [
  {
    url: '/recursos/matriz-de-polivalencia/',
    titulo: 'Matriz de polivalencia: plantilla Excel y generador online',
    desc: 'Operarios por puestos con niveles de 0 a 4. Marca los puestos que dependen de una sola persona. En Excel o directamente en el navegador.',
    publicado: '2026-10-21',
    descargable: 'plantilla-matriz-polivalencia',
  },
  {
    url: '/recursos/plantilla-gestion-documental-prl/',
    titulo: 'Plantilla de gestión documental de PRL e instrucciones de trabajo',
    desc: 'Excel para saber qué versión conoce cada trabajador, qué tiene pendiente y qué caduca. La matriz de pendientes se calcula sola.',
    publicado: '2026-10-17',
    descargable: 'plantilla-gestion-documental-prl',
  },
];

/** El id del catalogo que usa un articulo de Sanity (lo lleva su boton data-descarga). */
const idDescarga = (body: unknown[]): DescargableId | undefined => {
  const m = JSON.stringify(body).match(/data-descarga=\\?"([a-z0-9-]+)/);
  return m && m[1] in DESCARGABLES ? (m[1] as DescargableId) : undefined;
};

const recursosSanity: Recurso[] = articulosSanityActivos
  .filter((a) => slugsRecurso.has(a.slug))
  .map((a) => {
    const id = idDescarga(a.body ?? []);
    return {
      url: `/blog/${a.slug}/`,
      titulo: a.cardTitle || a.title,
      desc: a.cardDesc,
      formato: id ? formatoDe(DESCARGABLES[id].archivo) : 'Plantilla',
      publicado: a.publishedAt,
    };
  });

/** Todos los recursos, del mas reciente al mas antiguo. */
export const recursos: Recurso[] = [
  ...recursosCodigo.map(({ descargable, ...r }) => ({ ...r, formato: formatoDe(DESCARGABLES[descargable].archivo) })),
  ...recursosSanity,
].sort((a, b) => b.publicado.localeCompare(a.publicado));

/** Publicacion mas reciente de /recursos/, para el aviso de contenido nuevo. */
export const latestRecursoISO = recursos.map((r) => r.publicado).sort().at(-1)!;
