---
id: ADR-0040
type: adr
status: accepted
related:
- ADR-0042
- ADR-0039
- ADR-0041
- ADR-0034
- ADR-0035
- ADR-0038
- ADR-0029
- PRD-0007
supersedes: []
---

# Narrative Only Unsupported Opening Facts

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B5-D08](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B5-D08%20-%20Narrative%20Only%20Unsupported%20Opening%20Facts.md) · approved at: 2026-10-28; approved by: requesting user (explicit chat approval)

## Later accepted narrative-first event semantics — 2026-10-28

**Current governing architecture:** [B6-D01](ADR-0042-narrative-first-declarative-outcome-events.md). Persistent world events primarily **remember the world as established by accepted narration and explicit player corrections**. They are **declarative, typed current-fact assertions** (Set/Clear, Create/Remove, keyed relation Add/Remove), not transfer/movement procedures whose fictional source state must be proven. Order and the latest supported assertion determine current projected holder, location, status and relationships. A historical edit may remove the introduction of an item or character without making later established facts invalid; sparse stable identity and unknown former details are permitted. Retain deterministic representability, technically valid types/IDs, one projected physical placement per item, transactional atomicity, version checks and required-core format failures. **No old story/event revisions**, no automatic AI repair, no extra manual Quick Start approval. This later choice supersedes broad simulation-style validation phrasing in original approval history below, without rescinding its unrelated accepted design.



## Approval and provenance

**Explicit acceptance on 2026-10-28:** “Review B5 Batch 3: B5-D07: A; B5-D08: A; B5-D09: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history, then assess B5 closure.”

The user selected **B5-D08 Option A** from [B5 Batch 3 proposals](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). D07 and D09 were separately accepted, and B5 closure remains unapproved.

## Context

The accepted [B5-D02](ADR-0034-grounded-initial-fact-extraction.md) source-grounded extractor recognises only explicit and supported facts from the player-provided premise and accepted Quick Start/Custom Opening text. A player's narration may legitimately include rich phenomena, moods or relationships that no enabled structured system can represent. Requiring every descriptive detail to have a database field would obstruct authored prose without enhancing deterministic world-state integrity.

## Accepted decision — Option A

**Allow unsupported or currently untracked details to remain accepted as narrative prose, while persisting structured state only for explicitly grounded, supported, structurally valid facts. Reject opening acceptance only for a genuine invalid supported operation or required structural conflict, not solely because descriptive content exceeds the enabled data schema.**

- **Supported facts:** When an enabled system can represent an explicitly stated character, relationship, item, location, or other supported fact, propose applicable typed outcome events/initial records and validate stable IDs and world-state invariants. Accept them atomically with the committed passage, under [B5-D03](ADR-0035-atomic-automatic-quick-start-opening.md) or [B5-D06](ADR-0038-explicit-commit-of-player-authored-custom-opening.md).
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

[B5 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [B5-D02](ADR-0034-grounded-initial-fact-extraction.md), [B5-D03](ADR-0035-atomic-automatic-quick-start-opening.md), [B5-D06](ADR-0038-explicit-commit-of-player-authored-custom-opening.md), [B4-D06](ADR-0029-preflight-structural-integrity-of-current-history-mutations.md), [IDEA-0006](../product/PRD-0007-quick-start-and-custom-story-openings.md). Owners S02/S03/S05/S06/S10/S11.

## Decision history

- **2026-10-28 — Original proposed B5-D08:** A preserve unsupported descriptive facts as prose (recommended); B reject unsupported prose; C invent substitute structured fields. All initially unapproved.
- **2026-10-28 — Explicit selection:** User accepted **B5-D08 A** together with separately approved B5-D07 A and B5-D09 A; no implementation or formal B5 closure granted.
