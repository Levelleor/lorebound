---
type: architecture
status: in-review
phase: "B5"
created: "2026-10-28"
updated: "2026-10-28"
tags:
  - planning/architecture
  - pass-b
  - initialization
---
# Pass B5 — Starting World and First Turn Contracts Review

> **Proposals only, not accepted ADRs.** [P-B4-01](./decisions/P-B4-01%20-%20Design%20Closure%20and%20Deferred%20Initialization%20Contracts.md) records B4 design-only closure. B5 opens the previously deferred S02/S06/S09 starting-world boundary for explicit review; no B5 selection, code, tests or staged-idea promotion is implied.

## Inherited architecture

Current adventure history has one current structured passage body per committed turn and current ordered typed events, without retained narrative revisions (B3-D04). TypeScript S05/S06 owns deterministic rules/replay and accepted gameplay outcomes; Go S12 owns whole-library SQLite storage and epoch/version-guarded atomic commits. Full replay starts at Turn 0; ordinary new-turn projection may be incremental. B1/A decisions already accept valid blank starting-world setup, optional AI-authored Turn-0 Lorebook, fact-only text grounding, and **automatic acceptance of the first successfully validated Quick Start opening** without adding a universal new approval gate. Pending manual state edits still require explicit player Commit and the composer overlay. Keep Later Turns does not automatically rewrite downstream prose or events.

## Batch 1 — proposed, not accepted

### B5-D01 — Creating a valid Turn-0 baseline

**Question:** When a new adventure is created, should its baseline be written before the first narrative turn?

- **A (recommended):** Create a **durable, minimal valid Turn-0 baseline** and adventure identity in a single Go/SQLite atomic initialization operation. Include only explicitly provided/default facts, references and initial world entities that pass deterministic schema/invariant validation. An empty world is allowed. New generated narration and its effects arrive as later turns; no fabricated opening scene required. **Trade-off:** Clear replay starting point; some initialization work before gameplay.
- **B:** Wait until first successful AI continuation and create both the baseline and first turn then. **Trade-off:** Fewer initial writes, but failures or abandoned setup lack an independently durable adventure starting point.
- **C:** Require AI to fill a complete world model even if the user provides no facts. **Trade-off:** Richer automatic starting state, but unnecessary model cost/invention and possible conflict with blank starts.

### B5-D02 — Text-derived initial facts

**Question:** When the player supplies a premise or setup prose, what may the coordinator store as starting state?

- **A (recommended):** Extract only **clearly grounded, supported facts** into a provisional structured setup proposal; show uncertainty/unrepresented detail as narrative text rather than silently inventing entities, equipment, places or relationships. Validate deterministic constraints before baseline acceptance. **Trade-off:** Less automatic elaboration, but reproducible and avoids falsely authoritative invented facts. Exact AI extraction/review UI remains open.
- **B:** Treat all creative inferences by the model as canonical starting facts automatically. **Trade-off:** Richer inferred world, but high risk of fabricated canon.
- **C:** Store no structured facts from setup prose; rely on later AI turns. **Trade-off:** Simple initialization but breaks fact-grounding direction and useful starting context.

### B5-D03 — Quick Start first-turn commit

**Question:** How does the first AI-generated opening transition from provisional output to accepted canon?

- **A (recommended):** Quick Start runs its **existing accepted generation and deterministic validation path**; after the first successful fully validated opening, commit the structured passage and events together using B3-D01 atomic/idempotent/expected-version/epoch protections. Failures, retry/stop and late output must not yield partial canon. **Do not add an extra Approve prompt for this opening.** **Trade-off:** Automatic smooth flow with careful cancellation and commit boundary checks.
- **B:** Force all Quick Start openings into the manual pending-commit overlay before they can be accepted. **Trade-off:** More player control, but contradicts the earlier approved automatic Quick Start exception.
- **C:** Save narrative prose first and accept its world events only once another turn starts. **Trade-off:** Fast displayed opening but violates atomic passage/event commitment and replay integrity.

## Status and remaining gates

- B5-D01: proposed A/B/C; **not accepted**.
- B5-D02: proposed A/B/C; **not accepted**.
- B5-D03: proposed A/B/C; **not accepted**.

No implementation or runtime verification. Later B5 batches may refine optional AI-created Turn-0 Lorebook, initializer failure/recovery and user editor/context boundaries. Existing B1 integration tests and the staging/source documentation reconciliation remain deferred, separately gated.

## Decision history

- **2026-10-28:** User explicitly approved closing B4 design-only and beginning the next architecture pass. Batch 1 B5-D01–D03 prepared as unapproved options; no selections inferred.
