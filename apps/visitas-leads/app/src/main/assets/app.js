'use strict';

/* =========================================================================
 * Visitas Leads — lógica de la app (corre dentro del WebView de Android).
 * Los datos se guardan en la tablet (fichero JSON interno) y cada cambio
 * reescribe el Excel en Descargas/VisitasLeads.
 * Fuera de Android (navegador) usa localStorage para poder probarla.
 * ========================================================================= */

const NATIVE = typeof window.Android !== 'undefined';

const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO',
  'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

const DEFAULT_SETTINGS = {
  comercial: 'Gonzalo',
  miEmpresa: 'PortoValla',
  miTelefono: '',
  miEmail: '',
  autoEnviar: true,
  prefijo: '34',
  fichero: 'Visitas_Leads',
  emailAsunto: 'Gracias por atenderme – {miEmpresa}',
  emailCuerpo:
    'Hola {contacto},\n\n' +
    'Muchas gracias por atenderme hoy en {empresa}. Como le comenté, le dejo mis datos de contacto ' +
    'para cualquier cosa que necesite.\n\n' +
    'Quedo a su disposición para resolver cualquier duda.\n\n' +
    'Un saludo,\n{comercial}\n{miEmpresa}\n{miTelefono}\n{miEmail}',
  whatsappTexto:
    'Hola {contacto}, soy {comercial} de {miEmpresa}. Gracias por atenderme hoy en {empresa}. ' +
    'Le dejo mi contacto por aquí para lo que necesite. ¡Un saludo!',
  situaciones: [
    'VISITADO E INFORMADO',
    'DEJADA INFORMACIÓN',
    'NO ESTABA EL RESPONSABLE',
    'INTERESADO, VOLVER',
    'PIDE PRESUPUESTO',
    'SE GESTIONA DESDE CENTRAL',
  ].join('\n'),
};

const FIELDS = ['tipo', 'pvs', 'fecha', 'fechaFirma', 'razonSocial', 'contacto', 'telefono',
  'poblacion', 'provincia', 'correo', 'situacion', 'pvpEntrada', 'pvpTotal', 'volver',
  'porcentaje', 'fechaTrabajo'];

/* ------------------------------------------------------------- almacenamiento */

const store = {
  load(key) {
    try {
      const raw = NATIVE ? window.Android.load(key) : localStorage.getItem('vl_' + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  save(key, value) {
    const json = JSON.stringify(value);
    if (NATIVE) return window.Android.save(key, json);
    localStorage.setItem('vl_' + key, json);
    return true;
  },
};

let leads = store.load('leads') || [];
let settings = Object.assign({}, DEFAULT_SETTINGS, store.load('settings') || {});
let filter = 'semana';
let editingId = null;

/* ------------------------------------------------------------- utilidades */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pad(n) { return String(n).padStart(2, '0'); }

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseISO(s) {
  if (!s || !/^\d{4}-\d{2}-\d{2}/.test(s)) return null;
  const [y, m, d] = s.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function fmtDate(s) {
  const d = parseISO(s);
  return d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : '';
}

function mondayOf(d) {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m;
}

/** Mismo nombre que la hoja del Excel: "1º JUNIO". */
function weekName(d) {
  const m = mondayOf(d);
  return `${Math.floor((m.getDate() - 1) / 7) + 1}º ${MESES[m.getMonth()]}`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.hidden = true; }, 2800);
}

/* ------------------------------------------------------------- contacto */

function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || '').trim());
}

/** Normaliza a formato internacional sin "+" (34600111222). */
function normPhone(raw) {
  let s = (raw || '').trim();
  if (!s) return '';
  const intl = s.startsWith('+') || s.startsWith('00');
  s = s.replace(/\D/g, '');
  if (s.startsWith('00')) s = s.slice(2);
  if (!intl && s.length === 9) s = (settings.prefijo || '34').replace(/\D/g, '') + s;
  return s.length >= 9 ? s : '';
}

/** En España solo los 6xx/7xx son móviles; otros países se dan por buenos. */
function isMobile(raw) {
  const p = normPhone(raw);
  if (!p) return false;
  if (p.startsWith('34') && p.length === 11) return /^34[67]/.test(p);
  return true;
}

