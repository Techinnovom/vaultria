(function () {
  "use strict";

  function hasCls(el, name) {
    return !!(el && el.classList && el.classList.contains(name));
  }

  function romanUnit(u) {
    return ["I", "II", "III", "IV"][u - 1] || String(u);
  }

  function initAnswerKeys() {
    document.querySelectorAll(".vaelic-textbook-page .ak-t").forEach(function (btn) {
      btn.addEventListener("click", function () {
        this.classList.toggle("open");
      });
    });
  }

  function chapterRange(unit) {
    var lo = (unit - 1) * 6 + 1;
    return { lo: lo, hi: lo + 5 };
  }

  function computeSegmentRanges(kids) {
    var ranges = [];
    var n = kids.length;
    var i = 0;
    while (i < n && !hasCls(kids[i], "sec") && !hasCls(kids[i], "exs")) {
      i++;
    }
    if (i > 0) {
      ranges.push({ label: "Chapter intro & objectives", from: 0, to: i });
    }
    while (i < n) {
      if (hasCls(kids[i], "exs")) {
        var e0 = i;
        i++;
        while (i < n && (hasCls(kids[i], "ex") || hasCls(kids[i], "ak"))) {
          i++;
        }
        ranges.push({ label: "Exercises & answer key", from: e0, to: i });
        continue;
      }
      if (hasCls(kids[i], "sec")) {
        var s0 = i;
        var secEl = kids[i];
        var sn = secEl.querySelector ? secEl.querySelector(".sec-num") : null;
        var st = secEl.querySelector ? secEl.querySelector(".sec-t") : null;
        var label =
          (sn && sn.textContent ? sn.textContent.trim() + " · " : "") +
          (st && st.textContent ? st.textContent.trim() : "Section");
        i++;
        while (i < n && !hasCls(kids[i], "sec") && !hasCls(kids[i], "exs")) {
          i++;
        }
        ranges.push({ label: label, from: s0, to: i });
        continue;
      }
      i++;
    }
    return ranges;
  }

  function directVtSegs(ch) {
    var out = [];
    var chs = ch.children;
    var j;
    for (j = 0; j < chs.length; j++) {
      if (hasCls(chs[j], "vt-seg")) {
        out.push(chs[j]);
      }
    }
    return out;
  }

  function vtSetDisplay(el, hidden) {
    if (!el || !el.style) {
      return;
    }
    if (hidden) {
      el.style.setProperty("display", "none", "important");
    } else {
      el.style.removeProperty("display");
    }
  }

  function wrapChapterSegments(ch) {
    if (ch.getAttribute("data-vt-seg-done") === "1") {
      return;
    }
    var kids = Array.from(ch.children);
    var segs = computeSegmentRanges(kids);
    ch.setAttribute("data-vt-seg-done", "1");
    if (segs.length <= 1) {
      ch.setAttribute("data-vt-seg-n", String(Math.max(1, segs.length)));
      return;
    }
    var s;
    for (s = segs.length - 1; s >= 0; s--) {
      var r = segs[s];
      var nodes = kids.slice(r.from, r.to);
      if (!nodes.length) {
        continue;
      }
      var wrapper = document.createElement("div");
      wrapper.className = "vt-seg";
      wrapper.setAttribute("data-vt-seg-idx", String(s));
      wrapper.setAttribute("data-vt-seg-label", segs[s].label);
      var parent = nodes[0].parentNode;
      parent.insertBefore(wrapper, nodes[0]);
      var k;
      for (k = 0; k < nodes.length; k++) {
        wrapper.appendChild(nodes[k]);
      }
    }
    ch.setAttribute("data-vt-seg-n", String(segs.length));
  }

  function initTextbookNav() {
    var root = document.querySelector(".vaelic-textbook-page .content");
    if (!root) {
      return;
    }

    var state = { unit: 1, mode: "overview", part: 0 };
    var blocks = [];
    var unit = 1;
    var i;
    var el;
    var children = root.children;

    for (i = 0; i < children.length; i++) {
      el = children[i];
      if (el.classList && el.classList.contains("unit-div")) {
        var uid = el.id || "";
        if (uid.charAt(0) === "u" && uid.length > 1) {
          unit = parseInt(uid.slice(1), 10) || unit;
        }
        el.setAttribute("data-vt-unit", String(unit));
        blocks.push(el);
      } else if (el.classList && el.classList.contains("ch")) {
        var chn = parseInt(el.getAttribute("data-ch"), 10);
        var u = chn ? Math.ceil(chn / 6) : unit;
        el.setAttribute("data-vt-unit", String(u));
        blocks.push(el);
      } else {
        el.setAttribute("data-vt-unit", "4");
        el.setAttribute("data-vt-outro", "1");
        blocks.push(el);
      }
    }

    for (i = 0; i < blocks.length; i++) {
      if (blocks[i].classList && blocks[i].classList.contains("ch")) {
        wrapChapterSegments(blocks[i]);
      }
    }

    function activeChapterEl() {
      if (typeof state.mode !== "number") {
        return null;
      }
      var j;
      for (j = 0; j < blocks.length; j++) {
        var b = blocks[j];
        if (!b.classList || !b.classList.contains("ch")) {
          continue;
        }
        if (parseInt(b.getAttribute("data-ch"), 10) === state.mode) {
          return b;
        }
      }
      return null;
    }

    function validateState() {
      if (state.unit < 1 || state.unit > 4) {
        state.unit = 1;
      }
      if (state.mode === "outro") {
        if (state.unit !== 4) {
          state.mode = "overview";
        }
        state.part = 0;
        return;
      }
      if (state.mode === "overview") {
        state.part = 0;
        return;
      }
      if (typeof state.mode === "number") {
        var r = chapterRange(state.unit);
        if (state.mode < r.lo || state.mode > r.hi) {
          state.mode = "overview";
          state.part = 0;
        }
      } else {
        state.mode = "overview";
        state.part = 0;
      }
      var ch = activeChapterEl();
      if (ch) {
        var nSeg = parseInt(ch.getAttribute("data-vt-seg-n"), 10) || 1;
        if (typeof state.part !== "number" || isNaN(state.part)) {
          state.part = 0;
        }
        if (state.part < 0) {
          state.part = 0;
        }
        if (state.part >= nSeg) {
          state.part = Math.max(0, nSeg - 1);
        }
      } else {
        state.part = 0;
      }
    }

    function parseHashFromString(src) {
      var h = src;
      if (h == null && typeof location !== "undefined") {
        h = location.hash || "";
      } else if (typeof h === "string") {
        var hi = h.indexOf("#");
        h = hi >= 0 ? h.slice(hi) : "";
      } else {
        h = "";
      }
      var m = h.match(/^#u([1-4])$/i);
      if (m) {
        return { unit: parseInt(m[1], 10), mode: "overview", part: 0 };
      }
      m = h.match(/^#u([1-4])-c(\d+)(?:-p(\d+))?$/i);
      if (m) {
        var u = parseInt(m[1], 10);
        var c = parseInt(m[2], 10);
        var pr = m[3] !== undefined ? parseInt(m[3], 10) : 0;
        var rng = chapterRange(u);
        if (c >= rng.lo && c <= rng.hi) {
          return { unit: u, mode: c, part: pr };
        }
        return { unit: u, mode: "overview", part: 0 };
      }
      if (/^#u4-outro$/i.test(h)) {
        return { unit: 4, mode: "outro", part: 0 };
      }
      return null;
    }

    function parseHash() {
      return parseHashFromString(null);
    }

    function canonicalHashForState() {
      if (state.mode === "overview") {
        return "#u" + state.unit;
      }
      if (state.mode === "outro") {
        return "#u4-outro";
      }
      var h = "#u" + state.unit + "-c" + state.mode;
      if (state.part > 0) {
        h += "-p" + state.part;
      }
      return h;
    }

    function fullUrlWithHash(fragment) {
      return (
        (typeof location !== "undefined" ? location.pathname : "") +
        (typeof location !== "undefined" ? location.search : "") +
        fragment
      );
    }

    function syncHash(sync) {
      if (sync === false) {
        return;
      }
      var h = canonicalHashForState();
      var target = fullUrlWithHash(h);
      var cur =
        (typeof location !== "undefined" ? location.pathname + location.search + location.hash : "");
      if (target === cur) {
        return;
      }
      try {
        if (history.replaceState) {
          history.replaceState(null, "", target);
        }
      } catch (e) {
        /* ignore */
      }
    }

    function closeSidebarIfMobile() {
      if (typeof window.matchMedia === "undefined" || !window.matchMedia("(max-width: 959px)").matches) {
        return;
      }
      var aside = document.getElementById("site-sidebar");
      var backdrop = document.getElementById("site-sidebar-backdrop");
      var toggle = document.getElementById("site-nav-toggle");
      if (aside) {
        aside.classList.remove("is-open");
      }
      if (backdrop) {
        backdrop.classList.remove("is-visible");
        backdrop.setAttribute("aria-hidden", "true");
      }
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
      document.body.classList.remove("site-nav-open");
    }

    function linkMatchesState(a) {
      var u = parseInt(a.getAttribute("data-vt-u"), 10);
      if (isNaN(u) || u !== state.unit) {
        return false;
      }
      var m = a.getAttribute("data-vt-mode");
      if (m === "overview") {
        return state.mode === "overview";
      }
      if (m === "outro") {
        return state.mode === "outro";
      }
      var chNum = parseInt(m, 10);
      if (typeof state.mode !== "number" || state.mode !== chNum) {
        return false;
      }
      var p = parseInt(a.getAttribute("data-vt-part") || "0", 10);
      return p === state.part;
    }

    function refreshOutlineActive() {
      var nav = document.getElementById("vt-outline-nav");
      if (!nav) {
        return;
      }
      var links = nav.querySelectorAll(".vt-outline-link");
      var j;
      for (j = 0; j < links.length; j++) {
        var a = links[j];
        a.classList.remove("is-active");
        a.removeAttribute("aria-current");
      }
      var activeEl = null;
      for (j = 0; j < links.length; j++) {
        if (linkMatchesState(links[j])) {
          links[j].classList.add("is-active");
          links[j].setAttribute("aria-current", "location");
          activeEl = links[j];
        }
      }
      if (activeEl) {
        var p = activeEl.parentElement;
        while (p && p !== nav) {
          if (p.tagName === "DETAILS") {
            p.open = true;
          }
          p = p.parentElement;
        }
        if (typeof activeEl.scrollIntoView === "function") {
          activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }
    }

    function scrollReadingPane() {
      var sheet = document.querySelector(".vaelic-textbook-sheet");
      if (!sheet) {
        return;
      }
      var seg = sheet.querySelector(".vt-seg:not(.vt-part-hidden)");
      var target =
        seg ||
        sheet.querySelector(".unit-div:not(.vt-tab-hidden)") ||
        sheet.querySelector(".ch:not(.vt-ch-hidden)") ||
        sheet;
      if (target && typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }

    function refreshChapterVisibility() {
      var j;
      var u = String(state.unit);
      for (j = 0; j < blocks.length; j++) {
        var b = blocks[j];
        var wrongUnit = b.getAttribute("data-vt-unit") !== u;
        b.classList.toggle("vt-tab-hidden", wrongUnit);
        if (wrongUnit) {
          b.classList.remove("vt-ch-hidden");
          vtSetDisplay(b, true);
          continue;
        }
        var hideSlice = false;
        if (b.classList.contains("unit-div")) {
          hideSlice = state.mode !== "overview";
        } else if (b.classList.contains("ch")) {
          var cn = parseInt(b.getAttribute("data-ch"), 10);
          if (state.mode === "overview" || state.mode === "outro") {
            hideSlice = true;
          } else {
            hideSlice = cn !== state.mode;
          }
        } else if (b.getAttribute("data-vt-outro") === "1") {
          hideSlice = state.mode !== "outro";
        } else {
          hideSlice = true;
        }
        b.classList.toggle("vt-ch-hidden", hideSlice);
        vtSetDisplay(b, hideSlice);
      }
    }

    function refreshPartVisibility() {
      var j;
      for (j = 0; j < blocks.length; j++) {
        var b = blocks[j];
        if (!b.classList || !b.classList.contains("ch")) {
          continue;
        }
        var segs = directVtSegs(b);
        var cn = parseInt(b.getAttribute("data-ch"), 10);
        var isActiveChapter =
          typeof state.mode === "number" &&
          !isNaN(cn) &&
          state.mode === cn &&
          b.getAttribute("data-vt-unit") === String(state.unit);

        var chx;
        for (chx = 0; chx < b.children.length; chx++) {
          var nd = b.children[chx];
          if (!hasCls(nd, "vt-seg")) {
            vtSetDisplay(nd, false);
          }
        }

        if (segs.length <= 1) {
          var a;
          for (a = 0; a < segs.length; a++) {
            segs[a].classList.remove("vt-part-hidden");
            vtSetDisplay(segs[a], false);
          }
          continue;
        }

        if (!isActiveChapter) {
          var bj;
          for (bj = 0; bj < segs.length; bj++) {
            segs[bj].classList.remove("vt-part-hidden");
            vtSetDisplay(segs[bj], false);
          }
          continue;
        }

        var p = state.part;
        if (p < 0 || p >= segs.length) {
          p = 0;
        }
        var si;
        for (si = 0; si < segs.length; si++) {
          var hideSeg = si !== p;
          segs[si].classList.toggle("vt-part-hidden", hideSeg);
          vtSetDisplay(segs[si], hideSeg);
        }

        for (chx = 0; chx < b.children.length; chx++) {
          var stray = b.children[chx];
          if (!hasCls(stray, "vt-seg")) {
            vtSetDisplay(stray, true);
          }
        }
      }
    }

    function stripVtDisplayForPrint() {
      var n;
      for (n = 0; n < blocks.length; n++) {
        blocks[n].style.removeProperty("display");
      }
      var segs = root.querySelectorAll(".vt-seg");
      var s;
      for (s = 0; s < segs.length; s++) {
        segs[s].style.removeProperty("display");
      }
      var chs = root.querySelectorAll(".ch");
      var c;
      for (c = 0; c < chs.length; c++) {
        var kids = chs[c].children;
        var k;
        for (k = 0; k < kids.length; k++) {
          kids[k].style.removeProperty("display");
        }
      }
    }

    function applyState(syncHashFlag, scrollReading) {
      validateState();
      refreshChapterVisibility();
      validateState();
      refreshPartVisibility();
      syncHash(syncHashFlag);
      refreshOutlineActive();
      if (scrollReading) {
        scrollReadingPane();
      }
    }

    function makeOutlineLink(href, text, u, mode, part) {
      var a = document.createElement("a");
      a.className = "vt-outline-link";
      a.href = href;
      a.textContent = text;
      a.setAttribute("data-vt-u", String(u));
      if (mode === "overview") {
        a.setAttribute("data-vt-mode", "overview");
      } else if (mode === "outro") {
        a.setAttribute("data-vt-mode", "outro");
      } else {
        a.setAttribute("data-vt-mode", String(mode));
        a.setAttribute("data-vt-part", String(part != null ? part : 0));
      }
      return a;
    }

    function buildSidebarOutline() {
      var inner = document.querySelector("#site-sidebar .site-sidebar-inner");
      if (!inner || document.getElementById("vt-outline-nav")) {
        return;
      }
      var wrap = document.createElement("div");
      wrap.className = "vt-outline-wrap";

      var head = document.createElement("p");
      head.className = "vt-outline-head";
      head.textContent = "Textbook outline";
      wrap.appendChild(head);

      var nav = document.createElement("nav");
      nav.id = "vt-outline-nav";
      nav.setAttribute("aria-label", "Textbook contents");

      var unitList = document.createElement("ul");
      unitList.className = "vt-outline-units";

      var u;
      for (u = 1; u <= 4; u++) {
        var unitDiv = document.getElementById("u" + u);
        var unitTitleEl = unitDiv && unitDiv.querySelector(".unit-title");
        var unitName = unitTitleEl ? unitTitleEl.textContent.trim() : "Unit " + u;
        var cr = chapterRange(u);

        var uLi = document.createElement("li");
        var uDet = document.createElement("details");
        uDet.className = "vt-outline-details vt-outline-unit";

        var uSum = document.createElement("summary");
        uSum.className = "vt-outline-summary";
        uSum.textContent = "Unit " + romanUnit(u) + " · " + unitName;
        uDet.appendChild(uSum);

        var uUl = document.createElement("ul");
        uUl.className = "vt-outline-branch";

        var ovLi = document.createElement("li");
        ovLi.appendChild(makeOutlineLink("#u" + u, "Unit overview", u, "overview", 0));
        uUl.appendChild(ovLi);

        var c;
        for (c = cr.lo; c <= cr.hi; c++) {
          var chEl = document.getElementById("ch" + c);
          if (!chEl) {
            continue;
          }
          var chTitleEl = chEl.querySelector(".ch-title");
          var chTitle = chTitleEl ? chTitleEl.textContent.trim() : "Chapter " + c;
          var segs = directVtSegs(chEl);
          var chLi = document.createElement("li");

          if (segs.length <= 1) {
            chLi.appendChild(
              makeOutlineLink("#u" + u + "-c" + c, c + ". " + chTitle, u, c, 0)
            );
          } else {
            var chDet = document.createElement("details");
            chDet.className = "vt-outline-details vt-outline-chapter";

            var chSum = document.createElement("summary");
            chSum.className = "vt-outline-summary";
            chSum.textContent = "Ch. " + c + " · " + chTitle;
            chDet.appendChild(chSum);

            var pUl = document.createElement("ul");
            pUl.className = "vt-outline-parts";

            var pi;
            for (pi = 0; pi < segs.length; pi++) {
              var pLi = document.createElement("li");
              var partLabel = segs[pi].getAttribute("data-vt-seg-label") || "Part " + String(pi + 1);
              var hash = "#u" + u + "-c" + c + (pi > 0 ? "-p" + pi : "");
              pLi.appendChild(makeOutlineLink(hash, partLabel, u, c, pi));
              pUl.appendChild(pLi);
            }
            chDet.appendChild(pUl);
            chLi.appendChild(chDet);
          }
          uUl.appendChild(chLi);
        }

        if (u === 4) {
          var outLi = document.createElement("li");
          outLi.appendChild(makeOutlineLink("#u4-outro", "Closing (Kiratvel navol)", 4, "outro", 0));
          uUl.appendChild(outLi);
        }

        uDet.appendChild(uUl);
        uLi.appendChild(uDet);
        unitList.appendChild(uLi);
      }

      nav.appendChild(unitList);
      wrap.appendChild(nav);
      inner.appendChild(wrap);

      nav.addEventListener("click", function (e) {
        var a = e.target && e.target.closest ? e.target.closest("a.vt-outline-link") : null;
        if (!a || !nav.contains(a)) {
          return;
        }
        var href = a.getAttribute("href");
        if (!href || href.charAt(0) !== "#") {
          return;
        }
        e.preventDefault();
        var parsedClick = parseHashFromString(href);
        if (!parsedClick) {
          return;
        }
        state.unit = parsedClick.unit;
        state.mode = parsedClick.mode;
        state.part = parsedClick.part;
        validateState();
        var targetUrl = fullUrlWithHash(canonicalHashForState());
        try {
          if (history.replaceState) {
            history.replaceState(null, "", targetUrl);
          }
        } catch (err) {
          if (typeof location !== "undefined") {
            location.hash = canonicalHashForState();
          }
        }
        applyState(false, false);
        scrollReadingPane();
        closeSidebarIfMobile();
      });
    }

    buildSidebarOutline();

    var parsed = parseHash();
    if (parsed) {
      state.unit = parsed.unit;
      state.mode = parsed.mode;
      state.part = parsed.part;
      validateState();
      applyState(true, false);
    } else {
      state.unit = 1;
      state.mode = "overview";
      state.part = 0;
      applyState(false, false);
    }

    window.addEventListener("hashchange", function () {
      var p = parseHash();
      if (p) {
        state.unit = p.unit;
        state.mode = p.mode;
        state.part = p.part;
        validateState();
        applyState(false, false);
      } else if (!location.hash) {
        state.unit = 1;
        state.mode = "overview";
        state.part = 0;
        applyState(false, false);
      }
    });

    window.addEventListener("beforeprint", function () {
      stripVtDisplayForPrint();
    });
    window.addEventListener("afterprint", function () {
      validateState();
      applyState(false, false);
    });
  }

  initAnswerKeys();
  initTextbookNav();
})();
