---
type: development-journal
status: current
created: "2026-11-03"
updated: "2026-11-07"
tags:
  - planning/development
  - decisions
---

# Lorebound — Development Journal

Keep durable decisions, significant discoveries and unresolved constraints here. NOW owns the current handoff, TASKS owns scope/dependencies, FEATURES/requirements own coverage, and PR/CI owns execution output. Link rather than repeat their inventories. Preserve original approval/ADR provenance; correct factual history explicitly. Routine commands, retries and generated artifacts do not belong here.

## 2026-11-03 — Incremental development and production replacement

The user requested live development controls and coverage for every accepted idea, then redirected the initial DEV-001 CI-only launch to **DEV-002A production blank-adventure replacement**. Gate 0's test-record UI/service/schema was replaced while retaining the real Wails/browser/Go/SQLite boundaries. CI became supporting automation rather than a reason to delay the first product slice. DEV-001 remains interrupted with broader inventory certification unfinished. [Task record](./evidence/DEV-001.md), [DEV-002A](./evidence/DEV-002A.md).

Requirement inventory is incremental for affected ideas; the seven-IDEA 95-row draft is not wholesale certification. Accepted supersessions include current-only passages rather than revision archives, unchanged-operation uncertain-write recovery, coherent version/epoch reads and Story-first zero-world-effects delivery. Original IDEA/ADR sources remain authoritative.

## 2026-11-04 — Blank adventure foundation merged

