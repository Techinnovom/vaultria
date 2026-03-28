"""Split the monolithic vaelic textbook into site/pages/textbook/*.html (one file per part).

Run: python tools/build_textbook_parts.py
Requires: site/pages/vaelic-textbook.html (from build_vaelic_textbook_page.py)
"""
from __future__ import annotations

import html as html_mod
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MONO = ROOT / "site/pages/vaelic-textbook.html"
OUT_DIR = ROOT / "site/pages/textbook"
ASSETS_DATA = ROOT / "site/assets/data"
ASSETS_JS = ROOT / "site/assets/js"

ROMAN = ("I", "II", "III", "IV")


def div_block_end(s: str, open_pos: int) -> int:
    gt = s.find(">", open_pos)
    if gt < 0:
        raise ValueError("bad div open")
    i = gt + 1
    depth = 1
    n = len(s)
    while i < n:
        if s.startswith("</div", i):
            m = re.match(r"</div\s*>", s[i:], re.I)
            if not m:
                i += 1
                continue
            depth -= 1
            i += m.end()
            if depth == 0:
                return i
            continue
        if i < n - 4 and s.startswith("<div", i) and re.match(r"<div\b", s[i:], re.I):
            depth += 1
            gt2 = s.find(">", i)
            if gt2 < 0:
                raise ValueError("unclosed <div")
            i = gt2 + 1
            continue
        i += 1
    raise ValueError("unbalanced div")


def extract_content_inner(raw: str) -> str:
    """Take everything inside the textbook .content div.

    Balanced-div parsing stops too early: chapter blocks end with extra ``</div>``
    closers that prematurely close ``.content``. The real close is the ``</div>``
    immediately before ``</section>`` (only one section in this page).
    """
    key = '<div class="content">'
    c_open = raw.find(key)
    if c_open < 0:
        raise SystemExit("Could not find .content in vaelic-textbook.html")
    inner_start = c_open + len(key)
    m = re.search(r"</div>\s*</section>", raw[inner_start:], re.I)
    if not m:
        raise SystemExit("Could not find .content close (</div> before </section>)")
    inner_end = inner_start + m.start()
    return raw[inner_start:inner_end].strip()


def chapter_range(unit: int) -> tuple[int, int]:
    lo = (unit - 1) * 6 + 1
    return lo, lo + 5


def strip_tags_fragment(t: str, max_len: int = 56) -> str:
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return (t[: max_len - 1] + "…") if len(t) > max_len else t


def ch_title_from_block(block: str) -> str:
    m = re.search(r'class="ch-title"[^>]*>([^<]+)', block)
    return html_mod.unescape(m.group(1).strip()) if m else "Chapter"


def sec_label_from_segment(seg: str) -> str:
    m = re.search(
        r'class="sec-num"[^>]*>([^<]+)</div>\s*<h3 class="sec-t"[^>]*>([^<]+)',
        seg,
        re.S,
    )
    if m:
        return f"{m.group(1).strip()} {html_mod.unescape(m.group(2).strip())}"
    if 'class="exs"' in seg:
        m2 = re.search(r'class="exs-hd"[^>]*>([^<]+)', seg)
        return html_mod.unescape(m2.group(1).strip()) if m2 else "Exercises"
    return "Section"


def segment_chapter_inner(ch_inner: str) -> list[str]:
    matches = list(
        re.finditer(r'<div class="sec">|<div class="exs">', ch_inner)
    )
    if not matches:
        return [ch_inner.strip()] if ch_inner.strip() else []
    out: list[str] = []
    first = matches[0].start()
    if first > 0:
        h = ch_inner[:first].strip()
        if h:
            out.append(h)
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(ch_inner)
        chunk = ch_inner[start:end].strip()
        if chunk:
            out.append(chunk)
    return out


