---
type: development-guide
status: current
created: "2026-11-03"
updated: "2026-11-03"
tags:
  - planning/development
  - implementation
  - verification
---

# Lorebound Development Control Centre

**This directory is the live operational record for building Lorebound.** The [System Architecture Overview](../architecture/Lorebound%20-%20System%20Architecture%20Overview.md) explains **what** the finished application must be; these files explain **what is currently being built, what is verified, what remains, what was learned and what happens next**.

## Start every development session here

| File | Purpose | Authority |
| --- | --- | --- |
| **[NOW.md](./NOW.md)** | **Single current status and exactly one next executable task**; what is active, blocked and awaiting review | **Source of truth for current focus and handoff** |
| **[FEATURES.md](./FEATURES.md)** | **All 52 accepted original IDEA notes**; owners, delivery milestone, progress and verified evidence, including any new scoped feature | **Source of truth for feature completion** |
| **[TASKS.md](./TASKS.md)** | Dependency-ordered task queue with clear deliverables, ownership and acceptance gates | **Source of truth for task lifecycle** |
| **[JOURNAL.md](./JOURNAL.md)** | Chronological discoveries, risks, constraints, decisions and links to PR/test evidence | **Append-only narrative context** |
| **[AGENT-RUNBOOK.md](./AGENT-RUNBOOK.md)** | Workflow, review checklist, status meanings, PR and handoff response format | **Required process for development agents** |

Read these alongside repository [AGENTS.md](../../AGENTS.md), [planning rules](../AGENTS.md), [approved design](../design/README.md), actual source/tests and the relevant [production IDEA notes](../production/) and [accepted architecture decisions](../architecture/decisions/). If a summary differs from a later explicit user-approved ADR, the **approved specific decision wins**. Do not quietly reinterpret it.

## Minimal development loop

1. **Choose one task:** Start with the single **Next Task** in [NOW.md](./NOW.md). Read the linked TASK entry, IDEA notes, ADRs and relevant code. Confirm dependencies and that execution is actually authorised. If a necessary permission is absent, request it rather than treating a planning record as permission to code.
2. **Establish evidence target:** Break the task into observable normal, failure and edge-case behaviours. Name stable requirement IDs such as `IDEA-0039/R01` once actually inventoried. Define unit, contract, real integration, browser, visual and regression checks as applicable. **NOT RUN is not PASS.**
3. **Implement a vertical slice:** Small branch, cohesive real runtime behaviour, supported browser TypeScript ↔ Wails/Go ↔ SQLite boundaries, no speculative features. Include deterministic mocks for model-dependent workflows; run real host checks when claiming real integration.
4. **Keep the control files current in the same PR:** Update the task, feature/requirement evidence, current status and chronological journal as findings arrive. **New functionality or scope changes must be recorded as they appear**, not only at the very end. The reviewer can see why changes were made.
5. **Verify independently:** Implementer records exact commands, environment, outputs, artifact links and remaining limits. Reviewer works from **accepted requirements**, checks omissions and reruns applicable tests (or marks them **NOT RUN/BLOCKED**). Required CI and real-browser proof must not be replaced by build-only or mock-only results.
6. **Merge only after the gate:** Tests and review meet [AGENT-RUNBOOK](./AGENT-RUNBOOK.md) Definition of Done. After merge, update [NOW.md](./NOW.md) to the next **single** task, the [TASKS](./TASKS.md) record and [FEATURES](./FEATURES.md) evidence. A feature only becomes VERIFIED when **all its in-scope accepted requirements** are independently satisfied.

**Operational convention:** the control files are kept **in the same PR as the work that changes their truth**, avoiding a second, drifting dashboard. For simultaneous tasks, keep a single Next Task and list any already-authorised parallel work under Active Work; coordinate edits/rebase to avoid overwriting status. An unmerged PR does not count as completed/verified in the main-branch snapshot.

## Traceability chain

```text
Approved IDEA note + later accepted ADRs
                 |
      atomic requirement IDs
                 |
        DEV task / slice ID
                 |
       source code + test cases
                 |
  real CI/browser/integration evidence
                 |
      independent reviewer sign-off
                 |
          merged PR / commit
                 |
    VERIFIED requirement / feature
```

