---
type: development-journal
status: current
created: "2026-11-03"
updated: "2026-11-04"
tags:
  - planning/development
  - chronological-context
---

# Lorebound — Development Journal and Context Log

**Append-only implementation context.** Record what was actually discovered, decided, implemented, verified or blocked, with a source, owner and date. This is **not a substitute for an accepted architectural ADR**, a verified test report or the authoritative [current task](./NOW.md). Never silently rewrite old entries to fit a new result; append a later correction linked to the earlier observation.

## Entry format

```markdown
### YYYY-MM-DD — DEV-### / <short event title>
- Actor / role: agent, reviewer or user decision
- Repository branch / PR / commit: ...
- Related IDEA IDs and atomic requirement IDs: ...
- Context before change: ...
- What changed / what was learned: ...
- Evidence: exact command, CI URL, test log, screenshot, ADR or PR
- Decision: accepted / proposed / escalated / no decision
- Impact: affected code, feature statuses, tests, dependencies and release risk
- Risk/constraint status: BLOCKER | NONBLOCKING | DEFERRED | RESOLVED
- Next action and owner: ...
```

**Practical instruction:** During long tasks, append short entries when significant uncertainty is resolved, not merely at the end. Include failures, abandoned attempts and workarounds if they explain the current code. Avoid dumping raw unsanitised credentials, user-library content or misleading copy-pasted test output. Secret values must not be logged.

## Baseline entries

### 2026-11-03 — DEV-000 / Establish development control centre

- **Actor / role:** Planning/documentation setup after user requested a live development flow, complete feature accounting, on-the-go context and explicit next task.
- **Scope:** New [development index](./README.md), [current status](./NOW.md), [52-idea ledger](./FEATURES.md), [task queue](./TASKS.md) and [agent runbook](./AGENT-RUNBOOK.md).
- **Observed main snapshot:** 52 original approved `planning/production/` IDEA notes, zero `planning/staging/` IDEA notes; no features archived as verified implemented specifications. `.github/workflows/` was absent from the inspected main tree; Go technical tests and browser verification scripts exist from Gate 0.
- **What changed:** Introduced a single owner for **current next task**, a feature ledger covering all 52 accepted ideas, explicit future evidence requirements and chronological development context. This is **documentation-only**, not an implementation or CI execution.
- **Important distinction:** Idea-level rows are complete at 52/52. Atomic accepted requirements within every idea are **not yet exhaustively inventoried**. Do not report requirement-level completeness until real trace records exist.
- **Next action:** `DEV-001` to establish minimal CI and trace requirements relevant to the first Story-mode slice. Atomic requirements for other IDEAs are inventoried incrementally before their tasks; maintain visible unknown coverage rather than delaying all implementation.
- **Evidence:** [Production audit](../architecture/Pass%20C%20-%20All%20Accepted%20Ideas%20Production%20Promotion%20Register.md), [system overview](../architecture/Lorebound%20-%20System%20Architecture%20Overview.md), repository files as inspected 2026-11-03.

### 2026-11-03 — Gate 0 earlier implementation evidence incorporated

