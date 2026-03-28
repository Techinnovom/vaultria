(function () {
  "use strict";

  function sa(el) {
    document.querySelectorAll(".vyr-banking-page .sb-a").forEach(function (l) {
      l.classList.remove("on");
    });
    el.classList.add("on");
  }
  window.sa = sa;

  var W = { op: 2400, res: 8750, vlt: 45000 };

  function fmt(n) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function upd() {
    var op = document.getElementById("s-op");
    var res = document.getElementById("s-res");
    var vlt = document.getElementById("s-vlt");
    if (op) op.textContent = fmt(W.op);
    if (res) res.textContent = fmt(W.res);
    if (vlt) vlt.textContent = fmt(W.vlt);
  }

  function log(msg, cls) {
    var l = document.getElementById("s-log");
    if (!l) return;
    var d = document.createElement("div");
    d.className = "sim-log-entry" + (cls ? " " + cls : "");
    d.textContent = msg;
    l.insertBefore(d, l.firstChild);
  }

  function simTx() {
    var typeEl = document.getElementById("s-type");
    var amtEl = document.getElementById("s-amt");
    if (!typeEl || !amtEl) return;
    var type = typeEl.value;
    var amt = parseFloat(amtEl.value) || 0;
    if (amt <= 0) {
      log("\u26a0 Amount must be greater than zero.", "warn");
      return;
    }

    if (type === "spend") {
      if (amt > W.op) {
        log(
          "\u2717 Insufficient Operating Balance. Have " +
            fmt(W.op) +
            " VYR, need " +
            fmt(amt) +
            " VYR.",
          "err"
        );
        return;
      }
      W.op -= amt;
      var flagSpend =
        amt >= 10000 ? " [AUTO-FLAGGED — declaration required]" : "";
      log(
        "\u2713 Payment of " +
          fmt(amt) +
          " VYR from Operating Balance." +
          flagSpend +
          (amt >= 1000 ? " [Memo required]" : ""),
        "ok"
      );
    } else if (type === "deposit") {
      W.op += amt;
      var flagDep = amt >= 5000 ? " [CID confirmation required at terminal]" : "";
      log("\u2713 Deposit of " + fmt(amt) + " VYR to Operating Balance." + flagDep, "ok");
    } else if (type === "res-in") {
      if (amt > W.op) {
        log("\u2717 Insufficient Operating Balance for Reserve transfer.", "err");
        return;
      }
      W.op -= amt;
      W.res += amt;
      log(
        "\u2713 Moved " + fmt(amt) + " VYR from Operating to Reserve. Earns 2.5% p.a.",
        "ok"
      );
    } else if (type === "res-out") {
      if (amt > W.res) {
        log("\u2717 Insufficient Reserve Balance.", "err");
        return;
      }
      if (amt > 500) {
        log(
          "\u26a0 Reserve withdrawal above 500 VYR — 24-hour processing delay applies. Funds will arrive tomorrow.",
          "warn"
        );
        W.res -= amt;
        W.op += amt;
      } else {
        W.res -= amt;
        W.op += amt;
        log(
          "\u2713 Reserve withdrawal of " +
            fmt(amt) +
            " VYR — instant (below 500 VYR threshold).",
          "ok"
        );
      }
    } else if (type === "vlt-in") {
      if (amt > W.op) {
        log("\u2717 Insufficient Operating Balance for Vault deposit.", "err");
        return;
      }
      if (W.vlt + amt > 200000) {
        log(
          "\u2717 Vault maximum is 200,000 VYR. Current: " +
            fmt(W.vlt) +
            " VYR. Cannot deposit " +
            fmt(amt) +
            " VYR.",
          "err"
        );
        return;
      }
      W.op -= amt;
      W.vlt += amt;
      log(
        "\u2713 Vault deposit of " +
          fmt(amt) +
          " VYR. 90-day lock begins today. Earns 5.5% p.a.",
        "ok"
      );
    } else if (type === "transfer") {
      if (amt > W.op) {
        log("\u2717 Insufficient Operating Balance for transfer.", "err");
        return;
      }
      W.op -= amt;
      var flagTr =
        amt >= 10000
          ? " [AUTO-FLAGGED — Karelth review within 7 days]"
          : amt >= 1000
            ? " [Transfer memo required]"
            : "";
      log("\u2713 Transfer of " + fmt(amt) + " VYR to recipient CID." + flagTr, "ok");
    }
    upd();
  }
  window.simTx = simTx;

  var root = document.querySelector(".vyr-banking-page");
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
