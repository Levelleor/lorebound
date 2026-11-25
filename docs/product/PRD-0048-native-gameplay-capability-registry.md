---
id: PRD-0048
type: prd
status: accepted
related:
- NOTE-0054
- PRD-0001
- NOTE-0008
- NOTE-0012
---

# Native Gameplay Capability Registry

## Problem

Approved product scope; this does not imply implementation.

## Source and delivery status

[Pinned source IDEA-0047](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/production/Native%20Gameplay%20Capability%20Registry.md) · origin: user; created: 2026-10-16; updated: 2026-11-03; accepted at: 2026-10-16; accepted by: requesting user (chat confirmation); approved at: 2026-11-03; approved by: requesting user (explicit blanket promotion of all remaining 50 accepted staging ideas)

Primary subsystem: **S06**. First milestone: **M8**. Delivery: **NOT STARTED**.

- Requirement coverage: Not yet inventoried
- Evidence: None

## Later accepted typed event ownership — 2026-10-31

[B7-D01](../decisions/ADR-0052-versioned-typed-declarative-event-envelope.md) approves a **versioned, typed declarative event envelope** and domain-defined field payloads rather than replayable preconditioned gameplay commands. [B7-D02](../decisions/ADR-0053-core-and-optional-plugin-event-ownership.md) approves explicit **required-core versus optional plugin-owned event domain/version** identification. Required-core unsupported events fail safe, but after disabling/removing a plugin, its unavailable custom past state need **not** be interpreted, migrated, reinstalled or reconstructed merely to continue narration. **Core assertions previously accepted through a plugin remain core records** and must still replay without that plugin. Existing capability permissions and Go/SQLite atomic commit protection still apply; no plugin loading/runtime implementation is claimed.



## Later accepted narrative-first world-memory rule — 2026-10-28

**Current coordinator contract ([B6-D01](../decisions/ADR-0042-narrative-first-declarative-outcome-events.md)):** Capabilities may expose convenient action intents (transfer, move, equip) and optional **pre-narration attempted-action** mechanics, but committed game/world state is **declarative grounded outcome assertions**. The registry must not impose a blanket “was the old holder holding it?” or “was there a legal route earlier?” precondition before tracking accepted story facts. Maintain typed capability identity, permissions for real side effects, technical storage/version fences, stable IDs, consistent projections and removed-plugin exception.


