---
id: ADR-0036
type: adr
status: accepted
related:
- ADR-0037
- ADR-0038
- PRD-0067
- ADR-0034
- ADR-0020
- ADR-0033
- ADR-0031
- ADR-0035
supersedes: []
---

# Approved Optional AI Starting Lorebook

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B5-D04](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B5-D04%20-%20Approved%20Optional%20AI%20Starting%20Lorebook.md) · approved at: 2026-10-28; approved by: requesting user (explicit chat approval)

## Approval and provenance

**Explicit user approval on 2026-10-28:** “Review B5 Batch 2: B5-D04: A; B5-D05: A; B5-D06: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B5 review.”

The user selected **B5-D04 Option A**, from the original [B5 Batch 2 proposals](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). D05 and D06 are separate approvals, not a blanket authorisation for additional B5 decisions. This refines the independently accepted but staging-level [IDEA-0066](../product/PRD-0067-ai-generated-starting-lorebook-and-world.md). No implementation or promotion is claimed.

## Context

Players may explicitly request an AI-created, substantial starting world **before the first story turn**. Unlike [B5-D02](ADR-0034-grounded-initial-fact-extraction.md), which may only extract facts already established by its source prose, this **intentional worldbuilding** operation is authorised to propose new fictional lore. Those proposals require player control before becoming authoritative starting canon.

## Accepted decision — Option A

**Generate the optional AI-authored starting Lorebook as a noncanonical proposal. Commit a validated coherent result as current Turn-0 lore/world setup only after explicit player Approve/Commit; Discard leaves accepted canon unchanged.**

- **Opt-in authoring only:** The player must deliberately request starting-world generation. Blank adventures, Custom Openings, Quick Start and optional Guided Setup remain usable without it. AI-authoring may propose new places, characters, factions, histories, relationships and optional state where supported, but does not relax ordinary prose-extraction constraints.
- **Pending and review:** Generated text, entities and relationships remain noncanonical until player acceptance. Allow inspection of the proposed set. While an explicit approval is pending, use [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md): semi-transparent overlay covers the **entire** chat composer, preventing typing/sending, with accessible **Approve/Commit** and **Discard** actions. The player cannot proceed to story chat with unresolved pending world setup.
- **Single acceptance boundary:** Before Commit, TypeScript S05/S06 validates the **entire intended accepted set** for supported entity identities, links, ownership, location and applicable world invariants. A valid accepted set is committed **atomically** via Go/SQLite using the approved prepared commit, version, epoch, maintenance and idempotency safeguards. Never expose a half-accepted world, accept individual model streaming chunks as canon or invent narrative turns to represent pre-play world authoring.
- **Turn-0 identity:** The accepted generated Lorebook belongs to the adventure's **current starting baseline** and is replayable as applicable world data before Turn 1. It is not a fabricated player action, a separate story variant, or a retained world revision archive. A durable minimal baseline may already exist under [B5-D01](ADR-0033-durable-minimal-turn-0-baseline.md).
- **Approval and failure:** Until confirmed acceptance the proposed set remains noncanonical. Discard intentionally abandons this pending proposal, leaving the existing Turn-0 baseline and any separately accepted starting setup intact. Invalid or uncertain approval follows the applicable preservation, error and idempotency rules, subject to the narrowly superseding [B4-D08](ADR-0031-discard-stale-pending-manual-drafts.md) policy for externally obsolete *manual* drafts. Do **not** assume all generated Lorebook proposal persistence and crash-recovery semantics were decided by the manual-draft ADRs.
- **Separate Quick Start:** [B5-D03](ADR-0035-atomic-automatic-quick-start-opening.md) automatically commits a successfully validated **Quick Start opening**. This D04 is a separate player-initiated world-generation workflow that **requires** explicit acceptance. The shared overlay's existence does not add approval to ordinary validated Quick Start turns.

## Alternatives considered

1. **A — accepted:** One explicit player approval/discard after full validated starting-world proposal; keeps AI-invented world canon under player control.
2. **B — not chosen:** Automatically commit validated generated lore, bypassing review; could establish unwanted substantial fictional details.
3. **C — not chosen:** Commit each entry on receipt; risks partially accepted worlds and dangling links.

## Deferred details

Prompt/constraints, model generation staging, output size, editing within the preview, exact error recovery for uncommitted AI proposals, whether generation can run in multiple passes, proposal persistence across reload, invalid-entry review, and cross-feature UI sequencing remain open. Do not infer a specific UI beyond the accepted pending-commit overlay, a new Go AI service, a requirement for AI before play, or code/testing.

## Traceability

[B5 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [IDEA-0066](../product/PRD-0067-ai-generated-starting-lorebook-and-world.md), [B5-D01](ADR-0033-durable-minimal-turn-0-baseline.md), [B5-D02](ADR-0034-grounded-initial-fact-extraction.md), [B5-D03](ADR-0035-atomic-automatic-quick-start-opening.md), [B3-D07](ADR-0020-shared-pending-commit-composer-overlay.md). Owners S02/S04/S05/S06/S09/S10/S11/S12.

## Decision history

- **2026-10-18:** Source staging IDEA-0066 accepted optional deliberate AI creation of a rich Turn-0 Lorebook, without deciding acceptance mechanics.
- **2026-10-28 — Original unapproved B5-D04 alternatives:** A full proposal with explicit Commit/Discard, B automatic validated commit, C incremental per-entry commits.
- **2026-10-28 — Explicit decision:** User selected **B5-D04 A**. D05 and D06 received separate Option A approvals. No B5 closure or implementation was approved.
