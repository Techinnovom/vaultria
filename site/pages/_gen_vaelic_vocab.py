# One-off generator: prints vocabulary / conflicts / changelog HTML (vr-* classes) for vaelic.html
# Run: python _gen_vaelic_vocab.py > _vaelic_generated.html
from html import escape
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def table(headers, rows):
    out = ['<table class="vr-vocab-table">', "<tr>"]
    for h in headers:
        out.append(f"<th>{h}</th>")
    out.append("</tr>")
    for r in rows:
        w, cls = r[0]
        out.append("<tr>")
        out.append(f'<td class="vr-td-word {cls}">{escape(w)}</td>')
        out.append(f'<td class="vr-td-pron">{escape(r[1])}</td>')
        out.append(f'<td class="vr-td-meaning">{escape(r[2])}</td>')
        out.append(f'<td class="vr-td-class {cls}">{escape(r[3])}</td>')
        out.append(f'<td class="vr-td-note">{escape(r[4])}</td>')
        out.append("</tr>")
    out.append("</table>")
    return "\n".join(out)


def cat_header(dot_style, name_color, name, count):
    return f"""  <div class="vr-vocab-category">
    <div class="vr-vc-header">
      <div class="vr-vc-dot" style="background:{dot_style}"></div>
      <div class="vr-vc-name" style="color:{name_color}">{name}</div>
      <div class="vr-vc-count">{count} WORDS</div>
    </div>
"""


# (word, sc-class suffix), pron, meaning, class label, note
people = [
    (("Nara", "vr-sc-soft"), "NA-ra", "person (singular)", "soft", "core human unit"),
    (("Vena", "vr-sc-soft"), "VE-na", "people (plural)", "soft", "collective"),
    (("Mina", "vr-sc-soft"), "MI-na", "I / self", "soft", "first person"),
    (("Ven", "vr-sc-soft"), "VEN", "you (singular)", "soft", "second person"),
    (("Sena", "vr-sc-soft"), "SE-na", "we / us", "soft", "first person plural"),
    (("Lori", "vr-sc-soft"), "LO-ri", "child", "soft", 'replaces old "Lira"'),
    (("Danel", "vr-sc-soft"), "DA-nel", "adult", "soft", 'replaces ambiguous "Daro"'),
    (("Tova", "vr-sc-soft"), "TO-va", "leader", "soft", "unchanged"),
    (("Rena", "vr-sc-soft"), "RE-na", "friend", "soft", 'replaces "Reni" - cleaner'),
    (("Kera", "vr-sc-sharp"), "KE-ra", "stranger / unknown", "sharp", "K-sound signals unfamiliar"),
    (("Mela", "vr-sc-soft"), "ME-la", "group / collective", "soft", 'replaces "Sena" (dual use fixed)'),
    (("Varo", "vr-sc-hard"), "VA-ro", "citizen", "hard", "civic identity - hard class"),
]

actions = [
    (("Doro", "vr-sc-flow"), "DO-ro", "go / travel", "flow", "core movement verb"),
    (("Varna", "vr-sc-flow"), "VAR-na", "move (physically)", "flow", 'replaces "Varn" - clearer'),
    (("Selora", "vr-sc-flow"), "SE-lo-ra", "come / arrive", "flow", 'replaces ambiguous "Sela"'),
    (("Kavi", "vr-sc-soft"), "KA-vi", "speak", "soft", "unchanged"),
    (("Riva", "vr-sc-soft"), "RI-va", "see / observe", "soft", "unchanged"),
    (("Zari", "vr-sc-hard"), "ZA-ri", "know (fact)", "hard", "knowledge-system verb"),
    (("Nemi", "vr-sc-soft"), "NE-mi", "think / consider", "soft", "unchanged"),
    (("Teka", "vr-sc-sharp"), "TE-ka", "take / acquire", "sharp", "T-class = decisive action"),
    (("Mora", "vr-sc-soft"), "MO-ra", "give", "soft", 'removed "strong" meaning (conflict fixed)'),
    (("Birek", "vr-sc-hard"), "BI-rek", "build / construct", "hard", 'replaces "Leko" - harder, more technical'),
    (("Pavi", "vr-sc-hard"), "PA-vi", "use / operate", "hard", "unchanged"),
    (("Kat", "vr-sc-sharp"), "KAT", "stop / halt", "sharp", "new - single syllable = urgency"),
    (("Dolun", "vr-sc-flow"), "DO-lun", "move toward", "flow", "directional movement"),
    (("Savi", "vr-sc-soft"), "SA-vi", "understand", "soft", "unchanged"),
    (("Teri", "vr-sc-soft"), "TE-ri", "learn", "soft", "unchanged"),
    (("Lavi", "vr-sc-soft"), "LA-vi", "hear / listen", "soft", "unchanged"),
    (("Drak", "vr-sc-sharp"), "DRAK", "warn / signal danger", "sharp", "new - sharp cluster intentional"),
    (("Kelo", "vr-sc-sharp"), "KE-lo", "stay / remain", "sharp", "K-opening = command feel"),
]

