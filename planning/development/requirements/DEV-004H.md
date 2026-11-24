---
type: development-requirements
status: in-progress
created: "2026-11-16"
updated: "2026-11-23"
task: "DEV-004H"
parent: "DEV-004"
tags:
  - planning/development
---

# DEV-004H — Fresh saved model selection for Generate/Retry

The user's separate 2026-11-23 DEV-004 launch authorises one bounded child, implementation, tests, independent review and one primary PR. Confirmed [PR #27](https://github.com/Levelleor/lorebound/pull/27) merge `54a8ed21bfaaf58ebbd5c303629a4fc0f4295b75` satisfies DEV-004G's approved closure. This record owns the selected boundary; no merge approval has been given for this child.

## Remaining scope and dependency audit

Actual source at this base has all five local server kinds, persisted nonsecret profiles, optional discovery/test, completed/streamed Story generation, diagnostics and saved per-adventure narration guidance. `+page.svelte:narrate` rereads narration guidance but resolves the connection from a tab-local `connections` cache. There is no model-settings cross-tab invalidation. Consequently, saving a changed/deleted/selected profile elsewhere can leave another tab sending its next request to the old endpoint/model. Go already provides a coherent epoch-fenced `ReadConnections`; no schema or service change is needed.

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

[IDEA-0014](../../production/Provider%20Connection%20Profiles%20and%20Discovery.md) accepts reusable selected saved profiles, Go-owned nonsecret metadata and per-request recoverable failures without a successful probe prerequisite. [IDEA-0019](../../production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) accepts truthful requested-source diagnostics, immutable in-flight settings, cancellation and latest-attempt fences. This child completes their existing shared-profile/request-lifecycle boundary; it adds no separate persistent source of settings.

[B1-D05](../../architecture/decisions/B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) keeps settings reads technical and provider HTTP in the browser. [B9-D06](../../architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) governs simulated-provider evidence. Existing [visual](../../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) and [interaction](../../design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) contracts govern source/error labels; no layout redesign is selected.

| Existing ID | Observable acceptance for this child | Coverage |
| --- | --- | --- |
| IDEA-0014/R01 | Every Generate and provisional Retry reads the current saved settings for the active library epoch before choosing Simulation or a local profile. Cross-tab profile edits, endpoint/model/timeout changes, selection changes and deletion govern the next attempt without reopening Models/reloading the page. Unsaved forms are never used. No probe is required. | Pending implementation/verification. |
| IDEA-0014/R03 | Failed, malformed or wrong-epoch reads send no provider or simulated request and never fall back to the cached profile. Missing selected local profiles fail visibly. Player input, saved settings and accepted canon remain unchanged; deliberate retry can recover after a transient read failure. Raw host failures are not displayed. | Pending implementation/verification. |
| IDEA-0019/R01 | Stop/navigation/disposal during a delayed settings read prevents later provider/simulation dispatch and obsolete UI/diagnostic updates. The successful read is detached/captured for that attempt: later saved changes cannot retarget its HTTP request or narration context. Preserve existing timeout/partial-output/explicit-acceptance fences. | Pending implementation/verification. |
| IDEA-0019/R02 | Visible source/error states reflect the source resolved for the current attempt, not an obsolete startup load. A late startup/settings read cannot relabel an active newer attempt. Explicitly saved Simulation remains labelled simulation, not a fallback. On-read freshness does not promise continuous background settings synchronisation. | Pending implementation/verification. |
| IDEA-0019/R09 | Requested-source diagnostics stay pinned to the dispatched local attempt. A later Retry captures newly saved settings and replaces old diagnostics. Read failure/Stop cannot resurrect an obsolete report. Secrets, URLs, raw failures and request/response prose are not added to diagnostics. | Pending implementation/verification. |

These are bounded extensions of existing IDs, not five new inventory rows; inventory remains 161 across seventeen original IDEAs, with three formal IDEA-0006 certifications. Parent DEV-004 and all affected original IDEAs remain partial; no original is archived.

## Verification and handoff

Implementation and verification are in progress; no merged feature claim or merge approval is made. The inherited untracked task draft and browser probe were inspected and replaced after confirming actual source. Local Pi orchestration was moved outside the repository for safekeeping; it is not a product dependency.

The primary PR will own implementation, CI, independent review, controls and any conditional closure. Browser provider replies and injected host faults are simulated; Firefox/Wails/Go/SQLite are real. No new live-server interoperability, other-OS packaging or complete accessibility certification is claimed. Existing INC-001/004/005/006 stay OPEN.

Before finalise/merge approval, provide a running isolated preview or one launch command, a short two-tab walkthrough and evidence limits. Keep exactly one next task, DEV-004 audit/selection, requiring confirmed closure and a separate launch. No automatic next child or reconciliation PR follows.
