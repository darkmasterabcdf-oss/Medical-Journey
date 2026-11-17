# METABOLIC JOURNEY — build plan

Open `index.html` in Chrome or Edge (double-click). Everything runs offline from `assets/`.

## Architecture
- 1920×1080 stage scaled to any window (letterboxed). HUD (title, ledger, caption, legend, progress) sits inside the stage so it scales with the projector.
- Each scene = data (`beats[]`: caption, ledger state, minimap highlight) + `build()` (clean DOM) + `step(i, timeline)` (animation into beat i).
- Forward = animate one GSAP timeline. Backward / jump / reload = rebuild the scene and replay beats 0…n instantly (`progress(1)`), so there's never leftover state.
- Ledger values are declared per beat, so the counter always matches the screen, forwards or backwards.
- `?print=1` renders every scene at its chosen beat, one per page (used for the PDF export). Ctrl+P does the same.

## Scenes and beats
1. Title: cell → zoom into cytosol → three chapters (3 beats)
2. Glucose entry: membrane → GLUT1–5 → GLUT4 + insulin → bidirectional → trapping as G6P → fructose / fructokinase (6)
3. Overview: EMP, cytosol, no O₂ → investment phase → payoff phase ×2 → net equation (4)
4. Steps 1–3: glucose → HK/GK (ATP→ADP, P to C6) → PGI (C=O moves C1→C2) → PFK-1 (P to C1) → summary (5)
5. Steps 4–5: F1,6BP → aldolase cuts C3–C4 → carbon identity → TPI (labels where carbons go) → ×2 tracks (5)
6. Step 6 GAPDH: 2 GAP + Pi pool → NAD⁺ → NADH → Pi joins → "Pi from pool, not ATP" (4)
7. Steps 7–10: PGK (SLP #1) → PGM → enolase (−H₂O) → PK (SLP #2) → ledger (6)
8. Pyruvate fate: junction → LDH (NADH→NAD⁺, no ATP) → yeast side note → aerobic → summary (5)
9. Control: 3 gates → HK vs GK → PFK-1 effectors → insulin/glucagon via F2,6BP → pyruvate kinase (5)
10. Poisons: map → fluoride/enolase → iodoacetate/GAPDH → arsenate skips PGK → arsenite teaser (5)
11. RBC: no organelles → GLUT1 + ATP uses → shunt panel → one triose diverted (net 1) → both (net 0) → why (6)
12. 2,3-BPG & Hb: T/R → BPG in cavity → ODC normal (P50 ≈ 26) → right shift → PK deficiency (5)
13. Leave RBC (explicit exit) → new cell → mitochondrion layers → porin (OMM) → MPC (IMM) → matrix (5)
14. PDH: complex + 5 cofactors → E1 decarboxylation → lipoamide acetyl transfer → CoA → FAD/NAD⁺ → net ×2 (6)
15. PDH control (PDK off / phosphatase on) → effectors → thiamine deficiency → arsenite vs arsenate → summary → references (6)

## Conflicts between the notes and the source of truth (the source of truth wins)
See the final report in `REPORT.md` for the complete list.
