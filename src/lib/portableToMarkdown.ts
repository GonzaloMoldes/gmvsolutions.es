// Portable Text (cuerpo de los articulos de Sanity) -> markdown, para servir
// /blog/<slug>.md igual que los articulos escritos en codigo.
type Span = { _type: string; text?: string; marks?: string[] };
type Block = {
  _type: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  children?: Span[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  alt?: string;
  caption?: string;
  titulo?: string;
  texto?: string;
};

function spans(b: Block): string {
  const defs = new Map((b.markDefs ?? []).map((d) => [d._key, d]));
  return (b.children ?? [])
    .map((s) => {
      let t = s.text ?? '';
      for (const m of s.marks ?? []) {
        if (m === 'strong') t = `**${t}**`;
        else if (m === 'em') t = `*${t}*`;
        else if (defs.get(m)?.href) t = `[${t}](${defs.get(m)!.href})`;
      }
      return t;
    })
    .join('');
}

export function portableToMarkdown(body: unknown[]): string {
  const out: string[] = [];
  let n = 0;
  for (const raw of body as Block[]) {
    if (raw._type === 'block') {
      const t = spans(raw);
      if (raw.listItem) {
        n = raw.listItem === 'number' ? n + 1 : 0;
        out.push(raw.listItem === 'number' ? `${n}. ${t}` : `- ${t}`);
        continue;
      }
      n = 0;
      if (raw.style === 'h2') out.push(`\n## ${t}\n`);
      else if (raw.style === 'h3') out.push(`\n### ${t}\n`);
      else if (raw.style === 'blockquote') out.push(`\n> ${t}\n`);
      else out.push(`\n${t}\n`);
    } else if (raw._type === 'destacado') {
      out.push(`\n> ${raw.titulo ? `**${raw.titulo}** ` : ''}${raw.texto ?? ''}\n`);
    } else if (raw._type === 'image' && raw.alt) {
      out.push(`\n*[Imagen: ${raw.alt}]*\n`);
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
