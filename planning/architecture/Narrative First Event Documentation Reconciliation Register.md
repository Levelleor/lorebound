---
type: architecture
status: current
created: "2026-10-28"
updated: "2026-10-29"
tags:
  - planning/architecture
  - event-model
  - documentation-reconciliation
---

# Narrative-first event model — documentation reconciliation register

## Authoritative approved change

The requesting user explicitly approved the 2026-10-28 direction in [B6-D01 — Narrative-first declarative outcome events](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) and asked that all meaningful current project documents cease describing the event tracker as a mechanically strict simulation engine.

**Current rule:** Lorebound's world state is primarily **a replayable factual memory of accepted fiction for ongoing storytelling/narration**, not an authority that retroactively rejects accepted narrative outcomes due to missing old item possession, routes, prior “creation” story events, or fictional cause. Prefer typed **Create/Remove Entity, Set/Clear Property and keyed Add/Remove Relationship assertions**; later accepted assertions establish current recorded facts. Allow sparse stable identities and unknown missing details when an earlier origin disappears. Derive one current physical holder/place per item across inventory/equipment views. Preserve technical readability/typed schema, deterministic event ordering and replay, source grounding, atomic commit/version/epoch fencing, and explicit player Commit for manual edits. Optional strict travel/gameplay rules may influence **uncommitted action attempts/provisional narration**, never veto already accepted prose. No old story/event revision archive.

**Supersession:** The earlier B4-D06 broad structural-dependency rejection is explicitly narrowed; obsolete B2 immutable-audit/revision model was already replaced by B3-D04. Both old decisions retain original dated approval histories and links; only the **current operative semantics** have changed. B6-D01 is a user-directed replacement of the originally unapproved B6-D01 A/B/C proposals, not a claim that original Option A was selected.

## Entry points and architecture reviewed/reconciled

- [Root project README](../../README.md)
- [Planning guide](../Start%20Here.md)
- [Planning agent rules](../AGENTS.md)

- [Consolidated Subsystem Architecture](./Consolidated%20Subsystem%20Architecture.md)
- [Subsystem Mapping Register](./Subsystem%20Mapping%20Register.md)
- [Pass B1 - Architecture Foundations (Draft)](./Pass%20B1%20-%20Architecture%20Foundations%20%28Draft%29.md)
- [Pass B1 Feasibility Evidence and Closure Review](./Pass%20B1%20Feasibility%20Evidence%20and%20Closure%20Review.md)
- [Pass B2 - Canonical History Decision Review](./Pass%20B2%20-%20Canonical%20History%20Decision%20Review.md)
- [Pass B3 - Atomic Commit and Concurrency Contracts (Review)](./Pass%20B3%20-%20Atomic%20Commit%20and%20Concurrency%20Contracts%20%28Review%29.md)
- [Pass B4 - Current Canon Data and Replay Contract Review](./Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md)
- [Pass B5 - Starting World and First Turn Contracts Review](./Pass%20B5%20-%20Starting%20World%20and%20First%20Turn%20Contracts%20Review.md)
- [Pass B6 - World State Integrity and Cross Module Contracts Review](./Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md)

## Decision records clarified without erasing original approvals

