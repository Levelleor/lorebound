---
id: "IDEA-0066"
type: idea
status: staging
origin: user
created: "2026-10-18"
updated: "2026-10-18"
accepted_at: "2026-10-18"
accepted_by: "requesting user (explicit chat direction)"
source_brainstorms: []
related: ["[[Quick Start and Custom Story Openings]]", "[[Entity-Based Lorebook]]", "[[AI World Discovery and Expansion]]", "[[Reusable Scenario Templates and Placeholders]]", "[[LLM State Interpreter and Proposed Operations]]"]
tags:
  - planning/idea
---
# AI-Generated Starting Lorebook and World

## Idea
Offer an **optional AI-assisted way to generate a substantial, coherent Lorebook for a new adventure's game world before any narrative/story turn has been played**, so a player can immediately begin inside an already populated setting rather than waiting for locations, people, factions and other lore to arise during play.

## Why this idea matters
A player may want to start an adventure in a world that already has meaningful places, people, relationships, history and other setting material. Existing Quick Start and first-scene fact extraction can establish facts gradually but do not, by themselves, provide a deliberately prebuilt world before Turn 1.

## Accepted direction
- **Optional generation at adventure start (explicitly requested and accepted):** Provide a way for the player to ask AI to **create the starting Lorebook for the adventure/world**, potentially covering many relevant entities and interconnected setting facts. Its goal is a **rich, ready-to-play world before the first narrative turn**. It must not require playing an opening turn as a way to populate this starting lore.
- **Authoring, not extraction:** This feature **explicitly authorises AI creation of new worldbuilding material** when the player requests it. It is **distinct from the strict fact-only extractor** for already written/generated story prose (IDEA-0006/0045): extracting prose facts must **never secretly invent unwritten lore**. A worldbuilding-generation request may invent lore **as generated content**, subject to accepted world-state and validation boundaries.
- **No compulsory worldbuilding:** Quick Start from a short premise, blank Custom Opening, a player-authored Custom Opening and skippable Guided Setup remain available **without** generating a Lorebook. No large mandatory setup wizard or generation wait is imposed on the player who skips this option.
- **Durable initial setting:** The resulting accepted starting lore should be available to the adventure **at Turn 0 / before the first narrative turn**, through the existing adventure-scoped persistent Lorebook/structured world records. It must not be simulated as a fake played narrative turn or imply historical player actions that never happened.
- **Coherent existing architecture:** The selected browser-side TypeScript generation/coordinator pipeline may call the configured local/cloud AI model(s), validate relevant structured records and write accepted results through the existing Go/SQLite persistence boundary. Avoid inventing a second database, compulsory server-side AI engine or implicit network dependency for people not using this option.
- **Scope deliberately unrefined:** How the user asks for the world, how much is generated, whether generation occurs in stages, initial categories, optional constraints, editing/review/approval, cost/time budgets, handling contradictions, failure/partial output, and connections to scenario templates or starting gameplay state all require **later refinement**. Do not treat plausible implementation sketches as already approved.

## Proposed behaviour (illustrative, not a fixed design)
While creating a new adventure, the player may optionally request an AI-built initial world or full starting Lorebook, perhaps from a concise premise or worldbuilding instructions. Lorebound produces a coherent collection of lore entries and applicable relationships/initial records **before normal narrative play**, using the appropriate existing model integration and validating supported structured data before durable acceptance. The player can then begin an adventure whose setting already contains established places, NPCs, factions and history, without needing to narrate their discovery one turn at a time.

This is a separate intentional generation operation. After the world is created, **subsequent narrative text extraction still records only facts actually established in its sources**; it does not use this feature as permission to fill unstated details every time an entity is mentioned.

## Alternatives and trade-offs
- A guided worldbuilding prompt, one large generation request, or multiple staged generations could serve this goal. **None is selected** yet. A large coherent world may exceed model context/output budgets; a staged approach may require linking, consistency checks and opportunities to correct output.
- Generating substantial lore before play can offer immersion but adds optional startup latency, model usage/cost and possible contradictions. Exact quality/consistency expectations, stop/cancel semantics and whether partial generations can be saved are open.
- How much structured world state should be initialised versus stored as descriptive Lorebook entries depends on enabled modules and later refinement. Do not assume the entire world needs to be materialised as a traversable location graph, or that every lore claim establishes present-time physical state.

## Dependencies and constraints
- [[Quick Start and Custom Story Openings]] (IDEA-0006): creation remains frictionless unless the player **explicitly chooses** world generation. Normal Quick Start auto-commit and Custom Opening fact-only extraction decisions remain intact.
- [[Entity-Based Lorebook]] (IDEA-0020): generated lore should use durable, linkable adventure-scoped Lorebook entries and distinguish facts from rumours/beliefs where represented. How the player selects entries for later AI context is separate from how they were generated.
- [[AI World Discovery and Expansion]] (IDEA-0036), [[Shared PC and NPC Character Entities]] (IDEA-0026) and applicable location/item systems: validate structured entities, identities, links, current-state semantics and unknown fields. Lore mentions alone must not teleport characters or invent present possession.
- [[LLM State Interpreter and Proposed Operations]] (IDEA-0045), [[Deterministic Adventure Coordinator]] (IDEA-0044), [[Configurable Generation Pipeline Strategies]] (IDEA-0018): keep generated proposals distinct from validated canonical records, without requiring an always-loaded separate model.
- [[Adventure Save and Export Management]] (IDEA-0005) and [[Browser-Persistent Story Database]] (IDEA-0051): save the accepted initial lore in the **single shared SQLite database**, scoped to its adventure; it participates in **whole-database snapshot Backup/Restore**, not a new per-adventure file export.
- [[Reusable Scenario Templates and Placeholders]] (IDEA-0008): interaction with reusable scenarios is worth exploring but **not decided**. AI-generated Lorebook generation is not automatically synonymous with scenario-template creation.
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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Explicit direct request in chat to record this as **another accepted idea**, with details to refine later; there is no originating brainstorm or earlier Inbox candidate for this distinct proposal.
- This acceptance establishes the **capability and timing**, not the generation technique, user approval workflow, exact size of the world or implemented feature.
- Staging only. No production/spec/implementation claim.

## Decisions and review history
- 2026-10-18 — **Explicitly accepted upon proposal by requesting user:** Add a way to ask AI to create the **entire starting Lorebook/world for an adventure before playing even one turn**, so the player begins in a game already populated with lore and things to explore. **Refine implementation and UX later.** This is intentional, optionally requested **AI worldbuilding**, distinct from the newly reaffirmed **source-facts-only** extraction of normal opening prose. Created directly in staging because the user explicitly called for an accepted idea, rather than implying a prior unapproved Inbox history. No production approval.