function channelsFor(lead) {
  const ch = [];
  if (validEmail(lead.correo)) ch.push('email');
  if (isMobile(lead.telefono)) ch.push('whatsapp');
  return ch;
}

function fillTemplate(tpl, lead) {
  const vars = {
    contacto: (lead.contacto || '').trim(),
    empresa: (lead.razonSocial || '').trim(),
    poblacion: (lead.poblacion || '').trim(),
    fecha: fmtDate(lead.fecha),
    comercial: settings.comercial || '',
    miEmpresa: settings.miEmpresa || '',
    miTelefono: settings.miTelefono || '',
    miEmail: settings.miEmail || '',
  };
  return String(tpl || '')
    .replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m))
    .replace(/[ \t]+([,.!?])/g, '$1')       // "Hola ," → "Hola,"
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/* ------------------------------------------------------------- persistencia + excel */

function persist() {
  const ok = store.save('leads', leads);
  if (!ok) { toast('⚠ No se pudieron guardar los datos'); return; }
  syncExcel(true);
}

function syncExcel(silent) {
  if (!NATIVE) return '';
  const err = window.Android.exportExcel(JSON.stringify(leads), settings.fichero || 'Visitas_Leads');
  if (err) toast('⚠ Excel: ' + err);
  else if (!silent) toast('Excel actualizado');
  return err;
}

/* ------------------------------------------------------------- navegación */

function show(view) {
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  window.scrollTo(0, 0);
}

function currentView() {
  const v = $('.view.active');
  return v ? v.id.replace('view-', '') : 'list';
}

window.handleBack = function () {
  if (!$('#send-modal').hidden) { closeSend(); return true; }
  if (currentView() !== 'list') { show('list'); renderList(); return true; }
  return false;
};

/* ------------------------------------------------------------- listado */

function matchesFilter(l) {
  const d = parseISO(l.fecha);
  const now = new Date();
  switch (filter) {
    case 'hoy': return l.fecha === todayISO();
    case 'semana': return d && mondayOf(d).getTime() === mondayOf(now).getTime();
    case 'pendiente': return !l.envio && l.tipo !== 'Visita Patrimonio' && channelsFor(l).length > 0;
    case 'volver': return l.volver === 'Si';
    default: return true;
  }
}

function matchesSearch(l, q) {
  if (!q) return true;
  const hay = [l.razonSocial, l.contacto, l.poblacion, l.situacion, l.telefono, l.correo, l.tipo]
    .join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).every(w => hay.includes(w));
}

function renderList() {
  const q = $('#search').value.trim();
  const items = leads
    .filter(l => matchesFilter(l) && matchesSearch(l, q))
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '') || (b.creado || '').localeCompare(a.creado || ''));

  const pendientes = leads.filter(l => !l.envio && l.tipo !== 'Visita Patrimonio' && channelsFor(l).length).length;
  $('#stats').textContent = `${items.length} de ${leads.length} visitas` +
    (pendientes ? ` · ${pendientes} sin seguimiento enviado` : '');

  const list = $('#list');
  if (!items.length) {
    list.innerHTML = `<div class="empty">${leads.length
      ? 'No hay visitas con este filtro.'
      : 'Aún no hay visitas.<br>Pulsa <b>＋ Nueva visita</b> para empezar.'}</div>`;
    return;
  }

  let html = '';
  let lastGroup = null;
  for (const l of items) {
    const d = parseISO(l.fecha);
    const group = d ? `${weekName(d)} ${d.getFullYear()}` : 'SIN FECHA';
    if (group !== lastGroup) { html += `<div class="week">${esc(group)}</div>`; lastGroup = group; }

    const ch = channelsFor(l);
    const sub = [l.contacto, l.poblacion, l.telefono, l.correo].filter(Boolean).map(esc).join(' · ');
    const badges = [
      `<span class="badge t-${esc((l.tipo || '').replace(/\s/g, ''))}">${esc(l.tipo || 'Lead')}</span>`,
      `<span class="badge">${esc(fmtDate(l.fecha))}</span>`,
      l.porcentaje ? `<span class="badge">${esc(l.porcentaje)}%</span>` : '',
      l.volver === 'Si' ? '<span class="badge volver">Volver</span>' : '',
      l.envio ? `<span class="badge ok">✓ ${esc(l.envio)}</span>`
        : (ch.length && l.tipo !== 'Visita Patrimonio' ? '<span class="badge pend">Sin seguimiento</span>' : ''),
    ].join('');

    const acts = [
      ch.includes('email') ? `<button class="act mail" data-send="email" data-id="${l.id}">✉ Email</button>` : '',
      ch.includes('whatsapp') ? `<button class="act wa" data-send="whatsapp" data-id="${l.id}">WhatsApp</button>` : '',
      normPhone(l.telefono) ? `<button class="act" data-call="${l.id}">☎ Llamar</button>` : '',
    ].join('');

    html += `
      <article class="lead" data-id="${l.id}">
        <div class="lead-main">
          <div class="lead-title">${esc(l.razonSocial || '(sin nombre)')}</div>
          ${sub ? `<div class="lead-sub">${sub}</div>` : ''}
          ${l.situacion ? `<div class="lead-sit">${esc(l.situacion)}</div>` : ''}
          <div class="badges">${badges}</div>
        </div>
        ${acts ? `<div class="lead-actions">${acts}</div>` : ''}
      </article>`;
  }
  list.innerHTML = html;
}

