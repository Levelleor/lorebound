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

> **B9 IN REVIEW — Batches 1 and 2 accepted on 2026-10-31; Batch 3 unapproved.** Batch 1: D01 qualified A (typed spatial facts, no player/AI author labels), D02 A (TypeScript prepared assertions, Go/SQLite technical atomicity), D03 B (mocked all-component tests, no live model scenarios). Batch 2: **D04 C** (all pins eligible for future automatic movement, overriding previous intentional-pin immunity), **D05 A** (validated nested local-frame coordinates and mutable region geometry), **D06 A** (broad mocked success/failure/history contracts, labelled honestly). Historical alternatives remain below. No tests run, runtime implementation, stage promotion, B9 closure or waiver of separate B1 evidence is implied.

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

## Batch 1 — accepted D01 qualified A, D02 A, D03 B (original proposals retained)

### B9-D01 — Executable typed spatial data and event-schema boundaries (Option A accepted, with qualification)

**Accepted 2026-10-31:** [B9-D01 ADR](./decisions/B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md). User selected A but **explicitly excluded per-coordinate player-versus-AI author distinctions**, requesting “just store the credentials” (interpreted as **coordinates** in this context). **The original A below suggested origin tags but that detail was *not accepted*.** Store typed geometry; protect deliberately repositioned pins under B8-D08 with a minimal operational auto-adjustable versus fixed/pinned policy, not an identity-of-author ledger. Exact encoding remains unapproved. Preserve minimal current event passage/manual correction association under B7-D09 as an independent replay requirement.

**Question:** How should a versioned event/schema registry encode local frames, location coordinates, generated vs authored source, mutable region footprints and optional route anchors, without mixing UI screen pixels with geographic facts?

- **A (recommended, proposed):** Define **domain-owned tagged typed spatial property payloads** in the existing versioned declarative event envelope: stable location/frame identities, supported relative coordinate and frame-transform values, optional type-specific group extent/outline and route-anchor/path properties, and **explicit origin tags** (system-generated first position, accepted narration, deliberate player correction). Register validators/meaning-preserving migrations by supported version. Keep **viewport pan/zoom, label offsets and drawing caches outside canon**. **Trade-off:** More initial schema work and fixtures, but explicit semantics and reproducible replay.
- **B (proposed):** Store arbitrary canvas JSON with ad hoc `x`/`y` blobs, no field/version registry or provenance, and let the renderer reinterpret it as needed. **Trade-off:** Fast initial UI work but undermines migrations, source priority and nested scales.
- **C (proposed):** Save every node's final browser pixel position as the only authoritative location coordinate, converting/overwriting it on each zoom/layout change. **Trade-off:** Simple screenshot persistence but corrupts geographic semantics across window sizes and nesting.

**Existing decisions are not up for vote:** Spatial persistence, deterministic auto-placement, the player's manual edit boundary and B8-D06 B remain accepted. D01 is about **the executable type contract**, not whether to auto-place.

### B9-D02 — TypeScript/Go canonical commit and projection handoff (Option A accepted)

**Accepted 2026-10-31:** [B9-D02 ADR](./decisions/B9-D02%20-%20TypeScript%20Prepared%20Events%20and%20Go%20SQLite%20Atomic%20Commit%20Authority.md). TypeScript prepares typed assertions and projections; Go technically validates and atomically commits current events under version/epoch/idempotency fencing. Story causality stays outside Go's technical veto.

**Question:** How should a source-grounded new location, its deterministic generated first position, or a player-approved boundary correction pass from TypeScript into Go/SQLite without a second map truth store?

