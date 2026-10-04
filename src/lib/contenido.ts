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

export type Home = typeof homeDefecto;
export type Ajustes = typeof ajustesDefecto;

const vacio = (v: unknown) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

/** Mezcla `valor` sobre `defecto`: objetos campo a campo; listas y textos, enteros. */
export function mezclar<T>(defecto: T, valor: unknown): T {
  if (vacio(valor)) return defecto;
  if (Array.isArray(defecto)) return (Array.isArray(valor) ? valor : defecto) as T;
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
  return mezclar(homeDefecto, await getDocumento('home'));
}

export async function getAjustes(): Promise<Ajustes> {
  return mezclar(ajustesDefecto, await getDocumento('ajustes'));
}

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Texto plano del panel a HTML seguro, con **negrita** como unico formato. */
export function conNegritas(texto: string): string {
  return escapar(texto).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** Quita los ** para usos en texto plano (schema, meta). */
export const sinMarcas = (texto: string) => texto.replace(/\*\*/g, '');

/** Etiqueta de medicion GA4 (data-cta-label) a partir del texto de un boton, sin la flecha final. */
export const etiquetaCta = (texto: string) => texto.replace(/\s*→\s*$/, '');
