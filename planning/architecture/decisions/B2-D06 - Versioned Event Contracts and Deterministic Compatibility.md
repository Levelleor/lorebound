---
type: architecture-decision
status: accepted
decision_id: "B2-D06"
created: "2026-10-26"
updated: "2026-10-28"
approved_at: "2026-10-26"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - canonical-history
  - architecture-decision
---

# B2-D06 — Versioned event contracts and deterministic compatibility

## Subsequent accepted architectural supersession — 2026-10-28

**CURRENT AUTHORITY:** [B6-D01 — Narrative-first declarative outcome events](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), together with [B3-D04 — Single current history](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), supersedes earlier simulation-style event preconditions and prior immutable passage/event audit assumptions in this ADR. The engine primarily **tracks the fictional facts established by accepted narration and player corrections**. Events are ordered typed **Create/Remove, Set/Clear and keyed relation Add/Remove assertions**, not procedural transfers or movement operations that must prove historic source possession, prior introduction, prior route or fictional causality. A later accepted reference may construct a **sparse stable identity** when its old introduction has been removed; unspecified fields remain unknown. Preserve technical typed/supported-format, deterministic folding, version/epoch, atomic transaction and one-current-property safety. Only a **technically unprocessable** event fails closed; narrative contradiction does not. The original earlier approval and alternatives below are **historical provenance**, not permission to reinstate rejected prerequisites or old revision archives. Actual implementation remains unapproved.



## Approval and provenance

**Accepted by the requesting user on 2026-10-26:** “For D06 lets go with A,” selecting the recommended option from the second Pass B2 batch. The user also approved D04 Option A and confirmed D05's separate earlier acceptance. This ADR records **only D06**; B2-D03 remains a revision request pending explicit acceptance.

## Context

B2-D01's immutable outcome events cannot be rewritten merely because application rules or data structures change. History remains replayable under the B1-D06 browser-TypeScript reducer boundary, including supported core and currently installed/available module domains. New application releases may change event payloads or world-state representation; old accepted outcomes must not silently change meaning.

## Accepted decision: Option A

**Give each event an explicit schema/format version and use deterministic, version-aware compatibility handling for supported event types.**

- Events carry a stable type identifier and explicit event-format/schema version independent of the application release version. Immutable historical event records retain their original payloads and provenance.
- Each supported browser TypeScript reducer either interprets the event version directly or uses an **explicit, deterministic** version conversion/upcast into a known supported representation. No LLM calls, random rerolls, clock-dependent decisions or external side effects are permitted during replay.
- The interpreted effect must preserve the historically **accepted outcome**, not evaluate an old attempt under newly introduced gameplay rules and thereby silently produce a different outcome.
- Incompatible/unknown **core** event formats must surface as an explicit unsupported-history/integrity error, never be guessed or silently treated as current-format payloads; do not partially publish an invalid reconstructed projection or commit a partial state change. Later implementation should specify user-facing error/recovery details.
- Define supported historical-format compatibility per event/reducer family, including core and available/installed optional capability domains. **Do not promise arbitrary indefinite backward compatibility** beyond explicitly supported versions.
- **Removed-plugin exception:** if a player removes a plugin, its unavailable custom historical reducer/state is not required to be migrated, emulated or reconstructed; preserved story and unrelated core integrity remain mandatory. A plugin absent by accepted user choice is **not** to be treated as a reason to delete or corrupt core history.
- The version and conversion policy also applies to accepted manual state corrections and other non-AI state events when their formats evolve.

## Alternatives considered

1. **Option A, accepted:** Versioned immutable event contracts with explicit deterministic version compatibility.
2. **Option B, not selected as a blanket default:** Eagerly rewrite all historical event records into the latest version on upgrade, risking audit drift and complex multi-revision migrations.
3. **Option C, not selected:** Reinterpret every old event using only the latest rules/format without declared compatibility, producing historical meaning drift.

## Consequences and unresolved engineering details

- **Benefits:** traceable evolution, deterministic core reconstruction after supported upgrades, less risk of silently changing already accepted events.
- **Costs:** versioned reducer/serializer fixtures, explicitly maintained compatibility contracts and tests across supported formats.
- **Still open:** exact event taxonomy and concrete serialized schemas, conversion implementation, supported-version policy, schema changes affecting structured passage documents (**B2-D05**), and user recovery when a core historical format is unsupported. Do not conflate event schema upgrades with passage JSON schema upgrades; both must honour their separate authority.
- **Does not approve:** B2-D03 full Turn-0 replay, which remains under revision; no software implementation or source idea promotion is claimed.

## Traceability

S05, S06, S10, S11, S12; [IDEA-0039](../../staging/Event-Sourced%20World%20History.md), [IDEA-0042](../../staging/Snapshots%20and%20Incremental%20State%20Rebuild.md), [B2-D01](./B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md), [B2-D05](./B2-D05%20-%20Canonical%20Structured%20Passage%20Documents.md), B1-D01 and B1-D06; Pass A A-07 and A-10.


## Decision history

- **2026-10-25:** D06 proposed for review: explicit event schema versions with deterministic backwards-compatible reducer/upcast handling for supported types.
- **2026-10-26:** User explicitly approved **D06 Option A**. No implicit replay-policy, staging or implementation approval.
