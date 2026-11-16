---
type: incomplete-feature-register
status: current
created: "2026-11-14"
updated: "2026-11-16"
tags:
  - planning/development
  - implementation-gaps
---

# Implemented but unfinished features

This register explains capabilities that already have implementation but retain missing behavior, limited integration or unresolved verification. Each entry states what works, what is unfinished, the practical consequence and what would resolve the named gap. The initial entries cover the current provider and Story foundations; this is not an exhaustive audit of every partial IDEA.

[FEATURES](./FEATURES.md) owns overall IDEA completion, [requirements](./requirements/) own accepted scope and coverage, [TASKS](./TASKS.md) owns dependencies, and [NOW](./NOW.md) owns the single next task. This register links those records without changing approvals, requirement IDs or execution order. A completed bounded task can still leave a broader feature unfinished.

Use **functional**, **integration** or **verification** to identify the gap; combine them when necessary. Record delivery separately as **merged** or **unmerged**. Simulated provider replies establish only the exercised protocol contracts: they do not make a real production adapter simulated, nor prove compatibility with a running model server.

## INC-001 — Native Ollama: live-server verification outstanding

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — verification**; native implementation merged in [PR #25](https://github.com/Levelleor/lorebound/pull/25). This verification gap stays open. |
| Implemented | Native Ollama profiles, optional model discovery and synthetic connection testing, completed/NDJSON Story narration, cancellation and reported input/output token usage. Runtime requests use the configured server directly from the browser. |
| Unfinished | No check against an installed, running Ollama server/model has been recorded. CI and the review preview supply simulated Ollama replies. Actual server-version, model, thinking-output and browser-origin interoperability remain unverified. |
| Practical effect | The adapter can attempt a real configured Ollama endpoint, but a successful fixture demonstration does not establish that a particular local installation works. The **Simulated Ollama review** demonstration used fixed prose rather than AI generation. Its temporary fixture is stopped; the saved profile needs a running fixture or a real configured endpoint for another request. |
| Source / evidence | [DEV-004E requirements and limits](./requirements/DEV-004E.md); [native adapter](../../frontend/src/lib/ollama.ts); [browser protocol fixture](../../frontend/scripts/check-ollama.mjs); [passing simulated-provider application CI](https://github.com/Levelleor/lorebound/actions/runs/43651970773). Firefox transport and Go/SQLite in that CI are real. |
| Resolution | After an authorised focused live check, record the actual Ollama/server/model/browser configuration, exercised completed/streamed requests, cancellation, explicit acceptance/reload and remaining limits in the owning task/PR; fix any discovered mismatch. A result establishes only that exercised configuration. |
| Dependencies / boundary | Requires an available configured Ollama installation/model and permitted browser origin. No model installation or live test is launched by this entry. This records a verification gap without adding a mandatory live-AI CI or merge gate to DEV-004E. |

## INC-002 — Connection profiles: broader provider and credential support

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — functional/integration**; llama.cpp/Custom/native Ollama profiles are merged; named LM Studio/vLLM delivery takes effect on confirmed [PR #26](https://github.com/Levelleor/lorebound/pull/26) merge after approved closure. |
| Implemented | Named reusable nonsecret profiles, selected endpoint/model/timeout, manual model entry, optional discovery/testing and direct browser narration. Existing metadata saves retain revision/epoch guards. |
| Unfinished | Cloud adapters, authenticated connections/custom headers, accepted secure credential persistence and configurable retry preferences remain outstanding. LM Studio/vLLM has approved conditional closure in PR #26; live-server interoperability stays open in INC-004. |
| Practical effect | Existing unauthenticated connections are usable within their supported protocols. An endpoint requiring credentials cannot be configured through a supported secret-storage/request path yet. |
| Source / evidence | [IDEA-0014](../production/Provider%20Connection%20Profiles%20and%20Discovery.md); [DEV-004 remaining dependency audit](./requirements/DEV-004F.md#remaining-scope-and-dependency-audit); [browser model API](../../frontend/src/lib/models.ts); [nonsecret Go profile storage](../../internal/store/connections.go). |
| Resolution | Deliver and verify separately bounded accepted provider/credential/settings obligations, maintaining their individual requirement coverage and evidence. Update this entry as each named gap closes; broader IDEA completion remains in FEATURES. |
| Dependencies / boundary | Sensitive credential services require the accepted security/platform work; credentials stay outside canonical SQLite and browser persistent storage. IDEA-0068's separate test redesign remains staged. No additional implementation is launched here. |

## INC-003 — Story turns: tracked world effects remain unsupported

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — functional/integration**; the bounded Story-only, zero-effects turn/history foundation is merged. |
| Implemented | Authored/generated Story passages, explicit acceptance, atomic Go/SQLite persistence, current-history replay, Retry, Undo, passage edits, Fork and bounded draft/write recovery. |
| Unfinished | Supported nonempty typed world effects, grounded interpretation and their character/world/Lorebook integration remain outside this foundation. New Story proposals currently contain an empty event array. |
| Practical effect | Accepted prose can describe fictional changes, but the current Story loop does not turn those descriptions into tracked character, inventory or location state. Unsupported stored effects block further writes while preserving readable prose. |
| Source / evidence | [DEV-002C bounded scope](./requirements/DEV-002C.md); [DEV-003 remaining dependency audit](./requirements/DEV-003.md#remaining-scope-audit--2026-11-08); [proposal construction](../../frontend/src/lib/coordinator.ts); [reconstruction boundary](../../frontend/src/lib/story.ts); [feature coverage](./FEATURES.md). |
| Resolution | Implement and verify accepted typed effects with their owning subsystems, stable identity, atomic persistence and deterministic reconstruction, then extend affected history/edit/Undo/Fork coverage to those supported effects. Existing zero-effects checks alone cannot close this gap. |
| Dependencies / boundary | Requires separately authorised interpretation and entity/world subsystem slices. **B9-D12 spatial migration remains DEFERRED — NO WORK.** No new effect type, migration or development child is authorised by this entry. |

## INC-004 — Named LM Studio/vLLM: live-server verification outstanding

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — verification**; named implementation delivery takes effect on confirmed [PR #26](https://github.com/Levelleor/lorebound/pull/26) merge after approved closure. This live gap stays open after that bounded simulated-contract merge. |
| Implemented | Named nonsecret LM Studio/vLLM profiles/defaults/setup guidance, reused compatible discovery/synthetic test, completed/SSE Story narration, cancellation and named diagnostics. |
| Unfinished | No installed/running LM Studio or vLLM server/model/browser integration check has been recorded. Simulated compatible replies do not prove server-version, loaded-model, chat-template, CORS or reasoning-output interoperability. |
| Practical effect | The application can attempt a configured unauthenticated compatible endpoint; a fixture demonstration does not establish that the player's installation works. Authentication-required endpoints remain unsupported. |
| Source / evidence | [DEV-004F scope/coverage/limits](./requirements/DEV-004F.md); [server definitions](../../frontend/src/lib/modelServers.ts); [shared browser model API](../../frontend/src/lib/models.ts); [named browser fixture](../../frontend/scripts/check-named-servers.mjs). [Application CI](https://github.com/Levelleor/lorebound/actions/runs/43661108182) PASS; [PR #26](https://github.com/Levelleor/lorebound/pull/26) owns independent review/readiness, without live-server certification. |
| Resolution | After an authorised focused live check for each server, record the exercised version/model/browser, discovery/manual entry, completed/SSE, Stop and explicit acceptance/reload, fix mismatches and retain remaining configuration limits. |
| Dependencies / boundary | Requires separately configured available servers/models and browser access. No installation, server reconfiguration, credential workaround or mandatory live-AI CI/merge gate follows from this entry. |

## INC-005 — Narration guidance: remaining context and mode integration

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — integration**; DEV-004G implementation is unmerged in [PR #27](https://github.com/Levelleor/lorebound/pull/27), awaiting final checks and hands-on user review. |
| Implemented | Current adventure style controls/custom instructions, future-only guidance for existing local Story Generate/Retry, separate revision/epoch-fenced metadata and requested-guidance inspection. Fork copies current saved settings independently. |
| Unfinished | Persistent global/adventure/scene author-note layers, scenario-template starting directions, measured context-budget/omission inspection and future narration modes are not integrated. Model adherence is best-effort and context capacity is unknown. |
| Practical effect | Current supported Story narration sends selected style guidance in full. It adds no author-note manager, style presets, token-capacity guarantee or automatic rewrite of accepted prose. Simulation ignores style. |
| Source / evidence | [DEV-004G requirements/limits](./requirements/DEV-004G.md); [prompt assembly](../../frontend/src/lib/narration.ts); [composer settings shelf](../../frontend/src/lib/NarrationSettings.svelte); [browser contracts](../../frontend/scripts/check-narration.mjs). The primary PR owns current CI/actual-capture readiness and user-review disposition. |
| Resolution | Separately authorise and verify owning context/author-note/template/mode slices, integrate their inputs in the accepted deterministic order and preserve future-only behavior. Do not infer whole-IDEA completion from the current controls. |
| Dependencies / boundary | IDEA-0010/0024/0025 and DEV-005/008/009; later provider/mode integration. No automatic next child or change to staged/unaccepted ideas and B9-D12 deferral. |

## INC-006 — Command Citadel design alignment: remaining surfaces

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — functional/verification**; source-level comparison requested by the user. Existing Story/narration visual corrections are unmerged in [PR #27](https://github.com/Levelleor/lorebound/pull/27); this entry preserves the rest for later. |
| Implemented | The branch adapts the current Story reader/composer, gold action/steering controls, Cormorant Garamond/Plex typography and local font delivery. Its full-height story scrollbar and fixed attached narration section keep the input/story position stable as explicitly requested; narration gains scrolling only when needed; long drafts scroll inside the capped native Story textarea while surrounding controls stay fixed, preserving all text. The owning PR records fresh CI/capture readiness; prior CI does not verify later visual changes. |
| Unfinished | Appearance UI and additional reading fonts/presets; broader header/navigation/icon alignment; supported world-rail tabs/rows/sticky headers; consistent library/model-dialog form treatment; complete accessibility, zoom and other-OS visual verification. Detailed dispositions below keep cosmetic gaps separate from absent capabilities. |
| Practical effect | The bounded Story workspace can follow the reference without claiming the whole application or demo capabilities are implemented. Other surfaces still differ, and players cannot yet select the reference’s appearance options. |
| Source / evidence | Directly inspected [Workspace.tsx](https://github.com/Levelleor/lorebound-command-citadel/blob/0be367d3886e803207e1bc582cca4fb8fc50ac8c/src/components/lorebound/Workspace.tsx), [Dialogs.tsx](https://github.com/Levelleor/lorebound-command-citadel/blob/0be367d3886e803207e1bc582cca4fb8fc50ac8c/src/components/lorebound/Dialogs.tsx), [styles.css](https://github.com/Levelleor/lorebound-command-citadel/blob/0be367d3886e803207e1bc582cca4fb8fc50ac8c/src/styles.css) and font-loading root; compared actual [Story](../../frontend/src/lib/StoryWorkspace.svelte), [appearance](../../frontend/src/lib/appearance.css), [entry/rail](../../frontend/src/routes/+page.svelte) and [model dialog](../../frontend/src/lib/ConnectionSettings.svelte). [Visual contract](../design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) owns approved direction; [DEV-004G](./requirements/DEV-004G.md) owns this slice. |
| Resolution | Separately authorise bounded DEV-009 or owning-feature slices, implement supported surfaces and review actual responsive/theme/state captures against the pinned source. Retain current behavior contracts and truthful disabled/empty states. |
| Dependencies / boundary | User requested logging the remaining review/fixes, not executing them now. No new next task, IDEA completion, appearance persistence contract, domain capability or separate reconciliation PR follows. IDEA-0068 stays staged, IDEA-0069 unaccepted and B9-D12 deferred. |

| Remaining design area | Observed gap / later disposition |
| --- | --- |
| Appearance and fonts | `SettingsDialog` offers Dark/Bright/Midnight, density, ink, font alternatives and 15–28px size/preview/reset. Current app has no appearance selector; only Dark/Bright styling and the default bundled families are exercised. The shared hard-coded dark radial backdrop also leaves a brown-gray patch in Bright and reduces supporting-text contrast; make the gradient theme-aware in the later appearance pass. Deliver supported preferences under DEV-009/IDEA-0062; bundle Literata/Atkinson with licenses when that slice needs them. |
| Header and navigation | Reference has outline book/settings/location icons, a compact outlined settings button and responsive breadcrumbs. Current header uses text glyphs, a Models action and no tracked location. Align existing header controls in a later cosmetic slice; breadcrumbs require real location ownership, never sample data. |
| World rail | Reference has sticky icon-over-label tabs and compact Scene/Items/Lore/Context contents. Current rail is a truthful static empty-world placeholder with text tab labels. Cosmetic rail alignment belongs with supported tab behavior; character, inventory, Lorebook and measured token widgets depend on DEV-005/006/007 and remain absent. |
| Library and dialogs | Library has no complete equivalent in the demo; model forms have richer real validation/recovery requirements than its stub. Review spacing, title sizes, icon use, focus, disabled states and native controls when those surfaces are selected. Keep actual security/metadata semantics. |
| Story states and accessibility | This slice covers current Story/narration geometry, typography and captures. Later comprehensive review still needs high zoom, screen readers, long/localised labels, touch keyboards, additional platforms and supported world-event chips. Keep explicit Accept/Edit/Undo/Fork/recovery; do not copy demo auto-accept or immediate canonical editing. |

## Maintaining entries

Assign a stable `INC-` identifier within this register. Inspect the actual implementation and owning records before adding an entry. Use the same fields as the entries above: **Status / gap**, **Implemented**, **Unfinished**, **Practical effect**, **Source / evidence**, **Resolution**, and **Dependencies / boundary**.

Update an existing entry when its implementation, delivery or evidence changes. Close it only when its named gaps are resolved with appropriate evidence; retain its ID and resolution link. Closing a verification entry does not certify an entire IDEA, and merging a PR does not by itself resolve a live-verification gap. Keep generated logs/captures in CI, link the owning task/PR and preserve any remaining limitations. Maintain relevant entries during the same primary PR's implementation/reconciliation work; do not create a separate reconciliation PR or automatically start the recorded follow-up.
