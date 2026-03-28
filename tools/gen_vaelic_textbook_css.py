"""Generate site/assets/css/vaelic-textbook.css from _vaelic_textbook_extracted.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "site/pages/_vaelic_textbook_extracted.html"

PFX = ".vaelic-textbook-page"


def prefix_selectors(block: str, pfx: str) -> str:
    out: list[str] = []
    i = 0
    n = len(block)
    while i < n:
        mws = re.match(r"\s*", block[i:])
        if mws:
            out.append(mws.group(0))
            i += len(mws.group(0))
        if i >= n:
            break
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


def vaultify_textbook_css(s: str) -> str:
    """Map standalone light-theme hex colors to site vault tokens."""
    pairs: list[tuple[str, str]] = [
        ("#faf8f2", "var(--bg-elevated)"),
        ("#faf6ee", "rgba(201, 169, 98, 0.06)"),
        ("#fffbf0", "rgba(201, 169, 98, 0.08)"),
        ("#fffef9", "transparent"),
        ("#f8f4ec", "var(--bg-elevated)"),
        ("#f4f0e8", "rgba(28, 32, 41, 0.85)"),
        ("#ece8e0", "var(--border)"),
        ("#e8e0d0", "var(--border)"),
        ("#e8d8a0", "rgba(201, 169, 98, 0.28)"),
        ("#e0d8c8", "var(--border)"),
        ("#e0d4b8", "var(--border)"),
        ("#d8d0c0", "var(--border)"),
        ("#f0b0b0", "rgba(200, 64, 64, 0.35)"),
        ("#b0d0b0", "rgba(74, 152, 112, 0.35)"),
        ("#b0c0e0", "rgba(90, 138, 200, 0.35)"),
        ("#c0b0d8", "rgba(136, 80, 200, 0.35)"),
        ("#8a5a1a", "var(--gold)"),
        ("#8a6820", "var(--gold-dim)"),
        ("#6a5e4a", "var(--text-muted)"),
        ("#6a5840", "var(--text-muted)"),
        ("#6a4a1a", "var(--gold-dim)"),
        ("#4a3f30", "var(--text-muted)"),
        ("#3a3020", "var(--text-muted)"),
        ("#2a221a", "var(--text)"),
        ("#1a1610", "var(--text)"),
        ("#8a7860", "var(--gold-dim)"),
        ("#6a5840", "var(--text-muted)"),
        ("#ddd", "rgba(255, 255, 255, 0.1)"),
        ("#ccc", "rgba(255, 255, 255, 0.14)"),
        ("#aaa", "var(--text-muted)"),
        ("#c8a84c", "var(--gold)"),
        ("#c04040", "var(--tb-sharp)"),
        ("#407840", "var(--tb-soft)"),
        ("#405880", "var(--tb-hard)"),
        ("#604880", "var(--tb-flow)"),
        ("'Source Sans 3', sans-serif", '"Cinzel", serif'),
        ('"Source Sans 3", sans-serif', '"Cinzel", serif'),
        ("'Lora', serif", '"Crimson Pro", serif'),
        ('"Lora", serif', '"Crimson Pro", serif'),
    ]
    for old, new in pairs:
        s = s.replace(old, new)
    return s


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(
            "Missing site/pages/_vaelic_textbook_extracted.html — "
            "run tools/build_vaelic_textbook_page.py first (it can pull from transcript)."
        )
    raw = SRC.read_text(encoding="utf-8")
    m = re.search(r"<style>(.*?)</style>", raw, re.S)
    if not m:
        raise SystemExit("No <style> block in extracted textbook HTML.")
    css = m.group(1).strip()
    css = re.sub(r"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "", css)

    css = re.sub(
        r"\*\s*\{\s*margin:\s*0;\s*padding:\s*0;\s*box-sizing:\s*border-box\s*;\s*\}",
        "",
        css,
    )
    css = re.sub(r"html\s*\{\s*font-size:\s*16px;\s*\}", "", css)
    css = re.sub(
        r"body\s*\{[^}]*font-family:\s*'Lora'[^}]*\}",
        "",
        css,
        flags=re.S,
    )

    rest = prefix_selectors(css, PFX)
    rest = vaultify_textbook_css(rest)

    header = """/* Vaelic textbook — vault theme, scoped to site shell */
.wrap.vaelic-textbook-wrap {
  max-width: min(920px, 100%);
  width: 100%;
}

