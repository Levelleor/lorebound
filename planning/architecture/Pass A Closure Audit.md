---
type: architecture
status: evolving
created: "2026-10-19"
updated: "2026-10-19"
tags:
  - planning/architecture
  - pass-a
  - cross-idea-audit
---
# Pass A Closure Audit

## Scope and review rules

This is a **working cross-idea consistency and decision audit** for the 52 accepted staging ideas. It supplements, but does not replace, the [Pass A Subsystem Mapping Register](./Subsystem%20Mapping%20Register.md) and [Pass B Consolidated Subsystem Architecture](./Consolidated%20Subsystem%20Architecture.md).

Classify evidence as (a) an established shared assumption, (b) a resolved/superseded earlier direction, (c) a genuine incompatible requirement needing explicit player decision, or (d) an open design/interface question suitable for Pass B/C. Historical `Decisions and review history` entries remain as audit history even when later decisions supersede them; the most recent **accepted direction** governs. Never convert a deferred implementation detail into a settled user decision.

**State:** Review batches 1 and 2 are documented; **the 52-idea cross-cutting audit is not yet complete**. A-03 to A-06 and A-09/A-10 have explicit user clarifications/acceptances dated 2026-10-19. A-01/A-02 and A-07/A-08 are source-confirmed without a separate explicit audit sign-off. Additional clusters remain to review before final closure.

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
| AI consistency and movement | Bounded repair fallback, strict travel default, discovery permission for newly established passages, hidden-state disclosures and handling incomplete maps | Pass B policy boundaries; Pass C behavior/test cases |
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

## Remaining review work

Review remaining 52-idea cross-subsystem clusters, separating stale chronology references from real contradictory accepted directions. Batch 2 has addressed historical-edit player authority, Lorebook reference chronology, Turn-0 creation/extraction and **plugin removal without migration**. Continue with provider capability/context claims, adventure creation/fork/duplication semantics, other world-state and permission boundaries, plus any outstanding technical safety choices. Obtain explicit user review on genuinely unresolved architectural choices before declaring audit closure.

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
