/* Citizenship application — global handlers for onclick attributes */
var state = {
  step: 1,
  totalSteps: 8,
  applicationType: "individual",
  familySize: "",
  familyMembersList: "",
  givenName: "",
  familyName: "",
  dob: "",
  gender: "",
  originCountry: "",
  email: "",
  currentCity: "",
  referral: "",
  selectedLineName: null,
  oathAccepted: false,
  tier: "T1",
  skills: [],
  contribution: "",
  walletName: "",
  walletPin: "",
  photoFile: null,
  docFile: null,
  signed: false,
  typedSig: "",
};

var NAMES = [
  { n: "Farel", p: "FAH-rel", m: "Open field, agricultural land", cat: "nature" },
  { n: "Florin", p: "FLO-rin", m: "One who grows, the growing thing", cat: "nature" },
  { n: "Rrovel", p: "RRO-vel", m: "Current, the movement of water", cat: "nature" },
  { n: "Shelan", p: "SHEH-lan", m: "New current, water renewed", cat: "nature" },
  { n: "Narezi", p: "nah-REH-zi", m: "The white foam, the cream of things", cat: "nature" },
  { n: "Morvel", p: "MOR-vel", m: "Deep root, that which anchors", cat: "nature" },
  { n: "Zelaren", p: "ZEL-ah-ren", m: "Dawn field, the land in morning light", cat: "nature" },
  { n: "Navrin", p: "NAV-rin", m: "Always growing, perpetual life", cat: "nature" },
  { n: "Korath", p: "KO-rath", m: "Stone and soil, the ground underfoot", cat: "nature" },
  { n: "Nara", p: "NAH-ra", m: "Person, humanity itself", cat: "values" },
  { n: "Morat", p: "MO-raht", m: "Strength, the capacity to endure", cat: "values" },
  { n: "Kiratvel", p: "ki-RAHT-vel", m: "Covenant truth, truth that holds", cat: "values" },
  { n: "Sorel", p: "SO-rel", m: "Peace, the quiet after difficulty", cat: "values" },
  { n: "Veloren", p: "VEH-lo-ren", m: "That which stays, the permanent self", cat: "values" },
  { n: "Birekan", p: "bi-REH-kan", m: "Builder, one who makes things real", cat: "values" },
  { n: "Navelor", p: "NAV-el-or", m: "Always and more, perpetual expansion", cat: "values" },
  { n: "Kavelan", p: "KAH-vel-an", m: "Tool and agent, one who serves work", cat: "values" },
  { n: "Zelek", p: "ZEH-lek", m: "Place, the ground that belongs to you", cat: "place" },
  { n: "Lunoren", p: "LOO-no-ren", m: "Shelter and self, the home identity", cat: "place" },
  { n: "Nodavel", p: "NOD-ah-vel", m: "Permanent city, the city that endures", cat: "place" },
  { n: "Zeloren", p: "ZEH-lo-ren", m: "Place of self, where one belongs", cat: "place" },
  { n: "Lumenath", p: "LOO-men-ath", m: "Light and earth, the illuminated ground", cat: "place" },
  { n: "Kavel", p: "KAH-vel", m: "Tool, the instrument of the craft", cat: "work" },
  { n: "Birekel", p: "bi-REH-kel", m: "Builder carried forward", cat: "work" },
  { n: "Zarikan", p: "ZAH-ri-kan", m: "Knowledge agent, one who knows and does", cat: "work" },
  { n: "Nexorel", p: "NEK-so-rel", m: "Network peace, calm in connected systems", cat: "work" },
  { n: "Kavarel", p: "KAH-vah-rel", m: "Spoken tool, the craft of language", cat: "work" },
  { n: "Makelan", p: "MAH-keh-lan", m: "Craft line, the family of makers", cat: "work" },
  { n: "Darel", p: "DAH-rel", m: "Archive, the record that persists", cat: "time" },
  { n: "Navolen", p: "NAV-o-len", m: "Always extended, the unending line", cat: "time" },
  { n: "Kirathen", p: "ki-RAHTH-en", m: "Extended truth, truth that keeps going", cat: "time" },
  { n: "Navdarel", p: "nav-DAH-rel", m: "The always-record, permanent archive", cat: "time" },
  { n: "Zelaran", p: "ZEH-la-ran", m: "Dawn person, one who arrives with light", cat: "light" },
  { n: "Lumoren", p: "LOO-mo-ren", m: "Light self, the illuminated identity", cat: "light" },
  { n: "Lumavel", p: "LOO-mah-vel", m: "Permanent light, the light that stays", cat: "light" },
  { n: "Zelkoran", p: "zel-KO-ran", m: "Dawn stone, the light on solid ground", cat: "light" },
  { n: "Flamiven", p: "flah-MI-ven", m: "Fire direction, the way lit by flame", cat: "light" },
  { n: "Shen", p: "SHEN", m: "River, the enduring flow", cat: "water" },
  { n: "Shavel", p: "SHAH-vel", m: "Flow route, the permanent current", cat: "water" },
  { n: "Shenavel", p: "SHEH-nah-vel", m: "River permanent, never ending", cat: "water" },
  { n: "Cheloren", p: "CHEH-lo-ren", m: "Change self, the identity that adapts", cat: "water" },
  { n: "Shavelath", p: "SHAH-vel-ath", m: "Flow route and earth, grounded current", cat: "water" },
  { n: "Hora", p: "HO-ra", m: "Sky, the open above", cat: "sky" },
  { n: "Aeriven", p: "AER-i-ven", m: "High direction, the upward path", cat: "sky" },
  { n: "Horavel", p: "ho-RAH-vel", m: "Permanent sky, the enduring above", cat: "sky" },
  { n: "Lumhorel", p: "loom-HO-rel", m: "Light sky peace, the calm illuminated above", cat: "sky" },
  { n: "Zelaeris", p: "zel-AER-is", m: "Dawn sky, the lit morning above", cat: "sky" },
  { n: "Velum", p: "VEH-loom", m: "Advanced study, the deep knowing", cat: "earth" },
  { n: "Morath", p: "MO-rath", m: "Strength earth, the powerful ground", cat: "earth" },
  { n: "Korenath", p: "ko-REH-nath", m: "Stone self and earth, the deep identity", cat: "earth" },
  { n: "Gavelath", p: "gah-VEH-lath", m: "Structured truth on earth", cat: "earth" },
  { n: "Dravel", p: "DRAH-vel", m: "Warned permanence, what is guarded", cat: "earth" },
];
var SKILLS = [
  "Software Engineering",
  "Data Science",
  "AI / Machine Learning",
  "Cybersecurity",
  "Network Infrastructure",
  "Governance & Law",
  "Finance & Economics",
  "Education",
  "Healthcare & Medicine",
  "Architecture & Urban Design",
  "Creative Arts",
  "Language & Translation",
  "Security & Defense",
  "Research & Analysis",
  "Community Building",
  "Journalism & Media",
  "Agriculture & Food",
  "Engineering",
  "Philosophy & Ethics",
  "Administrative Operations",
];

