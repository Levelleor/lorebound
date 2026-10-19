---
id: "IDEA-0013"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-18"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Local LLM Server Connections

## Idea
Connect to Ollama, LM Studio, vLLM, **llama.cpp (llama-server)**, and manually configured local/network model servers.

## Why this idea matters
One locally served model must be sufficient for play.

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

## Proposed behaviour
Expose a local-server profile selector including **Ollama, LM Studio, vLLM, llama.cpp**, and Custom. Allow configuration of endpoint/base URL, model ID and optional headers/authentication. Prefer a shared compatible-API transport where appropriate, but handle each supported server's real path, model discovery, streaming and capability peculiarities as needed. For llama.cpp, support the `llama-server` workflow (for example `http://127.0.0.1:8080/v1` by default) using compatible chat-completions when available. Provide a connection test and helpful error messages. Local inference must work without a cloud provider account.

## Alternatives and trade-offs
Accept connecting to externally hosted local models now; an integrated model manager or downloader may be considered separately later. Generic compatible-endpoint mode complements, but does **not** replace the explicit support requirement for llama.cpp and the other named servers. The exact adapter reuse and UI defaults remain for refinement.

## Architecture integration (2026-10-17)
- **Accepted browser-only HTTP transport (IDEA-0012 Option B, 2026-10-18):** All AI HTTP requests to Ollama, LM Studio, vLLM, llama.cpp and custom local/LAN servers originate **directly from browser-side TypeScript**. Standard browser requests work only when CORS/allowed origins and browser private-network/mixed-content policies permit the call. **No native Go, Node or embedded loopback AI proxy workaround is part of the accepted design**; a separately configured browser-compatible endpoint or gateway is the player option.
- Go/SQLite is used for adventure persistence, not model inference. Local model servers remain separately installed and configured.

## All named local servers remain accepted under direct browser networking
- **Explicit user decision (2026-10-18):** Retain direct integrations for **Ollama, LM Studio, vLLM and llama.cpp/llama-server**, plus compatible custom local or explicitly configured network model endpoints. Reducing the cloud provider list to four does **not** remove or demote any named local server.
- **Browser-only API requests:** Model discovery, connection tests, generation and response streaming use frontend TypeScript HTTP calls **directly to the selected server or user-supplied browser-compatible gateway**, never an automatic Wails/Go or Node proxy. The frontend and coordinator stay in the ordinary browser; Go continues to own persistence, not model networking.
- **Origin and private-network constraints:** Local servers must support the normal browser security model. The server may need an explicit **CORS origin allowlist/configuration** for Lorebound's running localhost URL, plus appropriate allowed headers, streaming and browser network permissions. Because Lorebound's preferred loopback port can fall back, do not rely on a single assumed fixed origin. A valid model endpoint may still be unusable if it blocks the current origin. Expose actionable errors/configuration guidance rather than bypassing restrictions or pretending the request succeeded.
- **No requirement to distribute, start or reconfigure model servers automatically:** Local installations and safe endpoint configuration remain the user's responsibility. Compatible custom gateways are allowed but must be deliberately configured and trusted by the user; don't silently send credentials or prompts to a third-party proxy.

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

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. Original user direction explicitly expanded at acceptance to require llama.cpp.
- Accepted for **staging/refinement**; compatibility tests, implementation and production approval remain outstanding.

## Decisions and review history
- 2026-10-18 — **User accepted direct browser networking and retained all local model servers:** Ollama, LM Studio, vLLM, llama.cpp/llama-server and compatible custom endpoints remain in scope. AI calls originate solely in frontend browser TypeScript, so CORS, permitted headers and private-network/mixed-content restrictions may block a local endpoint; the player may configure their server or an explicitly chosen browser-compatible gateway. No Go/Node transport bridge or automatic workaround. Staging only.
- 2026-10-17 — **Runtime dependency correction:** IDEA-0053 now selects Wails v3 headless localhost Go server **only**, served to the normal browser by a Windows/macOS/Linux executable. No separate native desktop WebView or npm player runtime. Docker is a distinct unaccepted candidate (IDEA-0065). No further feature approval is implied.
- 2026-10-17 — Cross-reference alignment with accepted Wails v3 desktop/headless server + client TypeScript game logic + Go/SQLite persistence (IDEA-0053/0051). This note remains staging and has not received independent production approval.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicit acceptance with clarification from the requesting user:** "yes, note that we want to make sure that llamacpp is supported". Accepted local server support including **Ollama, LM Studio, vLLM, llama.cpp (`llama-server`)**, configurable compatible endpoints, one-model sufficiency, connection profiles, optional discovery/streaming and clear errors; integrated model download is not required. Advanced details remain to be refined before separate production approval.
