import { defineArrayMember, defineField, defineType } from 'sanity';
import { enlace } from './comunes';

// Ajustes generales: lo que aparece en todas las paginas (cabecera y pie).
// Documento unico, con _id fijo «ajustes» (ver sanity.config.ts).
// Valores iniciales y respaldo: src/data/ajustes.default.json.

export const ajustes = defineType({
  name: 'ajustes',
  title: 'Ajustes generales',
  type: 'document',
  groups: [
    { name: 'marca', title: 'Marca y cabecera', default: true },
    { name: 'pie', title: 'Pie de página' },
    { name: 'contacto', title: 'Contacto' },
  ],
  fields: [
    defineField({
      name: 'lema',
      title: 'Lema de marca',
      type: 'string',
      group: 'marca',
      description: 'Aparece en el pie de todas las páginas, junto a «REELEVO».',
      validation: (r) => r.required(),
    }),
    { ...enlace('ctaCabecera', 'Botón de la cabecera', 'El botón naranja de arriba a la derecha y del menú en móvil.'), group: 'marca' },
    defineField({ name: 'notaMenuMovil', title: 'Nota bajo el botón (menú móvil)', type: 'string', group: 'marca' }),
    defineField({
      name: 'columnasPie',
      title: 'Columnas de enlaces del pie',
      type: 'array',
      group: 'pie',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'columna',
          fields: [
            defineField({ name: 'titulo', title: 'Título de la columna', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'enlaces',
              title: 'Enlaces',
              type: 'array',
              of: [defineArrayMember({ type: 'object', name: 'enlacePie', fields: enlace('x', 'x').fields, preview: { select: { title: 'texto', subtitle: 'url' } } })],
            }),
          ],
          preview: { select: { title: 'titulo' } },
        }),
      ],
    }),
    defineField({ name: 'email', title: 'Email de contacto', type: 'string', group: 'contacto', validation: (r) => r.required().email() }),
    defineField({ name: 'direccion', title: 'Dirección (una línea por fila)', type: 'array', group: 'contacto', of: [{ type: 'string' }] }),
    defineField({ name: 'linkedin', title: 'URL de LinkedIn', type: 'url', group: 'contacto' }),
  ],
  preview: { prepare: () => ({ title: 'Ajustes generales' }) },
});
