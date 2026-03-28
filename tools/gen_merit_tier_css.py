"""One-off generator: site/assets/css/merit-tier.css from _merit_tier_extracted.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / "site/pages/_merit_tier_extracted.html").read_text(encoding="utf-8")
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


rest = prefix_selectors(css, ".merit-tier-page")

header = """/* Merit Tier System — scoped to site shell */
.wrap.mt-wrap {
  max-width: min(1120px, 100%);
  width: 100%;
}

.merit-tier-page {
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
  --t1c: #2a7848;
  --t1l: rgba(42, 120, 72, 0.12);
  --t1b: rgba(42, 120, 72, 0.35);
  --t2c: #b87c18;
  --t2l: rgba(184, 124, 24, 0.12);
  --t2b: rgba(184, 124, 24, 0.38);
  --t3c: #c9a84c;
  --t3l: rgba(201, 168, 76, 0.1);
  --t3b: rgba(201, 168, 76, 0.45);
  --red: #c03a3a;
  --redb: rgba(192, 58, 58, 0.35);
  font-size: 1.02rem;
  line-height: 1.75;
  color: var(--tx);
}

.merit-tier-page .tier-kicker a {
  color: var(--gold);
}

.merit-tier-page *,
.merit-tier-page *::before,
.merit-tier-page *::after {
  box-sizing: border-box;
}

"""

shell_ov = """
.merit-tier-page .shell {
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  gap: 0;
  align-items: start;
  margin-top: 0.75rem;
}

.merit-tier-page .sb {
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

.merit-tier-page .main {
  margin-left: 0;
  min-width: 0;
}
"""

rest = rest.replace(
    "@media(max-width:680px){.merit-tier-page .sb{display:none}.merit-tier-page .main{margin-left:0}",
    "@media (max-width: 900px) {\n  .merit-tier-page .shell {\n    grid-template-columns: 1fr;\n  }\n  .merit-tier-page .sb {\n    position: relative;\n    top: auto;\n    max-height: none;\n    width: 100%;\n  }\n}\n\n@media(max-width:680px){.merit-tier-page .sb{display:none}.merit-tier-page .main{margin-left:0}",
)

out = header + shell_ov + "\n" + rest
(ROOT / "site/assets/css/merit-tier.css").write_text(out, encoding="utf-8")
print("Wrote", ROOT / "site/assets/css/merit-tier.css", len(out), "chars")
