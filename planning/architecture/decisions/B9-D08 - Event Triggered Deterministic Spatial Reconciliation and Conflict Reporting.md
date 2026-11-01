---
type: architecture-decision
status: accepted
decision_id: "B9-D08"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 3 option selection)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - spatial-reconciliation
---

# B9-D08 — Event-triggered deterministic spatial reconciliation with nonblocking conflicts

## Approval and relation to the other decisions

**Explicit user approval, 2026-10-31:** “Review B9 Batch 3: B9-D07: B; B9-D08: A; B9-D09: A. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

**ACCEPTED: Option A.** Maintain deterministic, canonical geography while reconciling **only in response to an accepted relevant location/spatial-world change**, not on every render. Every pin may move under [B9-D04 Option C](./B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md), including positions manually committed earlier.

## Accepted design

1. **Trigger on accepted changes only:** A grounded accepted world/location or spatial constraint change may trigger deterministic frame-scoped layout/reconciliation. Pan, zoom, browser refresh, tab reopening and renderer repaints do not themselves generate new canonical positions.
2. **Can relocate every location:** No author label or persistent pinned/protected status is needed. A previously committed manual coordinate is **not an automatic solver lock**. Reconciliation can update any affected location, using the current accepted constraints and the numeric metre conversion selected by [B9-D07 B](./B9-D07%20-%20Automatic%20Numeric%20Metre%20Conversion%20of%20Qualitative%20Geography.md).
3. **Atomic, replayable change set:** TypeScript prepares supported typed local-frame numeric coordinate updates and relevant event references. Go commits them as an accepted version/epoch/idempotency-fenced atomic transaction. On technical rejection there is no partially updated map. Changing map geometry does not silently alter containment, characters, route identities, travel time or story prose.
4. **Unsatisfiable facts:** If current explicit grounded spatial constraints genuinely conflict, preserve those accepted story/world facts and **surface a nonblocking layout conflict** rather than rejecting narrative canon or arbitrarily changing the facts. **B9-D07 B explicitly authorises exact numeric conversion of qualitative geography**, but this D08 option does **not** authorise inventing additional ad hoc conflict-resolving distances beyond that conversion policy. A conflict representation/reporting mechanism is an engineering follow-up, not approved UI copy.
5. **Current-only history:** Supported spatial corrections obey event order, deterministic replay, Undo/Fork/current-history edits and schema migration. Previous immutable revision archives or independent mutable pixel-layout stores are not introduced. Generated layout changes require a genuine accepted durable update, not ephemeral view caching.
6. **Manual edits are different:** Direct user drag/resize remains a noncanonical pending correction until explicit Commit/Discard under B8-D03. The later automatic adjustment may move a saved manual coordinate after its Commit; it does not abolish the manual approval gate.

## Alternatives retained

- **A — ACCEPTED:** Reconcile only on relevant accepted changes, commit atomically, allow moving all pins, preserve inconsistent accepted facts and report nonblocking conflicts.
- **B — not selected:** Recalculate and rewrite canonical positions on every redraw/reload/zoom.
- **C — not selected:** Reject accepted narration/world facts when they cannot satisfy a layout solver.

## Deferred details and approval history

Future choices include exact relevant-change triggers, input constraints, solver scope, placement conflict UI, priority for impossible metre constraints, multi-tab concurrency and mocked error/Undo fixtures. No executable algorithm, test result, UI design or formal B9 closure approved.

- **2026-10-31:** B8 initially approved generated-only reconciliation and deliberate-pin immunity; B9-D04 C later removed that immunity.
- **2026-10-31:** B9-D07 B later deliberately selected exact metres from qualitative geography.
- **2026-10-31 — explicit selection:** User approved **B9-D08 A**, not B/C, alongside D07 B and D09 A.
