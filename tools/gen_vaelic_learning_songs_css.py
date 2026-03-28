"""Generate site/assets/css/vaelic-learning-songs.css from _vaelic_learning_songs_extracted.html."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / "site/pages/_vaelic_learning_songs_extracted.html").read_text(encoding="utf-8")
m = re.search(r"<style>(.*?)</style>", raw, re.S)
css = m.group(1).strip()
css = re.sub(r"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "", css)

css = re.sub(r"^:root\{[^}]*\}\s*", "", css, flags=re.S)
css = css.replace("*{margin:0;padding:0;box-sizing:border-box}", "")
css = css.replace("html{scroll-behavior:smooth}\n", "")
css = css.replace(
    "body{background:var(--ink);color:var(--tx);font-family:'Crimson Pro',serif;font-size:1rem;line-height:1.7;overflow-x:hidden}\n",
    "",
)
css = css.replace(
    "::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(201,168,76,.12)}\n\n",
    "",
)

PFX = ".vaelic-learning-songs-page"


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


rest = prefix_selectors(css, PFX)

header = """/* Vaelic Learning Songs — scoped to site shell */
.wrap.vaelic-learning-songs-wrap {
  max-width: min(960px, 100%);
  width: 100%;
}

.vaelic-learning-songs-page {
  --ink: var(--bg-deep);
  --s1: var(--bg-panel);
  --s2: var(--bg-elevated);
  --s3: var(--bg-elevated);
  --gd: rgba(201, 169, 98, 0.2);
  --gl: #e8c97a;
  --tx: var(--text);
  --tx2: var(--text-muted);
  --tx3: rgba(154, 149, 138, 0.55);
  --rule: rgba(201, 169, 98, 0.1);
  --rule2: rgba(201, 169, 98, 0.08);
  --green: #3a8f5a;
  --blue: #3a6faf;
  --orange: #c87828;
  --purple: #7a4faf;
  --red: #af3a3a;
  --teal: #3a8f8f;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--tx);
}

.vaelic-learning-songs-page .tier-kicker a {
  color: var(--gold);
}

.vaelic-learning-songs-page *,
.vaelic-learning-songs-page *::before,
.vaelic-learning-songs-page *::after {
  box-sizing: border-box;
}

.vaelic-learning-songs-page .song {
  scroll-margin-top: 5rem;
}

.vaelic-learning-songs-page .song-audio {
  margin: 0 0 14px;
}

.vaelic-learning-songs-page .song-audio audio {
  width: 100%;
  max-width: 420px;
}

.vaelic-learning-songs-page .song-audio-cap {
  font-family: "Share Tech Mono", ui-monospace, monospace;
  font-size: 0.33rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--tx3);
  margin-bottom: 6px;
}

.vaelic-learning-songs-page .vls-step-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1rem;
  align-items: center;
  justify-content: space-between;
}

.vaelic-learning-songs-page .vls-step-ix {
  color: var(--tx2);
  font-size: 0.92rem;
}

.vaelic-learning-songs-page .vls-step-muted {
  color: var(--tx3);
  font-size: 0.92rem;
}

.vaelic-learning-songs-page .vls-step-prev,
.vaelic-learning-songs-page .vls-step-next {
  font-size: 0.92rem;
}

"""

out = header + "\n" + rest
out = out.replace("font-family:'Crimson Pro',serif", 'font-family:"Source Serif 4",ui-serif,serif')
(ROOT / "site/assets/css/vaelic-learning-songs.css").write_text(out, encoding="utf-8")
print("Wrote", ROOT / "site/assets/css/vaelic-learning-songs.css", len(out), "chars")
