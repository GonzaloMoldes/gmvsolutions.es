// Contenido editable de las paginas que viven en Sanity (fase 1: ajustes
// generales y home).
//
// Cada pagina tiene sus textos por defecto en src/data/*.default.json, que son
// tambien los que se subieron a Sanity la primera vez
// (scripts/sembrar-paginas-sanity.mjs). Lo publicado en Sanity se mezcla encima
// campo a campo: un campo vacio en el panel no deja un hueco en la web, y si
// Sanity no responde la pagina sale con los textos por defecto.
import { getDocumento } from './sanity';
import homeDefecto from '../data/home.default.json';
import ajustesDefecto from '../data/ajustes.default.json';
import preciosDefecto from '../data/precios.default.json';
import faqsDefecto from '../data/faqs.default.json';

export type Home = typeof homeDefecto;
export type Ajustes = typeof ajustesDefecto;
export type Precios = typeof preciosDefecto;
export type PaginaFaqs = typeof faqsDefecto;

// Las listas de preguntas son referencias a documentos «preguntaFrecuente»: se
// resuelven en la consulta para que lleguen como { q, a }, igual que en el JSON.
const PREGUNTAS = `[_type == "reference"]->{ "id": _id, q, a }`;

const vacio = (v: unknown) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

/** Mezcla `valor` sobre `defecto`: objetos campo a campo; listas y textos, enteros. */
export function mezclar<T>(defecto: T, valor: unknown): T {
  if (vacio(valor)) return defecto;
  if (Array.isArray(defecto)) {
    // Una referencia rota (pregunta borrada o sin publicar) llega como null.
    const lista = Array.isArray(valor) ? valor.filter((v) => v !== null && v !== undefined) : [];
    return (lista.length ? lista : defecto) as T;
  }
  if (defecto && typeof defecto === 'object') {
    if (typeof valor !== 'object' || Array.isArray(valor)) return defecto;
    const out: Record<string, unknown> = { ...(valor as Record<string, unknown>) };
    for (const [k, d] of Object.entries(defecto as Record<string, unknown>)) {
      out[k] = mezclar(d, (valor as Record<string, unknown>)[k]);
    }
    return out as T;
  }
  return valor as T;
}

export async function getHome(): Promise<Home> {
  return mezclar(homeDefecto, await getDocumento('home', `{ ..., faq{ ..., "items": items${PREGUNTAS} } }`));
}

export async function getPrecios(): Promise<Precios> {
  return mezclar(preciosDefecto, await getDocumento('precios', `{ ..., faq{ ..., "items": items${PREGUNTAS} } }`));
}

export async function getPaginaFaqs(): Promise<PaginaFaqs> {
  return mezclar(faqsDefecto, await getDocumento('paginaFaqs', `{ ..., categorias[]{ ..., "preguntas": preguntas${PREGUNTAS} } }`));
}

export async function getAjustes(): Promise<Ajustes> {
  return mezclar(ajustesDefecto, await getDocumento('ajustes'));
}

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Solo enlaces internos, de correo o https: nada de javascript: ni similares.
const urlSegura = (url: string) => /^(\/|#|https:\/\/|mailto:)/.test(url);

/**
 * Texto del panel a HTML seguro. Formato admitido: **negrita** y [texto](url).
 * Todo lo demas se escapa: lo que se escriba en el panel nunca se interpreta como HTML.
 */
export function conNegritas(texto: string): string {
  return escapar(texto)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, url) => (urlSegura(url) ? `<a href="${url}">${t}</a>` : t));
}

/** Como conNegritas, pero cada bloque separado por una linea en blanco es un <p>. */
export const parrafos = (texto: string) =>
  texto.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${conNegritas(p)}</p>`).join('');

/** Quita el formato para usos en texto plano (schema, meta). */
export const sinMarcas = (texto: string) =>
  texto.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1').replace(/\s*\n\s*\n\s*/g, ' ');

/** Etiqueta de medicion GA4 (data-cta-label) a partir del texto de un boton, sin la flecha final. */
export const etiquetaCta = (texto: string) => texto.replace(/\s*→\s*$/, '');
