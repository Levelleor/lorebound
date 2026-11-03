---
type: development-feature-ledger
status: current
created: "2026-11-03"
updated: "2026-11-03"
baseline_idea_count: 52
verified_idea_count: 0
---

# Lorebound — Feature Coverage & Verification Ledger

**This is the authoritative live feature-completion ledger for the development workflow.** Exactly **52 original accepted IDEA notes** exist in [production](../production/). They are *approved scopes*, not implemented features. A partial technical foundation is **not** completion of a whole IDEA. The [current task](./NOW.md), [task queue](./TASKS.md) and [runbook](./AGENT-RUNBOOK.md) govern how evidence is added.

## Baseline completeness, 2026-11-03

| Measure | Current status |
| --- | --- |
| Original approved IDEA notes accounted for here | **52 / 52** |
| Original IDEA notes in production | **52** |
| Original IDEA notes in staging | **0** |
| Fully VERIFIED complete ideas | **0** |
| PARTIAL foundation evidence | **2**: IDEA-0051, IDEA-0053 from merged Gate 0 PR #3 |
| Remaining notes with no feature-level implementation evidence | **50** |
| Accepted **atomic** requirements inventoried | **Not yet counted or exhaustively decomposed**, DEV-001 owns baseline requirement inventory |
| Atomic requirements marked VERIFIED | **0** (no complete inventory or independent feature sign-off yet) |
| New feature proposals awaiting approval | **0 recorded** |
| Deferred spatial migration | **B9-D12 DEFERRED**, not an automatically accepted requirement |

**Caution:** The 52 rows below guarantee **idea-level visibility**, not complete subrequirement coverage. **DEV-001 must extract each actual normative requirement and each later accepted ADR qualification** into individually traceable `IDEA-NNNN/R01`, `/R02`, ... IDs before any idea can be certified complete. Never invent how many requirements are finished based only on a title. `PARTIAL` means the same original feature contains *some* working bounded Gate 0 functionality.

## Implementation milestones

Milestone grouping below is a **proposed sequencing/coverage aid**; it does not create new architectural approval or prevent a feature from spanning multiple slices.

| Milestone | Working capability target | Existing partial evidence / dependency |
| --- | --- | --- |
| **M0** | Real Wails/browser/Go + Go SQLite technical host/storage foundation | [Gate 0 merged PR #3](https://github.com/Levelleor/lorebound/pull/3) only; broader host/storage requirements remain open |
| **M1** | One accepted, reopened Story-mode turn and basic adventure entry | **DEV-002**, after DEV-001 controls |
| **M2** | Edit, Retry, Undo, Fork, current-history recovery | Depends on M1 |
| **M3** | Real browser-side model providers, streaming, interpretation and routing | Depends on M1 contract; deterministic mocked scenarios plus separate provider smoke |
| **M4** | Lorebook, derived context/memory and author notes | Depends on canonical history and provider context |
| **M5** | Characters, playing-as, scene, statuses, items/equipment | Depends on stable IDs, current events |
| **M6** | World locations, routes, discovery, simple semantic map | Depends on M5 grounding; **no deferred B9-D12 spatial migrations** |
| **M7** | Adventure templates, starts, library lifecycle, full backup/restore | Integrates earlier slices; technical epoch fencing |
| **M8** | Structured/optional mechanics, accessibility, Command Citadel fidelity and release checks | Integrated cross-cutting delivery and supported platforms |

## All original approved ideas (52/52)

**Status meanings:** `NOT STARTED`, `IN PROGRESS`, `IMPLEMENTED / UNVERIFIED`, `PARTIAL`, `BLOCKED`, `VERIFIED`, `DEFERRED`. See [runbook](./AGENT-RUNBOOK.md). **Requirements** means *atomic accepted requirements already inventoried and evidenced*, not a guess based on the note title.

| Approved original IDEA | Feature | Primary subsystem | First milestone | Status | Requirement coverage | Evidence / PR |
| --- | --- | --- | --- | --- | --- | --- |
| [IDEA-0001](../production/Single-Player%20Account-Free%20Experience.md) | Single-player account-free experience | S01 | M1 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0002](../production/Freeform%20Player%20Action%20Modes.md) | Freeform player action modes | S03 | M1 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0003](../production/Direct%20Editable%20Prose%20Document.md) | Direct editable prose document | S03 | M2 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0004](../production/Retry%20Undo%20and%20Alternative%20Continuations.md) | Retry, Undo and alternate continuations | S05 | M2 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0005](../production/Adventure%20Save%20and%20Export%20Management.md) | Adventure save/export management | S02 | M7 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0006](../production/Quick%20Start%20and%20Custom%20Story%20Openings.md) | Quick Start and custom openings | S02 | M1 | **NOT STARTED** | Not yet inventoried | None |
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
| [IDEA-0039](../production/Event-Sourced%20World%20History.md) | Event-sourced world history | S05 | M1 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0040](../production/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md) | Versioned text blocks and stable passage IDs | S05 | M1 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0041](../production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md) | Historical edit confirmation/truncation | S03 | M2 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0042](../production/Snapshots%20and%20Incremental%20State%20Rebuild.md) | Snapshots and incremental rebuild | S05 | M2 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0044](../production/Deterministic%20Adventure%20Coordinator.md) | Deterministic adventure coordinator | S06 | M1 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0045](../production/LLM%20State%20Interpreter%20and%20Proposed%20Operations.md) | LLM state interpreter and proposals | S07 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0046](../production/Typed%20Tool%20Rejection%20and%20Narrative%20Repair.md) | Typed tool rejection and narrative repair | S06 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0047](../production/Native%20Gameplay%20Capability%20Registry.md) | Native gameplay capability registry | S06 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0050](../production/Structured%20UI%20Game%20Actions.md) | Structured UI game actions | S03 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0051](../production/Browser-Persistent%20Story%20Database.md) | Go-owned browser-persistent story database | S12 | M0 | **PARTIAL** | Not yet inventoried | [Gate 0](https://github.com/Levelleor/lorebound/pull/3) (foundation only) |
| [IDEA-0052](../production/Backups%20Export%20and%20Storage%20Quotas.md) | Backup/export and storage quotas | S12 | M7 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0053](../production/Localhost%20Startup%20and%20Offline%20Mode.md) | Localhost startup and offline mode | S01 | M0 | **PARTIAL** | Not yet inventoried | [Gate 0](https://github.com/Levelleor/lorebound/pull/3) (foundation only) |
| [IDEA-0055](../production/Optional%20RPG%20Mechanics%20Plugins.md) | Optional RPG mechanics plugins | S06 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0061](../production/Lorebound%20Branding%20and%20Engine%20Split.md) | Lorebound branding and engine split | S01 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0062](../production/Accessibility%20and%20Customisable%20Interface.md) | Accessibility and customisable interface | S04 | M8 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0064](../production/Automatic%20Character%20Sheet%20Tracking.md) | Automatic character sheet tracking | S10 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0066](../production/AI-Generated%20Starting%20Lorebook%20and%20World.md) | AI-generated starting Lorebook/world | S02 | M7 | **NOT STARTED** | Not yet inventoried | None |

**Whole-idea completion rule:** An IDEA may become `VERIFIED` **only** after its entire currently accepted requirement breakdown is complete; all applicable unit, contract, real integration, browser E2E, visual, failure/recovery and cross-feature/regression gates pass; the reviewer signs off; and source/test evidence is merged on `main`. Partial PRs may verify atomic requirements without verifying the whole IDEA.

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
