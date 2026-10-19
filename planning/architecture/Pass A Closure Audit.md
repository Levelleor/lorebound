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

**State:** Review batch 1 in progress; **not** a completed audit of all 52 ideas. Findings A-03 through A-05 were explicitly discussed and clarified by the user on 2026-10-19. A-01 and A-02 are consistent with accepted sources, but their classifications have not yet received explicit sign-off as an audit batch. Remaining cross-idea clusters will be reviewed with the user before declaring closure.

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
| Historical edit reconciliation | Keep Later Turns invalidated dependencies, derived cache invalidation and recovery from truncation | Pass B timeline contract; Pass C detailed algorithms |

## Remaining review work

Review remaining 52-idea cross-subsystem clusters, separating stale chronology references from real contradictory accepted directions. Focus particularly on historical-edit/state replay, world versus lore authority, Turn-0 world authoring versus fact-only extraction, plugin history and permission contracts, provider capability/context claims and adventure creation/fork/duplication semantics. Obtain explicit user review on genuine unresolved architectural choices before marking the audit complete.

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
