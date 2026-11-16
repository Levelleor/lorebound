---
type: development-status
status: current
created: "2026-11-03"
updated: "2026-11-16"
current_task: "DEV-004G — Current adventure narration settings"
current_task_status: "VERIFIED ON CONFIRMED MERGE — PR #27"
next_task: "DEV-004"
tags:
  - planning/development
---

# Lorebound — Current Development Status

Read the [workflow](./README.md), [task queue](./TASKS.md), [feature coverage](./FEATURES.md), [incomplete-feature register](./INCOMPLETE-FEATURES.md), [journal](./JOURNAL.md) and [runbook](./AGENT-RUNBOOK.md).

## Current handoff

After the checked preview and final feedback, the user approved finalising/merging [PR #27](https://github.com/Levelleor/lorebound/pull/27) on 2026-11-16: “perfect proceed to closure of this now”. [DEV-004G](./requirements/DEV-004G.md#conditional-single-pr-closure) owns scope, application CI, independent source/actual-capture review, limits and conditional closure. Its current adventure narration controls, future-only saved guidance and fixed composer/reference styling are complete within that bounded scope. The primary PR owns final checks and actual merge/head/tree provenance.

**Closure becomes effective only after independent closure review, applicable final-head checks and confirmed merge of PR #27.** Then DEV-004G is VERIFIED within scope and IDEA-0010 becomes PARTIAL: seventeen partial / 35 without merged feature-level evidence / zero complete originals. All originals remain in production; inventory stays 161 rows and three formal IDEA-0006 certifications. Parent DEV-004 remains unfinished. INC-001/004/005/006 stay OPEN, IDEA-0068 staged, IDEA-0069 unaccepted and **B9-D12 DEFERRED — NO WORK**.

Agent-started review app/provider are stopped, ports 8086/18085 confirmed closed, and persistent `.local/review/dev004g` plus all other review/user data preserved. Relaunch the app with `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004g"`; Ctrl+C stops it. Its saved live profile requires the separately started provider; the [workflow](./README.md#local-llamacpp-testing) owns its authorised recipe. The requirement record retains demo and evidence limits.

**Exactly one next task: DEV-004 — audit/select a further bounded child only after confirmed DEV-004G closure and a separate user launch.** No next slice, routine post-merge repository write or reconciliation PR follows automatically.
