---
id: PRD-0009
type: prd
status: accepted
related:
- NOTE-0024
- PRD-0001
- NOTE-0009
- NOTE-0013
---

# Reusable Scenario Templates and Placeholders

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0008](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Reusable%20Scenario%20Templates%20and%20Placeholders.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S02**. First milestone: **M7**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Latest accepted event and narrative authority — 2026-10-28

**Current starting-world representation ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Template-instantiated initial world facts become a separately owned, **declarative Turn-0 baseline**, not a simulated series of actions requiring earlier custody/travel prerequisites. Stable/sparse entity IDs, grounded defaults and technical consistency survive. New stories remain independent copies. A template may supply enough facts to set an item's holder without inventing its prior transfer history; missing attributes remain unknown.


## Accepted direction
- **Reusable scenario templates:** Save a scenario definition that may be used to start multiple separate adventures without rebuilding its common setup.
- **Variable placeholders:** Support template parameters for names, roles, locations, and other reusable input values, filled when an adventure is created.
- **Optional lore and world setup:** Templates may contain applicable Lorebook entries, setting descriptions, NPC definitions, location/world information, and scenario choices, depending on enabled modules.
- **Optional structured starting state:** When the corresponding systems exist and are enabled, a template can specify initial characters, locations, inventory, relationships, and other validated starting conditions.
- **Fresh, independent adventures:** Each use creates its own adventure and initial state. Do **not** copy active turns, revisions, or the play history of any existing adventure merely by instantiating a template.
- **Simple prose-only use:** Users should be able to make basic templates without having to configure structured world systems or a large scenario editor.

This acceptance does not fix an import/export representation, editor UI, initial-state event schema, or the complete set of supported variables.

## Dependencies and constraints
- Adventure creation and isolation should follow the accepted Adventure Save and Export Management (IDEA-0005).
- Starting a scenario must remain optional, consistent with Quick Start and Custom Story Openings (IDEA-0006).
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

## Supporting detail

See [NOTE-0024](../knowledge/inbox/NOTE-0024-prd-0009-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
