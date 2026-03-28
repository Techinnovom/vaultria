(function () {
  "use strict";

  var root = document.querySelector(".vaelic-learning-songs-page");
  if (!root) return;

  var VAELIC_DETAIL = "vaelic.html";

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
