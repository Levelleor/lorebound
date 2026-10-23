---
type: architecture
status: evolving
created: "2026-10-19"
updated: "2026-10-23"
tags:
  - planning/architecture
  - pass-a
  - cross-idea-audit
---
# Pass A Closure Audit

## Scope and review rules

This is a **working cross-idea consistency and decision audit** for the 52 accepted staging ideas. It supplements, but does not replace, the [Pass A Subsystem Mapping Register](./Subsystem%20Mapping%20Register.md) and [Pass B Consolidated Subsystem Architecture](./Consolidated%20Subsystem%20Architecture.md).

Classify evidence as (a) an established shared assumption, (b) a resolved/superseded earlier direction, (c) a genuine incompatible requirement needing explicit player decision, or (d) an open design/interface question suitable for Pass B/C. Historical `Decisions and review history` entries remain as audit history even when later decisions supersede them; the most recent **accepted direction** governs. Never convert a deferred implementation detail into a settled user decision.

**State:** Review batches 1 through 4 are documented; **the 52-idea cross-cutting audit is not yet complete**. A-03 to A-06 and A-09/A-10 have explicit user clarifications/acceptances dated 2026-10-19. **A-11 through A-20 were reviewed/accepted 2026-10-23**, with new behavior decisions in A-12/A-13/A-15/A-18/A-19/A-20. A-01/A-02 and A-07/A-08 remain source-confirmed without separate batch sign-off. Remaining cross-idea clusters require review before final closure.

## Review batch 1 — findings

| ID | Sources | Classification | Finding and authoritative direction | Review state / next step |
|---|---|---|---|---|
| **A-01** | IDEA-0005, 0051, 0052, 0053 | Resolved superseded scope | One Go-managed SQLite library. Only whole-library SQLite snapshot Backup Database and whole-library replacement Restore Database are accepted. Old per-adventure export/import proposals do not remain approved. | Source-confirmed; seek user's closure-audit sign-off if needed. |
| **A-02** | IDEA-0004, 0011, 0039, 0041 | Established distinct workflows | Retry replaces uncommitted AI attempts; committed Undo rewinds the single active head; explicit Fork creates an independent adventure when the original future should survive; older-history editing has Keep Later Turns/Delete All After Point/Continue Editing/Discard confirmation. No selectable in-story alternate-futures stack. | Source-confirmed; seek user's closure-audit sign-off if needed. |
| **A-03** | IDEA-0027, 0064; deferred 0028 | Later acceptance supersedes prior reservation; refinement remains | IDEA-0027 accepted editable character-sheet data without itself approving automation. IDEA-0064 later explicitly accepted automatic tracking of applicable fields. **User further accepted**: a confirmed valid manual correction is an authoritative canonical mutation with durable provenance, and subsequent automatic updates must use the latest accepted value—not overwrite it with stale AI assumptions. Genuine later validated events can still change that value. Per-field tracking modes in IDEA-0028 remain unaccepted. | **User clarified/accepted 2026-10-19.** Implementation details (event schema, qualitative ambiguity, stale concurrency feedback) deferred to Pass B/C. |
| **A-04** | IDEA-0014, 0051, 0053; provider IDEA-0012/0013 | Compatible architecture, security/interface design pending | Go's native OS vault or consented AES-256-GCM encrypted sidecar is persistent credential authority. **User accepted two-way sync:** at startup/active profile selection browser requests available saved tokens from an authorised narrow Go service, holds usable secrets in **browser memory only** for direct AI provider requests, and writes new/changed/deleted credentials back to Go. **No raw secrets in localStorage, sessionStorage, IndexedDB, SQLite or logs**; nonsecret profile settings may be cached. No Go model HTTP transport proxy. | **User clarified/accepted 2026-10-19.** Secure origin/session authentication, cross-tab refresh/invalidation and credential exposure are Pass B security/interface details. |
| **A-05** | IDEA-0002, 0035, 0036, 0046; IDEA-0037 map UI | Shared player-first philosophy; intentional mode distinctions | The optional map/travel graph is chiefly an **AI continuity tool for the player's world**, not a restriction on player creativity. In freeform mode, map is usable as **reference only**. In strict mode, ordinary Do/Say attempted movement and AI/Continue outcomes are validated and subject to **bounded grounded narrative correction** (locked door, mistaken Great Hall doorway, treasury door in another room) rather than contradictory AI success or invented convenient bypass. **Player-authored Story** explicitly retains authority to assert extraordinary in-fiction outcomes, with technical identity/event/atomic integrity preserved. Discovery of new routes and actual travel are distinct operations. No overbearing simulator or unnecessary confirmation gate. | **User clarified/accepted 2026-10-19.** Default movement mode, detailed bounded-repair budgets and genuinely justified discovery policy remain Pass B/C decisions. |

