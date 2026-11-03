---
type: development-agent-runbook
status: current
created: "2026-11-03"
updated: "2026-11-03"
tags:
  - planning/development
  - agents
  - verification
---

# Lorebound — Implementation Agent & Independent Reviewer Runbook

**Purpose:** Any AI implementation/review agent can start from this document, determine **exactly what to do next**, record discoveries while working and produce an auditable pull request and handoff. This runbook is operational policy, **not** permission to implement arbitrary accepted production ideas without the user's relevant execution authorisation.

## 1. Preflight

Read in this order:

1. [NOW](./NOW.md): **single Next Task**, known blockers and last verified milestone.
2. [TASKS](./TASKS.md): assigned task ID, dependencies, deliverables and exact review evidence.
3. [FEATURES](./FEATURES.md): affected original IDEA IDs, requirement inventory status, full feature coverage.
4. [JOURNAL](./JOURNAL.md): recent discoveries, limitations and decisions.
5. [System architecture](../architecture/Lorebound%20-%20System%20Architecture%20Overview.md), [visual design](../design/README.md) when UI work, repository `AGENTS.md`, `planning/AGENTS.md`, and **actual affected production IDEA notes plus their later accepted ADRs**.
6. The code, tests, build scripts and recent merged PRs, not merely planning summaries.

Before coding, report what will be touched, what is already verified, what tests must run, and which **explicit user authorisation** covers the task. If authorisation is missing or a materially new feature is proposed, stop that scope and request the narrow approval. **All 52 ideas in production is not evidence that all 52 features are implemented.**

## 2. Implementation-agent workflow

1. **Lock scope:** Select the named DEV task (and any split subtask ID). Identify source paths/IDEA requirements/ADRs and confirm its dependency gate is actually satisfied on the target branch.
2. **Create a feature branch:** e.g. `feat/dev-002-story-mode-turn`. Never commit speculative code directly to main for a reviewed feature.
3. **Update control documents on the branch:** Set task to IN PROGRESS with owner/branch, add a dated start entry in [JOURNAL](./JOURNAL.md), and set affected features to IN PROGRESS where appropriate. [NOW](./NOW.md) still reflects **main-branch verified truth**; it may show an "active PR pending" section, not falsely mark completion.
4. **Decompose acceptance criteria:** For any affected IDEA lacking atomic requirement inventory, enumerate its accepted requirements, exclusions, negative cases and overriding ADRs, with stable IDs `IDEA-NNNN/R01...` and source citations. Do not expand into unrelated features simply because their notes are in production.
5. **Build one cohesive real behaviour:** TypeScript owns story/world domain decisions, Go owns technical SQLite/OS services, browser calls models directly; never bypass the approved storage/commit boundary. Keep errors and cancellation explicit. Preserve the user-approved appearance where UI is touched.
6. **Run actual checks:** unit, contract, real host, E2E, failure/recovery, visual, platform and security as relevant. Record command, OS/tool versions, observed outputs, CI link and what **was not** run. Use mocked AI fixtures for deterministic tests without claiming live model evidence. Never modify user libraries for tests.
7. **Record context as it emerges:** New risks, missing interface details, discovered contradictions, provider restrictions, version issues and scope changes go into JOURNAL immediately. Add specific blockers/next actions to TASKS/NOW. If a *new capability* is suggested, log as a proposed candidate in FEATURES, not secretly implement it.
8. **Open PR with traceability:** Include task ID, IDEA/R requirement IDs, accepted ADRs, changed paths, test matrix (real vs mocked vs not run), screenshots for relevant design, actual limitations and a reproduction recipe. Include control-file updates in the **same PR**. Do not merge your own unreviewed work when independent review is required.

Do not conflate implementation with verification. `IMPLEMENTED / UNVERIFIED` is a legitimate honest status while checks/review are outstanding.

## 3. Independent verification-agent workflow

The reviewing agent **must not simply accept the implementation agent's final report**. It should work from the accepted IDEA/ADR source and the code diff, without treating tests the implementer wrote as a complete specification.

1. Confirm the assigned task scope, dependencies, accepted feature requirements and deferred/out-of-scope exclusions.
2. Audit **all expected behaviours and negative cases**, including things omitted in the PR. List every uncovered requirement and affected feature.
3. Inspect code correctness, TypeScript/Go authority, race/version/epoch/idempotency/error paths, recovery behaviour, injection/origin/secret boundaries where relevant.
4. Rerun applicable tests on the PR commit if the environment permits; report exact runner and results. Browser UI must be interacted with in a real browser for a browser/E2E PASS; static build or HTML fetch is insufficient.
5. Check that the **Command Citadel** design is represented for implemented UI, including 390/768/1024/1440px where relevant, actual screenshots and responsive/accessible states. A reference design kit is not a pixel-proof test.
6. Compare code, CI results, coverage docs and PR claims. Record `PASS/FAIL/NOT RUN/BLOCKED/N/A + reason` per gate. Demand corrections for unmet accepted requirements, unverified claims or missing test evidence.
7. Sign off only the scope actually verified and record reviewer attribution. Unverified cross-platform work remains an explicit limitation, not a hidden PASS. If possible, attach review directly to PR.

