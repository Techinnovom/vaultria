(function () {
  "use strict";

  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function scoreEntry(q, entryText) {
    var hay = normalize(entryText);
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
    }
    return sc;
  }

  function init() {
    var input = document.getElementById("codex-search-q");
    var panel = document.getElementById("codex-search-results");
    if (!input || !panel) {
      return;
    }

    var entries = [];

    var preamble = document.getElementById("preamble");
    if (preamble) {
      var preTitle =
        (preamble.querySelector(".codex-title-major") || {}).textContent ||
        "Preamble";
      entries.push({
        id: "preamble",
        title: "Preamble",
        text: preTitle + " " + preamble.textContent,
      });
    }

    var articles = document.querySelectorAll(".codex-article");
    for (var i = 0; i < articles.length; i++) {
      var a = articles[i];
      var id = a.getAttribute("id");
      if (!id) continue;

      var h3 = a.querySelector(".codex-article-heading") || a.querySelector("h3");
      var title = h3 ? h3.textContent : id;
      entries.push({
        id: id,
        title: title.replace(/\s+/g, " ").trim(),
        text: title + " " + a.textContent,
      });
    }

    function render(q) {
      var query = normalize(q);
      if (query.length < 2) {
        panel.innerHTML = "";
        panel.hidden = true;
        return;
      }

      var ranked = entries
        .map(function (e) {
          return { entry: e, score: scoreEntry(query, e.text) };
        })
        .filter(function (x) {
          return x.score > 0;
        })
        .sort(function (a, b) {
          return b.score - a.score;
        })
        .slice(0, 12);

      if (ranked.length === 0) {
        panel.innerHTML =
          '<p class="codex-search-empty">No articles match. Try another keyword.</p>';
        panel.hidden = false;
        return;
      }

      var html = ['<ul class="codex-search-list" role="listbox">'];
      for (var j = 0; j < ranked.length; j++) {
        var e = ranked[j].entry;
        html.push(
          '<li role="none">' +
            '<a role="option" class="codex-search-hit" href="#' +
            e.id +
            '">' +
            '<span class="codex-search-hit-title">' +
            e.title +
            "</span>" +
            "</a>" +
            "</li>"
        );
      }
      html.push("</ul>");

      panel.innerHTML = html.join("");
      panel.hidden = false;
    }

    var t = null;
    input.addEventListener("input", function () {
      clearTimeout(t);
      var v = input.value;
      t = setTimeout(function () {
        render(v);
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

