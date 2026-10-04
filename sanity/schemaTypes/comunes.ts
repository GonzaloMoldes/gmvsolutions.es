import { defineField } from 'sanity';

// Piezas reutilizadas por los documentos de pagina (home, ajustes...).

/** Texto + URL de un boton o enlace. */
export const enlace = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'object',
    options: { columns: 2 },
    fields: [
      defineField({ name: 'texto', title: 'Texto', type: 'string', validation: (r) => r.required() }),
      defineField({
        name: 'url',
        title: 'URL',
        type: 'string',
        description: 'Interna (/precios/) o externa (https://...).',
        validation: (r) => r.required(),
      }),
    ],
  });

/** Antetitulo + titulo de una seccion (el «§01 · ...» del diseño). */
export const cabeceraSeccion = [
  defineField({ name: 'antetitulo', title: 'Antetítulo', type: 'string', description: 'La línea pequeña sobre el título, p. ej. «§01 · El día a día».' }),
  defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
];

export const AYUDA_NEGRITA = 'Para poner algo en negrita, rodéalo con dos asteriscos: **así**.';
export const AYUDA_FORMATO = 'Negrita: **así**. Enlace: [texto](/url/).';

/** Lista de preguntas frecuentes elegidas de «Preguntas frecuentes». */
export const preguntas = (name = 'items', title = 'Preguntas') =>
  defineField({
    name,
    title,
    description: 'Elige preguntas existentes o crea una nueva desde aquí. Arrastra para ordenarlas.',
    type: 'array',
    of: [{ type: 'reference', to: [{ type: 'preguntaFrecuente' }] }],
    validation: (r) => r.unique(),
  });
