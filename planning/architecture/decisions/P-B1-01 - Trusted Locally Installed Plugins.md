---
type: architecture-decision
status: accepted
decision_id: "P-B1-01"
created: "2026-10-25"
updated: "2026-10-25"
approved_at: "2026-10-25"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
---

# P-B1-01 — Trusted locally installed plugins

## Approval and provenance

**Accepted by the requesting user on 2026-10-25:** "1 A", referring to **option A** of the plugin trust question in the [B1 Feasibility Evidence and Closure Review](../Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md). The requesting user had already approved B1-D01–D06. This ADR records an initial plugin-trust **architecture policy**, not approval of a particular plugin feature for production or software implementation.

## Context

Accepted staging IDEA-0047 and IDEA-0055 provide a common typed capability registry and optional gameplay mechanics. In the chosen same-origin browser TypeScript application, registering capability permissions is **not a JavaScript sandbox**. An installed extension running as trusted app code may access in-memory data and application facilities, including sensitive direct-provider tokens, if malicious or compromised.

## Accepted decision

**Initially treat locally installed executable plugins as trusted application extensions, not hostile third-party scripts.**

- Only enable third-party executable plugin code after explicit player acknowledgement/trust; do not silently load unknown remote plugin code or pretend typed registry permissions isolate arbitrary JavaScript execution.
- Document the risk: a malicious or compromised plugin may access the browser execution context, direct-provider secrets held temporarily in memory and local application services. Registry permissions constrain **the intended gameplay capability pathway** but do not prove isolation of malicious same-origin JavaScript.
- Keep installed/native plugins within the existing S06 capability registration, domain-validation and event/history framework; do not create a second gameplay authority, a separate plugin-owned canonical store, MCP connectivity, an application login system or a Go model transport proxy.
- Sandboxed execution of untrusted plugins is **not part of the initial approved architecture**. A future untrusted-plugin security boundary requires a separate reviewed decision and architecture/testing work.
- Preserve the previously accepted plugin removal policy: disabling/removing a plugin stops its rule/context contributions; no mandatory migration or reconstitution of its historical custom state.

## Alternatives considered

- **A, accepted:** Trusted locally installed extensions with explicit acknowledgement and risk disclosure.
- **B, not selected:** Sandbox untrusted third-party plugins from the beginning, requiring an additional isolation and mediation architecture.
- **C, not selected as a blanket policy:** Initially restrict executable extension loading to bundled mechanics only. Individual implementation sequencing remains a later planning/approval issue; choosing A does not mandate that every plugin-loading feature ships in the first vertical slice.

## Consequences and open engineering details

- Simpler initial extension integration, at the cost of a real supply-chain/code-trust risk.
- Later engineering must decide exactly how installation, enablement, author identification, updates and revocation obtain informed user trust; **do not invent specific UX or trust-verification guarantees here**.
- The current architecture **does not guarantee protection** against a hostile installed plugin or arbitrary hostile local process.
- Provider secrets must still remain out of application logs, browser persistent storage and SQLite under A-04/A-27.
- A trusted-code decision is **not** an implemented plugin sandbox, security audit or launch approval.

## Traceability

Related subsystems S06, S07, S08, S01. Accepted idea sources: IDEA-0047, IDEA-0055, IDEA-0014, IDEA-0053. Decisions: B1-D01–D05, A-10, A-27, A-28.

## Decision history

- **2026-10-25, proposal:** The B1 feasibility review documented options A/B/C and recommended A when locally installed modifications matter early.
- **2026-10-25, approved:** User replied "1 A", expressly selecting trusted locally installed plugins. No sandbox, implementation, staging promotion or external MCP feature is approved by this choice.
