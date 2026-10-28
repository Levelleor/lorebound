---
type: architecture-decision
status: accepted
decision_id: "B4-D09"
phase: "B4"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
---

# B4-D09 — Shared latest pending draft without tab locks

## Explicit approval
On 2026-10-28 the user selected **B4-D09 Option A**, separately accepting D07 A and D08 B: “just a small clarification, we don't really care about another tab. ideally, we don't want it to break anything but ideally user shouldn't even be using more than one.”

## Accepted decision — Option A
The latest successfully saved noncanonical manual pending change set for the same adventure/editing context is kept as **one shared last-write-wins SQLite draft**. A later successful save from another tab can replace that draft; no separate draft revisions or recovery guarantee for replaced/unsaved draft values. On relevant restore/focus, read the most recently saved draft; any canonical Commit must still pass expected-adventure-version/library-epoch checks. A changed adventure is handled according to the **later accepted B4-D08 Option B** (discard an externally stale *uncommitted* manual draft after verifying that canon advanced); do not resurrect it from another tab.

The product assumes ordinary use through **one browser tab**. Multi-tab interactions are a resilience/safety edge case, not a feature deserving extra orchestration, tab-specific draft branches, active-tab selection UI, exclusive editing leases, automatic rebase or merge, or a promise that two unsaved editing sessions can be preserved simultaneously. An additional tab must not corrupt canonical history: the established atomic commits, stale-write checks and maintenance fences still hold.

This does not supersede the accepted full composer overlay, explicit player Commit requirement, idempotent response reconciliation, or persistent noncanonical draft storage.

## Alternatives and trade-offs
- **A — accepted:** Last successfully saved shared noncanonical draft; simple and consistent with existing latest-only prose draft semantics, but earlier overwritten drafts can be lost.
- **B — rejected:** Independent persistent manual pending batch per tab, adding synchronization/identity complexity.
- **C — rejected:** An exclusive per-adventure tab lease, conflicting with established no-exclusive-lock architecture.

## Decision history
- **2026-10-27:** B4 Batch 3 proposed A/B/C without approval.
- **2026-10-28:** User explicitly selected **D09 A**, and clarified single-tab-first UX with safety if multiple tabs are accidentally used. D08 B was separately approved; neither introduces a single-tab enforcement mechanism.
No implementation, staging promotion or B4 closure approval is implied.
