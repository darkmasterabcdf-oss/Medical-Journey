# METABOLIC JOURNEY: build report

## How to present
Double-click `index.html` (Chrome or Edge). It runs with no internet.

| Key | Action |
|---|---|
| → / Space / PageDown (also ↓) | next beat; after the last beat, next scene |
| ← / PageUp (also ↑, Backspace) | previous beat; before the first beat, previous scene |
| Home / End | first / last scene |
| F | fullscreen · **P** pause/resume · **N** speaker notes · **Q** viva card (**A** reveals the answer) |
| G | scene menu (or type a number + Enter) · **M** toggle reduced motion · **Esc** close panels |

Clickable ‹ › buttons and progress-bar segments are at the bottom right. Reloading keeps your place (the URL hash records scene.beat). `index.html?fps` shows a frame-rate meter.

## Files
- `index.html`: the deck
- `assets/css/deck.css`: all styling, including the print stylesheet
- `assets/js/kit.js`: drawing helpers (molecules, arrows, phosphate transfers, camera, membranes)
- `assets/js/engine.js`: stage scaling, navigation, ledger, panels, print mode, self-test
- `assets/js/scenes-a.js` (scenes 1–5), `scenes-b.js` (6–10), `scenes-c.js` (11–15): visuals, captions, ledger states, speaker notes, viva Q&A
- `assets/lib/gsap.min.js`: GSAP 3.13.0
- `assets/fonts/`: Inter (variable) and Instrument Serif, with their OFL licence files
- `Metabolic-Journey.pdf`: static backup, 16 pages (one per scene; scene 15 has a summary page and a references page)
- `PLAN.md`: scene/beat plan
- `.claude/launch.json`: local test server config used during testing (not needed to present)

All illustrations are drawn in code. No third-party images are used.

## Conflicts between your sources and the scientific source of truth
The source of truth was followed in each case.
1. **Step numbering.** The textbook PDF numbers TPI as "4A", PGK as "step 6", PK as "step 9" and LDH as "step 10". The notes merge steps. The deck uses the standard 10 steps (TPI = 5, GAPDH = 6, PGK = 7, PGM = 8, enolase = 9, PK = 10; irreversible 1, 3, 10).
2. **Shunt ATP wording.** The notes say "2 ATP not formed (net zero)". The reaction image says "↘ 1 ATP per glucose". The PDF says "no ATP is generated". The deck states the per-triose rule: each diverted 1,3-BPG loses 1 ATP, so net 2 → 1 (one triose) → 0 (both), with the pyruvate kinase steps still running. It is shown in a separate "ATP opportunity lost" box, never as ATP invested.
3. **"Thermal regulation / prevents RBC overheating"** (notes) is not presented. It isn't an established function of the shunt.
4. **Reaction image arrows.** The image draws PGK, PGM and enolase with single arrows; they are reversible and are drawn as equilibrium harpoons. The image also colours NADH yellow; the deck uses magenta as briefed.
5. **"Phosphoglucomutase"** (PDF text, step 7) is the wrong enzyme; it is phosphoglycerate mutase (the PDF figure has this right). PGK is also called "bisphosphoglycerate kinase" in the PDF; the deck uses phosphoglycerate kinase.
6. **Aerobic yield "7 ATP"** (PDF Table 8.5) counts NADH shuttle ATP. As briefed, the deck does not count that as glycolysis ATP. It is mentioned only as going to shuttles and the ETC.
7. **Hexokinase/glucokinase Km.** The PDF gives "10⁻² mmol/L" and "20 mmol/L". The deck says hexokinase is low-Km/high-affinity and glucokinase is high-Km (≈10 mM, as in Lippincott).
8. **PDH phosphatase "activated by Ca²⁺, Mg²⁺ and AMP"; PDK "inhibited by Ca²⁺"** (PDF). The deck follows the source of truth: Ca²⁺ activates the phosphatase; ATP/NADH/acetyl-CoA favour OFF (via PDK); ADP/pyruvate favour ON.
9. **E3 copy number.** The notes say "20–30 molecules each of E1 and E3". Mammalian PDC has fewer E3 than E1. The deck shows "≈ 9 × 10⁶ Da · E2 core ≈ 60 subunits · many E1 and E3 copies (approx.)".
10. **Fluoride mechanism.** The PDF says "by removing magnesium ions". The deck says it forms a fluoride–Mg²⁺–phosphate complex at enolase's active site.
11. **Ethanol fermentation** (notes list it alongside lactate) is shown only as a brief yeast side note.
12. **GLUT4** (notes: "exclusively muscle and adipose"): the deck lists skeletal muscle, heart and adipose.

