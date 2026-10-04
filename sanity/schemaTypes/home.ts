import { defineArrayMember, defineField, defineType } from 'sanity';
import { AYUDA_NEGRITA, cabeceraSeccion, enlace, preguntas } from './comunes';

// Pagina de inicio. Documento unico, con _id fijo «home» (ver sanity.config.ts).
// Cada grupo es una seccion de la home, en el mismo orden en que se ve.
// El diseño (ilustraciones, pictogramas, captura, animaciones) sigue en el
// codigo: aqui solo vive el texto. Valores iniciales y respaldo:
// src/data/home.default.json.

const seccion = (name: string, title: string, fields: ReturnType<typeof defineField>[], description?: string) =>
  defineField({ name, title, description, type: 'object', group: name, options: { collapsible: false }, fields });

export const home = defineType({
  name: 'home',
  title: 'Página de inicio',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'hero', title: 'Portada', default: true },
    { name: 'escenas', title: '§01 Escenas' },
    { name: 'datos', title: '§02 Cifras' },
    { name: 'recorrido', title: '§03 Recorrido' },
    { name: 'roles', title: '§04 Para quién' },
    { name: 'faq', title: '§05 FAQ' },
    { name: 'ctaFinal', title: 'Llamada final' },
  ],
  fields: [
    seccion('seo', 'SEO', [
      defineField({
        name: 'title',
        title: 'Título para Google',
        type: 'string',
        validation: (r) => r.required().max(65).warning('Más de 65 caracteres: Google lo cortará.'),
      }),
      defineField({
        name: 'description',
        title: 'Descripción para Google',
        type: 'text',
        rows: 3,
        validation: (r) => r.required().max(170).warning('Más de 170 caracteres: Google la cortará.'),
      }),
    ]),

    seccion('hero', 'Portada', [
      defineField({ name: 'referencia', title: 'Etiqueta superior', type: 'string', description: 'Va junto a la placa «REF. 00».' }),
      defineField({
        name: 'titulo',
        title: 'Titular (H1)',
        type: 'string',
        description: 'Corto: en escritorio se ve en mayúsculas y muy grande.',
        validation: (r) => r.required().max(60).warning('Un titular largo empuja los botones fuera de la primera pantalla.'),
      }),
      defineField({ name: 'entradilla', title: 'Entradilla', type: 'text', rows: 4, description: AYUDA_NEGRITA }),
      enlace('ctaPrincipal', 'Botón principal'),
      enlace('ctaSecundario', 'Botón secundario'),
      defineField({ name: 'nota', title: 'Nota bajo los botones', type: 'string' }),
      defineField({
        name: 'ficha',
        title: 'Ficha técnica',
        description: 'La banda de cuatro datos bajo la portada.',
        type: 'array',
        of: [defineArrayMember({
          type: 'object',
          name: 'dato',
          options: { columns: 2 },
          fields: [
            defineField({ name: 'etiqueta', title: 'Etiqueta', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'valor', title: 'Valor', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'valor', subtitle: 'etiqueta' } },
        })],
      }),
    ]),

    seccion('escenas', '§01 Escenas', [
      ...cabeceraSeccion,
      defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 5, description: AYUDA_NEGRITA }),
      defineField({
        name: 'tarjetas',
        title: 'Tarjetas',
        type: 'array',
        of: [defineArrayMember({
          type: 'object',
          name: 'tarjeta',
          fields: [
            defineField({ name: 'codigo', title: 'Código', type: 'string', description: 'p. ej. INC-01' }),
            defineField({ name: 'momento', title: 'Momento', type: 'string', description: 'p. ej. MAR · 06:30' }),
            defineField({ name: 'etiqueta', title: 'Etiqueta', type: 'string' }),
            defineField({ name: 'titulo', title: 'Frase', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'titulo', subtitle: 'etiqueta' } },
        })],
      }),
    ]),

    seccion('datos', '§02 Cifras', [
      ...cabeceraSeccion,
      defineField({
        name: 'cifras',
        title: 'Cifras',
        type: 'array',
        of: [defineArrayMember({
          type: 'object',
          name: 'cifra',
          fields: [
            defineField({ name: 'etiqueta', title: 'Etiqueta', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'valor',
              title: 'Cifra',
              type: 'string',
              description: 'Tal como se lee: «7,2», «40» o «3–5». Los números se animan solos.',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'unidad', title: 'Unidad', type: 'string', description: '«%», « d»…' }),
            defineField({
              name: 'barra',
              title: 'Relleno de la barra (0-100)',
              type: 'number',
              validation: (r) => r.min(0).max(100),
            }),
            defineField({ name: 'texto', title: 'Texto', type: 'string' }),
          ],
          preview: { select: { title: 'valor', subtitle: 'etiqueta' } },
        })],
      }),
      defineField({ name: 'fuente', title: 'Fuente de los datos', type: 'text', rows: 2 }),
    ]),

    seccion('recorrido', '§03 Recorrido', [
      ...cabeceraSeccion,
      defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 3, description: AYUDA_NEGRITA }),
      defineField({
        name: 'pasos',
        title: 'Pasos',
        description: 'Cada paso lleva su pictograma por orden (E-01 a E-06). A partir del séptimo se muestra sin pictograma.',
        type: 'array',
        of: [defineArrayMember({
          type: 'object',
          name: 'paso',
          fields: [
            defineField({ name: 'rol', title: 'Quién', type: 'string' }),
            defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 2 }),
            enlace('enlace', 'Enlace'),
          ],
          preview: { select: { title: 'titulo', subtitle: 'rol' } },
        })],
      }),
      defineField({ name: 'captura', title: 'Pie de la captura', type: 'string' }),
    ]),

    seccion('roles', '§04 Para quién', [
      ...cabeceraSeccion,
      defineField({
        name: 'items',
        title: 'Perfiles',
        type: 'array',
        of: [defineArrayMember({
          type: 'object',
          name: 'perfil',
          fields: [
            defineField({ name: 'titulo', title: 'Perfil', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'texto', title: 'Texto', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'titulo', subtitle: 'url' } },
        })],
      }),
    ]),

    seccion('faq', '§05 FAQ', [
      ...cabeceraSeccion,
      preguntas(),
    ]),

    seccion('ctaFinal', 'Llamada final', [
      ...cabeceraSeccion,
      defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 3, description: AYUDA_NEGRITA }),
      enlace('ctaPrincipal', 'Botón principal'),
      enlace('ctaSecundario', 'Botón secundario'),
    ]),
  ],
  preview: { prepare: () => ({ title: 'Página de inicio' }) },
});
