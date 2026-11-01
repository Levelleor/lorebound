---
type: architecture-decision
status: accepted
decision_id: "B9-D02"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 1 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - cross-module
  - runtime-contract
  - architecture-decision
---

# B9-D02 — TypeScript prepares typed assertions; Go validates technical contracts and commits atomically

## Explicit approval

**2026-10-31 user message:** “Review B9 Batch 1: B9-D01: A; B9-D02: A; B9-D03: B. Notes: for D01 I don't think the distinction between player-authored and ai-authored should be accounted for. just store the credentials. For D03 we will have mocked tests for all parts of the app, we will not have scenario tests where AI model is acutally launched which is why I chose B. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B9.”

This selects **B9-D02 Option A** as proposed in the [B9 review](../Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md). D01 was A **with a qualification removing player/AI origin labels**, and D03 was **B**, not recommended A. Neither modifies the D02 runtime authority boundary or authorises implementation.

## Accepted Option A

1. **Browser TypeScript owns application-side interpretation, preparation and deterministic projection.** It assembles grounded declarative event candidates and validated domain payloads, resolves stable IDs in private contexts, composes spatial local frames, and projects current items, location canvas, region boundaries, route graph and status from accepted ordered current events. It does not grant UI render caches authoritative storage status.
2. **Go is technical durable-commit authority.** At the narrow browser-to-Go service/IPC boundary, independently validate the supported typed event envelope, schema/version, required core payload shape and identity coherence, expected adventure version, library epoch, operation identifier/idempotent receipt and transaction boundaries. Go/SQLite **atomically commits** only supported accepted event/history/spatial facts. Go does **not** interpret narrative causality, simulate fictional route/ownership/legal move prerequisites or invent world facts.
3. **New-location atomicity preserved:** Under [B8-D09](./B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md), the accepted location identity, event and generated first map coordinate must commit **together in one atomic idempotent batch**. The system-generated default placement does not require a separate player prompt; later deliberate map-pin edits use explicit pending Commit/Discard.
4. **Map and graph stay distinct:** Semantic placed coordinates/group extents are versioned current world data, while the visible canvas and keyed route graph are disposable derived read projections. Mutable borders are separate from parent/child containment, and automatically generated map positions do not fabricate travel edges/costs. Under [B9-D01 A as qualified](./B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md), no per-coordinate AI-vs-player author identity field is required.
5. **Narrator privacy and optional candidates:** Internal IDs remain out of prose-generating prompts; uncertain optional automatic candidate assertions are silently omitted under B7-D03 C, but genuine technical/schema/transaction errors remain explicit and fail safe. No mandatory second model inference step.
6. **Current-only history and migrations:** Honor the accepted ordered current passage/events without old revision archive, independent fork prefixes, historical undo/remove suffix rules and fenced coordinated meaning-preserving schema migrations. Technical Go/SQLite failures must never result in partial committed state.
7. **Runtime API and tests deferred:** Exact IPC signatures/transport error cases, real DB schema, Go validation implementation and runtime checks are not selected or claimed implemented. [B9-D03 B](./B9-D03%20-%20Mock Based Component Verification Without Live AI Scenarios.md) defines the user's separate **mocked testing strategy**, not proof that real host integration has already been exercised.

## Original options

- **A — accepted:** TypeScript prepared typed current-world operations/projections plus Go technical verification and atomic SQLite write authority.
- **B — not selected:** Independent authoritative canvas database outside ordered canonical history.
- **C — not selected:** Go as a procedural roleplay simulation engine that rejects accepted narration for fictional precondition gaps.

## Deferred engineering contracts

Exact typed IPC request/response, all-or-nothing story/event save methods, mutation scopes, schema migration handling, JS/Go parity, SQLite structure, error representation, concurrency and actual code. No stage promotion, runtime implementation or B9 closure approved.

## Decision history

- **2026-10-28–31:** B1/B3/B4/B6/B7/B8 accepted TypeScript replay, Go/SQLite atomic commit and narrative-first facts.
- **2026-10-31:** B9-D02 A/B/C proposed as unapproved alternatives, A recommended.
- **2026-10-31:** User explicitly approved **D02 A**, alongside **D01 A qualified (no player/AI author labels)** and **D03 B (mock-only, no live AI test scenarios)**; no other B9 option accepted.
