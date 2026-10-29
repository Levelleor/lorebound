---
type: architecture-decision
status: accepted
decision_id: "B5-D01"
phase: "B5"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - initialization
  - architecture-decision
---

# B5-D01 — Durable minimal Turn-0 baseline

## Later accepted narrative-first event semantics — 2026-10-28

**Current governing architecture:** [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md). Persistent world events primarily **remember the world as established by accepted narration and explicit player corrections**. They are **declarative, typed current-fact assertions** (Set/Clear, Create/Remove, keyed relation Add/Remove), not transfer/movement procedures whose fictional source state must be proven. Order and the latest supported assertion determine current projected holder, location, status and relationships. A historical edit may remove the introduction of an item or character without making later established facts invalid; sparse stable identity and unknown former details are permitted. Retain deterministic representability, technically valid types/IDs, one projected physical placement per item, transactional atomicity, version checks and required-core format failures. **No old story/event revisions**, no automatic AI repair, no extra manual Quick Start approval. This later choice supersedes broad simulation-style validation phrasing in original approval history below, without rescinding its unrelated accepted design.



## Approval and provenance

**Explicit approval on 2026-10-28:** “Review B5 Batch 1: B5-D01: A; B5-D02: A; B5-D03: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B5 review.”

This accepts **B5-D01 Option A**, as originally proposed in [Pass B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). D02 and D03 are separately accepted and documented. It is a design decision, not a claim of an implemented database or tested initialization.

## Context

The approved current-only history model [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) requires deterministic reconstruction of accepted world outcomes from the Turn-0 baseline. [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md) already accepts blank, unnamed, characterless adventures and optional Quick Start/Custom Opening/Guided Setup, without compulsory generated scenes. [IDEA-0066](../../staging/AI-Generated%20Starting%20Lorebook%20and%20World.md) independently allows explicitly requested optional starting Lorebook generation.

## Accepted decision — Option A

**Create the adventure's independent identity and a durable, minimal, valid Turn-0 baseline in one atomic Go/SQLite initialization operation, before any played story turn is required.**

- A **blank world and blank story are valid**. Do not require a protagonist, character sheets, initial inventory, location, AI request, title entry, preset or fictional opening. The accepted default display title remains `Untitled Adventure` when no name is supplied; the stable adventure ID is separate from its display title.
- Include only explicitly chosen starting defaults, player-provided or template-derived supported facts, and applicable initial entities/relationships that pass deterministic schema, identity, reference and world-state constraints. B5-D02 specifies strict extraction boundaries for prose-derived facts. Do not silently invent content to fill empty world fields.
- Go/SQLite persists the adventure record, initial baseline and mutually dependent initial records **together or not at all**, under the existing shared-library identity and maintenance/write integrity boundary. A failure must not expose a partially initialized playable adventure or unrelated adventure changes.
- The Turn-0 baseline is **canonical starting state**, not a fictional past story passage, fabricated first turn, replay checkpoint, retained text revision or old-version audit archive. Subsequent turns/events belong to the current canonical event sequence and remain replayable from that baseline.
- The baseline persists independently of any later AI-generated opening. Failed, cancelled or abandoned generation does not require deleting a successfully created baseline or fabricating an opening to make it valid; exact cleanup UX is separate.
- The optional, separately accepted feature of deliberately generating a larger Turn-0 Lorebook remains available for later B5 refinement. This D01 choice does not require world generation, decide its approval mechanics or authorise silently enriching the baseline after initialization.
- TypeScript retains deterministic domain/gameplay validation. Go enforces narrow durable integrity, not a second gameplay/AI engine.

## Alternatives considered

1. **A — accepted:** Durable minimal validated Turn-0 baseline before narrative turn. More explicit initialization boundary, clearer recovery and replay.
2. **B — rejected:** Wait until successful first AI turn to create baseline. May leave incomplete/abandoned setup without independent durable identity.
3. **C — rejected:** Always require AI to populate a complete initial world. Conflicts with accepted optional, blank starting paths and introduces unwarranted invention/cost.

## Deferred details

Precise Turn-0 schema, initial entity/event format, template placeholder handling, assignment of starting world facts to baseline, multi-stage optional setup, initialization request idempotency, editing an existing baseline, failure messages and testing remain engineering or separate later design choices. No staging-to-production promotion or implementation is implied.

## Traceability

[B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md); [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md); [B2-D03](./B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md); [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md). Owners S02/S05/S06/S10/S11/S12.

## Decision history

- **2026-10-28 — Proposed, unapproved:** B5-D01 A durable minimal atomic baseline; B delay until successful first turn; C compulsory AI-populated world.
- **2026-10-28 — Explicit approval:** User selected **B5-D01: A**, independently of the separate D02 and D03 A approvals. No later B5 option or software implementation was accepted.
