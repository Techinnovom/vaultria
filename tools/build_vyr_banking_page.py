"""Build site/pages/vyr-banking.html from site/pages/_vyr_banking_extracted.html."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "site/pages/_vyr_banking_extracted.html"
if not SRC.is_file():
    raise SystemExit(
        "Missing site/pages/_vyr_banking_extracted.html — save the standalone VYR Banking HTML there first."
    )

raw = SRC.read_text(encoding="utf-8")
raw = raw.replace("\u00a7", "").replace("\u00A7", "")

start = raw.index('<div class="shell">')
end = raw.index("</div><!-- /shell -->") + len("</div><!-- /shell -->")
block = raw[start:end]
block = block.replace('<main class="main">', '<div class="main">', 1)
li = block.rindex("</main>")
block = block[:li] + "</div>" + block[li + len("</main>") :]

lead = """          <p class="tier-kicker"><a href="economy.html">Economy</a> · <a href="currency.html">Currency</a> · Karelth codex</p>
          <p class="zone-intro">State-controlled VYR, citizen wallet tiers, Nara Birek accounts, no private credit, Civic Bridge Loan, and a full digital audit trail under Karelth.</p>
"""

header = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>VYR Banking and Financial System — VAULTRIA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <link rel="stylesheet" href="../assets/css/layout.css" />
  <link rel="stylesheet" href="../assets/css/vyr-banking.css" />
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
      <div class="wrap vyr-wrap">
        <main id="main-content" class="vyr-banking-page">
"""

footer = """
        </main>

        <footer>
          <p>The Sovereign State of VAULTRIA — a living document.</p>
          <p class="latin">VYR Banking and Financial System · <code>site/pages/vyr-banking.html</code></p>
        </footer>
      </div>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../assets/js/site-nav.js" defer></script>
  <script src="../assets/js/site-search.js" defer></script>
  <script src="../assets/js/vyr-banking.js" defer></script>
</body>
</html>
"""

(SRC.parent / "vyr-banking.html").write_text(header + lead + block + footer, encoding="utf-8")
print("Wrote vyr-banking.html")