- **A (recommended, proposed):** **TypeScript prepares validated typed event proposals and derived projections; Go independently checks supported technical envelope/schema, expected adventure revision, library epoch and operation-ID/idempotency, then atomically commits accepted story/location/spatial assertions in SQLite** under the existing current-only history contract. Go does **not** decide fictional travel/possession legality or invent world facts. Browser map caches are disposable projections; explicit player edit drafts use the already accepted pending Commit/Discard workflow. **Trade-off:** Requires a precise IPC command/result schema and cross-runtime validation parity.
- **B (proposed):** Let the canvas write its own authoritative map tables directly, and later attempt to merge map changes into the accepted event history. **Trade-off:** Easier drag persistence but creates split truth and non-atomic orphan pins.
- **C (proposed):** Make Go a procedural world-simulation engine that must verify all fictional prior journeys/ownership/route legality before it accepts otherwise technically valid story events. **Trade-off:** Contradicts the accepted narrative-first design.

**Existing accepted interface boundary:** A new resolved location and its generated initial placement **must commit in the same atomic accepted transaction** under B8-D09. D02 refines how the TypeScript/Go layers implement that boundary.

### B9-D03 — Verifiable cross-module replay and migration evidence (Option B accepted, not recommended A)

**Accepted 2026-10-31:** [B9-D03 ADR](./decisions/B9-D03%20-%20Mock%20Based%20Component%20Verification%20Without%20Live%20AI%20Scenarios.md). User selected **B**, not originally recommended A, with the clarification: **mock tests cover all app parts; no AI model is actually launched in scenario tests**. Do **not** quietly reintroduce real live-model scenarios or mandatory full-host integration tests as the B9 mocked-suite gate. Mock outcomes are evidence **only under simulated conditions**, not proof actual SQLite/Wails persistence ran. Earlier B1 real-host feasibility evidence remains a **separate, still-open historic gate** pending separate reconciliation.

**Question:** What level of deterministic and real-host verification should count as meeting the future runtime contract for the accepted map/canon design?

- **A (recommended, proposed):** Specify a **shared, deterministic scenario fixture corpus** for typed event preparation and reducer replay, and run it through both pure TypeScript projection and real integrated Go/SQLite host paths at later implementation gates. Cover new-location generated placement, idempotent retry, manual pending edit Commit/Discard, later grounded geography vs generated pins, protected authored positions, changing region borders, Undo/Delete After/Keep Later Turns/Fork, schema migration rollback, plugin removal and safe core failures. Require explicit **observed evidence** before saying implementation is complete; no test is marked passed merely because fixtures are documented. **Trade-off:** More integration harness effort, but exposes cross-module divergence.
- **B (proposed):** Count TypeScript unit tests and synthetic mocked-Go responses alone as proof of working SQLite/Wails integration. **Trade-off:** Fast feedback, but cannot establish host persistence, migration and transaction correctness.
- **C (proposed):** Count visually plausible canvas screenshots/manual map inspection as the only replay and data-integrity evidence. **Trade-off:** Demonstrates UI layout but misses persistence, idempotency, source and history invariants.

**Not a claim that anything has passed:** B1 feasibility and earlier real-host evidence gates remain outstanding. Choosing an evidence strategy would not itself authorise staging promotion or a release.

## Batch 1 accepted disposition — 2026-10-31

| Decision | User approval | Operative interpretation |
| --- | --- | --- |
| **B9-D01** | **A, qualified** | [Typed spatial data and geometry](./decisions/B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md), **without** AI-vs-player per-field authorship labels; minimal overwrite-protection behaviour remains binding |
| **B9-D02** | **A** | [TypeScript prepared events, Go technical validation and atomic SQLite commit](./decisions/B9-D02%20-%20TypeScript%20Prepared%20Events%20and%20Go%20SQLite%20Atomic%20Commit%20Authority.md) |
| **B9-D03** | **B**, contrary to recommended A | [Mocked all-subsystem contract/component tests](./decisions/B9-D03%20-%20Mock%20Based%20Component%20Verification%20Without%20Live%20AI%20Scenarios.md), **no launched AI-model scenario tests**, no mandatory B9 real-host end-to-end scenario runner |

**Source-versus-operation distinction:** The user rejected recording *who authored* each coordinate. The previously accepted *ability to distinguish auto-adjustable generated layout from a deliberately pinned position* is a **current edit policy** and cannot be silently dropped while B8-D08's protected-pin guarantee remains accepted. A later explicit choice may specify the smallest representation needed without an AI/player provenance log.

