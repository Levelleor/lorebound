---
id: ADR-0074
type: adr
status: accepted
related:
- ADR-0075
- ADR-0076
- ADR-0069
- ADR-0067
- ADR-0068
- ADR-0071
- ADR-0064
- ADR-0060
- PRD-0038
supersedes: []
---

# All Coordinates Eligible for Automatic Layout

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B9-D04](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) · approved at: 2026-10-31; approved by: requesting user (explicit B9 Batch 2 option selection)

## Approval and precedence

**Explicit 2026-10-31 instruction:** “Review B9 Batch 2: B9-D04: C; B9-D05: A; B9-D06: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option C, contrary to recommended A.** Persist typed coordinates **without a per-pin auto-adjustable/fixed policy, intentional-pin lock, or player-versus-AI authorship label**. Future deterministic automatic layout or grounded-geography reconciliation **may reposition any location**, including one deliberately positioned by the player. The saved position remains the current canonical position until a **subsequently accepted, valid spatial change** updates it.

**This is a genuine later override** of [B8-D08 A](ADR-0069-provenance-aware-spatial-reconciliation-of-generated-placement.md)'s “never silently move a deliberately placed pin” and generated-only eligibility restriction; it also supersedes equivalent prior pin-protection language in [B8-D06 B](ADR-0067-automatic-persistent-location-placement-with-player-overrides.md), [B8-D07 A](ADR-0068-deterministic-scoped-automatic-map-placement.md), and [B9-D01 qualified A](ADR-0071-typed-spatial-coordinates-without-ai-player-authorship-labels.md). Earlier approvals were valid at the time and are retained as dated history, **not** falsely restated as still operative.

## Operative contract

1. **No stored pin-protection or author provenance field:** Persist only spatial facts and necessary identity/frame/event metadata. Do not introduce `fixed`, `pinned`, `autoAdjustable`, `playerAuthored`, or equivalent per-coordinate eligibility/actor flags solely to preserve a lock policy the user has rejected.
2. **Any location may be moved by automatic layout:** Prior committed manual positioning is **not an immunity against later automatic layout**. The previously accepted *generated-only* restriction for automatic reconciliation no longer applies. However, Option C **permits** later automatic changes; it does not require a full re-layout on every UI redraw, tab reload or model response, nor an unbounded background geometry rewrite.
3. **Coordinates remain durable and versioned:** This choice does **not** turn coordinates into disposable pixels. Initial location plus position remain an atomic accepted event batch; each later persistent automatic repositioning must also pass the existing **typed, ordered current-history, deterministic replay and atomic/version/epoch/idempotency commit** path. Until such a commit, the stored coordinate stays current. No separate hidden mutable canvas authority.
4. **Manual edits still use explicit Commit:** The player can drag/reposition locations; an intentional direct edit remains noncanonical until explicit pending Commit/Discard under [B8-D03](ADR-0064-versioned-spatial-assertions-and-explicit-map-edit-commit.md). Once committed, its position persists, but it is **not locked against a later automatic accepted placement event**. An automated reposition is not an uncommitted player drag and does not itself demand a separate player-approval prompt under the previously accepted auto-placement exception; exact reconciliation triggers remain deferred.
5. **Preserve unrelated invariants:** Do not infer fictional exact distance, travel time, roads, containment, character movement or source-narrator facts from generated map pixels. Region bounds may change independently; nested frames and current event provenance/order for Undo/Fork continue. The current history may distinguish a separately committed correction versus passage-associated assertion per B7-D09, but not to enforce permanent pin immunity.
6. **Conflict UX remains an open issue:** The experience may surprise a player whose intentionally placed city later shifts. Record that as an accepted trade-off, and defer notification/preview/auto-layout trigger policy to a later B9 decision. Never silently claim Option A pin protection still exists.

## Alternatives and trade-off

- **A — not selected:** Minimal durable `auto-adjustable` versus `fixed/pinned` state preserving intentional position protection.
- **B — not selected:** Infer a pin's auto-move eligibility from previous manual correction operations on replay.
- **C — ACCEPTED:** Coordinates without auto-move protection; later automatic placement can move any pin. Simplest metadata and no actor labeling, at the cost of potentially overwriting deliberate layout intent in subsequent accepted automatic updates.

## Traceability and approval history

[Original B9 Batch 2 options](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md); [B9-D01 qualified A](ADR-0071-typed-spatial-coordinates-without-ai-player-authorship-labels.md); [B8-D06](ADR-0067-automatic-persistent-location-placement-with-player-overrides.md); [B8-D07](ADR-0068-deterministic-scoped-automatic-map-placement.md); [B8-D08](ADR-0069-provenance-aware-spatial-reconciliation-of-generated-placement.md); [IDEA-0037](../product/PRD-0038-zoomable-node-map-canvas.md). No executable schema, test result, stage promotion or B9 design closure is approved.

- **2026-10-31:** B8 accepted auto-placement with player-overwrite protection. B9-D01 subsequently rejected per-coordinate AI/player authorship labels but temporarily preserved a minimal lock policy as an unapproved D04 idea.
- **2026-10-31 — later explicit approval:** User chose **B9-D04 C**. This removes pin immunity and updates the operative rule, preserving the historical record of the earlier guarantee.
