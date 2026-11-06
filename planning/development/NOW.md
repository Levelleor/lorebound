---
type: development-status
status: current
created: "2026-11-03"
updated: "2026-11-06"
current_task: "DEV-003C — Story composer draft recovery"
current_task_status: "IMPLEMENTED / VERIFICATION IN PROGRESS"
next_task: "DEV-003"
---

# Lorebound — Current Development Status

Read the [workflow](./README.md), relevant [task](./TASKS.md), [feature coverage](./FEATURES.md), [journal decisions](./JOURNAL.md) and [runbook](./AGENT-RUNBOOK.md) before development. This page owns the short handoff; requirement details and execution output live in their respective records/CI.

## Verified main

[PR #12](https://github.com/Levelleor/lorebound/pull/12) merged on 2026-11-06 as `8cf1b925dd5b576e8b1c59254134b520264b56c4`; GitHub metadata and local main confirm it. Checked head `b55bcb8be1d57a5756daef6012b7c90e581758fc` has the identical tree. [Final-head CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42251832445). Its prior closure condition is satisfied.

- DEV-002/A/B/C, DEV-003A Retry and DEV-003B Fork are verified/merged within the **simulated Story-only, zero-world-effects scope**. Parent DEV-003 remains PARTIAL.
- **52 production / 0 staging / 0 complete original IDEAs; 9 partial ideas; 3 formally certified IDEA-0006 rows.** [FEATURES](./FEATURES.md) owns the detailed ledger.
- Blank adventure creation/resume, provisional generation/replacement, explicit atomic acceptance/recovery and independent per-turn prefix Fork persist through the real browser/Go/SQLite application. [Task records](./evidence/) describe scope/limits; CI holds execution output.
- Live providers, nonempty world effects, drafts, committed Undo, history editing and broader library/platform lifecycle remain later work. **B9-D12 spatial migration remains DEFERRED — NO WORK.**

## Active child — DEV-003C

The user's 2026-11-06 launch selected shared latest Story composer draft autosave/recovery after the [parent dependency audit](./requirements/DEV-003.md). [Scope and coverage](./requirements/DEV-003C.md) owns the bounded requirements and remaining obligations. Implementation exists locally; application/browser verification, independent review and primary-PR publication are in progress. User review and named-PR finalise/merge approval remain pending. No verified-main coverage is inferred.

## Prerequisite maintenance — same primary PR

The user requested CI-owned verification output, removal of generated planning clutter, consolidation of repeated writeups and task-neutral standing instructions. Local changes remove generated files, condense delivery records/control files, update agent guidance and add CI repository checks. Local repository/link/frontmatter, workflow routing/syntax and browser regression/restart checks pass, including both newly automated Fork navigation cases. These changes are not merged or remotely CI-verified. No gameplay child is launched by this maintenance.

CI owns repeatable checks and short-lived artifacts. Agents/reviewers reuse passing results for the reviewed revision; focused local checks support implementation/debugging. Do not recreate logs, screenshots or separate review/reconciliation reports in planning. See the [evidence policy](./README.md#ci-and-evidence-policy).

**Hands-on review:** `bash scripts/dev.sh` builds the current checkout and launches a separate persistent `.local/review` library. A prior maintenance preview may still be on port 8080; it must be rebuilt/restarted before presenting DEV-003C. The current task authorises commit/push/one primary PR; user acceptance and merge approval remain separate.

## Next development task: DEV-003 — select one remaining bounded child

After DEV-003C closes, **separate user execution authority is required** to audit/select another remaining child. Passage drafts, temporary editor undo, committed Undo and historical editing remain unselected. Closing this child does not authorise them.
