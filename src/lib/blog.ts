import { getArticulos } from './sanity';
// Registro unico de los articulos del blog. Es la FUENTE DE VERDAD para:
//   - /blog/        indice por cluster (src/pages/blog/index.astro)
//   - /sitemap.xml  entradas del blog (src/pages/sitemap.xml.ts)
//   - /llms.txt     listado para agentes de IA (src/pages/llms.txt.ts)
//
// Antes cada uno mantenia su propia lista y se desincronizaban en silencio: en
// agosto de 2026, /llms.txt escondia 8 articulos publicados a los sistemas de IA.
// Ahora hay una sola lista y la comprobacion del final del fichero rompe el build
// si un .astro del blog no esta registrado (o si hay una entrada sin fichero).
//
// Anadir un articulo = crear su .astro + anadir su entrada aqui. No hay tercer sitio.

/** Fecha de la revision SEO/GEO del blog (auditoria 2026-07-27). */
export const REVISION = '2026-07-27';

/** Descripcion del blog principal, usada en /llms.txt. */
export const BASE_BLOG_LABEL =
  'Guias practicas sobre documentacion operativa, SOP, onboarding de operarios y continuidad en planta para pymes industriales';

export type ClusterKey =
  | 'sop'
  | 'onboarding'
  | 'conocimiento'
  | 'absentismo'
  | 'trazabilidad'
  | 'lean'
  | 'digitalizacion'
  | 'medicion';

export interface BlogPost {
  /** Nombre del fichero en src/pages/blog/ sin extension. Define la URL. */
  slug: string;
  cluster: ClusterKey;
  /** Etiqueta de la tarjeta del indice. Puede diferir del `category` del articulo. */
  category: string;
  /** Titulo de tarjeta. Es una version corta del <title> real en varios articulos. */
  title: string;
  /** Resumen de tarjeta y descripcion en /llms.txt. */
  desc: string;
  /** Fecha ya formateada para la tarjeta del indice. */
  dateLabel: string;
  readTime: string;
  /** lastmod del sitemap: REVISION si se reviso en la auditoria, o su fecha real. */
  lastmod: string;
  /** priority del sitemap. */
  priority: string;
  /** 'sanity' si el articulo viene del gestor de contenidos (ruta blog/[slug].astro). */
  origen?: 'codigo' | 'sanity';
}

export interface Cluster {
  key: ClusterKey;
  label: string;
}

export const clusters: Cluster[] = [
  { key: 'sop', label: 'SOP y documentación de procesos' },
  { key: 'onboarding', label: 'Onboarding de operarios' },
  { key: 'conocimiento', label: 'Competencias y conocimiento' },
  { key: 'absentismo', label: 'Absentismo y continuidad' },
  { key: 'trazabilidad', label: 'Trazabilidad y calidad' },
  { key: 'lean', label: 'Lean Manufacturing y mejora continua' },
  { key: 'digitalizacion', label: 'Digitalización de la producción' },
  { key: 'medicion', label: 'Medición y control de producción' },
];

