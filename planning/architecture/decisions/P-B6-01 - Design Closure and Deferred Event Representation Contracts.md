---
type: architecture-decision
status: accepted
decision_id: "P-B6-01"
phase: "B6"
created: "2026-10-31"
updated: "2026-10-31"
approved_at: "2026-10-31"
approved_by: "requesting user (explicit separate closure confirmation)"
tags:
  - planning/architecture
  - pass-b
  - design-closure
  - architecture-decision
---

# P-B6-01 — B6 design closure; narrative-first world-state and cross-module facts

## Explicit approval and decision

**2026-10-31, distinct closure approval.** After the assistant reported **all ten numbered B6 architecture decisions resolved**, supplied a **design-only closure assessment**, stated that event schemas, ID binding, replay, UI and integration testing still remained, and asked **“Would you like me to record formal B6 design closure and open the next architecture pass, following the same process as B2–B5?”**, the requesting user replied: **“Sounds good proceed.”**

**Decision:** Formally close **Pass B6 — World State Integrity and Cross-Module Contracts Review** at **architecture design level only**, and open the next Pass B7 review with **unapproved** questions. Do not treat the B7 opening as approval of any B7 option, implementation instruction, staging-to-production promotion, runtime verification, release readiness or completed integration tests.

## B6 accepted decision inventory

| Decision | Original approval disposition | Current binding rule |
| --- | --- | --- |
| [B6-D01](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) | **Explicit user-directed replacement** of original unapproved D01 A/B/C | Accepted fiction/player corrections produce ordered, grounded declarative current-state assertions, **not simulated commands requiring fictional prior conditions**; sparse identities and technically safe replay. |
| [B6-D02](./B6-D02%20-%20One%20Item%20Identity%20and%20Declarative%20Equipment%20Placement.md) | **Revised Option A** | One stable item identity, one latest asserted physical placement; inventory/equipment are compatible projections, not separate item copies. |
| [B6-D03](./B6-D03%20-%20Grounded%20Declarative%20Location%20and%20Scene%20Presence.md) | **Revised Option A** | Grounded character physical position and scene presence, not inferred from mere mentions and not conditioned on prior route feasibility. |
| [B6-D04](./B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) | **Explicit user-directed identity isolation** | Internal IDs excluded from *all prose-producing* prompts; narration uses natural references, engine resolves privately; single model and single-pass options remain supported; no guessed identities. |
| [B6-D05](./B6-D05%20-%20Conditional%20Anatomy%20Linked%20Equipment%20Detachment.md) | **A, with explicit user-added prerequisite** | Clear an incompatible equipped assignment after anatomy change **only if real structured anatomy/body-part IDs and their slot linkage are actually implemented and active**. Free-text anatomy alone triggers nothing. Unknown item disposition remains unknown. |
| [B6-D06](./B6-D06%20-%20Flexible%20Declarative%20Character%20Status%20Assertions.md) | **A** | Optional flexible typed character status and sheet fields as current Set/Clear assertions; unknown versus zero/false/none preserved. |
| [B6-D07](./B6-D07%20-%20Declarative%20Mutable%20World%20Location%20and%20Route%20Facts.md) | **A** | Grounded current door/route/location/environment property and relationship assertions; future context may change, previously accepted travel is not rewritten. |
| [B6-D08](./B6-D08%20-%20Distinct%20Unknown%20Absent%20and%20Known%20Current%20Facts.md) | **A** | Distinguish unknown/unrecorded, explicit known absence and known values, with field-specific typed Clear semantics. |
| [B6-D09](./B6-D09%20-%20Preserve%20Ambiguous%20Story%20Facts%20Without%20Guessing%20IDs.md) | **A** | Commit only resolved, source-grounded, representable assertions; keep unresolved extraction candidates noncanonical and preserve otherwise valid story prose. |
| [B6-D10](./B6-D10%20-%20Entity%20Removal%20Distinct%20from%20Property%20Clearing.md) | **A** | RemoveEntity expresses current entity lifecycle; ClearProperty clears one field only. Later grounded re-establishment may reuse the stable identity without invented causal proof or history cascades. |

**All ten decisions explicitly approved.** Do not misrecord the initial B6-D01 A/B/C as accepted, confuse B6-D04 with an A/B/C selection, or silently erase B6-D05's separately approved conditional amendment. The [B6 source review](../Pass%20B6%20-%20World%20State%20Integrity%20and%20Cross%20Module%20Contracts%20Review.md) and individual ADRs preserve original proposed alternatives, date-stamped approvals and supersession history.

## Binding inherited contracts and supersessions

