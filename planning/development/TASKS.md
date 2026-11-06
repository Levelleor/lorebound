---
type: development-task-queue
status: current
created: "2026-11-03"
updated: "2026-11-06"
current_next_task: "DEV-003"
---

# Lorebound — Development Task Queue

[NOW](./NOW.md) owns the single next development task. This queue owns scope/dependencies; [FEATURES](./FEATURES.md) owns IDEA completion, requirement records own coverage, and PR/CI owns execution details. Split large tasks into bounded children when separately authorised; closing a child never launches another.

## Ordered execution queue

| Task | Outcome | Depends on | Primary IDEA coverage | Status | PR/evidence |
| --- | --- | --- | --- | --- | --- |
| **DEV-001** | Minimal CI/checks + traceability for Story-mode-first | Merged Gate 0 | IDEA-0002, IDEA-0006, IDEA-0039, IDEA-0040, IDEA-0044, IDEA-0051, IDEA-0053; global 52-idea register | **INTERRUPTED / REPRIORITISED** | `feat/dev-001-verification-controls` |
| **DEV-002** | First complete accepted Story-mode turn in real host/SQLite | Gate 0; verification controls integrated in children after explicit user reprioritisation | IDEA-0002, IDEA-0006, IDEA-0039, IDEA-0040, IDEA-0044, IDEA-0051 | **VERIFIED & MERGED — bounded Story-only zero-effects scope** | A merged [PR #4](https://github.com/Levelleor/lorebound/pull/4); B merged [PR #6](https://github.com/Levelleor/lorebound/pull/6); C merged [PR #8](https://github.com/Levelleor/lorebound/pull/8) |
| **DEV-003** | Retry, drafts, Undo/Fork and current-history prose editing | DEV-002 | IDEA-0003, IDEA-0004, IDEA-0005, IDEA-0041, IDEA-0042, IDEA-0011 | **PARTIAL**; DEV-003A/B/C merged; DEV-003D finalisation approved; conditional closure in PR #14 | [PR #10](https://github.com/Levelleor/lorebound/pull/10), [PR #12](https://github.com/Levelleor/lorebound/pull/12), [PR #13](https://github.com/Levelleor/lorebound/pull/13), [PR #14](https://github.com/Levelleor/lorebound/pull/14) |
| **DEV-004** | Direct browser cloud/local models, profiles, streaming, pipelines and interpretation | DEV-002 + bounded service security review | IDEA-0010, IDEA-0012–IDEA-0019, IDEA-0045, IDEA-0046 | QUEUED | None |
| **DEV-005** | Lorebook, author notes, context budget and derived memory | DEV-002; DEV-004 interfaces | IDEA-0020–IDEA-0025 | QUEUED | None |
| **DEV-006** | Universal characters, Playing As, status, anatomy, items and equipment | DEV-002; supported typed entity events | IDEA-0007, IDEA-0026, IDEA-0027, IDEA-0029–IDEA-0031, IDEA-0034, IDEA-0064 | QUEUED | None |
| **DEV-007** | Locations, containment/routes, discovery, simple grounded map | DEV-006; relevant accepted event/geometry rules | IDEA-0033, IDEA-0035–IDEA-0038 | QUEUED | None |
| **DEV-008** | Adventure library operations, templates, starting world and backup/restore | DEV-002; DEV-003 and storage safety | IDEA-0005, IDEA-0008, IDEA-0052, IDEA-0066 | QUEUED | None |
| **DEV-009** | Structured actions, optional capabilities, full Command Citadel UI, accessibility | Integrates prior player-facing slices | IDEA-0001, IDEA-0037, IDEA-0047, IDEA-0050, IDEA-0055, IDEA-0061, IDEA-0062 and cross-cutting UI | QUEUED | None |
| **DEV-010** | End-to-end product verification, platform/release audit and outstanding feature closure | All relevant slices | **All 52 original IDEAs and all active atomic requirements** | QUEUED | None |

This is a working order, not permission to implement all tasks together. Cross-cutting IDEAs may span tasks; DEV-010 must audit all accepted requirements rather than trusting task titles.

## DEV-001 — CI and first-slice traceability

**INTERRUPTED / REPRIORITISED.** The user redirected its 2026-11-03 launch to DEV-002A's production replacement. CI was integrated in that child; broader inventory certification remains unfinished. [Original draft inventory](./requirements/DEV-002.md), [short record](./evidence/DEV-001.md).

Remaining requirement work is incremental: inventory affected accepted clauses, superseding ADRs, exclusions and objective criteria before their implementation. Do not delay product delivery to create empty inventories for every idea. CI coverage is now maintained under the [verification workflow](../../.github/workflows/verify.yml), rather than as repeated manual execution reports.

## DEV-002 — First accepted Story-mode turn

**VERIFIED & MERGED within simulated Story-only, zero-effects scope.** Children A/B/C implement blank entry, provisional authored/generated passages, explicit acceptance, atomic Go/SQLite persistence, pure TypeScript replay and integrated recovery. Distinct stable passage IDs, coherent reads, version/epoch/idempotency fencing and unsupported-effect safe failure are binding. No live-model or nonempty-world implementation is implied.

### DEV-002A — Production blank adventure creation and resume

**VERIFIED & MERGED.** [PR #4](https://github.com/Levelleor/lorebound/pull/4); [delivery record](./evidence/DEV-002A.md).

Acceptance: independent blank adventure with optional title/default, atomic minimal empty Turn-0 baseline, list/resume after browser/process restart, isolation, unchanged-request uncertain-create recovery, technical validation/rollback and responsive accessible entry UI. No actor/model/generated opening required. Certifies IDEA-0006/R01–R03 only; storage/host ideas remain partial.

### DEV-002B — First provisional and accepted Story turn (MERGED)

**VERIFIED & MERGED.** [PR #6](https://github.com/Levelleor/lorebound/pull/6); [accepted-source scope](./requirements/DEV-002B.md), [delivery record](./evidence/DEV-002B.md).

Acceptance: characterless multiline Story input, explicitly simulated generation, provisional authored/generated passages, Stop/Discard/explicit Accept, atomic ordered structured passage/empty-effect commit and coherent replay/read. Technical malformed/stale/epoch/rollback/isolation/idempotency/receipt-recovery cases apply. Nonspatial upgrade preserves blank adventures; wire version rejects incompatible old readers. No silent acceptance/rebase or second browser canon.

### DEV-002C — Story-loop integration and parent verification

**VERIFIED & MERGED, including bounded parent DEV-002.** [PR #8](https://github.com/Levelleor/lorebound/pull/8); [57-row first-slice matrix](./requirements/DEV-002C.md), [delivery record](./evidence/DEV-002C.md).

Acceptance: safe coalesced cross-tab refresh, typing during reads, pending-state isolation, navigation/cancellation, post-commit read failure, original receipt after newer history, conflict/refetch failure and last-tab closure. Technical/conflict diagnostics survive background hints. Every First-bearing parent row has a tested/partial/later disposition. Empty effects cannot certify nonempty reducers/provenance; broader inventory remains draft.

### DEV-003 — Retry, drafts, Undo/Fork and current-history editing

**PARTIAL.** DEV-002 dependency is satisfied; [scope/dependency audit](./requirements/DEV-003.md). A/B/C are merged; PR #13’s merge is confirmed in [NOW](./NOW.md). The user separately launched an audit and selected DEV-003D below. Passage/manual-correction drafts, committed Undo and historical editing remain unstarted; temporary undo outside Story input remains later. Closing this child requires a separate launch before another selection.

### DEV-003A — Replace the provisional Story candidate on Retry

**VERIFIED & MERGED, bounded simulated Story-only scope.** [PR #10](https://github.com/Levelleor/lorebound/pull/10); [delivery record](./evidence/DEV-003A.md).

Acceptance: immediate old-candidate invalidation, repeated provisional replacement, latest-only explicit acceptance, input preservation on failure/Stop, late-result fencing and existing uncertain-write/stale-version/epoch safeguards. IDEA-0004/R01–R05 have bounded coverage; nonempty effects and full later-history obligations remain unfinished.

### DEV-003B — Independent committed Story-prefix Fork

**VERIFIED & MERGED, bounded simulated Story-only scope.** [PR #12](https://github.com/Levelleor/lorebound/pull/12); [scoped requirements](./requirements/DEV-003B.md), [delivery record and confirmed merge](./evidence/DEV-003B.md).

Acceptance: accessible small icon beneath each accepted turn; complete supported prefix/baseline in an independent adventure and separate browser tab/window; default `fork: [source name]`, codepoint-safe to 160; source URL/history/live input preserved. Blocked popup makes no write; lost-response/closed/navigated-target recovery does not recopy; stale rejection requires a new deliberate decision. Atomic copy/rollback, source version/epoch/idempotency guards, isolation and restart apply. No turn/title form, rename, schema migration, source receipts or provisional/draft copy.

IDEA-0011 is PARTIAL, not complete. World/Lorebook/memory/plugin copying and rename/edit/delete integration remain later. Its merge approval authorised this child alone.

### DEV-003C — Shared latest Story composer draft

**VERIFIED & MERGED — [PR #13](https://github.com/Levelleor/lorebound/pull/13).** The user accepted the review handoff and approved finalising/merging this PR on 2026-11-06. [Requirement/dependency audit](./requirements/DEV-003C.md) owns acceptance, tests and CI/review. The merge at `3632386d407efc0e40bfe9a8c9e7916a9fef9199` is confirmed; actual provenance/final CI belongs in PR #13. Scope: debounced noncanonical Story input, latest-value recovery, truthful failure/retry status, atomic matching-input consumption and epoch/upgrade/isolation safety, plus the prerequisite maintenance below. Review servers are stopped and data preserved. Other editor/history work and B9-D12 remain outside scope; no next child is launched.

### DEV-003D — Temporary Story input Undo/Redo

**VERIFIED ON CONFIRMED MERGE — [PR #14](https://github.com/Levelleor/lorebound/pull/14).** [Accepted-source audit, dependency dispositions and criteria](./requirements/DEV-003D.md). Selected under the user's separate 2026-11-06 launch.

Acceptance: bounded in-memory Story input edits, named buttons/keyboard controls and selection recovery, latest-draft autosave, empty histories on reload/generation/acceptance/canonical replacement/disposal, and no canonical mutations or candidate recovery. Committed Undo, passage editing and B9-D12 remain unselected/deferred. Independent source/coverage review and readiness CI PASS. The user authorised independent subagent review and finalisation after the named-PR handoff. Closure becomes effective only after review, applicable final-head checks and confirmed merge of this same PR. No next child starts.

## Prerequisite maintenance: CI, concise controls and hands-on review

User-requested removal of generated planning output, consolidation of repeated writeups and stable task-neutral instructions is carried in DEV-003C's primary PR. CI keeps routine output in job logs, retains selected artifacts for seven days, checks repository hygiene/links and skips the application suite for documentation-only changes. A single development command builds/launches a persistent isolated review library; handoffs provide a URL/command and demo before merge sign-off. [NOW](./NOW.md) owns readiness. This maintenance does not complete DEV-001's outstanding requirement certification.

## Verification and cross-cutting gates

Use [CI and the evidence policy](./README.md#ci-and-evidence-policy) for repeatable checks and short-lived captures. Reviewers reuse passing application CI for the reviewed revision; focused local checks address specific concerns. Keep scope, test references, CI/review links and missing coverage in the task/PR, without execution transcripts or separate reconciliation reports.

- **B9-D12:** spatial event/schema migration remains DEFERRED, requiring separate explicit authority.
- **Sensitive Go services:** current browser Origin/Host restrictions do not authenticate arbitrary hostile local processes; review the access boundary before sensitive extensions.
- **Epoch rotation:** validate original-operation replay across restore/library changes when those workflows are implemented.
- **UI:** automate relevant responsive/keyboard/state checks and review CI captures against the accepted visual contract. No whole-application accessibility claim from narrow geometry checks.
- **Release:** all active accepted requirements need verification or an explicit user exception, including relevant cross-feature and platform checks.

For a newly split task, record its ID/parent, authorisation, dependency/scope/acceptance, branch/PR, requirement/test references, CI/review result, material limits and one next action. Update NOW only when the current handoff changes. Follow single-primary-PR closure and separate launch authority.
