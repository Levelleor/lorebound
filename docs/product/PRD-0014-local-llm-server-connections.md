---
id: PRD-0014
type: prd
status: accepted
related:
- NOTE-0028
- PRD-0001
- NOTE-0010
- NOTE-0011
---

# Local LLM Server Connections

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0013](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Local%20LLM%20Server%20Connections.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S08**. First milestone: **M3**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-004A R01–R03](../work/items/STORY-0024-direct-browser-local-story-narration.md) merged; [DEV-004B R04](../work/items/STORY-0025-provisional-local-story-streaming.md) streaming verified on confirmed PR #22 merge; [DEV-004E R05–R07](../work/items/STORY-0028-native-ollama-story-connections.md) native Ollama verified only on confirmed PR #25 merge; live verification remains open in INC-001; broader scope remains later; [DEV-004F R08–R10](../work/items/STORY-0029-named-lm-studio-and-vllm-story-connections.md) verified only on confirmed PR #26 merge; live-server gap INC-004
- Evidence: [PR #21](https://github.com/Levelleor/lorebound/pull/21), confirmed merged

## Accepted direction
- **Explicitly support Ollama, LM Studio, vLLM, and llama.cpp** via their local model-serving endpoints. llama.cpp's `llama-server` is a named supported target, **not** merely an assumed generic compatibility case.
- Also accept user-configured compatible model servers at `localhost` or explicitly selected private-network endpoints.
- **One-model sufficiency:** Core narration, context-related generation and enabled story/state tasks must function with a single active locally served model; no multiple concurrently loaded models are required.
- **Connection profiles:** A player can configure server type, base URL, model identifier and, where needed, optional authentication or custom request headers.
- **Optional model discovery:** List available models when an endpoint supports discovery; always allow manual model ID entry when discovery is absent or unreliable.
- **Text generation and supported streaming:** Use the same internal generation interface as cloud providers, adapting differences between local server protocols and available model features.
- **Clear connection feedback:** Detect/report unreachable servers, invalid endpoints, unavailable models, unsupported parameters, timeouts and streaming errors without falsely accepting partial turns or state changes.
- **Local-first and safe defaults:** A filesystem-SQLite-backed adventure using an independently running local inference server should not require cloud requests. Lorebound must not automatically expose model servers to the public Internet.
- **No built-in downloader required:** Integration with already-running external inference servers is accepted. Automatic model download/installation is a separate optional idea, not a prerequisite here.

**llama.cpp compatibility reference:** The official [llama.cpp `llama-server` documentation](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md) documents OpenAI-compatible `/v1/chat/completions`, `/v1/models`, and streaming; default listening address is `127.0.0.1:8080`. Compatibility must be validated in practice, including its own chat-template/model-dependent features, rather than assumed universally identical to OpenAI.

## Dependencies and constraints
- **CORS is an explicit configuration/deployment constraint:** A local server that does not permit Lorebound's current browser origin (including dynamically selected localhost ports), headers or private-network access is **unavailable for direct browser use** until configured appropriately, or replaced by a user-configured browser-compatible gateway. Do not automatically route its requests through Go or introduce an optional localhost bridge.
- A user-configured LAN server must be reached explicitly rather than discovered or exposed publicly without consent.
- Model capabilities such as prompt/chat templates, tool calling, context limits, sampling, JSON output, and token limits vary by server and loaded model.
- A simple local model must be sufficient for gameplay without spawning separate models for memory, state extraction or narration.
- Avoid storing secret request headers in adventure exports; keep credentials outside story data.
- Failed, disconnected or cancelled local generations must not silently commit invalid narrative/world-state events.
- API-compatible transport does not guarantee full interoperability: confirm tested llama.cpp endpoints and streaming semantics in refinement.

## Open questions
- Which server transports and request formats need dedicated adapters, and which can share compatible API code?
- How should Ollama's native and compatible endpoints be selected?
- Does llama.cpp require any explicit profile settings for aliases, chat templates or its `/completion` endpoint as a fallback?
- **Resolved architectural boundary:** Browser-origin requests only, with no Go/Node proxy. Which server-specific CORS settings, origin allowlists, HTTPS/private-network permissions and diagnostics let players securely use each of the four accepted local servers?
- Which capability probes and connection tests are reliable across local servers?
- How are model/context changes surfaced if the local server unloads or switches models mid-adventure?

## Draft acceptance criteria
- [ ] Ollama, LM Studio, vLLM and llama.cpp/llama-server remain named supported local targets and work through browser HTTP when configured to allow the required current origin/headers/network permissions.
- [ ] If a local/LAN model server blocks direct browser requests, show a clear recoverable error or guidance for server CORS/gateway configuration, **without** a Go/Node transport fallback.
- [ ] Users can configure and connect to **Ollama, LM Studio, vLLM, and llama.cpp `llama-server`**, as well as custom compatible local/network endpoints.
- [ ] The llama.cpp profile can connect to a supported `llama-server`, select or enter a model ID, generate text and stream when supported by the server/model.
- [ ] Model discovery is offered when available, without preventing manual model selection when discovery fails.
- [ ] A single locally running model can serve core gameplay tasks without requiring cloud providers or additional concurrently loaded models.
- [ ] Endpoint, optional authentication/headers and relevant connection settings can be saved in profiles without exporting secrets.
- [ ] Unreachable servers, invalid models, unsupported features and interrupted streams produce actionable errors and do not commit incomplete state.
- [ ] No model downloader or publicly exposed model server is required to use a configured local endpoint.

## Supporting detail

See [NOTE-0028](../knowledge/inbox/NOTE-0028-prd-0014-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
