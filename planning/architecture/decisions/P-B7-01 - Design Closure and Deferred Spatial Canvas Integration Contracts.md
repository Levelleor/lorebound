---
type: architecture-decision
status: accepted
decision_id: "P-B7-01"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (separate explicit B7 design closure and B8 opening authorisation)"
tags:
  - planning/architecture
  - pass-b
  - design-closure
  - architecture-decision
---

# P-B7-01 — B7 design closure; defer spatial canvas and cross-module integration contracts to B8

## Explicit separate authorisation

**2026-10-31.** After the assistant recorded and assessed all ten B7 decisions, stated that **“B7 remains `in-review`”**, explained that exact schema, spatial-canvas coordinate/scale transforms and integration verification remain open, and asked **“Would you like me to record that closure and proceed to B8?”**, the requesting user replied **“yes proceed”**.

**Decision:** Formally close **Pass B7 — Event Representation and Narrative Interpretation Contract Review** at **architecture design level only**, and open B8 as a **review containing unapproved proposals**. This is a distinct sign-off, following the earlier instruction to **assess** closure without closing. It does **not** approve B8 proposals, specify final executable TypeScript/Go/SQLite schemas, authorise implementation, promote staging ideas to production, assert tests have passed or close earlier feasibility/evidence gates.

## B7 accepted decision inventory

| Decision | User's accepted disposition | Binding design |
| --- | --- | --- |
| [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) | **A** | Typed versioned envelope, domain-owned declarative payloads, deterministic event replay |
| [B7-D02](./B7-D02%20-%20Core%20and%20Optional%20Plugin%20Event%20Ownership.md) | **A** | Required core reducer/format failure stays fail-safe; unavailable removed optional plugin effects need not be reconstructed |
| [B7-D03](./B7-D03%20-%20Discard%20Unresolved%20Extraction%20Suggestions%20Without%20Diagnostics.md) | **C** (not earlier recommended A) | Silently discard only ambiguous *automatic extraction suggestions*, without notifications, pending drafts or persistent diagnostic backlog; real technical failures must still be reported |
| [B7-D04](./B7-D04%20-%20Typed%20Unknown%20Absence%20and%20Clear%20Semantics.md) | **A** | Typed field-defined unknown, explicit absence and known-value results; Clear establishes current unset, not restoration of an older value |
| [B7-D05](./B7-D05%20-%20Event%20Ordered%20Entity%20Lifecycle%20and%20Reestablishment.md) | **A** | Current entity removal and later grounded re-establishment follow one ordered stream, not an independent tombstone ledger |
| [B7-D06](./B7-D06%20-%20Typed%20Keyed%20Relations%20and%20Derived%20World%20Travel%20Graph.md) | **A**, subsequently refined by D10 | Deterministic keyed relationship Add/Remove; route connectivity is a **logical graph layer**, not a complete geographic map |
| [B7-D07](./B7-D07%20-%20Versioned%20Field%20Registry%20and%20Atomic%20Meaning%20Preserving%20Event%20Migrations.md) | **A** | Versioned field registry, deterministic meaning-preserving atomic conversion of supported *current* events under B4-D04 **Option B** |
| [B7-D08](./B7-D08%20-%20Narrator%20Safe%20Provisional%20References%20and%20Isolated%20ID%20Binding.md) | **A** | Prose-producing model requests receive only grounded natural-language references; private engine ID binding, optional isolated non-narrating context and same-model/single-pass compatibility |
| [B7-D09](./B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md) | **A** | Minimal current accepted event origin/order and deterministic replay/test obligations, without archived old passage/event revisions |
| [B7-D10](./B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) | **Explicit user-directed refinement**, **not** an A/B/C selection | The **primary player-facing world map is one persistent, semantically scaled spatial canvas** with pinned placed coordinates, nested/grouped geographic extents and meaningfully varying distance/link lengths. D06's travel graph is only connectivity; never auto-layout committed geography |

**All ten accepted.** Original alternatives and chronological provenance remain in the [B7 review](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md) and individual ADRs. **Do not retroactively mislabel D03 A, treat D10 as a generic graph-class selection, or infer D07–D09 were approved by D10's earlier user direction.** They received later separate A approvals.

## Binding cross-pass contracts

