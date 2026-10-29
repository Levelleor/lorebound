---
type: architecture-decision
status: accepted
decision_id: "B2-D04"
created: "2026-10-26"
updated: "2026-10-28"
approved_at: "2026-10-26"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
  - architecture-decision
---

# B2-D04 — Historical edit event preservation and structural integrity

## Subsequent accepted architectural supersession — 2026-10-28

**CURRENT AUTHORITY:** [B6-D01 — Narrative-first declarative outcome events](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), together with [B3-D04 — Single current history](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), supersedes earlier simulation-style event preconditions and prior immutable passage/event audit assumptions in this ADR. The engine primarily **tracks the fictional facts established by accepted narration and player corrections**. Events are ordered typed **Create/Remove, Set/Clear and keyed relation Add/Remove assertions**, not procedural transfers or movement operations that must prove historic source possession, prior introduction, prior route or fictional causality. A later accepted reference may construct a **sparse stable identity** when its old introduction has been removed; unspecified fields remain unknown. Preserve technical typed/supported-format, deterministic folding, version/epoch, atomic transaction and one-current-property safety. Only a **technically unprocessable** event fails closed; narrative contradiction does not. The original earlier approval and alternatives below are **historical provenance**, not permission to reinstate rejected prerequisites or old revision archives. Actual implementation remains unapproved.



## Approval and provenance

**Accepted by the requesting user on 2026-10-26**: “For D04 lets go with A,” selecting the recommended option from the second Pass B2 decision batch. The user also approved B2-D06 option A and confirmed that B2-D05 was **already accepted separately** as [Canonical Structured Passage Documents](./B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md). This ADR records **D04 only**, without modifying B2-D05 or treating B2-D03 as approved.

This is an accepted architecture rule, not proof of code, implementation approval or a staging-to-production promotion.

## Context and clarification

**Original approval (2026-10-26):** D04 Option A was originally recorded as retaining later historical audit events while suspending state effects that could not be represented after an earlier edit. The example assumed that replacing Turn 8's prose automatically deactivated an item-creation event attributed to its former revision. The requesting user subsequently clarified that this assumption was **incorrect** for the accepted **Keep Later Turns** action.

**User-approved clarification (2026-10-26):** Existing canonical events are *not* invalidated merely because their source passage's prose is rewritten. The user explicitly agreed to replacing the ordinary suspension/reinstatement concept with preservation under Keep and deletion from active canon under Delete All After Point. See the dated decision history below. This revised clarification supersedes the initial D04 suspension *workflow*, without erasing the fact that it was previously approved.

## Current accepted decision

**For confirmed historical prose edits, keep existing accepted event outcomes unless the selected action explicitly removes history or the player performs a separate canonical state-edit operation.**

