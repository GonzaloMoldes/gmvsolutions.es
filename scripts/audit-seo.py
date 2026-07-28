#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprueba los indicadores de la auditoria SEO/GEO sobre el HTML ya construido.

    npx astro build && python scripts/audit-seo.py

Mide sobre .vercel/output/static a proposito: un cambio en el .astro no cuenta
como cerrado hasta que aparece en el HTML generado.

Seguimiento y contexto de cada hallazgo: REELEVO_AUDITORIA_SEO_GEO_2026-07.md
Salida: codigo 0 si todo esta cerrado, 1 si queda algo pendiente.
"""
import collections
import glob
import io
import json
import os
import re
import sys

ROOT = os.path.join(".vercel", "output", "static")
BASE = "https://gmvsolutions.es"

# Tipos schema.org validos que emite el site. Lo que aparezca fuera de esta lista
# se reporta: un @type inventado hace que el buscador descarte el bloque entero.
VALID_TYPES = {
    "Organization", "BreadcrumbList", "FAQPage", "BlogPosting", "SoftwareApplication",
    "WebPage", "CollectionPage", "WebSite", "HowTo", "HowToStep", "Product", "Guide",
    "AboutPage", "VideoObject", "Question", "Answer", "ListItem", "Person",
    "PostalAddress", "ContactPoint", "AggregateOffer", "Offer", "ItemList", "Article",
    "SearchAction", "EntryPoint", "ImageObject", "Audience", "Thing",
    "UnitPriceSpecification", "RegisterAction", "AssessAction",
}


def load():
    if not os.path.isdir(ROOT):
        sys.exit("No existe %s. Ejecuta antes: npx astro build" % ROOT)
    pages = {}
    for f in glob.glob(os.path.join(ROOT, "**", "index.html"), recursive=True):
        url = "/" + os.path.relpath(f, ROOT).replace(os.sep, "/").replace("index.html", "")
        pages[re.sub("//+", "/", url)] = io.open(f, encoding="utf-8", errors="replace").read()
    return pages


def schema_nodes(html):
    for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try:
            data = json.loads(raw)
        except ValueError:
            yield {"@type": "JSON_INVALIDO"}
            continue
        for node in (data if isinstance(data, list) else [data]):
            yield node


def walk_types(node):
    if isinstance(node, dict):
        t = node.get("@type")
        if isinstance(t, str):
            yield t
        for v in node.values():
            for x in walk_types(v):
                yield x
    elif isinstance(node, list):
        for v in node:
            for x in walk_types(v):
                yield x


def main():
    pages = load()
    indexable = {u: s for u, s in pages.items() if "noindex" not in (
        re.search(r'<meta name="robots" content="([^"]*)"', s) or
        type("", (), {"group": lambda self, n: ""})()).group(1)}

    results = []          # (id, titulo, pendientes, detalle)

    # P1 — huerfanas
    inbound = collections.Counter()
    for u, s in pages.items():
        body = s.split("<body", 1)[-1]
        for link in set(re.findall(r'href="(/[^"#?]*)"', body)):
            link = link if link.endswith("/") else link + "/"
            if link in pages:
                inbound[link] += 1
    orphans = sorted(u for u in indexable if inbound[u] == 0 and u != "/")
    results.append(("P1", "Paginas huerfanas (0 enlaces internos)", orphans, orphans))

    # P2 — tipos schema no validos
    bad_types = collections.defaultdict(set)
    for u, s in pages.items():
        for node in schema_nodes(s):
            for t in walk_types(node):
                if t not in VALID_TYPES:
                    bad_types[t].add(u)
    bad = ["%s (%d pags.)" % (t, len(us)) for t, us in sorted(bad_types.items())]
    results.append(("P2", "Tipos de schema no validos", bad, bad))

    # P3 — duplicados: canonical a otra URL SIN noindex.
    # Decision 2026-07-28: las /recursos/* se quedan vivas pero con noindex, en vez
    # de redirigir con 301. Un duplicado canonicalizado Y fuera del indice ya no
    # compite, asi que solo se reportan los que siguen siendo indexables.
    dupes = []
    for u, s in indexable.items():
        c = re.search(r'<link rel="canonical" href="([^"]*)"', s)
        if c and c.group(1).rstrip("/") != (BASE + u).rstrip("/"):
            dupes.append("%s -> %s" % (u, c.group(1)))
    results.append(("P3", "Duplicados indexables con canonical cruzado", dupes, dupes))

    # P4 — meta descriptions y titles largos
    long_meta = []
    for u, s in pages.items():
        d = re.search(r'<meta name="description" content="([^"]*)"', s)
        t = re.search(r"<title>(.*?)</title>", s, re.S)
        if d and len(d.group(1)) > 160:
            long_meta.append("description %d car. %s" % (len(d.group(1)), u))
        if t and len(t.group(1).strip()) > 70:
            long_meta.append("title %d car. %s" % (len(t.group(1).strip()), u))
    results.append(("P4", "Titles/descriptions fuera de rango", sorted(long_meta), sorted(long_meta)))

    # P5 — recursos referenciados por los sitemaps que no existen
    missing_assets = []
    for smap in ("sitemap-video.xml", "sitemap.xml"):
        p = os.path.join(ROOT, smap)
        if not os.path.isfile(p):
            continue
        content = io.open(p, encoding="utf-8", errors="replace").read()
        for url in set(re.findall(r"https://gmvsolutions\.es(/[^<\s]+\.(?:jpg|png|webp))", content)):
            if not os.path.isfile(os.path.join(ROOT, url.lstrip("/"))):
                missing_assets.append("%s -> %s (404)" % (smap, url))
    results.append(("P5", "Assets referenciados en sitemaps que no existen",
                    sorted(missing_assets), sorted(missing_assets)))

    # P6 — paginas sin FAQPage (solo producto/comparativa; blog ya cerrado)
    def is_commercial(u):
        return (u.count("/") == 2 and u != "/"
                and not u.startswith(("/blog/", "/legal/", "/recursos/")))
    no_faq = sorted(u for u in indexable if is_commercial(u) and '"FAQPage"' not in pages[u])
    results.append(("P6", "Paginas comerciales sin FAQPage", no_faq, no_faq[:8]))

    # P7 — ausentes de llms.txt.
    # Es un indice CURADO para agentes, no un sitemap: se excluyen a proposito las
    # paginas legales (ruido para un agente) y las /recursos/* (duplicados que
    # canonicalizan a /blog/, ver P3).
    llms_path = os.path.join(ROOT, "llms.txt")
    absent = []
    if os.path.isfile(llms_path):
        llms = io.open(llms_path, encoding="utf-8", errors="replace").read()
        listed = set(re.findall(r"https://gmvsolutions\.es(/[^)\s]*)", llms))
        listed = set(u if u.endswith("/") else u + "/" for u in listed)
        curated = {u for u in indexable
                   if not u.startswith(("/legal/", "/recursos/gestion-",
                                        "/recursos/onboarding-"))}
        absent = sorted(curated - listed)
    results.append(("P7", "Indexables ausentes de llms.txt (curado)", absent, absent[:8]))

    # P8 — sin version markdown
    no_md = sorted(u for u in indexable if 'type="text/markdown"' not in pages[u])
    results.append(("P8", "Paginas sin .md alternate", no_md, no_md[:8]))

    # P10 — peso de las imagenes OG.
    # Decision 2026-07-28: se descarta tener una imagen distinta por seccion; se
    # mantiene una unica imagen social. Lo que si se mide es que no sea pesada
    # (limite 150 KB) y que exista, porque una OG que tarda no se llega a mostrar.
    heavy = []
    for og in {(re.search(r'<meta property="og:image" content="([^"]*)"', s) or
                type("", (), {"group": lambda self, n: None})()).group(1)
               for s in pages.values()}:
        if not og:
            continue
        local = os.path.join(ROOT, og.replace(BASE + "/", ""))
        if not os.path.isfile(local):
            heavy.append("%s (no existe en el build)" % og)
        elif os.path.getsize(local) > 150 * 1024:
            heavy.append("%s (%.0f KB > 150 KB)" % (og, os.path.getsize(local) / 1024))
    results.append(("P10", "Imagenes OG inexistentes o >150 KB", heavy, heavy))

    # ── Informe ─────────────────────────────────────────────────────────────
    print("Auditoria SEO/GEO — %d paginas (%d indexables)\n" % (len(pages), len(indexable)))
    print("  %-5s %-46s %s" % ("ID", "INDICADOR", "PENDIENTE"))
    print("  " + "-" * 72)
    open_items = 0
    for pid, title, pending, sample in results:
        mark = "OK " if not pending else "-- "
        print("  %s%-4s %-46s %d" % (mark, pid, title[:46], len(pending)))
        if pending:
            open_items += 1
            for item in sample:
                print("        %s" % item)
            if len(pending) > len(sample):
                print("        ... y %d mas" % (len(pending) - len(sample)))
    print()

    faq = sum(1 for s in pages.values() if '"FAQPage"' in s)
    md = sum(1 for s in pages.values() if 'type="text/markdown"' in s)
    print("  Cobertura: FAQPage %d/%d · markdown %d/%d" % (faq, len(pages), md, len(pages)))
    print("  Hallazgos abiertos: %d de %d" % (open_items, len(results)))
    return 1 if open_items else 0


if __name__ == "__main__":
    sys.exit(main())