function setApplicationType(value) {
  state.applicationType = value || "individual";
  var ind = document.getElementById("appTypeIndividualWrap");
  var fam = document.getElementById("appTypeFamilyWrap");
  if (ind) ind.classList.toggle("selected", state.applicationType === "individual");
  if (fam) fam.classList.toggle("selected", state.applicationType === "family");
  var panel = document.getElementById("familyFieldsPanel");
  if (panel) {
    if (state.applicationType === "family") panel.removeAttribute("hidden");
    else panel.setAttribute("hidden", "");
  }
  if (state.applicationType === "individual") {
    var fs = document.getElementById("f-familySize");
    var fl = document.getElementById("f-familyList");
    if (fs) {
      fs.classList.remove("error");
      fs.classList.remove("valid");
    }
    if (fl) {
      fl.classList.remove("error");
      fl.classList.remove("valid");
    }
  }
}

function countCoApplicantLines(text) {
  return text
    .split(/\r?\n/)
    .map(function (l) {
      return l.trim();
    })
    .filter(function (l) {
      return l.length > 0;
    }).length;
}

window.addEventListener("DOMContentLoaded", function () {
  buildNameGrid("all", "");
  buildSkillsGrid();
  initSignatureCanvas();
  var checked = document.querySelector('input[name="applicationType"]:checked');
  if (checked) setApplicationType(checked.value);
});

