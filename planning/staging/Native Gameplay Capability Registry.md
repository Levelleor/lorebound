---
id: "IDEA-0047"
type: idea
status: staging
origin: user
created: "2026-10-16"
updated: "2026-10-17"
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
- **Native gameplay independent of MCP:** MCP is not the core engine boundary or a prerequisite to registering/executing built-in or native mod capabilities. The optional MCP connectivity proposal is **skipped for now** in [[MCP Tool Connectivity and Side-Effect Safety]] (IDEA-0048), not accepted for implementation.
- **Universal, protocol-neutral capability contracts:** Design the accepted registry's stable IDs, discoverable typed inputs/outputs, permissions, validation results, preparation and event-producing effects as transport- and provider-independent contracts. Built-in features, native mods and a possible *future* MCP adapter can map into the **same capability and coordinator pipeline** rather than separate gameplay authorities. Contracts must not assume all providers have identical affordances; adapters can translate differences.
- **Future MCP integration seam only:** Preserve a clear adapter boundary so an MCP connector can later discover/map external tools to the universal capability contracts, apply the same coordinator-authorised permissions and world validation, and distinguish read-only/gameplay operations from external side effects. This is **future compatibility**, not approval to implement MCP, an HTTP/stdio bridge, automatic external access or MCP-specific transport/authentication now.
- **Side-effect-safe contract design:** Capabilities should describe whether effects are read-only, recorded internal world changes or potentially external/irreversible side effects, allowing future adapters and native modules alike to avoid executing external side effects merely by replaying incremental history. Exact effect classification, confirmation, idempotency and remote failure policies remain open.
- **Keep lifecycle and security choices open:** Schema evolution, capability compatibility, permission grants/revocation, module isolation/trust, unloading or disabling modules and replaying history after module updates/removal need staging refinement, not premature implementation decisions.

## Proposed behaviour
Use protocol-neutral, versionable capability contracts and an adapter boundary. The coordinator dispatches all registered operations through the same permission/validation/commit authority, whether the eventual caller is a native module or a future MCP connector. External-side-effecting capabilities must remain distinguishable from replayable canonical game-state events; replay of historical state must not accidentally repeat the original external action. No MCP connector is required or approved at this stage.

A gameplay module registers an operation with a stable ID, typed input/output contracts and declared permissions. The coordinator makes permitted capabilities discoverable for player actions and the LLM interpreter's proposed operations; it resolves references, validates state and access, prepares coherent multi-entity effects, and commits event-producing results only when they meet authoritative rules. All accepted changes apply to the same canonical world and are durably represented in complete incremental history. If an operation fails validation or finalisation, no partial irreversible canonical game-state mutation is accepted. Exact transaction/prepare semantics require refinement, especially for plugins or tools with external side effects.

## Alternatives and trade-offs
Hard-coding every gameplay operation in the core may simplify the first implementation but makes modular mechanics and mod integration brittle. Making MCP itself the engine boundary might reuse a standard external tool protocol, but would couple basic in-world rules to tool connectivity and external side-effect concerns. The accepted choice is a **native registry** that can optionally coexist with MCP adapters. A native contract/lifecycle adds design work and compatibility obligations, especially around schemas and historical event replay.

## Architecture integration (2026-10-17)
- The capability registry and enabled native/gameplay plugin operations run in the **same client-side TypeScript application** as the Svelte UI and coordinator in both Wails v3 desktop and headless browser modes. This means 'native gameplay capabilities' are **engine-level TypeScript operations**, not automatically Go binaries.
- Go/Wails provides the privileged **SQLite/filesystem boundary**; plugin-produced durable changes must be submitted through the coordinator and saved atomically, not written directly to arbitrary database files.
- Loading third-party client-side plugin code and requesting elevated Go privileges are separate trust/permission problems, especially when headless mode is browser-accessible. The selected runtime does not itself approve an unrestricted script execution system or external MCP connector.

## Dependencies and constraints
- Extends accepted [[Deterministic Adventure Coordinator]] (IDEA-0044), which owns authoritative validation/dispatch/finalisation, and [[LLM State Interpreter and Proposed Operations]] (IDEA-0045), which may suggest registered operations but cannot commit them directly.
- Typed tool rejections and narrative repair follow accepted [[Typed Tool Rejection and Narrative Repair]] (IDEA-0046).
- Persistent results across all registered mechanics must satisfy [[Event-Sourced World History]] (IDEA-0039) and **complete incremental reconstruction** in [[Snapshots and Incremental State Rebuild]] (IDEA-0042); no mod-owned persistent fact may be unreplayable.
- Shared world entities and provenance must remain consistent with accepted inventory, character, location and environment modelling. Registered operations cannot silently create duplicate identities or contradictory ownership/position state.
- Native capabilities must function without optional MCP connectivity. [[MCP Tool Connectivity and Side-Effect Safety]] (IDEA-0048) was **skipped by the requesting user**; no MCP connector is currently an accepted feature.
- Keep the native contracts protocol-neutral and define a future adapter seam so an MCP connector can be considered later without duplicating the registry or coordinator authority; this does not require implementing MCP today.
- Separate replayable state changes from external side effects across *all* module transports. Store sufficient accepted outcomes/provenance for historical reconstruction without reissuing an external action.
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
- What minimum protocol-neutral contract metadata and adapter interfaces enable future MCP integration without prematurely implementing MCP or depending on one particular protocol?
- How should side-effect classification, permissions and deterministic replay be represented in a uniform native capability contract, including native plugins that themselves call outside services?

## Draft acceptance criteria
- [ ] Built-in and mod-provided operations can register with stable capability IDs and discoverable typed input/output contracts.
- [ ] Each operation declares required permissions and participates in explicit validation and preparation before emitting accepted state events.
- [ ] The coordinator can discover/invoke permitted operations without delegating canonical authority to an LLM or a mod.
- [ ] A registered operation can update shared persistent entities without duplicating or contradicting other canonical state.
- [ ] Failed or invalid operations do not leave partial authoritative world-state mutations.
- [ ] All accepted effects are durably recorded and support full deterministic reconstruction at arbitrary historical turns.
- [ ] Native gameplay works without installing or connecting MCP servers.
- [ ] Capability contracts and coordinator dispatch do not depend on a particular wire protocol, model provider or runtime transport; a future MCP adapter could map tools into this single capability authority.
- [ ] The registry's contract can distinguish replayable accepted internal state changes from potentially irreversible external effects so historical reconstruction need not reinvoke those effects.
- [ ] MCP transport, connector implementation and authentication remain **unapproved** and may be reviewed separately if wanted later.
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
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicit acceptance by the requesting user:** Native discoverable registry for built-in and mod-provided gameplay operations, with stable IDs, typed input/output schemas, declared permissions, validation/preparation and event-producing execution against shared canonical entity/world state. Modules remain under deterministic coordinator authority, are compatible with complete incremental reconstruction, and do **not** depend on MCP for core gameplay. Schema versioning, permissions, isolation, unloading and replay with updated/removed mods are open. Moved to staging, not production.
- 2026-10-16 — **Additional requesting-user clarification after IDEA-0048 skip:** Preserve universal, protocol-neutral capability contracts and an adapter boundary in this already-accepted registry so MCP could be integrated *later* without a second gameplay system. Do not implement/accept MCP connectivity now. Keep coordinator validation, shared permissions, external-side-effect boundaries and complete incremental replay consistent across any future connector. This is a refinement of IDEA-0047's accepted scope, not a promotion of IDEA-0048.
