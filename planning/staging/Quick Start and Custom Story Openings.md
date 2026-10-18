---
id: "IDEA-0006"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Quick Start and Custom Story Openings

## Idea
Let a player start an adventure immediately through Quick Start, Custom Opening or fully optional Guided Setup, **without mandatory character/world setup, initial prose or an adventure title**.

## Why this idea matters
Allows immediate play and detailed scenario authorship.

## Accepted direction
Lorebound will offer three starting paths for a new adventure, without compulsory multi-step setup:

- **Quick Start, automatically committed generated opening (explicitly accepted):** The player supplies a **short freeform premise** for AI-assisted opening generation; no further setup is mandatory. When the configured generation pipeline finishes successfully and the coordinator has validated any proposed initial world-state changes, **automatically save the accepted opening as the adventure's first canonical story turn** without requiring a separate player review/Accept action. **Also extract and commit supported, explicitly established facts from the opening as structured world records when their systems are enabled**, in the same atomic transaction. Generation can show provisional/streamed content beforehand, but it is not canonical until the completed narrative and validated events commit through Go/SQLite. AI generation remains optional to the overall creation experience, not a prerequisite for Custom Opening or a blank adventure.
- **Custom Opening, including blank, with explicit-facts-only extraction (explicitly accepted):** The player may start from any self-authored opening prose **or an entirely empty story document**. **When authored opening prose becomes a committed canonical story passage**, the same enabled structured-world interpreter/extractor used for Quick Start should capture **only facts explicitly established in the player's text, explicit setup, or pre-existing canonical context**, validate them, and persist accepted changes coherently with that opening. **Do not invent additional lore about mentioned characters, places, items or relationships.** Unknowns stay unknown, rumours remain marked as such, and unfinished editing drafts do not alter world state. A blank start creates a valid saved adventure without requiring a premise, opening text, AI generation or fictional initial facts.
- **Optional Guided Setup:** Genre, setting, starting situation and any other guided options are **fully skippable** and must not block adventure creation if left blank. Exact preset choices and layout remain separate refinements.
- **No mandatory setup steps or title:** Detailed character creation, map setup, world configuration, guided forms, and typing an explicit adventure name are **never prerequisites**. When no name is supplied, create the adventure with the display title **`Untitled Adventure`** and allow it to be renamed later (IDEA-0005). Identity is a separate stable adventure ID, not the display title; non-unique untitled names do not imply merged adventures.
- **Grounded initial-world extraction with no extra lore (explicitly accepted for BOTH Quick Start and Custom Opening):** Create or update character, location, item, relationship and other supported records **only for facts stated in a committed AI-generated or player-written opening, explicitly supplied in setup, or already established in canonical context**. The extractor/interpreter must **not fill in unwritten backstories, personality, location features, motives, item ownership, routes, statistics, hidden relationships or other lore** merely to flesh out an entry. Keep unspecified fields **unknown/unset**, avoid duplicate entities and distinguish explicit speculation/rumours from established facts. Every proposed record/change must pass deterministic validation, track its source text/revision, and be committed atomically with the opening. If a fact cannot be represented or validated, do not manufacture missing details to force it; follow the normal proposal rejection/repair/failure boundary.
- **Independent save:** Each new adventure should enter the same independent save/resume system accepted under [[Adventure Save and Export Management]] (IDEA-0005).

The three entry paths, minimal-start behaviour, automatic acceptance of a successful validated Quick Start AI opening, and **source-grounded automatic creation of relevant structured initial world facts for BOTH generated and player-written accepted openings** are explicitly accepted. Precise optional setup fields, premise prompting, extraction schemas, unsupported-fact handling and UI layout remain for refinement; no extra pre-commit review gate is required for generated Quick Start openings.

