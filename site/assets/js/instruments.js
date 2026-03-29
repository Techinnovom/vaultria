(function () {
  "use strict";

  var catalog =
    typeof window !== "undefined" && window.INSTRUMENTS_CATALOG
      ? window.INSTRUMENTS_CATALOG
      : [];
  var byId = {};
  catalog.forEach(function (item) {
    byId[item.id] = item;
  });

  var SECTIONS = [
    { key: "civic", title: "Category 01 — Civic instruments", intro: "Upright wind · standing column · struck chime · worn voice resonance." },
    { key: "private", title: "Category 02 — Private instruments", intro: "Home, travel, mourning, learning, and outdoor brass — acoustic life outside the civic register." },
    { key: "electronic", title: "Electronic instruments", intro: "The single electronic entry in the codex — associated with Sivara zone craft and signal culture." },
  ];

  var root = document.getElementById("instruments-app");
  var viewCatalog = document.getElementById("inst-view-catalog");
  var viewDetail = document.getElementById("inst-view-detail");
  var detailMount = document.getElementById("inst-detail-mount");

  if (!root || !viewCatalog || !viewDetail || !detailMount) {
    return;
  }

  function esc(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bodyToParagraphs(text) {
    return text
      .split(/\n\n+/)
      .map(function (p) {
        return p.trim();
      })
      .filter(Boolean)
      .map(function (p) {
        return "<p>" + esc(p) + "</p>";
      })
      .join("");
  }

  function tagsHtml(tags) {
    return (tags || [])
      .map(function (t) {
        return '<span class="inst-tag">' + esc(t) + "</span>";
      })
      .join("");
  }

  function imageList(inst) {
    var raw = inst.images;
    if (!raw) return [];
    if (typeof raw === "string") return [raw];
    return raw.filter(Boolean);
  }

  function galleryHtml(inst) {
    var imgs = imageList(inst);
    if (!imgs.length) {
      return (
        '<figure class="inst-photo-placeholder" aria-label="No image on file">' +
        '<div class="inst-photo-inner">Image — to be added</div>' +
        "</figure>"
      );
    }
    var multi = imgs.length > 1;
    var parts =
      '<div class="inst-gallery' +
      (multi ? " inst-gallery--multi" : "") +
      '" role="group" aria-label="' +
      esc(inst.name + (multi ? " — reference images" : "")) +
      '">';
    imgs.forEach(function (src, i) {
      var alt =
        inst.name +
        (multi ? " — reference " + String(i + 1) + " of " + String(imgs.length) : "");
      parts +=
        '<figure class="inst-photo">' +
        '<img src="' +
        esc(src) +
        '" alt="' +
        esc(alt) +
        '" loading="lazy" decoding="async" />' +
        "</figure>";
    });
    parts += "</div>";
    return parts;
  }

  function cardHtml(inst) {
    var imgs = imageList(inst);
    var thumb =
      imgs.length > 0
        ? '<div class="inst-card-thumb"><img src="' +
          esc(imgs[0]) +
          '" alt="" loading="lazy" decoding="async" /></div>'
        : '<div class="inst-card-thumb inst-card-thumb--empty" aria-hidden="true"></div>';
    return (
      '<a class="inst-card" href="instruments.html#' +
      esc(inst.id) +
      '">' +
      thumb +
      '<span class="inst-card-text">' +
      '<span class="inst-card-name">' +
      esc(inst.name) +
      "</span>" +
      '<span class="inst-card-headline">' +
      esc(inst.headline) +
      "</span>" +
      '<span class="inst-card-inspired">Inspired by: ' +
      esc(inst.inspired) +
      "</span>" +
      (imgs.length > 1
        ? '<span class="inst-card-count">' + String(imgs.length) + " images</span>"
        : "") +
      "</span>" +
      "</a>"
    );
  }

  function renderCatalog() {
    var html = "";
    SECTIONS.forEach(function (sec) {
      var items = catalog.filter(function (i) {
        return i.category === sec.key;
      });
      if (!items.length) return;
      html += '<section class="inst-section" aria-labelledby="inst-sec-' + sec.key + '">';
      html += '<h2 id="inst-sec-' + sec.key + '" class="inst-section-title">' + esc(sec.title) + "</h2>";
      html += '<p class="inst-section-intro">' + esc(sec.intro) + "</p>";
      html += '<div class="inst-card-grid">';
      items.forEach(function (inst) {
        html += cardHtml(inst);
      });
      html += "</div></section>";
    });
    viewCatalog.querySelector("#inst-catalog-sections").innerHTML = html;
  }

  function renderDetail(id) {
    var inst = byId[id];
    if (!inst) {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      showCatalog();
      return;
    }
    var h =
      '<div class="inst-detail-inner">' +
      '<p class="inst-detail-kicker"><a href="instruments.html" class="inst-back">← Vaultrian instruments</a></p>' +
      '<header class="inst-detail-header">' +
      '<h1 class="inst-detail-title">' +
      esc(inst.name) +
      "</h1>" +
      '<p class="inst-detail-headline">' +
      esc(inst.headline) +
      "</p>" +
      '<p class="inst-detail-inspired"><span class="inst-label">Inspired by</span> ' +
      esc(inst.inspired) +
      "</p>" +
      '<p class="inst-detail-etymology"><span class="inst-label">Etymology</span> ' +
      esc(inst.etymology) +
      "</p>" +
      '<div class="inst-tags" role="list">' +
      tagsHtml(inst.tags) +
      "</div>" +
      "</header>" +
      galleryHtml(inst) +
      '<div class="inst-body prose">' +
      bodyToParagraphs(inst.body) +
      "</div>" +
      '<section class="inst-sound" aria-labelledby="inst-sound-h">' +
      '<h2 id="inst-sound-h" class="inst-sound-title">Sound</h2>' +
      "<p>" +
      esc(inst.sound) +
      "</p>" +
      "</section>" +
      '<p class="inst-detail-footer-meta">Vaultrian Language Authority · Cultural Archive · Musical Codex · Lumen Zone · Kiratvel navol</p>' +
      "</div>";
    detailMount.innerHTML = h;
    document.title = inst.name + " — Vaultrian instruments — VAULTRIA";
  }

  function showCatalog() {
    viewCatalog.hidden = false;
    viewDetail.hidden = true;
    document.title = "Vaultrian instruments — VAULTRIA";
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }

  function showDetail(id) {
    viewCatalog.hidden = true;
    viewDetail.hidden = false;
    renderDetail(id);
    window.scrollTo(0, 0);
  }

  function syncFromHash() {
    var h = (window.location.hash || "").replace(/^#/, "").trim().toLowerCase();
    if (h && byId[h]) {
      showDetail(h);
    } else {
      showCatalog();
    }
  }

  renderCatalog();
  syncFromHash();
  window.addEventListener("hashchange", syncFromHash);
  window.addEventListener("popstate", syncFromHash);

  detailMount.addEventListener("click", function (e) {
    var a = e.target.closest("a.inst-back");
    if (a) {
      e.preventDefault();
      showCatalog();
      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", window.location.pathname + window.location.search);
      } else {
        window.location.hash = "";
      }
    }
  });
})();
