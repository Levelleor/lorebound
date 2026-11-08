---
type: development-requirements
status: implemented-unverified
created: "2026-11-07"
updated: "2026-11-07"
task: "DEV-003H"
parent: "DEV-003"
tags:
  - planning/development
---

# DEV-003H — Temporary passage-editor Undo/Redo

The user's separate 2026-11-07 launch authorises auditing DEV-003, selecting one bounded child, implementation/tests, independent review and one primary PR. Finalise/merge still requires later verbal approval of that named PR after the hands-on handoff. Base: confirmed [PR #17](https://github.com/Levelleor/lorebound/pull/17), merge `632ed6fb78b88a51e5135a516ff7ec7a1e35fdb1`; DEV-003G's conditional closure is satisfied.

## Remaining requirements and dependencies

Retry, independent Story-prefix Fork, shared composer/passage drafts, committed-turn Undo and accepted authored/generated passage editing are merged within supported simulated Story-only zero-effects scope. The existing editor, latest-only draft persistence, four explicit confirmation choices and version/epoch/receipt safeguards support temporary passage editing without a schema or wire change.

| Remaining parent obligation | Dependency / disposition |
| --- | --- |
| Bounded temporary passage-editor history | **Selected.** IDEA-0004/R06/R12 permits a finite in-memory lifetime/depth. Both accepted authored/generated targets use the existing inline editor; ordinary composer input and committed-turn Undo keep their existing behavior. |
| Whole-passage deletion, moving, splitting or merging | IDEA-0003 leaves boundary/identity rules open. Unselected; empty accepted documents remain invalid. |
| Nonempty world effects, independent corrections, module/derived reconstruction | Supported typed events/reducers/provenance are not yet implemented. Fail closed; empty effects establish no broader coverage. |
| Other modes, live providers, full library lifecycle and cross-reload uncertain-operation persistence | Later independently authorised work. No recovery guarantee for overwritten/unsaved drafts. |
| B9-D12 spatial event/schema migration | **DEFERRED — NO WORK.** |

## Accepted authority