def find_top_level_spans(inner: str) -> list[tuple[str, int, dict]]:
    spans: list[tuple[str, int, dict]] = []
    for m in re.finditer(r'<div class="unit-div" id="u(\d+)">', inner):
        spans.append(("unit", m.start(), {"u": int(m.group(1)), "m": m}))
    for m in re.finditer(r'<div class="ch" id="ch(\d+)" data-ch="(\d+)">', inner):
        spans.append(("ch", m.start(), {"ch": int(m.group(2)), "m": m}))
    for m in re.finditer(
        r'<div style="text-align:center;padding:70px 20px;border-top:3px double var\(--r2\)">',
        inner,
    ):
        spans.append(("outro", m.start(), {"m": m}))
    spans.sort(key=lambda x: x[1])
    return spans


def shell_page(
    *,
    title: str,
    breadcrumb: str,
    part_id: str,
    body_html: str,
    prev_href: str | None,
    prev_label: str | None,
    next_href: str | None,
    next_label: str | None,
) -> str:
    te = html_mod.escape(title, quote=True)
    be = html_mod.escape(breadcrumb, quote=True)
    pie = html_mod.escape(part_id, quote=True)
    prev_a = ""
    if prev_href and prev_label:
        ph = html_mod.escape(prev_href, quote=True)
        prev_a = (
            f'<a class="tb-pager-link tb-pager-prev" href="{ph}">'
            f'<span class="tb-pager-dir">←</span> {html_mod.escape(prev_label)}</a>'
        )
    next_a = ""
    if next_href and next_label:
        nh = html_mod.escape(next_href, quote=True)
        next_a = (
            f'<a class="tb-pager-link tb-pager-next" href="{nh}">'
            f'{html_mod.escape(next_label)} <span class="tb-pager-dir">→</span></a>'
        )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{te} — Vaelic textbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../assets/css/main.css" />
  <link rel="stylesheet" href="../../assets/css/layout.css" />
  <link rel="stylesheet" href="../../assets/css/vaelic-textbook.css" />
  <link rel="stylesheet" href="../../assets/css/textbook-shell.css" />
</head>
<body class="textbook-app" data-nav-depth="2" data-part-id="{pie}">
  <a class="visually-hidden" href="#tb-main">Skip to lesson</a>
  <div class="tb-layout">
    <aside class="tb-sidebar" id="tb-sidebar" aria-label="Textbook contents">
      <div class="tb-brand">
        <a class="tb-brand-name" href="index.html">Vaelic</a>
        <div class="tb-brand-sub">Complete language textbook</div>
      </div>
      <nav class="tb-sidebar-links" aria-label="Reference">
        <a href="../vaelic.html">Language reference</a>
        <a href="../vaelic-dictionary.html">Dictionary</a>
        <a href="../vaelic-learning-songs.html">Learning songs</a>
        <a href="index.html" class="is-active">Textbook</a>
      </nav>
      <div class="tb-outline-host" id="tb-outline-host"></div>
    </aside>
    <div class="tb-main" id="tb-main">
      <header class="tb-chrome">
        <div class="tb-breadcrumb">{be}</div>
        <div class="tb-chrome-actions"><a class="tb-icon-link" href="../../index.html" title="VAULTRIA">⌂</a></div>
      </header>
      <article class="tb-sheet vaelic-textbook-page culture-canon" aria-label="Lesson">
        {body_html}
      </article>
      <nav class="tb-pager" aria-label="Previous and next lesson">
        {prev_a}
        {next_a}
      </nav>
      <footer class="tb-foot">
        <a class="tb-back-vault" href="../../index.html">← VAULTRIA</a>
      </footer>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../../assets/js/textbook-manifest.js" defer></script>
  <script src="../../assets/js/textbook-shell.js" defer></script>
  <script src="../../assets/js/vaelic-textbook.js" defer></script>
  <script src="../../assets/js/site-nav.js" defer></script>
  <script src="../../assets/js/site-search.js" defer></script>
