---
type: development-status
status: current
created: "2026-11-03"
updated: "2026-11-14"
current_task: "DEV-004C — Explicit local connection testing"
current_task_status: "READY — AWAITING USER REVIEW / PR #23 MERGE APPROVAL"
next_task: "DEV-004C"
tags:
  - planning/development
---

# Lorebound — Current Development Status

Read the [workflow](./README.md), [task queue](./TASKS.md), [feature coverage](./FEATURES.md), [journal](./JOURNAL.md) and [runbook](./AGENT-RUNBOOK.md). Requirements own scope/coverage; CI owns execution output.

## Active bounded child

Confirmed [PR #22](https://github.com/Levelleor/lorebound/pull/22) merge `b6c9c79de0b51564a3007a0a946f5e5242d746e8` satisfies DEV-004B's approved closure. The user's separate 2026-11-11 DEV-004 launch selects [DEV-004C](./requirements/DEV-004C.md): explicit optional testing of the entered local endpoint/model with a small synthetic request, temporary truthful feedback and cancellation. The owning record contains the remaining-scope/dependency audit and three affected requirements.

Implementation, tests, independent review, evidence and controls stay in [primary PR #23](https://github.com/Levelleor/lorebound/pull/23). Application CI and independent source/coverage/security/documentation/nine-capture review PASS; the [owning requirement record](./requirements/DEV-004C.md#verification-and-handoff) records checked source and the separate live-test limits. No named-PR merge approval has been given. Parent DEV-004 and original IDEAs remain PARTIAL; other adapters, cloud/credentials, broader diagnostics, pipelines/interpretation and world effects remain later. **B9-D12 remains DEFERRED — NO WORK.**

## Review access and next action

The [local review adventure](http://127.0.0.1:8086/?adventure=fe32e057-197a-4f3b-895b-e284cdca5fa5) was rechecked on 2026-11-14: **Connection testing review**, no accepted turns, empty input, saved **Local Qwen3 review** profile. App and local provider are running on loopback ports 8086/18085. Open Models and Test connection; this reasoning model reaches the short token limit, reported explicitly. Editing a field clears feedback; an unavailable endpoint gives a recoverable error. Stop abandons a pending test. Tests never save settings or canon.

The app serves reviewed application source `27a0eee` with separate persistent `.local/review/dev004c`; prior review/user libraries are preserved. Ask the agent to stop the review servers. To rebuild/relaunch the current checkout, use `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004c"`; Ctrl+C stops that foreground launch. The [authorised provider recipe](./README.md#local-llamacpp-testing) can use loopback port 18085 to match the saved profile.

**Exactly one next task: user hands-on review and verbal approval to finalise and merge PR #23, followed by same-PR conditional closure and applicable final-head checks.** No next child starts through closure.
