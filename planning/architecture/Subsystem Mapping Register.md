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

### IDEA-0012 — Cloud LLM Provider Connectors

- **Source:** [[Cloud LLM Provider Connectors]] (`planning/staging/Cloud LLM Provider Connectors.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** AI Provider Integration
- **Secondary subsystems:** AI Generation Pipeline; Provider Connection Management; Model Capability Management
- **Classification:** External AI model transport/adapters.
- **Responsibility:** Support browser-side cloud generation through four accepted provider families: OpenAI, Anthropic, Google Gemini and OpenRouter. Present a common generation and streaming contract across genuinely compatible adapters while preserving provider-specific differences, errors and capabilities.
- **Boundary:** AI Provider Integration handles protocol conversion, transport, streaming and provider errors. Connection Management owns profile/credential configuration; Capability Management owns supported controls; the Coordinator alone permits canonical turn/state commit. OpenRouter is a broad model gateway rather than an implied direct connector for every model vendor. No additional first-party cloud connectors are approved by this mapping.
- **Key idea dependencies:** IDEA-0013 (local provider parity), IDEA-0014 (profiles/secrets), IDEA-0015 (capabilities), IDEA-0017 (model routing), IDEA-0018 (generation strategies).
- **Deferred:** Precise adapter interfaces/SDKs, per-provider API coverage, compatibility tests and model discovery mechanics.

### IDEA-0013 — Local LLM Server Connections

- **Source:** [[Local LLM Server Connections]] (`planning/staging/Local LLM Server Connections.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** AI Provider Integration
- **Secondary subsystems:** Provider Connection Management; Model Capability Management; AI Generation Pipeline
- **Classification:** Local/LAN AI model transport/adapters.
- **Responsibility:** Connect to user-running Ollama, LM Studio, vLLM and llama.cpp/llama-server endpoints plus explicitly configured compatible local or LAN servers. Use the same internal generation abstraction as cloud models, including supported streaming and useful errors; a single locally loaded model must suffice for all ordinary tasks.
- **Boundary:** AI generation/model discovery requests originate in the browser using the actual browser origin, **not** an implicit Go proxy or local bridge. CORS, browser security and private-network restrictions are explicit deployment constraints, not hidden by the adapter. No built-in model download/installation service or automatic public exposure is implied.
- **Key idea dependencies:** IDEA-0012 (shared abstraction), IDEA-0014 (connection profiles), IDEA-0015 (capabilities), IDEA-0017 (one-model routing), IDEA-0053 (browser/Go runtime).
- **Deferred:** Local-server compatibility matrices, endpoint discovery variations, streaming formats and concrete connection diagnostics.

### IDEA-0014 — Provider Connection Profiles and Discovery

- **Source:** [[Provider Connection Profiles and Discovery]] (`planning/staging/Provider Connection Profiles and Discovery.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Provider Connection Management
- **Secondary subsystems:** AI Provider Integration; Runtime & Platform Services; Credential & Secret Storage; Presentation & UX
- **Classification:** Reusable model connection configuration with separate credential ownership.
- **Responsibility:** Manage named profiles, endpoint/base URLs, model discovery or manual IDs, multiple independent per-profile credentials/secret headers, connection testing and timeout/retry preferences. The primary accepted credential persistence is native OS vault access through a cross-platform Go keyring adapter. Where unavailable, allow only an expressly consented AES-256-GCM encrypted credential sidecar adjacent to the active SQLite library with a separately stored random key in private OS config.
- **Boundary:** Nonsecret profile/configuration data remains separate from noncanonical credentials. The credential vault/sidecar/key are excluded from whole-library SQLite backups. Browser-side provider requests must not leak secrets into logs, narrative prompts or diagnostics. Go may own credential storage access but not secretly proxy model requests. Connection tests/model discovery use the actual browser origin and are subject to browser CORS/private-network rules.
- **Key idea dependencies:** IDEA-0001 (account-free experience), IDEA-0005 (backup boundary), IDEA-0012 (cloud connectors), IDEA-0013 (local connectors), IDEA-0015 (capabilities), IDEA-0051 (SQLite), IDEA-0053 (Go/browser runtime).
- **Deferred:** Credential API, keyring availability/failure handling, consent UX, connection discovery cache and retries for ambiguous request success.

### IDEA-0015 — Model-Capability-Aware Controls

- **Source:** [[Model-Capability-Aware Controls]] (`planning/staging/Model-Capability-Aware Controls.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Model Capability Management
- **Secondary subsystems:** AI Provider Integration; Narrative Generation Configuration; Presentation & UX
- **Classification:** Per-provider/model/endpoint parameter compatibility and effective-request policy.
- **Responsibility:** Classify each applicable model capability as **supported**, **unsupported**, **ignored** or **unknown**. Reflect the assessment in UI availability and actual request parameters. Omit unsupported parameters from normal requests even where stored preferences exist; permit deliberate, visibly warned and narrowly scoped expert override without silently rewriting preferred settings.
- **Boundary:** Capability Management describes/assesses model support and controls omission/overrides. Generation Configuration stores player intent and values; provider adapters translate and send effective values. Successful HTTP requests do not prove the provider applied a parameter. Effective-request inspection must distinguish preferred from transmitted/effective settings and redact credentials.
- **Key idea dependencies:** IDEA-0012 (cloud), IDEA-0013 (local), IDEA-0014 (profiles), IDEA-0016 (sampling/preferences).
- **Deferred:** Metadata/probing sources, unknown/ignored policies, cache invalidation, evidence of parameter effect and override UX.

### IDEA-0016 — Sampling Presets and Advanced Parameters

- **Source:** [[Sampling Presets and Advanced Parameters]] (`planning/staging/Sampling Presets and Advanced Parameters.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Narrative Generation Configuration
- **Secondary subsystems:** Model Capability Management; Provider Connection Management; AI Provider Integration; Presentation & UX
- **Classification:** Persistent desired generation parameters, including provider/model-specific presets.
- **Responsibility:** Support basic and advanced decoding/sampling controls (when applicable), reusable named model-specific generation presets, preservation of preferred values on model changes, inspected effective requests, and guarded provider-specific custom JSON.
- **Boundary:** Narrative Generation Configuration owns player-preferred parameters/presets; Model Capability Management decides support/omission/advanced overrides; AI Provider Integration performs provider-specific mapping and transport; Connection Management associates the preferences with the appropriate selected model/profile. Unlike IDEA-0010's narration style preferences, these are decoding/API request parameters and do not mutate canon.
- **Key idea dependencies:** IDEA-0010 (separate narration style), IDEA-0012 (cloud adapters), IDEA-0013 (local adapters), IDEA-0014 (profiles), IDEA-0015 (capability states), IDEA-0017 (task/model routing).
- **Deferred:** Exact parameter catalogue, ranges/defaults, JSON safety/validation, provider translations and diagnostics UI.

### IDEA-0017 — One-Model Task Routing

- **Source:** [[One-Model Task Routing]] (`planning/staging/One-Model Task Routing.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** AI Task Routing & Model Selection
- **Secondary subsystems:** Provider Connection Management; AI Generation Pipeline; Model Capability Management; Narrative Generation Configuration
- **Classification:** AI task-to-model binding and resolution.
- **Responsibility:** Resolve supported roles, initially narration/writing, state interpretation and summarisation, to selected **connection/profile plus model ID**. A single cloud/local model shared sequentially among roles and distinct models across a single or multiple providers are equally normal configurations. Unassigned tasks may use a convenient primary/fallback route without duplicating credentials.
- **Boundary:** Routing answers **which model performs a task**, not which tasks/passes execute. Pipeline strategy owns pass selection and ordering (IDEA-0018); Connection Management owns provider profiles; Capability Management and Generation Configuration supply relevant features and preferences. No extra loaded model is required merely by selecting a pipeline.
- **Key idea dependencies:** IDEA-0012 (cloud adapters), IDEA-0013 (local adapters), IDEA-0014 (profiles), IDEA-0015 (capabilities), IDEA-0016 (sampling), IDEA-0018 (pipeline stages).
- **Deferred:** Global/per-adventure routing scopes and precedence, fallback when an assigned model is unavailable, additional roles and usage attribution.

### IDEA-0018 — Configurable Generation Pipeline Strategies

- **Source:** [[Configurable Generation Pipeline Strategies]] (`planning/staging/Configurable Generation Pipeline Strategies.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** AI Generation Pipeline
- **Secondary subsystems:** AI Task Routing & Model Selection; Adventure Coordinator; World Rules & Validation; Narrative History & Versioning
- **Classification:** Configurable provisional generation workflow and stage orchestration.
- **Responsibility:** Support three separate selectable strategies: **single-pass prose and events**, **plan → validate → narrate**, and **draft → audit → repair**. Every strategy may use one model across sequential stages or distinct task-assigned models. Model-proposed actions remain provisional until deterministically validated; repair/retries are bounded and failure is explicit.
- **Boundary:** The pipeline chooses which generation/analysis passes run and their sequencing, while Task Routing chooses each task's model. The Adventure Coordinator and validators remain authoritative for permitted operations and atomic canonical commit. A partial, rejected or cancelled stage result never becomes accepted prose/state. Strategy changes affect future turns only; no default strategy is yet approved.
- **Key idea dependencies:** IDEA-0004 (retry), IDEA-0017 (routing), IDEA-0019 (streaming/cancellation), IDEA-0039 (event history), IDEA-0044 (coordinator), IDEA-0045 (operation proposals), IDEA-0046 (typed rejection/repair).
- **Deferred:** Preferred default strategy, stage contracts, structured output fallback, repair budgets and inconsistent prose/state failure policies.

### IDEA-0019 — Streaming Cancellation and Generation Diagnostics

- **Source:** [[Streaming Cancellation and Generation Diagnostics]] (`planning/staging/Streaming Cancellation and Generation Diagnostics.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Generation Lifecycle & Diagnostics
- **Secondary subsystems:** AI Generation Pipeline; AI Provider Integration; Adventure Coordinator; Persistence & Draft Management; Presentation & UX
- **Classification:** In-progress generation attempt control, observation and reporting.
- **Responsibility:** Stream supported provisional text, offer cancellation, track waiting/generating/validating/auditing/completed/cancelled/failed stages and show model, provider, effective settings, errors, available token/usage data and timing. Distinguish observed measurements from estimates/unavailable information; redact credentials.
- **Boundary:** Generation Lifecycle manages and observes **attempts**, not canonical history. Cancellation must invalidate late results and all downstream work from a cancelled attempt, even if the remote server continues computation. The coordinator and persistence remain responsible for preventing incomplete prose/events from committing and for preserving previously accepted state.
- **Key idea dependencies:** IDEA-0004 (provisional retry), IDEA-0005 (draft persistence), IDEA-0012 (cloud streaming), IDEA-0013 (local streaming), IDEA-0017 (routing), IDEA-0018 (pipeline), IDEA-0044 (coordinator).
- **Deferred:** Stage cancellation propagation, pending stream recovery, log retention, billing after provider-side abort and aggregating usage across models/stages.

### IDEA-0020 — Entity-Based Lorebook

- **Source:** [[Entity-Based Lorebook]] (`planning/staging/Entity-Based Lorebook.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Entity-Based Lorebook
- **Secondary subsystems:** Character & Scene State; World Rules & Validation; AI Context & Prompt Construction; Adventure Library & Persistence; Presentation & UX
- **Classification:** Durable typed lore, knowledge and player-directed context selection.
- **Responsibility:** Store editable lore for characters, places, objects, factions and other concepts, with stable linked entity IDs, flexible prose, and distinctions between established facts and attributed beliefs/rumours. Support player-controlled manual inclusion/exclusion of entries for model context with visible selection and honest budget omissions.
- **Boundary:** Lorebook owns persistent descriptive/knowledge records, **not competing authoritative mutable copies** of live location, inventory, possession or other world state; those must link to domain entities. AI Context & Prompt Construction decides prompt inclusion while respecting manual exclusions. Automatic rules-based activation (IDEA-0021) and semantic RAG (unaccepted IDEA-0063) are separate capabilities, not implied by this mapping.
- **Key idea dependencies:** IDEA-0007 (character creation), IDEA-0021 (conditional activation), IDEA-0024 (context budget), IDEA-0026 (shared character identities), IDEA-0033 (locations), IDEA-0045 (interpreted operations).
- **Deferred:** Fact/belief reliability schema, entry taxonomies, field-level selection and rename/merge/delete reference semantics.

### IDEA-0021 — Conditional Lorebook Activation

- **Source:** [[Conditional Lorebook Activation]] (`planning/staging/Conditional Lorebook Activation.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** AI Context & Prompt Construction
- **Secondary subsystems:** Entity-Based Lorebook; World Rules & Validation; Presentation & UX
- **Classification:** Deterministic rules-driven Lorebook context selection.
- **Responsibility:** Evaluate optional keyword, alias, location and logical-state triggers to propose Lorebook entries for the current generation request. Prioritise eligible entries and expose rule matches, inclusions and omissions; manual exclusions override automatic matches, and manually requested entries may be excluded by finite context size only with an explicit warning.
- **Boundary:** Activation is a **context-selection** concern and never commits world state, proves a rumour, or forces embeddings. Lorebook owns entries and the player's manual selection; World Rules & Validation provides trusted state for conditions; Context & Prompt Construction applies selection and budget policies. Embedding/RAG retrieval (IDEA-0063) remains an unaccepted separate idea.
- **Key idea dependencies:** IDEA-0020 (Lorebook/manual controls), IDEA-0024 (token budget/inspection), IDEA-0034 (scene/presence), IDEA-0044 (authoritative coordinator).
- **Deferred:** Trigger language and matching scope, ambiguity resolution, ordering/recursion limits, default activation scope and activation inspector UX.

### IDEA-0022 — Automatic Long-Term Story Summaries

- **Source:** [[Automatic Long-Term Story Summaries]] (`planning/staging/Automatic Long-Term Story Summaries.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Narrative Memory & Retrieval
- **Secondary subsystems:** Narrative History & Versioning; AI Generation Pipeline; AI Task Routing & Model Selection; AI Context & Prompt Construction; World State Reconstruction
- **Classification:** Derived, source-traceable narrative memory summarisation.
- **Responsibility:** Generate and maintain compact memories of older **committed** history with source turn/scene ranges and revision provenance. Mark summaries stale when their authoritative inputs are edited/undone and support rebuilding. Distinguish accepted outcomes from drafts, rumours, speculative prose and rejected actions; never replace full history or override canonical state. Summarisation works with one shared model or a task-specific model.
- **Boundary:** Narrative Memory & Retrieval owns summary creation, provenance, staleness and rebuild; Narrative History & Versioning supplies source/revision identifiers; World State Reconstruction and committed events anchor truth; AI Task Routing provides a selected summarising model; AI Context & Prompt Construction separately decides which valid summaries enter a request. Generating a summary never commits new canonical world facts. Semantic RAG/embeddings (IDEA-0063) are not approved by this mapping.
- **Key idea dependencies:** IDEA-0017 (model routing), IDEA-0023 (episodic retrieval), IDEA-0024 (context inclusion), IDEA-0039 (event history), IDEA-0040 (revisions), IDEA-0042 (rebuild), IDEA-0044 (coordination).
- **Deferred:** Rolling vs hierarchical/hybrid summary design, source-dependency granularity, rebuild timing, conflict handling and fidelity/inspection measures.

### IDEA-0023 — Episodic Memory Retrieval

- **Source:** [[Episodic Memory Retrieval]] (`planning/staging/Episodic Memory Retrieval.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Narrative Memory & Retrieval
- **Secondary subsystems:** Narrative History & Versioning; AI Context & Prompt Construction; Adventure Library & Persistence
- **Classification:** Derived, revision-aware retrieval of old canonical incidents and passages.
- **Responsibility:** Find relevant original committed prose/events and return source-linked excerpts with turn/passage/revision provenance. Consider local full-text, entity and event indexes without mandatory embeddings or a second LLM. Preserve full-history retrieval as an option to evaluate, independently of the small number of excerpts selected for the eventual model prompt. Invalidate/rebuild obsolete indexes and links after history edits, undo and truncation.
- **Boundary:** Narrative Memory & Retrieval owns search/indexing and relevance candidates, while committed narrative/history remains the source of truth. AI Context & Prompt Construction decides which results fit the effective prompt; Persistence provides the stored history and optional derived indexes. Retrieved material does not create canonical facts or assert a match when no sufficient source exists. No specific BM25/vector/scanning algorithm is approved; embedding/RAG IDEA-0063 is separate.
- **Key idea dependencies:** IDEA-0022 (summary coordination), IDEA-0024 (context selection), IDEA-0039 (events), IDEA-0040 (revision IDs), IDEA-0041 (historical editing), IDEA-0042 (state rebuild).
- **Deferred:** Index implementation, query anchors, ranking, thresholds/chunking, all-history performance evaluation and revision invalidation policy.

### IDEA-0024 — Token-Budgeted Context Builder and Inspector

- **Source:** [[Token-Budgeted Context Builder and Inspector]] (`planning/staging/Token-Budgeted Context Builder and Inspector.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** AI Context & Prompt Construction
- **Secondary subsystems:** Model Capability Management; Narrative Memory & Retrieval; Entity-Based Lorebook; AI Provider Integration; Presentation & UX
- **Classification:** Model-aware prompt construction, budget allocation and context provenance/inspection.
- **Responsibility:** Assemble player instructions, authoritative world/scene state, selected lore, recent committed prose, summaries and episodic excerpts within a model-aware context budget with appropriate output/framing reserves. Distinguish **requested**, **selected** and **actually transmitted** material; expose source provenance, priority, token confidence and explicit omissions. Honour manual exclusions and flag pinned content that could not fit.
- **Boundary:** Context construction owns selecting/packing information for a request, not its underlying lore, events, memories or state. Capability Management supplies reliable/estimated model limits; AI Provider Integration maps the effective request to provider format and supplies whatever is observable about transmission; the inspector must not falsely promise that hidden provider transformations were fully observed. A wide local history search is compatible with a narrow transmitted context. Redact credentials. Embedding/RAG IDEA-0063 remains unaccepted.
- **Key idea dependencies:** IDEA-0012–0019 (provider/model/pipeline), IDEA-0020 (manual Lorebook controls), IDEA-0021 (rule activation), IDEA-0022 (summaries), IDEA-0023 (episodic retrieval), IDEA-0025 (author notes).
- **Deferred:** Accurate tokenisation across providers, priority/default budget allocations, truncation/resummarisation policies, conflict resolution for pinned items and UI presentation of omissions.

### IDEA-0025 — Author Notes and Persistent Story Instructions

- **Source:** [[Author Notes and Persistent Story Instructions]] (`planning/staging/Author Notes and Persistent Story Instructions.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Narrative Generation Configuration
- **Secondary subsystems:** AI Context & Prompt Construction; Scenario Templates & Configuration; Adventure Library & Persistence; Presentation & UX
- **Classification:** Persistent noncanonical narrative instruction configuration.
- **Responsibility:** Store editable global, adventure-level and optional scene-specific author guidance separate from story prose, canonical events and Lorebook facts. Supply the applicable author instructions on each narrative generation turn, alongside current style settings and optional scenario-provided initial instructions. Make effective inclusion, priority conflicts and capacity omissions inspectable.
- **Boundary:** Narrative Generation Configuration owns instruction content/scopes. AI Context & Prompt Construction selects applicable notes for each task/prompt and reports what was really sent. Scenario Templates can seed starting guidance; persistence stores mutable configuration separately from canonical event history. Author instructions cannot override validated world rules or rewrite previously committed text. No separate narration-style/author-note preset manager is implied.
- **Key idea dependencies:** IDEA-0008 (scenario templates), IDEA-0010 (narration settings), IDEA-0018 (generation stages), IDEA-0020 (Lorebook), IDEA-0024 (prompt builder).
- **Deferred:** Global/adventure/scene precedence, scene lifetime, stage-specific filtering, token priorities and conflict display.

### IDEA-0026 — Shared PC and NPC Character Entities

- **Source:** [[Shared PC and NPC Character Entities]] (`planning/staging/Shared PC and NPC Character Entities.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Character & Scene State
- **Secondary subsystems:** Entity-Based Lorebook; Narrative Interaction & Intent; World Rules & Validation; Adventure Library & Persistence
- **Classification:** Unified character entity identity and optional actor selection, not separate PC/NPC models.
- **Responsibility:** Represent every character with a durable ID and incrementally populated optional details, without an inherent PC/NPC/Playable kind or mandatory protagonist. Any existing adventure Lorebook character may be explicitly selected as nullable `Playing As` for Do/Say; Story/Continue remain available without selection. All characters may participate in applicable shared gameplay systems and references must survive renames.
- **Boundary:** Character & Scene State owns character identity and authoritative mutable character state; Entity-Based Lorebook owns descriptions/knowledge linked by stable IDs; Narrative Interaction & Intent consumes the saved selected actor, rather than creating a special player-character class. Changing selection is a noncanonical adventure setting and never changes location, possessions, historical attribution or creates an event. Missing values remain unknown, distinct from explicit zero/empty/none.
- **Key idea dependencies:** IDEA-0002 (Do/Say), IDEA-0005 (adventure settings), IDEA-0007 (character authoring), IDEA-0020 (Lorebook), IDEA-0027 (status sheets), IDEA-0029 (items), IDEA-0033 (locations), IDEA-0034 (presence).
- **Deferred:** Entity minimum schema, unknown-value representation, merge/deletion/duplicate detection, reference-integrity behaviour and optional related data structures.

### IDEA-0027 — Customisable Character Status Sheets

- **Source:** [[Customisable Character Status Sheets]] (`planning/staging/Customisable Character Status Sheets.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Character & Scene State
- **Secondary subsystems:** Entity-Based Lorebook; World Rules & Validation; AI Context & Prompt Construction; Presentation & UX
- **Classification:** Optional, mutable, customisable character-sheet state.
- **Responsibility:** Support player-defined and optionally typed status fields, conditions and character details on every stable unclassified character entity, with direct editing and applicable validation. Preserve unknown/unrecorded values distinctly from explicitly empty/zero/false values. Relevant current fields may be selected for model context.
- **Boundary:** Character & Scene State owns current sheet values attached to IDEA-0026 character IDs; Lorebook links descriptions rather than keeping a competing authoritative copy of mutable status. Context construction decides which values are requested, selected and transmitted; direct player edits must respect validated persistent state. This mapping does not independently approve specific update policies or mandatory RPG mechanics; automatic whole-sheet tracking is separately accepted under IDEA-0064 while per-field tracking modes in inbox IDEA-0028 remain unaccepted.
- **Key idea dependencies:** IDEA-0020 (Lorebook), IDEA-0024 (context), IDEA-0026 (character identities), IDEA-0064 (separate automatic tracking).
- **Deferred:** Field schemas/types, migrations on schema edits, precise UI, manual-versus-generated update precedence and optional mechanics.

### IDEA-0029 — Persistent Items and Inventory Transfers

- **Source:** [[Persistent Items and Inventory Transfers]] (`planning/staging/Persistent Items and Inventory Transfers.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Inventory & Item State
- **Secondary subsystems:** Character & Scene State; World Locations & Topology; World Rules & Validation; Narrative History & Versioning
- **Classification:** Persistent item identity, physical custody and validated transfers.
- **Responsibility:** Give each tracked item a durable unique ID; track its established placement in a character, container or location and validate creation, pickup, drop, storage and transfer. Avoid conflicting simultaneous physical placement or duplication. Distinguish holder/custody from ownership claims where needed, and unknown from established absence/none. Any character can hold items without a global Player Inventory.
- **Boundary:** Inventory & Item State owns item identities and custody; characters, locations and containers are referenced by their own stable IDs. World Rules & Validation checks transactions and prevents impossible transfers; Narrative History & Versioning preserves changes for rollback/reconstruction. Switching `Playing As` does not transfer items. Equipment uses the **same** item identities under IDEA-0030, not a second inventory.
- **Key idea dependencies:** IDEA-0026 (character IDs), IDEA-0030 (equipment), IDEA-0033 (locations), IDEA-0039 (event history), IDEA-0042 (state rebuild), IDEA-0047 (capability validation).
- **Deferred:** Stackability, nested containers/cycles, legal ownership semantics, consumption/destruction, encumbrance and manual-edit conflicts.

### IDEA-0030 — Slot-Based Equipment and Body Diagram

- **Source:** [[Slot-Based Equipment and Body Diagram]] (`planning/staging/Slot-Based Equipment and Body Diagram.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Inventory & Item State
- **Secondary subsystems:** Character & Scene State; World Rules & Validation; AI Context & Prompt Construction; Presentation & UX
- **Classification:** Current equipment assignments and functional body-slot visualisation.
- **Responsibility:** Represent equipped/held gear using customisable body slots, left/right hands, clothing layers and nonstandard body configurations; provide a legible text-labelled functional schematic. Equip, unequip and transfer actions must be validated against authoritative item and character state. Distinguish worn/equipped from merely carried.
- **Boundary:** Equipment is a state/assignment of the unique item identities owned by Inventory & Item State, not an independent inventory store. Character & Scene State supplies relevant anatomy/available body features. Presentation & UX renders slot layout but does not own physical truth; AI context may select current equipment data. No generated illustration or rigid human-only slot scheme is mandated.
- **Key idea dependencies:** IDEA-0024 (context), IDEA-0026 (characters), IDEA-0029 (item identity/custody), IDEA-0031 (variable anatomy), IDEA-0047 (validated capabilities).
- **Deferred:** Exact slots/layers, two-hand/multislot constraints, equipment conflicts, response to transformations and visual layout.

### IDEA-0031 — Configurable Anatomy and Transformations

- **Source:** [[Configurable Anatomy and Transformations]] (`planning/staging/Configurable Anatomy and Transformations.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Character & Scene State
- **Secondary subsystems:** Inventory & Item State; World Rules & Validation; Narrative History & Versioning; AI Context & Prompt Construction
- **Classification:** Free-form mutable physical character state with validated change history.
- **Responsibility:** Let any character possess optional text-first records of arbitrary named anatomical features and states, injuries, absences, prosthetics and temporary/permanent transformations. Optional starter templates remain fully editable or omittable. Maintain the same character identity through physical changes and preserve unknown versus known-present/known-absent semantics.
- **Boundary:** Character & Scene State owns canonical anatomical status, not equipment or UI schematics; World Rules & Validation checks fictional changes, Inventory & Item State reconciles affected equipped objects without duplication/teleportation, and Narrative History & Versioning supports undo/edit provenance. Removing an editor field or starter-template entry is **not** by itself an in-world amputation. Context inclusion must be deliberate and inspectable; the mature-specific optional controls of inbox IDEA-0032 are outside this mapping.
- **Key idea dependencies:** IDEA-0024 (context inclusion), IDEA-0026 (character IDs), IDEA-0027 (status fields), IDEA-0030 (equipment), IDEA-0039 (history), IDEA-0042 (rebuild), IDEA-0064 (separate automatic tracking).
- **Deferred:** Flexible machine-readable anatomy relations, transformation operations, compatibility rules, historical/manual update reconciliation and private-context handling.

### IDEA-0033 — Hierarchical World Locations

- **Source:** [[Hierarchical World Locations]] (`planning/staging/Hierarchical World Locations.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** World Locations & Topology
- **Secondary subsystems:** Character & Scene State; Inventory & Item State; Entity-Based Lorebook; World Rules & Validation; AI Context & Prompt Construction
- **Classification:** Persistent stable world-place identity and hierarchical containment.
- **Responsibility:** Model arbitrary, sparse and custom-typed places with stable IDs, descriptions and flexible acyclic parent-child containment across any depth. Preserve references through renames and reorganisation; permit incomplete/unknown location details and broad-to-specific context. Other domain entities may refer to location IDs.
- **Boundary:** World Locations & Topology owns location identity and containment, **not** a presumption of travel edges, permitted access or character co-location. Traversal rules and active presence are separately modelled (IDEA-0035, IDEA-0034). A parent-child relation does not automatically mean a traversable route. The zoomable map UI (IDEA-0037) and automated world discovery (IDEA-0036) are separate features, not implied implementations.
- **Key idea dependencies:** IDEA-0020 (lore references), IDEA-0024 (context), IDEA-0026 (characters), IDEA-0029 (item locations), IDEA-0034 (presence), IDEA-0035 (travel routes), IDEA-0036 (discovery), IDEA-0037 (map).
- **Deferred:** Location move/merge/delete reference handling, moving containers/vehicles, discovery visibility and multi-parent/alias questions.

### IDEA-0034 — Character Presence and Current Scene

- **Source:** [[Character Presence and Current Scene]] (`planning/staging/Character Presence and Current Scene.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Character & Scene State
- **Secondary subsystems:** World Locations & Topology; World Rules & Validation; Narrative Interaction & Intent; AI Context & Prompt Construction; Presentation & UX
- **Classification:** Authoritative physical character location, scene presence and participation.
- **Responsibility:** Track each character's actual current location by stable location ID and distinguish physically present, known elsewhere, in transit, unknown whereabouts and remotely participating. Limit in-person participation to established physical conditions; show current presence truthfully in story context and UI.
- **Boundary:** Character & Scene State owns canonical location/presence and scene participation; World Locations & Topology provides stable locations, World Rules & Validation assesses movement, and AI Context & Prompt Construction selects relevant presence information. Character mentions, Lorebook retrieval, remote communication and changing `Playing As` do not create movement or co-location. Rejected events cannot move characters.
- **Key idea dependencies:** IDEA-0002 (actor selection), IDEA-0024 (context), IDEA-0026 (character IDs), IDEA-0033 (location IDs), IDEA-0035 (travel validation), IDEA-0042 (reconstruction).
- **Deferred:** Transit representation, large-scene co-location/proximity, line of sight, remote communication and party/group movement semantics.

### IDEA-0035 — Configurable Travel Graph Rules

- **Source:** [[Configurable Travel Graph Rules]] (`planning/staging/Configurable Travel Graph Rules.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** World Locations & Topology
- **Secondary subsystems:** World Rules & Validation; Character & Scene State; Adventure Library & Persistence; Adventure Coordinator
- **Classification:** Separate movement-connection graph with per-adventure travel policy.
- **Responsibility:** Represent potential travel connections independently of hierarchical containment and permit freeform, strict adjacent-only and valid multi-hop policy directions, with optional conditional route restrictions. Coordinate accepted movement with persistent character location, and provide explicit blocked-route outcomes.
- **Boundary:** World Locations & Topology owns route graph and policy definitions; World Rules & Validation checks whether a particular movement is allowed under current canonical conditions. Adventure Coordinator coordinates validated commits. Neither parent-child containment nor a narrator's asserted success grants travel access. Freeform policy relaxes adjacency without bypassing data or transaction integrity.
- **Key idea dependencies:** IDEA-0018 (generation/validation), IDEA-0029 (items), IDEA-0033 (location hierarchy), IDEA-0034 (presence), IDEA-0036 (discovery), IDEA-0038 (mutable access conditions), IDEA-0047 (capabilities).
- **Deferred:** Default travel policy, route-edge schema, pathfinding and timing, access/keys evaluator, movement granularity and exceptional traversal.

### IDEA-0036 — AI World Discovery and Expansion

- **Source:** [[AI World Discovery and Expansion]] (`planning/staging/AI World Discovery and Expansion.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** World Locations & Topology
- **Secondary subsystems:** AI Generation Pipeline; Adventure Coordinator; World Rules & Validation; Entity-Based Lorebook; Character & Scene State
- **Classification:** AI-assisted candidate world-graph creation, identification and discovery.
- **Responsibility:** Accept AI proposals for new/discovered places, hierarchical placement, aliases, connections and associated arrivals as coherent validated operations. Resolve duplicate/uncertain references against existing stable IDs and distinguish world existence, character knowledge and player discovery/visibility. Coordinate dependent operations so rejected changes do not leave orphaned nodes, impossible movement or half-committed graph state.
- **Boundary:** The AI proposes, while World Locations & Topology owns place/link identities, World Rules & Validation checks graph, movement and permissions, and the Adventure Coordinator decides canonical commits. Mention/discovery alone never teleports characters, proves rumours, reveals secrets or authorises a forbidden travel edge. Map visualisation remains separately owned by Presentation & UX under IDEA-0037.
- **Key idea dependencies:** IDEA-0018 (pipeline), IDEA-0020 (Lorebook), IDEA-0033 (hierarchy), IDEA-0034 (presence), IDEA-0035 (travel rules), IDEA-0038 (mutable world), IDEA-0044 (coordinator), IDEA-0045 (operation proposals).
- **Deferred:** Configurable discovery mode, alias ambiguity resolution, hidden world visibility, parentage when unknown and transactional multi-operation design.

### IDEA-0037 — Zoomable Node Map Canvas

- **Source:** [[Zoomable Node Map Canvas]] (`planning/staging/Zoomable Node Map Canvas.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** Presentation & UX
- **Secondary subsystems:** World Locations & Topology; Character & Scene State; Adventure Library & Persistence
- **Classification:** Interactive player-facing projection of known world locations and travel connections.
- **Responsibility:** Display a pannable/zoomable nested node canvas with readable grouped locations, known travel connections, node selection/inspection and optional user-adjusted layouts. Respect discovery permissions and reveal only appropriate known places/routes.
- **Boundary:** The map renders validated world information; its visual positions, zoom and grouping are presentation preferences, not authoritative place containment, route state, travel permission or character movement. Dragging or selecting nodes must not silently mutate canon; hidden places must not leak through layout or labels.
- **Key idea dependencies:** IDEA-0033 (location graph), IDEA-0034 (current presence), IDEA-0035 (route connections), IDEA-0036 (discovery visibility), IDEA-0062 (accessible responsive UI).
- **Deferred:** Graph library, nested layout and overlap algorithms, persistence scope, grouping/zoom thresholds, virtualisation and keyboard/touch accessibility design.

### IDEA-0038 — Persistent Location State and Travel Interactions

- **Source:** [[Persistent Location State and Travel Interactions]] (`planning/staging/Persistent Location State and Travel Interactions.md`)
- **Pass A mapping:** Accepted by requesting user, recorded 2026-10-19.
- **Primary subsystem:** World Environment & Mutable State
- **Secondary subsystems:** World Locations & Topology; Inventory & Item State; Character & Scene State; World Rules & Validation; Narrative History & Versioning
- **Classification:** Authoritative mutable environmental conditions and multi-entity interactions.
- **Responsibility:** Persist changing conditions of locations, doors, containers and routes, including locking/unlocking, blocking/opening passages, emptying containers and damaging/repairing infrastructure. Keep affected item placement, access permissions, scene state and route usability coherent across accepted transactions and historical reconstruction.
- **Boundary:** World Environment & Mutable State owns mutable conditions, distinct from stable location identity, containment and travel-edge topology. World Rules & Validation authorises actions and route access using current conditions; Item and Character domains supply related authoritative states. A route becoming blocked affects future legality, not already committed journeys. Failed/provisional changes never partially mutate the world.
- **Key idea dependencies:** IDEA-0029 (item/container state), IDEA-0033 (stable locations), IDEA-0034 (presence), IDEA-0035 (travel policies), IDEA-0039 (event history), IDEA-0042 (reconstruction), IDEA-0047 (capability validation).
- **Deferred:** Environmental attribute schema, complex temporary/damage rules, interrupted journeys, transactional multi-entity effects and replay mechanics.

## Next pending mapping

- Next batch: five staged ideas starting with IDEA-0039, skipping IDs not in staging. **Not yet accepted in Pass A.**

## Process

1. Present one or a requested batch of staging idea subsystem mappings, with boundaries/dependencies per idea.
2. Wait for explicit acceptance or requested adjustments, which may apply to the batch or individual ideas.
3. **Immediately write every accepted mapping to this register in GitHub before proceeding to the next unreviewed idea/batch.**
4. Keep source staging ideas in place and refrain from production promotion, code changes or specification claims unless separately authorised.
