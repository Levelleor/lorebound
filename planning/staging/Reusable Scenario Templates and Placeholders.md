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

## Template instantiation copies independent starting lore and world records
- **Explicitly accepted Option A (2026-10-18):** Each time a reusable scenario template is instantiated, the new adventure receives its **own independent copies of the template-owned Lorebook entities and applicable initial world-state records**. This includes starting characters, locations, relationships, inventory and other compatible structured data where their systems are enabled, as well as selected premise/placeholder values. **Never retain live mutable references** from the new adventure back to the source template or to any adventure previously created from it.
- **Stable identity inside each copy, independent identity across copies:** Assign a new adventure identity and appropriate adventure-scoped entity/state identifiers to instantiated content. Rewrite/remap internal links coherently so starting characters, items, locations, relationships, and other validated references point **within the new adventure**, not at mutable shared-template records or sibling-adventure records. Exact identifier-generation/remapping mechanics remain an implementation detail.
- **No retrospective template propagation:** Changing, renaming or deleting the reusable **template after an adventure has been created** must **not automatically alter, erase or 'update'** that adventure's accepted Lorebook, world state or history. Conversely, changes made during one adventure must not mutate the template or any other adventure derived from it. Future instantiations may use the then-current template definition; existing adventure copies remain independent.
- **Not a saved-adventure duplicate:** A fresh template instance contains the selected **starting scenario**, not another adventure's already played narrative turns, accepted story history, event log or noncanonical input drafts. A template-owned source description is not necessarily a narrated or played Turn 1; do not fabricate game events solely to simulate cloning old play history. Validated starting facts may be established before story turns according to the accepted world-model/creation rules.
- **Consistency and compatibility:** Any initial state must pass the same applicable schema, relationship and gameplay validation rules as elsewhere. Creation should not expose a partially populated independent adventure if validation or transactional persistence fails. When a template references unavailable optional modules, the existing open question about omission/error handling remains for later refinement; **do not silently create inconsistent canonical starting facts**.
- **No added distribution feature:** Independence of instantiated content is a logical-copy policy **within the single Go-managed SQLite library**, not approval for separate per-adventure export/import, template publication, external shared-lore services or a multiple-database manager.

## Scenario templates can supply initial narration directions, not style presets
- **Accepted IDEA-0010 user revision (2026-10-18):** A scenario template may include **optional initial creative/writing inputs** such as genre, tone, viewpoint, setting guidance or author-note text, resolved along with its ordinary premise/placeholder data **when instantiating a new adventure**. These are **template-provided starting inputs**, not a separate saved narration-style preset management feature. No template or any of these inputs is compulsory for blank Custom Opening, Quick Start or ordinary play.
- **Adventure owns what it starts with:** After instantiation, template-provided narrative directions can inform the **new adventure's editable current settings and persistent author notes** (IDEA-0010/0025), in keeping with the accepted independent-copy policy. Later source-template edits do **not** live-update existing adventure settings, author notes, narration or story text.
- **Effective generation context:** On later AI narrative turns, the context builder uses the **adventure's currently applicable instructions and author notes**, including any originally supplied by the template and subsequently changed by the player. It must not look back to a live template or fetch a saved narration-style preset. Exact UI/field mapping and collision precedence among inputs remain a later refinement.
- **Separate concepts remain separate:** Reusing a **scenario template** reproduces a starting scenario/world and optional initial instructions; a removed narration-style preset would have reused only style settings. Provider/model sampling presets (IDEA-0016) are also unrelated and remain independently scoped.

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
- **Resolved for template-owned Lorebook and starting state:** Every instantiated adventure gets **independent private copies**, not live shared mutable references to the template or sibling adventures. Whether templates may *author* references to external content before instantiation remains open only as a future separately evaluated input capability; it must not compromise private copies once an adventure is created.
- How should missing plugins or incompatible template versions be reported?
- Which editor, import/export format and publishing/sharing workflows (if any) should exist?

## Draft acceptance criteria
- [ ] A scenario template may optionally provide starting narration directions/author-note input to a new adventure; the adventure uses **its own editable copy**, with no separate style-preset manager or live template-to-adventure linkage.
- [ ] Later template edits do not change instantiated adventures' current narration settings/notes or past story, and subsequent AI turns use each adventure's then-current instructions.
- [ ] Instantiate the same template twice and obtain **two distinct adventure identities**, each with its **own Lorebook character/location/item/relationship records and applicable validated starting state**, with internal references resolved to that adventure's own records.
- [ ] Editing or deleting the source template afterward **does not update or remove** previously instantiated adventures' lore, state or history. Editing either new adventure does not change the other adventure or the template.
- [ ] Instantiation does **not copy the played turns/history or unconfirmed drafts** from an existing adventure; it starts fresh with template-defined premise and optional validated initial content.
- [ ] Broken/unsupported template starting references cannot leave an accepted half-created set of records, and no template instance holds mutable links to another adventure's canonical records.
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
- 2026-10-18 — **IDEA-0010 user refinement dependency:** Reusable scenario templates can supply optional **starting narration/style instructions** to a newly instantiated adventure, whose current settings and author notes then steer each AI narrative turn. Do not create a separate narration-style preset feature or live-link already created adventures to template changes. Staging only.
- 2026-10-18 — **User explicitly accepted IDEA-0008 Option A:** Template-instantiated adventures receive **independent private copies** of the template-owned Lorebook characters, places, relationships, world information and compatible starting state, with coherent adventure-scoped IDs and references. Neither template edits nor sibling-adventure changes retroactively propagate. No live shared lore references, no copied played history or new file export/import. Implementation particulars and unsupported-module handling remain open; staging only.
- 2026-10-18 — **Dependency to accepted IDEA-0066:** A separate optional AI-built starting Lorebook/world may be created before Turn 1. Integration with reusable scenario templates is **unresolved** rather than silently included. Normal authored prose extraction remains source-grounded (IDEA-0006). Staging unchanged.
- 2026-10-17 — **Accepted IDEA-0006 minimal-start dependency:** Quick Start, blank Custom Opening and fully optional Guided Setup remain possible **without applying a scenario template**. Untitled adventures use the `Untitled Adventure` display fallback and still receive independent IDs. The reusable-template idea remains staging; the decision is not approval to require templates.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user**: reusable scenario templates, variable placeholders, optional Lorebook/world setup and structured starting state, producing fresh independent adventures without copied play history. Move to staging for refinement, not production.
