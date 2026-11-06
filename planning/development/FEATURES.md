---
type: development-feature-ledger
status: current
created: "2026-11-03"
updated: "2026-11-05"
baseline_idea_count: 52
verified_idea_count: 0
---

# Lorebound — Feature Coverage & Verification Ledger

**This is the authoritative live feature-completion ledger for the development workflow.** Exactly **52 original accepted IDEA notes** exist in [production](../production/). They are *approved scopes*, not implemented features. A partial technical foundation is **not** completion of a whole IDEA. The [current task](./NOW.md), [task queue](./TASKS.md) and [runbook](./AGENT-RUNBOOK.md) govern how evidence is added.

## Reconciled completeness, 2026-11-05

| Measure | Current status |
| --- | --- |
| Original approved IDEA notes accounted for here | **52 / 52** |
| Original IDEA notes in production | **52** |
| Original IDEA notes in staging | **0** |
| Fully VERIFIED complete ideas | **0** |
| PARTIAL foundation evidence | **7**: IDEA-0002, IDEA-0006, IDEA-0039, IDEA-0040, IDEA-0044, IDEA-0051, IDEA-0053 from merged PRs #4/#6/#8 and earlier Gate 0 PR #3 |
| Remaining notes with no feature-level implementation evidence | **45** |
| Accepted **atomic** requirements inventoried | **95 draft records across seven IDEAs**; DEV-002C reconciles all 57 First-bearing rows; 38 Later-only rows and whole-IDEA inventory review remain open; DEV-001 retains remaining certification |
| Atomic requirements marked VERIFIED | **3 formally certified**: IDEA-0006/R01–R03 from PR #4. DEV-002B/C have tested scoped requirement coverage; no extra whole-row certification is inferred from mixed/later or empty-effect coverage |
| New feature proposals awaiting approval | **0 recorded** |
| Deferred spatial migration | **B9-D12 DEFERRED**, not an automatically accepted requirement |

**Caution:** The 52 rows below guarantee **idea-level visibility**, not complete subrequirement coverage. **DEV-001 must extract each actual normative requirement and each later accepted ADR qualification** into individually traceable `IDEA-NNNN/R01`, `/R02`, ... IDs before any idea can be certified complete. Never invent how many requirements are finished based only on a title. `PARTIAL` means the same original feature contains *some* working bounded functionality.

## Implementation milestones

Milestone grouping below is a **proposed sequencing/coverage aid**; it does not create new architectural approval or prevent a feature from spanning multiple slices.

