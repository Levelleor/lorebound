---
type: architecture-decision
status: accepted
decision_id: "B8-D09"
phase: "B8"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Batch 3 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - spatial-canvas
  - atomic-persistence
  - architecture-decision
---

# B8-D09 — Atomic accepted location creation and automatically generated first map placement

## Subsequent B9 Batch 2 override — 2026-10-31

**Later B9-D04 C and D05 A (2026-10-31):** [B9-D04 C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) reverses this note's formerly proposed permanent protection for deliberately positioned pins: a future accepted automatic layout change may move any location. [B9-D05 A](./B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md) approves typed finite local-frame coordinates/transforms and mutable shapes. **Atomic creation of the resolved location and its initial generated position remains mandatory**. Direct manual repositioning still uses pending explicit Commit. Earlier origin/lock assumptions below remain historical, not current.


## Later B9-D01/D02 runtime and provenance refinement — 2026-10-31

[Accepted B9-D01 qualified A](./B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md) preserves typed map coordinates but removes the earlier assumption that every coordinate must carry a **player-vs-AI author label**. The accepted [B9-D02 A](./B9-D02%20-%20TypeScript%20Prepared%20Events%20and%20Go%20SQLite%20Atomic%20Commit%20Authority.md) keeps TypeScript preparation and Go technical/atomic SQLite commit authority; the **location and initial coordinate still save in one canonical idempotent transaction**. Generated defaults do not require a second manual approval, and later deliberate player map changes still require explicit Commit. Minimum operational pin protection must still prevent B8-D08's prohibited silent overwrites; its encoding is a separate **unapproved B9-D04 proposal**. Earlier origin/provenance language below is preserved as dated context, not a mandate for an AI/player audit field.



## Approval and provenance

**User approval, 2026-10-31:** “Review B8 Batch 3: B8-D07: A; B8-D08: A; B8-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and assess B8 design closure.”

This accepts **B8-D09 Option A**, separately from D07 and D08. The original options remain in the [B8 review](../Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), whose closure assessment is **not** a separate closure approval. No runtime implementation, staging promotion or integration-test completion is implied.

## Inherited design

[B8-D06 B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) requires automatically generated and **durably stored** initial coordinates for accepted new locations, with later player adjustments available. [B8-D07 A](./B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md) selects a deterministic parent-frame-aware placement strategy, and [B8-D08 A](./B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md) distinguishes generated layout from authored/grounded geography.

## Accepted decision — Option A

1. **One coherent accepted creation transaction:** When a passage or authorised world edit establishes a **resolved new location**, prepare its stable identity, accepted location-creation assertion, necessary grounded relationship/property assertions and its **typed, source-tagged generated initial spatial coordinate** as one coherent proposed batch. Store the related canonical writes **atomically**, so there is no committed location missing required initial map placement and no ghost pin surviving a failed create.
2. **System placement is not a manual correction:** Generated initial coordinates accompanying an accepted location do **not** each require a fresh player approval. For a **custom/manual world creation** awaiting explicit Commit, the generated default position belongs to that *same pending batch* and is accepted only when that world edit is committed. For an automatically accepted story/Quick Start creation, use its already approved acceptance path. Later deliberate player pin moves still require explicit pending Commit/Discard.
3. **Deterministic and idempotent:** Initial placement and source markers are prepared using supported B8-D07 deterministic selection, with the existing adventure expected-version/library epoch/operation-id safeguards. Retry cannot duplicate an entity/pin or assign an arbitrary new coordinate for an already committed location. Preserve event total order and minimal provenance.
4. **Single current replay:** Reconstruct the placed location and its generated-origin placement via the same ordered current history. Supported history edit, Undo, Keep Later Turns and Fork apply existing current-only rules: no independent map sidecar silently retains orphaned pins or fabricated old revisions. Schema migration preserves identity, coordinate/frame and generated-origin semantics or fails safely.
5. **No procedural fictional validity checks:** Missing historic travel/creator/route doesn't invalidate accepted later location facts. A map layout algorithm doesn't grant a route or change character position, border membership, distance or access. The narrator remains ID-free.
6. **No asynchronous two-write map repair:** Do **not** commit canonical location first and then rely on an unrelated canvas-load/background geometry write, nor use volatile-only map positions under the accepted persisted spatial contract. Transaction failure must remain a real technical error, not be swallowed under B7-D03's optional ambiguous-extraction discard rule.
7. **Batch and sparse cases:** If a later accepted story refers to a known stable/sparse location ID, it is not automatically a *new* location needing a fresh first-placement operation. The exact create/restoration and no-frame fallback handling remain engineering refinements; never allow a second independent canonical spatial history.

## Original options

- **A — ACCEPTED:** Stable identity and initial system-generated placement committed in the same coherent atomic canonical event transaction.
- **B — not chosen:** Commit location first and asynchronously insert coordinates via a separate unprotected canvas write.
- **C — not chosen:** Store generated coordinates only as ephemeral viewport/layout state.

## Deferred technical contracts

Typed event schema, placement allocation and event order within a batch, coordinates when frames are absent, retries/fork ID treatment, error handling, multiple simultaneous location creations, schema migration, transaction integration and real tests. No implementation is claimed.

## Approval history

- **2026-10-31:** B8-D06 **B** explicitly settled auto-committed generated map placement, with player edits controlled separately.
- **2026-10-31:** B8-D09 A/B/C were presented as proposals; A recommended atomic location+coordinate commit.
- **2026-10-31:** User expressly approved **B8-D09 A** with D07 A/D08 A, and asked only to **assess** B8 design closure. No formal closure or implementation approval.