/** Articulos escritos en codigo (src/pages/blog/*.astro). */
const postsCodigo: BlogPost[] = [
  {
    slug: 'que-es-un-sop-industrial',
    cluster: 'sop',
    category: 'Procedimientos Operativos',
    title: 'Qué es un SOP industrial y cómo implementarlo en tu planta',
    desc: 'Guía completa sobre procedimientos operativos estándar para pymes industriales. Qué son, por qué importan, cómo crearlos y qué herramientas usar.',
    dateLabel: '18 mar. 2026',
    readTime: '12 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'instrucciones-de-trabajo-en-video',
    cluster: 'sop',
    category: 'Procedimientos Operativos',
    title: 'Cómo crear instrucciones de trabajo en vídeo',
    desc: 'Cuándo el vídeo funciona mejor que el texto y cuándo no, cuánto debe durar, cómo grabarlo en planta y cómo evitar que quede obsoleto en seis meses.',
    dateLabel: '20 ago. 2026',
    readTime: '11 min.',
    lastmod: '2026-08-20',
    priority: '0.8',
  },
  {
    slug: 'qr-instrucciones-de-trabajo',
    cluster: 'sop',
    category: 'Procedimientos Operativos',
    title: 'Cómo usar códigos QR para las instrucciones de trabajo',
    desc: 'Cómo funciona un QR en la máquina para dar al operario el procedimiento correcto: qué resuelve, qué información muestra, límites y cómo implantarlo.',
    dateLabel: '20 ago. 2026',
    readTime: '12 min.',
    lastmod: '2026-08-20',
    priority: '0.8',
  },
  {
    slug: 'onboarding-software-pymes',
    cluster: 'onboarding',
    category: 'Onboarding Software',
    title: 'Onboarding software para pymes: guía completa 2026',
    desc: 'Qué es un onboarding software, cómo ordena la incorporación de operarios y qué mirar al elegirlo. Guía de compra y ROI realista para pyme industrial.',
    dateLabel: '7 abr. 2026',
    readTime: '12 min.',
    lastmod: REVISION,
    priority: '0.8',
  },
  {
    slug: 'onboarding-vs-tradicional',
    cluster: 'onboarding',
    category: 'Comparativa',
    title: 'Onboarding software vs métodos tradicionales',
    desc: 'Comparativa ejecutiva por escenario: coste, tiempo, calidad y gestión de competencias. Cuándo conviene cada enfoque en una pyme industrial.',
    dateLabel: '7 abr. 2026',
    readTime: '14 min.',
    lastmod: REVISION,
    priority: '0.8',
  },
  {
    slug: 'digitalizar-conocimiento-planta-industrial',
    cluster: 'conocimiento',
    category: 'Gestión del Conocimiento',
    title: 'Cómo digitalizar el conocimiento de una planta industrial',
    desc: 'Qué conocimiento existe en una planta, cuál se pierde y cómo capturarlo, digitalizarlo y mantenerlo accesible en el puesto. La guía que ordena todo el clúster.',
    dateLabel: '20 ago. 2026',
    readTime: '18 min.',
    lastmod: '2026-08-20',
    priority: '0.9',
  },
  {
    slug: 'gestion-competencias-industria',
    cluster: 'conocimiento',
    category: 'Gestión de Competencias',
    title: 'Gestión de competencias en industria: guía + plantilla',
    desc: 'Guía práctica de gestión de competencias para pymes industriales: cómo documentar y medir competencias operativas con una matriz accionable. Incluye plantilla.',
    dateLabel: '7 abr. 2026',
    readTime: '15 min.',
    lastmod: REVISION,
    priority: '0.8',
  },
  {
    slug: 'crisis-perdida-conocimiento-planta-industrial',
    cluster: 'conocimiento',
    category: 'Gestión del Conocimiento',
    title: 'Cómo prevenir una crisis de pérdida de conocimiento en tu planta',
    desc: 'Cuando un operario clave se jubila, no solo pierdes lo que sabe. Diagnóstico y plan de 90 días para proteger el conocimiento crítico de tu planta.',
    dateLabel: '24 mar. 2026',
    readTime: '14 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'documentar-conocimiento-operarios-expertos',
    cluster: 'conocimiento',
    category: 'Transferencia de Conocimiento',
    title: 'Cómo documentar el conocimiento de tus operarios expertos',
    desc: 'Guía práctica para capturar el conocimiento tácito de operarios veteranos. Método de transferencia de conocimiento operativo en 4 fases.',
    dateLabel: '10 mar. 2026',
    readTime: '14 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'coste-absentismo-pymes-industriales',
    cluster: 'absentismo',
    category: 'Análisis de Costes',
    title: 'Coste real del absentismo en pymes industriales españolas',
    desc: 'Análisis del coste directo e indirecto del absentismo en planta y cómo reducir el impacto de cada baja no cubierta. Incluye plantilla de cálculo.',
    dateLabel: '15 mar. 2026',
    readTime: '10 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'documentar-procesos-mecanizado-cnc',
    cluster: 'sop',
    category: 'Procedimientos Operativos',
    title: 'Cómo documentar procesos de mecanizado CNC paso a paso',
    desc: 'Qué capturar en arranques, parámetros, cambios de referencia y troubleshooting, y cómo dejarlo accesible en el puesto.',
    dateLabel: '19 may. 2026',
    readTime: '10 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'instrucciones-de-trabajo-vs-sop',
    cluster: 'sop',
    category: 'Procedimientos Operativos',
    title: 'Instrucciones de trabajo vs SOP: qué necesita tu taller',
    desc: 'Qué significan, en qué se diferencian y cuál necesita tu pyme industrial para reducir errores y dependencia del experto.',
    dateLabel: '21 may. 2026',
    readTime: '8 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'software-sop-para-fabricas-comparativa',
    cluster: 'sop',
    category: 'Comparativa',
    title: 'Software SOP para fábricas: cómo elegir en 2026',
    desc: 'Cinco criterios para elegir software SOP industrial: idioma, precio, implantación, adopción del operario y encaje real.',
    dateLabel: '26 may. 2026',
    readTime: '9 min.',
    lastmod: REVISION,
    priority: '0.8',
  },
  {
    slug: 'plantilla-sop-produccion',
    cluster: 'sop',
    category: 'Plantilla',
    title: 'Plantilla SOP de producción para descargar',
    desc: 'Estructura, campos imprescindibles y ejemplo. Descárgala y adáptala a los procesos críticos de tu planta.',
    dateLabel: '28 may. 2026',
    readTime: '7 min.',
    lastmod: '2026-09-24', // descarga con cuenta lead (R-7)
    priority: '0.8',
  },
  {
    slug: 'plantilla-instruccion-de-trabajo',
    cluster: 'sop',
    category: 'Plantilla',
    title: 'Plantilla de instrucción de trabajo para descargar',
    desc: 'Pasos con foto, puntos críticos, autocontrol y qué hacer ante una anomalía. Con ejemplo relleno.',
    dateLabel: '24 sept. 2026',
    readTime: '7 min.',
    lastmod: '2026-09-24',
    priority: '0.8',
  },
  {
    slug: 'sop-mantenimiento-preventivo-guia-plantilla',
    cluster: 'sop',
    category: 'Mantenimiento',
    title: 'SOP de mantenimiento preventivo: guía y plantilla',
    desc: 'Qué tareas incluir, cada cuánto y cómo integrarlo en la agenda del operario. Con plantilla.',
    dateLabel: '5 jun. 2026',
    readTime: '8 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'programa-de-mantenimiento-preventivo',
    cluster: 'sop',
    category: 'Mantenimiento',
    title: 'Programa de mantenimiento preventivo: cómo diseñarlo paso a paso',
    desc: 'Qué máquinas incluir, cómo construir el calendario, quién lo gestiona y los errores que hacen fracasar el programa a nivel de planta.',
    dateLabel: '20 sept. 2026',
    readTime: '10 min.',
    lastmod: '2026-09-20',
    priority: '0.8',
  },
  {
    slug: 'reducir-onboarding-operarios-cinco-a-un-dia',
    cluster: 'onboarding',
    category: 'Onboarding',
    title: 'Onboarding de operarios: cómo reducir la curva de 5 días a 1',
    desc: 'Acorta la curva de autonomía con el proceso en el puesto y la matriz de competencias, sin saturar al tutor.',
    dateLabel: '3 jun. 2026',
    readTime: '8 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'onboarding-digital-errores-manuales',
    cluster: 'onboarding',
    category: 'Onboarding',
    title: 'Onboarding digital en planta: cómo reducir los errores manuales',
    desc: 'Los cuatro tipos de error del operario nuevo, por qué el papel los alimenta y cómo los corta una instrucción de trabajo digitalizada en el puesto.',
    dateLabel: '27 jul. 2026',
    readTime: '9 min.',
    lastmod: REVISION,
    priority: '0.8',
  },
  {
    slug: 'errores-humanos-produccion',
    cluster: 'sop',
    category: 'Calidad',
    title: 'Errores humanos en producción: cómo reducirlos de verdad',
    desc: 'Por qué no se eliminan, los tres fallos que no se corrigen igual y la jerarquía de controles que sí funciona. Incluido el error del operario veterano.',
    dateLabel: '30 jul. 2026',
    readTime: '10 min.',
    lastmod: '2026-07-30',
    priority: '0.8',
  },
  {
    slug: 'conocimiento-tacito-taller-industrial',
    cluster: 'conocimiento',
    category: 'Gestión del Conocimiento',
    title: 'Qué es el conocimiento tácito y por qué tu taller depende de él',
    desc: 'Por qué crea dependencia de personas clave y cómo empezar a capturarlo antes de que una baja lo haga visible.',
    dateLabel: '2 jun. 2026',
    readTime: '9 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'plan-contingencia-bajas-produccion',
    cluster: 'absentismo',
    category: 'Continuidad operativa',
    title: 'Plan de contingencia para bajas en producción',
    desc: 'Detecta puestos sensibles, documenta lo crítico y cubre sin parar la línea. Con checklist.',
    dateLabel: '4 jun. 2026',
    readTime: '9 min.',
    lastmod: REVISION,
    priority: '0.75',
  },
  {
    slug: 'trazabilidad-de-un-producto',
    cluster: 'trazabilidad',
    category: 'Trazabilidad',
    title: 'Cómo saber la trazabilidad de un producto en tu fábrica',
    desc: 'Qué significa, qué datos necesitas para reconstruir su historia y cómo montarla paso a paso. Más cómo lo resuelve REELEVO pieza a pieza.',
    dateLabel: '26 jun. 2026',
    readTime: '9 min.',
    lastmod: '2026-09-30', // lotes por material (MAT en la app)
    priority: '0.75',
  },
  {
    slug: 'lean-manufacturing',
    cluster: 'lean',
    category: 'Lean Manufacturing',
    title: 'Lean Manufacturing: qué es y cómo aplicarlo en una pyme',
    desc: 'Principios, los 8 desperdicios (TIMWOODS) y las herramientas que de verdad usarás. Cómo empezar y por qué el Lean fracasa en tantas pymes.',
    dateLabel: '29 jun. 2026',
    readTime: '11 min.',
    lastmod: '2026-06-29',
    priority: '0.8',
  },
  {
    slug: 'digitalizar-produccion-pyme-industrial',
    cluster: 'digitalizacion',
    category: 'Digitalización',
    title: 'Cómo digitalizar la producción en una pyme industrial',
    desc: 'Digitalizar procesos y producción sin IoT, SCADA ni un MES. Qué se puede digitalizar, en qué orden empezar y por dónde se atasca casi todo el mundo.',
    dateLabel: '1 jul. 2026',
    readTime: '10 min.',
    lastmod: '2026-07-01',
    priority: '0.8',
  },
  {
    slug: 'twi-formacion-operarios-en-el-puesto',
    cluster: 'onboarding',
    category: 'Formación en el puesto',
    title: 'TWI: cómo formar a un operario en el puesto en 4 pasos',
    desc: 'El método de instrucción que nació en la industria de guerra y sigue vigente. Pasos importantes, puntos clave y razones, aplicado a una pyme industrial.',
    dateLabel: '17 ago. 2026',
    readTime: '11 min.',
    lastmod: '2026-08-17',
    priority: '0.75',
  },
  {
    slug: 'kpis-de-produccion-pyme-industrial',
    cluster: 'medicion',
    category: 'Medición y control',
    title: 'KPIs de producción: cuáles medir en una pyme industrial',
    desc: 'El filtro de tres preguntas antes de elegir indicador, las fórmulas que sí usarás y por qué el OEE es mala forma de empezar en una pyme.',
    dateLabel: '17 ago. 2026',
    readTime: '12 min.',
    lastmod: '2026-08-17',
    priority: '0.8',
  },
  {
    slug: 'medir-tiempos-de-produccion',
    cluster: 'medicion',
    category: 'Medición y control',
    title: 'Cómo medir tiempos de producción sin cronómetro ni MES',
    desc: 'Los tres tiempos que no son lo mismo, por qué el cronómetro engaña y cómo sacar el dato del propio registro de ejecución. La dispersión es el hallazgo.',
    dateLabel: '17 ago. 2026',
    readTime: '10 min.',
    lastmod: '2026-08-17',
    priority: '0.75',
  },
  {
    slug: '5s-en-un-taller-industrial',
    cluster: 'lean',
    category: 'Lean Manufacturing',
    title: 'Las 5S en un taller: cómo implantarlas sin que se caigan',
    desc: 'Las tres primeras eses son una acción y las dos últimas un sistema. Ahí se cae todo. Con checklist de puesto y plan de arranque.',
    dateLabel: '17 ago. 2026',
    readTime: '11 min.',
    lastmod: '2026-08-17',
    priority: '0.75',
  },
  {
    slug: 'preparar-auditoria-iso-9001-produccion',
    cluster: 'trazabilidad',
    category: 'Calidad',
    title: 'Cómo preparar una auditoría ISO 9001 en producción',
    desc: 'Qué mira el auditor en planta, los cinco hallazgos que más se repiten y un plan de cuatro semanas para llegar con la evidencia en orden.',
    dateLabel: '17 ago. 2026',
    readTime: '11 min.',
    lastmod: '2026-08-17',
    priority: '0.8',
  },
  {
    slug: 'control-de-calidad-en-excel',
    cluster: 'trazabilidad',
    category: 'Calidad',
    title: 'Control de calidad en Excel: hasta dónde llega de verdad',
    desc: 'Qué hace bien Excel, los seis puntos donde se rompe y la separación que resuelve el debate: capturar no es analizar.',
    dateLabel: '17 ago. 2026',
    readTime: '9 min.',
    lastmod: '2026-08-17',
    priority: '0.75',
  },
  {
    slug: 'trazabilidad-lotes-materia-prima',
    cluster: 'trazabilidad',
    category: 'Trazabilidad',
    title: 'Trazabilidad de lotes de materia prima',
    desc: 'Qué lote de cada material fue a cada pieza y a cada obra: qué registrar, cuándo, dónde se rompe la cadena y cómo acotar una retirada al lote defectuoso.',
    dateLabel: '30 sept. 2026',
    readTime: '11 min.',
    lastmod: '2026-09-30',
    priority: '0.8',
  },
  {
    slug: 'acuse-de-lectura-instrucciones-prl',
    cluster: 'sop',
    category: 'Documentación de procesos',
    title: 'Acuse de lectura de instrucciones de PRL o IT',
    desc: 'Cómo demostrar que cada trabajador leyó, entendió y aceptó la versión vigente, por qué la hoja de firmas no basta y cuándo hace falta firma avanzada.',
    dateLabel: '30 sept. 2026',
    readTime: '12 min.',
    lastmod: '2026-09-30',
    priority: '0.8',
  },
];