## Proposed behaviour
From the new-adventure interface, a player chooses Quick Start, Custom Opening or optional Guided Setup. **Quick Start** requests just the brief premise needed for an AI-generated introduction, with no further compulsory questions. While generating, the opening may appear as provisional text. **On full successful generation and validation**, Lorebound **automatically commits the opening and all supported, explicitly grounded initial world facts together** and moves directly into play. For example, "You stand outside the village of Ashford. Your old friend Marcus approaches, carrying a bloodstained sword" can establish **Ashford as a village**, **Marcus as a character and old friend**, and **a bloodstained sword carried by Marcus**. It must **not** infer the sword belongs to Marcus, invent who was wounded, invent Ashford's history/population, or add Marcus's personality, motivation or backstory. A cancelled, incomplete, failed or invalid opening remains **uncommitted**; the player can retry without corrupting the saved adventure. **Custom Opening** accepts user-authored initial prose **or nothing at all**. When authored prose is accepted as canonical, validate and record **only its explicitly established supported world facts**, with no invisible invented lore. Unsubmitted/unconfirmed prose drafts remain noncanonical, while a blank story opens as a normal editable, resumable adventure without any AI call. **Guided Setup** accepts as many or as few optional fields as desired and never forces a wizard to finish. If the user has not named the adventure, save it as **`Untitled Adventure`** with its own stable ID; the name can be changed later. All paths use the existing single SQLite library and normal draft/committed save rules.

## Alternatives and trade-offs
**Selected:** A blank story and default `Untitled Adventure` are valid, preserving a frictionless first launch. **Quick Start specifically needs a short premise to request AI generation**, and its first valid completed AI scene is **committed automatically**; there is no mandatory first-scene review screen. This does not remove the **explicit confirmation required for later historical edits** (IDEA-0041). The premise requirement does not apply to Custom Opening or other entry paths. Genre presets, advanced questions, character creation and world configuration remain optional. Whether Guided Setup uses a wizard or inline controls remains open. No automatic AI call is necessary for a blank user-created story.

## No required protagonist at adventure start
- **Explicitly accepted IDEA-0007/0026 direction:** Any creation path may result in a story with **no characters and no focal protagonist**, or with several established characters that the player alternates between. **Do not create a placeholder hero, default status sheet or imaginary inventory** because character creation was skipped.
- Character identities and supported structured facts are registered only when actually established by player prose, validated generated narrative or explicitly requested AI starting-world content (IDEA-0066), following each operation's agreed grounding/validation policy. A new empty adventure remains valid without character entities.
- Optional narrative focus does not govern who performs future turn actions; focus may be absent or change without changing canonical inventory, status or character location.

## Playing As may remain unselected when play begins
- **Latest explicit user decision (IDEA-0002/0007/0026):** Quick Start, Custom Opening and optional Guided Setup can start with **zero characters** and no chosen player identity. The new adventure's Settings sidebar `Playing As` selector can remain unset; **Do and Say are disabled** while no existing Lorebook character is selected, but **Story and Continue remain available**.
- The selector lists actual Lorebook character entities for that adventure. Its **Add Character** action opens Lorebook **manual character entry**. Do not auto-create or auto-select a fictional protagonist just to unlock actions; after adding characters, the user may pick which one to act/speak as.
- This does not alter automatic validated Quick Start opening commit, Custom Opening source-only fact extraction, or the separately accepted optional AI-built world (IDEA-0066).

## Universal character model during adventure creation
- **Explicit IDEA-0026 change:** Newly introduced or authored characters all use the same character entity kind with **no PC/NPC, Playable or permanent protagonist flag**. Any actual character in the adventure's Lorebook, however it was introduced, is eligible for explicit Settings `Playing As` selection, but **none is auto-selected** at creation.
- Blank and characterless adventures remain valid with Story/Continue. Do/Say become available only when an existing character is deliberately selected. This does not change first-scene extraction or optional IDEA-0066 pre-play world generation.

