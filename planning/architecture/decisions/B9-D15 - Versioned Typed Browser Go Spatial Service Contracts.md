---
type: architecture-decision
status: accepted
decision_id: "B9-D15"
phase: "B9"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B9 Batch 5 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - spatial-runtime-contracts
---

# B9-D15 — Explicit versioned typed browser-to-Go spatial service contracts

## Approval

**2026-10-31 explicit user instruction:** “Review B9 Batch 5: B9-D13: defer; B9-D14: A; B9-D15: A. Additional conditions: For d13, more Info. I just want the coordinator to handle that. Whatever it decides happens but we try to make it as good as possible. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, keep B9-D12 deferred without migration work, and continue B9.”

**ACCEPTED: Option A.** Use one versioned typed cross-runtime request/result contract for browser-prepared spatial/canonical changes and Go storage services. Perform runtime *technical* checks in TypeScript and Go, with expected adventure version, library epoch, idempotent operation identity and typed technical error responses. The accepted [B1-D05 narrow Go API](./B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) and [B9-D02 TypeScript/Go authority split](./B9-D02%20-%20TypeScript%20Prepared%20Events%20and%20Go%20SQLite%20Atomic%20Commit%20Authority.md) still govern; this ADR does not invent a second gameplay engine.

## Accepted boundary

1. **Request and response contracts:** The browser prepares validated typed current event requests with required supported schema version, stable entity/frame references, provenance/current-history linkage, expected adventure version, library epoch and idempotent operation key. Go methods return success with a confirmed commit/version identity or a typed technical failure. Exact field names, serialization and method count are deferred.
2. **Technical checks on both sides:** TypeScript performs supported domain/structural preparation. Go independently checks envelope/schema compatibility, technical values and stable references, expected head/version, epoch, operation-ID safety, maintenance fence and SQLite atomicity. **Go does not interpret narration, rerun models or reject accepted story facts on fictional causality grounds.**
3. **One canonical durable transaction:** New location identity plus initial generated coordinate and any other accepted related spatial assertions use the already accepted atomic/idempotent current-history commit boundary. On technical failure, no partial canonical acceptance; stale clients refetch and revalidate according to existing workflows.
4. **Errors and concurrency:** Represent supported malformed/unsupported schema, stale expected adventure version, stale library epoch, duplicate/conflicting operation ID, maintenance and storage failures as distinguishable technical outcomes. Rejections are never silently treated as successful gameplay acceptance.
5. **Narrow privileged surface:** Neither UI nor map renderer may issue generic arbitrary SQL, filesystem scripts or unversioned raw map writes. Browser model-provider requests remain direct, and this design creates no new app-login system or claim to defend against hostile local processes.
6. **Mock-first B9 tests:** [B9-D03 B](./B9-D03%20-%20Mock%20Based%20Component%20Verification%20Without%20Live%20AI%20Scenarios.md)/[B9-D06 A](./B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) apply to success/error/retry/Undo/Fork fixtures with simulated browser-Go responses. Mock success is not verified live Wails/SQLite execution.
7. **No migration approval:** **B9-D12 is expressly deferred and no spatial migration work is authorised.** Versioned interfaces do not authorise implementing spatial schema upgrades, migration scripts, tests or restore rewrites. Earlier B4/B7 general schema migration architecture remains historical context, not a new B9 mandate.

## Options and tradeoffs

- **A — ACCEPTED:** Typed versioned cross-runtime contracts and explicit technical error/atomicity boundaries. Additional schema maintenance, reliable authority separation.
- **B — not selected:** UI-owned loose JSON direct map writes without centrally validated technical contracts.
- **C — not selected:** Go independently interprets prose and decides fictional geography/gameplay validity.

## History and outstanding choices

- **2026-10-31:** B1-D03/B1-D05 and B9-D02 accepted browser domain preparation, Go atomic technical acceptance; B9-D03 B and D06 A accepted mocked coverage.
- **2026-10-31:** User explicitly accepted **B9-D15 A** and separately **B9-D14 A**; **D13 deferred** with a nonbinding preference for coordinator-led best-effort conflict handling; **D12 deferred without any spatial migration work**.
- Deferred: actual API signatures, full payload/validator schemas, error enums, transport, UI error presentation, live-host evidence, and any eventual migration. No tests run, code built, staging promoted or B9 formally closed.
