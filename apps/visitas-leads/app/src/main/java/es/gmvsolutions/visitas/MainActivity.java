package es.gmvsolutions.visitas;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class MainActivity extends Activity {

    private static final String XLSX_MIME =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    private static final String FOLDER = "VisitasLeads";
    private static final int REQ_STORAGE = 1;

    private WebView web;
    private volatile Uri lastExcelUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new Bridge(), "Android");
        web.loadUrl("file:///android_asset/index.html");

        // Android 9 o anterior: hace falta permiso para escribir en Descargas
        if (Build.VERSION.SDK_INT < 29
                && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQ_STORAGE);
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        web.evaluateJavascript("window.handleBack ? handleBack() : false", value -> {
            if (!"true".equals(value)) MainActivity.super.onBackPressed();
        });
    }

    private void toast(final String msg) {
        runOnUiThread(() -> Toast.makeText(this, msg, Toast.LENGTH_LONG).show());
    }

    private void launch(final Intent intent, final String errorMsg) {
        runOnUiThread(() -> {
            try {
                startActivity(intent);
            } catch (ActivityNotFoundException e) {
                Toast.makeText(this, errorMsg, Toast.LENGTH_LONG).show();
            }
        });
    }

    // ---------------------------------------------------------------- datos

    private File dataFile(String name) {
        return new File(getFilesDir(), name);
    }

    private String readFile(File f) {
        if (!f.exists()) return "";
        try (InputStream in = new FileInputStream(f)) {
            byte[] buf = new byte[(int) f.length()];
            int off = 0;
            while (off < buf.length) {
                int n = in.read(buf, off, buf.length - off);
                if (n < 0) break;
                off += n;
            }
            return new String(buf, 0, off, StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "";
        }
    }

    /** Escritura atómica: primero a .tmp y luego renombrar. */
    private boolean writeFile(File f, String content) {
        File tmp = new File(f.getPath() + ".tmp");
        try (OutputStream out = new FileOutputStream(tmp)) {
            out.write(content.getBytes(StandardCharsets.UTF_8));
        } catch (IOException e) {
            return false;
        }
        return tmp.renameTo(f);
    }

    // ---------------------------------------------------------------- excel

    private static List<Map<String, String>> parseLeads(String json) throws Exception {
        JSONArray arr = new JSONArray(json);
        List<Map<String, String>> list = new ArrayList<>();
        for (int i = 0; i < arr.length(); i++) {
            JSONObject o = arr.getJSONObject(i);
            Map<String, String> m = new HashMap<>();
            Iterator<String> keys = o.keys();
            while (keys.hasNext()) {
                String k = keys.next();
                Object v = o.opt(k);
                if (v != null && v != JSONObject.NULL && !(v instanceof JSONObject) && !(v instanceof JSONArray)) {
                    m.put(k, String.valueOf(v));
                }
            }
            list.add(m);
        }
        return list;
    }

    /** Escribe el Excel en Descargas/VisitasLeads y devuelve su Uri. */
    private Uri writeExcel(String leadsJson, String fileName) throws Exception {
        List<Map<String, String>> leads = parseLeads(leadsJson);
        String name = fileName.endsWith(".xlsx") ? fileName : fileName + ".xlsx";

        if (Build.VERSION.SDK_INT >= 29) {
            ContentResolver cr = getContentResolver();
            Uri collection = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
            String relPath = Environment.DIRECTORY_DOWNLOADS + "/" + FOLDER;
            Uri uri = null;
            try (Cursor c = cr.query(collection, new String[]{MediaStore.MediaColumns._ID},
                    MediaStore.MediaColumns.DISPLAY_NAME + "=? AND "
                            + MediaStore.MediaColumns.RELATIVE_PATH + " LIKE ?",
                    new String[]{name, relPath + "%"}, null)) {
                if (c != null && c.moveToFirst()) {
                    uri = Uri.withAppendedPath(collection, String.valueOf(c.getLong(0)));
                }
            }
            if (uri == null) {
                ContentValues v = new ContentValues();
                v.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                v.put(MediaStore.MediaColumns.MIME_TYPE, XLSX_MIME);
                v.put(MediaStore.MediaColumns.RELATIVE_PATH, relPath);
                uri = cr.insert(collection, v);
                if (uri == null) throw new IOException("No se pudo crear el fichero en Descargas");
            }
            try (ParcelFileDescriptor pfd = cr.openFileDescriptor(uri, "rwt");
                 FileOutputStream out = new FileOutputStream(pfd.getFileDescriptor())) {
                out.getChannel().truncate(0);
                XlsxWriter.write(leads, out);
            }
            return uri;
        }

        File dir = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS), FOLDER);
        if (!dir.exists() && !dir.mkdirs()) throw new IOException("No se pudo crear la carpeta " + dir);
        File f = new File(dir, name);
        try (OutputStream out = new FileOutputStream(f)) {
            XlsxWriter.write(leads, out);
        }
        final Uri[] result = new Uri[1];
        final CountDownLatch latch = new CountDownLatch(1);
        MediaScannerConnection.scanFile(this, new String[]{f.getAbsolutePath()},
                new String[]{XLSX_MIME}, (path, uri) -> { result[0] = uri; latch.countDown(); });
        latch.await(5, TimeUnit.SECONDS);
        if (result[0] == null) throw new IOException("Excel guardado en " + f + " pero no se pudo compartir");
        return result[0];
    }

    // ---------------------------------------------------------------- puente JS

    private class Bridge {

        @JavascriptInterface
        public String load(String key) {
            return readFile(dataFile(key + ".json"));
        }

        @JavascriptInterface
        public boolean save(String key, String json) {
            return writeFile(dataFile(key + ".json"), json);
        }

        /** Reescribe el Excel. Devuelve "" si todo fue bien o el mensaje de error. */
        @JavascriptInterface
        public String exportExcel(String leadsJson, String fileName) {
            try {
                lastExcelUri = writeExcel(leadsJson, fileName);
                return "";
            } catch (Exception e) {
                return e.getMessage() == null ? e.toString() : e.getMessage();
            }
        }

        @JavascriptInterface
        public String shareExcel(String leadsJson, String fileName) {
            String err = exportExcel(leadsJson, fileName);
            if (!err.isEmpty()) return err;
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType(XLSX_MIME);
            send.putExtra(Intent.EXTRA_STREAM, lastExcelUri);
            send.putExtra(Intent.EXTRA_SUBJECT, fileName);
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            launch(Intent.createChooser(send, "Compartir Excel"), "No hay apps para compartir");
            return "";
        }

        @JavascriptInterface
        public String openExcel(String leadsJson, String fileName) {
            String err = exportExcel(leadsJson, fileName);
            if (!err.isEmpty()) return err;
            Intent view = new Intent(Intent.ACTION_VIEW);
            view.setDataAndType(lastExcelUri, XLSX_MIME);
            view.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            launch(view, "No hay ninguna app instalada para abrir Excel (instala Excel o Google Hojas de cálculo)");
            return "";
        }

        @JavascriptInterface
        public void sendEmail(String to, String subject, String body) {
            Uri uri = Uri.parse("mailto:" + Uri.encode(to)
                    + "?subject=" + Uri.encode(subject) + "&body=" + Uri.encode(body));
            Intent i = new Intent(Intent.ACTION_SENDTO, uri);
            i.putExtra(Intent.EXTRA_EMAIL, new String[]{to});
            i.putExtra(Intent.EXTRA_SUBJECT, subject);
            i.putExtra(Intent.EXTRA_TEXT, body);
            launch(i, "No hay ninguna app de correo configurada");
        }

        /** phone en formato internacional sin "+", p. ej. 34600111222. */
        @JavascriptInterface
        public void sendWhatsApp(String phone, String text) {
            Uri uri = Uri.parse("https://api.whatsapp.com/send?phone=" + Uri.encode(phone)
                    + "&text=" + Uri.encode(text));
            launch(new Intent(Intent.ACTION_VIEW, uri), "No se pudo abrir WhatsApp");
        }

        @JavascriptInterface
        public void call(String phone) {
            launch(new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + Uri.encode(phone))),
                    "No se puede llamar desde este dispositivo");
        }

        @JavascriptInterface
        public void toast(String msg) {
            MainActivity.this.toast(msg);
        }

        @JavascriptInterface
        public String excelLocation() {
            return Environment.DIRECTORY_DOWNLOADS + "/" + FOLDER;
        }
    }
}
