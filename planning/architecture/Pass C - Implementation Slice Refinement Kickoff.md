---
type: architecture
status: planning-open
phase: "C"
created: "2026-11-01"
updated: "2026-11-01"
tags:
  - planning/architecture
  - pass-c
  - implementation-refinement
---

# Pass C — Implementation Slice Refinement Kickoff

> **PASS C BATCH 1 ACCEPTED, NOT IMPLEMENTATION APPROVED.** This kickoff is authorised by the user's instruction on 2026-11-01 to “Proceed to establishing pass c. Explain what we'll do and which [topics] we'll want to cover overall.” It proposes a review method and a complete topic map. **C-D01 A establishes the first story-loop refinement priority; C-D02 A establishes slice traceability; C-D03 A establishes verification evidence rules. No specific proposed slice is approved for implementation and no staging → production promotion follows.**

## Where we are

- [Pass A closure audit](./Pass%20A%20Closure%20Audit.md): **52 explicitly accepted ideas in staging**, each mapped to one of **12 logical subsystems** and traced in the [mapping register](./Subsystem%20Mapping%20Register.md). None is automatically implementation-ready.
- [Consolidated subsystem architecture](./Consolidated%20Subsystem%20Architecture.md): S01–S12 ownership and top-level interface responsibilities. Its earlier dated statements must be read together with **later explicit B1–B9 decisions** where they supersede older assumptions.
- [P-B9-01 closure](./decisions/P-B9-01%20-%20B9%20and%20Pass%20B%20Design%20Closure%20with%20Deferred%20Spatial%20Migration.md): B1–B9 and **Pass B are closed at architecture-design level**, not implemented. B9-D12 spatial schema/event migration remains **deferred, with instruction to do nothing on this migration yet**. B9-D13 B accepted minimal coordinator-led nonblocking conflict notification; B9-D24 revised B accepted basic pointer-only map with **no map-specific keyboard interaction**.
- The stage-gated workflow in [planning rules](../AGENTS.md) and [repository instructions](../../AGENTS.md) remains authoritative: staging → production requires **separate human readiness approval** of each original idea note; implemented specs require **verified code/behaviour**. Pass C planning approval does not advance an idea on its own.
- No code, real-host integration, passing mock suite, migrated spatial schema, staging promotion or release is evidenced by these planning documents.

## What Pass C accomplishes

Translate the closed **architecture decisions** into small, dependency-aware, reviewable **implementation slices** and refine their underlying **original staging idea notes**. The intended outputs are:

1. **Traceable slice catalogue:** Each proposed slice has a stable planning identifier (proposed `C-SL-01` etc.), owner subsystem(s), affected original `IDEA-` references, accepted `B*-D*` and `P-B*` decisions, inputs/outputs, prerequisites and explicit non-goals. Slice IDs organise work and are **not** new approved idea IDs.
2. **Implementable behavioural contracts:** Describe concrete externally observable behaviour, typed interfaces/data ownership where necessary, normal and failure paths, concurrency/rollback/Undo/Retry, and acceptance criteria with how they would be verified. Keep technology/filename choices proposed until approved.
3. **Delivery dependency plan:** Distinguish foundations, smallest end-to-end story slice and optional/later feature expansions. Avoid an enormous all-features-first dependency chain; keep a running "what can be developed next?" queue.
4. **Evidence and risk plan:** Specify **future** mocked/unit/contract tests and separate real Wails/Go/SQLite/browser/provider feasibility gates without claiming any test ran or introducing mandatory live-AI scenario tests contrary to B9-D03 B/D06 A.
5. **Explicit readiness decisions:** Review small batches, preferably **three substantive slice decisions at a time**. A choice may be `accept`, `revise` or `defer`; carry forward all approvals, conditions, alternatives and supersessions. **Explicit promotion approval** is still required before moving an original staging idea to `planning/production/`.

## Topics to cover overall

The following **ten proposed workstreams** together span the existing S01–S12 ownership map, but are **not** ten mandatory implementation phases or new subsystem definitions.

