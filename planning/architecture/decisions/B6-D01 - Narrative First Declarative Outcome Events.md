---
type: architecture-decision
status: accepted
decision_id: "B6-D01"
phase: "B6"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat acceptance and document-reconciliation instruction)"
supersedes_in_part:
  - B4-D06
  - B3-D06
  - B2-D08
tags:
  - planning/architecture
  - pass-b
  - world-state-integrity
  - architecture-decision
---

# B6-D01 — Narrative-first declarative outcome events, not a simulation engine

## Approval and context

**Explicit user choice, 2026-10-28:** After discussing why a key can still be used in later accepted narration despite an earlier event being deleted, the user approved the direction: “yes, lets proceed with this direction, lets edit all mentiones of this feature and ensure it's properly described now. This is the way forward, I do not want other meaningful documents describe this wrongly anymore and to focus on the primary purpose of how the engine is meant to work.”

The accepted proposal immediately preceding that approval was: **“world events [are] declarative state updates rather than procedural game actions”**, events “describe what changed, rather than demand proof that the change was possible,” and “events must be technically replayable, but they do not need to be justified by the previous fictional state.” This is a **user-directed replacement** of the old cross-module precondition-first framing, **not** acceptance of the original B6-D01 A/B/C proposals. The latter remain in the B6 review as initial, unapproved history; this later explicit decision controls current design.

## Primary product purpose

**Lorebound is primarily a story-writing/narration companion and a faithful tracker of accepted fictional facts. It is not a conservation-law or mechanically authoritative RPG simulation engine.** The story and player-authored changes establish fictional canon; the event stream is a structured, replayable **record of the latest established world assertions**, used for current Lorebook, inventory, presence, context retrieval and consistency suggestions. It must not veto, retroactively change or “correct” already accepted prose merely because earlier state lacks a mechanically required object, route, source possession, prior encounter or causal chain.

In particular, **narrative contradiction is not technical corruption**. It may be permitted (and optionally surfaced as informational feedback), without forced AI story rewrite or failure to save a valid state assertion.

## Accepted world-event model

1. **Small declarative typed vocabulary:** Prefer events such as **Create/Remove Entity**, **Set/Clear Property** (item holder/location, character location/presence, status, anatomy, name, etc.), and **Add/Remove Relationship** (route, association, ownership claim where represented). These are accepted outcome assertions, **not procedural commands requiring simulation-style prerequisites**. “Transfer item” can remain a convenient UI/action intent but should **compile into a current-location/custody assertion** for the same item identity rather than a source-validated transfer operation. Simple keyed add/remove semantics are valid when they update a collection/relation deterministically; **do not maintain separate contradictory inventory add/remove ledgers**.
2. **Order determines current tracked state:** Each accepted event is attached to the single durable total event order [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md). Replaying from Turn 0 deterministically folds assertions: later accepted `SetItemHolder(key, chest)` replaces the earlier holder, without requiring a proof that the previous holder possessed the key. A later accepted `SetItemHolder(key, Mara)` is effective even if an old key-acquisition/creation event was removed. Never replay by re-running AI, speculative action mechanics or external side effects.
3. **Sparse identity / missing predecessor:** Stable IDs still identify the **same** item, person or location across names and events. If historical edits remove an entity-introduction event but a later accepted assertion still addresses that stable ID, **materialize/maintain a sparse identity with only established fields**, keeping missing origin/name/attributes **unknown**, rather than rejecting replay as “entity was never created.” Do not auto-invent a backstory, previous holder, location, route or additional entity. If an assertion lacks a resolvable/constructible stable ID or required type information, report a **technical data error**, not an imaginary gameplay violation. A later assertion can re-establish a current entity after an earlier Remove, without fabricated causal steps; details remain unknown as appropriate.
4. **Physical placement is a projection invariant, not a transfer precondition:** Each item ID has **at most one currently asserted physical placement/holder**. Inventory and equipped-slot views derive from the same latest item placement/equipment assertions; they are **not separate competing copies**. Unknown placement is distinct from none or from a default room. Equip/unequip, moving to a chest and slot invalidation can be represented by one coherent batch of current assertions; do not ask whether the item was in the claimed source inventory before recording where the accepted story says it is now. Custody and ownership claims remain distinct.
5. **Accepted world truth vs mere mention:** The source-grounded extractor may emit an assertion **only when accepted story text or an explicit player correction actually establishes the fact**; mentioning a person in memory, dialogue or a remote call alone does not assert physical presence. An unsupported descriptive detail remains valid prose without pretending a structured field exists [B5-D08](./B5-D08%20-%20Narrative%20Only%20Unsupported%20Opening%20Facts.md).
6. **Technical validation remains narrow:** Still reject malformed/unversioned unsupported required-core event payloads, impossible-to-decode types, unrecoverable identity/type ambiguity, invalid reference *representation*, transaction/version/epoch conflicts and a resulting state that cannot be **represented deterministically** (e.g., two different physical holders recorded as simultaneously current for the exact same item without a deterministic winner). Use stable IDs, one current event history, ordered deterministic replay and atomic Go/SQLite commits. A missing *fictional predecessor* is **not** itself an invalid reference: sparse identities and later assertions are legitimate.
7. **Player control and provenance:** Manual world edits continue to accumulate in a **noncanonical pending set**, with the full chat-composer overlay; accepted only on player Approve/Commit or discarded. The atomic accepted event(s) carry player provenance and event order; no mandatory fictional story turn. Normal auto-committed validated Quick Start, optional initial world generation approval, and historical prose confirmation semantics retain their separately accepted boundaries.
8. **Optional mechanics are upstream guardrails, not history vetoes:** A selected strict travel/rule option can guide or reject **ordinary uncommitted attempted actions** and shape narration **before** a new outcome is accepted. Explicit player-authored **Story** remains an authorial override; an accepted passage's grounded state assertions must not be retroactively blocked because they lacked a prior traversable edge, source custody, equipment slot or simulated prerequisite. Keep any genuinely required technical representability checks. The narrator may note a continuity concern, but must not change already accepted prose or invent repairs.
9. **History editing/Fork:** Keep Later Turns retains later current events even if causal setup is removed. Delete All After Point and committed Undo retain their approved explicit timeline boundaries, and Fork copies the selected current prefix. Reconstruct *what the remaining current events say*; do not preserve old passage revisions, auto-cascade-delete dependent later fictional events, or silently write compensating history.
10. **No new gameplay engine:** S05/S06 TypeScript maintains deterministic typed assertion/replay semantics and source grounding; S12 Go/SQLite maintains durable, version/epoch-fenced transactions and structural storage integrity. No second Go gameplay engine, novel LLM approval stage, obligatory character/world, checkpoint archive or mandatory simulations.

