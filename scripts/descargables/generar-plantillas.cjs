// scripts/descargables/generar-plantillas.cjs
// Genera las plantillas Word descargables (SOP e instrucción de trabajo) en
// src/descargables/. Plan: PLAN_RECURSOS_SOP_IT_2026-09.md.
//
// Se regeneran desde aquí en vez de editarse a mano, para que un cambio de marca o
// de pie se aplique a las dos a la vez.
//
// `docx` no es dependencia del sitio, así que no está en package.json:
//   npm i --no-save docx && node scripts/descargables/generar-plantillas.cjs

const fs = require('node:fs')
const path = require('node:path')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, AlignmentType, LevelFormat, Header, Footer, PageNumber,
  TabStopType, HeightRule, VerticalAlign,
} = require('docx')

const OUT_DIR = path.join(__dirname, '..', '..', 'src', 'descargables')

// ── Marca y medidas ───────────────────────────────────────────────────────────
// A4 con márgenes de 1,8 cm (1020 DXA). Ancho útil: 11906 - 2 * 1020 = 9866 DXA.
// Toda tabla suma exactamente ANCHO en sus columnas.
const ANCHO = 9866
const NARANJA = 'F4521E'
const TINTA = '0A0A0A'
const GRIS_TEXTO = '6B6B6B'
const GRIS_FONDO = 'F2F2F2'
const BORDE = 'BFBFBF'
const FUENTE = 'Arial'
// Las casillas necesitan una fuente que traiga los glifos; Arial no los tiene.
const FUENTE_SIMBOLOS = 'Segoe UI Symbol'

// ── Texto ─────────────────────────────────────────────────────────────────────
// Convierte una cadena en runs:
//   · `☐` y `☒` en la fuente de símbolos;
//   · `[entre corchetes]` en gris y cursiva: son los valores que el usuario tiene
//     que sacar de su manual. En los ejemplos es lo que evita cifras inventadas.
function runs(texto, { size = 20, bold = false, color = TINTA } = {}) {
  return String(texto)
    .split(/(\[[^\]]*\]|[☐☒])/)
    .filter(Boolean)
    .map(trozo => {
      if (trozo === '☐' || trozo === '☒') {
        return new TextRun({ text: trozo, font: FUENTE_SIMBOLOS, size: size + 2, color })
      }
      if (trozo.startsWith('[')) {
        return new TextRun({ text: trozo, font: FUENTE, size, italics: true, color: GRIS_TEXTO })
      }
      return new TextRun({ text: trozo, font: FUENTE, size, bold, color })
    })
}

const p = (texto, opts = {}) =>
  new Paragraph({
    children: runs(texto, opts),
    spacing: { after: opts.after ?? 100, before: opts.before ?? 0 },
    alignment: opts.align,
  })

const titulo = (texto, { saltoAntes = false } = {}) =>
  new Paragraph({
    pageBreakBefore: saltoAntes,
    spacing: { after: 60 },
    children: [new TextRun({ text: texto, font: FUENTE, size: 36, bold: true, color: TINTA })],
  })

const subtitulo = texto =>
  new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: NARANJA, space: 6 } },
    children: [new TextRun({ text: texto, font: FUENTE, size: 21, color: GRIS_TEXTO })],
  })

const seccion = (texto, { compacta = false } = {}) =>
  new Paragraph({
    keepNext: true,
    spacing: { before: compacta ? 120 : 220, after: compacta ? 50 : 80 },
    children: [new TextRun({ text: texto.toUpperCase(), font: FUENTE, size: 19, bold: true, color: NARANJA })],
  })

const numerado = (texto, ref) =>
  new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 }, children: runs(texto) })

const vineta = texto =>
  new Paragraph({ numbering: { reference: 'vinetas', level: 0 }, spacing: { after: 60 }, children: runs(texto) })

// ── Tablas ────────────────────────────────────────────────────────────────────
const bordes = {
  top: { style: BorderStyle.SINGLE, size: 4, color: BORDE },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDE },
  left: { style: BorderStyle.SINGLE, size: 4, color: BORDE },
  right: { style: BorderStyle.SINGLE, size: 4, color: BORDE },
}

