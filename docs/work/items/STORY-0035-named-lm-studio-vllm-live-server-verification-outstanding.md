---
id: STORY-0035
type: story
status: pending
parent: PRD-0014
depends_on:
- STORY-0029
priority: 3
related: []
blocked: true
---

# Named LM Studio/vLLM: live-server verification outstanding

## Outcome

Track this open gap without changing the merged status of the bounded slice.

[Pinned source INC-004](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/INCOMPLETE-FEATURES.md)

## Scope and boundaries

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — verification**; named implementation delivery was verified and merged in [PR #26](https://github.com/Levelleor/lorebound/pull/26). This live gap stays open after that bounded simulated-contract merge. |
| Implemented | Named nonsecret LM Studio/vLLM profiles/defaults/setup guidance, reused compatible discovery/synthetic test, completed/SSE Story narration, cancellation and named diagnostics. |
| Unfinished | No installed/running LM Studio or vLLM server/model/browser integration check has been recorded. Simulated compatible replies do not prove server-version, loaded-model, chat-template, CORS or reasoning-output interoperability. |
| Practical effect | The application can attempt a configured unauthenticated compatible endpoint; a fixture demonstration does not establish that the player's installation works. Authentication-required endpoints remain unsupported. |
| Source / evidence | [DEV-004F scope/coverage/limits](STORY-0029-named-lm-studio-and-vllm-story-connections.md); [server definitions](../../../frontend/src/lib/modelServers.ts); [shared browser model API](../../../frontend/src/lib/models.ts); [named browser fixture](../../../frontend/scripts/check-named-servers.mjs). [Application CI](https://github.com/Levelleor/lorebound/actions/runs/43661108182) PASS; [PR #26](https://github.com/Levelleor/lorebound/pull/26) owns independent review/readiness, without live-server certification. |
| Resolution | After an authorised focused live check for each server, record the exercised version/model/browser, discovery/manual entry, completed/SSE, Stop and explicit acceptance/reload, fix mismatches and retain remaining configuration limits. |
| Dependencies / boundary | Requires separately configured available servers/models and browser access. No installation, server reconfiguration, credential workaround or mandatory live-AI CI/merge gate follows from this entry. |

## Risks and blockers

No live LM Studio/vLLM checks recorded; requires separately authorized checks with available configured servers.
