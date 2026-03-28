"""Build site/pages/criminal-code.html from extracted standalone source.

If site/pages/_cc_extracted.html is missing, tries to pull the original
standalone HTML from a Cursor agent transcript (same machine path pattern).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "site/pages/_cc_extracted.html"

if not SRC.is_file():
    transcript = Path.home() / ".cursor/projects/c-Users-obasi-Documents-GitHub-vaultria/agent-transcripts/1786d4f3-ed70-4bff-944a-26278a56f6fa/1786d4f3-ed70-4bff-944a-26278a56f6fa.jsonl"
    if transcript.is_file():
        raw = None
        for line in transcript.open(encoding="utf-8"):
            try:
                o = json.loads(line)
            except json.JSONDecodeError:
                continue
            msg = o.get("message") or {}
            content = msg.get("content")
            if not content or not isinstance(content, list):
                continue
            text = content[0].get("text", "") if isinstance(content[0], dict) else ""
            if "<!DOCTYPE html>" in text and "Art. I.0.1" in text:
                i = text.index("<!DOCTYPE html>")
                j = text.rindex("</html>") + len("</html>")
                raw = text[i:j]
                break
        if raw:
            SRC.write_text(raw, encoding="utf-8")
        else:
            raise SystemExit("Could not find Criminal Code HTML in transcript; add site/pages/_cc_extracted.html")

raw = SRC.read_text(encoding="utf-8")
raw = raw.replace("\u00a7", "").replace("\u00A7", "")

start = raw.index('<div class="shell">')
end = raw.index("</div><!-- /shell -->") + len("</div><!-- /shell -->")
block = raw[start:end]
block = block.replace('<main class="main">', '<div class="main">', 1)
li = block.rindex("</main>")
block = block[:li] + "</div>" + block[li + len("</main>") :]

tier = """          <p class="tier-kicker"><a href="codex.html">Codex</a> · Volume IV · Criminal law</p>
          <p class="zone-intro">The classification of offenses against citizens, the state, and the order of Vaultrian life. Four classes. Ten categories. No death penalty. Citizens born in Vaultria cannot be removed from it.</p>
"""

header = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Vaultrian Criminal Code — Codex Vol. IV — VAULTRIA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <link rel="stylesheet" href="../assets/css/layout.css" />
  <link rel="stylesheet" href="../assets/css/criminal-code.css" />
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
      <div class="wrap cc-wrap">
        <main id="main-content" class="criminal-code-page">
"""

footer = """
        </main>

        <footer>
          <p>The Sovereign State of VAULTRIA — a living document.</p>
          <p class="latin">Vaultrian Criminal Code · <code>site/pages/criminal-code.html</code></p>
        </footer>
      </div>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../assets/js/site-nav.js" defer></script>
  <script src="../assets/js/site-search.js" defer></script>
  <script src="../assets/js/criminal-code.js" defer></script>
</body>
</html>
"""

out = header + tier + block + footer
(ROOT / "site/pages/criminal-code.html").write_text(out, encoding="utf-8")
print("Wrote criminal-code.html", len(out), "bytes")
