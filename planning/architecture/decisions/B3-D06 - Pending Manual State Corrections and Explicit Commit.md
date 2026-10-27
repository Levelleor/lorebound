---
type: architecture-decision
status: accepted
decision_id: "B3-D06"
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
---

# B3-D06 — Pending manual state corrections and explicit Commit

## Approval and provenance

**Accepted by the requesting user on 2026-10-27:** “yes, lets do that, with one clarification. once there is a deviation from from previous state we add that to a commit but don't commit that immediately, only after the player presses the commit button which pops up somewhere at the bottom area (maybe even blocking the chat box so you have to notice it before you proceed?)”

This follows the explanation of **B3-D06 Option A**: record a player-made manual world-state correction as a new replayable accepted outcome event, potentially related to but not necessarily sourced from a story turn; deterministic Turn-0 replay can then reconstruct the correction. The approval **includes the new explicit manual Commit gate**. The suggested *chat-box blocking* was explicitly tentative (“maybe even”) and is **not yet an accepted mandatory UX behaviour**.

This ADR records this decision only. No implementation, tests, staging promotion, or change to the normal already-accepted story-turn/Quick Start acceptance flow is implied.

## Context

Under [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), Lorebound has one current ordered story/event history, no retained passage revisions or immutable historical event audit archive. Under [B2-D03](./B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md), authoritative reconstruction from Turn 0 must reproduce player world-state corrections. A player editing a character's inventory or world detail cannot update only a transient projection: such a change would vanish on the next replay.

## Accepted decision — Option A, refined by explicit player Commit

**Manual world-state editing produces a visible pending, noncanonical change set. Only the player's explicit Commit action may submit that complete set as an atomic canonical transaction containing replayable correction outcome events.**

- **Stage instead of write:** When a player changes a world-state editor control, compare it against the current accepted state and accumulate the intended net difference in a **pending commit/change set**. Further related changes can be gathered in that same set. No canonical passage, event, current world state, or adventure version changes merely because a field was edited.
- **Editable pre-commit preview:** The editor may show pending values for review, but must distinguish them from committed state. If a field is changed back to its original value, it need not generate a correction outcome: only accepted net changes are recorded.
- **Explicit Commit button:** Show a clear **Commit** action associated with pending manual changes, in a conspicuous **bottom-area UI prompt/bar** when such changes exist. The player must press it to request acceptance; **autosave, field blur, navigation, typing, or elapsed time must not silently commit gameplay state**. Fine layout and exact labels remain UX refinement.
- **Batch validation and persistence:** On Commit, S05/S06 prepare versioned deterministic **outcome events** for the intended changes, including stable entity IDs, event order and player-origin provenance. Corrections may reference an applicable story turn or event sequence position, but **must not invent a narrative passage/turn** solely to source them. Apply established structural/invariant and dependency checks to the **complete resulting change set**. If invalid, report the problem and leave canon untouched so the player can revise.
- **Atomic Go boundary:** Submit one B3-D01 typed prepared canonical-commit request for the valid batch, with the expected adventure version, library epoch and B3-D02 operation identity. Go checks storage integrity/fencing/version and commits all corresponding events and changes or none.
- **Success and failure:** After confirmed durable success, pending changes are reconciled with the newly authoritative state. If rejected or stale under B3-D05, preserve an available noncanonical working proposal for inspection and require refetch and a fresh player/coordinator decision before another submission. A dropped/uncertain response must be resolved by B3-D02 rather than blindly generating a duplicate correction.
- **Deterministic reconstruction:** Correction outcome events are included in the **current ordered canonical events** and applied by Turn-0 replay, so the effect survives reconstruction. As under B3-D04, no old passage/event revision archive or permanent competing mutable world-state authority is introduced.
- **No silent cascading history rewrite:** Don't automatically rewrite, suspend, deactivate or reinterpret other existing events when a correction conflicts with structural dependencies; reject/report an invalid batch rather than inventing fixes. The user may edit the pending set. **Fictional contradictions** in preserved story prose do not automatically make an otherwise valid correction fail.
- **Separate from narrative pipeline:** The button applies to **manual world-state editing**. It is not a new additional approval stage for normal AI-generated turns or the previously accepted automatically finalised Quick Start opening, and it doesn't replace the four historical prose edit confirmations.

## Suggested UX — decision boundary

**Accepted:** A prominent bottom-area Commit control appears when noncanonical manual changes are pending; they are never committed automatically.

**Still under consideration:** Whether to temporarily disable **chat submission** (or the entire chat composer) while manual changes are pending, versus allowing continued composition with a persistent warning. The user floated blocking the chat box as a possibility, *not* as a final selection. No hard blocking requirement is approved yet.

**Unresolved implementation details:** Whether/how pending manual changes persist through reload/navigation, explicit Discard/Revert UX, keyboard shortcuts, how conflicts are displayed and resolved, multiple pending correction scopes, fine-grained event types, correction ordering around committed Undo, and manual event deletion/editor controls. Do not assume noncanonical pending manual changes inherit prose draft autosave behaviour without another decision.

## Alternatives and trade-offs

1. **Accepted — Option A plus explicit Commit:** Accumulate manual edits as noncanonical pending changes; only explicit Commit validates and atomically adds replayable correction outcome events. Benefit: faithful replay and player control over a batch of edits. Cost: pending/committed UI distinction and extra player confirmation.
2. **Original Option A without a pending gate — modified before approval:** Immediate canonical correction after each field change. Not accepted for manual state edits.
3. **Option B — not accepted:** Automatically cascade through existing current events, changing or disabling them to accommodate a correction. Undermines control and may change intended history.
4. **Option C — not accepted:** Directly mutate world-state projection without recording an outcome event. Loses the correction on Turn-0 replay.
5. **Provisional UI suggestion, not approved:** Blocking the chat composer while the pending set exists. Requires a separate explicit UX choice.

## Traceability

[B3 decision review](../Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md), [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), [B3-D05](./B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md), [B2-D03](./B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md), [IDEA-0044](../../staging/Deterministic%20Adventure%20Coordinator.md). Owners S04, S05, S06, S10, S11, S12.

## Decision history

- **2026-10-27 — Unaccepted first proposal:** B3-D06 Option A offered event-based validated corrections; Option B offered automatic dependent-history changes; Option C offered projection-only mutation.
- **2026-10-27 — User explanatory request:** Asked why corrections must be replayable and whether they can be attributed to a story turn. Assistant explained that manual changes need deterministic events and can have a position without inventing narrative turns; explicitly marked A not yet recorded.
- **2026-10-27 — Explicit user approval with refinement:** User approved **Option A** and added **stage deviations, then commit only when the player presses a bottom-area Commit button**. Chat-box blocking mentioned tentatively. All original approval context and new conditions preserved.
