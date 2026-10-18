---
id: "IDEA-0006"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-17"
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

- **Quick Start:** The player supplies a **short freeform premise** for AI-assisted opening generation; other setup information (character sheets, world configuration, genre forms, etc.) is not mandatory. AI opening generation is optional to the overall creation experience, not a prerequisite for Custom Opening or a blank adventure.
- **Custom Opening, including blank:** The player may start from any self-authored opening prose **or an entirely empty story document**. A blank start creates a valid saved adventure without requiring a premise, opening text or AI generation.
- **Optional Guided Setup:** Genre, setting, starting situation and any other guided options are **fully skippable** and must not block adventure creation if left blank. Exact preset choices and layout remain separate refinements.
- **No mandatory setup steps or title:** Detailed character creation, map setup, world configuration, guided forms, and typing an explicit adventure name are **never prerequisites**. When no name is supplied, create the adventure with the display title **`Untitled Adventure`** and allow it to be renamed later (IDEA-0005). Identity is a separate stable adventure ID, not the display title; non-unique untitled names do not imply merged adventures.
- **Independent save:** Each new adventure should enter the same independent save/resume system accepted under [[Adventure Save and Export Management]] (IDEA-0005).

The three entry paths and **minimal-start behaviour** are explicitly accepted. Generated-opening review/commit treatment, precise optional setup fields, premise prompting and UI layout remain for refinement.

## Proposed behaviour
From the new-adventure interface, a player chooses Quick Start, Custom Opening or optional Guided Setup. **Quick Start** requests just the brief premise needed for its AI-generated introduction, with no further compulsory questions. **Custom Opening** accepts user-authored initial prose **or nothing at all**; a blank story opens as a normal editable, resumable adventure without calling AI. **Guided Setup** accepts as many or as few optional fields as desired and never forces a wizard to finish. If the user has not named the adventure, save it as **`Untitled Adventure`** with its own stable ID; the name can be changed later. All paths use the existing single SQLite library and normal draft/committed save rules.

## Alternatives and trade-offs
**Selected:** A blank story and default `Untitled Adventure` are valid, preserving a frictionless first launch. **Quick Start specifically needs a short premise to request AI generation**, but that requirement does not apply to Custom Opening or other entry paths. Genre presets, advanced questions, character creation and world configuration remain optional. Whether Guided Setup uses a wizard or inline controls remains open. No automatic AI call is necessary for a blank user-created story.

## Dependencies and constraints
- Depends on a configured narrator/model to generate text when the player requests AI-assisted opening; custom prose need not require generation to initialise a story document.
- Integrate with independent adventure creation/rename and **noncanonical draft versus committed prose persistence** as accepted by [[Adventure Save and Export Management]] (IDEA-0005); a blank adventure is valid in the shared Go/SQLite library. A missing title uses `Untitled Adventure` but never serves as the unique database identity.
- Detailed character creation, scenario templates, lorebook/world presets and map state have separate idea documents and are not implicitly approved by this acceptance.
- Avoid silently imposing gameplay/RPG requirements or multi-step questionnaires on a user who wants to start writing.

## Open questions
- **Resolved:** An adventure may be created with no player-entered metadata or prose, with the default `Untitled Adventure` display name. Quick Start requires only its own short premise if the player chooses that AI opening route.
- **Resolved:** A fully blank story is permitted through Custom Opening, while Quick Start's AI-generation flow asks for a short premise.
- **Resolved:** All Guided Setup fields are skippable. Which, if any, optional genre/setting presets to offer remains open.
- Does the generated opening get presented as a reviewable draft before being committed to the adventure?
- How are initial world facts proposed and validated when the AI creates the opening scene?

## Draft acceptance criteria
- [ ] Quick Start can create an adventure from a **short freeform premise**, with no other required questionnaire, character sheet or world configuration.
- [ ] Custom Opening supports **user-provided prose or a completely blank, editable story**; blank creation needs no generated text or AI connection.
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
- 2026-10-17 — **Explicit minimal-start refinement accepted by the requesting user:** **No mandatory setup data or title** to create an adventure. Quick Start asks for only a short premise to generate an opening; Custom Opening may begin with authored prose **or completely blank** without an AI request; **all Guided Setup fields are optional/skippable**. Without an entered title, the adventure starts as **`Untitled Adventure`**, with a separate stable ID and an ordinary rename action later. This aligns with accepted IDEA-0005 and IDEA-0007 but does not decide generated-opening preview/commit details. Remains **staging**, not production or implementation approval.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user**: Quick Start, Custom Opening and optional Guided Setup, with no mandatory setup steps. Moved to staging for refinement; not approved for production or implemented.
