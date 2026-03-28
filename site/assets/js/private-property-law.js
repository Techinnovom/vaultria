(function () {
  "use strict";

  var links = Array.prototype.slice.call(
    document.querySelectorAll(".property-law-page .pll-link")
  );
  var sections = links
    .map(function (link) {
      var id = (link.getAttribute("href") || "").replace(/^#/, "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("on", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      var id = (link.getAttribute("href") || "").replace(/^#/, "");
      if (id) setActive(id);
    });
  });

  window.addEventListener("scroll", function () {
    var active = null;
    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top < 150 && rect.bottom > 140) {
        active = section.id;
      }
    });
    if (active) setActive(active);
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
          }
        });
      },
      { threshold: 0.06 }
    );
    document
      .querySelectorAll(".property-law-page .chapter")
      .forEach(function (section) {
        observer.observe(section);
      });
  } else {
    document
      .querySelectorAll(".property-law-page .chapter")
      .forEach(function (section) {
        section.classList.add("vis");
      });
  }
})();
