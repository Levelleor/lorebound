---
id: STORY-0033
type: story
status: pending
parent: PRD-0015
depends_on:
- STORY-0029
priority: 3
related:
- PRD-0015
- PRD-0069
blocked: true
---

# Connection profiles: broader provider and credential support

## Outcome

Track this open gap without changing the merged status of the bounded slice.

[Pinned source INC-002](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/INCOMPLETE-FEATURES.md)

## Scope and boundaries

| Field | Detail |
| --- | --- |
| Status / gap | **OPEN — functional/integration**; llama.cpp/Custom/native Ollama profiles are merged; named LM Studio/vLLM delivery was verified and merged in [PR #26](https://github.com/Levelleor/lorebound/pull/26). |
| Implemented | Named reusable nonsecret profiles, selected endpoint/model/timeout, manual model entry, optional discovery/testing and direct browser narration. Existing metadata saves retain revision/epoch guards. |
| Unfinished | Cloud adapters, authenticated connections/custom headers, accepted secure credential persistence and configurable retry preferences remain outstanding. LM Studio/vLLM has approved conditional closure in PR #26; live-server interoperability stays open in INC-004. |
| Practical effect | Existing unauthenticated connections are usable within their supported protocols. An endpoint requiring credentials cannot be configured through a supported secret-storage/request path yet. |
| Source / evidence | [IDEA-0014](../../product/PRD-0015-provider-connection-profiles-and-discovery.md); [DEV-004 remaining dependency audit](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-004F.md#remaining-scope-and-dependency-audit); [browser model API](../../../frontend/src/lib/models.ts); [nonsecret Go profile storage](../../../internal/store/connections.go). |
| Resolution | Deliver and verify separately bounded accepted provider/credential/settings obligations, maintaining their individual requirement coverage and evidence. Update this entry as each named gap closes; broader IDEA completion remains in FEATURES. |
| Dependencies / boundary | Sensitive credential services require the accepted security/platform work; credentials stay outside canonical SQLite and browser persistent storage. IDEA-0068's separate test redesign remains staged. No additional implementation is launched here. |

## Risks and blockers

Broader provider/credential work requires accepted secure credential storage and platform/service boundary decisions.
