/* METABOLIC JOURNEY — scene kit: DOM/SVG helpers, molecules, arrows, transfers, camera, backdrops */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const K = (window.K = {});
  let UID = 0;

  /* ---------- seeded random ---------- */
  K.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /* ---------- HTML nodes ---------- */
  // node(parent, cls, html, x, y, {anchor:'c'|'l'|'r'|'tl'|'t'|'b', show, w})
  K.node = function (parent, cls, html, x, y, o) {
    o = o || {};
    const el = document.createElement('div');
    el.className = 'n ' + (cls || '');
    if (html != null) el.innerHTML = html;
    if (o.w) el.style.width = o.w + 'px';
    if (o.style) el.setAttribute('style', (el.getAttribute('style') || '') + ';' + o.style);
    parent.appendChild(el);
    const a = o.anchor || 'c';
    const xp = a === 'l' || a === 'tl' ? 0 : a === 'r' || a === 'tr' ? -100 : -50;
    const yp = a === 'tl' || a === 'tr' || a === 't' ? 0 : a === 'b' ? -100 : -50;
    gsap.set(el, { x: x || 0, y: y || 0, xPercent: xp, yPercent: yp, autoAlpha: o.show ? 1 : 0 });
    return el;
  };
  K.layer = function (parent, x, y, show) {
    const el = document.createElement('div');
    el.className = 'n layer';
    parent.appendChild(el);
    gsap.set(el, { x: x || 0, y: y || 0, autoAlpha: show === false ? 0 : 1 });
    return el;
  };
  K.pill = function (parent, kind, html, x, y, o) {
    o = o || {};
    return K.node(parent, 'pill ' + kind + (o.size ? ' ' + o.size : ''), html, x, y, o);
  };
  K.enz = function (parent, html, x, y, o) { return K.node(parent, 'enz', html, x, y, o); };
  K.lbl = function (parent, html, x, y, o) { return K.node(parent, 'lbl ' + ((o && o.cls) || ''), html, x, y, o); };
  K.chip = function (parent, kind, html, x, y, o) { return K.node(parent, 'tagchip ' + kind, html, x, y, o); };
  K.card = function (parent, cls, html, x, y, w, o) { o = Object.assign({ anchor: 'tl', w: w }, o || {}); return K.node(parent, 'card ' + (cls || ''), html, x, y, o); };

  /* ---------- SVG ---------- */
  K.svg = function (parent, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', cls || 'art');
    s.setAttribute('viewBox', '0 0 1920 1080');
    s.setAttribute('width', '1920'); s.setAttribute('height', '1080');
    parent.appendChild(s);
    s._defs = K.s(s, 'defs');
    return s;
  };
  K.s = function (parent, tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  };
  K.sg = function (parent, attrs, hidden) {
    const g = K.s(parent, 'g', attrs);
    if (hidden) gsap.set(g, { autoAlpha: 0 });
    return g;
  };
  // radial gradient, returns url(#id)
  K.rgrad = function (svg, stops, o) {
    o = o || {};
    const id = 'g' + ++UID;
    const g = K.s(svg._defs, 'radialGradient', { id, cx: o.cx || '50%', cy: o.cy || '50%', r: o.r || '50%', fx: o.fx, fy: o.fy });
    stops.forEach(function (s) { K.s(g, 'stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }); });
    return 'url(#' + id + ')';
  };
  K.lgrad = function (svg, stops, o) {
    o = o || {};
    const id = 'g' + ++UID;
    const g = K.s(svg._defs, 'linearGradient', { id, x1: o.x1 || '0', y1: o.y1 || '0', x2: o.x2 || '0', y2: o.y2 || '1' });
    stops.forEach(function (s) { K.s(g, 'stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] == null ? 1 : s[2] }); });
    return 'url(#' + id + ')';
  };
  K.text = function (parent, str, x, y, o) {
    o = o || {};
    const t = K.s(parent, 'text', { x, y, fill: o.fill || '#b4c0dc', 'font-family': 'Inter, sans-serif', 'font-size': o.size || 22, 'font-weight': o.weight || 600, 'text-anchor': o.anchor || 'middle', 'letter-spacing': o.ls, 'font-style': o.italic ? 'italic' : null, opacity: o.opacity });
    t.textContent = str;
    return t;
  };

  /* ---------- arrows ---------- */
  function headPts(tx, ty, dx, dy, size, half) {
    const L = Math.hypot(dx, dy) || 1; const ux = dx / L, uy = dy / L; const px = -uy, py = ux;
    const bx = tx - ux * size, by = ty - uy * size;
    const w = size * 0.58;
    if (half === 1) return [tx, ty, bx + px * w, by + py * w, bx, by].join(',');
    if (half === -1) return [tx, ty, bx - px * w, by - py * w, bx, by].join(',');
    return [tx, ty, bx + px * w, by + py * w, bx + ux * size * 0.25, by + uy * size * 0.25, bx - px * w, by - py * w].join(',');
  }
  // generic arrow: (svg, x1,y1,x2,y2, {bend, color, w, head, start(bool head at start), dash})
  K.arrow = function (svg, x1, y1, x2, y2, o) {
    o = o || {};
    const color = o.color || '#dbe4ff', w = o.w || 5, hs = o.head || w * 4.2;
    const g = K.sg(svg, { class: 'arrow' });
    let d, ex, ey, sx, sy;
    if (o.bend) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; const dx = x2 - x1, dy = y2 - y1; const L = Math.hypot(dx, dy) || 1;
      const cx = mx + (-dy / L) * o.bend, cy = my + (dx / L) * o.bend;
      d = 'M' + x1 + ',' + y1 + ' Q' + cx + ',' + cy + ' ' + x2 + ',' + y2;
      ex = x2 - cx; ey = y2 - cy; sx = x1 - cx; sy = y1 - cy;
    } else {
      d = 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2; ex = x2 - x1; ey = y2 - y1; sx = -ex; sy = -ey;
    }
    const p = K.s(g, 'path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', opacity: o.opacity });
    const L = p.getTotalLength ? p.getTotalLength() : Math.hypot(x2 - x1, y2 - y1);
    // shorten so line doesn't poke through head
    const heads = [];
    heads.push(K.s(g, 'polygon', { points: headPts(x2, y2, ex, ey, hs), fill: color }));
    if (o.start) heads.push(K.s(g, 'polygon', { points: headPts(x1, y1, sx, sy, hs), fill: color }));
    if (o.dash) p.setAttribute('stroke-dasharray', o.dash);
    const a = { g, p, heads, L, dashed: !!o.dash, dashStr: o.dash };
    if (!o.show) K.arrowHide(a);
    return a;
  };
  // reaction arrow; rev=true draws chemistry equilibrium harpoons (⇌)
  K.react = function (svg, x1, y1, x2, y2, rev, o) {
    o = o || {};
    const color = o.color || '#e6ecff', w = o.w || 5, hs = o.head || 22;
    const g = K.sg(svg, { class: 'react' });
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, px = -dy / L, py = dx / L;
    const parts = [];
    if (!rev) {
      const p = K.s(g, 'path', { d: 'M' + x1 + ',' + y1 + ' L' + (x2 - dx / L * hs * .6) + ',' + (y2 - dy / L * hs * .6), stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' });
      const h = K.s(g, 'polygon', { points: headPts(x2, y2, dx, dy, hs), fill: color });
      parts.push({ p, h, L });
    } else {
      const off = o.gap || 9;
      const ax1 = x1 + px * -off, ay1 = y1 + py * -off, ax2 = x2 + px * -off, ay2 = y2 + py * -off;
      const bx1 = x1 + px * off, by1 = y1 + py * off, bx2 = x2 + px * off, by2 = y2 + py * off;
      const p1 = K.s(g, 'path', { d: 'M' + ax1 + ',' + ay1 + ' L' + ax2 + ',' + ay2, stroke: color, 'stroke-width': w * .8, 'stroke-linecap': 'round', fill: 'none' });
      const h1 = K.s(g, 'polygon', { points: headPts(ax2, ay2, dx, dy, hs, -1), fill: color });
      const p2 = K.s(g, 'path', { d: 'M' + bx2 + ',' + by2 + ' L' + bx1 + ',' + by1, stroke: color, 'stroke-width': w * .8, 'stroke-linecap': 'round', fill: 'none' });
      const h2 = K.s(g, 'polygon', { points: headPts(bx1, by1, -dx, -dy, hs, -1), fill: color });
      parts.push({ p: p1, h: h1, L }, { p: p2, h: h2, L });
    }
    const a = { g, parts, rev: !!rev };
    if (!o.show) gsap.set(g, { autoAlpha: 0 });
    return a;
  };
  K.arrowHide = function (a) {
    gsap.set(a.p, { attr: { 'stroke-dasharray': a.L + ' ' + a.L, 'stroke-dashoffset': a.L } });
    gsap.set(a.heads, { autoAlpha: 0 });
    gsap.set(a.g, { autoAlpha: 1 });
  };
  // draw an arrow (K.arrow or K.react) into a timeline
  K.draw = function (tl, a, at, dur) {
    dur = dur || 0.7;
    if (a.parts) {
      tl.set(a.g, { autoAlpha: 1 }, at);
      a.parts.forEach(function (pt, i) {
        gsap.set(pt.p, { attr: { 'stroke-dasharray': pt.L + ' ' + pt.L, 'stroke-dashoffset': pt.L } });
        gsap.set(pt.h, { autoAlpha: 0 });
        tl.to(pt.p, { attr: { 'stroke-dashoffset': 0 }, duration: dur, ease: 'power2.inOut' }, at == null ? '<' : at);
        tl.to(pt.h, { autoAlpha: 1, duration: 0.2 }, '>-0.12');
      });
      return tl;
    }
    tl.to(a.p, { attr: { 'stroke-dashoffset': 0 }, duration: dur, ease: 'power2.inOut' }, at);
    tl.to(a.heads, { autoAlpha: 1, duration: 0.2 }, '>-0.12');
    if (a.dashed) tl.set(a.p, { attr: { 'stroke-dasharray': a.dashStr || '14 12' } });
    return tl;
  };

  /* ---------- reveal helpers ---------- */
  K.pop = function (tl, els, at, o) {
    o = o || {};
    return tl.fromTo(els, { autoAlpha: 0, scale: o.from || 0.6 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.55, ease: o.ease || 'back.out(1.8)', stagger: o.stagger || 0 }, at);
  };
  K.fadeIn = function (tl, els, at, o) {
    o = o || {};
    return tl.fromTo(els, { autoAlpha: 0, y: '+=' + (o.dy == null ? 18 : o.dy) }, { autoAlpha: 1, y: '-=' + (o.dy == null ? 18 : o.dy), duration: o.dur || 0.6, ease: 'power2.out', stagger: o.stagger || 0 }, at);
  };
  K.fade = function (tl, els, at, dur) { return tl.fromTo(els, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur || 0.6, ease: 'power1.out' }, at); };
  K.out = function (tl, els, at, dur) { return tl.to(els, { autoAlpha: 0, duration: dur || 0.4, ease: 'power1.in' }, at); };
  K.dim = function (tl, els, at, v) { return tl.to(els, { autoAlpha: v == null ? 0.22 : v, duration: 0.5 }, at); };
  K.swap = function (tl, a, b, at, dur) {
    dur = dur || 0.35;
    tl.to(a, { autoAlpha: 0, scale: 0.7, duration: dur, ease: 'power2.in' }, at);
    tl.fromTo(b, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: dur + 0.15, ease: 'back.out(2)' }, '>-0.05');
    return tl;
  };

  // move along a quadratic arc
  K.arc = function (tl, el, from, to, at, o) {
    o = o || {};
    const lift = o.lift == null ? -120 : o.lift;
    const cx = (from.x + to.x) / 2 + (o.cxOff || 0), cy = Math.min(from.y, to.y) + lift;
    const pr = { t: 0 };
    tl.set(el, { x: from.x, y: from.y }, at);
    tl.to(pr, {
      t: 1, duration: o.dur || 1.1, ease: o.ease || 'power2.inOut',
      onUpdate: function () {
        const t = pr.t, u = 1 - t;
        gsap.set(el, { x: u * u * from.x + 2 * u * t * cx + t * t * to.x, y: u * u * from.y + 2 * u * t * cy + t * t * to.y });
      }
    }, at == null ? '>' : at);
    return tl;
  };

  // phosphate ghost travels from source to destination badge; dest = {x,y, els:[stick?, ball]}
  K.transferP = function (tl, parent, from, to, destEls, at, o) {
    o = o || {};
    const ghost = K.node(parent, 'phos' + (o.hi ? ' hi' : ''), 'P', from.x, from.y);
    tl.set(ghost, { autoAlpha: 1, scale: 0.4, x: from.x, y: from.y }, at);
    tl.to(ghost, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, '<');
    K.arc(tl, ghost, from, to, '>', { lift: o.lift, dur: o.dur || 1.1, cxOff: o.cxOff });
    tl.set(ghost, { autoAlpha: 0 });
    if (destEls && destEls.length) tl.fromTo(destEls, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, '<');
    return ghost;
  };

  K.scrim = function (S) { return K.node(S.w, 'scrim', '', 0, 0, { anchor: 'tl' }); };

  /* ---------- ATP spent / ATP made ---------- */
  // ATP arrives, its terminal phosphate travels to badge P (from chain.addP), ATP becomes ADP and drifts to exit
  K.atpSpend = function (tl, parent, from, P, exit, at, o) {
    o = o || {};
    const atp = K.pill(parent, 'atp', 'ATP', from.x, from.y), adp = K.pill(parent, 'adp', 'ADP', from.x, from.y);
    K.pop(tl, atp, at);
    const lab = 'sp' + ++UID; tl.addLabel(lab, '>+0.1');
    K.transferP(tl, parent, { x: from.x, y: from.y - 44 }, P.abs(), P.els, lab, { lift: o.lift, dur: o.dur || 1.2, cxOff: o.cxOff });
    K.swap(tl, atp, adp, lab + '+=0.15');
    if (exit) {
      tl.to(adp, { x: exit.x, y: exit.y, duration: 1, ease: 'power2.inOut' }, lab + '+=1.3');
      tl.to(adp, { autoAlpha: o.keep == null ? 0.55 : o.keep, duration: 0.5 }, '<+0.5');
    }
    return { atp: atp, adp: adp };
  };
  // ADP arrives, phosphate leaves the substrate badge P, ADP becomes ATP (marked MADE)
  K.atpMake = function (tl, parent, at0, P, exit, at, o) {
    o = o || {};
    const adp = K.pill(parent, 'adp', 'ADP', at0.x, at0.y), atp = K.pill(parent, 'atp', 'ATP <span class="tagmade">MADE</span>', at0.x, at0.y);
    K.pop(tl, adp, at);
    const lab = 'mk' + ++UID; tl.addLabel(lab, '>+0.1');
    tl.to(P.els, { autoAlpha: 0, duration: 0.2 }, lab);
    K.transferP(tl, parent, P.abs(), { x: at0.x, y: at0.y - 40 }, [], lab, { lift: o.lift == null ? -90 : o.lift, dur: o.dur || 1.1, hi: o.hi });
    K.swap(tl, adp, atp, '>-0.1');
    tl.fromTo(atp, { boxShadow: '0 0 0 0 rgba(255,68,88,.9)' }, { boxShadow: '0 0 0 26px rgba(255,68,88,0)', duration: 0.9 }, '>-0.2');
    if (exit) tl.to(atp, { x: exit.x, y: exit.y, duration: 1, ease: 'power2.inOut' }, '>-0.3');
    return { atp: atp, adp: adp };
  };
  // header for a reaction step
  K.stepHead = function (parent, n, enz, rxn, chipKind, chipText, x, y) {
    return K.node(parent, 'stephead', '<span class="sn">' + n + '</span><div><div class="se">' + enz + '</div><div class="sr">' + rxn +
      (chipKind ? ' &nbsp;<span class="tagchip ' + chipKind + '" style="vertical-align:4px">' + chipText + '</span>' : '') + '</div></div>', x == null ? 86 : x, y == null ? 196 : y, { anchor: 'tl' });
  };
  // sugar icon (hexagon/pentagon) with optional phosphate slot
  K.sugar = function (parent, kind, label, x, y, show) {
    const g = K.layer(parent, x, y, show !== false);
    const sg = { g: g, x: x, y: y };
    sg.body = K.node(g, kind === 'fru' ? 'pent' : 'hexm', label, 0, 0, { show: true });
    sg.pball = K.node(g, 'phos sm', 'P', 44, -36);
    sg.P = { els: [sg.pball], abs: function () { return { x: sg.x + 44, y: sg.y - 36 }; } };
    sg.alt = function (label) { if (!sg.body2) { sg.body2 = K.node(g, kind === 'fru' ? 'pent' : 'hexm', label, 0, 0); g.insertBefore(sg.body2, sg.pball); } return sg.body2; };
    sg.move = function (tl, nx, ny, at, dur, ease) { sg.x = nx; sg.y = ny; return tl.to(g, { x: nx, y: ny, duration: dur || 1.2, ease: ease || 'power2.inOut' }, at); };
    return sg;
  };

  /* ---------- carbon chain ---------- */
  // K.chain(parent, {n, x, y, gap, labels, vertical})
  K.chain = function (parent, o) {
    const n = o.n, gap = o.gap || 92, vert = !!o.vertical;
    const g = K.layer(parent, o.x, o.y, o.show !== false);
    const ch = { g, n, gap, vert, x: o.x, y: o.y, atoms: [], bonds: [], P: {}, subs: {}, extra: [] };
    const off = (n - 1) * gap / 2;
    ch.lx = function (i) { return vert ? 0 : i * gap - off; };
    ch.ly = function (i) { return vert ? i * gap - off : 0; };
    for (let i = 0; i < n - 1; i++) {
      const b = K.node(g, 'bond', '', vert ? 0 : ch.lx(i) + gap / 2, vert ? ch.ly(i) + gap / 2 : 0, { show: true });
      if (vert) { b.style.width = '10px'; b.style.height = gap + 'px'; } else b.style.width = gap + 'px';
      ch.bonds.push(b);
    }
    const labels = o.labels || Array.from({ length: n }, function (_, i) { return 'C' + (i + 1); });
    for (let i = 0; i < n; i++) ch.atoms.push(K.node(g, 'atom' + (o.small ? ' sm' : ''), labels[i], ch.lx(i), ch.ly(i), { show: true }));
    // absolute coordinates (logical)
    ch.ax = function (i) { return ch.x + ch.lx(i); };
    ch.ay = function (i) { return ch.y + ch.ly(i); };
    // add a phosphate badge on carbon i; dir 'up'|'down'|'left'|'right'
    ch.addP = function (i, dir, hi, show) {
      dir = dir || (vert ? 'right' : 'up');
      const d = 74;
      const dx = dir === 'left' ? -d : dir === 'right' ? d : 0, dy = dir === 'up' ? -d : dir === 'down' ? d : 0;
      const stick = K.node(g, 'stick', '', ch.lx(i) + dx / 2, ch.ly(i) + dy / 2, { show: show });
      if (dx) { stick.style.width = '40px'; stick.style.height = '6px'; } else stick.style.height = '40px';
      const ball = K.node(g, 'phos' + (hi ? ' hi' : ''), 'P', ch.lx(i) + dx, ch.ly(i) + dy, { show: show });
      const p = { stick, ball, els: [stick, ball], lx: ch.lx(i) + dx, ly: ch.ly(i) + dy, i };
      p.abs = function () { return { x: ch.x + p.lx, y: ch.y + p.ly }; };
      (ch.P[i] = ch.P[i] || []).push(p);
      return p;
    };
    ch.sub = function (i, html, dy, cls) {
      const el = K.node(g, 'lbl sm ' + (cls || ''), html, ch.lx(i) + (vert ? -100 : 0), ch.ly(i) + (vert ? 0 : (dy || 64)));
      ch.subs[i] = el; return el;
    };
    ch.name = function (html, dy, dx) {
      ch.nameEl = K.node(g, 'mname', html, vert ? (dx || 0) : (dx || 0), vert ? off + (dy || 90) : (dy || 96));
      return ch.nameEl;
    };
    ch.move = function (tl, x, y, at, dur, ease) {
      ch.x = x; ch.y = y;
      return tl.to(g, { x, y, duration: dur || 1, ease: ease || 'power3.inOut' }, at);
    };
    ch.set = function (x, y) { ch.x = x; ch.y = y; gsap.set(g, { x, y }); };
    ch.all = function () { return [g]; };
    return ch;
  };

  /* ---------- camera ---------- */
  // a zoomable sub-world inside the scene (overlays added to S.w stay fixed)
  K.camLayer = function (S) {
    const el = document.createElement('div');
    el.className = 'world';
    S.w.appendChild(el);
    S.camEl = el;
    el.svg = K.svg(el);
    gsap.set(el, { x: 0, y: 0, scale: 1 });
    return el;
  };
  K.cam = function (tl, S, cx, cy, s, at, dur, ease) {
    S.camState = { cx, cy, s };
    return tl.to(S.camEl || S.w, { x: 960 - cx * s, y: 540 - cy * s, scale: s, duration: dur || 1.6, ease: ease || 'power3.inOut' }, at);
  };
  K.camSet = function (S, cx, cy, s) {
    S.camState = { cx, cy, s };
    gsap.set(S.camEl || S.w, { x: 960 - cx * s, y: 540 - cy * s, scale: s });
  };

  /* ---------- inhibition symbol (T-bar + cross) ---------- */
  K.inhibit = function (svg, x1, y1, x2, y2, o) {
    o = o || {};
    const col = o.color || '#ff2a2a';
    const g = K.sg(svg, { class: 'inhib' }, !o.show);
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, px = -dy / L * 26, py = dx / L * 26;
    K.s(g, 'line', { x1, y1, x2, y2, stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round' });
    K.s(g, 'line', { x1: x2 + px, y1: y2 + py, x2: x2 - px, y2: y2 - py, stroke: col, 'stroke-width': 9, 'stroke-linecap': 'round' });
    if (o.cross !== false) {
      const cx = o.cx != null ? o.cx : x2 + dx / L * 40, cy = o.cy != null ? o.cy : y2 + dy / L * 40, r = 17;
      K.s(g, 'circle', { cx, cy, r: r + 9, fill: 'rgba(255,42,42,.16)', stroke: col, 'stroke-width': 3 });
      K.s(g, 'line', { x1: cx - r * .62, y1: cy - r * .62, x2: cx + r * .62, y2: cy + r * .62, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' });
      K.s(g, 'line', { x1: cx + r * .62, y1: cy - r * .62, x2: cx - r * .62, y2: cy + r * .62, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' });
    }
    return g;
  };
  K.crossSvg = function (svg, cx, cy, r, show, col) {
    col = col || '#ff2a2a';
    const g = K.sg(svg, {}, !show);
    K.s(g, 'circle', { cx, cy, r: r + 8, fill: 'rgba(255,42,42,.14)', stroke: col, 'stroke-width': 3 });
    K.s(g, 'line', { x1: cx - r * .6, y1: cy - r * .6, x2: cx + r * .6, y2: cy + r * .6, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' });
    K.s(g, 'line', { x1: cx + r * .6, y1: cy - r * .6, x2: cx - r * .6, y2: cy + r * .6, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' });
    return g;
  };

  /* ---------- backdrops ---------- */
  K.backdrop = function (S, kind, seed) {
    const svg = S.svg, R = K.rng(seed || 7), g = K.sg(svg, { class: 'backdrop' });
    if (kind === 'cytosol' || kind === 'rbc' || kind === 'matrix') {
      const tint = kind === 'rbc' ? ['#5a1530', '#2a0a1a'] : kind === 'matrix' ? ['#0e3b3f', '#071b22'] : ['#1a2f66', '#0a1430'];
      for (let i = 0; i < 5; i++) {
        const f = K.rgrad(svg, [[0, tint[0], 0.55], [0.6, tint[1], 0.25], [1, tint[1], 0]]);
        K.s(g, 'ellipse', { cx: R() * 1920, cy: R() * 1080, rx: 260 + R() * 420, ry: 200 + R() * 300, fill: f });
      }
      if (kind === 'cytosol') {
        // ER-like faint membranes and ribosome dots
        for (let i = 0; i < 6; i++) {
          const x = R() * 1920, y = R() * 1080, w = 300 + R() * 400;
          K.s(g, 'path', { d: 'M' + x + ',' + y + ' c' + w * .3 + ',' + (-60 - R() * 60) + ' ' + w * .7 + ',' + (60 + R() * 60) + ' ' + w + ',0', fill: 'none', stroke: '#6b86d6', 'stroke-opacity': 0.08, 'stroke-width': 14, 'stroke-linecap': 'round' });
        }
        for (let i = 0; i < 70; i++) K.s(g, 'circle', { cx: R() * 1920, cy: R() * 1080, r: 2 + R() * 4, fill: '#8fb0ff', opacity: 0.05 + R() * 0.08 });
      } else if (kind === 'rbc') {
        for (let i = 0; i < 40; i++) K.s(g, 'circle', { cx: R() * 1920, cy: R() * 1080, r: 10 + R() * 16, fill: '#ff6b8a', opacity: 0.03 + R() * 0.04 });
      } else {
        for (let i = 0; i < 4; i++) {
          const y = 120 + i * 260 + R() * 60;
          K.s(g, 'path', { d: 'M-40,' + y + ' C400,' + (y - 90) + ' 700,' + (y + 110) + ' 1100,' + y + ' S1700,' + (y - 80) + ' 1980,' + (y + 20), fill: 'none', stroke: '#2dd4bf', 'stroke-opacity': 0.06, 'stroke-width': 26, 'stroke-linecap': 'round' });
        }
        for (let i = 0; i < 50; i++) K.s(g, 'circle', { cx: R() * 1920, cy: R() * 1080, r: 2 + R() * 3, fill: '#7cf3e6', opacity: 0.05 + R() * 0.07 });
      }
    }
    return g;
  };

  /* ---------- lipid bilayer (one SVG pattern instead of ~1000 shapes) ---------- */
  K.bilayer = function (svg, y, th, headCol, x0, x1, tint) {
    x0 = x0 || 0; x1 = x1 || 1920;
    const id = 'lp' + ++UID, step = 22;
    const pat = K.s(svg._defs, 'pattern', { id: id, x: x0, y: y - th / 2, width: step, height: th, patternUnits: 'userSpaceOnUse' });
    const t1 = y - th / 2, cx = step / 2;
    [[9, 1], [th - 9, -1]].forEach(function (r) {
      K.s(pat, 'line', { x1: cx - 3, y1: r[0] + r[1] * 7, x2: cx - 3, y2: r[0] + r[1] * (th / 2 - 10), stroke: '#c9b77a', 'stroke-opacity': 0.45, 'stroke-width': 2 });
      K.s(pat, 'line', { x1: cx + 3, y1: r[0] + r[1] * 7, x2: cx + 3, y2: r[0] + r[1] * (th / 2 - 10), stroke: '#c9b77a', 'stroke-opacity': 0.45, 'stroke-width': 2 });
      K.s(pat, 'circle', { cx: cx, cy: r[0], r: 8.5, fill: headCol, opacity: 0.88 });
    });
    const g = K.sg(svg, { class: 'membrane' });
    K.s(g, 'rect', { x: x0, y: t1, width: x1 - x0, height: th, fill: tint || headCol, 'fill-opacity': 0.1 });
    K.s(g, 'rect', { x: x0, y: t1, width: x1 - x0, height: th, fill: 'url(#' + id + ')' });
    return g;
  };

  /* ---------- mitochondrion drawing ---------- */
  K.mito = function (svg, cx, cy, w, h, o) {
    o = o || {};
    const g = K.sg(svg, { class: 'mito' }, o.hidden);
    const rx = h / 2;
    const outerF = K.lgrad(svg, [[0, '#ff9a6b'], [1, '#c4462a']]);
    const matrixF = K.rgrad(svg, [[0, '#ffcf9e', 1], [1, '#e07a4a', 1]]);
    K.s(g, 'rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx, fill: outerF, stroke: '#ffd0b0', 'stroke-width': o.stroke || 3 });
    const ins = o.inset || Math.max(8, h * 0.09);
    K.s(g, 'rect', { x: cx - w / 2 + ins, y: cy - h / 2 + ins, width: w - ins * 2, height: h - ins * 2, rx: rx - ins, fill: matrixF, stroke: '#a83a1c', 'stroke-width': o.stroke ? o.stroke * 0.9 : 2.5 });
    // cristae
    const n = o.cristae || Math.max(3, Math.round(w / (h * 0.55)));
    for (let i = 0; i < n; i++) {
      const x = cx - w / 2 + rx * 0.9 + (i + 0.5) * ((w - rx * 1.8) / n);
      const top = i % 2 === 0;
      const y0 = top ? cy - h / 2 + ins : cy + h / 2 - ins, len = (h - ins * 2) * 0.62;
      const y1 = top ? y0 + len : y0 - len, ww = Math.max(6, h * 0.06);
      K.s(g, 'path', { d: 'M' + (x - ww) + ',' + y0 + ' L' + (x - ww) + ',' + y1 + ' Q' + x + ',' + (y1 + (top ? ww * 1.6 : -ww * 1.6)) + ' ' + (x + ww) + ',' + y1 + ' L' + (x + ww) + ',' + y0, fill: '#f19a6a', stroke: '#a83a1c', 'stroke-width': o.stroke ? o.stroke * 0.8 : 2 });
    }
    return g;
  };

  /* ---------- small glucose hexagon icon (svg) ---------- */
  K.hexIcon = function (svg, cx, cy, r, o) {
    o = o || {};
    const g = K.sg(svg, { class: 'hex' }, o.hidden);
    const pts = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; pts.push((cx + r * Math.cos(a)) + ',' + (cy + r * Math.sin(a))); }
    K.s(g, 'polygon', { points: pts.join(' '), fill: o.fill || 'rgba(45,212,191,.25)', stroke: o.stroke || '#5eead4', 'stroke-width': o.sw || 3 });
    if (o.p) { K.s(g, 'circle', { cx: cx + r * 1.35, cy: cy - r * 0.6, r: r * 0.42, fill: '#ffb21e' }); }
    return g;
  };
})();
/* inline equilibrium (reversible) arrow glyph for HTML text; Inter lacks the ⇌ character */
window.K.EQ = '<svg viewBox="0 0 48 22" width="44" height="20" style="vertical-align:middle;margin:0 8px;overflow:visible"><path d="M2 7 H44 L34 1" fill="none" stroke="#9ff5ea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 15 H4 L14 21" fill="none" stroke="#9ff5ea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
