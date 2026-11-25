---
id: PRD-0067
type: prd
status: accepted
related:
- NOTE-0062
- PRD-0001
- PRD-0007
- PRD-0021
- PRD-0037
- PRD-0009
- PRD-0046
---

# AI-Generated Starting Lorebook and World

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0066](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/AI-Generated%20Starting%20Lorebook%20and%20World.md) · origin: user; created: 2026-10-18; updated: 2026-11-03; accepted at: 2026-10-18; accepted by: requesting user (explicit chat direction); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S02**. First milestone: **M7**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Later accepted narrative-first world-memory rule — 2026-10-28

**Latest world-event semantics ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Optional deliberate worldbuilding may author new initial facts, and its approved results are typed **Turn-0 world assertions**, not a fabricated playable story or procedurally validated game actions. Sparse identities and unknown details are valid. Technical representability, atomic commit and explicit player approval for generated world proposals (B5-D04/D07) survive. The narrator's later grounded extracted facts are also assertions, not mechanically constrained history.


## Accepted direction
- **Optional generation at adventure start (explicitly requested and accepted):** Provide a way for the player to ask AI to **create the starting Lorebook for the adventure/world**, potentially covering many relevant entities and interconnected setting facts. Its goal is a **rich, ready-to-play world before the first narrative turn**. It must not require playing an opening turn as a way to populate this starting lore.
- **Authoring, not extraction:** This feature **explicitly authorises AI creation of new worldbuilding material** when the player requests it. It is **distinct from the strict fact-only extractor** for already written/generated story prose (IDEA-0006/0045): extracting prose facts must **never secretly invent unwritten lore**. A worldbuilding-generation request may invent lore **as generated content**, subject to accepted world-state and validation boundaries.
- **No compulsory worldbuilding:** Quick Start from a short premise, blank Custom Opening, a player-authored Custom Opening and skippable Guided Setup remain available **without** generating a Lorebook. No large mandatory setup wizard or generation wait is imposed on the player who skips this option.
- **Durable initial setting:** The resulting accepted starting lore should be available to the adventure **at Turn 0 / before the first narrative turn**, through the existing adventure-scoped persistent Lorebook/structured world records. It must not be simulated as a fake played narrative turn or imply historical player actions that never happened.
- **Coherent existing architecture:** The selected browser-side TypeScript generation/coordinator pipeline may call the configured local/cloud AI model(s), validate relevant structured records and write accepted results through the existing Go/SQLite persistence boundary. Avoid inventing a second database, compulsory server-side AI engine or implicit network dependency for people not using this option.
- **Scope deliberately unrefined:** How the user asks for the world, how much is generated, whether generation occurs in stages, initial categories, optional constraints, editing/review/approval, cost/time budgets, handling contradictions, failure/partial output, and connections to scenario templates or starting gameplay state all require **later refinement**. Do not treat plausible implementation sketches as already approved.

## Dependencies and constraints
- Quick Start and Custom Story Openings (IDEA-0006): creation remains frictionless unless the player **explicitly chooses** world generation. Normal Quick Start auto-commit and Custom Opening fact-only extraction decisions remain intact.
- Entity-Based Lorebook (IDEA-0020): generated lore should use durable, linkable adventure-scoped Lorebook entries and distinguish facts from rumours/beliefs where represented. How the player selects entries for later AI context is separate from how they were generated.
- AI World Discovery and Expansion (IDEA-0036), Shared PC and NPC Character Entities (IDEA-0026) and applicable location/item systems: validate structured entities, identities, links, current-state semantics and unknown fields. Lore mentions alone must not teleport characters or invent present possession.
- LLM State Interpreter and Proposed Operations (IDEA-0045), Deterministic Adventure Coordinator (IDEA-0044), Configurable Generation Pipeline Strategies (IDEA-0018): keep generated proposals distinct from validated canonical records, without requiring an always-loaded separate model.
- Adventure Save and Export Management (IDEA-0005) and Browser-Persistent Story Database (IDEA-0051): save the accepted initial lore in the **single shared SQLite database**, scoped to its adventure; it participates in **whole-database snapshot Backup/Restore**, not a new per-adventure file export.
- Reusable Scenario Templates and Placeholders (IDEA-0008): interaction with reusable scenarios is worth exploring but **not decided**. AI-generated Lorebook generation is not automatically synonymous with scenario-template creation.
- No implementation, production approval, preselected UI, mandatory number of lore entries or completeness guarantee is implied by this staging acceptance.

## Open questions
- What initiating input is appropriate: a premise, an existing scenario, custom worldbuilding instructions, optional sliders, or a mixture?
- What does “the entire Lorebook” mean operationally for an effectively unbounded fictional world, and how should the user choose breadth/depth?
- Should generation run as one request, staged passes by entity type, or an iterative graph expansion process?
- How can relationships, aliases, contradictions, provenance and internal consistency be validated, especially with weaker local models?
- Does the player review/edit/confirm an assembled Lorebook before saving it, or is the validated result committed automatically?
- What exactly is persisted before Turn 1: descriptive lore alone, structured initial world entities/state, or selectable combinations?
- How are failure, cancellation, partial output, retries, model-cost limits and interruptions handled without a half-initialised adventure?
- Can a generated initial Lorebook become a reusable scenario template, and if so, through which **separately approved** process?
- How does this pre-play worldbuilding coexist with automatic later lore discovery and source-only prose extraction?

## Draft acceptance criteria
- [ ] During new-adventure creation, a player can **optionally ask AI to generate a substantial starting Lorebook/world** before any story turn has been played.
- [ ] A successfully accepted generated starting world is persisted and usable **before Turn 1**, so the player may start in an already populated setting without simulating prior story turns.
- [ ] Players who do not choose this feature can still use Quick Start, Custom Opening (including blank) and optional Guided Setup with no mandatory world-generation step.
- [ ] Generated lore can include **new fictional facts deliberately authored by the requested worldbuilding operation**; ordinary story-prose fact extraction remains limited to **explicitly established source facts** and cannot create invisible extra lore.
- [ ] Supported entity/state data uses coherent IDs, relationships and validation rules rather than blindly treating model output as database truth.
- [ ] The initial Lorebook belongs to the correct adventure in the shared SQLite library and is included in ordinary whole-database backups; no new per-adventure export/merge process is required.
- [ ] Exact generation workflow, scale, editing/review/commit semantics, handling of failures and measurable completion criteria are refined **before any production approval**.

## Supporting detail

See [NOTE-0062](../knowledge/inbox/NOTE-0062-prd-0067-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
