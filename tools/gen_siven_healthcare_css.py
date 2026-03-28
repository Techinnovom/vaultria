"""Generate site/assets/css/siven-healthcare.css from _siven_healthcare_extracted.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / "site/pages/_siven_healthcare_extracted.html").read_text(encoding="utf-8")
m = re.search(r"<style>(.*?)</style>", raw, re.S)
css = m.group(1).strip()
css = re.sub(r"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "", css)

css = re.sub(r"^:root\{[^}]*\}\s*", "", css, flags=re.S)
css = css.replace("*{margin:0;padding:0;box-sizing:border-box}", "")
css = css.replace("html{scroll-behavior:smooth}\n", "")
css = css.replace(
    "body{background:var(--ink);color:var(--tx);font-family:'Crimson Pro',serif;font-size:1.02rem;line-height:1.75}\n",
    "",
)
css = css.replace(".shell{display:flex;min-height:100vh}\n\n", "")

css = re.sub(
    r"\.sb\{[\s\S]*?position:fixed[\s\S]*?\}\s*",
    "",
    css,
)
css = re.sub(r"\.main\{margin-left:232px[^}]*\}\s*", "", css)

PFX = ".siven-healthcare-page"


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

header = """/* Siven Healthcare System - scoped to site shell */
.wrap.siven-wrap {
  max-width: min(1120px, 100%);
  width: 100%;
}

.siven-healthcare-page {
  --ink: var(--bg-deep);
  --s1: var(--bg-panel);
  --s2: var(--bg-elevated);
  --gold-d: rgba(201, 169, 98, 0.28);
  --gold-l: #e8c97a;
  --tx: var(--text);
  --tx2: var(--text-muted);
  --tx3: rgba(154, 149, 138, 0.55);
  --rule: rgba(201, 169, 98, 0.12);
  --rule2: rgba(201, 169, 98, 0.08);
  --siv: #2a7848;
  --sivl: rgba(42, 120, 72, 0.12);
  --sivb: rgba(42, 120, 72, 0.35);
  --free: #2a7848;
  --paid: #b87c18;
  --priv: #4a78c8;
  --red: #c03a3a;
  --redb: rgba(192, 58, 58, 0.3);
  font-size: 1.02rem;
  line-height: 1.75;
  color: var(--tx);
}

.siven-healthcare-page .tier-kicker a {
  color: var(--gold);
}

.siven-healthcare-page *,
.siven-healthcare-page *::before,
.siven-healthcare-page *::after {
  box-sizing: border-box;
}

"""

shell_ov = """
.siven-healthcare-page .shell {
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  gap: 0;
  align-items: start;
  margin-top: 0.75rem;
}

.siven-healthcare-page .sb {
  position: sticky;
  top: 0.75rem;
  align-self: start;
  width: 232px;
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

.siven-healthcare-page .main {
  margin-left: 0;
  min-width: 0;
}
"""

old_media = (
    "@media(max-width:680px){"
    + PFX
    + " .sb{display:none}"
    + PFX
    + " .main{margin-left:0}"
    + PFX
    + " .hero,"
    + PFX
    + " .content{padding-left:20px;padding-right:20px}"
    + PFX
    + " .inst-grid,"
    + PFX
    + " .access-grid,"
    + PFX
    + " .triage,"
    + PFX
    + " .g2{grid-template-columns:1fr}}"
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
    + " .hero,"
    + PFX
    + " .content{padding-left:20px;padding-right:20px}"
    + PFX
    + " .inst-grid,"
    + PFX
    + " .access-grid,"
    + PFX
    + " .triage,"
    + PFX
    + " .g2{grid-template-columns:1fr}}"
)
rest = rest.replace(old_media, new_media)

out = header + shell_ov + "\n" + rest
out = out.replace(
    ".siven-healthcare-page .sb-a{display:flex;",
    ".siven-healthcare-page .sb-a{display:flex;color:inherit;",
    1,
)
(ROOT / "site/assets/css/siven-healthcare.css").write_text(out, encoding="utf-8")
print("Wrote", ROOT / "site/assets/css/siven-healthcare.css", len(out), "chars")
