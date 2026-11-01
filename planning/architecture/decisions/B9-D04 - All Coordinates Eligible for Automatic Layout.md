---
type: architecture-decision
status: accepted
decision_id: "B9-D04"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 2 option selection)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - spatial-layout
---

# B9-D04 — Coordinates alone, with every pin eligible for automatic layout

## Approval and precedence

**Explicit 2026-10-31 instruction:** “Review B9 Batch 2: B9-D04: C; B9-D05: A; B9-D06: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option C, contrary to recommended A.** Persist typed coordinates **without a per-pin auto-adjustable/fixed policy, intentional-pin lock, or player-versus-AI authorship label**. Future deterministic automatic layout or grounded-geography reconciliation **may reposition any location**, including one deliberately positioned by the player. The saved position remains the current canonical position until a **subsequently accepted, valid spatial change** updates it.

**This is a genuine later override** of [B8-D08 A](./B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md)'s “never silently move a deliberately placed pin” and generated-only eligibility restriction; it also supersedes equivalent prior pin-protection language in [B8-D06 B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md), [B8-D07 A](./B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md), and [B9-D01 qualified A](./B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md). Earlier approvals were valid at the time and are retained as dated history, **not** falsely restated as still operative.

## Operative contract

1. **No stored pin-protection or author provenance field:** Persist only spatial facts and necessary identity/frame/event metadata. Do not introduce `fixed`, `pinned`, `autoAdjustable`, `playerAuthored`, or equivalent per-coordinate eligibility/actor flags solely to preserve a lock policy the user has rejected.
2. **Any location may be moved by automatic layout:** Prior committed manual positioning is **not an immunity against later automatic layout**. The previously accepted *generated-only* restriction for automatic reconciliation no longer applies. However, Option C **permits** later automatic changes; it does not require a full re-layout on every UI redraw, tab reload or model response, nor an unbounded background geometry rewrite.
3. **Coordinates remain durable and versioned:** This choice does **not** turn coordinates into disposable pixels. Initial location plus position remain an atomic accepted event batch; each later persistent automatic repositioning must also pass the existing **typed, ordered current-history, deterministic replay and atomic/version/epoch/idempotency commit** path. Until such a commit, the stored coordinate stays current. No separate hidden mutable canvas authority.
4. **Manual edits still use explicit Commit:** The player can drag/reposition locations; an intentional direct edit remains noncanonical until explicit pending Commit/Discard under [B8-D03](./B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md). Once committed, its position persists, but it is **not locked against a later automatic accepted placement event**. An automated reposition is not an uncommitted player drag and does not itself demand a separate player-approval prompt under the previously accepted auto-placement exception; exact reconciliation triggers remain deferred.
5. **Preserve unrelated invariants:** Do not infer fictional exact distance, travel time, roads, containment, character movement or source-narrator facts from generated map pixels. Region bounds may change independently; nested frames and current event provenance/order for Undo/Fork continue. The current history may distinguish a separately committed correction versus passage-associated assertion per B7-D09, but not to enforce permanent pin immunity.
6. **Conflict UX remains an open issue:** The experience may surprise a player whose intentionally placed city later shifts. Record that as an accepted trade-off, and defer notification/preview/auto-layout trigger policy to a later B9 decision. Never silently claim Option A pin protection still exists.

## Alternatives and trade-off

- **A — not selected:** Minimal durable `auto-adjustable` versus `fixed/pinned` state preserving intentional position protection.
- **B — not selected:** Infer a pin's auto-move eligibility from previous manual correction operations on replay.
- **C — ACCEPTED:** Coordinates without auto-move protection; later automatic placement can move any pin. Simplest metadata and no actor labeling, at the cost of potentially overwriting deliberate layout intent in subsequent accepted automatic updates.

## Traceability and approval history

[Original B9 Batch 2 options](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md); [B9-D01 qualified A](./B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md); [B8-D06](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md); [B8-D07](./B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md); [B8-D08](./B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md); [IDEA-0037](../../staging/Zoomable%20Node%20Map%20Canvas.md). No executable schema, test result, stage promotion or B9 design closure is approved.

- **2026-10-31:** B8 accepted auto-placement with player-overwrite protection. B9-D01 subsequently rejected per-coordinate AI/player authorship labels but temporarily preserved a minimal lock policy as an unapproved D04 idea.
- **2026-10-31 — later explicit approval:** User chose **B9-D04 C**. This removes pin immunity and updates the operative rule, preserving the historical record of the earlier guarantee.
