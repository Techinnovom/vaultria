"""Build learning songs index + per-song detail pages from _vaelic_learning_songs_extracted.html."""
import html
import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "site/pages/_vaelic_learning_songs_extracted.html"
TRANSCRIPT = Path.home() / (
    ".cursor/projects/c-Users-obasi-Documents-GitHub-vaultria/"
    "agent-transcripts/1786d4f3-ed70-4bff-944a-26278a56f6fa/"
    "1786d4f3-ed70-4bff-944a-26278a56f6fa.jsonl"
)

N_TITLE = "Vaelic Learning Songs \u2014 Official Vaultrian Language Programme"
N_SNIP = "Ten songs to learn the Vaelic language"

AUDIO = {
    "song01": "Laret Neral \u2014 The Alphabet Song.mp3",
    "song02": "Teri Nekval.mp3",
    "song03": "Neral Senokal.mp3",
    "song04": "Kavi Nera \u2014 Hello Right Now.mp3",
    "song05": "Narat Mina \u2014 My Body.mp3",
    "song06": "Tera Seno.mp3",
    "song07": "Ke Kala Ven \u2014 How Do You Feel.mp3",
    "song08": "Meto Mina \u2014 My World.mp3",
    "song09": "Varna Mina \u2014 The Action Song.mp3",
    "song10": "Velon, Deronak, Valek.mp3",
}

SONG_MARK = re.compile(r'<div class="song" id="(song\d+)">')
SONG_IDS = [f"song{i:02d}" for i in range(1, 11)]
SONGS_OPEN = '<div class="songs">'
SONGS_CLOSE = "</div><!-- /songs -->"


def pull_from_transcript() -> None:
    if not TRANSCRIPT.is_file():
        return
    for line in TRANSCRIPT.open(encoding="utf-8"):
        if N_TITLE not in line or N_SNIP not in line:
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
        body = text[i:j]
        if "@site/assets/audio" in body:
            body = body.split("@site/assets/audio")[0].rstrip()
            k = body.rfind("</html>")
            if k != -1:
                body = body[: k + len("</html>")]
        SRC.write_text(body, encoding="utf-8")
        return


def song_file(n: int) -> str:
    return f"vaelic-learning-song-{n:02d}.html"


def split_songs(raw: str) -> dict[str, str]:
    raw = raw.strip()
    matches = list(SONG_MARK.finditer(raw))
    if len(matches) != len(SONG_IDS):
        raise SystemExit(f"expected {len(SONG_IDS)} songs, found {len(matches)}")
    out: dict[str, str] = {}
    for i, m in enumerate(matches):
        sid = m.group(1)
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(raw)
        out[sid] = raw[start:end].rstrip()
    return out


def song_title(chunk: str) -> str:
    m = re.search(r'<div class="song-title">([^<]+)</div>', chunk)
    return m.group(1).strip() if m else "Lesson"


def insert_audio(block: str) -> str:
    for sid, fn in AUDIO.items():
        src = "../assets/audio/learn/" + quote(fn, safe="/")
        fig = (
            f'  <figure class="song-audio" aria-label="Listen">\n'
            f'    <figcaption class="song-audio-cap">Recording</figcaption>\n'
            f'    <audio controls preload="metadata" src="{src}"></audio>\n'
            f"  </figure>\n"
        )
        pat = rf'(<div class="song" id="{re.escape(sid)}">[\s\S]*?)(<div class="tune">)'
        newb, n = re.subn(pat, r"\1" + fig + r"\2", block, count=1)
        if n != 1:
            print("Warning: could not insert audio for", sid)
        else:
            block = newb
    return block


def toc_hrefs_to_detail(prefix: str) -> str:
    for i, sid in enumerate(SONG_IDS, start=1):
        prefix = prefix.replace(f'href="#{sid}"', f'href="{song_file(i)}"')
    return prefix