function goToStep(n) {
  document.querySelectorAll(".step-panel").forEach(function (p) {
    p.classList.remove("active");
  });
  var panel = document.getElementById("step" + n);
  if (panel) panel.classList.add("active");

  document.querySelectorAll(".prog-step").forEach(function (s) {
    var sn = parseInt(s.dataset.step, 10);
    s.classList.remove("active", "done");
    if (sn === n) s.classList.add("active");
    else if (sn < n) s.classList.add("done");
    var dot = s.querySelector(".prog-dot");
    if (sn < n) dot.innerHTML = "✓";
    else dot.innerHTML = String(sn);
  });

  var pct = (n / state.totalSteps) * 100;
  document.getElementById("progressFill").style.width = pct + "%";
  state.step = n;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (n === 8) buildAppSummary();
  if (n === 3) updateOathDisplay();
}

function jumpToStep(n) {
  if (n <= state.step) goToStep(n);
}

function nextStep(current) {
  if (!validateStep(current)) return;
  collectStep(current);
  if (current < state.totalSteps) goToStep(current + 1);
}

function prevStep(current) {
  if (current > 1) goToStep(current - 1);
}

function validateStep(n) {
  if (n === 1) {
    var ok = true;
    function req(fId, inputId, type) {
      var v = document.getElementById(inputId);
      var f = document.getElementById(fId);
      var valid = type === "select" ? v.value !== "" : v.value.trim() !== "";
      if (type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.value.trim());
      f.classList.toggle("error", !valid);
      f.classList.toggle("valid", valid);
      if (!valid) ok = false;
    }
    req("f-given", "givenName");
    req("f-family", "familyName");
    req("f-dob", "dob");
    req("f-gender", "gender", "select");
    req("f-origin", "originCountry", "select");
    req("f-email", "email", "email");
    var appType = (document.querySelector('input[name="applicationType"]:checked') || {}).value || "individual";
    if (appType === "family") {
      var fsSel = document.getElementById("familySize");
      var fsField = document.getElementById("f-familySize");
      var listEl = document.getElementById("familyMembersList");
      var listField = document.getElementById("f-familyList");
      var n = parseInt(fsSel && fsSel.value, 10);
      var needCo = n >= 2 ? n - 1 : 0;
      var lineCount = listEl ? countCoApplicantLines(listEl.value) : 0;
      var fsOk = n >= 2 && n <= 8;
      if (fsField) {
        fsField.classList.toggle("error", !fsOk);
        fsField.classList.toggle("valid", fsOk);
      }
      if (!fsOk) ok = false;
      var listOk = fsOk && lineCount === needCo && needCo > 0;
      if (listField) {
        listField.classList.toggle("error", !listOk);
        listField.classList.toggle("valid", listOk);
      }
      if (!listOk) {
        ok = false;
        if (fsOk && listEl) {
          alert(
            "Family application: you chose " +
              n +
              " people total (including you). Enter exactly " +
              needCo +
              " co-applicant line(s) — one per line, with legal name, date of birth (YYYY-MM-DD), and relationship."
          );
        }
      }
    }
    return ok;
  }
  if (n === 2) {
    if (!state.selectedLineName) {
      alert("Please select a Vaelic line name to continue.");
      return false;
    }
    return true;
  }
  if (n === 3) {
    if (!document.getElementById("oathAccept").checked) {
      alert("You must formally accept the Civic Oath to continue.");
      return false;
    }
    return true;
  }
  if (n === 4) {
    if (!document.querySelector('input[name="tier"]:checked')) {
      alert("Please select your citizenship tier to continue.");
      return false;
    }
    if (!document.getElementById("contribution").value.trim()) {
      alert("Please describe your contribution to Vaultria.");
      return false;
    }
    return true;
  }
  if (n === 6) {
    var ok = true;
    var wn = document.getElementById("walletName");
    var wp = document.getElementById("walletPin");
    var wf = document.getElementById("f-walletname");
    var wpf = document.getElementById("f-walletpin");
    if (!wn.value.trim()) {
      wf.classList.add("error");
      ok = false;
    } else {
      wf.classList.remove("error");
      wf.classList.add("valid");
    }
    var pin = wp.value.toString();
    if (pin.length !== 6) {
      wpf.classList.add("error");
      ok = false;
    } else {
      wpf.classList.remove("error");
      wpf.classList.add("valid");
    }
    return ok;
  }
  if (n === 7) {
    if (!state.photoFile || !state.docFile) {
      alert("Please upload both a photo and an identity document to continue.");
      return false;
    }
    return true;
  }
  if (n === 8) {
    if (!state.signed && !document.getElementById("typedSig").value.trim()) {
      alert("Please sign the application — draw your signature or type your name.");
      return false;
    }
    return true;
  }
  return true;
}

