"""Build vaelic-textbook.html from _vaelic_textbook_extracted.html (or pull from Cursor transcript)."""
import html
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "site/pages/_vaelic_textbook_extracted.html"
OUT = ROOT / "site/pages/vaelic-textbook.html"
GEN = ROOT / "tools/gen_vaelic_textbook_css.py"

TITLE_MARK = "Vaelic — Complete Language Textbook"


def transcript_files():
    base = Path.home() / ".cursor/projects/c-Users-obasi-Documents-GitHub-vaultria/agent-transcripts"
    if base.is_dir():
        yield from sorted(base.rglob("*.jsonl"))


def pull_from_transcript() -> bool:
    for path in transcript_files():
        if "subagents" in path.parts:
            continue
        try:
            raw = path.read_text(encoding="utf-8")
        except OSError:
            continue
        if TITLE_MARK not in raw:
            continue
        for line in raw.splitlines():
            if TITLE_MARK not in line:
                continue
            try:
                o = json.loads(line)
            except json.JSONDecodeError:
                continue
            msg = o.get("message") or {}
            content = msg.get("content")
            if not content or not isinstance(content, list):
                continue
            piece = content[0].get("text", "") if isinstance(content[0], dict) else ""
            if "<!DOCTYPE html>" not in piece:
                continue
            t = piece
            if "<user_query>" in t and "<!DOCTYPE html>" in t:
                t = t[t.index("<!DOCTYPE html>") :]
            i = 0
            j = t.rindex("</html>") + len("</html>")
            body = t[i:j]
            SRC.write_text(body, encoding="utf-8")
            print("Wrote", SRC, "from transcript", path.name)
            return True
    return False


def extract_content_children(s: str) -> str:
    """Inner HTML of the first <div class=\"content\">, up to its closing tag before <script>."""
    m = re.search(r'<div\s+class="content"\s*>', s)
    if not m:
        raise SystemExit("Could not find <div class=\"content\"> in source.")
    start = m.end()
    tail = s[start:]
    end_m = re.search(r"</div>\s*\n\s*<script\b", tail, re.I)
    if not end_m:
        raise SystemExit(
            "Could not find </div> before <script> (expected standalone textbook body end)."
        )
    return tail[: end_m.start()].strip()


def patch_inner(inner: str) -> str:
    inner = inner.replace('<div class="tt">', '<table class="tt">', 1)
    inner = re.sub(r'\s*onclick="[^"]*"', "", inner)
    inner = inner.replace("'Playfair Display',serif", "'Crimson Pro',serif")
    inner = inner.replace('"Playfair Display",serif', '"Crimson Pro",serif')
    inner = inner.replace("'Lora',serif", "'Crimson Pro',serif")
    inner = inner.replace('"Lora",serif', '"Crimson Pro",serif')
    inner = inner.replace("'Source Serif 4',serif", "'Crimson Pro',serif")
    inner = inner.replace('"Source Serif 4",serif', '"Crimson Pro",serif')
    inner = re.sub(r'\s+style="color:rgba\([^"]+\)"', "", inner)
    return inner


def shell(body: str) -> str:
    t = "Vaelic — Complete language textbook — VAULTRIA"
    te = html.escape(t, quote=True)
    lead = (
        '          <p class="tier-kicker"><a href="vaelic.html">Vaelic</a> · '
        '<a href="vaelic-dictionary.html">Dictionary</a> · '
        '<a href="vaelic-learning-songs.html">Learning songs</a> · Language textbook</p>\n'
        '          <h1 class="page-title">Complete language textbook</h1>\n'
        '          <p class="zone-intro">Use the <strong>left sidebar</strong> (menu button on small screens) like a Word navigation pane: '
        "expand units and chapters, then open the intro, a numbered section, or exercises. One part shows at a time in the reading area. "
        "Links: <code>#u2</code>, <code>#u2-c8</code>, <code>#u1-c1-p2</code>, <code>#u4-outro</code>.</p>\n"
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{te}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <link rel="stylesheet" href="../assets/css/layout.css" />
  <link rel="stylesheet" href="../assets/css/vaelic-textbook.css" />
</head>
<body data-nav-depth="1" class="vt-textbook-outline">
  <a class="visually-hidden" href="#main-content">Skip to content</a>
  <div class="bg-vault" aria-hidden="true"></div>
  <div class="site-shell">
    <aside class="site-sidebar" id="site-sidebar" aria-label="Site navigation"></aside>
    <div class="site-main">
      <header class="site-topbar">
        <button type="button" class="site-nav-toggle" id="site-nav-toggle" aria-expanded="false" aria-controls="site-sidebar">
          <span class="site-nav-toggle-bars" aria-hidden="true"></span>
          <span class="visually-hidden">Open menu</span>
        </button>
        <a href="../index.html" class="site-topbar-brand">VAULTRIA</a>
      </header>
      <div class="wrap vaelic-textbook-wrap">
        <main id="main-content" class="vaelic-textbook-page culture-canon">
{lead}
          <section class="card vaelic-textbook-sheet" aria-label="Vaelic language textbook contents">
          <div class="content">

{body}

          </div>
          </section>
        </main>

        <footer>
          <p>The Sovereign State of VAULTRIA — a living document.</p>
          <p class="latin">Vaelic language textbook · <code>site/pages/vaelic-textbook.html</code></p>
        </footer>
      </div>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../assets/js/site-nav.js" defer></script>
  <script src="../assets/js/site-search.js" defer></script>
  <script src="../assets/js/vaelic-textbook.js" defer></script>
</body>
</html>
"""


def main() -> None:
    if not SRC.is_file():
        if not pull_from_transcript():
            raise SystemExit(
                "Missing site/pages/_vaelic_textbook_extracted.html — "
                "save the standalone textbook HTML there, or run on a machine with the Cursor transcript."
            )

    subprocess.run([sys.executable, str(GEN)], cwd=str(ROOT), check=True)

    raw = SRC.read_text(encoding="utf-8")
    raw = raw.replace("\u00a7", "").replace("\u00A7", "")
    inner = extract_content_children(raw)
    inner = patch_inner(inner)
    OUT.write_text(shell(inner), encoding="utf-8")
    print("Wrote", OUT)


if __name__ == "__main__":
    main()
