---
type: architecture
status: evolving
created: "2026-10-19"
updated: "2026-10-19"
tags:
  - planning/architecture
---
# Subsystem Mapping Register

## Purpose and authority

This register records **explicitly accepted Pass A subsystem mappings** for Lorebound's existing staging ideas. It is an architectural inventory, **not** an implementation specification or an approval to implement. All referenced ideas remain in `planning/staging/` until they independently pass the existing staging → production approval gate. Nothing here asserts that these subsystems have been implemented.

Map ideas individually in IDEA-ID order. For each approved idea, record its primary owner, secondary touchpoints, architectural boundary and key dependency/overlap. Acceptances are recorded only after explicit user confirmation. New mappings may propose refinements to the tentative subsystem vocabulary but do not silently alter prior accepted mappings.

## Accepted mappings

### IDEA-0001 — Single-Player Account-Free Experience

- **Source:** [[Single-Player Account-Free Experience]] (`planning/staging/Single-Player Account-Free Experience.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Application Foundation & Lifecycle
- **Secondary subsystems:** Runtime & Platform Services; Adventure Library & Persistence; AI Provider Integration
- **Classification:** Cross-cutting architectural requirement; not a standalone feature module.
- **Responsibility:** Define single-user/account-free, locally usable application fundamentals. Supported non-AI activity must remain available without configured/reachable AI. Adventure histories and state remain logically isolated.
- **Boundary:** Runtime handles the single Wails v3 headless localhost Go server and application lifecycle; persistence owns SQLite and adventure separation; provider integration owns optional AI availability and failure handling. This mapping does **not** add an account subsystem or a separate offline engine.
- **Key idea dependencies:** IDEA-0053 (runtime/startup), IDEA-0051 (database), IDEA-0013 (local model connections), IDEA-0014 (provider profiles).
- **Deferred:** Runtime packaging/startup, local-model onboarding and storage implementation belong to their dedicated staging ideas.

### IDEA-0002 — Freeform Player Action Modes

- **Source:** [[Freeform Player Action Modes]] (`planning/staging/Freeform Player Action Modes.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Narrative Interaction & Intent
- **Secondary subsystems:** Adventure Coordinator; Character & Scene State; Presentation & UX; World Rules & Validation
- **Classification:** Core gameplay interaction feature with consequences for turn interpretation and state authority.
- **Responsibility:** Define four structured interaction modes: **Do** (selected-character action attempt), **Say** (selected-character dialogue), **Story** (direct player authorship), **Continue** (autonomous narrative progression). Distinguish player intent, acting character and source of authority.
- **Boundary:** Mode/actor/authority should be explicit structured input to the Lore Engine, not inferred solely from prose. Do/Say require an explicit `Playing As` character; Story/Continue do not. The player's explicit Story assertions may override fictional simulation constraints, but never stable-identity, schema, reference, revision, transactional or persistence integrity. Do/Say attempts and AI-generated Continue do not inherit this override.
- **Key idea dependencies:** IDEA-0007 (character creation/Playing As), IDEA-0026 (shared characters), IDEA-0034 (character scene/presence), IDEA-0044 (coordinator), IDEA-0045 (interpreter), IDEA-0047 (capability validation), IDEA-0062 (composer/interface).
- **Deferred:** Specific TypeScript contract, prompting, shortcuts and UI placement. Composer drawer behaviour belongs primarily to the related UI idea rather than this subsystem.

### IDEA-0003 — Direct Editable Prose Document

- **Source:** [[Direct Editable Prose Document]] (`planning/staging/Direct Editable Prose Document.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Narrative Document & Editing
- **Secondary subsystems:** Narrative History & Versioning; Adventure Coordinator; Persistence & Draft Management; World State Reconstruction; Presentation & UX
- **Classification:** Core document editing capability spanning canonical history and replay.
- **Responsibility:** Treat story text as freely editable prose, including earlier passages, with a draft-first edit/confirmation flow. Editable document state is distinct from canonical narrative history.
- **Boundary:** The editor owns editing operations and logical passage boundaries. Narrative History & Versioning owns accepted passage-level identities, revisions and source provenance; individual paragraphs do **not** have canonical revision identities. Pending edits remain latest-only noncanonical SQLite drafts, not committed world changes. Historical reconciliation occurs only after explicit confirmation via the coordinator; later prose is not silently regenerated.
- **Key idea dependencies:** IDEA-0005 (draft autosave), IDEA-0039 (event history), IDEA-0040 (passage revisions), IDEA-0041 (historical edit choice), IDEA-0042 (state rebuild), IDEA-0051 (SQLite).
- **Deferred:** Editor library, whole-passage move/split/merge ID rules, pending-change UX and crash/conflict handling. Do not duplicate IDEA-0040's revision semantics inside the editor.

### IDEA-0004 — Retry Undo and Alternative Continuations

- **Source:** [[Retry Undo and Alternative Continuations]] (`planning/staging/Retry Undo and Alternative Continuations.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Narrative History & Versioning
- **Secondary subsystems:** Adventure Coordinator; AI Generation Pipeline; World State Reconstruction; Narrative Document & Editing; Persistence & Draft Management; Presentation & UX
- **Classification:** Core single-timeline history management with provisional generation and rollback interactions.
- **Responsibility:** Keep one active canonical sequence per adventure. **Retry** replaces and immediately discards the prior uncommitted AI candidate, with no stored/selectable candidate variants. **Temporary editor Undo** is bounded and noncanonical. **Committed Undo** moves the active head backward one turn at a time and deterministically restores the corresponding complete canonical state, potentially all the way to the baseline.
- **Boundary:** Narrative History & Versioning owns canonical head/rollback semantics; AI Generation Pipeline owns provisional candidate replacement; Narrative Document & Editing owns short-lived edit undo; World State Reconstruction restores all affected state; Go/SQLite persistence must enforce expected-version checked atomic rollback through the coordinator. Committing a different future after Undo does not create selectable in-adventure branches; preserving both futures requires an independent adventure Fork (IDEA-0011). Quick Start's separately accepted automatic first-turn commit is unchanged.
- **Key idea dependencies:** IDEA-0003 (editing), IDEA-0005 (drafts/saves), IDEA-0011 (fork), IDEA-0039 (event history), IDEA-0040 (revisions), IDEA-0041 (historical edits), IDEA-0042 (reconstruction), IDEA-0044 (coordinator), IDEA-0051 (SQLite).
- **Deferred:** How inactive audit/event records are retained, how stale rollback cancels in-flight generation, concurrency conflict UX and temporary-versus-committed Undo UI. Inactive provenance is **not** a playable alternative or a promised Redo mechanism.

### IDEA-0005 — Adventure Save and Export Management

- **Source:** [[Adventure Save and Export Management]] (`planning/staging/Adventure Save and Export Management.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Adventure Library & Persistence
- **Secondary subsystems:** Persistence & Draft Management; Narrative History & Versioning; World State Reconstruction; Runtime & Platform Services; Presentation & UX
- **Classification:** Core adventure lifecycle and data-management feature.
- **Responsibility:** Create, list/resume, rename, full-history duplicate and permanently delete individual adventure records within one shared SQLite library. Keep debounced unfinished drafts noncanonical and persist validated committed turns/revisions and world changes atomically. Whole-database Backup/Restore are the only file-based transfer operations.
- **Boundary:** Adventure Library & Persistence owns user-visible operations on individual adventures. Persistence & Draft Management owns draft autosave and transactions; Narrative History & Versioning and World State Reconstruction ensure a duplicate has all committed provenance and reconstructible state, but no pending drafts or credentials. Runtime & Platform Services uses the Go-managed SQLite database, handles atomic deletion, consistent complete-library snapshots and deliberate complete-library replacement. No per-adventure file export/import, recycle bin, merging or automatic pre-deletion backup is implied.
- **Key idea dependencies:** IDEA-0001 (account-free independent adventures), IDEA-0003 (draft prose), IDEA-0011 (fork), IDEA-0039 (event history), IDEA-0040 (revision provenance), IDEA-0042 (reconstruction), IDEA-0051 (shared SQLite), IDEA-0052 (backup/restore/storage), IDEA-0053 (Go runtime).
- **Deferred:** Concrete APIs for draft retirement, duplication ID/remapping, deletion and restore; backup/restore mechanics belong to IDEA-0052 and SQLite architecture belongs to IDEA-0051. IDEA-0006 owns blank and Quick Start opening behaviour.

### IDEA-0006 — Quick Start and Custom Story Openings

- **Source:** [[Quick Start and Custom Story Openings]] (`planning/staging/Quick Start and Custom Story Openings.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Adventure Initialization & Setup
- **Secondary subsystems:** Adventure Library & Persistence; AI Generation Pipeline; Adventure Coordinator; World Rules & Validation; Presentation & UX
- **Classification:** Adventure creation and initial canonical world/story setup.
- **Responsibility:** Offer Quick Start with a short premise, optionally blank or authored Custom Opening, and skippable Guided Setup; require neither character/world questionnaire, title nor initial prose. The first fully generated, validated Quick Start opening is automatically committed with supported initial world facts in one atomic turn, without an additional Accept click. Committed player-authored opening prose may produce only grounded, explicitly supported, validated facts; unfinished drafts never trigger canonical changes. Blank adventures are valid with no model connection, using the display name `Untitled Adventure` where necessary.
- **Boundary:** Initialization owns starting paths and first-turn semantics. The AI Generation Pipeline generates provisional material; the coordinator validates and commits; persistence creates the stable independent adventure; world validators prevent invented lore during fact extraction. Optional intentionally generated pre-turn Lorebook material belongs to IDEA-0066, not to prose fact extraction. No partial or cancelled generation is committed.
- **Key idea dependencies:** IDEA-0005 (adventure save), IDEA-0018 (generation strategy), IDEA-0020 (Lorebook), IDEA-0044 (coordinator), IDEA-0045 (proposed state operations), IDEA-0051 (SQLite), IDEA-0066 (optional starting world generation).
- **Deferred:** Setup UX, guided choices, extraction schema, prompting and failure/unsupported-fact handling.

### IDEA-0007 — Character Creation and Starting Choices

- **Source:** [[Character Creation and Starting Choices]] (`planning/staging/Character Creation and Starting Choices.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Character & Scene State
- **Secondary subsystems:** Adventure Initialization & Setup; Entity-Based Lorebook; Narrative Interaction & Intent; Presentation & UX; World Rules & Validation
- **Classification:** Optional character authoring and actor selection.
- **Responsibility:** Support flexible freeform character attributes without compulsory race/class/stats or any required character at adventure creation. Characters share a single unclassified stable entity model. Persist `Playing As` as a nullable, per-adventure explicitly chosen Lorebook character reference: Do/Say require it; Story/Continue do not. Creation and Add Character do not automatically select an actor or create gameplay events.
- **Boundary:** Character & Scene State owns character identity and state; Lorebook owns its editable record; settings/presentation own deliberate actor selection and the UI; interaction modes consume the selected actor. Optional inventory/location attributes must be represented and validated by their enabled authoritative systems, not silently fabricated.
- **Key idea dependencies:** IDEA-0002 (Do/Say actor), IDEA-0006 (skippable setup), IDEA-0020 (Lorebook), IDEA-0026 (unclassified characters), IDEA-0027 (custom status), IDEA-0034 (presence/location).
- **Deferred:** Editor layout, optional RPG schemas, advanced starting attributes and structured state UI.

### IDEA-0008 — Reusable Scenario Templates and Placeholders

- **Source:** [[Reusable Scenario Templates and Placeholders]] (`planning/staging/Reusable Scenario Templates and Placeholders.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Scenario Templates & Configuration
- **Secondary subsystems:** Adventure Initialization & Setup; Adventure Library & Persistence; Entity-Based Lorebook; Character & Scene State; World Rules & Validation
- **Classification:** Reusable parameterized adventure-start configurations.
- **Responsibility:** Store reusable scenario definitions with placeholders and optional setup prose, Lorebook, characters, locations and validated initial state. Template instantiation creates a fresh, independent adventure with its own identity and newly coherent stable references; it never copies an existing adventure's played turns, active revisions or live history. Prose-only templates remain possible without mandatory structured modules.
- **Boundary:** Scenario Templates owns definition/parameter substitution; Initialization orchestrates instantiation; Adventure Library creates independent saves; entity/world modules validate optional structured seed records. Templates are starting material, not mutable played history.
- **Key idea dependencies:** IDEA-0005 (adventure separation), IDEA-0006 (optional start), IDEA-0007 (characters), IDEA-0020 (Lorebook), IDEA-0026 (character identities), IDEA-0033 (location identities).
- **Deferred:** Template representation and UI, supported placeholder types, import/export policy and initial event/schema details.

### IDEA-0010 — Narration Style and Perspective Controls

- **Source:** [[Narration Style and Perspective Controls]] (`planning/staging/Narration Style and Perspective Controls.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Narrative Generation Configuration
- **Secondary subsystems:** AI Generation Pipeline; AI Context & Prompt Construction; Presentation & UX; Adventure Library & Persistence
- **Classification:** Noncanonical configuration of future AI narration.
- **Responsibility:** Manage current perspective, tense, genre, tone, pacing, response-length preference and custom stylistic instructions. Apply to subsequent generations only: changing style neither retroactively rewrites committed prose nor changes canonical world facts. Do not create a separate saved narration-style preset system.
- **Boundary:** Narrative Generation Configuration owns preferences; Context & Prompt Construction selects/transmits applicable instructions; Generation Pipeline enforces supported provider/model request parameters; Presentation & UX provides controls; persistence stores applicable settings outside event history. Style guidance does not override deterministic game-world constraints or provider-level decoding controls.
- **Key idea dependencies:** IDEA-0008 (optional scenario-provided setup), IDEA-0016 (separate sampling parameters), IDEA-0018 (generation pipeline), IDEA-0024 (context builder), IDEA-0025 (persistent author notes).
- **Deferred:** UI controls, prompt precedence/adherence and model-specific length limits. No narration-style preset library.

### IDEA-0011 — Manual Generation Branches

- **Source:** [[Manual Generation Branches]] (`planning/staging/Manual Generation Branches.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Adventure Library & Persistence
- **Secondary subsystems:** Narrative History & Versioning; World State Reconstruction; Adventure Coordinator; Presentation & UX
- **Classification:** Independent adventure fork, not an in-adventure branching mechanic.
- **Responsibility:** Fork a source adventure at a chosen committed history point into a new independent saved adventure with the appropriate committed narrative/revision history and matching canonical world state. Future changes diverge independently; the source's later prose/state remain untouched. Present the fork as a separate adventure in the library.
- **Boundary:** Adventure Library owns creation and isolation of the fork; History & Versioning defines the source boundary and provenance; Reconstruction provides consistent state at that point; the coordinator validates/coordinates and persistence atomically stores the new adventure. Do not introduce branch graphs, branch switching, retained AI variants or an in-story timeline tree. Retry and committed Undo (IDEA-0004) remain distinct.
- **Key idea dependencies:** IDEA-0004 (retry/undo distinction), IDEA-0005 (library and duplication), IDEA-0039 (event history), IDEA-0040 (revision IDs), IDEA-0042 (state rebuild), IDEA-0051 (SQLite).
- **Deferred:** Fork-point UX, ID/reference remapping, provenance conventions and snapshot/replay implementation.

## Next pending mapping

- Next batch: five staging ideas after IDEA-0011, exact IDs to be verified. **Not yet accepted in Pass A.**

## Process

1. Present one or a requested batch of staging idea subsystem mappings, with boundaries/dependencies per idea.
2. Wait for explicit acceptance or requested adjustments, which may apply to the batch or individual ideas.
3. **Immediately write every accepted mapping to this register in GitHub before proceeding to the next unreviewed idea/batch.**
4. Keep source staging ideas in place and refrain from production promotion, code changes or specification claims unless separately authorised.
