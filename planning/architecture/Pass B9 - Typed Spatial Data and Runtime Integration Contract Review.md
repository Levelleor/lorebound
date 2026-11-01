---
type: architecture
status: in-review
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
tags:
  - planning/architecture
  - pass-b
  - runtime-contracts
  - spatial-data
---

# Pass B9 — Typed Spatial Data and Runtime Integration Contract Review

> **OPENED ONLY, 2026-10-31.** [P-B8-01](./decisions/P-B8-01%20-%20Design%20Closure%20and%20Deferred%20Runtime%20Integration%20Contracts.md) records the user's **separate approval** to close B8 at design level and open B9. **B9-D01, D02 and D03 below are new unapproved A/B/C proposals.** Recommendations are not approvals. No implementation, schema freeze, test evidence, staging promotion or B9 closure is implied.

## Purpose

B6–B8 accepted Lorebound's narrative-first world-memory model, ID-safe interpretation, current-only typed events, spatially meaningful world canvas and location placement. **B9 examines executable interface choices** needed to connect typed spatial/domain records, TypeScript projection, Go/SQLite canonical storage and verifiable replay.

**Do not reopen accepted product behaviour:** B8-D06 **B** means all resolved newly accepted locations receive **automatically generated durable first map coordinates**; D04 means region borders **remain mutable**. D07 A makes placement deterministic and scoped; D08 A adjusts only generated-only coordinates for later grounded geography; D09 A commits new location identity and position **together**. User-authored map moves wait for explicit Commit/Discard. The canvas is not the route graph; measured route lengths are not inferred from pixels. These are binding, not B9 option selections.

### Governing accepted architecture

- [P-B8-01](./decisions/P-B8-01%20-%20Design%20Closure%20and%20Deferred%20Runtime%20Integration%20Contracts.md) formally closes B8 design only with nine decisions and original approvals preserved.
- [B8-D01](./decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md), [B8-D02](./decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md), [B8-D04](./decisions/B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md), [B8-D05](./decisions/B8-D05%20-%20Stable%20Cross%20Frame%20Routes%20with%20Grounded%20Door%20and%20Portal%20Anchors.md): meaningful nested frames and group geometry, mutable boundaries, distinct containment, explicit cross-frame routes and route-specific measures.
- [B8-D03](./decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md), [B8-D06](./decisions/B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md), [B8-D07](./decisions/B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md), [B8-D08](./decisions/B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md), [B8-D09](./decisions/B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md): typed persistent map assertions, source-aware first placement, protected user pins, one canonical write boundary.
- [B7-D01](./decisions/B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md), [B7-D04](./decisions/B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md), [B7-D07](./decisions/B7-D07%20-%20Versioned%20Field%20Registry%20and%20Atomic%20Meaning%20Preserving%20Event%20Migrations.md), [B7-D09](./decisions/B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md): versioned typed declarative events with distinct unknown/absence, minimal source/order and coordinated meaning-preserving migrations of **current** records.
- [B7-D03 Option C](./decisions/B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md) and [B7-D08](./decisions/B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md): ambiguous optional automatic extraction suggestions are discarded without notification; **real technical errors remain reportable**, engine IDs never enter prose-producing prompts.
- [B6-D01](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B6-D05](./decisions/B6-D05%20-%20Conditional%20Anatomy%20Linked%20Equipment%20Detachment.md): accepted fictional outcomes don't need earlier simulation proofs; automatic anatomy-based equipment clearing requires actually implemented structured body part/slot linkage.
- [B3-D04](./decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) and [B4-D04](./decisions/B4-D04%20-%20Coordinated%20Migration%20of%20Current%20Event%20Schemas.md): one current ordered history without an immutable revision archive; coordinated supported current-event migration rather than unlimited lazy event upcasting.

## Batch 1 — PROPOSALS ONLY, unapproved

### B9-D01 — Executable typed spatial data and event-schema boundaries

**Question:** How should a versioned event/schema registry encode local frames, location coordinates, generated vs authored source, mutable region footprints and optional route anchors, without mixing UI screen pixels with geographic facts?

- **A (recommended, proposed):** Define **domain-owned tagged typed spatial property payloads** in the existing versioned declarative event envelope: stable location/frame identities, supported relative coordinate and frame-transform values, optional type-specific group extent/outline and route-anchor/path properties, and **explicit origin tags** (system-generated first position, accepted narration, deliberate player correction). Register validators/meaning-preserving migrations by supported version. Keep **viewport pan/zoom, label offsets and drawing caches outside canon**. **Trade-off:** More initial schema work and fixtures, but explicit semantics and reproducible replay.
- **B (proposed):** Store arbitrary canvas JSON with ad hoc `x`/`y` blobs, no field/version registry or provenance, and let the renderer reinterpret it as needed. **Trade-off:** Fast initial UI work but undermines migrations, source priority and nested scales.
- **C (proposed):** Save every node's final browser pixel position as the only authoritative location coordinate, converting/overwriting it on each zoom/layout change. **Trade-off:** Simple screenshot persistence but corrupts geographic semantics across window sizes and nesting.