function collectStep(n) {
  if (n === 1) {
    var at = document.querySelector('input[name="applicationType"]:checked');
    state.applicationType = at ? at.value : "individual";
    state.familySize = document.getElementById("familySize") ? document.getElementById("familySize").value : "";
    state.familyMembersList = document.getElementById("familyMembersList")
      ? document.getElementById("familyMembersList").value.trim()
      : "";
    state.givenName = document.getElementById("givenName").value.trim();
    state.familyName = document.getElementById("familyName").value.trim();
    state.dob = document.getElementById("dob").value;
    state.gender = document.getElementById("gender").value;
    state.originCountry = document.getElementById("originCountry").value;
    state.email = document.getElementById("email").value.trim();
    state.currentCity = document.getElementById("currentCity").value.trim();
    updateNamePreview();
    updateOathDisplay();
  }
  if (n === 3) {
    state.oathAccepted = document.getElementById("oathAccept").checked;
  }
  if (n === 4) {
    state.tier = document.querySelector('input[name="tier"]:checked').value;
    state.skills = [];
    document.querySelectorAll(".skill-chip.on").forEach(function (c) {
      var t = c.querySelector(".skill-chip-text");
      if (t) state.skills.push(t.textContent);
    });
    state.contribution = document.getElementById("contribution").value.trim();
  }
  if (n === 6) {
    state.walletName = document.getElementById("walletName").value.trim();
    state.walletPin = document.getElementById("walletPin").value;
  }
  if (n === 8) {
    state.typedSig = document.getElementById("typedSig").value.trim();
  }
}

var activeCat = "all";
var nameQuery = "";

function buildNameGrid(cat, query) {
  activeCat = cat;
  nameQuery = query;
  var grid = document.getElementById("nameGrid");
  grid.innerHTML = "";
  var filtered = NAMES.filter(function (n) {
    var catOk = cat === "all" || n.cat === cat;
    var q = query.toLowerCase().trim();
    var qOk = !q || n.n.toLowerCase().includes(q) || n.m.toLowerCase().includes(q) || n.p.toLowerCase().includes(q);
    return catOk && qOk;
  });
  filtered.forEach(function (nm) {
    var div = document.createElement("div");
    div.className = "name-option" + (state.selectedLineName && state.selectedLineName.n === nm.n ? " selected" : "");
    div.innerHTML =
      '<div class="no-name">' +
      nm.n +
      '</div><div class="no-pron">/' +
      nm.p +
      '/</div><div class="no-meaning">' +
      nm.m +
      "</div>";
    div.addEventListener("click", function () {
      selectLineName(nm);
    });
    grid.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var ns = document.getElementById("nameSearch");
  if (ns)
    ns.addEventListener("input", function () {
      buildNameGrid(activeCat, this.value);
    });
  document.querySelectorAll(".nc-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".nc-btn").forEach(function (b) {
        b.classList.remove("on");
      });
      this.classList.add("on");
      buildNameGrid(this.dataset.cat, document.getElementById("nameSearch").value);
    });
  });
});

