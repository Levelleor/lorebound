---
id: STORY-0030
type: story
status: completed
parent: PRD-0015
depends_on:
- STORY-0029
priority: 3
related:
- NOTE-0067
- PRD-0011
- PRD-0009
- PRD-0014
- PRD-0013
- PRD-0016
- PRD-0018
- PRD-0069
- PRD-0070
- PRD-0020
- PRD-0007
- STORY-0004
---

# Current adventure narration settings

## Outcome

Current adventure narration settings.

[Legacy task: DEV-004G](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-004g)

**Bounded delivery verified and merged:** [PR #27](https://github.com/Levelleor/lorebound/pull/27), confirmed on source main at `54a8ed21bfaaf58ebbd5c303629a4fc0f4295b75`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verified scope and limits

Persist optional current per-adventure narration guidance with its separate revision/epoch, apply it to future local Story requests and Retry in approved order, inspect the captured attempt, and copy saved settings independently on Fork. Preserve Simulation independence, explicit acceptance, responsive composer and truthful failure states.

## Accepted sources and bounded requirements

[IDEA-0010](../../product/PRD-0011-narration-style-and-perspective-controls.md) accepts the selected controls, custom instructions, current adventure settings, future-only behavior and stable creative instruction order without contradiction solving. Its later explicit removal of reusable narration-style presets governs. [IDEA-0019](../../product/PRD-0020-streaming-cancellation-and-generation-diagnostics.md) owns cancellation and requested-setting inspection; [B1-D05](../../decisions/ADR-0005-narrow-browser-to-go-service-surface.md) keeps persistence technical and inference in the browser. [B4-D05](../../decisions/ADR-0028-independent-fork-from-current-adventure-prefix.md) requires independent atomic Fork ownership. [B9-D06](../../decisions/ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) governs simulated-provider evidence. The approved [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) govern the composer shelf/disclosure.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0010/R01 | Current adventure offers optional first/second/third-person perspective, past/present tense, freeform genre/tone, slow/balanced/fast pacing, brief/balanced/detailed prose preference and custom style instructions. A stack-icon button beside the composer toggles a shelf above the input at all widths, overlaying the lower story without moving the docked input, toolbar or story scroll position. Empty values mean no preference; no character selection or style-preset library. Saving changes neither accepted prose/world/version nor composer draft. | `StoryWorkspace.svelte`, `NarrationSettings.svelte`, `keepCaretInView.ts`, `fonts.css`, `narration.ts`; `check-narration.mjs` controls, saved reload, unchanged snapshot/input, Firefox/Chromium real long-history before/after geometry, full-height story edge scrollbar, fixed settings during story scroll, conditional narration-only overflow, no overlap, capped native Story textarea with fixed surrounding controls, visible pending actions/full-draft restoration, first/last/control/keyboard access and browser reopen, growing textareas and font-swap restored drafts, toggle/Escape/focus and unsaved-generation guard; Go `TestNarrationIsolationConflictsAndReopen`. |
| IDEA-0010/R02 | Each local Story Generate/Retry reads then-current persisted settings and sends complete guidance in a fixed order, including cross-tab changes. Guidance does not alter accepted history or API decoding parameters. The in-flight request and its requested-guidance diagnostic remain a captured snapshot. All five supported local kinds share this behavior in completed/streamed mode. | `+page.svelte:narrate`, `models.ts:generateLocal`, `narration.ts:narrationInstructions`, `GenerationInspector.svelte`; `narration.test.ts` all-kind/completed/streamed contracts; `check-narration.mjs` actual browser request, Retry, stream snapshot and acceptance. |
| IDEA-0010/R03 | Noncanonical current settings persist separately per adventure across browser/process restart; new adventures default to no preference. Shelf forms pin their original library/adventure identity across a refresh; epoch/revision guards reject obsolete changes, retain the form on failure and allow identical uncertain-save retry without extra revision. Additive format-6→7 upgrade is atomic and preserves canon, profiles and epoch. Fork atomically copies current settings into independently owned metadata, without a historical settings archive. | `narration.go`, `store.go`, `fork.go`, `host.ts`, narrow service methods; Go `TestNarrationIsolationConflictsAndReopen`, `TestNarrationStrictValidationAndRollback`, `TestNarrationUpgradeAndRollback`, `TestForkCopiesIndependentCurrentNarrationAtomically`; browser simulated replacement-epoch/conflict/lost-reply checks and `check-browser.mjs` exact process restart. |
| IDEA-0010/R04 | Unreadable/invalid settings fail visibly before provider submission, retaining player input and canon. Stop during a settings read prevents late provider submission; existing Stop/failed response/Retry/navigation fences still govern. No silent guidance truncation or guaranteed model adherence, response length or token-capacity claim. | Strict TS/Go style validation; `+page.svelte:narrate` abort check after read; `check-narration.mjs` read-failure/late-read Stop and streamed Stop; `narration.test.ts` malformed/oversized settings and full contradictory custom instructions; existing coordinator/provider lifecycle coverage. |

## Supporting detail

See [NOTE-0067](../../knowledge/inbox/NOTE-0067-story-0030-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
