---
type: architecture-decision
status: accepted
decision_id: "P-B8-01"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (separate explicit B8 design closure and B9 opening authorisation)"
tags:
  - planning/architecture
  - pass-b
  - design-closure
  - architecture-decision
---

# P-B8-01 — B8 design closure and handoff to runtime integration contracts

## Separate explicit authorisation

**2026-10-31.** After the assistant recorded and assessed **all nine** B8 numbered decisions, expressly stated that **“B8 remains `in-review`”** and that no closure or implementation was yet approved, and asked **“Shall I record that closure and proceed to B9?”**, the user replied **“yes”**.

**Decision:** Formally close **Pass B8 — Spatial Canvas and Cross-Module Integration Contract Review** at **architecture-design level only**, and **open Pass B9** to review the deferred technical integration contracts as **unapproved proposals**. This is a **separate closure approval** after the earlier instruction to *assess* B8 design closure; no B9 option is approved by the single-word authorisation. Do not infer code implementation, tests completed, an implementation-ready production staging promotion or a release gate.

## Accepted B8 architecture and original approval provenance

| Decision | Explicit user disposition | Current binding outcome |
| --- | --- | --- |
| [B8-D01](./B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) | **A** | Persist semantic locations in nested local coordinate frames with composed transforms on one zoomable canvas. |
| [B8-D02](./B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) | **A** | Meaningful geographic separation vs separately grounded route shape, travel length/time/cost. |
| [B8-D03](./B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) | **A** | Type-checked durable spatial facts and explicit pending Commit/Discard for deliberate player edits; atomic persistence. |
| [B8-D04](./B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md) | **A, with user's explicit clarification** | Borders/region footprints are **mutable story/world state** and **not equivalent** to parent-child containment; later accepted assertions can change them. |
| [B8-D05](./B8-D05%20-%20Stable%20Cross%20Frame%20Routes%20with%20Grounded%20Door%20and%20Portal%20Anchors.md) | **A** | Stable keyed cross-frame roads/doors/portals; optional grounded anchors; visual adjacency/borders never invent routes. |
| [B8-D06](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) | **B, not recommended A, with explicit user clarification** | **Automatically place every resolved new location** at a durable system-generated coordinate on the canvas; players can deliberately reposition. This **supersedes earlier B7-D10/B8-D01 no-generated-canonical-coordinate defaults for initial map layout only**. Generated coordinates are **not** automatically a narrated measurement, distance or route. |
| [B8-D07](./B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md) | **A** | Deterministic initial placement scoped to the applicable local frame, honouring existing pins/constraints; no mandatory extra AI call. |
| [B8-D08](./B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md) | **A** | Later grounded geography can reconcile **generated-only** coordinates; do **not silently move authored/pinned** placements or fabricate exact narrative measurements. |
| [B8-D09](./B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md) | **A** | Save an accepted new location identity and its generated first placement in the **same atomic, idempotent canonical transaction**, not an asynchronous map sidecar. |

**All nine decisions received explicit selection.** The [B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) and individual ADRs preserve dated A/B/C proposals and later approvals. D06 remains **B**, never relabel it A. D04's **mutable boundaries** are part of the actual accepted approval, not an optional implementation note.

## Inherited narrative and system boundaries

