import { defineField, defineType } from 'sanity';
import { AYUDA_FORMATO } from './comunes';

// Pregunta frecuente reutilizable: se escribe una vez y se elige desde cada
// pagina que la muestra (home, precios, /faqs/). Corregirla aqui la corrige en
// todas. La misma respuesta alimenta el bloque visible y el schema FAQPage.
export const preguntaFrecuente = defineType({
  name: 'preguntaFrecuente',
  title: 'Pregunta frecuente',
  type: 'document',
  fields: [
    defineField({ name: 'q', title: 'Pregunta', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'a',
      title: 'Respuesta',
      type: 'text',
      rows: 6,
      description: `Empieza con una respuesta directa de 40-60 palabras: es lo que más citan Google y las IA. Separa párrafos con una línea en blanco. ${AYUDA_FORMATO}`,
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'q', subtitle: 'a' } },
});
