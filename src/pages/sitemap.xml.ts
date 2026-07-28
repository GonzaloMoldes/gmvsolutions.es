export async function GET() {
  const baseURL = 'https://www.gmvsolutions.es';
  const lastmod = '2026-07-01';
  // Fecha de la revision SEO/GEO del blog.
  const REVISION = '2026-07-27';

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

    page('/sectores/alimentacion/', '0.75', 'monthly'),
    page('/sectores/mecanizado-cnc/', '0.75', 'monthly'),

    page('/blog/', '0.8', 'weekly', REVISION),

    // Revisados el 2026-07-27 (auditoria SEO/GEO: FAQ + schema, indice con anclas,
    // migracion de layout). Su dateModified en el BlogPosting coincide con este lastmod.
    page('/blog/coste-absentismo-pymes-industriales/', '0.75', 'monthly', REVISION),
    page('/blog/crisis-perdida-conocimiento-planta-industrial/', '0.75', 'monthly', REVISION),
    page('/blog/documentar-conocimiento-operarios-expertos/', '0.75', 'monthly', REVISION),
    page('/blog/gestion-competencias-industria/', '0.8', 'monthly', REVISION),
    page('/blog/onboarding-software-pymes/', '0.8', 'monthly', REVISION),
    page('/blog/onboarding-vs-tradicional/', '0.8', 'monthly', REVISION),
    page('/blog/que-es-un-sop-industrial/', '0.75', 'monthly', REVISION),
    page('/blog/documentar-procesos-mecanizado-cnc/', '0.75', 'monthly', REVISION),
    page('/blog/instrucciones-de-trabajo-vs-sop/', '0.75', 'monthly', REVISION),
    page('/blog/software-sop-para-fabricas-comparativa/', '0.8', 'monthly', REVISION),
    page('/blog/plantilla-sop-produccion/', '0.8', 'monthly', REVISION),
    page('/blog/sop-mantenimiento-preventivo-guia-plantilla/', '0.75', 'monthly', REVISION),
    page('/blog/conocimiento-tacito-taller-industrial/', '0.75', 'monthly', REVISION),
    page('/blog/reducir-onboarding-operarios-cinco-a-un-dia/', '0.75', 'monthly', REVISION),
    page('/blog/plan-contingencia-bajas-produccion/', '0.75', 'monthly', REVISION),
    page('/blog/onboarding-digital-errores-manuales/', '0.8', 'monthly', REVISION),

    // Sin cambios desde su publicacion: conservan su fecha real.
    page('/blog/trazabilidad-de-un-producto/', '0.75', 'monthly', '2026-06-26'),
    page('/blog/lean-manufacturing/', '0.8', 'monthly', '2026-06-29'),
    page('/blog/digitalizar-produccion-pyme-industrial/', '0.8', 'monthly', '2026-07-01'),

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