- **Keep Later Turns:** Commit the new structured passage revision but **retain that passage's already accepted linked outcome events** and the later retained passages **and their existing accepted events**. A new revision of passage text does not automatically revoke, reinterpret, rerun or reattribute older accepted outcome events. Preserve immutable provenance linking each event to the **actual original passage revision** from which it was accepted, even when the current displayed revision says something else.
- **Intentional fictional contradictions are allowed.** If the new Turn 8 prose says Mara did not pick up a key, but the older accepted Turn 8 event created it, that event **remains selected and applies**. The player chose to retain the pre-existing state history. Do not infer a missing key or invent any repair.
- **Delete All After Point:** Confirm the edited passage, retain its existing event outcomes **unless the player explicitly changes them**, and remove **all subsequent passages and their associated events** from the **active selected history**. They have **no subsequent active gameplay effect**. Previously committed immutable records may remain internally for audit and provenance, consistent with B2-D01 and B2-D02; this is not a selectable alternate-story feature.
- **Explicit world-state or event edits/removal** are distinct from editing prose. Validated intentional state changes use a separate accepted outcome/history change and must respect identities, referential integrity, event dependencies, unique custody and Go's atomic expected-version/epoch checks. If an explicitly requested removal creates an unresolved structural conflict with still-active events, **reject/report that incompatible transaction** rather than silently deleting unrelated retained events, fabricating replacements or automatically suspending/reinstating gameplay effects. Exact user resolution controls belong to later B2/B3 contract design.
- **Continue Editing/Discard:** Canonical active selection/events remain unchanged.
- **Replay:** B2-D03 recomputes authoritative world state from the Turn-0 baseline and the selected accepted events as needed. Replay means applying recorded outcomes, **not** asking AI to reevaluate fictional logic. Do not add AI continuity checks, new event extraction from edited prose, or a new model-based repair pass in these existing actions.
- **No ordinary suspension/reinstatement system:** The previous D04 suspended-effect mechanism and proposed B2-D07 reinstatement decision are **superseded for this history-editing workflow**. Preserve correct technical failure reporting for genuinely invalid direct state operations; this is not permission to publish an invalid world state.
- **Potential future downstream reinterpretation** was separately captured as an **unaccepted Inbox candidate** [IDEA-0067](../../inbox/AI-Assisted%20Downstream%20Story%20Re-Evaluation%20After%20Historical%20Edits.md). Neither automatic reevaluation nor a new third historical-editing action is approved.

## Alternatives and consequences

1. **Accepted current clarification:** Retain all existing accepted event outcomes under Keep; remove future passages/events from the *active* selection under Delete All After Point; report conflicts from separately requested structural changes.
2. **Previously accepted, now superseded original D04 Option A:** General suspended-effect status and subsequent reinstatement logic based on an incorrect assumption that rewritten prose revokes its original associated events.
3. **Not approved:** Automatic semantic reevaluation or regeneration of all subsequent passages, background repair, inferred inventory correction, wholesale physical destruction of immutable audit history, or a full branch/redo menu.

This reduces state/status complexity and stays within accepted Story authorial freedom. **Open engineering details** include explicit event/state-edit UX and atomic dependency checks, passage-to-event membership encoding, truncation boundaries and recovery from accidental Delete All After Point. No implementation, new feature-stage acceptance or promotion is claimed.

## Traceability

Related owners S03, S05, S06, S10, S11, S12. Sources: [IDEA-0039](../../staging/Event-Sourced%20World%20History.md), [IDEA-0041](../../staging/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md), [IDEA-0042](../../staging/Snapshots%20and%20Incremental%20State%20Rebuild.md), [B2-D01](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md), [B2-D02](./B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md), [B2-D05](./B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md), Pass A A-06 and A-10.


### Historical validity narrowed

Earlier text about suspending later events due to deleted introductions is **superseded**. Keep Later Turns retains later typed assertions even without prior fictional causes; the current-only model has no suspended-event revision archive. The player can correct current facts with a separate pending manual Commit; no AI cascading story repair.

## Decision history

- **2026-10-25:** D04 proposed for review: choose an integrity-preserving deterministic fallback for technically unrepresentable retained later events, not fictional continuity disagreements.
- **2026-10-26:** User explicitly approved **D04 Option A**. No additional AI repairs, stage promotion or implementation were approved.

- **2026-10-26 — Explicit subsequent user clarification (supersedes original D04 suspension workflow):** User clarified that **Keep Later Turns keeps all existing events, including those attached to the newly rewritten passage**, even if the passage now fictionally contradicts them. User agreed the simpler policy: **Delete All After Point removes all future passage/events from active canon; otherwise Keep leaves recorded events as-is**, with structural failures from separately requested event deletions rejected rather than silently repaired. Optional downstream reevaluation was requested as an **unaccepted** idea, not adopted now. See [IDEA-0067](../../inbox/AI-Assisted%20Downstream%20Story%20Re-Evaluation%20After%20Historical%20Edits.md). The former D04 suspension example is superseded and B2-D07 is unnecessary for this workflow.
