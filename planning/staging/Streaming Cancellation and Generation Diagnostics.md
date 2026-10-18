---
id: "IDEA-0019"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[LLM Providers and Generation Brainstorm]]", "[[Local First Storage and Deployment Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Streaming Cancellation and Generation Diagnostics

## Idea
Stream output, cancel requests and inspect inference settings, errors, usage and timing.

## Why this idea matters
Long local inference needs responsive feedback.

## Accepted direction
- **Streaming output:** Display incrementally received narrative prose where the active model/provider supports streaming, instead of always waiting until the full response is complete.
- **Generation cancellation:** Give players a clear way to stop a pending or actively streaming generation request. Handle local and cloud provider cancellation according to their real capabilities, without assuming server-side processing always stops immediately.
- **Generation and stage status:** Distinguish request lifecycle states such as waiting, generating/streaming, validating, auditing/repairing (where applicable), completed, cancelled and failed. Multi-stage pipeline status should make clear which phase is active.
- **Inspectable diagnostics:** Expose the active model/provider and connection identification, relevant inference/effective settings, generation errors, token/usage information when available, and per-request/stage timing. Distinguish measured data from unavailable or estimated data.
- **Provisional versus committed text:** Streamed text is an explicitly provisional draft; it is not canonical story prose until the selected generation pipeline finishes required checks and commits it.
- **Safe cancellation and failure:** Cancelling, losing a connection, or encountering validation/repair failure must not silently persist incomplete prose or proposed world-state events as authoritative, or leave a partially applied state change.
- **Secret redaction:** Diagnostic views, saved logs and exported artifacts must not disclose API credentials, bearer tokens, secret headers, or other sensitive connection information.
- **Single-/multi-model compatibility:** Show statuses and diagnostics for the active task/stage whether configured for one local/cloud model or multiple task-specific models; align with [[One-Model Task Routing]] and [[Configurable Generation Pipeline Strategies]].

## Proposed behaviour
Display streamed output in a visibly provisional region. Report which model and pipeline stage is running, show an accessible Stop action while work is pending, and surface clean success, failure or cancellation outcomes. The coordinator must keep pending narrative and structured state proposals isolated until validation and any accepted repair complete, then commit a coherent narrative/state result. On cancellation or failure, clean up uncommitted proposals and preserve the last committed adventure. Offer a redacted diagnostics view with request parameters, provider/model, stage timing, token usage when reported, and error details. A cancelled provider may still bill or finish working remotely; the app must stop treating that request as active and must not commit its late output.

## Alternatives and trade-offs
The accepted direction favours streaming **provisional** drafts early for responsiveness while ensuring validation precedes any authoritative commit. Waiting for completed validation before showing prose is simpler but provides less feedback for slow local inference. Exact preview treatment (inline provisional text vs separate draft region), recovery/discard options, and diagnostic-retention policy remain to be refined.

## Architecture integration (2026-10-17)
- Streaming generation, status and cancellation run through the shared client-side TypeScript coordinator/provider adapters in the Wails v3 headless localhost server runtime, played through the normal browser, not through a required Node/SvelteKit server.
- Long generations, context retrieval and replay should not block the Svelte interface. Go/SQLite commits only complete accepted outcomes atomically after validation; streamed or cancelled drafts are not automatically authoritative.
- Browser fetch/CORS and optional native transports can differ by provider; preserve truthful cancellation and timing diagnostics across both runtime modes.

## Difference between player drafts and model preview
- IDEA-0005 now accepts debounced SQLite autosaving of **player-authored** pending input/prose edits as noncanonical drafts.
- **Streaming AI output** is likewise provisional but is **not automatically guaranteed to be autosaved** under that decision. A cancelled or failed generation cannot commit partial text/state.
- After failure/cancellation, retain the player's last successfully autosaved input for retry; any optional retention of AI previews needs its own refinement.

## Quick Start opening provisional status
- For AI-generated Quick Start openings (IDEA-0006), streamed text remains visibly **provisional** until all generation stages and deterministic validation succeed. At that point, the engine **automatically commits the opening as the first story turn** with validated initial events, without a separate player confirmation.
- Cancellation, connection failure, incomplete streams and validation failures must not partially persist the opening or world state. Show an appropriate retry/failure state; do not represent incomplete preview tokens as an accepted first turn.
- This rule does not change the **noncanonical autosave of player-written drafts**, nor does it remove explicit confirmation of later historical prose edits.

## Dependencies and constraints
- Requires provider/local server streaming and abort behaviour through accepted [[Cloud LLM Provider Connectors]], [[Local LLM Server Connections]] and [[Provider Connection Profiles and Discovery]].
- Pipelines may have multiple stages, retries, or different assigned models ([[Configurable Generation Pipeline Strategies]], [[One-Model Task Routing]]); a cancellation should stop or invalidate all remaining work belonging to that generation attempt.
- State/event validation remains authoritative. Provisional stream chunks must never mutate the canonical narrative, inventory, NPCs, locations or other world-state records.
- Providers may not support immediate server-side cancellation; late output must be ignored for the cancelled generation and errors surfaced without corrupting saved state.
- Reporting usage or timing may vary by provider; avoid fabricating token/cost figures when a source does not supply them.
- Diagnostics and error bodies may contain sensitive information; redact keys, tokens, authorization headers and other secret material before display, storage or export.
- Pending changes, interrupted persistence and rollback/recovery need to remain consistent with existing accepted autosave and undo directions.

## Open questions
- How exactly should pending streamed prose be represented and optionally recovered after stopping a request?
- Should cancellation mean aborting all pipeline stages immediately, or allowing a stage to finish while discarding pending changes?
- What is the commit boundary for narrative prose and associated validated state events across each generation strategy?
- How should provider billing/usage be communicated when an aborted cloud request continues server-side?
- What diagnostic information should persist across sessions, and for how long?
- How are stage timing, token usage and model attribution aggregated across different models in one generation?
- What interface distinguishes a user-cancelled request, connection failure and a validation-rejected result?

## Draft acceptance criteria
- [ ] A supported generation shows prose incrementally without representing interim text as committed story canon.
- [ ] A user can cancel an in-progress generation, including one running a multi-stage pipeline.
- [ ] The interface reports waiting, generation/streaming, validation/repair, completed, cancelled and failed states as applicable.
- [ ] A selected generation's active provider/model and pipeline stage are visible or inspectable.
- [ ] Diagnostics show effective generation settings, actionable errors, observed timing and any provider-reported usage while acknowledging missing data.
- [ ] Failed or cancelled work cannot commit provisional prose or associated unvalidated world-state effects; previously committed state remains intact.
- [ ] Late provider responses after cancellation do not become authoritative story content.
- [ ] Credential, auth token and secret header values are redacted from all diagnostics/logging views.
- [ ] The workflow operates with a single model and with configured task-specific models.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Originally an assistant-proposed option, subsequently expressly accepted by the requesting user.
- Accepted for **staging/refinement** only; not production-approved or implemented.

## Decisions and review history
- 2026-10-17 — **Accepted IDEA-0006 Quick Start alignment:** Streamed opening is provisional during AI generation and validation; on completed validated success it is **automatically committed as canonical turn one**. Partial/cancelled/failed/invalid opening output cannot be committed. No additional Accept click is required for Quick Start; historical edit confirmation remains separate. Staging unchanged.
- 2026-10-17 — **Cross-idea autosave alignment with explicit user acceptance in IDEA-0005:** SQLite persists noncanonical player drafts after short typing pauses, separate from canonical story revisions and state. Committed turns/revisions and related events remain atomic; failed generation preserves canonical state and the last saved player input. This update does not promote this idea beyond staging.
- 2026-10-17 — **Runtime dependency correction:** IDEA-0053 now selects Wails v3 headless localhost Go server **only**, served to the normal browser by a Windows/macOS/Linux executable. No separate native desktop WebView or npm player runtime. Docker is a distinct unaccepted candidate (IDEA-0065). No further feature approval is implied.
- 2026-10-17 — **Cross-reference update:** Wails v3 desktop/headless Go server, client-side TypeScript gameplay/AI logic and Go-managed filesystem SQLite are accepted architecture dependencies (IDEA-0053/0051). This idea remains in staging; unresolved feature details are not approved by this update.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Streaming output, cancellation, generation and pipeline-stage status, model/settings/errors/usage/timing diagnostics, provisional text before final validation, safe handling of cancelled and failed requests, and secret redaction. Moved to staging for refinement, not to production.
