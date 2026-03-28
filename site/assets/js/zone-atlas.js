(function () {
  "use strict";

  var root = document.querySelector(".zone-atlas-page");
  if (!root) return;

  var links = root.querySelectorAll(".sb-a");
  var zones = root.querySelectorAll(".zone");
  window.addEventListener(
    "scroll",
    function () {
      var sy = window.scrollY + 140;
      var id = "";
      zones.forEach(function (zn) {
        if (sy >= zn.offsetTop) {
          id = zn.id;
        }
      });
      if (!id) return;
      links.forEach(function (l) {
        l.classList.toggle("on", l.getAttribute("href") === "#" + id);
      });
    },
    { passive: true }
  );
})();
