---
type: development-requirements
status: in-progress
created: "2026-11-15"
updated: "2026-11-15"
task: "DEV-004G"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004G — Current adventure narration settings

The user's separate launch and “proceed” authorise auditing DEV-004, selecting one bounded child, implementation, tests, independent review and one primary PR. Confirmed [PR #26](https://github.com/Levelleor/lorebound/pull/26) merge `4e565762c03660a9f4ee4fe3f961a453ca060fbf` satisfies DEV-004F's approved closure. No merge approval for this child has been given.

## Remaining scope and dependency audit

At this base, `models.ts` uses one fixed narrator system message; neither an adventure style record nor narration controls exist. Local compatible/native adapters, Story Generate/Retry, provisional streams, diagnostic snapshots and explicit atomic acceptance are available. This supports a bounded creative-guidance child without credential or world subsystem work.

| Remaining DEV-004 scope | Disposition/dependencies |
| --- | --- |
| Current narration controls — IDEA-0010 | **Selected:** per-adventure perspective, tense, genre, tone, pacing, desired prose length and custom style instructions for existing local Story narration. No character is required. Reuse current browser request and acceptance paths. |
| Template directions, persistent author-note layers, full context budget — IDEA-0008/0010/0024/0025 | Later DEV-005/008 integration. No author-note manager, scene focus, token measurement or template linkage in this child. |
| Local server interoperability — IDEA-0013 | Named adapters are merged; [INC-001/004](../INCOMPLETE-FEATURES.md) remain OPEN for live Ollama/LM Studio/vLLM verification. No installation/configuration required here. |
| Cloud/credentials/headers/retry preferences — IDEA-0012/0014 | Later secure native-vault/consented encrypted fallback and narrow sensitive-service work; browser credentials memory-only. No proxy, automatic retry or fallback. |
| Capability-aware sampling — IDEA-0015/0016 | Later capability metadata, conservative effective-request mapping and one shared technical settings record. Creative response-length guidance adds no API token cap or sampling parameter. |
| Routing/pipelines/interpreter/repair — IDEA-0017/0018/0045/0046 | Later role/stage/event contracts and subsystem integration. This child changes only the existing single Story narrator prompt. |
| Connection/access test separation — IDEA-0068 | Staged for refinement, not implementation-ready. Existing synthetic test remains unchanged and receives no adventure/style text. |
| Automatic new-turn acceptance — IDEA-0069 | Unaccepted; explicit Accept remains authoritative. |
| Spatial migration — B9-D12 | **DEFERRED — NO WORK.** Database format 7 adds only separate noncanonical creative metadata. |

## Accepted sources and bounded requirements

[IDEA-0010](../../production/Narration%20Style%20and%20Perspective%20Controls.md) accepts the selected controls, custom instructions, current adventure settings, future-only behavior and stable creative instruction order without contradiction solving. Its later explicit removal of reusable narration-style presets governs. [IDEA-0019](../../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) owns cancellation and requested-setting inspection; [B1-D05](../../architecture/decisions/B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) keeps persistence technical and inference in the browser. [B4-D05](../../architecture/decisions/B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md) requires independent atomic Fork ownership. [B9-D06](../../architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) governs simulated-provider evidence. The approved [visual contract](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction mapping](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) govern the dialog/disclosure.

