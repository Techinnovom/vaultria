# One-off generator for criminal-code.html — run from repo root:
#   python site/pages/_gen_criminal_code.py
# Then delete this file if desired.

import re
from pathlib import Path

OUT = Path(__file__).with_name("criminal-code.html")

HEAD = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Vaultrian Criminal Code — Codex Vol. IV — VAULTRIA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/main.css" />
  <link rel="stylesheet" href="../assets/css/layout.css" />
  <link rel="stylesheet" href="../assets/css/criminal-code.css" />
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
      <div class="wrap cc-wrap">
        <main id="main-content" class="criminal-code-page">
          <p class="tier-kicker"><a href="codex.html">Codex</a> · Volume IV · Criminal law</p>
          <p class="zone-intro">Four offense classes structure ten substantive categories of crimes; Vaultria imposes no death penalty, and natural-born citizens cannot be removed from national territory except by voluntary renunciation under Charter procedure.</p>

          <div class="shell">
            <nav class="sb" aria-label="Criminal Code sections">
              <div class="sb-hd">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 36" width="56" height="36" aria-hidden="true">
                  <path fill="none" stroke-width="1.25" d="M4 4 L28 32 L52 4" />
                  <path fill="none" stroke-width="0.75" opacity="0.45" d="M14 4 L28 22 L42 4" />
                </svg>
                <div class="sb-title">Vaultrian Criminal Code</div>
                <div class="sb-sub">Codex Vol. IV · Criminal Law</div>
              </div>
              <div class="sb-nav">
                <div class="sb-cat">Navigate</div>
                <a class="sb-a on" href="#preamble" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">Preamble</span></a>
                <a class="sb-a" href="#sanctions" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">Sanctions</span></a>
                <a class="sb-a" href="#cat-i" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">I · General part</span></a>
                <a class="sb-a" href="#cat-ii" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">II · Identity</span></a>
                <a class="sb-a" href="#cat-iii" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">III · Systems</span></a>
                <a class="sb-a" href="#cat-iv" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">IV · Violence</span></a>
                <a class="sb-a" href="#cat-v" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">V · Economic</span></a>
                <a class="sb-a" href="#cat-vi" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">VI · Authority</span></a>
                <a class="sb-a" href="#cat-vii" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">VII · Information</span></a>
                <a class="sb-a" href="#cat-viii" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">VIII · Movement</span></a>
                <a class="sb-a" href="#cat-ix" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">IX · Institutions</span></a>
                <a class="sb-a" href="#cat-x" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">X · Non-citizens</span></a>
                <a class="sb-a" href="#procedure" onclick="sa(this)"><span class="sb-dot" aria-hidden="true"></span><span class="sb-lbl">Procedure</span></a>
              </div>
              <div class="sb-ft">
                <p class="sb-motto">Proportionate order, recorded justice.</p>
              </div>
            </nav>

            <div class="main">
              <div class="hero">
                <p class="h-vol">Codex of Order · Volume IV</p>
                <h1 class="h-title">Vaultrian Criminal Code</h1>
                <p class="h-sub">Four offense classes—from corrective Class III through critical Class 0—organize ten substantive categories of crimes. The Code imposes no death penalty. Natural-born citizens cannot be removed from national territory except by voluntary renunciation under Charter procedure.</p>
                <div class="h-tags">
                  <span class="tag c0">Class 0</span>
                  <span class="tag c1">Class I</span>
                  <span class="tag c2">Class II</span>
                  <span class="tag c3">Class III</span>
                </div>
                <div class="class-strip">
                  <div class="cs c0">
                    <div class="cs-num">0</div>
                    <div class="cs-name">Critical</div>
                    <div class="cs-desc">Threats to life, systemic stability, or national integrity.</div>
                  </div>
                  <div class="cs c1">
                    <div class="cs-num">I</div>
                    <div class="cs-name">Severe</div>
                    <div class="cs-desc">Direct risk to individuals, systems, or security.</div>
                  </div>
                  <div class="cs c2">
                    <div class="cs-num">II</div>
                    <div class="cs-name">Moderate</div>
                    <div class="cs-desc">Order, compliance, or controlled-system violations.</div>
                  </div>
                  <div class="cs c3">
                    <div class="cs-num">III</div>
                    <div class="cs-name">Minor</div>
                    <div class="cs-desc">Low-risk violations with minimal safety or integrity impact.</div>
                  </div>
                </div>
              </div>

              <div class="content">
