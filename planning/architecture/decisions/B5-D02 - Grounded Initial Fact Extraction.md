---
type: architecture-decision
status: accepted
decision_id: "B5-D02"
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

# B5-D02 — Grounded initial fact extraction

## Approval and provenance

**Explicit approval, 2026-10-28:** “Review B5 Batch 1: B5-D01: A; B5-D02: A; B5-D03: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B5 review.”

This accepts **B5-D02 Option A** from [Pass B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). D01 and D03 have their own ADRs. Source [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md) already accepts explicitly grounded fact extraction from Quick Start **and** Custom Opening committed narrative; this decision refines setup-premise handling without adding AI-authoring rights to that extractor.

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
- **Separate intentional world-authoring exception:** [IDEA-0066](../../staging/AI-Generated%20Starting%20Lorebook%20and%20World.md) expressly allows the user to request AI creation of *new* initial worldbuilding beyond cited prose. That is a **different, optional workflow**, not implicit permission for the fact extractor to invent.
- No new universal manual Approve step is imposed on a successfully validated Quick Start opening; B5-D03's existing auto-commit behaviour remains intact.

## Alternatives considered

1. **A — accepted:** Strict, grounded, supported starting facts with deterministic validation; unknowns remain unknown and invalid changes fail visibly.
2. **B — rejected:** Automatically convert creative model inferences into accepted initial state; can invent facts without user intent.
3. **C — rejected:** Keep all setup prose purely narrative and never structure explicit facts; loses already accepted initial-world functionality.

## Deferred details

Exact extractor schema, optional UI for unsupported or uncertain facts, phrasing/negation handling, references when entity identities are ambiguous, source attribution in the revision-free passage model, and ordering of extraction during Quick Start/Custom Opening remain later contract work. No AI model reviewer beyond established validation is added or claimed implemented.

## Traceability

[B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [B5-D01](./B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md), [B5-D03](./B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md); [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md), [IDEA-0066](../../staging/AI-Generated%20Starting%20Lorebook%20and%20World.md). Owners S02/S05/S06/S09/S10/S11/S12.

## Decision history

- **2026-10-28 — Proposed, unapproved:** B5-D02 A source-grounded supported facts only; B model elaboration accepted as fact; C never derive structured facts.
- **2026-10-28 — Explicit approval:** User selected **B5-D02: A** alongside, but separately from, D01 A and D03 A. No separate approval of optional AI Lorebook generation UX or future B5 options.
