/* METABOLIC JOURNEY — engine: stage, navigation, HUD, ledger, panels, print */
(function () {
  'use strict';
  const D = (window.Deck = { scenes: [], si: 0, bi: 0, reduced: false, paused: false, errors: [] });
  D.add = function (def) { D.scenes.push(def); };
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const MINUS = '−';

  /* ================= HUD ================= */
  const STEPS = [
    [1, 'Hexokinase', 'inv', 1], [2, 'Phosphoglucose isomerase', 'inv'], [3, 'PFK-1', 'inv', 1], [4, 'Aldolase', 'inv'], [5, 'Triose-P isomerase', 'inv'],
    [6, 'GAPDH', 'pay'], [7, 'PG kinase', 'pay'], [8, 'PG mutase', 'pay'], [9, 'Enolase', 'pay'], [10, 'Pyruvate kinase', 'pay', 1]
  ];
  function hudHTML() {
    const cell = function (cls, k, sub) { return '<div class="cell ' + cls + '"><div class="k">' + k + '</div><div class="v" data-k="' + cls + '">0</div><div class="sub">' + sub + '</div></div>'; };
    let mm = '<div class="mm-h">Glycolysis map</div>';
    STEPS.forEach(function (s) {
      mm += '<div class="mm ph-' + s[2] + (s[3] ? ' irr' : '') + '" data-s="' + s[0] + '"><span class="no">' + s[0] + '</span><span class="nm">' + s[1] + '</span>' + (s[0] >= 6 ? '<span class="x2">×2</span>' : '') + '</div>';
    });
    return '<div class="hud">' +
      '<div class="h-kicker"></div><div class="h-title"></div>' +
      '<div class="h-ledger"><div class="ledger-head"><span>Glycolysis ledger</span><span class="tag"></span></div><div class="ledger-row">' +
      cell('inv', 'Invested', 'ATP spent') + cell('gen', 'Generated', 'ATP made') + cell('net', 'Net ATP', 'made − spent') + cell('nadh', 'NADH', 'formed') + cell('nad', 'NAD<sup>+</sup>', 'pool change') +
      '</div></div>' +
      '<div class="h-opp"><div class="v">0</div><div class="t">ATP opportunity lost (shunt)<small>Not an ATP spend: the PGK step is skipped</small></div></div>' +
      '<div class="h-link"><div class="ledger-head"><span>Link reaction ledger</span><span class="tag"></span></div><div class="ledger-row">' +
      '<div class="cell"><div class="k">Acetyl-CoA</div><div class="v" data-k="acoa">0</div></div>' +
      '<div class="cell"><div class="k">CO<sub>2</sub></div><div class="v" data-k="co2">0</div></div>' +
      '<div class="cell nadh"><div class="k">NADH</div><div class="v" data-k="lnadh">0</div></div></div></div>' +
      '<div class="h-map">' + mm + '</div>' +
      '<div class="h-caption"></div>' +
      '<div class="h-legend">' +
      '<span class="lg"><span class="sw c">C</span>carbon</span>' +
      '<span class="lg"><span class="sw p">P</span>phosphate</span>' +
      '<span class="lg"><span class="sw pill atp">ATP</span><span class="sw pill adp">ADP</span></span>' +
      '<span class="lg"><span class="sw pill nad">NAD<sup>+</sup></span><span class="sw pill nadh">NADH</span></span>' +
      '<span class="lg"><svg class="sw inh" viewBox="0 0 30 24" width="30" height="24"><line x1="2" y1="12" x2="22" y2="12" stroke="#ff2a2a" stroke-width="3.5" stroke-linecap="round"/><line x1="23" y1="3" x2="23" y2="21" stroke="#ff2a2a" stroke-width="4" stroke-linecap="round"/></svg>block</span>' +
      '<span class="lg"><span class="sw sh"></span>RBC shunt</span>' +
      '</div><div class="h-source"></div></div>';
  }
  function makeHUD(container) {
    container.insertAdjacentHTML('beforeend', hudHTML());
    const r = container.lastElementChild;
    const H = {
      root: r, kicker: $('.h-kicker', r), title: $('.h-title', r), ledger: $('.h-ledger', r), opp: $('.h-opp', r), link: $('.h-link', r),
      map: $('.h-map', r), caption: $('.h-caption', r), source: $('.h-source', r), si: -1, cap: null, vals: {}, shown: {}
    };
    gsap.set([H.ledger, H.opp, H.link, H.map], { autoAlpha: 0 });
    return H;
  }
  function resolve(def, bi) {
    const r = { ctr: null, opp: null, link: null, map: null };
    for (let i = 0; i <= bi; i++) { const b = def.beats[i]; for (const k in r) if (Object.prototype.hasOwnProperty.call(b, k)) r[k] = b[k]; }
    r.cap = def.beats[bi].cap;
    return r;
  }
  D.resolve = function (si, bi) { return resolve(D.scenes[si], bi); };
  const FMT = {
    inv: function (v) { return v ? MINUS + v : '0'; },
    gen: function (v) { return v ? '+' + v : '0'; },
    net: function (v) { return v > 0 ? '+' + v : v < 0 ? MINUS + -v : '0'; },
    nad: function (v) { return v > 0 ? '+' + v : v < 0 ? MINUS + -v : '0'; },
    def: function (v) { return '' + v; }
  };
  function setVal(H, key, el, v, instant, fmt) {
    const old = H.vals[key];
    if (old === v) return;
    H.vals[key] = v;
    const f = FMT[fmt] || FMT.def;
    if (instant || old == null || D.reduced) { el.textContent = f(v); return; }
    const pr = { v: old };
    gsap.to(pr, { v: v, duration: 0.6, ease: 'power2.out', onUpdate: function () { el.textContent = f(Math.round(pr.v)); } });
    const cell = el.parentNode; cell.classList.remove('flash'); void cell.offsetWidth; cell.classList.add('flash');
  }
  function vis(H, key, el, on, instant) {
    if (H.shown[key] === !!on) return;
    H.shown[key] = !!on;
    gsap.to(el, { autoAlpha: on ? 1 : 0, duration: instant || D.reduced ? 0 : 0.5 });
  }
  function applyHUD(H, si, bi, instant) {
    const def = D.scenes[si], R = resolve(def, bi);
    if (H.si !== si) {
      H.si = si;
      H.kicker.innerHTML = def.kicker || '';
      H.title.innerHTML = def.title || '';
      gsap.set([H.kicker, H.title], { autoAlpha: def.hudTitle === false ? 0 : 1 });
      H.source.innerHTML = def.source ? 'Sources: ' + def.source : '';
      if (!instant && !D.reduced && def.hudTitle !== false) gsap.fromTo([H.kicker, H.title], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' });
    }
    // caption
    const capKey = si + '.' + bi;
    if (H.cap !== capKey) {
      H.cap = capKey;
      const olds = Array.prototype.slice.call(H.caption.children);
      const c = document.createElement('div'); c.className = 'cap'; c.innerHTML = R.cap || ''; H.caption.appendChild(c);
      if (!R.cap) c.style.display = 'none';
      if (instant || D.reduced) { olds.forEach(function (o) { o.remove(); }); }
      else {
        olds.forEach(function (o) { gsap.to(o, { autoAlpha: 0, y: -10, duration: 0.3, onComplete: function () { o.remove(); } }); });
        gsap.fromTo(c, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'power2.out' });
      }
    }
    // ledger
    const ctr = R.ctr;
    vis(H, 'ledger', H.ledger, !!ctr, instant);
    if (ctr) {
      const g = function (k) { return $('.v[data-k="' + k + '"]', H.ledger); };
      setVal(H, 'inv', g('inv'), ctr.inv || 0, instant, 'inv');
      setVal(H, 'gen', g('gen'), ctr.gen || 0, instant, 'gen');
      setVal(H, 'net', g('net'), (ctr.gen || 0) - (ctr.inv || 0), instant, 'net');
      setVal(H, 'nadh', g('nadh'), ctr.nadh || 0, instant);
      setVal(H, 'nad', g('nad'), ctr.nad || 0, instant, 'nad');
      $('.tag', H.ledger).innerHTML = ctr.tag || '';
      $('.cell.nad .sub', H.ledger).innerHTML = ctr.nadNote || 'pool change';
      $('.cell.nadh .sub', H.ledger).innerHTML = ctr.nadhNote || 'formed';
    }
    const opp = R.opp;
    vis(H, 'opp', H.opp, opp != null, instant);
    if (opp != null) setVal(H, 'opp', $('.v', H.opp), opp, instant);
    const link = R.link;
    vis(H, 'link', H.link, !!link, instant);
    if (link) {
      H.link.style.top = ctr ? '186px' : '34px';
      setVal(H, 'acoa', $('.v[data-k="acoa"]', H.link), link.acoa, instant);
      setVal(H, 'co2', $('.v[data-k="co2"]', H.link), link.co2, instant);
      setVal(H, 'lnadh', $('.v[data-k="lnadh"]', H.link), link.nadh, instant);
      $('.tag', H.link).innerHTML = link.per || '';
    }
    const map = R.map;
    vis(H, 'map', H.map, !!map, instant);
    if (map) {
      const lo = Math.min.apply(null, map);
      Array.prototype.forEach.call(H.map.querySelectorAll('.mm'), function (row) {
        const s = +row.dataset.s;
        row.classList.toggle('on', map.indexOf(s) >= 0);
        row.classList.toggle('done', s < lo);
      });
    }
  }

  /* ================= scene contexts ================= */
  function newCtx(host, si, print) {
    const def = D.scenes[si];
    const w = document.createElement('div'); w.className = 'world'; host.appendChild(w);
    const ctx = { si: si, def: def, w: w, tls: [], loops: [], print: !!print, reduced: D.reduced || !!print, camState: null, st: {} };
    ctx.svg = K.svg(w);
    ctx.loop = function (t) { if (ctx.print || ctx.reduced) { t.progress(0).kill(); return null; } ctx.loops.push(t); return t; };
    gsap.set(w, { x: 0, y: 0, scale: 1, autoAlpha: 1 });
    try { def.build(ctx); } catch (e) { report(e, 'build s' + (si + 1)); }
    return ctx;
  }
  function teardown(ctx, fade) {
    ctx.tls.forEach(function (t) { t.kill(); });
    ctx.loops.forEach(function (t) { t && t.kill(); });
    ctx.dead = true;
    if (fade) gsap.to(ctx.w, { autoAlpha: 0, duration: fade, onComplete: function () { ctx.w.remove(); } });
    else ctx.w.remove();
  }
  function runInstant(ctx, b) {
    const tl = gsap.timeline({ paused: true });
    try { ctx.def.step(b, tl, ctx); } catch (e) { report(e, 'step s' + (ctx.si + 1) + ' b' + (b + 1)); }
    tl.progress(1, false); tl.kill();
  }
  function runAnim(ctx, b) {
    ctx.tls.forEach(function (t) { t.progress(1, false); });
    const tl = gsap.timeline();
    ctx.tls.push(tl);
    try { ctx.def.step(b, tl, ctx); } catch (e) { report(e, 'step s' + (ctx.si + 1) + ' b' + (b + 1)); }
    if (ctx.reduced) tl.progress(1, false);
  }
  function report(e, where) { D.errors.push(where + ': ' + (e && e.message)); console.error('[deck] ' + where, e); }

  /* ================= live deck ================= */
  let S = null, H = null, host = null;
  function nb(si) { return D.scenes[si].beats.length; }
  function enter(si) {
    resume();
    const old = S;
    S = newCtx(host, si);
    if (old) teardown(old, D.reduced ? 0 : 0.55);
    if (!D.reduced) gsap.fromTo(S.w, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power1.out' });
    D.si = si; D.bi = 0;
    runAnim(S, 0);
    afterChange(false);
  }
  function snap(si, bi) {
    resume();
    const old = S;
    S = newCtx(host, si);
    for (let b = 0; b <= bi; b++) runInstant(S, b);
    if (old) teardown(old, D.reduced ? 0 : 0.3);
    if (!D.reduced) gsap.fromTo(S.w, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 });
    D.si = si; D.bi = bi;
    afterChange(false);
  }
  function afterChange(instant) {
    applyHUD(H, D.si, D.bi, instant);
    // progress
    const segs = document.querySelectorAll('#progress .seg');
    segs.forEach(function (s, i) {
      s.classList.toggle('done', i < D.si);
      $('.fill', s).style.width = i === D.si ? ((D.bi + 1) / nb(i) * 100) + '%' : (i < D.si ? '100%' : '0');
    });
    $('#navlbl').textContent = 'Scene ' + (D.si + 1) + '/' + D.scenes.length + ' · ' + (D.bi + 1) + '/' + nb(D.si);
    try { history.replaceState(null, '', '#' + (D.si + 1) + '.' + (D.bi + 1)); } catch (e) { /* file:// may refuse */ }
    renderNotes(); renderViva(false);
    document.querySelectorAll('#menu .tile').forEach(function (t, i) { t.classList.toggle('cur', i === D.si); });
  }
  D.next = function () {
    if (D.bi < nb(D.si) - 1) { resume(); D.bi++; runAnim(S, D.bi); afterChange(false); }
    else if (D.si < D.scenes.length - 1) enter(D.si + 1);
  };
  D.prev = function () {
    if (D.bi > 0) snap(D.si, D.bi - 1);
    else if (D.si > 0) snap(D.si - 1, nb(D.si - 1) - 1);
  };
  D.goto = function (si, bi) {
    si = Math.max(0, Math.min(D.scenes.length - 1, si));
    if (!bi) enter(si); else snap(si, Math.min(bi, nb(si) - 1));
  };
  D.snap = function (si, bi) { snap(si, bi); };

  /* pause */
  function resume() { if (D.paused) togglePause(); }
  function togglePause() {
    D.paused = !D.paused;
    if (D.paused) gsap.globalTimeline.pause(); else gsap.globalTimeline.resume();
    document.body.classList.toggle('paused', D.paused);
  }

  /* panels */
  function renderNotes() {
    const p = $('#notes'); if (!p || !p.classList.contains('open')) return;
    const def = D.scenes[D.si];
    p.innerHTML = '<h3>Speaker notes · Scene ' + (D.si + 1) + '</h3>' + (def.notes || '') +
      '<div class="beatcue">Beat ' + (D.bi + 1) + ' of ' + nb(D.si) + ': ' + (def.beats[D.bi].cap || '') + '</div>';
  }
  function renderViva(keepAns) {
    const p = $('#viva'); if (!p) return;
    const v = D.scenes[D.si].viva || { q: '', a: '' };
    p.innerHTML = '<div class="vk">Viva question · Scene ' + (D.si + 1) + '</div><div class="vq">' + v.q + '</div><div class="va">' + v.a + '</div><span class="vbtn">Reveal answer (A)</span>';
    if (!keepAns) p.classList.remove('ans');
    $('.vbtn', p).onclick = function () { p.classList.add('ans'); };
  }
  function toggle(id, force) {
    const p = $('#' + id); const on = force != null ? force : !p.classList.contains('open');
    ['notes', 'viva', 'menu'].forEach(function (o) { if (o !== id && on && (id === 'menu' || o === 'menu')) $('#' + o).classList.remove('open'); });
    p.classList.toggle('open', on);
    if (id === 'notes') renderNotes();
    if (id === 'viva' && on) renderViva(false);
  }
  function closeAll() { ['notes', 'viva', 'menu'].forEach(function (o) { $('#' + o).classList.remove('open'); }); }
  function buildMenu() {
    const m = $('#menu');
    let h = '<h2>Jump to scene</h2><div class="grid">';
    D.scenes.forEach(function (d, i) { h += '<div class="tile" data-i="' + i + '"><div class="no">' + String(i + 1).padStart(2, '0') + '</div><div class="tt">' + (d.menu || d.title) + '</div><div class="kk">' + (d.kicker || '') + '</div></div>'; });
    h += '</div><div class="keys"><kbd>→</kbd><kbd>Space</kbd> next · <kbd>←</kbd> back · <kbd>Home</kbd>/<kbd>End</kbd> first/last · <kbd>F</kbd> fullscreen · <kbd>P</kbd> pause · <kbd>N</kbd> notes · <kbd>Q</kbd> viva (<kbd>A</kbd> answer) · <kbd>G</kbd> this menu · <kbd>M</kbd> reduced motion · <kbd>Esc</kbd> close · type a number + <kbd>Enter</kbd> to jump</div>';
    m.innerHTML = h;
    m.querySelectorAll('.tile').forEach(function (t) { t.onclick = function () { closeAll(); D.goto(+t.dataset.i, 0); }; });
  }
  function fullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
  }

  /* keyboard */
  let numBuf = '', numT = 0;
  function onKey(e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const k = e.key, menuOpen = $('#menu').classList.contains('open');
    if (/^[0-9]$/.test(k)) { numBuf += k; clearTimeout(numT); numT = setTimeout(function () { numBuf = ''; }, 1500); return; }
    if (k === 'Enter' && numBuf) { const n = parseInt(numBuf, 10); numBuf = ''; if (n >= 1 && n <= D.scenes.length) { closeAll(); D.goto(n - 1, 0); } e.preventDefault(); return; }
    switch (k) {
      case 'ArrowRight': case 'PageDown': case ' ': case 'Spacebar': case 'ArrowDown':
        e.preventDefault(); if (!menuOpen) D.next(); break;
      case 'ArrowLeft': case 'PageUp': case 'ArrowUp': case 'Backspace':
        e.preventDefault(); if (!menuOpen) D.prev(); break;
      case 'Home': e.preventDefault(); closeAll(); D.goto(0, 0); break;
      case 'End': e.preventDefault(); closeAll(); D.goto(D.scenes.length - 1, 0); break;
      case 'f': case 'F': fullscreen(); break;
      case 'p': case 'P': togglePause(); break;
      case 'n': case 'N': toggle('notes'); break;
      case 'q': case 'Q': toggle('viva'); break;
      case 'a': case 'A': if ($('#viva').classList.contains('open')) $('#viva').classList.add('ans'); break;
      case 'g': case 'G': toggle('menu'); break;
      case 'm': case 'M': setReduced(!D.reduced); break;
      case 'Escape': closeAll(); break;
    }
  }
  function setReduced(on) {
    D.reduced = on; document.body.classList.toggle('reduced', on);
    if (S) snap(D.si, D.bi);
    flashHint(on ? 'Reduced motion ON' : 'Reduced motion OFF');
  }
  function flashHint(t) { const h = $('#hint'); h.textContent = t; gsap.killTweensOf(h); gsap.fromTo(h, { opacity: 1 }, { opacity: 0, delay: 1.6, duration: 0.6 }); }

  /* stage scaling */
  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    $('#stage').style.transform = 'scale(' + s + ')';
  }

  /* ambient dust (cheap canvas) */
  function dust() {
    const c = $('#dust'); c.width = 960; c.height = 540; c.style.width = '1920px'; c.style.height = '1080px';
    const g = c.getContext('2d'), R = K.rng(11), P = [];
    for (let i = 0; i < 46; i++) P.push({ x: R() * 960, y: R() * 540, r: 0.5 + R() * 1.6, vx: (R() - 0.5) * 0.12, vy: -0.03 - R() * 0.1, a: 0.08 + R() * 0.35 });
    function draw() {
      g.clearRect(0, 0, 960, 540);
      for (const p of P) { g.globalAlpha = p.a; g.fillStyle = '#b8d0ff'; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill(); }
    }
    draw();
    function tick() {
      if (!D.paused && !D.reduced && !document.hidden) {
        for (const p of P) { p.x += p.vx; p.y += p.vy; if (p.y < -4) { p.y = 544; } if (p.x < -4) p.x = 964; if (p.x > 964) p.x = -4; }
        draw();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function grain(el) {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const im = g.createImageData(256, 256); const R = K.rng(3);
      for (let i = 0; i < im.data.length; i += 4) { const v = R() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      g.putImageData(im, 0, 0); el.style.backgroundImage = 'url(' + c.toDataURL() + ')';
    } catch (e) { /* ignore */ }
  }

  /* fps meter (?fps) */
  function fpsMeter() {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;left:8px;top:8px;z-index:99;font:600 13px Inter,sans-serif;color:#9ff5ea;background:rgba(0,0,0,.6);padding:4px 8px;border-radius:6px';
    document.body.appendChild(el);
    let last = performance.now(), frames = 0, worst = 0, prev = last;
    D.perf = { long: 0, frames: 0 };
    function t(now) {
      frames++; const dt = now - prev; prev = now; if (dt > worst) worst = dt; D.perf.frames++; if (dt > 50) D.perf.long++;
      if (now - last > 1000) { el.textContent = Math.round(frames * 1000 / (now - last)) + ' fps · worst ' + Math.round(worst) + 'ms · long>50ms: ' + D.perf.long; frames = 0; worst = 0; last = now; }
      requestAnimationFrame(t);
    }
    requestAnimationFrame(t);
  }

  /* ================= print ================= */
  D.buildPrint = function () {
    const root = $('#printroot'); root.innerHTML = '';
    const savedReduced = D.reduced; D.reduced = true;
    let pageNo = 0;
    D.scenes.forEach(function (def, si) {
      (def.printBeats || [def.beats.length - 1]).forEach(function (bi) {
        pageNo++;
        const page = document.createElement('div'); page.className = 'ppage';
        const ps = document.createElement('div'); ps.className = 'pstage'; page.appendChild(ps); root.appendChild(page);
        const vg = document.createElement('div'); vg.className = 'bgfx'; vg.style.background = 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.5) 100%)'; ps.appendChild(vg);
        const wh = document.createElement('div'); wh.style.cssText = 'position:absolute;inset:0;'; ps.appendChild(wh);
        const ctx = newCtx(wh, si, true);
        for (let b = 0; b <= bi; b++) runInstant(ctx, b);
        const PH = makeHUD(ps); applyHUD(PH, si, bi, true);
        const pn = document.createElement('div');
        pn.style.cssText = 'position:absolute;right:50px;top:1046px;font:600 16px Inter,sans-serif;color:#7484a8';
        pn.textContent = 'METABOLIC JOURNEY · Scene ' + (si + 1) + ' of ' + D.scenes.length + ' · page ' + pageNo;
        ps.appendChild(pn);
      });
    });
    D.reduced = savedReduced;
  };

  /* ================= self test ================= */
  // Steps every beat forward (instantly) and back, checks ledger DOM against beat data, reports errors.
  D.selfTest = function () {
    const out = { visited: 0, mismatches: [], errors: [] };
    const e0 = D.errors.length;
    const saved = D.reduced; D.reduced = true;
    function check(tag) {
      const R = resolve(D.scenes[D.si], D.bi), c = R.ctr;
      if (c) {
        const read = function (k) { return $('.h-ledger .v[data-k="' + k + '"]').textContent; };
        const exp = { inv: FMT.inv(c.inv || 0), gen: FMT.gen(c.gen || 0), net: FMT.net((c.gen || 0) - (c.inv || 0)), nadh: '' + (c.nadh || 0), nad: FMT.nad(c.nad || 0) };
        for (const k in exp) if (read(k) !== exp[k]) out.mismatches.push(tag + ' s' + (D.si + 1) + 'b' + (D.bi + 1) + ' ' + k + ' ' + read(k) + '≠' + exp[k]);
      }
      if (!!c !== (gsap.getProperty(H.ledger, 'opacity') > 0.5)) out.mismatches.push(tag + ' s' + (D.si + 1) + 'b' + (D.bi + 1) + ' ledger visibility');
    }
    D.goto(0, 0);
    for (let guard = 0; guard < 500; guard++) {
      check('fwd'); out.visited++;
      if (D.si === D.scenes.length - 1 && D.bi === nb(D.si) - 1) break;
      D.next();
    }
    for (let guard = 0; guard < 500; guard++) {
      D.prev(); check('back');
      if (D.si === 0 && D.bi === 0) break;
    }
    D.reduced = saved;
    out.errors = D.errors.slice(e0);
    return out;
  };

  /* ================= boot ================= */
  function boot() {
    const qs = location.search;
    D.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (/reduced/.test(qs)) D.reduced = true;
    document.body.classList.toggle('reduced', D.reduced);
    window.addEventListener('error', function (e) { D.errors.push('window: ' + e.message); });
    if (/print/.test(qs)) {
      document.body.classList.add('printmode');
      D.buildPrint();
      document.documentElement.setAttribute('data-ready', '1');
      return;
    }
    host = $('#worldhost');
    H = makeHUD($('#hudhost'));
    grain($('#grain'));
    dust();
    fit(); window.addEventListener('resize', fit);
    // progress segments
    const pr = $('#progress');
    D.scenes.forEach(function (d, i) {
      const s = document.createElement('div'); s.className = 'seg'; s.title = (i + 1) + '. ' + (d.menu || d.title).replace(/<[^>]+>/g, '');
      s.innerHTML = '<div class="fill"></div>'; s.onclick = function () { D.goto(i, 0); }; pr.appendChild(s);
    });
    $('#btnprev').onclick = function () { D.prev(); };
    $('#btnnext').onclick = function () { D.next(); };
    buildMenu();
    document.addEventListener('keydown', onKey);
    window.addEventListener('beforeprint', function () { D.buildPrint(); });
    window.addEventListener('afterprint', function () { $('#printroot').innerHTML = ''; });
    if (/fps/.test(qs)) fpsMeter();
    const m = /^#(\d+)(?:\.(\d+))?/.exec(location.hash);
    if (m) D.goto(+m[1] - 1, m[2] ? +m[2] - 1 : 0); else enter(0);
    if (!m) flashHint('→ / Space next · ← back · G menu · N notes · Q viva · F fullscreen');
    document.documentElement.setAttribute('data-ready', '1');
  }
  D.boot = function () {
    let done = false; const go = function () { if (!done) { done = true; boot(); } };
    if (document.fonts && document.fonts.load) {
      Promise.all(['400 20px Inter', '700 20px Inter', 'italic 600 20px Inter', '400 20px "Instrument Serif"', 'italic 400 20px "Instrument Serif"']
        .map(function (f) { return document.fonts.load(f).catch(function () {}); })).then(go, go);
      setTimeout(go, 2500);
    } else go();
  };
})();
