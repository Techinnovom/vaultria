(function () {
  "use strict";

  function init() {
    var root = document.querySelector("[data-vid-root]");
    if (!root) {
      return;
    }

    var panes = root.querySelectorAll("[data-vid-pane]");
    var openers = root.querySelectorAll("[data-vid-open]");
    var backs = root.querySelectorAll("[data-vid-back]");
    var trustBtn = root.querySelector("[data-vid-trust-cycle]");
    var trustLabel = root.querySelector("[data-vid-trust-label]");
    var states = ["green", "yellow", "red"];
    var idx = 0;

    function showPane(id) {
      panes.forEach(function (p) {
        var match = p.getAttribute("data-vid-pane") === id;
        p.hidden = !match;
        p.setAttribute("aria-hidden", match ? "false" : "true");
      });
    }

    openers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-vid-open");
        if (id) {
          showPane(id);
        }
      });
    });

    backs.forEach(function (b) {
      b.addEventListener("click", function () {
        showPane("home");
      });
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
