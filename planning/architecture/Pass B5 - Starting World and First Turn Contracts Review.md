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

> **Batch 1 accepted on 2026-10-28:** B5-D01, D02 and D03 each approved **Option A**. Their original options remain below for provenance. Batch 2 is still unapproved. [P-B4-01](./decisions/P-B4-01%20-%20Design%20Closure%20and%20Deferred%20Initialization%20Contracts.md) records B4 design-only closure. B5 opens the previously deferred S02/S06/S09 starting-world boundary for explicit review; no B5 selection, code, tests or staged-idea promotion is implied.

## Inherited architecture

Current adventure history has one current structured passage body per committed turn and current ordered typed events, without retained narrative revisions (B3-D04). TypeScript S05/S06 owns deterministic rules/replay and accepted gameplay outcomes; Go S12 owns whole-library SQLite storage and epoch/version-guarded atomic commits. Full replay starts at Turn 0; ordinary new-turn projection may be incremental. B1/A decisions already accept valid blank starting-world setup, optional AI-authored Turn-0 Lorebook, fact-only text grounding, and **automatic acceptance of the first successfully validated Quick Start opening** without adding a universal new approval gate. Pending manual state edits still require explicit player Commit and the composer overlay. Keep Later Turns does not automatically rewrite downstream prose or events.

## Batch 1 — accepted Option A (original proposals retained)

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

- **B5-D01: Accepted A.** [ADR](./decisions/B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md).
- **B5-D02: Accepted A.** [ADR](./decisions/B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md).
- **B5-D03: Accepted A.** [ADR](./decisions/B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md).

No implementation or runtime verification. Later B5 batches may refine optional AI-created Turn-0 Lorebook, initializer failure/recovery and user editor/context boundaries. Existing B1 integration tests and the staging/source documentation reconciliation remain deferred, separately gated.

## Batch 2 — proposals, unapproved

### B5-D04 — Optional AI-generated starting Lorebook acceptance

**Question:** When a player explicitly asks AI to create a starting world before Turn 1, when does the generated world become canonical?

- **A (recommended):** Keep generated entries/relations as a **noncanonical proposal** until the player explicitly **approves or discards** it, using the shared pending-commit overlay. Validate the whole accepted set and commit it atomically as Turn-0 lore/world setup, without inventing a story turn. **Trade-off:** Player controls potentially substantial AI-created canon, with one extra confirmation.
- **B:** Automatically commit successfully validated world generation, just like the Quick Start opening. **Trade-off:** Faster, but the world may contain extensive AI-invented facts the player has not inspected.
- **C:** Commit each entry as it arrives. **Trade-off:** Incremental progress, but risks half-created worlds and inconsistent links on failure.

This is **distinct from B5-D02's grounded fact extraction** and B5-D03's approved automatic Quick Start opening. The user expressly requested generation may invent *worldbuilding* facts, but only within the separate optional workflow.

### B5-D05 — Failure and cancellation during adventure setup

**Question:** What happens when optional setup or first-scene generation fails or is stopped?

- **A (recommended):** Preserve the already-durable minimal Turn-0 adventure baseline and any earlier separately accepted starting setup. Discard **only the failed operation's provisional** prose, facts and events; offer retry or continued blank/custom play. Never accept partial AI output or commit after cancellation. **Trade-off:** May leave a valid empty adventure, but never corrupts canon.
- **B:** Delete the entire new adventure when any optional generation fails. **Trade-off:** Less recovery UI but destroys otherwise valid setup.
- **C:** Keep partial model output as canonical even if the generation/validation cycle did not complete. **Trade-off:** Displays progress but violates atomic acceptance and deterministic replay.

### B5-D06 — Custom Opening authored by the player

**Question:** When the player writes a Custom Opening, how should it become the first canonical passage?

- **A (recommended):** Keep player-authored opening prose as an editable **noncanonical draft** until explicit acceptance using the existing pending-commit confirmation pattern; then validate and atomically commit the passage with **only explicitly grounded** supported world facts/events. Blank opening remains valid and needs no artificial first turn. **Trade-off:** Ensures a deliberate transition to canon while preserving draft freedom.
- **B:** Commit each prose edit to the canonical story immediately as the player types. **Trade-off:** No confirmation but difficult to keep extracted state coherent and contradicts draft-first editing.
- **C:** Commit opening prose and defer its grounded state extraction to a future story turn. **Trade-off:** Fast prose acceptance but breaks text/event atomicity.

**Batch 2 status:** D04, D05 and D06 are proposed only and have not been accepted. Exact UI labels, generation budgets, world scope, failure messages and initial data schemas remain further contract work.

## Decision history

- **2026-10-28:** User explicitly approved closing B4 design-only and beginning the next architecture pass. Batch 1 B5-D01–D03 prepared as unapproved options; no selections inferred.

- **2026-10-28 — Batch 1 explicit acceptance:** User accepted **B5-D01 A, B5-D02 A, B5-D03 A** and requested only accepted decisions be documented as separate ADRs with approval history. Three ADRs added. B5-D04–D06 proposed for next review, **not accepted**, with no software implementation or staging promotion.
