---
id: "IDEA-0006"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Quick Start and Custom Story Openings

## Idea
Start from a quick premise or a fully custom initial story prompt.

## Why this idea matters
Allows immediate play and detailed scenario authorship.

## Accepted direction
Lorebound will offer three starting paths for a new adventure, without compulsory multi-step setup:

- **Quick Start:** A player can enter a short premise and begin an adventure promptly, with the AI optionally producing the opening narrative.
- **Custom Opening:** A player can provide their own opening prose or detailed initial scenario rather than relying on AI-generated introductory text.
- **Optional Guided Setup:** A player may choose genre, setting, starting situation and other relevant options to help create an introduction. Guided steps are optional and can be skipped.
- **No mandatory setup steps:** Detailed character creation, map setup, world configuration or guided forms must not be prerequisites for starting an adventure.
- **Independent save:** Each new adventure should enter the same independent save/resume system accepted under [[Adventure Save and Export Management]] (IDEA-0005).

The three entry paths are accepted. Specific prompts, setup fields, generated content policy, and UI layout remain for refinement.

## Proposed behaviour
From the new-adventure interface, the player chooses Quick Start, Custom Opening or Guided Setup. Quick Start can take a concise freeform premise and ask the narrator to establish an initial scene. Custom Opening takes user-authored prose as the beginning of the editable story, then permits continuation. Guided Setup collects only chosen optional details and can create an AI-assisted opening. Every path creates a normal independent adventure that can be resumed later.

## Alternatives and trade-offs
Entirely open input offers maximum freedom; suggested genre/setting presets can make guided setup easier but are not mandatory or yet specified. Whether guided setup is a wizard, expandable optional fields, or another interface remains open. AI-generated opening text is optional, not required for a player-written start.

## Dependencies and constraints
- Depends on a configured narrator/model to generate text when the player requests AI-assisted opening; custom prose need not require generation to initialise a story document.
- Must integrate with independent adventure creation and persistence as described by [[Adventure Save and Export Management]].
- Detailed character creation, scenario templates, lorebook/world presets and map state have separate idea documents and are not implicitly approved by this acceptance.
- Avoid silently imposing gameplay/RPG requirements or multi-step questionnaires on a user who wants to start writing.

## Open questions
- What minimal information, if any, is required to create and name an adventure?
- Can the player begin with completely blank prose, or is a starting premise required only for AI Quick Start?
- Should Guided Setup offer built-in genre/setting presets, and can every field be skipped?
- Does the generated opening get presented as a reviewable draft before being committed to the adventure?
- How are initial world facts proposed and validated when the AI creates the opening scene?

## Draft acceptance criteria
- [ ] A player can initiate a new adventure using Quick Start with a short freeform premise.
- [ ] A player can create an adventure beginning with their own written opening and continue from it.
- [ ] A player can optionally provide guided genre/setting/situation details for an AI-assisted opening.
- [ ] Guided setup can be bypassed; completing a lengthy form or character/world setup is not compulsory.
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
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user**: Quick Start, Custom Opening and optional Guided Setup, with no mandatory setup steps. Moved to staging for refinement; not approved for production or implemented.
