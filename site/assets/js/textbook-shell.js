(function () {
  "use strict";

  var host = document.getElementById("tb-outline-host");
  var manifest = window.TEXTBOOK_MANIFEST;
  if (!host || !manifest || !manifest.units) {
    return;
  }

  var currentId = document.body.getAttribute("data-part-id") || "";

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  var parts = ['<nav class="tb-outline" aria-label="Textbook outline">'];

  manifest.units.forEach(function (unit) {
    var uOpen = unit.chapters.some(function (ch) {
      return ch.parts.some(function (p) {
        return p.id === currentId;
      });
    });
    if (unit.overviewFile && currentId === "u" + unit.n + "-overview") {
      uOpen = true;
    }
    parts.push(
      '<details class="tb-outline-unit"' + (uOpen ? " open" : "") + ">"
    );
    parts.push(
      "<summary>Unit " + esc(unit.roman) + " — " + esc(unit.title) + "</summary>"
    );

    if (unit.overviewFile) {
      var ovActive = currentId === "u" + unit.n + "-overview";
      parts.push('<ul class="tb-outline-parts">');
      parts.push(
        '<li><a href="' +
          esc(unit.overviewFile) +
          '"' +
          (ovActive ? ' class="is-current" aria-current="page"' : "") +
          ">Overview</a></li>"
      );
      parts.push("</ul>");
    }

    (unit.chapters || []).forEach(function (ch) {
      var chOpen = ch.parts.some(function (p) {
        return p.id === currentId;
      });
      parts.push(
        '<details class="tb-outline-ch"' + (chOpen ? " open" : "") + ">"
      );
      parts.push(
        "<summary>Chapter " +
          ch.n +
          " — " +
          esc(ch.title) +
          "</summary>"
      );
      parts.push('<ul class="tb-outline-parts">');
      ch.parts.forEach(function (p) {
        var cur = p.id === currentId;
        parts.push(
          "<li><a href=\"" +
            esc(p.file) +
            '"' +
            (cur ? ' class="is-current" aria-current="page"' : "") +
            ">" +
            esc(p.label) +
            "</a></li>"
        );
      });
      parts.push("</ul></details>");
    });

    if (unit.n === 4 && unit.outroFile) {
      var outActive = currentId === "u4-outro";
      parts.push('<ul class="tb-outline-parts">');
      parts.push(
        '<li><a href="' +
          esc(unit.outroFile) +
          '"' +
          (outActive ? ' class="is-current" aria-current="page"' : "") +
          ">Closing</a></li>"
      );
      parts.push("</ul>");
    }

    parts.push("</details>");
  });

  parts.push("</nav>");
  host.innerHTML = parts.join("");
})();