- **Narration is canon; world events are grounded memory.** [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) and [P-B6-01](./P-B6-01%20-%20Design%20Closure%20and%20Deferred%20Event%20Representation%20Contracts.md): no retrospective fictional possession, travel-legality or mechanical causality veto of already accepted prose.
- **Stable internal identities are never narrator prompt content.** No internal ID mapping or raw database tokens in a prose-producing request, even when one selected model handles sequential tasks. Unresolvable optional automatic candidates are omitted silently; genuine malformed required core data/provider/commit failures are not.
- **One current ordered history.** [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md): no immutable old passage/event revision archive. Independently committed manual corrections remain in the accepted total order; current event provenance survives supported Undo/Delete After/Keep Later Turns/Fork and atomic migrations according to prior decisions.
- **Schema safety and plugin boundaries.** Type/version-aware required core events are replayed deterministically or fail safely. Disabled/removed optional plugin-specific state retains its exception, while shared supported core facts must still replay. Coordinated, fenced, meaning-preserving conversion of current supported data follows B4-D04 Option B and B4-D07.
- **Primary map semantics are geographic, not decorative.** Locations on the same nested zoomable canvas have **persisted pinned coordinates and meaningful relative scale**. A region/city/building/room grouping has appropriate spatial extent. Route links draw geographically meaningful separation at appropriate scale; route-specific travel length may differ from straight-line map separation. Proximity/containment never invents travel edges. The graph is a **derived connectivity overlay**, not a competing map authority.
- **Player edits are explicit.** Moving a semantic map pin/group footprint is an actual world-map correction, through the existing pending manual Commit/Discard boundary; panning/zooming is visual only, and map selection/drag does not automatically move characters, create roads or narrate a turn.
- **Anatomy condition unchanged.** Under B6-D05, automatic detachment after limb loss is allowed **only if actual structured anatomy/body-part and equipment-slot linkage has been implemented and is active**; prose-only anatomy never triggers it.

## Deferred engineering and verification contracts carried into B8

1. **Spatial canvas projection/coordinates:** Versioned representation of semantic location positions, persistent group extents, nested coordinate frames/transforms, meaningful scales/distances and unknown/unplaced nodes. Do not invent world coordinates solely for rendering or silently mutate pins during graph layout.
2. **Travel geometry and topology:** Distinguish visual/straight-line separation from path length, conditional route access, directional edges and cost metadata where grounded. Derive typed relation graphs separately from geographic canvas coordinates and containment. No separate canonical graph ledger.
3. **Map-edit commit protocol:** Deterministic semantic pin/group edits through the existing TypeScript pending world-change workflow and Go/SQLite atomic durable event/accepted world-state boundary; UI pan/zoom and cosmetic labels are not source facts.
4. **Concrete event/reducer/identity handoffs:** Executable typed unions, field registries, entity lifecycle/relations, source provenance, narrator-safe natural provisional references and private ID binding, no guessed candidates, model adapter schema support, single-pass/sequential routing.
5. **Migration/restore and end-to-end evidence:** TypeScript/Go/SQLite replay, SQLite upgrade rollback, current-only Undo/Fork, operation-idempotency/version/epoch fencing, removed plugin optional effects, full-composer pending manual approval, stable spatial placement across reopening/edits and cross-scale distance/route rendering. **None is claimed implemented or passing.**
6. **Earlier feasibility gates:** B1 real-host and integration evidence remains outstanding. B7 closure does not waive those gates, promote staged idea documents, authorise implementation/release or establish production readiness.

## Closure decision and B8 scope

**Accepted:** Close B7 design-only on 2026-10-31 by explicit *separate* user approval. Open [Pass B8 — Spatial Canvas and Cross-Module Integration Contract Review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) for **unapproved** architecture questions, starting with semantic coordinate frames, meaningful distances and canon-safe map edits. Subsequent questions may address executable event contracts and actual multi-module handoffs without reopening B6/B7 user-approved philosophy.

**Not accepted:** Any B8 option, a fixed coordinate unit or renderer, a concrete Graph object/database table, passing integration tests, software implementation, staging-to-production promotion or formal B8 closure.

## Decision history

- **2026-10-31:** B7 opened by P-B6-01 sign-off. User separately selected D01 A, D02 A and notably D03 **C**, then D04 A, D05 A, D06 A.
- **2026-10-31:** User directly corrected the graph-oriented map model to **persistent semantic spatial canvas** in D10.
- **2026-10-31:** User separately selected D07 A, D08 A, D09 A and requested a **design closure assessment only**. Review was assessed ready but remained `in-review`.
- **2026-10-31 — Separate closure sign-off:** When directly asked whether to record **B7 closure and proceed to B8**, the user replied **“yes proceed”**. This ADR records that distinct approval; implementation and B8 choices remain unapproved.
