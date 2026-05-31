import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gmvsolutions.es',
  trailingSlash: 'always',
  build: {
    // Inlinea el CSS en el HTML para eliminar peticiones bloqueantes de render
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Entradas personalizadas para optimizar sitemap
      serialize(item) {
        // Artículos blog recientes (última semana)
        if (item.url.includes('/blog/') && !item.url.endsWith('/blog/')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
          item.lastmod = new Date();
        }
        // Página principal blog
        if (item.url.endsWith('/blog/')) {
          item.priority = 0.85;
          item.changefreq = 'weekly';
        }
        // Comparativas (alto impacto SEO - "vs" keywords)
        if (item.url.includes('/vs-')) {
          item.priority = 0.95;
          item.changefreq = 'monthly';
        }
        // Landing pages de alto valor
        if (item.url.includes('/onboarding-software-pymes/') ||
            item.url.includes('/gestion-competencias/') ||
            item.url.includes('/documentacion-procesos/')) {
          item.priority = 0.9;
          item.changefreq = 'daily';
        }
        // Video demo (contiene schema VideoObject)
        if (item.url.includes('/video-demo/')) {
          item.priority = 0.85;
          item.changefreq = 'monthly';
        }
        // Casos de uso
        if (item.url.includes('/casos-de-uso/')) {
          item.priority = 0.85;
          item.changefreq = 'monthly';
        }
        // Para quién (buyer personas)
        if (item.url.includes('/para-quien/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        }
        // Sectores
        if (item.url.includes('/sectores/')) {
          item.priority = 0.75;
          item.changefreq = 'monthly';
        }
        // Recursos educativos
        if (item.url.includes('/recursos/')) {
          item.priority = 0.75;
          item.changefreq = 'daily';
        }
        // Página principal máxima prioridad
        if (item.url === 'https://gmvsolutions.es/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
  ],
});