/* ------------------------------------------------------------- formulario */

function setChipGroup(name, value) {
  const group = $(`[data-bind="${name}"]`);
  if (!group) return;
  $$('.chip', group).forEach(c => c.classList.toggle('active', c.dataset.value === value));
  $(`#lead-form [name="${name}"]`).value = value || '';
}

function refreshDatalists() {
  const pobl = [...new Set(leads.map(l => (l.poblacion || '').trim()).filter(Boolean))].sort();
  $('#dl-poblacion').innerHTML = pobl.map(p => `<option value="${esc(p)}">`).join('');
  $('#situacion-chips').innerHTML = (settings.situaciones || '').split('\n')
    .map(s => s.trim()).filter(Boolean)
    .map(s => `<button type="button" class="chip" data-value="${esc(s)}">${esc(s)}</button>`).join('');
}

function openForm(id) {
  editingId = id || null;
  const form = $('#lead-form');
  form.reset();
  $$('.invalid', form).forEach(el => el.classList.remove('invalid'));
  refreshDatalists();

  let lead;
  if (id) {
    lead = leads.find(l => l.id === id);
  } else {
    // Nueva visita: hoy, y misma población/provincia que la última (se suelen visitar varias seguidas)
    const last = leads.slice().sort((a, b) => (b.creado || '').localeCompare(a.creado || ''))[0] || {};
    lead = { tipo: 'Lead', fecha: todayISO(), volver: 'No', porcentaje: '25',
      poblacion: last.poblacion || '', provincia: last.provincia || '' };
  }

  for (const f of FIELDS) {
    const el = form.elements[f];
    if (el) el.value = lead[f] || '';
  }
  ['tipo', 'volver', 'porcentaje'].forEach(n => setChipGroup(n, lead[n] || ''));

  $('#form-title').textContent = id ? 'Editar visita' : 'Nueva visita';
  $('#btn-delete').hidden = !id;
  $('#envio-info').textContent = lead.envio ? `Seguimiento enviado: ${lead.envio}` : '';
  $('details.card', form).open = !!(lead.pvpEntrada || lead.pvpTotal || lead.fechaFirma || lead.fechaTrabajo);
  show('form');
  if (!id) setTimeout(() => form.elements.razonSocial.focus(), 50);
}

function readForm() {
  const form = $('#lead-form');
  const data = {};
  for (const f of FIELDS) data[f] = (form.elements[f].value || '').trim();
  data.correo = data.correo.toLowerCase();
  return data;
}

