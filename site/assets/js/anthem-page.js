(function () {
  var root = document.querySelector(".anthem-canon");
  if (!root) return;

  var nav = root.querySelector(".nav");
  var buttons = nav ? nav.querySelectorAll(".nb[data-target]") : [];
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-target");
      var el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var sections = root.querySelectorAll(".sec[id]");
  if (sections.length && buttons.length) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var id = e.target.id;
          buttons.forEach(function (b) {
            b.classList.toggle("on", b.getAttribute("data-target") === id);
          });
        });
      },
      { rootMargin: "-18% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      obs.observe(s);
    });
  }

  var allSecs = root.querySelectorAll(".sec");
  var visObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("vis");
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -32px 0px" }
  );
  allSecs.forEach(function (s) {
    visObs.observe(s);
  });
})();
