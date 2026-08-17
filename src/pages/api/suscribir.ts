// POST /api/suscribir — alta combinada: newsletter (E-goi) + cuenta de empresa
// en la app (Reelevo). Se ejecuta en el servidor (Vercel function) para no exponer
// ninguna clave en el navegador y para cumplir la CSP (el navegador solo habla con
// el mismo origen). Requiere el adaptador @astrojs/vercel (ver astro.config.mjs).
//
// Variables de entorno (Vercel → Project → Settings → Environment Variables):
//   EGOI_API_KEY      Apikey de la API de E-goi
//   EGOI_LIST_ID      ID de la lista de newsletter en E-goi
//   APP_REGISTRO_URL  Endpoint de alta de empresa en la app (servidor-a-servidor)
//   APP_REGISTRO_SECRET  Secreto compartido para autenticar la llamada anterior
//
// Mientras falten EGOI_* o APP_REGISTRO_*, el endpoint responde 503 (no
// configurado) y el modal muestra un error controlado. Nada se crea a medias.
import type { APIRoute } from 'astro';

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

interface Payload {
  nombre?: string;
  empresa?: string;
  email?: string;
  consent?: boolean;
  website?: string; // honeypot
}

export const POST: APIRoute = async ({ request }) => {
  const {
    EGOI_API_KEY,
    EGOI_LIST_ID,
    APP_REGISTRO_URL,
    APP_REGISTRO_SECRET,
  } = import.meta.env;

  if (!EGOI_API_KEY || !EGOI_LIST_ID || !APP_REGISTRO_URL || !APP_REGISTRO_SECRET) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  const nombre = (body.nombre || '').trim();
  const empresa = (body.empresa || '').trim();
  const email = (body.email || '').trim().toLowerCase();

  // Honeypot: si viene relleno, es un bot. Fingimos exito y no hacemos nada.
  if (body.website) return json({ ok: true });

  if (!nombre || !empresa || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_input' }, 422);
  }
  if (body.consent !== true) {
    return json({ ok: false, error: 'consent_required' }, 422);
  }

  // 1) Alta en E-goi con doble opt-in (status 'unconfirmed' -> E-goi envia el
  //    correo de confirmacion). Un 409 significa que el contacto ya existe: no es
  //    un error para nosotros.
  try {
    const egoiRes = await fetch(`https://api.egoi.com/v3/lists/${EGOI_LIST_ID}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Apikey: EGOI_API_KEY,
      },
      body: JSON.stringify({
        status: 'unconfirmed',
        base: { email, first_name: nombre },
      }),
    });
    if (!egoiRes.ok && egoiRes.status !== 409) {
      console.error('E-goi alta fallida', egoiRes.status, await egoiRes.text());
      return json({ ok: false, error: 'newsletter_failed' }, 502);
    }
  } catch (err) {
    console.error('E-goi error de red', err);
    return json({ ok: false, error: 'newsletter_failed' }, 502);
  }

  // 2) Alta de la empresa en la app, servidor-a-servidor. La app es la duena de la
  //    creacion del tenant (Supabase Auth + RLS): aqui solo la invocamos con un
  //    secreto compartido. La app deberia responder idempotente si el email ya
  //    tiene cuenta, y enviar su propio correo de activacion / magic link.
  try {
    const appRes = await fetch(APP_REGISTRO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${APP_REGISTRO_SECRET}`,
      },
      body: JSON.stringify({ email, nombre, empresa, source: 'newsletter_modal' }),
    });
    if (!appRes.ok && appRes.status !== 409) {
      console.error('Alta app fallida', appRes.status, await appRes.text());
      // La newsletter ya quedo registrada; informamos de fallo parcial.
      return json({ ok: false, error: 'account_failed' }, 502);
    }
  } catch (err) {
    console.error('Alta app error de red', err);
    return json({ ok: false, error: 'account_failed' }, 502);
  }

  return json({ ok: true });
};

// Cualquier otro metodo: 405.
export const ALL: APIRoute = () => json({ ok: false, error: 'method_not_allowed' }, 405);
