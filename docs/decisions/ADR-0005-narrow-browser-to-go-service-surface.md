---
id: ADR-0005
type: adr
status: accepted
related:
- ADR-0003
- PRD-0006
- PRD-0015
- PRD-0052
- PRD-0053
- PRD-0054
- PRD-0062
supersedes: []
---

# Narrow Browser-to-Go Service Surface

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B1-D05](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B1-D05%20-%20Narrow%20Browser-to-Go%20Service%20Surface.md) · approved at: 2026-10-25; approved by: requesting user (explicit chat approval)

## Decision status and provenance

**Accepted by the requesting user on 2026-10-25**, in the explicit second Pass B1 decision batch ("B1-D05: accept", followed by "Agreed on all"). Original proposal: [Pass B1 Architecture Foundations review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md). This is a design-boundary approval only.

## Context

The selected Lorebound runtime runs the UI, coordinator, gameplay domain and AI provider connections in browser TypeScript, while a single loopback-only Wails v3 headless Go host manages SQLite, filesystem operations, full-library maintenance and saved credentials. Exposing arbitrary privileged services makes unintended mutation and needless authority harder to constrain.

## Accepted decision

**Expose a narrow, task-oriented set of browser-to-Go service operations**, sufficient for the accepted application workflows.

- Prefer clear service operations covering adventure/library reads, prepared canonical commits, separate draft saves, whole-library backup/restore, native host lifecycle and saved-credential handling.
- Do **not** expose generic arbitrary SQL execution, unrestricted filesystem-path access or general script execution to the browser as the normal app service interface.
- Service operations should be coarse-grained enough to represent meaningful atomic work. In particular, a canonical prose+history+state write is not split into independently successful public writes, and Go controls the complete Backup/Restore maintenance fence.
- The Go interface enforces storage shapes, atomicity, expected versions, library epoch and operational fencing under the accepted [B1-D03](ADR-0003-gameplay-and-durable-commit-authority.md) boundary. It must not duplicate TypeScript fiction/gameplay validation.
- Browser model-provider HTTP traffic stays direct. **No Go inference proxy** is introduced. Persistent provider secrets stay in the OS vault or consented encrypted sidecar; active browser copies remain memory-only under accepted A-04/A-27 constraints.
- A narrower surface **does not itself authenticate a hostile local process**. The initial iteration still has no Lorebound login/session-authentication feature, and any risk reduction is not a verified hostile-client security guarantee.

## Alternatives considered

1. **Accepted:** Small, task-oriented operations with explicit contracts and storage-level validation.
2. **Not chosen:** Generic SQL/filesystem/script operations exposed to the browser. This needlessly expands privilege and bypass opportunities.
3. **Not chosen:** One catch-all monolithic service endpoint concealing unrelated behaviours.

## Consequences and limits

- **Benefits:** clear ownership of privileged operations, easier auditability and integration testing, fewer accidental access paths.
- **Cost:** new privileged workflows need explicitly designed service operations; contract maintenance is necessary.
- **Not newly decided:** number of service methods, concrete Wails binding and API shapes, request filtering details, per-operation schemas, file-picker implementation, permission model for malicious plugins or new application authentication.
- **No implementation or security assessment is claimed.**

## Traceability

Logical owners S01, S02, S08, S12; accepted staging directions IDEA-0005, IDEA-0014, IDEA-0051, IDEA-0052, IDEA-0053 and IDEA-0061. Pass A audit A-04, A-22, A-24, A-25 and A-27. [Consolidated architecture](../knowledge/inbox/NOTE-0005-architecture-design-evidence-and-unresolved-contracts.md).

## Decision history

- **2026-10-24:** B1-D05 proposed in Pass B1 draft, unapproved.
- **2026-10-25:** Requesting user explicitly accepted B1-D05 without modification. This ADR records only that decision.
