// Portable Text (cuerpo de los articulos de Sanity) -> HTML -> markdown.
//
// Pasa por HTML a proposito: asi el .md de un articulo de Sanity sale del mismo
// conversor (htmlToMarkdown) que el de los articulos escritos en codigo, y un
// articulo migrado sirve el mismo markdown que servia antes.
import { toHTML, escapeHTML } from '@portabletext/to-html';
import { htmlToMarkdown } from './htmlToMarkdown';

type Nodo<T> = { value: T };

const tablaHtml = (t = '') => escapeHTML(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

export function portableToHtml(body: unknown[]): string {
  return toHTML(body as never, {
    components: {
      types: {
        destacado: ({ value }: Nodo<{ estilo?: string; contenido?: unknown[]; titulo?: string; texto?: string }>) =>
          `<div class="${value.estilo || 'highlight-box'}">${
            value.contenido?.length
              ? portableToHtml(value.contenido)
              : `<p>${value.titulo ? `<strong>${escapeHTML(value.titulo)}</strong> ` : ''}${escapeHTML(value.texto ?? '')}</p>`
          }</div>`,
        enlacesRelacionados: ({ value }: Nodo<{ etiqueta?: string; enlaces?: { kicker?: string; titulo: string; descripcion?: string; href: string }[] }>) =>
          `<div class="related-links"><div class="related-links-label">${escapeHTML(value.etiqueta ?? '')}</div><div class="related-links-grid">${(value.enlaces ?? [])
            .map((e) => `<a href="${escapeHTML(e.href)}" class="related-link-card"><div class="related-link-kicker">${escapeHTML(e.kicker ?? '')}</div><div class="related-link-title">${escapeHTML(e.titulo)}</div><div class="related-link-desc">${escapeHTML(e.descripcion ?? '')}</div></a>`)
            .join('')}</div></div>`,
        tabla: ({ value }: Nodo<{ caption?: string; clase?: string; cabecera?: string[]; filas?: { celdas?: string[] }[] }>) =>
          `<table${value.clase ? ` class="${value.clase}"` : ''}>${value.caption ? `<caption>${escapeHTML(value.caption)}</caption>` : ''}${
            value.cabecera?.length ? `<thead><tr>${value.cabecera.map((c) => `<th>${tablaHtml(c)}</th>`).join('')}</tr></thead>` : ''
          }<tbody>${(value.filas ?? []).map((f) => `<tr>${(f.celdas ?? []).map((c) => `<td>${tablaHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
        htmlBloque: ({ value }: Nodo<{ html: string }>) => value.html,
        ancla: () => '',
        separador: () => '<hr>',
        descarga: () => '',
        image: ({ value }: Nodo<{ alt?: string }>) => (value.alt ? `<p><em>[Imagen: ${escapeHTML(value.alt)}]</em></p>` : ''),
      },
      marks: {
        link: ({ children, value }: { children: string; value?: { href?: string } }) => `<a href="${escapeHTML(value?.href ?? '#')}">${children}</a>`,
      },
    },
  });
}

export function portableToMarkdown(body: unknown[]): string {
  return htmlToMarkdown(portableToHtml(body));
}