function selectLineName(nm) {
  state.selectedLineName = nm;
  buildNameGrid(activeCat, nameQuery);
  var disp = document.getElementById("selectedNameDisplay");
  disp.style.display = "block";
  document.getElementById("sndName").textContent = nm.n + " / " + nm.p + " /";
  document.getElementById("sndMeaning").textContent = nm.m;
  updateNamePreview();
}

function updateNamePreview() {
  var gn = document.getElementById("givenName") ? document.getElementById("givenName").value.trim() : state.givenName;
  var ln = state.selectedLineName ? state.selectedLineName.n : "[Line Name]";
  var gDisplay = gn || "[Given Name]";
  document.getElementById("namePreview").textContent = gDisplay + " · " + ln;
}

function updateOathDisplay() {
  var gn = state.givenName || (document.getElementById("givenName") ? document.getElementById("givenName").value.trim() : "");
  var ln = state.selectedLineName ? state.selectedLineName.n : "";
  var name = gn ? gn + (ln ? " · " + ln : "") : "Applicant";
  var el = document.getElementById("oathDisplay");
  if (el) {
    el.innerHTML =
      '<span style="color:rgba(201,168,76,0.6);font-size:.85rem;font-style:normal">' +
      name +
      '</span><br>"Sena lo Vaultria. Vaultria lo sena.<br>Kiratvel navol.<br>Lo Charter vel —<br>lo morat vel, lo kirat vel, lo birek vel."';
  }
}

function buildSkillsGrid() {
  var g = document.getElementById("skillsGrid");
  SKILLS.forEach(function (s) {
    var chip = document.createElement("label");
    chip.className = "skill-chip";
    var id = "skill-" + s.replace(/\s/g, "-").replace(/\//g, "");
    chip.innerHTML =
      '<input type="checkbox" id="' +
      id +
      '" onchange="toggleSkill(this)"><span class="skill-chip-text">' +
      s +
      "</span>";
    chip.addEventListener("click", function () {
      setTimeout(function () {
        chip.classList.toggle("on", chip.querySelector("input").checked);
      }, 0);
    });
    g.appendChild(chip);
  });
}

function toggleSkill(el) {
  el.closest(".skill-chip").classList.toggle("on", el.checked);
}

function selectTier(t) {
  document.querySelectorAll(".tier-option").forEach(function (o) {
    o.classList.remove("selected");
  });
  document.getElementById("tier-" + t.toLowerCase()).classList.add("selected");
  state.tier = t;
}

function toggleDetail(id, show) {
  var el = document.getElementById(id);
  el.classList.toggle("show", show);
}

function handleFile(type, input) {
  var file = input.files[0];
  if (!file) return;
  if (type === "photo") {
    state.photoFile = file.name;
    document.getElementById("photoZone").classList.add("has-file");
    document.getElementById("photoZone").querySelector(".uz-text").textContent = "Photo Selected";
    var prev = document.getElementById("photoPreview");
    prev.classList.add("show");
    document.getElementById("photoName").textContent = file.name;
  } else {
    state.docFile = file.name;
    document.getElementById("docZone").classList.add("has-file");
    document.getElementById("docZone").querySelector(".uz-text").textContent = "Document Selected";
    var prev = document.getElementById("docPreview");
    prev.classList.add("show");
    document.getElementById("docName").textContent = file.name;
  }
}

function removeFile(type) {
  if (type === "photo") {
    state.photoFile = null;
    document.getElementById("photoZone").classList.remove("has-file");
    document.getElementById("photoZone").querySelector(".uz-text").textContent = "Upload Photo";
    document.getElementById("photoPreview").classList.remove("show");
    document.getElementById("photoFile").value = "";
  } else {
    state.docFile = null;
    document.getElementById("docZone").classList.remove("has-file");
    document.getElementById("docZone").querySelector(".uz-text").textContent = "Upload Document";
    document.getElementById("docPreview").classList.remove("show");
    document.getElementById("docFile").value = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var wn = document.getElementById("walletName");
  if (wn)
    wn.addEventListener("input", function () {
      var v = this.value.trim().toUpperCase().replace(/[^A-Z]/g, "").substring(0, 6);
      var rand = Math.floor(Math.random() * 9000 + 1000);
      var rand2 = Math.floor(Math.random() * 9000 + 1000);
      document.getElementById("walletIdPreview").textContent = "VLT-" + (v || "——") + "-" + rand + "-" + rand2;
    });
});

function initSignatureCanvas() {
  var canvas = document.getElementById("sigCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var drawing = false;
  var lastX = 0,
    lastY = 0;

  function getPos(e) {
    var r = canvas.getBoundingClientRect();
    var scaleX = canvas.width / r.width;
    var scaleY = canvas.height / r.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - r.left) * scaleX,
        y: (e.touches[0].clientY - r.top) * scaleY,
      };
    }
    return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
  }

  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  canvas.addEventListener("mousedown", function (e) {
    drawing = true;
    var p = getPos(e);
    lastX = p.x;
    lastY = p.y;
  });
  canvas.addEventListener("mousemove", function (e) {
    if (!drawing) return;
    var p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastX = p.x;
    lastY = p.y;
    state.signed = true;
    document.getElementById("sigStatus").textContent = "Signed";
    document.getElementById("sigStatus").classList.add("signed");
  });
  canvas.addEventListener("mouseup", function () {
    drawing = false;
  });
  canvas.addEventListener("mouseleave", function () {
    drawing = false;
  });
  canvas.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      drawing = true;
      var p = getPos(e);
      lastX = p.x;
      lastY = p.y;
    },
    { passive: false }
  );
  canvas.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
      if (!drawing) return;
      var p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      lastX = p.x;
      lastY = p.y;
      state.signed = true;
      document.getElementById("sigStatus").textContent = "Signed";
      document.getElementById("sigStatus").classList.add("signed");
    },
    { passive: false }
  );
  canvas.addEventListener(
    "touchend",
    function () {
      drawing = false;
    },
    { passive: false }
  );
}