function celda(texto, ancho, { cabecera = false, etiqueta = false, centrar = false, size = 17 } = {}) {
  const sombreada = cabecera || etiqueta
  return new TableCell({
    width: { size: ancho, type: WidthType.DXA },
    borders: bordes,
    verticalAlign: VerticalAlign.CENTER,
    shading: sombreada ? { type: ShadingType.CLEAR, color: 'auto', fill: GRIS_FONDO } : undefined,
    margins: { top: 40, bottom: 40, left: 90, right: 90 },
    children: [
      new Paragraph({
        alignment: centrar ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: runs(texto, { size, bold: sombreada }),
      }),
    ],
  })
}

// Tabla con fila de cabecera (repetida si la tabla salta de página) y filas de datos.
// `filas` es una lista de listas de textos; `vacias` añade filas en blanco para rellenar.
function tabla(columnas, filas, { cabecera, vacias = 0, alto = 330, centrar = [] } = {}) {
  const anchos = columnas
  const suma = anchos.reduce((a, b) => a + b, 0)
  if (suma !== ANCHO) throw new Error(`Columnas suman ${suma}, deben sumar ${ANCHO}`)

  const todas = [...filas, ...Array.from({ length: vacias }, () => anchos.map(() => ''))]
  const rows = []
  if (cabecera) {
    rows.push(new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: cabecera.map((t, i) => celda(t, anchos[i], { cabecera: true, centrar: centrar.includes(i) })),
    }))
  }
  for (const fila of todas) {
    rows.push(new TableRow({
      cantSplit: true,
      height: { value: alto, rule: HeightRule.ATLEAST },
      children: fila.map((t, i) => celda(t, anchos[i], { centrar: centrar.includes(i) })),
    }))
  }
  return new Table({ width: { size: ANCHO, type: WidthType.DXA }, columnWidths: anchos, rows })
}

// Tabla de dos columnas «etiqueta | valor» (o cuatro: dos pares por fila).
function ficha(pares, { alto = 330 } = {}) {
  const cuatro = pares[0].length === 4
  const anchos = cuatro ? [1900, 3033, 1900, 3033] : [2300, 7566]
  const rows = pares.map(fila => new TableRow({
    cantSplit: true,
    height: { value: alto, rule: HeightRule.ATLEAST },
    children: fila.map((t, i) => celda(t, anchos[i], { etiqueta: i % 2 === 0 })),
  }))
  return new Table({ width: { size: ANCHO, type: WidthType.DXA }, columnWidths: anchos, rows })
}

// Caja destacada: una celda con filete naranja a la izquierda.
function caja(tituloCaja, parrafos) {
  return new Table({
    width: { size: ANCHO, type: WidthType.DXA },
    columnWidths: [ANCHO],
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        width: { size: ANCHO, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FFF4EF' },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          left: { style: BorderStyle.SINGLE, size: 24, color: NARANJA },
        },
        margins: { top: 140, bottom: 100, left: 200, right: 200 },
        children: [
          new Paragraph({ spacing: { after: 80 }, children: runs(tituloCaja, { bold: true }) }),
          ...parrafos.map(t => p(t, { size: 19, after: 60 })),
        ],
      })],
    })],
  })
}

// Aviso de una sola línea de párrafo, con la etiqueta en negrita delante. Más compacto
// que caja(): lo usan las páginas de ejemplo, que tienen que caber en una hoja.
function aviso(etiqueta, texto) {
  return new Table({
    width: { size: ANCHO, type: WidthType.DXA },
    columnWidths: [ANCHO],
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        width: { size: ANCHO, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FFF4EF' },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          left: { style: BorderStyle.SINGLE, size: 24, color: NARANJA },
        },
        margins: { top: 80, bottom: 80, left: 200, right: 200 },
        children: [new Paragraph({ children: [...runs(etiqueta + ' ', { size: 18, bold: true }), ...runs(texto, { size: 18 })] })],
      })],
    })],
  })
}

const espacio = (after = 120) => new Paragraph({ spacing: { after }, children: [] })

// Cajetín de aprobación, común a SOP e IT.
const aprobacion = (nombres = ['', '', ''], alto = 360) =>
  tabla([1900, 2655, 2655, 2656], [
    ['Nombre', ...nombres],
    ['Firma', '', '', ''],
    ['Fecha', '', '', ''],
  ], { cabecera: ['', 'Elaborado', 'Revisado', 'Aprobado'], alto })

