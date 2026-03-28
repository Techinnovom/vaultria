(function () {
  "use strict";

  function sa(el) {
    document.querySelectorAll(".siven-healthcare-page .sb-a").forEach(function (l) {
      l.classList.remove("on");
    });
    el.classList.add("on");
  }
  window.sa = sa;

  var root = document.querySelector(".siven-healthcare-page");
  if (!root) return;

  var secs = root.querySelectorAll(".section");
  var links = root.querySelectorAll(".sb-a[href]");
  window.addEventListener(
    "scroll",
    function () {
      var sy = window.scrollY + 120;
      var id = "";
      secs.forEach(function (s) {
        if (sy >= s.offsetTop) {
          id = s.id;
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