- **Story first, world tracking second:** The narration is primary accepted canon. Structured events track grounded supported facts for continuity, context, Lorebook and current UI. Fictional contradictions or missing earlier acquisition, holder, entity introduction, journey, key or route are not grounds for rejecting a structurally representable accepted fact.
- **Current-only history:** Under [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), retain only one current structured passage body and one current ordered event sequence per adventure; historical edits/Undo and Delete All After Point remove selected current data according to their earlier boundary decisions. No retained old passage/event revision or suspended-audit history.
- **Safety is technical, not fictional:** Replaying supported required-core typed events must be deterministic. Do not persist malformed/uninterpretable events, unidentified targets or unsafe partial batches. Sparse IDs are not corruption. No new Go gameplay engine.
- **Narrator-safe entity identity:** Stable IDs, internal alias maps and operation identifiers never enter prose-producing model prompts. Interpret natural-language references separately, or in single-pass proposals with natural references resolved afterward. Do not make a second AI model or mandatory extra AI pass necessary.
- **Player workflow:** B3-D06/D07 pending manual corrections, full-composer overlay and explicit Commit/Discard remain; automatic Quick Start and separate Custom Opening/optional AI worldbuilding acceptance boundaries remain under B5. Unresolved automatic extraction is *not* a mandatory player approval blocker.
- **Atomic persistence and evolution:** Current Go/SQLite commits use expected adventure version, library epoch, operation ID/idempotent receipts and all-or-nothing storage. B4-D04/B4-D07's meaning-preserving migration and fail-safe current event schema upgrade still apply.
- **Conditional anatomy:** Do **not** infer that proposed human/nonhuman anatomy feature or true slot-to-limb binding is implemented. The D05 automatic detachment rule remains disabled absent the actual structured feature. No item destination may be invented to tidy the tracker.

## Deferred contracts and evidence gates, not B6 closure blockers

1. **Event representation and projection:** Concrete event discriminated union/type registry, field-specific unknown/none/Clear, RemoveEntity and later re-establishment, keyed relations, equipment placements, typed status data, stable/sparse identities and deterministic TypeScript reducers.
2. **Interpretation and reference resolution:** Internal candidate identity lookup and grounding, same-name ambiguity handling, noncanonical unresolved proposal lifecycle and optional user-facing diagnostics without imposing a mandatory second model or blocking valid narration.
3. **Subsystem integration:** Scene/presence and movement model; conditional anatomy/equipment bindings when that separately accepted feature is actually built; route hierarchy/environment fields; plugin optionality and unknown core type handling.
4. **Implementation verification:** Real Wails v3/Go, browser TypeScript, SQLite current schema migration, stable identity replay after historical edits, idempotency receipts, expected-version/epoch races, full-overlay pending manual edits, one-model/single-pass narrator ID isolation, backup/restore, provider cancellation and multi-module regression tests. **No such tests are claimed complete.**
5. **Earlier feasibility work:** Prior B1 real-host and integration evidence gates remain outstanding. Later stages must not mistake a closed architecture decision set for implementation or release authorisation. All 52 accepted staged ideas remain in `planning/staging/` until separate explicit human approval to promote.
6. **Architectural provenance:** Old B2 and B4 design assumptions retain historical ADR text but are superseded by newer explicit B3/B6 approvals where they conflict. No retroactive approval of unchosen B6 alternatives.

## Closure decision and next pass

**Accepted:** Close B6 **design-only** on 2026-10-31 after distinct explicit user sign-off; open **B7** to review the deferred *event representation and narrative interpretation boundary* questions as **new unapproved choices**. The next pass may refine concrete design interfaces without reopening B6's narrative-first philosophy or implying implementation. Its alternatives require separate explicit approvals.

**Not accepted:** Build the feature, claim integration testing, promote the staged ideas, invent a persistent audit archive or mechanically veto existing fictional outcomes.

## Decision history

- **2026-10-28:** B6 opened with D01–D03 proposals. User redirected D01 to declarative narrative-first state, explicitly approved replacement.
- **2026-10-29:** User approved B6-D04 narrator/ID role isolation.
- **2026-10-30:** User explicitly selected revised D02 A and D03 A.
- **2026-10-31:** User selected D05 A **with implemented structured-anatomy prerequisite**, D06 A and D07 A; later separately accepted D08 A, D09 A and D10 A and requested a closure **assessment**, not closure.
- **2026-10-31 — Separate formal closure authorisation:** After assessment and an explicit question about formally closing B6 and opening the next pass, user answered **“Sounds good proceed.”** This record closes the design review only.