## Shared established invariants highlighted by this batch

- **User authors the world; rules guide AI fidelity.** Do/Say are attempted actions under enabled adventure rules; Story is deliberate player-authored fiction with an accepted override of in-fiction constraints. Neither optional map UI nor AI can bypass canonical integrity.
- **AI narrative repair should be proportionate.** Prefer a consistent narration of what happened or failed, based on actual known state, rather than inventing false geography or rejecting the player's goal as intrinsically impermissible.
- **Accepted manual edits are canon.** Character-sheet corrections and world/story authorial decisions carry history/provenance rather than being treated as temporary presentation state.
- **Go secrets are persistent; browser secret cache is ephemeral.** Two-way synchronisation is distinct from a model transport proxy.
- **Staging remains staging.** Clarified accepted directions do not mean any feature is implemented or ready for `planning/production/`.

## Open decisions to route forward, not silently settle

| Decision area | Questions still open | Recommended phase |
|---|---|---|
| Character manual/automatic reconciliation | Version checks; representation of manual events; validation of arbitrary qualitative fields; concurrent edits | Pass B interface contract and Pass C detailed schema |
| AI consistency and movement | Bounded repair fallback, strict travel default, discovery permissions and AI fictional-knowledge handling. **Settled:** Undiscovered nodes may remain named/visible/editable on the player's map; discovery state does not prohibit map inspection or imply character knowledge. Map clicks never trigger travel. | Pass B policy boundaries; Pass C behavior/test cases |
| Browser/Go credential interface | Authorised Go API and origin controls; CSRF/DNS-rebinding; tab change invalidation; lock/unlock behaviour; failure and redaction | Pass B security boundary; Pass C implementation details |
| Historical edit reconciliation | **User decision settled:** Keep Later Turns retains later narrative/outcomes even when earlier fictional premises disappear; no AI inference/automatic repairs, player may manually correct missing state. **Engineering boundary still open:** technically unrepresentable event payloads, atomic replay/commit checks, derived cache invalidation and recovery from truncation. | Pass B timeline/integrity contract; Pass C detailed algorithms |

## Review batch 2 — findings A-06 through A-10

| ID | Sources | Classification | Finding and authoritative direction | Review state / next step |
|---|---|---|---|---|
| **A-06** | IDEA-0003, 0039, 0040, 0041, 0042 | **Player decision resolved; technical replay edge cases deferred** | **Keep Later Turns** is the player's deliberate decision to retain subsequent story passages and recorded outcomes even if an earlier revised passage no longer fictionally supports them. No AI inference or paid narrative repair, no auto-created compensating facts or inventory. The player may voluntarily correct current canonical data through manual controls, e.g., manually add a key if a later kept scene uses it. The **Keep** button does not add it automatically. Stable IDs, safe event writes and expected-version protection still apply; a technically unrepresentable event payload needs a small deterministic Pass B fallback, not loss of authorial choice. | **Explicit user clarification 2026-10-19.** Updated staging ideas IDEA-0039, 0041, 0042. Technical event replay and truncation recovery deferred. |
| **A-07** | IDEA-0004, 0039, 0040, 0042 | Established coherent timeline and provenance | Committed Undo selects a prior active head; no in-adventure selectable alternatives. Source revisions are at logical turn/passage level, not paragraph level. Deterministic core reconstruction from the correct accepted baseline/events, with snapshots only as accelerators; removed-plugin exception recorded separately in A-10. | **Source-confirmed**; no new behaviour proposed, final audit sign-off pending. |
| **A-08** | IDEA-0006, 0020, 0045, 0066 | Established distinct creation versus extraction operations | Extracting committed opening prose records explicitly established facts only, without inventing missing lore; intentional, separately requested AI-generated starting worldbuilding may create new Turn-0 Lorebook entities without making a fake first narrative turn. A successful validated Quick Start opening automatically commits as Turn 1. Worldbuilder-specific review/commit UX is deferred. | **Source-confirmed**; no new behaviour proposed, final audit sign-off pending. |
| **A-09** | IDEA-0020, 0021, 0022, 0023, 0024, plus related IDEA-0033 and 0045 | Established Lorebook/current-state authority; **documentation chronology corrected** | Freeform manual descriptions need not be automatically semantically reconciled against typed game state; current validated world state remains authoritative for actual gameplay. Explicit Lorebook exclusions outrank automatic activation and derived memories never override canon. Former 'unaccepted' cross-references were corrected: IDEA-0021, 0023, 0024, 0035/0036/0037/0038 and 0046 were independently accepted in **staging**. **IDEA-0063 embedding/RAG remains unaccepted in Inbox.** Historical review logs remain intact. | **User instructed reference correction 2026-10-19.** Updated active accepted-direction/dependency references in six staging docs; no feature promotion or changed stage approvals. |
| **A-10** | IDEA-0039, 0042, 0044, 0047, 0055 | **Explicitly superseded old plugin-removal guarantee** | Accepted plugin changes are recorded normally while the capability is present. If the player removes a plugin, play **continues without its mechanics and plugin-supplied AI context**, with potentially unpredictable future narrative outcomes. **No automatic migration, emulation, reinstallation or reconstruction/replay of the absent plugin's custom historical state is required.** Preserve surviving story records and core identity/transaction integrity; removal is not permission to corrupt unrelated state. This supersedes previous unconditional historical-replay claims for unavailable plugin code. | **Explicit user decision 2026-10-19.** Updated IDEA-0047/0055/0042 and the consolidated architecture. No plugin-removal migration or extra AI context obligations. |