'''

FOOT = r'''
              </div>
            </div>
          </div>
        </main>

        <footer>
          <p>The Sovereign State of VAULTRIA — a living document.</p>
          <p class="latin">Vaultrian Criminal Code · <code>site/pages/criminal-code.html</code></p>
        </footer>
      </div>
    </div>
  </div>
  <div class="site-sidebar-backdrop" id="site-sidebar-backdrop" aria-hidden="true"></div>
  <script src="../assets/js/site-nav.js" defer></script>
  <script src="../assets/js/site-search.js" defer></script>
  <script src="../assets/js/criminal-code.js" defer></script>
</body>
</html>
'''


def section_block(sec_id, icon, num, title, vae, intro):
    hid = sec_id.replace("-", "")
    return f'''                <section class="section" id="{sec_id}" aria-labelledby="hd-{sec_id}">
                  <div class="sec-hd">
                    <div class="sec-ico" aria-hidden="true">{icon}</div>
                    <div class="sec-tw">
                      <p class="sec-n" id="hd-{sec_id}">{num}</p>
                      <h2 class="sec-t">{title}</h2>
                      <p class="sec-v">{vae}</p>
                    </div>
                  </div>
                  <p class="sec-intro">{intro}</p>
'''


def cls_block(cls, badge, label, sanction, offenses):
    """offenses: list of (art, html_text)"""
    ohtml = ""
    for art, txt in offenses:
        ohtml += f'''                    <div class="offense">
                      <div class="off-art">{art}</div>
                      <div class="off-text">{txt}</div>
                    </div>
'''
    return f'''                <div class="cls-block {cls}">
                  <div class="cls-hd">
                    <span class="cls-badge">{badge}</span>
                    <span class="cls-label">{label}</span>
                    <span class="cls-sanction">{sanction}</span>
                  </div>
                  <div class="cls-body">
{ohtml}                  </div>
                </div>
'''


def note_block(cls_extra, label, body):
    return f'''                <div class="note{cls_extra}">
                  <div class="note-l">{label}</div>
                  <div>{body}</div>
                </div>
'''


def pun_grid():
    return r'''                <div class="pun-grid">
                  <div class="pun-col c0">
                    <div class="pun-hd">Class 0</div>
                    <div class="pun-item">Total access revocation where codified</div>
                    <div class="pun-item">Containment and formal investigation</div>
                    <div class="pun-item">Asset seizure or economic freeze as law provides</div>
                    <div class="pun-item">Long-term or indefinite monitoring</div>
                  </div>
                  <div class="pun-col c1">
                    <div class="pun-hd">Class I</div>
                    <div class="pun-item">Movement restriction and suspension</div>
                    <div class="pun-item">Mandatory monitoring (e.g. up to 14 days)</div>
                    <div class="pun-item">Trust classification reduction</div>
                    <div class="pun-item">Psychological and risk evaluation where applicable</div>
                  </div>
                  <div class="pun-col c2">
                    <div class="pun-hd">Class II</div>
                    <div class="pun-item">Access restriction and transaction limitations</div>
                    <div class="pun-item">Temporary reduction in trust classification</div>
                    <div class="pun-item">Monitoring and communication restriction</div>
                    <div class="pun-item">Movement restriction (e.g. 12–48 hours)</div>
                  </div>
                  <div class="pun-col c3">
                    <div class="pun-hd">Class III</div>
                    <div class="pun-item">Warning (initial) for minor non-compliance</div>
                    <div class="pun-item">Corrective measures and compliance orders</div>
                    <div class="pun-item">Escalation to Class II on repetition</div>
                    <div class="pun-item">Recorded in identity profile</div>
                  </div>
                </div>
'''


def dv(text):
    return f'''                <div class="dv"><span class="dv-m">{text}</span></div>
