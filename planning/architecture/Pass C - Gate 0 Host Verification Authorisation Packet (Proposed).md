---
type: architecture
status: proposed-for-explicit-approval
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
tags:
  - planning/architecture
  - pass-c
  - implementation-readiness
---

# Pass C — Gate 0 host verification and final-product development authorisation (PROPOSED)

> **NOT APPROVED.** This is a concise **separate approval request prepared in response to the user's deadline pressure**, not a command to implement. No IDEA promotion, code, testing, live integration evidence, or production/spec status is granted by the authoring of this packet.

## Why this is next, rather than another planning round

The user accepted **[C-D10 A](./decisions/C-D10%20-%20Material%20Blockers%20Only%20Planning%20Stop%20Rule.md)** (only material blockers), **[C-D11 A](./decisions/C-D11%20-%20Reusable%20Production%20Intended%20Real%20Host%20Foundation.md)** (production-intended reusable foundation) and **[C-D12 A](./decisions/C-D12%20-%20Concise%20Go%20No%20Go%20Approval%20and%20Immediate%20Development%20Handoff.md)** (one focused approval and prompt incremental final software). They added: **“I'd like to proceed to closing any dependencies as early as possible and starting actual implementation. Seems like our planning is taking pretty long that deadlines are pressing.”**

**C-D05 C** and **C-D07 A/C-D08 A** require **verified real Wails v3 headless Go/browser and Go-owned SQLite integration before first Story-mode mock/domain acceptance criteria are finalised**. Such verification requires building and running *some real application code*. Therefore, the next shortest permissible step is an **explicit narrow implementation and test authorisation** for that foundation, **not more speculative architecture discussion**.

## Exact existing original staging IDEA candidates

| Original note, currently STAGING | Why implicated | Requested stage action (still unapproved) |
| --- | --- | --- |
| **IDEA-0053** — [Localhost Startup and Offline Mode](../staging/Localhost%20Startup%20and%20Offline%20Mode.md) | Wails v3 headless Go executable, SvelteKit static/client-rendered assets in ordinary browser, protected localhost service exchange | **Explicitly approve original IDEA-0053 staging → production** for implementation readiness, retaining original ID, approved scope and history |
| **IDEA-0051** — [Browser-Persistent Story Database](../staging/Browser-Persistent%20Story%20Database.md) | Go-exclusive SQLite canonical persistence and atomic request/version/epoch/idempotency boundary | **Explicitly approve original IDEA-0051 staging → production** for implementation readiness, retaining original ID, approved scope and history |

These are **only the two immediate candidates for the foundational host/storage gate**, not a blanket promotion of the other 50 staged ideas. Their broader accepted scopes stay recorded and are not magically implemented by a minimal first slice. Further original idea promotions require their own later explicit approvals.

## Exactly what development authority is being requested

**Gate 0 implementation authorisation, separate from the two individual IDEA promotions:** Write the **smallest production-intended application foundation** in Lorebound's implementation code and run its **actual** technical checks:

1. Start a real Wails v3 headless Go service on intended loopback binding; serve/build/connect a minimal real SvelteKit ordinary-browser client; send one **narrow typed technical request and response**. Capture build/start command, versions, origin/loopback restrictions, result and any failures. This is not a Go model proxy, authentication UI, gameplay loop or a native WebView implementation.
2. Open an isolated, disposable Go-owned SQLite database; execute one minimum supported **versioned and idempotent atomic write**, read it back, deliberately fail a transaction and confirm **no partial persisted change**, close/reopen the database or host and confirm durability. Preserve expected-version/library-epoch/operation-ID safety where applicable. Do **not** touch a user's actual adventure library.
3. Report observed evidence **PASS / FAIL / NOT RUN** separately for browser-to-Go exchange, SQLite commit/readback, failed-transaction rollback and reopen persistence. No mock claim substitutes for real host evidence.
4. Keep source architecture compatible with later accepted TypeScript story coordination, direct browser AI provider calls and one Go-owned canonical SQLite database. **Do no B9-D12 spatial event/schema migration design or execution.**
5. Stop the Gate 0 scope as soon as real prerequisite evidence is sufficient or a material blocker is identified. No mandatory live AI model, map, lore, inventory, packaging suite, schema migration, whole-library backup or all-features implementation in this first gate.

**If authorised**, the real host foundation is intended to remain as the first part of the final software, not an automatically disposable prototype ([C-D11 A](./decisions/C-D11%20-%20Reusable%20Production%20Intended%20Real%20Host%20Foundation.md)).

## One focused approval request, three independent permissions

Human approval must **explicitly** name each of:

1. **Approve IDEA-0053** for original staging → production promotion, preserving its note/history.
2. **Approve IDEA-0051** for original staging → production promotion, preserving its note/history.
3. **Authorise Gate 0 source implementation and real test execution** within the narrow scope above, using production-intended work and documenting genuine outcomes.

Unless all necessary authorisations are given, remain in planning without a source change or unauthorised idea move. This document records **none of those approvals yet**. Partial answers are not inferred as full approvals.

## Immediate next step after genuine Gate 0 evidence

If actual host and SQLite checks pass, bring **one concise second approval packet** for the first Story-mode complete current-history turn ([C-D01 A](./decisions/C-D01%20-%20First%20Mock%20Driven%20End%20to%20End%20Story%20Turn%20Slice.md), [C-D04 A](./decisions/C-D04%20-%20Story%20Mode%20First%20Complete%20Turn.md), [C-D06 A](./decisions/C-D06%20-%20Minimal%20Versioned%20Accepted%20Story%20History%20Payload.md)) with only the specific additional staging IDEA promotions needed. Define its detailed mock/domain acceptance criteria after C-D05's real-host proof, per C-D03. If checks fail, identify the smallest critical blocker, correct it within separately authorised scope, and recheck. **No further comprehensive design pass is required by default.**

## Status and history

- **2026-11-01:** C-D10, C-D11, C-D12 **Option A accepted**; user pressed for early dependency closure and prompt actual final-product implementation.
- **2026-11-01:** This proposed **Gate 0 readiness packet** was drafted as documentation, **without** executing implementation/testing or promoting IDEA-0053/0051. Existing 52 accepted staging ideas remain in staging. B9-D12 remains deferred with no spatial migration work.
