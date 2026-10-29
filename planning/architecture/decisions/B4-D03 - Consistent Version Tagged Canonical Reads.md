---
type: architecture-decision
status: accepted
decision_id: "B4-D03"
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

# B4-D03 — Consistent version-tagged current-canon reads

## Later accepted narrative-first event semantics — 2026-10-28

**Current governing architecture:** [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). Persistent world events primarily **remember the world as established by accepted narration and explicit player corrections**. They are **declarative, typed current-fact assertions** (Set/Clear, Create/Remove, keyed relation Add/Remove), not transfer/movement procedures whose fictional source state must be proven. Order and the latest supported assertion determine current projected holder, location, status and relationships. A historical edit may remove the introduction of an item or character without making later established facts invalid; sparse stable identity and unknown former details are permitted. Retain deterministic representability, technically valid types/IDs, one projected physical placement per item, transactional atomicity, version checks and required-core format failures. **No old story/event revisions**, no automatic AI repair, no extra manual Quick Start approval. This later choice supersedes broad simulation-style validation phrasing in original approval history below, without rescinding its unrelated accepted design.



## Approval and provenance

**Explicit approval, 2026-10-27:** “Review B4 Batch 1: B4-D01: A; B4-D02: A; B4-D03: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B4 review.”

This ADR records **B4-D03 Option A only**. It does not grant blanket acceptance of new B4 decisions, APIs, SQL schemas or implementation.

## Context

Separate browser tabs may read or commit while another tab has already changed an adventure. B3-D04 provides one current story and current ordered events without prior passage/event versions. B1-D04 requires cross-tab notifications to be invalidation hints, while B2-D03 places authoritative world-state replay in browser TypeScript. If prose from version N is rendered alongside events from N+1, the browser can display a world that never constituted a single accepted canon.

## Accepted decision — Option A

**Read current narrative passage bodies and their current ordered outcome events from one consistent, adventure-scoped SQLite snapshot/read transaction, with matching authoritative adventure version and library epoch.**

- Go/SQLite provides a **coherent current canonical view** of passages and events for the same adventure/version/epoch; do not expose a mismatched mixture of separate database states when reads race a commit or maintenance transition.
- The browser tags derived gameplay world-state projections with the **same adventure version and library epoch** as the underlying consistent read. Only reuse an already computed in-memory projection when its version/epoch matches the displayed canonical data.
- After a successful canonical commit, relevant cache invalidation, missed/received cross-tab notification, restore or directory/epoch change, perform the necessary authoritative refetch/replay or safe incremental update under B2-D03. Notifications are **hints to refetch**, not updates to the authoritative state.
- A stale/read-inconsistent cached projection must not be used as a premise for a canonical commit. Go's expected-version, epoch and maintenance guards remain mandatory for every accepted write even when a client believes its cache is fresh.
- Full deterministic Turn-0 replay remains browser-side TypeScript, with no persisted checkpoint, competing authoritative materialised world-state record or Go gameplay reducer. The removed-plugin exception and B2-D08 required-core fail-closed handling remain.
- The view is based on **one current version**, not a historic revision archive. Snapshot consistency is a transaction isolation mechanism for the read, **not** permission to persist version-by-version world-state snapshots.

## Alternatives considered

1. **A — accepted:** One coherent version-tagged Go read with matching browser projection. Read-snapshot plumbing and refetch work; strong cross-tab consistency.
2. **B — not selected:** Uncoordinated independent prose/event reads with eventual notifications. Can produce inconsistent combined displays.
3. **C — not selected:** Go-maintained authoritative mutable world-state projection for every tab. Adds a competing game-state authority and duplicates browser TypeScript reducers.

## Open engineering details

Specific service methods, streaming/pagination and consistency tokens, SQLite transaction isolation, transient connectivity failures, rendering caches, replay performance fixtures, and accessible error UI are implementation refinements. No Wails/Go integration tests or stage promotion are claimed.

## Traceability

[B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md), [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), [B1-D04](./B1-D04%20-%20Cross-Tab%20Invalidation%20and%20Refetch.md), [B2-D03](./B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md), [B3-D05](./B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md). Owners S01/S04/S05/S06/S12.

## Decision history

- **2026-10-27 — Original proposed options:** A consistent version-tagged snapshot, B uncoordinated independent reads, C Go authoritative state projection.
- **2026-10-27 — Explicit acceptance:** User selected **B4-D03: A**, alongside independent D01 and D02 approvals. No implementation or future B4 approvals implied.
