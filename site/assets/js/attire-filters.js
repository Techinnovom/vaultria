(function () {
  "use strict";

  var root = document.getElementById("vaelthar-catalog");
  var filterRoot = document.getElementById("vaelthar-filters");
  if (!root || !filterRoot) {
    return;
  }

  var pieces = root.querySelectorAll(".vaelthar-piece");
  var countEl = document.getElementById("vaelthar-filter-count");
  var emptyEl = document.getElementById("vaelthar-filters-empty");
  var total = pieces.length;

  function selectedOccasions() {
    var boxes = filterRoot.querySelectorAll('input[name="vael-occ"]:checked');
    var arr = [];
    for (var i = 0; i < boxes.length; i++) {
      arr.push(boxes[i].value);
    }
    return arr;
  }

  function selectedRadio(name) {
    var r = filterRoot.querySelector('input[name="' + name + '"]:checked');
    return r ? r.value : "";
  }

  function occasionMatches(el, selected) {
    if (selected.length === 0) {
      return true;
    }
    var raw = el.getAttribute("data-vael-occasion") || "";
    var occ = raw.split(/\s+/).filter(Boolean);
    for (var i = 0; i < selected.length; i++) {
      if (occ.indexOf(selected[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  function apply() {
    var occ = selectedOccasions();
    var cut = selectedRadio("vael-cut");
    var band = selectedRadio("vael-band");
    var visible = 0;

    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      var cutOk = !cut || p.getAttribute("data-vael-cut") === cut;
      var bandOk = !band || p.getAttribute("data-vael-band") === band;
      var ok = occasionMatches(p, occ) && cutOk && bandOk;

      if (ok) {
        p.classList.remove("vaelthar-piece--filtered-out");
        visible++;
      } else {
        p.classList.add("vaelthar-piece--filtered-out");
      }
    }

    if (countEl) {
      var anyFilter =
        occ.length > 0 || cut !== "" || band !== "";
      if (!anyFilter) {
        countEl.textContent = "Showing all " + total + " garments.";
      } else if (visible === total) {
        countEl.textContent = "Showing all " + total + " garments (filters match every piece).";
      } else {
        countEl.textContent =
          "Showing " + visible + " of " + total + " garments.";
      }
    }

    if (emptyEl) {
      emptyEl.hidden = visible !== 0;
    }
  }

  function clearFilters() {
    var occBoxes = filterRoot.querySelectorAll('input[name="vael-occ"]');
    for (var i = 0; i < occBoxes.length; i++) {
      occBoxes[i].checked = false;
    }
    var cutAll = filterRoot.querySelector('input[name="vael-cut"][value=""]');
    var bandAll = filterRoot.querySelector('input[name="vael-band"][value=""]');
    if (cutAll) {
      cutAll.checked = true;
    }
    if (bandAll) {
      bandAll.checked = true;
    }
    apply();
  }

  filterRoot.addEventListener("change", function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) {
      return;
    }
    var n = t.getAttribute("name");
    if (n === "vael-occ" || n === "vael-cut" || n === "vael-band") {
      apply();
    }
  });

  var clearBtn = document.getElementById("vaelthar-filters-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearFilters);
  }

  apply();
})();