// --- Articulos de Sanity --------------------------------------------------------
// Se suman a los de codigo en build. Los marcados como borrador (noindex) tienen
// pagina pero no entran en el indice, el sitemap ni /llms.txt.
const MESES_CORTOS = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'];
const etiquetaFecha = (iso: string): string => {
  const [anio, mes, dia] = iso.split('-');
  return `${parseInt(dia, 10)} ${MESES_CORTOS[parseInt(mes, 10) - 1]} ${anio}`;
};

const articulosSanity = await getArticulos();
const slugsCodigo = new Set(postsCodigo.map((p) => p.slug));
const duplicados = articulosSanity.filter((a) => slugsCodigo.has(a.slug)).map((a) => a.slug);
if (duplicados.length) {
  throw new Error(`[blog] Articulos de Sanity con la misma URL que uno escrito en codigo: ${duplicados.join(', ')}`);
}

const postsSanity: BlogPost[] = articulosSanity
  .filter((a) => !a.noindex)
  .map((a) => ({
    slug: a.slug,
    cluster: a.cluster as ClusterKey,
    category: a.category,
    title: a.cardTitle || a.title,
    desc: a.cardDesc,
    dateLabel: etiquetaFecha(a.publishedAt),
    readTime: a.readTime || '8 min.',
    lastmod: a.updatedAt || a.publishedAt,
    priority: '0.8',
    origen: 'sanity' as const,
  }));