## Review batch 3 — findings A-11 through A-15

| ID | Sources | Classification | Finding and authoritative direction | Review state / next step |
|---|---|---|---|---|
| **A-11** | IDEA-0012, 0013, 0014, 0053 | **Accepted network boundary, implementation feasibility risk** | Four accepted cloud connectors (OpenAI, Anthropic, Gemini, OpenRouter) and named local model servers (Ollama, LM Studio, vLLM, llama.cpp) use **direct browser TypeScript HTTP requests**. Go does not proxy inference. Browser CORS/private-network compatibility must be tested for each supported endpoint; report unsupported browser-origin configurations honestly rather than inventing a Go/Node fallback. | **User agreed 2026-10-23.** Provider-by-provider browser-feasibility testing is Pass B/C engineering/release work. |
| **A-12** | IDEA-0017, 0018, 0019; providers 0012/0013 | **User-resolved failure policy** | Single-model and multi-model task routing remain equally first-class. When the selected model/provider response fails or assigned model is unavailable, **fail the interaction**, report the error and preserve prior canon/recoverable input. **No automatic alternate-model/provider fallback, rerouting or substitution.** Deliberate user retry/change is separate, as is bounded narrative validation/repair of a *successfully obtained* response. Unassigned tasks may inherit a chosen primary model; this is not a fallback after failure. | **Explicit user decision 2026-10-23.** IDEA-0017 updated; no new fallback approval. |
| **A-13** | IDEA-0015, 0016, 0017, 0024 | **User-resolved single-setting scope** | Persist **one current generation-parameter settings entry** across providers/models/tasks, not automatic separate model/profile settings. On model/provider switch the **frontend reevaluates** which controls are supported/unsupported/ignored/unknown, visibly disables/annotates unsupported controls, and derives the effective request without deleting saved preferred values. Named technical sampling presets, where used, require **explicit user selection** and update this one active entry; they do not auto-switch by model. Request and context inspectors remain truthful about omitted values/material. Earlier model/provider-associated automatic current preferences are superseded. | **Explicit user decision 2026-10-23.** IDEA-0015/0016/0017 updated; remaining transport conversions/metadata and UI details are Pass B/C technical work. |
| **A-14** | IDEA-0005, 0008, 0011, 0042, 0051 | **Established independent lifecycle operations** | **Duplicate** creates an independent saved adventure with all currently committed narrative/state history. **Fork** creates an independent saved adventure with the accepted prefix through a chosen committed turn. **Scenario template instantiation** copies initial scenario/world/instructions into a fresh adventure **without any prior played turns**. No shared mutable canonical data, copied pending drafts, selectable in-story variant tree or single-adventure file export. Correct scoped references, atomicity and unavailable-plugin handling are implementation contracts, not new product questions. | **User agreed 2026-10-23.** Source-confirmed; no additional behaviour decided. |
| **A-15** | IDEA-0008, 0010, 0024, 0025 | **User-resolved creative conflict policy** | When applicable global/adventure/scene author notes, template-derived starting directions and current style instructions contradict, Lorebound does **not** detect, reconcile, prioritize by semantic meaning, rewrite or arbitrate the conflict. It **predictably assembles the applicable segments in a stable documented order** and transmits what fits in the model context, preserving requested/selected/sent visibility and technical omission reporting. The model/player determines creative adherence. **Hard canonical world validation is unaffected**; story instructions never create an automatic world mutation. Exact fixed order is an implementation detail, not an AI conflict-resolution policy. | **Explicit user decision 2026-10-23.** IDEA-0010/0025 updated; no style-preset manager, conflict solver or extra review UX is authorised. |