| Milestone | Working capability target | Existing partial evidence / dependency |
| --- | --- | --- |
| **M0** | Real Wails/browser/Go + Go SQLite technical host/storage foundation | [Gate 0 merged PR #3](https://github.com/Levelleor/lorebound/pull/3), extended by [DEV-002A merged PR #4](https://github.com/Levelleor/lorebound/pull/4); broader host/storage requirements remain open |
| **M1** | One accepted, reopened Story-mode turn and basic adventure entry | **DEV-002**: **VERIFIED & MERGED bounded scope**, A/B/C merged with final-head CI and independent review; [PR #8](https://github.com/Levelleor/lorebound/pull/8) |
| **M2** | Edit, Retry, Undo, Fork, current-history recovery | Depends on M1 |
| **M3** | Real browser-side model providers, streaming, interpretation and routing | Depends on M1 contract; deterministic mocked scenarios plus separate provider smoke |
| **M4** | Lorebook, derived context/memory and author notes | Depends on canonical history and provider context |
| **M5** | Characters, playing-as, scene, statuses, items/equipment | Depends on stable IDs, current events |
| **M6** | World locations, routes, discovery, simple semantic map | Depends on M5 grounding; **no deferred B9-D12 spatial migrations** |
| **M7** | Adventure templates, starts, library lifecycle, full backup/restore | Integrates earlier slices; technical epoch fencing |
| **M8** | Structured/optional mechanics, accessibility, Command Citadel fidelity and release checks | Integrated cross-cutting delivery and supported platforms |

Merged DEV-002C extends the same seven partial ideas with safe deferred invalidation, recovery and first-slice integration evidence: [task report](./evidence/DEV-002C.md), [57-row matrix](./evidence/DEV-002C-requirements.md), [reconciliation](./evidence/DEV-002C-reconciliation.md). No complete IDEA is certified.

## All original approved ideas (52/52)

**Status meanings:** `NOT STARTED`, `IN PROGRESS`, `IMPLEMENTED / UNVERIFIED`, `PARTIAL`, `BLOCKED`, `VERIFIED`, `DEFERRED`. See [runbook](./AGENT-RUNBOOK.md). **Requirements** means *atomic accepted requirements already inventoried and evidenced*, not a guess based on the note title.

| Approved original IDEA | Feature | Primary subsystem | First milestone | Status | Requirement coverage | Evidence / PR |
| --- | --- | --- | --- | --- | --- | --- |
| [IDEA-0001](../production/Single-Player%20Account-Free%20Experience.md) | Single-player account-free experience | S01 | M1 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0002](../production/Freeform%20Player%20Action%20Modes.md) | Freeform player action modes | S03 | M1 | **PARTIAL** | [DEV-002B scoped audit](./evidence/DEV-002B-requirements-audit.md); remaining inventory draft | [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](./evidence/DEV-002B.md) |
| [IDEA-0003](../production/Direct%20Editable%20Prose%20Document.md) | Direct editable prose document | S03 | M2 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0004](../production/Retry%20Undo%20and%20Alternative%20Continuations.md) | Retry, Undo and alternate continuations | S05 | M2 | **IMPLEMENTED / UNVERIFIED (Retry only, PR open)** | [DEV-003A Retry audit](./requirements/DEV-003.md); full Undo/editing obligations remain | [PR #10](https://github.com/Levelleor/lorebound/pull/10); [evidence](./evidence/DEV-003A.md), [review PASS](./evidence/DEV-003A-review.md); implementation CI PASS/unmerged |
| [IDEA-0005](../production/Adventure%20Save%20and%20Export%20Management.md) | Adventure save/export management | S02 | M7 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0006](../production/Quick%20Start%20and%20Custom%20Story%20Openings.md) | Quick Start and custom openings | S02 | M1 | **PARTIAL** | [R01–R03 VERIFIED](./evidence/DEV-002A.md); [DEV-002B scope](./evidence/DEV-002B.md); remaining parent inventory draft | [Merged PRs #4](https://github.com/Levelleor/lorebound/pull/4) / [#6](https://github.com/Levelleor/lorebound/pull/6) |
| [IDEA-0007](../production/Character%20Creation%20and%20Starting%20Choices.md) | Character creation and starting choices | S10 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0008](../production/Reusable%20Scenario%20Templates%20and%20Placeholders.md) | Reusable scenario templates | S02 | M7 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0010](../production/Narration%20Style%20and%20Perspective%20Controls.md) | Narration style and perspective controls | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0011](../production/Manual%20Generation%20Branches.md) | Manual generation branches | S02 | M2 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0012](../production/Cloud%20LLM%20Provider%20Connectors.md) | Cloud LLM provider connectors | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0013](../production/Local%20LLM%20Server%20Connections.md) | Local LLM server connections | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0014](../production/Provider%20Connection%20Profiles%20and%20Discovery.md) | Provider profiles and discovery | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0015](../production/Model-Capability-Aware%20Controls.md) | Model capability-aware controls | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0016](../production/Sampling%20Presets%20and%20Advanced%20Parameters.md) | Sampling presets and advanced parameters | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0017](../production/One-Model%20Task%20Routing.md) | One-model task routing | S07 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0018](../production/Configurable%20Generation%20Pipeline%20Strategies.md) | Configurable generation pipelines | S07 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0019](../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) | Streaming, cancellation and diagnostics | S07 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0020](../production/Entity-Based%20Lorebook.md) | Entity-based Lorebook | S09 | M4 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0021](../production/Conditional%20Lorebook%20Activation.md) | Conditional Lorebook activation | S09 | M4 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0022](../production/Automatic%20Long-Term%20Story%20Summaries.md) | Automatic long-term summaries | S09 | M4 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0023](../production/Episodic%20Memory%20Retrieval.md) | Episodic memory retrieval | S09 | M4 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0024](../production/Token-Budgeted%20Context%20Builder%20and%20Inspector.md) | Token-budgeted context builder/inspector | S09 | M4 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0025](../production/Author%20Notes%20and%20Persistent%20Story%20Instructions.md) | Author notes and persistent instructions | S08 | M4 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0026](../production/Shared%20PC%20and%20NPC%20Character%20Entities.md) | Shared PC/NPC character entities | S10 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0027](../production/Customisable%20Character%20Status%20Sheets.md) | Customisable character status sheets | S10 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0029](../production/Persistent%20Items%20and%20Inventory%20Transfers.md) | Persistent items and inventory transfers | S11 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0030](../production/Slot-Based%20Equipment%20and%20Body%20Diagram.md) | Equipment slots and body diagram | S11 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0031](../production/Configurable%20Anatomy%20and%20Transformations.md) | Anatomy and transformations | S10 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0033](../production/Hierarchical%20World%20Locations.md) | Hierarchical world locations | S11 | M6 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0034](../production/Character%20Presence%20and%20Current%20Scene.md) | Presence and current scene | S10 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0035](../production/Configurable%20Travel%20Graph%20Rules.md) | Configurable travel graph rules | S11 | M6 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0036](../production/AI%20World%20Discovery%20and%20Expansion.md) | AI world discovery and expansion | S11 | M6 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0037](../production/Zoomable%20Node%20Map%20Canvas.md) | Zoomable node/map canvas | S04 | M6 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0038](../production/Persistent%20Location%20State%20and%20Travel%20Interactions.md) | Persistent location state/travel interactions | S11 | M6 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0039](../production/Event-Sourced%20World%20History.md) | Event-sourced world history | S05 | M1 | **PARTIAL** | [DEV-002B scoped audit](./evidence/DEV-002B-requirements-audit.md); remaining inventory draft | [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](./evidence/DEV-002B.md) |
| [IDEA-0040](../production/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md) | Versioned text blocks and stable passage IDs | S05 | M1 | **PARTIAL** | [DEV-002B scoped audit](./evidence/DEV-002B-requirements-audit.md); remaining inventory draft | [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](./evidence/DEV-002B.md) |
| [IDEA-0041](../production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md) | Historical edit confirmation/truncation | S03 | M2 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0042](../production/Snapshots%20and%20Incremental%20State%20Rebuild.md) | Snapshots and incremental rebuild | S05 | M2 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0044](../production/Deterministic%20Adventure%20Coordinator.md) | Deterministic adventure coordinator | S06 | M1 | **PARTIAL** | [DEV-002B scoped audit](./evidence/DEV-002B-requirements-audit.md); remaining inventory draft | [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](./evidence/DEV-002B.md) |
| [IDEA-0045](../production/LLM%20State%20Interpreter%20and%20Proposed%20Operations.md) | LLM state interpreter and proposals | S07 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0046](../production/Typed%20Tool%20Rejection%20and%20Narrative%20Repair.md) | Typed tool rejection and narrative repair | S06 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0047](../production/Native%20Gameplay%20Capability%20Registry.md) | Native gameplay capability registry | S06 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0050](../production/Structured%20UI%20Game%20Actions.md) | Structured UI game actions | S03 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0051](../production/Browser-Persistent%20Story%20Database.md) | Go-owned browser-persistent story database | S12 | M0 | **PARTIAL** | [DEV-002A merged subsets](./evidence/DEV-002A.md); [DEV-002B scope](./evidence/DEV-002B.md); full inventory draft | [Merged PRs #4](https://github.com/Levelleor/lorebound/pull/4) / [#6](https://github.com/Levelleor/lorebound/pull/6); earlier [Gate 0](https://github.com/Levelleor/lorebound/pull/3) |
| [IDEA-0052](../production/Backups%20Export%20and%20Storage%20Quotas.md) | Backup/export and storage quotas | S12 | M7 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0053](../production/Localhost%20Startup%20and%20Offline%20Mode.md) | Localhost startup and offline mode | S01 | M0 | **PARTIAL** | [DEV-002A merged subsets](./evidence/DEV-002A.md); [DEV-002B scope](./evidence/DEV-002B.md); full inventory draft | [Merged PRs #4](https://github.com/Levelleor/lorebound/pull/4) / [#6](https://github.com/Levelleor/lorebound/pull/6); earlier [Gate 0](https://github.com/Levelleor/lorebound/pull/3) |
| [IDEA-0055](../production/Optional%20RPG%20Mechanics%20Plugins.md) | Optional RPG mechanics plugins | S06 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0061](../production/Lorebound%20Branding%20and%20Engine%20Split.md) | Lorebound branding and engine split | S01 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0062](../production/Accessibility%20and%20Customisable%20Interface.md) | Accessibility and customisable interface | S04 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0064](../production/Automatic%20Character%20Sheet%20Tracking.md) | Automatic character sheet tracking | S10 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0066](../production/AI-Generated%20Starting%20Lorebook%20and%20World.md) | AI-generated starting Lorebook/world | S02 | M7 | **NOT STARTED** | Not yet inventoried | None |

