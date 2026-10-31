---
type: architecture-decision
status: accepted
decision_id: "B7-D02"
phase: "B7"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit B7 Batch 1 Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - event-representation
  - plugin-integration
  - architecture-decision
---

# B7-D02 — Distinguish required core from optional plugin-owned event effects

## Approval and provenance

**2026-10-31 user approval:** “Review B7 Batch 1: B7-D01: A; B7-D02: A; B7-D03: C. Record only explicitly accepted choices as Lorebound GitHub ADRs, preserve approval history, and continue B7.”

This accepts **B7-D02 Option A**, separately from D01 A and D03 **C**. [B7 source review](../Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md) retains the original A/B/C proposals. No implementation or promotion approval is implied.

## Inherited constraints

- [B7-D01](./B7-D01%20-%20Versioned%20Typed%20Declarative%20Event%20Envelope.md) accepts versioned typed declarative event envelopes.
- [B2-D08](./B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md) requires failing safely when a **required core event type/version/payload** cannot be interpreted, rather than constructing an incomplete authoritative current world state.
- Earlier [IDEA-0047](../../staging/Native%20Gameplay%20Capability%20Registry.md) explicitly permits **removed/disabled optional plugin-specific historical state** to become unavailable without reinstalling, emulating or migrating the plugin just to continue the story. Existing canonical prose/core identities/atomicity remain protected.
- [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) forbids treating fictional prerequisite gaps as required-core format corruption.

## Accepted decision — Option A

**Identify a supported event's owning domain/namespace and payload version. Distinguish required core semantics from optional plugin-owned effects, maintaining replay safety and preserving the accepted removed-plugin exception.**

1. **Required core records:** Must have an available supported type/version and deterministic reducer/migration. If a required core event is malformed or unsupported and cannot be interpreted safely, stop the affected canonical replay and dependent writes, with accurate technical failure handling. Never silently skip or fabricate its effect.
2. **Optional plugin effects:** A removable plugin's own schemas/reducers/context/capabilities may be unavailable. Its unavailable custom effects **need not be replayed, migrated, emulated or reconstructed** after removal. The adventure can proceed without that plugin's mechanics or context while preserving durable story text and safely readable event data when appropriate. Do not silently delete historical bytes or imply old plugin state is still known.
3. **Shared/core facts remain core:** If a plugin-mediated action had previously committed a **core declarative assertion** (for example the current holder of an item), that supported core record must still replay normally after plugin removal. Do not mark it optional merely because a plugin initiated it. Preserve core world identity, current placement and consistency across available domains.
4. **Explicit domain ownership:** The event envelope and typed schema registry distinguish core and optional effect owners so a missing optional domain is not mistakenly reported as a missing core reducer. The exact namespace, plugin identifier and version/capability registration scheme remain deferred.
5. **Narration-first and approvals intact:** Plugin mechanics may guide *uncommitted attempts* only. They cannot retroactively reject accepted fictional facts. Model prompts cannot leak internal IDs under B6-D04. Existing manual approval overlay, single current ordered history, Go/SQLite atomicity/version/epoch fences and supported current event migration policy stay in force.
6. **No automatic plugin reinstatement or universal shim:** This design does not create a mandatory plugin-backwards-compatibility layer, auto-import missing third-party schemas, or rewrite accepted prose to fit removed-plugin mechanics.

## Options and disposition

- **A — accepted:** Namespaced domain/owner and version; fail closed for required core, permit missing optional plugin-specific state while retaining the story and independent core assertions.
- **B — not accepted:** Undifferentiated arbitrary core and plugin event JSON without ownership markers.
- **C — not accepted:** Require reinstalling all previously used optional plugins before opening or replaying an adventure.

## Deferred technical decisions

Reducer/registry ownership handshake, safe plugin-off replay boundaries, optional plugin data preservation or pruning details, cross-domain event batches, version/migration compatibility, permissions/capability registration and integration tests. **No plugin sandbox, schema parser, reducer or persistence migration is claimed implemented.**

## Decision history

- **2026-10-19:** Staged capability registry separately accepted removed-plugin exception and core-data safety.
- **2026-10-31:** B7 Batch 1 presented unapproved Options A/B/C.
- **2026-10-31:** User explicitly chose **B7-D02 A**, alongside D01 A and D03 **C**. No other B7 approval followed from this selection.