/** Todos los articulos publicados: los de codigo y los de Sanity. */
export const posts: BlogPost[] = [...postsCodigo, ...postsSanity];

/** URL absoluta canonica de un articulo. */
export const postUrl = (p: BlogPost) => `/blog/${p.slug}/`;

// --- Contenido nuevo ---------------------------------------------------------
/** Dias durante los que un articulo recien publicado se marca como nuevo. */
export const NEW_POST_DAYS = 7;

const MESES: Record<string, string> = {
  'ene.': '01', 'feb.': '02', 'mar.': '03', 'abr.': '04', 'may.': '05', 'jun.': '06',
  'jul.': '07', 'ago.': '08', 'sept.': '09', 'oct.': '10', 'nov.': '11', 'dic.': '12',
};

/** Fecha de publicacion ISO (YYYY-MM-DD), derivada de `dateLabel` ("30 sept. 2026"). */
export const publishedISO = (p: BlogPost): string => {
  const [dia, mes, anio] = p.dateLabel.split(' ');
  const mm = MESES[mes];
  if (!mm || !/^\d{1,2}$/.test(dia) || !/^\d{4}$/.test(anio)) {
    throw new Error(`[blog] dateLabel no reconocido en ${p.slug}: "${p.dateLabel}"`);
  }
  return `${anio}-${mm}-${dia.padStart(2, '0')}`;
};