places = [
    (("Zelek", "vr-sc-hard"), "ZE-lek", "place / location", "hard", 'replaces "Zelo" - harder ending'),
    (("Nod", "vr-sc-hard"), "NOD", "city", "hard", "unchanged - node = city works"),
    (("Seket", "vr-sc-hard"), "SE-ket", "district / sector", "hard", 'replaces "Sek" - fuller word'),
    (("Taro", "vr-sc-flow"), "TA-ro", "path / route", "flow", "movement-class = makes sense"),
    (("Meto", "vr-sc-soft"), "ME-to", "home", "soft", "unchanged"),
    (("Dekat", "vr-sc-hard"), "DE-kat", "center / hub", "hard", 'replaces "Deka" - hard stop'),
    (("Ralet", "vr-sc-hard"), "RA-let", "building / structure", "hard", 'replaces "Ralo"'),
    (("Keno", "vr-sc-hard"), "KE-no", "specific point", "hard", "unchanged"),
    (("Vekat", "vr-sc-hard"), "VE-kat", "zone / area", "hard", 'replaces "Veko"'),
    (("Chanel", "vr-sc-flow"), "CHA-nel", "channel / corridor", "flow", "exception: CH allowed as /tS/ (as in church) in place names only"),
]

time_w = [
    (("Nera", "vr-sc-flow"), "NE-ra", "now / present", "flow", "unchanged"),
    (("Dava", "vr-sc-flow"), "DA-va", "past / before", "flow", "unchanged"),
    (("Varun", "vr-sc-flow"), "VA-run", "future / ahead", "flow", 'replaces "Vara" - more distinct'),
    (("Seno", "vr-sc-flow"), "SE-no", "day", "flow", "unchanged"),
    (("Lunok", "vr-sc-flow"), "LU-nok", "night", "flow", 'replaces "Luno" - -ok ending = closure'),
    (("Tera", "vr-sc-flow"), "TE-ra", "time (abstract)", "flow", 'removed "big" meaning (conflict fixed)'),
    (("Mira", "vr-sc-flow"), "MI-ra", "moment", "flow", "unchanged"),
    (("Kenu", "vr-sc-flow"), "KE-nu", "soon", "flow", 'replaces "Kena" (conflict with "what")'),
    (("Leru", "vr-sc-flow"), "LE-ru", "later", "flow", 'replaces "Lera"'),
    (("Navol", "vr-sc-flow"), "NA-vol", "always / permanent", "flow", 'replaces "Navo" - more weight'),
]

tech = [
    (("Vatek", "vr-sc-hard"), "VA-tek", "device / machine", "hard", 'replaces "Viro" - harder feel'),
    (("Kavel", "vr-sc-hard"), "KA-vel", "tool", "hard", 'replaces "Kano"'),
    (("Letat", "vr-sc-hard"), "LE-tat", "data", "hard", 'replaces "Leto" - harder ending'),
    (("Riket", "vr-sc-hard"), "RI-ket", "signal", "hard", 'replaces "Riko"'),
    (("Zanek", "vr-sc-hard"), "ZA-nek", "resource", "hard", 'replaces "Zano"'),
    (("Satok", "vr-sc-hard"), "SA-tok", "system", "hard", 'replaces "Sato" - hard stop'),
    (("Ravat", "vr-sc-hard"), "RA-vat", "structure / framework", "hard", 'replaces "Rava"'),
    (("Penat", "vr-sc-hard"), "PE-nat", "item / unit", "hard", 'replaces "Peno"'),
    (("Karet", "vr-sc-hard"), "KA-ret", "module / component", "hard", 'replaces "Karo"'),
    (("Binak", "vr-sc-hard"), "BI-nak", "network / web", "hard", "new - essential for Vaultrian context"),
]