// ── Documento ─────────────────────────────────────────────────────────────────
function documento(nombreCorto, hijos) {
  return new Document({
    creator: 'REELEVO · gmvsolutions.es',
    title: nombreCorto,
    styles: { default: { document: { run: { font: FUENTE, size: 20, color: TINTA } } } },
    numbering: {
      config: [
        { reference: 'vinetas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
        { reference: 'pasos', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 400, hanging: 300 } }, run: { bold: true, color: NARANJA } } }] },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1020, bottom: 1020, left: 1020, right: 1020, header: 500, footer: 500 },
        },
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: ANCHO }],
          children: [
            new TextRun({ text: nombreCorto, font: FUENTE, size: 16, color: GRIS_TEXTO }),
            new TextRun({ text: '\tREELEVO', font: FUENTE, size: 16, bold: true, color: NARANJA }),
          ],
        })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: ANCHO }],
          children: [
            new TextRun({ text: 'Plantilla gratuita de REELEVO · gmvsolutions.es', font: FUENTE, size: 15, color: GRIS_TEXTO }),
            new TextRun({ children: ['\tPágina ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES], font: FUENTE, size: 15, color: GRIS_TEXTO }),
          ],
        })] }),
      },
      children: hijos,
    }],
  })
}

const AVISO_EJEMPLO =
  'Los valores entre corchetes salen del manual del fabricante de tu máquina y de tu evaluación de riesgos. No copies cifras de un ejemplo en un documento que se va a usar en planta.'

// ══════════════════════════════════════════════════════════════════════════════
// PLANTILLA DE SOP
// ══════════════════════════════════════════════════════════════════════════════
function paginaSop({ ejemplo }) {
  const e = (vacio, relleno) => (ejemplo ? relleno : vacio)
  const C = { compacta: true }
  // En el ejemplo el texto ya está escrito: no hace falta hueco para rellenar a mano,
  // y así cabe en una página.
  const alto = ejemplo ? 260 : undefined
  return [
    ficha([
      ['Proceso', e('', 'Preventivo de la prensa PH-02'), 'Código', e('SOP-', 'SOP-MAN-004')],
      ['Área / línea', e('', 'Estampación, línea 2'), 'Versión', e('', '00')],
      ['Máquina o puesto', e('', 'Prensa hidráulica PH-02'), 'Fecha', e('', '[dd/mm/aaaa]')],
    ]),

    // Seis bloques, los mismos que promete el FAQ de /blog/plantilla-sop-produccion/.
    // «Cuándo se aplica» y «Registros» viven dentro del 1 para que el SOP quepa en una
    // página, que es lo que también promete el artículo.
    seccion('1. Objetivo y alcance', C),
    ficha([
      ['Qué cubre', e('', 'Las revisiones semanales, mensuales y anuales de la prensa PH-02 y su registro.')],
      ['Qué no cubre', e('', 'Averías y reparaciones (van por orden de trabajo correctiva) y el cambio de utillaje.')],
      ['Cuándo se aplica', e('', 'Semanal, mensual y anual (parada de agosto). Y tras cualquier avería hidráulica.')],
      ['Registros que genera', e('', 'Hoja semanal PH-02 · OT de cada cambio de filtro · análisis anual del aceite')],
    ], { alto: alto ?? 310 }),

    seccion('2. Pasos', C),
    tabla([500, 3350, 3316, 900, 1800], ejemplo ? [
      ['1', 'Consigna la prensa (bloqueo de la planta)', 'No arranca desde el panel', '☒', 'IT-SEG-001'],
      ['2', 'Revisa el nivel de aceite (semanal)', 'Nivel entre las marcas mín. y máx.', '☐', '—'],
      ['3', 'Inspecciona latiguillos y racores', 'No hay fugas, grietas ni rozaduras', '☒', '—'],
      ['4', 'Prueba las barreras (semanal)', 'Para al cortar la barrera', '☒', 'IT-SEG-004'],
      ['5', 'Cambia el filtro (horas del manual)', 'Indicador de colmatación en verde', '☒', 'IT-MAN-012'],
      ['6', 'Analiza el aceite (anual)', 'Informe dentro de límites', '☐', '—'],
    ] : [1, 2, 3, 4, 5, 6].map(n => [String(n), '', '', '☐', '']),
    { alto, cabecera: ['#', 'Acción (empieza por un verbo)', 'Comprueba que…', 'Crítico', 'IT relacionada'], centrar: [0, 3] }),

    seccion('3. Parámetros clave', C),
    tabla([2200, 1500, 1500, 2966, 1700], ejemplo ? [
      ['Nivel de aceite', 'Entre marcas', '—', 'Visor en zona verde', 'Visual'],
      ['Presión de trabajo', '[manual, bar]', '[manual]', 'Dentro de rango', 'Manómetro'],
      ['Cambio de filtro', '[manual, h]', '—', 'Horas de uso ≤ intervalo', 'Contador horario'],
    ] : [], { alto, cabecera: ['Parámetro', 'Nominal', 'Tolerancia', 'Criterio de aceptación', 'Instrumento'], vacias: ejemplo ? 0 : 3 }),

    seccion('4. Si algo falla', C),
    tabla([2366, 2300, 3200, 2000], ejemplo ? [
      ['Fuga en un racor', 'Apriete o junta', 'Parar y consignar, sin reapretar', 'Mantenimiento'],
      ['Barrera que no para', 'Fallo de seguridad', 'Fuera de servicio y señalizada', 'Mantenimiento y PRL'],
    ] : [], { alto, cabecera: ['Incidencia', 'Causa probable', 'Primera acción', 'A quién avisar'], vacias: ejemplo ? 0 : 3 }),

    seccion('5. Responsables y aprobación', C),
    tabla([1900, 3000, 4966], ejemplo ? [
      ['Ejecuta', 'Técnico de mantenimiento', 'Hace las revisiones y las registra'],
      ['Supervisa', 'Jefe de mantenimiento', 'Revisa el registro semanal y planifica las anuales'],
      ['Valida', 'Responsable de calidad', 'Comprueba que se cumplen las frecuencias'],
    ] : [['Ejecuta', '', ''], ['Supervisa', '', ''], ['Valida', '', '']],
    { alto: alto ?? 300, cabecera: ['Rol', 'Nombre o puesto', 'Qué hace'] }),
    espacio(60),
    aprobacion(ejemplo ? ['[técnico]', '[jefe de mantenimiento]', '[calidad]'] : undefined, alto),
  ]
}