function saveForm(thenSend) {
  const form = $('#lead-form');
  const data = readForm();
  $$('.invalid', form).forEach(el => el.classList.remove('invalid'));

  const bad = [];
  if (!data.razonSocial) bad.push('razonSocial');
  if (!data.fecha) bad.push('fecha');
  if (data.correo && !validEmail(data.correo)) bad.push('correo');
  if (bad.length) {
    bad.forEach(n => form.elements[n].classList.add('invalid'));
    form.elements[bad[0]].focus();
    toast(bad.includes('correo') ? 'El correo no es válido' : 'Falta la razón social o la fecha');
    return;
  }

  const now = new Date().toISOString();
  let lead;
  const isNew = !editingId;
  if (editingId) {
    lead = leads.find(l => l.id === editingId);
    Object.assign(lead, data, { modificado: now });
  } else {
    lead = Object.assign({ id: uid(), creado: now, modificado: now, envio: '' }, data);
    leads.push(lead);
  }
  persist();
  toast('Visita guardada');

  show('list');
  renderList();

  const wantsSend = thenSend || (isNew && settings.autoEnviar && !lead.envio);
  if (wantsSend && lead.tipo !== 'Visita Patrimonio') {
    const ch = channelsFor(lead);
    if (ch.length) openSend(lead.id, ch[0]);
    else if (thenSend) toast('Esta visita no tiene correo ni móvil válido');
  }
}

function deleteLead() {
  if (!editingId) return;
  const l = leads.find(x => x.id === editingId);
  if (!confirm(`¿Eliminar la visita a "${l ? l.razonSocial : ''}"?`)) return;
  leads = leads.filter(x => x.id !== editingId);
  persist();
  toast('Visita eliminada');
  show('list');
  renderList();
}

/* ------------------------------------------------------------- envío */

let sending = null; // { id, channel }

function openSend(id, channel) {
  const lead = leads.find(l => l.id === id);
  if (!lead) return;
  const ch = channelsFor(lead);
  if (!ch.length) { toast('Sin correo ni móvil para enviar'); return; }
  if (!ch.includes(channel)) channel = ch[0];
  sending = { id, channel };

  $('#send-title').textContent = `Seguimiento · ${lead.razonSocial}`;
  $('#send-channels').innerHTML = ch.map(c =>
    `<button type="button" class="chip${c === channel ? ' active' : ''}" data-channel="${c}">${c === 'email' ? '✉ Email' : 'WhatsApp'}</button>`).join('');
  fillSend(lead, channel);
  $('#send-modal').hidden = false;
}

function fillSend(lead, channel) {
  const isMail = channel === 'email';
  $('#send-subject-wrap').hidden = !isMail;
  $('#send-subject').value = isMail ? fillTemplate(settings.emailAsunto, lead) : '';
  $('#send-body').value = fillTemplate(isMail ? settings.emailCuerpo : settings.whatsappTexto, lead);
  $('#send-to').textContent = isMail ? `Para: ${lead.correo}` : `WhatsApp: +${normPhone(lead.telefono)}`;
  $('#send-go').textContent = isMail ? 'Abrir correo y enviar' : 'Abrir WhatsApp y enviar';
}

function closeSend() {
  $('#send-modal').hidden = true;
  sending = null;
}

function doSend() {
  if (!sending) return;
  const lead = leads.find(l => l.id === sending.id);
  if (!lead) return closeSend();
  const body = $('#send-body').value;

  if (sending.channel === 'email') {
    const subject = $('#send-subject').value;
    if (NATIVE) window.Android.sendEmail(lead.correo, subject, body);
    else window.open(`mailto:${encodeURIComponent(lead.correo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  } else {
    const phone = normPhone(lead.telefono);
    if (NATIVE) window.Android.sendWhatsApp(phone, body);
    else window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(body)}`);
  }

  lead.envio = `${sending.channel === 'email' ? 'Email' : 'WhatsApp'} ${fmtDate(todayISO())}`;
  lead.modificado = new Date().toISOString();
  persist();
  closeSend();
  renderList();
}

/* ------------------------------------------------------------- ajustes */

function openSettings() {
  const form = $('#settings-form');
  for (const el of form.elements) {
    if (!el.name) continue;
    if (el.type === 'checkbox') el.checked = !!settings[el.name];
    else el.value = settings[el.name] == null ? '' : settings[el.name];
  }
  $('#excel-location').textContent = NATIVE
    ? `El Excel se guarda en: ${window.Android.excelLocation()}/${settings.fichero || 'Visitas_Leads'}.xlsx (se actualiza solo cada vez que guardas).`
    : 'Modo navegador: el Excel solo se genera en la tablet.';
  show('settings');
}

