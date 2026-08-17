import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Nota: el sitemap lo genera el endpoint manual y curado src/pages/sitemap.xml.ts
// (/sitemap.xml, 62 URLs indexables, excluye las paginas noindex). Es el que anuncia
// robots.txt. Se retiro la integracion @astrojs/sitemap porque generaba un segundo
// sitemap redundante que incluia paginas noindex (p. ej. /kit-digital-pyme-industrial/).
//
// El sitio es estatico salvo las rutas que marcan `export const prerender = false`
// (hoy: /api/suscribir). El adaptador de Vercel solo se activa para esas rutas
// on-demand; el resto del sitio se sigue pre-renderizando a HTML estatico.
export default defineConfig({
  site: 'https://www.gmvsolutions.es',
  trailingSlash: 'always',
  adapter: vercel(),
  build: {
    // Inlinea el CSS en el HTML para eliminar peticiones bloqueantes de render
    inlineStylesheets: 'always',
  },
});