| Track | Topic and primary subsystems | Refinements needed |
| --- | --- | --- |
| **C-T01** | Host, runtime and secrets (**S01**) | Wails v3 headless Go launcher; SvelteKit browser client startup; narrow service bridge; loopback/origin handling; browser session/tab lifecycle; OS credential vault and fallback; packaging evidence gates. No app login, new Node server or Go AI HTTP proxy. |
| **C-T02** | Durable library and transactions (**S12, S02**) | Go-managed SQLite library, story/draft transaction envelopes, expected-version/epoch/idempotency fencing, concurrent tabs, library operations and consistent **whole-library** backup/restore; do **not** implement deferred B9-D12 spatial migrations. |
| **C-T03** | Canonical history, events and replay (**S05**) | Current-only accepted narrative/event history, stable identities, typed declarative Set/Clear/create/remove/keyed relations, accepted passage IDs/order, deterministic reducers/projections, Undo/History Edit/Fork, dependent-data invalidation. No immutable parallel revision archive or simulation-style retroactive veto of accepted fiction. |
| **C-T04** | Coordinator, rules and optional capability interfaces (**S06**) | Turn lifecycle, actor/mode semantics, pending vs accepted data, validation/technical-commit division, plugin capability boundaries, rejection/repair budgets, version-conflict and cancellation; no extra model reviewer, duplicate Go gameplay engine or plugin direct canon writes. |
| **C-T05** | Direct provider connectivity and generation (**S07, S08**) | Cloud/local adapters via browser HTTP, profiles/secrets/capability-aware controls, stream/cancel/errors, selectable one-pass/multistage pipelines, model routing, provisional narrative+typed extraction, natural references and private stable-ID binding; no automatic provider fallback or mandatory real-model scenario tests. |
| **C-T06** | Adventure creation, library and first turn (**S02, S03, S06**) | Blank/Quick Start/custom/guided openings, scenario templates, first narrative turn, pre-turn optional worldbuilding, failure and retry behaviour, fork/duplicate/delete, no phantom accepted turn or blank committed adventure on failed generation. |
| **C-T07** | Lorebook, memory and context (**S09**) | Entity lore, conditional selection, source-aware summaries and episodic retrieval, token budget/context inspector and author notes, invalidation after historical editing; do not silently make stale derived summaries canonical or require embeddings/RAG. |
| **C-T08** | Characters, world and equipment (**S10, S11**) | Universal characters, Playing As vs physical presence, statuses, anatomy/equipment conditional mechanics, unique item custody, grouped locations, discovery, environment, separate route/containment vs coordinates and optional travel affordances; story-first tracked assertions, not compulsory RPG simulation. |
| **C-T09** | Story UI, editing and simple map (**S03, S04, S11**) | Chat action modes, direct prose editing, draft/autosave, shared pending composer Commit/Discard overlay, status/lore views and **basic** map pan/zoom/hover/select with stable nested coordinates, first-pin placement and simple overlap separation. No visible scale bar, map keyboard controls, sophisticated cartography tools or map-specific Commit bar. |
| **C-T10** | Integration, verification and delivery (**all S01–S12**) | Define mocked success/error/history test matrix; distinguish mocked contract evidence from real Wails/SQLite/browser checks. Check cross-tab stale writes, backup consistency, secrets redaction, accepted-event atomicity, deterministic replay, cancellation and browser restrictions. Plan the first usable vertical slice and staged release/readiness gates; no claims tests passed. |

## Proposed dependency order (review, not execution approval)

1. **Foundation contracts:** Host/service/secret boundaries (T01), canonical SQLite transaction boundary (T02), typed current events and pure reducers (T03).
2. **First complete story loop:** Basic adventure shell (T06) + coordinator (T04) + a mocked provider path (T05) + primary action/story presentation (T09): `create adventure → submit Do/Say/Story/Continue → provisional narrative/event proposal → validate/accept once → atomic commit → reopen/replay`. Start with a **deterministic mocked provider** and real pure domain logic; no claim that a real AI or real Wails/SQLite integration has been exercised.
3. **Editing and recovery:** Drafts, retry/cancel, stale concurrent tabs, committed Undo/Fork/history editing, replay and backup/restore **without** implementing spatial migrations (T02/T03/T04/T09).
4. **World richness:** Lore/context (T07), character and item continuity (T08), local/cloud provider options (T05) and adventure-start variants (T06).
5. **Map and expanded UI:** Durable world/map geometry in the existing story transaction (T08/T09), with minimal visual controls and already approved defaults/overlap rules; preserve the user-specified basic scope.
6. **Integrated readiness:** Full traceability and separately labelled mock verification vs real-host/platform feasibility evidence (T10). Future implementation order can be reorganised through explicit slice review.

