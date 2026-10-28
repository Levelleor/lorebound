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

> **Batch 1 accepted on 2026-10-28:** B5-D01, D02 and D03 each approved **Option A**. Their original options remain below for provenance. Batch 2 is now accepted: B5-D04, D05 and D06 each Option A. Batch 3 accepted: D07 A, D08 A, D09 A; design closure assessed below, not formally approved. [P-B4-01](./decisions/P-B4-01%20-%20Design%20Closure%20and%20Deferred%20Initialization%20Contracts.md) records B4 design-only closure. B5 opens the previously deferred S02/S06/S09 starting-world boundary for explicit review; no B5 selection, code, tests or staged-idea promotion is implied.

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

## Batch 2 — accepted Option A (original proposals retained)

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

**Batch 2 accepted on 2026-10-28:** [D04 Optional Lorebook approval](./decisions/B5-D04%20-%20Approved%20Optional%20AI%20Starting%20Lorebook.md), [D05 preserve baseline on failed setup](./decisions/B5-D05%20-%20Preserve%20Baseline%20on%20Setup%20Failure%20and%20Cancellation.md), [D06 explicit Custom Opening commit](./decisions/B5-D06%20-%20Explicit%20Commit%20of%20Player%20Authored%20Custom%20Opening.md), each **Option A**. Exact UI labels, generation budgets, world scope, failure messages and initial data schemas remain further contract work.

## Batch 3 — accepted Option A (original proposals retained)

### B5-D07 — Persistence and recovery of unapproved generated Lorebook proposals

- **Option A (recommended):** Persist the latest complete, validated-but-unapproved generated Lorebook proposal as a **noncanonical adventure-scoped pending draft** in Go/SQLite, so reload restores it to the shared Approve/Discard overlay. A partially generated/failed proposal is not saved as ready for acceptance. Check adventure version/epoch again before Commit; don't silently apply stale generated lore. **Trade-off:** Recovery after refresh, with a small persistent proposal representation and cleanup rules.
- **Option B:** Keep completed pending generated Lorebook proposals only in current browser memory. **Trade-off:** Simpler storage but refresh loses a potentially costly generated world.
- **Option C:** Auto-approve a completed proposal on reload. **Trade-off:** Avoids lost work but violates the explicitly approved player acceptance gate.

### B5-D08 — How to handle unsupported extracted facts in an otherwise valid opening

- **Option A (recommended):** Distinguish representable supported facts from unsupported/unset descriptive details. Keep unsupported material as *narrative only* without silently promoting it to structured state. **Reject the opening commit only for a genuine invalid supported operation or required structural conflict**, not merely because a passage mentions an unsupported descriptive fact. **Trade-off:** Preserves frictionless story writing while making clear what is tracked.
- **Option B:** Reject any opening containing a fact outside the current structured-world schema. **Trade-off:** Complete structured coverage of accepted prose, but blocks harmless creativity and optional-system use.
- **Option C:** Invent fallback entities/fields so every extracted claim can be stored. **Trade-off:** May create misleading canonical facts and violates strict source-grounding.

### B5-D09 — Reopening a blank or partially configured adventure

- **Option A (recommended):** Treat an adventure with a durable Turn-0 baseline but **no first narrative turn** as an ordinary resumable adventure. On reopen, show its current blank/custom/guided setup and available draft without generating a story automatically. Optional worldbuilding or Quick Start remains a deliberate action; do not require a protagonist or mandatory initialization wizard. **Trade-off:** Simple consistent save/resume, with clear empty-state UI.
- **Option B:** Force a first AI-generated story turn automatically when reopening a no-turn adventure. **Trade-off:** May feel less empty, but forces unwanted model calls and invents canon.
- **Option C:** Hide zero-turn adventures from the library until a first narrative turn is committed. **Trade-off:** Simpler library listing, but makes saved blank adventures hard to resume.

