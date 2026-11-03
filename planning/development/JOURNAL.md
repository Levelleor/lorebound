---
type: development-journal
status: current
created: "2026-11-03"
updated: "2026-11-03"
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
