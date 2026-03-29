/* global window */
(function (w) {
  "use strict";

  /**
   * Images: site/assets/images/instruments/{NAME}/1.png (and 2.png when present).
   * Folder names match the instrument in UPPERCASE (e.g. KAELVAR, VELKOR).
   * Paths below are relative to pages/instruments.html.
   */
  w.INSTRUMENTS_CATALOG = [
    {
      id: "velkor",
      category: "civic",
      name: "Velkor",
      headline: "Upright Wind · Standing Column",
      inspired: "Saxophone / Bass Clarinet",
      etymology: "vel (forward / signal) + kor (form / column)",
      tags: ["Civic", "Wind", "Standing", "Outdoor Use"],
      images: [
        "../assets/images/instruments/VELKOR/1.png",
        "../assets/images/instruments/VELKOR/2.png",
      ],
      body: `The Velkor is an upright wind instrument — standing about 1.1 metres tall, resting on a weighted base, played from the top. It looks immediately recognisable: a long tapered body that widens toward the bottom into a flared bell, curved gently at the neck like a soprano saxophone but taller, straighter, and heavier. The body is formed from brushed gunmetal aluminium alloy — dark grey with a faint blue undertone, deliberately matte so it doesn't catch glare in outdoor civic spaces. The surface has a fine machine-turned texture running in horizontal rings along the body.

There are fourteen keys along the front face — flat, oval, polished silver against the dark body — each with a slight raised lip so fingers find them without looking. The mouthpiece is removable, made from dense resin in a dark amber colour, slightly warm to the touch. The bell at the base is wide and low, pointed toward the ground at a 30-degree angle, which throws sound outward rather than upward. The weighted base is a flat disc of the same gunmetal alloy — the whole instrument is freestanding, the player stands behind it and leans slightly in to play.`,
      sound: `Deep, resonant, with significant projection. The downward bell angle spreads sound horizontally across a plaza. Civic vocalists describe it as the instrument that makes a crowd go still.`,
    },
    {
      id: "naratel",
      category: "civic",
      name: "Naratel",
      headline: "Struck Chime Frame · Processional",
      inspired: "Marimba / Tubular Bells",
      etymology: "nara (flowing) + tel (signal / message)",
      tags: ["Civic", "Percussion", "Struck", "Processional"],
      images: [
        "../assets/images/instruments/NARATEL/1.png",
        "../assets/images/instruments/NARATEL/2.png",
      ],
      body: `The Naratel is a portable chime frame — carried in front of the body by a single wide shoulder strap, angled slightly upward so the chimes face the crowd. Thirteen cylindrical tubes of graduated length hang from a curved top rail, each suspended on thin tensioned cord so it resonates freely when struck. The tubes are dense anodised bronze-aluminium alloy — a deep warm gold colour, not shiny, more like the colour of old brass left in the sun. Each tube is narrow in diameter with small circular holes near the suspension points to reduce weight without affecting pitch.

The supporting frame is matte black — carbon-reinforced polymer and alloy — built around a stable base so the arc reads clean against the tubes: structural but minimal, letting the gold chimes carry the eye. Two mallets come with it: short handles with dense rubber heads, slightly asymmetric so one side gives a harder attack and the other a softer bloom. The shoulder strap is wide woven fabric in deep navy. When worn and played it sits at chest height, the player strikes with both hands in motion.`,
      sound: `Warm, metallic chime tones that carry outdoors without amplification. The suspended tubes have a long ring — struck once, they sustain for 3–4 seconds. Played in procession, the sound arrives before the players do.`,
    },
    {
      id: "sorvek",
      category: "civic",
      name: "Sorvek",
      headline: "Amplified Voice Frame · Worn",
      inspired: "Talking Drum / Resonator",
      etymology: "sor (record) + vek (voice)",
      tags: ["Civic", "Voice", "Worn", "All Civic Spaces"],
      images: ["../assets/images/instruments/SORVEK/1.png"],
      body: `The Sorvek is a resonance collar and chest frame worn by civic vocalists — part instrument, part amplifier, entirely acoustic. The collar is a firm but lightweight band about 4cm deep, sitting at the throat, made from heat-formed polycarbonate with an inner layer of stretched membrane — similar in concept to a drum skin, but fitted to the body. The membrane vibrates in sympathy with the vocalist's voice, adding harmonic depth and volume without any electronics.

Below the collar, two curved resonance panels hang at the chest — each about 20cm wide, 14cm tall, shaped like shallow bowls facing outward, made from the same thin-walled aluminium alloy as the Velkor but in a warm copper-bronze finish. They're connected to the collar by thin rigid rods that transmit vibration from throat to panel. The whole assembly weighs about 600 grams. From the front it looks architectural — like an ornate breastplate. Up close you can see the membrane at the throat and the slight shiver of the panels when the wearer speaks.`,
      sound: `The human voice made larger and warmer. The chest panels add a resonant bloom around the midrange frequencies that makes speech feel like it's coming from somewhere bigger than a single person.`,
    },
    {
      id: "kavar",
      category: "private",
      name: "Kavar",
      headline: "Acoustic String · Lap Guitar",
      inspired: "Guitar / Lap Steel",
      etymology: "kavar (to know through feeling)",
      tags: ["Private", "String", "Acoustic", "Most Common"],
      images: ["../assets/images/instruments/KAVAR/1.png"],
      body: `The Kavar is the most common instrument in Vaultrian private life — played in homes, on transit, in parks, wherever people sit. It looks like a short-bodied acoustic guitar with a flattened profile, designed to rest across the lap or be held upright. The body is about 40cm long, noticeably slimmer and shallower than a standard guitar — roughly 6cm deep — which makes it easy to carry and quieter when played unplugged. Six strings, nylon-core with a thin braided metal outer wrap, giving them a warm sound without being too bright.

The body is made from formed birchwood panels with a thin synthetic resin finish in either natural amber or a deep charcoal stain — both common, though the charcoal version became culturally associated with younger players in Zerex and Sivara zones. The soundhole is not round — it's a narrow oval slot running horizontally across the lower bout, which gives the resonance a slightly more focused, directed quality. The neck is slim, slightly shorter than a standard guitar scale, with 18 flush frets in stainless steel. The headstock is rectangular, minimal, with six enclosed tuning pegs that hold tune well in Vaultria's variable zone climates.`,
      sound: `Warm, mid-forward acoustic tone. The shallow body reduces bass bloom. The nylon-metal string hybrid gives softness at the attack with slight metallic sustain — forgiving for beginners, expressive for advanced players.`,
    },
    {
      id: "velumex",
      category: "private",
      name: "Velumex",
      headline: "Multi-Pipe Flute · Handheld",
      inspired: "Pan Flute / Recorder",
      etymology: "vel (forward) + umex (layered)",
      tags: ["Private", "Wind", "Flute-Type", "Portable"],
      images: ["../assets/images/instruments/VELUMEX/1.png"],
      body: `The Velumex is a six-pipe pan flute, but more compact and more precisely engineered than the traditional form. Six cylindrical tubes of graduated length — the longest about 28cm, the shortest 14cm — are bound side by side in a flat bundle held together by three slim interlocking resin bands in dark grey. The tubes themselves are made from anodised aluminium, finished in a deep teal colour, each tube sealed at the bottom with a fixed end cap and open at the top for playing.

The tops of the tubes are cut at a slight inward angle — not flat — which gives a more focused edge-tone and makes it easier to shift between tubes at speed. The whole bundle is roughly the size of a large harmonica — 30cm wide, 6cm tall, 2cm deep — and fits in a jacket pocket. The three resin binding bands have a slight ridge pattern so the hands grip naturally. Players hold it horizontally at the lips and move laterally across the tube openings, or angle their head rather than moving the instrument.`,
      sound: `Breathy, warm flute tones with a slight hollow quality from the closed-bottom tube design. Six distinct pitches; chord-like textures possible by blowing across two adjacent tubes simultaneously.`,
    },
    {
      id: "morven",
      category: "private",
      name: "Morven",
      headline: "Friction Drum · Mourning",
      inspired: "Talking Drum / Friction Drum",
      etymology: "morven (the becoming-still; the passage into absence)",
      tags: ["Mourning Use", "Percussion", "Friction", "All Zones"],
      images: ["../assets/images/instruments/MORVEN/1.png"],
      body: `The Morven is a double-headed friction drum, about 35cm tall, with a body shaped like a slightly tapered cylinder — wider at the top than the bottom, giving it a subtle hourglass suggestion. The body is made from turned dark oak, finished with a matte oil that deepens the grain rather than glossing it. The two drum heads are stretched goat hide — treated to be very tight and dry in tone — laced with thin cord in a web pattern down the sides of the body that allows tension adjustment.

The Morven is not struck. It is played by pressing a dampened cord — about 40cm of braided hemp soaked in water or oil — against the centre of the upper drum head and drawing it slowly outward in one direction. The friction generates a sustained, sliding tone that rises and falls with pressure and speed. A second technique involves pressing a thumb against the underside of the lower head while playing the top — this changes the resonant pitch, giving the instrument a voice-like quality. The dampened cord is kept in a small sealed pouch attached to the body by a small metal clip.`,
      sound: `A sustained, wailing friction tone — unmistakable, deeply unsettling in the best possible sense. In a quiet room it fills the space completely. Outdoors it carries a surprising distance.`,
    },
    {
      id: "tarin",
      category: "private",
      name: "Tarin",
      headline: "Small Acoustic String · Children's",
      inspired: "Ukulele / Small Guitar",
      etymology: "tarin (the act of learning)",
      tags: ["Children's", "String", "Acoustic", "Educational"],
      images: ["../assets/images/instruments/TARIN/1.png"],
      body: `The Tarin looks like a small ukulele with four strings, sized for children's hands — body length about 28cm, total length about 50cm. The body is a classic figure-eight shape, slightly rounder in proportion than a standard ukulele, with a circular soundhole near the centre of the upper bout. Made from lightweight paulownia wood — one of the lightest tonewoods, chosen specifically because it makes the instrument easy for small hands and arms to hold for extended periods. Finished in a natural pale cream colour with a thin water-based satin coat.

The neck is short — just 12 frets, stainless steel, flush with the fingerboard so they don't catch small fingers. The fingerboard itself is a dark synthetic composite in matte black, which contrasts well with the pale body and makes fret positions easy to see. Four strings in nylon, thick enough to be forgiving but responsive. The headstock is small and slightly rounded at the top — four simple friction pegs in natural wood colour. It comes in a lightweight fabric sleeve, not a hard case, which is part of the Naratel Kit issued to every child at school entry. The sleeve is navy blue.`,
      sound: `Bright, light, and easy to produce sound from without pressing hard. Four strings give a limited but complete tonal range for early learning. Loud enough for a room, not so loud it's overwhelming.`,
    },
    {
      id: "kaelvar",
      category: "private",
      name: "Kaelvar",
      headline: "Coiled Brass Horn · Handheld",
      inspired: "Saxophone / Flugelhorn",
      etymology: "kael (free / open) + var (resource / available)",
      tags: ["Private", "Wind", "Brass", "Outdoor"],
      images: ["../assets/images/instruments/KAELVAR/1.png"],
      body: `The Kaelvar is a coiled brass-family wind instrument — the tube is about 1.2 metres long but coiled twice into an oval shape that sits comfortably in one arm, roughly the size of a large book. The tube starts narrow at the mouthpiece, widens gradually, and flares at the bell. Made from spun brass alloy with a thin lacquer in a warm dark amber — almost brown — rather than the bright yellow of typical brass instruments. This was a deliberate choice; the darker finish ages better in outdoor conditions and reads less aggressively in civic contexts.

Unlike a traditional brass horn, the Kaelvar has three side-mounted rotary valves — small, smooth cylinders that sit under the left hand's fingers when the instrument is held in playing position. The valves change the tube's effective length, giving the player a full chromatic range. The mouthpiece is detachable, made from dense resin with a medium-deep cup. The coiled shape means the bell faces forward and slightly upward — the sound projects outward toward a crowd. Comes with a simple clip-on strap for hands-free carrying between playing.`,
      sound: `Rich, full, warm brass tone — warmer than a trumpet, brighter than a tuba. Projects well outdoors. The three valves give it a wide range; players typically develop a personal register they favour.`,
    },
    {
      id: "sivkor",
      category: "electronic",
      name: "Sivkor",
      headline: "Electronic Drum Pad · Handheld",
      inspired: "Hand Drum / Cajon / Electronic Pad",
      etymology: "siv (signal / data) + kor (form)",
      tags: ["Electronic", "Percussion", "Handheld", "Sivara Zone"],
      images: ["../assets/images/instruments/SIVKOR/1.png"],
      body: `The Sivkor is a handheld electronic drum pad — shaped like a slightly flattened oval, about 28cm long and 18cm wide, sized like a small tablet or hand drum. It is usually played with one hand striking and the other supporting the frame, especially outdoors. The playing surface is a single large pressure-sensitive membrane on the front face, dense silicone composite with the slight give and resistance of a real drum head without acoustic volume. The bezel is moulded ABS in matte black with a fine texture for grip; recessed face fasteners (small hex heads) show honest assembly — built to be opened for service, not sealed mystery.

Around the membrane, a thin LED ring glows in a bank colour chosen by the player (amber and orange are common defaults for visibility in daylight). The ring is also the tactile rim: you can find the strike zone without looking. Along one edge: a perforated speaker grille for personal monitoring, a 3.5mm jack for headphones or an external speaker, and small side controls — rockers for sound bank and sensitivity. Rechargeable, 14-hour battery. A woven wrist strap mounts from the lower edge for secure carrying between sets.`,
      sound: `Fully programmable — any percussion sound can be loaded. The default factory banks include a dry acoustic drum kit, a resonant talking-drum emulation, a synthetic percussion bank, and two ambient tone banks. Sensitive enough to respond to a light brush or a hard strike differently.`,
    },
  ];
})(window);
