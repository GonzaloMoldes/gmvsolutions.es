import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { readdirSync } from 'node:fs';

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
