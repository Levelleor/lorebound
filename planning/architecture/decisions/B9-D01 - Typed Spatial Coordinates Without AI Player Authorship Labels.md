---
type: architecture-decision
status: accepted
decision_id: "B9-D01"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Batch 1 Option A, qualified: no player-versus-AI authorship distinction)"
tags:
  - planning/architecture
  - pass-b
  - spatial-data
  - architecture-decision
---

# B9-D01 — Typed spatial coordinates and geometry without player-versus-AI authorship labels

## Later B9 Batch 2 operative supersession — 2026-10-31

**Later B9-D04 C supersession (2026-10-31):** [B9-D04 C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) explicitly rejects the minimal auto-adjustable/fixed-pin protection policy that was provisionally preserved after B9-D01 qualified A. **All stored coordinates may later be repositioned by valid accepted automatic layout**, even when the user had deliberately moved the pin. No per-coordinate player-versus-AI author labels or permanent immunity flag. Earlier sections below documenting a need for pin protection are superseded, not silently reinterpreted. Typed durable geometry and the explicit pending Commit for direct manual edits remain.


## Explicit approval and qualification

**2026-10-31 user instruction:** “Review B9 Batch 1: B9-D01: A; B9-D02: A; B9-D03: B. Notes: for D01 I don't think the distinction between player-authored and ai-authored should be accounted for. just store the credentials. For D03 we will have mocked tests for all parts of the app, we will not have scenario tests where AI model is acutally launched which is why I chose B. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**Disposition: B9-D01 Option A with an explicit user amendment.** In this *map-coordinate* discussion, “credentials” is interpreted as **coordinates**, not login credentials or authentication secrets. The user accepts **versioned, typed spatial data** but **rejects tracking player-authored versus AI-authored classifications for spatial coordinates**. Original unamended Option A below included explicit origin tags; that portion is **not approved**. The [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) retains the proposal and this amendment as chronological provenance. B9-D02 A and B9-D03 **B** are separate decisions.

## Accepted design

1. **Store the actual spatial facts, not who provided them:** Canonical map fields contain typed, versioned **location-relative coordinates, local frame and scale/transform values, region/group footprints and optional grounded route anchors or path geometry** on stable internal identities. Do not require a `player-authored` versus `AI-authored` classification, per-coordinate AI/user author identity, an author attribution audit field, or an AI-specific map schema. Viewport pan/zoom, label offsets and disposable renderer caches are not canonical coordinates.
2. **Versioned domain-owned typing:** Use the previously accepted declarative event envelope/domain field registry and meaning-preserving current-record migrations. Supported values distinguish unknown, known absence and known values where applicable. Supported schema/version/transform validity remains a technical requirement, not a fictional prior travel or geography proof.
3. **Preserve user-intended placement without an authorship ledger:** Earlier **[B8-D06 B](./B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md)** and **[B8-D08 A](./B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md)** still require automatic initial placement, freedom to move pins, and no silent overwriting of explicitly user-positioned pins during later generated-layout reconciliation. Implement this via the *minimum operational placement policy/state* necessary to distinguish **auto-adjustable initial positions** from **intentionally fixed/pinned positions**, rather than author identity labels such as `source: AI` or `source: player`. It is an **edit/overwrite eligibility rule, not an audit of whose creativity supplied the location**. The exact policy's storage encoding, whether in an existing event operation type or another minimal field, is **not yet accepted** and is explicitly deferred for review. If even that policy is ultimately omitted, B8-D08's “protect user-moved pins” guarantee needs a separate explicit change; it cannot be silently lost.
4. **Minimal ordering/source linkage is a different concern:** [B7-D09](./B7-D09%20-%20Minimal%20Event%20Provenance%20and%20Deterministic%20Current%20Replay%20Verification.md) previously accepted only the minimal event identity/total-order and association with a current story passage or separately committed world correction, necessary for Undo/Fork/replay. This is **not** a requirement to tag each coordinate as player-generated or AI-generated. B9-D01 narrows **spatial-property origin labels**, not the accepted current history linkage.
5. **Keep map geography versus route meaning separate:** Coordinates describe durable map positions in nested frames; **do not equate generated geometric separation with canonical narrated route length, travel time, travel legality or automatically established roads**. Mutable region shapes remain current typed facts, independent from canonical parent/child containment.
6. **Player edit and initial placement save paths:** Initial auto-placement accompanies the accepted location creation in one atomic/idempotent batch under [B8-D09](./B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md); deliberate player pin/region edits remain pending until explicit Commit under B8-D03. Go/SQLite validates structural safety and commits; no independent authoritative graph data store.

## Original Batch 1 alternatives and disposition

- **A — ACCEPTED WITH QUALIFICATION:** Domain-owned typed spatial value/frame/shape schemas, versioned validation/migration and separation of canonical geography from UI pixels. **The original A's mandatory system-generated/narration/player origin tags were expressly rejected by the user**. No player-vs-AI per-coordinate authorship classification.
- **B — not selected:** Arbitrary unversioned canvas JSON and ad hoc `x`/`y` renderer interpretation.
- **C — not selected:** Browser screen pixels as canonical geography.

## Deferred implementation choices and boundary

Exact coordinate/frame type declarations, units, outline/anchor schema, runtime parsers and migration, minimal **auto-adjustable versus protected pinned** state encoding, and whether reconciliation runs on optional story spatial constraints without author-origin labels. The constraint **to protect intentionally moved pins** remains inherited; this ADR doesn't secretly revoke B8-D08. No code, tests, B9 closure or stage promotion approved.

## Decision history

- **2026-10-31:** B7–B8 accepted versioned spatial canvas/events, auto-generated persistent placement (D06 **B**) and generated-only reconciliation respecting player-adjusted pins (D08 A). Earlier notes proposed richer generated/narrated/player coordinate provenance.
- **2026-10-31:** B9 Batch 1 original **A/B/C** proposals were unapproved, with A recommending **explicit origin tags**.
- **2026-10-31 — Explicit selection/amendment:** User chose **B9-D01 A** but specified **no player-authored vs AI-authored distinction; just coordinates**. This ADR accepts A's typing and geometry, **excludes mandatory author labels**, preserves needed pinned-edit safety and defers its minimal representation. D02 A/D03 B approved separately.
