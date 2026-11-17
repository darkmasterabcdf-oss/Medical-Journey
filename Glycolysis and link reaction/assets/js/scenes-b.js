/* METABOLIC JOURNEY — scenes 6–10 */
(function () {
  'use strict';
  const D = window.Deck;
  const SRC_GLY = 'OpenStax Biology 2e §7.2 · Lippincott Biochemistry 8e Ch. 8 · NCBI StatPearls: Glycolysis';
  const CTR2 = { inv: 2, gen: 0, nadh: 0, nad: 0, tag: 'per glucose' };

  function toward(cx, cy, x, y, r) { const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy); return { x: cx + dx / L * r, y: cy + dy / L * r }; }

  /* ============ 6. GAPDH ============ */
  D.add({
    id: 's6', kicker: 'Payoff phase · Step 6', title: 'GAPDH: the oxidation step', menu: 'Step 6: GAPDH',
    source: SRC_GLY,
    beats: [
      { cap: 'Two GAP molecules (glucose carbons kept). A pool of free <span class="c-p">inorganic phosphate (P<sub>i</sub>)</span> sits in the cytosol.', ctr: CTR2, map: [6] },
      { cap: '<b>Oxidation</b>: the aldehyde carbon gives up a hydride. <span class="c-nad">NAD<sup>+</sup></span> is reduced to <span class="c-nadh">NADH + H<sup>+</sup></span>, once per GAP.', ctr: { inv: 2, gen: 0, nadh: 2, nad: -2, tag: 'per glucose' } },
      { cap: 'The energy is captured: <span class="c-p">P<sub>i</sub></span> joins that carbon, making <b>1,3-BPG</b>, a high-energy acyl phosphate.' },
      { cap: 'The phosphate comes from the <b>cytosolic P<sub>i</sub> pool, not from ATP</b>. Twice per glucose, so 2 NADH.' }
    ],
    build: function (S) {
      K.backdrop(S, 'cytosol', 6);
      S.head = K.stepHead(S.w, 6, 'Glyceraldehyde-3-P dehydrogenase <small>(GAPDH)</small>', 'GAP + P<sub>i</sub> + NAD<sup>+</sup>' + K.EQ + '1,3-BPG + NADH + H<sup>+</sup>', 'rev', 'reversible');
      S.T = K.chain(S.w, { n: 3, x: 800, y: 420, gap: 100, labels: ['C3', 'C2', 'C1'] });
      S.B = K.chain(S.w, { n: 3, x: 800, y: 680, gap: 100, labels: ['C4', 'C5', 'C6'] });
      [S.T, S.B].forEach(function (c) { c.P3 = c.addP(2, 'right', false, true); c.Pa = c.addP(0, 'left', true, false); gsap.set(c.g, { autoAlpha: 0 }); });
      S.cho = [K.node(S.T.g, 'coTag', 'CHO', -100, 66), K.node(S.B.g, 'coTag', 'CHO', -100, 66)];
      S.coo = [K.node(S.T.g, 'coTag', 'C=O', -100, 66), K.node(S.B.g, 'coTag', 'C=O', -100, 66)];
      S.nGAP = [K.node(S.w, 'mname', 'GAP', 560, 420, { anchor: 'r' }), K.node(S.w, 'mname', 'GAP', 560, 680, { anchor: 'r' })];
      S.nBPG = [K.node(S.w, 'mname', '1,3-BPG<small>1,3-bisphosphoglycerate</small>', 560, 420, { anchor: 'r' }), K.node(S.w, 'mname', '1,3-BPG<small>1,3-bisphosphoglycerate</small>', 560, 680, { anchor: 'r' })];
      S.pool = K.node(S.w, 'pool', '', 1300, 800);
      S.poolL = K.lbl(S.w, 'cytosolic P<sub>i</sub> pool', 1300, 890, { cls: 'sm' });
      S.pis = [[1240, 780], [1300, 815], [1360, 780], [1270, 840], [1340, 760]].map(function (p) { return K.node(S.w, 'pi', 'P<sub>i</sub>', p[0], p[1]); });
      S.nad = [K.pill(S.w, 'nad', 'NAD<sup>+</sup>', 1250, 330), K.pill(S.w, 'nad', 'NAD<sup>+</sup>', 1250, 590)];
      S.nadh = [K.pill(S.w, 'nadh', 'NADH + H<sup>+</sup>', 1250, 330), K.pill(S.w, 'nadh', 'NADH + H<sup>+</sup>', 1250, 590)];
      S.e = [K.node(S.w, 'edot', 'H<sup>−</sup>', 700, 420), K.node(S.w, 'edot', 'H<sup>−</sup>', 700, 680)];
      S.src = K.card(S.w, 'amber', '<div class="row" style="margin:0"><b style="color:var(--phos)">Phosphate source:</b> free cytosolic P<sub>i</sub> &nbsp;·&nbsp; <b>not ATP</b> (no ATP used)</div>', 80, 790, 760, { style: 'padding:18px 26px' });
      S.x2 = K.chip(S.w, 'rev', '×2 per glucose → 2 NADH', 1310, 480, { style: 'font-size:20px' });
      S.key = K.lbl(S.w, 'circle labels = original glucose carbon', 800, 322, { cls: 'sm' });
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.fadeIn(tl, S.head, 0);
        K.fade(tl, [S.T.g, S.B.g], 0.2, 0.8);
        K.fadeIn(tl, [S.cho[0], S.cho[1], S.key].concat(S.nGAP), 0.5);
        K.fade(tl, [S.pool, S.poolL], 0.7);
        K.pop(tl, S.pis, 0.9, { stagger: 0.08 });
        tl.call(function () { S.loop(gsap.to(S.pis.slice(2), { y: '+=8', x: '-=6', duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.4 })); }, null, 1.6);
      } else if (i === 1) {
        K.pop(tl, S.nad, 0.1, { stagger: 0.15 });
        tl.to(S.nad[0], { x: 1080, duration: 0.7, ease: 'power2.out' }, 0.5);
        tl.to(S.nad[1], { x: 1080, duration: 0.7, ease: 'power2.out' }, 0.6);
        tl.set(S.nadh, { x: 1080 }, 0);
        [0, 1].forEach(function (k) {
          const y = k ? 680 : 420;
          tl.set(S.e[k], { autoAlpha: 1, scale: 0.4 }, 1.2 + k * 0.2);
          tl.to(S.e[k], { scale: 1, duration: 0.25 }, '>');
          K.arc(tl, S.e[k], { x: 700, y: y }, { x: 1080, y: y - 90 }, '>', { lift: -80, dur: 1.0 });
          tl.set(S.e[k], { autoAlpha: 0 });
          K.swap(tl, S.nad[k], S.nadh[k], '<');
        });
        tl.to(S.nadh, { x: 1300, duration: 0.8, ease: 'power2.inOut' }, '>+0.2');
      } else if (i === 2) {
        K.out(tl, S.cho, 0, 0.3);
        K.pop(tl, S.coo, 0.2);
        [S.T, S.B].forEach(function (c, k) {
          const from = { x: 1270 + k * 60, y: 780 + k * 30 };
          tl.to(S.pis[k], { autoAlpha: 0, duration: 0.2 }, 0.4 + k * 0.3);
          K.transferP(tl, S.w, from, c.Pa.abs(), c.Pa.els, 0.4 + k * 0.3, { lift: -160, dur: 1.3, hi: true });
        });
        K.out(tl, S.nGAP, 1.6, 0.3);
        K.fadeIn(tl, S.nBPG, 1.8);
      } else if (i === 3) {
        K.fadeIn(tl, S.src, 0);
        K.pop(tl, S.x2, 0.5);
        tl.to([S.T.Pa.ball, S.B.Pa.ball], { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1 }, 0.6);
      }
    },
    notes: '<p>Step 6 is the only oxidation in glycolysis. GAPDH oxidises the aldehyde group of GAP, passing a hydride to NAD<sup>+</sup> to make NADH + H<sup>+</sup>.</p><p>The energy released is captured by adding inorganic phosphate, giving 1,3-bisphosphoglycerate. Its acyl phosphate has a high phosphoryl-transfer potential.</p><p>The phosphate comes from the free P<sub>i</sub> pool, not from ATP. The reaction is reversible.</p><p>It happens once for each GAP, so twice per glucose: 2 NADH. NAD<sup>+</sup> is limited, so it has to be regenerated or glycolysis stops at this step.</p><h4>Viva points</h4><ul><li>GAPDH has an active-site cysteine –SH. Iodoacetate alkylates it, and arsenate replaces P<sub>i</sub> here.</li><li>Steps 6 and the LDH reaction are coupled through NAD<sup>+</sup>/NADH under anaerobic conditions.</li></ul>',
    viva: { q: 'Which is the only oxidative step of glycolysis, and where does its phosphate come from?', a: '<b>Step 6, glyceraldehyde-3-phosphate dehydrogenase</b>: GAP + P<sub>i</sub> + NAD<sup>+</sup>' + K.EQ + '1,3-BPG + NADH + H<sup>+</sup>. The phosphate is <b>inorganic phosphate (P<sub>i</sub>)</b> from the cytosol, not ATP.' }
  });

  /* ============ 7. STEPS 7–10 ============ */
  D.add({
    id: 's7-10', kicker: 'Payoff phase · Steps 7–10', title: 'Cashing in: making ATP', menu: 'Steps 7–10: PGK → PK',
    source: SRC_GLY,
    beats: [
      { cap: 'Two 1,3-BPG, each with a high-energy acyl phosphate on its carboxyl carbon.', ctr: { inv: 2, gen: 0, nadh: 2, nad: -2, tag: 'per glucose' }, map: [7] },
      { cap: '<b>Step 7</b>: PGK passes that phosphate to <span class="c-adp">ADP</span>, making <span class="c-atp">ATP</span>: <b>substrate-level phosphorylation #1</b>. Reversible.', ctr: { inv: 2, gen: 2, nadh: 2, nad: -2, tag: 'per glucose' } },
      { cap: '<b>Step 8</b>: phosphoglycerate mutase moves the phosphate from carbon 3 to carbon 2 of glycerate: 3-PG' + K.EQ + '2-PG.', map: [8] },
      { cap: '<b>Step 9</b>: <b>enolase</b> removes H<sub>2</sub>O, making PEP, whose enol phosphate has very high transfer potential.', map: [9] },
      { cap: '<b>Step 10</b>: pyruvate kinase gives that phosphate to ADP: <b>substrate-level phosphorylation #2</b>. Irreversible.', ctr: { inv: 2, gen: 4, nadh: 2, nad: -2, tag: 'per glucose' }, map: [10] },
      { cap: 'Final ledger: <b>−2 invested, +4 generated (gross), net +2 ATP</b>, 2 NADH and 2 pyruvate per glucose.', map: [6, 7, 8, 9, 10] }
    ],
    build: function (S) {
      K.backdrop(S, 'cytosol', 7);
      S.heads = [
        K.stepHead(S.w, 7, 'Phosphoglycerate kinase <small>(PGK) · Mg<sup>2+</sup></small>', '1,3-BPG + ADP' + K.EQ + '3-PG + ATP', 'slp', 'SLP #1'),
        K.stepHead(S.w, 8, 'Phosphoglycerate mutase', '3-PG' + K.EQ + '2-PG', 'rev', 'reversible'),
        K.stepHead(S.w, 9, 'Enolase <small>· Mg<sup>2+</sup></small>', '2-PG' + K.EQ + 'PEP + H<sub>2</sub>O', 'rev', 'reversible'),
        K.stepHead(S.w, 10, 'Pyruvate kinase <small>· Mg<sup>2+</sup>, K<sup>+</sup></small>', 'PEP + ADP → pyruvate + ATP', 'slp', 'SLP #2 · irreversible')
      ];
      S.ch = [K.chain(S.w, { n: 3, x: 840, y: 440, gap: 100, labels: ['C3', 'C2', 'C1'] }), K.chain(S.w, { n: 3, x: 840, y: 700, gap: 100, labels: ['C4', 'C5', 'C6'] })];
      S.ch.forEach(function (c) {
        c.Pa = c.addP(0, 'left', true, true);
        c.P3 = c.addP(2, 'right', false, true);
        c.P2 = c.addP(1, 'up', false, false);
        c.P2h = c.addP(1, 'up', true, false);
        gsap.set(c.g, { autoAlpha: 0 });
      });
      const names = [['1,3-BPG', ''], ['3-PG', '3-phosphoglycerate'], ['2-PG', '2-phosphoglycerate'], ['PEP', 'phosphoenolpyruvate'], ['Pyruvate', '']];
      S.names = names.map(function (n) { return [440, 700].map(function (y) { return K.node(S.w, 'mname', n[0] + (n[1] ? '<small>' + n[1] + '</small>' : ''), 600, y, { anchor: 'r' }); }); });
      S.h2o = [K.pill(S.w, 'h2o', 'H<sub>2</sub>O', 900, 500, { size: 'sm' }), K.pill(S.w, 'h2o', 'H<sub>2</sub>O', 900, 760, { size: 'sm' })];
      S.key = K.lbl(S.w, 'circle labels = original glucose carbon', 840, 300, { cls: 'sm' });
      S.scrim = K.scrim(S);
      S.sum = K.card(S.w, 'teal', '<div class="kick" style="margin-bottom:16px">Glycolysis balance sheet · per glucose</div>' +
        '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;text-align:center">' +
        '<div><div class="cell inv" style="padding:16px"><div class="k">Invested</div><div class="v">−2</div></div><div class="legend-note" style="margin-top:8px">steps 1, 3</div></div>' +
        '<div><div class="cell gen" style="padding:16px"><div class="k">Generated</div><div class="v">+4</div></div><div class="legend-note" style="margin-top:8px">steps 7, 10 (×2) · gross</div></div>' +
        '<div><div class="cell net" style="padding:16px"><div class="k">Net ATP</div><div class="v">+2</div></div><div class="legend-note" style="margin-top:8px">4 − 2</div></div>' +
        '<div><div class="cell nadh" style="padding:16px"><div class="k">NADH</div><div class="v">2</div></div><div class="legend-note" style="margin-top:8px">step 6 (×2)</div></div>' +
        '<div><div class="cell" style="padding:16px;border-color:rgba(45,212,191,.6)"><div class="k">Pyruvate</div><div class="v" style="color:#9ff5ea">2</div></div><div class="legend-note" style="margin-top:8px">3 carbons each</div></div>' +
        '</div>', 160, 270, 1380);
    },
    step: function (i, tl, S) {
      const swapName = function (k, at) { K.out(tl, S.names[k - 1], at, 0.3); K.fadeIn(tl, S.names[k], at + 0.2); };
      if (i === 0) {
        K.fadeIn(tl, S.heads[0], 0);
        K.fade(tl, S.ch.map(function (c) { return c.g; }), 0.2, 0.8);
        K.fadeIn(tl, [S.names[0], S.key], 0.5);
      } else if (i === 1) {
        S.ch.forEach(function (c, k) {
          const y = k ? 610 : 350;
          K.atpMake(tl, S.w, { x: 400, y: y }, c.Pa, { x: 1200, y: y + 40 }, 0.2 + k * 0.35, { lift: -70, hi: true });
        });
        swapName(1, 2.2);
      } else if (i === 2) {
        K.out(tl, S.heads[0], 0, 0.3); K.fadeIn(tl, S.heads[1], 0.3);
        S.ch.forEach(function (c, k) {
          tl.to(c.P3.els, { autoAlpha: 0, duration: 0.2 }, 0.5 + k * 0.2);
          K.transferP(tl, S.w, c.P3.abs(), c.P2.abs(), c.P2.els, 0.5 + k * 0.2, { lift: -70, dur: 1.0 });
        });
        swapName(2, 1.6);
      } else if (i === 3) {
        K.out(tl, S.heads[1], 0, 0.3); K.fadeIn(tl, S.heads[2], 0.3);
        S.ch.forEach(function (c, k) {
          const y = k ? 760 : 500;
          tl.fromTo(S.h2o[k], { autoAlpha: 0, x: 900, y: y - 40, scale: 0.5 }, { autoAlpha: 1, scale: 1, y: y, duration: 0.5 }, 0.6 + k * 0.2);
          tl.to(S.h2o[k], { x: 1120, y: y + 40, autoAlpha: 0.6, duration: 1.2, ease: 'power2.inOut' }, 1.2 + k * 0.2);
          K.swap(tl, c.P2.ball, c.P2h.ball, 1.1 + k * 0.2);
          tl.set(c.P2h.stick, { autoAlpha: 1 }, 1.1);
          tl.set(c.P2.stick, { autoAlpha: 0 }, 1.1);
        });
        swapName(3, 1.4);
      } else if (i === 4) {
        K.out(tl, S.heads[2], 0, 0.3); K.fadeIn(tl, S.heads[3], 0.3);
        tl.to(S.h2o, { autoAlpha: 0, duration: 0.3 }, 0);
        S.ch.forEach(function (c, k) {
          const y = k ? 610 : 350;
          K.atpMake(tl, S.w, { x: 400, y: y }, c.P2h, { x: 1360, y: y + 40 }, 0.5 + k * 0.35, { lift: -60, hi: true });
        });
        swapName(4, 2.4);
      } else if (i === 5) {
        K.out(tl, S.heads[3], 0, 0.3);
        S.w.appendChild(S.scrim); S.w.appendChild(S.sum); // keep the summary above pills created in earlier beats
        K.fade(tl, S.scrim, 0, 0.6);
        K.fadeIn(tl, S.sum, 0.3, { dy: 30 });
      }
    },
    notes: '<p>Step 7: phosphoglycerate kinase transfers the acyl phosphate of 1,3-BPG to ADP, making ATP and 3-phosphoglycerate. This is substrate-level phosphorylation: ATP is made directly from a high-energy substrate, without the electron transport chain. It\'s reversible despite the name "kinase".</p><p>Step 8: phosphoglycerate mutase shifts the phosphate from C3 to C2.</p><p>Step 9: enolase dehydrates 2-PG to phosphoenolpyruvate. It needs Mg<sup>2+</sup> and is inhibited by fluoride.</p><p>Step 10: pyruvate kinase transfers PEP\'s phosphate to ADP. The enol pyruvate tautomerises to keto pyruvate, which makes this step irreversible. This is the second substrate-level phosphorylation.</p><p>Each step runs twice: 4 ATP gross, minus 2 invested = net 2.</p><h4>Viva points</h4><ul><li>Two substrate-level phosphorylations in glycolysis: PGK (step 7) and pyruvate kinase (step 10). (Succinyl-CoA synthetase is the third, in the TCA cycle.)</li><li>Irreversible steps 1, 3, 10 are bypassed in gluconeogenesis; step 10 by pyruvate carboxylase + PEPCK.</li></ul>',
    viva: { q: 'Name the substrate-level phosphorylation steps of glycolysis. How many ATP does each give per glucose?', a: '<b>Phosphoglycerate kinase</b> (1,3-BPG → 3-PG, step 7) and <b>pyruvate kinase</b> (PEP → pyruvate, step 10). Each runs twice per glucose, so <b>2 ATP each</b>: 4 gross; net 2 after the 2 invested.' }
  });

  /* ============ 8. FATE OF PYRUVATE ============ */
  D.add({
    id: 'fate', kicker: 'After step 10', title: 'Where does pyruvate go?', menu: 'Fate of pyruvate: LDH vs aerobic',
    source: 'OpenStax Biology 2e §7.5 · Lippincott 8e Ch. 8–9 · NCBI StatPearls: Lactic Acidosis',
    beats: [
      { cap: 'Two pyruvate per glucose. Glycolysis itself <b>needs no O<sub>2</sub></b>, but it does need <span class="c-nad">NAD<sup>+</sup></span> to keep running.', ctr: { inv: 2, gen: 4, nadh: 2, nad: -2, tag: 'per glucose' } },
      { cap: '<b>Anaerobic</b>: LDH reduces pyruvate to lactate. <span class="c-nadh">NADH</span> → <span class="c-nad">NAD<sup>+</sup></span>, so GAPDH can continue. <b>No ATP made here.</b>', ctr: { inv: 2, gen: 4, nadh: 0, nad: 0, tag: 'anaerobic', nadNote: 'regenerated', nadhNote: 'used by LDH' } },
      { cap: 'Side note: <b>yeast</b> regenerate NAD<sup>+</sup> by making ethanol + CO<sub>2</sub>. Human cells make lactate instead.' },
      { cap: '<b>Aerobic</b>: pyruvate enters the mitochondrion. Cytosolic NADH goes to shuttles; that ATP is counted later, not as glycolysis ATP.', ctr: { inv: 2, gen: 4, nadh: 2, nad: -2, tag: 'aerobic', nadhNote: 'to shuttles' } },
      { cap: 'Either way, glycolysis nets <b>2 ATP</b>. Oxygen only decides what happens next to pyruvate and NADH.', ctr: { inv: 2, gen: 4, nadh: 2, nad: -2, tag: 'glycolysis only' } }
    ],
    build: function (S) {
      K.backdrop(S, 'cytosol', 8);
      S.pyr = K.chain(S.w, { n: 3, x: 900, y: 330, gap: 92, labels: ['C1', 'C2', 'C3'], small: true });
      gsap.set(S.pyr.g, { autoAlpha: 0 });
      S.pyrN = K.node(S.w, 'mname', '2 Pyruvate', 900, 400);
      S.noO2 = K.chip(S.w, 'rev', 'Glycolysis: no O<sub>2</sub> needed', 900, 210);
      // anaerobic branch
      S.ldhA = K.react(S.svg, 800, 450, 560, 610, true, { head: 20 });
      S.ldhL = K.enz(S.w, 'Lactate dehydrogenase<small>LDH · reversible</small>', 720, 610, { anchor: 'l' });
      S.lac = K.chain(S.w, { n: 3, x: 470, y: 690, gap: 92, labels: ['C1', 'C2', 'C3'], small: true });
      gsap.set(S.lac.g, { autoAlpha: 0 });
      S.lacN = K.node(S.w, 'mname', '2 Lactate', 470, 765);
      S.nadh = K.pill(S.w, 'nadh', 'NADH + H<sup>+</sup>', 560, 470);
      S.nad = K.pill(S.w, 'nad', 'NAD<sup>+</sup>', 560, 470);
      S.loopA = K.arrow(S.svg, 360, 560, 250, 300, { bend: -60, color: '#79a9ff', w: 4, dash: '10 9' });
      S.toG = K.chip(S.w, 'rev', 'back to GAPDH (step 6)', 250, 260, { style: 'border-color:#79a9ff;color:#cfe0ff;background:rgba(59,130,246,.15)' });
      S.noATP = K.chip(S.w, 'irr', 'no ATP here', 860, 700);
      S.where = K.lbl(S.w, 'RBCs, exercising muscle, hypoxia', 470, 820, { cls: 'sm' });
      S.yeast = K.card(S.w, '', '<div class="kick" style="font-size:16px;color:var(--ink3)">Side note · yeast, not humans</div><div class="row" style="font-size:22px;margin-top:8px">Pyruvate → acetaldehyde + CO<sub>2</sub> → <b>ethanol</b><br>(pyruvate decarboxylase, alcohol dehydrogenase). Also regenerates NAD<sup>+</sup>.</div>', 760, 610, 520, { style: 'opacity:.9' });
      // aerobic branch
      S.mito = K.mito(S.svg, 1350, 690, 380, 170, { hidden: true });
      S.aerA = K.arrow(S.svg, 1010, 450, 1200, 600, { color: '#e6ecff', w: 5 });
      S.aerL = K.node(S.w, 'mname', 'Mitochondrion<small>→ PDH → acetyl-CoA → TCA</small>', 1350, 830);
      S.shut = K.card(S.w, 'nadh', '<div class="row" style="font-size:22px"><span class="c-nadh">Cytosolic NADH</span> → malate–aspartate or glycerol-3-P <b>shuttle</b> → ETC.<br><span style="color:var(--ink3)">Not counted as glycolysis ATP.</span></div>', 1110, 220, 500);
      S.scrim = K.scrim(S);
      S.cards = [
        K.card(S.w, 'fatecard', '<div class="kick">Anaerobic</div><h4 style="margin-top:10px">Glucose → 2 lactate</h4><div class="row">Net <b>2 ATP</b>. NAD<sup>+</sup> recycled by LDH. Lactate leaves the cell (Cori cycle).</div>', 240, 460, 680),
        K.card(S.w, 'fatecard teal', '<div class="kick">Aerobic</div><h4 style="margin-top:10px">Glucose → 2 pyruvate → mitochondria</h4><div class="row">Net <b>2 ATP</b> + <span class="c-nadh">2 NADH</span>. Pyruvate is oxidised by PDH.</div>', 1000, 460, 680)
      ];
    },
    step: function (i, tl, S) {
      if (i === 0) {
        K.fade(tl, S.pyr.g, 0.1, 0.8);
        K.fadeIn(tl, S.pyrN, 0.4);
        K.pop(tl, S.noO2, 0.8);
      } else if (i === 1) {
        K.draw(tl, S.ldhA, 0.1, 0.7);
        K.fade(tl, S.ldhL, 0.4);
        K.pop(tl, S.nadh, 0.6);
        K.swap(tl, S.nadh, S.nad, 1.6);
        tl.fromTo(S.lac.g, { autoAlpha: 0, x: 900 - 50, y: 330 }, { autoAlpha: 1, x: 470, y: 690, duration: 1.4, ease: 'power2.inOut' }, 1.2);
        K.fadeIn(tl, S.lacN, 2.4);
        tl.to(S.nad, { x: 360, y: 560, duration: 1, ease: 'power2.inOut' }, 2.2);
        K.draw(tl, S.loopA, 3.0, 0.8);
        K.pop(tl, S.toG, 3.5);
        K.pop(tl, S.noATP, 3.8);
        K.fade(tl, S.where, 4.0);
      } else if (i === 2) {
        K.fadeIn(tl, S.yeast, 0.1);
      } else if (i === 3) {
        tl.to([S.ldhA.g, S.ldhL, S.lac.g, S.lacN, S.nad, S.loopA.g, S.toG, S.noATP, S.where, S.yeast], { autoAlpha: 0.2, duration: 0.6 }, 0);
        K.draw(tl, S.aerA, 0.3, 0.8);
        K.fade(tl, S.mito, 0.6, 0.8);
        tl.from(S.mito, { scale: 0.9, transformOrigin: '50% 50%', duration: 0.8 }, 0.6);
        K.fadeIn(tl, S.aerL, 1.1);
        K.fadeIn(tl, S.shut, 1.6);
      } else if (i === 4) {
        K.fade(tl, S.scrim, 0, 0.6);
        K.fadeIn(tl, S.cards, 0.3, { stagger: 0.2 });
      }
    },
    notes: '<p>Glycolysis doesn\'t use oxygen, but it does consume NAD<sup>+</sup> at step 6. Without a way to reoxidise NADH, glycolysis would stop.</p><p>Without oxygen, or in RBCs which lack mitochondria, lactate dehydrogenase reduces pyruvate to lactate and regenerates NAD<sup>+</sup>. No ATP is made in this step. The 2 ATP still come from steps 7 and 10.</p><p>Yeast use alcoholic fermentation instead (pyruvate → acetaldehyde → ethanol). This is just a side note for humans.</p><p>With oxygen and mitochondria, pyruvate enters the mitochondrion for the link reaction. Cytosolic NADH passes its electrons in via shuttles. The extra ATP that gives belongs to oxidative phosphorylation, so we don\'t count it as glycolysis ATP.</p><h4>Viva points</h4><ul><li>Lactic acidosis: hypoxia, shock, PDH or thiamine deficiency, mitochondrial disease.</li><li>LDH is reversible. Lactate returns to the liver for gluconeogenesis (Cori cycle).</li></ul>',
    viva: { q: 'Why does a red blood cell convert pyruvate to lactate even when plenty of oxygen is available?', a: 'Mature RBCs have <b>no mitochondria</b>, so pyruvate can\'t be oxidised. <b>LDH</b> converts pyruvate to lactate to <b>regenerate NAD<sup>+</sup></b> for GAPDH, keeping glycolysis, their only ATP source, running.' }
  });

  /* ============ 9. CONTROL ============ */
  function strip(S) {
    const rows = [[1, 'Hexokinase / GK', 1], [2, 'PG isomerase'], [3, 'PFK-1', 1, 1], [4, 'Aldolase'], [5, 'TPI'], [6, 'GAPDH'], [7, 'PG kinase'], [8, 'PG mutase'], [9, 'Enolase'], [10, 'Pyruvate kinase', 1]];
    let h = '';
    rows.forEach(function (r) { h += '<div class="srow" data-g="' + (r[2] ? 1 : 0) + '" data-s="' + (r[3] ? 1 : 0) + '"><span class="no">' + r[0] + '</span>' + r[1] + (r[2] ? '<span class="gt">' + (r[3] ? 'RATE-LIMITING' : 'IRREV.') + '</span>' : '') + '</div>'; });
    return K.node(S.w, 'strip', h, 80, 200, { anchor: 'tl', w: 380 });
  }
  D.add({
    id: 'control', kicker: 'Regulation', title: 'Controlling glycolysis', menu: 'Control: HK/GK, PFK-1, PK',
    source: 'Lippincott 8e Ch. 8 (regulation) · NCBI Bookshelf: Biochemistry, Glycolysis (StatPearls) · OpenStax Biology 2e §7.6',
    beats: [
      { cap: 'Three <b>irreversible</b> steps are the control points: <b>1</b> hexokinase/glucokinase, <b>3</b> PFK-1, <b>10</b> pyruvate kinase.' },
      { cap: '<b>Hexokinase</b>: high affinity, inhibited by G6P. <b>Glucokinase</b> (liver, β-cell): low affinity, <b>not</b> inhibited by G6P, induced by insulin.' },
      { cap: '<b>PFK-1</b>: committed, rate-limiting step. Activated by <b>AMP, ADP, F2,6BP</b>. Inhibited by <b>ATP, citrate, H<sup>+</sup></b>.' },
      { cap: 'Hormones act through <b>F2,6BP</b>. Insulin: F2,6BP ↑, glycolysis ↑. Glucagon (cAMP → PKA phosphorylation): F2,6BP ↓.' },
      { cap: '<b>Pyruvate kinase</b>: fed forward by F1,6BP; inhibited by ATP and alanine. In liver, glucagon → PKA phosphorylates PK → inactive.' }
    ],
    build: function (S) {
      K.backdrop(S, 'cytosol', 9);
      S.strip = strip(S);
      S.rows = S.strip.querySelectorAll('.srow');
      // HK vs GK
      S.tab = K.card(S.w, '', '<table class="ctable"><tr><th></th><th style="color:#9ff5ea">Hexokinase</th><th style="color:var(--phos)">Glucokinase</th></tr>' +
        '<tr><td>Where</td><td><b>Most tissues</b></td><td><b>Liver, pancreatic β-cells</b></td></tr>' +
        '<tr><td>Affinity</td><td><b>High</b> (low K<sub>m</sub>)</td><td><b>Low</b> (high K<sub>m</sub>, ≈10 mM)</td></tr>' +
        '<tr><td>G6P inhibition</td><td><b>Yes</b></td><td><b>No</b> (held back by its regulatory protein, GKRP)</td></tr>' +
        '<tr><td>Insulin</td><td>Not induced</td><td><b>Induced</b></td></tr>' +
        '<tr><td>Job</td><td>Uptake even at low glucose</td><td>Clears glucose after a meal; β-cell glucose sensor</td></tr></table>', 540, 210, 1300);
      // PFK-1 hub
      S.hubP = K.node(S.w, 'hub', 'PFK-1<small>step 3</small>', 1180, 540);
      const cx = 1180, cy = 540;
      S.actP = [['AMP', 400], ['ADP', 540], ['F2,6BP', 680]].map(function (a) {
        const el = K.node(S.w, 'eff act', a[0] + ' <span class="up">↑ high</span>', 760, a[1]);
        const t = toward(cx, cy, 870, a[1], 140);
        return { el: el, ar: K.arrow(S.svg, 880, a[1], t.x, t.y, { color: '#34d17a', w: 6 }) };
      });
      S.inhP = [['<span class="pill atp sm" style="box-shadow:none">ATP</span>', 400], ['Citrate', 540], ['H<sup>+</sup>', 680]].map(function (a) {
        const el = K.node(S.w, 'eff inh', a[0] + ' <span class="up">↑ high</span>', 1620, a[1]);
        const t = toward(cx, cy, 1490, a[1], 150);
        return { el: el, ar: K.inhibit(S.svg, 1490, a[1], t.x, t.y, { cross: false }) };
      });
      S.pfkKey = K.chip(S.w, 'amber', 'committed · rate-limiting', 1180, 720);
      // hormones
      const row = function (cells) { return cells.map(function (c, k) { return (k ? '<span class="fa">→</span>' : '') + '<span class="fc ' + (c[1] || '') + '">' + c[0] + '</span>'; }).join(''); };
      S.ins = K.node(S.w, 'flow', row([['Insulin', 'ins'], ['PFK-2/FBPase-2 dephosphorylated<br><small style="color:#9ff5ea">PFK-2 activity on</small>'], ['F2,6BP ↑', 'up'], ['PFK-1 ↑', 'up'], ['Glycolysis ↑', 'up']]), 540, 380, { anchor: 'l' });
      S.glu = K.node(S.w, 'flow', row([['Glucagon', 'glu'], ['cAMP → PKA'], ['PFK-2/FBPase-2 phosphorylated<br><small style="color:#ffb3bc">FBPase-2 activity on</small>'], ['F2,6BP ↓', 'dn'], ['Glycolysis ↓', 'dn']]), 540, 640, { anchor: 'l' });
      S.hLbl = K.lbl(S.w, 'In liver · one bifunctional enzyme, two activities', 540, 510, { anchor: 'l', cls: 'sm' });
      // PK hub
      S.hubK = K.node(S.w, 'hub', 'Pyruvate<br>kinase<small>step 10</small>', 1180, 540);
      S.f16 = K.node(S.w, 'eff act', 'F1,6BP <span class="up">feed-forward</span>', 740, 420);
      S.f16A = K.arrow(S.svg, 880, 440, toward(cx, cy, 880, 440, 140).x, toward(cx, cy, 880, 440, 140).y, { color: '#34d17a', w: 6 });
      S.inK = [['<span class="pill atp sm" style="box-shadow:none">ATP</span>', 420], ['Alanine', 560]].map(function (a) {
        const el = K.node(S.w, 'eff inh', a[0] + ' <span class="up">↑ high</span>', 1620, a[1]);
        const t = toward(cx, cy, 1490, a[1], 150);
        return { el: el, ar: K.inhibit(S.svg, 1490, a[1], t.x, t.y, { cross: false }) };
      });
      S.pka = K.node(S.w, 'eff', 'Glucagon → cAMP → <b>PKA</b>', 760, 740, { style: 'border:2px solid #60a5fa;color:#bfdbfe;background:rgba(96,165,250,.12)' });
      S.pkP = { els: [K.node(S.w, 'phos', 'P', 1290, 440)], abs: function () { return { x: 1290, y: 440 }; } };
      S.off = K.chip(S.w, 'irr', 'phosphorylated = OFF (liver)', 1180, 720, { style: 'border-color:#ff5a5a;color:#ffd0d0' });
    },
    step: function (i, tl, S) {
      const gates = Array.prototype.filter.call(S.rows, function (r) { return r.dataset.g === '1'; });
      if (i === 0) {
        K.fadeIn(tl, S.strip, 0);
        tl.call(function () { gates.forEach(function (r) { r.classList.add('gate'); }); Array.prototype.forEach.call(S.rows, function (r) { if (r.dataset.s === '1') r.classList.add('star'); }); }, null, 0.8);
        tl.fromTo(gates, { scale: 1 }, { scale: 1.06, duration: 0.3, yoyo: true, repeat: 1, stagger: 0.2 }, 0.8);
      } else if (i === 1) {
        K.fadeIn(tl, S.tab, 0.1, { dy: 30 });
      } else if (i === 2) {
        K.out(tl, S.tab, 0, 0.4);
        K.pop(tl, S.hubP, 0.4);
        S.actP.forEach(function (a, k) { K.fadeIn(tl, a.el, 0.8 + k * 0.15, { dy: 0 }); K.draw(tl, a.ar, 1.0 + k * 0.15, 0.5); });
        S.inhP.forEach(function (a, k) { K.fadeIn(tl, a.el, 1.6 + k * 0.15, { dy: 0 }); K.fade(tl, a.ar, 1.8 + k * 0.15, 0.4); });
        K.pop(tl, S.pfkKey, 2.4);
      } else if (i === 3) {
        K.out(tl, [S.hubP, S.pfkKey].concat(S.actP.map(function (a) { return a.el; }), S.actP.map(function (a) { return a.ar.g; }), S.inhP.map(function (a) { return a.el; }), S.inhP.map(function (a) { return a.ar; })), 0, 0.4);
        tl.fromTo(S.ins, { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.01 }, 0.4);
        tl.from(S.ins.children, { autoAlpha: 0, x: -20, duration: 0.4, stagger: 0.12 }, 0.4);
        K.fade(tl, S.hLbl, 1.4);
        tl.fromTo(S.glu, { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.01 }, 1.8);
        tl.from(S.glu.children, { autoAlpha: 0, x: -20, duration: 0.4, stagger: 0.12 }, 1.8);
      } else if (i === 4) {
        K.out(tl, [S.ins, S.glu, S.hLbl], 0, 0.4);
        K.pop(tl, S.hubK, 0.4);
        K.fadeIn(tl, S.f16, 0.8, { dy: 0 }); K.draw(tl, S.f16A, 1.0, 0.5);
        S.inK.forEach(function (a, k) { K.fadeIn(tl, a.el, 1.4 + k * 0.15, { dy: 0 }); K.fade(tl, a.ar, 1.6 + k * 0.15, 0.4); });
        K.fadeIn(tl, S.pka, 2.2, { dy: 0 });
        K.atpSpend(tl, S.w, { x: 1000, y: 740 }, S.pkP, { x: 1010, y: 815 }, 2.6, { lift: -60 });
        K.pop(tl, S.off, '>-0.3');
      }
    },
    notes: '<p>Control sits at the three irreversible steps. PFK-1 is the most important: it is the committed, rate-limiting step.</p><p>Hexokinase has high affinity and is inhibited by its product, G6P. Glucokinase in liver and β-cells has low affinity, isn\'t inhibited by G6P, and is induced by insulin, so the liver only takes up glucose when blood levels are high.</p><p>PFK-1 is switched on by signs of low energy (AMP, ADP) and by fructose-2,6-bisphosphate. It is switched off by plenty of ATP, by citrate (TCA cycle full) and by H<sup>+</sup> (acidosis).</p><p>Insulin dephosphorylates the bifunctional PFK-2/FBPase-2, raising F2,6BP. Glucagon, via cAMP and PKA, phosphorylates it, lowering F2,6BP. PKA also phosphorylates and inactivates liver pyruvate kinase. Pyruvate kinase is activated by F1,6BP (feed-forward) and inhibited by ATP and alanine.</p><h4>Viva points</h4><ul><li>F2,6BP is the most potent allosteric activator of PFK-1. It links hormones to glycolysis in liver.</li><li>Glucokinase defects → MODY 2. Hexokinase deficiency → haemolytic anaemia with low 2,3-BPG.</li></ul>',
    viva: { q: 'How do insulin and glucagon regulate hepatic glycolysis through fructose-2,6-bisphosphate?', a: '<b>Insulin</b> → PFK-2/FBPase-2 <b>dephosphorylated</b> → PFK-2 active → <b>F2,6BP ↑</b> → PFK-1 ↑ → glycolysis ↑. <b>Glucagon</b> → cAMP → PKA <b>phosphorylates</b> it → FBPase-2 active → F2,6BP ↓ → glycolysis ↓. PKA also inactivates hepatic pyruvate kinase.' }
  });

  /* ============ 10. POISONS ============ */
  D.add({
    id: 'poisons', kicker: 'Clinical biochemistry', title: 'Glycolysis poisons', menu: 'Poisons: fluoride, iodoacetate, arsenate',
    source: 'Lippincott 8e Ch. 8 · NCBI StatPearls: Arsenic Toxicity · Vasudevan, Textbook of Biochemistry (Ch. 8)',
    beats: [
      { cap: 'Three classic poisons, all in the payoff phase. Each hits one specific enzyme.' },
      { cap: '<b>Fluoride</b> inhibits <b>enolase</b>. That\'s why blood for glucose goes in grey-top (sodium fluoride) tubes.' },
      { cap: '<b>Iodoacetate</b> alkylates the active-site <b>cysteine –SH of GAPDH</b>, stopping step 6.' },
      { cap: '<b>Arsenate</b> mimics phosphate at GAPDH. The arseno product hydrolyses on its own, skipping PGK: glycolysis runs, but that ATP is lost.' },
      { cap: 'Don\'t confuse it with <b>arsenite (As<sup>3+</sup>)</b>: it binds lipoic acid thiols and blocks PDH. Covered in the link reaction.' }
    ],
    build: function (S) {
      K.backdrop(S, 'cytosol', 10);
      const y = 330, xs = [150, 470, 790, 1070, 1340, 1660], nm = ['GAP', '1,3-BPG', '3-PG', '2-PG', 'PEP', 'Pyruvate'];
      S.nodes = nm.map(function (n, k) { return K.node(S.w, 'mapnode pay', n, xs[k], y); });
      const ez = ['GAPDH', 'PGK', 'PG mutase', 'Enolase', 'Pyruvate kinase'];
      S.ar = []; S.ez = [];
      for (let k = 0; k < 5; k++) {
        const x1 = xs[k] + (k === 0 ? 60 : 85), x2 = xs[k + 1] - (k === 4 ? 100 : 80);
        S.ar.push(K.react(S.svg, x1, y, x2, y, k < 4, { head: 18 }));
        S.ez.push(K.enz(S.w, ez[k], (x1 + x2) / 2, y + 52, { style: 'font-size:22px' }));
      }
      S.atp7 = K.pill(S.w, 'atp', 'ATP', 630, 430, { size: 'sm' });
      S.ghost7 = K.pill(S.w, 'ghost', 'no ATP', 630, 430, { size: 'sm' });
      S.byp = K.arrow(S.svg, 160, 285, 780, 285, { bend: -120, color: '#ff8a5b', w: 5, dash: '12 10' });
      S.bypL = K.chip(S.w, 'amber', 'arsenate route: 1-arseno-3-PG → 3-PG (spontaneous)', 800, 240, { anchor: 'l', style: 'border-color:#ff8a5b;color:#ffd5c4;background:rgba(255,138,91,.12);font-size:16px' });
      S.cF = K.card(S.w, 'poison red', '<span class="tagchip irr" style="border-color:#ff5a5a;color:#ffd0d0">Step 9 · enolase</span><h4>Fluoride (F<sup>−</sup>)</h4><div class="row">Forms a fluoride–Mg<sup>2+</sup>–phosphate complex in the active site.</div><div class="row"><b>NaF grey-top tube</b>: stops glycolysis in the sample, so glucose isn\'t falsely low.</div>', 1110, 520, 440);
      S.cI = K.card(S.w, 'poison red', '<span class="tagchip irr" style="border-color:#ff5a5a;color:#ffd0d0">Step 6 · GAPDH</span><h4>Iodoacetate</h4><div class="row">Alkylates the <b>cysteine –SH</b> in GAPDH\'s active site.</div><div class="row">GAPDH is a thiol enzyme.</div>', 80, 520, 440);
      S.cA = K.card(S.w, 'poison amber', '<span class="tagchip amber">Step 6 → skips step 7</span><h4>Arsenate (As<sup>5+</sup>)</h4><div class="row"><b>Phosphate analogue</b>: GAPDH uses it instead of P<sub>i</sub>.</div><div class="row">Unstable product hydrolyses → 3-PG. <b>PGK ATP lost</b>; net 2 → 0 if both trioses.</div>', 590, 520, 460);
      S.cAs3 = K.card(S.w, 'poison', '<span class="tagchip purple">Different poison</span><h4>Arsenite (As<sup>3+</sup>)</h4><div class="row">Binds the two –SH of <b>lipoic acid</b> → blocks PDH (scene 15).</div>', 1580, 520, 300, { style: 'width:300px;padding:22px' });
      S.tF = K.inhibit(S.svg, 1205, 515, 1205, 400, { cx: 1270, cy: 470 });
      S.tI = K.inhibit(S.svg, 310, 515, 310, 400, { cx: 375, cy: 470 });
    },
    step: function (i, tl, S) {
      if (i === 0) {
        tl.fromTo(S.nodes, { autoAlpha: 0, y: '+=12' }, { autoAlpha: 1, y: '-=12', duration: 0.4, stagger: 0.12 }, 0.1);
        S.ar.forEach(function (a, k) { K.draw(tl, a, 0.4 + k * 0.15, 0.4); K.fade(tl, S.ez[k], 0.6 + k * 0.15, 0.4); });
        K.pop(tl, S.atp7, 1.4);
      } else if (i === 1) {
        K.fadeIn(tl, S.cF, 0.1);
        K.pop(tl, S.tF, 0.6);
        tl.to([S.ar[3].g, S.ez[3]], { autoAlpha: 0.3, duration: 0.4 }, 1.0);
      } else if (i === 2) {
        K.fadeIn(tl, S.cI, 0.1);
        K.pop(tl, S.tI, 0.6);
        tl.to([S.ar[0].g, S.ez[0]], { autoAlpha: 0.3, duration: 0.4 }, 1.0);
      } else if (i === 3) {
        tl.to([S.tF, S.tI, S.cF, S.cI], { autoAlpha: 0.25, duration: 0.4 }, 0);
        tl.to([S.ar[3].g, S.ez[3], S.ar[0].g, S.ez[0]], { autoAlpha: 1, duration: 0.4 }, 0);
        K.fadeIn(tl, S.cA, 0.2);
        K.draw(tl, S.byp, 0.6, 1.0);
        K.fade(tl, S.bypL, 1.0);
        tl.to([S.ar[1].g, S.ez[1], S.nodes[1]], { autoAlpha: 0.3, duration: 0.4 }, 1.4);
        K.swap(tl, S.atp7, S.ghost7, 1.6);
      } else if (i === 4) {
        K.fadeIn(tl, S.cAs3, 0.1);
      }
    },
    notes: '<p>Fluoride inhibits enolase by forming a fluorophosphate–magnesium complex at the active site. Clinically, blood for glucose is collected in sodium fluoride (grey-top) tubes, so RBCs and WBCs don\'t keep consuming glucose before the sample is tested.</p><p>Iodoacetate alkylates the essential cysteine thiol of GAPDH, blocking step 6.</p><p>Arsenate (pentavalent) looks like phosphate. GAPDH accepts it and makes 1-arseno-3-phosphoglycerate, which hydrolyses spontaneously to 3-phosphoglycerate. Glycolysis carries on, but the ATP normally made at PGK isn\'t formed. If both trioses go this way, net ATP falls from 2 to 0.</p><p>Arsenite (trivalent) is a different poison: it binds the vicinal thiols of lipoic acid and inhibits PDH and α-ketoglutarate dehydrogenase.</p><h4>Viva points</h4><ul><li>Arsenate = uncoupler of substrate-level phosphorylation at step 7. Arsenite = lipoic acid / PDH inhibitor.</li><li>Fluoride also inhibits enolase in oral bacteria, part of how it prevents dental caries.</li></ul>',
    viva: { q: 'Why is blood for glucose estimation collected in a fluoride tube?', a: 'Sodium <b>fluoride inhibits enolase</b>, stopping glycolysis by blood cells in the tube. Otherwise the glucose would keep being consumed and the result would be falsely low.' }
  });
})();