- [B1-D03 - Gameplay and Durable Commit Authority](./decisions/B1-D03%20-%20Gameplay%20and%20Durable%20Commit%20Authority.md)
- [B1-D06 - Browser TypeScript Event Replay](./decisions/B1-D06%20-%20Browser%20TypeScript%20Event%20Replay.md)
- [B2-D01 - Immutable Outcome Events and Atomic Commits](./decisions/B2-D01%20-%20Immutable%20Outcome%20Events%20and%20Atomic%20Commits.md)
- [B2-D02 - Immutable History and Single Active Selection](./decisions/B2-D02%20-%20Immutable%20History%20and%20Single%20Active%20Selection.md)
- [B2-D03 - Turn-0 Replay for Authoritative Reconstruction](./decisions/B2-D03%20-%20Turn-0%20Replay%20for%20Authoritative%20Reconstruction.md)
- [B2-D04 - Retained History and Suspended Unrepresentable Effects](./decisions/B2-D04%20-%20Retained%20History%20and%20Suspended%20Unrepresentable%20Effects.md)
- [B2-D06 - Versioned Event Contracts and Deterministic Compatibility](./decisions/B2-D06%20-%20Versioned%20Event%20Contracts%20and%20Deterministic%20Compatibility.md)
- [B2-D08 - Fail-Closed Unsupported Core Event Replay](./decisions/B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md)
- [B3-D01 - Prepared Atomic Canonical Commit Envelope](./decisions/B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md)
- [B3-D03 - Atomic Historical Selection and Undo](./decisions/B3-D03%20-%20Atomic%20Historical%20Selection%20and%20Undo.md)
- [B3-D04 - Single Current History Without Revisions](./decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md)
- [B3-D06 - Pending Manual State Corrections and Explicit Commit](./decisions/B3-D06%20-%20Pending%20Manual%20State%20Corrections%20and%20Explicit%20Commit.md)
- [B4-D01 - Total Ordering of Current Outcome Events](./decisions/B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md)
- [B4-D02 - Undo and Truncation Boundaries for Independent Corrections](./decisions/B4-D02%20-%20Undo%20and%20Truncation%20Boundaries%20for%20Independent%20Corrections.md)
- [B4-D03 - Consistent Version Tagged Canonical Reads](./decisions/B4-D03%20-%20Consistent%20Version%20Tagged%20Canonical%20Reads.md)
- [B4-D05 - Independent Fork from Current Adventure Prefix](./decisions/B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md)
- [B4-D06 - Preflight Structural Integrity of Current History Mutations](./decisions/B4-D06%20-%20Preflight%20Structural%20Integrity%20of%20Current%20History%20Mutations.md)
- [B5-D01 - Durable Minimal Turn-0 Baseline](./decisions/B5-D01%20-%20Durable%20Minimal%20Turn-0%20Baseline.md)
- [B5-D02 - Grounded Initial Fact Extraction](./decisions/B5-D02%20-%20Grounded%20Initial%20Fact%20Extraction.md)
- [B5-D08 - Narrative Only Unsupported Opening Facts](./decisions/B5-D08%20-%20Narrative%20Only%20Unsupported%20Opening%20Facts.md)
- [P-B1-02 - Design Closure with Deferred Integration Gates](./decisions/P-B1-02%20-%20Design%20Closure%20with%20Deferred%20Integration%20Gates.md)
- [P-B2-01 - Design Closure and Deferred Transaction Contracts](./decisions/P-B2-01%20-%20Design%20Closure%20and%20Deferred%20Transaction%20Contracts.md)
- [P-B3-01 - Design Closure and Deferred Data Contracts](./decisions/P-B3-01%20-%20Design%20Closure%20and%20Deferred%20Data%20Contracts.md)
- [P-B4-01 - Design Closure and Deferred Initialization Contracts](./decisions/P-B4-01%20-%20Design%20Closure%20and%20Deferred%20Initialization%20Contracts.md)
- [P-B5-01 - Design Closure and Deferred World Integrity Contracts](./decisions/P-B5-01%20-%20Design%20Closure%20and%20Deferred%20World%20Integrity%20Contracts.md)
- [B6-D01 - Narrative First Declarative Outcome Events](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md)

Earlier approved ADRs remain accepted **as historical records**, with explicit current-governing supersession notes. There was no new approval of their original, now-contradictory optional details.

## Accepted staging idea notes aligned

- [Event-Sourced World History](../staging/Event-Sourced%20World%20History.md)
- [Persistent Items and Inventory Transfers](../staging/Persistent%20Items%20and%20Inventory%20Transfers.md)
- [LLM State Interpreter and Proposed Operations](../staging/LLM%20State%20Interpreter%20and%20Proposed%20Operations.md)
- [Typed Tool Rejection and Narrative Repair](../staging/Typed%20Tool%20Rejection%20and%20Narrative%20Repair.md)
- [Deterministic Adventure Coordinator](../staging/Deterministic%20Adventure%20Coordinator.md)
- [Configurable Travel Graph Rules](../staging/Configurable%20Travel%20Graph%20Rules.md)
- [Character Presence and Current Scene](../staging/Character%20Presence%20and%20Current%20Scene.md)
- [Slot-Based Equipment and Body Diagram](../staging/Slot-Based%20Equipment%20and%20Body%20Diagram.md)
- [Configurable Anatomy and Transformations](../staging/Configurable%20Anatomy%20and%20Transformations.md)
- [Freeform Player Action Modes](../staging/Freeform%20Player%20Action%20Modes.md)
- [Structured UI Game Actions](../staging/Structured%20UI%20Game%20Actions.md)
- [AI World Discovery and Expansion](../staging/AI%20World%20Discovery%20and%20Expansion.md)
- [Persistent Location State and Travel Interactions](../staging/Persistent%20Location%20State%20and%20Travel%20Interactions.md)
- [Hierarchical World Locations](../staging/Hierarchical%20World%20Locations.md)
- [Entity-Based Lorebook](../staging/Entity-Based%20Lorebook.md)
- [Automatic Character Sheet Tracking](../staging/Automatic%20Character%20Sheet%20Tracking.md)
- [Customisable Character Status Sheets](../staging/Customisable%20Character%20Status%20Sheets.md)
- [Native Gameplay Capability Registry](../staging/Native%20Gameplay%20Capability%20Registry.md)
- [Optional RPG Mechanics Plugins](../staging/Optional%20RPG%20Mechanics%20Plugins.md)
- [Quick Start and Custom Story Openings](../staging/Quick%20Start%20and%20Custom%20Story%20Openings.md)
- [AI-Generated Starting Lorebook and World](../staging/AI-Generated%20Starting%20Lorebook%20and%20World.md)
- [Historical Edit Confirmation and Bulk Truncation](../staging/Historical%20Edit%20Confirmation%20and%20Bulk%20Truncation.md)
- [Retry Undo and Alternative Continuations](../staging/Retry%20Undo%20and%20Alternative%20Continuations.md)
- [Snapshots and Incremental State Rebuild](../staging/Snapshots%20and%20Incremental%20State%20Rebuild.md)
- [Versioned Text Blocks and Revision IDs](../staging/Versioned%20Text%20Blocks%20and%20Revision%20IDs.md)
- [Direct Editable Prose Document](../staging/Direct%20Editable%20Prose%20Document.md)
- [Browser-Persistent Story Database](../staging/Browser-Persistent%20Story%20Database.md)
- [Adventure Save and Export Management](../staging/Adventure%20Save%20and%20Export%20Management.md)
- [Configurable Generation Pipeline Strategies](../staging/Configurable%20Generation%20Pipeline%20Strategies.md)
- [Episodic Memory Retrieval](../staging/Episodic%20Memory%20Retrieval.md)
- [Shared PC and NPC Character Entities](../staging/Shared%20PC%20and%20NPC%20Character%20Entities.md)
- [Token-Budgeted Context Builder and Inspector](../staging/Token-Budgeted%20Context%20Builder%20and%20Inspector.md)
- [Zoomable Node Map Canvas](../staging/Zoomable%20Node%20Map%20Canvas.md)
- [Manual Generation Branches](../staging/Manual%20Generation%20Branches.md)
- [Reusable Scenario Templates and Placeholders](../staging/Reusable%20Scenario%20Templates%20and%20Placeholders.md)
- [Automatic Long-Term Story Summaries](../staging/Automatic%20Long-Term%20Story%20Summaries.md)