function saveSettings() {
  const form = $('#settings-form');
  const next = Object.assign({}, settings);
  for (const el of form.elements) {
    if (!el.name) continue;
    next[el.name] = el.type === 'checkbox' ? el.checked : el.value.trim();
  }
  next.fichero = (next.fichero || 'Visitas_Leads').replace(/[\\/:*?"<>|]/g, '_').replace(/\.xlsx$/i, '');
  settings = next;
  store.save('settings', settings);
  syncExcel(true);
  toast('Ajustes guardados');
  show('list');
  renderList();
}

function resetTemplates() {
  const form = $('#settings-form');
  ['emailAsunto', 'emailCuerpo', 'whatsappTexto', 'situaciones'].forEach(k => {
    form.elements[k].value = DEFAULT_SETTINGS[k];
  });
  toast('Textos restaurados (pulsa Guardar ajustes)');
}

/* ------------------------------------------------------------- eventos */

document.addEventListener('click', e => {
  const t = e.target.closest('button, article.lead');
  if (!t) return;

  // Grupos de chips de selección única (tipo, volver, %)
  const bind = t.closest('[data-bind]');
  if (bind && t.classList.contains('chip')) {
    const name = bind.dataset.bind;
    const cur = $(`#lead-form [name="${name}"]`).value;
    setChipGroup(name, cur === t.dataset.value && name !== 'tipo' ? '' : t.dataset.value);
    return;
  }
  const fill = t.closest('[data-fill]');
  if (fill && t.classList.contains('chip')) {
    $(`#lead-form [name="${fill.dataset.fill}"]`).value = t.dataset.value;
    return;
  }
  const app = t.closest('[data-append]');
  if (app && t.classList.contains('chip')) {
    const ta = $(`#lead-form [name="${app.dataset.append}"]`);
    ta.value = ta.value.trim() ? `${ta.value.trim()}. ${t.dataset.value}` : t.dataset.value;
    return;
  }
  if (t.dataset.filter) {
    filter = t.dataset.filter;
    $$('#filters .chip').forEach(c => c.classList.toggle('active', c === t));
    renderList();
    return;
  }
  if (t.dataset.channel && sending) {
    sending.channel = t.dataset.channel;
    $$('#send-channels .chip').forEach(c => c.classList.toggle('active', c === t));
    fillSend(leads.find(l => l.id === sending.id), sending.channel);
    return;
  }
  if (t.dataset.send) { openSend(t.dataset.id, t.dataset.send); return; }
  if (t.dataset.call) {
    const l = leads.find(x => x.id === t.dataset.call);
    if (l && NATIVE) window.Android.call('+' + normPhone(l.telefono));
    return;
  }
  if (t.matches('article.lead')) { openForm(t.dataset.id); return; }

  const exportArgs = () => [JSON.stringify(leads), settings.fichero || 'Visitas_Leads'];
  switch (t.dataset.action) {
    case 'new': openForm(null); break;
    case 'back': window.handleBack(); break;
    case 'settings': openSettings(); break;
    case 'save': saveForm(false); break;
    case 'save-send': saveForm(true); break;
    case 'delete': deleteLead(); break;
    case 'send-cancel': closeSend(); break;
    case 'send-go': doSend(); break;
    case 'save-settings': saveSettings(); break;
    case 'reset-templates': resetTemplates(); break;
    case 'excel-open':
      if (!NATIVE) { toast('Solo disponible en la tablet'); break; }
      { const err = window.Android.openExcel(...exportArgs()); if (err) toast('⚠ ' + err); }
      break;
    case 'excel-share':
      if (!NATIVE) { toast('Solo disponible en la tablet'); break; }
      { const err = window.Android.shareExcel(...exportArgs()); if (err) toast('⚠ ' + err); }
      break;
  }
});

$('#send-modal').addEventListener('click', e => { if (e.target.id === 'send-modal') closeSend(); });
$('#search').addEventListener('input', renderList);

/* ------------------------------------------------------------- inicio */

renderList();
if (NATIVE && leads.length) syncExcel(true);
