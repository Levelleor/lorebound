---
id: "IDEA-0008"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Memory Lorebook and Context Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Reusable Scenario Templates and Placeholders

## Idea
Save reusable scenarios containing variables, world information and choices.

## Why this idea matters
Repeat a setting without duplicating a running save.

## Accepted direction
- **Reusable scenario templates:** Save a scenario definition that may be used to start multiple separate adventures without rebuilding its common setup.
- **Variable placeholders:** Support template parameters for names, roles, locations, and other reusable input values, filled when an adventure is created.
- **Optional lore and world setup:** Templates may contain applicable Lorebook entries, setting descriptions, NPC definitions, location/world information, and scenario choices, depending on enabled modules.
- **Optional structured starting state:** When the corresponding systems exist and are enabled, a template can specify initial characters, locations, inventory, relationships, and other validated starting conditions.
- **Fresh, independent adventures:** Each use creates its own adventure and initial state. Do **not** copy active turns, revisions, or the play history of any existing adventure merely by instantiating a template.
- **Simple prose-only use:** Users should be able to make basic templates without having to configure structured world systems or a large scenario editor.

This acceptance does not fix an import/export representation, editor UI, initial-state event schema, or the complete set of supported variables.

## Proposed behaviour
A player saves a reusable scenario containing a premise/opening instructions and optional parameter definitions. When the player starts from that template, Lorebound resolves the supplied placeholders, creates a distinct new adventure, copies or instantiates template-owned lore and optional initial entities/state, and leaves later player choices and narrative turns unique to that new adventure. Any enabled structured initial-state changes must use valid world-state identities and validation rules. The template itself remains reusable and unchanged by playthrough progress.

## Alternatives and trade-offs
A plain-text/template-data editor would be simpler and allow technical users to author scenarios; a visual form-based editor may be friendlier for nontechnical users. Both remain implementation options. Prompt-only templates are supported as the simple case, while structured scenarios add richer state but more validation and schema dependencies.

## Minimal-start dependency
- IDEA-0006 now explicitly permits adventure creation with **blank Custom Opening**, no named title (defaults to **`Untitled Adventure`**) and no mandatory Guided Setup fields. **Scenario templates remain optional** and must not become a prerequisite or compulsory preset for creating an adventure.
- Instantiating a chosen template still creates a fresh independent adventure with its own ID and no copied playthrough history; this decision does not add mandatory templates or new template import/export functionality.

## Optional generated starting Lorebook relationship
- **IDEA-0066 is separately accepted for later refinement:** A player may explicitly request a rich AI-generated starting Lorebook **before Turn 1**, independently of the reusable-scenario-template concept. Whether a generated world can later be saved as a reusable template or used with a template is **not approved or specified** yet.
- Existing scenario instantiation remains an optional alternative starting route. It must not become mandatory merely because optional pre-play world generation now exists, and templates should not implicitly auto-generate undocumented lore via the source-facts-only Custom Opening/Quick Start extractor (IDEA-0006).

## Dependencies and constraints
- Adventure creation and isolation should follow the accepted [[Adventure Save and Export Management]] (IDEA-0005).
- Starting a scenario must remain optional, consistent with [[Quick Start and Custom Story Openings]] (IDEA-0006).
- Character setup, entity-based Lorebook, location graphs, inventories, and other optional tracking modules are separately planned; a scenario should only instantiate structured data a compatible enabled module can represent.
- Stable entity IDs, references, and event provenance must be assigned per new adventure to prevent accidental cross-adventure state sharing.
- The template's static setup should be distinguishable from a played adventure's mutable event history, summaries, discovered locations, and completed turns.

## Open questions
- Should structured starting state be encoded as initial events, declarative entity snapshots, or another validated format?
- What data types, defaults, escaping, and validation rules apply to variable placeholders?
- How do template authors define optional choices and dependencies among chosen parameters?
- Can templates reference shared libraries or external Lorebook entries, or should each adventure receive private copies?
- How should missing plugins or incompatible template versions be reported?
- Which editor, import/export format and publishing/sharing workflows (if any) should exist?

## Draft acceptance criteria
- [ ] A user can save a reusable scenario definition and use it more than once.
- [ ] A template can contain a prompt/opening and placeholders that are resolved when creating an adventure.
- [ ] Simple prose-only templates work without configuring optional state modules.
- [ ] Optional scenario data can initialise compatible Lorebook/world content and structured starting state where supported.
- [ ] Each instantiation produces an independently playable/saveable adventure without copying existing playthrough turns or history.
- [ ] Editing or playing one instantiated adventure does not mutate the source template or other adventures from it.
- [ ] Invalid or unsupported structured starting state is handled explicitly rather than silently committing inconsistent world facts.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially an assistant-proposed option, subsequently explicitly accepted by the requesting user.
- Accepted for **staging/refinement**. Implementation and production approval are not claimed.

## Decisions and review history
- 2026-10-18 — **Dependency to accepted IDEA-0066:** A separate optional AI-built starting Lorebook/world may be created before Turn 1. Integration with reusable scenario templates is **unresolved** rather than silently included. Normal authored prose extraction remains source-grounded (IDEA-0006). Staging unchanged.
- 2026-10-17 — **Accepted IDEA-0006 minimal-start dependency:** Quick Start, blank Custom Opening and fully optional Guided Setup remain possible **without applying a scenario template**. Untitled adventures use the `Untitled Adventure` display fallback and still receive independent IDs. The reusable-template idea remains staging; the decision is not approval to require templates.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user**: reusable scenario templates, variable placeholders, optional Lorebook/world setup and structured starting state, producing fresh independent adventures without copied play history. Move to staging for refinement, not production.