function plantillaSop() {
  return documento('Plantilla de SOP de producción', [
    // ── Página 1 · Cómo usarla
    titulo('Plantilla de SOP de producción'),
    subtitulo('Un procedimiento operativo estándar de una página, para rellenar con quien hace el trabajo.'),

    seccion('Antes de empezar: ¿SOP o instrucción de trabajo?'),
    p('Un SOP ordena un proceso completo (qué se hace, quién lo hace, cuándo y con qué criterios) para que el resultado sea el mismo lo haga quien lo haga. Una instrucción de trabajo resuelve una sola tarea en un puesto: el gesto, la herramienta, el valor. Un SOP suele apoyarse en varias instrucciones.'),
    p('La pregunta que decide: ¿qué pasa si mañana falta quien sabe hacerlo? Si el turno se desordena, ese proceso necesita un SOP. Si es una tarea puntual y de poco riesgo, basta una instrucción de trabajo.', { bold: true }),

    seccion('Cómo rellenarla en cinco pasos'),
    numerado('Empieza por los 3 a 5 procesos donde más duele depender de una persona o donde más reprocesos hay. Cinco SOPs que se usan valen más que cincuenta que nadie consulta.', 'pasos'),
    numerado('Rellénala con quien hace el trabajo, no desde un despacho. Pídele que ejecute el proceso mientras lo explica, y anota tú. Lo valioso es lo que el veterano hace sin darse cuenta.', 'pasos'),
    numerado('Escribe cada paso con un verbo y su comprobación: «Comprueba que…». Si una palabra no basta, añade una foto.', 'pasos'),
    numerado('Marca los pasos críticos: los que, si se saltan, provocan un defecto o un riesgo.', 'pasos'),
    numerado('Pon código, versión y fecha antes de imprimir, y deja el SOP donde se trabaja, no en una carpeta del servidor.', 'pasos'),

    seccion('Errores que la vuelven inútil'),
    vineta('Demasiado larga. Si no cabe en una página, probablemente son dos procesos.'),
    vineta('Escrita por quien no la ejecuta. Se pierden los detalles reales del puesto.'),
    vineta('Sin versión ni fecha. Conviven varias copias y nadie sabe cuál vale.'),
    vineta('Revisada por calendario. Un SOP se actualiza cuando cambia el proceso, cuando aparece una incidencia que no cubría o cuando alguien descubre una forma mejor.'),

    espacio(160),
    caja('Lo que esta plantilla no hace por ti', [
      'Un SOP en Word es correcto el día que lo imprimes. Después el proceso cambia, entra gente nueva y llega una auditoría, y aparecen tres preguntas que el papel no contesta solo: ¿cuál es la versión vigente?, ¿quién ha leído esta versión?, ¿qué ha cambiado respecto a la anterior?',
      'Para eso están el control de cambios y el registro de lectura de la página 3. Mantenerlos al día a mano es la parte difícil.',
      'REELEVO lleva el SOP al puesto con un QR, avisa de cada cambio y registra quién lo ha leído. Más en gmvsolutions.es',
    ]),

    // ── Página 2 · El SOP en blanco
    titulo('SOP', { saltoAntes: true }),
    ...paginaSop({ ejemplo: false }),

    // ── Página 3 · Control
    titulo('Control de cambios y registro de lectura', { saltoAntes: true }),
    subtitulo('Son las dos tablas que pide un auditor y las primeras que se quedan sin rellenar.'),
    seccion('Control de cambios'),
    tabla([1000, 1300, 3566, 2200, 1800], [['00', '', 'Emisión inicial', '', '']],
      { cabecera: ['Versión', 'Fecha', 'Qué ha cambiado', 'Motivo', 'Aprobado por'], vacias: 7, alto: 400, centrar: [0] }),
    seccion('Registro de lectura'),
    p('Cada persona que ejecuta este proceso firma que ha leído la versión vigente. Cuando cambia la versión, se vuelve a firmar.', { size: 19 }),
    tabla([2800, 2000, 1400, 1500, 2166], [],
      { cabecera: ['Nombre', 'Puesto', 'Versión leída', 'Fecha', 'Firma'], vacias: 12, alto: 430 }),

    // ── Página 4 · Ejemplo
    titulo('Ejemplo: preventivo de una prensa', { saltoAntes: true }),
    aviso('Ejemplo orientativo. Su paso 5 remite a la instrucción IT-MAN-012.', AVISO_EJEMPLO),
    espacio(60),
    ...paginaSop({ ejemplo: true }),
  ])
}

