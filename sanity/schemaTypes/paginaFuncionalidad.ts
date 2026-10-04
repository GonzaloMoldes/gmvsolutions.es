import { defineArrayMember, defineField, defineType } from 'sanity';
import { AYUDA_FORMATO, enlace, preguntas } from './comunes';

// Paginas de funcionalidad (/documentacion-procesos/, /seguridad/, /oee/...).
// Un documento por pagina, _id «pagina-<slug>», creado por
// scripts/sembrar-paginas-sanity.mjs: crear uno nuevo desde el panel no crea
// una pagina, por eso el panel no lo permite (ver sanity.config.ts).
//
// Aqui vive lo que todas comparten: SEO, portada, FAQ y llamada final. Las
// secciones intermedias (tarjetas, tablas, capturas) son distintas en cada
// pagina y siguen en el codigo. Respaldo: src/data/paginas/<slug>.json.

const titular = (sufijo: string) => [
  defineField({ name: 'titulo', title: `Título${sufijo}`, type: 'string', validation: (r) => r.required() }),
  defineField({ name: 'tituloDestacado', title: 'Título: parte destacada (en naranja)', type: 'string' }),
];

const botones = defineField({
  name: 'botones',
  title: 'Botones',
  description: 'El primero es el botón naranja. Si quitas uno, desaparece de la página.',
  type: 'array',
  of: [defineArrayMember({ type: 'object', name: 'boton', fields: enlace('x', 'x').fields, preview: { select: { title: 'texto', subtitle: 'url' } } })],
  validation: (r) => r.max(2),
});

export const paginaFuncionalidad = defineType({
  name: 'paginaFuncionalidad',
  title: 'Página de funcionalidad',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Portada', default: true },
    { name: 'faq', title: 'FAQ' },
    { name: 'ctaFinal', title: 'Llamada final' },
  ],
  fields: [
    defineField({
      name: 'ruta',
      title: 'Página',
      type: 'string',
      readOnly: true,
      description: 'La URL de la página que controla este documento.',
    }),
    defineField({
      name: 'seo', title: 'SEO', type: 'object', group: 'seo',
      fields: [
        defineField({ name: 'title', title: 'Título para Google', type: 'string', validation: (r) => r.required().max(70).warning('Más de 70 caracteres: Google lo cortará.') }),
        defineField({ name: 'description', title: 'Descripción para Google', type: 'text', rows: 3, validation: (r) => r.required().max(170).warning('Más de 170 caracteres: Google la cortará.') }),
      ],
    }),
    defineField({
      name: 'hero', title: 'Portada', type: 'object', group: 'hero',
      fields: [
        defineField({ name: 'antetitulo', title: 'Antetítulo', type: 'string' }),
        ...titular(' (H1)'),
        defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 5, description: AYUDA_FORMATO }),
        botones,
      ],
    }),
    defineField({ name: 'faq', title: 'FAQ', type: 'object', group: 'faq', fields: [preguntas()] }),
    defineField({
      name: 'ctaFinal', title: 'Llamada final', type: 'object', group: 'ctaFinal',
      fields: [
        defineField({ name: 'antetitulo', title: 'Antetítulo', type: 'string' }),
        ...titular(''),
        defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 3, description: AYUDA_FORMATO }),
        botones,
        defineField({ name: 'nota', title: 'Nota final', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'hero.titulo', ruta: 'ruta' },
    prepare: ({ title, ruta }) => ({ title: ruta, subtitle: title }),
  },
});
