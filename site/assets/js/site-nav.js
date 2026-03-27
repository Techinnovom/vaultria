(function () {
  "use strict";

  var DEPTH = document.body.getAttribute("data-nav-depth") === "1" ? 1 : 0;

  function href(pageId) {
    if (pageId === "home") {
      return DEPTH ? "../index.html" : "index.html";
    }
    var file = pageId + ".html";
    return DEPTH ? file : "pages/" + file;
  }

  function currentPageId() {
    var seg = window.location.pathname.split("/").pop() || "index.html";
    if (seg === "index.html" || seg === "") {
      return "home";
    }
    return seg.replace(/\.html$/i, "");
  }

  var GROUPS = [
    {
      label: "Overview",
      items: [{ id: "home", title: "Home" }],
    },
    {
      label: "Governance",
      items: [
        { id: "doctrine", title: "Doctrine" },
        { id: "codex", title: "Codex" },
        { id: "government", title: "Government" },
        { id: "authority", title: "Authority" },
        { id: "power", title: "Power" },
        { id: "leadership", title: "Leadership" },
        { id: "architecture", title: "Architecture" },
        { id: "civic-architecture", title: "Civic structures" },
        { id: "civic-architecture-style", title: "Architectural style guide" },
        { id: "organization", title: "Organization" },
      ],
    },
    {
      label: "Realm",
      items: [
        { id: "territory", title: "Territory" },
        { id: "territory-map", title: "Territory map" },
        { id: "symbols", title: "Symbols" },
      ],
    },
    {
      label: "People & economy",
      items: [
        { id: "people", title: "People" },
        { id: "citizenship", title: "Citizenship application" },
        { id: "identity", title: "Identity & visa" },
        { id: "device", title: "V-ID demo" },
        { id: "economy", title: "Economy" },
        { id: "currency", title: "Currency" },
      ],
    },
    {
      label: "Vaelic",
      items: [{ id: "vaelic", title: "Language reference" }],
    },
    {
      label: "Military",
      items: [
        { id: "security", title: "Defense" },
        { id: "army", title: "Army" },
        { id: "navy", title: "Navy" },
        { id: "air", title: "Air Command" },
        { id: "autonomous", title: "Autonomous Defense" },
        { id: "police", title: "Police" },
        { id: "enforcers", title: "Enforcers" },
        { id: "sentinels", title: "Sentinels" },
        { id: "intelligence", title: "Intelligence (VIB)" },
        { id: "cyber", title: "Cyber Command" },
        { id: "medical", title: "Medical Corps" },
        { id: "fire", title: "Fire & Hazard" },
        { id: "vrd", title: "VRD" },
        { id: "elite", title: "Obsidian & Black" },
      ],
    },
    {
      label: "Operations",
      items: [
        { id: "education", title: "Education" },
        { id: "culture", title: "Culture" },
        { id: "holidays", title: "Holidays" },
        { id: "serokav", title: "Serokav" },
        { id: "anthem", title: "Anthem" },
        { id: "attire", title: "VAELTHAR" },
        { id: "rebellion", title: "Rebellion" },
      ],
    },
  ];

  var activeId = currentPageId();
  var homeHref = href("home");

  var parts = ['<div class="site-sidebar-inner">'];
  parts.push('<div class="site-search" role="search">');
  parts.push(
    '<label class="visually-hidden" for="site-search-q">Search site</label>'
  );
  parts.push(
    '<input type="search" id="site-search-q" name="q" class="site-search-input" placeholder="Search VAULTRIA…" autocomplete="off" spellcheck="false" />'
  );
  parts.push(
    '<div id="site-search-panel" class="site-search-panel" hidden></div>'
  );
  parts.push("</div>");
  parts.push('<nav class="site-nav">');
  parts.push(
    '<a class="site-nav-brand" href="' +
      homeHref +
      '"><span class="line">The Sovereign State of</span><span class="name">VAULTRIA</span></a>'
  );

  GROUPS.forEach(function (g) {
    var hasActive = g.items.some(function (item) {
      return item.id === activeId;
    });
    parts.push(
      '<details class="site-nav-group"' + (hasActive ? " open" : "") + ">"
    );
    parts.push('<summary class="site-nav-label">' + g.label + "</summary>");
    parts.push('<div class="site-nav-links">');
    g.items.forEach(function (item) {
      var u = href(item.id);
      var isActive = item.id === activeId;
      parts.push(
        '<a href="' +
          u +
          '"' +
          (isActive ? ' class="is-active" aria-current="page"' : "") +
          ">" +
          item.title +
          "</a>"
      );
    });
    parts.push("</div></details>");
  });

  parts.push("</nav></div>");

  var aside = document.getElementById("site-sidebar");
  if (!aside) {
    return;
  }
  aside.innerHTML = parts.join("");

  var toggle = document.getElementById("site-nav-toggle");
  var backdrop = document.getElementById("site-sidebar-backdrop");

  function closeDrawer() {
    aside.classList.remove("is-open");
    if (backdrop) {
      backdrop.classList.remove("is-visible");
      backdrop.setAttribute("aria-hidden", "true");
    }
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
    document.body.classList.remove("site-nav-open");
  }

  function openDrawer() {
    aside.classList.add("is-open");
    if (backdrop) {
      backdrop.classList.add("is-visible");
      backdrop.removeAttribute("aria-hidden");
    }
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }
    document.body.classList.add("site-nav-open");
  }

  function isMobile() {
    return window.matchMedia("(max-width: 959px)").matches;
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (aside.classList.contains("is-open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeDrawer);
  }

  aside.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (isMobile()) {
        closeDrawer();
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeDrawer();
    }
  });

  window.addEventListener("resize", function () {
    if (!isMobile()) {
      closeDrawer();
    }
  });
})();