function clearSig() {
  var canvas = document.getElementById("sigCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  state.signed = false;
  document.getElementById("sigStatus").textContent = "Not signed";
  document.getElementById("sigStatus").classList.remove("signed");
}

function updateTypedSig() {
  state.typedSig = document.getElementById("typedSig").value.trim();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildAppSummary() {
  collectStep(1);
  collectStep(4);
  collectStep(6);
  var ln = state.selectedLineName ? state.selectedLineName.n : "—";
  var appLabel =
    state.applicationType === "family"
      ? "Family unit (" + (state.familySize || "?") + " people)"
      : "Individual";
  var rows = [
    ["Application", appLabel],
    ["Full Name", (state.givenName || "—") + " · " + ln],
    ["Date of Birth", state.dob || "—"],
    ["Country of Origin", state.originCountry || "—"],
    ["Email", state.email || "—"],
    ["Line Name", ln + (state.selectedLineName ? " (" + state.selectedLineName.m + ")" : "")],
    ["Civic Oath", state.oathAccepted || document.getElementById("oathAccept").checked ? "Accepted" : "Not yet accepted"],
    ["Initial Tier", state.tier || "T1"],
    [
      "Skills Declared",
      state.skills.length > 0 ? state.skills.slice(0, 3).join(", ") + (state.skills.length > 3 ? "…" : "") : "None selected",
    ],
  ];
  if (state.applicationType === "family" && state.familyMembersList) {
    var shortList =
      state.familyMembersList.length > 140
        ? state.familyMembersList.substring(0, 140) + "…"
        : state.familyMembersList;
    rows.splice(2, 0, ["Co-applicants", shortList.replace(/\n/g, " · ")]);
  }
  var html = "";
  rows.forEach(function (r) {
    html +=
      '<div style="display:flex;justify-content:space-between;align-items:baseline;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04)">' +
      '<span style="font-family:\'Share Tech Mono\',monospace;font-size:.46rem;letter-spacing:.16em;color:var(--text3);text-transform:uppercase">' +
      escapeHtml(r[0]) +
      '</span><span style="font-family:\'Crimson Pro\',serif;font-size:.88rem;color:var(--text);text-align:right;max-width:60%">' +
      escapeHtml(r[1]) +
      "</span></div>";
  });
  document.getElementById("appSummary").innerHTML = html;
}

function submitApplication() {
  if (!validateStep(8)) return;
  collectStep(1);
  collectStep(4);
  collectStep(6);
  collectStep(8);

  var chars = "ABCDEFGHJKLMNPQRSTVWXYZ";
  var ref = "VLT-";
  for (var i = 0; i < 4; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  ref += "-";
  for (i = 0; i < 6; i++) ref += Math.floor(Math.random() * 10);
  ref += "-2026";

  document.getElementById("formContainer").style.display = "none";
  var pw = document.querySelector(".progress-wrap");
  if (pw) pw.style.display = "none";
  var hero = document.querySelector(".hero");
  if (hero) hero.style.display = "none";

  var conf = document.getElementById("confirmScreen");
  conf.classList.add("show");
  document.getElementById("refNum").textContent = ref;

  var ln = state.selectedLineName ? state.selectedLineName.n : "—";
  var summary = [
    [
      "Application type",
      state.applicationType === "family"
        ? "Family unit — " + (state.familySize || "—") + " people (primary + co-applicants)"
        : "Individual",
    ],
    ["Full Vaultrian Name", (state.givenName || "Applicant") + " · " + ln],
    ["Date of Birth", state.dob || "—"],
    ["Country of Origin", state.originCountry || "—"],
    ["Vaelic Line Name", ln + (state.selectedLineName ? " — " + state.selectedLineName.m : "")],
    [
      "Initial Citizenship Tier",
      state.tier === "T1" ? "T1 · Initiate Citizen" : state.tier === "T2" ? "T2 · Trusted Citizen" : "T3 · Elite Citizen",
    ],
    ["VYR Wallet", "Pending activation on approval"],
    ["Civic Oath", "Formally accepted"],
    ["Reference", ref],
  ];
  if (state.applicationType === "family" && state.familyMembersList) {
    summary.splice(2, 0, [
      "Co-applicants (primary's declaration)",
      state.familyMembersList.length > 200
        ? state.familyMembersList.substring(0, 200) + "…"
        : state.familyMembersList,
    ]);
  }
  var html = "";
  summary.forEach(function (r) {
    var val = r[1];
    if (typeof val === "string") {
      val = escapeHtml(val).replace(/\n/g, "<br>");
    }
    html +=
      '<div class="cs-row"><span class="cs-key">' +
      escapeHtml(r[0]) +
      '</span><span class="cs-val">' +
      val +
      "</span></div>";
  });
  document.getElementById("confSummary").innerHTML = html;

  var cns = document.querySelector(".conf-next-steps");
  if (cns) {
    var extra = cns.querySelector(".cns-item--family");
    if (extra) extra.remove();
    if (state.applicationType === "family") {
      var div = document.createElement("div");
      div.className = "cns-item cns-item--family";
      div.innerHTML =
        '<span class="cns-num">4</span> Named co-applicants will receive supplemental intake instructions from the Language Authority; processing may run in parallel per person.';
      cns.appendChild(div);
      cns.querySelectorAll(".cns-item:not(.cns-item--family) .cns-num").forEach(function (el, i) {
        el.textContent = String(i + 1);
      });
    }
  }

  document.getElementById("confOath").innerHTML =
    '<span style="color:rgba(201,168,76,0.5);font-size:.8rem;font-style:normal">' +
    (state.givenName || "Applicant") +
    (state.selectedLineName ? " · " + state.selectedLineName.n : "") +
    '</span><br><br>"Sena lo Vaultria. Vaultria lo sena.<br>Kiratvel navol.<br>Lo Charter vel — lo morat vel, lo kirat vel, lo birek vel."';

  window.scrollTo({ top: 0, behavior: "smooth" });
}
