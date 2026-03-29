import re

path = r"c:\Users\obasi\Documents\GitHub\vaultria\site\pages\_territory_ref_extract.html"
raw = open(path, encoding="utf-8").read()
if "<!DOCTYPE" in raw:
    raw = raw[raw.index("<!DOCTYPE") :]
if "</html>" in raw:
    raw = raw[: raw.rindex("</html>") + 7]

m = re.search(r"<style>(.*?)</style>", raw, re.DOTALL)
css = m.group(1) if m else ""

m2 = re.search(r"<body[^>]*>(.*)</body>", raw, re.DOTALL)
body = m2.group(1) if m2 else ""

body = re.sub(r"<!-- COVER -->.*?</nav>\s*", "", body, flags=re.DOTALL)

body = body.replace("zone-card", "tz-zone-card")
css = css.replace(".zone-card", ".tz-zone-card")

replacements = [
    ('id="summary"', 'id="territory-summary"'),
    ("id='summary'", "id='territory-summary'"),
    ('id="zones"', 'id="territory-zones"'),
    ('id="rail"', 'id="territory-rail"'),
    ('id="roads"', 'id="territory-roads"'),
    ('id="airports"', 'id="territory-airports"'),
]
for a, b in replacements:
    body = body.replace(a, b)

# Scope palette to embed only (do not override site :root)
css = re.sub(r":root\s*\{[^}]*\}", "", css, flags=re.DOTALL)
EMBED_VARS = """
.territory-embed {
  --ink: #05050c;
  --bg2: #0c0c18;
  --gold: #c9a84c;
  --gold-l: #e8c97a;
  --gold-d: #5a4010;
  --text: #c4bdb0;
  --text2: #6a6258;
  --text3: #282018;
  --rule: rgba(201, 168, 76, 0.09);
  --core: #c03a3a;
  --civil: #2e6ab8;
  --infra: #b87c18;
  --know: #2a7848;
  --prime: #c9a84c;
  --civic: #5a8ae8;
  --industrial: #c8a020;
  --knowledge-r: #4aaa68;
  --tech: #3a9858;
  --defense: #e05050;
  --restricted: #e05050;
  --trade: #4a78c8;
}
"""

# Strip global resets that break the site shell
css = re.sub(r"\*,\*::before,\*::after\{[^}]*\}", "", css)
css = re.sub(r"html\{[^}]*\}", "", css)
css = re.sub(r"body\{[^}]*\}", "", css)
css = re.sub(r"::-webkit-scrollbar[^}]*\}", "", css)

# Match site typography in reference rules
css = css.replace("'Crimson Pro',serif", '"Source Serif 4", Georgia, serif')
css = css.replace("'Share Tech Mono',monospace", "Cinzel, serif")

body = body.replace("'Crimson Pro',serif", '"Source Serif 4", Georgia, serif')
body = body.replace("'Share Tech Mono',monospace", "Cinzel, serif")

css = EMBED_VARS + "\n" + css
# Scope rules that would leak site-wide
css = css.replace("hr{", ".territory-embed hr{")
css = css.replace(".footer{", ".territory-embed .footer{")
# Avoid hidden content before scroll (reference used fade-in)
css = css.replace(
    ".sec{padding:64px 22px;max-width:1060px;margin:0 auto;opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}",
    ".sec{padding:2rem 0;max-width:1060px;margin:0 auto;opacity:1}",
)
css += "\n.sec { scroll-margin-top: 5.5rem; }\n"

# Drop standalone reference footer + duplicate script (nav + toggle live in page footer)
body = re.sub(r"<div class=\"footer\">.*?</div>\s*", "", body, flags=re.DOTALL)
body = re.sub(r"<script>.*?</script>\s*\Z", "", body, flags=re.DOTALL)

body = '<div class="territory-embed">\n' + body.strip() + "\n</div>\n"

out_path = r"c:\Users\obasi\Documents\GitHub\vaultria\site\pages\territory.html"

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>National Territory — VAULTRIA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <link rel="stylesheet" href="../assets/css/layout.css" />
  <style>
