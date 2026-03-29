(function () {
  "use strict";

  var root = document.querySelector(".vaelic-learning-songs-page");
  if (!root) return;

  var VAELIC_DETAIL = "vaelic.html";

  /* Single-lesson pages: keep prev/next, song title block, and player visible while scrolling lyrics */
  var nav = root.querySelector(".vls-step-nav");
  var audioFig = root.querySelector(".song-audio");
  var songHd = root.querySelector(".song-hd");
  if (nav && audioFig && songHd && !root.querySelector(".vls-sticky-bar")) {
    var bar = document.createElement("div");
    bar.className = "vls-sticky-bar";
    bar.setAttribute("aria-label", "Lesson navigation, title, and recording");
    nav.parentNode.insertBefore(bar, nav);
    bar.appendChild(nav);
    bar.appendChild(songHd);
    bar.appendChild(audioFig);
  }

  function nextSongSection(songEl) {
    var el = songEl.nextElementSibling;
    while (el && !el.classList.contains("song")) {
      el = el.nextElementSibling;
    }
    return el;
  }

  var nextFromMain = root.getAttribute("data-vls-next");

  root.querySelectorAll(".song-audio audio").forEach(function (audio) {
    audio.addEventListener("ended", function () {
      if (nextFromMain) {
        window.location.href = nextFromMain;
        return;
      }
      var song = audio.closest(".song");
      if (!song) return;
      var next = nextSongSection(song);
      if (next && next.id) {
        next.scrollIntoView({ behavior: "smooth", block: "start" });
        try {
          history.replaceState(null, "", "#" + next.id);
        } catch (e) {
          /* ignore */
        }
        return;
      }
      window.location.href = VAELIC_DETAIL;
    });
  });
})();