'''


parts = []

parts.append(section_block(
    "preamble",
    "◆",
    "Preamble",
    "Opening principles",
    "Kirat lo Drak — The Law of Consequence",
    "This Volume IV of the Codex of Order declares the criminal law of Vaultria: the classification of offenses, substantive prohibitions, applicable sanctions within the limits of the Charter, and the procedural framework for enforcement and adjudication. No penalty shall exceed what this Codex and the National Charter permit. Vaultria does not impose capital punishment. Citizenship, once lawfully acquired by birth within the meaning of the Charter, is not extinguished by removal from territory; only voluntary renunciation or loss under explicit Charter articles may alter that status.",
))

parts.append(note_block("", "Charter alignment", "Where any provision of this Volume conflicts with the National Charter, the Charter governs. All penalties remain subject to review, appeal, and human oversight for Class I and Class 0 matters as provided in Title V and Title VI of the Codex."))

parts.append(dv("End preamble"))

parts.append("                </section>\n")

# Sanctions
parts.append(section_block(
    "sanctions",
    "⚖",
    "Sanctions",
    "Sanctions and penalty framework",
    "Sena lo Zelarat — The Measure of Correction",
    "Articles 4.1 through 4.3 of Title IV establish the offense classes and general principles of penalty. The grid below summarises typical sanction families; specific statutes and Resolution Chamber orders control individual cases.",
))

parts.append(r'''                <div class="note warn">
                  <div class="note-l">No death penalty</div>
                  <div>Vaultrian criminal law does not authorise execution, lethal judicial punishment, or state killing as a sentence. The maximum coercive measures are containment, revocation of access, economic measures, and long-term monitoring within Codex limits.</div>
                </div>