</body>
</html>
"""


def flat_part_from_pid(fname: str, pid: str, bc: str, title: str) -> dict:
    if pid == "u4-outro":
        return {
            "id": pid,
            "file": fname,
            "title": title,
            "breadcrumb": bc,
            "unit": 4,
            "chapter": None,
            "part": 0,
        }
    mo = re.match(r"u(\d+)-overview$", pid)
    if mo:
        return {
            "id": pid,
            "file": fname,
            "title": title,
            "breadcrumb": bc,
            "unit": int(mo.group(1)),
            "chapter": None,
            "part": 0,
        }
    mch = re.match(r"u(\d+)-c(\d+)-p(\d+)$", pid)
    if mch:
        return {
            "id": pid,
            "file": fname,
            "title": title,
            "breadcrumb": bc,
            "unit": int(mch.group(1)),
            "chapter": int(mch.group(2)),
            "part": int(mch.group(3)),
        }
    raise ValueError(f"bad pid {pid}")


def main() -> None:
    if not MONO.is_file():
        raise SystemExit(f"Missing {MONO} — run tools/build_vaelic_textbook_page.py first.")
    raw = MONO.read_text(encoding="utf-8")
    inner = extract_content_inner(raw)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS_DATA.mkdir(parents=True, exist_ok=True)
    ASSETS_JS.mkdir(parents=True, exist_ok=True)

    spans = find_top_level_spans(inner)
    unit_titles: dict[int, str] = {}
    for i, (kind, pos, meta) in enumerate(spans):
        m = meta["m"]
        start = m.start()
        end = spans[i + 1][1] if i + 1 < len(spans) else len(inner)
        block = inner[start:end]
        if kind == "unit":
            u = meta["u"]
            um = re.search(r'class="unit-title"[^>]*>([^<]+)', block)
            unit_titles[u] = html_mod.unescape(um.group(1).strip()) if um else f"Unit {u}"

    manifest_units: list[dict] = []
    for u in range(1, 5):
        manifest_units.append(
            {
                "n": u,
                "roman": ROMAN[u - 1],
                "title": unit_titles.get(u, f"Unit {ROMAN[u - 1]}"),
                "chapters": [],
            }
        )
    unit_idx = {u: manifest_units[u - 1] for u in range(1, 5)}

    writes: list[tuple[str, str, str, str, str]] = []

    for i, (kind, pos, meta) in enumerate(spans):
        m = meta["m"]
        start = m.start()
        end = spans[i + 1][1] if i + 1 < len(spans) else len(inner)
        block = inner[start:end]

        if kind == "unit":
            u = meta["u"]
            utitle = unit_titles.get(u, f"Unit {ROMAN[u - 1]}")
            pid = f"u{u}-overview"
            fname = f"u{u}-overview.html"
            breadcrumb = f"Unit {ROMAN[u - 1]} — {utitle}"
            body = f'<div class="tb-unit-overview">\n{block}\n</div>\n'
            writes.append((fname, pid, breadcrumb, utitle, body))
            unit_idx[u]["overviewFile"] = fname

        elif kind == "ch":
            ch = meta["ch"]
            u = (ch - 1) // 6 + 1
            open_m = re.match(r"<div[^>]+>", block)
            if not open_m:
                continue
            ch_inner = block[open_m.end() : div_block_end(block, 0) - len("</div>")].strip()
            segments = segment_chapter_inner(ch_inner)
            cht = ch_title_from_block(block)
            ut = unit_titles.get(u, "")
            breadcrumb = f"Chapter {ch} · Unit {ROMAN[u - 1]} — {ut}"

            ch_entry = {"n": ch, "title": cht, "parts": []}
            unit_idx[u]["chapters"].append(ch_entry)

            for p_idx, seg in enumerate(segments):
                label = "Introduction" if p_idx == 0 else sec_label_from_segment(seg)
                fname = f"u{u}-c{ch}-p{p_idx}.html"
                pid = f"u{u}-c{ch}-p{p_idx}"
                title = f"{cht} — {label}"
                body = (
                    f'<div class="tb-part-head">'
                    f'<p class="tb-kicker">{html_mod.escape(breadcrumb)}</p>'
                    f'<h1 class="tb-h1">{html_mod.escape(cht)}</h1>'
                    f'<p class="tb-sub">{html_mod.escape(label)}</p></div>\n'
                    f'<div class="ch tb-fragment" id="ch{ch}" data-ch="{ch}">\n{seg}\n</div>'
                )
                writes.append((fname, pid, breadcrumb, title, body))
                ch_entry["parts"].append({"id": pid, "file": fname, "label": label})

        elif kind == "outro":
            fname = "u4-outro.html"
            pid = "u4-outro"
            breadcrumb = "Unit IV — Closing"
            title = "Closing — Kiratvel navol"
            body = (
                '<div class="tb-part-head"><h1 class="tb-h1">Closing</h1>'
                '<p class="tb-sub">Kiratvel navol</p></div>\n' + block
            )
            writes.append((fname, pid, breadcrumb, title, body))
            unit_idx[4]["outroFile"] = fname

    flat_parts = [flat_part_from_pid(*w[:4]) for w in writes]

    for idx, (fname, pid, bc, title, body) in enumerate(writes):
        prev_href = prev_label = next_href = next_label = None
        if idx > 0:
            p0 = flat_parts[idx - 1]
            prev_href = p0["file"]
            prev_label = strip_tags_fragment(p0["title"])
        if idx + 1 < len(writes):
            p1 = flat_parts[idx + 1]
            next_href = p1["file"]
            next_label = strip_tags_fragment(p1["title"])
        page = shell_page(
            title=title,
            breadcrumb=bc,
            part_id=pid,
            body_html=body,
            prev_href=prev_href,
            prev_label=prev_label,
            next_href=next_href,
            next_label=next_label,
        )
        (OUT_DIR / fname).write_text(page, encoding="utf-8")

    manifest = {"units": manifest_units, "parts": flat_parts}
    (ASSETS_DATA / "textbook-manifest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8"
    )
    (ASSETS_JS / "textbook-manifest.js").write_text(
        "window.TEXTBOOK_MANIFEST = "
        + json.dumps(manifest, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )

    hub = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Vaelic textbook — start here</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600&family=Crimson+Pro:ital,wght@0,400;0,600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../assets/css/main.css" />
  <link rel="stylesheet" href="../../assets/css/layout.css" />
  <link rel="stylesheet" href="../../assets/css/textbook-shell.css" />
</head>
<body class="textbook-app textbook-hub" data-nav-depth="2" data-part-id="hub">
  <div class="tb-layout tb-layout--hub">
    <main class="tb-hub-main">
      <h1 class="tb-hub-title">Vaelic language textbook</h1>
      <p class="tb-hub-lede">Each lesson is its own file under <code>site/pages/textbook/</code>. Regenerate with <code>python tools/build_textbook_parts.py</code> after editing the monolith source. For local preview, run <code>site/serve.cmd</code> (or <code>python -m http.server 8765</code> inside <code>site/</code>) and open <code>http://localhost:8765/pages/textbook/</code> — do not rely on <code>file://</code> (Chrome blocks it).</p>
      <ul class="tb-hub-units">
"""
    for u in range(1, 5):
        uf = f"u{u}-overview.html"
        t = html_mod.escape(unit_titles.get(u, f"Unit {ROMAN[u-1]}"))
        hub += f'        <li><a class="tb-hub-card" href="{uf}"><span class="tb-hub-roman">Unit {ROMAN[u-1]}</span><span class="tb-hub-ut">{t}</span></a></li>\n'
    hub += """      </ul>
      <p class="tb-hub-meta"><a href="../vaelic.html">Language reference</a> · <a href="../../index.html">VAULTRIA home</a></p>
    </main>
  </div>
  <script src="../../assets/js/textbook-manifest.js" defer></script>
  <script src="../../assets/js/textbook-shell.js" defer></script>
  <script src="../../assets/js/vaelic-textbook.js" defer></script>
  <script src="../../assets/js/site-nav.js" defer></script>
</body>
</html>
"""
    (OUT_DIR / "index.html").write_text(hub, encoding="utf-8")

    print("Wrote", len(writes), "part pages + index ->", OUT_DIR)


if __name__ == "__main__":
    main()
