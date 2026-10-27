---
type: architecture-decision
status: accepted
decision_id: "B3-D07"
phase: "B3"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - transaction-contracts
  - architecture-decision
  - user-interface
---

# B3-D07 — Shared pending-commit overlay blocks the chat composer

## Approval and provenance

**Explicit user approval, 2026-10-27:** “lets record it like the entire chat box is overlaid with a semi transparent panel saying that there's uncommitted changes. lets use this style for all pending commits. You can approve them or discard. you can't use the chatbox or send anything while changes are pending. lets proceed further now”

This settles the previously tentative composer-blocking idea in [B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md) and extends the **shared visual/interaction pattern** to **all workflows that currently have a pending canonical commit requiring player resolution**. It is an architectural/UX rule, not a claim of a working user interface.

## Accepted decision

**When the current adventure has a pending, explicitly player-resolvable canonical change set, cover the entire chat composer with a semi-transparent overlay and prevent chat editing/submission until the pending change is approved or discarded.**

- **Full composer coverage:** A visibly semi-transparent panel overlays **the entire chat box**, with a clear message such as **“Uncommitted changes”** and an indication that the player must first resolve them. The composer is not usable beneath the overlay: no typing, paste, editing, keyboard submit or clicking Send; attempting to use another send path must not bypass the block.
- **Actions remain accessible:** Provide clear **Approve/Commit** and **Discard** controls for the pending change set outside the disabled composer interaction region or on its accessible overlay controls. The player must be able to resolve the blocker without interacting with the obscured input.
- **Reusable style:** Use the same overlay/approval/discard interaction pattern for **every existing pending-commit workflow**, not only manual world-state corrections. Adapt the approval action to the workflow's already accepted semantic choices. For instance, historical prose editing still requires its established **Keep Later Turns**, **Delete All After Point**, **Continue Editing**, **Discard** decisions; do not reduce Keep/Delete to an ambiguous generic Approve.
- **No implicit writes:** The overlay does not automatically accept a proposed commit. **Approve** requests validation and atomic commit through [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md), with [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md) attempt identity, [B3-D05](./B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md) stale detection and applicable [B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md) structural checks. **Discard** abandons the uncommitted change proposal and leaves current canon unchanged.
- **Blocked until resolved:** The composer stays blocked **while pending changes remain unresolved**. Rejected/invalid/stale attempts do not silently erase the pending proposal or unlock chat as if approved. The player can amend/review the pending proposal or discard it; exact failure-handling UI details remain to be designed.
- **Noncanonical boundary:** The overlay shows a pending proposal, **not yet canonical state**. Ordinary typing, AI streaming, transient generation candidates and debounce autosave drafts are not automatically "pending commits" solely by existing; otherwise the normal player/chat experience would become blocked for every keystroke.
- **No universal new approval step:** This is a shared UI for workflows **that already have an explicit pending-commit state**. It does **not** add an extra manual approval gate to normal validated story-turn finalisation or override the accepted auto-commit of successfully validated Quick Start openings. A new workflow adopting pending approval would follow the shared overlay.
- **Adventure scoping:** The pending change belongs to a specific adventure. Rules about persistence, cross-tab sharing and what happens on switching adventures are not decided here. Do not assume that an uncommitted change in one adventure locks all others or the entire library.

## Example

Player edits two inventory values. The changes are collected into one noncanonical pending change set. The chat box is completely covered with a translucent panel saying “Uncommitted changes,” and chat typing and Send are unavailable. The player chooses **Approve/Commit** to validate and durably accept the set, or **Discard** to abandon it. After resolution and a fresh authoritative view, normal chatting resumes.

## Trade-offs and options

- **Selected:** A fully overlaid, disabled composer plus explicit approval/discard. Prevents users from unknowingly continuing gameplay with unresolved state changes; interrupts chat until resolution.
- **Rejected prior suggestion:** Leave chat typing enabled but block only Send. User explicitly chose blocking **all composer use**.
- **Rejected prior alternative:** Allow chat and Send with only an informational pending-changes warning.
- **Not decided:** Exact opacity, animation, iconography, keyboard focus, screen-reader announcement, button placement, draft persistence across reloads, how simultaneous pending workflows are queued and failure-message presentation. Accessible approval/discard controls are necessary to avoid an unresolvable modal trap.

## Traceability

[B3 Batch 2 review](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md), [B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md), [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D05](./B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md), [IDEA-0041](../../staging/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md), [IDEA-0006](../../staging/Quick%20Start%20and%20New%20Adventure%20Flow.md) (where available). Owners S03, S04, S05, S06, S12.

## Decision history

- **2026-10-27 — B3-D06 acceptance:** User approved pending manual state edits with a bottom-area Commit control and tentatively raised blocking the chat box. The UI blocking option was not yet accepted.
- **2026-10-27 — D07 explicit later clarification:** User approved a **semi-transparent full-chat-box overlay**, explicit approval/discard, and **no composer use or send** until pending changes are resolved. Required the same style for all pending commits. This D07 approval supersedes earlier tentative/nonblocking UI proposals.
