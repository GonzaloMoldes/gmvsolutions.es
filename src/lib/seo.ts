// SEO compartido: Organization sitewide + BreadcrumbList auto por URL.
// Usado desde BaseLayout para que TODAS las paginas indexables emitan
// Organization y BreadcrumbList sin duplicar JSON-LD en cada pagina.
// Trazabilidad: Calendario Sprint 1, S1-C3 (schema base).

export const BASE_URL = 'https://gmvsolutions.es';

// Organization unica del sitio (anclada por @id para que el resto de
// nodos schema puedan referenciarla). Antes vivia solo en index.astro.
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'GMV Solutions',
  alternateName: 'REELEVO',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description:
    'REELEVO ayuda a las pymes industriales a reducir la dependencia de personas clave, ordenar incorporaciones y ganar más visibilidad sobre lo que pasa en planta.',
  email: 'hola@gmvsolutions.es',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Marola',
    addressLocality: 'A Coruña',
    postalCode: '15002',
    addressCountry: 'ES',
  },
  foundingDate: '2025',
  areaServed: 'ES',
  knowsAbout: [
    'Software SOP industrial',
    'Procedimientos operativos estándar',
    'Documentación operativa',
    'Continuidad operativa en planta',
    'Visibilidad operativa industrial',
    'Reducción de dependencia operativa',
    'Aprendizaje operativo en planta',
    'Onboarding de operarios',
    'Cobertura de bajas en producción',
    'Personal ETT en fábrica',
    'Pymes industriales españolas',
  ],
  sameAs: ['https://www.linkedin.com/company/reelevo'],
  founder: {
    '@type': 'Person',
    name: 'Gonzalo Moldes',
    jobTitle: 'Fundador',
    url: 'https://www.linkedin.com/in/gonzalomoldes/',
    sameAs: ['https://www.linkedin.com/in/gonzalomoldes/'],
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hola@gmvsolutions.es',
    contactType: 'sales',
    areaServed: 'ES',
    availableLanguage: 'es',
  },
};

// SoftwareApplication unico de REELEVO. Anclado por @id para que TODAS las
// paginas de funcionalidad referencien el MISMO producto (no 14 softwares
// distintos) y sean elegibles para rich result (incluyen offers). El nodo
// rico y completo (featureList, potentialAction, oferta detallada) vive en la
// home (index.astro); aqui basta una referencia consistente con el rango de
// precio. Trazabilidad: Roadmap IA 2026-06, criterio "Rich Results válido".
export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${BASE_URL}/#software`,
    name: 'REELEVO',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Android, iOS',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '49',
      highPrice: '149',
      offerCount: '3',
      url: `${BASE_URL}/precios/`,
    },
  };
}