// ══════════════════════════════════════════════════════════════════════════════
// PLANTILLA DE INSTRUCCIÓN DE TRABAJO
// ══════════════════════════════════════════════════════════════════════════════
function paginaIt({ ejemplo }) {
  const e = (vacio, relleno) => (ejemplo ? relleno : vacio)
  const C = { compacta: true }
  const epis = ejemplo
    ? [['☒ Gafas de protección', '☒ Guantes resistentes a aceites', '☒ Calzado de seguridad', '☐ Protección auditiva'],
       ['☐ Pantalla facial', '☒ Ropa ajustada, sin anillos', '☐ Mascarilla', '☐ Otro:']]
    : [['☐ Gafas de protección', '☐ Guantes', '☐ Calzado de seguridad', '☐ Protección auditiva'],
       ['☐ Pantalla facial', '☐ Ropa ajustada, sin anillos', '☐ Mascarilla', '☐ Otro:']]

  return [
    ficha([
      ['Tarea', e('', 'Sustitución del filtro hidráulico de retorno'), 'Código', e('IT-', 'IT-MAN-012')],
      ['Área / línea / puesto', e('', 'Estampación · línea 2 · prensa PH-02'), 'Revisión', '00'],
      ['Máquina (marca y modelo)', e('', 'Prensa hidráulica [marca y modelo]'), 'Fecha de emisión', e('', '[dd/mm/aaaa]')],
      ['Categoría del operario', e('', 'Técnico de mantenimiento'), 'Tiempo estimado', e('', '30 min')],
    ]),

    seccion('1. Objeto y alcance', C),
    ficha([
      ['Objeto', e('', 'Cambiar el filtro de retorno sin contaminar el aceite ni dejar presión residual en el circuito.')],
      ['Alcance', e('', 'Prensa PH-02. Es el paso 5 del SOP-MAN-004.')],
    ]),

    seccion('2. EPIs obligatorios', C),
    new Table({
      width: { size: ANCHO, type: WidthType.DXA },
      columnWidths: [2466, 2467, 2466, 2467],
      rows: epis.map(fila => new TableRow({
        cantSplit: true,
        children: fila.map((t, i) => celda(t, [2466, 2467, 2466, 2467][i])),
      })),
    }),

    seccion('3. Herramientas, útiles y materiales', C),
    tabla([4933, 4933], ejemplo ? [
      ['Filtro de recambio', '[referencia del fabricante]'],
      ['Llave dinamométrica', '[rango que cubra el par del manual]'],
      ['Bandeja de recogida y trapos', '—'],
    ] : [], { cabecera: ['Elemento', 'Referencia o medida'], vacias: ejemplo ? 0 : 3 }),

    seccion('4. Parámetros de proceso', C),
    tabla([3000, 2000, 1500, 3366], ejemplo ? [
      ['Par de apriete de la carcasa', '[manual]', 'N·m', '[manual]'],
      ['Presión antes de abrir el circuito', '0', 'bar', 'Ninguna: tiene que marcar 0'],
    ] : [], { cabecera: ['Parámetro', 'Valor', 'Unidad', 'Tolerancia'], vacias: ejemplo ? 0 : 3 }),

    seccion('5. Pasos', C),
    tabla([500, 4400, 3466, 1500], ejemplo ? [
      ['1', 'Consigna la prensa según la IT-SEG-001 (bloqueo y etiquetado)', '[Foto del candado puesto]', '☒'],
      ['2', 'Descarga la presión y comprueba que el manómetro marca 0', '[Foto del manómetro]', '☒'],
      ['3', 'Coloca la bandeja bajo la carcasa del filtro', '[Foto]', '☐'],
      ['4', 'Afloja la carcasa y retira el filtro usado', '[Foto]', '☐'],
      ['5', 'Comprueba que la referencia del filtro nuevo es la del manual y cambia la junta', '[Foto de la etiqueta]', '☒'],
      ['6', 'Aprieta la carcasa con la llave dinamométrica al par del manual', '[Foto]', '☒'],
    ] : [1, 2, 3, 4, 5, 6].map(n => [String(n), '', '[Foto del paso]', '☐']),
    { cabecera: ['#', 'Paso (empieza por un verbo)', 'Foto', 'Crítico'], alto: ejemplo ? 700 : 1000, centrar: [0, 2, 3] }),

    seccion('6. Autocontrol', C),
    tabla([2400, 1600, 1700, 1500, 2666], ejemplo ? [
      ['Fugas en la carcasa', 'Visual', 'Tras arrancar, 5 min en vacío', 'Ninguna', 'Parar, consignar y avisar'],
      ['Indicador de colmatación', 'Visual', 'Tras el cambio', 'En verde', 'Revisar el montaje del filtro'],
    ] : [], { cabecera: ['Qué se comprueba', 'Instrumento', 'Frecuencia', 'Tolerancia', 'Si está fuera'], vacias: ejemplo ? 0 : 3 }),

    seccion('7. Ante una anomalía', C),
    ficha([
      ['Qué se para', e('', 'La prensa, que queda consignada.')],
      ['A quién se avisa', e('', 'Jefe de mantenimiento [nombre y extensión]')],
      ['Qué no se hace', e('', 'Apretar o aflojar racores con el circuito bajo presión.')],
    ]),

    seccion('8. Documentos asociados', C),
    ficha([
      ['SOP del que forma parte', e('', 'SOP-MAN-004 · Mantenimiento preventivo de la prensa PH-02')],
      ['Registros', e('', 'Orden de trabajo con las horas del contador y la referencia del filtro montado')],
    ]),

    seccion('9. Aprobación', C),
    aprobacion(ejemplo ? ['[técnico]', '[jefe de mantenimiento]', '[prevención]'] : undefined),
  ]
}

