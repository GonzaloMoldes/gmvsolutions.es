package es.gmvsolutions.visitas;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Generador mínimo de ficheros .xlsx (Office Open XML) sin dependencias.
 *
 * Reproduce el modelo de seguimiento semanal: una hoja "TODAS" con todas las
 * visitas y una hoja por semana ("1º JUNIO", "2º JUNIO"...), con las mismas
 * columnas y desplegables que la plantilla original.
 */
public final class XlsxWriter {

    private XlsxWriter() {}

    private static final String[] MESES = {
        "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    };

    private enum Kind { TEXT, WRAP, DATE, MONEY, PERCENT }

    private static final class Col {
        final String header; final String key; final Kind kind; final double width;
        Col(String header, String key, Kind kind, double width) {
            this.header = header; this.key = key; this.kind = kind; this.width = width;
        }
    }

    private static final Col[] COLS = {
        new Col("CLIENTE LLAMADAS VISITA PROPIETARIO", "tipo", Kind.TEXT, 20),
        new Col("PVS", "pvs", Kind.TEXT, 8),
        new Col("FECHA", "fecha", Kind.DATE, 12),
        new Col("FECHA FIRMA", "fechaFirma", Kind.DATE, 12),
        new Col("RAZÓN SOCIAL", "razonSocial", Kind.TEXT, 30),
        new Col("PERSONA CONTACTO", "contacto", Kind.TEXT, 22),
        new Col("TELÉFONO", "telefono", Kind.TEXT, 14),
        new Col("POBLACIÓN", "poblacion", Kind.TEXT, 14),
        new Col("PROVINCIA", "provincia", Kind.TEXT, 12),
        new Col("CORREO", "correo", Kind.TEXT, 28),
        new Col("SITUACIÓN", "situacion", Kind.WRAP, 40),
        new Col("PVP ENTRADA SIN IVA", "pvpEntrada", Kind.MONEY, 14),
        new Col("PVP TOTAL SIN IVA", "pvpTotal", Kind.MONEY, 14),
        new Col("VOLVER (SI/NO)", "volver", Kind.TEXT, 10),
        new Col("%", "porcentaje", Kind.PERCENT, 8),
        new Col("FECHA DE TRABAJO REALIZADO", "fechaTrabajo", Kind.DATE, 14),
        new Col("SEGUIMIENTO ENVIADO", "envio", Kind.TEXT, 22),
    };

    // Índices de estilo (cellXfs en styles.xml)
    private static final int S_HEADER = 1, S_TEXT = 2, S_DATE = 3, S_PCT = 4, S_MONEY = 5, S_WRAP = 6;

    private static final LocalDate EXCEL_EPOCH = LocalDate.of(1899, 12, 30);

    /** Escribe el libro completo. Cada visita es un mapa clave → valor (texto). */
    public static void write(List<Map<String, String>> leads, OutputStream out) throws IOException {
        List<Map<String, String>> sorted = new ArrayList<>(leads);
        sorted.sort(Comparator
                .comparing((Map<String, String> m) -> parseDate(m.get("fecha")) == null)
                .thenComparing(m -> nz(m.get("fecha")))
                .thenComparing(m -> nz(m.get("creado"))));

        // Agrupar por semana (lunes) en orden cronológico
        TreeMap<LocalDate, List<Map<String, String>>> weeks = new TreeMap<>();
        Set<Integer> years = new HashSet<>();
        List<Map<String, String>> sinFecha = new ArrayList<>();
        for (Map<String, String> m : sorted) {
            LocalDate d = parseDate(m.get("fecha"));
            if (d == null) { sinFecha.add(m); continue; }
            LocalDate monday = d.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            weeks.computeIfAbsent(monday, k -> new ArrayList<>()).add(m);
            years.add(monday.getYear());
        }

        LinkedHashMap<String, List<Map<String, String>>> sheets = new LinkedHashMap<>();
        sheets.put("TODAS", sorted);
        boolean multiYear = years.size() > 1;
        for (Map.Entry<LocalDate, List<Map<String, String>>> e : weeks.entrySet()) {
            sheets.put(weekName(e.getKey(), multiYear), e.getValue());
        }
        if (!sinFecha.isEmpty()) sheets.put("SIN FECHA", sinFecha);

        ZipOutputStream zip = new ZipOutputStream(out);
        List<String> names = new ArrayList<>(sheets.keySet());

        put(zip, "[Content_Types].xml", contentTypes(names.size()));
        put(zip, "_rels/.rels",
                "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
                + "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"
                + "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/>"
                + "</Relationships>");
        put(zip, "xl/workbook.xml", workbook(names, sheets));
        put(zip, "xl/_rels/workbook.xml.rels", workbookRels(names.size()));
        put(zip, "xl/styles.xml", STYLES);
        int i = 1;
        for (String name : names) {
            put(zip, "xl/worksheets/sheet" + i + ".xml", sheet(sheets.get(name)));
            i++;
        }
        zip.finish();
        zip.flush();
    }

    /** "1º JUNIO": nº de semana dentro del mes en que cae el lunes. */
    static String weekName(LocalDate monday, boolean withYear) {
        int n = (monday.getDayOfMonth() - 1) / 7 + 1;
        String s = n + "º " + MESES[monday.getMonthValue() - 1];
        if (withYear) s += " " + monday.getYear();
        return s;
    }

    static LocalDate parseDate(String s) {
        if (s == null || s.length() < 10) return null;
        try {
            return LocalDate.parse(s.substring(0, 10), DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (Exception e) {
            return null;
        }
    }

    private static String nz(String s) { return s == null ? "" : s; }

    private static void put(ZipOutputStream zip, String name, String content) throws IOException {
        zip.putNextEntry(new ZipEntry(name));
        zip.write(content.getBytes(StandardCharsets.UTF_8));
        zip.closeEntry();
    }

    private static String contentTypes(int sheetCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n")
          .append("<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">")
          .append("<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>")
          .append("<Default Extension=\"xml\" ContentType=\"application/xml\"/>")
          .append("<Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/>")
          .append("<Override PartName=\"/xl/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\"/>");
        for (int i = 1; i <= sheetCount; i++) {
            sb.append("<Override PartName=\"/xl/worksheets/sheet").append(i)
              .append(".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>");
        }
        sb.append("</Types>");
        return sb.toString();
    }

    private static String workbook(List<String> names, Map<String, List<Map<String, String>>> sheets) {
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n")
          .append("<workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" ")
          .append("xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">")
          .append("<bookViews><workbookView/></bookViews><sheets>");
        for (int i = 0; i < names.size(); i++) {
            sb.append("<sheet name=\"").append(esc(names.get(i))).append("\" sheetId=\"").append(i + 1)
              .append("\" r:id=\"rId").append(i + 1).append("\"/>");
        }
        sb.append("</sheets><definedNames>");
        String lastCol = colName(COLS.length - 1);
        for (int i = 0; i < names.size(); i++) {
            int last = Math.max(1, sheets.get(names.get(i)).size() + 1);
            sb.append("<definedName name=\"_xlnm._FilterDatabase\" localSheetId=\"").append(i)
              .append("\" hidden=\"1\">'").append(esc(names.get(i).replace("'", "''")))
              .append("'!$A$1:$").append(lastCol).append('$').append(last).append("</definedName>");
        }
        sb.append("</definedNames></workbook>");
        return sb.toString();
    }

    private static String workbookRels(int sheetCount) {
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n")
          .append("<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">");
        for (int i = 1; i <= sheetCount; i++) {
            sb.append("<Relationship Id=\"rId").append(i)
              .append("\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet")
              .append(i).append(".xml\"/>");
        }
        sb.append("<Relationship Id=\"rId").append(sheetCount + 1)
          .append("\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/>")
          .append("</Relationships>");
        return sb.toString();
    }

    private static String sheet(List<Map<String, String>> rows) {
        String lastCol = colName(COLS.length - 1);
        int lastRow = rows.size() + 1;
        int dvLast = Math.max(lastRow + 100, 200);

        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n")
          .append("<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">")
          .append("<dimension ref=\"A1:").append(lastCol).append(lastRow).append("\"/>")
          .append("<sheetViews><sheetView workbookViewId=\"0\">")
          .append("<pane ySplit=\"1\" topLeftCell=\"A2\" activePane=\"bottomLeft\" state=\"frozen\"/>")
          .append("</sheetView></sheetViews>")
          .append("<sheetFormatPr defaultRowHeight=\"15\"/><cols>");
        for (int c = 0; c < COLS.length; c++) {
            sb.append("<col min=\"").append(c + 1).append("\" max=\"").append(c + 1)
              .append("\" width=\"").append(COLS[c].width).append("\" customWidth=\"1\"/>");
        }
        sb.append("</cols><sheetData>");

        sb.append("<row r=\"1\" ht=\"32\" customHeight=\"1\">");
        for (int c = 0; c < COLS.length; c++) {
            inlineStr(sb, colName(c) + 1, COLS[c].header, S_HEADER);
        }
        sb.append("</row>");

        int r = 2;
        for (Map<String, String> m : rows) {
            sb.append("<row r=\"").append(r).append("\">");
            for (int c = 0; c < COLS.length; c++) {
                cell(sb, colName(c) + r, COLS[c], nz(m.get(COLS[c].key)).trim());
            }
            sb.append("</row>");
            r++;
        }
        sb.append("</sheetData>");
        sb.append("<autoFilter ref=\"A1:").append(lastCol).append(lastRow).append("\"/>");

        sb.append("<dataValidations count=\"4\">");
        listValidation(sb, "A2:A" + dvLast, "Visita Patrimonio,Lead,Propietario,Cliente");
        listValidation(sb, "I2:I" + dvLast, "Coruña,Lugo");
        listValidation(sb, "N2:N" + dvLast, "Si,No");
        listValidation(sb, "O2:O" + dvLast, "25%,50%,75%,100%");
        sb.append("</dataValidations>");

        sb.append("<pageMargins left=\"0.5\" right=\"0.5\" top=\"0.75\" bottom=\"0.75\" header=\"0.3\" footer=\"0.3\"/>")
          .append("</worksheet>");
        return sb.toString();
    }

    private static void listValidation(StringBuilder sb, String ref, String values) {
        sb.append("<dataValidation type=\"list\" allowBlank=\"1\" showErrorMessage=\"0\" sqref=\"")
          .append(ref).append("\"><formula1>\"").append(esc(values)).append("\"</formula1></dataValidation>");
    }

    private static void cell(StringBuilder sb, String ref, Col col, String v) {
        switch (col.kind) {
            case DATE: {
                LocalDate d = parseDate(v);
                if (d != null) {
                    long serial = ChronoUnit.DAYS.between(EXCEL_EPOCH, d);
                    number(sb, ref, String.valueOf(serial), S_DATE);
                } else {
                    inlineStr(sb, ref, v, S_TEXT);
                }
                return;
            }
            case MONEY: {
                String n = parseNumber(v);
                if (n != null) number(sb, ref, n, S_MONEY); else inlineStr(sb, ref, v, S_TEXT);
                return;
            }
            case PERCENT: {
                String n = parseNumber(v.replace("%", ""));
                if (n != null) {
                    double p = Double.parseDouble(n);
                    if (p > 1) p = p / 100.0;
                    number(sb, ref, trimDouble(p), S_PCT);
                } else {
                    inlineStr(sb, ref, v, S_TEXT);
                }
                return;
            }
            case WRAP:
                inlineStr(sb, ref, v, S_WRAP);
                return;
            default:
                inlineStr(sb, ref, v, S_TEXT);
        }
    }

    /** Acepta "1.200,50", "1200.5", "1200 €"... Devuelve el número en formato XML o null. */
    static String parseNumber(String v) {
        if (v == null) return null;
        String s = v.replace("€", "").replace(" ", "").trim();
        if (s.isEmpty()) return null;
        if (s.contains(",")) s = s.replace(".", "").replace(",", ".");
        try {
            return trimDouble(Double.parseDouble(s));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String trimDouble(double d) {
        if (d == Math.rint(d) && Math.abs(d) < 1e15) return String.valueOf((long) d);
        return String.valueOf(d);
    }

    private static void number(StringBuilder sb, String ref, String n, int style) {
        sb.append("<c r=\"").append(ref).append("\" s=\"").append(style).append("\"><v>")
          .append(n).append("</v></c>");
    }

    private static void inlineStr(StringBuilder sb, String ref, String text, int style) {
        if (text == null || text.isEmpty()) {
            sb.append("<c r=\"").append(ref).append("\" s=\"").append(style).append("\"/>");
            return;
        }
        sb.append("<c r=\"").append(ref).append("\" s=\"").append(style).append("\" t=\"inlineStr\"><is><t xml:space=\"preserve\">")
          .append(esc(text)).append("</t></is></c>");
    }

    static String colName(int index) {
        StringBuilder s = new StringBuilder();
        int n = index + 1;
        while (n > 0) {
            int rem = (n - 1) % 26;
            s.insert(0, (char) ('A' + rem));
            n = (n - 1) / 26;
        }
        return s.toString();
    }

    static String esc(String s) {
        StringBuilder sb = new StringBuilder(s.length());
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            switch (ch) {
                case '&': sb.append("&amp;"); break;
                case '<': sb.append("&lt;"); break;
                case '>': sb.append("&gt;"); break;
                case '"': sb.append("&quot;"); break;
                default:
                    // Caracteres de control no válidos en XML 1.0 (se conservan \t \n \r)
                    if (ch < 0x20 && ch != '\t' && ch != '\n' && ch != '\r') continue;
                    sb.append(ch);
            }
        }
        return sb.toString();
    }

    private static final String STYLES =
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
        + "<styleSheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">"
        + "<numFmts count=\"2\">"
        + "<numFmt numFmtId=\"164\" formatCode=\"dd/mm/yyyy\"/>"
        + "<numFmt numFmtId=\"165\" formatCode=\"#,##0.00\\ &quot;€&quot;\"/>"
        + "</numFmts>"
        + "<fonts count=\"2\">"
        + "<font><sz val=\"11\"/><name val=\"Calibri\"/><family val=\"2\"/></font>"
        + "<font><b/><sz val=\"11\"/><color rgb=\"FFFFFFFF\"/><name val=\"Calibri\"/><family val=\"2\"/></font>"
        + "</fonts>"
        + "<fills count=\"3\">"
        + "<fill><patternFill patternType=\"none\"/></fill>"
        + "<fill><patternFill patternType=\"gray125\"/></fill>"
        + "<fill><patternFill patternType=\"solid\"><fgColor rgb=\"FF1F4E78\"/><bgColor indexed=\"64\"/></patternFill></fill>"
        + "</fills>"
        + "<borders count=\"2\">"
        + "<border><left/><right/><top/><bottom/><diagonal/></border>"
        + "<border><left style=\"thin\"><color rgb=\"FFBFBFBF\"/></left><right style=\"thin\"><color rgb=\"FFBFBFBF\"/></right>"
        + "<top style=\"thin\"><color rgb=\"FFBFBFBF\"/></top><bottom style=\"thin\"><color rgb=\"FFBFBFBF\"/></bottom><diagonal/></border>"
        + "</borders>"
        + "<cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs>"
        + "<cellXfs count=\"7\">"
        + "<xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\"/>"
        + "<xf numFmtId=\"0\" fontId=\"1\" fillId=\"2\" borderId=\"1\" xfId=\"0\" applyFont=\"1\" applyFill=\"1\" applyBorder=\"1\" applyAlignment=\"1\">"
        + "<alignment horizontal=\"center\" vertical=\"center\" wrapText=\"1\"/></xf>"
        + "<xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"1\" xfId=\"0\" applyBorder=\"1\" applyAlignment=\"1\"><alignment vertical=\"top\"/></xf>"
        + "<xf numFmtId=\"164\" fontId=\"0\" fillId=\"0\" borderId=\"1\" xfId=\"0\" applyNumberFormat=\"1\" applyBorder=\"1\" applyAlignment=\"1\"><alignment vertical=\"top\"/></xf>"
        + "<xf numFmtId=\"9\" fontId=\"0\" fillId=\"0\" borderId=\"1\" xfId=\"0\" applyNumberFormat=\"1\" applyBorder=\"1\" applyAlignment=\"1\"><alignment vertical=\"top\"/></xf>"
        + "<xf numFmtId=\"165\" fontId=\"0\" fillId=\"0\" borderId=\"1\" xfId=\"0\" applyNumberFormat=\"1\" applyBorder=\"1\" applyAlignment=\"1\"><alignment vertical=\"top\"/></xf>"
        + "<xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"1\" xfId=\"0\" applyBorder=\"1\" applyAlignment=\"1\"><alignment vertical=\"top\" wrapText=\"1\"/></xf>"
        + "</cellXfs>"
        + "<cellStyles count=\"1\"><cellStyle name=\"Normal\" xfId=\"0\" builtinId=\"0\"/></cellStyles>"
        + "</styleSheet>";
}
