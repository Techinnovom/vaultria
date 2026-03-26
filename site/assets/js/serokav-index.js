(function () {
  "use strict";

  var root = document.querySelector(".serokav-index");
  if (!root) return;

  var cards = root.querySelectorAll(".food-card[data-tags]");
  var filterBtns = root.querySelectorAll(".food-filter[data-filter]");
  var countEl = root.querySelector(".food-filter-count");
  var active = new Set();

  function syncButtons() {
    filterBtns.forEach(function (btn) {
      var f = btn.getAttribute("data-filter");
      if (f === "all") {
        btn.classList.toggle("is-active", active.size === 0);
      } else {
        btn.classList.toggle("is-active", active.has(f));
      }
    });
  }

  function apply() {
    var n = 0;
    cards.forEach(function (card) {
      var raw = card.getAttribute("data-tags") || "";
      var tags = raw.split(/\s+/).filter(Boolean);
      var show =
        active.size === 0 ||
        tags.some(function (t) {
          return active.has(t);
        });
      card.hidden = !show;
      if (show) n += 1;
    });
    if (countEl) {
      if (active.size === 0) {
        countEl.textContent =
          "Showing all " + n + " dish" + (n !== 1 ? "es" : "") + ".";
      } else {
        countEl.textContent =
          "Showing " +
          n +
          " dish" +
          (n !== 1 ? "es" : "") +
          " matching your filters.";
      }
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      if (f === "all") {
        active.clear();
      } else {
        if (active.has(f)) {
          active.delete(f);
        } else {
          active.add(f);
        }
      }
      syncButtons();
      apply();
    });
  });

  syncButtons();
  apply();
})();