1. **Narrative-first current world:** Under [P-B6-01](./P-B6-01%20-%20Design%20Closure%20and%20Deferred%20Event%20Representation%20Contracts.md), grounded accepted fiction and explicit committed player corrections yield declarative current-state assertions, not simulated game commands requiring established earlier causal/route/possession steps. Current ordered events survive supported history-edit boundary rules without an immutable archive.
2. **Safe versioned assertions:** [P-B7-01](./P-B7-01%20-%20Design%20Closure%20and%20Deferred%20Spatial%20Canvas%20Integration%20Contracts.md) requires typed versioned envelopes, unknown/absence/value distinction, keyed relationships, stable entity IDs, minimal accepted source/order provenance, meaning-preserving coordinated migrations, replay and required-core failure safety. Optional removed-plugin historical custom effects remain distinct.
3. **Narrator identity privacy and ambiguity:** Stable IDs and ID maps never enter prose-producing prompts; private resolution may use them. **B7-D03 C** silently discards genuinely unresolved *automatic* extraction candidates without diagnostics, but does **not** suppress real provider/required-schema/Go/SQLite failures or reject otherwise valid fiction.
4. **World canvas is geographic:** Saved, semantically scaled nested geometry, mutable region boundaries, separate containment and explicit travel graph; graph auto-layout never silently replaces intentionally authored pins. The **auto-generated default initial position is canonical map placement with explicit generated provenance**, not a false story claim of exact geographic distance. Player map corrections use the approved pending Commit workflow.
5. **All-or-nothing acceptance:** A new resolved location and its generated map position commit together; system defaults do not require a separate player approval per new pin. *Deliberate player* map moves and border edits remain noncanonical until explicit approval. TypeScript builds and projects typed facts; Go/SQLite commit must respect version/epoch/idempotency/transaction integrity.
6. **Conditional anatomy remains conditional:** [B6-D05](./B6-D05%20-%20Conditional%20Anatomy%20Linked%20Equipment%20Detachment.md) permits automatic unequipping only after the **actual structured body-part/slot linkage has been implemented and is active**. Prose alone does not trigger detachment.

## Outstanding technical contracts carried forward to B9

- **Executable spatial payloads and transforms:** Versioned event/field schemas for local frames, scales/units, nested transforms, generated/grounded/authored provenance, mutable boundaries and their shape types, route anchors and optional path geometry.
- **Cross-module orchestration:** TypeScript typed interpretation/preparation/reducer vs Go/SQLite canonical validation/storage, source ordering, system placement within the story/create transaction, manual pending drafts/Commit, full-composer overlay and idempotent retries.
- **Deterministic placement and reconciliation:** Exact initial placement algorithm, fallback for unknown/no parent, stable tie-breaker, multi-location creation, source priority rules and conflicts between two explicit geographic claims, no unauthorized user-pin movement.
- **Canvas and route projection:** Render/caching ownership, location/containment/route/door integration, nested zoom and spatial group display, route distances vs map chord lengths, map shape editing and narrator-safe summary context.
- **Real verification:** Replay, edit/Undo/Fork, migration rollback, reopened/Forked coordinates, no duplicate pin on retry, transaction race and library epoch tests, model prompt ID isolation, optional plugin effects, compatibility with real Wails/Go/SQLite host. **No tests claimed passed or implemented.**
- **Earlier gates unchanged:** B1 feasibility/evidence requirements and the staging→production approval gate remain. A closed planning review does not ship software or constitute implementation authority.

## Decision and next review

**Accepted:** B8 is **closed-design-only on 2026-10-31** upon the user's distinct reply “yes”. Open [B9 — Typed Spatial Data and Runtime Integration Contract Review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) with **unapproved** architecture alternatives for concrete spatial records, runtime handoff and deterministic verification.

**Not accepted:** Any B9-D01+ option, final JSON or Go/SQLite schema, a finished map, migrated data, implemented features, staging promotion, passed tests or B9 closure.

## Decision history

- **2026-10-31:** B8 opened by P-B7-01 with D01–D03 unapproved proposals; user separately accepted D01 A/D02 A/D03 A.
- **2026-10-31:** User separately accepted D04 A **with mutable borders**, D05 A, **D06 B with automatic placement/player freedom**. D06 superseded the earlier unplaced default.
- **2026-10-31:** User separately accepted D07 A/D08 A/D09 A and requested a **closure assessment only**; the B8 review remained `in-review`.
- **2026-10-31 — Formal closure approval:** Following the assessment and explicit invitation **“Shall I record that closure and proceed to B9?”**, user replied **“yes”**. This ADR records formal **design-only** closure, and permits opening B9 with **unapproved** proposals. No implementation or stage promotion.
