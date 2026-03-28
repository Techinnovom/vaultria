"""Build site/pages/zone-atlas.html from site/pages/_zone_atlas_extracted.html."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "site/pages/_zone_atlas_extracted.html"
TRANSCRIPT = Path.home() / (
    ".cursor/projects/c-Users-obasi-Documents-GitHub-vaultria/"
    "agent-transcripts/1786d4f3-ed70-4bff-944a-26278a56f6fa/"
    "1786d4f3-ed70-4bff-944a-26278a56f6fa.jsonl"
)

if not SRC.is_file():
    if TRANSCRIPT.is_file():
        n_title = "Zone Atlas \u2014 The Sovereign State of Vaultria"
        n_body = "Official Zone Atlas"
        for line in TRANSCRIPT.open(encoding="utf-8"):
            if n_title not in line or n_body not in line:
                continue
            try:
                o = json.loads(line)
            except json.JSONDecodeError:
                continue
            msg = o.get("message") or {}
            content = msg.get("content")
            if not content or not isinstance(content, list):
                continue
            text = content[0].get("text", "") if isinstance(content[0], dict) else ""
            if "<!DOCTYPE html>" not in text:
                continue
            i = text.index("<!DOCTYPE html>")
            j = text.rindex("</html>") + len("</html>")
            SRC.write_text(text[i:j], encoding="utf-8")
            break
        else:
            raise SystemExit(
                "Missing site/pages/_zone_atlas_extracted.html and could not read from transcript."
            )
    else:
        raise SystemExit(
            "Missing site/pages/_zone_atlas_extracted.html — save the standalone Zone Atlas HTML there first."
        )

raw = SRC.read_text(encoding="utf-8")
raw = raw.replace("\u00a7", "").replace("\u00A7", "")

start = raw.index('<div class="shell">')
li = raw.rindex("</main>")
end = raw.index("</div>", li) + len("</div>")
block = raw[start:end]
block = block.replace('<main class="main">', '<div class="main">', 1)
li2 = block.rindex("</main>")
block = block[:li2] + "</div>" + block[li2 + len("</main>") :]

lead = (
    '          <p class="tier-kicker"><a href="territory.html">Territory</a> '
    "· <a href=\"national-map.html\">National map</a> · Twelve zones</p>\n"
    '          <p class="zone-intro">Official atlas of Vaultria: each zone across '
    "overview, geography, nodes, economy, governance, culture, and inter-zone relations.</p>\n"
)

header = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Zone Atlas — VAULTRIA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <link rel="stylesheet" href="../assets/css/layout.css" />
  <link rel="stylesheet" href="../assets/css/zone-atlas.css" />
</head>
<body data-nav-depth="1">
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
      <div class="wrap zone-atlas-wrap">
        <main id="main-content" class="zone-atlas-page">
"""

footer = """
        </main>

        <footer>
          <p>The Sovereign State of VAULTRIA — a living document.</p>
          <p class="latin">Zone Atlas · <code>site/pages/zone-atlas.html</code></p>
        </footer>
      </div>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../assets/js/site-nav.js" defer></script>
  <script src="../assets/js/site-search.js" defer></script>
  <script src="../assets/js/zone-atlas.js" defer></script>
</body>
</html>
"""

(ROOT / "site/pages/zone-atlas.html").write_text(header + lead + block + footer, encoding="utf-8")
print("Wrote zone-atlas.html")