## What was tested (all run, all passed unless noted)
- **Self-test (headless Edge, file://):** stepped all 15 scenes / 76 beats forward and then all the way back. 0 script errors. The ledger DOM matched the declared beat state at every step, both directions.
- **Screenshots** at 1920×1080 and 1366×768: checked all scenes for overlap and clipping. Fixed several overlaps found along the way.
- **Keys and panels:** reload on a random scene (7.3), N, Q + A, Esc, G + typed jump, P (and navigation auto-resumes), Home/End, PageDown/Space, back past a scene start, the ‹ › buttons. All behaved correctly.
- **Offline:** ran with network emulation off. Zero non-file requests in every run; fonts confirmed loaded offline.
- **Reduced motion:** `prefers-reduced-motion` emulation is detected; beats apply instantly. M toggles it manually.
- **Print/PDF:** exported with headless Edge (`?print=1`), checked all 16 pages visually.
- **Science checks:** 15 scenes; step names and arrow types; ledger values (−2 / +4 / net +2, 2 NADH; LDH beat NADH 2 → 0 with NAD⁺ regenerated and no ATP change; shunt 4 → 3 → 2 generated, invested fixed at 2; link ledger kept separate, 1/1/1 per pyruvate → 2/2/2 per glucose); ODC shifts right and P50 rises from ≈26 mmHg; five PDH cofactors with vitamins; E1/E2/E3 roles in the order of your notes; arsenate (As⁵⁺, GAPDH/PGK) vs arsenite (As³⁺, lipoic acid/PDH); no mitochondria drawn inside any RBC (scene 11 shows the "absent" icons outside the cell).

## Limitations / not verified
- **Performance on your real GPU is not verified.** Measured only in headless Edge, which renders without the GPU: about 58 fps average over a real-time run of all 76 beats, with 1–5 hitches (>50 ms) when a new scene is built. I removed per-element compositor layers and replaced ~2,000 membrane shapes with SVG patterns. I started a run in the app's browser pane on your GPU, but it was interrupted while you were using the pane. Before the talk, open `index.html?fps` and step through once.
- **Fullscreen (F)** can't be exercised headless. The handler uses the standard Fullscreen API.
- **Browsers:** tested in Edge 157 only (Chrome isn't installed); Chrome uses the same engine.
- **Speaker notes and viva cards** open in the same window (no separate presenter screen). The notes panel scrolls when long. Don't open it while the projector mirrors your screen.
- **The right-shifted curve** (P50 ≈ 31 mmHg) is illustrative; the normal curve uses P50 ≈ 26 mmHg with a Hill coefficient of 2.7.
- **References:** Patel et al. 2014 (JBC 289:16615) and the StatPearls articles "Biochemistry, Glycolysis" and "Pyruvate Kinase Deficiency" were confirmed online. The remaining classic citations are from standard literature and were not individually re-checked.

---

## QA audit (second pass)
Structure is unchanged: 15 scenes / 76 beats. The audit brief said "12 scenes"; this deck was built to the original 15-scene brief, so no scenes were removed. Patches went into `assets/js/*.js`, which `index.html` loads; `index.html` itself needed no change.

### Corrections made
1. **Scene 3:** the aldolase arrows (step 4) were one-way; aldolase is reversible, so they now point both ways.
2. **Scene 7, step 8 caption:** said "C3 to C2" while the circles show glucose numbering, so the phosphate visibly moved from "C1" to "C2". It now reads "carbon 3 to carbon 2 of glycerate". Scenes 6 and 7 gained a key: "circle labels = original glucose carbon".
3. **Scene 14:** the pyruvate label now says "C1 = COO⁻", so the carbon lost as CO₂ is explicit and doesn't clash with glucose numbering.
4. **Scene 13:** the caption now makes clear the mitochondria-containing cell is a different cell using pyruvate from its own glycolysis. Nothing from the RBC enters a mitochondrion.
5. **Scene 7 summary:** ATP pills made in earlier beats were drawn on top of the balance-sheet card. The card and its backdrop are now brought to the front (same safeguard added in scene 14).
6. **Scene 12 graph:** tick labels 20 → 25 px, axis titles 24 → 29 px, chips 17 → 20 px, legend enlarged with drawn colour swatches. The P50 chips were moved off the curves.
7. **Missing glyphs:** ⇄ (scene 7 caption), ⇌ (scene 6 viva) and ━ (scene 12 legend) aren't in the Inter font and fell back to a system font. Replaced with drawn equivalents.
8. **Small overlaps:** P<sub>i</sub> badge moved off the 2,3-BPG phosphatase arrow (scene 11); cell label moved off a mitochondrion (scene 13). The scene 11 ledger tag "RBC · no shunt" is now "RBC · none diverted yet".

### Scientific issues found
Only the items above (aldolase arrow direction, carbon-numbering ambiguity, the pyruvate-origin wording in scene 13). I checked these against the deck content and found them correct:
- all 10 reactions, enzyme labels and ATP/NADH accounting, step by step;
- irreversible steps 1, 3 and 10;
- hexokinase, glucokinase, PFK-1 and pyruvate kinase effectors, and the hepatic insulin/glucagon → F2,6BP and PKA → liver PK effects;
- fluoride → enolase, iodoacetate → GAPDH –SH, arsenate (As⁵⁺) → GAPDH (PGK ATP skipped) vs arsenite (As³⁺) → lipoic acid/PDH;
- LDH: NAD⁺ regenerated, no ATP;
- shunt: −1 ATP per diverted 1,3-BPG, never counted as invested;
- 2,3-BPG: right shift, P50 up, PK deficiency;
- no mitochondria in the RBC; PDH in the matrix; E1/E2/E3 and the 5 cofactors; PDK/phosphatase; thiamine; glycolytic and PDH NADH kept in separate ledgers.

### Functional checks (actually run, headless Edge, file:// URL)
- **Self-test:** 76 beats forward and back. 0 errors, ledger matched every beat.
- **New forward-vs-rebuild test:** for every beat, the state after animating forward (sped up 20×) equals the state after a clean rebuild: visibility, position, scale and ledger. 0 differences, so no leftover animation on re-entry.
- **Fullscreen:** turns on and off with F.
- **Keys and panels:** N notes, Q/A viva, G menu with typed jump, P pause, Home/End, PageDown/Space, ← across a scene start, ‹ › buttons. All passed.
- **Offline:** 0 network requests; fonts load.
- **Reduced motion:** emulation detected, beats apply instantly.
- **Layout:** screenshots of the changed beats at 1920×1080 and 1366×768 checked.
- **PDF:** re-exported, 16 pages.
- One run of the key test crashed inside the test harness (not the deck). Re-running it alone passed.

### Remaining issues that need human checking
- Smoothness on your laptop's GPU (open `index.html?fps` and step through once).
- Glucokinase "≈10 mM" and "2,3-BPG ≈ equimolar with Hb" are approximate textbook values. Confirm they match your course text.
- The right-shifted O₂ curve (P50 ≈ 31) is illustrative, as labelled.
- Fullscreen on the actual projector setup; Chrome specifically (tested in Edge, same engine).