- **Architecture reference**: [Lorebound — System Architecture Overview](../architecture/Lorebound%20-%20System%20Architecture%20Overview.md).
- **Original approved scope**: 52 items in [production](../production/); [promotion audit](../architecture/Pass%20C%20-%20All%20Accepted%20Ideas%20Production%20Promotion%20Register.md). Production status means **approved for implementation**, not finished.
- **Design reference**: [Command Citadel visual contract](../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md). UI work needs real responsive/browser evidence.
- **First actual integrated foundation**: merged [Gate 0 PR #3](https://github.com/Levelleor/lorebound/pull/3), [recorded evidence](../architecture/Gate%200%20Execution%20Evidence.md) for the narrow Wails/browser/Go and SQLite service; it is not proof that the broader host/storage ideas are complete.

## Requirements and scope changes during implementation

For each approved IDEA, inventory **all normative accepted behaviours**, exclusions, edge cases, applicable superseding ADRs, dependencies and testable acceptance criteria. `IDEA-NNNN/R##` identifies an atomic requirement **within the same original idea**, not a new IDEA or architecture decision. Record that breakdown and evidence in [FEATURES.md](./FEATURES.md) or a linked per-feature detail file **only when it is actually complete**. Initially the list is **idea-level coverage only**; requirements have not yet been exhaustively inventoried.

When an agent discovers a new requirement, implementation detail, incompatibility, risk or suggested feature:

- Record the observation and source in [JOURNAL.md](./JOURNAL.md), and relevant impact/blocker in [TASKS.md](./TASKS.md) and [NOW.md](./NOW.md).
- A **clarification within already-approved behaviour** can refine requirement/test details with traceability. An **unapproved capability or changed contract** remains `PROPOSED` and is **not implemented silently**; seek explicit user approval via the existing IDEA/ADR process.
- Do **not** erase the original proposal or deferral history. Annotate subsequent decisions and links. Preserve **B9-D12 spatial migration deferred/no work**.
- Update the central overview only for material accepted system/design or verified status changes, not every small implementation note.

## Reliable status semantics

| Status | Meaning |
| --- | --- |
| `NOT STARTED` | Approved/planned but no corresponding implementation evidence |
| `IN PROGRESS` | Assigned and being implemented on a named branch/PR |
| `IMPLEMENTED / UNVERIFIED` | Code exists, but some required test or independent-review gate has not passed |
| `PARTIAL` | Some bounded functionality has real evidence, but **the complete IDEA or slice is not certified** |
| `BLOCKED` | Specific dependency or failing required check prevents progress |
| `VERIFIED` | All in-scope atomic requirements pass applicable evidence and independent review, merged into main |
| `DEFERRED` | Explicitly put off with recorded user authority; not quietly counted as complete |

All test/evidence cells use `PASS`, `FAIL`, `NOT RUN`, `BLOCKED` or `N/A (reason)`. A test plan or verbal assertion is **not** a PASS.

## Delivery principle

**A feature is not finished because an agent says it is, a PR exists, or a mock passes.** Completed means it is in `main`, its accepted details are accounted for, relevant real runtime/browser/SQLite behaviour and failure paths are verified, visual requirements are checked for UI, and independent evidence is linked. Do not archive a production IDEA as an implemented spec until the repository's verified implementation/archive gate is met.

**Do not create a second canonical implementation store; do not silently accept model output; do not bypass the shared pending composer; do not add map keyboard gestures or visible scale bar; and do not start B9-D12 spatial migrations.**

## Maintenance and update cadence

- **Start of a task:** update NOW and TASKS to record task ID, scope, branch, owner and `IN PROGRESS`.
- **Every meaningful discovery or decision:** append to JOURNAL immediately, link ADRs/issues and note requirement/priority changes. No fabricated timestamps or evidence.
- **Every PR opened/updated:** update requirement statuses and test evidence on the branch, with exact commits/URLs.
- **After reviewer sign-off and merge:** mark merged requirements VERIFIED, adjust feature-level completion honestly, close the task, and advance NOW to exactly one next task.
- **Every new accepted IDEA or design change:** add a new feature row (or supersession note) and assign a milestone/task before implementation. No scope should exist solely in chat.
- **Before any release:** audit **all accepted active atomic requirements** for `VERIFIED` or an explicit approved exception, and run cross-feature real integration/browser/platform checks.

*Created 2026-11-03 as development process documentation. No source implementation, new CI workflow or runtime test is performed by this document.*