**Evidence boundary:** Mocked scenarios can simulate the whole application, including model results, backend persistence results, failures, Undo and Fork. They do **not** prove that an actual live model or real Wails/SQLite host was launched. The separate historic B1 feasibility gate is not silently waived by choosing B9-D03 B.

## Batch 2 — accepted D04 C, D05 A, D06 A (original alternatives preserved)

**Explicit 2026-10-31 approval:** User selected **B9-D04 C, B9-D05 A and B9-D06 A**, with instructions to record only approved choices and preserve history. The options below retain their *original proposed text* as historical alternatives; their accepted decisions are recorded in separate ADRs.

| Decision | Accepted | Operative effect |
| --- | --- | --- |
| **B9-D04** | **C** | [B9-D04](./decisions/B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md); no stored auto-adjustable/fixed rule; automatic layout may move previously user-moved pins. **Explicit later override of B8-D08's protected pin guarantee.** |
| **B9-D05** | **A** | [B9-D05](./decisions/B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md); typed finite local-frame coordinates, transforms and mutable region shapes; canonical geometry not browser pixels. |
| **B9-D06** | **A** | [B9-D06](./decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md); all-component mocked contracts include errors/history changes, with mock-only reporting. No real AI or host integration claim. |

**No silent compatibility rewrite:** The earlier D04 description says C contradicts the old protection rule. That contradiction is now **resolved by the user's explicit later selection of C**, not by pretending B8-D08 remained unchanged. Existing manual pending Commit, deterministic initial placement and atomic persisted changes still apply. The choice doesn't mandate re-layout on each render or grant permission for noncanonical background geometry mutation.


### B9-D04 — Minimal protection of deliberately positioned pins without author labels

**Question:** How should Lorebound preserve B8-D08's rule not to auto-move deliberately placed locations while honouring B9-D01's explicit instruction to **store coordinates without player-vs-AI author labels**?

- **A (recommended, proposed):** Each spatial placement carries the **minimum current placement policy** needed for automatic layout, such as **`auto-adjustable` vs `fixed/pinned`**, set by the accepted operation type or by deliberate user pinning/unpinning. This records *whether automatic reconciliation may move the pin*, not whether a player or AI authored its coordinates. No historic author audit trail or per-coordinate actor label. **Trade-off:** One small operational field/semantics, preserves intentional layout.
- **B (proposed):** Derive protection dynamically from the current event stream's existing manual-correction/explicit-pin operations every time, **without storing a per-location current policy field**. **Trade-off:** Less direct property metadata but more reducer/replay analysis and care after Undo/Fork.
- **C (proposed):** Store coordinates alone with no means to distinguish auto-movable from intentionally protected positions and allow later layout to move all pins. **Trade-off:** Simplest schema but contradicts the accepted promise not to silently reposition a deliberate player placement.

**This is a new undecided technical question, not retroactive approval of an authorship tag.** The user must approve the selected policy separately.

### B9-D05 — Concrete local-frame coordinate and region-shape encoding

**Question:** What typed coordinate and group-boundary representation should the existing versioned spatial schema use to support nested groups and mutable regions without binding map data to browser pixels?

- **A (recommended, proposed):** Use a **versioned local-frame geometry schema**, with validated finite relative coordinates, supported frame transforms/scales, optional type-specific extents/outline points/paths, and stable spatial entity references. Keep **semantic geometry separate from viewport/screen coordinates**, and make shape changes ordered current facts. Units, exact polygon conventions and holes may be separately extended. **Trade-off:** Some validation/transformation code, but deterministic replay and meaningful zoom.
- **B (proposed):** Store only a single flat global pixel-like `x,y` plus drawing width/height, with no nested-frame encoding. **Trade-off:** Simple initial canvas but weak scale and grouping semantics.
- **C (proposed):** Require standard Earth latitude/longitude and a fixed metre scale for all fictional locations, including rooms and non-Earth worlds. **Trade-off:** Familiar GIS math but unsuitable for flexible fiction and nested spatial scales.

