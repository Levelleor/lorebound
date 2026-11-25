---
id: ADR-0067
type: adr
status: accepted
related:
- ADR-0074
- ADR-0071
- ADR-0069
- ADR-0068
- ADR-0070
- ADR-0065
- ADR-0066
- ADR-0061
- ADR-0062
- ADR-0063
- ADR-0064
- ADR-0020
- ADR-0054
- PRD-0038
supersedes: []
---

# Automatic Persistent Location Placement with Player Overrides

## Context

Approved design decision. This does not certify delivery. Later accepted constraints override only the clauses they address.

[Pinned source B8-D06](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/decisions/B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md) · approved at: 2026-10-31; approved by: requesting user (explicit Option B, automatic placement and free player repositioning)

## Later B9 Batch 2 operative supersession — 2026-10-31

**Later B9-D04 C override (2026-10-31):** [B9-D04 C](ADR-0074-all-coordinates-eligible-for-automatic-layout.md) retains B8-D06 B's automatic durable initial location placement and the player's freedom to reposition with explicit Commit, but **removes the earlier guarantee that a deliberately moved location is immune to future automatic accepted layout**. Store typed coordinates with no coordinate-author label and no permanent pin lock. Subsequent automatic changes require normal versioned, replayable, atomic spatial events, not redraw-time random shifts. Source-generated distinctions in older paragraphs below are original context, not a mandate for an author ledger or protected-pin state.


## Later B9-D01 no-author-label refinement — 2026-10-31

The user subsequently approved [B9-D01 A, qualified](ADR-0071-typed-spatial-coordinates-without-ai-player-authorship-labels.md), explicitly asking **not to distinguish player-authored versus AI-authored coordinates**. B8-D06 **B** still requires **automatic persisted initial location coordinates**, later user repositioning and no arbitrary movement of deliberate pinned positions. Do not add a per-coordinate author attribution field to meet this ADR's earlier “source/provenance” wording. Use only the **minimal current placement editability/protection semantics** needed for B8-D08's generated-only reconciliation, with exact encoding **unapproved and proposed for B9-D04**. Generated canvas positions do not, by themselves, establish canonical measured geography, travel cost or a road. Existing earlier approval history below is preserved.



## Subsequent accepted B8 Batch 3 refinements — 2026-10-31

The user's later explicit **B8-D07 A, B8-D08 A, B8-D09 A** approvals now settle the originally deferred design strategy: [D07](ADR-0068-deterministic-scoped-automatic-map-placement.md) uses **deterministic, local-frame-scoped automatic first placement**, preserving existing pins and grounded spatial constraints without a required extra model call; [D08](ADR-0069-provenance-aware-spatial-reconciliation-of-generated-placement.md) permits **provenance-aware reconciliation of only generated-only positions** with later accepted grounded geography, protecting deliberate player positions and never fabricating exact narrated distance; [D09](ADR-0070-atomic-canonical-location-creation-and-initial-placement.md) commits a resolved new location identity and its **system-generated initial typed map coordinate within the same atomic accepted creation batch**. These refine this still-binding **D06 Option B**, not a reversal to unplaced Option A. Later deliberate player map repositioning still requires explicit pending Commit/Discard. No implementation, B8 formal closure or staging promotion has been approved.



## Explicit approval and override provenance

**User's explicit 2026-10-31 selection:** “Review B8 Batch 2: B8-D04: A; B8-D05: A; B8-D06: B. Notes: Note: the region boundaries could change eventually so the boundaries are also a dynamic content which is subject for change eventually. Note: we want to just automatically place everything on the map, but user should be able to move the stuff however they like if they wish. Record only explicitly approved choices as Lorebound GitHub ADRs, preserve approval history, and continue B8.”

**B8-D06 Option B is ACCEPTED, not previously recommended A.** The user expressly wants *all new locations to appear on the map automatically* and *players free to move them*. This **supersedes the earlier “never automatically generate/persist coordinates” default** stated in [B7-D10](ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md), [B8-D01](ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md), [B8-D02](ADR-0063-geographic-separation-distinct-from-route-travel-geometry.md), [B8-D03](ADR-0064-versioned-spatial-assertions-and-explicit-map-edit-commit.md) and the original recommended D06 A. The [B8 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) retains the original proposed alternatives and approval chronology.

## Accepted decision — Option B, user clarified

**On acceptance/creation of a new location, automatically assign and durably record an initial map coordinate/placement, so the location appears on the unified spatial canvas without requiring the player to position it first. The player may later move/rearrange the pin freely via the already approved deliberate map-edit Commit flow.**

