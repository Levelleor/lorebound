---
type: architecture-decision
status: accepted
decision_id: "B4-D02"
phase: "B4"
created: "2026-10-27"
updated: "2026-10-28"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - current-canon
  - replay-contracts
  - architecture-decision
---

# B4-D02 — Undo and truncation boundaries for independent corrections

## Later accepted replay interpretation — 2026-10-28

Under [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), Undo and Delete All After Point still remove the **selected current timeline suffix** atomically, but **do not reject the surviving prefix** simply because a later assertion's former fictional setup or entity-introduction event disappeared. Replaying surviving assertions may construct a sparse ID and leave its origin or properties unknown. Only unprocessable/technically nonrepresentable data is fatal. No automatic downstream prose repairs.


## Approval and provenance

**Explicit approval, 2026-10-27:** “Review B4 Batch 1: B4-D01: A; B4-D02: A; B4-D03: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B4 review.”

This ADR records **B4-D02 Option A only** from [the B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md), not new implementation or revised gameplay rules.

## Context

Lorebound supports an explicit Commit for manual state changes that produce ordered outcome events but do not create fictional turns. B4-D01 places these within one current event sequence. Under B3-D04, ordinary committed Undo removes the latest **story turn** while Delete All After Point removes current history after a chosen earlier edit boundary. These operations must treat independent correction events consistently without a retained archive of alternate event histories.

## Accepted decision — Option A

**Explicitly locate independently committed manual correction events on the current story timeline, separately from their optional narrative provenance, and apply the selected Undo/truncation boundary atomically.**

- **Standalone correction between turns:** If the player commits a correction **after Turn 8 and before Turn 9**, then performs committed Undo of **Turn 9**, retain the earlier correction. Committed Undo targets a committed **story turn**, not automatically the most recent non-story commit.
- **Delete All After Point:** If the player edits Turn 8 and explicitly selects Delete All After Point, truncate the **subsequent active timeline** after that point. This includes later story turns and any independent correction events whose accepted timeline positions are **after the selected truncation boundary**, such as an intervening correction made after Turn 8. Preserve the edited passage's own previously accepted events unless separately changed, per accepted Keep/Delete semantics.
- **Keep Later Turns:** Confirming Keep after editing prose does not itself modify or delete existing current events, including independent corrections, even when the retained story fiction no longer justifies them.
- **Atomic change:** The selected story and applicable current events are removed/retained within the same expected-version/library-epoch-guarded Go/SQLite canonical operation. A stale/failed/maintenance-blocked operation makes no partial prose, event, ordering or state change.
- **Replay validity:** The resulting surviving current event sequence is replayed deterministically from Turn 0, with required structural consistency checks and the B2-D08 fail-closed rule for unsupported core event formats. Never silently invent corrections or call AI to repair deleted history.
- **Current-only history:** Deleted turns/events are removed from current canon, not parked in an inactive playable/audit revision selection. No new hidden Redo or per-adventure export/import.

## Alternatives considered

1. **A — accepted:** Timeline-positioned independent corrections; Undo of a later turn preserves earlier corrections; deliberate truncation removes all later events beyond its chosen boundary. Clear control, with boundary bookkeeping.
2. **B — not selected:** Undo always removes the most recent *commit*, whether a story turn or manual correction. This conflicts with previously accepted player-facing committed-turn Undo.
3. **C — not selected:** Always keep every independent correction through all Undo/Delete operations. Could strand item/entity changes without the surrounding source state.

## Open scope

The precise cut point for corrections associated with a **target turn itself**, edits at Turn 0, repeated Undo after state-only corrections, explicit UI descriptions/confirmations and handling a structural conflict in an intended surviving prefix require further contract refinement. These are not solved by silently changing event ancestry or inventing new state effects. No implementation/test approval.

## Traceability

[B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md), [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md), [B3-D03](./B3-D03%20-%20Atomic%20Historical%20Selection%20and%20Undo.md), [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), [B3-D06](./B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md); [IDEA-0004](../../staging/Retry%20Undo%20and%20Alternative%20Continuations.md), [IDEA-0041](../../staging/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md). Owners S03/S05/S06/S12.

## Decision history

- **2026-10-27 — Initially proposed:** B4-D02 A explicit boundary/attachment, B latest-commit Undo, C universal correction retention.
- **2026-10-27 — Explicit approval:** User selected **B4-D02: A**, separately from B4-D01 and D03. No hidden canonical Redo or implementation authorised.
