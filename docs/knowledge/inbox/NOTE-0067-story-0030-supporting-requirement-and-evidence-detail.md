---
id: NOTE-0067
type: note
status: inbox
source: STORY-0030
related: []
---

# STORY-0030 supporting requirement and evidence detail

## Discovery

Supporting detail for [STORY-0030](../../work/items/STORY-0030-current-adventure-narration-settings.md). Explicitly scoped or draft rows below are not whole-feature verification.

## Outcome

Current adventure narration settings.

[Legacy task: DEV-004G](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-004g)

**Bounded delivery verified and merged:** [PR #27](https://github.com/Levelleor/lorebound/pull/27), confirmed on source main at `54a8ed21bfaaf58ebbd5c303629a4fc0f4295b75`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-004G.md)

The user's separate launch and “proceed” authorise auditing DEV-004, selecting one bounded child, implementation, tests, independent review and one primary PR. Confirmed [PR #26](https://github.com/Levelleor/lorebound/pull/26) merge `4e565762c03660a9f4ee4fe3f961a453ca060fbf` satisfies DEV-004F's approved closure. [Primary PR #27](https://github.com/Levelleor/lorebound/pull/27) owns this work. The user approved finalising/merging PR #27 after the final hands-on handoff; the conditional closure below governs its effect.

## Remaining scope and dependency audit

At this base, `models.ts` uses one fixed narrator system message; neither an adventure style record nor narration controls exist. Local compatible/native adapters, Story Generate/Retry, provisional streams, diagnostic snapshots and explicit atomic acceptance are available. This supports a bounded creative-guidance child without credential or world subsystem work.

| Remaining DEV-004 scope | Disposition/dependencies |
| --- | --- |
| Current narration controls — IDEA-0010 | **Selected:** per-adventure perspective, tense, genre, tone, pacing, desired prose length and custom style instructions for existing local Story narration. No character is required. Reuse current browser request and acceptance paths. |
| Template directions, persistent author-note layers, full context budget — IDEA-0008/0010/0024/0025 | Later DEV-005/008 integration. No author-note manager, scene focus, token measurement or template linkage in this child. |
| Local server interoperability — IDEA-0013 | Named adapters are merged; [INC-001/004](../../product/PRD-0001-lorebound-product-and-delivery-roadmap.md) remain OPEN for live Ollama/LM Studio/vLLM verification. No installation/configuration required here. |
| Cloud/credentials/headers/retry preferences — IDEA-0012/0014 | Later secure native-vault/consented encrypted fallback and narrow sensitive-service work; browser credentials memory-only. No proxy, automatic retry or fallback. |
| Capability-aware sampling — IDEA-0015/0016 | Later capability metadata, conservative effective-request mapping and one shared technical settings record. Creative response-length guidance adds no API token cap or sampling parameter. |
| Routing/pipelines/interpreter/repair — IDEA-0017/0018/0045/0046 | Later role/stage/event contracts and subsystem integration. This child changes only the existing single Story narrator prompt. |
| Connection/access test separation — IDEA-0068 | Staged for refinement, not implementation-ready. Existing synthetic test remains unchanged and receives no adventure/style text. |
| Automatic new-turn acceptance — IDEA-0069 | Unaccepted; explicit Accept remains authoritative. |
| Spatial migration — B9-D12 | **DEFERRED — NO WORK.** Database format 7 adds only separate noncanonical creative metadata. |

## Accepted sources and bounded requirements

[IDEA-0010](../../product/PRD-0011-narration-style-and-perspective-controls.md) accepts the selected controls, custom instructions, current adventure settings, future-only behavior and stable creative instruction order without contradiction solving. Its later explicit removal of reusable narration-style presets governs. [IDEA-0019](../../product/PRD-0020-streaming-cancellation-and-generation-diagnostics.md) owns cancellation and requested-setting inspection; [B1-D05](../../decisions/ADR-0005-narrow-browser-to-go-service-surface.md) keeps persistence technical and inference in the browser. [B4-D05](../../decisions/ADR-0028-independent-fork-from-current-adventure-prefix.md) requires independent atomic Fork ownership. [B9-D06](../../decisions/ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) governs simulated-provider evidence. The approved [visual contract](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction mapping](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) govern the composer shelf/disclosure.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0010/R01 | Current adventure offers optional first/second/third-person perspective, past/present tense, freeform genre/tone, slow/balanced/fast pacing, brief/balanced/detailed prose preference and custom style instructions. A stack-icon button beside the composer toggles a shelf above the input at all widths, overlaying the lower story without moving the docked input, toolbar or story scroll position. Empty values mean no preference; no character selection or style-preset library. Saving changes neither accepted prose/world/version nor composer draft. | `StoryWorkspace.svelte`, `NarrationSettings.svelte`, `keepCaretInView.ts`, `fonts.css`, `narration.ts`; `check-narration.mjs` controls, saved reload, unchanged snapshot/input, Firefox/Chromium real long-history before/after geometry, full-height story edge scrollbar, fixed settings during story scroll, conditional narration-only overflow, no overlap, capped native Story textarea with fixed surrounding controls, visible pending actions/full-draft restoration, first/last/control/keyboard access and browser reopen, growing textareas and font-swap restored drafts, toggle/Escape/focus and unsaved-generation guard; Go `TestNarrationIsolationConflictsAndReopen`. |
| IDEA-0010/R02 | Each local Story Generate/Retry reads then-current persisted settings and sends complete guidance in a fixed order, including cross-tab changes. Guidance does not alter accepted history or API decoding parameters. The in-flight request and its requested-guidance diagnostic remain a captured snapshot. All five supported local kinds share this behavior in completed/streamed mode. | `+page.svelte:narrate`, `models.ts:generateLocal`, `narration.ts:narrationInstructions`, `GenerationInspector.svelte`; `narration.test.ts` all-kind/completed/streamed contracts; `check-narration.mjs` actual browser request, Retry, stream snapshot and acceptance. |
| IDEA-0010/R03 | Noncanonical current settings persist separately per adventure across browser/process restart; new adventures default to no preference. Shelf forms pin their original library/adventure identity across a refresh; epoch/revision guards reject obsolete changes, retain the form on failure and allow identical uncertain-save retry without extra revision. Additive format-6→7 upgrade is atomic and preserves canon, profiles and epoch. Fork atomically copies current settings into independently owned metadata, without a historical settings archive. | `narration.go`, `store.go`, `fork.go`, `host.ts`, narrow service methods; Go `TestNarrationIsolationConflictsAndReopen`, `TestNarrationStrictValidationAndRollback`, `TestNarrationUpgradeAndRollback`, `TestForkCopiesIndependentCurrentNarrationAtomically`; browser simulated replacement-epoch/conflict/lost-reply checks and `check-browser.mjs` exact process restart. |
| IDEA-0010/R04 | Unreadable/invalid settings fail visibly before provider submission, retaining player input and canon. Stop during a settings read prevents late provider submission; existing Stop/failed response/Retry/navigation fences still govern. No silent guidance truncation or guaranteed model adherence, response length or token-capacity claim. | Strict TS/Go style validation; `+page.svelte:narrate` abort check after read; `check-narration.mjs` read-failure/late-read Stop and streamed Stop; `narration.test.ts` malformed/oversized settings and full contradictory custom instructions; existing coordinator/provider lifecycle coverage. |

## Engineering boundary and prompt order

The user's screenshot feedback supersedes the initial rail/modal placement: **Narration style** is now a stack-icon button beside the primary composer controls at every width. It toggles a compact continuous narration section **above the textarea**, with gold expanded state and accessible name/expanded/control linkage. Three field columns collapse to two below 640px. The user's final clarification fixes the narration section inside the same bottom-docked composer as the main input, sharing its background with no separating border or floating story card. Opening/closing preserves input/toolbar bounds, reader layout and current story scroll position. Scrolling prose cannot move the narration section. One independent story scroll surface spans the full main height, flush against the desktop sidebar border, with a stable thin gutter; the centred article owns no scrollbar. The user explicitly permits narration-only scrolling when its contents exceed the available space above the input, including short windows; no narration scrollbar appears when everything fits. Textareas are remeasured after font loading as well as input/value/width changes. The user's latest clarification supersedes the earlier whole-composer fallback: the main Story textarea grows to at most 240px, reduced to 40% of available main height with an 80px floor, then owns its native vertical scrollbar. This is a visible native field cap, with no new character limit; the complete draft remains editable and persisted. Its action bar and Send button stay fixed, and narration retains its independent conditional cap/scrolling. Native Story keyboard/caret scrolling does not move the composer or story; narration instructions auto-grow inside their capped section with caret visibility maintained there. Draft-save status updates preserve manual scrolling. Shortening the draft restores the field's ordinary height. Very short windows reduce nonessential hints/spacing to keep controls visible. While generation or pending/recovery controls block Story input, its masked background field uses a compact three-line footprint so Accept/Retry/Discard/Stop stay visible. The full draft remains in state/value; returning to idle restores its capped native editing surface. No World tab switch or modal is required. Save closes the shelf after confirmation; Cancel/Escape/toggle close discard unsaved form values and restore button focus. Reload settings deliberately replaces the retained form after a conflict or uncertain save; the guidance disclosure opens on errors to expose this recovery action. Generate/Ctrl+Enter, history edit/Undo/Fork and header navigation/model changes remain unavailable until Save or Cancel, preventing unsaved preferences from being silently bypassed. Story input stays editable. The screenshot's strictness and author-note systems are not introduced by this layout correction.

The user supplied the actual [Command Citadel reference](https://github.com/Levelleor/lorebound-command-citadel/tree/0be367d3886e803207e1bc582cca4fb8fc50ac8c) for direct source comparison. The scoped adaptation covers existing Story reading hierarchy, prose/control/technical typography, compact action controls, steering shelf and main scrolling. `fonts.css` serves the reference Cormorant Garamond, IBM Plex Sans and IBM Plex Mono families locally with upstream OFL notices; runtime font-service requests are unnecessary. The fixed continuous composer follows the source structure; the user’s full-height story scrollbar and conditional narration-only overflow are explicit adaptations. [INC-006](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/INCOMPLETE-FEATURES.md#inc-006--command-citadel-design-alignment-remaining-surfaces) records the remaining design review/fixes for later; it does not launch them or add modes, appearance settings or automatic acceptance.

The system message contains existing narrator/technical guidance followed by identifiable current style input in this order: **perspective → tense → genre → tone → pacing → desired prose length → custom style instructions**. Accepted story context and current player input follow as separate user messages. No semantic conflict resolution or internal adventure/entity IDs are sent by Lorebound. User-authored text remains literal writing direction. Genre/tone are each limited to 200 Unicode code points and custom instructions to 2,000; invalid/oversized stored values fail visibly rather than being silently shortened. Browser field limits can be stricter for supplementary Unicode characters. Empty fields add no text.

Requested guidance is visible in latest-attempt Generation details; it is not proof of dispatch, model compliance or server-effective settings. Context capacity is unknown, no token-budget measurement/automatic trimming occurs, and provider capacity failures use existing recoverable errors. Simulation remains explicit fixed prose and ignores style. Connection discovery/tests receive no adventure guidance. Template/author-note layers and additional narration modes are absent, not silently omitted from existing implemented inputs.

Fork copies the **current saved** creative settings at its transaction, including when the chosen turn is earlier. This is neither reconstruction of settings at that historical turn nor copied pending form/draft text. Destination revision starts at 1 for a saved source row; subsequent changes and idempotent Fork replay cannot couple adventures. New metadata has its own revision and never increments the canonical adventure version; wire schema remains 4. Older binaries reject database format 7 rather than silently operating without these settings.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.

## Classification

Source requirement detail and evidence; not a separate task or implementation approval.