.vaelic-textbook-page {
  /* Inline theme vars used in textbook markup (dark shell) */
  --u1: #c85858;
  --u2: #6a9fd4;
  --u3: #5cb88a;
  --u4: #a578d4;
  --red: #c84040;
  --grn: #4a9870;
  --blu: #5a8ac8;
  --pur: #8850c8;
  --i3: var(--text-muted);
  --i4: var(--text-muted);
  --p3: var(--bg-elevated);
  --r2: var(--border);
  --g2: var(--gold);
  --tb-sharp: #c84040;
  --tb-soft: #4a9870;
  --tb-hard: #5a8ac8;
  --tb-flow: #8850c8;
  font-family: "Crimson Pro", Georgia, ui-serif, serif;
  font-size: 17px;
  line-height: 1.75;
  color: var(--text);
  background: transparent;
}

.vaelic-textbook-page .page-title {
  color: var(--gold);
  border-bottom-color: var(--border);
}

.vaelic-textbook-page .unit-title,
.vaelic-textbook-page .ch-title,
.vaelic-textbook-page .exs-hd,
.vaelic-textbook-page .sec-t {
  font-family: Cinzel, serif;
  letter-spacing: 0.04em;
}

.vaelic-textbook-page .tier-kicker a {
  color: var(--gold);
}

.vaelic-textbook-page .tier-kicker a:hover {
  text-decoration: underline;
}

.vaelic-textbook-page .vaelic-textbook-sheet {
  position: relative;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.35);
}

.vaelic-textbook-page .vaelic-textbook-sheet::before {
  content: "";
  display: block;
  height: 3px;
  background: linear-gradient(90deg, var(--gold), rgba(74, 111, 165, 0.55), var(--gold-dim));
}

.vaelic-textbook-page .vaelic-textbook-sheet .content {
  max-width: 42rem;
  margin: 0 auto;
  padding: 2.25rem 1.5rem 3.25rem;
}

/* Compound selectors so generated .ch / .unit-div rules cannot override hides */
.vaelic-textbook-page .unit-div.vt-tab-hidden,
.vaelic-textbook-page .ch.vt-ch-hidden,
.vaelic-textbook-page .ch.vt-tab-hidden {
  display: none !important;
}

.vaelic-textbook-page [data-vt-outro].vt-ch-hidden,
.vaelic-textbook-page [data-vt-outro].vt-tab-hidden {
  display: none !important;
}

.vaelic-textbook-page .vt-seg.vt-part-hidden {
  display: none !important;
}

.vaelic-textbook-page .vt-tab-hidden {
  display: none !important;
}

.vaelic-textbook-page .vt-ch-hidden {
  display: none !important;
}

.vaelic-textbook-page .vt-part-hidden {
  display: none !important;
}

/* Wider sidebar + Word-style textbook outline (injected by vaelic-textbook.js) */
body.vt-textbook-outline .site-sidebar {
  width: min(320px, 100%);
}

body.vt-textbook-outline .vt-outline-wrap {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

body.vt-textbook-outline .vt-outline-head {
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 0.52rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold-dim);
  padding: 0 0.5rem 0.65rem;
  margin: 0;
}

body.vt-textbook-outline #vt-outline-nav {
  max-height: min(55vh, 28rem);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 0.15rem 0.75rem 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

body.vt-textbook-outline .vt-outline-units {
  list-style: none;
  margin: 0;
  padding: 0;
}

body.vt-textbook-outline .vt-outline-units > li {
  margin: 0 0 0.35rem;
}

body.vt-textbook-outline .vt-outline-details {
  border-radius: 4px;
  border: 1px solid transparent;
}

body.vt-textbook-outline .vt-outline-details[open] {
  background: rgba(201, 169, 98, 0.04);
  border-color: rgba(201, 169, 98, 0.12);
}

body.vt-textbook-outline .vt-outline-summary {
  list-style: none;
  cursor: pointer;
  user-select: none;
  font-family: Cinzel, serif;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text);
  padding: 0.4rem 0.45rem 0.4rem 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
}

body.vt-textbook-outline .vt-outline-summary::-webkit-details-marker {
  display: none;
}

body.vt-textbook-outline .vt-outline-summary::before {
  content: "";
  flex-shrink: 0;
  width: 0.3em;
  height: 0.3em;
  margin-top: 0.35em;
  border-right: 1px solid var(--gold-dim);
  border-bottom: 1px solid var(--gold-dim);
  transform: rotate(-45deg);
  opacity: 0.8;
}

