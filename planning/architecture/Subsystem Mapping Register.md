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

## Next pending mapping

- IDEA-0005 — Adventure Save and Export Management. **Not yet reviewed or accepted in Pass A.**

## Process

1. Present one staging idea's proposed subsystem mapping and related boundaries/dependencies.
2. Wait for explicit acceptance or requested adjustments.
3. **Immediately write the accepted mapping to this register in GitHub before presenting the next idea.**
4. Keep source staging ideas in place and refrain from production promotion, code changes or specification claims unless separately authorised.