The **first-vertical-slice definition and ordering are proposals**, not settled approvals. Keep plumbing narrow: TypeScript owns narrative domain decisions and deterministic current projections; Go owns technical atomic persistence; the browser owns provider HTTP. Introduce no second canonical store.

## Review packet for every slice

Each proposed slice record should contain:

- **Purpose / player-observable result**, one smallest cohesive behaviour and named non-goals.
- **Traceability:** original immutable `IDEA-` files, subsystem owners, binding architecture ADRs including later overrides, related slices.
- **Detailed contract:** entry points and typed inputs/outputs, current-state meaning, canonical vs drafts vs caches, identity/provenance, storage/AI/UI authorities.
- **Normal and adverse cases:** invalid/missing inputs, stale versions, epoch changes, retry/idempotency, cancellation/tab loss, model failure, history edits, security/trust or unavailable plugin as relevant.
- **Acceptance criteria and evidence labels:** objective future test cases (pure unit, mocked boundary/contract, optional manual UI checks) plus separate real-host feasibility gates. Mark every proposed test **NOT RUN** until observed.
- **Dependencies, exclusions, implementation estimate** (if available) and explicit human decision. Keep non-essential platform/library preferences open unless needed for a particular slice.
- **Stage action:** If explicitly approved as implementation-ready, refine and move the **same relevant original staging idea file(s)** into production only with **separate promotion approval**, preserving IDs/approval history. Cross-cutting slices can reference multiple ideas; avoid silently promoting all of them just because a shared slice is approved.

## First review to start Pass C

**C0 / Batch 1 (three decisions ACCEPTED, original alternatives preserved):**

1. **C-D01 — First vertical slice boundary:** Recommend the minimal runnable mock-driven single-adventure accepted story turn across host/UI, coordinator, typed event and Go transaction adapters, without maps, complex lore or multiple provider families initially. Alternative: begin from a self-contained platform-only spike or attempt the whole feature set at once. This is a prioritisation decision, not permission to code.
2. **C-D02 — Slice and idea traceability policy:** Recommend a lightweight `C-SL-` slice register that traces multiple existing `IDEA-` files and ADRs while preserving original staged notes; no artificial new idea IDs or automatic production promotion. Alternative: review one `IDEA-` document at a time before cross-cutting work, or aggregate all into one monolith.
3. **C-D03 — Verification/readiness scope:** Recommend mocked/unit/contract acceptance criteria per slice, explicitly **not run** until executed, while preserving separate future real-host Wails/Go/SQLite and browser-provider feasibility gates. No mandatory live AI model scenario suite. Alternative: mock-only evidence is treated as sufficient for real integration, or require live AI tests before a planning decision.

**Explicit acceptance, 2026-11-01:** User selected **C-D01 A, C-D02 A, C-D03 A**, requested only explicitly approved ADRs and continuation in three-decision batches. See [C-D01](./decisions/C-D01%20-%20First%20Mock%20Driven%20End%20to%20End%20Story%20Turn%20Slice.md), [C-D02](./decisions/C-D02%20-%20Traceable%20Slice%20Register%20With%20Original%20Idea%20Identity.md), [C-D03](./decisions/C-D03%20-%20Mocked%20Contract%20Criteria%20With%20Separate%20Real%20Host%20Gates.md), and the [proposed slice register](./Pass%20C%20-%20Implementation%20Slice%20Register.md). Original choices 1–3 above remain review history. No specific slice was accepted as production-ready, no ideas were promoted and no tests were run.

## Pass C Batch 2 — proposed C-D04–D06, NOT approved

### C-D04 — Minimal first action workflow

**Question:** What player-visible action should the first mock-driven complete story-loop slice use?

- **A (recommended, proposed):** Start with **Story-mode** single freeform submitted passage/action and one deterministic mocked provisional narrative+optional typed world assertions, then accepted current story commit/reopen/replay. Preserve Do/Say/Continue as accepted future modes, but do not require all four controls or full actor selection in the first smallest slice. This isolates the history/commit architecture with fewer actor prerequisites. **Trade-off:** First slice does not yet prove the full action-mode UI.
- **B (proposed):** Require **all Do/Say/Story/Continue modes** with their full actor semantics in the very first integrated slice. **Trade-off:** More representative, but substantially more prerequisites and branching.
- **C (proposed):** Build only a static read-only story display initially, with no action/accept/commit/replay loop. **Trade-off:** Easier UI, fails the accepted complete vertical-slice purpose.

