(function () {
  "use strict";

  function init() {
    var root = document.querySelector("[data-vid-root]");
    if (!root) {
      return;
    }

    var panes = root.querySelectorAll("[data-vid-pane]");
    var trustBtn = root.querySelector("[data-vid-trust-cycle]");
    var trustLabel = root.querySelector("[data-vid-trust-label]");
    var states = ["green", "yellow", "red"];
    var idx = 0;

    var scrollEl = root.querySelector(".vid-scroll");

    function showPane(id) {
      panes.forEach(function (p) {
        var match = p.getAttribute("data-vid-pane") === id;
        if (match) {
          p.removeAttribute("hidden");
        } else {
          p.setAttribute("hidden", "");
        }
        p.setAttribute("aria-hidden", match ? "false" : "true");
      });
      if (scrollEl) {
        scrollEl.scrollTop = 0;
      }
    }

    root.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) {
        return;
      }
      var openBtn = t.closest("[data-vid-open]");
      if (openBtn && root.contains(openBtn)) {
        var openId = openBtn.getAttribute("data-vid-open");
        if (openId) {
          e.preventDefault();
          showPane(openId);
        }
        return;
      }
      var backBtn = t.closest("[data-vid-back]");
      if (backBtn && root.contains(backBtn)) {
        e.preventDefault();
        showPane("home");
      }
    });

    if (trustBtn && trustLabel) {
      trustBtn.addEventListener("click", function () {
        idx = (idx + 1) % states.length;
        var s = states[idx];
        trustLabel.textContent =
          s === "green"
            ? "Clear · Full access"
            : s === "yellow"
              ? "Review · Limited"
              : "Restricted · Lockdown";
        trustBtn.className = "vid-trust-chip vid-trust--" + s;
        trustBtn.setAttribute("aria-pressed", "true");
      });
    }

    showPane("home");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
