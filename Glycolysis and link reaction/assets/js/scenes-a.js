/* METABOLIC JOURNEY — scenes 1–5 */
(function () {
  'use strict';
  const D = window.Deck;
  const SRC_GLY = 'OpenStax Biology 2e §7.2 · Lippincott Biochemistry 8e Ch. 8 · NCBI StatPearls: Glycolysis';

  /* ============ 1. TITLE ============ */
  function drawCell(svg, cx, cy) {
    const g = K.sg(svg, { class: 'cell' });
    const R = K.rng(21);
    const cyto = K.rgrad(svg, [[0, '#1d4282', 0.95], [0.75, '#122c62', 0.92], [1, '#0c1d48', 0.9]]);
    K.s(g, 'ellipse', { cx, cy, rx: 830, ry: 480, fill: 'none', stroke: '#4f8cff', 'stroke-opacity': 0.08, 'stroke-width': 70 });
    K.s(g, 'ellipse', { cx, cy, rx: 800, ry: 455, fill: cyto, stroke: '#a9cdff', 'stroke-width': 10, 'stroke-opacity': 0.85 });
    K.s(g, 'ellipse', { cx, cy, rx: 786, ry: 441, fill: 'none', stroke: '#5f93e6', 'stroke-width': 3, 'stroke-opacity': 0.55 });
    for (let i = 0; i < 16; i++) {
      const x = cx - 700 + R() * 1400, y = cy - 380 + R() * 760;
      K.s(g, 'path', { d: 'M' + x + ',' + y + ' q' + (R() * 300 - 150) + ',' + (R() * 200 - 100) + ' ' + (R() * 500 - 250) + ',' + (R() * 300 - 150), fill: 'none', stroke: '#8fb6ff', 'stroke-opacity': 0.09, 'stroke-width': 2 });
    }
    // nucleus
    const nx = cx - 230, ny = cy + 30;
    const nuc = K.rgrad(svg, [[0, '#5a4fc2'], [0.7, '#3a318f'], [1, '#272068']]);
    // rough ER
    for (let k = 0; k < 4; k++) {
      const r = 250 + k * 34;
      K.s(g, 'path', { d: 'M' + (nx + r * Math.cos(-1.2)) + ',' + (ny + r * Math.sin(-1.2)) + ' A' + r + ',' + r + ' 0 0 1 ' + (nx + r * Math.cos(1.0)) + ',' + (ny + r * Math.sin(1.0)), fill: 'none', stroke: '#7fa8f0', 'stroke-opacity': 0.35, 'stroke-width': 12, 'stroke-linecap': 'round' });
      for (let a = -1.15; a < 1.0; a += 0.09) K.s(g, 'circle', { cx: nx + (r + 9) * Math.cos(a), cy: ny + (r + 9) * Math.sin(a), r: 3, fill: '#c7d8ff', opacity: 0.5 });
    }
    K.s(g, 'circle', { cx: nx, cy: ny, r: 215, fill: 'none', stroke: '#8c83ff', 'stroke-width': 8, 'stroke-dasharray': '60 10', opacity: 0.8 });
    K.s(g, 'circle', { cx: nx, cy: ny, r: 205, fill: nuc });
    for (let i = 0; i < 26; i++) { const a = R() * 6.28, d = R() * 170; K.s(g, 'circle', { cx: nx + d * Math.cos(a), cy: ny + d * Math.sin(a), r: 4 + R() * 9, fill: '#8a80ff', opacity: 0.25 }); }
    K.s(g, 'circle', { cx: nx - 40, cy: ny - 30, r: 62, fill: '#1c1650', opacity: 0.9 });
    // golgi
    for (let k = 0; k < 5; k++) K.s(g, 'path', { d: 'M' + (cx + 120) + ',' + (cy - 300 + k * 26) + ' q90,' + (-40) + ' 180,0', fill: 'none', stroke: '#f0abfc', 'stroke-opacity': 0.45, 'stroke-width': 11, 'stroke-linecap': 'round' });
    for (let k = 0; k < 6; k++) K.s(g, 'circle', { cx: cx + 330 + R() * 80, cy: cy - 330 + R() * 120, r: 8 + R() * 8, fill: 'none', stroke: '#f0abfc', 'stroke-opacity': 0.4, 'stroke-width': 3 });
    // mitochondria
    [[cx + 330, cy - 160, 190, 74, 25], [cx + 520, cy + 210, 170, 66, -25], [cx - 520, cy - 300, 160, 62, -12], [cx + 40, cy + 330, 180, 70, 8], [cx - 560, cy + 290, 150, 58, 30], [cx + 640, cy - 220, 130, 54, 70]].forEach(function (m) {
      const mg = K.sg(g, { transform: 'rotate(' + m[4] + ' ' + m[0] + ' ' + m[1] + ')' });
      K.mito({ _defs: svg._defs, appendChild: function (e) { return mg.appendChild(e); } }, m[0], m[1], m[2], m[3]);
    });
    // vesicles
    for (let i = 0; i < 14; i++) K.s(g, 'circle', { cx: cx - 650 + R() * 1300, cy: cy - 360 + R() * 720, r: 6 + R() * 10, fill: 'rgba(160,200,255,.08)', stroke: '#a9c8ff', 'stroke-opacity': 0.35, 'stroke-width': 2 });
    return g;
  }

  D.add({
    id: 'title', kicker: 'Metabolic Journey', title: 'Metabolic Journey', menu: 'Title: into the cytosol', hudTitle: false,
    source: 'OpenStax Biology 2e Ch. 7 · Lippincott Biochemistry 8e',
    beats: [
      { cap: 'Every cell runs on glucose. Today we follow one molecule from the blood into the mitochondrion.' },
      { cap: 'Zoom into the <b>cytosol</b>, the fluid between the organelles. <b>Glycolysis happens here</b>, in every cell of the body.' },
      { cap: 'Three chapters: glycolysis, the red cell\'s 2,3-BPG shunt, and the link reaction that feeds the mitochondrion.' }
    ],
    printBeats: [0],
    build: function (S) {
      const cam = K.camLayer(S);
      S.cell = drawCell(cam.svg, 1200, 540);
      // glucose in the zoom target region
      S.glc = [];
      [[1500, 500], [1560, 585], [1450, 610], [1610, 520], [1530, 660]].forEach(function (p, i) {
        S.glc.push(K.hexIcon(cam.svg, p[0], p[1], 9, { hidden: true, fill: 'rgba(45,212,191,.55)', stroke: '#b8fff5', sw: 1.6 }));
      });
      K.camSet(S, 1200, 540, 0.86);
      gsap.set(cam, { autoAlpha: 0 });
      // overlay title
      const scrim = K.node(S.w, '', '', 0, 0, { anchor: 'tl', style: 'width:1200px;height:1080px;background:linear-gradient(90deg,rgba(4,8,20,.92) 0%,rgba(4,8,20,.7) 55%,rgba(4,8,20,0) 100%)' });
      S.scrim = scrim;
      S.kick = K.node(S.w, 'kick', 'MBBS Year 1 · Biochemistry', 120, 330, { anchor: 'l' });
      S.big = K.node(S.w, 'bigtitle', 'Metabolic<br><em>Journey</em>', 112, 520, { anchor: 'l' });
      S.sub = K.node(S.w, 'subtitle', 'Glycolysis · the red-cell shunt · the link reaction', 120, 740, { anchor: 'l' });
      S.cytLbl = K.node(S.w, 'card', '<div class="kick">Zoomed in</div><h4 style="margin:10px 0 4px;font-size:44px">The cytosol</h4><div class="row">Outside the nucleus and organelles.<br>Home of all <b>10 steps of glycolysis</b>.</div>', 110, 260, { anchor: 'tl', w: 640 });
      S.chaps = [
        ['I', 'Glycolysis', 'Glucose → 2 pyruvate in 10 steps. Investment, payoff, control, poisons.'],
        ['II', 'The red cell', 'No mitochondria. Rapoport–Luebering shunt makes 2,3-BPG for O<sub>2</sub> delivery.'],
        ['III', 'The link reaction', 'Pyruvate dehydrogenase: pyruvate → acetyl-CoA in the mitochondrial matrix.']
      ].map(function (c, i) {
        return K.node(S.w, 'card chap', '<div class="cn">' + c[0] + '</div><h4>' + c[1] + '</h4><div class="row">' + c[2] + '</div>', 150 + i * 560, 450, { anchor: 'tl', style: 'min-height:300px' });
      });
      S.chHead = K.node(S.w, 'bigq', 'Three chapters', 960, 330);
    },
    step: function (i, tl, S) {
      if (i === 0) {
        tl.to(S.camEl, { autoAlpha: 1, duration: 1.6, ease: 'power1.out' }, 0);
        K.cam(tl, S, 1200, 540, 1, 0, 6, 'power1.out');
        K.fadeIn(tl, [S.kick, S.big, S.sub], 0.5, { stagger: 0.25, dur: 1.1 });
        tl.set(S.scrim, { autoAlpha: 1 }, 0);
      } else if (i === 1) {
        K.out(tl, [S.kick, S.big, S.sub], 0, 0.6);
        tl.to(S.scrim, { autoAlpha: 0, duration: 0.8 }, 0);
        K.cam(tl, S, 1535, 580, 3.4, 0.2, 2.6, 'power3.inOut');
        tl.to(S.glc, { autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 1.6);
        K.fadeIn(tl, S.cytLbl, 2.3);
        tl.call(function () {
          S.loop(gsap.to(S.glc, { y: '+=4', x: '+=3', duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.3 }));
        }, null, 2.9);
      } else if (i === 2) {
        K.out(tl, S.cytLbl, 0, 0.4);
        tl.to(S.camEl, { autoAlpha: 0.28, duration: 0.8 }, 0);
        K.fadeIn(tl, S.chHead, 0.2);
        K.fadeIn(tl, S.chaps, 0.45, { stagger: 0.2, dy: 30 });
      }
    },
    notes: '<p>Welcome. This deck follows one glucose molecule from the blood, through glycolysis in the cytosol, into a red blood cell\'s special shunt, and finally into the mitochondrion through the link reaction.</p><p>Glycolysis takes place in the cytosol of every cell, which is why it\'s the universal first stage of glucose breakdown.</p><p>Keep an eye on the ledger in the top right. It counts ATP and NADH exactly as they appear on screen.</p><h4>Viva points</h4><ul><li>Glycolysis = cytosol; link reaction (PDH) = mitochondrial matrix.</li><li>Glycolysis is the only ATP source in mature RBCs.</li></ul>',
    viva: { q: 'Where in the cell does glycolysis take place, and where does the link reaction take place?', a: 'Glycolysis: the <b>cytosol</b> (all cells). Link reaction (pyruvate dehydrogenase complex): the <b>mitochondrial matrix</b>, so it can\'t happen in mature RBCs, which have no mitochondria.' }
  });

  /* ============ 2. GETTING GLUCOSE IN ============ */
  function membrane(svg, y, th) { return K.bilayer(svg, y, th, '#7fa6ff', 0, 1920, 'rgba(120,150,230,1)'); }
  function glut(parent, x, y, cls, label, show) {
    const g = K.layer(parent, x, y, !!show);
    K.node(g, 'prot ' + (cls || ''), '', -40, 0, { show: true, style: 'width:66px;height:170px' });
    K.node(g, 'prot ' + (cls || ''), '', 40, 0, { show: true, style: 'width:66px;height:170px' });
    if (label) K.node(g, 'tagchip ' + (cls === 'g5' ? 'lime' : cls === 'g4' ? 'purple' : 'rev'), label, 0, -118, { show: true });
    return g;
  }

  D.add({
    id: 'entry', kicker: 'Before step 1', title: 'Getting glucose <em>into</em> the cell', menu: 'Getting glucose in: GLUTs',
    source: 'Lippincott 8e Ch. 8 (GLUT transporters) · OpenStax Biology 2e §5.2 · NCBI StatPearls: Physiology, Glucose Transporters',
    beats: [
      { cap: 'Glucose is polar, so it can\'t cross the lipid bilayer by itself. <b>GLUT</b> carriers let it through by <b>facilitated diffusion</b>.' },
      { cap: 'Five GLUTs to remember. <b>GLUT4</b> needs insulin. <b>GLUT2</b> and <b>GLUT5</b> also carry fructose.' },
      { cap: 'In muscle and fat, <b>insulin</b> moves GLUT4 from storage vesicles to the membrane, so more glucose enters.' },
      { cap: 'GLUTs are <b>bidirectional</b>: glucose simply moves down its concentration gradient, in or out.' },
      { cap: 'Hexokinase traps glucose as <b>G6P</b>. G6P can\'t use GLUT, so cytosolic glucose stays low and the gradient stays inward.' },
      { cap: '<b>Fructose</b> enters via GLUT5 (and GLUT2). <b>Fructokinase</b>, mainly in liver, makes fructose-1-P, which joins glycolysis as trioses.' }
    ],
    printBeats: [4],
    build: function (S) {
      K.backdrop(S, 'cytosol', 2);
      S.mem = membrane(S.svg, 430, 96);
      S.out = K.lbl(S.w, 'EXTRACELLULAR FLUID', 90, 192, { anchor: 'l', show: true, cls: 'sm', style: 'letter-spacing:.16em' });
      S.inn = K.lbl(S.w, 'CYTOSOL', 90, 540, { anchor: 'l', show: true, cls: 'sm', style: 'letter-spacing:.16em' });
      S.g1 = glut(S.w, 380, 430, '', 'GLUT');
      S.outside = [];
      [[240, 270], [520, 250], [680, 300], [860, 245], [1020, 300], [1180, 255]].forEach(function (p) { S.outside.push(K.sugar(S.w, 'glc', 'Glc', p[0], p[1], false)); });
      S.mover = K.sugar(S.w, 'glc', 'Glc', 380, 200, false);
      // GLUT cards
      const cards = [
        ['GLUT1', 'RBCs, blood–brain barrier', 'Basal uptake', 'rev', 'glucose'],
        ['GLUT2', 'Liver, pancreatic β-cell, gut, kidney', 'High K<sub>m</sub> · two-way', 'lime', 'glucose + fructose'],
        ['GLUT3', 'Neurons', 'High affinity', 'rev', 'glucose'],
        ['GLUT4', 'Skeletal muscle, heart, adipose', '<b>Insulin-dependent</b>', 'purple', 'glucose'],
        ['GLUT5', 'Small intestine, testis', 'Fructose carrier', 'lime', 'fructose']
      ];
      S.cards = cards.map(function (c, i) {
        return K.node(S.w, 'card glutcard ' + (c[3] === 'lime' ? 'teal' : c[3] === 'purple' ? 'purple' : ''), '<h4>' + c[0] + '</h4><div class="row"><b>' + c[1] + '</b></div><div class="row">' + c[2] + '</div><span class="tagchip ' + c[3] + '">' + c[4] + '</span>', 100 + i * 345, 545, { anchor: 'tl' });
      });
      // insulin / GLUT4
      S.rec = K.node(S.w, 'receptor', '', 900, 430);
      S.recL = K.lbl(S.w, 'Insulin receptor', 900, 560, { cls: 'sm' });
      S.ins = K.node(S.w, 'insulin', 'Ins', 900, 150);
      S.ves = [[1100, 780], [1300, 740]].map(function (p) {
        const v = K.layer(S.w, p[0], p[1], false);
        K.node(v, 'vesicle', '', 0, 0, { show: true });
        K.node(v, 'prot g4', '', -18, 0, { show: true, style: 'width:28px;height:70px;border-radius:14px' });
        K.node(v, 'prot g4', '', 18, 0, { show: true, style: 'width:28px;height:70px;border-radius:14px' });
        return v;
      });
      S.g4a = glut(S.w, 1100, 430, 'g4', 'GLUT4');
      S.g4b = glut(S.w, 1300, 430, 'g4', 'GLUT4');
      S.vesL = K.lbl(S.w, 'GLUT4 storage vesicles', 1200, 880, { cls: 'sm' });
      // bidirectional
      S.bi = K.arrow(S.svg, 520, 270, 520, 600, { start: true, color: '#9ff5ea', w: 5 });
      S.biL = K.lbl(S.w, 'both ways', 540, 435, { anchor: 'l', cls: 'b' });
      S.in2 = K.sugar(S.w, 'glc', 'Glc', 250, 720, false);
      // trapping
      S.hk = K.enz(S.w, 'Hexokinase<small>preview of step 1</small>', 640, 700);
      S.block = K.crossSvg(S.svg, 380, 540, 18, false);
      S.g6pL = K.lbl(S.w, '<b style="color:#fff">G6P</b> is trapped', 380, 845, {});
      // fructose
      S.g5 = glut(S.w, 1620, 430, 'g5', 'GLUT5');
      S.fru = K.sugar(S.w, 'fru', 'Fru', 1620, 210, false);
      S.fru2 = K.sugar(S.w, 'fru', 'Fru', 1760, 280, false);
      S.fk = K.enz(S.w, 'Fructokinase<small>mainly liver</small>', 1400, 690);
      S.f1pL = K.lbl(S.w, '<b style="color:#fff">Fructose-1-P</b> → trioses → glycolysis', 1560, 790, {});
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.fade(tl, S.g1, 0.2);
        tl.to(S.outside.map(function (s) { return s.g; }), { autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 0.3);
        K.pop(tl, S.mover.g, 0.8);
        S.mover.move(tl, 380, 640, 1.5, 1.8, 'power1.inOut');
      } else if (i === 1) {
        K.fadeIn(tl, S.cards, 0, { stagger: 0.12, dy: 30 });
      } else if (i === 2) {
        K.out(tl, S.cards, 0, 0.4);
        K.fade(tl, [S.rec, S.recL], 0.3);
        K.pop(tl, S.ins, 0.5);
        tl.to(S.ins, { y: 330, duration: 1, ease: 'power2.in' }, 0.7);
        K.fadeIn(tl, [S.ves[0], S.ves[1], S.vesL], 1.5, { stagger: 0.1 });
        tl.to(S.ves[0], { y: 470, duration: 1.4, ease: 'power2.inOut' }, 2.2);
        tl.to(S.ves[1], { y: 470, duration: 1.4, ease: 'power2.inOut' }, 2.4);
        tl.to(S.ves, { autoAlpha: 0, duration: 0.4 }, 3.6);
        K.pop(tl, [S.g4a, S.g4b], 3.6, { stagger: 0.15 });
        K.out(tl, S.vesL, 3.8);
      } else if (i === 3) {
        tl.to([S.rec, S.recL, S.ins, S.g4a, S.g4b], { autoAlpha: 0.3, duration: 0.5 }, 0);
        K.draw(tl, S.bi, 0.2, 0.8);
        K.fade(tl, S.biL, 0.6);
        const s = S.outside[1];
        s.move(tl, 380, 330, 0.9, 0.7);
        s.move(tl, 300, 760, 1.6, 1.4);
        K.pop(tl, S.in2.g, 1.0);
        S.in2.move(tl, 380, 560, 2.9, 0.8);
        S.in2.move(tl, 560, 200, 3.7, 1.3);
      } else if (i === 4) {
        K.out(tl, [S.bi.g, S.biL], 0, 0.4);
        K.fade(tl, S.hk, 0.2);
        K.atpSpend(tl, S.w, { x: 760, y: 790 }, S.mover.P, { x: 880, y: 760 }, 0.4, { lift: -60 });
        K.swap(tl, S.mover.body, S.mover.alt('G6P'), '>-0.6');
        // G6P tries to leave: bounces
        tl.to(S.mover.g, { y: 540, duration: 0.6, ease: 'power2.out' }, '>+0.2');
        K.pop(tl, S.block, '<+0.4');
        tl.to(S.mover.g, { y: 640, duration: 0.6, ease: 'bounce.out' }, '>');
        K.fade(tl, S.g6pL, '<');
      } else if (i === 5) {
        tl.to([S.g1, S.hk, S.g6pL, S.mover.g, S.block, S.rec, S.recL, S.ins, S.g4a, S.g4b, S.in2.g].concat(S.outside.map(function (s) { return s.g; })), { autoAlpha: 0.25, duration: 0.6 }, 0);
        tl.to(S.w.querySelectorAll('.pill'), { autoAlpha: 0, duration: 0.4 }, 0);
        K.fade(tl, S.g5, 0.3);
        K.pop(tl, [S.fru.g, S.fru2.g], 0.5, { stagger: 0.15 });
        S.fru.move(tl, 1620, 660, 1.0, 1.6);
        K.fade(tl, S.fk, 2.0);
        K.atpSpend(tl, S.w, { x: 1380, y: 790 }, S.fru.P, { x: 1200, y: 640 }, 2.2, { lift: -40 });
        K.swap(tl, S.fru.body, S.fru.alt('F1P'), '>-0.6');
        K.fadeIn(tl, S.f1pL, '>-0.4');
      }
    },
    notes: '<p>Glucose is polar and can\'t diffuse through the lipid bilayer, so it uses GLUT carrier proteins. This is facilitated diffusion: no ATP is used for transport.</p><p>GLUT1 handles basal uptake, notably in RBCs. GLUT2 is high-K<sub>m</sub> and sits in liver and β-cells. GLUT3 is high-affinity in neurons. GLUT4 is the insulin-responsive transporter of muscle and fat. GLUT5 carries fructose.</p><p>Because GLUTs are bidirectional, the cell keeps uptake going by phosphorylating glucose to G6P straight away. GLUT doesn\'t carry G6P, so it\'s trapped.</p><p>Fructose enters via GLUT5 (and GLUT2). Fructokinase, mainly in liver (also kidney and intestine), makes fructose-1-phosphate, which aldolase B splits into trioses that join glycolysis.</p><h4>Viva points</h4><ul><li>GLUT4 is the only insulin-dependent GLUT: diabetes reduces its translocation.</li><li>Phosphorylation traps glucose and keeps the concentration gradient pointing inward.</li></ul>',
    viva: { q: 'Which glucose transporter is insulin-dependent, and where is it found?', a: '<b>GLUT4</b>, in skeletal muscle, heart and adipose tissue. Insulin moves GLUT4 from intracellular vesicles to the plasma membrane. RBCs (GLUT1), brain (GLUT1/3) and liver (GLUT2) take up glucose without insulin.' }
  });

  /* ============ 3. OVERVIEW ============ */
  D.add({
    id: 'overview', kicker: 'Glycolysis · Overview', title: 'Ten steps, <em>two</em> phases', menu: 'Glycolysis overview (EMP)',
    source: SRC_GLY,
    beats: [
      { cap: 'The <b>Embden–Meyerhof–Parnas (EMP)</b> pathway: glucose → 2 pyruvate in 10 steps, all in the <b>cytosol</b>. No O<sub>2</sub> needed.' },
      { cap: '<b>Investment phase</b> (steps 1–5): spend <span class="c-atp">2 ATP</span> to prime glucose, then split it into two 3-carbon trioses.' },
      { cap: '<b>Payoff phase</b> (steps 6–10) runs <b>twice</b> per glucose: <span class="c-atp">4 ATP</span> and <span class="c-nadh">2 NADH</span> are formed.' },
      { cap: 'Net per glucose: <b>2 ATP</b>, <span class="c-nadh">2 NADH</span>, 2 pyruvate. Gross ATP is 4; <b>net is 2</b>. Never mix them up.' }
    ],
    build: function (S) {
      K.backdrop(S, 'cytosol', 3);
      S.band1 = K.node(S.w, 'band inv', '', 70, 180, { anchor: 'tl', style: 'width:1780px;height:300px' });
      S.band2 = K.node(S.w, 'band pay', '', 70, 560, { anchor: 'tl', style: 'width:1780px;height:300px' });
      S.bl1 = K.node(S.w, 'bandlbl', '<span style="color:var(--phos)">Investment phase</span> · steps 1–5', 100, 210, { anchor: 'l' });
      S.bl2 = K.node(S.w, 'bandlbl', '<span style="color:var(--carbon)">Payoff phase</span> · steps 6–10 · <span style="color:#fff">×2</span>', 1820, 590, { anchor: 'r' });
      const y1 = 330, y2 = 720;
      const n1 = [['Glucose', 180], ['G6P', 480], ['F6P', 760], ['F1,6BP', 1060]];
      S.r1 = n1.map(function (n) { return K.node(S.w, 'mapnode inv', n[0], n[1], y1); });
      S.dhap = K.node(S.w, 'mapnode inv', 'DHAP', 1480, 250);
      S.gap1 = K.node(S.w, 'mapnode inv', 'GAP', 1480, 410);
      const n2 = [['2 GAP', 180], ['1,3-BPG', 490], ['3-PG', 790], ['2-PG', 1060], ['PEP', 1330], ['2 Pyruvate', 1660]];
      S.r2 = n2.map(function (n) { return K.node(S.w, 'mapnode pay', n[0], n[1], y2); });
      S.a1 = [K.react(S.svg, 260, y1, 420, y1, false), K.react(S.svg, 540, y1, 700, y1, true), K.react(S.svg, 820, y1, 980, y1, false)];
      S.a4a = K.arrow(S.svg, 1150, y1 - 10, 1405, 262, { bend: -30, w: 5, color: '#e6ecff', start: true });
      S.a4b = K.arrow(S.svg, 1150, y1 + 10, 1415, 402, { bend: 30, w: 5, color: '#e6ecff', start: true });
      S.a5 = K.react(S.svg, 1560, 285, 1560, 378, true, { head: 16 });
      S.a2 = [K.react(S.svg, 270, y2, 395, y2, true), K.react(S.svg, 585, y2, 735, y2, true), K.react(S.svg, 845, y2, 1000, y2, true), K.react(S.svg, 1120, y2, 1275, y2, true), K.react(S.svg, 1385, y2, 1545, y2, false)];
      S.down = K.arrow(S.svg, 1480, 445, 180, 684, { bend: -60, w: 3, color: '#9ff5ea', dash: '10 10' });
      S.x2 = K.chip(S.w, 'rev', '×2', 840, 545);
      const no = function (n, x, y, irr) { return K.node(S.w, 'stepno' + (irr ? ' irr' : ''), n, x, y); };
      S.no1 = [no(1, 340, y1 - 40, 1), no(2, 620, y1 - 40), no(3, 900, y1 - 40, 1), no(4, 1250, 245), no(5, 1615, 330)];
      S.no2 = [no(6, 332, y2 - 42), no(7, 660, y2 - 42), no(8, 922, y2 - 42), no(9, 1197, y2 - 42), no(10, 1465, y2 - 42, 1)];
      const sm = function (k, t, x, y) { return K.pill(S.w, k, t, x, y, { size: 'sm' }); };
      S.c1 = [sm('atp', 'ATP', 305, 400), sm('adp', 'ADP', 390, 400), sm('atp', 'ATP', 865, 400), sm('adp', 'ADP', 950, 400)];
      S.c2 = [sm('nad', 'NAD<sup>+</sup>', 285, 795), sm('nadh', 'NADH', 385, 795), sm('adp', 'ADP', 615, 795), sm('atp', 'ATP', 705, 795), sm('adp', 'ADP', 1420, 795), sm('atp', 'ATP', 1510, 795)];
      S.cyt = K.chip(S.w, 'rev', 'Cytosol · O<sub>2</sub> not required', 1630, 210);
      S.scrim = K.scrim(S);
      S.eq = K.node(S.w, 'card', '<div class="kick" style="text-align:center;margin-bottom:18px">Net reaction per glucose</div><div class="eq">Glucose + 2 NAD<sup>+</sup> + 2 ADP + 2 P<sub>i</sub><span class="arr">→</span>2 Pyruvate + 2 NADH + 2 H<sup>+</sup> + 2 ATP + 2 H<sub>2</sub>O</div>' +
        '<div style="display:flex;gap:16px;justify-content:center;margin-top:26px"><span class="tagchip amber" style="font-size:22px">ATP invested −2</span><span class="tagchip slp" style="font-size:22px">ATP generated +4 (gross)</span><span class="tagchip irr" style="font-size:22px">Net +2</span></div>', 960, 560, { w: 1560 });
    },
    step: function (i, tl, S) {
      const all1 = S.r1.concat([S.dhap, S.gap1]), all2 = S.r2;
      if (i === 0) {
        K.fade(tl, [S.band1, S.band2], 0, 0.8);
        tl.fromTo(all1.concat(all2, S.no1, S.no2), { autoAlpha: 0 }, { autoAlpha: 0.28, duration: 0.6, stagger: 0.03 }, 0.3);
        tl.fromTo([S.a1[0].g, S.a1[1].g, S.a1[2].g, S.a4a.g, S.a4b.g, S.a5.g].concat(S.a2.map(function (a) { return a.g; })), { autoAlpha: 0 }, { autoAlpha: 0.22, duration: 0.6 }, 0.6);
        tl.set([S.a4a.p, S.a4b.p], { attr: { 'stroke-dashoffset': 0 } }, 0.6);
        tl.set([].concat(S.a4a.heads, S.a4b.heads), { autoAlpha: 1 }, 0.6);
        K.pop(tl, S.cyt, 1.0);
      } else if (i === 1) {
        K.fade(tl, S.bl1, 0);
        tl.to([S.r1[0], S.no1[0]], { autoAlpha: 1, duration: 0.3 }, 0.1);
        const seq = [[S.a1[0], S.r1[1], S.no1[0]], [S.a1[1], S.r1[2], S.no1[1]], [S.a1[2], S.r1[3], S.no1[2]]];
        seq.forEach(function (s, k) {
          tl.to(s[0].g, { autoAlpha: 1, duration: 0.2 }, 0.3 + k * 0.6);
          K.draw(tl, s[0], 0.3 + k * 0.6, 0.45);
          tl.to([s[1], s[2]], { autoAlpha: 1, duration: 0.3 }, 0.6 + k * 0.6);
        });
        tl.to([S.a4a.g, S.a4b.g, S.no1[3], S.dhap, S.gap1, S.a5.g, S.no1[4]], { autoAlpha: 1, duration: 0.5, stagger: 0.12 }, 2.1);
        K.pop(tl, S.c1, 0.4, { stagger: 0.25 });
      } else if (i === 2) {
        K.fade(tl, S.bl2, 0);
        K.draw(tl, S.down, 0.1, 0.9);
        K.pop(tl, S.x2, 0.6);
        tl.to([S.r2[0], S.no2[0]], { autoAlpha: 1, duration: 0.3 }, 0.9);
        S.a2.forEach(function (a, k) {
          tl.to(a.g, { autoAlpha: 1, duration: 0.2 }, 1.1 + k * 0.45);
          K.draw(tl, a, 1.1 + k * 0.45, 0.35);
          tl.to([S.r2[k + 1], S.no2[k]], { autoAlpha: 1, duration: 0.3 }, 1.35 + k * 0.45);
        });
        K.pop(tl, S.c2.slice(0, 2), 1.4, { stagger: 0.15 });
        K.pop(tl, S.c2.slice(2, 4), 1.9, { stagger: 0.15 });
        K.pop(tl, S.c2.slice(4), 3.3, { stagger: 0.15 });
      } else if (i === 3) {
        K.fade(tl, S.scrim, 0, 0.6);
        K.fadeIn(tl, S.eq, 0.3, { dy: 30 });
      }
    },
    notes: '<p>Glycolysis is also called the EMP pathway, after Embden, Meyerhof and Parnas. It turns one 6-carbon glucose into two 3-carbon pyruvates.</p><p>It runs in the cytosol of every cell and needs no oxygen. That\'s why RBCs and exercising muscle can rely on it.</p><p>Steps 1–5 are the investment or preparatory phase: two ATP are spent and the hexose is split into two triose phosphates.</p><p>Steps 6–10 are the payoff phase. They run twice per glucose and give 4 ATP and 2 NADH. Net yield: 2 ATP.</p><h4>Viva points</h4><ul><li>Irreversible steps are 1, 3 and 10 (hexokinase, PFK-1, pyruvate kinase), shown by single arrows.</li><li>Gross 4 ATP vs net 2 ATP: always state which one you mean.</li></ul>',
    viva: { q: 'Write the net equation of glycolysis. What is the gross and the net ATP yield?', a: 'Glucose + 2 NAD<sup>+</sup> + 2 ADP + 2 P<sub>i</sub> → 2 pyruvate + 2 NADH + 2 H<sup>+</sup> + 2 ATP + 2 H<sub>2</sub>O. <b>Gross 4 ATP</b> (steps 7 and 10, twice each), minus <b>2 invested</b> (steps 1 and 3) = <b>net 2 ATP</b>.' }
  });

  /* ============ 4. STEPS 1–3 ============ */
  D.add({
    id: 's1-3', kicker: 'Investment phase · Steps 1–3', title: 'Priming the sugar', menu: 'Steps 1–3: HK, PGI, PFK-1',
    source: SRC_GLY,
    beats: [
      { cap: 'Six carbons, numbered <span class="c-c">C1–C6</span>. These circles are a schematic skeleton, not a full structure.', ctr: { inv: 0, gen: 0, nadh: 0, nad: 0, tag: 'per glucose' }, map: [1] },
      { cap: '<b>Step 1</b>: hexokinase moves the terminal phosphate of <span class="c-atp">ATP</span> onto <b>C6</b>. ATP becomes <span class="c-adp">ADP</span>. Irreversible.', ctr: { inv: 1, gen: 0, nadh: 0, nad: 0, tag: 'per glucose' }, map: [1] },
      { cap: '<b>Step 2</b>: phosphoglucose isomerase moves the carbonyl from C1 to C2, turning an aldose into a ketose. Reversible.', map: [2] },
      { cap: '<b>Step 3</b>: <b>PFK-1</b> puts a second phosphate on <b>C1</b>. Committed, rate-limiting and irreversible.', ctr: { inv: 2, gen: 0, nadh: 0, nad: 0, tag: 'per glucose' }, map: [3] },
      { cap: '<span class="c-atp">2 ATP</span> invested. Fructose-1,6-bisphosphate has a phosphate at each end, ready to split.', map: [1, 2, 3] }
    ],
    build: function (S) {
      K.backdrop(S, 'cytosol', 4);
      S.ch = K.chain(S.w, { n: 6, x: 760, y: 560, gap: 104 });
      S.P6 = S.ch.addP(5, 'up');
      S.P1 = S.ch.addP(0, 'up');
      gsap.set(S.ch.g, { autoAlpha: 0 });
      S.co = K.node(S.ch.g, 'coTag', 'C=O', S.ch.lx(0), 82, {});
      S.names = ['Glucose', 'Glucose-6-phosphate', 'Fructose-6-phosphate', 'Fructose-1,6-bisphosphate'].map(function (t) { return K.node(S.w, 'mname', t, 760, 740); });
      S.abbr = ['', 'G6P', 'F6P', 'F1,6BP'].map(function (t) { return t ? K.node(S.w, 'lbl', t, 760, 790) : null; });
      S.h1 = K.stepHead(S.w, 1, 'Hexokinase <small>(glucokinase in liver) · Mg<sup>2+</sup></small>', 'Glucose + ATP → G6P + ADP', 'irr', 'irreversible');
      S.h2 = K.stepHead(S.w, 2, 'Phosphoglucose isomerase', 'G6P' + K.EQ + 'F6P', 'rev', 'reversible');
      S.h3 = K.stepHead(S.w, 3, 'Phosphofructokinase-1 <small>(PFK-1) · Mg<sup>2+</sup></small>', 'F6P + ATP → F1,6BP + ADP', 'irr', 'irreversible');
      S.h2.querySelector('.sr').innerHTML = 'G6P ' + K.EQ + ' F6P &nbsp;<span class="tagchip rev" style="vertical-align:4px">reversible</span>';
      S.ald = K.lbl(S.w, 'aldose → ketose', 604, 690, { cls: 'sm' });
      S.sum = [K.chip(S.w, 'slp', '2 ATP invested', 560, 850), K.chip(S.w, 'amber', 'P on C1 and C6', 860, 850), K.chip(S.w, 'irr', 'committed to glycolysis', 1170, 850)];
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.fade(tl, S.ch.g, 0.1, 0.8);
        tl.from(S.ch.atoms, { scale: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, 0.1);
        K.fadeIn(tl, S.names[0], 0.6);
        K.pop(tl, S.co, 1.0);
      } else if (i === 1) {
        K.fadeIn(tl, S.h1, 0);
        K.atpSpend(tl, S.w, { x: 1320, y: 380 }, S.P6, { x: 1360, y: 700 }, 0.4, { lift: -120 });
        K.out(tl, S.names[0], 2.2, 0.3);
        K.fadeIn(tl, [S.names[1], S.abbr[1]], 2.4);
      } else if (i === 2) {
        K.out(tl, S.h1, 0, 0.3);
        K.fadeIn(tl, S.h2, 0.3);
        tl.to(S.co, { x: S.ch.lx(1), duration: 1.2, ease: 'power2.inOut' }, 0.6);
        K.fade(tl, S.ald, 1.0);
        K.out(tl, [S.names[1], S.abbr[1]], 1.2, 0.3);
        K.fadeIn(tl, [S.names[2], S.abbr[2]], 1.5);
        tl.to(S.ald, { autoAlpha: 0, duration: 0.6 }, 3.2);
      } else if (i === 3) {
        K.out(tl, S.h2, 0, 0.3);
        K.fadeIn(tl, S.h3, 0.3);
        K.atpSpend(tl, S.w, { x: 300, y: 380 }, S.P1, { x: 220, y: 700 }, 0.5, { lift: -120 });
        K.out(tl, [S.names[2], S.abbr[2]], 2.3, 0.3);
        K.fadeIn(tl, [S.names[3], S.abbr[3]], 2.5);
      } else if (i === 4) {
        K.out(tl, S.h3, 0, 0.4);
        tl.to(S.ch.atoms, { scale: 1.16, duration: 0.35, stagger: 0.05, yoyo: true, repeat: 1 }, 0.1);
        tl.to([S.P1.ball, S.P6.ball], { scale: 1.25, duration: 0.35, yoyo: true, repeat: 1 }, 0.3);
        K.fadeIn(tl, S.sum, 0.5, { stagger: 0.15 });
      }
    },
    notes: '<p>Step 1: hexokinase transfers the terminal phosphate of ATP to C6 of glucose, giving glucose-6-phosphate. Mg<sup>2+</sup> is needed. The step is irreversible. In liver and pancreatic β-cells the isoenzyme is glucokinase.</p><p>Step 2: phosphoglucose isomerase converts the aldose G6P to the ketose F6P by moving the carbonyl from C1 to C2. It\'s freely reversible.</p><p>Step 3: PFK-1 adds a second phosphate, from ATP, onto C1 to make fructose-1,6-bisphosphate. This is the committed, rate-limiting step of glycolysis.</p><p>Two ATP have now been spent. The ledger shows −2 invested.</p><h4>Viva points</h4><ul><li>PFK-1 is the rate-limiting, committed step. Its main allosteric activator is fructose-2,6-bisphosphate.</li><li>"Bisphosphate" means two phosphates on different carbons (F1,6BP), unlike "diphosphate" (ADP), where they are linked to each other.</li></ul>',
    viva: { q: 'Which is the committed and rate-limiting step of glycolysis? Name its key activator and inhibitor.', a: '<b>Step 3, PFK-1</b> (F6P + ATP → F1,6BP + ADP). Activated by AMP, ADP and especially <b>fructose-2,6-bisphosphate</b>. Inhibited by <b>ATP</b>, citrate and H<sup>+</sup>.' }
  });

  /* ============ 5. STEPS 4–5 ============ */
  D.add({
    id: 's4-5', kicker: 'Investment phase · Steps 4–5', title: 'Splitting into two trioses', menu: 'Steps 4–5: aldolase, TPI',
    source: SRC_GLY,
    beats: [
      { cap: 'Fructose-1,6-bisphosphate: six carbons, phosphates on C1 and C6.', ctr: { inv: 2, gen: 0, nadh: 0, nad: 0, tag: 'per glucose' }, map: [4] },
      { cap: '<b>Step 4</b>: <b>aldolase</b> cuts the bond between <b>C3 and C4</b>, giving two 3-carbon trioses. Reversible.' },
      { cap: 'Atom identity is kept: <b>DHAP</b> holds glucose C1–C3; <b>GAP</b> holds glucose C4–C6.' },
      { cap: '<b>Step 5</b>: TPI turns DHAP into a second GAP. Glucose <b>C3 and C4</b> become aldehyde carbons; <b>C1 and C6</b> carry the phosphate.', map: [5] },
      { cap: 'Two GAP molecules now run through steps 6–10. <b>Every later step happens twice per glucose.</b>', map: [6] }
    ],
    build: function (S) {
      K.backdrop(S, 'cytosol', 5);
      S.L = K.chain(S.w, { n: 3, x: 830, y: 520, gap: 100, labels: ['C1', 'C2', 'C3'] });
      S.R = K.chain(S.w, { n: 3, x: 1130, y: 520, gap: 100, labels: ['C4', 'C5', 'C6'] });
      S.PL = S.L.addP(0, 'left', false, true);
      S.PR = S.R.addP(2, 'right', false, true);
      S.mid = K.node(S.w, 'bond', '', 980, 520, { show: true, style: 'width:100px' });
      S.w.insertBefore(S.mid, S.L.g);
      gsap.set([S.L.g, S.R.g, S.mid], { autoAlpha: 0 });
      S.fname = K.node(S.w, 'mname', 'Fructose-1,6-bisphosphate<small>F1,6BP</small>', 980, 640);
      S.knife = K.node(S.w, 'knife', '', 980, 520);
      S.h4 = K.stepHead(S.w, 4, 'Aldolase', 'F1,6BP ' + K.EQ + ' DHAP + GAP', 'rev', 'reversible');
      S.h5 = K.stepHead(S.w, 5, 'Triose phosphate isomerase <small>(TPI)</small>', 'DHAP ' + K.EQ + ' GAP', 'rev', 'reversible');
      S.nD = K.node(S.w, 'mname', 'DHAP<small>dihydroxyacetone phosphate</small>', 760, 380, { anchor: 'r' });
      S.nG = K.node(S.w, 'mname', 'GAP<small>glyceraldehyde-3-phosphate</small>', 760, 660, { anchor: 'r' });
      S.nG2 = K.node(S.w, 'mname', 'GAP<small>made from DHAP</small>', 760, 380, { anchor: 'r' });
      S.idD = K.chip(S.w, 'amber', 'glucose C1–C3', 980, 455);
      S.idG = K.chip(S.w, 'amber', 'glucose C4–C6', 980, 735);
      S.tpi = K.react(S.svg, 1290, 420, 1290, 600, true, { head: 18 });
      S.tpiL = K.enz(S.w, 'TPI', 1335, 510, { anchor: 'l' });
      S.hdr = [K.lbl(S.w, 'aldehyde C', 860, 305, { cls: 'sm b' }), K.lbl(S.w, 'phosphate C', 1100, 305, { cls: 'sm b' })];
      S.go1 = K.arrow(S.svg, 1260, 380, 1440, 380, { color: '#9ff5ea', w: 5 });
      S.go2 = K.arrow(S.svg, 1260, 660, 1440, 660, { color: '#9ff5ea', w: 5 });
      S.goL = K.node(S.w, 'tagchip rev', 'to step 6 · ×2', 1500, 520, { style: 'font-size:20px' });
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.fade(tl, [S.L.g, S.R.g, S.mid], 0.1, 0.8);
        K.fadeIn(tl, S.fname, 0.5);
      } else if (i === 1) {
        K.fadeIn(tl, S.h4, 0);
        tl.fromTo(S.knife, { autoAlpha: 0, y: 380 }, { autoAlpha: 1, y: 520, duration: 0.6, ease: 'power2.out' }, 0.4);
        tl.to(S.mid, { autoAlpha: 0, scaleX: 0.2, duration: 0.4 }, 1.0);
        tl.to(S.knife, { autoAlpha: 0, duration: 0.4 }, 1.3);
        K.out(tl, S.fname, 1.0, 0.3);
        S.L.move(tl, 980, 380, 1.2, 1.3);
        S.R.move(tl, 980, 660, 1.2, 1.3);
        K.fadeIn(tl, [S.nD, S.nG], 2.2, { stagger: 0.15 });
      } else if (i === 2) {
        K.pop(tl, [S.idD, S.idG], 0.1, { stagger: 0.2 });
        tl.to(S.L.atoms, { scale: 1.16, duration: 0.35, yoyo: true, repeat: 1, stagger: 0.06 }, 0.2);
        tl.to(S.R.atoms, { scale: 1.16, duration: 0.35, yoyo: true, repeat: 1, stagger: 0.06 }, 0.5);
      } else if (i === 3) {
        K.out(tl, [S.h4, S.idD, S.idG], 0, 0.3);
        K.fadeIn(tl, S.h5, 0.3);
        K.draw(tl, S.tpi, 0.4, 0.5);
        K.fade(tl, S.tpiL, 0.6);
        // C1 (with its phosphate) and C3 swap ends: the phosphate carbon ends up on the right, like GAP
        const a1 = S.L.atoms[0], a3 = S.L.atoms[2];
        tl.to(a1, { y: -70, duration: 0.5, ease: 'power2.out' }, 1.0);
        tl.to(a3, { y: 70, duration: 0.5, ease: 'power2.out' }, 1.0);
        tl.to(S.PL.els, { y: '-=70', duration: 0.5, ease: 'power2.out' }, 1.0);
        tl.to(a1, { x: 100, duration: 0.9, ease: 'power2.inOut' }, 1.5);
        tl.to(a3, { x: -100, duration: 0.9, ease: 'power2.inOut' }, 1.5);
        tl.to(S.PL.stick, { x: 137, duration: 0.9, ease: 'power2.inOut' }, 1.5);
        tl.to(S.PL.ball, { x: 174, duration: 0.9, ease: 'power2.inOut' }, 1.5);
        tl.to([a1, a3], { y: 0, duration: 0.5, ease: 'power2.in' }, 2.4);
        tl.to(S.PL.els, { y: '+=70', duration: 0.5, ease: 'power2.in' }, 2.4);
        K.out(tl, S.nD, 2.6, 0.3);
        K.fadeIn(tl, S.nG2, 2.8);
        K.fadeIn(tl, S.hdr, 3.0, { stagger: 0.12 });
      } else if (i === 4) {
        K.out(tl, [S.h5, S.tpi.g, S.tpiL], 0, 0.3);
        K.draw(tl, S.go1, 0.3, 0.6);
        K.draw(tl, S.go2, 0.3, 0.6);
        K.pop(tl, S.goL, 0.8);
        tl.to(S.L.atoms.concat(S.R.atoms), { scale: 1.16, duration: 0.35, yoyo: true, repeat: 1 }, 0.5);
      }
    },
    notes: '<p>Step 4: aldolase cleaves fructose-1,6-bisphosphate between C3 and C4. It is an aldol cleavage and is reversible.</p><p>Carbons 1–3 become dihydroxyacetone phosphate (DHAP); carbons 4–6 become glyceraldehyde-3-phosphate (GAP).</p><p>Step 5: triose phosphate isomerase converts DHAP to GAP, so one glucose gives two GAP. Only GAP continues down the pathway.</p><p>In the GAP made from DHAP, glucose C3 is the aldehyde carbon and C1 carries the phosphate. In the other GAP, C4 is the aldehyde and C6 has the phosphate.</p><h4>Viva points</h4><ul><li>Steps 4–5 are called the splitting phase. DHAP also links glycolysis to glycerol and triglyceride metabolism.</li><li>Glucose C3 and C4 end up as the carboxyl carbon of pyruvate, so they\'re the carbons lost as CO<sub>2</sub> at PDH.</li></ul>',
    viva: { q: 'Aldolase cleaves fructose-1,6-bisphosphate between which carbons? What are the products, and what happens to DHAP?', a: 'Between <b>C3 and C4</b>. C1–C3 → <b>DHAP</b>, C4–C6 → <b>glyceraldehyde-3-phosphate</b>. <b>Triose phosphate isomerase</b> converts DHAP to GAP, so two GAP enter the payoff phase.' }
  });
})();
