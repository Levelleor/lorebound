---
type: architecture-decision
status: accepted
decision_id: "B6-D10"
phase: "B6"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit Option A approval)"
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
  - architecture-decision
---

# B6-D10 — Entity removal is distinct from clearing a current property

## Approval and provenance

**Explicit user acceptance, 2026-10-31:** “Review B6 Batch 3: B6-D08: A; B6-D09: A; B6-D10: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history, then assess B6 design closure.”

This records **B6-D10 Option A** independently of D08/D09. Original alternatives remain in the [B6 Batch 3 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md); no implementation, staging promotion or formal closure follows from the requested assessment.

## Context

If an accepted story says a brass key was destroyed, that differs from merely no longer knowing where it is. Likewise, a later passage may assert that the same named key is present even if the current timeline contains a previous removal or lacks its original introduction. Lorebound tracks **accepted facts**, not whether fictional resurrection or recovery is mechanically justified ([B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)).

## Accepted decision — Option A

**Distinguish an accepted `RemoveEntity`-style lifecycle assertion from an accepted `ClearProperty` assertion. Keep stable identity references replayable across current-history changes and permit a later grounded assertion to re-establish an earlier removed entity without automatically rewriting surviving events.**

- **RemoveEntity:** An explicitly established destruction/removal/retirement changes the target's *current tracked lifecycle*, marking its stable ID as removed/inactive in the derived current projection. Do not erase its referenced identity from the current ordered event stream or delete every current passage/event that mentions it. The exact distinctions between destroyed, absent from story, inactive or dissolved are domain-specific and deferred.
- **ClearProperty:** Clearing holder/location/status does not assert that the entity itself was destroyed or disappeared. Its current field becomes unknown/unset under the field's accepted semantics ([B6-D08](./B6-D08%20-%20Distinct%20Unknown%20Absent%20and%20Known%20Current%20Facts.md)); a field may separately express a positive known absence without deleting the entity.
- **Later assertions may re-establish facts:** If accepted narration later unmistakably refers to **the same stable entity**, an appropriate current assertion may re-establish presence, current placement or other grounded properties even after a prior RemoveEntity, without proof of fictional survival or automatic story repair. Missing historical details remain unknown, under the sparse identity rule. If the reference might describe a **new or different** identically named object, follow [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) and [B6-D09](./B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md): **do not guess**.
- **Replay in one current timeline:** Ordered Create/Remove, Set/Clear and keyed relation assertions determine only the current world projection. No inactive old passage/event revision archive is reintroduced, and RemoveEntity does **not** cascade-delete or rewrite later accepted events to manufacture a mechanically consistent story.
- **Narrator-facing and technical safety:** The narrator uses natural names, not engine-generated IDs. Only grounded accepted story or deliberate player-approved correction changes current lifecycle. Supported event schema/type, deterministic identity resolution and atomic Go/SQLite commit safeguards remain.
- **Not blanket deletion semantics:** A word such as “vanished” may be ambiguous; do not infer permanent destruction solely from uncertain prose. Field-specific and lifecycle-specific interpretation belongs to a later contract, not an automatic globally destructive command.

## Alternatives considered

1. **A — accepted:** Separate current entity lifecycle removal from property clearing; later grounded assertions can re-establish the same identity where unambiguous. Requires compact lifecycle/tombstone semantics.
2. **B — rejected:** Physically delete stable ID and all later events mentioning it, silently changing surviving accepted fiction.
3. **C — rejected:** Conflate “unknown holder” and “entity destroyed”; loses important meaning for narrator context.

## Deferred design/engineering scope

Tombstone or lifecycle state encoding, type-specific destructive verbs, how later assertions mark an entity active, identity continuity across resurrected/replaced names, item custody after removal and exact conflict/error UI. No code, new player-facing entity-deletion feature or historical archive is approved.

## Traceability

[B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B6-D08](./B6-D08%20-%20Distinct%20Unknown%20Absent%20and%20Known%20Current%20Facts.md), [B6-D09](./B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md), [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md). Owners S05/S06/S09/S10/S11/S12.

## Decision history

- **2026-10-28:** B6-D01 accepted current-only declarative entity/create/remove assertions; precise Remove vs Clear meaning remained open.
- **2026-10-31 — Original D10 alternatives:** A distinguish entity removal and clearing a property (recommended), B cascade-delete all later references, C conflate unknown placement and destruction. Initially unapproved.
- **2026-10-31 — Explicit acceptance:** User selected **B6-D10 A** with separate D08 A/D09 A approvals, and requested a **design closure assessment**, not closure itself.
