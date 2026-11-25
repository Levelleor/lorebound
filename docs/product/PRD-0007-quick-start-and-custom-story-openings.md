---
id: PRD-0007
type: prd
status: accepted
related:
- NOTE-0022
- PRD-0001
- NOTE-0009
---

# Quick Start and Custom Story Openings

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0006](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Quick%20Start%20and%20Custom%20Story%20Openings.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S02**. First milestone: **M1**. Delivery: **PARTIAL**.

- Requirement coverage: [R01–R03 VERIFIED](../work/items/STORY-0011-production-blank-adventure-creation-and-resume.md); [DEV-002B scope](../work/items/STORY-0012-first-provisional-and-accepted-story-turn.md); remaining parent inventory draft
- Evidence: [Merged PRs #4](https://github.com/Levelleor/lorebound/pull/4) / [#6](https://github.com/Levelleor/lorebound/pull/6)

## Goals

Allow a Quick Start premise, custom or empty opening, and optional skippable Guided Setup. Untitled Adventure is valid. A validated generated Quick Start opening commits automatically; entered opening prose is captured only once committed. Persist explicitly established, supported world facts with the accepted opening and keep unknowns unknown. Only the blank entry/resume slice is verified (R01–R03).

## Later accepted narrative-first world-memory rule — 2026-10-28

**Latest world-event semantics ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** After accepted Quick Start or explicitly committed Custom Opening prose, extract only **source-grounded** facts and commit them as declarative current-state assertions. No event requires proof of an earlier pickup, travel route, fictional entity introduction or causal action. Unsupported details remain prose. Normal Quick Start still automatically commits its validated completed opening, while Custom Opening retains explicit player approval; pending manual changes retain their overlay.


## Accepted direction
Lorebound will offer three starting paths for a new adventure, without compulsory multi-step setup:

- **Quick Start, automatically committed generated opening (explicitly accepted):** The player supplies a **short freeform premise** for AI-assisted opening generation; no further setup is mandatory. When the configured generation pipeline finishes successfully and the coordinator has validated any proposed initial world-state changes, **automatically save the accepted opening as the adventure's first canonical story turn** without requiring a separate player review/Accept action. **Also extract and commit supported, explicitly established facts from the opening as structured world records when their systems are enabled**, in the same atomic transaction. Generation can show provisional/streamed content beforehand, but it is not canonical until the completed narrative and validated events commit through Go/SQLite. AI generation remains optional to the overall creation experience, not a prerequisite for Custom Opening or a blank adventure.
- **Custom Opening, including blank, with explicit-facts-only extraction (explicitly accepted):** The player may start from any self-authored opening prose **or an entirely empty story document**. **When authored opening prose becomes a committed canonical story passage**, the same enabled structured-world interpreter/extractor used for Quick Start should capture **only facts explicitly established in the player's text, explicit setup, or pre-existing canonical context**, validate them, and persist accepted changes coherently with that opening. **Do not invent additional lore about mentioned characters, places, items or relationships.** Unknowns stay unknown, rumours remain marked as such, and unfinished editing drafts do not alter world state. A blank start creates a valid saved adventure without requiring a premise, opening text, AI generation or fictional initial facts.
- **Optional Guided Setup:** Genre, setting, starting situation and any other guided options are **fully skippable** and must not block adventure creation if left blank. Exact preset choices and layout remain separate refinements.
- **No mandatory setup steps or title:** Detailed character creation, map setup, world configuration, guided forms, and typing an explicit adventure name are **never prerequisites**. When no name is supplied, create the adventure with the display title **`Untitled Adventure`** and allow it to be renamed later (IDEA-0005). Identity is a separate stable adventure ID, not the display title; non-unique untitled names do not imply merged adventures.
- **Grounded initial-world extraction with no extra lore (explicitly accepted for BOTH Quick Start and Custom Opening):** Create or update character, location, item, relationship and other supported records **only for facts stated in a committed AI-generated or player-written opening, explicitly supplied in setup, or already established in canonical context**. The extractor/interpreter must **not fill in unwritten backstories, personality, location features, motives, item ownership, routes, statistics, hidden relationships or other lore** merely to flesh out an entry. Keep unspecified fields **unknown/unset**, avoid duplicate entities and distinguish explicit speculation/rumours from established facts. Every proposed record/change must pass deterministic validation, track its source text/revision, and be committed atomically with the opening. If a fact cannot be represented or validated, do not manufacture missing details to force it; follow the normal proposal rejection/repair/failure boundary.
- **Independent save:** Each new adventure should enter the same independent save/resume system accepted under Adventure Save and Export Management (IDEA-0005).

The three entry paths, minimal-start behaviour, automatic acceptance of a successful validated Quick Start AI opening, and **source-grounded automatic creation of relevant structured initial world facts for BOTH generated and player-written accepted openings** are explicitly accepted. Precise optional setup fields, premise prompting, extraction schemas, unsupported-fact handling and UI layout remain for refinement; no extra pre-commit review gate is required for generated Quick Start openings.

## Dependencies and constraints
- Depends on a configured narrator/model to generate text when the player requests an AI-assisted opening; custom prose need not require generation to initialise a story document. **Do not commit a partial or cancelled AI opening.** Run the selected generation pipeline's deterministic validation before automatically committing the completed opening and any accepted initial world-state changes as **one atomic first turn**, consistent with IDEA-0018/0044/0019 and Go/SQLite persistence (IDEA-0005/0051).
- Integrate with independent adventure creation/rename and **noncanonical draft versus committed prose persistence** as accepted by Adventure Save and Export Management (IDEA-0005). Player-written prose must **not cause state extraction until it is accepted as canon**; when accepted, supported facts are validated and persisted consistently with the text. A blank adventure is valid in the shared Go/SQLite library. A missing title uses `Untitled Adventure` but never serves as the unique database identity.
- Detailed character creation, scenario templates, lorebook/world presets and map state have separate idea documents and are not implicitly approved by this acceptance. **Separately accepted AI-Generated Starting Lorebook and World (IDEA-0066)** is an **optional, intentional request for AI to author substantial lore BEFORE the first turn**, distinct from source-only prose extraction. No mandatory pre-generation or gameplay turn is required.
- Avoid silently imposing gameplay/RPG requirements or multi-step questionnaires on a user who wants to start writing.

## Open questions
- **Resolved:** An adventure may be created with no player-entered metadata or prose, with the default `Untitled Adventure` display name. Quick Start requires only its own short premise if the player chooses that AI opening route.
- **Resolved:** A fully blank story is permitted through Custom Opening, while Quick Start's AI-generation flow asks for a short premise.
- **Resolved:** All Guided Setup fields are skippable. Which, if any, optional genre/setting presets to offer remains open.
- **Resolved:** A successfully generated **Quick Start** opening is **committed automatically after validation**, without a separate player-review/confirmation gate. Partial, cancelled, failed or validation-rejected output never becomes the first canonical turn.
- How are **explicitly stated facts** from both generated Quick Start and accepted user-authored Custom Opening text represented with source/provenance under the selected pipeline, including models that fail to return structured events? **The no-invented-lore extraction boundary is accepted.** Separately, the optional IDEA-0066 worldbuilding generator may author NEW world facts on explicit request, before Turn 1; its detailed workflow is intentionally deferred.

## Supporting detail

See [NOTE-0022](../knowledge/inbox/NOTE-0022-prd-0007-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
