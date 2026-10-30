---
type: architecture-decision
status: accepted
decision_id: "B6-D03"
phase: "B6"
created: "2026-10-30"
updated: "2026-10-30"
approved_at: "2026-10-30"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
  - architecture-decision
---

# B6-D03 — Grounded declarative character location and scene presence

## Approval and provenance

**Explicit user approval, 2026-10-30:** “Review B6 unresolved decisions: B6-D02: A; B6-D03: A. Record only explicitly approved decisions as Lorebound GitHub ADRs, preserve approval history, and continue the B6 review.”

This ADR accepts **B6-D03 Option A from the *revised narrative-first* B6 proposal**, not the original simulation-style variant preserved in [B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md). B6-D02 A is a distinct approval with its own ADR. No future B6 options, code or promotion are accepted by implication.

## Context

Lorebound's current world tracker helps the narrator remember **what accepted fiction establishes**; it is not a travel-feasibility simulator ([B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)). Names in narration are natural-language references, internally resolved to stable IDs without exposing those IDs to prose-generating model prompts ([B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md)). Location and scene presence must be current facts, not guesses inferred from mere name mentions.

## Accepted decision — revised Option A

**Emit and replay declarative `SetCharacterLocation`, `SetPresence` or `Clear`-style assertions when accepted narration or an explicit player correction actually establishes the character's current location, transit or physical/remote scene participation, without demanding proof of earlier movement or a traversable route.**

- **Source-grounded change:** A character *arriving*, *being in a place* or *participating physically in the active scene*, if established by accepted prose or committed player edits, is a candidate current assertion. A character merely mentioned, remembered, discussed, spoken to remotely or located in hypothetical/rumoured text is **not** automatically established as physically present. Distinguish asserted fact from an uncompleted travel attempt.
- **Latest accepted current location:** Apply supported typed assertions in the adventure's single current durable event order. A later grounded `SetCharacterLocation(character, castle)` supersedes an earlier current place for that stable identity. An explicitly unknown location remains distinct from a stated destination and from a generic assumption of absence. Do not manufacture simultaneous incompatible physical positions merely to accommodate different UI views.
- **Scene participation distinct from physical location:** Represent physical co-presence, known elsewhere, in transit, unknown and remote participation where established. Remote participation does not assert physical arrival; being known to exist in a Lorebook entry or being named in a passage does not place the character in the active scene. Current scene membership and location derive coherently from grounded assertions; do not maintain silently contradictory independent physical-truth ledgers.
- **No travel-history proof:** A later established castle arrival is accepted even if no earlier scene contained a path, journey, adjacent route or departure event. Missing fictional causes are a **narrative continuity matter**, not an unreadable state event. If an earlier introduction event was removed, keep a sparse stable character/place identity with unspecified fields unknown when the later assertion is otherwise typed and resolvable.
- **Optional strict travel guardrails remain upstream:** The adventure's previously accepted freeform, adjacent-only and multi-hop policies can guide, reject or shape an **uncommitted ordinary Do/Say travel attempt** and provisional AI narration. They **cannot retroactively veto an already accepted fact** of arrival; explicit player Story authorial overrides remain preserved. Location containment/hierarchy is not an automatically traversable route.
- **Internal reference resolution:** The narrator sees ordinary names, descriptions and relationships, **not internal stable IDs**. The TypeScript engine resolves actual participants and places, using scene, aliases and context, with stable IDs stored only in typed event data. Do not conflate two same-name locations/characters, guess ambiguous references or fabricate a missing participant merely to fill the event schema. Unresolvable structured effects can remain uncommitted while otherwise acceptable narrative prose stands.
- **Technical consistency only:** Verify supported event types/versions, typed identity or constructible sparse identity, deterministic single current physical location and coherent physical/remote presence projection. Truly malformed/uninterpretable required event payloads and unsafe/stale writes fail closed; fictional inability to travel does **not**.
- **Commit boundary:** Automatic accepted narration outcomes and explicit player corrections keep their distinct already-approved acceptance workflows. Manual changes require the noncanonical pending set and full composer overlay until Approve/Commit or Discard. Go/SQLite applies accepted event batches atomically under current adventure/version/epoch and durable operation-id fencing. No second Go gameplay engine, persisted world snapshot or old passage revision archive.

## Options and selection

1. **A — accepted:** Grounded current `SetCharacterLocation`/`SetPresence` assertions; no mention-based teleportation or proof-of-route requirement. Truthful narration memory with stable IDs and coherent current projection.
2. **B — rejected:** Treat any character mention as physical presence. Incorrectly locates remote, remembered or merely discussed characters.
3. **C — rejected:** Keep location and scene presence as unrelated records allowed to assert incompatible physical realities. Confuses narrator context.

The initial B6-D03 Option A described “validated movement” in terms that could imply historical route legality. It was **unapproved**, and was replaced by the revised narrative-first framing before this acceptance.

## Deferred engineering contracts

Precise scene/physical/remote presence encoding; supported unknown/in-transit value; co-location calculation; named location ambiguities; routing of pre-narration strict attempts; typed schema and replay fixtures; accessibility of any uncertainty UI. No implementation, B6 closure, model-routing change or staging promotion.

## Traceability

[B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md), [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md), [IDEA-0034](../../staging/Character%20Presence%20and%20Current%20Scene.md), [IDEA-0035](../../staging/Configurable%20Travel%20Graph%20Rules.md), [IDEA-0033](../../staging/Hierarchical%20World%20Locations.md). Owners S05/S06/S09/S11/S12.

## Decision history

- **2026-10-28:** Original B6-D03 options A/B/C proposed, with some simulation-like movement-validation language; **not approved**.
- **2026-10-28:** User accepted B6-D01 narrative-first declarative state and narrowed retroactive validation.
- **2026-10-29:** User accepted B6-D04 narrator/ID separation.
- **2026-10-29:** Revised B6-D03 A/B/C proposed: grounded fact assertions, not route-preconditioned transitions; **unapproved until later explicit selection**.
- **2026-10-30:** User expressly selected **B6-D03 A**, separately accepted D02 A and instructed ADR recording plus continued B6 review. No additional future options or implementation accepted.
