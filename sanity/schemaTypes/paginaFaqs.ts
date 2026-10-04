import { defineArrayMember, defineField, defineType } from 'sanity';
import { enlace, preguntas } from './comunes';

// Pagina /faqs/. Documento unico, _id «paginaFaqs» (ver sanity.config.ts).
// Las preguntas se eligen de «Preguntas frecuentes» y se agrupan en categorias.
// Respaldo: src/data/faqs.default.json.
export const paginaFaqs = defineType({
  name: 'paginaFaqs',
  title: 'Página de preguntas frecuentes',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'contenido', title: 'Contenido', default: true },
    { name: 'cta', title: 'Llamadas a la acción' },
  ],
  fields: [
    defineField({
      name: 'seo', title: 'SEO', type: 'object', group: 'seo',
      fields: [
        defineField({ name: 'title', title: 'Título para Google', type: 'string', validation: (r) => r.required().max(70).warning('Más de 70 caracteres: Google lo cortará.') }),
        defineField({ name: 'description', title: 'Descripción para Google', type: 'text', rows: 3, validation: (r) => r.required().max(170).warning('Más de 170 caracteres: Google la cortará.') }),
      ],
    }),
    defineField({
      name: 'hero', title: 'Portada', type: 'object', group: 'contenido',
      fields: [
        defineField({ name: 'antetitulo', title: 'Antetítulo', type: 'string' }),
        defineField({ name: 'titulo', title: 'Título (H1)', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'categorias',
      title: 'Categorías',
      type: 'array',
      group: 'contenido',
      of: [defineArrayMember({
        type: 'object',
        name: 'categoria',
        fields: [
          defineField({ name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
          preguntas('preguntas'),
        ],
        preview: { select: { title: 'nombre', n: 'preguntas' }, prepare: ({ title, n }) => ({ title, subtitle: `${(n as unknown[] | undefined)?.length ?? 0} preguntas` }) },
      })],
    }),
    defineField({
      name: 'ctaIntermedio', title: 'Llamada intermedia', type: 'object', group: 'cta',
      fields: [
        defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 3 }),
        enlace('cta', 'Botón'),
        defineField({ name: 'nota', title: 'Nota bajo el botón', type: 'string' }),
      ],
    }),
    defineField({
      name: 'ctaFinal', title: 'Llamada final', type: 'object', group: 'cta',
      fields: [
        defineField({ name: 'antetitulo', title: 'Antetítulo', type: 'string' }),
        defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 3 }),
        enlace('ctaPrincipal', 'Botón principal'),
        enlace('ctaSecundario', 'Botón secundario'),
        defineField({ name: 'nota', title: 'Nota final', type: 'string' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Página de preguntas frecuentes' }) },
});
