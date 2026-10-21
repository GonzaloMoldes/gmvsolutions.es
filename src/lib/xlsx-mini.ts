// Escritor minimo de .xlsx para el navegador, sin dependencias. Lo usa el
// generador de /recursos/matriz-de-polivalencia/ para descargar la matriz que
// el visitante ha rellenado sin mandar nada a ningun servidor.
//
// Genera un ZIP sin compresion (metodo "store") con las partes minimas de
// SpreadsheetML: celdas de texto en linea (inlineStr), numeros y una fila de
// cabecera en negrita. Suficiente para Excel, LibreOffice y Google Sheets.

export type Celda = string | number | null;
export interface Hoja {
  nombre: string;
  filas: Celda[][];
  /** Ancho de columna (en caracteres), por indice. */
  anchos?: number[];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const col = (i: number) => {
  let s = '';
  for (i += 1; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
  return s;
};

function hojaXml(h: Hoja): string {
  const cols = h.anchos?.length
    ? `<cols>${h.anchos.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>`
    : '';
  const filas = h.filas
    .map((fila, r) => {
      const celdas = fila
        .map((v, c) => {
          if (v === null || v === '') return '';
          const ref = `${col(c)}${r + 1}`;
          const s = r === 0 ? ' s="1"' : '';
          return typeof v === 'number'
            ? `<c r="${ref}"${s}><v>${v}</v></c>`
            : `<c r="${ref}" t="inlineStr"${s}><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
        })
        .join('');
      return `<row r="${r + 1}">${celdas}</row>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols}<sheetData>${filas}</sheetData></worksheet>`;
}

function partes(hojas: Hoja[]): [string, string][] {
  const ct = hojas.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('');
  const rels = hojas.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('');
  const sheets = hojas.map((h, i) => `<sheet name="${esc(h.nombre.slice(0, 31))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('');
  return [
    ['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${ct}</Types>`],
    ['_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets}</sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}<Relationship Id="rId${hojas.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ['xl/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf/><xf fontId="1" applyFont="1"/></cellXfs></styleSheet>`],
    ...hojas.map((h, i): [string, string] => [`xl/worksheets/sheet${i + 1}.xml`, hojaXml(h)]),
  ];
}

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (b: Uint8Array) => {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

/** Empaqueta las partes en un ZIP sin compresion. */
function zip(archivos: [string, string][]): Uint8Array {
  const enc = new TextEncoder();
  const locales: Uint8Array[] = [];
  const centrales: Uint8Array[] = [];
  let offset = 0;
  for (const [nombre, contenido] of archivos) {
    const n = enc.encode(nombre);
    const d = enc.encode(contenido);
    const crc = crc32(d);
    const loc = new Uint8Array(30 + n.length);
    const lv = new DataView(loc.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true);
    lv.setUint16(12, 0x21, true); lv.setUint32(14, crc, true); lv.setUint32(18, d.length, true); lv.setUint32(22, d.length, true);
    lv.setUint16(26, n.length, true); loc.set(n, 30);
    const cen = new Uint8Array(46 + n.length);
    const cv = new DataView(cen.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
    cv.setUint16(14, 0x21, true); cv.setUint32(16, crc, true); cv.setUint32(20, d.length, true); cv.setUint32(24, d.length, true);
    cv.setUint16(28, n.length, true); cv.setUint32(42, offset, true); cen.set(n, 46);
    locales.push(loc, d); centrales.push(cen);
    offset += loc.length + d.length;
  }
  const tamCentral = centrales.reduce((s, c) => s + c.length, 0);
  const fin = new Uint8Array(22);
  const fv = new DataView(fin.buffer);
  fv.setUint32(0, 0x06054b50, true); fv.setUint16(8, archivos.length, true); fv.setUint16(10, archivos.length, true);
  fv.setUint32(12, tamCentral, true); fv.setUint32(16, offset, true);
  const partesZip = [...locales, ...centrales, fin];
  const out = new Uint8Array(partesZip.reduce((s, p) => s + p.length, 0));
  let o = 0;
  for (const p of partesZip) { out.set(p, o); o += p.length; }
  return out;
}

export function xlsxBlob(hojas: Hoja[]): Blob {
  return new Blob([zip(partes(hojas))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