| ID | Observable acceptance | Maintained coverage |
| --- | --- | --- |
| IDEA-0010/R01 | Current adventure offers optional first/second/third-person perspective, past/present tense, freeform genre/tone, slow/balanced/fast pacing, brief/balanced/detailed prose preference and custom style instructions. Empty values mean no preference; no character selection or style-preset library. Saving changes neither accepted prose/world/version nor composer draft. | `NarrationSettings.svelte`, `narration.ts`; `check-narration.mjs` controls, saved reload, unchanged snapshot/input and responsive dialog; Go `TestNarrationIsolationConflictsAndReopen`. |
| IDEA-0010/R02 | Each local Story Generate/Retry reads then-current persisted settings and sends complete guidance in a fixed order, including cross-tab changes. Guidance does not alter accepted history or API decoding parameters. The in-flight request and its requested-guidance diagnostic remain a captured snapshot. All five supported local kinds share this behavior in completed/streamed mode. | `+page.svelte:narrate`, `models.ts:generateLocal`, `narration.ts:narrationInstructions`, `GenerationInspector.svelte`; `narration.test.ts` all-kind/completed/streamed contracts; `check-narration.mjs` actual browser request, Retry, stream snapshot and acceptance. |
| IDEA-0010/R03 | Noncanonical current settings persist separately per adventure across browser/process restart; new adventures default to no preference. Epoch/revision guards reject obsolete changes, retain the form on failure and allow identical uncertain-save retry without extra revision. Additive format-6→7 upgrade is atomic and preserves canon, profiles and epoch. Fork atomically copies current settings into independently owned metadata, without a historical settings archive. | `narration.go`, `store.go`, `fork.go`, `host.ts`, narrow service methods; Go `TestNarrationIsolationConflictsAndReopen`, `TestNarrationStrictValidationAndRollback`, `TestNarrationUpgradeAndRollback`, `TestForkCopiesIndependentCurrentNarrationAtomically`; browser conflict/lost-reply checks and `check-browser.mjs` exact process restart. |
| IDEA-0010/R04 | Unreadable/invalid settings fail visibly before provider submission, retaining player input and canon. Stop during a settings read prevents late provider submission; existing Stop/failed response/Retry/navigation fences still govern. No silent guidance truncation or guaranteed model adherence, response length or token-capacity claim. | Strict TS/Go style validation; `+page.svelte:narrate` abort check after read; `check-narration.mjs` read-failure/late-read Stop and streamed Stop; `narration.test.ts` malformed/oversized settings and full contradictory custom instructions; existing coordinator/provider lifecycle coverage. |

## Engineering boundary and prompt order

The dialog is reached through **Narration style** in the context rail; below 1024px, choose **World** first. It uses a native focus-managed, internally scrolling settings dialog, 576px maximum, two columns collapsing below 640px. Changes save explicitly; Cancel/Escape discard unsaved form changes. Reload settings deliberately replaces the retained form after a conflict or uncertain save.

The system message contains existing narrator/technical guidance followed by identifiable current style input in this order: **perspective → tense → genre → tone → pacing → desired prose length → custom style instructions**. Accepted story context and current player input follow as separate user messages. No semantic conflict resolution or internal adventure/entity IDs are sent by Lorebound. User-authored text remains literal writing direction. Genre/tone are each limited to 200 Unicode code points and custom instructions to 2,000; invalid/oversized stored values fail visibly rather than being silently shortened. Browser field limits can be stricter for supplementary Unicode characters. Empty fields add no text.

Requested guidance is visible in latest-attempt Generation details; it is not proof of dispatch, model compliance or server-effective settings. Context capacity is unknown, no token-budget measurement/automatic trimming occurs, and provider capacity failures use existing recoverable errors. Simulation remains explicit fixed prose and ignores style. Connection discovery/tests receive no adventure guidance. Template/author-note layers and additional narration modes are absent, not silently omitted from existing implemented inputs.

Fork copies the **current saved** creative settings at its transaction, including when the chosen turn is earlier. This is neither reconstruction of settings at that historical turn nor copied pending form/draft text. Destination revision starts at 1 for a saved source row; subsequent changes and idempotent Fork replay cannot couple adventures. New metadata has its own revision and never increments the canonical adventure version; wire schema remains 4. Older binaries reject database format 7 rather than silently operating without these settings.

## Verification and handoff

Independent accepted-source scope review PASS. Focused TypeScript all-provider prompt contracts, Go narration/storage regressions, Svelte typecheck/build PASS. Browser regression/CI, independent final-source/control/actual-CI-capture review and hands-on handoff remain in progress; execution links and checked revision will be recorded here and in the primary PR. No verified-main claim.

External model replies are simulated. Real Firefox/Wails/Go/SQLite checks establish only their exercised path; live model adherence, live Ollama/LM Studio/vLLM interoperability, other-OS packaging and full accessibility remain unverified. Parent DEV-004 and IDEA-0010 remain unfinished; all original notes stay in production. [INC-005](../INCOMPLETE-FEATURES.md#inc-005--narration-guidance-remaining-context-and-mode-integration) owns the remaining integration gap. One primary PR owns implementation, evidence, controls and reconciliation. Finalise/merge requires named-PR verbal approval after the hands-on handoff; closure starts no next child.
