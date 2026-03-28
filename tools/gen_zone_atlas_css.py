"""Generate site/assets/css/zone-atlas.css from _zone_atlas_extracted.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / "site/pages/_zone_atlas_extracted.html").read_text(encoding="utf-8")
m = re.search(r"<style>(.*?)</style>", raw, re.S)
css = m.group(1).strip()
css = re.sub(r"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "", css)

css = re.sub(r"^:root\{[^}]*\}\s*", "", css, flags=re.S)
css = css.replace("*{margin:0;padding:0;box-sizing:border-box}", "")
css = css.replace("html{scroll-behavior:smooth}\n", "")
css = css.replace(
    "body{background:var(--ink);color:var(--tx);font-family:'Crimson Pro',serif;font-size:1rem;line-height:1.72}\n",
    "",
)
css = css.replace(
    "::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(201,168,76,.15)}\n",
    "",
)
css = css.replace(".shell{display:flex;min-height:100vh}\n", "")

css = re.sub(
    r"\.sb\{[\s\S]*?position:fixed[\s\S]*?\}\s*",
    "",
    css,
)
css = re.sub(r"\.main\{margin-left:218px[^}]*\}\s*", "", css)

PFX = ".zone-atlas-page"


def prefix_selectors(block: str, pfx: str) -> str:
    out: list[str] = []
    i = 0
    n = len(block)
    while i < n:
        if block[i:].startswith("@media"):
            j = block.find("{", i)
            depth = 0
            k = j
            while k < n:
                if block[k] == "{":
                    depth += 1
                elif block[k] == "}":
                    depth -= 1
                    if depth == 0:
                        inner = block[j + 1 : k]
                        inner_prefixed = prefix_selectors(inner, pfx)
                        out.append(block[i : j + 1] + inner_prefixed + "}")
                        i = k + 1
                        break
                k += 1
            continue
        m2 = re.match(r"\s*", block[i:])
        if m2:
            out.append(m2.group(0))
            i += len(m2.group(0))
        if i >= n:
            break
        m2 = re.match(r"([^{]+)\{", block[i:])
        if not m2:
            out.append(block[i])
            i += 1
            continue
        sel = m2.group(1).strip()
        decl_start = i + m2.start(1)
        depth = 0
        k = i + m2.end() - 1
        while k < n:
            if block[k] == "{":
                depth += 1
            elif block[k] == "}":
                depth -= 1
                if depth == 0:
                    decl = block[decl_start : k + 1]
                    parts = [s.strip() for s in sel.split(",")]
                    new_parts = []
                    for s in parts:
                        if s.startswith("@"):
                            new_parts.append(s)
                        else:
                            new_parts.append(pfx + " " + s)
                    out.append(", ".join(new_parts) + decl[decl.find("{") :])
                    i = k + 1
                    break
            k += 1
    return "".join(out)


rest = prefix_selectors(css, PFX)

header = """/* Zone Atlas — scoped to site shell */
.wrap.zone-atlas-wrap {
  max-width: min(1120px, 100%);
  width: 100%;
}

.zone-atlas-page {
  --ink: var(--bg-deep);
  --s1: var(--bg-panel);
  --s2: var(--bg-elevated);
  --gd: rgba(201, 169, 98, 0.22);
  --gl: #e8c97a;
  --tx: var(--text);
  --tx2: var(--text-muted);
  --tx3: rgba(154, 149, 138, 0.55);
  --rule: rgba(201, 169, 98, 0.1);
  --rule2: rgba(201, 169, 98, 0.08);
  --cp: #c9a962;
  --civ: #2e6ab8;
  --inf: #b87c18;
  --kno: #2a7848;
  --res: #7a1010;
  font-size: 1rem;
  line-height: 1.72;
  color: var(--tx);
}

.zone-atlas-page .tier-kicker a {
  color: var(--gold);
}

.zone-atlas-page *,
.zone-atlas-page *::before,
.zone-atlas-page *::after {
  box-sizing: border-box;
}

"""

shell_ov = """
.zone-atlas-page .shell {
  display: grid;
  grid-template-columns: 218px minmax(0, 1fr);
  gap: 0;
  align-items: start;
  margin-top: 0.75rem;
}

.zone-atlas-page .sb {
  position: sticky;
  top: 0.75rem;
  align-self: start;
  width: 218px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  flex-shrink: 0;
  left: auto;
  height: auto;
  min-height: 0;
  background: var(--s1);
  border: 1px solid var(--rule2);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.zone-atlas-page .main {
  margin-left: 0;
  min-width: 0;
}

.zone-atlas-page .zone {
  scroll-margin-top: 5rem;
}
"""

old_media = (
    "@media(max-width:680px){"
    + PFX
    + " .sb{display:none}"
    + PFX
    + " .main{margin-left:0}"
    + PFX
    + " .atlas-hero,"
    + PFX
    + " .zone{padding-left:18px;padding-right:18px}"
    + PFX
    + " .zc,"
    + PFX
    + " .zc.three{grid-template-columns:1fr}}"
)
new_media = (
    "@media (max-width: 900px) {\n  "
    + PFX
    + " .shell {\n    grid-template-columns: 1fr;\n  }\n  "
    + PFX
    + " .sb {\n    position: relative;\n    top: auto;\n    max-height: none;\n    width: 100%;\n  }\n}\n\n@media(max-width:680px){"
    + PFX
    + " .sb{display:none}"
    + PFX
    + " .main{margin-left:0}"
    + PFX
    + " .atlas-hero,"
    + PFX
    + " .zone{padding-left:18px;padding-right:18px}"
    + PFX
    + " .zc,"
    + PFX
    + " .zc.three{grid-template-columns:1fr}}"
)
if old_media in rest:
    rest = rest.replace(old_media, new_media)
else:
    _bad680 = "@media(max-width:680px){.sb{display:none}.main{margin-left:0}.atlas-hero,.zone{padding-left:18px;padding-right:18px}.zc,.zc.three{grid-template-columns:1fr}}"
    _fix680 = """@media (max-width: 900px) {
  """ + PFX + """ .shell {
    grid-template-columns: 1fr;
  }
  """ + PFX + """ .sb {
    position: relative;
    top: auto;
    max-height: none;
    width: 100%;
  }
}

@media (max-width: 680px) {
  """ + PFX + """ .sb {
    display: none;
  }
  """ + PFX + """ .main {
    margin-left: 0;
  }
  """ + PFX + """ .atlas-hero,
  """ + PFX + """ .zone {
    padding-left: 18px;
    padding-right: 18px;
  }
  """ + PFX + """ .zc,
  """ + PFX + """ .zc.three {
    grid-template-columns: 1fr;
  }
}"""
    if _bad680 in rest:
        rest = rest.replace(_bad680, _fix680)
    else:
        print("Warning: expected @media block not found; mobile CSS may need manual fix")

out = header + shell_ov + "\n" + rest
out = out.replace(
    ".zone-atlas-page .sb-a{display:flex;",
    ".zone-atlas-page .sb-a{display:flex;color:inherit;",
    1,
)
out = out.replace("font-family:'Crimson Pro',serif", 'font-family:"Source Serif 4",ui-serif,serif')
(ROOT / "site/assets/css/zone-atlas.css").write_text(out, encoding="utf-8")
print("Wrote", ROOT / "site/assets/css/zone-atlas.css", len(out), "chars")
