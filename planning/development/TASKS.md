---
type: development-task-queue
status: current
created: "2026-11-03"
updated: "2026-11-04"
current_next_task: "DEV-002B"
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
| **DEV-002** | First complete accepted Story-mode turn in real host/SQLite | Gate 0; verification controls integrated in children after explicit user reprioritisation | IDEA-0002, IDEA-0006, IDEA-0039, IDEA-0040, IDEA-0044, IDEA-0051 | SPLIT: DEV-002A → DEV-002B → DEV-002C | A merged [PR #4](https://github.com/Levelleor/lorebound/pull/4); B/C not started |
| **DEV-003** | Retry, drafts, Undo/Fork and current-history prose editing | DEV-002 | IDEA-0003, IDEA-0004, IDEA-0041, IDEA-0042, IDEA-0011 | QUEUED | None |
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

**Status:** SPLIT after explicit 2026-11-03 user redirection. **Owner:** Codex lead. **Depends on:** merged Gate 0 foundation and actual verification gates within each child; uncompleted DEV-001 inventory remains visible.

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

### DEV-002B — First provisional and accepted Story turn (NEXT)

Status: QUEUED / prerequisite audit outstanding; NOT STARTED. Depends on: verified/merged DEV-002A (**satisfied**, PR #4) and complete first-slice requirement audit (**outstanding**, 95-row draft not certified). Next action on a separately authorised launch: audit the accepted first-slice requirements, then define one bounded scope or sequential children before implementation. This reconciliation launch does not execute DEV-002B. Add the deterministic mocked-generation coordinator, structured current passages and minimal typed events, explicit acceptance/discard, consistent reads/replay, version conflicts and uncertain-write recovery. Apply the docked composer and provisional/committed visual contract. Define bounded acceptance/tests before execution; no live-provider or map scope.

### DEV-002C — Story-loop integration and parent verification

Status: QUEUED. Depends on: DEV-002B. Complete first-slice failure/cancellation/recovery and cross-tab/reopen integration against original requirements, independent visual/review evidence, and reconcile the parent. Split further if needed; never automatically start in DEV-002A's launch.

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