**Critical rule:** A Go mock or fake HTTP service cannot establish real Wails/browser/Go integration. A successful Firefox/browser script cannot establish Windows/macOS packaging. Neither makes a complete feature automatically VERIFIED.

## 4. Mandatory Definition of Done

A DEV task is **VERIFIED & MERGED** only if all *applicable* gates are satisfied:

- Accepted IDEA and specific later ADR requirements mapped and every in-scope requirement accounted for.
- Code changes implemented and reviewed with stable testable interfaces and no unauthorised architecture contradiction.
- Required unit/contract/build checks pass in a reproducible workflow and CI.
- Real integration is run **where claimed** (e.g. real Wails, Go/SQLite, browser provider origin, host lifecycle).
- Real browser E2E and visual/responsive/accessible checks pass for player-facing UI, with screenshots or meaningful logs.
- Failure paths, retry/idempotency, concurrency/history and rollback are tested when relevant.
- No high-severity unresolved blockers remain within the completed scope; limitations and exclusions are explicit.
- Independent verification agent reviewed the PR against original requirements and recorded evidence.
- PR is merged to main. Requirement/task/feature tracker and NOW/JOURNAL are updated to the *merged* state.

An IDEA becomes **VERIFIED** only if all of its **current accepted atomic requirements**, not merely one slice, meet these gates. `N/A` is permitted only with a specific reason; `NOT RUN` or `BLOCKED` must never be converted into `PASS` for convenience.

## 5. Handoff format to return to the user

Use exactly these Markdown headings and machine-readable lines after every task, so the primary coordinator can update the tracker and select the next task without guessing.

```markdown
# LOREBOUND DEVELOPMENT HANDOFF

## 1. Task and outcome
TASK_ID: DEV-###
STATUS: PASS | PARTIAL | FAIL | BLOCKED
NEXT_TASK_CANDIDATE: DEV-###
Summary: <2–5 accurate sentences; distinguish actual operation from proposed/untested>

## 2. GitHub work
Repository:
Branch:
Commit SHA:
PR URL:
Merge state: OPEN | MERGED | NOT CREATED
Main source files changed:
Planning control files changed:

## 3. Feature and requirement coverage
- IDEA IDs touched:
- Accepted ADRs relied upon:
- Atomic requirements newly inventoried:
- Atomic requirements verified:
- Atomic requirements unverified/blocked:
- Out-of-scope exclusions (including B9-D12):

## 4. Verification evidence
| Gate | PASS/FAIL/NOT RUN/BLOCKED/N/A (reason) | Actual command/method | Result observed | CI/artifact URL |
| --- | --- | --- | --- | --- |
| Build/typecheck | | | | |
| Unit tests | | | | |
| Contract tests | | | | |
| Real Wails/Go/SQLite | | | | |
| Browser E2E | | | | |
| Failure/recovery | | | | |
| Visual/responsive | | | | |
| Security/platform (if relevant) | | | | |
| Independent review | | | | |

## 5. Discovered context / new features / risks
- <observations with source and severity>
- <any proposed extra scope is marked PROPOSED and not silently implemented>

## 6. Blockers and limitations
- BLOCKER | NONBLOCKING | DEFERRED: <specific issue, evidence, smallest correction>

## 7. Tracker reconciliation
- NOW.md updated: YES | NO (reason)
- TASKS.md updated: YES | NO (reason)
- FEATURES.md updated: YES | NO (reason)
- JOURNAL.md updated: YES | NO (reason)
- Does claimed progress reflect merged main? YES | NO, PR UNMERGED
- Working tree clean: YES | NO (details)

## 8. Exact next action
<one task/action only; say whether user execution approval is needed>

TASK_ID: DEV-###
STATUS: PASS|PARTIAL|FAIL|BLOCKED
PR_URL: <URL or NONE>
COMMIT_SHA: <full SHA or NONE>
NEXT_TASK: DEV-###
```

A `PASS` in this handoff means the **assigned task's accepted and evidenced scope**, not all 52 Lorebound features. Do not claim final completion merely because task-specific smoke tests pass. The four machine-readable closing lines must be the **final four lines**, without extra commentary.

## 6. Working with parallel agents and changed main

- Prefer **one implementation agent and one independent reviewer per bounded task**. When parallel work is justified, assign distinct task/branch IDs and distinct files or coordinate carefully. The [NOW](./NOW.md) primary Next Task remains singular.
- Do not overwrite changes to control files from another branch; fetch main, rebase/merge, and reconcile human-readable counts/status before merging.
- When a PR merges, update the tracker using its actual commit/CI evidence rather than an agent's stated completion. Distinguish merged verified work from open PRs.
- On conflict between historical design prose and later accepted ADR: document in JOURNAL and implement the **later accepted authority**, without erasing history.
- Do not create new official IDEA IDs for unapproved additions; propose candidate scope and seek approval.
- Never promote `planning/production/` notes to implemented `planning/specs/` without the verified gate mandated by repository planning rules.
- **B9-D12 spatial migrations remain deferred** even though other spatial/UI ideas are approved for production.

## 7. Smallest next action

The current Next Task is in [NOW.md](./NOW.md), initially **DEV-001**. A new agent should use this file and the TASK brief to begin with **execution authority confirmed**, rather than reopening the architecture or constructing a second dashboard.
