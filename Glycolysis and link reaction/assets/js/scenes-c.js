/* METABOLIC JOURNEY — scenes 11–15 */
(function () {
  'use strict';
  const D = window.Deck;

  function drawRBC(svg, parent, cx, cy, r) {
    const g = K.sg(parent || svg, { class: 'rbc' });
    const f = K.rgrad(svg, [[0, '#f8a0ab'], [0.36, '#e4566c'], [0.7, '#c71f41'], [0.92, '#8f0f2a'], [1, '#5c0618']]);
    K.s(g, 'circle', { cx, cy, r: r + 16, fill: 'none', stroke: '#ff5c7a', 'stroke-opacity': 0.12, 'stroke-width': 30 });
    K.s(g, 'circle', { cx, cy, r, fill: f, stroke: '#ffb3c0', 'stroke-width': 4, 'stroke-opacity': 0.75 });
    K.s(g, 'circle', { cx, cy, r: r * 0.46, fill: 'none', stroke: '#ffe0e6', 'stroke-opacity': 0.16, 'stroke-width': r * 0.09 });
    const R = K.rng(cx | 0);
    for (let i = 0; i < 30; i++) { const a = R() * 6.28, d = R() * r * 0.9; K.s(g, 'circle', { cx: cx + d * Math.cos(a), cy: cy + d * Math.sin(a), r: 4 + R() * 5, fill: '#ffd0d8', opacity: 0.07 }); }
    return g;
  }
  function mitoRot(svg, parent, cx, cy, w, h, rot, o) {
    const g = K.sg(parent, { transform: 'rotate(' + rot + ' ' + cx + ' ' + cy + ')' });
    K.mito({ _defs: svg._defs, appendChild: function (e) { return g.appendChild(e); } }, cx, cy, w, h, o);
    return g;
  }
  function membraneBand(svg, y, th, col, x0, x1) { return K.bilayer(svg, y, th, col, x0, x1); }
  function hill(p, p50) { const n = 2.7; return 100 * Math.pow(p, n) / (Math.pow(p, n) + Math.pow(p50, n)); }

  /* ============ 11. MATURE RBC + SHUNT ============ */
  D.add({
    id: 'rbc', kicker: 'Chapter II · The red cell', title: 'The RBC and its <em>shunt</em>', menu: 'RBC: Rapoport–Luebering shunt',
    source: 'Lippincott 8e Ch. 8 (2,3-BPG) · van Wijk & van Solinge, Blood 2005 · Rapoport & Luebering, J Biol Chem 1950',
    beats: [
      { cap: 'A mature RBC has <b>no nucleus, no mitochondria, no organelles</b>. It\'s essentially a bag of haemoglobin.' },
      { cap: '<b>Glycolysis is its only ATP source.</b> Glucose enters via <b>GLUT1</b> (no insulin needed). ATP runs the Na<sup>+</sup>/K<sup>+</sup> pump and keeps the membrane intact.' },
      { cap: 'The <b class="c-sh">Rapoport–Luebering shunt</b>: bisphosphoglycerate mutase makes <b>2,3-BPG</b>; 2,3-BPG phosphatase turns it into 3-PG, <b>bypassing PGK</b>.', ctr: { inv: 2, gen: 4, nadh: 2, nad: -2, tag: 'RBC · none diverted yet' } },
      { cap: 'One triose diverted: PGK is skipped once. ATP generated 4 → 3, <b>net 2 → 1</b>. Shown as an opportunity lost, not as ATP spent.', ctr: { inv: 2, gen: 3, nadh: 2, nad: -2, tag: 'RBC · 1 triose via shunt' }, opp: 1 },
      { cap: 'Both trioses diverted: <b>net 2 → 0</b> (the pyruvate kinase steps still run). Rule: <b>each diverted 1,3-BPG loses 1 ATP</b>.', ctr: { inv: 2, gen: 2, nadh: 2, nad: -2, tag: 'RBC · 2 trioses via shunt' }, opp: 2 },
      { cap: 'Why pay? The RBC trades some ATP for <b>2,3-BPG</b>, which helps haemoglobin release O<sub>2</sub> in the tissues.' }
    ],
    printBeats: [3],
    build: function (S) {
      K.backdrop(S, 'rbc', 11);
      S.rbcG = K.sg(S.svg, {});
      drawRBC(S.svg, S.rbcG, 700, 560, 300);
      gsap.set(S.rbcG, { autoAlpha: 0 });
      S.inL = K.layer(S.w, 0, 0, true);
      S.rbcLbl = K.node(S.inL, 'mname', 'Mature RBC<small>biconcave disc · ~7.5 µm</small>', 700, 560);
      // absent organelles (drawn OUTSIDE the cell)
      const ab = K.sg(S.svg, {}, true); S.absent = ab;
      K.s(ab, 'circle', { cx: 1180, cy: 300, r: 30, fill: '#4b3fb0' }); K.s(ab, 'circle', { cx: 1172, cy: 294, r: 10, fill: '#241c66' });
      mitoRot(S.svg, ab, 1180, 400, 74, 34, 0);
      for (let k = 0; k < 6; k++) K.s(ab, 'circle', { cx: 1158 + (k % 3) * 22, cy: 490 + Math.floor(k / 3) * 18, r: 6, fill: '#a9c8ff' });
      [300, 400, 498].forEach(function (y) { K.crossSvg(ab, 1180, y, 22, true); });
      S.abL = [['No nucleus', 300], ['No mitochondria', 400], ['No ribosomes / ER', 498]].map(function (a) { return K.node(S.w, 'absent', a[0], 1240, a[1], { anchor: 'l' }); });
      // GLUT1 on left rim
      S.glut = K.layer(S.inL, 400, 560, false);
      K.node(S.glut, 'prot', '', 0, -24, { show: true, style: 'width:110px;height:38px' });
      K.node(S.glut, 'prot', '', 0, 24, { show: true, style: 'width:110px;height:38px' });
      K.node(S.glut, 'tagchip rev', 'GLUT1', 0, -76, { show: true });
      S.glc = K.sugar(S.inL, 'glc', 'Glc', 230, 560, false);
      S.only = K.chip(S.inL, 'slp', 'Glycolysis = only ATP source', 700, 470, { style: 'font-size:19px' });
      S.lac = K.chip(S.inL, 'rev', 'end product: lactate', 700, 660, { style: 'font-size:17px' });
      S.uses = K.card(S.w, 'red', '<h4 style="font-size:26px">ATP is needed for</h4><div class="row">• <b>Na<sup>+</sup>/K<sup>+</sup>-ATPase</b> (cell volume)</div><div class="row">• Ca<sup>2+</sup> pump</div><div class="row">• Membrane shape and flexibility</div>', 1140, 600, 560);
      // shunt diagram
      S.panel = K.node(S.w, 'shuntpanel', '', 1080, 290, { anchor: 'tl', style: 'width:520px;height:540px' });
      S.ptitle = K.node(S.w, 'shunttitle', 'Rapoport–Luebering shunt (RBC)', 1340, 290);
      S.n13 = K.node(S.w, 'mapnode pay', '1,3-BPG', 900, 360);
      S.n3 = K.node(S.w, 'mapnode pay', '3-PG', 900, 770);
      S.n23 = K.node(S.w, 'mapnode', '2,3-BPG', 1340, 565, { style: 'border-color:#a78bfa;background:rgba(109,40,217,.45);font-size:30px' });
      S.main = K.react(S.svg, 900, 410, 900, 720, true, { head: 20 });
      S.pgk = K.enz(S.w, 'PGK<small>normal route</small>', 840, 520, { anchor: 'r' });
      S.adp = K.pill(S.w, 'adp', 'ADP', 700, 630, { size: 'sm' });
      S.atp = K.pill(S.w, 'atp', 'ATP <span class="tagmade">MADE</span>', 700, 630, { size: 'sm' });
      S.ghost = K.pill(S.w, 'ghost', 'ATP not formed', 700, 630, { size: 'sm' });
      S.ghost2 = K.pill(S.w, 'ghost', 'ATP not formed ×2', 700, 630, { size: 'sm' });
      S.mut = K.arrow(S.svg, 985, 385, 1255, 545, { color: '#c4b5fd', w: 6 });
      S.pho = K.arrow(S.svg, 1255, 595, 985, 750, { color: '#c4b5fd', w: 6 });
      S.mutL = K.enz(S.w, 'bisphosphoglycerate mutase', 1150, 420, { anchor: 'l', style: 'font-size:22px;color:#e0d4ff' });
      S.phoL = K.enz(S.w, '2,3-BPG phosphatase', 1150, 720, { anchor: 'l', style: 'font-size:22px;color:#e0d4ff' });
      S.piOut = K.pill(S.w, 'pi', 'P<sub>i</sub>', 1100, 722, { size: 'sm' });
      S.tok = [K.node(S.w, 'token', '1,3-BPG', 900, 360), K.node(S.w, 'token', '1,3-BPG', 900, 360)];
      S.why = K.card(S.w, 'purple', '<h4 style="font-size:28px">The trade-off</h4><div class="row"><b>Lose:</b> up to 1 ATP per triose diverted</div><div class="row"><b>Gain:</b> 2,3-BPG at about the same molar concentration as Hb → easier O<sub>2</sub> unloading</div>', 80, 190, 600);
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.fade(tl, S.rbcG, 0, 1);
        tl.from(S.rbcG, { scale: 0.85, svgOrigin: '700 560', duration: 1.4, ease: 'power3.out' }, 0);
        K.fadeIn(tl, S.rbcLbl, 0.5);
        K.fade(tl, S.absent, 0.9);
        K.fadeIn(tl, S.abL, 1.0, { stagger: 0.2 });
      } else if (i === 1) {
        K.out(tl, S.rbcLbl, 0, 0.3);
        K.fade(tl, S.glut, 0.2);
        K.pop(tl, S.glc.g, 0.4);
        S.glc.move(tl, 560, 560, 0.8, 1.3);
        K.pop(tl, S.only, 1.6);
        K.pop(tl, S.lac, 1.9);
        K.fadeIn(tl, S.uses, 1.2);
      } else if (i === 2) {
        K.out(tl, [S.absent, S.uses, S.only, S.lac, S.glc.g].concat(S.abL), 0, 0.4);
        tl.to(S.rbcG, { scale: 0.55, x: -415, y: 85, svgOrigin: '700 560', duration: 1.2, ease: 'power3.inOut' }, 0.2);
        tl.to(S.inL, { scale: 0.55, x: -415 + 700 * 0.45, y: 85 + 560 * 0.45, duration: 1.2, ease: 'power3.inOut' }, 0.2);
        K.fade(tl, S.panel, 0.8, 0.6);
        K.pop(tl, S.ptitle, 1.0);
        K.fadeIn(tl, [S.n13, S.n3], 1.0, { stagger: 0.1 });
        K.draw(tl, S.main, 1.2, 0.6);
        K.fade(tl, S.pgk, 1.4);
        K.pop(tl, S.adp, 1.5);
        K.swap(tl, S.adp, S.atp, 2.0);
        K.draw(tl, S.mut, 2.2, 0.6);
        K.fade(tl, S.mutL, 2.4);
        K.pop(tl, S.n23, 2.6);
        K.draw(tl, S.pho, 2.9, 0.6);
        K.fade(tl, S.phoL, 3.1);
        K.pop(tl, S.piOut, 3.3);
      } else if (i === 3 || i === 4) {
        const t = S.tok[i - 3];
        if (i === 3) K.swap(tl, S.atp, S.ghost, 0.2); else K.swap(tl, S.ghost, S.ghost2, 0.2);
        K.pop(tl, t, 0.4);
        tl.to(t, { x: 1340, y: 565, duration: 1.0, ease: 'power2.inOut' }, 0.9);
        tl.to(S.n23, { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1 }, 1.9);
        tl.to(t, { x: 900, y: 770, duration: 1.0, ease: 'power2.inOut' }, 2.2);
        tl.to(t, { autoAlpha: 0, duration: 0.3 }, 3.2);
        tl.fromTo(S.piOut, { scale: 1 }, { scale: 1.3, duration: 0.25, yoyo: true, repeat: 1 }, 2.5);
      } else if (i === 5) {
        K.fadeIn(tl, S.why, 0.1);
      }
    },
    notes: '<p>Mature RBCs lose their nucleus, mitochondria and ribosomes. They can\'t do oxidative phosphorylation, so glycolysis, ending in lactate, is their only ATP source. ATP keeps the Na<sup>+</sup>/K<sup>+</sup> pump and the membrane cytoskeleton working, so the cell keeps its shape and deformability.</p><p>RBCs have a side path: bisphosphoglycerate mutase converts 1,3-BPG to 2,3-BPG, and 2,3-BPG phosphatase converts it to 3-PG. This bypasses phosphoglycerate kinase.</p><p>Bookkeeping: each 1,3-BPG sent down the shunt loses one ATP that PGK would have made. One triose diverted, net 1. Both diverted, net 0. The pyruvate kinase steps still give their ATP. This is a lost opportunity, not an ATP being spent.</p><p>Wording note: your notes say "net zero" (both trioses) and the reaction figure says "1 ATP per glucose" (one triose). Both follow from the per-triose rule.</p><h4>Viva points</h4><ul><li>In reality only a fraction of 1,3-BPG goes through the shunt, so RBCs still make net ATP.</li><li>2,3-BPG levels rise in chronic hypoxia, high altitude, anaemia and pyruvate kinase deficiency.</li></ul>',
    viva: { q: 'What is the Rapoport–Luebering shunt and what does it cost the RBC in ATP?', a: 'In RBCs, <b>bisphosphoglycerate mutase</b> converts 1,3-BPG to <b>2,3-BPG</b>, which <b>2,3-BPG phosphatase</b> converts to 3-PG. This <b>bypasses PGK</b>, so each 1,3-BPG diverted loses 1 ATP: net yield 2 → 1 (one triose) → 0 (both).' }
  });

  /* ============ 12. 2,3-BPG AND HAEMOGLOBIN ============ */
  D.add({
    id: 'hb', kicker: 'Chapter II · The red cell', title: '2,3-BPG and <em>haemoglobin</em>', menu: '2,3-BPG, Hb and the O₂ curve',
    source: 'Lippincott 8e Ch. 3 (Hb) & Ch. 8 · Benesch & Benesch, BBRC 1967 · NCBI StatPearls: Oxyhemoglobin Dissociation Curve; Pyruvate Kinase Deficiency',
    beats: [
      { cap: 'Haemoglobin switches between <b>R</b> (relaxed, high O<sub>2</sub> affinity) and <b>T</b> (tense, low affinity) states.' },
      { cap: '<b>2,3-BPG</b> binds the central cavity of <b>deoxyHb</b> (between the β-chains) and stabilises the <b>T-state</b>.' },
      { cap: 'O<sub>2</sub> dissociation curve: sigmoid. Normal <b>P<sub>50</sub> ≈ 26 mmHg</b>, the pO<sub>2</sub> at which Hb is 50% saturated.' },
      { cap: '↑ 2,3-BPG shifts the curve <b>right</b>: P<sub>50</sub> rises, affinity falls, and <b>more O<sub>2</sub> is unloaded</b> in the tissues.' },
      { cap: '<b>Pyruvate kinase deficiency</b>: low ATP, membrane damage, chronic haemolysis. Upstream 2,3-BPG rises, giving a compensatory right shift.' }
    ],
    printBeats: [3],
    build: function (S) {
      K.backdrop(S, 'rbc', 12);
      // haemoglobin tetramer
      S.hb = K.layer(S.w, 490, 560, false);
      const sub = function (cls, lbl, x, y) { const l = K.layer(S.hb, x, y, true); K.node(l, 'hbsub ' + cls, lbl, 0, 0, { show: true }); return l; };
      S.b1 = sub('b', '<span>β<sub>1</sub></span>', -100, -100); S.b2 = sub('b', '<span>β<sub>2</sub></span>', 100, -100);
      S.a1 = sub('a', '<span>α<sub>1</sub></span>', -100, 100); S.a2 = sub('a', '<span>α<sub>2</sub></span>', 100, 100);
      S.subs = [S.b1, S.b2, S.a1, S.a2];
      S.o2 = [];
      [[S.b1, -60, -48], [S.b2, 60, -48], [S.a1, -60, 48], [S.a2, 60, 48]].forEach(function (s) {
        K.node(s[0], 'haem', '', s[1], s[2], { show: true });
        S.o2.push(K.node(S.hb, 'o2', '<i></i><i></i>', (s[0] === S.b1 || s[0] === S.a1 ? -100 : 100) + s[1] * 1.55, (s[0] === S.b1 || s[0] === S.b2 ? -100 : 100) + s[2] * 1.55, { show: true }));
      });
      S.state = [K.chip(S.w, 'rev', 'R-state · oxyHb · high affinity', 490, 820, { style: 'font-size:19px' }), K.chip(S.w, 'purple', 'T-state · deoxyHb · low affinity', 490, 820, { style: 'font-size:19px' })];
      S.bpg = K.chain(S.w, { n: 3, x: 490, y: 230, gap: 50, labels: ['1', '2', '3'], small: true });
      S.bpg.addP(1, 'up', false, true); S.bpg.addP(2, 'up', false, true);
      gsap.set(S.bpg.g, { autoAlpha: 0, scale: 0.75 });
      S.bpgL = K.chip(S.w, 'purple', '2,3-BPG · 1 per tetramer', 490, 330, { style: 'font-size:18px' });
      // chart
      const ox = 1060, oy = 800, W = 760, Hh = 520, X = function (p) { return ox + p * W / 100; }, Y = function (s) { return oy - s * Hh / 100; };
      S.X = X; S.Y = Y;
      const ch = K.sg(S.svg, {}, true); S.chart = ch;
      for (let t = 0; t <= 100; t += 20) {
        K.s(ch, 'line', { x1: X(t), y1: oy, x2: X(t), y2: Y(100), stroke: '#8fa3d6', 'stroke-opacity': 0.12, 'stroke-width': 1.5 });
        K.s(ch, 'line', { x1: ox, y1: Y(t), x2: X(100), y2: Y(t), stroke: '#8fa3d6', 'stroke-opacity': 0.12, 'stroke-width': 1.5 });
        K.text(ch, '' + t, X(t), oy + 38, { size: 25, fill: '#c3cfee' });
        K.text(ch, '' + t, ox - 16, Y(t) + 9, { size: 25, fill: '#c3cfee', anchor: 'end' });
      }
      K.s(ch, 'line', { x1: ox, y1: oy, x2: X(100) + 10, y2: oy, stroke: '#dbe4ff', 'stroke-width': 3 });
      K.s(ch, 'line', { x1: ox, y1: oy, x2: ox, y2: Y(100) - 10, stroke: '#dbe4ff', 'stroke-width': 3 });
      K.text(ch, 'pO₂ (mmHg)', X(50), oy + 82, { size: 29, fill: '#eef2ff' });
      const yl = K.text(ch, '% Hb saturation', ox - 78, Y(50), { size: 29, fill: '#eef2ff' }); yl.setAttribute('transform', 'rotate(-90 ' + (ox - 78) + ' ' + Y(50) + ')');
      K.text(ch, 'tissues ~40', X(40), Y(100) - 16, { size: 22, fill: '#c3cfee' });
      K.text(ch, 'lungs ~100', X(100) - 40, Y(100) - 16, { size: 22, fill: '#c3cfee' });
      const path = function (p50) { let d = ''; for (let p = 0; p <= 100; p += 1) d += (p ? ' L' : 'M') + X(p).toFixed(1) + ',' + Y(hill(p, p50)).toFixed(1); return d; };
      S.cN = K.s(S.svg, 'path', { d: path(26), fill: 'none', stroke: '#f43f5e', 'stroke-width': 6, 'stroke-linecap': 'round' });
      S.cR = K.s(S.svg, 'path', { d: path(31), fill: 'none', stroke: '#a78bfa', 'stroke-width': 6, 'stroke-linecap': 'round' });
      [S.cN, S.cR].forEach(function (p) { const L = p.getTotalLength(); p._L = L; gsap.set(p, { attr: { 'stroke-dasharray': L + ' ' + L, 'stroke-dashoffset': L } }); });
      S.p50N = K.sg(S.svg, {}, true);
      K.s(S.p50N, 'path', { d: 'M' + ox + ',' + Y(50) + ' H' + X(26) + ' V' + oy, fill: 'none', stroke: '#fda4af', 'stroke-width': 2.5, 'stroke-dasharray': '8 7' });
      K.s(S.p50N, 'circle', { cx: X(26), cy: Y(50), r: 8, fill: '#f43f5e' });
      S.p50NL = K.chip(S.w, 'irr', 'Normal P<sub>50</sub> ≈ 26 mmHg', X(26) + 200, Y(50) + 60, { style: 'border-color:#f43f5e;color:#ffd0d8;font-size:20px' });
      S.p50R = K.sg(S.svg, {}, true);
      K.s(S.p50R, 'path', { d: 'M' + X(26) + ',' + Y(50) + ' H' + X(31) + ' V' + oy, fill: 'none', stroke: '#c4b5fd', 'stroke-width': 2.5, 'stroke-dasharray': '8 7' });
      K.s(S.p50R, 'circle', { cx: X(31), cy: Y(50), r: 8, fill: '#a78bfa' });
      S.p50RL = K.chip(S.w, 'purple', 'P<sub>50</sub> ↑ (right shift)', X(31) + 200, Y(50) + 115, { style: 'font-size:20px' });
      S.shiftA = K.arrow(S.svg, X(18), Y(66), X(30), Y(66), { color: '#c4b5fd', w: 5 });
      S.tis = K.sg(S.svg, {}, true);
      K.s(S.tis, 'line', { x1: X(40), y1: oy, x2: X(40), y2: Y(hill(40, 26)), stroke: '#7dd3fc', 'stroke-width': 2.5, 'stroke-dasharray': '6 6' });
      K.s(S.tis, 'line', { x1: X(40) + 14, y1: Y(hill(40, 26)), x2: X(40) + 14, y2: Y(hill(40, 31)), stroke: '#7dd3fc', 'stroke-width': 5 });
      S.tisL = K.chip(S.w, 'rev', 'more O<sub>2</sub> released at tissue pO<sub>2</sub>', X(40) + 40, Y(70), { anchor: 'l', style: 'font-size:20px;border-color:#7dd3fc;color:#d4f1ff' });
      S.legN = K.lbl(S.w, '<span style="display:inline-block;width:30px;height:5px;border-radius:3px;background:#f43f5e;vertical-align:middle;margin-right:8px"></span>normal', X(62), Y(14), { anchor: 'l' });
      S.legR = K.lbl(S.w, '<span style="display:inline-block;width:30px;height:5px;border-radius:3px;background:#a78bfa;vertical-align:middle;margin-right:8px"></span>↑ 2,3-BPG (illustrative)', X(62), Y(5), { anchor: 'l' });
      // PK deficiency
      S.scrimL = K.node(S.w, '', '', 0, 0, { anchor: 'tl', style: 'width:960px;height:1080px;background:linear-gradient(90deg,rgba(4,8,20,.9),rgba(4,8,20,.75) 85%,rgba(4,8,20,0))' });
      S.pk = K.card(S.w, 'red', '<h4>Pyruvate kinase deficiency</h4>' +
        '<div class="flow" style="flex-wrap:wrap;gap:10px;margin:14px 0 16px"><span class="fc dn">PK ↓</span><span class="fa">→</span><span class="fc dn">ATP ↓</span><span class="fa">→</span><span class="fc">Na<sup>+</sup>/K<sup>+</sup> pump fails · membrane damage</span><span class="fa">→</span><span class="fc dn">chronic haemolysis</span></div>' +
        '<div class="flow" style="gap:10px;margin-bottom:16px"><span class="fc">upstream intermediates pile up</span><span class="fa">→</span><span class="fc" style="border-color:#a78bfa;color:#e0d4ff">2,3-BPG ↑</span><span class="fa">→</span><span class="fc up">right shift</span></div>' +
        '<div class="row">The right shift improves O<sub>2</sub> delivery and partly offsets the anaemia.</div><div class="row" style="color:var(--ink3)">Contrast: hexokinase deficiency → 2,3-BPG ↓ → left shift.</div>', 70, 200, 860);
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.fade(tl, S.hb, 0, 0.8);
        tl.from(S.subs, { scale: 0.6, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.6)' }, 0.1);
        K.pop(tl, S.o2, 0.8, { stagger: 0.1 });
        K.pop(tl, S.state[0], 1.2);
      } else if (i === 1) {
        tl.to(S.o2, { autoAlpha: 0, x: function (k) { return '+=' + (k % 2 ? 120 : -120); }, y: '-=80', duration: 0.9, stagger: 0.1 }, 0.1);
        tl.to(S.b1, { x: -128, rotation: -6, duration: 1, ease: 'power2.inOut' }, 0.6);
        tl.to(S.b2, { x: 128, rotation: 6, duration: 1, ease: 'power2.inOut' }, 0.6);
        tl.to(S.a1, { x: -112, rotation: 4, duration: 1, ease: 'power2.inOut' }, 0.6);
        tl.to(S.a2, { x: 112, rotation: -4, duration: 1, ease: 'power2.inOut' }, 0.6);
        K.swap(tl, S.state[0], S.state[1], 0.9);
        K.fade(tl, S.bpg.g, 1.2, 0.4);
        K.pop(tl, S.bpgL, 1.2);
        tl.to(S.bpg.g, { y: 480, scale: 0.7, duration: 1.1, ease: 'power2.inOut' }, 1.6);
      } else if (i === 2) {
        K.fade(tl, S.chart, 0, 0.6);
        tl.to(S.cN, { attr: { 'stroke-dashoffset': 0 }, duration: 1.6, ease: 'power1.inOut' }, 0.4);
        K.fade(tl, S.p50N, 1.8, 0.5);
        K.pop(tl, S.p50NL, 2.0);
        K.fade(tl, S.legN, 2.0);
      } else if (i === 3) {
        tl.to(S.cR, { attr: { 'stroke-dashoffset': 0 }, duration: 1.6, ease: 'power1.inOut' }, 0.2);
        K.draw(tl, S.shiftA, 0.6, 0.6);
        K.fade(tl, S.p50R, 1.6, 0.5);
        K.pop(tl, S.p50RL, 1.8);
        K.fade(tl, S.tis, 2.0, 0.5);
        K.pop(tl, S.tisL, 2.2);
        K.fade(tl, S.legR, 2.0);
      } else if (i === 4) {
        K.fade(tl, S.scrimL, 0, 0.5);
        K.fadeIn(tl, S.pk, 0.3, { dy: 30 });
      }
    },
    notes: '<p>2,3-BPG binds deoxyhaemoglobin in the central cavity between the two β-chains, about one molecule per tetramer. It forms salt bridges with positively charged residues there and stabilises the T (tense) state, which has lower O<sub>2</sub> affinity.</p><p>Oxyhaemoglobin has a narrower cavity and binds 2,3-BPG poorly. So 2,3-BPG favours O<sub>2</sub> release.</p><p>The curve shifts to the right and P<sub>50</sub> rises above the normal ≈26 mmHg. At tissue pO<sub>2</sub> (~40 mmHg) more O<sub>2</sub> is unloaded, while loading in the lungs (~100 mmHg) barely changes. The shifted curve here is illustrative.</p><p>In pyruvate kinase deficiency, low ATP damages the membrane (chronic haemolytic anaemia), and the block makes upstream 2,3-BPG rise. The right shift partly compensates. Hexokinase deficiency does the opposite.</p><h4>Viva points</h4><ul><li>Fetal Hb (γ-chains) binds 2,3-BPG weakly → higher O<sub>2</sub> affinity than adult Hb.</li><li>Stored blood loses 2,3-BPG → high O<sub>2</sub> affinity after transfusion until it\'s regenerated.</li></ul>',
    viva: { q: 'How does 2,3-BPG affect the oxygen dissociation curve, and why?', a: '2,3-BPG binds the central cavity of <b>deoxyHb</b> (β-chains) and <b>stabilises the T-state</b>, lowering O<sub>2</sub> affinity. The curve shifts <b>right</b>, <b>P<sub>50</sub> rises</b> above ≈26 mmHg, and more O<sub>2</sub> is unloaded in the tissues.' }
  });

  /* ============ 13. LEAVE RBC → MITOCHONDRION ============ */
  D.add({
    id: 'tomito', kicker: 'Chapter III · The link reaction', title: 'Into the <em>mitochondrion</em>', menu: 'Leave the RBC, enter the mitochondrion',
    source: 'OpenStax Biology 2e §4.3, §7.3 · Lippincott 8e Ch. 9 · Bricker et al., Science 2012; Herzig et al., Science 2012 (MPC)',
    beats: [
      { cap: 'We <b>leave the red cell</b>. With no mitochondria, its pyruvate ends as <b>lactate</b>, which is exported to the plasma.' },
      { cap: 'Now a different cell, one <b>with mitochondria</b> (liver or muscle). Pyruvate from its own glycolysis can be fully oxidised here.' },
      { cap: 'Two membranes: a leaky <b>outer membrane</b> and a tight <b>inner membrane</b> around the <b>matrix</b>.' },
      { cap: 'Pyruvate crosses the <b>outer membrane</b> through <b>porins</b> (VDAC), large aqueous channels.' },
      { cap: 'The <b>mitochondrial pyruvate carrier (MPC)</b> carries it, with H<sup>+</sup>, across the inner membrane into the <b>matrix</b>, where PDH is waiting.' }
    ],
    printBeats: [4],
    build: function (S) {
      const cam = K.camLayer(S);
      const sv = cam.svg;
      // plasma tint
      K.s(sv, 'rect', { x: -2000, y: -1000, width: 6600, height: 3200, fill: '#2a0f22', opacity: 0.35 });
      S.rbc = drawRBC(sv, sv, 700, 540, 330);
      K.s(sv, 'rect', { x: 1018, y: 515, width: 34, height: 50, rx: 10, fill: '#8b7bff' });
      S.rbcNo = K.node(cam, 'mlabel', 'RBC · <b>no mitochondria</b>', 700, 925, { show: true });
      S.mct = K.node(cam, 'tagchip rev', 'MCT1', 1035, 470, { show: true, style: 'font-size:15px' });
      S.lac = [0, 1, 2].map(function (k) { return K.node(cam, 'tagchip', 'lactate', 860 - k * 60, 540 + (k - 1) * 70, { style: 'background:rgba(45,212,191,.2);border:1.5px solid var(--carbon);color:#c9fff7;font-size:18px' }); });
      // tissue cell
      const cell = K.sg(sv, {});
      const cyto = K.rgrad(sv, [[0, '#1d4282', 0.95], [1, '#0c1d48', 0.9]]);
      K.s(cell, 'ellipse', { cx: 2700, cy: 540, rx: 720, ry: 430, fill: cyto, stroke: '#a9cdff', 'stroke-width': 9 });
      K.s(cell, 'circle', { cx: 2420, cy: 600, r: 150, fill: '#3a318f', stroke: '#8c83ff', 'stroke-width': 6 });
      [[2960, 420, 300, 120, 0], [2850, 760, 220, 90, 20], [3180, 600, 230, 92, -30], [2300, 330, 200, 84, 15], [2620, 260, 190, 80, -10], [3200, 330, 170, 70, 40], [2560, 860, 180, 76, -20]].forEach(function (m) { mitoRot(sv, cell, m[0], m[1], m[2], m[3], m[4]); });
      S.cellL = K.node(cam, 'mlabel', '<b>Liver or muscle cell</b> · many mitochondria', 2700, 165, { show: true });
      K.camSet(S, 700, 540, 2.6);
      // cross-section schematic (screen space)
      S.xs = K.layer(S.w, 0, 0, false);
      const xsv = K.svg(S.xs);
      K.s(xsv, 'rect', { x: 0, y: 0, width: 1920, height: 330, fill: '#0c1d48', opacity: 0.6 });
      K.s(xsv, 'rect', { x: 0, y: 330, width: 1920, height: 300, fill: '#3a1d2a', opacity: 0.45 });
      K.s(xsv, 'rect', { x: 0, y: 630, width: 1920, height: 450, fill: '#5a2a14', opacity: 0.5 });
      membraneBand(xsv, 345, 64, '#8fb0ff');
      membraneBand(xsv, 625, 64, '#ff9a6b');
      K.node(S.xs, 'mlabel', '<b>Cytosol</b>', 90, 220, { anchor: 'l', show: true });
      K.node(S.xs, 'mlabel', '<b>Outer membrane</b> · porins → leaky to small molecules', 1820, 290, { anchor: 'r', show: true });
      K.node(S.xs, 'mlabel', '<b>Intermembrane space</b>', 90, 490, { anchor: 'l', show: true });
      K.node(S.xs, 'mlabel', '<b>Inner membrane</b> · tight → needs carriers', 1820, 560, { anchor: 'r', show: true });
      K.node(S.xs, 'mlabel', '<b style="color:#ffd0b0">Matrix</b>', 90, 780, { anchor: 'l', show: true });
      // porin (wide barrel) and MPC
      K.node(S.xs, 'prot', '', 640, 345, { show: true, style: 'width:56px;height:110px;background:linear-gradient(180deg,#9fb6ff,#4a63c9)' });
      K.node(S.xs, 'prot', '', 780, 345, { show: true, style: 'width:56px;height:110px;background:linear-gradient(180deg,#9fb6ff,#4a63c9)' });
      S.porL = K.node(S.xs, 'tagchip rev', 'Porin (VDAC)', 710, 270, { show: true, style: 'font-size:16px' });
      K.node(S.xs, 'prot', '', 1070, 625, { show: true, style: 'width:56px;height:120px;background:linear-gradient(180deg,#ffc29e,#c2410c)' });
      K.node(S.xs, 'prot', '', 1150, 625, { show: true, style: 'width:56px;height:120px;background:linear-gradient(180deg,#ffc29e,#c2410c)' });
      S.mpcL = K.node(S.xs, 'tagchip amber', 'MPC', 1110, 540, { show: true, style: 'font-size:16px' });
      // PDH silhouette
      S.pdh = K.layer(S.xs, 1450, 770, true);
      [[0, 0, 70, 'e2'], [-90, 10, 52, 'e1'], [86, -6, 52, 'e3'], [-30, -70, 40, 'e1'], [44, 62, 40, 'e3']].forEach(function (b) { K.node(S.pdh, 'blob ' + b[3], '', b[0], b[1], { show: true, style: 'width:' + b[2] * 2 + 'px;height:' + b[2] * 2 + 'px;opacity:.8' }); });
      K.node(S.pdh, 'mlabel', '<b>PDH complex</b>', 170, 0, { show: true, anchor: 'l' });
      S.pyr = K.chain(S.xs, { n: 3, x: 400, y: 200, gap: 50, labels: ['C', 'C', 'C'], small: true });
      S.pyrL = K.node(S.pyr.g, 'lbl sm b', 'pyruvate', 0, -50, { show: true });
      gsap.set(S.pyr.g, { autoAlpha: 0 });
      S.h = K.node(S.xs, 'tagchip', 'H<sup>+</sup>', 1240, 500, { style: 'font-size:18px;border:1.5px solid #fff;color:#fff' });
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.cam(tl, S, 1150, 540, 0.85, 0.2, 3.2, 'power2.inOut');
        S.lac.forEach(function (l, k) {
          tl.to(l, { autoAlpha: 1, duration: 0.3 }, 1.2 + k * 0.25);
          tl.to(l, { x: 1035, y: 540, duration: 0.9, ease: 'power1.in' }, 1.5 + k * 0.25);
          tl.to(l, { x: 1300 + k * 40, y: 450 + k * 90, duration: 0.9, ease: 'power1.out' }, 2.4 + k * 0.25);
        });
      } else if (i === 1) {
        K.cam(tl, S, 2700, 560, 0.86, 0, 2.8, 'power2.inOut');
      } else if (i === 2) {
        K.cam(tl, S, 2960, 420, 5.2, 0, 2.0, 'power3.in');
        tl.to(S.camEl, { autoAlpha: 0, duration: 0.6 }, 1.7);
        K.fade(tl, S.xs, 1.7, 0.7);
      } else if (i === 3) {
        K.fade(tl, S.pyr.g, 0, 0.4);
        S.pyr.move(tl, 710, 300, 0.3, 0.8);
        S.pyr.move(tl, 710, 420, 1.1, 0.8, 'power1.in');
        S.pyr.move(tl, 800, 490, 1.9, 0.6);
      } else if (i === 4) {
        K.pop(tl, S.h, 0);
        tl.to(S.h, { x: 1170, y: 560, duration: 0.6 }, 0.3);
        S.pyr.move(tl, 1110, 560, 0.2, 0.9);
        S.pyr.move(tl, 1110, 720, 1.1, 0.8, 'power1.in');
        tl.to(S.h, { y: 760, autoAlpha: 0.4, duration: 0.8 }, 1.1);
        S.pyr.move(tl, 1250, 770, 1.9, 0.9);
        tl.to(S.pdh, { scale: 1.08, duration: 0.3, yoyo: true, repeat: 1 }, 2.6);
      }
    },
    notes: '<p>The red cell can\'t go any further with pyruvate: no mitochondria. LDH turns it into lactate, which leaves through monocarboxylate transporters and travels to the liver (Cori cycle).</p><p>In a cell with mitochondria, pyruvate from glycolysis can be fully oxidised.</p><p>The outer mitochondrial membrane contains porins (voltage-dependent anion channels) that let small molecules like pyruvate through.</p><p>The inner membrane is impermeable. Pyruvate crosses it on the mitochondrial pyruvate carrier (MPC), coupled to H<sup>+</sup>, and reaches the matrix where the pyruvate dehydrogenase complex sits.</p><h4>Viva points</h4><ul><li>The link reaction happens in the matrix, so it can\'t happen in mature RBCs.</li><li>Outer membrane = porins (permeable). Inner membrane = specific carriers (MPC for pyruvate).</li></ul>',
    viva: { q: 'How does pyruvate reach the mitochondrial matrix?', a: 'It crosses the <b>outer membrane through porins</b> (VDAC) and the <b>inner membrane on the mitochondrial pyruvate carrier (MPC)</b>, together with H<sup>+</sup>. In the matrix it meets the PDH complex.' }
  });

  /* ============ 14. PDH COMPLEX ============ */
  const PIV = { x: 960, y: 610 }, ARM = 285;
  const ANG = { rest: 235, e1: 188, coa: 270, e3: 352 };
  function tipPos(a) { const r = a * Math.PI / 180; return { x: PIV.x + ARM * Math.cos(r), y: PIV.y + ARM * Math.sin(r) }; }
  D.add({
    id: 'pdh', kicker: 'Chapter III · The link reaction', title: 'Pyruvate dehydrogenase complex', menu: 'PDH complex: the swinging arm',
    source: 'Lippincott 8e Ch. 9 · Berg, Tymoczko & Stryer, Biochemistry 5e §17.1 (NCBI Bookshelf) · Patel et al., J Biol Chem 2014',
    beats: [
      { cap: 'A giant complex (approx. 9 MDa) in the matrix: <b>three enzymes, five cofactors</b>.' },
      { cap: '<b>E1</b> (TPP): pyruvate loses its carboxyl carbon as <b>CO<sub>2</sub></b>. The 2-carbon <b>hydroxyethyl</b> group stays on TPP.', link: { acoa: 0, co2: 1, nadh: 0, per: 'per pyruvate' } },
      { cap: 'The <b>lipoamide arm</b> swings in. Hydroxyethyl is <b>oxidised to acetyl</b> and moved onto lipoamide, which is reduced. TPP is freed.' },
      { cap: '<b>E2</b>: CoA-SH takes the acetyl group, releasing <b>acetyl-CoA</b>. The arm is left fully reduced (two –SH).', link: { acoa: 1, co2: 1, nadh: 0, per: 'per pyruvate' } },
      { cap: '<b>E3</b>: FAD reoxidises the arm (FADH<sub>2</sub>), then passes the electrons to <span class="c-nad">NAD<sup>+</sup></span> → <span class="c-nadh">NADH + H<sup>+</sup></span>. The arm is reset.', link: { acoa: 1, co2: 1, nadh: 1, per: 'per pyruvate' } },
      { cap: 'Net: irreversible, <b>no ATP made directly</b>. Per glucose (×2): <b>2 acetyl-CoA, 2 CO<sub>2</sub>, 2 NADH</b>.', link: { acoa: 2, co2: 2, nadh: 2, per: 'per glucose (×2)' } }
    ],
    printBeats: [4],
    build: function (S) {
      K.backdrop(S, 'matrix', 14);
      S.cof = K.node(S.w, 'cof', '<span>TPP<small>B1</small></span><span>Lipoic acid</span><span>CoA<small>B5</small></span><span>FAD<small>B2</small></span><span>NAD<sup>+</sup><small>B3</small></span>', 86, 210, { anchor: 'l' });
      S.size = K.lbl(S.w, '≈ 9 × 10<sup>6</sup> Da · E2 core ≈ 60 subunits · many E1 and E3 copies (approx.)', 86, 262, { anchor: 'l', cls: 'sm' });
      S.e1 = K.node(S.w, 'blob e1', '<div><div class="bt">E1</div><div class="bs">pyruvate dehydrogenase<br>· TPP</div></div>', 430, 640, { style: 'width:340px;height:340px' });
      S.e2 = K.node(S.w, 'blob e2', '<div style="margin-top:120px"><div class="bt">E2</div><div class="bs">dihydrolipoyl<br>transacetylase</div></div>', 960, 690, { style: 'width:300px;height:300px' });
      S.e3 = K.node(S.w, 'blob e3', '<div><div class="bt">E3</div><div class="bs">dihydrolipoyl dehydrogenase<br>· FAD</div></div>', 1490, 640, { style: 'width:340px;height:340px' });
      S.tpp = K.pill(S.w, 'neutral', 'TPP', 600, 560, { size: 'sm' });
      S.fad = K.pill(S.w, 'fad', 'FAD', 1320, 560, { size: 'sm' });
      S.fadh = K.pill(S.w, 'fadh', 'FADH<sub>2</sub>', 1320, 560, { size: 'sm' });
      // swinging lipoamide arm
      S.rod = K.node(S.w, 'rod', '', PIV.x, PIV.y, { anchor: 'l', style: 'width:' + ARM + 'px' });
      gsap.set(S.rod, { xPercent: 0, yPercent: -50, transformOrigin: '0% 50%', rotation: ANG.rest });
      S.pivot = K.node(S.w, 'atom sm', 'K', PIV.x, PIV.y, { style: 'background:radial-gradient(circle at 35% 30%,#fff,#9aa6c8 60%,#4a5577);color:#1b2238' });
      S.armL = K.chip(S.w, 'rev', 'lipoamide on lysine', PIV.x, PIV.y + 60, { style: 'font-size:15px' });
      S.tip = K.layer(S.w, 0, 0, false);
      S.s1 = K.node(S.tip, 'satom', 'S', -22, 0, { show: true });
      S.s2 = K.node(S.tip, 'satom', 'S', 22, 0, { show: true });
      S.ss = K.node(S.tip, 'ssbond', '', 0, 0, { show: true });
      S.tip.insertBefore(S.ss, S.s1);
      S.h1 = K.node(S.tip, 'hlab', 'H', -22, -34); S.h2 = K.node(S.tip, 'hlab', 'H', 22, -34);
      S.acT = K.layer(S.tip, -22, 44, false);
      K.node(S.acT, 'atom sm', 'C2', 0, 0, { show: true, style: 'width:40px;height:40px;font-size:14px' });
      K.node(S.acT, 'atom sm', 'C3', 0, 44, { show: true, style: 'width:40px;height:40px;font-size:14px' });
      S.armPr = { a: ANG.rest };
      S.armSet = function () { gsap.set(S.rod, { rotation: S.armPr.a }); const p = tipPos(S.armPr.a); gsap.set(S.tip, { x: p.x, y: p.y }); };
      S.armSet();
      S.armTo = function (tl, a, at, dur) { tl.to(S.armPr, { a: a, duration: dur || 1.2, ease: 'power2.inOut', onUpdate: S.armSet }, at); };
      // pyruvate
      S.pyr = K.chain(S.w, { n: 3, x: 300, y: 380, gap: 50, labels: ['C1', 'C2', 'C3'], small: true });
      gsap.set(S.pyr.g, { autoAlpha: 0 });
      S.pyrL = K.node(S.pyr.g, 'lbl sm b', 'pyruvate · C1 = COO<sup>−</sup>', 0, -48, { show: true });
      S.co2 = K.pill(S.w, 'co2', 'CO<sub>2</sub>', 610, 520, { size: 'sm' });
      S.he = K.chip(S.w, 'rev', 'hydroxyethyl-TPP', 640, 405, { style: 'font-size:15px' });
      S.acL = K.chip(S.w, 'rev', 'acetyl-dihydrolipoamide', 640, 405, { style: 'font-size:15px' });
      S.coa = K.pill(S.w, 'coa', 'CoA-SH', 960, 200, { size: 'sm' });
      S.acoa = K.layer(S.w, 960, 200, false);
      K.node(S.acoa, 'atom sm', 'C2', -96, 0, { show: true, style: 'width:40px;height:40px;font-size:14px' });
      K.node(S.acoa, 'atom sm', 'C3', -140, 0, { show: true, style: 'width:40px;height:40px;font-size:14px' });
      K.node(S.acoa, 'pill coa sm', 'S-CoA', 0, 0, { show: true });
      S.acoaL = K.node(S.acoa, 'mname', 'Acetyl-CoA', 0, 52, { show: true, style: 'font-size:26px' });
      S.redL = K.chip(S.w, 'rev', 'reduced: two –SH', 790, 330, { style: 'font-size:15px' });
      S.nad = K.pill(S.w, 'nad', 'NAD<sup>+</sup>', 1700, 420, { size: 'sm' });
      S.nadh = K.pill(S.w, 'nadh', 'NADH + H<sup>+</sup>', 1700, 420, { size: 'sm' });
      S.scrim = K.scrim(S);
      S.net = K.node(S.w, 'card teal', '<div class="kick" style="text-align:center;margin-bottom:16px">Link reaction · net</div><div class="eq">Pyruvate + CoA-SH + NAD<sup>+</sup><span class="arr">→</span>Acetyl-CoA + CO<sub>2</sub> + NADH + H<sup>+</sup></div>' +
        '<div style="display:flex;gap:14px;justify-content:center;margin-top:22px"><span class="tagchip irr" style="font-size:20px">irreversible</span><span class="tagchip slp" style="font-size:20px">no direct ATP</span><span class="tagchip rev" style="font-size:20px">×2 per glucose: 2 acetyl-CoA · 2 CO₂ · 2 NADH</span></div>', 960, 560, { w: 1420 });
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.fadeIn(tl, [S.cof, S.size], 0, { stagger: 0.15 });
        tl.fromTo([S.e1, S.e2, S.e3], { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)' }, 0.3);
        K.fade(tl, [S.rod, S.pivot, S.tip, S.armL], 1.0, 0.6);
        K.pop(tl, [S.tpp, S.fad], 1.2, { stagger: 0.15 });
        tl.call(function () { S.loop(gsap.to(S.rod, { scaleX: 0.985, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })); }, null, 1.8);
      } else if (i === 1) {
        K.fade(tl, S.pyr.g, 0, 0.4);
        S.pyr.move(tl, 610, 470, 0.2, 1.1);
        // C1 (carboxyl) leaves as CO2
        tl.to(S.pyr.atoms[0], { autoAlpha: 0, scale: 0.5, duration: 0.3 }, 1.5);
        tl.to(S.pyr.bonds[0], { autoAlpha: 0, duration: 0.3 }, 1.5);
        tl.fromTo(S.co2, { autoAlpha: 0, x: 560, y: 470 }, { autoAlpha: 1, x: 470, y: 300, duration: 1.2, ease: 'power2.out' }, 1.6);
        tl.to(S.pyrL, { autoAlpha: 0, duration: 0.3 }, 1.6);
        K.pop(tl, S.he, 2.2);
      } else if (i === 2) {
        K.out(tl, S.armL, 0, 0.3);
        S.armTo(tl, ANG.e1, 0.1, 1.3);
        // hydroxyethyl moves onto the arm tip as acetyl
        tl.to(S.pyr.g, { autoAlpha: 0, duration: 0.3 }, 1.5);
        tl.set(S.acT, { autoAlpha: 1 }, 1.5);
        tl.from(S.acT, { scale: 0.4, duration: 0.4, ease: 'back.out(2)' }, 1.5);
        tl.to(S.ss, { autoAlpha: 0, duration: 0.3 }, 1.6);
        K.pop(tl, S.h2, 1.7);
        K.out(tl, S.he, 1.5, 0.3);
        K.pop(tl, S.acL, 1.8);
        tl.to(S.tpp, { scale: 1.2, duration: 0.25, yoyo: true, repeat: 1 }, 2.0);
      } else if (i === 3) {
        K.out(tl, S.acL, 0, 0.3);
        K.pop(tl, S.coa, 0.2);
        S.armTo(tl, ANG.coa, 0.2, 1.3);
        tl.to(S.coa, { y: 250, duration: 0.6 }, 1.0);
        tl.to(S.acT, { autoAlpha: 0, duration: 0.3 }, 1.7);
        tl.to(S.coa, { autoAlpha: 0, duration: 0.3 }, 1.7);
        tl.set(S.acoa, { x: 960, y: 250 }, 1.7);
        K.pop(tl, S.acoa, 1.7);
        K.pop(tl, S.h1, 1.9);
        tl.to(S.acoa, { x: 1280, y: 300, duration: 1.0, ease: 'power2.inOut' }, 2.3);
        K.pop(tl, S.redL, 2.4);
      } else if (i === 4) {
        K.out(tl, S.redL, 0, 0.3);
        S.armTo(tl, ANG.e3, 0.1, 1.3);
        tl.to([S.h1, S.h2], { autoAlpha: 0, duration: 0.3 }, 1.5);
        tl.to(S.ss, { autoAlpha: 1, duration: 0.3 }, 1.6);
        K.swap(tl, S.fad, S.fadh, 1.5);
        K.pop(tl, S.nad, 2.0);
        tl.to(S.nad, { x: 1540, y: 470, duration: 0.6 }, 2.2);
        tl.set(S.nadh, { x: 1540, y: 470 }, 2.2);
        K.swap(tl, S.nad, S.nadh, 2.9);
        K.swap(tl, S.fadh, S.fad, 2.9);
        tl.to(S.nadh, { x: 1720, y: 330, duration: 0.8 }, 3.4);
      } else if (i === 5) {
        S.w.appendChild(S.scrim); S.w.appendChild(S.net);
        K.fade(tl, S.scrim, 0, 0.6);
        K.fadeIn(tl, S.net, 0.3, { dy: 30 });
      }
    },
    notes: '<p>The PDH complex links glycolysis to the TCA cycle. It\'s a huge assembly (approx. 9 MDa) of three enzymes and five cofactors: TPP (B1), lipoic acid, CoA (B5), FAD (B2), NAD<sup>+</sup> (B3).</p><p>Step 1, E1 with TPP: pyruvate is decarboxylated. CO<sub>2</sub> leaves and a hydroxyethyl group stays on TPP.</p><p>Step 2: the hydroxyethyl group is oxidised to an acetyl group and transferred to oxidised lipoamide, which is reduced in the process (acetyl-dihydrolipoamide). TPP is regenerated.</p><p>Step 3, E2: CoA-SH takes the acetyl group, making acetyl-CoA and leaving fully reduced dihydrolipoamide. Lipoamide is attached to a lysine of E2, a long flexible arm that swings between the three active sites.</p><p>Step 4, E3: FAD reoxidises the lipoamide, giving FADH<sub>2</sub>, which passes the electrons to NAD<sup>+</sup>, making NADH + H<sup>+</sup>.</p><p>Net: irreversible, no ATP made directly. Twice per glucose.</p><h4>Viva points</h4><ul><li>Irreversible: acetyl-CoA can\'t be turned back into pyruvate, so fat can\'t make net glucose.</li><li>The same three-enzyme design is used by α-ketoglutarate DH and branched-chain α-keto acid DH.</li></ul>',
    viva: { q: 'Name the five coenzymes of the pyruvate dehydrogenase complex and the vitamins they come from.', a: '<b>TPP</b> (thiamine, B1), <b>lipoic acid</b> (lipoamide), <b>CoA</b> (pantothenic acid, B5), <b>FAD</b> (riboflavin, B2) and <b>NAD<sup>+</sup></b> (niacin, B3). E1 uses TPP; E2 uses lipoamide and CoA; E3 uses FAD and NAD<sup>+</sup>.' }
  });

  /* ============ 15. REGULATION, CLINICAL, SUMMARY, REFERENCES ============ */
  D.add({
    id: 'pdhreg', kicker: 'Chapter III · Control and clinic', title: 'PDH: control, clinic, <em>summary</em>', menu: 'PDH control, clinical, summary, references',
    source: 'Lippincott 8e Ch. 9, Ch. 28 (thiamine) · NCBI StatPearls: Thiamine Deficiency; Arsenic Toxicity · Patel et al., J Biol Chem 2014',
    beats: [
      { cap: '<b>PDH kinase (PDK)</b> uses ATP to phosphorylate E1, which switches PDH <b>OFF</b>.' },
      { cap: '<b>PDH phosphatase</b> removes it: <b>ON</b>. ATP, NADH and acetyl-CoA favour OFF; ADP and pyruvate favour ON; Ca<sup>2+</sup> activates the phosphatase in working muscle.' },
      { cap: '<b>Thiamine (TPP) deficiency</b> hits PDH, α-ketoglutarate DH, branched-chain keto-acid DH and transketolase. Pyruvate and lactate build up.' },
      { cap: '<b>Arsenite (As<sup>3+</sup>)</b> binds lipoic acid\'s two thiols and blocks PDH. <b>Arsenate (As<sup>5+</sup>)</b> is a phosphate analogue at GAPDH.' },
      { cap: 'The whole journey: glucose → 2 pyruvate (net 2 ATP, 2 NADH) → 2 acetyl-CoA (2 CO<sub>2</sub>, 2 NADH) → TCA cycle.', ctr: { inv: 2, gen: 4, nadh: 2, nad: -2, tag: 'per glucose' }, link: { acoa: 2, co2: 2, nadh: 2, per: 'per glucose (×2)' } },
      { cap: 'References and credits. Thank you. Questions?', ctr: null, link: null }
    ],
    printBeats: [4, 5],
    build: function (S) {
      K.backdrop(S, 'matrix', 15);
      // switch
      S.hubOn = K.node(S.w, 'hub', 'PDH<small>E1 · active</small>', 960, 560, { style: 'background:radial-gradient(circle at 35% 30%,#4fe0a0,#12814e 60%,#0a3d26);box-shadow:0 0 70px rgba(52,209,122,.45)' });
      S.hubOff = K.node(S.w, 'hub', 'PDH–P<small>E1 · inactive</small>', 960, 560, { style: 'background:radial-gradient(circle at 35% 30%,#8a93a8,#4a5168 60%,#262b3a);box-shadow:none' });
      S.onL = K.chip(S.w, 'rev', 'ON', 960, 400, { style: 'font-size:22px;border-color:#34d17a;color:#c9ffe0' });
      S.offL = K.chip(S.w, 'irr', 'OFF', 960, 400, { style: 'font-size:22px' });
      S.P = { els: [K.node(S.w, 'phos', 'P', 1060, 470)], abs: function () { return { x: 1060, y: 470 }; } };
      S.pdk = K.node(S.w, 'eff', '<b>PDH kinase</b> (PDK)', 960, 220, { style: 'border:2px solid #ff5a5a;color:#ffd0d0;background:rgba(255,42,42,.1)' });
      S.ppase = K.node(S.w, 'eff', '<b>PDH phosphatase</b>', 960, 820, { style: 'border:2px solid #34d17a;color:#c9ffe0;background:rgba(52,209,122,.1)' });
      S.pi = K.pill(S.w, 'pi', 'P<sub>i</sub>', 1060, 470, { size: 'sm' });
      S.offC = K.card(S.w, 'red', '<h4 style="font-size:26px">Favour OFF</h4><div class="row">activate PDK:</div><div class="row"><span class="pill atp sm" style="box-shadow:none;height:34px;font-size:17px">ATP</span> &nbsp;<b>NADH</b> &nbsp;<b>acetyl-CoA</b></div><div class="row" style="color:var(--ink3);font-size:20px">(signs of plenty; NADH and acetyl-CoA also inhibit E2/E3 directly)</div>', 80, 330, 520);
      S.onC = K.card(S.w, 'teal', '<h4 style="font-size:26px">Favour ON</h4><div class="row"><b>ADP</b>, <b>pyruvate</b> → inhibit PDK</div><div class="row"><b>Ca<sup>2+</sup></b> → activates the phosphatase</div><div class="row" style="color:var(--ink3);font-size:20px">(contracting muscle; insulin also activates it in adipose)</div>', 1320, 330, 520);
      // thiamine
      S.tppHub = K.node(S.w, 'hub', 'TPP<small>thiamine (B1)</small>', 700, 560, { style: 'width:200px;height:200px' });
      const enz = [['Pyruvate DH', 'glycolysis → TCA', 360], ['α-Ketoglutarate DH', 'TCA cycle', 470], ['Branched-chain keto-acid DH', 'Val, Leu, Ile', 580], ['Transketolase', 'pentose phosphate pathway', 690]];
      S.tE = enz.map(function (e) { return K.node(S.w, 'eff inh', '<b>' + e[0] + '</b> <span style="font-size:18px;color:#ffb3bc">' + e[1] + '</span>', 1000, e[2], { anchor: 'l' }); });
      S.tA = enz.map(function (e) { return K.inhibit(S.svg, 800, 560 + (e[2] - 525) * 0.3, 990, e[2], { cross: false }); });
      S.tC = K.card(S.w, 'amber', '<div class="row"><b>Result:</b> pyruvate and lactate accumulate → lactic acidosis. Beriberi; Wernicke–Korsakoff in alcohol use disorder. Test: RBC transketolase activity.</div>', 360, 760, 1220, { style: 'padding:18px 26px' });
      // arsenite vs arsenate
      S.asA = K.card(S.w, 'purple', '<span class="tagchip purple">Link reaction</span><h4 style="margin-top:12px">Arsenite · As<sup>3+</sup></h4><div class="row">Binds the <b>two –SH groups of lipoic acid</b> (dihydrolipoamide) → blocks <b>PDH</b> and α-KG DH.</div><div class="row">Pyruvate and lactate rise; neurological damage.</div>', 140, 300, 760);
      S.asB = K.card(S.w, 'amber', '<span class="tagchip amber">Glycolysis</span><h4 style="margin-top:12px">Arsenate · As<sup>5+</sup></h4><div class="row"><b>Phosphate analogue</b> at GAPDH → unstable product hydrolyses → <b>PGK ATP lost</b>.</div><div class="row">Glycolysis continues without that ATP.</div>', 1000, 300, 760);
      S.lipo = K.layer(S.w, 520, 740, false);
      K.node(S.lipo, 'satom', 'S', -40, 0, { show: true }); K.node(S.lipo, 'satom', 'S', 40, 0, { show: true });
      K.node(S.lipo, 'atom sm', 'As', 0, -50, { show: true, style: 'background:radial-gradient(circle at 35% 30%,#e9d5ff,#8b5cf6 60%,#4c1d95);color:#fff' });
      K.node(S.lipo, 'lbl sm', 'arsenite bridges both thiols', 0, 56, { show: true });
      // summary
      const box = function (cls, h, t) { return '<div class="sumbox ' + cls + '"><h5>' + h + '</h5><div>' + t + '</div></div>'; };
      S.sum = K.node(S.w, 'sumrow', box('', 'Glucose', 'GLUT') + '<span class="sumarr">→</span>' + box('cyt', 'Glycolysis', 'cytosol · 10 steps<br>net 2 ATP · 2 NADH') + '<span class="sumarr">→</span>' + box('', '2 Pyruvate', 'porin → MPC') + '<span class="sumarr">→</span>' + box('mat', 'PDH complex', 'matrix · irreversible<br>2 CO<sub>2</sub> · 2 NADH · no ATP') + '<span class="sumarr">→</span>' + box('mat', '2 Acetyl-CoA', '→ TCA cycle'), 960, 450);
      S.sumR = K.node(S.w, 'sumrow', box('rbc', 'RBC branch', '1,3-BPG → 2,3-BPG (shunt)<br>−1 ATP per triose diverted') + box('', 'No O<sub>2</sub> / no mitochondria', 'pyruvate → lactate (LDH)<br>NAD<sup>+</sup> regenerated, no ATP') + box('', 'Regulation', 'PFK-1 (glycolysis)<br>PDK / phosphatase (PDH)'), 960, 690);
      // references
      S.refs = K.card(S.w, '', '<div class="ref" style="display:grid;grid-template-columns:1.25fr 1fr;gap:34px">' +
        '<div><h5>Sources</h5><ol>' +
        '<li><b>OpenStax Biology 2e</b> (Clark, Douglas, Choi), Rice University 2018, Ch. 7 Cellular Respiration §7.2–7.6. CC BY 4.0.</li>' +
        '<li><b>Lippincott Illustrated Reviews: Biochemistry</b>, 8th ed. (Abali, Cline, Franklin, Viselli), Wolters Kluwer 2021: Ch. 8 Glycolysis; Ch. 9 TCA cycle and PDH; Ch. 3 haemoglobin.</li>' +
        '<li><b>NCBI Bookshelf</b>: Berg, Tymoczko, Stryer, <i>Biochemistry</i> 5e (2002) §16.1, §17.1; StatPearls: Biochemistry, Glycolysis; Oxyhemoglobin Dissociation Curve; Pyruvate Kinase Deficiency; Thiamine Deficiency; Arsenic Toxicity.</li>' +
        '<li><b>RBC</b>: Rapoport &amp; Luebering, J Biol Chem 1950; Benesch &amp; Benesch, Biochem Biophys Res Commun 1967; van Wijk &amp; van Solinge, Blood 2005 (RBC glycolytic enzyme defects).</li>' +
        '<li><b>PDH</b>: Patel, Nemeria, Furey, Jordan, J Biol Chem 2014 (PDH complexes: structure, function, regulation). MPC: Bricker et al. and Herzig et al., Science 2012.</li>' +
        '<li>Presenter\'s notes and textbook extracts (Ch. 8 Metabolic Pathways of Glucose; Link Reaction), reconciled with the sources above.</li></ol></div>' +
        '<div><h5>Credits</h5><ol>' +
        '<li><b>GSAP 3.13</b> animation library, GreenSock / Webflow, free "Standard No Charge" licence.</li>' +
        '<li><b>Inter</b> typeface (Rasmus Andersson), SIL Open Font License 1.1.</li>' +
        '<li><b>Instrument Serif</b> typeface (Instrument), SIL Open Font License 1.1.</li>' +
        '<li>All illustrations (cells, organelles, molecules, haemoglobin, PDH complex, curves) are drawn in code (SVG/CSS) for this deck. No third-party images are used.</li></ol>' +
        '<h5 style="margin-top:20px">Conventions</h5><ol><li>Carbon circles are schematic skeletons. Single arrow = irreversible; harpoon pair = reversible. Complex sizes are approximate.</li></ol></div></div>', 70, 180, 1780, { style: 'padding:30px 36px' });
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.pop(tl, S.hubOn, 0.1); K.pop(tl, S.onL, 0.3);
        K.fadeIn(tl, S.pdk, 0.5, { dy: 0 });
        K.atpSpend(tl, S.w, { x: 1200, y: 220 }, S.P, { x: 1300, y: 140 }, 0.9, { lift: -20 });
        K.swap(tl, S.hubOn, S.hubOff, '>-0.6');
        K.swap(tl, S.onL, S.offL, '<');
      } else if (i === 1) {
        K.fadeIn(tl, S.ppase, 0.1, { dy: 0 });
        tl.to(S.P.els, { autoAlpha: 0, duration: 0.2 }, 0.6);
        tl.fromTo(S.pi, { autoAlpha: 1, x: 1060, y: 470 }, { x: 1250, y: 820, duration: 1.0, ease: 'power2.inOut' }, 0.6);
        K.swap(tl, S.hubOff, S.hubOn, 1.0);
        K.swap(tl, S.offL, S.onL, 1.0);
        K.fadeIn(tl, S.offC, 1.4);
        K.fadeIn(tl, S.onC, 1.7);
      } else if (i === 2) {
        K.out(tl, [S.hubOn, S.hubOff, S.onL, S.offL, S.pdk, S.ppase, S.pi, S.offC, S.onC].concat(S.P.els, Array.prototype.slice.call(S.w.querySelectorAll('.pill.atp, .pill.adp'))), 0, 0.4);
        K.pop(tl, S.tppHub, 0.4);
        S.tE.forEach(function (e, k) { K.fadeIn(tl, e, 0.7 + k * 0.15, { dy: 0 }); K.fade(tl, S.tA[k], 0.8 + k * 0.15, 0.4); });
        K.fadeIn(tl, S.tC, 1.6);
      } else if (i === 3) {
        K.out(tl, [S.tppHub, S.tC].concat(S.tE, S.tA), 0, 0.4);
        K.fadeIn(tl, S.asA, 0.4);
        K.fadeIn(tl, S.asB, 0.6);
        K.fade(tl, S.lipo, 1.0);
        tl.from(S.lipo.children[2], { y: -140, duration: 0.7, ease: 'bounce.out' }, 1.0);
      } else if (i === 4) {
        K.out(tl, [S.asA, S.asB, S.lipo], 0, 0.4);
        tl.from(S.sum.children, { autoAlpha: 0, y: 20, duration: 0.45, stagger: 0.12 }, 0.4);
        tl.set(S.sum, { autoAlpha: 1 }, 0.4);
        tl.from(S.sumR.children, { autoAlpha: 0, y: 20, duration: 0.45, stagger: 0.15 }, 1.8);
        tl.set(S.sumR, { autoAlpha: 1 }, 1.8);
      } else if (i === 5) {
        K.out(tl, [S.sum, S.sumR], 0, 0.4);
        K.fadeIn(tl, S.refs, 0.3, { dy: 20 });
      }
    },
    notes: '<p>PDH is regulated by covalent modification. PDH kinase phosphorylates E1 using ATP, turning the complex off. PDH phosphatase removes the phosphate and turns it on.</p><p>Signs of plenty (high ATP, NADH, acetyl-CoA) activate the kinase. ADP and pyruvate inhibit the kinase. Ca<sup>2+</sup> in contracting muscle activates the phosphatase. NADH and acetyl-CoA also inhibit the complex directly (product inhibition).</p><p>Thiamine deficiency (TPP) affects PDH, α-ketoglutarate DH, branched-chain keto-acid DH and transketolase. Pyruvate and lactate accumulate: beriberi, Wernicke–Korsakoff syndrome, lactic acidosis. The brain, which relies on glucose oxidation, is especially vulnerable.</p><p>Arsenite binds the vicinal thiols of lipoic acid, blocking PDH and α-KGDH. Arsenate is a phosphate analogue that uncouples ATP formation at GAPDH/PGK.</p><h4>Viva points</h4><ul><li>Phosphorylated PDH = inactive; dephosphorylated = active.</li><li>Thiamine status is assessed by RBC transketolase activity; give thiamine before glucose in suspected Wernicke\'s.</li></ul>',
    viva: { q: 'A chronic alcoholic presents with lactic acidosis and confusion. Which vitamin is deficient, and which enzymes are affected?', a: '<b>Thiamine (B1)</b>, whose active form TPP is needed by <b>pyruvate dehydrogenase</b>, <b>α-ketoglutarate dehydrogenase</b>, <b>branched-chain α-keto acid dehydrogenase</b> and <b>transketolase</b>. Pyruvate is diverted to lactate, causing lactic acidosis; the brain is affected (Wernicke–Korsakoff).' }
  });
})();
