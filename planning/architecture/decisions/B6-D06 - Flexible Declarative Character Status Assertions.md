---
type: architecture-decision
status: accepted
decision_id: "B6-D06"
phase: "B6"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
  - architecture-decision
---

# B6-D06 — Flexible declarative character status and custom sheet fields

## Approval and provenance

**Explicit user acceptance, 2026-10-31:** “Review B6 Batch 2: B6-D05: A; B6-D06: A; B6-D07: A. Notes: for d05. we'll remove the bracelet assignment only if we implement that feature where we have the anatomy where hands or arms are real. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B6 review.”

This ADR records **B6-D06 Option A alone** from the [B6 Batch 2 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md). The user's anatomy qualification applies to D05, **not** a requirement to implement anatomy in order to track ordinary character status.

## Accepted decision — Option A

**Represent supported user-defined character-sheet and status facts as typed, replayable `Set/Clear` assertions on a stable character identity. The latest grounded accepted assertion for each field determines its current recorded value.**

- **Flexible rather than RPG-specific:** Fields can describe injury, condition, mood, goals, temporary states, identity details, numeric stats and custom text, where a chosen supported schema can represent them. No mandatory health/mana attributes, default character stats, predefined numerical ranges or mechanically legal stat transitions are imposed merely to track fiction.
- **Source-grounded:** Derive an asserted value from accepted prose or explicit committed player correction, not a guessed emotion, medical condition, invented stat or unconfirmed attempt. Unsupported descriptive detail may remain prose without blocking story commitment ([B5-D08](./B5-D08%20-%20Narrative%20Only%20Unsupported%20Opening%20Facts.md)).
- **Deterministic latest-value view:** Store supported field identity/type and value with the relevant stable character ID. Later `Set` overrides earlier value of that current field; `Clear` records the approved removal/unset result. **Missing/unknown/unrecorded**, explicitly `0`, `false`, empty text and known `none` are distinct where types support them. Do not fill empty fields with invented defaults.
- **Narrator-safe references:** The narrator sees human-readable field names and established values, not internal IDs; engine-owned identity mapping/replay is internal under [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md). Ambiguous references do not force guessed updates.
- **Player control and durability:** Manual sheet edits form a noncanonical pending change set until explicit Approve/Commit or Discard using the full chat-composer overlay. Accepted typed assertions commit under existing Go/SQLite atomic, idempotent, expected-version/library-epoch rules. A status displayed on a character sheet is a derived **current projection**, not an independent competing canonical snapshot.
- **No causal replay gate:** Do not require a stored earlier action, prior injury, spell cast or simulation mechanism to justify a status that the accepted story now establishes. Typed/technical event errors still fail safely.

## Alternatives considered

1. **Option A — accepted:** Supported named/typed fields as last-accepted Set/Clear current assertions, sparse/optional and editable. Requires a flexible schema but provides useful story memory.
2. **Option B — rejected:** Force fixed numerical RPG attributes and mechanics-valid transitions. Misaligned with narration-first purpose.
3. **Option C — rejected:** Unstructured prose only with no current typed field tracking. Limits useful status-sheet context and editing.

## Deferred implementation details

Exact field type registry, allowed custom names, nested/collection fields, changes to a field's type, source/provenance spans, the UI for unknown values and module-owned fields require later design. This acceptance does not make every arbitrary sentence an event, add a Go gameplay engine or prove tests passed.

## Traceability

[B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md), [IDEA-0027](../../production/Customisable%20Character%20Status%20Sheets.md), [IDEA-0064](../../production/Automatic%20Character%20Sheet%20Tracking.md). Owners S04/S05/S06/S10/S12.

## Decision history

- **2026-10-28:** B6-D01 approved narrative-first declarative world-state assertions, supplanting simulated prerequisites.
- **2026-10-30:** B6-D06 proposed A (typed current Set/Clear fields, recommended), B (fixed RPG stats), C (prose only), all unapproved at presentation.
- **2026-10-31:** User expressly accepted **B6-D06 A**, alongside D05 A (qualified by implemented anatomy) and D07 A. No other B6 decisions, implementation, stage promotion or closure authorised.