### Pass B/C details still open after batch 3

- **A-11:** Browser-origin CORS/auth/private-network feasibility matrix for each named cloud and local model endpoint.
- **A-12:** Concise failed-stage diagnostics and recoverable input; no automatic model fallback is to be designed.
- **A-13:** Capability metadata sourcing and exact provider field translations. Current parameter settings storage scope and on-switch reevaluation are **already settled**.
- **A-14:** Atomic, adventure-scoped copy/identity references and proper behavior when optional plugins are absent. Product-level Duplicate/Fork/Template differences are **already settled**.
- **A-15:** Pick and document a stable assembly order and context-window omission handling. **Do not** build creative-instruction conflict inference, precedence arbitration or contradiction warnings.

## Review batch 4 — findings A-16 through A-20

| ID | Sources | Classification | Finding and authoritative direction | Review state / next step |
|---|---|---|---|---|
| **A-16** | IDEA-0007, 0026, 0034 | **Established and accepted** | One universal character entity type, stable IDs, no forced protagonist or PC/NPC category. Nullable Settings `Playing As` selects the Do/Say actor but does not move characters or possessions. Story/Continue stay available without a selected character. A viewpoint cut is not travel or time lapse. | **User agreed 2026-10-23.** No new behavior or code; foundational interface details deferred. |
| **A-17** | IDEA-0029, 0030, 0044 | **Established and accepted** | The same unique item ID is used for physical custody, equipped slot and optional ownership claims. Legal/fictional ownership need not equal possession. Explicit player-authored Story may establish unusual transfers but may not create duplicate physical placements or corrupt stable references. | **User agreed 2026-10-23.** Exact optional capacity/layering/containers deferred. |
| **A-18** | IDEA-0027, 0030, 0031, 0064 | **User-resolved conditional auto-reconciliation** | A confirmed character-anatomy edit may invalidate an equipped slot. **Let the subsequent validation pass automatically move/unequip/reassign the affected item** where a grounded valid disposition is available; this is not forbidden teleportation. No automatic duplicate/deletion, invented remote location, partial state mutation, mandatory player clean-up or needless obstruction of anatomy authorship. Distinguish removing a description field from an in-world lost limb. | **Explicit user decision 2026-10-23.** IDEA-0030/0031 updated. Exact destination precedence, fallback if no grounded placement exists and event types go to Pass B/C. |
| **A-19** | IDEA-0002, 0037, 0044, 0047, 0050 | **User-resolved map interaction authority** | **Map clicks and node selection never issue Do/Say/Story inputs, movement attempts, AI narration or turns.** The map is a **reflection/editor of recorded world state**; the player may deliberately add locations or inspect/fix/edit their recorded facts and connections through validated manual world edits. Pure pan/zoom/drag/layout are presentation only. Other optional typed UI actions such as Equip/Drop remain separate; Story authorial authority is unchanged. | **Explicit user decision 2026-10-23.** IDEA-0037/0050 updated. Precise editor forms and nonmap action semantics go to refinement. |
| **A-20** | IDEA-0033, 0035, 0036, 0037, 0046 | **User-resolved discovered-state versus editor-visibility boundary** | Locations may carry `undiscovered` or `discovered` status; a validated story discovery may change the status. **Even an `undiscovered` node may be visible on the player's map with its recorded name/details, selectable and editable.** Status describes fictional character/AI knowledge, **not** player permission to view/edit stored map facts. Any truly separately restricted information needs its own explicit policy; the `undiscovered` flag is not mandatory fog of war. A recorded node or map click does not establish in-world knowledge or valid travel. | **Explicit user decision 2026-10-23.** IDEA-0033/0036/0037 updated; old automatic concealment of all undiscovered nodes superseded. AI context/validator knowledge filtering remains Pass B. |

### Remaining technical details after batch 4

- **A-18:** Which grounded destination is used for displaced gear after an anatomy edit, including when no valid destination can be identified; preserve a single item identity and atomic state.
- **A-19:** UX for manually editing/adding recorded locations and their known links, and separate execution behavior for any optional nonmap gameplay buttons. **No map-click travel design is permitted.**
- **A-20:** Distinct persisted discovery status and AI character-knowledge context; editable `undiscovered` nodes are **not** to be auto-hidden from the player. Any separate genuinely restricted/private data needs explicit authorization and policy.
- **A-16/A-17:** Stable actor/ownership/custody APIs and optional inventory/equipment validators, with no new mandatory universal game rule.