## Dependencies and constraints
- Depends on a configured narrator/model to generate text when the player requests an AI-assisted opening; custom prose need not require generation to initialise a story document. **Do not commit a partial or cancelled AI opening.** Run the selected generation pipeline's deterministic validation before automatically committing the completed opening and any accepted initial world-state changes as **one atomic first turn**, consistent with IDEA-0018/0044/0019 and Go/SQLite persistence (IDEA-0005/0051).
- Integrate with independent adventure creation/rename and **noncanonical draft versus committed prose persistence** as accepted by [[Adventure Save and Export Management]] (IDEA-0005). Player-written prose must **not cause state extraction until it is accepted as canon**; when accepted, supported facts are validated and persisted consistently with the text. A blank adventure is valid in the shared Go/SQLite library. A missing title uses `Untitled Adventure` but never serves as the unique database identity.
- Detailed character creation, scenario templates, lorebook/world presets and map state have separate idea documents and are not implicitly approved by this acceptance. **Separately accepted [[AI-Generated Starting Lorebook and World]] (IDEA-0066)** is an **optional, intentional request for AI to author substantial lore BEFORE the first turn**, distinct from source-only prose extraction. No mandatory pre-generation or gameplay turn is required.
- Avoid silently imposing gameplay/RPG requirements or multi-step questionnaires on a user who wants to start writing.

## Open questions
- **Resolved:** An adventure may be created with no player-entered metadata or prose, with the default `Untitled Adventure` display name. Quick Start requires only its own short premise if the player chooses that AI opening route.
- **Resolved:** A fully blank story is permitted through Custom Opening, while Quick Start's AI-generation flow asks for a short premise.
- **Resolved:** All Guided Setup fields are skippable. Which, if any, optional genre/setting presets to offer remains open.
- **Resolved:** A successfully generated **Quick Start** opening is **committed automatically after validation**, without a separate player-review/confirmation gate. Partial, cancelled, failed or validation-rejected output never becomes the first canonical turn.
- How are **explicitly stated facts** from both generated Quick Start and accepted user-authored Custom Opening text represented with source/provenance under the selected pipeline, including models that fail to return structured events? **The no-invented-lore extraction boundary is accepted.** Separately, the optional IDEA-0066 worldbuilding generator may author NEW world facts on explicit request, before Turn 1; its detailed workflow is intentionally deferred.

## Draft acceptance criteria
- [ ] Quick Start can create an adventure from a **short freeform premise**, with no other required questionnaire, character sheet, world configuration or review/Accept gate before a valid scene becomes playable.
- [ ] After complete successful generation and validation, the opening text and supported **explicitly grounded** initial world facts/events are **committed together as the first canonical story turn automatically**, without a second player confirmation.
- [ ] When an opening explicitly names a character, location or item, the applicable enabled systems can create/link **minimal structured records** with stable IDs and source references, with no automatically invented additional lore.
- [ ] For the scene "outside the village of Ashford ... old friend Marcus ... carrying a bloodstained sword", extraction may capture Ashford's village type, Marcus and the explicitly stated friendship, and the carried bloodstained sword, but **must not invent** its owner, a victim, regional history, character motives, or unspecified attributes. Unknown details remain unknown.
- [ ] A rumour, hypothesis, hypothetical mention, metaphor or ambiguous identity does not become an unsupported established fact; no speculative schema-filling or hidden lore generation occurs as an extraction side effect.
- [ ] An incomplete, cancelled, rejected or failed generation **never leaves a partial canonical opening or world-state change**; the player can retry without corrupting earlier committed records.
- [ ] Custom Opening supports **user-provided prose or a completely blank, editable story**; blank creation needs no generated text or AI connection.
- [ ] When player-written Custom Opening prose is accepted, relevant enabled systems extract **only directly supported canonical facts**, link their source/provenance, and validate/persist them coherently, **without invented lore**. Editing drafts and a blank opening do not establish world facts.
- [ ] An **optional explicit AI starting-world generation feature** is accepted separately as IDEA-0066; Custom Opening and Quick Start remain available without it.
- [ ] A player can optionally provide guided genre/setting/situation details for an AI-assisted opening.
- [ ] Every Guided Setup field can be skipped, and setup can be bypassed entirely; no lengthy form, character creation or world setup is compulsory.
- [ ] If no title is provided, a new independent adventure is saved as **`Untitled Adventure`**, can be renamed afterward, and is kept distinct from any other identically named adventure by its stable ID.
- [ ] Each creation path produces a distinct, resumable adventure compatible with the accepted save-management direction.
- [ ] The exact intro-generation and initial-state behaviour is testable after refinement.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant-proposed option, now explicitly accepted by the requesting user.
- Accepted for staging/refinement only. Implementation, UI details and production approval remain outstanding.

