---
type: architecture-decision
status: accepted
decision_id: "B5-D05"
phase: "B5"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - initialization
  - architecture-decision
---

# B5-D05 — Preserve durable starting state when optional setup fails or is cancelled

## Approval and provenance

**Explicit approval, 2026-10-28:** “Review B5 Batch 2: B5-D04: A; B5-D05: A; B5-D06: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B5 review.”

This accepts **B5-D05 Option A**, independently of D04 and D06. Original options and their recommendation remain in [B5 Batch 2 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md). It does not approve implementation or blanket startup recovery details.

## Context

[B5-D01](./B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md) creates a valid saved adventure independently of successful AI generation. Quick Start creates a validated opening and events atomically only after completion. Optional starting Lorebook generation similarly has a provisional candidate until the player approves it under [B5-D04](./B5-D04%20-%20Approved%20Optional%20AI%20Starting%20Lorebook.md).

## Accepted decision — Option A

**Failed, cancelled, interrupted or invalid optional world setup/first-scene generation does not delete or corrupt the already accepted adventure. Discard only the unsuccessful operation's provisional changes and preserve all previously durable, accepted starting material.**

- Preserve the adventure identity, valid minimal Turn-0 baseline, any earlier approved starting world/Lorebook and any already accepted story turns. A failed optional model request does **not** automatically delete the new adventure or revert separate earlier successful commits.
- **Provisional AI failure:** Failed, stopped or invalid generation results cannot become canonical prose, entities, relationships or events. Discard the *failed operation's* incomplete/provisional output, while leaving other independent accepted content untouched. Provide a retry path or allow continuation using blank/custom starting play as applicable; no mandatory model retry or provider fallback.
- **Never partial commit:** A first-turn generated passage and its accepted events, or an approved starting Lorebook's coherent record group, must become canonical together in the already accepted Go/SQLite atomic boundary. No first-scene prose-only or partial world-record acceptance on a failed workflow.
- **Cancelled/late output:** A stopped/cancelled generation may still run remotely, but late output must not be accepted as a *new* canonical operation. If a prior Go commit might already have completed before Stop or a response was lost, resolve the original durable operation ID/receipt before declaring it uncommitted or offering a different retry. Cancellation **cannot undo** an already durable accepted commit.
- **Distinguish pending player review:** A **completed** AI-created starting Lorebook under B5-D04 awaiting explicit approval is a pending proposal, **not a failed generation**. Do not interpret this D05 rule as permission to discard all completed pending proposals; approved D07 overlay and error rules apply until Approve/Discard or an applicable later policy resolves them.
- **Scope:** Blank Custom Opening remains valid. Nothing here adds mandatory setup, AI worldbuilding, alternate-model fallback, automatic partial recovery, or application-level past passage revisions.

## Alternatives considered

1. **A — accepted:** Preserve baseline and earlier accepted material; abandon only failed operation's provisional data; safe retry or continued blank/custom play.
2. **B — rejected:** Delete the whole new adventure after any optional generation failure, losing accepted setup.
3. **C — rejected:** Commit incomplete generated material, risking invalid current canon.

## Deferred details

Exact error display, generation operation state machine, Stop/Retry timing, partially completed *unaccepted* multi-stage generation, in-flight cancellation vs durable result checks, and recovery after app closure remain implementation or further design work. No executable integration tests were run.

## Traceability

[B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [B5-D01](./B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md), [B5-D03](./B5-D03%20-%20Atomic%20Automatic%20Quick%20Start%20Opening.md), [B5-D04](./B5-D04%20-%20Approved%20Optional%20AI%20Starting%20Lorebook.md), [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md). Owners S02/S05/S06/S07/S12.

## Decision history

- **2026-10-28 — Unapproved proposal:** D05 A preserve baseline and discard failed provisional operation; B delete whole new adventure; C commit partial output.
- **2026-10-28 — Explicit approval:** User selected **B5-D05 A**, alongside separately accepted B5-D04 A and B5-D06 A. No other B5 proposals or implementation approved.