**B8-D01 and B8-D04 already approve nested frames and mutable borders.** D05 refines executable representation, not their existence.

### B9-D06 — Mocked test contracts and evidence labels

**Question:** How should the **user-approved mock-only B9 test approach** distinguish a passing simulated scenario from actual host evidence, without requiring a live AI model or real host end-to-end test as part of the B9 suite?

- **A (recommended, proposed):** Maintain **versioned mocked component/contract fixtures** for the application’s API boundaries and core transformations, covering success/failure, concurrency/version conflict, initial placement, authored pin protection, region changes, source-safe narrative responses and history edits. Model responses, Go service/storage outcomes and external integrations are mocked as appropriate. CI labels the results **“mocked contracts passed”**, never “live AI or SQLite host verified.” Earlier B1 real-host evidence remains separately tracked without making it a B9 mock-suite pass prerequisite. **Trade-off:** Clear trust/evidence boundary, more fixtures and adapters.
- **B (proposed):** Only test positive-response happy paths through mocks, assuming crashes, migrations and errors work by construction. **Trade-off:** Faster, but fails to test many accepted atomicity/error guarantees.
- **C (proposed):** Make B9 test completion dependent on a real AI provider and fully integrated Wails/SQLite scenario suite. **Trade-off:** Conflicts with B9-D03 B's explicit mock-based/no-live-model direction.

**B9-D03 B itself is already accepted.** D06 only asks how the mock test boundary and reporting are structured. It cannot silently claim real-host evidence or waive the separate B1 gate.

**Batch 2 status (latest):** D04 **C**, D05 **A**, D06 **A** are explicitly approved and documented in their separate ADRs. No code, tests, staging promotion or B9 design closure.

## Batch 3 — proposed D07–D09, NOT approved

### B9-D07 — Qualitative versus numeric geographic constraints

**Question:** How should later accepted narrative facts such as “far east of” or “three days by road” influence typed spatial map constraints without inventing exact world measurements?

- **A (recommended, proposed):** Typed **qualitative spatial relations** (direction, near/far/adjacent where grounded) alongside **optional explicitly grounded numeric** separation facts with units and their meaning. Let automatic placement satisfy supported qualitative constraints where possible, but never infer exact distance/time from canvas pixels. Contradictory narrative assertions remain visible facts rather than invented precision. **Trade-off:** Additional constraint parsing/validation, better narrative fidelity.
- **B (proposed):** Convert qualitative phrases to mandatory exact numeric metres and treat rendered pixel length as that measurement. **Trade-off:** Simplifies one numeric layout input, fabricates precision.
- **C (proposed):** Keep all distance/direction relationships as unconstrained free text, with no typed input to map placement. **Trade-off:** Minimal schema, weak geographic coherence.

**Existing scope:** The meaning of route travel/time remains distinct from straight-line geography under B8-D02. No actual interpreter or solver implementation is approved by D07 selection.

### B9-D08 — Automatic layout conflicts and deliberate pin movement

**Question:** Given **B9-D04 C explicitly permits automatic relocation even of deliberately moved pins**, what should happen when new grounded geography conflicts with current saved coordinates or several spatial constraints?

- **A (recommended, proposed):** Reconcile only on an accepted location/spatial-world change that actually calls for supported deterministic layout; evaluate frame/relationship constraints, and commit any resulting coordinate changes **atomically and replayably**, including previously player-positioned pins if needed. If explicit grounded spatial facts genuinely conflict, keep the accepted facts and surface a nonblocking layout conflict rather than fabricating a numeric answer or rejecting the story. **Trade-off:** Defined triggers and conflict handling needed; no pin lock.
- **B (proposed):** Automatically rewrite every location and region placement after every redraw, pan, zoom or reload to obtain a fresh layout. **Trade-off:** Frequent unsolicited canonical changes and poor replay stability.
- **C (proposed):** Reject accepted narration/world facts whenever current coordinates cannot satisfy the automatic map layout. **Trade-off:** Makes rendering constraints wrongly authoritative over narrative canon.