''')

parts.append(pun_grid())

parts.append(note_block("", "Article 4.1 — Classification of offenses", "<strong>Class III (Minor Offenses)</strong> — Low-risk violations with minimal impact on safety or system integrity.<br/><br/><strong>Class II (Moderate Offenses)</strong> — Violations affecting order, compliance, or controlled systems.<br/><br/><strong>Class I (Severe Offenses)</strong> — Actions posing direct risk to individuals, systems, or security.<br/><br/><strong>Class 0 (Critical Offenses)</strong> — Actions threatening life, systemic stability, or national integrity."))

parts.append(note_block("", "Article 4.2 — Determination of severity", "The classification of an offense shall be determined based on: (a) intent; (b) level of harm or risk; (c) impact on individuals or systems; (d) frequency or repetition. The same offense may be classified differently depending on context."))

parts.append(note_block("", "Article 4.3 — General principles of penalty", "All penalties shall be: (a) proportionate to the offense; (b) responsive to intent and impact; (c) subject to review and appeal. Penalties shall prioritise: (a) prevention of further harm; (b) restoration of system integrity; (c) correction of behavior where possible."))

parts.append(dv("Sanctions schedule"))

parts.append("                </section>\n")

# Category I — General part
parts.append(section_block(
    "cat-i",
    "I",
    "Category I",
    "General part",
    "Vel lo Kirat — The Frame of Offenses",
    "Repeat offenses, attempts, mitigating and aggravating factors, and records of offenses (Codex Articles 4.12 through 4.15).",
))

parts.append(note_block("", "Article 4.12 — Repeat offenses", "Any repeated offense shall result in: (a) escalation in classification; (b) increased severity of penalty. Persistent offenders may be: (a) reclassified; (b) placed under extended monitoring."))

parts.append(note_block("", "Article 4.13 — Attempted offenses", "Attempting to commit an offense shall be punishable. Attempted offenses shall be classified one level below the completed offense unless significant risk is present."))

parts.append(note_block("", "Article 4.14 — Mitigating and aggravating factors", "<strong>Mitigating factors</strong> include: (a) lack of intent; (b) voluntary compliance; (c) cooperation with authorities. <strong>Aggravating factors</strong> include: (a) repetition; (b) coordination with others; (c) high-risk impact."))

parts.append(note_block("", "Article 4.15 — Record of offenses", "All offenses shall be: (a) recorded within the system; (b) linked to identity profile. Records shall influence: (a) classification status; (b) access privileges; (c) future enforcement decisions."))

parts.append("                </section>\n")

# Category II — Identity
parts.append(section_block(
    "cat-ii",
    "II",
    "Category II",
    "Identity and credentials",
    "Vel lo Sen — The Self in Law",
    "Identity fraud and related critical breaches (Codex Article 4.4).",
))

parts.append(cls_block("c0", "Class 0", "Critical", "Identity lock · investigation",
                       [("4.4", "<strong>Article 4.4 — Offense: Identity fraud.</strong> <strong>Definition:</strong> Any act involving the creation, alteration, duplication, or concealment of identity within the system. <strong>Classification:</strong> Standard → Class I; coordinated or repeated → Class 0. <strong>Penalties:</strong> Immediate identity suspension; access revocation; economic freeze; investigation period (7–30 days).")]))

parts.append("                </section>\n")

# III Systems
parts.append(section_block(
    "cat-iii",
    "III",
    "Category III",
    "Systems and data",
    "Vel lo Core — The Protected Net",
    "System interference and unauthorised data access (Codex Articles 4.5 and 4.6).",
))

parts.append(cls_block("c0", "Class 0", "Critical", "Revocation · seizure",
                       [("4.5", "<strong>Article 4.5 — Offense: System interference.</strong> <strong>Definition:</strong> Any attempt to disrupt, bypass, manipulate, or exploit VAULTRIAN systems or infrastructure. <strong>Classification:</strong> Class 0. <strong>Penalties:</strong> Total system access revocation; asset seizure; long-term or indefinite monitoring; containment where necessary.")]))

parts.append(cls_block("c2", "Class II", "Moderate", "Restriction · suspension",
                       [("4.6a", "<strong>Article 4.6 — Offense: Unauthorized data access (limited).</strong> <strong>Definition:</strong> Accessing, extracting, or attempting to obtain restricted system data without authorization. <strong>Classification:</strong> Limited access → Class II; sensitive or critical systems → Class I. <strong>Penalties:</strong> Access restriction; monitoring; data access suspension; possible economic limitation.")]))

parts.append(cls_block("c1", "Class I", "Severe", "Economic limitation",
                       [("4.6b", "<strong>Article 4.6 — Sensitive or critical systems.</strong> Where unauthorised access targets sensitive or critical systems, classification rises to Class I with the penalties set out in Article 4.6.")]))

parts.append("                </section>\n")

# IV Violence
parts.append(section_block(
    "cat-iv",
    "IV",
    "Category IV",
    "Violence and threat",
    "Drak lo Nara — Harm and Intent",
    "Violent conduct or credible threat (Codex Article 4.7).",
))

parts.append(cls_block("c1", "Class I", "Severe", "Containment · evaluation",
                       [("4.7a", "<strong>Article 4.7 — Offense: Violent conduct or intent (threat).</strong> <strong>Definition:</strong> Any action or credible indication of intent to cause physical harm to another individual. <strong>Classification:</strong> Threat without action → Class I.")]))

parts.append(cls_block("c0", "Class 0", "Critical", "Containment · long-term monitoring",
                       [("4.7b", "<strong>Article 4.7 — Attempt or execution.</strong> Attempt or execution of physical harm → Class 0. <strong>Penalties:</strong> Immediate containment; movement restriction; psychological and risk evaluation; long-term monitoring.")]))

parts.append("                </section>\n")

# V Economic
parts.append(section_block(
    "cat-v",
    "V",
    "Category V",
    "Economic crimes",
    "Kavel lo Drak — The Treasury Guarded",
    "Economic fraud within the Vaultrian economic system (Codex Article 4.8).",
))

parts.append(cls_block("c2", "Class II", "Moderate", "Freeze · restitution path",
                       [("4.8a", "<strong>Article 4.8 — Offense: Economic fraud (minor).</strong> <strong>Definition:</strong> Manipulation, deception, or unauthorized activity within the economic system. <strong>Classification:</strong> Minor fraud → Class II.")]))

parts.append(cls_block("c1", "Class I", "Severe", "Trust reduction · restitution",
                       [("4.8b", "<strong>Article 4.8 — Large-scale or coordinated.</strong> Large-scale or coordinated economic fraud → Class I. <strong>Penalties:</strong> Account freeze; transaction limitations; restitution requirements; trust classification reduction.")]))

parts.append("                </section>\n")

# VI Authority
parts.append(section_block(
    "cat-vi",
    "VI",
    "Category VI",
    "Authority and enforcement",
    "Kirat lo Torin — Obedience and the Shield",
    "Non-compliance with lawful authority and obstruction of enforcement (Codex Articles 4.9 and 4.10).",
))

parts.append(cls_block("c3", "Class III", "Minor", "Warning",
                       [("4.9a", "<strong>Article 4.9 — Minor refusal.</strong> Minor refusal of lawful directive → Class III with warning (initial) per Article 4.9.")]))

parts.append(cls_block("c2", "Class II", "Moderate", "Restriction",
                       [("4.9b", "<strong>Article 4.9 — Deliberate or repeated refusal.</strong> → Class II."),
                        ("4.10a", "<strong>Article 4.10 — Offense: Obstruction of enforcement (non-violent).</strong> <strong>Definition:</strong> Interfering with or preventing lawful enforcement actions. <strong>Classification:</strong> non-violent obstruction → Class II. <strong>Penalties:</strong> movement restriction; monitoring; temporary access suspension.")]))

parts.append(cls_block("c1", "Class I", "Severe", "Access suspension",
                       [("4.9c", "<strong>Article 4.9 — Refusal during critical situation.</strong> → Class I."),
                        ("4.10b", "<strong>Article 4.10 — Obstruction involving risk or coordination.</strong> → Class I.")]))

parts.append("                </section>\n")

# VII Information
parts.append(section_block(
    "cat-vii",
    "VII",
    "Category VII",
    "Information harms",
    "Vel lo Vox — Speech and Stability",
    "Dissemination of harmful information (Codex Article 4.11).",
))

parts.append(cls_block("c2", "Class II", "Moderate", "Communication restriction",
                       [("4.11a", "<strong>Article 4.11 — Negligent dissemination.</strong> <strong>Definition:</strong> Distribution of information that creates measurable risk to public safety or system stability. <strong>Classification:</strong> negligent dissemination → Class II.")]))

parts.append(cls_block("c1", "Class I", "Severe", "Monitoring · access limits",
                       [("4.11b", "<strong>Article 4.11 — Intentional disruption.</strong> Intentional disruption → Class I. <strong>Penalties:</strong> communication restriction; monitoring; temporary access limitations.")]))

parts.append("                </section>\n")

# VIII Movement — Title III excerpts
parts.append(section_block(
    "cat-viii",
    "VIII",
    "Category VIII",
    "Movement, zones, and containment",
    "Doro lo Vel — Where One May Stand",
    "Unauthorized entry, containment, and zone enforcement (Codex Title III, selected articles).",
))

parts.append(cls_block("c2", "Class II", "Moderate", "Movement restriction",
                       [("3.4a", "<strong>Article 3.4 — Offense: Unauthorized entry (Yellow Zone).</strong> <strong>Definition:</strong> Entry into any zone without the required authorization. <strong>Classification:</strong> Entry into Yellow Zone without clearance → Class II Offense. <strong>Penalties — Class II:</strong> movement restriction (12–48 hours); temporary reduction in trust classification.")]))

parts.append(cls_block("c1", "Class I", "Severe", "Full access suspension",
                       [("3.4b", "<strong>Article 3.4 — Red Zone.</strong> Entry into Red Zone without clearance → Class I Offense. <strong>Penalties — Class I:</strong> full access suspension; mandatory monitoring (up to 14 days).")]))

parts.append(cls_block("c0", "Class 0", "Critical", "Containment · lockdown",
                       [("3.4c", "<strong>Article 3.4 — Black Node.</strong> Attempted access to Black Node → Class 0 Offense. <strong>Penalties — Class 0:</strong> immediate containment; identity lockdown; formal investigation."),
                        ("3.7", "<strong>Article 3.7 — Containment measures.</strong> Where an individual presents a significant threat, containment may be enforced. Containment includes: (a) restriction to a defined location; (b) controlled movement under supervision; (c) temporary isolation if required. Containment must: (a) be justified; (b) be proportionate; (c) be reviewed periodically."),
                        ("3.10", "<strong>Article 3.10 — Zone enforcement authority.</strong> Enforcement of zonal laws shall be carried out by: (a) automated systems; (b) authorized enforcement units; (c) supervisory authorities. Enforcement shall follow escalation: (a) warning; (b) restriction; (c) containment. Use of force shall be: (a) limited; (b) necessary; (c) proportionate to threat level.")]))

parts.append(note_block("", "Article 3.5 — Dynamic restriction protocol", "Movement restrictions may be applied in real-time based on: (a) abnormal behavioral patterns; (b) elevated risk assessment; (c) active enforcement operations. All restrictions must: (a) be recorded in system logs; (b) include justification; (c) specify duration or review conditions."))

parts.append(note_block("", "Article 3.9 — Right to movement appeal", "Any individual subject to movement restriction may challenge such restriction. The system shall provide: (a) reason for restriction; (b) summary of supporting data; (c) expected duration. Appeals must be: (a) reviewed within 24–48 hours; (b) subject to human adjudication for extended restrictions."))

parts.append("                </section>\n")

# IX Institutions — AI abuse, emergency abuse
parts.append(section_block(
    "cat-ix",
    "IX",
    "Category IX",
    "Institutions, AI, and emergency powers",
    "Aegis da Torin — Machine and Mandate",
    "Abuse of artificial intelligence systems and misuse of emergency authority (Codex Title V Article 5.12; Title VII Article 7.11).",
))

parts.append(cls_block("c1", "Class I", "Severe", "Case-by-case",
                       [("5.12", "<strong>Article 5.12 — Protection against AI abuse.</strong> No authority may manipulate AI outputs or misuse AI systems for personal or unauthorized purposes. Such actions shall constitute a Class I or Class 0 offense depending on severity.")]))

parts.append(cls_block("c0", "Class 0", "Critical", "Investigation · removal",
                       [("7.11", "<strong>Article 7.11 — Prohibition of abuse.</strong> Emergency powers shall not be used for personal or political advantage or beyond the scope of the emergency. Misuse of emergency authority shall constitute a Class I or Class 0 offense.")]))

parts.append("                </section>\n")

# X Non-citizens
parts.append(section_block(
    "cat-x",
    "X",
    "Category X",
    "Non-citizens, removal, and jurisdiction",
    "Vec lo Doro — Those Who Visit",
    "Offenses by non-citizens, deportation, re-entry, and sovereign jurisdiction (Codex Title VIII, selected articles). Removal provisions apply to non-citizens and to naturalised citizens only as expressly provided; natural-born citizens are not subject to deportation.",
))

parts.append(note_block(" warn", "Born citizens", "Natural-born Vaultrian citizens cannot be removed from national territory as a criminal sanction. Loss of citizenship or voluntary renunciation follows Charter articles exclusively; this Volume does not authorise banishment of born citizens."))

parts.append(cls_block("c1", "Class I", "Severe", "Removal · prohibition",
                       [("8.5", "<strong>Article 8.5 — Offenses by non-citizens.</strong> Non-citizens committing offenses shall be subject to the same classification of offenses and penalties appropriate to their status. Additional measures may include immediate restriction, removal from territory, or prohibition of re-entry."),
                        ("8.6", "<strong>Article 8.6 — Deportation and removal.</strong> A non-citizen may be removed where a Class I or Class 0 offense is committed, continued presence poses risk, or conditions of entry are violated. Removal must be documented, follow defined procedure, and respect fundamental protections.")]))

parts.append(cls_block("c0", "Class 0", "Critical", "Permanent bar",
                       [("8.7", "<strong>Article 8.7 — Re-entry prohibition.</strong> Individuals removed may be temporarily barred or permanently prohibited. Re-entry decisions shall be based on severity of prior offense, risk assessment, and system evaluation."),
                        ("8.10", "<strong>Article 8.10 — Jurisdiction over non-citizens.</strong> All individuals within VAULTRIA, regardless of origin, shall be subject to this Codex and enforcement authority. No external law shall override the authority of this Codex within VAULTRIAN territory.")]))

parts.append("                </section>\n")

# Procedure — Title VI full
parts.append(section_block(
    "procedure",
    "⚖",
    "Procedure",
    "Enforcement and justice",
    "Kirat lo Res — The Path to Judgment",
    "Enforcement authority, principles, detention, Resolution Chambers, evidence, adjudication, rights, sentencing, timeframes, review, records, and prohibition of arbitrary enforcement (Codex Title VI, Articles 6.1 through 6.14).",
))

proc_articles = [
    ("6.1", "Article 6.1 — Authority of enforcement. Enforcement of this Codex shall be carried out by authorized enforcement units, designated supervisory authorities, and Aegis Prime within its legal scope. All enforcement actions must comply with this Codex, be proportionate, and be recorded."),
    ("6.2", "Article 6.2 — Principles of enforcement. Enforcement shall be guided by necessity, proportionality, accountability, and minimal force. Enforcement shall prioritize prevention of harm, de-escalation, and preservation of life."),
    ("6.3", "Article 6.3 — Enforcement escalation protocol. All enforcement actions shall follow structured escalation: Notice — system alert or warning; Restriction — limited movement or access; Containment — physical or digital control; Detention — formal holding for investigation. Escalation shall be determined by severity of offense, level of risk, and response of the individual."),
    ("6.4", "Article 6.4 — Detention and holding. Detention may be applied where an offense has been committed, risk of harm persists, or investigation is required. Detention must be lawful, time-bound, and subject to review. Individuals in detention retain the right to appeal and right to fair evaluation."),
    ("6.5", "Article 6.5 — Resolution Chambers (judicial authority). Legal proceedings shall be conducted in designated bodies known as Resolution Chambers. Chambers shall review cases, evaluate evidence, and determine outcomes through AI-assisted analysis and human adjudication."),
    ("6.6", "Article 6.6 — Admissibility of evidence. Evidence may include system data logs, surveillance records, witness statements, and behavioral analysis. All evidence must be verifiable, relevant, and lawfully obtained. AI-generated evidence must include explanation and be subject to human validation."),
    ("6.7", "Article 6.7 — Burden and standard of proof. No individual shall be found liable without sufficient evidence. Determination shall be based on factual evidence, corroborated data, and contextual analysis. Predictive indicators alone shall not constitute proof of guilt."),
    ("6.8", "Article 6.8 — Adjudication process. All cases shall follow: identification of offense; collection of evidence; evaluation by system and authority; determination of outcome. Decisions must state the offense, define classification, and specify penalty."),
    ("6.9", "Article 6.9 — Rights during proceedings. Any individual subject to legal proceedings shall have the right to be informed of the offense, review evidence summaries, and present a response or defense. Proceedings must ensure fairness, clarity, and accessibility."),
    ("6.10", "Article 6.10 — Sentencing and enforcement of penalties. Penalties shall be applied in accordance with offense classification, severity, and aggravating or mitigating factors. Enforcement must follow defined limits, be monitored, and be reversible where errors occur."),
    ("6.11", "Article 6.11 — Timeframes for resolution. Legal matters shall be resolved within reasonable timeframes: minor offenses within hours; moderate within 24–72 hours; severe within defined investigative period. Delays must be justified and documented."),
    ("6.12", "Article 6.12 — Review and correction mechanisms. All decisions shall be subject to review where new evidence emerges, error is identified, or appeal is filed. Incorrect decisions must be reversed, corrected, and restore affected status."),
    ("6.13", "Article 6.13 — Record of proceedings. All enforcement and judicial actions shall be recorded, securely stored, and accessible for authorized review. Records shall contribute to system learning and inform future decisions."),
    ("6.14", "Article 6.14 — Prohibition of arbitrary enforcement. No enforcement action shall be taken without legal basis, without justification, or outside defined procedure. Arbitrary enforcement shall constitute a violation of this Codex."),
]

for art_id, text in proc_articles:
    body = re.sub(r"^Article\s+[\d.]+\s+—\s*", "", text)
    parts.append(note_block("", f"Article {art_id}", body))

parts.append("                </section>\n")

body = HEAD + "".join(parts) + FOOT

OUT.write_text(body, encoding="utf-8", newline="\n")
print("Wrote", OUT, "lines", len(body.splitlines()))
