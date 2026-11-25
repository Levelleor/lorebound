---
id: PRD-0020
type: prd
status: accepted
related:
- NOTE-0031
- PRD-0001
- NOTE-0010
- NOTE-0011
---

# Streaming Cancellation and Generation Diagnostics

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0019](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Streaming%20Cancellation%20and%20Generation%20Diagnostics.md) · origin: agent; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S07**. First milestone: **M3**. Delivery: **PARTIAL**.

- Requirement coverage: [DEV-004A R01–R02](../work/items/STORY-0024-direct-browser-local-story-narration.md) merged; [DEV-004B R03–R06](../work/items/STORY-0025-provisional-local-story-streaming.md) streaming merged; [DEV-004D R07–R09](../work/items/STORY-0027-local-generation-diagnostics.md) local diagnostics verified on confirmed PR #24 merge; [DEV-004H](../work/items/STORY-0031-fresh-saved-model-selection-for-generate-retry.md) lifecycle/source freshness verified within scope on confirmed PR #28 merge; broader diagnostics/pipelines remain later
- Evidence: [PR #21](https://github.com/Levelleor/lorebound/pull/21), confirmed merged

## Accepted direction
- **Streaming output:** Display incrementally received narrative prose where the active model/provider supports streaming, instead of always waiting until the full response is complete.
- **Generation cancellation:** Give players a clear Stop action for pending or active requests, including streaming and remaining workflow stages. **Abort direct browser-to-provider requests/streams where possible**, invalidate the attempt so late output cannot commit, and treat tab closure/navigation as abandonment of uncommitted work. Provider processing may continue remotely despite the abort; do not imply guaranteed remote termination.
- **Generation and stage status:** Distinguish request lifecycle states such as waiting, generating/streaming, validating, auditing/repairing (where applicable), completed, cancelled and failed. Multi-stage pipeline status should make clear which phase is active.
- **Inspectable diagnostics:** Expose the active model/provider and connection identification, relevant inference/effective settings, generation errors, token/usage information when available, and per-request/stage timing. Distinguish measured data from unavailable or estimated data.
- **Provisional versus committed text:** Streamed text is an explicitly provisional draft; it is not canonical story prose until the selected generation pipeline finishes required checks and commits it.
- **Discard on cancel, failure, retry or browser closure (user clarification 2026-10-23):** An unfinished request and **all its proposed prose, operations and state changes are invalidated**, never committed, if the player cancels, any required stage fails, Retry supersedes the attempt, or the owning browser tab closes/reloads/disconnects before accepted commit. The browser must attempt to **abort every active direct provider request and stream** for that attempt, stop remaining stages and disregard late packets; no headless Go inference process continues after browser closure. Provider-side work or billing might continue despite abort, but it cannot become canon. Already completed atomic commits are not retroactively canceled: use committed Undo instead. Saved player-input drafts are governed separately by IDEA-0005.
- **Secret redaction:** Diagnostic views, saved logs and exported artifacts must not disclose API credentials, bearer tokens, secret headers, or other sensitive connection information.
- **Single-/multi-model compatibility:** Show statuses and diagnostics for the active task/stage whether configured for one local/cloud model or multiple task-specific models; align with One-Model Task Routing and Configurable Generation Pipeline Strategies.

## Dependencies and constraints
- Requires provider/local server streaming and abort behaviour through accepted Cloud LLM Provider Connectors, Local LLM Server Connections and Provider Connection Profiles and Discovery.
- Pipelines may have multiple stages, retries, or different assigned models (Configurable Generation Pipeline Strategies, One-Model Task Routing); a cancellation should stop or invalidate all remaining work belonging to that generation attempt.
- State/event validation remains authoritative. Provisional stream chunks must never mutate the canonical narrative, inventory, NPCs, locations or other world-state records.
- Providers may not support immediate server-side cancellation; late output must be ignored for the cancelled generation and errors surfaced without corrupting saved state.
- Reporting usage or timing may vary by provider; avoid fabricating token/cost figures when a source does not supply them.
- Diagnostics and error bodies may contain sensitive information; redact keys, tokens, authorization headers and other secret material before display, storage or export.
- Pending changes, interrupted persistence and rollback/recovery need to remain consistent with existing accepted autosave and undo directions.

## Open questions
- How exactly should pending streamed prose be represented and optionally recovered after stopping a request?
- **Resolved 2026-10-23:** Cancellation invalidates the whole uncommitted attempt immediately and aborts active browser HTTP/streaming where supported; no remaining stages or final commit. A provider may finish remotely, but its result is discarded.
- What is the commit boundary for narrative prose and associated validated state events across each generation strategy?
- How should provider billing/usage be communicated when an aborted cloud request continues server-side?
- What diagnostic information should persist across sessions, and for how long?
- How are stage timing, token usage and model attribution aggregated across different models in one generation?
- What interface distinguishes a user-cancelled request, connection failure and a validation-rejected result?

## Draft acceptance criteria
- [ ] Retry supersedes an uncommitted generated candidate, and prior candidates or late provider replies can neither be selected as alternative versions nor commit effects after replacement.
- [ ] The first valid Quick Start generated opening still commits automatically; failed generation remains provisional and does not lose the premise or alter canon.
- [ ] Committed story turns can be reversed only by the distinct canonical Undo operation, not by ordinary uncommitted candidate replacement.
- [ ] A Quick Start failure/cancel/invalid output retains the user's premise on the setup screen and offers Retry or explicit Custom Opening, with actionable error feedback.
- [ ] A failed Quick Start request does not create a blank fallback adventure or commit partial narrative/state; a valid successful opening still commits automatically.
- [ ] A player-authored draft may be overwritten by a later shared autosave on the same target without requiring a conflict popup; **AI streaming preview text** is not thereby automatically autosaved or committed.
- [ ] A supported generation shows prose incrementally without representing interim text as committed story canon.
- [ ] Stop invalidates and aborts every active browser-owned request/stream of the uncommitted generation where supported, stops further stages, and prevents any of its proposed events/prose/state from committing.
- [ ] The interface reports waiting, generation/streaming, validation/repair, completed, cancelled and failed states as applicable.
- [ ] A selected generation's active provider/model and pipeline stage are visible or inspectable.
- [ ] Diagnostics show effective generation settings, actionable errors, observed timing and any provider-reported usage while acknowledging missing data.
- [ ] Failed, stopped, replaced-by-Retry, or tab-closed uncommitted work never commits its provisional prose or associated state/events. A late result is ineligible; only an already-accepted atomic commit is durable and requires Undo to reverse.
- [ ] Late provider responses after cancellation do not become authoritative story content.
- [ ] Credential, auth token and secret header values are redacted from all diagnostics/logging views.
- [ ] The workflow operates with a single model and with configured task-specific models.

## Supporting detail

See [NOTE-0031](../knowledge/inbox/NOTE-0031-prd-0020-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
