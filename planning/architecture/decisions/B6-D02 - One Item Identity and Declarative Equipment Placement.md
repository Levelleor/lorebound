---
type: architecture-decision
status: accepted
decision_id: "B6-D02"
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

# B6-D02 — One item identity; inventory and equipment from declarative placement

## Approval and provenance

**Explicit user approval, 2026-10-30:** “Review B6 unresolved decisions: B6-D02: A; B6-D03: A. Record only explicitly approved decisions as Lorebound GitHub ADRs, preserve approval history, and continue the B6 review.”

This accepts **B6-D02 Option A** of the **revised narrative-first proposal** in the [B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md), not the older simulation-first version preserved for historical context. It is independent of the separately approved D03 A, and is **not** blanket approval of future B6 choices, implementation or staging-to-production promotion.

## Context

[B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) establishes that Lorebound primarily **remembers established fictional facts for narration**. Accepted state changes are replayable assertions rather than commands with gameplay prerequisites. [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) establishes that the narrator uses names/descriptions; the engine maintains private stable IDs and resolves references separately. An inventory and an equipment panel must not generate independent copies of the same sword or treat a story statement of its new whereabouts as an illegal transfer because of its past.

## Accepted decision — revised Option A

**An item has one stable internal identity; its current holder/place is determined by the latest supported ordered placement assertion. Inventory, equipment and container/location views are projections of that identity, never separate physical item instances.**

- **One identity, one current physical placement:** Current item holder/place is derived from the latest supported `SetItemHolder`/`SetItemLocation`/`ClearItemHolder`-style assertion for the item's stable ID, across the shared B4-D01 event order. A later accepted location/holder **replaces** any previous incompatible physical placement. Unknown, explicitly no holder and a known holder are different states.
- **Equipment is a compatible view/property:** Equipping references the **same item ID**, with an applicable slot/status assertion; it does not clone the item into an independent equipment ledger. On an accepted change of holder or other incompatible placement, derive/clear outdated equipment assignments as needed to make a single current view, without rewriting or deleting earlier accepted events. Exact event shape, slot uniqueness and layered-equipment representation are later refinements.
- **No fictional source precondition:** If accepted prose establishes the sword is in the chest, record that current fact even when earlier events never established Mara owned, held, created or transferred it. A UI may offer a “Transfer” command as a player intention, but **committed current state is a declarative placement assertion**. No source inventory check, legal-transfer proof or invented acquisition narrative is required. Optional attempt mechanics may shape narration **before** its result is accepted; they do not veto accepted world facts.
- **Grounded and engine-resolved:** Only accepted narrative or an explicitly committed player correction establishes a current holder/slot fact. The narrator is shown human-readable item descriptions, **not internal IDs**. An internal resolver matches references using scene, holder, aliases and context. Clearly introduced items receive system-generated IDs; ambiguous same-name references are not guessed or duplicated and may remain unresolved without rejecting story prose.
- **Sparse records:** Later accepted placement may identify an item whose earlier introduction has been removed. Replay maintains the item's stable ID with unknown origin/name/older properties where absent; it does not require a retained Create event to justify the story.
- **Deterministic technical coherence:** The stored assertions must be well-typed, version-supported and replayable, producing at most one *currently recorded* physical placement per unique ID. Incompatible placements **at different ordered event positions are not an error**; the latest applicable assertion determines the view. Technically ambiguous/non-representable event payloads, unsafe writes and stale commits remain failures. No Go gameplay validation engine.
- **Atomicity and manual approval:** Any accepted multi-property/slot batch uses the existing TypeScript prepared assertion validation and Go/SQLite atomic/idempotent version/epoch transaction. Manual item/gear edits stay **noncanonical until player Approve/Commit** with the shared full-composer overlay, or Discard. No automatic canonical mutation merely by editing the UI.
- **Anatomy exception retained:** Previously accepted, *grounded* automatic equipment consequences of an accepted anatomy change may generate additional compatible current assertions for the **same item**; don't invent an unestablished destination, duplicate the item or silently rewrite past events. Detailed no-grounded-destination behaviour remains for a later B6 question.
- **No physical-simulation engine:** Modelled ownership claims, physical custody, proximity, slot assignment and fictional validity are distinct. Avoid deriving new ownership or impossibility judgments from a UI inventory projection.

## Original revised options and disposition

1. **A — accepted:** One item ID with its latest asserted holder/place; inventory and equipment derived as coherent views. Preferred for faithful, replayable story memory.
2. **B — rejected:** Independent inventory/equipment/location item copies with later reconciliation. Risks duplicate or conflicting facts.
3. **C — rejected:** Equipment exists only in prose with no tracked relationship to item identities. Reduces usable current narration context.

The initial pre-B6-D01 version spoke of *validated transfers* and had not been approved. It is retained as proposal history in the review, and **does not authorise mechanical precondition rejection**.

## Deferred technical work

Exact event schema; slots/layers and character anatomy compatibility; a holder that is itself a container; clearing outdated slot links in the projection; event order and replay fixtures; ambiguity UI; performance; plugin semantics. This ADR does not implement the system, require a new model call per event, close B6 or promote staging ideas.

## Traceability

[B6 review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md); [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md), [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md), [IDEA-0029](../../staging/Persistent%20Items%20and%20Inventory%20Transfers.md), [IDEA-0030](../../staging/Slot-Based%20Equipment%20and%20Body%20Diagram.md), [IDEA-0031](../../staging/Configurable%20Anatomy%20and%20Transformations.md). Owners S05/S06/S10/S11/S12.

## Decision history

- **2026-10-28:** Original B6-D02 A/B/C options proposed with a more simulation-like “validate transfer” framing; **not approved**.
- **2026-10-28:** User explicitly approved B6-D01 narrative-first declarative assertions, invalidating source-state-precondition assumptions in the original proposals.
- **2026-10-29:** User approved B6-D04 separation of natural-language narrator context from private entity IDs.
- **2026-10-29:** Revised B6-D02 A/B/C presented with latest-holder/current-projection semantics; remained **unapproved**.
- **2026-10-30:** User explicitly selected **B6-D02 A**, separately selected B6-D03 A, and requested acceptance to be recorded with provenance and B6 review to continue. No implementation or later decisions approved.
