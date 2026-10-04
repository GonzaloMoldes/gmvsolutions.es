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

/** Pregunta frecuente: alimenta el bloque visible y el schema FAQPage. */
export const pregunta = {
  type: 'object',
  name: 'pregunta',
  fields: [
    defineField({ name: 'q', title: 'Pregunta', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'a',
      title: 'Respuesta',
      type: 'text',
      rows: 4,
      description: 'Respuesta directa de 40-60 palabras: es lo que más citan Google y las IA.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'q', subtitle: 'a' } },
};
