/// <reference path="../.astro/types.d.ts" />

// Importacion cruda de markdown (src/content/llms-base.md), usada por src/lib/llms.ts.
declare module '*.md?raw' {
  const contenido: string;
  export default contenido;
}