## Examples

- **Key history contradiction:** Turn 3 establishes Brass Key with Mara. A historical edit deletes that introduction; Turn 11 still establishes “Mara uses the Brass Key,” optionally giving key holder/location. Replay can derive a sparse Brass Key identity from the later assertion. Mara's implausible acquisition may remain a story continuity issue, **not** a reason to corrupt or reject the later current event.
- **Simple custody:** Rather than `TransferItem(key, from=Mara, to=Chest)` requiring old possession, record `SetItemHolder(key, Chest)`. A later accepted `SetItemHolder(key, Mara)` wins for current holder. UI inventories are derived from these assertions.
- **Movement:** When accepted narration establishes that Elian is in the tower, a `SetCharacterLocation(Elian, Tower)` event records that location; a prior missing path is a possible narrative continuity issue. A mere reference to Elian on the radio is **not** evidence he arrived.
- **Actual technical corruption:** An event with an uninterpretable required schema, a non-identifiable target, or an unresolvable payload structure **must** fail safely. Narrative exceptions never permit malformed storage or half-committed event data.

## Reconciliation of previous decisions

- **B4-D06 previously accepted a broad “preflight structural integrity” rejection:** **superseded in part**. Preflight is retained for payload representability, deterministic event folding and durable consistency, but **not** simulation-style dependencies (e.g., source holder must have owned the item, later item use needs a retained creation event, a fictional route must exist, or narrative cause must remain in prose).
- **B3-D06 correction-event validation:** maintain explicit Commit, provenance and atomicity, reinterpret “conflicts/dependencies” as **technical data structure/coherent projection** conflicts, not precondition verification.
- **B2-D08 fail-closed unsupported required-core event:** retained for true unprocessable event format/type, **not** fictional continuity or a missing introduction that a sparse identity can represent.
- **B6 original Batch 1:** original Option A for D01 proposed rejecting any deletion leaving required historical references; the user did **not** accept it. This accepted replacement D01 removes that fictional-prerequisite veto. D02/D03 remain **unapproved proposals** to be reframed in narrative-first terms.
- **Staging histories:** Earlier accepted simulation-like wordings in staging and architecture are preserved as dated decision provenance but **operative requirements must now follow this later explicitly approved model**. This ADR does not imply any staged idea was promoted to production.

## Explicit non-goals and open refinements

No automatic writing of narrative repairs, no guarantee of fictional consistency, no unconditional acceptance of uninterpretable event data, and no requirement to track every prose claim. Exact event type table, tombstone/sparse identity encoding, conflict UX, keyed relationship operations, and how selectable strict gameplay modes affect *pre-acceptance action attempts* remain engineering/domain refinements subject to this principle. Do not accidentally reinstate broad precondition-based rejection while implementing them.

## Decision history

- **2026-10-27:** B4-D06 accepted Option A for “structural integrity preflight,” with ambiguous phrasing that could reject later events after historical source deletion.
- **2026-10-28 — B6 Batch 1 originally proposed, unapproved:** D01 A reject dangling historical entity references, B name-based retarget, C cascade delete; D02 A atomic item custody and equipment; D03 A validated movement/presence. No B6 approvals yet.
- **2026-10-28 — User rejected simulation framing and explicitly adopted replacement:** User reasoned that the world tracker primarily serves story narration and that replay should not refuse a later key event when earlier origin is gone; proposed add/remove-style simpler assertions. Assistant explained declarative Set/Clear and keyed add/remove, not requiring source-state prerequisites. User approved and explicitly instructed updating all meaningful documents. **This B6-D01 is the first accepted B6 decision, replacing the earlier unapproved D01 proposal rather than accepting its old Option A.**