// Etiquetas legibles por segmento de URL. Si un slug no esta aqui se
// humaniza automaticamente (guiones -> espacios + mayuscula inicial).
const SEGMENT_LABELS: Record<string, string> = {
  'como-funciona': 'Cómo funciona',
  precios: 'Precios',
  'por-que-usar-reelevo': 'Por qué usar REELEVO',
  'sobre-nosotros': 'Sobre nosotros',
  'video-demo': 'Vídeo demo',
  recursos: 'Recursos',
  faqs: 'FAQs',
  'onboarding-software-pymes': 'Onboarding software para pymes',
  'documentacion-procesos': 'Documentación de procesos',
  'gestion-competencias': 'Gestión de competencias',
  'calidad-y-conformidad': 'Calidad y conformidad',
  'cobertura-turnos': 'Cobertura de turnos',
  'control-produccion': 'Control de producción',
  mantenimiento: 'Mantenimiento',
  kaizen: 'Kaizen',
  workflows: 'Workflows',
  'portal-operario': 'Portal del operario',
  'firma-digital': 'Firma digital',
  'modo-offline': 'Modo offline',
  'api-integraciones': 'API e integraciones',
  'integracion-m365': 'Integración Microsoft 365',
  'obras-trazabilidad': 'Obras y trazabilidad',
  'vs-alternativas': 'Alternativas',
  'vs-dozuki': 'REELEVO vs Dozuki',
  'vs-gembadocs': 'REELEVO vs GembaDocs',
  'vs-knowby': 'REELEVO vs Knowby',
  'vs-poka': 'REELEVO vs Poka',
  'para-quien': 'Para quién',
  'gerente-propietario': 'Gerente / Propietario',
  'jefe-de-produccion': 'Jefe de producción',
  'responsable-rrhh': 'Responsable de RRHH',
  'responsable-calidad': 'Responsable de calidad',
  'casos-de-uso': 'Casos de uso',
  'cobertura-bajas': 'Cobertura de bajas',
  'onboarding-operarios': 'Onboarding de operarios',
  'personal-ett': 'Personal ETT',
  'transferencia-conocimiento': 'Transferencia de conocimiento',
  sectores: 'Sectores',
  alimentacion: 'Alimentación',
  'mecanizado-cnc': 'Mecanizado CNC',
  blog: 'Blog',
  'coste-absentismo-pymes-industriales': 'Coste del absentismo en pymes industriales',
  'crisis-perdida-conocimiento-planta-industrial':
    'Crisis por pérdida de conocimiento en planta',
  'documentar-conocimiento-operarios-expertos':
    'Documentar el conocimiento de operarios expertos',
  'gestion-competencias-industria': 'Gestión de competencias en la industria',
  'onboarding-vs-tradicional': 'Onboarding software vs tradicional',
  'que-es-un-sop-industrial': 'Qué es un SOP industrial',
  legal: 'Legal',
  'aviso-legal': 'Aviso legal',
  cookies: 'Política de cookies',
  privacidad: 'Política de privacidad',
};

// Secciones que agrupan paginas pero NO tienen pagina propia (no existe
// /para-quien/ como URL). Se muestran como texto en el breadcrumb, sin enlace,
// para no generar items que apunten a un 404.
const NON_NAVIGABLE_SECTIONS = new Set(['para-quien', 'casos-de-uso', 'sectores', 'legal']);

function humanize(slug: string): string {
  const text = slug.replace(/-/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function labelFor(segment: string): string {
  return SEGMENT_LABELS[segment] ?? humanize(segment);
}

export interface BreadcrumbItem {
  name: string;
  /** URL absoluta; ausente en la home, en el item actual y en secciones no navegables. */
  url?: string;
}

/**
 * Devuelve los items del breadcrumb para una ruta (incluye "Inicio").
 * El ultimo item (pagina actual) se devuelve sin url.
 * Devuelve null en la home (un breadcrumb de un solo item no aporta).
 * Reutilizado por el JSON-LD (buildBreadcrumb) y por el componente visible (Breadcrumbs.astro).
 */
export function breadcrumbItems(pathname: string, baseURL = BASE_URL): BreadcrumbItem[] | null {
  const clean = pathname.replace(/\/+$/, '');
  if (clean === '') return null; // home

  const segments = clean.split('/').filter(Boolean);

  const items: BreadcrumbItem[] = [{ name: 'Inicio', url: `${baseURL}/` }];

  let acc = '';
  segments.forEach((segment, index) => {
    acc += `/${segment}`;
    const isLast = index === segments.length - 1;
    const navigable = !isLast && !NON_NAVIGABLE_SECTIONS.has(segment);
    items.push({
      name: labelFor(segment),
      url: navigable ? `${baseURL}${acc}/` : undefined,
    });
  });

  return items;
}

/**
 * Construye el JSON-LD BreadcrumbList para una ruta.
 * Devuelve null en la home.
 */
export function buildBreadcrumb(pathname: string, baseURL = BASE_URL) {
  const items = breadcrumbItems(pathname, baseURL);
  if (!items) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      // El JSON-LD referencia siempre la URL canonica; para el item actual usamos su propia URL.
      ...(item.url
        ? { item: item.url }
        : index === items.length - 1
          ? { item: `${baseURL}${pathname.endsWith('/') ? pathname : pathname + '/'}` }
          : {}),
    })),
  };
}