The choice would narrow C-D01's accepted **complete story-loop target**, not alter existing IDEA-0002 or B1–B9 mode semantics. No implementation approval.

### C-D05 — Mock transaction boundary in the first slice

**Question:** How should the initial mock-first story loop represent the Go service authority while keeping real integration evidence separate?

- **A (recommended, proposed):** TypeScript coordinator depends on a **narrow typed persistence interface** with expected adventure version, library epoch, idempotent operation identity, accepted event batch and typed result/errors. Use an **in-memory deterministic contract mock** for first-loop tests. Plan a separately identified Wails/Go/SQLite adapter and integration feasibility check as the next delivery gate, not as fictitious proof from the mock. **Trade-off:** Two adapters eventually; clear technical ownership and mock evidence.
- **B (proposed):** Let the browser's local array/IndexedDB become a second canonical store for the first slice, with unspecified later Go reconciliation. **Trade-off:** Faster prototype, violates the accepted single canonical storage model.
- **C (proposed):** Require completed real Wails+SQLite integration before **any** first story-loop mock or domain acceptance criteria can be defined. **Trade-off:** Avoids mocks, unnecessarily blocks contract refinement and conflicts with C-D03's mock-first planning.

This does **not** approve executable mocks or real adapter code yet.

### C-D06 — Minimal current-history payload for first acceptance

**Question:** What must the initial accepted transaction preserve to prove deterministic reconstruction without prematurely choosing the entire world schema?

- **A (recommended, proposed):** Commit a **stable adventure identity, accepted story passage/turn identity and order, story text, minimal typed event envelope/source ordering, and version metadata** sufficient for deterministic current-history reconstruction. Permit an **empty supported world-effect batch** when the accepted prose establishes no trackable state. Avoid invented map/character/item facts. Expand to typed character/world effects in later slices. **Trade-off:** Small but real canonical foundation.
- **B (proposed):** Require every supported character, item, location, map geometry, inventory, lore and anatomy schema in the first commit. **Trade-off:** Delays the simplest complete story loop.
- **C (proposed):** Persist only unversioned prose strings and reconstruct no stable turn/event identity or current history. **Trade-off:** Simpler demo, fails accepted deterministic replay/history and transaction boundaries.

The choice is a **slice-scope proposal**, not approval of concrete serialized event fields or schema migration.

**Batch 2 current status:** C-D04, C-D05, C-D06 **unapproved**; no ADRs created. No code, tests, staging promotion or implemented specs.

## Open exceptions and safeguards

- **B9-D12 remains deferred:** Do not design, implement or test spatial schema/event migrations yet. Keep any existing general migration concepts as historical constraints, not approval to proceed.
- **B9-D13 accepted B:** Coordinator handles best valid geography and emits a minimal general nonblocking notification on unresolved conflict, not an advanced map UI.
- **B9-D24 revised B:** No map-specific keyboard interaction, unrelated chat controls unchanged.
- B1 feasibility/release checks remain unverified until separately executed. A mocked test plan is not a passed test; design closure is not an integration demonstration.
- No new login/authentication layer, server-side model proxy, forced AI fallback, uncontrolled plugin authority or independent browser canonical world database.
- This Pass C kickoff and Batch 1 review create **no application source files, no production ideas, no specs and no implementation-ready slice approvals**. Three separate Pass C architectural refinement ADRs are now accepted.

## History

- **2026-10-24:** Pass A closed with 52 accepted staging ideas mapped to 12 logical subsystems.
- **2026-11-01:** P-B9-01 separately closed B9 and Pass B at design level; D12 spatial migration remains deferred.
- **2026-11-01:** User instructed the establishment and explanation of Pass C. This **planning kickoff** and its proposed topics/review method were opened, not approved for implementation or production promotion.

- **2026-11-01 — Batch 1 approval:** User explicitly chose C-D01 A, C-D02 A, C-D03 A. Three accepted ADRs created and a preliminary proposed `C-SL-` register opened. Batch 2 D04–D06 remain unapproved; no implementation, tests or staging → production promotion authorised.
