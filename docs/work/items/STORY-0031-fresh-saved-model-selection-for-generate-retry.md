---
id: STORY-0031
type: story
status: completed
parent: PRD-0015
depends_on:
- STORY-0030
priority: 3
related:
- PRD-0015
- PRD-0013
- PRD-0016
- PRD-0018
- PRD-0011
- PRD-0069
- PRD-0070
- PRD-0020
- PRD-0007
- STORY-0004
---

# Fresh saved model selection for Generate/Retry

## Outcome

Fresh saved model selection for Generate/Retry.

[Legacy task: DEV-004H](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-004h)

**Bounded delivery verified and merged:** [PR #28](https://github.com/Levelleor/lorebound/pull/28), confirmed on source main at `84f151c8cdee3178cf6fc123eb7ca7614be4a28e`. Broader IDEA delivery is not inferred.

## Acceptance criteria

See the scoped requirement inventory below and primary PR verification.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-004H.md)

The user's separate 2026-11-23 DEV-004 launch authorises one bounded child, implementation, tests, independent review and one primary PR. Confirmed [PR #27](https://github.com/Levelleor/lorebound/pull/27) merge `54a8ed21bfaaf58ebbd5c303629a4fc0f4295b75` satisfies DEV-004G's approved closure. This record owns the selected boundary and conditional closure.

## Remaining scope and dependency audit

The base revision had all five local server kinds, persisted nonsecret profiles, optional discovery/test, completed/streamed Story generation, diagnostics and saved per-adventure narration guidance. At that revision `+page.svelte:narrate` reread narration guidance but resolved the connection from a tab-local `connections` cache. A changed, deleted or selected profile saved elsewhere could leave another tab sending its next request to the old endpoint or model. Go already provides a coherent epoch-fenced `ReadConnections`; no schema or service change is needed.

| Remaining DEV-004 scope | Disposition/dependencies |
| --- | --- |
| Saved profile reuse and request-source truth — IDEA-0014/0019 | **Selected:** resolve current saved model settings at each Generate/Retry, capture one immutable selection and fail closed on unreadable settings. Extend existing profile/lifecycle requirements rather than inventing a new provider feature. |
| Cloud/authentication/custom headers — IDEA-0012/0014 | Later native-vault/consented encrypted-sidecar and narrow sensitive-service work. No credentials, login, proxy or new adapter. |
| Configurable retry preferences — IDEA-0014 | Later refinement of safe replay/error policy. No automatic retry or fallback. Existing configurable timeouts remain unchanged. |
| Capability-aware sampling/presets — IDEA-0015/0016 | Later shared technical-settings storage, capability metadata/policies and effective-request mappings. No per-model preference copies. |
| Task routing/pipelines/interpreter/repair — IDEA-0017/0018/0045/0046 | Later role/stage/event contracts and supported entity/world owners. No second model or new world effects. |
| Narration/context/author-note/template integration — IDEA-0010/0024/0025 | Current local Story guidance is merged; INC-005 and DEV-005/008 own remaining integration. |
| Live Ollama/LM Studio/vLLM interoperability | INC-001/004 remain OPEN. Simulated provider fixtures establish only exercised contracts. No installation/configuration follows. |
| Test redesign / automatic new-turn acceptance / spatial migration | IDEA-0068 stays staged, IDEA-0069 unaccepted, **B9-D12 DEFERRED — NO WORK**. |

## Accepted sources and affected requirements

[IDEA-0014](../../product/PRD-0015-provider-connection-profiles-and-discovery.md) accepts reusable selected saved profiles, Go-owned nonsecret metadata and per-request recoverable failures without a successful probe prerequisite. [IDEA-0019](../../product/PRD-0020-streaming-cancellation-and-generation-diagnostics.md) accepts truthful requested-source diagnostics, immutable in-flight settings, cancellation and latest-attempt fences. This child completes their existing shared-profile/request-lifecycle boundary; it adds no separate persistent source of settings.

[B1-D05](../../decisions/ADR-0005-narrow-browser-to-go-service-surface.md) keeps settings reads technical and provider HTTP in the browser. [B9-D06](../../decisions/ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) governs simulated-provider evidence. Existing [visual](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and [interaction](../../decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) contracts govern source/error labels; no layout redesign is selected.

| Existing ID | Observable acceptance for this child | Coverage |
| --- | --- | --- |
| IDEA-0014/R01 | Every Generate and provisional Retry reads the current saved settings for the active library epoch before choosing Simulation or a local profile. Cross-tab profile edits, endpoint/model/timeout changes, selection changes and deletion govern the next attempt without reopening Models/reloading the page. Unsaved forms are never used. No probe is required. | `+page.svelte:narrate`; `check-fresh-model-selection.mjs:exerciseFreshModelSelection` (CI entry point `check-browser.mjs`). |
| IDEA-0014/R03 | Failed, malformed or wrong-epoch reads send no provider or simulated request and never fall back to the cached profile. Missing selected local profiles fail visibly. Player input, saved settings and accepted canon remain unchanged; deliberate retry can recover after a transient read failure. Raw host failures are not displayed. | `+page.svelte:narrate`; `check-fresh-model-selection.mjs:exerciseFreshModelSelection` (CI entry point `check-browser.mjs`). |
| IDEA-0019/R01 | Stop/navigation/disposal during a delayed settings read prevents later provider/simulation dispatch and obsolete UI/diagnostic updates. The successful read is detached/captured for that attempt: later saved changes cannot retarget its HTTP request or narration context. Preserve existing timeout/partial-output/explicit-acceptance fences. | `+page.svelte:narrate`; `check-fresh-model-selection.mjs:exerciseFreshModelSelection` (CI entry point `check-browser.mjs`). |
| IDEA-0019/R02 | Show a pending settings label until the read resolves, then display the source or error for the current attempt. A late startup/settings read cannot relabel an active newer attempt. Explicitly saved Simulation remains labelled simulation, not a fallback. On-read freshness does not promise continuous background settings synchronisation. | `+page.svelte:narrate`; `check-fresh-model-selection.mjs:exerciseFreshModelSelection` (CI entry point `check-browser.mjs`). |
| IDEA-0019/R09 | Requested-source diagnostics stay pinned to the dispatched local attempt. A later Retry captures newly saved settings and replaces old diagnostics. Read failure/Stop cannot resurrect an obsolete report. Secrets, URLs, raw failures and request/response prose are not added to diagnostics. | `+page.svelte:narrate`; `check-fresh-model-selection.mjs:exerciseFreshModelSelection` (CI entry point `check-browser.mjs`). |

These are bounded extensions of existing IDs, not five new inventory rows; inventory remains 161 across seventeen original IDEAs, with three formal IDEA-0006 certifications. Parent DEV-004 and all affected original IDEAs remain partial; no original is archived.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.
