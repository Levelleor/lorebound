---
type: development-status
status: current
created: "2026-11-03"
updated: "2026-11-15"
current_task: "DEV-004G — Current adventure narration settings"
current_task_status: "IMPLEMENTED — OVERSIZED DRAFT DECISION PENDING"
next_task: "DEV-004"
tags:
  - planning/development
---

# Lorebound — Current Development Status

Read the [workflow](./README.md), [task queue](./TASKS.md), [feature coverage](./FEATURES.md), [implemented-feature gaps](./INCOMPLETE-FEATURES.md), [journal](./JOURNAL.md) and [runbook](./AGENT-RUNBOOK.md).

## Current work

Confirmed [PR #26](https://github.com/Levelleor/lorebound/pull/26) merge `4e56576` satisfies DEV-004F closure. The user's separate launch and “proceed” select [DEV-004G](./requirements/DEV-004G.md): current adventure narration settings for subsequent existing local Story generation. Its requirement record owns the remaining dependency audit, four bounded requirements and evidence limits.

Implementation, evidence, independent review, controls and reconciliation stay in [primary PR #27](https://github.com/Levelleor/lorebound/pull/27). Focused checks and independent source/control/fixture review PASS; the PR owns current CI links/results and actual-capture review. The user’s direct Command Citadel reference and overlay choice govern the feedback revision: stable bottom input with an attached fixed narration section, conditional narration-only scrolling, one full-height story edge scrollbar and actual bundled reference fonts. INC-006 owns the remaining design alignment work. Normal-layout CI and actual-capture review are recorded in the PR. An oversized-draft overflow fallback remains unresolved before full readiness; the user’s preference is pending. Fresh applicable checks/review must pass after that fix before requesting merge approval. No finalise/merge approval or verified-main claim.

## Hands-on review

Checked local preview: [The Harbour Lantern](http://127.0.0.1:8086/?adventure=6c3ea526-df3e-46bb-bbfe-47812fd94b0c), refreshed after the composer-shelf correction (current checked source and CI are recorded in PR #27). Separate persistent library: `.local/review/dev004g`; prior review/user data is preserved. Live Qwen3/llama.cpp runs on loopback port 18085; this is not the CI simulation. One live-model turn is accepted and gangplank input retained. The requirement record owns the limited live result.

Click the **Narration style** stack icon beside the composer. Its inline shelf opens above the input on desktop/mobile; change tone/tense and Save. Cancel/Escape/toggle close discards unsaved form changes. Generation waits until Save or Cancel. Existing prose stays unchanged; reopening/reloading retains preferences. Generate, expand Generation details and inspect **Requested narration guidance**; explicitly Accept or Discard. Stream output → Generate → Stop preserves input and saves no new turn. Adherence is best-effort; author-note/template/context/mode integration remains later.

Relaunch current source with `bash scripts/dev.sh -port 8086 -data-dir "$PWD/.local/review/dev004g"`; Ctrl+C stops a foreground launch. The saved live profile needs the separately started provider; the development workflow owns its authorised launch recipe. Agent-launched review processes will be stopped during approved closure, preserving data. A checked preview or CI PASS does not establish user acceptance.

IDEA-0010/DEV-004 remain unfinished; context/author-note/template/cloud/credential/sampling/pipeline/world scope stays later. INC-001/004 stay OPEN, IDEA-0068 staged, IDEA-0069 unaccepted and **B9-D12 DEFERRED — NO WORK**.

**Exactly one next task: DEV-004 — audit/select a further bounded child only after DEV-004G closes and a separate user launch.** No next slice or reconciliation PR follows automatically.