desc = [
    (("Kala", "vr-sc-soft"), "KA-la", "good", "soft", "unchanged"),
    (("Zerat", "vr-sc-sharp"), "ZE-rat", "bad / broken", "sharp", 'replaces "Zera" - hard ending = definitive'),
    (("Torek", "vr-sc-hard"), "TO-rek", "big / large", "hard", 'replaces "Tera" (conflict with time fixed)'),
    (("Lina", "vr-sc-soft"), "LI-na", "small", "soft", "unchanged"),
    (("Siret", "vr-sc-flow"), "SI-ret", "fast", "flow", 'replaces "Sira" - flow class fits'),
    (("Nolev", "vr-sc-flow"), "NO-lev", "slow", "flow", 'replaces "Nola"'),
    (("Velan", "vr-sc-hard"), "VE-lan", "new", "hard", 'replaces "Vela"'),
    (("Daran", "vr-sc-flow"), "DA-ran", "old / prior", "flow", 'replaces ambiguous "Dara"'),
    (("Morat", "vr-sc-hard"), "MO-rat", "strong / powerful", "hard", 'replaces "Mora" (conflict with "give" fixed)'),
    (("Selan", "vr-sc-soft"), "SE-lan", "weak / fragile", "soft", 'replaces "Sela" (conflict with "come" fixed)'),
    (("Kirat", "vr-sc-hard"), "KI-rat", "clear / precise", "hard", 'replaces "Kira"'),
    (("Nirat", "vr-sc-sharp"), "NI-rat", "unclear / ambiguous", "sharp", 'replaces "Nira"'),
    (("Melan", "vr-sc-soft"), "ME-lan", "open / accessible", "soft", "new"),
    (("Torvak", "vr-sc-sharp"), "TOR-vak", "closed / restricted", "sharp", "new - hard sharp feel correct"),
]

conn = [
    (("Na", "vr-sc-neut"), "NA", "and", "neutral", "unchanged"),
    (("Se", "vr-sc-neut"), "SE", "with", "neutral", "unchanged"),
    (("Ka", "vr-sc-neut"), "KA", "to / toward", "neutral", "unchanged"),
    (("De", "vr-sc-neut"), "DE", "from", "neutral", "unchanged"),
    (("Lo", "vr-sc-neut"), "LO", "in / at", "neutral", "unchanged"),
    (("No", "vr-sc-neut"), "NO", "not", "neutral", "unchanged"),
    (("Ke", "vr-sc-neut"), "KE", "question marker", "neutral", "unchanged"),
    (("Ra", "vr-sc-sharp"), "RA", "urgent / now (command intensifier)", "sharp", "unchanged"),
]


def rows_from(data):
    r = []
    for item in data:
        w, cls = item[0]
        r.append([(w, cls), item[1], item[2], item[3], item[4]])
    return r


