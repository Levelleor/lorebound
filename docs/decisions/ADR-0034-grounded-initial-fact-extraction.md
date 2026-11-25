---
id: ADR-0034
type: adr
status: accepted
related:
- ADR-0042
- ADR-0033
- ADR-0035
- PRD-0007
- PRD-0067
supersedes: []
---

# Grounded Initial Fact Extraction

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B5-D02](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md) · approved at: 2026-10-28; approved by: requesting user (explicit chat approval)

## Later accepted narrative-first event semantics — 2026-10-28

**Current governing architecture:** [B6-D01](ADR-0042-narrative-first-declarative-outcome-events.md). Persistent world events primarily **remember the world as established by accepted narration and explicit player corrections**. They are **declarative, typed current-fact assertions** (Set/Clear, Create/Remove, keyed relation Add/Remove), not transfer/movement procedures whose fictional source state must be proven. Order and the latest supported assertion determine current projected holder, location, status and relationships. A historical edit may remove the introduction of an item or character without making later established facts invalid; sparse stable identity and unknown former details are permitted. Retain deterministic representability, technically valid types/IDs, one projected physical placement per item, transactional atomicity, version checks and required-core format failures. **No old story/event revisions**, no automatic AI repair, no extra manual Quick Start approval. This later choice supersedes broad simulation-style validation phrasing in original approval history below, without rescinding its unrelated accepted design.



## Approval and provenance

**Explicit approval, 2026-10-28:** “Review B5 Batch 1: B5-D01: A; B5-D02: A; B5-D03: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B5 review.”

This accepts **B5-D02 Option A** from [Pass B5 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). D01 and D03 have their own ADRs. Source [IDEA-0006](../product/PRD-0007-quick-start-and-custom-story-openings.md) already accepts explicitly grounded fact extraction from Quick Start **and** Custom Opening committed narrative; this decision refines setup-premise handling without adding AI-authoring rights to that extractor.

## Context

A player may describe an initial premise, authored opening or explicit setup. Lorebound needs useful structured initial state without silently treating model embellishment as settled fact. World identities, inventory, location and relationships are canonical only when grounded in committed evidence or deliberate authoring and valid under enabled systems.

## Accepted decision — Option A

**Propose structured starting facts only when clearly supported by the supplied player premise/setup or committed opening text and representable by enabled subsystems; validate before accepting them as current canon.**

- The **extractor is a source interpreter, not a creative world generator**. It may recognize explicitly established characters, possessions, locations, relationships and other supported statements but **must not invent** unstated motivations, backstories, identities, item ownership, statistics, routes, hidden facts or scene details merely because they would be plausible.
- The player may provide premises, optional guided inputs or Custom Opening prose. Unsubmitted text or editable drafts remain **noncanonical**; extracted facts initially are **proposals**, not accepted world state.
- AI-generated **Quick Start opening text** can itself establish explicit new narrative facts. Extract only the supported facts actually **stated in that fully accepted opening**, and accept their resulting events in the **same atomic first-turn transaction** under B5-D03. Do **not** preemptively commit unvalidated fictional elaborations merely because the initial premise was short.
- The player-authored **Custom Opening** likewise records supported facts grounded in its accepted passage when that passage is deliberately committed, not while freely editing or previewing prose.
- Preserve distinctions among established facts, rumours, uncertain names, speculative claims and **unknown/unset** fields. Avoid duplicate entity creation and respect stable entity identities and enabled module boundaries. If a fact cannot be represented/validated, explain or use the existing validated proposal rejection/repair path; never fabricate extra supporting entities or claim acceptance of an unvalidated value.
- Deterministic TypeScript coordinator/domain validation decides validity within the already accepted generation and state-interpretation workflow; Go/SQLite atomically persists the resulting accepted initial facts or events under B5-D01/B5-D03 and B3 transaction guards.
- **Separate intentional world-authoring exception:** [IDEA-0066](../product/PRD-0067-ai-generated-starting-lorebook-and-world.md) expressly allows the user to request AI creation of *new* initial worldbuilding beyond cited prose. That is a **different, optional workflow**, not implicit permission for the fact extractor to invent.
- No new universal manual Approve step is imposed on a successfully validated Quick Start opening; B5-D03's existing auto-commit behaviour remains intact.

## Alternatives considered

1. **A — accepted:** Strict, grounded, supported starting facts with deterministic validation; unknowns remain unknown and invalid changes fail visibly.
2. **B — rejected:** Automatically convert creative model inferences into accepted initial state; can invent facts without user intent.
3. **C — rejected:** Keep all setup prose purely narrative and never structure explicit facts; loses already accepted initial-world functionality.

## Deferred details

Exact extractor schema, optional UI for unsupported or uncertain facts, phrasing/negation handling, references when entity identities are ambiguous, source attribution in the revision-free passage model, and ordering of extraction during Quick Start/Custom Opening remain later contract work. No AI model reviewer beyond established validation is added or claimed implemented.

## Traceability

[B5 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [B5-D01](ADR-0033-durable-minimal-turn-0-baseline.md), [B5-D03](ADR-0035-atomic-automatic-quick-start-opening.md); [IDEA-0006](../product/PRD-0007-quick-start-and-custom-story-openings.md), [IDEA-0066](../product/PRD-0067-ai-generated-starting-lorebook-and-world.md). Owners S02/S05/S06/S09/S10/S11/S12.

## Decision history

- **2026-10-28 — Proposed, unapproved:** B5-D02 A source-grounded supported facts only; B model elaboration accepted as fact; C never derive structured facts.
- **2026-10-28 — Explicit approval:** User selected **B5-D02: A** alongside, but separately from, D01 A and D03 A. No separate approval of optional AI Lorebook generation UX or future B5 options.
