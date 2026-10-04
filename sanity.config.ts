// Configuracion del panel de contenidos (Sanity Studio). Se sirve dentro de la
// propia web en /admin/ mediante la integracion @sanity/astro (astro.config.mjs),
// solo cuando PUBLIC_SANITY_PROJECT_ID esta definido.
//
// Puesta en marcha: SANITY_PUESTA_EN_MARCHA.md
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

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
            S.listItem()
              .title('Artículos del blog')
              .child(S.documentTypeList('articulo').title('Artículos del blog').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])),
          ]),
    }),
    // Consola GROQ para consultas puntuales. Solo la ve quien tiene acceso al proyecto.
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