1. **Automatic first placement is intended:** A newly accepted location is not normally hidden or relegated to an unplaced organiser merely for lack of explicit geographic coordinates. The map system determines and **persists a generated initial placement** in the appropriate supported [B8-D01](ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md) local frame/containing group where known. The initial position must be stable across reopening, redraw and supported current history replay; it is not temporary random force-layout each time.
2. **Generated placement is map data, not a fictional claim of measured distance:** The user expressly chose committing generated **canonical map coordinates**, so do not rebrand them “noncanonical suggestions” to undo Option B. **However**, record an appropriate **system-generated/default-placement provenance distinct from story-established geographic facts and manual authorial positioning**. A generated coordinate is authoritative for **where the UI draws the node** but does not silently prove that the fiction established an exact metric distance, route, travel time, administrative membership, or in-universe coordinate survey. Prior accepted narrative location/distance constraints should inform initial layout where supported; do not mislabel invented geometry as a narrated fact.
3. **Authorial override is first-class:** A player can move placed locations and, where supported, groups however they prefer. Deliberate new placement/scale or group-footprint correction remains a noncanonical preview until **explicit player Approve/Commit** under B8-D03 and B3-D07, then replaces the current stored map placement. Do **not** automatically regenerate/reposition an already intentionally placed or player-adjusted pin merely because the map reopens or other story content changes. Inherited parent moves transform descendants coherently under B8-D01.
4. **Keep canvas meaningful:** Default automatic placement should aim for **coherent visible grouping and plausible relative scale/separation** using grounded setting context where available, not indiscriminate identical edge-length graph layouts. Generated map distance is not necessarily a narrative measurement; route-specific travel length, portal access and time/cost stay independent under B8-D02. The precise algorithm and any defaults for unknowable scales are deferred.
5. **Typed canonical persistence, not a sidecar map database:** Automatic initial placement produces **supported typed spatial state/assertion(s) in the one durable accepted current-world history/storage boundary**, with system-generated provenance; it is not a separate competing authoritative local graph layout. It must obey technical type/version, ordered replay, Go/SQLite transaction safety and idempotency. Unlike a **manual player map edit**, the initial **system-generated default placement** does **not** require the user to approve every generated position. This distinction does not bypass the required Commit/Discard boundary for *player-authored changes*.
6. **Separate visual geometry, containment and routes:** Automatic pin placement doesn't move characters, create a door or road, assign a region's **canonical containment parent**, overwrite an explicitly narrated distance or change the status of a bridge. Explicit accepted routes are still keyed logical edges [B8-D05](ADR-0066-stable-cross-frame-routes-with-grounded-door-and-portal-anchors.md). Mutable accepted region boundaries remain separate facts under [B8-D04](ADR-0065-mutable-spatial-region-footprints-separate-from-containment.md).
7. **Accepted prose and identity remain safe:** The engine owns stable IDs and spatial assertions; the narrator never receives raw IDs. If a new-location reference cannot be grounded or distinguished, an ambiguous **automatic extraction candidate** is silently discarded under B7-D03 C rather than creating an arbitrary new entity/position. A genuinely accepted new location receives its default map placement only after its identity is established.
8. **No general hidden world-rewriting:** The approval is **automatic initial map placement**, not blanket permission to regenerate all historical positions, shift player-placed geography in response to unrelated facts, auto-assign canon distances or commit further fictional state. Precise triggers for new locations introduced via lorebook, player creation and Quick Start remain follow-up integration work.

## Options considered and final disposition

- **A — not selected:** Keep every location without grounded coordinates in an unplaced organiser until a player deliberately places it. Contrary to the explicit desire to see everything automatically.
- **B — ACCEPTED:** Automatically assign and commit initial map coordinates and allow the user to reposition them freely. This is a **later explicit exception** to the earlier no-invented-canonical-positions language, scoped to generated map placement.
- **C — not selected:** Hide locations without grounded coordinates from the map/editor.

The original D06 B alternative warned that automatic coordinates can contaminate fictional geography. The accepted implementation must therefore **record that the coordinates are generated map placement, not misrepresent them as a narrator-established measurement**. This safeguard preserves the later user's direct selection rather than changing it to A.

## Deferred engineering contracts

Initial placement algorithm, visual scale defaults, generated-vs-established field provenance representation, first-placement transaction when no map frame exists, deterministic regeneration/Undo/Fork, player map-move interaction, system placement on migrations, deliberate overrides, group automatic layout and settings. No implementation, test result or extra AI inference requirement follows from this ADR.

## Traceability

[B8 review](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), [B7-D10](ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md), [B8-D01](ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md), [B8-D03](ADR-0064-versioned-spatial-assertions-and-explicit-map-edit-commit.md), [B8-D04](ADR-0065-mutable-spatial-region-footprints-separate-from-containment.md), [IDEA-0037](../product/PRD-0038-zoomable-node-map-canvas.md). Owners S04/S05/S06/S09/S11/S12.

## Decision history

- **2026-10-31:** B7-D10 accepted pinned positions, spatial meaning and suggested previously that unknown positions stay unplaced; B8-D01/D02/D03 Option A further specified frames and explicit player Commit. Those earlier statements remain part of their time-ordered approval history.
- **2026-10-31:** B8-D06 Options A/B/C proposed; **A was recommended**, B warned about invented canonical map geography. None initially approved.
- **2026-10-31:** User expressly selected **B8-D06 B** with additional direction to **automatically place everything on the map** and **allow unrestricted player repositioning**. This overrides the default unplaced-location recommendation. The user independently selected D04 A with **mutable boundaries** and D05 A. This ADR is design-only; no B8 closure or implementation authorised.
