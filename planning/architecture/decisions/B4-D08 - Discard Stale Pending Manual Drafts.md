---
type: architecture-decision
status: accepted
decision_id: "B4-D08"
phase: "B4"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
supersedes_in_part:
  - B3-D08
  - B3-D10
---

# B4-D08 — Discard stale pending manual drafts after external canonical change

## Explicit approval
On 2026-10-28 the user selected **B4-D08 Option B**, along with B4-D07 A and B4-D09 A, and clarified that ordinary use is expected to involve **one tab**, though accidental additional tabs should not cause breakage. This records the user's chosen **B**, not the proposed recommendation **A**. Earlier approvals remain in their original ADRs and [B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md).

## Accepted decision — Option B
If authoritative comparison confirms that **another tab or editing context has already advanced the same adventure's canonical version** beyond a pending manual draft's base, **automatically discard that obsolete pending noncanonical manual change set** instead of offering manual reapplication. The user explicitly accepts the loss of those uncommitted edits in this situation.

- Discard only after authoritative version/epoch confirmation; a cross-tab notification alone is not proof.
- Clear the stale pending draft and its composer blocker for that context, and refetch the current canonical adventure before permitting new input. A concise indication that uncommitted changes were discarded due to a newer adventure state is appropriate; exact notification UI is deferred.
- Do not apply or merge the abandoned edits, write correction events, advance adventure version, or modify the newer canon.
- Keep **B3-D05** expected-version and library-epoch rejection of stale canonical writes. No assumption of exclusive tab locks or perfect single-tab operation follows.
- **Distinguish failure categories:** this override applies to stale *uncommitted manual drafts following an externally confirmed canonical advance*, not to structural validation failure of a current-version pending proposal and not to a request with **uncertain durable Commit outcome**. If a prior Commit might have succeeded, first resolve its durable operation ID under B3-D02/B3-D10; never discard merely because a response was lost.
- The B3-D08 rule to persist otherwise current pending drafts across reload remains. The B3-D10 rule to retain rejected/invalid/uncertain proposals remains except where this later, explicit stale-draft policy overrides the *externally superseded and not-in-flight* case.
- Restore/library epoch changes are subject to server verification and maintenance safeguards; exact pending-draft disposal after whole-library restore is left to engineering refinement, not equated with any event in a separate tab.

## Options and trade-offs
- **A — not selected:** Keep stale pending drafts for manual review/reapplication; preserves draft work, more UI.
- **B — accepted:** Discard obsolete pending manual drafts after verified newer canonical state; simpler one-tab-oriented UX but loses those uncommitted edits.
- **C — rejected:** Automatically rebase/apply stale edits against newer canon, risking unintended outcomes.

## History and boundaries
- **2026-10-27:** B3-D08 and B3-D10 accepted pending persistence and preservation of stale/failed manual drafts.
- **2026-10-27:** B4-D08 proposed A (recommended), B (auto-discard after another tab's commit), C (auto-apply).
- **2026-10-28:** User explicitly selected **B**, superseding the earlier stale-draft-preservation rule within the narrow scenario above. User prefers one-tab usage but requires accidental multi-tab safety; no new prohibition or tab locking policy was approved.

No implementation, production promotion, or B4 closure is implied.