## Accepted direction
- **Native, discoverable gameplay capability registry:** Built-in gameplay features and mods can register supported operations in a common registry, so the coordinator and any configured interpreter can discover relevant options rather than hard-code every new mechanic or teach a particular RP model implementation internals.
- **Stable capability identities:** Each registered operation has a stable identifier suitable for dispatch and traceability, distinct from transient model wording. Exact namespace/version format remains open.
- **Typed contracts:** Registered capabilities declare typed input and output schemas, their required arguments/results and meaningful validation failures. The choice of contract format and schema tooling is open.
- **Explicit permissions:** Each capability declares what it may access or change. A registration does not grant unrestricted access to canonical state, external systems, other mods or privileged actions; the permission model and enforcement architecture still need refinement.
- **Validation and preparation:** Check grounded **assertion representation** and coherent current projections for persistent events; optional world rules apply to uncommitted action attempts, while external side effects retain their own permission checks. Do not mechanically veto already accepted story facts. Exact lifecycle/order, conflict checking and staging of effects remain open.
- **Event-producing execution:** Successful native operations produce validated, accepted changes/events affecting the shared authoritative entity and world state; they do not directly replace or maintain conflicting private canonical worlds.
- **Deterministic coordinator authority:** The accepted Deterministic Adventure Coordinator (IDEA-0044) retains control of dispatch, validation, sequencing and authoritative finalisation. Neither a mod nor an LLM can bypass its world-state integrity rules.
- **Historical provenance while a capability is installed:** Accepted persistent changes from a participating capability integrate with Event-Sourced World History (IDEA-0039) and Snapshots and Incremental State Rebuild (IDEA-0042). **Later plugin removal is an accepted exception to full plugin-specific replay**: old recorded history must not be silently deleted, but Lorebound does **not** have to migrate, emulate, restore or interpret removed-plugin logic/state to allow the adventure to continue. The game proceeds without that capability's rules and supplied AI context; its future narrative results may be unpredictable, as the player accepts. Core character/world/SQLite identity and atomic integrity must still hold.
- **Native gameplay independent of MCP:** MCP is not the core engine boundary or a prerequisite to registering/executing built-in or native mod capabilities. The optional MCP connectivity proposal is **skipped for now** in MCP Tool Connectivity and Side-Effect Safety (IDEA-0048), not accepted for implementation.
- **Universal, protocol-neutral capability contracts:** Design the accepted registry's stable IDs, discoverable typed inputs/outputs, permissions, validation results, preparation and event-producing effects as transport- and provider-independent contracts. Built-in features, native mods and a possible *future* MCP adapter can map into the **same capability and coordinator pipeline** rather than separate gameplay authorities. Contracts must not assume all providers have identical affordances; adapters can translate differences.
- **Future MCP integration seam only:** Preserve a clear adapter boundary so an MCP connector can later discover/map external tools to the universal capability contracts, apply the same coordinator-authorised permissions and world validation, and distinguish read-only/gameplay operations from external side effects. This is **future compatibility**, not approval to implement MCP, an HTTP/stdio bridge, automatic external access or MCP-specific transport/authentication now.
- **Side-effect-safe contract design:** Capabilities should describe whether effects are read-only, recorded internal world changes or potentially external/irreversible side effects, allowing future adapters and native modules alike to avoid executing external side effects merely by replaying incremental history. Exact effect classification, confirmation, idempotency and remote failure policies remain open.
- **Plugin lifecycle without forced migration (explicitly accepted 2026-10-19):** Disabling or removing a plugin removes its capabilities, validations and plugin-supplied model context from subsequent play. **No plugin data migration, auto-reinstallation, compatibility shim or historical replay recovery is promised**, and no AI inference is required to reconstruct removed-plugin outcomes. Existing canonical prose, durable historical records and other modules remain. Plugin-loading boundaries, normal permissions and safe technical failure reporting still require refinement.

## Dependencies and constraints
- Extends accepted Deterministic Adventure Coordinator (IDEA-0044), which owns authoritative validation/dispatch/finalisation, and LLM State Interpreter and Proposed Operations (IDEA-0045), which may suggest registered operations but cannot commit them directly.
- Typed tool rejections and narrative repair follow accepted Typed Tool Rejection and Narrative Repair (IDEA-0046).
- Persistent results across registered mechanics must be recorded through Event-Sourced World History (IDEA-0039) and the incremental reconstruction contract of Snapshots and Incremental State Rebuild (IDEA-0042) **while the capability is installed/supported**. If removed, the historical custom plugin state has no required migration or replay compatibility; existing canonical story/history is not automatically erased.
- Shared world entities and provenance must remain consistent with accepted inventory, character, location and environment modelling. Registered operations cannot silently create duplicate identities or contradictory ownership/position state.
- Native capabilities must function without optional MCP connectivity. MCP Tool Connectivity and Side-Effect Safety (IDEA-0048) was **skipped by the requesting user**; no MCP connector is currently an accepted feature.
- Keep the native contracts protocol-neutral and define a future adapter seam so an MCP connector can be considered later without duplicating the registry or coordinator authority; this does not require implementing MCP today.
- Separate replayable state changes from external side effects across *all* module transports. Store sufficient accepted outcomes/provenance for historical reconstruction without reissuing an external action.
- Capability permissions, trust/sandboxing and normal module loading/lifecycle require refinement. **Plugin-removal migration is explicitly not required**; it is not an unresolved blocking decision.
- After disabling/removing a module, the story continues without its new mechanics or model context; retain already saved story/history and core-safe records where available, with **no historical plugin-event decoding, migration or emulation requirement**.
- This is staging acceptance for design refinement only, not production approval or implementation.

## Supporting detail

See [NOTE-0054](../knowledge/inbox/NOTE-0054-prd-0048-supporting-requirement-and-evidence-detail.md) for the complete migrated source detail, historic alternatives and requirement rows.