## Decisions and review history
- 2026-10-18 — **Accepted one-kind character creation dependency:** There are no PC/NPC or Playable classifications. All Lorebook character records are eligible for optional `Playing As`, never automatically assigned. Characterless starting stories remain permitted. Staging only.
- 2026-10-18 — **Accepted Settings character-selector dependency:** Do and Say need an explicit `Playing As` choice from existing Lorebook characters, while Story/Continue remain playable from the outset even with no characters. An **Add Character** dropdown choice routes to manual Lorebook entry. No default protagonist; staging only.
- 2026-10-18 — **Accepted characterless/multi-character creation dependency:** Quick Start, Custom Opening (including blank) and optional Guided Setup must permit zero protagonists or many playable characters. No default player avatar/character sheet/inventory is created, and optional narrator focus is distinct from actors on each turn. Staging unchanged.
- 2026-10-18 — **Explicit user acceptance of Custom Opening extraction:** Apply the same **source-grounded, no-invented-lore structured fact extraction** to **player-authored Custom Opening** prose when it becomes canonical. Unfinished text drafts and blank openings do not generate authoritative world facts. **Separate accepted idea:** IDEA-0066 adds an optional intentional pre-play AI worldbuilding operation that *may* create a substantial new starting Lorebook **before Turn 1**; this does not relax the strict extraction rule. Its details will be refined later. Remains staging only.
- 2026-10-17 — **Explicit user acceptance with additional constraint (staging only):** Choose **Option A, automatic initial structured world tracking** for facts present in a successfully generated and accepted opening, when relevant feature systems are enabled. **Only extract facts actually stated in the prose or explicitly supplied/previously canonically established; do not generate unstated lore about introduced people, places, objects or their relationships.** Unknowns remain unknown. Resolve stable identities, keep source/provenance, validate proposed operations and atomically commit with the opening. This supplements but does not change the earlier automatic first-scene commit decision. Schema/edge-case handling remains under refinement; no promotion or implementation approval.
- 2026-10-17 — **User explicitly accepted Option A for Quick Start openings (staging only):** The first AI-generated opening is **automatically accepted and committed when generation completes successfully and proposed world-state effects pass deterministic validation**. The opening plus accepted initial events/state must be persisted atomically through Go/SQLite; no separate mandatory Review/Accept action is required. Streaming previews or incomplete, cancelled, failed or invalid output are **not canonical**, and retry/edit actions remain available afterward using ordinary story controls. Explicit confirmation for later historical edits remains unchanged. Initial event schemas and UI specifics are still open; no production/implementation promotion.
- 2026-10-17 — **Explicit minimal-start refinement accepted by the requesting user:** **No mandatory setup data or title** to create an adventure. Quick Start asks for only a short premise to generate an opening; Custom Opening may begin with authored prose **or completely blank** without an AI request; **all Guided Setup fields are optional/skippable**. Without an entered title, the adventure starts as **`Untitled Adventure`**, with a separate stable ID and an ordinary rename action later. This aligns with accepted IDEA-0005 and IDEA-0007 but does not decide generated-opening preview/commit details. Remains **staging**, not production or implementation approval.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user**: Quick Start, Custom Opening and optional Guided Setup, with no mandatory setup steps. Moved to staging for refinement; not approved for production or implemented.
