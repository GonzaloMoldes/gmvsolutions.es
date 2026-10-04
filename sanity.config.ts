// Configuracion del panel de contenidos (Sanity Studio). Se sirve dentro de la
// propia web en /admin/ mediante la integracion @sanity/astro (astro.config.mjs),
// solo cuando PUBLIC_SANITY_PROJECT_ID esta definido.
//
// Puesta en marcha: SANITY_PUESTA_EN_MARCHA.md
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

// Documentos unicos: su _id es el nombre del tipo («home», «precios»...), que es
// lo que lee src/lib/contenido.ts.
const SINGLETONS = [
  { id: 'home', title: 'Página de inicio' },
  { id: 'precios', title: 'Precios' },
  { id: 'paginaFaqs', title: 'Página de preguntas frecuentes' },
  { id: 'ajustes', title: 'Ajustes generales' },
];
const SINGLETON_IDS = new Set(SINGLETONS.map((s) => s.id));
// Tipos con un conjunto fijo de documentos (uno por pagina que existe en el
// codigo): se editan y publican, pero no se crean, duplican ni borran.
const FIJOS = new Set([...SINGLETON_IDS, 'paginaFuncionalidad']);

export default defineConfig({
  name: 'reelevo',
  title: 'REELEVO · Contenidos',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '1rbyt934',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenidos')
          .items([
            // Documentos unicos: se abren directamente, sin lista.
            ...SINGLETONS.map(({ id, title }) =>
              S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title)),
            ),
            S.listItem()
              .title('Páginas de funcionalidad')
              .child(S.documentTypeList('paginaFuncionalidad').title('Páginas de funcionalidad').defaultOrdering([{ field: 'ruta', direction: 'asc' }])),
            S.divider(),
            S.listItem()
              .title('Preguntas frecuentes')
              .child(S.documentTypeList('preguntaFrecuente').title('Preguntas frecuentes').defaultOrdering([{ field: 'q', direction: 'asc' }])),
            S.listItem()
              .title('Artículos del blog')
              .child(S.documentTypeList('articulo').title('Artículos del blog').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])),
          ]),
    }),
    // Consola GROQ para consultas puntuales. Solo la ve quien tiene acceso al proyecto.
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Los documentos fijos no aparecen en el boton «+ Crear».
    templates: (templates) => templates.filter(({ schemaType }) => !FIJOS.has(schemaType)),
  },
  document: {
    // Ni duplicar ni borrar un documento fijo: solo editar y publicar.
    actions: (acciones, { schemaType }) =>
      FIJOS.has(schemaType)
        ? acciones.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : acciones,
  },
});
