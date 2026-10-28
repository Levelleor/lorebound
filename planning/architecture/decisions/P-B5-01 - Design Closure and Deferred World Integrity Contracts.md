---
type: architecture-decision
status: accepted
decision_id: "P-B5-01"
phase: "B5"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - design-closure
---

# P-B5-01 — B5 design closure; starting world and first-turn contracts

## Approval and authority

**Explicit user approval on 2026-10-28.** After receiving the nine-of-nine B5 closure assessment and being asked, “Would you like me to close B5 at the design level and begin the next architecture pass, as we did for B2–B4?”, the requesting user answered **“yes.”**

**Decision:** Formally close **Pass B5 — Starting World and First Turn Contracts** at the **architecture design** level. This separately permits beginning the next architecture review, **not** acceptance of the next pass's proposals, implementation, integration verification, stage promotion or release.

## Approved B5 decisions

| ADR | Option | Current accepted decision |
| --- | --- | --- |
| [B5-D01](./B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md) | **A** | Atomically create a durable, valid minimal Turn-0 adventure baseline, which may be blank/characterless, before a story turn is needed. |
| [B5-D02](./B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md) | **A** | Extract only explicitly grounded, supported starting facts into validated structured proposals; do not invent unstated lore in ordinary extraction. |
| [B5-D03](./B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md) | **A** | Automatically atomically commit a fully validated Quick Start opening and its supported world events; no extra manual Approve gate. |
| [B5-D04](./B5-D04%20-%20Approved%20Optional%20AI%20Starting%20Lorebook.md) | **A** | Optional AI-authored pre-play Lorebook generation may invent worldbuilding but requires player Approve/Commit or Discard; no fake story turn. |
| [B5-D05](./B5-D05%20-%20Preserve%20Baseline%20on%20Setup%20Failure%20and%20Cancellation.md) | **A** | Failed/cancelled optional setup does not destroy the existing saved Turn-0 baseline or earlier accepted canon; no partial acceptance. |
| [B5-D06](./B5-D06%20-%20Explicit%20Commit%20of%20Player%20Authored%20Custom%20Opening.md) | **A** | Custom Opening prose remains a noncanonical draft until explicit approval; its supported grounded outcome events and passage commit atomically. |
| [B5-D07](./B5-D07%20-%20Persistent%20Pending%20Generated%20Starting%20Lorebook.md) | **A** | Complete review-ready pending generated-Lorebook proposals persist as noncanonical SQLite drafts across reload. |
| [B5-D08](./B5-D08%20-%20Narrative%20Only%20Unsupported%20Opening%20Facts.md) | **A** | Unrepresentable narrative details may remain prose-only; reject true invalid supported operations, not harmless descriptions. |
| [B5-D09](./B5-D09%20-%20Resume%20Blank%20Adventures%20Without%20Automatic%20Generation.md) | **A** | Saved zero-turn adventures resume normally without auto-generation, fake first turn or mandatory protagonist. |

**All nine decisions individually received explicit Option A approval.** Original A/B/C alternatives and the three dated batches remain recorded in the [B5 review register](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), with each ADR retaining its separate approval history.

## Binding inherited constraints

- **Current-only canon under B3-D04:** one current passage body per story passage and one current ordered outcome event sequence; do not resurrect obsolete revision/audit storage. Deterministic event reconstruction starts at Turn 0.
- **Atomicity under B3-D01/D02 and concurrency contracts:** Go/SQLite persistence accepts prepared coherent changes all-or-nothing using adventure version, library epoch and maintenance fencing, with idempotent operation identity/receipts. TypeScript S05/S06 owns gameplay validation; no duplicate Go rules engine.
- **Pending-commit UX under B3-D07:** full chat composer is overlaid by a translucent uncommitted-changes panel until the player approves/discards any workflow's explicit pending commit. This applies to Custom Opening and optional starting Lorebook proposals, but not to already automatically committed Quick Start openings.
- **Grounded extraction vs intentional authoring:** prose extraction does not invent; the explicitly requested optional starting Lorebook is a separate permission to generate new worldbuilding.
- **Stale drafts and uncertain outcomes:** B4-D08 permits discarding verified externally obsolete *manual world-state* pending drafts; it does not silently extend that rule to generated-Lorebook or Custom Opening drafts. A lost response to a possibly committed operation must be resolved using its existing operation identity.

## Deferred work, not closure blockers

- Detailed schemas and durable transaction shapes for Turn-0 baseline and optional starting entities, template instantiation, linking and provenance; strict grounded extraction fixtures; authorial conflict and unknown-fact presentation.
- Preview and draft lifecycle for generated Lorebooks, failure and cancellation races, request budgets, revalidation on approval, stale proposed setup handling and pending overlay accessibility.
- Unverified real Wails/Go, SQLite, provider, optional plugin, epoch, backup/restore and end-to-end tests. No implementation or correctness evidence is claimed by this record.
- Staging source notes and older B2 architecture still contain some revision/audit terms superseded by B3-D04. Preserve original approval history and reconcile through a **separately explicitly authorised planning stage**, not an implied promotion.
- Optional AI-assisted downstream historical story repair remains unaccepted and is not introduced by design closure.

## Closure disposition

**Accepted:** Close the B5 design decision set now and carry engineering details forward. **Not accepted:** treating this closure as runtime verification, production queue promotion, or blanket approval for B6 proposals.

## Decision history

- **2026-10-28 — B5 Batch 1 approval:** B5-D01–D03 Option A/A/A accepted and recorded separately.
- **2026-10-28 — B5 Batch 2 approval:** B5-D04–D06 Option A/A/A accepted and recorded separately.
- **2026-10-28 — B5 Batch 3 approval/assessment:** B5-D07–D09 Option A/A/A accepted; the user requested only a closure **assessment**. B5 remained open until separate sign-off.
- **2026-10-28 — Formal approval:** User answered **“yes”** to explicitly closing B5 at design level and opening the next architecture pass. This P-B5-01 is that distinct closure record. No implementation or promotion approved.
