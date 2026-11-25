---
id: PRD-0068
type: prd
status: proposed
related:
- PRD-0001
- PRD-0042
- PRD-0040
- PRD-0043
---

# AI-Assisted Downstream Story Re-Evaluation After Historical Edits

## Problem

Preserved for product evaluation only.

## Source and delivery status

[Pinned source IDEA-0067](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/inbox/AI-Assisted%20Downstream%20Story%20Re-Evaluation%20After%20Historical%20Edits.md) · origin: user; created: 2026-10-26; updated: 2026-10-26

**Captured candidate; no approval to implement.**

## Goals and acceptance details

## Idea

**Unaccepted future option:** After a player edits an earlier story passage, offer an optional way to **reevaluate subsequent story passages and repair places where their fictional logic no longer follows from the revised history**. The user's suggested direction is to run evaluation against the *later* passages after the edit and fix those whose logic does not add up, instead of requiring the player to manually discover every downstream inconsistency.

This is a candidate for later consideration, **not an approved third historical-edit action, not part of current Pass B2 replay and not an automatic step of Keep Later Turns**.

## Why consider it?

The currently accepted history edit workflow intentionally allows players to **Keep Later Turns**, retaining later prose and accepted world events even when an earlier rewritten passage contradicts their premise. Some players may later want optional assistance with continuity-sensitive downstream rewriting or re-evaluation rather than doing all such repairs manually.

## Rough behaviour — unrefined hypothesis

- The player explicitly requests downstream reevaluation *after* a confirmed edit (exact invocation and whether it is an independent choice remain **undecided**).
- The system examines the **subsequent passages** for fictional continuity affected by the revised text.
- It proposes how inconsistent later passages might be changed, potentially including candidate changes to event outcomes where separately permitted and validated.
- The player should retain meaningful authority over whether proposed narrative/state changes enter canon; exact review/acceptance interaction is **undecided**.
- Any accepted changes would need coherent immutable passage revisions/event provenance, selected active-history semantics, deterministic reconstruction of accepted outcomes and atomic expected-version/library-epoch Go commits.
- Model interpretation/evaluation is potentially useful **during generation of a new proposal only**; historical deterministic replay must never rerun a model to decide an already accepted past.

These are **possibilities for future refinement**, not decisions or mandatory first-release requirements.

## Variations and alternatives

- Optional *diagnostics only*: identify potential fictional contradictions without rewriting.
- Optional *suggested revision set*: propose edits to later passages for explicit player approval.
- Optional *guided regeneration*: reevaluate later passages one by one with explicit user control.
- A large automated rewrite/repair operation is another, higher-risk possibility, not presumed accepted.

## Open questions and risks

- Is the workflow explicitly user-triggered, or attached as an additional confirmation option to historical editing?
- Should reevaluation rewrite fictional prose only, or permit changes to previously accepted world events and affected entities? How should accepted old outcomes be superseded while preserving append-only history?
- How should it avoid excessive API costs, multiple model calls, loss of authored passages or inappropriate invention of story facts?
- What happens when model interpretation is uncertain, local models are weak, or a selected provider fails? No unapproved fallback is allowed.
- How are proposed fixes previewed, accepted or cancelled atomically without losing the player's selected active history?
- What scale/performance and privacy safeguards are needed when sending large downstream histories to providers?
- How does this coexist with accepted Keep Later Turns and Delete All After Point, including their current **no automatic reevaluation/repair** guarantees?

## Evaluation notes

- **Current accepted behaviour remains simple:** Keep Later Turns preserves the edited passage's pre-existing linked events and subsequent passages/events despite fictional inconsistencies; Delete All After Point removes all later passages/events from **active canon** (with old audit records retained). Confirmed edits do not implicitly reinterpret later prose or create new state events.
- A browser TypeScript deterministic replay from Turn 0 ([B2-D03](../decisions/ADR-0009-turn-0-replay-for-authoritative-reconstruction.md)) **reapplies recorded outcomes**; it is **not** the proposed AI/semantic downstream reevaluation.
- Related accepted decisions: [B2-D01](../decisions/ADR-0007-immutable-outcome-events-and-atomic-commits.md), [B2-D02](../decisions/ADR-0008-immutable-history-and-single-active-selection.md), [B2-D04](../decisions/ADR-0010-retained-history-and-suspended-unrepresentable-effects.md), [B2-D05](../decisions/ADR-0011-canonical-structured-passage-documents.md) and [B2-D06](../decisions/ADR-0012-versioned-event-contracts-and-deterministic-compatibility.md).
- A future human acceptance into staging would be required before treating this as an established feature direction; later separate refinement/production approval and implementation verification gates still apply.

## Decision history

- **2026-10-26 — User idea recorded in Inbox only:** User requested saving as an **unaccepted idea** the possibility of running evaluation over all subsequent passages after an earlier edit and fixing those whose logic does not add up. User chose **not** to add reevaluation to current accepted historical editing; current Keep or Delete semantics remain. No staging, production, code or architecture-feature approval is implied.
