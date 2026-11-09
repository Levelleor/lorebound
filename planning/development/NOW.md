---
type: development-status
status: current
created: "2026-11-03"
updated: "2026-11-09"
current_task: "DEV-004A — Direct browser local Story narration"
current_task_status: "READY — AWAITING USER REVIEW"
next_task: "DEV-004"
tags:
  - planning/development
---

# Lorebound — Current Development Status

Read the [workflow](./README.md), [task queue](./TASKS.md), [feature coverage](./FEATURES.md), [journal](./JOURNAL.md) and [runbook](./AGENT-RUNBOOK.md). Requirements own scope/coverage; CI owns execution output.

## Verified base

[PR #20](https://github.com/Levelleor/lorebound/pull/20) is confirmed merged at `6f74134b6dd72228040939f9cfba22f12699ecd9`, satisfying DEV-003J's approved conditional closure. Its [final-head CI](https://github.com/Levelleor/lorebound/actions/runs/42526423549) and independent review cover same-tab uncertain Fork recovery within supported simulated Story-only zero-effects scope. Parent DEV-003 remains PARTIAL; feature counts and formal certifications are unchanged.

## Ready for review

The user's separate 2026-11-08 launch authorised another DEV-003 audit and one bounded child. Accepted-source/code inspection and independent review identified no further product child within the existing Story-only zero-effects boundary that avoids open decisions or later subsystem dependencies. [Remaining-scope audit](./requirements/DEV-003.md#remaining-scope-audit--2026-11-08) owns the dispositions. This does not certify every original requirement or close the parent.

Whole-passage identity decisions, nonempty world/derived/module reconstruction, standalone corrections, other modes and broader library lifecycle remain outstanding. **B9-D12 remains DEFERRED — NO WORK.** The user explicitly answered **“Proceed with a bounded DEV-004 child”**. [DEV-004A](./requirements/DEV-004A.md) selects direct browser local Story narration through saved nonsecret llama.cpp/Custom compatible profiles. [Primary PR #21](https://github.com/Levelleor/lorebound/pull/21) contains implementation, regression coverage, development controls and the review record. Full application CI and independent source/coverage review passed; the PR owns the latest revision and responsive follow-up checks. User acceptance and verbal approval to finalise/merge PR #21 remain pending. No verified-main claim is made.

## Review access and next task

The checked local preview is [http://127.0.0.1:8086](http://127.0.0.1:8086), using a separate persistent review library. Relaunch the current checkout with `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004a"`; Ctrl+C stops it. Simulation is the initial explicit selection. Local narration needs a running compatible endpoint that allows this browser origin. The previous `.local/review/dev003j` library is preserved. Create a blank adventure, save a local profile in Models (manual ID or optional discovery), then Generate and review before Accept. An unreachable endpoint must preserve input and canon; Simulation must be chosen explicitly. The PR/chat handoff owns the walkthrough and evidence limits.

**Exactly one next task: DEV-004 — audit/select a further bounded child only after DEV-004A closes and a separate user launch.** DEV-003's outstanding dependencies stay visible; no next child starts through closure approval.
