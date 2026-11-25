---
id: PRD-0005
type: prd
status: accepted
related:
- NOTE-0020
- PRD-0001
- NOTE-0009
- NOTE-0015
---

# Retry Undo and Alternative Continuations

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0004](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Retry%20Undo%20and%20Alternative%20Continuations.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S05**. First milestone: **M2**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-003A Retry audit](../work/items/STORY-0003-retry-drafts-undo-fork-and-current-history-prose-editing.md); [DEV-003E committed turn Undo](../work/items/STORY-0018-committed-story-turn-undo-and-composer-correction.md) verified/merged in PR #15; DEV-003D composer-only scope rejected; temporary passage-editor history in [DEV-003H](../work/items/STORY-0021-temporary-passage-editor-undo-redo.md), verified/merged in PR #18; [DEV-003I reload recovery](../work/items/STORY-0022-same-tab-reload-recovery-for-confirmed-story-saves.md) verified/merged in PR #19; broader replay remains later
- Evidence: [Merged PR #10](https://github.com/Levelleor/lorebound/pull/10); [delivery/review](../work/items/STORY-0014-replace-the-provisional-story-candidate-on-retry.md)

## Goals

Retry operates on a provisional candidate and only retains the latest result. Committed Undo reconstructs the surviving canon; there is no canonical Redo. Later continuation may differ, Fork preserves an independent prefix, and a temporary editor history remains noncanonical. Nonempty-effect reconstruction remains unverified.

## Current accepted architecture after 2026-10-28 redirection

**Updated replay meaning ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Committed Undo removes the approved latest current story-turn suffix and replays **remaining declarative fact assertions**, not procedural commands requiring old source possession or routes. A later current assertion that survives a historical edit remains valid even if its former cause was removed; missing origin becomes unknown. No retained in-adventure passage/event revisions or inactive Redo selection; Fork remains a separate independently copied current prefix. Atomic Go/SQLite and idempotency remain.


## Accepted direction
- **Replace-on-retry, not retained alternatives (user clarification 2026-10-18):** While a new AI continuation is **uncommitted/provisional**, Retry generates a replacement **for that one candidate**. **Starting a Retry invalidates/discards the previous candidate and its uncommitted state proposals immediately**, even if the replacement attempt subsequently fails; no previous-candidate recovery is promised. Do not store A/B/C variants to browse, compare, switch or recover later. The player may retry repeatedly; only the **latest candidate** can be used as the continuation. If the attempt fails, preserve the last committed story and recoverable player input, rather than committing a partial turn.
- **Committing the selected continuation:** When the player proceeds with/accepts the current continuation under the applicable generation workflow, **only the latest validated candidate and its coherent event/state effects** become the single accepted next turn. No other proposed continuations survive as selectable alternatives. **Quick Start remains the previously accepted exception**: its first successfully completed/validated generated opening commits automatically, without an additional Accept/Continue gate (IDEA-0006). Do not impose a new universal manual review gate merely from the retry design.
- **Temporary undo is bounded:** Supported **uncommitted editing operations** may have a **limited temporary undo history** (implementation-specific size and lifetime). Undo can traverse those edits only while they remain available; exhausting that history does **not** recover earlier replaced AI candidates or older discarded temporary states. Temporary undo/redo is not canonical text revision history, not a durable variant library and not a reason to mutate world state. Precise in-memory editor undo/redo controls remain a later implementation decision.
- **Committed Undo is a canonical rollback (explicit user selection B, 2026-10-18):** When an adventure's active canonical head is at Turn N, Undo can **remove Turn N from the active timeline and deterministically reconstruct the authoritative story/world state at Turn N-1**, including affected entities, inventory, locations, lore, memories, event effects and dependent plugin state. The player may repeat committed Undo backward through **available committed turns**, without an arbitrary temporary-editor undo-depth limit. The **initial baseline** is the earliest boundary; undo cannot precede actual committed history.
- **Same adventure may continue differently:** After committed Undo, the player may generate/author a **new Turn N in that same adventure**. That is a replacement of the active future **after rollback**, **not** a second parallel timeline or an in-adventure variant stack. The undone turn's former events/state must no longer influence the active story. **Do not retain the undone turn as a selectable alternate continuation or silently restore it when new turns are committed.**
- **Fork is optional when preserving another future:** To **keep the original future while exploring a different path**, explicitly Fork to a **separate independent adventure** at any committed turn (IDEA-0011). Forking is **not required** just to undo a committed turn and continue differently in the same story. Fork does not create a branch picker inside the story.
- **Committed rollback integrity:** A committed Undo is an **expected-adventure-version checked atomic canonical operation** through Go/SQLite, coordinated with complete incremental history and deterministic reconstruction. It must update active text, event/world-state projections, derived summaries/memories/snapshots and durable module state coherently. A failed or stale rollback leaves existing canon unchanged and reports the conflict. No AI regeneration of downstream prose is necessary.
- **No user-facing redo variant system:** The earlier staging proposal of **persistently retained alternative continuations and a canonical Redo path selecting old response versions is superseded**. Ordinary short-lived editor redo may be provided within the same temporary edit budget but is not a promise to restore a discarded generated candidate or a rolled-back canonical future. Internal inactive event/audit metadata, if needed for append-only provenance, is **not a playable alternate branch** or a recovery guarantee.
- **Historical edits are separate:** Editing an older passage while **keeping later turns** still follows IDEA-0041's explicit **Keep Later Turns / Delete All After Point / Continue Editing / Discard** confirmation. Repeated committed **Undo of the current head** does not silently rewrite later prose, and it does not require inventing a parallel branch.

## Dependencies and constraints
- Depends on turn/passage-level source revisions (IDEA-0003/0040), coherent committed events (IDEA-0039), complete deterministic reconstruction (IDEA-0042), independent forks (IDEA-0011), draft-versus-canonical persistence (IDEA-0005/0051), and typed coordinator transactions (IDEA-0044).
- **Replacement generations are provisional:** A stale/failed/partial retry never mutates canonical text, event history or game state. Starting Retry invalidates the preceding candidate and **aborts its browser-side API request/stream where supported**. Closing/reloading the tab likewise abandons any uncommitted candidate; late responses cannot commit. Only one successfully validated, still-active continuation may contribute to canon. Already accepted committed turns require separate Undo.
- **Rollback is canonical:** Go/SQLite must atomically reject an outdated expected-version request from another tab. Undo must not leave half-reverted inventory, location, Lorebook, status, summary or plugin state.
- Any caches/snapshots dependent on now-inactive turns must be invalidated or rebuilt; a replay after Undo must match replay of the surviving active committed prefix.
- **Undoing active head versus editing history:** A head rollback removes the most recent committed turn from the active story. Historical prose modifications with later turns still present follow IDEA-0041's explicit choice workflow; no silent downstream rewriting or automatic new branch.
- **No variants/hidden redo:** Do not expose old AI candidates or undone committed futures as alternate continuations inside an adventure. Forking to a different saved adventure is the way to intentionally keep two futures independently playable.
- A rollback reaches its natural limit at the initial accepted baseline; temporary editor undo has an independent bounded limit. Exact UI labels, interim redo support for uncommitted edits and rollback confirmation for many turns are open implementation refinements.

## Open questions
- How should the interface distinguish **temporary editor Undo** from **committed-turn Undo**, particularly when the input field has focus?
- What temporary editing undo budget and lifetime are appropriate, and should limited redo for those **uncommitted** edits be offered? This must never retain old generation candidates.
- Should Undo of many successive committed turns require extra confirmation, and how is the resulting active head displayed?
- How should an AI response transition from provisional latest candidate to committed turn under each configured pipeline, without adding a manual gate to the accepted Quick Start auto-commit path?
- Which non-playable audit/tombstone metadata, if any, should remain for event-sourced integrity when a committed head is rolled back? It must not provide a player-visible response-version menu.
- How should a stale Undo request present its expected-version conflict, and how should a pending model generation tied to the superseded head be invalidated?

## Supporting detail

See [NOTE-0020](../knowledge/inbox/NOTE-0020-prd-0005-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
