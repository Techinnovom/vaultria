(function () {
  "use strict";

  window.goTo = function (id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  var root = document.querySelector(".flownet-rail-page");
  if (!root) return;

  var nbs = root.querySelectorAll(".nb");
  var ids = ["network", "lines", "timetable", "fares", "stations", "rules"];

  window.addEventListener("scroll", function () {
    ids.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top < 160 && r.bottom > 0) {
        nbs.forEach(function (b) {
          b.classList.remove("on");
        });
        if (nbs[i]) nbs[i].classList.add("on");
      }
    });
  });

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("vis");
      });
    },
    { threshold: 0.05 }
  );
  root.querySelectorAll(".sec").forEach(function (s) {
    obs.observe(s);
  });
})();
