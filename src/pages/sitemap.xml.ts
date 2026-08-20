import { posts, REVISION } from '../lib/blog';

export async function GET() {
  const baseURL = 'https://www.gmvsolutions.es';
  const lastmod = '2026-07-01';

  // `lastmod` global por defecto. Cuando una pagina se publica o revisa en otra
  // fecha, se pasa la suya: un lastmod uniforme y falso en todo el sitemap resta
  // credibilidad a la senal (los buscadores la ignoran si no se corresponde con
  // cambios reales).
  const page = (
    url: string,
    priority: string,
    changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly',
    pageLastmod: string = lastmod,
  ) => ({ url, lastmod: pageLastmod, priority, changefreq });

  const staticPages = [
    page('/', '1.0', 'weekly'),
    page('/como-funciona/', '0.9', 'monthly'),
    page('/precios/', '0.9', 'monthly'),
    page('/por-que-usar-reelevo/', '0.8', 'monthly'),
    page('/sobre-nosotros/', '0.7', 'monthly'),
    page('/video-demo/', '0.8', 'monthly'),
    page('/recursos/', '0.75', 'weekly'),
    page('/faqs/', '0.7', 'monthly'),
    page('/onboarding-software-pymes/', '0.8', 'monthly'),
    page('/software-gestion-pyme-industrial/', '0.8', 'monthly'),

    page('/documentacion-procesos/', '0.85', 'monthly'),
    page('/gestion-competencias/', '0.85', 'monthly'),
    page('/calidad-y-conformidad/', '0.75', 'monthly'),
    page('/cobertura-turnos/', '0.75', 'monthly'),
    page('/control-produccion/', '0.8', 'monthly'),
    page('/oee/', '0.8', 'monthly'),
    page('/seguridad/', '0.7', 'monthly'),
    page('/mantenimiento/', '0.8', 'monthly'),
    page('/kaizen/', '0.8', 'monthly'),
    page('/workflows/', '0.8', 'monthly'),
    page('/portal-operario/', '0.8', 'monthly'),
    page('/firma-digital/', '0.7', 'monthly'),
    page('/modo-offline/', '0.7', 'monthly'),
    page('/api-integraciones/', '0.8', 'monthly'),
    page('/integracion-m365/', '0.75', 'monthly'),
    page('/obras-trazabilidad/', '0.75', 'monthly'),

    page('/vs-alternativas/', '0.9', 'monthly'),
    page('/vs-dozuki/', '0.8', 'monthly'),
    page('/vs-gembadocs/', '0.8', 'monthly'),
    page('/vs-knowby/', '0.8', 'monthly'),
    page('/vs-poka/', '0.8', 'monthly'),
    page('/vs-mes-tradicional/', '0.85', 'monthly'),
    page('/vs-excel-papel/', '0.85', 'monthly'),
    // /kit-digital-pyme-industrial/ se anadira al sitemap cuando pase la verificacion legal (hoy noindex).

    page('/para-quien/gerente-propietario/', '0.8', 'monthly'),
    page('/para-quien/jefe-de-produccion/', '0.8', 'monthly'),
    page('/para-quien/responsable-rrhh/', '0.8', 'monthly'),
    page('/para-quien/responsable-calidad/', '0.8', 'monthly'),

    page('/casos-de-uso/cobertura-bajas/', '0.8', 'monthly'),
    page('/casos-de-uso/onboarding-operarios/', '0.85', 'monthly'),
    page('/casos-de-uso/personal-ett/', '0.8', 'monthly'),
    page('/casos-de-uso/transferencia-conocimiento/', '0.8', 'monthly'),
    // URL de primer nivel aunque vive en el menu de casos de uso, igual que
    // /cobertura-turnos/. Publicada 2026-08-19, de ahi su lastmod propio.
    page('/consistencia-entre-turnos/', '0.85', 'monthly', '2026-08-19'),
    page('/errores-en-planta/', '0.85', 'monthly', '2026-08-20'),

    page('/sectores/alimentacion/', '0.75', 'monthly'),
    page('/sectores/mecanizado-cnc/', '0.75', 'monthly'),

    page('/blog/', '0.8', 'weekly', REVISION),

    // Entradas del blog generadas desde src/lib/blog.ts (registro unico que
    // comparten /blog/, este sitemap y /llms.txt). Cada articulo lleva su propia
    // prioridad y su lastmod: REVISION si se reviso en la auditoria SEO/GEO del
    // 2026-07-27, o su fecha real de publicacion si no se ha tocado desde entonces.
    ...posts.map((post) => page(`/blog/${post.slug}/`, post.priority, 'monthly', post.lastmod)),

    // /recursos/gestion-competencias-industria/, /recursos/onboarding-software-pymes/ y
    // /recursos/onboarding-vs-tradicional/ NO van en el sitemap: canonicalizan a su
    // equivalente en /blog/. Un sitemap solo debe listar URLs canonicas; incluir la
    // version descartada manda una senal contradictoria al rastreador.

    page('/legal/aviso-legal/', '0.3', 'yearly'),
    page('/legal/cookies/', '0.3', 'yearly'),
    page('/legal/privacidad/', '0.3', 'yearly'),
  ];

  // Generar XML del sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map((page) => `  <url>
    <loc>${baseURL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=604800', // 7 días
    },
  });
}
