import { defineConfig } from 'astro/config';

// Nota: el sitemap lo genera el endpoint manual y curado src/pages/sitemap.xml.ts
// (/sitemap.xml, 62 URLs indexables, excluye las paginas noindex). Es el que anuncia
// robots.txt. Se retiro la integracion @astrojs/sitemap porque generaba un segundo
// sitemap redundante que incluia paginas noindex (p. ej. /kit-digital-pyme-industrial/).
export default defineConfig({
  site: 'https://gmvsolutions.es',
  trailingSlash: 'always',
  build: {
    // Inlinea el CSS en el HTML para eliminar peticiones bloqueantes de render
    inlineStylesheets: 'always',
  },
});