"""

NAV_STYLES = """
    .territory-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin: 1rem 0 1.25rem;
      padding: 0.65rem 0;
      position: sticky;
      top: 0;
      z-index: 10;
      background: linear-gradient(to bottom, var(--bg-deep) 75%, transparent);
    }
    .territory-nav a {
      font-family: Cinzel, serif;
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.45rem 0.72rem;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg-deep);
      color: var(--text-muted);
      text-decoration: none;
    }
    .territory-nav a:hover {
      color: var(--gold);
      border-color: rgba(201, 169, 98, 0.45);
    }
    .territory-nav a.is-active {
      color: var(--gold);
      border-color: var(--gold);
      background: rgba(201, 169, 98, 0.08);
    }
    .territory-nav a:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 2px;
    }
    .territory-stat-n {
      font-family: Cinzel, serif;
      font-size: 1.35rem;
      color: var(--gold);
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 0.15rem;
    }
    .territory-stat-l {
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--gold-dim);
    }
    .territory-cats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 1rem;
    }
    .territory-cat {
      font-size: 0.62rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 0.3rem 0.55rem;
      border: 1px solid var(--border);
      border-radius: 3px;
    }
    .territory-cat--core { color: #c03a3a; border-color: rgba(192, 58, 58, 0.35); }
    .territory-cat--civil { color: #2e6ab8; border-color: rgba(46, 106, 184, 0.35); }
    .territory-cat--infra { color: #b87c18; border-color: rgba(184, 124, 24, 0.35); }
    .territory-cat--know { color: #2a7848; border-color: rgba(42, 120, 72, 0.35); }
"""

TAIL = """
  </style>
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
      <div class="wrap">
        <main id="main-content" class="culture-canon">
          <p class="tier-kicker">Operations · Territory</p>
          <h1 class="page-title"><span class="h2-ico" aria-hidden="true">🗺️</span> National Territory Layout</h1>
          <p class="zone-intro">
            Official reference: zones, nodes, major roads, FlowNet rail, and airports. Twelve zones in four categories; every capital node connects to the national rail network.
          </p>

          <div class="card prose">
            <p><strong>Vaultrian Territory Authority</strong> — All zones · All nodes · All roads · FlowNet rail · Airports</p>
            <ul class="subject-grid" aria-label="Territory counts">
              <li><span class="territory-stat-n">12</span><span class="territory-stat-l">Zones</span></li>
              <li><span class="territory-stat-n">38</span><span class="territory-stat-l">Nodes</span></li>
              <li><span class="territory-stat-n">10</span><span class="territory-stat-l">Major roads</span></li>
              <li><span class="territory-stat-n">8</span><span class="territory-stat-l">Rail lines</span></li>
              <li><span class="territory-stat-n">5</span><span class="territory-stat-l">Airports</span></li>
            </ul>
            <div class="territory-cats" aria-label="Zone categories">
              <span class="territory-cat territory-cat--core">Core Power · 3</span>
              <span class="territory-cat territory-cat--civil">Civilian · 4</span>
              <span class="territory-cat territory-cat--infra">Infrastructure · 3</span>
              <span class="territory-cat territory-cat--know">Knowledge · 2</span>
            </div>
          </div>

          <nav class="territory-nav" aria-label="Territory sections">
            <a href="#territory-summary" class="is-active">Summary</a>
            <a href="#territory-zones">Zones &amp; nodes</a>
            <a href="#territory-roads">Roads</a>
            <a href="#territory-rail">FlowNet rail</a>
            <a href="#territory-airports">Airports</a>
          </nav>

"""

FOOTER = """
          <footer>
            <p>The Sovereign State of VAULTRIA — a living document.</p>
            <p class="latin">Vaultrian National Territory — full layout reference · Territory Authority · Est. 2025 · 12 zones · 38 nodes · 10 roads · 8 rail lines · 16 air facilities (12 Kelos domestic + int'l, cargo, 2 restricted)</p>
            <p class="latin"><code>site/pages/territory.html</code></p>
          </footer>
        </main>
      </div>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../assets/js/site-nav.js" defer></script>
  <script src="../assets/js/site-search.js" defer></script>
  <script>
    function toggleZone(hdr) {
      var body = hdr.nextElementSibling;
      var tog = hdr.querySelector(".zc-toggle");
      var open = body.classList.toggle("open");
      if (tog) tog.textContent = open ? "↑" : "↓";
      if (hdr.parentElement) {
        hdr.parentElement.style.borderColor = open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)";
      }
    }
    (function () {
      var links = document.querySelectorAll(".territory-nav a");
      var ids = ["territory-summary", "territory-zones", "territory-roads", "territory-rail", "territory-airports"];
      var offset = 130;
      function syncActive() {
        var y = window.scrollY + offset;
        var active = 0;
        for (var i = 0; i < ids.length; i++) {
          var el = document.getElementById(ids[i]);
          if (!el) continue;
          var top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= y) active = i;
        }
        links.forEach(function (a, j) {
          a.classList.toggle("is-active", j === active);
        });
      }
      window.addEventListener("scroll", syncActive, { passive: true });
      syncActive();
    })();
  </script>
</body>
</html>
"""

full = HEAD + NAV_STYLES + "\n" + css + TAIL + body + FOOTER
open(out_path, "w", encoding="utf-8").write(full)
print("Wrote", out_path, "chars", len(full))
