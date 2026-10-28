---
type: architecture-decision
status: accepted
decision_id: "B5-D06"
phase: "B5"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - initialization
  - architecture-decision
---

# B5-D06 — Explicitly commit a player-authored Custom Opening with grounded events

## Approval and provenance

**Explicit user approval on 2026-10-28:** “Review B5 Batch 2: B5-D04: A; B5-D05: A; B5-D06: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B5 review.”

This records **B5-D06 Option A** only. The original B5 alternatives remain in [the review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md); D04 and D05 have separate ADRs.

## Context

The source staged [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md) accepts a player-written Custom Opening, including **completely blank**. It also accepts strict text-grounded fact extraction when opening prose becomes canonical. The accepted common [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) pending-commit UX blocks the chat composer while an explicit approval is unresolved. This decision specifies when the player's first custom prose becomes committed canon, distinct from auto-committed Quick Start AI prose.

## Accepted decision — Option A

**Keep Custom Opening prose as a noncanonical editable draft until the player explicitly approves it. Only then validate and atomically commit that first current structured passage together with its supported, explicitly grounded world-state outcome events.**

- **Draft-first:** Editing, autosaving a draft, previewing or typing an initial passage does not alter current canonical story/event records or adventure version. The user can continue editing, abandon or discard an unaccepted custom passage under the current pending-workflow contract.
- **Explicit acceptance:** When Custom Opening is ready for canonical acceptance, show a clear **Approve/Commit** or **Discard** resolution for the pending first passage, using the shared full-composer semi-transparent overlay that disables chat typing/sending until the pending commit is resolved. The user can return to editing while the draft remains noncanonical; exact controls for amendment are UI refinement.
- **Coherent accepted passage:** The TypeScript coordinator/extractor derives **only facts actually established** by the committed player prose, explicit setup and prior current canon, per [B5-D02](./B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md), with applicable deterministic structural checks. If valid, one B3-D01 atomic Go/SQLite transaction accepts the structured passage and its events; expected adventure version, library epoch and idempotency receipt rules apply. Never save canonical prose and world events separately.
- **Blank remains valid:** The player may choose a completely blank Custom Opening and have a durable adventure with **no fabricated first passage, invented character or empty-content story turn**. The explicit confirmation gate applies to a **pending authored passage**, not mere creation of an empty adventure, nor every editor keystroke.
- **Failure and stale handling:** Invalid or unconfirmed openings remain noncanonical, and an incomplete commit must not partially mutate canon. Lost success responses follow B3-D02 receipt resolution; stale canonical writes follow B3-D05. The narrowly later [B4-D08](./B4-D08%20-%20Discard%20Stale%20Pending%20Manual%20Drafts.md) automatic stale-discard applies explicitly to obsolete **manual world-state drafts** and is **not automatically extended** to prose opening drafts.
- **Distinct Quick Start path:** [B5-D03](./B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md) remains automatically committed upon validated completion and requires **no** new manual approval. This D06 only governs Custom Opening's deliberate authorial acceptance.

## Alternatives considered

1. **A — accepted:** Noncanonical draft until explicit first-passage Commit, with atomic grounded facts and events. Player intent and replay integrity are preserved.
2. **B — rejected:** Every typed edit changes canonical story immediately, undermining draft-first coherence.
3. **C — rejected:** Accept prose without its derived supported events until a later story turn, violating coherent replayable outcomes.

## Deferred design details

Exact UI transition from the Custom Opening editor to the overlay, choice of when uncommitted prose triggers the pending-change state, save/resume of prose drafts across reload, empty/whitespace-only handling, focus/keyboard behaviour, and UI copy remain engineering/UX refinements. No special generation AI requirement is added for a Custom Opening, no staging promotion or implementation is claimed.

## Traceability

[B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md), [B5-D01](./B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md), [B5-D02](./B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md), [B5-D03](./B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md), [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md). Owners S02/S03/S04/S05/S06/S12.

## Decision history

- **2026-10-28 — Original options proposed, not accepted:** D06 A editable noncanonical draft until explicit approval and atomic prose/facts commit; B commit every typed edit; C commit prose first and extract state later.
- **2026-10-28 — Explicit approval:** User selected **B5-D06 A**, independent of separately approved D04/D05. No B5 closure or later option approved.
