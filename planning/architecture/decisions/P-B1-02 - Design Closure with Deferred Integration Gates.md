---
type: architecture-decision
status: accepted
decision_id: "P-B1-02"
created: "2026-10-25"
updated: "2026-10-25"
approved_at: "2026-10-25"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
---

# P-B1-02 — Close B1 design with mandatory later integration tests

## Approval and provenance

**Accepted by the requesting user on 2026-10-25:** "2 A", referring to the **first/recommended choice** for B1 closure in the [B1 Feasibility Evidence and Closure Review](../Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md) and the immediately preceding discussion: **close B1 at the design level, carrying actual integration smoke tests forward as mandatory implementation and release verification gates**. The second choice, to keep B1 open until runnable prototype tests pass, was not selected.

This is a **planning milestone choice**, not a representation that the system works.

## Context

B1-D01–D06 have explicit human approval and ADRs. Research found documented support for Wails v3 server mode and conditional provider browser connectivity. An isolated SQLite mechanism exercise passed 11 checks. The review did not have a compatible Wails build environment, running connected providers, real browser/Go integration or a complete security assessment. P-B1-01 independently resolved the initial plugin trust model.

## Accepted decision

**Formally close Pass B1 as an architectural-design phase, not as an implemented/fully tested technical system.**

- Carry F-B1-01 through F-B1-05 and the relevant selected trusted-plugin controls under F-B1-06 as **mandatory integrated verification items**. They cannot be silently declared passed or removed when planning implementation or release.
- A feasible design assessment is sufficient to proceed to **Pass B2/B3 detailed architecture and interface decisions**, without constructing a running prototype before those design conversations.
- Verification after implementation must demonstrate real Wails server builds/bindings, supported provider CORS/auth/streaming and graceful failures, localhost request filtering and residual-risk documentation, Go multi-tab concurrency/epoch checks, and full-library SQLite maintenance/backup/restore.
- Any failed feasibility gate that materially contradicts the accepted runtime, provider transport or safety approach must return for **explicit user design/scope review**, not an unapproved silent runtime substitution, model proxy, login system or authentication layer.
- The earlier isolated SQLite exercise and upstream documentation are **supporting evidence only**, not integrated-product proof.
- Individual staging notes retain their existing status; B1 sign-off is **not** implementation approval, a production promotion or a claim of verified behaviour.

## Alternatives considered

- **First/recommended option, accepted:** Design-only B1 closure with visible mandatory integrated smoke gates before claiming implementation/release readiness.
- **Alternative, not selected:** Keep B1 open until a runnable cross-platform/provider prototype demonstrates all major integrations.

## Consequences and open engineering details

- Allows subsequent architecture design to proceed while controlling integration risk explicitly.
- Introduces no new features or independent AI validation stages.
- Residual risks include Wails beta stability, browser/CORS/credential exposure, hostile local clients, portability of SQLite maintenance/restore, and trusted installed executable plugins.
- Actual owners, environment, Go/Wails versions, provider test credentials, automated tests and release checklist are engineering planning tasks. They must be decided and verified before corresponding functionality is accepted as implemented.

## Traceability

[Pass B1 Architecture Foundations](../Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md); [B1 Feasibility Evidence and Closure Review](../Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md); B1-D01–D06; P-B1-01; staging IDEA-0012/0013/0014/0039/0044/0051/0052/0053/0055.

## Decision history

- **2026-10-25, proposal:** B1 feasibility review offered design closure with mandatory deferred integration checks versus requiring runnable proof before closing the design phase.
- **2026-10-25, approved:** User replied "2 A", selecting design-level closure with deferred mandatory smoke tests. No live integration tests were conducted as a result of this approval.
