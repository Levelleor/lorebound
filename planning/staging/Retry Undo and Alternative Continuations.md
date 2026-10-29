---
id: "IDEA-0004"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-28"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Story Editing and Event Timeline Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Retry Undo and Alternative Continuations

## Current accepted architecture after 2026-10-28 redirection

**Updated replay meaning ([B6-D01](../architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)):** Committed Undo removes the approved latest current story-turn suffix and replays **remaining declarative fact assertions**, not procedural commands requiring old source possession or routes. A later current assertion that survives a historical edit remains valid even if its former cause was removed; missing origin becomes unknown. No retained in-adventure passage/event revisions or inactive Redo selection; Fork remains a separate independently copied current prefix. Atomic Go/SQLite and idempotency remain.


## Idea
Support **replace-on-retry generation**, a **bounded temporary undo history for uncommitted editing**, and **repeatable deterministic Undo of committed turns** within one active adventure timeline. **No selectable collection of alternative AI continuations or persistent variant stack is kept within an adventure.** The file's original title is retained for existing wiki links; its older retained-alternatives proposal is explicitly superseded.

## Why this idea matters
Players should be free to regenerate experimental AI prose, undo work and change the course of an adventure without accidental world-state corruption or a complex in-story branch manager. **Each adventure has only one active canonical story sequence.**

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

## Proposed behaviour
While composing an action, user-written text is an autosaved noncanonical draft (IDEA-0005). A generated continuation may be displayed provisionally; **starting Retry discards the previous generation candidate and provisional proposed effects regardless of the result of the new attempt**. Only the latest validated continuation can become the next accepted story turn under its normal commit path. The coordinator and Go/SQLite commit accepted prose and events together, never treating replaced candidates as canon.

For an adventure with accepted Turns 1–75, a committed Undo moves the **active canonical head to Turn 74**, with authoritative world state deterministically reconstructed at that boundary. A second Undo moves to Turn 73, and so on to the earliest available committed boundary. The player can continue from Turn 74 with a different new Turn 75 **without creating a separate adventure**; the old Turn 75 is no longer an active or selectable continuation. If the player wants **both** possible futures to remain playable, the separate **Fork Story** operation creates another adventure that preserves its own history.

Editing temporary prose may offer a finite undo stack; running out of it does not reduce access to deterministic **committed** history, and temporary undo actions do not become canonical revision events. The UI must make provisional generation, temporary editor undo and committed Undo distinguishable enough not to accidentally treat a tentative edit as a destructive canonical rollback. Exact button placement, depth and confirmation for large reversals remain to refine.

## Alternatives and trade-offs
- **Explicitly superseded:** The 2026-10-16 idea of saving all generated variants for later comparison, maintaining an alternative-response selector and a canonical Redo branch is **not** part of the accepted design after the user's 2026-10-18 clarification.
- **Selected:** Simpler latest-candidate replacement, bounded temporary undo and deterministic single-head rollback. This avoids parallel state histories or complex variant switchers within one adventure. To preserve two separately playable futures, the user explicitly makes a new adventure by Fork.
- **Trade-off:** Rolled-back or replaced responses are **not promised to be recoverable** through a hidden alternate-version stack. The application may keep internal audit/invalidation references necessary for consistent event sourcing, but they are **not selectable story versions**. Permanent physical deletion versus audit retention is an implementation/storage detail; neither may leave old effects active.

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

## Draft acceptance criteria
- [ ] Retry of an **uncommitted** AI continuation replaces/discards the preceding candidate rather than keeping selectable alternates; only the latest fully validated candidate can be committed under the applicable pipeline.
- [ ] Replaced AI candidates and their provisional world-state proposals cannot be recovered through a response-variant picker or alter canonical state.
- [ ] A bounded **temporary editing undo history** can exhaust without limiting traversal of **committed story history**, and it never becomes a durable alternate-generation stack.
- [ ] At 75 committed turns, Undo moves the **active head to Turn 74**, and canonical inventory, characters, locations, world events and other tracked persistent effects match deterministic reconstruction through Turn 74.
- [ ] Repeating Undo can continue to each earlier committed turn down to the initial baseline, without an artificial small temporary editor undo-depth cap. Attempting Undo at the baseline cannot invent earlier state.
- [ ] After undoing Turn 75, committing a new Turn 75 in the **same adventure** does not restore or keep old Turn 75 as an alternative, and no old event/state effects leak into the new active future.
- [ ] If the player wants both futures, they can Fork into a separate adventure before divergence; creating another fork is **not** mandatory to continue after Undo.
- [ ] Committed Undo and the corresponding source/state/summaries/caches change are atomic and expected-version checked. A failed/stale rollback leaves existing canonical history and world state unchanged.
- [ ] Quick Start still automatically commits its first valid generated opening, while ordinary failed/replaced generation never commits partial text/world effects.
- [ ] Editing a historical passage without rolling back to it still obeys IDEA-0041 confirmation; Undo itself does not silently rewrite downstream prose or create an in-story branch graph.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant suggestion, subsequently explicitly accepted by the user.
- The direction is accepted for **staging and refinement**, not approved for production or implemented.

## Decisions and review history

- 2026-10-23 — **User reaffirmed A-23:** Failure, Stop, Retry and tab closure discard unfinished AI results and state proposals. Abort browser-origin requests/streams where supported; late responses and Go-side persistence cannot revive invalidated attempts. The existing committed Undo boundary is unchanged.
- 2026-10-18 — **Explicit user clarification and accepted committed Undo Option B, superseding the 2026-10-16 alternatives design:** **No persisted/selected AI response variants within one adventure**; each Retry replaces the prior uncommitted candidate, only the latest may continue. Uncommitted editing undo is bounded and exhaustible. **Committed Undo rolls back the single active canonical head** one turn at a time, deterministically restoring state and allowing **new continuation in the same adventure**. Old undone futures are not selectable versions; a **separate Fork** is used only when the player wants both futures playable. Keep strict Go/SQLite expected-version, coherent event provenance and atomic rollback; Quick Start auto-commit unchanged. The older retained variants and persistent canonical Redo proposal are superseded. Staging only, no code or production promotion.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user**: Retry, Undo, Redo and retained alternative continuations, linked to corresponding world-state events, with no automatic downstream rewrites. Promoted to staging for refinement, not to production.

- 2026-10-28 — **User-approved supersession:** Narrative-first declarative fact assertions and the revision-free current-story model now govern this document. Former contradictory original direction is historical approval context, not active implementation guidance. No stage promotion or software implementation.
