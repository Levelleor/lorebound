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