def main():
    headers = ["Word", "Pronunciation", "Meaning", "Class", "Note"]

    print('<div class="vr-section" id="vocabulary" role="tabpanel">')
    print('  <div class="vr-sec-tag">Section 03</div>')
    print('  <h2 class="vr-sec-title">Core Vocabulary &mdash; v2</h2>')
    print('  <div class="vr-sec-divider"></div>')
    print('  <p class="vr-sec-intro">')
    print("    All words rebuilt with sound-meaning mapping. Conflicts resolved. No word shares meaning with another. Every word sounds like what it means.")
    print("  </p>")
    print('  <div class="vr-legend">')
    print('    <div class="vr-legend-item"><div class="vr-legend-dot" style="background:var(--vr-sharp)"></div><div class="vr-legend-text">Sharp</div></div>')
    print('    <div class="vr-legend-item"><div class="vr-legend-dot" style="background:var(--vr-soft)"></div><div class="vr-legend-text">Soft</div></div>')
    print('    <div class="vr-legend-item"><div class="vr-legend-dot" style="background:var(--vr-hard)"></div><div class="vr-legend-text">Hard</div></div>')
    print('    <div class="vr-legend-item"><div class="vr-legend-dot" style="background:var(--vr-flow)"></div><div class="vr-legend-text">Flow</div></div>')
    print("  </div>")

    print(cat_header("var(--vr-soft)", "var(--vr-soft)", "People &amp; Identity", "12"))
    print(table(headers, rows_from(people)))
    print("  </div>")

    print(cat_header("var(--vr-sharp)", "var(--vr-sharp)", "Actions (Verbs)", "18"))
    print(table(headers, rows_from(actions)))
    print("  </div>")

    print(cat_header("var(--vr-hard)", "var(--vr-hard)", "Places &amp; Structure", "10"))
    print(table(headers, rows_from(places)))
    print("  </div>")

    print(cat_header("var(--vr-flow)", "var(--vr-flow)", "Time &amp; Flow", "10"))
    print(table(headers, rows_from(time_w)))
    print("  </div>")

    print(cat_header("var(--vr-hard)", "var(--vr-hard)", "Objects &amp; Systems", "10"))
    print(table(headers, rows_from(tech)))
    print("  </div>")

    print(cat_header("#aaa", "#aaa", "Descriptors", "14"))
    print(table(headers, rows_from(desc)))
    print("  </div>")

    print(cat_header("#aaa", "#aaa", "Connectors &amp; Particles", "8"))
    print(table(headers, rows_from(conn)))
    print("  </div>")

    print("</div>")

    # Conflicts
    conflicts = [
        (
            '❌ OLD: "Daro" = adult AND "Daro" = act/do',
            '✅ NEW: "Danel" = adult · "Varna" / context verbs = act',
            "Two completely different semantic categories sharing the same word. The most fundamental violation of Vaelic's no-ambiguity rule.",
        ),
        (
            '❌ OLD: "Mora" = give AND "Mora" = strong',
            '✅ NEW: "Mora" = give only · "Morat" = strong/powerful',
            "A verb and an adjective sharing the same form breaks both grammar and meaning. Resolved by adding hard -at suffix to the adjective.",
        ),
        (
            '❌ OLD: "Sela" = come AND "Sela" = weak',
            '✅ NEW: "Selora" = come/arrive · "Selan" = weak/fragile',
            "Verb-adjective collision. Selora gains the flowing -ora ending appropriate for a movement word. Selan gains the adjectival -an ending.",
        ),
        (
            '❌ OLD: "Tera" = big AND "Tera" = time',
            '✅ NEW: "Tera" = time only · "Torek" = big/large',
            "Time is a core concept and keeps its word. Size gets a new hard-class word appropriate to its meaning.",
        ),
        (
            '❌ OLD: "Kena" = soon AND "Kena" = what (question word)',
            '✅ NEW: "Kenu" = soon · "Kena" = what (kept as question word)',
            'Question words are high-frequency and must be unambiguous. "Kenu" resolves the collision with a single vowel shift.',
        ),
        (
            '❌ OLD: "Sena" = we/us AND "Sena" = group',
            '✅ NEW: "Sena" = we/us (pronoun kept) · "Mela" = group/collective',
            "Pronouns must be sacred in any language - they are used constantly. The noun gets renamed.",
        ),
        (
            "❌ OLD: All objects ended in -o (Viro, Kano, Leto, Riko, Zano, Sato...)",
            "✅ NEW: Technical/system words end in hard stops -ek, -at, -ok, -et",
            "When everything sounds the same, nothing is distinct. Technical vocabulary now carries sonic identity through hard endings.",
        ),
        (
            "❌ OLD: People words and place words shared -o endings (Naro, Zelo, Meto)",
            "✅ NEW: Place words now end in -ek/-et/-at (Zelek, Seket, Dekat, Ralet, Vekat) · People words keep soft endings",
            "Category distinction through endings. You should be able to hear whether a word is a person, place, or system before you know its specific meaning.",
        ),
    ]

    print('<div class="vr-section" id="conflicts" role="tabpanel">')
    print('  <div class="vr-sec-tag">Section 04</div>')
    print('  <h2 class="vr-sec-title">Conflicts Fixed in v2</h2>')
    print('  <div class="vr-sec-divider"></div>')
    print('  <p class="vr-sec-intro">')
    print("    8 critical conflicts existed in v1 that violated Vaelic's core rule of no ambiguity. Every one is resolved below with the reasoning.")
    print("  </p>")
    for old, new, reason in conflicts:
        print('  <div class="vr-conflict-block">')
        print(f'    <div class="vr-conflict-old">{old}</div>')
        print('    <div class="vr-conflict-arrow">↓</div>')
        print(f'    <div class="vr-conflict-new">{new}</div>')
        print(f'    <div class="vr-conflict-reason">{reason}</div>')
        print("  </div>")
    print("</div>")

    # Changelog
    changes = [
        ("vr-tag-rule", "RULE", "<strong>Sound-meaning mapping established.</strong> Four phonological classes now govern word creation: Sharp (commands/danger), Soft (people/relations), Hard (tech/systems), Flow (time/movement). Every new word must be assigned to a class."),
        ("vr-tag-fix", "FIX", "<strong>8 vocabulary conflicts resolved.</strong> Daro, Mora, Sela, Tera, Kena, Sena all had dual meanings. All resolved. Full details in Conflicts tab."),
        ("vr-tag-rule", "RULE", "<strong>Ending taxonomy introduced.</strong> People words: soft endings (-a, -i, -na). Place words: hard endings (-ek, -et, -at). System words: hard stop endings (-ok, -ak, -ek). Time words: flowing endings (-u, -ol, -un)."),
        ("vr-tag-add", "ADD", "<strong>New words:</strong> Kat (stop - single syllable command), Drak (warn/danger), Binak (network), Melan (open), Torvak (closed/restricted), Dolun (move toward)."),
        ("vr-tag-fix", "FIX", "<strong>Technical vocabulary hardened.</strong> Viro → Vatek, Kano → Kavel, Leto → Letat, Riko → Riket, Zano → Zanek, Sato → Satok. All now carry hard-class sonic identity."),
        ("vr-tag-fix", "FIX", "<strong>Place vocabulary hardened.</strong> Zelo → Zelek, Sek → Seket, Deka → Dekat, Ralo → Ralet, Veko → Vekat."),
        ("vr-tag-rule", "RULE", "<strong>Tense prefixes unchanged:</strong> Da- (past), Va- (future), Ta- (completed), -en (continuous). These were well-designed in v1."),
        ("vr-tag-rule", "RULE", "<strong>Word order unchanged:</strong> Verb → Subject → Object → Location → Time. Solid foundation, kept as-is."),
        ("vr-tag-add", "ADD", "<strong>Next to build:</strong> Writing system / script, Numbers &amp; counting, Plural &amp; possession rules, Extended dialogues. Foundation is now solid enough to build on."),
    ]

    print('<div class="vr-section" id="changelog" role="tabpanel">')
    print('  <div class="vr-sec-tag">Section 05</div>')
    print('  <h2 class="vr-sec-title">Changelog v1 → v2</h2>')
    print('  <div class="vr-sec-divider"></div>')
    for tag_cls, tag_txt, body in changes:
        print('  <div class="vr-change-item">')
        print(f'    <div class="vr-change-tag {tag_cls}">{tag_txt}</div>')
        print(f'    <div class="vr-change-text">{body}</div>')
        print("  </div>")
    print("</div>")


if __name__ == "__main__":
    import io

    buf = io.StringIO()
    _orig = sys.stdout
    sys.stdout = buf
    try:
        main()
    finally:
        sys.stdout = _orig
    with open("_vaelic_generated.html", "w", encoding="utf-8") as f:
        f.write(buf.getvalue())