- **Actor / role:** Prior approved implementation agent; factual summary recorded in repo.
- **Merged work:** [PR #3](https://github.com/Levelleor/lorebound/pull/3), implementation commit `610b7b77b0f4ff04eb63543f4c1aee6dea2acf30`, Wails v3 server + SvelteKit Firefox browser + Go-owned isolated SQLite transaction service.
- **Observed/reported actual technical checks:** Gate 0 evidence document records server startup, browser-to-Go service response, isolated write/readback, stale version and wrong epoch rejection, idempotency, rollback and database reopen. These were executed by the prior development agent; **this development documentation setup did not rerun them**.
- **Feature impact:** IDEA-0051 (durable storage) and IDEA-0053 (host lifecycle) each have **PARTIAL** evidenced technical foundation, **not** complete implementation of all approved requirements.
- **Known issue, NONBLOCKING for the narrow Gate 0 record:** Browser Origin/Host restrictions do not prove protection from arbitrary malicious local processes. Before adding sensitive privileged services, define and test an appropriate local access boundary.
- **Known issue, LATER DEPENDENCY:** Review idempotent replay vs library epoch check ordering when restore or epoch rotations are introduced. Current single-epoch Gate 0 evidence does not cover that scenario.
- **Evidence:** [Gate 0 Execution Evidence](../architecture/Gate%200%20Execution%20Evidence.md), [PR #3](https://github.com/Levelleor/lorebound/pull/3).
- **Next action:** Preserve the production-intended host rather than replace it. DEV-001 then DEV-002.

### 2026-11-03 — Accepted architecture and scope boundaries relevant to all agents

- **User-approved state:** [Current System Architecture Overview](../architecture/Lorebound%20-%20System%20Architecture%20Overview.md) summarises the 52 production ideas and B1–B9/Pass C accepted decisions. [Visual design contract](../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) is the user-approved appearance target.
- **Core boundaries:** Browser TS coordinator and replay own narrative/world decisions; Go technically validates/commits one SQLite canon atomically; browser accesses providers directly. Model proposals and drafts are not accepted facts. Keep current-only history, stable IDs and one shared primary composer Commit/Discard.
- **Deferred exception:** **B9-D12 spatial event/schema migration remains expressly DEFERRED**. No hidden migration is permitted merely because all original feature IDEAs have been promoted.
- **Current implementation ambition:** Short, verified vertical slices toward the final app. Avoid another speculative architecture pass or simultaneous all-feature coding. Each approved idea remains visible until its atomic requirements are independently verified.
- **Decision:** Context-only; no new architecture authority or change to prior approvals.

## Update rules

- Append an entry for every significant scope discovery, failed verification, accepted change, work-around, security limitation or new feature candidate. Cite the **source of truth**. A PR/CI URL is better than an uncited claim.
- When a finding blocks the **next task**, also update [NOW](./NOW.md) and [TASKS](./TASKS.md) immediately. A journal entry alone does not move the operational queue.
- When a finding changes feature implementation/verification status, also update [FEATURES](./FEATURES.md) with the code/test/PR evidence, never with speculation.
- When a user **approves** a new product capability or a contract change, preserve the formal original IDEA/ADR process and link its accepted record. Do not treat an agent's reasonable suggestion as user approval.
- Do not backdate or rewrite historical entries. Add **Correction to [date/entry]** when previously documented facts need revision.

### 2026-11-03 — DEV-001 / Authorised start and clean main reconciliation

- **Actor / role:** Codex lead; requesting user's launch explicitly authorises exactly the current DEV task, bounded delegation, tests and PR creation.
- **Branch / base:** `feat/dev-001-verification-controls` from `79263d647698b86c821badd0194e8299aea23105`; `git fetch origin main` confirmed local main matches remote; GitHub open-PR search returned no open PRs.
- **Scope:** Minimal CI for the existing Wails server/frontend/real SQLite/browser smoke and atomic requirements needed by DEV-002. No Story-mode implementation in this launch; no merge authority inferred.
- **Work ownership:** Lead owns task selection, integration, requirements publication and development control files. Separate agents research accepted requirements and implement CI/scripts; a fresh independent reviewer will check original requirements and rerun applicable checks.
- **Initial evidence:** Existing `TestRealSQLiteContract` covers technical commit/readback, invalid request, operation replay/reuse, stale version, wrong epoch, rollback and reopen. Existing Firefox smoke covers browser bridge/save/reload. These were inspected, not rerun yet. Node/npm are absent from the initial shell PATH; installed runtime discovery is in progress.
- **Risk/constraint:** NONBLOCKING while runtime setup is investigated. B9-D12 remains DEFERRED, no work. All 52 original IDEA rows and zero full-feature verifications remain unchanged.
- **Next action:** Implement and execute DEV-001 checks, publish traceability with future Story-mode checks explicitly NOT RUN, then independent review and PR.

### 2026-11-03 — DEV-001 / Scope refinements from accepted sources

- **Actor / role:** Lead integrating bounded requirement research and independent source review; no new product decision.
- **Accepted source precedence:** B3-D04 supersedes IDEA-0040's historical revision-archive wording: keep stable passage IDs and one current structured body, technical schema/adventure versions and transaction receipts, not old passage revisions. B4-D03 requires coherent adventure/version/epoch reads. B3-D02 requires unchanged operation identity when resolving a lost success response.
- **Opening distinction:** C-D04's ordinary Story-mode candidate acceptance is separate from Quick Start's validated automatic first-turn commit under IDEA-0006/B5-D03. The first slice uses minimal blank/custom entry; full Quick Start remains later work.
- **Interpretation/security limits:** B7-D03 C discards unresolved automatic extraction suggestions without storing/showing diagnostics for those suggestions; technical failures still surface. IDEA-0053's accepted local boundary excludes a new login/session-token framework; the existing hostile-local-process limitation is not authority to invent one.
- **Verification setup:** Node 24.14.0, npm 11.9.0 and Firefox are already installed locally. Initial sandbox dependency install did not complete and was interrupted; an authorised network-enabled retry is underway. No passing build or CI result is inferred from that interruption.
- **Risk/constraint:** B9-D12 remains DEFERRED. Broad IDEA obligations and first-slice acceptance must remain separately traceable; no source IDEA is archived or marked fully verified.

### 2026-11-03 — DEV-001 / Gate 0 replacement clarification and interrupted review

- **User direction:** “we'd want to get rid of gate0 stuff … replace it with actual production code now”. Gate 0's test screen, test-record service/schema and task-specific naming are temporary prerequisite scaffolding. Retain proven host/persistence boundaries while replacing the scaffold with actual application behavior; do not treat the test record as the product.
- **Task-boundary clarification pending:** The launch originally selects exactly DEV-001 (CI/traceability) and queues production Story-mode work under DEV-002. The lead asked whether to finish DEV-001 then replace Gate 0 in DEV-002, or change this launch to the first bounded production replacement. Do not begin that dependent implementation or advance NOW before the answer.
- **Agent interruption:** All three delegates stopped with a reported account usage limit before final verification/sign-off. CI changes and a requirement research draft exist, but independent review is incomplete. This is an evidence blocker, not a code failure or approval-review rejection.
- **Observed local logs:** `/tmp/dev001-go-test.log` reports PASS for the real SQLite contract, including readback, operation replay/reuse, stale version, wrong epoch, rollback and reopen. `/tmp/dev001-host-smoke.log` reports loopback bind EPERM under the sandbox; real browser smoke has not passed. Build log contains successful Svelte check/static output; exact final command exit evidence still needs reconciliation.
- **Next action:** Resolve the selected-task boundary with the user; preserve unmerged work and obtain completed independent review before any completion/merge claim.

### 2026-11-03 — DEV-002A / Explicit production replacement selected

- **User decision:** Answered the task-boundary question with “Change this launch to production replacement”. This supersedes the earlier finish-DEV-001-first plan; it is not authorisation to implement multiple tasks or merge.
- **Selected bounded child:** DEV-002A replaces the test-record UI/service with real blank adventure initialization/list/resume, durable atomic Turn-0 baseline and actual browser/storage verification. Parent DEV-002 is split sequentially; generated Story turns remain DEV-002B.
- **Preserved work:** CI/scripts are adapted to production paths as supporting verification. The research draft with 95 unverified rows is preserved in `requirements/DEV-002.md`; no completed inventory/review is claimed. DEV-001 remains interrupted rather than falsely complete.
- **Git:** Existing isolated branch remains in use; branch rename request did not complete and was cancelled. No application edits have yet been claimed verified.
- **Next action:** Lead implements this one production child. Independent review, CI and merge gates remain mandatory; account-limit interruption is recorded, not bypassed.

### 2026-11-03 — DEV-002A / Production implementation and independent findings

- **Branch:** Renamed successfully to `feat/dev-002a-adventure-foundation` after the user redirection.
- **Implementation:** Replaced GateService/test record with typed LibraryService and real adventure/baseline/creation-receipt storage. TypeScript prepares stable IDs and default titles; Go saves atomically in one shared `lorebound.db`. Replaced the test page with production create/list/resume surfaces using approved visual tokens. Current setup is `docs/development.md`, `scripts/build.sh` and `scripts/run.sh`; original Gate 0 evidence remains historical.
- **Local evidence:** Frontend check has zero errors/warnings; static build, TypeScript contract test and five Go storage tests (plus invalid-request cases) pass. Independent reviewer reran frontend checks, Go tests, vet and server build successfully.
- **Review findings:** Reviewer found refresh hid Retry after an uncertain creation and a late response could override newer Back navigation. Both were corrected; browser regressions cover refresh-then-retry and delayed-read navigation. No silent production scope expansion.
- **Browser verification:** First attempt exposed an ineffective response-loss test fixture (overriding the runtime function did not interrupt a response). Replaced it with interception that lets the real request commit then drops its HTTP response. Actual Firefox creation/reload, response-loss recovery, wrong-epoch rejection and process-restart identity persistence then passed. Final rerun includes the navigation fix.
- **Limits:** This is blank-adventure persistence, not full Story mode. Font roles use their approved local fallbacks; no external fonts/AI calls. Bright tokens are tested without claiming a completed appearance-settings UI. Platform packaging, launcher lifecycle and B9-D12 remain outside this child.

### 2026-11-03 — DEV-002A / Final local browser pass and PR preparation

- **Observed:** Final `scripts/verify-host.sh` exited 0 after actual Firefox create/resume/reload, simulated lost success response to a real SQLite commit, refresh-then-identical-request recovery, delayed Read versus Back navigation, wrong-epoch rejection and fresh-browser readback after process restart. Host Origin/Host/preflight/WebSocket checks passed.
- **Artifacts:** Four actual screenshots retained under `evidence/DEV-002A/`; automation also emits all four viewport widths and Dark/Bright states. Reviewer inspected the rendered states and is running a separate browser suite.
- **Traceability audit:** All 52 ledger IDs still match the original production notes; the parent draft has 95 unique requirement IDs and valid source paths. This structural audit does not certify the whole seven-IDEA requirement inventory.
- **Next action:** Open DEV-002A PR, execute GitHub CI and obtain final independent sign-off. Keep next task DEV-002A until authorised merge/reconciliation; do not begin DEV-002B.

### 2026-11-03 — DEV-002A / Independent PASS, PR and CI validation correction

- **PR:** [#4](https://github.com/Levelleor/lorebound/pull/4), implementation commit `7abe54f050eedabc2a0891f88057274ff0d9b271`, unmerged.
- **Independent review:** Fresh reviewer reran real browser suite on port 18081 and all frontend/Go checks; no unresolved blocking source findings. Full report preserved in `evidence/DEV-002A-review.md`.
- **CI failure:** [Run 41772890446](https://github.com/Levelleor/lorebound/actions/runs/41772890446) failed workflow validation before jobs. The connector returned no PR-triggered runs because this validation failure was attached to push; direct read-only `gh api` exposed it. Actions are enabled.
- **Correction:** Removed `runner.temp` from job-level `env`, where the runner context is unavailable under [GitHub's context reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability). The Linux job uses a literal temporary artifact directory, referenced by step-level artifact configuration. No product code changed; corrected CI must actually execute before its gate can pass.
- **Next action:** Push the corrected workflow and inspect real CI results; no merge or DEV-002B launch.

### 2026-11-04 — DEV-002A / Passing GitHub CI and ready-for-review handoff

- **Verified CI:** [Run 41773118072](https://github.com/Levelleor/lorebound/actions/runs/41773118072) succeeded for `2496367d2603a83d8f57c2d267dbca2dbc37397e`. Lead inspected all steps and logs: build/check, two TS tests, Go vet/real SQLite tests, Firefox installation, actual host/browser/recovery/restart suite and artifact upload all PASS.
- **Artifact:** [Logs and 12 screenshots](https://github.com/Levelleor/lorebound/actions/runs/41773118072/artifacts/13295059611); four selected images retained in Git. No user database or credentials uploaded.
- **Independent review:** Original-requirement source/local/browser PASS and corrected-workflow delta PASS preserved in `evidence/DEV-002A-review.md`. Additional optional CI-only reviewer follow-up hit an account usage limit; lead independently inspected the actual remote results, without pretending that follow-up ran.
- **State:** PR #4 ready for review, still unmerged. No unresolved blocking source/test finding. All 52 IDEA rows retained, zero whole-IDEA verifications; R01–R03 and host/storage subsets remain implemented/unmerged. DEV-001 is interrupted and its broader 95-row parent inventory is draft; DEV-002B has not started.
- **Next action:** Explicit merge authorisation for PR #4, subject to latest passing PR checks. Only after authorised merge reconcile actual main; never automatically begin another task in this launch.


### 2026-11-04 — DEV-002A / Confirmed merge and tracker reconciliation

- **User context:** User reports PR #4 already merged. This launch finishes DEV-002A record maintenance; no DEV-002B implementation starts. No new merge is inferred or attempted.
- **Verified GitHub/Git facts:** PR #4 is merged at `fac5521bfbe7cd63ea3c7b85108b7d1865b678b9`; fetched `origin/main` agrees. Final head `473a957797ce8ad339435c04aad39592e61525d1` and main have identical tree `138470dd8b5d1cca08bef726d59050e4e89e8305`. No open PRs at launch start. Thus the prior outstanding PR #4 merge-approval blocker is resolved.
- **Final CI evidence:** [Run 41838612434](https://github.com/Levelleor/lorebound/actions/runs/41838612434), final-head PR test merge, PASS. Lead inspected job steps/logs: zero frontend diagnostics, two TS tests, five Go tests plus ten rejection/conflict cases, vet/build, actual browser/recovery/restart and artifact upload. This is inspected executed CI, not a new local runtime run or a claim about a separate main-push run.
- **Independent audit:** Fresh `/root/merge_audit` compared accepted IDEA-0006/B5-D01/B5-D09, implementation/tests, stored independent review and Git provenance; supports exactly R01–R03 as VERIFIED. Three feature ideas remain PARTIAL; zero fully VERIFIED. Broader 95-row parent inventory remains draft. [Reconciliation report](./evidence/DEV-002A-reconciliation.md) records documentation review separately.
- **Record corrections:** NOW/TASKS/FEATURES and scoped evidence now reflect merged blank adventure creation/list/resume, one workflow and scoped visual verification. Requirements and architecture current-status statements no longer describe the removed Gate 0 test record as current application behavior. Historical journal/review findings are preserved; no original IDEA is archived.
- **Branch:** `docs/dev-002a-merge-reconciliation` from merged main. Documentation corrections await their own PR; application progress already reflects merged main.
- **Next action:** DEV-002B on a separately authorised launch, beginning with the outstanding first-slice requirement audit and bounded acceptance definition. DEV-001 remains interrupted; no whole-IDEA certification, new architecture or B9-D12 spatial migration is implied.