The staged ideas remain **staging**, not promoted into production or claimed implemented. Applicable operative “Accepted direction” and present-behaviour language in the central event, inventory, interpreter, rejection, travel, coordinator, history/replay documents was revised; historical accepted alternatives/decision logs were preserved as provenance.

## Historical/non-operative material deliberately not rewritten as present-tense policy

Brainstorm session transcripts, unaccepted Inbox candidates and original date-stamped quotations of past proposal/approval decisions are historical records. Their old possibilities are **not** current implementation instructions, even when they discuss simulation, retained revisions or inverse events. This register and B6-D01 establish current authoritative semantics; do not re-label candidate ideas as accepted or edit past quotes to fabricate retroactive approval.

## Later accepted identity resolution refinement — 2026-10-29

Following the explicit original narrative-first change, the user raised a risk of internal stable entity IDs appearing in roleplay passages if passed to the same model. The user then requested that the recommended narrator/identity separation be documented for future adherence. [B6-D04 — Narrator-safe entity references and internal identity resolution](./decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) is the accepted follow-up.

- **Prose-generating narrator contexts contain no internal IDs or ID↔name mapping tables.**
- Narrative refers to natural names/descriptions; engine-side resolution determines stable IDs based on context, or leaves ambiguous facts unresolved.
- Only isolated non-narrating interpretation/resolution may receive internal candidate IDs, even when sharing a selected model with narration.
- Single-pass prose+event generation remains supported with natural-language candidate references; no mandatory second model/pass.
- Relevant updated operational notes: context builder, interpreter, pipeline strategies, task routing, coordinator, Lorebook, consolidated architecture, planning instructions, B6-D01 and active B6 review.
- B6-D02/D03 remain **unapproved**; this documented identity boundary does not approve their schema/placement/presence choices.

## Follow-up contracts still open (NOT approved by this reconciliation)

- B6-D02: exact item current-placement and equipment assertion schema/view projection.
- B6-D03: exact character-location and scene-presence assertion/refinement contract.
- Other technical event serialization, optional mechanic attempt limits, sparse entity encoding/tombstone semantics, idempotent replays and user-facing continuity warnings require engineering refinement.
- No implementation, integration tests, staging-to-production promotion, feature release or completed mechanical correctness proof. B1 real host/provider/SQLite integration gates remain outstanding.

## Validation and status

This is a **documentation/design reconciliation** of the explicit user decision, not a source-code change. Changes were written to the connected Lorebound GitHub repository on `main`. The set above identifies the meaningful active sources actually updated, rather than claiming that historical brainstorms or unapproved Inbox notes were rewritten. No runtime test pass is claimed.

## Review history

- **2026-10-28 — Explicit user approval:** Narrative-first declarative assertions selected instead of precondition-first simulation; user requested all meaningful affected documentation be reconciled.
- **2026-10-28 — Reconciliation:** Created accepted [B6-D01](./decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md), replaced B6-D01 initial unapproved proposals in the current review with accepted user direction, aligned architecture/ADR/staging/entry-point documents, retained human approval provenance and unaccepted future choices.
