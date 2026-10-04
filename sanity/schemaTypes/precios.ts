import { defineArrayMember, defineField, defineType } from 'sanity';
import { AYUDA_NEGRITA, enlace, preguntas } from './comunes';

// Pagina /precios/. Documento unico, _id «precios» (ver sanity.config.ts).
// La calculadora de ROI sigue en el codigo. Respaldo: src/data/precios.default.json.
//
// OJO: los limites y funciones de cada plan salen de reelevo-app/lib/tier-config.ts.
// Cambiarlos aqui sin cambiarlos en la app hace que la web prometa lo que el
// producto no da (PLAN_CORRECCIONES_WEB_VS_APP_2026-08.md, Anexo I).

const titular = [
  defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
  defineField({ name: 'tituloDestacado', title: 'Título: segunda línea (en naranja)', type: 'string' }),
];

export const precios = defineType({
  name: 'precios',
  title: 'Precios',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Portada', default: true },
    { name: 'planes', title: 'Planes' },
    { name: 'faq', title: 'FAQ' },
    { name: 'ctaFinal', title: 'Llamada final' },
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
      name: 'hero', title: 'Portada', type: 'object', group: 'hero',
      fields: [
        defineField({ name: 'antetitulo', title: 'Antetítulo', type: 'string' }),
        ...titular,
        defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 4, description: AYUDA_NEGRITA }),
        enlace('ctaPrincipal', 'Botón principal'),
        enlace('ctaSecundario', 'Botón secundario'),
      ],
    }),
    defineField({
      name: 'planes',
      title: 'Planes',
      type: 'array',
      group: 'planes',
      description: 'Una tarjeta por plan, en este orden. Los precios numéricos también van al schema de Google.',
      of: [defineArrayMember({
        type: 'object',
        name: 'plan',
        groups: [{ name: 'tarjeta', title: 'Tarjeta', default: true }, { name: 'funciones', title: 'Funciones' }],
        fields: [
          defineField({ name: 'nombre', title: 'Nombre', type: 'string', group: 'tarjeta', validation: (r) => r.required() }),
          defineField({ name: 'ambito', title: 'Para quién (bajo el nombre)', type: 'string', group: 'tarjeta' }),
          defineField({ name: 'precio', title: 'Precio', type: 'string', group: 'tarjeta', description: '«49€», «0€» o un texto como «A medida».', validation: (r) => r.required() }),
          defineField({ name: 'sufijo', title: 'Sufijo del precio', type: 'string', group: 'tarjeta', description: '«/mes». Vacío si el precio es un texto.' }),
          defineField({ name: 'periodo', title: 'Línea bajo el precio', type: 'string', group: 'tarjeta' }),
          defineField({ name: 'anual', title: 'Línea de precio anual', type: 'string', group: 'tarjeta', description: AYUDA_NEGRITA }),
          defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3, group: 'tarjeta', description: AYUDA_NEGRITA }),
          defineField({ name: 'destacado', title: 'Plan destacado', type: 'boolean', group: 'tarjeta', description: 'Borde naranja y botón principal.', initialValue: false }),
          defineField({ name: 'insignia', title: 'Insignia', type: 'string', group: 'tarjeta', description: 'p. ej. «Más popular». Solo se ve en el plan destacado.' }),
          { ...enlace('cta', 'Botón'), group: 'tarjeta' },
          defineField({ name: 'nota', title: 'Nota bajo el botón', type: 'string', group: 'tarjeta' }),
          defineField({
            name: 'caracteristicas',
            title: 'Funciones',
            type: 'array',
            group: 'funciones',
            of: [defineArrayMember({
              type: 'object',
              name: 'caracteristica',
              fields: [
                defineField({ name: 'texto', title: 'Texto', type: 'string', validation: (r) => r.required() }),
                defineField({
                  name: 'estado',
                  title: 'Estado',
                  type: 'string',
                  initialValue: 'si',
                  options: { list: [{ title: '✓ Incluido', value: 'si' }, { title: '× No incluido', value: 'no' }, { title: '○ Según el caso', value: 'segun' }], layout: 'radio', direction: 'horizontal' },
                  validation: (r) => r.required(),
                }),
                defineField({ name: 'etiqueta', title: 'Etiqueta (solo «Según el caso»)', type: 'string', hidden: ({ parent }) => parent?.estado !== 'segun' }),
              ],
              preview: {
                select: { title: 'texto', estado: 'estado' },
                prepare: ({ title, estado }) => ({ title: `${{ si: '✓', no: '×', segun: '○' }[estado as string] ?? ''} ${title}` }),
              },
            })],
          }),
        ],
        preview: { select: { title: 'nombre', subtitle: 'precio' } },
      })],
    }),
    defineField({ name: 'faq', title: 'FAQ', type: 'object', group: 'faq', fields: [preguntas()] }),
    defineField({
      name: 'ctaFinal', title: 'Llamada final', type: 'object', group: 'ctaFinal',
      fields: [
        defineField({ name: 'antetitulo', title: 'Antetítulo', type: 'string' }),
        ...titular,
        defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 3, description: AYUDA_NEGRITA }),
        enlace('cta', 'Botón'),
        defineField({ name: 'nota', title: 'Nota final', type: 'string' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Precios' }) },
});
