// POST /api/descarga/ — alta del lead y token de descarga (DL-5).
// Espec: ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md §4.5 y §5.
//
// Recibe el formulario de <DescargaConCuenta /> (DL-4), lo valida, pasa Turnstile y un
// límite por IP, y llama a la app (POST /api/leads/alta) servidor-a-servidor. SÓLO si la
// app confirma el lead (200) o dice que es un cliente (409) devuelve la URL de descarga
// con un token de 10 minutos. Cualquier otra respuesta de la app → sin descarga (D-2).
//
// Variables (Vercel → este proyecto; secretos: ver espec §4.6):
//   LEADS_ALTA_URL          https://<app>/api/leads/alta
//   LEADS_ALTA_SECRET       mismo valor que en la app
//   DESCARGA_TOKEN_SECRET   sólo en la web: firma los tokens de descarga
//   TURNSTILE_SECRET_KEY    de Cloudflare. En local sirve la clave de pruebas
//                           1x0000000000000000000000000000000AA (siempre acepta).
// Si falta cualquiera: 503 y no se crea nada, como /api/suscribir.
import type { APIRoute } from 'astro';
import { DESCARGABLES, esDescargableId } from '../../../data/descargables';
import { firmarToken } from '../../../lib/descarga-token';
import { VERSION_TEXTOS_DESCARGA } from '../../../lib/descarga-consentimiento';

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TIMEOUT_APP_MS = 8000;

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

// ── Límite por IP ────────────────────────────────────────────────────────────
// Best-effort: vive en la memoria de cada instancia de la función, así que con varias
// instancias concurrentes cada una cuenta por su lado. La web no tiene Redis. La
// protección real contra altas masivas es Turnstile (aquí) más el tope diario y por
// dominio de la app (T-04), que sí son compartidos. Esto sólo frena ráfagas desde una
// misma IP contra una instancia caliente.
const LIMITE_IP = 10;
const VENTANA_IP_MS = 10 * 60 * 1000;
const intentosPorIp = new Map<string, { n: number; desde: number }>();

function superaLimiteIp(ip: string, ahora = Date.now()): boolean {
  const e = intentosPorIp.get(ip);
  if (!e || ahora - e.desde > VENTANA_IP_MS) {
    intentosPorIp.set(ip, { n: 1, desde: ahora });
    if (intentosPorIp.size > 5000) intentosPorIp.clear(); // tope de memoria
    return false;
  }
  e.n++;
  return e.n > LIMITE_IP;
}

interface Cuerpo {
  recurso?: unknown;
  nombre?: unknown;
  email?: unknown;
  empresa?: unknown;
  consentimiento_comercial?: unknown;
  pagina?: unknown;
  utm?: { source?: unknown; medium?: unknown; campaign?: unknown };
  turnstile_token?: unknown;
  website?: unknown; // honeypot
}

const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const utmCampo = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 100) : null);

async function turnstileValido(token: string, secreto: string, ip: string | null): Promise<boolean> {
  try {
    const body = new URLSearchParams({ secret: secreto, response: token });
    if (ip) body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('Turnstile: error de red', err);
    return false;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const { LEADS_ALTA_URL, LEADS_ALTA_SECRET, DESCARGA_TOKEN_SECRET, TURNSTILE_SECRET_KEY } = import.meta.env;
  if (!LEADS_ALTA_URL || !LEADS_ALTA_SECRET || !DESCARGA_TOKEN_SECRET || !TURNSTILE_SECRET_KEY) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  let ip: string | null = null;
  try {
    ip = clientAddress;
  } catch {
    ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  }
  if (ip && superaLimiteIp(ip)) return json({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '600' });

  let body: Cuerpo;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: si viene relleno es un bot. No se le da ni lead ni descarga, y tampoco se
  // le dice por qué: responde como si la app hubiera fallado.
  if (body.website) return json({ ok: false, error: 'account_failed' }, 502);

  const recurso = texto(body.recurso, 64);
  const nombre = texto(body.nombre, 120);
  const email = texto(body.email, 254).toLowerCase();
  const empresa = texto(body.empresa, 200);
  const pagina = texto(body.pagina, 500);
  const consiente = body.consentimiento_comercial === true;

  if (!esDescargableId(recurso)) return json({ ok: false, error: 'unknown_resource' }, 422);
  if (!nombre || !empresa || !EMAIL_RE.test(email)) return json({ ok: false, error: 'invalid_input' }, 422);

  const turnstile = texto(body.turnstile_token, 2048);
  if (!turnstile || !(await turnstileValido(turnstile, TURNSTILE_SECRET_KEY, ip))) {
    return json({ ok: false, error: 'captcha_failed' }, 403);
  }

  // ── Alta del lead en la app ────────────────────────────────────────────────
  const r = DESCARGABLES[recurso];
  let estadoApp: number;
  try {
    const res = await fetch(LEADS_ALTA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LEADS_ALTA_SECRET}` },
      body: JSON.stringify({
        email,
        nombre,
        empresa_declarada: empresa,
        origen: 'descarga_web',
        origen_ref: recurso,
        modulo: r.modulo,
        consentimiento_comercial: consiente,
        ...(consiente ? { consentimiento_texto_version: VERSION_TEXTOS_DESCARGA } : {}),
        ...(pagina.startsWith('/') ? { pagina } : {}),
        utm: { source: utmCampo(body.utm?.source), medium: utmCampo(body.utm?.medium), campaign: utmCampo(body.utm?.campaign) },
      }),
      signal: AbortSignal.timeout(TIMEOUT_APP_MS),
    });
    estadoApp = res.status;
    if (res.status !== 200 && res.status !== 409) {
      console.error('Alta de lead rechazada por la app', res.status, await res.text().catch(() => ''));
    }
  } catch (err) {
    console.error('Alta de lead: error de red o timeout', err);
    return json({ ok: false, error: 'account_failed' }, 502);
  }

  // D-2: sin lead no hay descarga. 409 es un cliente: recibe el archivo sin crear nada.
  if (estadoApp === 429) return json({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '3600' });
  if (estadoApp === 422) return json({ ok: false, error: 'invalid_input' }, 422);
  if (estadoApp !== 200 && estadoApp !== 409) return json({ ok: false, error: 'account_failed' }, 502);

  const token = firmarToken(recurso, DESCARGA_TOKEN_SECRET);
  return json({
    ok: true,
    cliente: estadoApp === 409,
    url: `/api/descarga/${recurso}/?t=${encodeURIComponent(token)}`,
  });
};

export const ALL: APIRoute = () => json({ ok: false, error: 'method_not_allowed' }, 405);