## Remaining review work

Review remaining 52-idea cross-subsystem clusters, separating stale chronology references from real incompatible accepted decisions. Batches 1–4 cover canonical history/player agency, no-migration plugin policy, Lorebook/Turn-0, provider networking, model routing and one current settings record, predictable notes, adventure lifecycle, universal characters, item/equipment integrity, anatomy adjustment, player-map editing and editable undiscovered locations. Continue with **other storage/privileged-service boundaries, multi-tab/draft concurrency, lifecycle failure semantics, AI turn commit/cancellation, optional modules and any residual cross-idea dependencies** before declaring the entire Pass A closure audit complete. Where the desired product behavior is established, only hand precise engineering contracts to Pass B/C rather than soliciting unnecessary reapproval.

## Documents updated during batch 4 review (2026-10-23)

- `planning/staging/Configurable Anatomy and Transformations.md` and `planning/staging/Slot-Based Equipment and Body Diagram.md` (A-18)
- `planning/staging/Zoomable Node Map Canvas.md` and `planning/staging/Structured UI Game Actions.md` (A-19/A-20)
- `planning/staging/AI World Discovery and Expansion.md` and `planning/staging/Hierarchical World Locations.md` (A-20)
- `planning/staging/Shared PC and NPC Character Entities.md`, `planning/staging/Character Presence and Current Scene.md`, `planning/staging/Persistent Items and Inventory Transfers.md`, `planning/staging/Persistent Location State and Travel Interactions.md` (chronology-only acceptance reference corrections)
- `planning/architecture/Consolidated Subsystem Architecture.md` (S04/S06/S10/S11 boundaries and system-wide invariants)

**No staging-to-production promotion or application code change.** Original Pass A register and mappings remain authoritative and unchanged. Historic note decisions are preserved; only active wording/acceptance chronology was aligned to explicit later human choices.

## Documents updated during batch 3 review (2026-10-23)

- `planning/staging/One-Model Task Routing.md` (A-12 and shared-setting integration)
- `planning/staging/Model-Capability-Aware Controls.md` (A-13)
- `planning/staging/Sampling Presets and Advanced Parameters.md` (A-13)
- `planning/staging/Author Notes and Persistent Story Instructions.md` (A-15)
- `planning/staging/Narration Style and Perspective Controls.md` (A-15)
- `planning/architecture/Consolidated Subsystem Architecture.md` (A-12, A-13, A-15 integration)

**No production promotion or code change.** User-agreed A-11/A-14 needed no staging behavior edits; legacy Pass A ownership history remains unchanged.

## Documents updated during batch 2 review (2026-10-19)

- `planning/staging/Historical Edit Confirmation and Bulk Truncation.md` (A-06)
- `planning/staging/Snapshots and Incremental State Rebuild.md` (A-06 and A-10)
- `planning/staging/Event-Sourced World History.md` (A-06)
- `planning/staging/Native Gameplay Capability Registry.md` (A-10)
- `planning/staging/Optional RPG Mechanics Plugins.md` (A-10)
- `planning/staging/Entity-Based Lorebook.md`, `planning/staging/Conditional Lorebook Activation.md`, `planning/staging/Automatic Long-Term Story Summaries.md`, `planning/staging/Episodic Memory Retrieval.md` (A-09)
- `planning/staging/LLM State Interpreter and Proposed Operations.md`, `planning/staging/Hierarchical World Locations.md` (related stale staging acceptance references)
- `planning/architecture/Consolidated Subsystem Architecture.md` (A-06/A-10 architecture consistency)

No staging-to-production movement and no code changes. Staged source decisions remain traceable in review history; superseded statements are corrected in active direction/dependency text, not erased from historical records.

## Documents updated during batch 1 clarification (2026-10-19)

- `planning/staging/Configurable Travel Graph Rules.md`
- `planning/staging/AI World Discovery and Expansion.md`
- `planning/staging/Typed Tool Rejection and Narrative Repair.md`
- `planning/staging/Automatic Character Sheet Tracking.md`
- `planning/staging/Customisable Character Status Sheets.md`
- `planning/staging/Provider Connection Profiles and Discovery.md`
- `planning/staging/Localhost Startup and Offline Mode.md`
- `planning/architecture/Consolidated Subsystem Architecture.md`

The original Pass A register was **not** modified. No staging document was promoted, and no code changes were made.
