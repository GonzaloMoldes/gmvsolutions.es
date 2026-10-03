import { defineArrayMember, defineField, defineType } from 'sanity';

// Articulo del blog gestionado desde Sanity. Convive con los articulos escritos
// en codigo (src/pages/blog/*.astro): los dos acaban en el mismo indice, sitemap
// y /llms.txt a traves de src/lib/blog.ts.
//
// Los campos imitan las props de ArticleLayout y las entradas de src/lib/blog.ts,
// para que un articulo de Sanity salga con el mismo SEO que uno de codigo.

export const CLUSTERS = [
  { title: 'SOP y documentación de procesos', value: 'sop' },
  { title: 'Onboarding de operarios', value: 'onboarding' },
  { title: 'Competencias y conocimiento', value: 'conocimiento' },
  { title: 'Absentismo y continuidad', value: 'absentismo' },
  { title: 'Trazabilidad y calidad', value: 'trazabilidad' },
  { title: 'Lean Manufacturing y mejora continua', value: 'lean' },
  { title: 'Digitalización de planta', value: 'digitalizacion' },
  { title: 'Medición y KPIs', value: 'medicion' },
];

export const articulo = defineType({
  name: 'articulo',
  title: 'Artículo del blog',
  type: 'document',
  groups: [
    { name: 'contenido', title: 'Contenido', default: true },
    { name: 'seo', title: 'SEO y tarjeta' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título (H1)',
      type: 'string',
      group: 'contenido',
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      description: 'Queda en /blog/<url>/. No la cambies una vez publicado: se pierde el posicionamiento.',
      type: 'slug',
      group: 'contenido',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cluster',
      title: 'Tema (cluster)',
      type: 'string',
      group: 'contenido',
      options: { list: CLUSTERS, layout: 'dropdown' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría visible',
      description: 'La etiqueta que se ve sobre el título. Ej.: «Documentación de procesos».',
      type: 'string',
      group: 'contenido',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'date',
      group: 'contenido',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Fecha de última revisión',
      description: 'Rellénala cuando cambies el contenido de verdad. Va al sitemap y al schema.',
      type: 'date',
      group: 'contenido',
    }),
    defineField({
      name: 'readTime',
      title: 'Tiempo de lectura',
      type: 'string',
      group: 'contenido',
      initialValue: '8 min.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen destacada',
      type: 'image',
      group: 'contenido',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string', validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Cuerpo',
      type: 'array',
      group: 'contenido',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título H2', value: 'h2' },
            { title: 'Título H3', value: 'h3' },
            { title: 'Cita', value: 'blockquote' },
          ],
          lists: [
            { title: 'Viñetas', value: 'bullet' },
            { title: 'Numerada', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texto alternativo', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'caption', title: 'Pie de foto', type: 'string' }),
          ],
        }),
        defineArrayMember({
          name: 'destacado',
          title: 'Caja destacada',
          type: 'object',
          fields: [
            defineField({ name: 'titulo', title: 'Título', type: 'string' }),
            defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'titulo', subtitle: 'texto' } },
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'faqs',
      title: 'Preguntas frecuentes',
      description: 'Se muestran al final y generan el schema FAQPage. 40-60 palabras por respuesta.',
      type: 'array',
      group: 'contenido',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          fields: [
            defineField({ name: 'q', title: 'Pregunta', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'a', title: 'Respuesta', type: 'text', rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'q', subtitle: 'a' } },
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título para buscadores',
      description: '50-60 caracteres. Si se deja vacío se usa el título.',
      type: 'string',
      group: 'seo',
      validation: (r) => r.max(65).warning('Más de 65 caracteres: Google lo cortará.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta descripción',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (r) => r.required().max(170).warning('Mejor por debajo de 160 caracteres.'),
    }),
    defineField({
      name: 'cardTitle',
      title: 'Título corto para la tarjeta del índice',
      description: 'Opcional. Si se deja vacío se usa el título.',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'cardDesc',
      title: 'Resumen de la tarjeta (y de /llms.txt)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'noindex',
      title: 'Borrador (no indexar)',
      description: 'Publica la página pero pide a Google que no la indexe y la deja fuera del sitemap.',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: 'Más recientes', name: 'fechaDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', date: 'publishedAt', media: 'mainImage', noindex: 'noindex' },
    prepare: ({ title, date, media, noindex }) => ({
      title,
      subtitle: `${date ?? 'sin fecha'}${noindex ? ' · borrador' : ''}`,
      media,
    }),
  },
});
