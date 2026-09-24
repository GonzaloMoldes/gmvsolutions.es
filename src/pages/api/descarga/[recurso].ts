// GET /api/descarga/<recurso>/?t=<token> — entrega del archivo (DL-5).
// Espec: ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md §4.3.
//
// El archivo no tiene URL fija: vive en src/descargables/ (fuera de public/) y sólo sale
// por aquí, con un token que emite POST /api/descarga/ después de confirmar el lead.
// astro.config.mjs empaqueta esa carpeta en la función (`includeFiles`); en la función
// de Vercel queda en <raíz de la función>/src/descargables/, que es process.cwd().
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { DESCARGABLES, esDescargableId } from '../../../data/descargables';
import { verificarToken } from '../../../lib/descarga-token';

export const prerender = false;

// Respuesta para quien llega con un enlace caducado o manipulado. Es una navegación del
// navegador, no un fetch: se le da una página legible, no un JSON.
const rechazo = (status: number, mensaje: string) =>
  new Response(
    `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex">` +
      `<title>Descarga no disponible</title>` +
      `<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;line-height:1.5">` +
      `<h1 style="font-size:1.25rem">Descarga no disponible</h1><p>${mensaje}</p>` +
      `<p><a href="javascript:history.back()">Volver</a></p></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  );

export const GET: APIRoute = async ({ params, url }) => {
  const secreto = import.meta.env.DESCARGA_TOKEN_SECRET;
  if (!secreto) return rechazo(503, 'La descarga no está disponible en este momento. Inténtalo más tarde.');

  const recurso = params.recurso ?? '';
  if (!esDescargableId(recurso)) return rechazo(404, 'Este recurso no existe.');

  const token = url.searchParams.get('t') ?? '';
  const resultado = verificarToken(token, recurso, secreto);
  if (resultado.ok === false) {
    const mensaje =
      resultado.motivo === 'caducado'
        ? 'El enlace de descarga ha caducado. Vuelve a la página del recurso y pídelo otra vez: no tendrás que rellenar nada distinto.'
        : 'Este enlace de descarga no es válido. Vuelve a la página del recurso y pídelo desde allí.';
    return rechazo(403, mensaje);
  }

  const r = DESCARGABLES[recurso];
  let contenido: Buffer;
  try {
    contenido = await readFile(path.join(process.cwd(), 'src', 'descargables', r.archivo));
  } catch (err) {
    // No debería pasar: check-descargables garantiza el archivo e includeFiles lo empaqueta.
    // Si pasa, es un fallo de despliegue y hay que verlo en los logs.
    console.error('Descarga: archivo no encontrado en la función', r.archivo, err);
    return rechazo(500, 'No hemos podido preparar la descarga. Inténtalo de nuevo en unos minutos.');
  }

  return new Response(new Uint8Array(contenido), {
    status: 200,
    headers: {
      'Content-Type': r.mime,
      'Content-Length': String(contenido.byteLength),
      'Content-Disposition': `attachment; filename="${r.archivo}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};
