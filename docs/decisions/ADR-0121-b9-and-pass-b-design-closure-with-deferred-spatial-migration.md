---
id: ADR-0121
type: adr
status: accepted
related:
- ADR-0099
- NOTE-0003
- ADR-0082
- ADR-0093
supersedes: []
---

# B9 and Pass B Design Closure with Deferred Spatial Migration

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source P-B9-01](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/P-B9-01%20-%20B9%20and%20Pass%20B%20Design%20Closure%20with%20Deferred%20Spatial%20Migration.md) · approved at: 2026-11-01; approved by: requesting user (separate explicit post-assessment design closure)

## Distinct explicit authority

B9-D30 A approved a **design-only completeness assessment**, not closure. The completed [assessment](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B9%20-%20Design%20Completeness%20Assessment%20%28Not%20Closure%29.md) identified three open choices.

On 2026-11-01 the requesting user **separately** chose **B9-D12 defer**, **B9-D13 B**, **B9-D24 revised B**, and instructed **“Let's close b with these.”** This is a post-assessment explicit request to close the remaining B9 chapter and the overarching Pass B **at architecture-design level only**. Earlier B1–B8 each have separate accepted design-closure records. Historic choices and the review register remain preserved as dated approval evidence.

## Final disposition

- **[D13 B](ADR-0082-simple-coordinator-conflict-notice.md) accepted:** TypeScript coordinator makes best valid deterministic geographic reconciliation; if accepted facts cannot all be satisfied, keep them intact and give one minimal nonblocking general notice rather than a sophisticated editor, map marker or required player workflow.
- **[D24 revised B](ADR-0093-basic-map-pointer-interaction-without-keyboard-controls.md) accepted:** Simple pointer pan/zoom/hover/selection; **no map-specific keyboard interaction**. Unrelated chat controls remain unchanged.
- **D12 still deferred and NOT accepted:** The user's earlier exact note remains **“For d12 do nothing. We don't want to do migration yet for these.”** Do not start spatial event/schema migrations, create migrations/scripts/tests, select D12 A/B/C or imply that design closure authorised migration work.

## Closure boundaries

**Closed-design-only:** Accepted B9 design contracts and earlier B1–B8 architecture planning are now marked complete as reviewed choices, subject to the explicit deferred D12 future work. Design closure is not a declaration that any source code, UI, Wails v3 host, Go/SQLite integration, provider model, migrations, mock tests or end-to-end scenario works. No staging idea is promoted to production or specs. Existing B1 runtime feasibility/release verification gates persist independently.

The accepted domain and data boundaries remain TypeScript deterministic game/state coordination and typed prepared world events, Go as atomic technical persistence authority, current replayed canonical history, direct browser-provider calls, and minimal basic map UI. Previous user-approved later overrides (all pins movable by accepted layout, exact metre conversion and best-effort geographic fallback, minimal farthest-zoom pin separation, player-location-first map opening, and existing chat composer Commit/Discard) remain intact.

## Review and handoff

The [B9 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) retains all proposal alternatives and approval chronology, now with operative final closure note. The D30 assessment remains labelled assessment-only as historical evidence. **Pass B design is formally closed as of 2026-11-01**, and subsequent work may be separately planned under Pass C without implementation/promotion permission inferred from this record.