[IDEA-0004](../../production/Retry%20Undo%20and%20Alternative%20Continuations.md), Accepted direction “Temporary undo is bounded” and its 2026-10-18 clarification, explicitly separates finite temporary editing history from deterministic committed-turn Undo and replace-on-Retry. Its [existing R06/R12 inventory](./DEV-003.md#idea-0004-requirement-inventory) is reused; no new atomic row or full-IDEA certification is claimed. The user's later rejection of composer-only DEV-003D remains binding: no custom composer controls return.

[IDEA-0003](../../production/Direct%20Editable%20Prose%20Document.md) allows free paragraph editing and latest-only passage drafts; [IDEA-0005](../../production/Adventure%20Save%20and%20Export%20Management.md) separates drafts from accepted story. [IDEA-0041](../../production/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md) retains Keep Later Turns / Delete All After Point / Continue Editing / Discard. [B3-D04](../../architecture/decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) prohibits a durable accepted-prose revision archive. [B3-D02](../../architecture/decisions/B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D05](../../architecture/decisions/B3-D05%20-%20Reject%20Stale%20Canonical%20Submissions%20and%20Refetch.md), [B3-D07](../../architecture/decisions/B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) and [B4-D09](../../architecture/decisions/B4-D09%20-%20Shared%20Latest%20Pending%20Draft%20Without%20Tab%20Locks.md) preserve immutable recovery, deliberate stale decisions, blocked composer and latest shared draft semantics. The [visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) govern the compact inline controls.

## Observable criteria and maintained coverage

| Existing affected requirements | Acceptance for this child | Source / maintained coverage |
| --- | --- | --- |
| IDEA-0004/R06 | Undo edit/Redo edit traverses only the open passage draft. Retain at most 50 changes and 500,000 UTF-16 units across undo/current/redo; when the current value alone exceeds the budget, keep only it. Exhaustion cannot reach older candidates or accepted revisions. New typing removes redo. | `textHistory.ts`; `textHistory.test.ts` depth/size/redo/Unicode/selection cases; `edit.test.ts` DEV-003H authored/generated cases. |
| IDEA-0004/R06/R12 | Buttons and passage-focused Ctrl/⌘+Z, Ctrl/⌘+Shift+Z and Ctrl+Y operate on draft text, restore focus/selection, group an IME composition once and route browser history input through the same limits. | `StoryWorkspace.svelte`, coordinator edit methods; `check-edit-history.mjs` both sources, keyboard and selection, simulated composition/history-input events; responsive Dark/Bright captures. |
| IDEA-0003/R02; IDEA-0004/R06 | Only latest Undo/Redo text uses existing draft autosave. Equal-value restores preserve the session; a different shared value starts empty history. Reload/reopen starts empty histories from latest saved text. No older values/selections enter SQLite. | Coordinator `TextDraft` integration; DEV-003H coordinator restore/autosave tests; maintained browser reload assertion and existing exact process-restart draft checks. |
| IDEA-0004/R06/R12; IDEA-0041/R01/R04 | Continue Editing preserves temporary history; review disables editing/history. Canonical confirmation starts with empty history and keeps its immutable request; conflict/reconsider, discard/close, target switch, reload and disposal cannot revive the old session. | Coordinator guards/reset paths; DEV-003H conflict/uncertain/discard/reopen/dispose tests; existing generated/authored stale/lost-response browser scenarios. |
| IDEA-0003/R01/R04; IDEA-0041/R02/R03/R05 | Temporary operations never generate, accept prose, alter versions/world state or affect composer input. Existing Keep/Delete semantics, independent Fork, committed Undo, original-operation recovery and structural/epoch fencing still apply. | DEV-003H coordinator zero-write/zero-generation assertions; `check-story-edit.mjs` exact canonical comparisons plus existing Keep/Delete/stale/recovery/Fork/Undo checks. |

The coordinator owns one private session history; the UI submits edits/selections/actions and restores selection after rendering. History is released when confirmation begins, on successful discard/close and disposal. A saved draft restore replaces history only when its text differs. Temporary memory is never serialized by the host contract. One composition is one change; ordinary input events are separate steps within the budget.

## Verification and review status

[Primary PR #18](https://github.com/Levelleor/lorebound/pull/18) contains implementation, evidence, controls and reconciliation. Focused TypeScript/editor tests, Svelte typecheck and actual Linux Firefox/Wails/Go/SQLite authored/generated editing scenarios PASS locally. Independent `/root/dev003h_review` accepted-source/source/coverage review and all sixteen changed-UI Dark/Bright captures at 390/768/1024/1440px PASS, with no blocking finding. [Application CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42438839068) checks exact source head `81f82778181419d2ce865c4668bc65d290252a79`: repository checks, build/typecheck, TypeScript, vet, Go/SQLite, Linux Firefox/host/recovery and exact process restart. Independent `/root/dev003h_review` final review of all sixteen actual CI history captures and the five-file readiness documentation delta PASS, with no blocking findings. Application sources are unchanged by readiness documentation; the reviewed application CI is reused, with repository checks required on the readiness head. Generated output belongs in CI or temporary directories; no separate evidence/reconciliation report is created.

The checked [two-turn preview](http://127.0.0.1:8084/?adventure=b8bf28fe-8d39-4079-9703-e94edad82a6b) serves matching built assets and uses the separate persistent `.local/review/dev003h` library. The focused disposable test host is stopped. [NOW](../NOW.md) owns readiness/relaunch; PR/chat owns the short demonstration. User acceptance and verbal approval to finalise/merge PR #18 remain pending. Work is not verified main.

Browser integration uses actual Linux Firefox → Wails → Go → SQLite with simulated generation. Dispatched composition/history-input events test event paths, not a real OS IME or browser menu. Meta-key injection on Linux does not certify macOS. Live providers, Windows/macOS packaging and full accessibility remain unverified. Unsaved/overwritten drafts and old accepted prose have no new recovery promise.

IDEA-0003/0004/0005/0041 and parent DEV-003 remain PARTIAL. Thirteen partial / 39 without feature-level evidence / zero complete original IDEAs, all 52 originals in production and three formal IDEA-0006 certifications stay unchanged. No next child starts through closure approval.
