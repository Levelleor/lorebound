---
type: architecture-decision
status: accepted
decision_id: "B5-D03"
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

# B5-D03 — Atomic automatic Quick Start first-turn acceptance

## Approval and provenance

**Explicit approval, 2026-10-28:** “Review B5 Batch 1: B5-D01: A; B5-D02: A; B5-D03: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B5 review.”

This accepts **B5-D03 Option A** from [Pass B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), confirming the earlier explicit Quick Start choice in [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md).

## Context

Quick Start asks the player for a short freeform premise and uses the established configured generation strategy and deterministic coordinator. Its successfully completed, validated generated opening is already approved to auto-commit as the first canonical story turn, with supported explicitly grounded world facts. A separate manual approval gate introduced by pending manual edits would contradict that specific exception.

## Accepted decision — Option A

**After the first fully successful Quick Start generation and existing deterministic validation, automatically accept and commit the opening passage and all accepted outcome events/fact extraction together in one atomic transaction—no separate Approve click.**

- **Start point:** An adventure and valid Turn-0 baseline may be durable before generation (B5-D01). Quick Start's brief premise is the input to request an AI opening; Quick Start itself does not require mandatory character/world wizard steps.
- **Provisional generation:** Streaming text, candidate initial events, extracted facts and any attempted AI repair are **noncanonical** until the existing configured generation and validation cycle succeeds. The actor/context/domain checks belong to browser TypeScript S05/S06, not a second Go gameplay engine or independent creative review.
- **Single atomic accepted turn:** Prepare one B3-D01 typed, complete commit envelope containing the schema-versioned current structured opening passage and its ordered typed outcome events, including **only explicitly established, validated supported facts** from the committed opening under B5-D02. Go/SQLite applies it atomically with expected adventure version, server library epoch and global maintenance/write fence.
- **Idempotency and cancellation:** Use B3-D02 durable operation ID/receipt handling to resolve lost success responses; never automatically resubmit a **different** generated first turn under a new identity after uncertain completion. Stop, Retry, a failed model request, interrupted stream, invalidated generation and late/cancelled output cannot silently commit partial prose or effects. A genuinely already committed transaction is not undone simply by later Stop.
- **No new approval screen:** The successful first opening **auto-commits**. Do not route it into the pending manual Commit composer overlay solely because it was generated. The B3-D06/D07 manual correction approval gate, historical edit confirmations and other explicitly player-resolvable pending commits remain unchanged.
- **Recovery:** If Quick Start fails before an accepted first-turn transaction, keep the previously durable baseline and existing accepted canon untouched; show an appropriate recoverable failure/retry path without inventing a story turn. No unapproved alternate-model fallback or auto-generation of a replacement is inferred.
- **Current-only replay:** The accepted opening is the first current story passage/event group after Turn 0, not a retained model-candidate history, text revision lineage or separate event authority. Its accepted events replay deterministically from Turn 0 without rerunning AI.

## Alternatives considered

1. **A — accepted:** Automatically atomic-commit first fully validated Quick Start opening, including corresponding supported grounded facts. Smooth user flow, careful cancellation/idempotency boundary.
2. **B — rejected:** Require separate player approval of every Quick Start opening in the pending overlay. Contradicts explicitly accepted Quick Start exception.
3. **C — rejected:** Persist opening prose before its world events, then fill effects on another turn. Risks accepted narrative/state mismatch and violates atomic commits.

## Deferred details

Precise generation candidate ID, process cancellation timing, optional stopping controls, final response UI transition, extraction batch schema, already-existing first-turn concurrency and test harness coverage remain engineering refinements. No extra AI validation stage, implementation, test pass or promotion of staging documents is authorized.

## Traceability

[B5 review](../Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md), [B5-D01](./B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md), [B5-D02](./B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md), [B3-D02](./B3-D02%20-%20Idempotent%20Canonical%20Commit%20Attempts.md), [B3-D07](./B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md); [IDEA-0006](../../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md). Owners S02/S05/S06/S07/S09/S12.

## Decision history

- **2026-10-28 — Proposed, unapproved:** B5-D03 A automatic atomic first-turn Commit following validation; B require universal manual approval; C commit prose and events separately.
- **2026-10-28 — Explicit approval:** User accepted **B5-D03: A**, independently of the D01 and D02 A choices. Does not approve later B5 decisions, runtime implementation or integration results.
