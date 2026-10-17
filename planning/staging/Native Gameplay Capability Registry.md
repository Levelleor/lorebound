---
id: "IDEA-0047"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Coordinator Tools and MCP Brainstorm]]", "[[Lorebound Vision Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Native Gameplay Capability Registry

## Idea
Let mods register discoverable validated operations against a shared entity/world state.

## Why this idea matters
New mechanics should integrate without teaching every RP model each implementation detail.

## Accepted direction
- **Native, discoverable gameplay capability registry:** Built-in gameplay features and mods can register supported operations in a common registry, so the coordinator and any configured interpreter can discover relevant options rather than hard-code every new mechanic or teach a particular RP model implementation internals.
- **Stable capability identities:** Each registered operation has a stable identifier suitable for dispatch and traceability, distinct from transient model wording. Exact namespace/version format remains open.
- **Typed contracts:** Registered capabilities declare typed input and output schemas, their required arguments/results and meaningful validation failures. The choice of contract format and schema tooling is open.
- **Explicit permissions:** Each capability declares what it may access or change. A registration does not grant unrestricted access to canonical state, external systems, other mods or privileged actions; the permission model and enforcement architecture still need refinement.
- **Validation and preparation:** Provide defined validation and preparation stages so proposed operations can be checked against world rules, available entities and related side effects before a commit. Exact lifecycle/order, conflict checking and staging of effects remain open.
- **Event-producing execution:** Successful native operations produce validated, accepted changes/events affecting the shared authoritative entity and world state; they do not directly replace or maintain conflicting private canonical worlds.
- **Deterministic coordinator authority:** The accepted [[Deterministic Adventure Coordinator]] (IDEA-0044) retains control of dispatch, validation, sequencing and authoritative finalisation. Neither a mod nor an LLM can bypass its world-state integrity rules.
- **Complete incremental reconstructibility:** Every accepted persistent change by a capability must integrate with [[Event-Sourced World History]] (IDEA-0039) and [[Snapshots and Incremental State Rebuild]] (IDEA-0042), allowing complete historical state reconstruction rather than only a few built-in state fields.
- **Native gameplay independent of MCP:** MCP is not the core engine boundary or a prerequisite to registering/executing built-in or native mod capabilities. Optional MCP tool connectivity is addressed by **separate unaccepted** IDEA-0048.
- **Keep lifecycle and security choices open:** Schema evolution, capability compatibility, permission grants/revocation, module isolation/trust, unloading or disabling modules and replaying history after module updates/removal need staging refinement, not premature implementation decisions.

## Proposed behaviour
A gameplay module registers an operation with a stable ID, typed input/output contracts and declared permissions. The coordinator makes permitted capabilities discoverable for player actions and the LLM interpreter's proposed operations; it resolves references, validates state and access, prepares coherent multi-entity effects, and commits event-producing results only when they meet authoritative rules. All accepted changes apply to the same canonical world and are durably represented in complete incremental history. If an operation fails validation or finalisation, no partial irreversible canonical game-state mutation is accepted. Exact transaction/prepare semantics require refinement, especially for plugins or tools with external side effects.

## Alternatives and trade-offs
Hard-coding every gameplay operation in the core may simplify the first implementation but makes modular mechanics and mod integration brittle. Making MCP itself the engine boundary might reuse a standard external tool protocol, but would couple basic in-world rules to tool connectivity and external side-effect concerns. The accepted choice is a **native registry** that can optionally coexist with MCP adapters. A native contract/lifecycle adds design work and compatibility obligations, especially around schemas and historical event replay.

## Dependencies and constraints
- Extends accepted [[Deterministic Adventure Coordinator]] (IDEA-0044), which owns authoritative validation/dispatch/finalisation, and [[LLM State Interpreter and Proposed Operations]] (IDEA-0045), which may suggest registered operations but cannot commit them directly.
- Typed tool rejections and narrative repair follow accepted [[Typed Tool Rejection and Narrative Repair]] (IDEA-0046).
- Persistent results across all registered mechanics must satisfy [[Event-Sourced World History]] (IDEA-0039) and **complete incremental reconstruction** in [[Snapshots and Incremental State Rebuild]] (IDEA-0042); no mod-owned persistent fact may be unreplayable.
- Shared world entities and provenance must remain consistent with accepted inventory, character, location and environment modelling. Registered operations cannot silently create duplicate identities or contradictory ownership/position state.
- Native capabilities must function without optional MCP connectivity. [[MCP Tool Connectivity and Side-Effect Safety]] (IDEA-0048) remains unaccepted and is reviewed separately.
- Capability permissions, trust/sandboxing, module lifecycle and historical migration are intentionally unresolved.
- A module may be disabled or removed from future gameplay without making already accepted canonical story history disappear; how historic event decoding/migration works is left to refinement.
- This is staging acceptance for design refinement only, not production approval or implementation.

## Open questions
- How are plugin schemas versioned, permissions assigned and modules unloaded?
- Which stable ID and schema-version conventions let model/tool callers discover and invoke capabilities safely?
- What contract defines validation, preparation, event emission and atomic commit, including multiple linked entities?
- How should permission requests, grant/revocation, module isolation, local code trust and malicious/unreliable mods be managed?
- How can a historical event emitted by a removed or upgraded plugin be reconstructed deterministically?
- Which capabilities should be exposed to the LLM based on adventure mode, permissions, current scene and enabled modules?
- How are capability conflicts, duplicate registrations, incompatible versions and dependencies resolved?
- Should operations that invoke external services use a separate adapter with stronger effect and replay safeguards?
- What is the minimum useful native registry and extension API without freezing a premature architecture?

## Draft acceptance criteria
- [ ] Built-in and mod-provided operations can register with stable capability IDs and discoverable typed input/output contracts.
- [ ] Each operation declares required permissions and participates in explicit validation and preparation before emitting accepted state events.
- [ ] The coordinator can discover/invoke permitted operations without delegating canonical authority to an LLM or a mod.
- [ ] A registered operation can update shared persistent entities without duplicating or contradicting other canonical state.
- [ ] Failed or invalid operations do not leave partial authoritative world-state mutations.
- [ ] All accepted effects are durably recorded and support full deterministic reconstruction at arbitrary historical turns.
- [ ] Native gameplay works without installing or connecting MCP servers.
- [ ] Schema evolution, module unload/isolation, permission enforcement and replay of events from disabled/updated modules remain explicitly documented as blocking refinement questions.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **user**. The requesting user's direction has been explicitly accepted for staging; exact mechanics remain to be reviewed.
- This is **accepted for refinement**, not approved for production or implemented.

## Decisions and review history
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Native discoverable registry for built-in and mod-provided gameplay operations, with stable IDs, typed input/output schemas, declared permissions, validation/preparation and event-producing execution against shared canonical entity/world state. Modules remain under deterministic coordinator authority, are compatible with complete incremental reconstruction, and do **not** depend on MCP for core gameplay. Schema versioning, permissions, isolation, unloading and replay with updated/removed mods are open. Moved to staging, not production.
