---
type: architecture-decision
status: accepted
decision_id: "B5-D08"
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

# B5-D08 — Preserve unsupported opening descriptions as narrative only

## Approval and provenance

**Explicit acceptance on 2026-10-28:** “Review B5 Batch 3: B5-D07: A; B5-D08: A; B5-D09: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history, then assess B5 closure.”

The user selected **B5-D08 Option A** from [B5 Batch 3 proposals](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). D07 and D09 were separately accepted, and B5 closure remains unapproved.

## Context

The accepted [B5-D02](./B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md) source-grounded extractor recognises only explicit and supported facts from the player-provided premise and accepted Quick Start/Custom Opening text. A player's narration may legitimately include rich phenomena, moods or relationships that no enabled structured system can represent. Requiring every descriptive detail to have a database field would obstruct authored prose without enhancing deterministic world-state integrity.

## Accepted decision — Option A

**Allow unsupported or currently untracked details to remain accepted as narrative prose, while persisting structured state only for explicitly grounded, supported, structurally valid facts. Reject opening acceptance only for a genuine invalid supported operation or required structural conflict, not solely because descriptive content exceeds the enabled data schema.**

- **Supported facts:** When an enabled system can represent an explicitly stated character, relationship, item, location, or other supported fact, propose applicable typed outcome events/initial records and validate stable IDs and world-state invariants. Accept them atomically with the committed passage, under [B5-D03](./B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md) or [B5-D06](./B5-D06%20-%20Explicit%20Commit%20of%20Player%20Authored%20Custom%20Opening.md).
- **Unsupported descriptive facts:** Keep them **in prose** without silently creating fake structured records or asserting that the world-state system tracks them. An unusual magical effect or evocative description does not by itself force a rejection, alternative invented fields or automatic AI repair.
- **Real conflicts still fail:** If a proposed **supported** structured change is invalid (such as a broken required entity reference or impossible current custody), the applicable deterministic validation/repair/rejection boundary still applies. This ADR does not authorise committing a structurally invalid event or treating unsupported core replay formats as harmless fiction.
- **Unknown versus canon:** Distinguish fictional descriptions, rumours and unknowns from established supported structured facts. Do not silently turn player ambiguity into canonical world-state assertions.
- **No model dependency:** This does not require a new validation AI pass or Go gameplay engine; the browser TypeScript S05/S06 coordinator and existing configured extraction path decide supported structured outcomes.
- **Current-only history:** Accept one structured current passage and only applicable current typed events. This is not a retained text revision archive or promise to reconstruct unsupported narrative details as executable game-state data.

## Alternatives considered

1. **A — accepted:** Unsupported narrative details remain prose; only genuine structured invalidity blocks the commit. Flexible fiction without invented state.
2. **B — rejected:** Reject any opening with content outside available structured schemas, needlessly limiting storytelling.
3. **C — rejected:** Invent fallback entities/fields to record every claim, contradicting strict extraction and authorial grounding.

## Deferred engineering details

The precise supported-type taxonomy, source span/provenance mapping, warning or informational UI, enabling/disabling modules, borderline implicit claims and validation error granularity remain later contracts. The rule does not imply implementation or acceptance of unsupported world systems.

## Traceability

[B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [B5-D02](./B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md), [B5-D03](./B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md), [B5-D06](./B5-D06%20-%20Explicit%20Commit%20of%20Player%20Authored%20Custom%20Opening.md), [B4-D06](./B4-D06%20-%20Preflight%20Structural%20Integrity%20of%20Current%20History%20Mutations.md), [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md). Owners S02/S03/S05/S06/S10/S11.

## Decision history

- **2026-10-28 — Original proposed B5-D08:** A preserve unsupported descriptive facts as prose (recommended); B reject unsupported prose; C invent substitute structured fields. All initially unapproved.
- **2026-10-28 — Explicit selection:** User accepted **B5-D08 A** together with separately approved B5-D07 A and B5-D09 A; no implementation or formal B5 closure granted.