**Existing decisions are not up for vote:** Spatial persistence, deterministic auto-placement, the player's manual edit boundary and B8-D06 B remain accepted. D01 is about **the executable type contract**, not whether to auto-place.

### B9-D02 — TypeScript/Go canonical commit and projection handoff

**Question:** How should a source-grounded new location, its deterministic generated first position, or a player-approved boundary correction pass from TypeScript into Go/SQLite without a second map truth store?

- **A (recommended, proposed):** **TypeScript prepares validated typed event proposals and derived projections; Go independently checks supported technical envelope/schema, expected adventure revision, library epoch and operation-ID/idempotency, then atomically commits accepted story/location/spatial assertions in SQLite** under the existing current-only history contract. Go does **not** decide fictional travel/possession legality or invent world facts. Browser map caches are disposable projections; explicit player edit drafts use the already accepted pending Commit/Discard workflow. **Trade-off:** Requires a precise IPC command/result schema and cross-runtime validation parity.
- **B (proposed):** Let the canvas write its own authoritative map tables directly, and later attempt to merge map changes into the accepted event history. **Trade-off:** Easier drag persistence but creates split truth and non-atomic orphan pins.
- **C (proposed):** Make Go a procedural world-simulation engine that must verify all fictional prior journeys/ownership/route legality before it accepts otherwise technically valid story events. **Trade-off:** Contradicts the accepted narrative-first design.

**Existing accepted interface boundary:** A new resolved location and its generated initial placement **must commit in the same atomic accepted transaction** under B8-D09. D02 refines how the TypeScript/Go layers implement that boundary.

### B9-D03 — Verifiable cross-module replay and migration evidence

**Question:** What level of deterministic and real-host verification should count as meeting the future runtime contract for the accepted map/canon design?

- **A (recommended, proposed):** Specify a **shared, deterministic scenario fixture corpus** for typed event preparation and reducer replay, and run it through both pure TypeScript projection and real integrated Go/SQLite host paths at later implementation gates. Cover new-location generated placement, idempotent retry, manual pending edit Commit/Discard, later grounded geography vs generated pins, protected authored positions, changing region borders, Undo/Delete After/Keep Later Turns/Fork, schema migration rollback, plugin removal and safe core failures. Require explicit **observed evidence** before saying implementation is complete; no test is marked passed merely because fixtures are documented. **Trade-off:** More integration harness effort, but exposes cross-module divergence.
- **B (proposed):** Count TypeScript unit tests and synthetic mocked-Go responses alone as proof of working SQLite/Wails integration. **Trade-off:** Fast feedback, but cannot establish host persistence, migration and transaction correctness.
- **C (proposed):** Count visually plausible canvas screenshots/manual map inspection as the only replay and data-integrity evidence. **Trade-off:** Demonstrates UI layout but misses persistence, idempotency, source and history invariants.

**Not a claim that anything has passed:** B1 feasibility and earlier real-host evidence gates remain outstanding. Choosing an evidence strategy would not itself authorise staging promotion or a release.

## Deferred B9 subjects, unapproved

- **D04+:** Specific schema and transform conventions, qualitative vs numeric distance constraints, generated-placement provenance priority and map reconciliation conflict UX, mutable/overlapping region geometry, multi-entrance routes/portals and path conditions.
- Narrator-safe natural reference protocol from the selected model, simultaneous location creations, structured status/inventory projections, optional plugin event schema handling, current-only migration and restore wiring.
- Browser canvas renderer/framework, drawing shape/scale bars, Wails API signatures, SQLite table/index design and migration scripts all require separate technical decisions/implementation permission. Do not infer them from B9 opening.
- B1 real-host feasibility and pending staging→production gates are unchanged by this review.

## Approval history

- **2026-10-31:** B8 D01–D09 received separate explicit user approvals; user requested a closure **assessment only**, and B8 remained `in-review`.
- **2026-10-31 — distinct formal closure/opening instruction:** Assistant asked **“Shall I record that closure and proceed to B9?”** and the user answered **“yes.”** [P-B8-01](./decisions/P-B8-01%20-%20Design%20Closure%20and%20Deferred%20Runtime%20Integration%20Contracts.md) formally closes **B8 design only**. **This B9 file opens review but D01–D03 A/B/C options are all unapproved**. No implementation, schema freeze, staging promotion or B9 design closure has been approved.
