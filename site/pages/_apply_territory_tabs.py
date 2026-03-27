"""
Restructure territory.html:
- Replace anchor nav with accessible tabs (holiday-tab pattern)
- Wrap embed sections in role=tabpanel; hide non-active panels
- Remove stray broken closing tags / footer junk inside embed
- Fix corrupted CSS snippets and invalid inline font-family quotes
"""
from __future__ import annotations

import re
from pathlib import Path


def main() -> None:
    path = Path(__file__).with_name("territory.html")
    html = path.read_text(encoding="utf-8")

    # --- Fix broken CSS fragments (from earlier corruption) ---
    html = html.replace(
        ".zc-toggle{margin-left:auto;font-family:Cinzel, serif;font-size:.6rem;color:var(--gold-d);flex-shrink:0}\n.zc-\n.zc-body.open{display:block}",
        ".zc-toggle{margin-left:auto;font-family:Cinzel, serif;font-size:.6rem;color:var(--gold-d);flex-shrink:0}\n"
        ".zc-body{display:none;padding:0 18px 18px;border-top:1px solid rgba(255,255,255,.04)}\n"
        ".zc-body.open{display:block}",
    )
    html = html.replace(
        ".rst-vline.none{background:transparent}\n.rst-\n.rst:last-child .rst-\n.rst-name{font-family:'Cinzel',serif;font-size:.82rem;letter-spacing:.03em;margin-bottom:1px}",
        ".rst-vline.none{background:transparent}\n"
        ".rst-body{flex:1;padding:6px 0 6px 12px;border-bottom:1px solid rgba(255,255,255,.03)}\n"
        ".rst:last-child .rst-body{border-bottom:none}\n"
        ".rst-name{font-family:'Cinzel',serif;font-size:.82rem;letter-spacing:.03em;margin-bottom:1px}",
    )

    # --- Invalid inline style quotes ---
    html = html.replace(
        'style="font-family:"Source Serif 4", Georgia, serif;',
        'style="font-family: &quot;Source Serif 4&quot;, Georgia, serif;',
    )

    # --- Inject holiday-tab styles if missing (territory page doesn't include them) ---
    if ".holiday-tablist" not in html:
        inject = """

    .holiday-tablist {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin: 1rem 0 0.9rem;
      padding: 0;
      list-style: none;
    }
    .holiday-tab {
      font-family: Cinzel, serif;
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.45rem 0.72rem;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg-deep);
      color: var(--text-muted);
      cursor: pointer;
    }
    .holiday-tab.is-active {
      color: var(--gold);
      border-color: var(--gold);
      background: rgba(201, 169, 98, 0.08);
    }
    .holiday-tab:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 2px;
    }
    [data-territory-tabs] .territory-embed {
      margin-top: 0.35rem;
    }
"""
        html = html.replace(
            "    .territory-cat--know { color: #2a7848; border-color: rgba(42, 120, 72, 0.35); }\n",
            "    .territory-cat--know { color: #2a7848; border-color: rgba(42, 120, 72, 0.35); }\n" + inject + "\n",
            1,
        )

    # --- Replace anchor nav + open tab root ---
    old_nav = """          <nav class="territory-nav" aria-label="Territory sections">
            <a href="#territory-summary" class="is-active">Summary</a>
            <a href="#territory-zones">Zones &amp; nodes</a>
            <a href="#territory-roads">Roads</a>
            <a href="#territory-rail">FlowNet rail</a>
            <a href="#territory-airports">Airports</a>
          </nav>

<div class="territory-embed">"""

    new_nav = """          <div data-territory-tabs>
            <div class="holiday-tablist" role="tablist" aria-label="Territory reference">
              <button type="button" class="holiday-tab is-active" role="tab" id="territory-tab-summary" aria-controls="territory-panel-summary" aria-selected="true">Summary</button>
              <button type="button" class="holiday-tab" role="tab" id="territory-tab-zones" aria-controls="territory-panel-zones" aria-selected="false" tabindex="-1">Zones &amp; nodes</button>
              <button type="button" class="holiday-tab" role="tab" id="territory-tab-roads" aria-controls="territory-panel-roads" aria-selected="false" tabindex="-1">Roads</button>
              <button type="button" class="holiday-tab" role="tab" id="territory-tab-rail" aria-controls="territory-panel-rail" aria-selected="false" tabindex="-1">FlowNet rail</button>
              <button type="button" class="holiday-tab" role="tab" id="territory-tab-airports" aria-controls="territory-panel-airports" aria-selected="false" tabindex="-1">Airports</button>
            </div>

            <div class="territory-embed">"""

    if old_nav not in html:
        raise SystemExit("Expected nav + territory-embed opening not found (file changed?)")

    html = html.replace(old_nav, new_nav, 1)

    # --- Convert each major section into a tabpanel ---
    html = html.replace(
        '<div class="sec" id="territory-summary">',
        '<section class="sec territory-tabpanel" role="tabpanel" id="territory-panel-summary" aria-labelledby="territory-tab-summary territory-summary-h">',
        1,
    )
    html = html.replace(
        '<div class="sh-title">Vaultrian at a Glance</div>',
        '<div class="sh-title" id="territory-summary-h">Vaultrian at a Glance</div>',
        1,
    )

    # Summary ends right before zones marker
    html = html.replace(
        "</div>\n<hr>\n\n<!-- ═══ ZONES & NODES ═══ -->\n"
        '<div class="sec" id="territory-zones">',
        "</section>\n\n<!-- ═══ ZONES & NODES ═══ -->\n"
        '<section class="sec territory-tabpanel" role="tabpanel" id="territory-panel-zones" aria-labelledby="territory-tab-zones territory-zones-h" hidden>',
        1,
    )

    html = html.replace(
        '<div class="sh-title">Zones & Nodes in Full</div>',
        '<div class="sh-title" id="territory-zones-h">Zones &amp; Nodes in Full</div>',
        1,
    )

    # Between zones and roads
    html = html.replace(
        "</div>\n<hr>\n\n<!-- ═══ ROADS ═══ -->\n"
        '<div class="sec" id="territory-roads">',
        "</section>\n\n<!-- ═══ ROADS ═══ -->\n"
        '<section class="sec territory-tabpanel" role="tabpanel" id="territory-panel-roads" aria-labelledby="territory-tab-roads territory-roads-h" hidden>',
        1,
    )
    html = html.replace(
        '<div class="sh-title">National Road Network</div>',
        '<div class="sh-title" id="territory-roads-h">National Road Network</div>',
        1,
    )

    # Between roads and rail
    html = html.replace(
        "</div>\n<hr>\n\n<!-- ═══ RAIL ═══ -->\n"
        '<div class="sec" id="territory-rail">',
        "</section>\n\n<!-- ═══ RAIL ═══ -->\n"
        '<section class="sec territory-tabpanel" role="tabpanel" id="territory-panel-rail" aria-labelledby="territory-tab-rail territory-rail-h" hidden>',
        1,
    )
    html = html.replace(
        '<div class="sh-title">National Rail Network</div>',
        '<div class="sh-title" id="territory-rail-h">National Rail Network</div>',
        1,
    )

    # Between rail and airports
    html = html.replace(
        "</div>\n<hr>\n\n<!-- ═══ AIRPORTS ═══ -->\n"
        '<div class="sec" id="territory-airports">',
        "</section>\n\n<!-- ═══ AIRPORTS ═══ -->\n"
        '<section class="sec territory-tabpanel" role="tabpanel" id="territory-panel-airports" aria-labelledby="territory-tab-airports territory-airports-h" hidden>',
        1,
    )
    html = html.replace(
        '<div class="sh-title">National Air Network</div>',
        '<div class="sh-title" id="territory-airports-h">National Air Network</div>',
        1,
    )

    # Remove broken junk before site <footer> and close tab wrappers cleanly
    junk = re.compile(
        r"\n  </div>\n</div>\n\n<div style=\"font-family:Cinzel, serif;font-size:\.46rem;letter-spacing:\.28em;color:#141210;margin-top:6px\">Territory Authority · Vaultrian · Est\. 2025 · 12 Zones · 38 Nodes · 10 Roads · 8 Rail Lines · 5 Airports</div>\n</div>\n</div>\n\n\s*<footer>",
        re.MULTILINE,
    )
    if not junk.search(html):
        raise SystemExit("Could not find/rewrite embed/footer junk block")

    html = junk.sub("\n  </div>\n</section>\n            </div>\n          </div>\n\n          <footer>", html, count=1)

    # --- Replace scroll-spy with tab controller (holidays-compatible) ---
    old_script = r"<script>\s*function toggleZone\(hdr\) \{[\s\S]*?</script>"
    new_script = """<script>
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
      "use strict";
      document.querySelectorAll("[data-territory-tabs]").forEach(function (root) {
        var tabs = root.querySelectorAll('[role="tab"]');
        var panels = root.querySelectorAll('[role="tabpanel"]');
        if (!tabs.length || !panels.length) return;
        function select(tabId) {
          tabs.forEach(function (t) {
            var on = t.id === tabId;
            t.setAttribute("aria-selected", on ? "true" : "false");
            t.classList.toggle("is-active", on);
            t.tabIndex = on ? 0 : -1;
          });
          panels.forEach(function (p) {
            var labelled = p.getAttribute("aria-labelledby") || "";
            p.hidden = labelled.indexOf(tabId) === -1;
          });
        }
        tabs.forEach(function (tab, i) {
          tab.addEventListener("click", function () {
            select(tab.id);
          });
          tab.addEventListener("keydown", function (e) {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            var next = (e.key === "ArrowRight" ? i + 1 : i - 1 + tabs.length) % tabs.length;
            tabs[next].focus();
            select(tabs[next].id);
          });
        });
      });
    })();
  </script>"""

    html2, n = re.subn(old_script, new_script, html, count=1)
    if n != 1:
        raise SystemExit(f"Expected to replace exactly one bottom script block; replaced {n}")

    html = html2

    # Remove now-unused .territory-nav CSS block (optional cleanup)
    html = re.sub(
        r"\n\s*\.territory-nav \{[\s\S]*?\.territory-nav a:focus-visible \{[\s\S]*?\}\n",
        "\n",
        html,
        count=1,
    )

    path.write_text(html, encoding="utf-8")
    print("OK:", path)


if __name__ == "__main__":
    main()
