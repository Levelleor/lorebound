---
id: STORY-0032
type: story
status: pending
parent: PRD-0014
depends_on:
- STORY-0028
priority: 3
related: []
blocked: true
---

# Native Ollama: live-server verification outstanding

## Outcome

Track this open gap without changing the merged status of the bounded slice.

[Pinned source INC-001](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/INCOMPLETE-FEATURES.md)

## Scope and boundaries

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — verification**; native implementation merged in [PR #25](https://github.com/Levelleor/lorebound/pull/25). This verification gap stays open. |
| Implemented | Native Ollama profiles, optional model discovery and synthetic connection testing, completed/NDJSON Story narration, cancellation and reported input/output token usage. Runtime requests use the configured server directly from the browser. |
| Unfinished | No check against an installed, running Ollama server/model has been recorded. CI and the review preview supply simulated Ollama replies. Actual server-version, model, thinking-output and browser-origin interoperability remain unverified. |
| Practical effect | The adapter can attempt a real configured Ollama endpoint, but a successful fixture demonstration does not establish that a particular local installation works. The **Simulated Ollama review** demonstration used fixed prose rather than AI generation. Its temporary fixture is stopped; the saved profile needs a running fixture or a real configured endpoint for another request. |
| Source / evidence | [DEV-004E requirements and limits](STORY-0028-native-ollama-story-connections.md); [native adapter](../../../frontend/src/lib/ollama.ts); [browser protocol fixture](../../../frontend/scripts/check-ollama.mjs); [passing simulated-provider application CI](https://github.com/Levelleor/lorebound/actions/runs/43651970773). Firefox transport and Go/SQLite in that CI are real. |
| Resolution | After an authorised focused live check, record the actual Ollama/server/model/browser configuration, exercised completed/streamed requests, cancellation, explicit acceptance/reload and remaining limits in the owning task/PR; fix any discovered mismatch. A result establishes only that exercised configuration. |
| Dependencies / boundary | Requires an available configured Ollama installation/model and permitted browser origin. No model installation or live test is launched by this entry. This records a verification gap without adding a mandatory live-AI CI or merge gate to DEV-004E. |

## Risks and blockers

No installed live Ollama configuration has been exercised; a separately authorized focused check against an available configured server/model is required.
