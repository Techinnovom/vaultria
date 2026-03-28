(function () {
  "use strict";

  const DATA_URL = new URL("../data/vaelic-dictionary.json", document.currentScript.src).href;

  let ttsRate = 1.0;
  let currentBtn2 = null;
  let dir = "v-e";
  let filt = "all";
  let cat = "all";
  let q = "";
  let WORDS = [];

  const CATS = [
    { id: "all", label: "All Words", dot: "var(--gold)" },
    { id: "people", label: "People & Identity", dot: "var(--soft)" },
    { id: "actions", label: "Actions", dot: "var(--sharp)" },
    { id: "places", label: "Places & Structure", dot: "var(--hard)" },
    { id: "time", label: "Time & Flow", dot: "var(--flow)" },
    { id: "systems", label: "Objects & Systems", dot: "var(--hard)" },
    { id: "mind", label: "Mind & Communication", dot: "var(--soft)" },
    { id: "emotions", label: "Emotions & States", dot: "var(--flow)" },
    { id: "body", label: "Body & Health", dot: "var(--soft)" },
    { id: "nature", label: "Nature & Environment", dot: "var(--flow)" },
    { id: "government", label: "Government & Law", dot: "var(--hard)" },
    { id: "trade", label: "Trade & Economy", dot: "var(--hard)" },
    { id: "military", label: "Military & Conflict", dot: "var(--sharp)" },
    { id: "food", label: "Food & Sustenance", dot: "var(--soft)" },
    { id: "numbers", label: "Numbers & Quantities", dot: "var(--neu)" },
    { id: "spirit", label: "Spirituality & Philosophy", dot: "var(--flow)" },
    { id: "descriptors", label: "Descriptors", dot: "var(--neu)" },
    { id: "connectors", label: "Connectors & Grammar", dot: "var(--neu)" },
  ];

  const CLS = {
    sharp: { w: "c-sharp", b: "b-sharp" },
    soft: { w: "c-soft", b: "b-soft" },
    hard: { w: "c-hard", b: "b-hard" },
    flow: { w: "c-flow", b: "b-flow" },
    neutral: { w: "c-neutral", b: "b-neutral" },
  };

  const phmap = [
    [/\bka\b/g, "kah"],
    [/\bna\b/g, "nah"],
    [/\bva\b/g, "vah"],
    [/\bra\b/g, "rah"],
    [/\bda\b/g, "dah"],
    [/\bse\b/g, "seh"],
    [/\bve\b/g, "veh"],
    [/\bne\b/g, "neh"],
    [/\bde\b/g, "deh"],
    [/\bre\b/g, "reh"],
    [/\bze\b/g, "zeh"],
    [/\ble\b/g, "leh"],
    [/\bme\b/g, "meh"],
    [/\bte\b/g, "teh"],
    [/\bke\b/g, "keh"],
    [/\blo\b/g, "loh"],
    [/\bdo\b/g, "doh"],
    [/\bno\b/g, "noh"],
    [/\bmo\b/g, "moh"],
    [/\bto\b/g, "toh"],
    [/\bro\b/g, "roh"],
    [/\bso\b/g, "soh"],
    [/\bvo\b/g, "voh"],
    [/\bko\b/g, "koh"],
    [/\bbi\b/g, "bee"],
    [/\bmi\b/g, "mee"],
    [/\bri\b/g, "ree"],
    [/\bvi\b/g, "vee"],
    [/\bli\b/g, "lee"],
    [/\bni\b/g, "nee"],
    [/\bki\b/g, "kee"],
    [/\bsi\b/g, "see"],
    [/\bti\b/g, "tee"],
    [/\bdi\b/g, "dee"],
    [/\bzi\b/g, "zee"],
    [/\blu\b/g, "loo"],
    [/\bru\b/g, "roo"],
    [/\bnu\b/g, "noo"],
    [/\bvu\b/g, "voo"],
    [/\bsu\b/g, "soo"],
    [/\bku\b/g, "koo"],
    [/\bdrak\b/g, "drak"],
    [/\bnod\b/g, "nod"],
    [/\bven\b/g, "ven"],
    [/\bkat\b/g, "kat"],
    [/\bnek\b/g, "nek"],
    [/\bvek\b/g, "vek"],
    [/\bzel\b/g, "zel"],
    [/\bvar\b/g, "var"],
  ];

  /**
   * One flowing spoken string (no hyphens): syllables joined like biNAkel.
   * CAPS in the guide mark stress; after phmap, stressed syllables are title-cased (Nah) so TTS keeps a hint of stress without spelling.
   */
  function pronToConnectedTtsText(raw) {
    if (!raw || typeof raw !== "string") {
      return "";
    }
    var syllables = raw
      .trim()
      .split(/[\s\-]+/)
      .filter(Boolean);
    if (!syllables.length) {
      return "";
    }
    return syllables
      .map(function (syl) {
        var stressed = /[A-Z]/.test(syl);
        var t = syl.toLowerCase();
        phmap.forEach(function (pair) {
          t = t.replace(pair[0], pair[1]);
        });
        if (stressed && t.length) {
          return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
        }
        return t.toLowerCase();
      })
      .join("");
  }

  function setSpeed(btn) {
    ttsRate = parseFloat(btn.dataset.rate) || 1;
    document.querySelectorAll(".vaelic-dict-page .spd").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
  }

  function speak(word, pron, btn, rate) {
    if (!window.speechSynthesis) {
      var ts = document.getElementById("ttsStatus");
      if (ts) ts.textContent = "✗ TTS not supported in this browser";
      return;
    }
    window.speechSynthesis.cancel();
    if (currentBtn2) {
      currentBtn2.classList.remove("playing");
      var ic = currentBtn2.querySelector(".btn-icon");
      if (ic) ic.textContent = "▶";
    }

    var text = pronToConnectedTtsText(pron);
    if (!text.trim() && word) {
      text = pronToConnectedTtsText(String(word).replace(/\s+/g, "-"));
    }
    if (!text.trim()) {
      text = String(pron || word || "")
        .toLowerCase()
        .replace(/[\s\-]+/g, "");
    }
    if (!text.trim()) {
      return;
    }

    var utt = new SpeechSynthesisUtterance(text);
    var voices = window.speechSynthesis.getVoices();
    var v =
      voices.find(function (x) {
        return (
          x.name.indexOf("Google US") !== -1 ||
          x.name.indexOf("Samantha") !== -1 ||
          x.name.indexOf("Google") !== -1 ||
          x.lang === "en-US"
        );
      }) || voices[0];
    if (v) utt.voice = v;
    utt.rate = rate != null ? rate : ttsRate;
    utt.pitch = 0.92;
    utt.volume = 1;
    utt.lang = "en-US";

    btn.classList.add("playing");
    var bicon = btn.querySelector(".btn-icon");
    if (bicon) bicon.textContent = "◌";
    currentBtn2 = btn;

    var speedLabel = rate === 0.6 ? "Slow" : rate === 1.4 ? "Fast" : "Normal";
    var ts2 = document.getElementById("ttsStatus");
    if (ts2) ts2.textContent = "▶ " + word + " · " + speedLabel;

    utt.onend = function () {
      btn.classList.remove("playing");
      if (bicon) bicon.textContent = "▶";
      currentBtn2 = null;
      if (ts2) ts2.textContent = "▶ Audio ready";
    };
    utt.onerror = function () {
      btn.classList.remove("playing");
      if (bicon) bicon.textContent = "▶";
      if (ts2) ts2.textContent = "✗ Audio error";
    };
    window.speechSynthesis.speak(utt);
  }

  function setDir(btn) {
    dir = btn.dataset.dir;
    document.querySelectorAll(".vaelic-dict-page .db").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    render();
  }

  function setF(btn) {
    filt = btn.dataset.f;
    document.querySelectorAll(".vaelic-dict-page .fb").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    render();
  }

  function setCat(el) {
    cat = el.dataset.cat;
    document.querySelectorAll(".vaelic-dict-page .sbc").forEach(function (b) {
      b.classList.remove("active");
    });
    el.classList.add("active");
    render();
  }

  function buildSidebar() {
    var sb = document.getElementById("sidebar");
    if (!sb) return;
    var html =
      '<div style="padding:4px 0"><div class="sb-lbl">Categories</div>' +
      CATS.map(function (c) {
        var n = c.id === "all" ? WORDS.length : WORDS.filter(function (w) {
          return w.cat === c.id;
        }).length;
        return (
          '<div class="sbc' +
          (c.id === "all" ? " active" : "") +
          '" data-cat="' +
          c.id +
          '" role="button" tabindex="0">' +
          '<div class="sbc-dot" style="background:' +
          c.dot +
          '"></div>' +
          '<div class="sbc-name">' +
          c.label +
          "</div>" +
          '<div class="sbc-n">' +
          n +
          "</div></div>"
        );
      }).join("") +
      "</div>";
    sb.innerHTML = html;
    sb.querySelectorAll(".sbc").forEach(function (row) {
      row.addEventListener("click", function () {
        setCat(row);
      });
      row.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setCat(row);
        }
      });
    });
  }

  function getFiltered() {
    return WORDS.filter(function (w) {
      if (filt !== "all" && w.cls !== filt) return false;
      if (cat !== "all" && w.cat !== cat) return false;
      if (q) {
        if (dir === "v-e") return w.word.toLowerCase().indexOf(q) !== -1;
        return (
          w.meaning.toLowerCase().indexOf(q) !== -1 ||
          w.pos.toLowerCase().indexOf(q) !== -1 ||
          w.cat.toLowerCase().indexOf(q) !== -1
        );
      }
      return true;
    }).sort(function (a, b) {
      return a.word.localeCompare(b.word);
    });
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function escAttr(s) {
    return esc(s).replace(/'/g, "&#39;");
  }

  function makeEntry(w) {
    var c = CLS[w.cls] || CLS.neutral;
    var el = document.createElement("div");
    el.className = "entry";
    var uid = "btn-" + w.word.replace(/[^a-z]/gi, "").toLowerCase() + "-" + Math.random().toString(36).slice(2, 6);
    var exBlock = "";
    if (w.example) {
      exBlock =
        '<div class="eex">' +
        esc(w.example) +
        "<span>" +
        esc(w.ex_en) +
        "</span></div>";
    }
    var noteBlock = w.note ? '<div class="en2">↳ ' + esc(w.note) + "</div>" : "";
    el.innerHTML =
      '<div class="el">' +
      '<div class="ew ' +
      c.w +
      '">' +
      esc(w.word) +
      "</div>" +
      '<div class="ep">' +
      esc(w.pron) +
      "</div>" +
      '<div class="ecb ' +
      c.b +
      '"><span class="ect">' +
      esc(w.cls) +
      "</span></div>" +
      '<div class="audio-btns" style="margin-top:7px">' +
      '<button type="button" class="play-btn" id="' +
      uid +
      '-slow" data-word="' +
      escAttr(w.word) +
      '" data-pron="' +
      escAttr(w.pron) +
      '" data-rate="0.6" title="Slow">' +
      '<span class="btn-icon">▶</span>Slow</button>' +
      '<button type="button" class="play-btn" id="' +
      uid +
      '-norm" data-word="' +
      escAttr(w.word) +
      '" data-pron="' +
      escAttr(w.pron) +
      '" data-rate="1" title="Normal">' +
      '<span class="btn-icon">▶</span>Normal</button>' +
      '<button type="button" class="play-btn" id="' +
      uid +
      '-fast" data-word="' +
      escAttr(w.word) +
      '" data-pron="' +
      escAttr(w.pron) +
      '" data-rate="1.4" title="Fast">' +
      '<span class="btn-icon">▶</span>Fast</button>' +
      "</div></div>" +
      '<div class="er">' +
      '<div class="epos">' +
      esc(w.pos) +
      " · " +
      esc(w.cat) +
      "</div>" +
      '<div class="em">' +
      esc(w.meaning) +
      "</div>" +
      exBlock +
      noteBlock +
      "</div>";

    el.querySelectorAll(".play-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var wd = b.getAttribute("data-word") || "";
        var pr = b.getAttribute("data-pron") || "";
        var r = parseFloat(b.getAttribute("data-rate") || "1", 10);
        speak(wd, pr, b, r);
      });
    });
    return el;
  }

  function render() {
    var words = getFiltered();
    var ec = document.getElementById("ec");
    var es = document.getElementById("es");
    var rb = document.getElementById("rb");
    var rb2 = document.getElementById("rb2");
    var statLine = document.getElementById("statLine");
    if (rb) rb.textContent = words.length + " " + (words.length === 1 ? "entry" : "entries");
    if (rb2) rb2.textContent = WORDS.length + " total";
    if (statLine) {
      statLine.textContent =
        WORDS.length + " words · 18 categories · Audio enabled · Vaultrian Official v2.0";
    }
    if (!ec || !es) return;
    ec.innerHTML = "";
    ec.appendChild(es);
    if (!words.length) {
      es.classList.add("show");
      return;
    }
    es.classList.remove("show");
    var grps = {};
    words.forEach(function (w) {
      var k = w.word[0].toUpperCase();
      if (!grps[k]) grps[k] = [];
      grps[k].push(w);
    });
    Object.keys(grps)
      .sort()
      .forEach(function (letter) {
        var g = document.createElement("div");
        g.className = "ag";
        g.innerHTML = '<div class="ah">' + esc(letter) + "</div>";
        grps[letter].forEach(function (w) {
          g.appendChild(makeEntry(w));
        });
        ec.appendChild(g);
      });
  }

  function wireControls() {
    document.querySelectorAll(".vaelic-dict-page .db").forEach(function (b) {
      b.addEventListener("click", function () {
        setDir(b);
      });
    });
    document.querySelectorAll(".vaelic-dict-page .fb").forEach(function (b) {
      b.addEventListener("click", function () {
        setF(b);
      });
    });
    document.querySelectorAll(".vaelic-dict-page .spd").forEach(function (b) {
      b.addEventListener("click", function () {
        setSpeed(b);
      });
    });
    var si = document.getElementById("searchInput");
    if (si) {
      si.addEventListener("input", function (e) {
        q = e.target.value.trim().toLowerCase();
        render();
      });
    }
  }

  function loadDictionaryData() {
    if (window.__VAELIC_DICTIONARY__) {
      return Promise.resolve(window.__VAELIC_DICTIONARY__);
    }
    return fetch(DATA_URL).then(function (r) {
      if (!r.ok) throw new Error("load failed");
      return r.json();
    });
  }

  function init() {
    var root = document.querySelector(".vaelic-dict-page");
    if (!root) return;

    loadDictionaryData()
      .then(function (raw) {
        WORDS = raw.map(function (r) {
          return {
            word: r[0],
            pron: r[1],
            pos: r[2],
            cls: r[3],
            cat: r[4],
            meaning: r[5],
            example: r[6],
            ex_en: r[7],
            note: r[8],
          };
        });
        buildSidebar();
        wireControls();
        render();
        if (window.speechSynthesis) {
          window.speechSynthesis.getVoices();
          window.speechSynthesis.onvoiceschanged = function () {
            window.speechSynthesis.getVoices();
          };
        }
      })
      .catch(function () {
        var statLine = document.getElementById("statLine");
        if (statLine) {
          statLine.textContent =
            "Could not load dictionary data. Include vaelic-dictionary-data.js or serve the site over HTTP.";
        }
        var rb = document.getElementById("rb");
        if (rb) rb.textContent = "—";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
