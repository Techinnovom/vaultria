(function () {
  "use strict";

  var DEPTH = document.body.getAttribute("data-nav-depth") === "1" ? 1 : 0;

  function pageHref(id) {
    if (id === "home") {
      return DEPTH ? "../index.html" : "index.html";
    }
    return DEPTH ? id + ".html" : "pages/" + id + ".html";
  }

  /** id matches site-nav page ids; text is searchable (title + keywords) */
  var SEARCH_INDEX = [
    { id: "home", title: "Home", text: "home overview sovereign state vaultria" },
    { id: "doctrine", title: "Doctrine", text: "doctrine national pillars absolute safety controlled freedom central authority constitution" },
    { id: "codex", title: "Codex of Order", text: "codex law legal volume preamble rights zones criminal aegis prime ai emergency foreign amendments sovereignty prime custodian core council" },
    { id: "government", title: "Government", text: "government law courts civic power structure" },
    { id: "authority", title: "Authority", text: "authority prime custodian executive power" },
    { id: "power", title: "Power", text: "power control oversight" },
    { id: "leadership", title: "Leadership", text: "leadership succession founder" },
    { id: "architecture", title: "Architecture", text: "architecture core doctrine accountability aegis vaultryn" },
    { id: "organization", title: "Organization", text: "organization hierarchy core council custodians reporting org chart" },
    { id: "territory", title: "Territory", text: "territory vault zones aegis prime sentinel civic grid shadow nodes sectors channels" },
    { id: "symbols", title: "Symbols", text: "symbols emblem flag national" },
    { id: "people", title: "People", text: "people society vaelic language english provisional foreign home learning education citizens" },
    { id: "identity", title: "Identity & visa", text: "identity access citizen visitor visa VEC VAP CID trust biometric V-ENTRY clearance outsider" },
    { id: "device", title: "V-ID demo", text: "v-id device demo mock vyrn zonex aegis vaultlog interactive" },
    { id: "economy", title: "Economy", text: "economy vyr core trust restricted cv tv currency salary" },
    { id: "currency", title: "Currency", text: "currency vyr coins banknotes vault gallery" },
    { id: "security", title: "Defense", text: "defense security enforcement military police architecture internal" },
    { id: "army", title: "Army", text: "army land forces ranks supreme commander general soldier chain of command aegis" },
    { id: "navy", title: "Navy", text: "navy maritime fleet admiral coastal marine aegis naval" },
    { id: "air", title: "Air Command", text: "air command aviation drones fighter squadron" },
    { id: "autonomous", title: "Autonomous Defense", text: "autonomous defense drones ai omega aegis" },
    { id: "police", title: "Police", text: "police commissioner constable cid riot traffic national civil" },
    { id: "enforcers", title: "Enforcers", text: "enforcers elite internal strike swat counter terror" },
    { id: "sentinels", title: "Sentinels", text: "sentinels local community order predictive district field high sentinel" },
    { id: "intelligence", title: "Intelligence (VIB)", text: "intelligence vib bureau surveillance agents threat" },
    { id: "cyber", title: "Cyber Command", text: "cyber command digital signals warfare hacking" },
    { id: "medical", title: "Medical Corps", text: "medical vmc corps field medics trauma surgeons emergency vaultryn" },
    { id: "fire", title: "Fire & Hazard", text: "fire hazard fhu suppression hazmat rescue disaster" },
    { id: "vrd", title: "VRD", text: "vrd rapid response division emergency dispatch sixty seconds" },
    { id: "elite", title: "Obsidian & Black", text: "obsidian guard black division elite covert custodian protection ghost" },
    { id: "education", title: "Education", text: "education schools training" },
    { id: "culture", title: "Culture", text: "culture arts society" },
    { id: "rebellion", title: "Rebellion", text: "rebellion dissent resistance canon" },
  ];

  function normalize(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function scoreEntry(q, entry) {
    var hay = normalize(entry.title + " " + entry.text);
    var words = q.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return 0;
    }
    var sc = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w.length < 2) {
        continue;
      }
      if (hay.indexOf(w) !== -1) {
        sc += 3;
      }
      if (normalize(entry.title).indexOf(w) !== -1) {
        sc += 5;
      }
    }
    return sc;
  }

  function renderResults(q, container) {
    var query = normalize(q);
    if (query.length < 2) {
      container.innerHTML = "";
      container.hidden = true;
      return;
    }

    var ranked = SEARCH_INDEX.map(function (e) {
      return { entry: e, score: scoreEntry(query, e) };
    })
      .filter(function (x) {
        return x.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, 12);

    if (ranked.length === 0) {
      container.innerHTML =
        '<p class="site-search-empty">No pages match. Try another keyword.</p>';
      container.hidden = false;
      return;
    }

    var html = ['<ul class="site-search-list" role="listbox">'];
    for (var j = 0; j < ranked.length; j++) {
      var e = ranked[j].entry;
      var url = pageHref(e.id);
      html.push(
        '<li role="none"><a role="option" class="site-search-hit" href="' +
          url +
          '">' +
          e.title +
          "</a></li>"
      );
    }
    html.push("</ul>");
    container.innerHTML = html.join("");
    container.hidden = false;
  }

  function init() {
    var input = document.getElementById("site-search-q");
    var panel = document.getElementById("site-search-panel");
    if (!input || !panel) {
      return;
    }

    var aside = document.getElementById("site-sidebar");
    var toggle = document.getElementById("site-nav-toggle");

    function closeMobileIfNeeded() {
      if (typeof window.matchMedia === "function" && window.matchMedia("(max-width: 959px)").matches) {
        if (aside && aside.classList.contains("is-open")) {
          aside.classList.remove("is-open");
          document.body.classList.remove("site-nav-open");
          var backdrop = document.getElementById("site-sidebar-backdrop");
          if (backdrop) {
            backdrop.classList.remove("is-visible");
            backdrop.setAttribute("aria-hidden", "true");
          }
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
          }
        }
      }
    }

    var t = null;
    input.addEventListener("input", function () {
      clearTimeout(t);
      var v = input.value;
      t = setTimeout(function () {
        renderResults(v, panel);
      }, 120);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        panel.innerHTML = "";
        panel.hidden = true;
        input.blur();
      }
    });

    panel.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest("a.site-search-hit")) {
        closeMobileIfNeeded();
      }
    });

    document.addEventListener("click", function (e) {
      var wrap = document.querySelector(".site-search");
      if (wrap && wrap.contains(e.target)) {
        return;
      }
      panel.hidden = true;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
