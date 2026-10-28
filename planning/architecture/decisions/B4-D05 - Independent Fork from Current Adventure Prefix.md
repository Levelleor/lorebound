---
type: architecture-decision
status: accepted
decision_id: "B4-D05"
phase: "B4"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - current-canon
  - replay-contracts
  - architecture-decision
---

# B4-D05 — Independent Fork from a committed current-adventure prefix

## Approval and provenance

**Explicit approval, 2026-10-27:** “Review B4 Batch 2: B4-D04: B; B4-D05: A; B4-D06: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B4 review.”

This ADR records **B4-D05 Option A** from the [B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md) independently from B4-D04's non-default B selection and D06's A selection.

## Context

Lorebound's [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) holds only the current passage bodies and ordered current events. [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md) includes independent manual corrections in that order, and [B4-D02](./B4-D02%20-%20Undo%20and%20Truncation%20Boundaries%20for%20Independent%20Corrections.md) gives them explicit story-timeline boundaries. A Fork must preserve deterministic reconstruction without retaining an alternative branch inside the source adventure.

## Accepted decision — Option A

**Fork creates a new, independently owned adventure containing the surviving current canonical story passage bodies and ordered events through the requested committed turn boundary.**

- An independent Fork copies current accepted story passages and exactly the current event sequence within the selected boundary, including applicable previously committed manual correction events. Do not copy later passages/events beyond the requested Fork boundary.
- The destination has its **own adventure identity**, coherent stable passages/event/entity reference mapping and complete replayable Turn-0 baseline. New work in either adventure cannot mutate or depend on mutable records in the other.
- The source adventure remains unchanged. The Fork is an intentional copy, not a new active branch/redo selector inside a single adventure or a hidden archived version.
- Go/SQLite creates the destination adventure atomically with storage/reference integrity and appropriate version/epoch and maintenance guards. Do not expose a partially copied destination after a failed copy. TypeScript remains responsible for gameplay/rule interpretation and replay as defined by the B1–B4 decisions.
- Ordinary noncanonical drafts, pending uncommitted manual corrections, unsent input or provisional generated variants are **not canonical events** and are not copied as accepted history.
- The copied current event payloads remain well-defined for the software's supported schema versions. Any required event schema upgrade obeys [B4-D04](./B4-D04%20-%20Coordinated%20Migration%20of%20Current%20Event%20Schemas.md); Fork does not invent its own silent interpretation or forced plugin migration.
- Fork at a committed story-turn boundary, not an arbitrary byte/paragraph offset. Precise attachment of manual corrections on the chosen boundary is a separately deferred refinement under B4-D02.

## Alternatives considered

1. **Option A — accepted:** Atomic independent copy of surviving current passage/event prefix with coherent IDs and replay. Higher copy/remap effort but protects future independence.
2. **Option B — rejected:** Live shared mutable passage/event records plus overlay differences. Risks coupling and hidden alternate-branch complexity.
3. **Option C — rejected:** Copy prose and world state only, dropping event history. Breaks complete Turn-0 deterministic reconstruction.

## Consequences and open details

Exact cross-table ID remapping, whether immutable identifiers can be safely reused with adventure scope, copy strategy for plugin-owned data, Turn-0 baseline cloning, request idempotency, and Fork origin metadata are deferred engineering concerns. No per-adventure import/export format, snapshot acceleration or code/test implementation is approved.

## Traceability

[B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md); [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md), [B4-D02](./B4-D02%20-%20Undo%20and%20Truncation%20Boundaries%20for%20Independent%20Corrections.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md). Owners S02, S05, S06, S12.

## Decision history

- **2026-10-27 — Unapproved proposals:** B4-D05 A independent current-prefix copy; B live shared records; C prose and snapshot only.
- **2026-10-27 — Explicit approval:** User chose **B4-D05: A**. B4-D04 B and B4-D06 A were independently accepted in the same reply; no future B4 option or implementation approval was implied.