**Existing scope:** No author/pin-protection flag may be reintroduced without another explicit decision. A deterministic canonical adjustment is distinct from disposable viewport arrangement.

### B9-D09 — Overlapping and changeable region geometry

**Question:** How should the current typed geometry validator and map projection treat overlapping, resized or partly intersecting region outlines?

- **A (recommended, proposed):** Allow **well-formed type-appropriate overlapping or intersecting outlines**, validate finite points/reference frames and supported geometric shape constraints, and keep **containment and route identity separate**. Border edits update current spatial assertions; they do not automatically reparent places or invent fictional administrative changes. **Trade-off:** More work for overlapping-region rendering/selection.
- **B (proposed):** Enforce a universal global ban on any region overlap, even for jurisdictions or fictional zones that can overlap. **Trade-off:** Simple polygon policy, conflicts with B8-D04 flexibility.
- **C (proposed):** Whenever a border crosses another place, automatically change its containment, travel routes and owner identity. **Trade-off:** Convenient geometric inference but invents world facts.

**Existing scope:** B8-D04 already permits region overlaps and independent containment; this is a proposal for validator/projection treatment, not a vote to remove that accepted behaviour.

**Batch 3 status:** D07–D09 are **unapproved proposals**. No ADR has been created for them.

## Deferred B9 subjects, unapproved

- **D10+:** Additional placement conflict UX and rendering detail, multiple entrances/portals, migration/restore wiring and user-visible map rendering. D07–D09 remain **unapproved Batch 3 proposals**.
- Narrator-safe natural reference protocol from the selected model, simultaneous location creations, structured status/inventory projections, optional plugin event schema handling, current-only migration and restore wiring.
- Browser canvas renderer/framework, drawing shape/scale bars, Wails API signatures, SQLite table/index design and migration scripts all require separate technical decisions/implementation permission. Do not infer them from B9 opening.
- B1 real-host feasibility and pending staging→production gates are unchanged by this review.

## Approval history

- **2026-10-31:** B8 D01–D09 received separate explicit user approvals; user requested a closure **assessment only**, and B8 remained `in-review`.
- **2026-10-31 — distinct formal closure/opening instruction:** Assistant asked **“Shall I record that closure and proceed to B9?”** and the user answered **“yes.”** [P-B8-01](./decisions/P-B8-01%20-%20Design%20Closure%20and%20Deferred%20Runtime%20Integration%20Contracts.md) formally closes **B8 design only**. **This B9 file opens review but D01–D03 A/B/C options are all unapproved**. No implementation, schema freeze, staging promotion or B9 design closure has been approved.

- **2026-10-31 — Batch 1 explicit selection:** User selected **B9-D01 A qualified to exclude player-versus-AI author distinctions (“just store the credentials,” understood as coordinates)**, **B9-D02 A**, and **B9-D03 B** with **mocked tests for all app parts and no launched AI model scenario tests**. Three separate accepted ADRs created. Original A/B/C alternatives preserved and recommended B9-D03 A expressly *not selected*. B8-D08 protected-pin behaviour remains; a minimal implementation policy without author labels is **new unapproved B9-D04**. Mocked tests do not prove real host/SQLite operation and do not silently waive separate B1 evidence. Proposed D04–D06 as **unapproved Batch 2**. B9 remains `in-review`, no implementation, tests, staging promotion or formal B9 closure.

- **2026-10-31 — Batch 2 explicit selections:** User approved **D04 C, D05 A, D06 A** and requested ADRs and continued B9. D04 C **expressly overrides** the earlier B8-D08/B8-D06/B8-D07 intentional-pin immunity, not initial auto-placement or explicit manual Commit; D05 validates local-frame typed geometry and mutable outlines; D06 requires comprehensive mocked scenarios with true evidence labels and no actual model runs. Three accepted ADRs created. **Batch 3 D07–D09 remains unapproved**. B9 remains in review; no code/tests were run, no staging promotion or B9 formal closure.