body.vt-textbook-outline .vt-outline-details[open] > .vt-outline-summary::before {
  transform: rotate(45deg);
  margin-top: 0.25em;
}

body.vt-textbook-outline .vt-outline-summary:hover {
  color: var(--gold);
}

body.vt-textbook-outline .vt-outline-branch {
  list-style: none;
  margin: 0;
  padding: 0 0 0.35rem 0.5rem;
  border-left: 2px solid rgba(201, 169, 98, 0.15);
  margin-left: 0.65rem;
}

body.vt-textbook-outline .vt-outline-branch > li {
  margin: 0.08rem 0;
}

body.vt-textbook-outline .vt-outline-link {
  display: block;
  font-family: "Crimson Pro", Georgia, ui-serif, serif;
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  text-transform: none;
  line-height: 1.35;
  text-decoration: none;
  color: var(--text-muted);
  padding: 0.28rem 0.4rem 0.28rem 0.45rem;
  margin: 0;
  border-radius: 3px;
  border-left: 2px solid transparent;
  transition: color 0.12s ease, background 0.12s ease, border-color 0.12s ease;
}

body.vt-textbook-outline .vt-outline-link:hover {
  color: var(--text);
  background: rgba(201, 169, 98, 0.07);
}

body.vt-textbook-outline .vt-outline-link:focus-visible {
  outline: 2px solid rgba(201, 169, 98, 0.45);
  outline-offset: 1px;
}

body.vt-textbook-outline .vt-outline-link.is-active {
  color: var(--gold);
  background: rgba(201, 169, 98, 0.1);
  border-left-color: var(--gold);
}

body.vt-textbook-outline .vt-outline-chapter > .vt-outline-summary {
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.3;
}

body.vt-textbook-outline .vt-outline-chapter[open] > .vt-outline-summary {
  color: var(--text);
}

body.vt-textbook-outline .vt-outline-parts {
  list-style: none;
  margin: 0;
  padding: 0 0 0.4rem 0.45rem;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  margin-left: 0.5rem;
}

body.vt-textbook-outline .vt-outline-parts .vt-outline-link {
  font-size: 0.74rem;
  padding-top: 0.22rem;
  padding-bottom: 0.22rem;
}

/* Unit numerals (inline rgba removed in build patch) */
.vaelic-textbook-page #u1 .unit-num {
  color: rgba(200, 90, 90, 0.65);
}
.vaelic-textbook-page #u2 .unit-num {
  color: rgba(106, 159, 212, 0.65);
}
.vaelic-textbook-page #u3 .unit-num {
  color: rgba(92, 184, 138, 0.65);
}
.vaelic-textbook-page #u4 .unit-num {
  color: rgba(165, 120, 212, 0.65);
}

.vaelic-textbook-page *,
.vaelic-textbook-page *::before,
.vaelic-textbook-page *::after {
  box-sizing: border-box;
}

.vaelic-textbook-page .ak-t:focus-visible {
  outline: 2px solid rgba(201, 169, 98, 0.45);
  outline-offset: 3px;
}

.vaelic-textbook-page button.ak-t:hover {
  color: var(--text);
}

.vaelic-textbook-page table.vt tbody tr:hover td {
  background: rgba(201, 169, 98, 0.08);
}

"""

    out = header + "\n" + rest
    out += """
@media (max-width: 600px) {
  .vaelic-textbook-page .vaelic-textbook-sheet .content {
    padding: 1.15rem 1rem 2.5rem;
  }
}

@media print {
  .vaelic-textbook-page .unit-div.vt-tab-hidden,
  .vaelic-textbook-page .ch.vt-ch-hidden,
  .vaelic-textbook-page .ch.vt-tab-hidden,
  .vaelic-textbook-page [data-vt-outro].vt-ch-hidden,
  .vaelic-textbook-page [data-vt-outro].vt-tab-hidden,
  .vaelic-textbook-page .vt-seg.vt-part-hidden,
  .vaelic-textbook-page .vt-tab-hidden,
  .vaelic-textbook-page .vt-ch-hidden,
  .vaelic-textbook-page .vt-part-hidden {
    display: revert !important;
  }
}
"""
    out_path = ROOT / "site/assets/css/vaelic-textbook.css"
    out_path.write_text(out, encoding="utf-8")
    print("Wrote", out_path, len(out), "chars")


if __name__ == "__main__":
    main()