/** Publicacion mas reciente del blog, para el aviso de contenido nuevo del menu. */
export const latestPublishedISO = posts.map(publishedISO).sort().at(-1)!;

// --- Guardia anti-deriva -----------------------------------------------------
// Se ejecuta en build. Compara el registro con los ficheros reales del directorio
// del blog y falla si no coinciden, en cualquiera de los dos sentidos.
const archivos = import.meta.glob('../pages/blog/*.astro');

const slugsEnDisco = new Set(
  Object.keys(archivos)
    .map((ruta) => ruta.replace(/^.*\/blog\//, '').replace(/\.astro$/, ''))
    .filter((slug) => slug !== 'index' && !slug.startsWith('[')),
);
const slugsRegistrados = new Set(postsCodigo.map((p) => p.slug));

const sinRegistrar = [...slugsEnDisco].filter((s) => !slugsRegistrados.has(s));
const sinFichero = [...slugsRegistrados].filter((s) => !slugsEnDisco.has(s));

if (sinRegistrar.length || sinFichero.length) {
  const partes = [
    sinRegistrar.length
      ? `articulos sin entrada en src/lib/blog.ts: ${sinRegistrar.join(', ')}`
      : '',
    sinFichero.length
      ? `entradas sin fichero .astro: ${sinFichero.join(', ')}`
      : '',
  ].filter(Boolean);
  throw new Error(`[blog] El registro y src/pages/blog/ no coinciden. ${partes.join(' | ')}`);
}
