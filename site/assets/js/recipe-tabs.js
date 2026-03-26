(function () {
  "use strict";
  document.querySelectorAll("[data-recipe-tabs]").forEach(function (root) {
    var tabs = root.querySelectorAll('[role="tab"]');
    var panels = root.querySelectorAll('[role="tabpanel"]');
    if (!tabs.length || !panels.length) return;
    function select(tabId) {
      tabs.forEach(function (t) {
        var on = t.id === tabId;
        t.setAttribute("aria-selected", on);
        t.classList.toggle("is-active", on);
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        p.hidden = p.getAttribute("aria-labelledby") !== tabId;
      });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        select(tab.id);
      });
      tab.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        var next =
          (e.key === "ArrowRight" ? i + 1 : i - 1 + tabs.length) % tabs.length;
        tabs[next].focus();
        select(tabs[next].id);
      });
    });
  });
})();