[PR #4](https://github.com/Levelleor/lorebound/pull/4) delivered blank create/list/resume and formally verified IDEA-0006/R01–R03; host/storage remained partial. Recovery must keep uncertain-create Retry visible after refresh, and delayed responses must not override newer navigation. These review findings became browser regressions. [Delivery record](./evidence/DEV-002A.md).

## 2026-11-05 — Bounded Story parent and Retry

[PR #6](https://github.com/Levelleor/lorebound/pull/6) delivered provisional simulated Story generation and explicit atomic acceptance; [PR #8](https://github.com/Levelleor/lorebound/pull/8) closed its bounded integration parent. Input must remain live during idle refetch, receipts are adventure-scoped, uncertain saves remain truthfully labelled, and receipt recovery refetches current history. Background hints coalesce until safe idle and cannot erase conflict/technical diagnostics. [Story record](./evidence/DEV-002B.md), [integration record](./evidence/DEV-002C.md).

The parent reconciles 57 First-bearing rows and leaves 38 Later-only rows in the draft inventory. Empty effects do not certify nonempty reduction, provenance or optional plugins. Formal atomic certification remains the three prior IDEA-0006 rows.

[PR #10](https://github.com/Levelleor/lorebound/pull/10) delivered provisional Retry: immediately retire the old candidate, preserve input on failure/Stop and accept only the latest validated result. Uncertain-save recovery remains separate. Parent DEV-003 and IDEA-0004 remain partial; the user explicitly required finishing the child without starting another. [Retry record](./evidence/DEV-003A.md).

The user required personal-development-style for implementation/refactoring/architecture/review, explicitly overriding conflicting repository formatting conventions for affected code. Correctness, platform constraints and accepted contracts stay binding.

## 2026-11-06 — One primary PR for closure

The user required implementation, review evidence, reconciliation and closure in the same primary PR. Complete implementation/checks/review, obtain one verbal approval to finalise/merge that named PR, finish routine closure on the existing branch, review/check the final head, then merge and report actual provenance. No routine follow-up repository write or reconciliation PR. Material scope changes need separate approval; no next slice starts from closure approval. [Workflow](./README.md#single-pr-closure-and-verbal-approval).

Earlier PR pairs #4/#5, #6/#7, #8/#9 and #10/#11 remain history, not the process to repeat.

## 2026-11-06 — Fork interaction correction and closure

The user replaced DEV-003B's initial turn/title dialog with a small accessible icon beneath each accepted turn. Clicking opens its independent supported prefix in a separate tab/window, default `fork: [source name]`; renaming is separate. Source URL/history/live input stay intact. Blocked popups make no write; uncertain/closed-target recovery cannot copy again. [Scope](./requirements/DEV-003B.md).

The user approved finalising/merging PR #12 with “yes finish the task”. [PR #12](https://github.com/Levelleor/lorebound/pull/12) merged on 2026-11-06 as `8cf1b925dd5b576e8b1c59254134b520264b56c4`, satisfying its conditional closure. IDEA-0011 became PARTIAL: nine partial ideas, zero complete, three formal IDEA-0006 rows unchanged. [Delivery/review/CI record](./evidence/DEV-003B.md). No further child was selected.

## 2026-11-06 — CI-owned output and stable instructions

The user requested removal of generated build/test logs and screenshots from planning, CI automation with short-lived artifact retention, and instructions that stop recreating repository output. They expressly approved consolidating repeated evidence/review/reconciliation writeups while preserving scope, decisions, requirement coverage and PR/CI links.

They also required standing AGENTS instructions to stay concise and task-neutral, with progress/current work owned by NOW. Local maintenance implements that policy, condenses repeated control-file narratives, removes generated captures/logs and keeps requirement matrices under requirements. Original IDEA/ADR acceptance records are preserved. Two broken ADR reference links are repaired without changing decisions.

The workflow already covered real Linux browser/Go/SQLite/recovery/restart; routine local implementer/reviewer duplication is removed. CI keeps console output in job logs, uploads only browser captures and failed-host diagnostics for seven days, and runs repository hygiene/link checks without rebuilding the app for documentation-only changes. Two Fork navigation races previously checked only in a temporary reviewer probe now run in the maintained browser suite. Missing applicable coverage is added to automation; local runs address focused development/debugging or checks unavailable in CI. Publication and remote CI have not run for these local changes.

## 2026-11-06 — Hands-on acceptance before merge

The user requires an opportunity to review the working application before signing off a task. Agents provide a verified running URL or one command to build/launch the current checkout, plus a short task-specific demo with starting state, actions, expected results and limitations. User feedback precedes the existing named-PR finalise/merge approval; CI is not a substitute for acceptance, and no second ceremonial sign-off is added.

The development launcher uses a separate persistent ignored review library, preserving trial stories across restarts without touching the regular library. Node's development version is shared with CI through `.nvmrc`. This is development/review tooling; full product browser-launch, single-instance and platform lifecycle features remain outside this maintenance. [Setup](../../docs/development.md), [review handoff](./AGENT-RUNBOOK.md#user-review-before-merge).

## 2026-11-06 — DEV-003C composer draft selection

The user explicitly launched the next DEV-003 audit and one bounded child. Source/code review selected Story composer draft recovery: the existing Go-owned library and merged Story loop support it without changing canonical history semantics. Committed Undo still needs canonical version/order decoupling; prose editing needs passage targets and historical confirmation. [DEV-003C](./requirements/DEV-003C.md) owns the affected requirements and remaining obligations. Existing uncommitted workflow/evidence maintenance is retained as a prerequisite in the same primary PR.

Engineering choices within the accepted draft contract: 600 ms inactivity debounce, one shared `composer_story` slot per adventure and a separate nonspatial SQLite table. Acceptance waits for local autosaves, then consumes only stored text matching its authored passage in the same canonical transaction. A different latest draft survives; receipt replay does not consume again, and uncertain canonical recovery never resaves the prior input. The ordinary unsent composer is distinct from B4-D08's stale manual world-correction batch. Final unsaved keystrokes, overwritten drafts and generated candidates have no new recovery promise. No other DEV-003 child or deferred spatial migration is launched.

After the hands-on handoff, the user approved finalising/merging [PR #13](https://github.com/Levelleor/lorebound/pull/13): “looks good, don't forget to kill the server and merge close this one”. Review servers were stopped without deleting review data. Conditional closure remains in that same PR: on confirmed checked-head merge, DEV-003C is VERIFIED within scope and IDEA-0005 becomes PARTIAL, producing ten partial ideas and zero complete, with three formal IDEA-0006 rows unchanged. Actual merge/final CI is recorded in the PR. This approval authorises no next slice or separate reconciliation PR.

## 2026-11-06 — DEV-003D temporary input history selection

The user separately authorised auditing remaining DEV-003 requirements and selecting one bounded child. DEV-003C's PR #13 merge is confirmed. [DEV-003D](./requirements/DEV-003D.md) selects temporary Undo/Redo for the existing Story composer, covering part of IDEA-0004/R06 and the R12 distinction from Retry/committed rollback. Committed Undo needs version/count decoupling and new atomic removal/recovery; passage editing needs passage drafts/confirmation. Both remain later.

Engineering choices within the accepted finite-history contract: at most 50 edits and 500,000 retained UTF-16 units, IME composition grouping, and reset on generation start, different restored draft, changed canon or disposal. Undo/Redo autosaves only its latest result through the existing draft path. It never stores a candidate, canonical revision or durable draft history. Readiness-head CI passes; no new formal certification, complete IDEA or next-child authority follows.

After the named PR #14/preview/demo handoff, the user instructed: “yes, proceed with a separate subagent for review and finalize the task please”. This authorises a separate reviewer and routine finalisation/merge of that same PR after review/checks. It does not claim the user personally ran manual tests. Independent implementation review passed with no blocking finding or source change. Prepared closure stays conditional on final closure review, applicable final-head checks and confirmed merge; parent/counts and deferrals remain unchanged. No next child starts.

## 2026-11-06 — Corrective turn-level Undo scope and user review

After PR #14 merged, the user clarified that the intended feature was Undo of accepted Turn 2 back to Turn 1, rather than letter/input edits. They approved a corrective PR removing custom composer Undo/Redo and implementing committed Undo, repeatable back to baseline, new same-adventure continuation, atomic persistence/conflict checks and independent review. [DEV-003E](./requirements/DEV-003E.md) owns scope and coverage. Historical PR #14 evidence remains truthful; it never delivered turn Undo.

The user expressly requires an explanation of what was added and a reachable review-site address before accepting PR changes. Provide a current verified preview, demo and limits; ask for hands-on feedback and await it before named-PR finalise/merge approval. This implementation launch grants no merge authority.

The canonical version must remain monotonic through Undo while surviving turn order/count decreases. Metadata-only nonspatial database v4 and wire v3 fence old version-equals-count assumptions. Undo uses the existing atomic Commit/receipt path, preserves drafts and independently saved Forks, and reconstructs supported zero-effects history without AI. Old receipts resolve current canon after later Undo without reapplying a deletion or resurrecting prose. Broader world/correction replay remains later; B9-D12 stays deferred.

After the verified PR #15 review sample and walkthrough, the user accepted the functionality and authorised proceeding: “looks good to me, you may proceed after you're done”, then “continue”. Routine finalisation/merge of that named PR is authorised after closure review and final checks; no claim is made that the user ran every automated scenario. Prepared closure remains conditional on confirmed merge in the same primary PR.

IDEA-0042's accepted **Reconstruct committed Undo to the immediately previous active turn** clause now has bounded Story-only reconstruction evidence under R01. On confirmed PR #15 merge this makes IDEA-0042 PARTIAL, giving eleven partial / 41 without feature-level evidence / zero complete, with three formal IDEA-0006 rows unchanged. Nonempty/derived/module obligations remain later; no full-row certification or original-note archival follows. No next child starts.

## 2026-11-06 — DEV-003F generated-passage editing selection

The user launched the next DEV-003 task, authorising an audit, one bounded child, implementation/testing/independent review and one primary PR, with verbal approval required before finalise/merge. PR #15's merge is confirmed at `987310abf8ad39d43144c53ae77c78da937bff3b`; its prepared closure is satisfied.

[DEV-003F](./requirements/DEV-003F.md) selects direct editing of accepted generated passages, per-target latest shared drafts and the complete Keep Later/Delete All After/Continue Editing/Discard flow. Generated passages end the existing two-passage turn, so truncation removes exactly the subsequent turns without selecting an authored-passage or cross-passage boundary policy. Current body replacement reuses the version/epoch/receipt transaction and existing structured format; no revision archive, AI inference or spatial migration is introduced.

Passage drafts distinguish absent and deliberately empty saved values, consume only matching committed text and conditionally discard the editor's last saved value without flushing unsent edits over another tab's draft. A stale edit retains accessible text, displays current accepted target prose and requires deliberate fresh review; uncertain saves retry only the original operation. Broad world replay and authored/cross-passage editing remain later. Implementation, evidence and controls stay in the primary PR; no later slice is launched.

## 2026-11-07 — DEV-003F user acceptance and approved closure

After the PR #16 handoff supplied the checked two-turn review sample, the four-choice editing/draft walkthrough and limits, the user replied: **“yes, proceed with a merge for this and closure”**. This authorises finalising/merging that named PR after closure review/checks. It does not claim the user personally executed every automated scenario. Independent implementation/coverage, final CI-capture and readiness review PASS; the [requirement record](./requirements/DEV-003F.md) owns maintained coverage. Review/test hosts are stopped; review data is preserved.

Closure is prepared in the same primary PR and becomes effective only after closure review, applicable final-head checks and confirmed merge. DEV-003F then becomes VERIFIED within generated-passage Story-only zero-effects scope; IDEA-0003 and IDEA-0041 become PARTIAL, giving thirteen partial / 39 without feature-level evidence / zero complete originals. All 52 originals stay in production; three formal IDEA-0006 rows are unchanged. Actual merge provenance/final CI belongs in the PR/final handoff. Parent DEV-003, authored/cross-passage editing and broader reconstruction remain unfinished; B9-D12 is deferred. No next slice is launched.

## Persistent constraints for later authorised work

- **Sensitive local services:** Origin/Host/browser-header restrictions do not authenticate arbitrary hostile local processes. Review the access boundary before sensitive privileged extensions; no new login/token framework is inferred.
- **Restore/library changes:** validate active-epoch checks before honoring old receipts and test replay across epoch rotation when implementing these workflows.
- **Evidence limits:** fixed generation and intercepted faults remain simulated. Actual Linux Firefox/Wails/SQLite integration does not certify live providers, Windows/macOS packaging, full appearance controls or whole-application accessibility.
- **B9-D12:** spatial event/schema migration remains expressly DEFERRED — NO WORK. Respect later accepted ADRs and preserve the current-only story, TS domain/Go storage boundary and shared pending composer.

## 2026-11-07 — DEV-003G authored-passage editing selection

Confirmed PR #16 merge `020e36fd68b2360982ff288622539dcc42058552` satisfies DEV-003F's closure. The user's separate DEV-003 launch authorises one bounded child, implementation/tests/independent review and a single primary PR, with later named-PR verbal finalise/merge approval required.

[DEV-003G](./requirements/DEV-003G.md) selects accepted authored Story-passage editing. B3-D04 explicitly deletes all passages after the selected passage, so Delete removes the same-turn generated continuation as well as later turns. The surviving authored-only turn retains stable identity and supports a new continuation, Fork, Undo and exact reopen. Keep preserves its continuation and all later prose. Ordinary new-turn acceptance still requires both proposed passages. Latest shared drafts and immutable receipt recovery reuse the existing paths; no AI repair, revision archive or cross-passage operation is introduced.

Metadata-only database v5 and wire v4 fence older two-passage assumptions while preserving existing rows/identity/drafts/receipts. No spatial migration occurs. Nonempty effects, standalone corrections, custom passage-editor history and other modes remain later. Existing nine IDEA-0003/0041 rows extend to authored targets; no new formal certification or feature-count change is claimed. No further child starts.

## 2026-11-07 — DEV-003G user acceptance and approved closure

After the PR #17 handoff supplied the checked two-turn sample, authored-edit/draft/four-choice walkthrough and limits, the user replied **“yes proceed”**. This authorises finalising/merging that named PR after closure review/checks; it does not claim the user personally executed every automated scenario. Readiness CI, independent source/coverage, final CI-capture and readiness-document review PASS. [Requirements](./requirements/DEV-003G.md) owns maintained coverage; review/test hosts are stopped and the separate persistent review library is preserved.

Prepared closure stays in PR #17 and takes effect only after independent closure review, applicable final-head checks and confirmed merge. Then DEV-003G is VERIFIED within authored-passage Story-only zero-effects scope. IDEA-0003/0041 and parent DEV-003 remain PARTIAL; thirteen partial / 39 without feature-level evidence / zero complete and three formal IDEA-0006 rows remain unchanged. All 52 originals stay in production. No new full-row certification, nonempty reconstruction or B9-D12 work follows. Actual merge provenance/final CI belongs in the PR/final handoff; no routine post-merge repository write, separate reconciliation PR or next slice is launched.
