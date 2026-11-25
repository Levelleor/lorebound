---
id: ADR-0028
type: adr
status: accepted
related:
- ADR-0042
- ADR-0027
- ADR-0029
- ADR-0017
- ADR-0024
- ADR-0025
- ADR-0014
supersedes: []
---

# Independent Fork from Current Adventure Prefix

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B4-D05](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md) · approved at: 2026-10-27; approved by: requesting user (explicit chat approval)

## Later accepted narrative-first event semantics — 2026-10-28

**Current governing architecture:** [B6-D01](ADR-0042-narrative-first-declarative-outcome-events.md). Persistent world events primarily **remember the world as established by accepted narration and explicit player corrections**. They are **declarative, typed current-fact assertions** (Set/Clear, Create/Remove, keyed relation Add/Remove), not transfer/movement procedures whose fictional source state must be proven. Order and the latest supported assertion determine current projected holder, location, status and relationships. A historical edit may remove the introduction of an item or character without making later established facts invalid; sparse stable identity and unknown former details are permitted. Retain deterministic representability, technically valid types/IDs, one projected physical placement per item, transactional atomicity, version checks and required-core format failures. **No old story/event revisions**, no automatic AI repair, no extra manual Quick Start approval. This later choice supersedes broad simulation-style validation phrasing in original approval history below, without rescinding its unrelated accepted design.



## Approval and provenance

**Explicit approval, 2026-10-27:** “Review B4 Batch 2: B4-D04: B; B4-D05: A; B4-D06: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B4 review.”

This ADR records **B4-D05 Option A** from the [B4 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md) independently from B4-D04's non-default B selection and D06's A selection.

## Context

Lorebound's [B3-D04](ADR-0017-single-current-history-without-revisions.md) holds only the current passage bodies and ordered current events. [B4-D01](ADR-0024-total-ordering-of-current-outcome-events.md) includes independent manual corrections in that order, and [B4-D02](ADR-0025-undo-and-truncation-boundaries-for-independent-corrections.md) gives them explicit story-timeline boundaries. A Fork must preserve deterministic reconstruction without retaining an alternative branch inside the source adventure.

## Accepted decision — Option A

**Fork creates a new, independently owned adventure containing the surviving current canonical story passage bodies and ordered events through the requested committed turn boundary.**

- An independent Fork copies current accepted story passages and exactly the current event sequence within the selected boundary, including applicable previously committed manual correction events. Do not copy later passages/events beyond the requested Fork boundary.
- The destination has its **own adventure identity**, coherent stable passages/event/entity reference mapping and complete replayable Turn-0 baseline. New work in either adventure cannot mutate or depend on mutable records in the other.
- The source adventure remains unchanged. The Fork is an intentional copy, not a new active branch/redo selector inside a single adventure or a hidden archived version.
- Go/SQLite creates the destination adventure atomically with storage/reference integrity and appropriate version/epoch and maintenance guards. Do not expose a partially copied destination after a failed copy. TypeScript remains responsible for gameplay/rule interpretation and replay as defined by the B1–B4 decisions.
- Ordinary noncanonical drafts, pending uncommitted manual corrections, unsent input or provisional generated variants are **not canonical events** and are not copied as accepted history.
- The copied current event payloads remain well-defined for the software's supported schema versions. Any required event schema upgrade obeys [B4-D04](ADR-0027-coordinated-migration-of-current-event-schemas.md); Fork does not invent its own silent interpretation or forced plugin migration.
- Fork at a committed story-turn boundary, not an arbitrary byte/paragraph offset. Precise attachment of manual corrections on the chosen boundary is a separately deferred refinement under B4-D02.

## Alternatives considered

1. **Option A — accepted:** Atomic independent copy of surviving current passage/event prefix with coherent IDs and replay. Higher copy/remap effort but protects future independence.
2. **Option B — rejected:** Live shared mutable passage/event records plus overlay differences. Risks coupling and hidden alternate-branch complexity.
3. **Option C — rejected:** Copy prose and world state only, dropping event history. Breaks complete Turn-0 deterministic reconstruction.

## Consequences and open details

Exact cross-table ID remapping, whether immutable identifiers can be safely reused with adventure scope, copy strategy for plugin-owned data, Turn-0 baseline cloning, request idempotency, and Fork origin metadata are deferred engineering concerns. No per-adventure import/export format, snapshot acceleration or code/test implementation is approved.

## Traceability

[B4 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md); [B3-D04](ADR-0017-single-current-history-without-revisions.md), [B4-D01](ADR-0024-total-ordering-of-current-outcome-events.md), [B4-D02](ADR-0025-undo-and-truncation-boundaries-for-independent-corrections.md), [B3-D01](ADR-0014-prepared-atomic-canonical-commit-envelope.md). Owners S02, S05, S06, S12.

## Decision history

- **2026-10-27 — Unapproved proposals:** B4-D05 A independent current-prefix copy; B live shared records; C prose and snapshot only.
- **2026-10-27 — Explicit approval:** User chose **B4-D05: A**. B4-D04 B and B4-D06 A were independently accepted in the same reply; no future B4 option or implementation approval was implied.