def shell(
    title: str,
    lead: str,
    body: str,
    code_path: str,
    main_attrs: str = "",
) -> str:
    t = html.escape(title, quote=True)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{t}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <link rel="stylesheet" href="../assets/css/layout.css" />
  <link rel="stylesheet" href="../assets/css/vaelic-learning-songs.css" />
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
      <div class="wrap vaelic-learning-songs-wrap">
        <main id="main-content" class="vaelic-learning-songs-page"{main_attrs}>
{lead}{body}
        </main>

        <footer>
          <p>The Sovereign State of VAULTRIA — a living document.</p>
          <p class="latin">Vaelic Learning Songs · <code>{code_path}</code></p>
        </footer>
      </div>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../assets/js/site-nav.js" defer></script>
  <script src="../assets/js/site-search.js" defer></script>
  <script src="../assets/js/vaelic-learning-songs.js" defer></script>
</body>
</html>
"""


if not SRC.is_file():
    pull_from_transcript()
if not SRC.is_file():
    raise SystemExit(
        "Missing site/pages/_vaelic_learning_songs_extracted.html — "
        "save the standalone HTML there or ensure transcript contains the paste."
    )

raw = SRC.read_text(encoding="utf-8")
raw = raw.replace("\u00a7", "").replace("\u00A7", "")

start = raw.index('<div class="hero">')
end = raw.rindex("</body>")
block = raw[start:end].strip()
block = insert_audio(block)

si = block.find(SONGS_OPEN)
se = block.find(SONGS_CLOSE)
if si == -1 or se == -1:
    raise SystemExit("Could not find songs section markers in extracted HTML.")

prefix = block[:si].rstrip()
inner = block[si + len(SONGS_OPEN) : se].strip()
suffix = block[se + len(SONGS_CLOSE) :].lstrip()

songs = split_songs(inner)
for sid in SONG_IDS:
    if sid not in songs:
        raise SystemExit(f"Missing song chunk {sid}")

prefix_index = toc_hrefs_to_detail(prefix)

index_lead = (
    '          <p class="tier-kicker"><a href="vaelic.html">Vaelic</a> '
    '· <a href="vaelic-dictionary.html">Dictionary</a> · '
    '<a href="vaelic-textbook.html">Language textbook</a> · Learning programme</p>\n'
    '          <p class="zone-intro">Ten lessons below — each link opens the full lyrics, '
    "pronunciation, English, and recording on its own page.</p>\n"
)

index_html = shell(
    "Vaelic Learning Songs — VAULTRIA",
    index_lead,
    prefix_index + "\n\n" + suffix,
    "site/pages/vaelic-learning-songs.html",
    "",
)
(ROOT / "site/pages/vaelic-learning-songs.html").write_text(index_html, encoding="utf-8")
print("Wrote vaelic-learning-songs.html (index only)")

base_lead = (
    '          <p class="tier-kicker"><a href="vaelic.html">Vaelic</a> '
    '· <a href="vaelic-dictionary.html">Dictionary</a> · '
    '<a href="vaelic-textbook.html">Language textbook</a> · '
    '<a href="vaelic-learning-songs.html">All lessons</a></p>\n'
)

for n, sid in enumerate(SONG_IDS, start=1):
    chunk = songs[sid]
    title = song_title(chunk)
    prev_file = song_file(n - 1) if n > 1 else ""
    next_file = song_file(n + 1) if n < 10 else "vaelic.html"
    nav_parts = ['          <p class="zone-intro vls-step-nav">']
    if prev_file:
        nav_parts.append(f'<a class="vls-step-prev" href="{prev_file}">Previous lesson</a>')
    else:
        nav_parts.append('<span class="vls-step-prev vls-step-muted">Previous lesson</span>')
    nav_parts.append(f'<span class="vls-step-ix">Lesson {n} of 10</span>')
    if n < 10:
        nav_parts.append(f'<a class="vls-step-next" href="{next_file}">Next lesson</a>')
    else:
        nav_parts.append(f'<a class="vls-step-next" href="{next_file}">Vaelic programme</a>')
    nav_parts.append("</p>\n")
    detail_lead = base_lead + "".join(nav_parts)

    body = f'<div class="songs">\n\n{chunk}\n\n</div>\n\n{suffix}'
    attrs = f' data-vls-next="{html.escape(next_file, quote=True)}"'
    fn = song_file(n)
    page = shell(
        f"{title} — VAULTRIA",
        detail_lead,
        body,
        f"site/pages/{fn}",
        attrs,
    )
    (ROOT / "site/pages" / fn).write_text(page, encoding="utf-8")
    print("Wrote", fn)
