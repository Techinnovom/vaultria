(function () {
  "use strict";

  function sa(el) {
    document.querySelectorAll(".merit-tier-page .sb-a").forEach(function (l) {
      l.classList.remove("on");
    });
    el.classList.add("on");
  }
  window.sa = sa;

  function calc() {
    var hours = parseInt(document.getElementById("ci-hours").value, 10) || 0;
    var ska = parseInt(document.getElementById("ci-ska").value, 10) || 0;
    var skb = parseInt(document.getElementById("ci-skb").value, 10) || 0;
    var skc = parseInt(document.getElementById("ci-skc").value, 10) || 0;
    var vol = parseInt(document.getElementById("ci-vol").value, 10) || 0;
    var emp = parseInt(document.getElementById("ci-emp").value, 10) || 0;
    var edu = parseInt(document.getElementById("ci-edu").value, 10) || 0;
    var com = Math.min(
      3,
      parseInt(document.getElementById("ci-com").value, 10) || 0
    );
    var clean = parseInt(document.getElementById("ci-clean").value, 10) || 0;
    var yrs = parseInt(document.getElementById("ci-yrs").value, 10) || 0;

    var civicPts = Math.min(80, Math.floor(hours / 5));
    var skillPts = Math.min(ska * 15 + skb * 30 + skc * 60, 999);
    var volPts = Math.min(60, Math.floor(vol / 8));
    var empPts = Math.min(75, emp * 20);
    var eduPts = Math.min(100, edu * 20);
    var cleanPts = clean * 15;
    var comPts = com * 20;
    var lonPts =
      yrs <= 5
        ? 0
        : yrs <= 10
          ? (yrs - 5) * 5
          : yrs <= 20
            ? 25 + (yrs - 10) * 8
            : 25 + 80 + (yrs - 20) * 10;

    var total =
      civicPts +
      skillPts +
      volPts +
      empPts +
      eduPts +
      cleanPts +
      comPts +
      lonPts;

    document.getElementById("calc-total").textContent = String(total);

    var tier;
    var tierClass;
    var note;
    if (total >= 150) {
      tier = "Strong T2 year";
      tierClass = "t3";
      note = "Advancing quickly";
    } else if (total >= 80) {
      tier = "Good T1-T2 progress";
      tierClass = "t2";
      note = "Steady advancement";
    } else if (total >= 40) {
      tier = "Maintaining T1";
      tierClass = "t1";
      note = "Stable, not advancing fast";
    } else {
      tier = "Minimal accumulation";
      tierClass = "t1";
      note = "Consider increasing contribution";
    }

    var el = document.getElementById("calc-tier");
    el.textContent = tier;
    el.className = "tr-tier " + tierClass;
    document.getElementById("calc-note").textContent = note;

    var pct = Math.min(100, (total / 150) * 100);
    var bar = document.getElementById("calc-bar");
    bar.style.width = pct + "%";
    bar.style.background =
      total >= 150
        ? "var(--t3c)"
        : total >= 80
          ? "var(--t2c)"
          : "var(--t1c)";
  }
  window.calc = calc;

  var root = document.querySelector(".merit-tier-page");
  if (!root) return;

  calc();

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
