// src/data/descargables.ts
// Catálogo de recursos que se entregan a cambio de una cuenta lead
// (ESPEC_DESCARGA_CON_CUENTA_LEAD_2026-09.md §4.2, tarea DL-3).
//
// Un botón activa la función con `data-descarga="<id>"`, y ese id tiene que estar
// aquí: `scripts/check-descargables.mjs` hace fallar el build si no lo está, o si el
// archivo no existe en src/descargables/.
//
// El `id` es ESTABLE: la app lo guarda como `origen_ref` del lead y como `recurso` de
// cada descarga (marketing_lead_descargas). Cambiarlo parte el historial en dos.
//
// `modulo` es la ruta de la app (/empresa/<modulo>) donde aterriza quien completa su
// cuenta después de descargar este recurso (DL-13).

export type TipoDescargable = 'plantilla' | 'guia'

export interface Descargable {
  titulo: string
  /** Nombre del archivo dentro de src/descargables/. */
  archivo: string
  tipo: TipoDescargable
  modulo: string
  mime: string
}

const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const DESCARGABLES = {
  'plantilla-sop': {
    titulo: 'Plantilla de SOP de producción',
    archivo: 'plantilla-sop-produccion-reelevo.docx',
    tipo: 'plantilla',
    modulo: 'procesos',
    mime: DOCX,
  },
  'plantilla-it': {
    titulo: 'Plantilla de instrucción de trabajo',
    archivo: 'plantilla-instruccion-de-trabajo-reelevo.docx',
    tipo: 'plantilla',
    modulo: 'procesos',
    mime: DOCX,
  },
} as const satisfies Record<string, Descargable>

export type DescargableId = keyof typeof DESCARGABLES

export function esDescargableId(valor: string): valor is DescargableId {
  return Object.prototype.hasOwnProperty.call(DESCARGABLES, valor)
}
