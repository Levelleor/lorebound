---
type: development-task-queue
status: current
created: "2026-11-03"
updated: "2026-11-05"
current_next_task: "DEV-003A"
---

# Lorebound — Development Task Queue

**One next task, clear dependencies, no anonymous work.** The single operational Next Task lives in [NOW.md](./NOW.md); this file owns task scope, delivery order, evidence and review state. The [52-idea feature ledger](./FEATURES.md) owns whole-feature coverage. This queue is **not another architecture approval round**.

## Task lifecycle

`READY` → `IN PROGRESS` → `PR OPEN / REVIEW` → `VERIFIED & MERGED`; alternatively `BLOCKED`, `SPLIT` or `DEFERRED` with reason, owner and next action. **Do not mark a task complete merely because an agent wrote code or submitted a PR.**

Every task has: unique ID, purpose, IDEA/atomic-requirement links, dependencies, acceptance criteria, test/evidence requirements, branch/PR, outstanding risks, independent reviewer, and one next action. Add newly discovered work here, not only in conversation.

## Ordered execution queue

| Task | Outcome | Depends on | Primary IDEA coverage | Status | PR/evidence |
| --- | --- | --- | --- | --- | --- |
| **DEV-001** | Minimal CI/checks + traceability for Story-mode-first | Merged Gate 0 | IDEA-0002, IDEA-0006, IDEA-0039, IDEA-0040, IDEA-0044, IDEA-0051, IDEA-0053; global 52-idea register | **INTERRUPTED / REPRIORITISED** | `feat/dev-001-verification-controls` |
| **DEV-002** | First complete accepted Story-mode turn in real host/SQLite | Gate 0; verification controls integrated in children after explicit user reprioritisation | IDEA-0002, IDEA-0006, IDEA-0039, IDEA-0040, IDEA-0044, IDEA-0051 | **VERIFIED & MERGED — bounded Story-only zero-effects scope** | A merged [PR #4](https://github.com/Levelleor/lorebound/pull/4); B merged [PR #6](https://github.com/Levelleor/lorebound/pull/6); C merged [PR #8](https://github.com/Levelleor/lorebound/pull/8) |
| **DEV-003** | Retry, drafts, Undo/Fork and current-history prose editing | DEV-002 | IDEA-0003, IDEA-0004, IDEA-0041, IDEA-0042, IDEA-0011 | **IN PROGRESS**; bounded DEV-003A launched, remaining children unstarted | None |
| **DEV-004** | Direct browser cloud/local models, profiles, streaming, pipelines and interpretation | DEV-002 + bounded service security review | IDEA-0010, IDEA-0012–IDEA-0019, IDEA-0045, IDEA-0046 | QUEUED | None |
| **DEV-005** | Lorebook, author notes, context budget and derived memory | DEV-002; DEV-004 interfaces | IDEA-0020–IDEA-0025 | QUEUED | None |
| **DEV-006** | Universal characters, Playing As, status, anatomy, items and equipment | DEV-002; supported typed entity events | IDEA-0007, IDEA-0026, IDEA-0027, IDEA-0029–IDEA-0031, IDEA-0034, IDEA-0064 | QUEUED | None |
| **DEV-007** | Locations, containment/routes, discovery, simple grounded map | DEV-006; relevant accepted event/geometry rules | IDEA-0033, IDEA-0035–IDEA-0038 | QUEUED | None |
| **DEV-008** | Adventure library operations, templates, starting world and backup/restore | DEV-002; DEV-003 and storage safety | IDEA-0005, IDEA-0008, IDEA-0052, IDEA-0066 | QUEUED | None |
| **DEV-009** | Structured actions, optional capabilities, full Command Citadel UI, accessibility | Integrates prior player-facing slices | IDEA-0001, IDEA-0037, IDEA-0047, IDEA-0050, IDEA-0055, IDEA-0061, IDEA-0062 and cross-cutting UI | QUEUED | None |
| **DEV-010** | End-to-end product verification, platform/release audit and outstanding feature closure | All relevant slices | **All 52 original IDEAs and all active atomic requirements** | QUEUED | None |

**This is a working order, not a mandate to implement entire tasks in one giant PR.** Split large DEV-003–DEV-010 work into bounded subtasks or slices (e.g. `DEV-004A`) as implementation starts, link parent ID, preserve evidence and explicitly record changes. Cross-cutting ideas may appear under more than one task; use [FEATURES](./FEATURES.md) to ensure every required behaviour is verified exactly once with cross-feature regression coverage.

**Missing one-to-one task rows is not missing features:** some IDEA scopes are cross-cutting (S01 host lifecycle, S04 presentation, S06 coordinator, S12 storage), and are validated across slices. DEV-010 must check every IDEA against its atomic requirements rather than trusting this table.

## DEV-001 — Implement CI and first-slice requirement traceability

**Status:** INTERRUPTED / REPRIORITISED by the user; not complete. **Execution:** Initial CI work retained only as supporting verification for DEV-002A. **Owner:** Codex lead, with bounded CI implementation and requirement research delegates. **Branch:** `feat/dev-001-verification-controls`, based on main `79263d647698b86c821badd0194e8299aea23105`. **PR:** Not yet opened. **Independent reviewer:** To be assigned after implementation. No merge authority granted.

**2026-11-03 redirection:** User selected “Change this launch to production replacement”. The former DEV-001-before-product sequencing is replaced for this launch by DEV-002A with its own mandatory build/storage/browser/CI/review gates. Remaining DEV-001 inventory certification is outstanding; the seven-IDEA draft is [preserved](./requirements/DEV-002.md), not independently certified.

**Historical rationale (2026-11-03, before DEV-002A):** Main then contained merged Gate 0 host/SQLite and one Go test package/browser verification script, but no `.github/workflows/` files. The next Story-mode implementation should be automatically checked rather than relying on one subagent's local results. Full 52-idea inventory already exists, so **do not delay first product coding to exhaustively rewrite the remaining 50 idea documents into atomic requirements all at once**.

**Expected deliverables:**

1. **Minimal reliable GitHub Actions workflow(s)** for the supported headless Go server build/tests (`-tags server`), frontend install/typecheck/static build and a real browser-host smoke check when the runner/browser dependencies permit. Use pinned compatible runtimes and a disposable test database. Never report a skipped/blocked browser check as PASS. Keep CI reasonably fast for deadline pressure.
2. **Traceability format working in the repository:** the current 52-row [FEATURES](./FEATURES.md) inventory must remain complete; create and validate `IDEA-NNNN/R##` atomic requirement records for the **specific IDEAs used by DEV-002**, linking relevant late ADRs, non-goals and future verification tests. Do **not** claim the other ideas' atomic breakdowns are finished. Put their status clearly as **NOT YET INVENTORIED** until their tasks.
3. **PR/agent handoff discipline:** submit a small PR documenting actual CI run URLs, test statuses, missing checks, requirement coverage and outstanding security/host issues. Update [NOW](./NOW.md), [FEATURES](./FEATURES.md), this task and [JOURNAL](./JOURNAL.md).
4. **No speculative rearchitecture:** preserve Wails v3 ordinary-browser host, Go-owned SQLite, current-only history decisions, user-approved [Command Citadel design](../design/README.md) and B9-D12 spatial migration deferral.

**Verification gate:** CI actually runs for the feature branch/PR and reports build/tests truthfully (PASS/FAIL/BLOCKED). Required Go/frontend checks pass; browser smoke evidence is run where practical, with exact blockers otherwise; every first Story-mode requirement has a source trace and planned test case, explicitly `NOT RUN` until executed. Independent reviewer confirms the coverage and CI design.

**Non-goals:** Shipping the full Story-mode loop in this task, introducing AI provider credentials, world simulation, all 52 atomic inventories, or declaring all host/storage requirements complete.

**If CI cannot run on available runners:** document the environmental reason, a reproducible fallback and the minimum remediation; mark task `BLOCKED` if the mandatory verification gate cannot be satisfied. Do not use an unaudited mock to claim real runtime success.

**Next after verified merge:** DEV-002, the first actual Story-mode vertical slice.

## DEV-002 — First accepted Story-mode turn

**Status:** **VERIFIED & MERGED within the bounded Story-only simulated zero-effects scope** after A/B/C child merges. The following decomposition preserves the explicit 2026-11-03 user redirection. **Owner:** Codex lead. **Depends on:** merged Gate 0 foundation and actual verification gates within each child; uncompleted DEV-001 inventory remains visible.

Build in the actual SvelteKit browser and Go SQLite app:

- Minimal adventure identity; Story action input; deterministic **mocked generation** producing a visibly **provisional** candidate; explicit accept/discard/Retry where supported, without silent acceptance.
- Stable passage/turn IDs, ordered accepted prose, technical version/epoch/idempotency and a **minimal typed current event envelope**; **empty world effects allowed**.
- Pure TypeScript current-history replay; technical canonical write/rollback is Go-owned. Verify real browser→Go→SQLite→reopen, stale version rejection, retry and failure states, no partial commits.
- Apply the approved [Command Citadel visual contract](../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) to the implemented story reader/composer, including responsive and pending/confirmed states. Do not pretend the rest of the 52 features are present.

**Scope restriction:** B9-D12 spatial migration remains deferred; no live-model scenario test required, no browser canonical database, no new map keyboard controls, no extra map-local Commit bar.

**Evidence:** unit + contract + real SQLite host + actual browser E2E + appropriate visual screenshots, independent review and CI link. Only then can any atomic requirements be marked VERIFIED; the broader IDEA titles remain PARTIAL until their entire accepted scope works.

### DEV-002A — Production blank adventure creation and resume

Status: VERIFIED & MERGED. Owner: Codex lead. Authorisation: user explicitly selected production replacement, 2026-11-03; user reported PR #4 merged on 2026-11-04, independently confirmed against GitHub and fetched main.

- Replace runtime Gate 0 test UI, service, record schema, binary/script naming with the actual adventure library path; preserve Wails/browser TS/Go/SQLite boundaries.
- Create an independent stable-ID adventure and minimal valid empty Turn-0 baseline atomically. Missing title uses `Untitled Adventure`; no AI, protagonist, fake passage or setup questionnaire required.
- List and resume zero-turn adventures from the same library, including after browser and process restart; unrelated adventures remain isolated.
- Narrow versioned service requests, library-epoch validation, idempotent creation and truthful recoverable errors. Failed writes leave no partial adventure/receipt; unchanged retry resolves uncertain success.
- Use approved visual tokens/type roles and responsive accessible reading/entry surfaces; no fake working composer or generated content.
- Requirements: [verified IDEA-0006/R01–R03; parent inventory draft](./requirements/DEV-002.md#idea-0006--quick-start-and-custom-openings); B5-D01/B5-D09; applicable IDEA-0051 storage, IDEA-0053 host boundaries; visual contract. Other draft requirement rows are not certified by this child.
- Checks: actual Go SQLite success/rollback/idempotency/wrong epoch/invalid input/isolation/reopen, real Firefox Wails create/resume/restart, UI error/retry, 390/768/1024/1440px screenshots and keyboard use, CI and fresh independent review.
- No existing Gate 0 data migration. Generated prose/turn acceptance, rename/delete, shared drafts, Quick Start, full host lifecycle and platform packaging excluded. B9-D12 remains deferred.
- Branch: `feat/dev-002a-adventure-foundation`. PR: [#4](https://github.com/Levelleor/lorebound/pull/4). Independent reviewer: `/root/independent_review`, [source/local/browser PASS](./evidence/DEV-002A-review.md). [Final-head GitHub CI PASS](https://github.com/Levelleor/lorebound/actions/runs/41838612434); initial validation failure retained in the journal. [Local passing evidence](./evidence/DEV-002A.md). Final head `473a957797ce8ad339435c04aad39592e61525d1` and merged main `fac5521bfbe7cd63ea3c7b85108b7d1865b678b9` have identical trees. [Post-merge reconciliation](./evidence/DEV-002A-reconciliation.md) on `docs/dev-002a-merge-reconciliation` changes documentation only. No remaining PR #4 merge-approval blocker; no next child starts in this launch.

### DEV-002B — First provisional and accepted Story turn (MERGED)

Status: **VERIFIED & MERGED**. User launched DEV-002B on 2026-11-04 and authorised merging on 2026-11-05. Owner: Codex lead; independent requirement audit, source/browser review PASS. Branch `feat/dev-002b-story-turn`, final head `ec7537c982e4dc91fe2f50faa11e87c983825176`, [PR #6](https://github.com/Levelleor/lorebound/pull/6), merged main `f0c57b8b808308534cda1c3cb862262c813f5d11`. Final head and main trees identical. [Reconciliation](./evidence/DEV-002B-reconciliation.md). The 95-row parent inventory remains draft beyond scoped evidence; no whole IDEA is complete.

Acceptance gates:
- Story input without actor; visibly simulated deterministic generation; authored input and generated response both provisional until explicit acceptance. Stop/Discard and late completions cannot mutate canon; no automatic accept on Send.
- One atomic append creates an ordered turn with two distinct stable structured passage IDs (authored/generated), paragraph/text/hard-break semantics and typed empty event batch. No invented entities or unsupported effects; browser replay from Turn 0 is deterministic and unknown core effects block writes while preserving readable prose.
- Go validates technical envelopes, IDs, source/order, expected version, epoch and immutable operation receipt. Rollback leaves no partial turn or receipt; identical retry returns original result even after later commits/reopen, followed by fresh coherent read.
- Conflicting tabs reject stale writes, refetch authoritative state and retain available authored text for a fresh decision. Read errors and uncertain writes cannot unlock a duplicate submission or pretend data was saved.
- Additive nonspatial storage upgrade preserves DEV-002A blank adventures, baseline, epoch and receipts. Wire version fences old browser clients. B9-D12 stays deferred.
- Actual Firefox/Wails/Go/SQLite create→generate→discard/stop→accept→resume→process-restart; lost-response and conflict recovery; unit/storage failures and coherent reads; responsive 390/768/1024/1440 Dark/Bright screenshots and keyboard controls; CI and independent source review.

**Executed evidence:** [DEV-002B](./evidence/DEV-002B.md), [independent review](./evidence/DEV-002B-review.md): local build/typecheck, 16 TS cases, 14 Go functions/43 subcases, vet, real Firefox/Wails/SQLite and exact process restart PASS. Lead and reviewer each ran the browser suite with separate temporary libraries. [Implementation CI PASS](https://github.com/Levelleor/lorebound/actions/runs/41957177037) at `daaff20384d90129e8886293829fa77953a31409`; [final-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42038112388) at `ec7537c982e4dc91fe2f50faa11e87c983825176`. User authorised merging PR #6 on 2026-11-05; it merged with identical reviewed tree.

Exclusions: other input modes, candidate Retry/Undo/Fork, drafts autosave, live providers, world reducers/extraction, map, Quick Start, full history/library/platform lifecycle. No complete IDEA certification. DEV-002C remains a separately launched parent integration task.

### DEV-002C — Story-loop integration and parent verification

Status: **VERIFIED & MERGED** as `9c4a615b32faee3a513467e3ecc8cf6f5d5b760a` on 2026-11-05, following explicit user merge/finalisation authorisation. [PR #8](https://github.com/Levelleor/lorebound/pull/8). User explicitly authorised “Launch DEV-002C” on 2026-11-05. Owner: Codex lead; branch `feat/dev-002c-story-integration`; baseline `899678ad80adc2489ccd84502688a2e8357d6474`; DEV-002B merged dependency satisfied.

Bounded scope: close the existing Story-only, simulated, zero-world-effects parent loop's integration and requirement-evidence gaps. Cover leaving generation/candidates, idle cross-tab refresh while typing, pending-state refresh isolation, durable commit followed by failed read, recovery after newer accepted history, and conflict/refetch failure recovery. Fix demonstrated source defects within this boundary. Reconcile every First requirement as tested slice, partial or explicitly later; do not certify nonempty event semantics from empty arrays.

Required evidence: existing build/typecheck, TS unit and real SQLite contracts; expanded Firefox/Wails/Go/SQLite checks and exact process restart; responsive/keyboard screenshots; independent accepted-source audit and implementation/browser review; final-head CI. Executed [evidence](./evidence/DEV-002C.md): build/check, 23 TS cases, 14 Go functions/43 subcases, vet, lead/reviewer Firefox/Wails/SQLite and exact restart PASS; [independent review](./evidence/DEV-002C-review.md) PASS after two diagnostic race fixes. [All 57 First-bearing rows](./evidence/DEV-002C-requirements.md) have bounded dispositions. [Implementation-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42088372352) at `30f153db153034e41ce1f62e85ec569a7db0be23`. [Final-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42088907520) at `ba9b3c346f5bd7330b5cb19763c31e95c201ebb5`; merged tree matches. Parent DEV-002 is VERIFIED & MERGED only within the accepted Story-only simulated zero-effects scope. Broader original IDEA obligations remain partial/later. Apply the user's personal-development-style override. No live provider, other modes, full history/drafts/world effects, host packaging or B9-D12 work; no later DEV task launches automatically.

### DEV-003 — Retry, drafts, Undo/Fork and current-history editing

Status: **IN PROGRESS through DEV-003A**. User authorised launch on 2026-11-05. DEV-002 dependency satisfied; [audit and child boundary](./requirements/DEV-003.md). Shared drafts, temporary editor undo, committed Undo, Fork and historical edits remain unstarted; completing Retry does not complete this parent.

### DEV-003A — Replace the provisional Story candidate on Retry

Status: **PR OPEN / REVIEW (UNMERGED)**. [PR #10](https://github.com/Levelleor/lorebound/pull/10), implementation commit `e422d8093cde4c1a4f8432a1caf0739885884c5d`; local checks and independent review PASS. Owner: Codex lead; independent reviewer assigned under the runbook. Branch `feat/dev-003a-provisional-retry`, base main `34f25a0fa841827b0b4486106e411c9d28bad2ab`. Authority: user “Proceed to next task.”

Scope: IDEA-0004/R01–R05, existing coordinator concurrency/commit guards and shared composer UI. Retry immediately invalidates the prior candidate; repeated replacements remain provisional; failure/Stop retain input and canon; only the latest validated result may accept. B3-D02 identical save recovery is distinct from Retry, B3-D05 stale rejection remains binding. Simulated generation, zero world effects, no persistence/schema changes.

Gates: build/typecheck, targeted TypeScript races, existing real SQLite regressions, Firefox/Wails/SQLite replacement/Stop/reload/accept/reopen and stale/uncertain-write checks; Dark/Bright at 390/768/1024/1440; independent source/runtime review. Publication is authorised and [PR #10](https://github.com/Levelleor/lorebound/pull/10) is open; [implementation-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42140685316) at `e422d8093cde4c1a4f8432a1caf0739885884c5d`; latest documentation-head checks are tracked in PR #10. Merge remains outstanding. No full IDEA/archive claim; B9-D12 remains deferred.

Executed [evidence](./evidence/DEV-003A.md): zero build/typecheck diagnostics; 30 TypeScript cases; 14 Go functions/43 SQLite subcases; vet; lead/reviewer real Firefox/Wails/Go/SQLite, failure/recovery and exact restart; eight responsive theme/width checks PASS. [Independent review](./evidence/DEV-003A-review.md) PASS. No scoped source blocker.

Publication authorised by the user on 2026-11-05: “proceed with next task”, following the explicit DEV-003A publication/CI handoff. Publication completed. Next action: inspect final-head CI, then obtain the user’s merge decision. Merge remains a later explicit action; later children remain unstarted.

## Deferred and cross-cutting gates

- **B9-D12**: spatial schema/event migration **DEFERRED**. This is **not** a covert DEV task and is not part of DEV-007 without a new explicit user decision.
- **Sensitive privileged service**: Gate 0 origin restrictions do not authenticate all hostile local processes. Before future sensitive Go operations, document/test the narrow local access boundary.
- **Library epoch rotation / idempotency**: Recheck duplicate operation replay across restore or epoch changes before implementing those operations.
- **UI visual acceptance**: use the [visual contract](../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md); actual browser evidence, not a design-only document.
- **Full release**: do not call Lorebound complete until all active accepted atomic requirements are VERIFIED or explicitly waived by user approval and real integrated workflows pass.

## Record template for newly split tasks

```markdown
### DEV-### — Short observable outcome
Status: READY | IN PROGRESS | PR OPEN / REVIEW | BLOCKED | VERIFIED & MERGED
Owner: ...
Dependencies: DEV-..., IDEA-.../R..., ADR...
Authorisation: explicit approval / prior permitted scope / pending
Branch/PR/commit: ...
Acceptance criteria: ...
Tests: unit / contract / real host / browser E2E / visual / failure
Evidence links and actual PASS/FAIL/NOT RUN/BLOCKED: ...
Discovered context / risks: ...
Independent review: ...
Next action: ...
```

The next executable action must always be copied into [NOW.md](./NOW.md), with no competing “top priority” in another file.