function plantillaIt() {
  return documento('Plantilla de instrucción de trabajo', [
    // ── Página 1 · Cómo usarla
    titulo('Plantilla de instrucción de trabajo'),
    subtitulo('Una tarea, un puesto: el gesto, la herramienta y el valor, para consultar con las manos ocupadas.'),

    seccion('Qué es una instrucción de trabajo'),
    p('Explica cómo se hace una tarea concreta en un puesto concreto: cómo amarrar esta pieza, cómo arrancar esta línea, cómo cambiar este filtro. Es corta y operativa.'),
    p('Si lo que necesitas es ordenar un proceso completo, con responsables y frecuencias, eso es un SOP, y un SOP suele apoyarse en varias instrucciones como esta.'),

    seccion('Seis reglas'),
    numerado('Una tarea, un puesto. Si la instrucción vale para dos máquinas distintas, son dos instrucciones.', 'pasos'),
    numerado('Un paso por línea, empezando por un verbo: «Afloja», «Comprueba», «Retira».', 'pasos'),
    numerado('Una foto por paso. Donde la foto lo explica, sobran palabras.', 'pasos'),
    numerado('Marca los puntos críticos: lo que, si se hace mal, provoca un defecto o un accidente.', 'pasos'),
    numerado('Di qué hay que comprobar y qué hacer si sale fuera. Un autocontrol sin reacción no sirve.', 'pasos'),
    numerado('Rellénala con el operario que mejor hace la tarea, delante de la máquina.', 'pasos'),

    seccion('Dónde tiene que estar'),
    p('En el puesto, a la vista y en su versión vigente. Una instrucción guardada en una carpeta del servidor no se consulta en el momento en que hace falta.'),

    espacio(160),
    caja('Lo que esta plantilla no hace por ti', [
      'Esta instrucción es correcta el día que la cuelgas en la máquina. El día que cambian el útil, el papel sigue diciendo lo de antes, y nadie lo sabe hasta que alguien lo sigue al pie de la letra.',
      'El histórico de revisiones y el acuse de lectura existen para eso, y son lo primero que se queda sin rellenar.',
      'REELEVO pone la instrucción en el puesto con un QR que siempre abre la versión vigente, con vídeo de cada paso y registro de quién la ha leído. Más en gmvsolutions.es',
    ]),

    // ── Páginas 2-3 · La IT en blanco
    titulo('Instrucción de trabajo', { saltoAntes: true }),
    ...paginaIt({ ejemplo: false }),

    // ── Control
    titulo('Histórico de revisiones y acuse de lectura', { saltoAntes: true }),
    subtitulo('Una instrucción que cambia sin dejar rastro deja de ser fiable. Estas dos tablas son ese rastro.'),
    seccion('Histórico de revisiones'),
    tabla([900, 1300, 3866, 2000, 1800], [['00', '', 'Emisión inicial', '', '']],
      { cabecera: ['Rev.', 'Fecha', 'Qué ha cambiado', 'Motivo', 'Aprobado por'], vacias: 7, alto: 400, centrar: [0] }),
    seccion('Acuse de lectura del operario'),
    p('Firmo que he leído esta instrucción, la he entendido y me han enseñado a hacerla en el puesto.', { size: 19 }),
    tabla([3000, 1400, 1500, 1800, 2166], [],
      { cabecera: ['Nombre', 'Rev. leída', 'Fecha', 'Formado por', 'Firma'], vacias: 12, alto: 430 }),

    // ── Ejemplo
    titulo('Ejemplo: cambio del filtro hidráulico', { saltoAntes: true }),
    aviso('Ejemplo orientativo. Es el paso 5 del SOP-MAN-004.', AVISO_EJEMPLO),
    espacio(60),
    ...paginaIt({ ejemplo: true }),
  ])
}

// ── Salida ────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const salidas = [
    ['plantilla-sop-produccion-reelevo.docx', plantillaSop()],
    ['plantilla-instruccion-de-trabajo-reelevo.docx', plantillaIt()],
  ]
  for (const [nombre, doc] of salidas) {
    const destino = path.join(OUT_DIR, nombre)
    fs.writeFileSync(destino, await Packer.toBuffer(doc))
    console.log('generado', path.relative(process.cwd(), destino))
  }
}

main().catch(err => { console.error(err); process.exit(1) })
