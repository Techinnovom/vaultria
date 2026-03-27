(function () {
  "use strict";

  var Z = {
    velora: {
      n: "Velora",
      cat: "Core Power",
      col: "#C03A3A",
      fill: "rgba(192,58,58,",
      poly: [
        [120, 75],
        [390, 68],
        [405, 180],
        [390, 300],
        [260, 325],
        [170, 305],
        [115, 215],
      ],
      cap: "Aurex",
      desc: "Capital Authority Zone. Seat of Vaultrian government, AI operations, and elite administration.",
      nodes: [
        { id: "aurex", n: "Aurex", x: 255, y: 195, cap: true, secs: ["Aurelin — Government Core", "Kaedron — AI Core", "Velisar — Elite Residential", "Torvex — Administration", "Nerion — Security Command"] },
        { id: "kaelis", n: "Kaelis", x: 165, y: 135, cap: false, secs: ["Karex — Civic Ops", "Velin — Residential", "Torin — Services"] },
        { id: "vortan", n: "Vortan", x: 340, y: 148, cap: false, secs: ["Varex — Control Systems", "Tarnel — Operations", "Norex — Monitoring"] },
        { id: "delos", n: "Delos", x: 275, y: 278, cap: false, secs: ["Delar — Archives", "Velkor — Protocol", "Sorex — Records"] },
      ],
      roads: ["Aeris Vara", "Velora Varo"],
      rail: ["Prime Line", "Knowledge Line"],
      airports: [],
    },

    draven: {
      n: "Draven",
      cat: "Core Power",
      col: "#C03A3A",
      fill: "rgba(192,58,58,",
      poly: [
        [405, 55],
        [620, 55],
        [640, 185],
        [595, 305],
        [400, 305],
        [385, 185],
      ],
      cap: "Drakos",
      desc: "Defense System Zone. Military HQ, weapons, training and rapid response. The armed shield of Vaultria.",
      nodes: [
        { id: "drakos", n: "Drakos", x: 508, y: 175, cap: true, secs: ["Dravenor — Military HQ", "Karex — Training", "Torvek — Weapons", "Velkor — Rapid Response", "Narex — Drone Command"] },
        { id: "targon", n: "Targon", x: 435, y: 110, cap: false, secs: ["Tarex — Ground Units", "Velin — Barracks", "Torin — Logistics"] },
        { id: "silex", n: "Silex", x: 575, y: 118, cap: false, secs: ["Sirex — Defense Grid", "Velkar — Support", "Norex — Monitoring"] },
        { id: "karven", n: "Karven", x: 555, y: 262, cap: false, secs: ["Karnel — Armory", "Velex — Equipment", "Sorex — Supplies"] },
      ],
      roads: ["Draven Varo"],
      rail: ["Defense Link"],
      airports: [],
    },

    morvex: {
      n: "Morvex",
      cat: "Core Power",
      col: "#C03A3A",
      fill: "rgba(192,58,58,",
      poly: [
        [95, 305],
        [280, 308],
        [300, 465],
        [215, 508],
        [95, 462],
      ],
      cap: "Morak",
      desc: "Restricted Authority Zone. Containment, surveillance, classified ops. Tier-clearance access only.",
      nodes: [
        { id: "morak", n: "Morak", x: 192, y: 398, cap: true, secs: ["Morven — Containment", "Zirex — Surveillance", "Karnel — Processing", "Velmox — Restricted Housing"] },
        { id: "xyron", n: "Xyron", x: 142, y: 345, cap: false, secs: ["Xirel — Isolation", "Torvex — Control"] },
        { id: "vexor", n: "Vexor", x: 248, y: 445, cap: false, secs: ["Vexel — Monitoring", "Norex — Data Watch"] },
        { id: "norex", n: "Norex", x: 205, y: 478, cap: false, secs: ["Norlin — Border Watch", "Velex — Patrol"] },
      ],
      roads: ["Morvex Varo"],
      rail: ["Restricted Line"],
      airports: ["Restricted Airstrip"],
    },

    nerath: {
      n: "Nerath",
      cat: "Civilian",
      col: "#2E6AB8",
      fill: "rgba(46,106,184,",
      poly: [
        [600, 185],
        [855, 178],
        [868, 395],
        [795, 460],
        [610, 448],
        [568, 358],
      ],
      cap: "Zerath",
      desc: "Population Core Zone. Most densely inhabited zone — housing, markets, schools and healthcare.",
      nodes: [
        { id: "zerath", n: "Zerath", x: 718, y: 308, cap: true, secs: ["Velin — Residential", "Mekar — Markets", "Tarin — Education", "Siven — Health"] },
        { id: "tarex", n: "Tarex", x: 645, y: 255, cap: false, secs: ["Velin — Housing", "Tarin — Schools", "Mekar — Markets", "Siven — Clinics"] },
        { id: "virel", n: "Virel", x: 800, y: 245, cap: false, secs: ["Velin — Residential", "Torin — Transit", "Mekar — Trade"] },
        { id: "korex", n: "Korex", x: 780, y: 412, cap: false, secs: ["Velin — Dense Housing", "Mekar — Street Markets", "Siven — Emergency"] },
        { id: "lunex", n: "Lunex", x: 635, y: 400, cap: false, secs: ["Lunin — Parks", "Velar — Leisure", "Sorex — Community"] },
      ],
      roads: ["Nerath Varo", "Civic Routes"],
      rail: ["Civic Line"],
      airports: ["Kelos Aeris"],
    },

    varex: {
      n: "Varex",
      cat: "Civilian",
      col: "#2E6AB8",
      fill: "rgba(46,106,184,",
      poly: [
        [858, 148],
        [1040, 142],
        [1055, 328],
        [935, 365],
        [858, 325],
      ],
      cap: "Varon",
      desc: "Resources & Production Zone. Agriculture, energy generation and industrial processing.",
      nodes: [
        { id: "varon", n: "Varon", x: 945, y: 242, cap: true, secs: ["Mekor — Agriculture", "Torex — Energy", "Varin — Processing", "Kalen — Storage"] },
        { id: "mekar_v", n: "Mekar", x: 885, y: 195, cap: false, secs: ["Meklin — Farming", "Velin — Workers"] },
        { id: "tovin", n: "Tovin", x: 1005, y: 205, cap: false, secs: ["Torin — Energy Plants", "Norex — Monitoring"] },
        { id: "garin", n: "Garin", x: 985, y: 318, cap: false, secs: ["Garel — Processing", "Velin — Industrial"] },
      ],
      roads: ["Varex Varo"],
      rail: ["Industrial Line"],
      airports: ["Talex Aeris"],
    },

    zerath_z: {
      n: "Zerath",
      cat: "Civilian",
      col: "#2E6AB8",
      fill: "rgba(46,106,184,",
      poly: [
        [568, 445],
        [795, 462],
        [810, 568],
        [698, 630],
        [555, 590],
      ],
      cap: "Zerex",
      desc: "Trade & Finance Zone. Markets, exchange centres, and the financial backbone of Vaultria.",
      nodes: [
        { id: "zerex", n: "Zerex", x: 682, y: 538, cap: true, secs: ["Karven — Markets", "Velix — Finance", "Torin — Trade", "Sorex — Exchange"] },
        { id: "karos", n: "Karos", x: 625, y: 495, cap: false, secs: ["Karlin — Retail", "Velin — Commerce"] },
        { id: "drax", n: "Drax", x: 758, y: 518, cap: false, secs: ["Draxel — Exchange", "Norex — Oversight"] },
        { id: "velin_z", n: "Velin", x: 712, y: 602, cap: false, secs: ["Velar — Trade Hub", "Sorex — Logistics"] },
      ],
      roads: ["Trade Varo"],
      rail: ["Trade Link"],
      airports: [],
    },

    lunara: {
      n: "Lunara",
      cat: "Civilian",
      col: "#2E6AB8",
      fill: "rgba(46,106,184,",
      poly: [
        [335, 465],
        [565, 448],
        [572, 592],
        [492, 648],
        [335, 628],
      ],
      cap: "Lunor",
      desc: "Residential Expansion Zone. Community-focused with green corridors and local commerce.",
      nodes: [
        { id: "lunor", n: "Lunor", x: 458, y: 548, cap: true, secs: ["Selinor — Housing", "Marex — Community", "Velinor — Services", "Taren — Schools"] },
        { id: "selin", n: "Selin", x: 395, y: 508, cap: false, secs: ["Selar — Housing", "Taren — Schools"] },
        { id: "marel", n: "Marel", x: 535, y: 518, cap: false, secs: ["Marex — Community", "Lomex — Local Trade"] },
        { id: "tiven", n: "Tiven", x: 488, y: 618, cap: false, secs: ["Tivel — Parks", "Velin — Expansion"] },
      ],
      roads: ["Lunara Varo"],
      rail: ["Civic Extension"],
      airports: [],
    },

    aeris: {
      n: "Aeris",
      cat: "Infrastructure",
      col: "#B87C18",
      fill: "rgba(184,124,24,",
      poly: [
        [608, 55],
        [858, 52],
        [858, 178],
        [812, 198],
        [608, 188],
      ],
      cap: "Aeris Nod",
      desc: "Airspace Control Zone. Primary international gateway and domestic flight management.",
      nodes: [
        { id: "aeris_n", n: "Aeris Nod", x: 725, y: 118, cap: true, secs: ["Aeron — Flight Control", "Velair — Terminals", "Torair — Cargo", "Nexor — Security"] },
        { id: "kelos_n", n: "Kelos", x: 652, y: 92, cap: false, secs: ["Kelair — Regional Flights", "Velin — Staff Housing"] },
        { id: "talex_n", n: "Talex", x: 800, y: 98, cap: false, secs: ["Talex — Cargo Ops", "Velin — Ground Crew"] },
      ],
      roads: ["Aeris Vara"],
      rail: ["Prime Line"],
      airports: ["Aeris Nod (International)", "Kelos Aeris (Domestic)"],
    },

    tarinex: {
      n: "Tarinex",
      cat: "Infrastructure",
      col: "#B87C18",
      fill: "rgba(184,124,24,",
      poly: [
        [285, 322],
        [568, 308],
        [582, 448],
        [445, 468],
        [302, 445],
      ],
      cap: "Tarinor",
      desc: "Ground Transport Zone. Highways, metro systems and bus networks connecting all zones.",
      nodes: [
        { id: "tarinor", n: "Tarinor", x: 428, y: 385, cap: true, secs: ["Varinex — Highways", "Kelvar — Metro", "Torlin — Bus Systems", "Narex — Traffic Control"] },
        { id: "vekar", n: "Vekar", x: 345, y: 352, cap: false, secs: ["Veklin — Routes", "Norex — Traffic Control"] },
        { id: "liron", n: "Liron", x: 528, y: 365, cap: false, secs: ["Lirel — Junction", "Velin — Depot"] },
        { id: "danex", n: "Danex", x: 478, y: 438, cap: false, secs: ["Danel — Maintenance", "Torex — Operations"] },
      ],
      roads: ["Tarinex Vara", "All-Zone Hub"],
      rail: ["Transit Hub — All Lines"],
      airports: [],
    },

    virex: {
      n: "Virex",
      cat: "Infrastructure",
      col: "#B87C18",
      fill: "rgba(184,124,24,",
      poly: [
        [845, 362],
        [1048, 332],
        [1065, 488],
        [935, 508],
        [845, 465],
      ],
      cap: "Viron",
      desc: "Logistics & Distribution Zone. Warehousing, freight distribution and cargo movement.",
      nodes: [
        { id: "viron", n: "Viron", x: 942, y: 412, cap: true, secs: ["Kalex — Warehousing", "Morinex — Distribution", "Serin — Sorting", "Velkar — Freight"] },
        { id: "kalen_v", n: "Kalen", x: 878, y: 372, cap: false, secs: ["Kalor — Storage", "Torin — Dispatch"] },
        { id: "morin", n: "Morin", x: 1000, y: 378, cap: false, secs: ["Morel — Processing", "Velkar — Support"] },
        { id: "serex", n: "Serex", x: 978, y: 468, cap: false, secs: ["Serel — Sorting Hub", "Norex — Tracking"] },
      ],
      roads: ["Virex Varo"],
      rail: ["Industrial Link"],
      airports: ["Cargo Ports"],
    },

    lumen: {
      n: "Lumen",
      cat: "Knowledge",
      col: "#2A7848",
      fill: "rgba(42,120,72,",
      poly: [
        [95, 462],
        [335, 465],
        [352, 608],
        [278, 668],
        [95, 645],
      ],
      cap: "Lumor",
      desc: "Education Zone. Universities, research labs and knowledge institutions. Where citizens are formed.",
      nodes: [
        { id: "lumor", n: "Lumor", x: 225, y: 568, cap: true, secs: ["Tarinel — Universities", "Velumex — Labs", "Sorin — Research", "Karex — Libraries"] },
        { id: "taris", n: "Taris", x: 162, y: 522, cap: false, secs: ["Tarin — Schools", "Velin — Student Housing"] },
        { id: "velum", n: "Velum", x: 302, y: 528, cap: false, secs: ["Velumar — Advanced Labs", "Sorex — Institutes"] },
        { id: "kirel", n: "Kirel", x: 278, y: 632, cap: false, secs: ["Kirel — Archives", "Velin — Faculty"] },
      ],
      roads: ["Lumen Varo"],
      rail: ["Knowledge Line"],
      airports: [],
    },

    sivara: {
      n: "Sivara",
      cat: "Knowledge",
      col: "#2A7848",
      fill: "rgba(42,120,72,",
      poly: [
        [845, 468],
        [1060, 488],
        [1075, 668],
        [932, 688],
        [845, 625],
      ],
      cap: "Sivor",
      desc: "Technology Zone. Data infrastructure, AI systems and development hubs. The tech nerve centre.",
      nodes: [
        { id: "sivor", n: "Sivor", x: 948, y: 578, cap: true, secs: ["Nexor — Data Core", "Valex — AI Systems", "Torinex — Development", "Sorex — R&D"] },
        { id: "nexis", n: "Nexis", x: 882, y: 528, cap: false, secs: ["Nexel — Data Ops", "Velin — Engineers"] },
        { id: "valen", n: "Valen", x: 1002, y: 538, cap: false, secs: ["Valekar — AI Labs", "Norex — Systems"] },
        { id: "torix", n: "Torix", x: 982, y: 638, cap: false, secs: ["Torinel — Dev Hub", "Velin — Tech Staff"] },
      ],
      roads: ["Sivara Varo"],
      rail: ["Tech Line", "Knowledge Line"],
      airports: ["Riven Aeris (Restricted)"],
    },
  };

  var ROADS = [
    { n: "Aeris Vara", col: "#C8A020", w: 2.8, pts: [725, 118, 600, 175, 508, 175, 428, 385, 718, 308], dash: false },
    { n: "Nerath Varo", col: "#4A80C8", w: 2.2, pts: [718, 308, 645, 255, 800, 245, 780, 412, 635, 400], dash: false },
    { n: "Tarinex Vara", col: "#C8A020", w: 2.5, pts: [255, 195, 428, 385, 682, 538, 942, 412], dash: false },
    { n: "Virex Varo", col: "#C8A020", w: 1.8, pts: [945, 242, 942, 412, 945, 578, 682, 538], dash: false },
    { n: "Trade Varo", col: "#4A80C8", w: 1.8, pts: [682, 538, 718, 308], dash: false },
    { n: "Lumen Varo", col: "#3A8858", w: 1.8, pts: [225, 568, 428, 385, 255, 195], dash: false },
    { n: "Sivara Varo", col: "#3A8858", w: 1.8, pts: [948, 578, 945, 242, 725, 118], dash: false },
    { n: "Lunara Varo", col: "#4A80C8", w: 1.8, pts: [458, 548, 428, 385], dash: false },
    { n: "Draven Varo", col: "#C04040", w: 1.8, pts: [508, 175, 255, 195], dash: false },
    { n: "Morvex Varo", col: "#C04040", w: 1.5, pts: [192, 398, 255, 195], dash: true },
  ];

  var RAIL = [
    { n: "Prime Line", col: "#C9A84C", w: 2.8, pts: [255, 195, 725, 118, 718, 308, 508, 175] },
    { n: "Civic Line", col: "#5A8AE8", w: 2.2, pts: [718, 308, 645, 255, 800, 245, 780, 412, 635, 400, 458, 548, 428, 385] },
    { n: "Industrial Line", col: "#C8A020", w: 2.2, pts: [945, 242, 942, 412, 948, 578, 682, 538] },
    { n: "Knowledge Line", col: "#4AAA68", w: 2, pts: [255, 195, 225, 568, 948, 578] },
    { n: "Tech Line", col: "#4AAA68", w: 2, pts: [948, 578, 718, 308, 508, 175] },
    { n: "Defense Link", col: "#E05050", w: 1.8, pts: [508, 175, 255, 195], dash: true },
    { n: "Restricted Line", col: "#E05050", w: 1.5, pts: [192, 398, 255, 195], dash: true },
    { n: "Trade Link", col: "#5A8AE8", w: 1.8, pts: [682, 538, 718, 308, 945, 242] },
  ];

  var APTS = [
    { n: "Aeris Nod", sub: "International Gateway", x: 725, y: 118, major: true },
    { n: "Kelos Aeris", sub: "Domestic", x: 652, y: 92 },
    { n: "Talex Aeris", sub: "Cargo & Export", x: 885, y: 195 },
    { n: "Riven Aeris", sub: "Restricted Tech", x: 882, y: 528 },
    { n: "Restricted", sub: "Classified — Morvex", x: 192, y: 398, restricted: true },
  ];

  var canvas = document.getElementById("tm-canvas");
  if (!canvas || !canvas.getContext) {
    return;
  }
  var ctx = canvas.getContext("2d");
  var W = 0;
  var H = 0;
  var cam = { x: 0, y: 0, z: 1 };
  var BASE_W = 1100;
  var BASE_H = 750;
  var L = { zones: true, roads: true, rail: true, nodes: true, airports: true, labels: true };
  var selected = null;
  var hoverId = null;
  var tick = 0;
  var animId;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    if (W < 1 || H < 1) {
      return;
    }
    var dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    fitMap();
  }

  function fitMap() {
    var sx = W / BASE_W;
    var sy = H / BASE_H;
    cam.z = Math.min(sx, sy) * 0.92;
    cam.x = (W - BASE_W * cam.z) / 2;
    cam.y = (H - BASE_H * cam.z) / 2;
  }

  function wx(x) {
    return cam.x + x * cam.z;
  }
  function wy(y) {
    return cam.y + y * cam.z;
  }
  function wxy(x, y) {
    return [wx(x), wy(y)];
  }
  function mapX(px) {
    return (px - cam.x) / cam.z;
  }
  function mapY(py) {
    return (py - cam.y) / cam.z;
  }

  function draw() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    var bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    bg.addColorStop(0, "#0C0F1E");
    bg.addColorStop(1, "#07080F");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(80,100,160,0.04)";
    ctx.lineWidth = 1;
    var gs = 40 * cam.z;
    var ox = cam.x % gs;
    var oy = cam.y % gs;
    var gx;
    var gy;
    for (gx = ox; gx < W; gx += gs) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (gy = oy; gy < H; gy += gs) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }

    if (L.zones) drawZones();
    if (L.roads) drawRoads();
    if (L.rail) drawRail();
    if (L.airports) drawAirports();
    if (L.nodes) drawNodes();
    if (L.labels) drawLabels();

    animId = requestAnimationFrame(draw);
  }

  function drawZones() {
    Object.keys(Z).forEach(function (zid) {
      var z = Z[zid];
      var isSelected = selected && selected.zid === zid;
      var isHover = hoverId === zid;

      ctx.beginPath();
      z.poly.forEach(function (p, i) {
        var xy = wxy(p[0], p[1]);
        if (i === 0) {
          ctx.moveTo(xy[0], xy[1]);
        } else {
          ctx.lineTo(xy[0], xy[1]);
        }
      });
      ctx.closePath();

      var alpha = isSelected ? 0.18 : isHover ? 0.14 : 0.08;
      ctx.fillStyle = z.fill + alpha + ")";
      ctx.fill();

      ctx.strokeStyle = z.col;
      ctx.lineWidth = isSelected ? 2 : isHover ? 1.8 : 1.2;
      ctx.globalAlpha = isSelected ? 0.9 : isHover ? 0.7 : 0.4;
      ctx.setLineDash([]);
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (isSelected) {
        ctx.shadowColor = z.col;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = z.col;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.35;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    });
  }

  function drawRoads() {
    ROADS.forEach(function (r) {
      if (r.pts.length < 4) {
        return;
      }
      ctx.beginPath();
      for (var i = 0; i < r.pts.length; i += 2) {
        var xy = wxy(r.pts[i], r.pts[i + 1]);
        if (i === 0) {
          ctx.moveTo(xy[0], xy[1]);
        } else {
          ctx.lineTo(xy[0], xy[1]);
        }
      }
      ctx.strokeStyle = r.col;
      ctx.lineWidth = r.w * cam.z * 0.55;
      ctx.globalAlpha = 0.3;
      if (r.dash) {
        ctx.setLineDash([6 * cam.z, 4 * cam.z]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    });
  }

  function drawRail() {
    RAIL.forEach(function (r) {
      if (r.pts.length < 4) {
        return;
      }
      ctx.beginPath();
      for (var i = 0; i < r.pts.length; i += 2) {
        var xy = wxy(r.pts[i], r.pts[i + 1]);
        if (i === 0) {
          ctx.moveTo(xy[0], xy[1]);
        } else {
          ctx.lineTo(xy[0], xy[1]);
        }
      }
      ctx.strokeStyle = r.col;
      ctx.lineWidth = (r.w + 4) * cam.z * 0.5;
      ctx.globalAlpha = 0.04;
      ctx.setLineDash([]);
      ctx.shadowColor = r.col;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      for (var j = 0; j < r.pts.length; j += 2) {
        var xy2 = wxy(r.pts[j], r.pts[j + 1]);
        if (j === 0) {
          ctx.moveTo(xy2[0], xy2[1]);
        } else {
          ctx.lineTo(xy2[0], xy2[1]);
        }
      }
      ctx.strokeStyle = r.col;
      ctx.lineWidth = r.w * cam.z * 0.45;
      ctx.globalAlpha = r.dash ? 0.35 : 0.65;
      var dashLen = 10 * cam.z;
      var gapLen = 6 * cam.z;
      var offset = (-(tick * 0.4 * cam.z) % (dashLen + gapLen));
      ctx.setLineDash([dashLen, gapLen]);
      ctx.lineDashOffset = offset;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      ctx.globalAlpha = 1;
    });
  }

  function drawAirports() {
    APTS.forEach(function (a) {
      var s = (a.major ? 9 : 6) * cam.z;
      var xy = wxy(a.x, a.y);
      var col = a.restricted ? "#E05050" : "#C8A020";
      ctx.save();
      ctx.translate(xy[0], xy[1]);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = col + "22";
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.strokeRect(-s / 2, -s / 2, s, s);
      ctx.restore();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = col;
      ctx.font = (a.major ? 7 : 5) * cam.z + "px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✈", xy[0], xy[1] + 0.5);
      ctx.globalAlpha = 1;
    });
  }

  function drawNodes() {
    Object.keys(Z).forEach(function (zid) {
      var z = Z[zid];
      z.nodes.forEach(function (nd) {
        var xy = wxy(nd.x, nd.y);
        var r = (nd.cap ? 8 : 5) * cam.z;
        var col = nd.cap ? "#C9A84C" : z.col;
        var isHov = hoverId === zid + "::" + nd.id;
        var isSel = selected && selected.zid === zid && selected.nid === nd.id;

        if (nd.cap) {
          var pulse = (Math.sin(tick * 0.04 + nd.x * 0.01) + 1) / 2;
          ctx.beginPath();
          ctx.arc(xy[0], xy[1], (r + 6 + pulse * 4) * 1, 0, Math.PI * 2);
          ctx.strokeStyle = "#C9A84C";
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.12 + pulse * 0.1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.arc(xy[0], xy[1], r, 0, Math.PI * 2);
        ctx.fillStyle = nd.cap ? "#1A1408" : "#0C0E18";
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth = nd.cap ? 2.2 : 1.5;
        ctx.globalAlpha = isHov || isSel ? 1 : 0.85;
        if (isSel) {
          ctx.shadowColor = col;
          ctx.shadowBlur = 12;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        if (nd.cap) {
          ctx.beginPath();
          ctx.arc(xy[0], xy[1], 3.5 * cam.z, 0, Math.PI * 2);
          ctx.fillStyle = "#C9A84C";
          ctx.globalAlpha = 0.9;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
    });
  }

  function drawLabels() {
    var minZ = 0.55;
    if (cam.z < 0.3) {
      return;
    }

    Object.keys(Z).forEach(function (zid) {
      var z = Z[zid];
      var cx = 0;
      var cy = 0;
      z.poly.forEach(function (p) {
        cx += p[0];
        cy += p[1];
      });
      cx /= z.poly.length;
      cy /= z.poly.length;
      var xy = wxy(cx, cy);

      var fs = Math.max(7, 9 * cam.z);
      ctx.font = "600 " + fs + "px Cinzel,serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = z.col;
      ctx.globalAlpha = cam.z < minZ ? 0.3 : 0.55;
      ctx.fillText(z.n.toUpperCase(), xy[0], xy[1] - 6 * cam.z);
      ctx.font = "400 " + fs * 0.6 + "px Share Tech Mono,monospace";
      ctx.globalAlpha = cam.z < minZ ? 0.15 : 0.3;
      ctx.fillText(z.cat.toUpperCase(), xy[0], xy[1] + 8 * cam.z);
      ctx.globalAlpha = 1;

      if (cam.z > 0.45) {
        z.nodes.forEach(function (nd) {
          var nxy = wxy(nd.x, nd.y);
          var nfs = Math.max(5, (nd.cap ? 7.5 : 6) * cam.z);
          ctx.font = (nd.cap ? "600 " : "400 ") + nfs + "px Share Tech Mono,monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = nd.cap ? "#C9A84C" : z.col;
          ctx.globalAlpha = nd.cap ? 0.9 : 0.6;
          ctx.fillText(nd.n, nxy[0], nxy[1] + (nd.cap ? 10 : 8) * cam.z);
          ctx.globalAlpha = 1;
        });
      }
    });

    if (cam.z > 0.7) {
      ROADS.slice(0, 4).forEach(function (r) {
        if (r.pts.length < 4) {
          return;
        }
        var mx = (r.pts[0] + r.pts[2]) / 2;
        var my = (r.pts[1] + r.pts[3]) / 2;
        var mxy = wxy(mx, my);
        var rfs = Math.max(4, 5.5 * cam.z);
        ctx.font = "400 " + rfs + "px Share Tech Mono,monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = r.col;
        ctx.globalAlpha = 0.38;
        ctx.fillText(r.n, mxy[0], mxy[1] - 7 * cam.z);
        ctx.globalAlpha = 1;
      });
    }
  }

  function pointInPoly(pts, mx, my) {
    var inside = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i][0];
      var yi = pts[i][1];
      var xj = pts[j][0];
      var yj = pts[j][1];
      if ((yi > my) !== (yj > my) && mx < ((xj - xi) * (my - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  function hitTest(px, py) {
    var mx = mapX(px);
    var my = mapY(py);
    var zids = Object.keys(Z);
    var i;
    var j;
    for (i = 0; i < zids.length; i++) {
      var z = Z[zids[i]];
      for (j = 0; j < z.nodes.length; j++) {
        var nd = z.nodes[j];
        var r = (nd.cap ? 10 : 7) / cam.z;
        if (Math.hypot(mx - nd.x, my - nd.y) < r) {
          return { type: "node", zid: zids[i], nid: nd.id };
        }
      }
    }
    for (var a = 0; a < APTS.length; a++) {
      var ap = APTS[a];
      if (Math.hypot(mx - ap.x, my - ap.y) < 12 / cam.z) {
        return { type: "airport", apt: ap };
      }
    }
    for (var z2 = 0; z2 < zids.length; z2++) {
      if (pointInPoly(Z[zids[z2]].poly, mx, my)) {
        return { type: "zone", zid: zids[z2] };
      }
    }
    return null;
  }

  function hoverTest(px, py) {
    var mx = mapX(px);
    var my = mapY(py);
    var zids = Object.keys(Z);
    var i;
    var j;
    for (i = 0; i < zids.length; i++) {
      var z = Z[zids[i]];
      for (j = 0; j < z.nodes.length; j++) {
        var nd = z.nodes[j];
        if (Math.hypot(mx - nd.x, my - nd.y) < (nd.cap ? 10 : 7) / cam.z) {
          return zids[i] + "::" + nd.id;
        }
      }
    }
    for (var a = 0; a < APTS.length; a++) {
      if (Math.hypot(mx - APTS[a].x, my - APTS[a].y) < 12 / cam.z) {
        return "apt::" + APTS[a].n;
      }
    }
    for (var z2 = 0; z2 < zids.length; z2++) {
      if (pointInPoly(Z[zids[z2]].poly, mx, my)) {
        return zids[z2];
      }
    }
    return null;
  }

  function showZone(zid) {
    var z = Z[zid];
    if (!z) {
      return;
    }
    selected = { zid: zid, nid: null };
    document.getElementById("tm-ph-pre").textContent = z.cat + " Zone";
    document.getElementById("tm-ph-name").textContent = z.n;
    document.getElementById("tm-ph-type").textContent = z.nodes.length + " Nodes · Capital: " + z.cap;
    document.getElementById("tm-ph-desc").textContent = z.desc;
    var pb = document.getElementById("tm-pb");
    pb.innerHTML = "";
    sect(pb, "Nodes");
    z.nodes.forEach(function (nd) {
      var d = div("tm-ni" + (nd.cap ? " cap" : ""));
      d.innerHTML =
        '<div class="tm-ni-dot" style="background:' +
        (nd.cap ? "#C9A84C" : z.col) +
        '"></div>' +
        '<div class="tm-ni-name">' +
        nd.n +
        "</div>" +
        (nd.cap ? '<div class="tm-ni-cap">Capital</div>' : '<div class="tm-ni-n">' + nd.secs.length + "</div>");
      d.addEventListener("click", function () {
        showNode(zid, nd.id);
      });
      pb.appendChild(d);
    });
    sect(pb, "Roads (Varo)");
    tags(pb, z.roads, z.col + "50", z.col);
    sect(pb, "FlowNet Rail");
    tags(pb, z.rail, "rgba(201,168,76,.18)", "#C9A84C");
    if (z.airports.length) {
      sect(pb, "Airports");
      tags(pb, z.airports, "rgba(184,124,24,.18)", "#C8A020");
    }
  }

  function showNode(zid, nid) {
    var z = Z[zid];
    if (!z) {
      return;
    }
    var nd = z.nodes.find(function (n) {
      return n.id === nid;
    });
    if (!nd) {
      return;
    }
    selected = { zid: zid, nid: nid };
    document.getElementById("tm-ph-pre").textContent = z.n + " · " + (nd.cap ? "Capital Node" : "Node");
    document.getElementById("tm-ph-name").textContent = nd.n;
    document.getElementById("tm-ph-type").textContent = nd.secs.length + " Sectors · " + z.cat;
    document.getElementById("tm-ph-desc").textContent = nd.cap
      ? nd.n + " is the capital node of the " + z.n + " zone — all zone authority flows through here."
      : "Secondary node within the " + z.n + " zone.";
    var pb = document.getElementById("tm-pb");
    pb.innerHTML = "";
    sect(pb, "Sectors");
    nd.secs.forEach(function (s) {
      var parts = s.split(" — ");
      var d = div("tm-si");
      d.style.borderColor = z.col + "55";
      d.innerHTML = '<div class="tm-si-n">' + parts[0] + "</div>" + (parts[1] ? '<div class="tm-si-r">' + parts[1] + "</div>" : "");
      pb.appendChild(d);
    });
    sect(pb, "Zone: " + z.n);
    var back = div("tm-ni");
    back.innerHTML = '<div class="tm-ni-dot" style="background:' + z.col + '"></div><div class="tm-ni-name" style="color:var(--tm-text2)">View full zone →</div>';
    back.addEventListener("click", function () {
      showZone(zid);
    });
    pb.appendChild(back);
  }

  function sect(parent, txt) {
    var d = document.createElement("div");
    d.className = "tm-ps";
    d.textContent = txt;
    parent.appendChild(d);
  }

  function div(cls) {
    var d = document.createElement("div");
    d.className = cls;
    return d;
  }

  function tags(parent, arr, bc, tc) {
    var row = document.createElement("div");
    row.className = "tm-itags";
    arr.forEach(function (t) {
      var s = document.createElement("span");
      s.className = "tm-itag";
      s.style.cssText = "border-color:" + bc + ";color:" + tc;
      s.textContent = t;
      row.appendChild(s);
    });
    parent.appendChild(row);
  }

  var drag = { on: false, sx: 0, sy: 0, moved: false };
  var tip = document.getElementById("tm-tip");

  function showTip(e, n, t) {
    document.getElementById("tm-tip-n").textContent = n;
    document.getElementById("tm-tip-t").textContent = t;
    tip.classList.add("show");
  }

  canvas.addEventListener("mousedown", function (e) {
    drag.on = true;
    drag.sx = e.clientX;
    drag.sy = e.clientY;
    drag.moved = false;
  });

  window.addEventListener("mousemove", function (e) {
    if (drag.on) {
      var dx = e.clientX - drag.sx;
      var dy = e.clientY - drag.sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        drag.moved = true;
      }
      cam.x += dx;
      cam.y += dy;
      drag.sx = e.clientX;
      drag.sy = e.clientY;
    }
    var r = canvas.getBoundingClientRect();
    var px = e.clientX - r.left;
    var py = e.clientY - r.top;
    var h = hoverTest(px, py);
    hoverId = h || null;
    canvas.style.cursor = h ? "pointer" : "grab";

    if (h) {
      var parts = h.split("::");
      var tipShown = false;
      if (parts.length === 2 && parts[0] !== "apt") {
        var z = Z[parts[0]];
        var nd = z && z.nodes.find(function (n) {
          return n.id === parts[1];
        });
        if (z && nd) {
          showTip(e, (nd.cap ? "★ " : "") + nd.n, (nd.cap ? "Capital Node · " : "") + z.n);
          tipShown = true;
        }
      } else if (parts[0] === "apt") {
        var apt = APTS.find(function (a) {
          return a.n === parts[1];
        });
        if (apt) {
          showTip(e, apt.n, "✈ " + apt.sub);
          tipShown = true;
        }
      } else {
        var zz = Z[h];
        if (zz) {
          showTip(e, zz.n, zz.cat + " Zone · " + zz.nodes.length + " nodes");
          tipShown = true;
        }
      }
      if (tipShown) {
        tip.style.left = e.clientX + 14 + "px";
        tip.style.top = e.clientY - 12 + "px";
      } else {
        tip.classList.remove("show");
      }
    } else {
      tip.classList.remove("show");
    }

    var r2 = canvas.getBoundingClientRect();
    document.getElementById("tm-coords").textContent =
      "VLN · " +
      Math.round(mapX(e.clientX - r2.left))
        .toString()
        .padStart(4, "0") +
      " · " +
      Math.round(mapY(e.clientY - r2.top))
        .toString()
        .padStart(4, "0");
  });

  window.addEventListener("mouseup", function (e) {
    if (drag.on && !drag.moved) {
      var r = canvas.getBoundingClientRect();
      var px = e.clientX - r.left;
      var py = e.clientY - r.top;
      var h = hitTest(px, py);
      if (h) {
        if (h.type === "zone") {
          showZone(h.zid);
        } else if (h.type === "node") {
          showNode(h.zid, h.nid);
        }
      }
    }
    drag.on = false;
  });

  canvas.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
      var r = canvas.getBoundingClientRect();
      var px = e.clientX - r.left;
      var py = e.clientY - r.top;
      var f = e.deltaY < 0 ? 1.12 : 0.9;
      var wx0 = mapX(px);
      var wy0 = mapY(py);
      cam.z *= f;
      cam.z = Math.min(4, Math.max(0.3, cam.z));
      cam.x = px - wx0 * cam.z;
      cam.y = py - wy0 * cam.z;
    },
    { passive: false }
  );

  var tc = { on: false, sx: 0, sy: 0, moved: false, pd: 0 };
  canvas.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length === 1) {
        tc.on = true;
        tc.sx = e.touches[0].clientX;
        tc.sy = e.touches[0].clientY;
        tc.moved = false;
      }
      if (e.touches.length === 2) {
        tc.pd = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      }
    },
    { passive: true }
  );

  canvas.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches.length === 1 && tc.on) {
        var dx = e.touches[0].clientX - tc.sx;
        var dy = e.touches[0].clientY - tc.sy;
        if (Math.abs(dx) + Math.abs(dy) > 3) {
          tc.moved = true;
        }
        cam.x += dx;
        cam.y += dy;
        tc.sx = e.touches[0].clientX;
        tc.sy = e.touches[0].clientY;
      }
      if (e.touches.length === 2) {
        var nd = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (tc.pd) {
          cam.z *= nd / tc.pd;
          cam.z = Math.min(4, Math.max(0.3, cam.z));
        }
        tc.pd = nd;
      }
    },
    { passive: true }
  );

  canvas.addEventListener(
    "touchend",
    function () {
      tc.on = false;
    },
    { passive: true }
  );

  document.querySelectorAll(".tm-lbtn").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = b.dataset.l;
      L[l] = !L[l];
      b.classList.toggle("on", L[l]);
    });
  });

  document.getElementById("tm-z-in").addEventListener("click", function () {
    cam.z = Math.min(4, cam.z * 1.25);
  });
  document.getElementById("tm-z-out").addEventListener("click", function () {
    cam.z = Math.max(0.3, cam.z * 0.8);
  });
  document.getElementById("tm-z-reset").addEventListener("click", fitMap);

  var panelEl = document.getElementById("tm-panel");
  var panelToggle = document.getElementById("tm-panel-toggle");
  if (panelToggle && panelEl) {
    panelToggle.addEventListener("click", function () {
      var open = panelEl.classList.toggle("open");
      panelToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();
