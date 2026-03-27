(function () {
  "use strict";

  var root = document.querySelector(".vaelic-ref-page");
  if (!root) {
    return;
  }

  root.querySelectorAll(".vr-ntab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-section");
      if (!id) {
        return;
      }
      root.querySelectorAll(".vr-section").forEach(function (s) {
        s.classList.remove("active");
      });
      root.querySelectorAll(".vr-ntab").forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      var el = document.getElementById(id);
      if (el) {
        el.classList.add("active");
      }
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
})();
