---
type: development-feature-ledger
status: current
created: "2026-11-03"
updated: "2026-11-10"
baseline_idea_count: 52
verified_idea_count: 0
---

# Lorebound — Feature Coverage & Verification Ledger

**This is the authoritative live feature-completion ledger for the development workflow.** Exactly **52 original accepted IDEA notes** exist in [production](../production/). They are *approved scopes*, not implemented features. A partial technical foundation is **not** completion of a whole IDEA. The [current task](./NOW.md), [task queue](./TASKS.md) and [runbook](./AGENT-RUNBOOK.md) govern how evidence is added.

## Reconciled completeness, 2026-11-09

[PR #15](https://github.com/Levelleor/lorebound/pull/15) is confirmed merged at `987310abf8ad39d43144c53ae77c78da937bff3b`, satisfying DEV-003E's conditional closure. At that merge, work gave eleven partial / 41 without feature-level evidence / zero complete original ideas, with three formally certified IDEA-0006 rows unchanged. PR #14's composer-only scope remains historical; #15 removed those custom controls and delivered committed-turn Undo.

[PR #16](https://github.com/Levelleor/lorebound/pull/16) is confirmed merged at `020e36fd68b2360982ff288622539dcc42058552`, satisfying [DEV-003F](./requirements/DEV-003F.md)'s conditional closure. Generated-passage editing makes IDEA-0003/0041 PARTIAL: **thirteen partial / 39 without feature-level evidence / zero complete**. All original ideas remain in production; three formal IDEA-0006 rows are unchanged. [DEV-003G](./requirements/DEV-003G.md) extends the same nine stable rows to authored passages in confirmed merged [PR #17](https://github.com/Levelleor/lorebound/pull/17), merge `632ed6fb78b88a51e5135a516ff7ec7a1e35fdb1`; its reviewed final-head CI satisfies the prepared closure. [DEV-003H](./requirements/DEV-003H.md) is verified within temporary passage-editor scope after confirmed [PR #18](https://github.com/Levelleor/lorebound/pull/18) merge `39d770c59392f514fb2e2b59499f21da10a59833`; its approved conditional closure is satisfied. [DEV-003I](./requirements/DEV-003I.md) extends existing recovery rows through same-tab reload. Application/readiness CI and independent source/coverage/capture/readiness review PASS; after the checked handoff, the user approved finalising/merging PR #19 on 2026-11-08. **Confirmed PR #19 merge `667bd51e508159c36fa501d7c3f5885b8edd9ae9` satisfies that approved closure.** [DEV-003J](./requirements/DEV-003J.md) extends Fork reload recovery in the same supported scope. Complete readiness-head CI and independent source/coverage/eight-capture/readiness review PASS; after the checked handoff, the user approved finalising/merging PR #20 on 2026-11-08. **Confirmed PR #20 merge `6f74134b6dd72228040939f9cfba22f12699ecd9` satisfies its approved closure.** Counts remain unchanged; no new whole-row certification or whole-IDEA completion is claimed.

Confirmed [PR #21](https://github.com/Levelleor/lorebound/pull/21) merge `3e37f2dcd9d2f6018990a33579b44d87ee3cfe7f` satisfies DEV-004A's approved conditional closure: sixteen partial / 36 without merged feature-level evidence / zero complete originals. Its requirement record and PR own CI, independent review and the separate live Qwen3 smoke result/limits. The user's separate launch selects [DEV-004B](./requirements/DEV-004B.md), awaiting user review in [PR #22](https://github.com/Levelleor/lorebound/pull/22); its streaming coverage is unmerged and changes no whole-IDEA status.

| Measure | Current status |
| --- | --- |
| Original approved IDEA notes accounted for here | **52 / 52** |
| Original IDEA notes in production | **52** |
| Original IDEA notes in staging | **0** |
| Fully VERIFIED complete ideas | **0** |
| PARTIAL foundation evidence | **16 on confirmed PR #21 merge**: IDEA-0002, IDEA-0003, IDEA-0004, IDEA-0005, IDEA-0006, IDEA-0011, IDEA-0013, IDEA-0014, IDEA-0019, IDEA-0039, IDEA-0040, IDEA-0041, IDEA-0042, IDEA-0044, IDEA-0051, IDEA-0053 from PRs #4/#6/#8/#10/#12/#13/#15/#16 and earlier Gate 0 PR #3, plus bounded local narration/profile/cancellation evidence in PR #21 |
| Notes without merged feature-level implementation evidence | **36 on confirmed PR #21 merge** |
| Accepted **atomic** requirements inventoried | **145 recorded rows across sixteen IDEAs**: prior 140 through [DEV-004A](./requirements/DEV-004A.md), plus five affected IDEA-0013/0019 streaming rows in [DEV-004B](./requirements/DEV-004B.md) (implemented/reviewed in unmerged PR #22). DEV-002C reconciles 57 First-bearing rows; whole-IDEA inventory/certification remains incomplete |
| Atomic requirements marked VERIFIED | **3 formally certified**: IDEA-0006/R01–R03 from PR #4. DEV-002B/C and DEV-003A have tested scoped requirement coverage; no extra whole-row certification is inferred from mixed/later or empty-effect coverage |
| New feature proposals awaiting approval | **0 recorded** |
| Deferred spatial migration | **B9-D12 DEFERRED**, not an automatically accepted requirement |

**Caution:** The 52 rows below guarantee **idea-level visibility**, not complete subrequirement coverage. **Inventory affected normative requirements and later accepted ADR qualifications incrementally** into individually traceable `IDEA-NNNN/R01`, `/R02`, ... IDs before any idea can be certified complete. Never invent how many requirements are finished based only on a title. `PARTIAL` means the same original feature contains *some* working bounded functionality.

## Implementation milestones

Milestone grouping below is a **proposed sequencing/coverage aid**; it does not create new architectural approval or prevent a feature from spanning multiple slices.

| Milestone | Working capability target | Existing partial evidence / dependency |
| --- | --- | --- |
| **M0** | Real Wails/browser/Go + Go SQLite technical host/storage foundation | [Gate 0 merged PR #3](https://github.com/Levelleor/lorebound/pull/3), extended by [DEV-002A merged PR #4](https://github.com/Levelleor/lorebound/pull/4); broader host/storage requirements remain open |
| **M1** | One accepted, reopened Story-mode turn and basic adventure entry | **DEV-002**: **VERIFIED & MERGED bounded scope**, A/B/C merged with final-head CI and independent review; [PR #8](https://github.com/Levelleor/lorebound/pull/8) |
| **M2** | Edit, Retry, Undo, Fork, current-history recovery | Provisional Retry and Fork verified/merged in PRs #10/#12; [DEV-003C](./requirements/DEV-003C.md) composer drafts verified/merged in PR #13; DEV-003D merged; DEV-003E committed-turn Undo verified/merged in PR #15; DEV-003F generated-passage editor verified/merged in PR #16; DEV-003G authored editing verified/merged in PR #17; DEV-003H temporary passage history verified/merged in PR #18; DEV-003I same-tab reload save recovery verified/merged in PR #19; DEV-003J Fork reload recovery verified/merged in PR #20; [remaining parent audit](./requirements/DEV-003.md#remaining-scope-audit--2026-11-08) identifies later dependencies |
| **M3** | Real browser-side model providers, streaming, interpretation and routing | [DEV-004A](./requirements/DEV-004A.md) verified/merged in PR #21: completed local narration/profiles; [DEV-004B](./requirements/DEV-004B.md) streaming awaiting user review in PR #22; interpretation/routing remain later |
| **M4** | Lorebook, derived context/memory and author notes | Depends on canonical history and provider context |
| **M5** | Characters, playing-as, scene, statuses, items/equipment | Depends on stable IDs, current events |
| **M6** | World locations, routes, discovery, simple semantic map | Depends on M5 grounding; **no deferred B9-D12 spatial migrations** |
| **M7** | Adventure templates, starts, library lifecycle, full backup/restore | Integrates earlier slices; technical epoch fencing |
| **M8** | Structured/optional mechanics, accessibility, Command Citadel fidelity and release checks | Integrated cross-cutting delivery and supported platforms |

Merged DEV-002C extends the same seven partial ideas with safe deferred invalidation, recovery and first-slice integration evidence: [delivery record](./evidence/DEV-002C.md), [57-row matrix](requirements/DEV-002C.md). No complete IDEA is certified.

## All original approved ideas (52/52)

**Status meanings:** `NOT STARTED`, `IN PROGRESS`, `IMPLEMENTED / UNVERIFIED`, `PARTIAL`, `BLOCKED`, `VERIFIED`, `DEFERRED`. See [runbook](./AGENT-RUNBOOK.md). **Requirements** means *atomic accepted requirements already inventoried and evidenced*, not a guess based on the note title.

| Approved original IDEA | Feature | Primary subsystem | First milestone | Status | Requirement coverage | Evidence / PR |
| --- | --- | --- | --- | --- | --- | --- |
| [IDEA-0001](../production/Single-Player%20Account-Free%20Experience.md) | Single-player account-free experience | S01 | M1 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0002](../production/Freeform%20Player%20Action%20Modes.md) | Freeform player action modes | S03 | M1 | **PARTIAL** | [DEV-002B scoped audit](requirements/DEV-002B.md); remaining inventory draft | [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](./evidence/DEV-002B.md) |
| [IDEA-0003](../production/Direct%20Editable%20Prose%20Document.md) | Direct editable prose document | S03 | M2 | **PARTIAL** | [Four affected rows; generated-passage boundary](./requirements/DEV-003F.md); broader editing later | [PR #16](https://github.com/Levelleor/lorebound/pull/16), confirmed merged; authored coverage in [DEV-003G](./requirements/DEV-003G.md) verified/merged in PR #17 |
| [IDEA-0004](../production/Retry%20Undo%20and%20Alternative%20Continuations.md) | Retry, Undo and alternate continuations | S05 | M2 | **PARTIAL** | [DEV-003A Retry audit](./requirements/DEV-003.md); [DEV-003E committed turn Undo](./requirements/DEV-003E.md) verified/merged in PR #15; DEV-003D composer-only scope rejected; temporary passage-editor history in [DEV-003H](./requirements/DEV-003H.md), verified/merged in PR #18; [DEV-003I reload recovery](./requirements/DEV-003I.md) verified/merged in PR #19; broader replay remains later | [Merged PR #10](https://github.com/Levelleor/lorebound/pull/10); [delivery/review](./evidence/DEV-003A.md) |
| [IDEA-0005](../production/Adventure%20Save%20and%20Export%20Management.md) | Adventure save/export management | S02 | M7 | **PARTIAL** | [Seven scoped draft requirements](./requirements/DEV-003C.md); [DEV-003F generated-passage drafts](./requirements/DEV-003F.md) verified/merged in PR #16; authored drafts verified/merged in DEV-003G PR #17; other modes and full library lifecycle remain later | [PR #13](https://github.com/Levelleor/lorebound/pull/13), confirmed merged |
| [IDEA-0006](../production/Quick%20Start%20and%20Custom%20Story%20Openings.md) | Quick Start and custom openings | S02 | M1 | **PARTIAL** | [R01–R03 VERIFIED](./evidence/DEV-002A.md); [DEV-002B scope](./evidence/DEV-002B.md); remaining parent inventory draft | [Merged PRs #4](https://github.com/Levelleor/lorebound/pull/4) / [#6](https://github.com/Levelleor/lorebound/pull/6) |
| [IDEA-0007](../production/Character%20Creation%20and%20Starting%20Choices.md) | Character creation and starting choices | S10 | M5 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0008](../production/Reusable%20Scenario%20Templates%20and%20Placeholders.md) | Reusable scenario templates | S02 | M7 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0010](../production/Narration%20Style%20and%20Perspective%20Controls.md) | Narration style and perspective controls | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0011](../production/Manual%20Generation%20Branches.md) | Manual generation branches | S02 | M2 | **PARTIAL** | [DEV-003B scoped inventory](./requirements/DEV-003B.md); [DEV-003J reload recovery](./requirements/DEV-003J.md) verified/merged in PR #20 | [PR #12](https://github.com/Levelleor/lorebound/pull/12), [delivery/review](./evidence/DEV-003B.md) |
| [IDEA-0012](../production/Cloud%20LLM%20Provider%20Connectors.md) | Cloud LLM provider connectors | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0013](../production/Local%20LLM%20Server%20Connections.md) | Local LLM server connections | S08 | M3 | **PARTIAL** | [DEV-004A R01–R03](./requirements/DEV-004A.md) merged; [DEV-004B R04](./requirements/DEV-004B.md) streaming awaiting user review in PR #22; broader scope remains later | [PR #21](https://github.com/Levelleor/lorebound/pull/21), confirmed merged |
| [IDEA-0014](../production/Provider%20Connection%20Profiles%20and%20Discovery.md) | Provider profiles and discovery | S08 | M3 | **PARTIAL on confirmed PR #21 merge** | [DEV-004A R01–R03](./requirements/DEV-004A.md); bounded local narration only, broader scope remains later | [PR #21](https://github.com/Levelleor/lorebound/pull/21), approved conditional closure; actual provenance/final CI in PR |
| [IDEA-0015](../production/Model-Capability-Aware%20Controls.md) | Model capability-aware controls | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0016](../production/Sampling%20Presets%20and%20Advanced%20Parameters.md) | Sampling presets and advanced parameters | S08 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0017](../production/One-Model%20Task%20Routing.md) | One-model task routing | S07 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0018](../production/Configurable%20Generation%20Pipeline%20Strategies.md) | Configurable generation pipelines | S07 | M3 | **NOT STARTED** | Not yet inventoried | None |
| [IDEA-0019](../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) | Streaming, cancellation and diagnostics | S07 | M3 | **PARTIAL** | [DEV-004A R01–R02](./requirements/DEV-004A.md) merged; [DEV-004B R03–R06](./requirements/DEV-004B.md) streaming awaiting user review in PR #22; full diagnostics/pipelines remain later | [PR #21](https://github.com/Levelleor/lorebound/pull/21), confirmed merged |
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
| [IDEA-0039](../production/Event-Sourced%20World%20History.md) | Event-sourced world history | S05 | M1 | **PARTIAL** | [DEV-002B scoped audit](requirements/DEV-002B.md); remaining inventory draft | [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](./evidence/DEV-002B.md) |
| [IDEA-0040](../production/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md) | Versioned text blocks and stable passage IDs | S05 | M1 | **PARTIAL** | [DEV-002B scoped audit](requirements/DEV-002B.md); remaining inventory draft | [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](./evidence/DEV-002B.md) |
| [IDEA-0041](../production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md) | Historical edit confirmation/truncation | S03 | M2 | **PARTIAL** | [Five affected rows](./requirements/DEV-003F.md); zero-effects generated-passage boundary | [PR #16](https://github.com/Levelleor/lorebound/pull/16), confirmed merged; authored coverage in [DEV-003G](./requirements/DEV-003G.md) verified/merged in PR #17 |
| [IDEA-0042](../production/Snapshots%20and%20Incremental%20State%20Rebuild.md) | Snapshots and incremental rebuild | S05 | M2 | **PARTIAL** | [R01 partial Story-only reconstruction coverage](./requirements/DEV-003E.md#affected-idea-0042-reconstruction-requirement); nonempty world/derived/module coverage remains later | [Merged PR #15](https://github.com/Levelleor/lorebound/pull/15) |
| [IDEA-0044](../production/Deterministic%20Adventure%20Coordinator.md) | Deterministic adventure coordinator | S06 | M1 | **PARTIAL** | [DEV-002B scoped audit](requirements/DEV-002B.md); remaining inventory draft | [Merged PR #6](https://github.com/Levelleor/lorebound/pull/6); [evidence](./evidence/DEV-002B.md) |
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

## Atomic requirement records

Inventory all normative accepted behaviors, exclusions, negative cases and later ADR qualifications for the affected idea before certifying it. Keep stable `IDEA-NNNN/R##` IDs, source clauses, implemented/remaining scope and test-file/symbol references in [requirements](./requirements/). Link task/PR/CI and review disposition; do not copy execution output or create empty placeholder inventories.

A narrowed slice can pass while a mixed whole requirement remains partial. Preserve IDs and accepted history on supersession; never delete an unfinished requirement to improve a count. Full-IDEA completion still requires all accepted obligations, applicable CI, independent review and confirmed merge.

## Update protocol

- Update the affected row and owning requirement record when scope/status changes; keep unrelated rows stable.
- Link to PR/CI for actual results and the single delivery record when needed. CI owns logs and temporary artifacts.
- Keep verified-main coverage separate from open/uncommitted work. Prepare closure conditionally in the primary PR, then confirm actual merge provenance in the PR/report.
- Record significant decisions in JOURNAL rather than appending repeated execution/status histories here.
- New capabilities remain proposed until explicitly accepted through the IDEA/ADR process. Preserve the original idea and actual approver; never invent official IDs or approval.