**Whole-idea completion rule:** An IDEA may become `VERIFIED` **only** after its entire currently accepted requirement breakdown is complete; all applicable unit, contract, real integration, browser E2E, visual, failure/recovery and cross-feature/regression gates pass; the reviewer signs off; and source/test evidence is merged on `main`. Partial PRs may verify atomic requirements without verifying the whole IDEA.

## DEV-002A verified and merged

Merged [PR #4](https://github.com/Levelleor/lorebound/pull/4) at `fac5521bfbe7cd63ea3c7b85108b7d1865b678b9` verified blank adventure creation/resume and IDEA-0006/R01–R03. [PR #5](https://github.com/Levelleor/lorebound/pull/5) merged its documentation reconciliation at `858806acc15aa54350af11535e59a8d82e73b7a5`. This remains the earlier milestone; the original 52 IDEA notes stay in production until fully verified.

## DEV-002B verified and merged

[PR #6](https://github.com/Levelleor/lorebound/pull/6) merged at `f0c57b8b808308534cda1c3cb862262c813f5d11` after [independent audit/review](./evidence/DEV-002B-review.md) and [final-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42038112388). The Story-only simulated generation, provisional review, atomic acceptance and structured zero-effects current history now provide partial evidence for seven original ideas; zero whole original ideas are complete. [Scoped implementation evidence](./evidence/DEV-002B.md) traces tested behaviour. Empty world-effect arrays do not verify nonempty event reduction/provenance. The parent 95-row inventory remains draft outside the independently reviewed first slice; this reconciliation does not inflate the formal atomic certification count beyond the three individually recorded DEV-002A rows.

**Post-merge record maintenance:** This correction was prepared on `docs/dev-002b-merge-reconciliation` after PR #6 merged. The preceding application facts are independently verified on main. DEV-002C remains queued and unstarted.

## Atomic requirement tracking (to be populated by DEV-001)

For each note, record *all* normative approved behaviours, exclusions, later superseded conditions, edge cases, negative tests and acceptance evidence. Assign stable `IDEA-NNNN/R##` IDs; the exact breakdown must trace to paragraph/section in the original production idea or later accepted ADR. Link to test file/symbol, test case/CI run, browser evidence and independent review.

When the breakdown becomes substantial, place per-feature requirements in `planning/development/requirements/IDEA-NNNN.md` using the following structure, then link it from the IDEA's row above. **Do not create 52 empty placeholders or pretend requirements were inventoried merely because directories exist.**

```markdown
# IDEA-NNNN — <name>
Source: ../production/<same original IDEA note>.md
Accepted ADRs: <exact citations to decision files>
Overall status: NOT STARTED
Requirement IDs:
| ID | Behaviour / exclusion | Source clause | Status | Test cases | Evidence / PR |
| --- | --- | --- | --- | --- | --- |
| IDEA-NNNN/R01 | ... | ... | NOT STARTED | NOT RUN | None |
Observed gaps / dependencies: ...
Independent reviewer: NOT REVIEWED
```

If a requirement is later changed by an accepted ADR, **retain its ID and history**, mark it `SUPERSEDED BY ...` or refine its wording with a dated note. Never delete or silently drop an accepted requirement to make a metric look better.

## Feature addition and on-the-go discoveries

| Candidate | Proposed capability or clarification | Source & date | Approval status | Intended IDEA/task | Disposition |
| --- | --- | --- | --- | --- | --- |
| _None yet_ | | | | | |

When implementation reveals an **additional feature** not already accepted, record a `CANDIDATE-YYYYMMDD-##` proposal here and a discovery in [JOURNAL](./JOURNAL.md). It remains `PROPOSED`, not approved by virtue of being useful or low-cost. The user must explicitly approve any new scope, and the canonical IDEA/ADR workflow must establish its permanent original idea or qualifying decision before it becomes an implementation requirement. Avoid assigning made-up `IDEA-` IDs or promoting unapproved work.

## Update protocol

- **Before implementing a slice:** identify affected IDEA IDs and create/update their actual atomic requirements. Link the DEV task and branch; use `IN PROGRESS` only after code work begins.
- **As behaviour is implemented:** mark `IMPLEMENTED / UNVERIFIED` or `PARTIAL` where appropriate. Link code/PR/tests; do **not** mark a feature verified on a mock or agent assertion.
- **After execution:** record actual `PASS/FAIL/NOT RUN/BLOCKED/N/A + reason` and evidence URI for each applicable acceptance check.
- **After independent review and merge:** mark completed atomic requirements `VERIFIED`; only then recalculate whole-idea status, current totals, task status and the [NOW](./NOW.md) next task.
- **On new accepted idea or corrected scope:** add/link the new IDEA or updated requirement before coding, preserve approvals/supersession and keep total denominators current.

**Source integrity:** Baseline 52 ID/title/owner links were checked against the [System Architecture Overview](../architecture/Lorebound%20-%20System%20Architecture%20Overview.md), which links to original `planning/production/` notes. No application code or tests were created in establishing this document.

### 2026-11-05 — DEV-002C launch (unmerged)

User explicitly authorised the bounded Story-loop integration/parent verification task. Branch `feat/dev-002c-story-integration` starts from merged PR #7 at `899678ad`. New integration evidence and First-row traceability are pending; seven partial ideas, three formally verified atomic rows and zero complete ideas remain the merged snapshot. Personal-development-style now overrides existing style conventions per user instruction; accepted contracts remain binding.

### 2026-11-05 — DEV-002C local evidence (unmerged)

[Executed checks](./evidence/DEV-002C.md) and [independent review](./evidence/DEV-002C-review.md) pass for deferred invalidation/recovery and the bounded Story parent; [57 First-bearing requirement rows](./evidence/DEV-002C-requirements.md) now have explicit dispositions. Whole-IDEA inventory/certification remains draft beyond that slice. Main counts stay seven PARTIAL, three formally certified atomic rows, zero complete ideas. Final-head CI and merge remain pending.

**Publication:** [DEV-002C PR #8](https://github.com/Levelleor/lorebound/pull/8) OPEN; [implementation-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42088372352) at `30f153db153034e41ce1f62e85ec569a7db0be23`. Latest documentation-head result is tracked in PR checks. Main counts remain unchanged until authorised merge.

### 2026-11-05 — DEV-002C and bounded parent merged

User explicitly authorised merge/finalisation. [PR #8](https://github.com/Levelleor/lorebound/pull/8) merged as `9c4a615b32faee3a513467e3ecc8cf6f5d5b760a` with identical tested tree; [final-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42088907520) and independent review apply. DEV-002/DEV-002C are VERIFIED & MERGED within their Story-only simulated zero-effects scope. The 57-row First matrix is reconciled; seven PARTIAL ideas, three formally certified atomic rows and zero complete ideas remain the feature counts. Earlier unmerged entries above are chronological snapshots. DEV-003 is queued and unstarted.

### 2026-11-05 — DEV-003A authorised local launch

DEV-003 was launched explicitly and split to one bounded Retry child. IDEA-0004/R01–R05 are in progress locally; R06–R12 remain later work. Existing IDEA-0044/0039/0040/0051 commit/history obligations retain their previous partial status. Main still has seven partial original ideas, three formally certified atomic rows, zero complete ideas. [Scope and accepted-source audit](./requirements/DEV-003.md). No original IDEA is archived.

### 2026-11-05 — DEV-003A local checks and independent review PASS

Bounded Story-only/zero-effects portions of IDEA-0004/R01–R05 are implemented with [local evidence](./evidence/DEV-003A.md) and [independent source/unit/runtime review PASS](./evidence/DEV-003A-review.md). R02 does not certify nonempty effects; R06–R12 and full parent obligations remain later/partial as audited. No additional atomic rows are formally VERIFIED before publication CI and merge. Main counts remain seven partial ideas, three formally certified atomic rows, zero complete original ideas.

### 2026-11-05 — DEV-003A publication launch

The user authorised the recorded next action: commit/push/PR and final-head CI. Reviewed source hashes still match the independent report, and fetched `origin/main` remains `34f25a0fa841827b0b4486106e411c9d28bad2ab`. Publication changes no requirement completion or merged-main feature counts.

### 2026-11-05 — DEV-003A published with passing implementation CI

[PR #10](https://github.com/Levelleor/lorebound/pull/10) is OPEN. Implementation `e422d8093cde4c1a4f8432a1caf0739885884c5d` passed [CI run 42140685316](https://github.com/Levelleor/lorebound/actions/runs/42140685316): zero frontend diagnostics, 30 TS cases, real SQLite contracts, Go vet, real Firefox/Wails/Go/SQLite and exact restart. Independent review/source continuity PASS. This documentation follow-up carries the PR status and evidence; its latest-head checks are visible on the PR. Merge remains outstanding, so merged-main counts and formal requirement certification stay unchanged.
