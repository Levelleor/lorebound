---
id: STORY-0003
type: story
status: pending
parent: PRD-0005
depends_on:
- STORY-0002
priority: 3
related:
- NOTE-0064
- PRD-0012
- PRD-0005
- PRD-0004
- PRD-0043
- PRD-0006
- PRD-0042
- STORY-0034
- NOTE-0003
blocked: true
---

# Retry, drafts, Undo/Fork and current-history prose editing

## Outcome

Retry, drafts, Undo/Fork and current-history prose editing.

[Legacy task: DEV-003](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003)

Original disposition: **PARTIAL**; DEV-003A/B/C/D merged; DEV-003E merged; DEV-003F merged; DEV-003G merged; DEV-003H verified/merged in PR #18; DEV-003I verified/merged in PR #19; DEV-003J verified/merged in PR #20; remaining work needs passage decisions or later subsystems.

## Scope and boundaries

Source dependency/constraints: DEV-002.

Primary coverage: IDEA-0003, IDEA-0004, IDEA-0005, IDEA-0041, IDEA-0042, IDEA-0011.

## Acceptance criteria

Use the owning accepted requirements and their objective criteria when a bounded scope is selected. This broad queue entry has no separate full acceptance contract.

## Risks and blockers

Partially delivered; no further bounded zero-effects child identified. Remaining passage identity/cross-passage decisions or nonempty world/module integration must be resolved before authorizing a new child.
## Verified scope and limits

Retry, draft persistence, Fork, committed Undo, accepted passage editing and bounded same-tab recovery are delivered through ten scoped children. Custom composer history was removed by PR #15; session-local passage editor Undo/Redo remains. Identity/cross-passage editing, nonempty effects and broader reconstruction require decisions or dependent systems.

## Remaining-scope audit — 2026-11-08

The user's separate launch authorises auditing DEV-003 and implementing one bounded child. Confirmed [PR #20](https://github.com/Levelleor/lorebound/pull/20) merge `6f74134b6dd72228040939f9cfba22f12699ecd9` satisfies DEV-003J's approved closure. A through J are merged; D's custom composer history was deliberately removed by E.

Accepted-source and actual-code inspection, including an independent reviewer, identified no further product child in the supported Story-only zero-effects boundary without selecting open behavior or entering later subsystem scope. This is a dependency/selection conclusion, not new whole-row certification or proof of exhaustive defect freedom. Existing merged PRs retain their verification evidence; no application tests were rerun for this audit.

| Remaining accepted obligation | Current source / prerequisite | Disposition |
| --- | --- | --- |
| Retry, committed Undo, direct authored/generated paragraph edits and temporary passage history | `StoryCoordinator`, `TextHistory`, `StoryWorkspace.svelte`; [IDEA-0004 inventory](#idea-0004-requirement-inventory), [DEV-003E](STORY-0018-committed-story-turn-undo-and-composer-correction.md), [F](STORY-0019-accepted-generated-passage-editing.md), [G](STORY-0020-accepted-authored-passage-editing.md), [H](STORY-0021-temporary-passage-editor-undo-redo.md) | Existing bounded implementations and merged evidence; no additional product child identified. Ordinary composer editing keeps the user-directed E correction. |
| Latest shared composer/passage drafts; same-tab confirmed save and uncertain Fork recovery | `TextDraft`, `SessionSaveRecovery`, `SessionForkRecovery`, `ForkController`, Go draft/Commit/Fork transactions; [DEV-003C](STORY-0016-shared-latest-story-composer-draft.md), [I](STORY-0022-same-tab-reload-recovery-for-confirmed-story-saves.md), [J](STORY-0023-same-tab-reload-recovery-for-uncertain-fork.md) | Existing bounded implementations and merged evidence. Tab-close/crash recovery and broader library operations remain unclaimed; no speculative multi-tab orchestration under B4-D09. |
| Whole-passage split/merge/move/delete and cross-passage identity | [IDEA-0003 open questions](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Direct%20Editable%20Prose%20Document.md#open-questions); stable identity rules remain open | Needs an explicit behavior decision before implementation. Paragraph edits within a surviving passage are already supported. |
| Nonempty effects, standalone corrections, full Fork state and authoritative/derived/module reconstruction | IDEA-0004/R07/R10; [IDEA-0042/R01](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003E.md#affected-idea-0042-reconstruction-requirement); relevant typed world/Lorebook/module owners | Depends on later supported event and subsystem implementations. Empty-event replay cannot certify this scope. |
| Other modes/draft targets, Quick Start and complete library lifecycle | Character/input context, generated opening workflows, DEV-008 operations | Later scope; not selected by this audit. |
| Spatial event/schema migration | B9-D12 | **DEFERRED — NO WORK.** |

**Authorised next execution: DEV-004A.** The user explicitly answered “Proceed with a bounded DEV-004 child”, extending this launch to the [local narration child](STORY-0024-direct-browser-local-story-narration.md). DEV-003 remains PARTIAL and its dependencies remain open. No archive move or whole-IDEA completion follows. Implementation authority does not authorise merging its PR.

## Verification boundary

Use deterministic generator and storage fixtures for sequence/error races, clearly labelled simulated. CI runs actual Firefox → Wails → Go → disposable SQLite, real SQLite regressions, exact process reopen and relevant Dark/Bright viewport checks; review its temporary captures rather than duplicating local runs. Existing supported host origin restrictions remain regression gates. Windows/macOS packaging and live model calls are not claimed. Independent review and final-head CI pass; the identical reviewed tree is merged. DEV-003A is VERIFIED within its bounded scope. Full IDEA-0004 remains PARTIAL, with no extra full-row atomic certification inferred from mixed/later or zero-effect coverage. No original IDEA moves to specs/archive.

**Publication evidence:** [PR #10](https://github.com/Levelleor/lorebound/pull/10), implementation commit `e422d8093cde4c1a4f8432a1caf0739885884c5d`, [CI PASS](https://github.com/Levelleor/lorebound/actions/runs/42140685316). Final head `75384544377b4de982514549976619ad368b5f56` passed [CI run 42141159906](https://github.com/Levelleor/lorebound/actions/runs/42141159906) and merged as `9b30042dd0c3cedd8b4d22a02cdc7eb0d53b7145` with an identical full tree. [Delivery record](STORY-0014-replace-the-provisional-story-candidate-on-retry.md). R02 nonempty effects and R06–R12 remain later/partial as recorded; no new formal whole-row atomic certification is claimed. No later child starts in this finalisation.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.

## Supporting detail

See [NOTE-0064](../../knowledge/inbox/NOTE-0064-story-0003-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
