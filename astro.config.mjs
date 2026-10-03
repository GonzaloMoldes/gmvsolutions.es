import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { readdirSync } from 'node:fs';

// Sanity (gestor de contenidos). Solo se activa con PUBLIC_SANITY_PROJECT_ID:
// sin el, el sitio compila exactamente igual que antes y /admin/ no existe.
// Puesta en marcha: SANITY_PUESTA_EN_MARCHA.md
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const sanityProjectId = env.PUBLIC_SANITY_PROJECT_ID;
// Linea de diagnostico en el log de build (Vercel → Deployment → Building).
console.log(
  sanityProjectId
    ? `[sanity] ACTIVO · proyecto ${sanityProjectId} · dataset ${env.PUBLIC_SANITY_DATASET || 'production'} · panel en /admin/`
    : `[sanity] INACTIVO · falta PUBLIC_SANITY_PROJECT_ID en este entorno (VERCEL_ENV=${process.env.VERCEL_ENV ?? 'local'}) · /admin/ no se genera`,
);
const sanityIntegrations = sanityProjectId
  ? [
      sanity({
        projectId: sanityProjectId,
        dataset: env.PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2025-01-01',
        // Build estatico: siempre datos publicados y frescos (sin CDN cacheado).
        useCdn: false,
        // Panel de edicion dentro de la web. robots.txt ya bloquea /admin/.
        studioBasePath: '/admin',
      }),
      react(),
    ]
  : [];

// Nota: el sitemap lo genera el endpoint manual y curado src/pages/sitemap.xml.ts
// (/sitemap.xml, 62 URLs indexables, excluye las paginas noindex). Es el que anuncia
// robots.txt. Se retiro la integracion @astrojs/sitemap porque generaba un segundo
// sitemap redundante que incluia paginas noindex (p. ej. /kit-digital-pyme-industrial/).
//
// El sitio es estatico salvo las rutas que marcan `export const prerender = false`
// (hoy: /api/suscribir; con DL-5, /api/descarga). El adaptador de Vercel solo se activa para esas rutas
// on-demand; el resto del sitio se sigue pre-renderizando a HTML estatico.
export default defineConfig({
  site: 'https://www.gmvsolutions.es',
  integrations: sanityIntegrations,
  trailingSlash: 'always',
  adapter: vercel({
    // DL-3 · Los recursos descargables viven fuera de public/ (no tienen URL propia) y
    // los sirve /api/descarga/[recurso] leyéndolos del disco. Vercel sólo empaqueta en
    // la función lo que detecta como importado; estos archivos se leen con fs, así
    // que hay que incluirlos a mano o la función responde 404 en producción.
    // Se incluye la carpeta entera en vez de listar archivos: una lista aquí se
    // desincronizaría del catálogo (src/data/descargables.ts), y ya es
    // scripts/check-descargables.mjs quien garantiza que cada recurso tiene su archivo.
    includeFiles: readdirSync('./src/descargables').map(archivo => `./src/descargables/${archivo}`),
  }),
  build: {
    // Inlinea el CSS en el HTML para eliminar peticiones bloqueantes de render
    inlineStylesheets: 'always',
  },
});
