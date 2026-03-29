(function () {
  "use strict";

  var Z = {};
  var ROADS = [];
  var RAIL = [];
  var APTS = [];
  var NATIONAL_BOUNDARY = null;
  var BASE_W = 1600;
  var BASE_H = 1000;

  var CAT_LABELS = {
    corePower: "Core Power",
    restricted: "Restricted",
    civilian: "Civilian",
    infrastructure: "Infrastructure",
    knowledge: "Knowledge",
  };

  function hexToRgbPrefix(hex) {
    if (!hex || hex[0] !== "#") {
      return "rgba(128,128,128,";
    }
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + ",";
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

  function airportTypeLabel(t) {
    if (t === "majorInternational") {
      return "Major international";
    }
    if (t === "domestic") {
      return "Domestic";
    }
    if (t === "cargoExport") {
      return "Cargo export";
    }
    if (t === "restricted") {
      return "Restricted";
    }
    return t ? String(t).replace(/([A-Z])/g, " $1").replace(/^\s+/, "").trim() : "";
  }

  function assignInfrastructureToZones(data) {
    Object.keys(Z).forEach(function (zid) {
      Z[zid].roads = [];
      Z[zid].rail = [];
      Z[zid].airports = [];
    });
    (data.rail || []).forEach(function (r) {
      Object.keys(Z).forEach(function (zid) {
        var poly = Z[zid].poly;
        var hit = false;
        (r.waypoints || []).forEach(function (w) {
          if (pointInPoly(poly, w[0], w[1])) {
            hit = true;
          }
        });
        if (hit) {
          Z[zid].rail.push({
            n: r.name,
            col: r.color || "#C9A84C",
            dash: !!r.dashed,
          });
        }
      });
    });
    (data.roads || []).forEach(function (r) {
      Object.keys(Z).forEach(function (zid) {
        var poly = Z[zid].poly;
        var hit = false;
        (r.waypoints || []).forEach(function (w) {
          if (pointInPoly(poly, w[0], w[1])) {
            hit = true;
          }
        });
        if (hit) {
          Z[zid].roads.push({
            n: r.name,
            col: r.color || "#6a5020",
            dash: !!r.dashed,
          });
        }
      });
    });
    (data.airports || []).forEach(function (a) {
      var zid = a.zoneId;
      if (!zid || !Z[zid]) {
        return;
      }
      function airportPanelRow() {
        return {
          aid: a.id || "",
          image: a.image || "",
          n: a.name,
          col: a.color || "#C8A020",
          sub: airportTypeLabel(a.type) || "Airport",
          restricted: a.type === "restricted" || !!a.warning,
        };
      }
      Z[zid].airports.push(airportPanelRow());
      (a.secondaryZoneIds || []).forEach(function (z2) {
        if (Z[z2]) {
          Z[z2].airports.push(airportPanelRow());
        }
      });
    });
  }

  function buildFromData(data) {
    var zc = data.zoneCategories || {};
    var zones = data.zones || [];
    Z = {};
    zones.forEach(function (z) {
      var cat = z.category || "civilian";
      var zdef = zc[cat] || zc.civilian || {};
      var borderHex = zdef.border || "#888888";
      var capNode = z.nodes.filter(function (n) {
        return n.id === z.capitalNodeId;
      })[0];
      var capName = capNode ? capNode.name : "";
      Z[z.id] = {
        n: z.name,
        cat: CAT_LABELS[cat] || cat,
        col: borderHex,
        fill: hexToRgbPrefix(borderHex),
        poly: z.polygon,
        cap: capName,
        desc: z.subtitle || "",
        dashed: !!z.restricted || !!(z.border && z.border.dashed),
        dashPattern: z.border && z.border.dash ? z.border.dash : [5, 3],
        nodes: (z.nodes || []).map(function (n) {
          return {
            id: n.id,
            n: n.name,
            x: n.x,
            y: n.y,
            cap: n.capital,
            secs: n.sectors || [],
          };
        }),
        roads: [],
        rail: [],
        airports: [],
      };
    });

    ROADS = (data.roads || []).map(function (r) {
      var pts = [];
      (r.waypoints || []).forEach(function (w) {
        pts.push(w[0], w[1]);
      });
      return {
        n: r.name,
        col: r.color || "#888888",
        w: (r.widthPx || 2) / 2.5,
        pts: pts,
        dash: !!r.dashed,
      };
    });

    RAIL = (data.rail || []).map(function (r) {
      var pts = [];
      (r.waypoints || []).forEach(function (w) {
        pts.push(w[0], w[1]);
      });
      return {
        n: r.name,
        col: r.color || "#C9A84C",
        w: (r.widthPx || 2) / 2.5,
        pts: pts,
        dash: !!r.dashed,
      };
    });

    APTS = (data.airports || []).map(function (a) {
      return {
        id: a.id || "",
        image: a.image || "",
        n: a.name,
        sub: a.type || "",
        x: a.x,
        y: a.y,
        major: a.type === "majorInternational",
        restricted: a.type === "restricted" || !!a.warning,
        zoneId: a.zoneId || "",
      };
    });

    NATIONAL_BOUNDARY = data.nationalBoundary || null;
    assignInfrastructureToZones(data);
  }

  function updateBarCounts(data) {
    var c = (data.meta && data.meta.counts) || {};
    var el;
    el = document.getElementById("nm-badge-zones");
    if (el) el.textContent = String(c.vaultZones != null ? c.vaultZones : Object.keys(Z).length);
    el = document.getElementById("nm-badge-nodes");
    if (el) el.textContent = String(c.nodes != null ? c.nodes : "—");
    el = document.getElementById("nm-badge-rail");
    if (el) el.textContent = String(c.railLines != null ? c.railLines : "—");
    el = document.getElementById("nm-badge-airports");
    if (el) el.textContent = String(c.airports != null ? c.airports : "—");
  }

  var canvas = document.getElementById("tm-canvas");
  if (!canvas || !canvas.getContext) {
    return;
  }
  var ctx = canvas.getContext("2d");
  var W = 0;
  var H = 0;
  var cam = { x: 0, y: 0, z: 1 };
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

    if (NATIONAL_BOUNDARY && NATIONAL_BOUNDARY.vertices && L.zones) drawNationalBoundary();
    if (L.zones) drawZones();
    if (L.roads) drawRoads();
    if (L.rail) drawRail();
    if (L.airports) drawAirports();
    if (L.nodes) drawNodes();
    if (L.labels) drawLabels();

    animId = requestAnimationFrame(draw);
  }

  function drawNationalBoundary() {
    var nb = NATIONAL_BOUNDARY;
    var verts = nb.vertices;
    if (!verts || verts.length < 3) {
      return;
    }
    var st = nb.stroke || {};
    ctx.beginPath();
    verts.forEach(function (p, i) {
      var xy = wxy(p[0], p[1]);
      if (i === 0) {
        ctx.moveTo(xy[0], xy[1]);
      } else {
        ctx.lineTo(xy[0], xy[1]);
      }
    });
    ctx.closePath();
    if (nb.fill) {
      ctx.fillStyle = nb.fill;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = st.color || "rgba(201,168,76,0.35)";
    ctx.lineWidth = (st.widthPx || 2) * cam.z * 0.5;
    ctx.globalAlpha = st.opacity != null ? st.opacity : 0.45;
    if (st.dash && st.dash.length) {
      ctx.setLineDash(st.dash.map(function (d) { return d * cam.z; }));
    } else {
      ctx.setLineDash([]);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
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
      if (z.dashed) {
        var dp = z.dashPattern || [5, 3];
        ctx.setLineDash(dp.map(function (d) { return d * cam.z; }));
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      if (isSelected) {
        ctx.setLineDash([]);
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
    lineList(pb, z.roads);
    sect(pb, "FlowNet Rail");
    lineList(pb, z.rail);
    if (z.airports.length) {
      sect(pb, "Airports");
      lineList(pb, z.airports, { airport: true });
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

  var AIRPORT_IMG_BASE = "../assets/images/airports/";

  function airportFileToUrl(filename) {
    if (!filename) {
      return "";
    }
    return (
      AIRPORT_IMG_BASE +
      filename
        .split("/")
        .map(function (seg) {
          return encodeURIComponent(seg);
        })
        .join("/")
    );
  }

  function airportImageUrlList(it) {
    var out = [];
    if (it.image) {
      out.push(airportFileToUrl(it.image));
      return out;
    }
    if (!it.aid) {
      return out;
    }
    ["webp", "png", "jpg"].forEach(function (ext) {
      out.push(airportFileToUrl(it.aid + "." + ext));
    });
    return out;
  }

  function appendAirportVisual(row, it) {
    row.classList.add("tm-line-item--airport");
    row.style.setProperty("--line-c", it.col || "#C8A020");
    var vis = document.createElement("div");
    vis.className = "tm-line-airport-visual";
    var urls = airportImageUrlList(it);
    var swFallback = document.createElement("span");
    swFallback.className = "tm-line-swatch tm-line-swatch--airport-fallback";
    swFallback.setAttribute("aria-hidden", "true");

    if (!urls.length) {
      vis.appendChild(swFallback);
      row.appendChild(vis);
      return;
    }

    var img = document.createElement("img");
    img.className = "tm-line-airport-img";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    var u = 0;
    img.addEventListener("error", function onErr() {
      u += 1;
      if (u < urls.length) {
        img.src = urls[u];
      } else {
        img.remove();
        if (!vis.contains(swFallback)) {
          vis.appendChild(swFallback);
        }
      }
    });
    img.src = urls[0];
    vis.appendChild(img);
    row.appendChild(vis);
  }

  function lineList(parent, items, opts) {
    opts = opts || {};
    var wrap = document.createElement("div");
    wrap.className = "tm-line-list" + (opts.airport ? " tm-line-list--airport" : "");
    if (!items || !items.length) {
      var empty = document.createElement("p");
      empty.className = "tm-line-empty";
      empty.textContent = "None in this zone.";
      wrap.appendChild(empty);
      parent.appendChild(wrap);
      return;
    }
    var sorted = items.slice().sort(function (a, b) {
      return a.n.localeCompare(b.n);
    });
    sorted.forEach(function (it) {
      var row = document.createElement("div");
      row.className = "tm-line-item";
      if (it.dash) {
        row.classList.add("tm-line-item--dashed");
      }
      if (it.restricted) {
        row.classList.add("tm-line-item--restricted");
      }
      row.style.setProperty("--line-c", it.col || "#C9A84C");

      if (opts.airport) {
        appendAirportVisual(row, it);
      } else {
        var sw = document.createElement("span");
        sw.className = "tm-line-swatch";
        sw.setAttribute("aria-hidden", "true");
        row.appendChild(sw);
      }

      var body = document.createElement("div");
      body.className = "tm-line-body";
      var nm = document.createElement("span");
      nm.className = "tm-line-name";
      nm.textContent = it.n;
      body.appendChild(nm);
      if (it.sub) {
        var sub = document.createElement("span");
        sub.className = "tm-line-sub";
        sub.textContent = it.sub;
        body.appendChild(sub);
      }
      if (it.dash) {
        var pillD = document.createElement("span");
        pillD.className = "tm-line-pill";
        pillD.textContent = "Dashed";
        body.appendChild(pillD);
      }
      if (it.restricted) {
        var pillR = document.createElement("span");
        pillR.className = "tm-line-pill tm-line-pill--warn";
        pillR.textContent = "Restricted";
        body.appendChild(pillR);
      }
      row.appendChild(body);
      wrap.appendChild(row);
    });
    parent.appendChild(wrap);
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

  var DATA_URL = new URL("../data/vaultrian-national-map.json", document.currentScript.src).href;

  function loadMapData() {
    if (window.__VAULTRIAN_NATIONAL_MAP__) {
      return Promise.resolve(window.__VAULTRIAN_NATIONAL_MAP__);
    }
    return fetch(DATA_URL).then(function (r) {
      if (!r.ok) {
        throw new Error("bad status");
      }
      return r.json();
    });
  }

  window.addEventListener("resize", resize);

  loadMapData()
    .then(function (data) {
      buildFromData(data);
      if (data.meta && data.meta.canvas) {
        BASE_W = data.meta.canvas.width || 1600;
        BASE_H = data.meta.canvas.height || 1000;
      }
      updateBarCounts(data);
      var sub = document.querySelector(".nm-bar-sub");
      if (sub && data.meta && data.meta.subtitle) {
        sub.textContent = data.meta.subtitle;
      }
      var phName = document.getElementById("tm-ph-name");
      var phType = document.getElementById("tm-ph-type");
      var phDesc = document.getElementById("tm-ph-desc");
      if (phName && data.meta && data.meta.title) {
        phName.textContent = data.meta.title;
      }
      if (phType && data.meta) {
        phType.textContent =
          (data.meta.division || "Cartography") +
          " · " +
          (data.meta.document || "Official") +
          " · Year " +
          (data.meta.year != null ? data.meta.year : "—");
      }
      if (phDesc) {
        phDesc.textContent =
          "Select any zone or node. National boundary, zones, roads, FlowNet rail, and airports load from vaultrian-national-map.json.";
      }
      resize();
      draw();
    })
    .catch(function () {
      var d = document.getElementById("tm-ph-desc");
      if (d) {
        d.textContent =
          "Could not load map data. Ensure vaultrian-national-map-data.js is included, or serve the site over HTTP so vaultrian-national-map.json can be fetched.";
      }
    });
})();
