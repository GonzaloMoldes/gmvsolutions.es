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

// Texto enriquecido: el mismo para el cuerpo y para las cajas destacadas.
const bloqueTexto = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Título H2', value: 'h2' },
    { title: 'Título H3', value: 'h3' },
    { title: 'Título H4', value: 'h4' },
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
      { title: 'Código', value: 'code' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Enlace',
        fields: [
          defineField({
            name: 'href',
            type: 'string',
            title: 'URL',
            description: 'Interna (/precios/, #faq) o externa (https://...).',
            validation: (r) => r.required(),
          }),
          defineField({
            name: 'clase',
            title: 'Aspecto',
            type: 'string',
            options: { list: [{ title: 'Botón naranja', value: 'btn-primary' }] },
          }),
          defineField({
            name: 'cta',
            title: 'Medición (llamada a la acción)',
            description: 'Rellénalo en enlaces de registro o demo para medirlos en GA4 (evento cta_click).',
            type: 'object',
            options: { collapsible: true, collapsed: true },
            fields: [
              defineField({ name: 'intent', title: 'Intención', type: 'string', options: { list: ['registro', 'demo', 'contacto', 'diagnostico', 'contenido'] } }),
              defineField({ name: 'location', title: 'Ubicación', type: 'string', initialValue: 'body' }),
              defineField({ name: 'trigger', title: 'Disparador (01-09)', type: 'string' }),
              defineField({ name: 'label', title: 'Etiqueta', type: 'string' }),
            ],
          }),
        ],
      },
    ],
  },
});

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
        bloqueTexto,
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
            defineField({ name: 'titulo', title: 'Título (opcional)', type: 'string' }),
            defineField({
              name: 'estilo',
              title: 'Estilo',
              type: 'string',
              options: { list: [{ title: 'Caja destacada', value: 'highlight-box' }, { title: 'Datos / cifras', value: 'data-card' }], layout: 'radio' },
              initialValue: 'highlight-box',
            }),
            defineField({ name: 'contenido', title: 'Contenido', type: 'array', of: [bloqueTexto] }),
            // Formato antiguo de una sola linea; se sigue leyendo si existe.
            defineField({ name: 'texto', title: 'Texto (formato antiguo)', type: 'text', rows: 3, hidden: ({ value }) => !value }),
          ],
          preview: { select: { title: 'titulo' }, prepare: ({ title }) => ({ title: title || 'Caja destacada' }) },
        }),
        defineArrayMember({
          name: 'enlacesRelacionados',
          title: 'Enlaces relacionados',
          type: 'object',
          fields: [
            defineField({ name: 'etiqueta', title: 'Etiqueta', type: 'string', initialValue: 'Sigue leyendo' }),
            defineField({
              name: 'enlaces',
              title: 'Enlaces',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'enlace',
                  fields: [
                    defineField({ name: 'kicker', title: 'Antetítulo', type: 'string' }),
                    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
                    defineField({ name: 'descripcion', title: 'Descripción', type: 'string' }),
                    defineField({ name: 'href', title: 'URL', type: 'string', validation: (r) => r.required() }),
                  ],
                  preview: { select: { title: 'titulo', subtitle: 'href' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'etiqueta' }, prepare: ({ title }) => ({ title: `Enlaces relacionados · ${title ?? ''}` }) },
        }),
        defineArrayMember({
          name: 'tabla',
          title: 'Tabla',
          type: 'object',
          fields: [
            defineField({ name: 'caption', title: 'Título de la tabla', type: 'string' }),
            defineField({ name: 'clase', title: 'Estilo', type: 'string', options: { list: [
              { title: 'Comparativa', value: 'tabla-comparativa' },
              { title: 'Simple', value: 'tabla-simple' },
            ] } }),
            defineField({ name: 'cabecera', title: 'Cabecera', type: 'array', of: [{ type: 'string' }] }),
            defineField({
              name: 'filas',
              title: 'Filas',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'fila',
                  fields: [defineField({ name: 'celdas', title: 'Celdas', type: 'array', of: [{ type: 'string' }] })],
                  preview: { select: { c: 'celdas' }, prepare: ({ c }) => ({ title: (c ?? []).join(' · ') }) },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'caption', c: 'cabecera' }, prepare: ({ title, c }) => ({ title: title || `Tabla · ${(c ?? []).join(' · ')}` }) },
        }),
        defineArrayMember({
          name: 'descarga',
          title: 'Bloque de descarga de plantilla',
          description: 'Formulario de descarga con cuenta. El recurso se elige solo según la URL del artículo.',
          type: 'object',
          fields: [defineField({ name: 'nota', title: 'Nota interna', type: 'string' })],
          preview: { prepare: () => ({ title: 'Descarga de plantilla (formulario)' }) },
        }),
        defineArrayMember({
          name: 'ancla',
          title: 'Ancla (para el índice)',
          description: 'Marca un punto del texto al que se puede enlazar con #id.',
          type: 'object',
          fields: [defineField({ name: 'id', title: 'id', type: 'string', validation: (r) => r.required() })],
          preview: { select: { title: 'id' }, prepare: ({ title }) => ({ title: `#${title}` }) },
        }),
        defineArrayMember({
          name: 'separador',
          title: 'Separador',
          type: 'object',
          fields: [defineField({ name: 'estilo', type: 'string', hidden: true })],
          preview: { prepare: () => ({ title: '— separador —' }) },
        }),
        defineArrayMember({
          name: 'htmlBloque',
          title: 'Bloque HTML',
          description: 'Para piezas a medida (comparativas, casos, checklists). Edítalo con cuidado: es HTML.',
          type: 'object',
          fields: [
            defineField({ name: 'nota', title: 'Qué es', type: 'string' }),
            defineField({ name: 'html', title: 'HTML', type: 'text', rows: 12, validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'nota', html: 'html' }, prepare: ({ title, html }) => ({ title: title || 'Bloque HTML', subtitle: (html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 80) }) },
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
      name: 'cardCategory',
      title: 'Categoría de la tarjeta del índice',
      description: 'Opcional. Si se deja vacía se usa la categoría visible.',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'cardReadTime',
      title: 'Tiempo de lectura de la tarjeta',
      description: 'Opcional. Si se deja vacío se usa el del artículo.',
      type: 'string',
      group: 'seo',
      hidden: ({ value }) => !value,
    }),
    defineField({
      name: 'priority',
      title: 'Prioridad en el sitemap',
      type: 'string',
      group: 'seo',
      options: { list: ['0.9', '0.8', '0.75', '0.7', '0.6'] },
      initialValue: '0.8',
    }),
    defineField({
      name: 'orden',
      title: 'Orden en el índice del blog',
      description: 'Opcional. Los artículos con número van primero, de menor a mayor; los demás, detrás, por fecha.',
      type: 'number',
      group: 'seo',
    }),
    defineField({
      name: 'mostrarFaqs',
      title: 'Mostrar las preguntas frecuentes al final',
      description: 'Desmárcalo si las preguntas ya están escritas dentro del cuerpo (artículos migrados). El schema FAQPage se genera igual.',
      type: 'boolean',
      group: 'seo',
      initialValue: true,
    }),
    defineField({
      name: 'contenedor',
      title: 'Clase del contenedor (avanzado)',
      description: 'Solo para artículos migrados con estilos propios. No lo cambies.',
      type: 'string',
      group: 'seo',
      hidden: ({ value }) => !value,
    }),
    defineField({
      name: 'noindex',
      title: 'Borrador (no indexar)',
      description: 'Publica la página pero pide a Google que no la indexe y la deja fuera del índice del blog, del sitemap, de /llms.txt y del aviso de «contenido nuevo». Desmárcalo para publicar de verdad.',
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