**Batch 3 accepted on 2026-10-28:** [D07](./decisions/B5-D07%20-%20Persistent%20Pending%20Generated%20Starting%20Lorebook.md), [D08](./decisions/B5-D08%20-%20Narrative%20Only%20Unsupported%20Opening%20Facts.md), [D09](./decisions/B5-D09%20-%20Resume%20Blank%20Adventures%20Without%20Automatic%20Generation.md), each Option A. Original alternative text retained.

## B5 design closure assessment — 2026-10-28

**All nine B5 decisions D01–D09 have accepted Option A dispositions. B5 is ready for separate, explicitly approved design-level closure, but remains in-review.** This is an assessment, not formal closure or implementation approval.

- **Creation:** Durable empty/characterless Turn-0 baseline and adventure identity, no forced wizard; source-grounded structured initial facts only. Unsupported descriptions remain legitimate prose, not invented structured facts.
- **Quick Start:** Fully successful validated generated opening and supported factual events automatically commit together; no additional approval gate.
- **Player Custom Opening:** Noncanonical editable draft requires explicit player Commit; passage and grounded events are accepted together. Blank adventure needs no fake first turn.
- **Optional AI-authored starting Lorebook:** May invent worldbuilding because explicitly requested; result requires explicit Approve/Discard and full chat-composer blocking overlay. A complete review-ready proposal is saved as noncanonical SQLite draft across reload; no automatic acceptance.
- **Failure and resume:** Failed/cancelled provisional setup cannot alter existing accepted Turn-0/adventure. Zero-turn adventures remain normally saved/resumable, with no unrequested AI generation.

### Open engineering/verification work (not B5 product choices)

- Concrete Turn-0 and initial entity schemas, source span/provenance mapping, optional module compatibility, template instantiation, pre-first-turn setup mutations and correct current-only event ordering/replay.
- Prompting and size budgets for generated Lorebooks, preview/edit UX, pending proposal lifecycle on stale versions, reload, library restore, cancellation, uncertain commit result and cleanup.
- Quick Start cancellation/idempotency race tests, blank story and player-authored first-passage drafts, fail-closed core event handling, strict extraction examples and cross-module structural validation.
- Older staged idea text and B2 ADRs still mention revisions/immutable audit; later B3-D04 governs current planning. Reconcile original prose with preserved approval provenance only under a separate explicit planning gate. No staging-to-production promotion.
- B1 real Wails/Go, provider connectivity, database backup/restore, library epoch, and integrated end-to-end tests remain unverified. This closure assessment does not claim readiness to ship.

**Formal sign-off remains pending:** A separate user instruction is required before recording a P-B5-01 closure ADR and opening B6.

## Decision history

- **2026-10-28:** User explicitly approved closing B4 design-only and beginning the next architecture pass. Batch 1 B5-D01–D03 prepared as unapproved options; no selections inferred.

- **2026-10-28 — Batch 1 explicit acceptance:** User accepted **B5-D01 A, B5-D02 A, B5-D03 A** and requested only accepted decisions be documented as separate ADRs with approval history. Three ADRs added. B5-D04–D06 proposed for next review, **not accepted**, with no software implementation or staging promotion.

- **2026-10-28 — Batch 2 explicit approval:** Requesting user accepted **B5-D04 A**, **B5-D05 A**, **B5-D06 A**. Created three individual ADRs retaining original alternatives and approval history. Proposed B5-D07–D09 for Batch 3; these are unapproved, and no implementation, staging promotion or B5 closure was authorized.

- **2026-10-28 — Batch 3 acceptance and design closure assessment:** User explicitly accepted **B5-D07 A, B5-D08 A, B5-D09 A** and requested ADR recording and an assessment of B5 closure. Created separate accepted ADRs; retained prior alternatives. Nine of nine design choices resolved. Assessed B5 ready for user-approved design-only closure; **not formally closed**. No implementation, staged idea promotion, or release authorization.
