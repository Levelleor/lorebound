---
type: guide
status: current
created: 2026-10-16
updated: 2026-10-31
tags:
  - planning/guide
---
# Start Here

## Current B9 Batch 10 and assessment, NOT closure — 2026-11-01

[**D28 B**](architecture/decisions/B9-D28%20-%20Immediate%20View%20Recenter%20on%20Playing%20As%20Selection.md): immediately recenter an already-open map when the selected **Playing As** character changes, to their known position or map default. Do not continuously follow ordinary movements. [**D29 A**](architecture/decisions/B9-D29%20-%20Stable%20Nearest%20Free%20Pin%20Offset%20Ordering.md): stable ID ordering and deterministic minimal nearest-free offset for totally overlapping pins at minimum zoom, only in accepted spatial transactions; never on zoom or redraw. [**D30 A**](architecture/decisions/B9-D30%20-%20Design%20Only%20Completeness%20Assessment%20Before%20Separate%20Closure%20Approval.md): documentation-only audit, recorded in [B9 assessment](architecture/Pass%20B9%20-%20Design%20Completeness%20Assessment%20%28Not%20Closure%29.md), **not formal closure**. **B9 remains `in-review`** pending separate explicit closure approval; D13 coordinator conflict handling still requires clarification. D12 stays deferred with no spatial migration work; D24 deferred, **no map keyboard interaction**. No implementation, tests, staging promotion or release evidence. Earlier notes below preserve dated history.

## B9 Batch 9 current decisions — 2026-11-01

[D25 A](architecture/decisions/B9-D25%20-%20Disposable%20Map%20Pan%20and%20Zoom%20View%20State.md) keeps pan/zoom temporary. [D26 qualified A](architecture/decisions/B9-D26%20-%20Player%20Location%20First%20Map%20View%20with%20Default%20Coordinate%20Fallback.md) opens the map at the selected Playing As character's known current location, or default map coordinates if unknown/unselected. [D27 qualified C](architecture/decisions/B9-D27%20-%20Minimal%20Canonical%20Pin%20Separation%20at%20Minimum%20Zoom.md) permits only a small deterministic nearest-free-side adjustment when **location pins entirely overlap at the farthest zoom-out**, committed with an accepted spatial update, never on zoom/redraw. This does not move region boundaries, routes, containment or characters. The original D27 broad C wording is not approved. **D12/D13/D24 remain deferred**: no spatial migration work, coordinator conflict presentation awaits clarification, no keyboard map interactions. B9 remains in-review; Batch 10 D28–D30 unapproved, no implementation/tests/promotion.

## B9 Batch 8: no scale UI, simple rendering, no map keyboard interaction — 2026-11-01

User explicitly accepted [B9-D22 C](architecture/decisions/B9-D22%20-%20No%20Visible%20Geographic%20Scale%20Indicator.md): **no visible map scale bar or metres indicator** (internal typed geographic scale remains). [B9-D23 A, qualified](architecture/decisions/B9-D23%20-%20Simple%20Disposable%20Viewport%20Rendering%20Optimisation.md) requires **the simplest adequate disposable viewport drawing**, adding only lightweight offscreen filtering/zoom simplification when needed, **not advanced rendering infrastructure** and never changing canon for performance. **B9-D24 DEFERRED, no ADR:** user expressly said **“No keyboard interaction for the map.”** Record this as current map scope, not acceptance of D24 A/B/C or a change to other chat keyboard controls. **D12 remains deferred with no spatial migration work, D13 remains deferred for coordinator conflict clarification.** Batch 9 D25–D27 remains unapproved, B9 `in-review`, no implementation/tests/promotion. Older sections preserve approval history.

## B9 Batch 7 approved, with spatial estimate and default fallback — 2026-10-31

User expressly selected [B9-D19 A](architecture/decisions/B9-D19%20-%20Stable%20Default%20Root%20Frame%20and%20Initial%20Geographic%20Scale.md) (stable root local frame and default scale), [B9-D20 A qualified](architecture/decisions/B9-D20%20-%20Best%20Effort%20Spatial%20Estimates%20with%20Deterministic%20Default%20Fallback.md) (**for unambiguously resolved places, permit a best-effort geographic numeric guess and use a deterministic default if it fails; the player may correct it**) and [B9-D21 A](architecture/decisions/B9-D21%20-%20Basic%20Map%20Hover%20Labels%20and%20Existing%20Location%20Detail%20Selection.md) (minimal known-name hover label, selection focuses existing details). D20 is a later qualification of previous B9-D10 prohibition on guessing unsupported **geographic numeric** values, **not permission to guess ambiguous entity IDs or invent narrative routes**. Keep results typed, atomic, persistent and replayable, not rerolled on map redraw. **B9-D12 remains deferred with no spatial migration work; B9-D13 remains deferred pending coordinator-conflict clarification.** Batch 8 D22–D24 is unapproved; B9 remains `in-review`. No code, tests, stage promotion or chapter closure. Earlier sections are chronological history, not current restrictions where superseded.

## B9 Batch 6 accepted with basic map UX and existing Commit location — 2026-10-31

User explicitly accepted [B9-D16 A, qualified](architecture/decisions/B9-D16%20-%20Basic%20Map%20Navigation%20and%20Shared%20Composer%20Commit%20Controls.md): the initial map interface supports **basic panning (“planning” interpreted as pan), zooming, hovering and simple inspection**, not advanced GIS/cartography/editor toolbars. Any supported deliberate map correction uses the **existing primary chat composer overlay with accessible Commit/Discard controls over the action text input**, preserving [B3-D07](architecture/decisions/B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) and blocking chat use while pending. The map does not have a new Commit location. [B9-D17 A](architecture/decisions/B9-D17%20-%20Deterministic%20Atomic%20Batch%20Placement%20of%20Multiple%20New%20Locations.md) accepts deterministic batch initial placement and one atomic accepted transaction for multiple grounded new locations. [B9-D18 A](architecture/decisions/B9-D18%20-%20Narrator%20Safe%20Spatial%20Reference%20Binding%20Without%20Invented%20Identities.md) accepts narrator-safe natural spatial references and internal TypeScript identity binding without guessing duplicates. **D12 remains deferred, no spatial migration work; D13 remains deferred pending coordinator-conflict clarification; D19–D21 are unapproved Batch 7 proposals.** B9 remains `in-review`; no implementation or tests. Earlier dated sections below remain approval history.

## Latest B9 Batch 5 disposition — 2026-10-31

The user explicitly accepted [B9-D14 A](architecture/decisions/B9-D14%20-%20Renderer%20Independent%20Spatial%20Projections%20and%20S04%20Canvas%20Adapter.md), keeping canonical typed spatial projections renderer-neutral and using S04 for the map drawing adapter; **no SVG/Canvas/WebGL library selected**. [B9-D15 A](architecture/decisions/B9-D15%20-%20Versioned%20Typed%20Browser%20Go%20Spatial%20Service%20Contracts.md) requires versioned typed browser-to-Go spatial requests/results, structural checks, expected-version/library-epoch/idempotency fencing and typed technical errors; Go remains storage authority, not fiction judge. **B9-D13 remains DEFERRED, no ADR**: user requests more explanation and prefers the coordinator to handle map conflicts as well as possible, accepting its result, but no conflict algorithm/UI choice or override of B9-D08's nonblocking conflict obligations was explicitly approved. **B9-D12 remains DEFERRED: no spatial migration work, ADR, scripts or tests.** B9 stays `in-review`; D16–D18 are new unapproved Batch 6 proposals. Earlier sections below preserve historical snapshots, not current status. No code, tests, implementation, stage promotion or closure.

## B9 Batch 4 approvals and explicit spatial-migration deferral — 2026-10-31

User explicitly approved [B9-D10 A](architecture/decisions/B9-D10%20-%20Versioned%20Deterministic%20Qualitative%20Distance%20Conversion%20Profiles.md) for versioned deterministic phrase-to-exact-metre conversion profiles, and [B9-D11 A](architecture/decisions/B9-D11%20-%20Multiple%20Keyed%20Entrances%20and%20Cross%20Frame%20Portal%20Anchors.md) for multiple stable keyed grounded entrance/door/portal anchors and route associations. Numeric phrase mappings, actual payloads and implementation remain undecided. **B9-D12 was expressly deferred: “For d12 do nothing. We don't want to do migration yet for these.” Do not begin spatial migration design, scripts or tests, or claim D12 acceptance.** Earlier general B4/B7 event-migration ADRs remain historical design context, not authority to initiate B9 spatial migration. B9 is still `in-review`; **Batch 5 D13–D15 are unapproved proposals**. No implementation, migration, tests or stage promotion.

## Latest B9 Batch 3 approval — 2026-10-31

The user explicitly accepted [B9-D07 B](architecture/decisions/B9-D07%20-%20Automatic%20Numeric%20Metre%20Conversion%20of%20Qualitative%20Geography.md), [B9-D08 A](architecture/decisions/B9-D08%20-%20Event%20Triggered%20Deterministic%20Spatial%20Reconciliation%20and%20Conflict%20Reporting.md), and [B9-D09 A](architecture/decisions/B9-D09%20-%20Valid%20Overlapping%20Mutable%20Region%20Geometry%20Without%20Implicit%20Containment.md). **D07 B expressly overrides earlier B8 advice against inferring exact geographic metres from qualitative statements**: supported relative geography converts to exact metre constraints, with stable typed frame scale; this is an engine-derived measurement, **not** an exact surveyed narrator claim. Route length/time/cost stay separately grounded, not inferred from canvas pixels. D08 A restricts deterministic atomic re-layout to relevant accepted world changes (all pins remain moveable under D04 C), preserving conflicting accepted facts and surfacing nonblocking conflicts. D09 A accepts technically valid region overlaps without implicit containment/routes/ownership updates. **B9-D10–D12 are unapproved proposals**; B9 is still in review. Earlier text below preserves dated decisions even when superseded.

## B9 Batch 2 accepted; pin protection expressly superseded — 2026-10-31

The user accepted [B9-D04 C](architecture/decisions/B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md), [B9-D05 A](architecture/decisions/B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md) and [B9-D06 A](architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md). Persist typed semantic coordinates without per-coordinate AI/player author labels or permanent pin locks. **Automatic accepted layout updates may reposition even a manually placed pin**, overriding earlier B8-D08 protection; they must be deterministic, replayable and committed atomically. Deliberate direct player edits still use pending explicit Commit/Discard. D05 validates local-frame geometry and mutable region outlines. D06 specifies broad mocked success, failure and history tests, with mock-only evidence labels and no live-model scenario suite. [B9](architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) remains in review; D07–D09 are unapproved proposals. Earlier sections below retain historical choices, including now-superseded pin-immunity claims.

## B9 Batch 1 explicitly accepted, with simplified map metadata and mocked tests — 2026-10-31

In the [active B9 review](architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md), the user selected **[D01 qualified A](architecture/decisions/B9-D01%20-%20Typed%20Spatial%20Coordinates%20Without%20AI%20Player%20Authorship%20Labels.md)** (**typed coordinates, no player-vs-AI author labels**), **[D02 A](architecture/decisions/B9-D02%20-%20TypeScript%20Prepared%20Events%20and%20Go%20SQLite%20Atomic%20Commit%20Authority.md)** (TypeScript event/projection preparation, Go validation and atomic SQLite commit) and **[D03 B](architecture/decisions/B9-D03%20-%20Mock%20Based%20Component%20Verification%20Without%20Live%20AI%20Scenarios.md)** (**mocked tests for all app parts, no live AI model scenario launches**, contrary to earlier recommended A). Earlier B8-D06 B auto-placement and B8-D08 no-moving-deliberate-pins remain binding, with only **minimal operational pin protection** proposed for separate selection at B9-D04. Mock test outcomes do not establish actual Wails/SQLite host operation; any separate B1 evidence gates remain open. **B9-D04–D06 are not approved**, and no code, tests, stage promotion or B9 closure follows.



## Formal B8 design closure and active B9 review — 2026-10-31

[Formal B8 closure](architecture/decisions/P-B8-01%20-%20Design%20Closure%20and%20Deferred%20Runtime%20Integration%20Contracts.md) records a **separate explicit user approval** to close B8 **at design level only** after its nine decisions were accepted and reviewed. This maintains **D04 A: mutable region boundaries**, **D06 B: automatically persisted initial map locations with free player repositioning**, and **D07 A/D08 A/D09 A: deterministic local placement, generated-vs-grounded source precedence and atomic location+first-position creation**. [B9 typed spatial data and runtime integration](architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) remains **`in-review`**, with D01 A qualified, D02 A and D03 B accepted on 2026-10-31; D04–D06 are new unapproved proposals. No final executable schema, implementation, passing tests, production promotion or B9 approval is inferred.



## B8 Batch 3 accepted and closure assessed, NOT formally closed — 2026-10-31

User-approved [B8-D07 A](architecture/decisions/B8-D07%20-%20Deterministic%20Scoped%20Automatic%20Map%20Placement.md) gives **deterministic local-frame automatic placement**, [B8-D08 A](architecture/decisions/B8-D08%20-%20Provenance%20Aware%20Spatial%20Reconciliation%20of%20Generated%20Placement.md) gives **grounding-first reconciliation of generated-only pins while preserving player-authored positions**, and [B8-D09 A](architecture/decisions/B8-D09%20-%20Atomic%20Canonical%20Location%20Creation%20and%20Initial%20Placement.md) requires **one atomic creation transaction** for each accepted new location and its stored generated initial map coordinates. All **nine** numbered B8 decisions are accepted; **D06 was specifically B** (automatic map placement) and D04's mutable borders still apply. The [B8 review](architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) first assessed closure while `in-review`; **distinct user approval later formally closed B8 design and opened B9 under P-B8-01**. No implementation, tests or staging promotion authorised.



## B8 Batch 2 accepted, including automatic placement over the earlier unplaced default — 2026-10-31

The user explicitly approved [B8-D04 A](architecture/decisions/B8-D04%20-%20Mutable%20Spatial%20Region%20Footprints%20Separate%20from%20Containment.md) (**dynamic region borders**), [B8-D05 A](architecture/decisions/B8-D05%20-%20Stable%20Cross%20Frame%20Routes%20with%20Grounded%20Door%20and%20Portal%20Anchors.md) (**stable cross-frame doors/portal/route anchors**) and **[B8-D06 B](architecture/decisions/B8-D06%20-%20Automatic%20Persistent%20Location%20Placement%20with%20Player%20Overrides.md)** (**auto-place every new accepted location on the saved map**, with subsequent player repositioning). D06 B was **not** the previous recommendation and **overrides the earlier prohibition on generated persistent map coordinates for initial placement only**. Generated coordinates are **map-layout origin facts**, distinct from established story distances or route costs; deliberate user edits remain pending explicit Commit. [B8](architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) remains `in-review` with **D07–D09 unapproved**. Design-only, no code, tests or staging promotion.



## B8 Batch 1 accepted spatial-map contracts — 2026-10-31

In the [B8 spatial canvas and integration review](architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), the user explicitly approved [D01 A](architecture/decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) (nested persistent local coordinate frames), [D02 A](architecture/decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) (geographic separation distinct from route-specific travel metrics) and [D03 A](architecture/decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) (typed map-placement facts and manual pending **Commit** for deliberate edits). The canvas remains semantic, persistent and separate from the logical travel graph. **D04 A, D05 A and D06 B were approved, followed by the user's separate approval of D07 A, D08 A and D09 A**. **B8 was later formally closed design-only; B9 is now in-review with unapproved choices**. No code, tests or staging promotion follows from these decisions.



## Formal B7 design closure and active B8 review — 2026-10-31

[Formal B7 closure ADR](architecture/decisions/P-B7-01%20-%20Design%20Closure%20and%20Deferred%20Spatial%20Canvas%20Integration%20Contracts.md) records the user's distinct approval to **close B7 at design level and open B8**. All ten B7 decisions remain explicitly accepted, including **D03 C** (silently discard only genuinely ambiguous automatic extraction candidates) and **D10's pinned semantic spatial canvas**. [B8 spatial canvas and cross-module integration](architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md) is **in review**, with **D01–D03 Option A accepted on 2026-10-31** and D04–D06 still unapproved. This closure does **not** approve code, staging promotion, tests, a final coordinate system or an independent authoritative graph store.



## B7 architecture approvals and closure assessment — 2026-10-31

**All ten B7 architectural decisions are now explicitly accepted**, including D03 **Option C** (silent discard of unresolved *automatic* extraction candidates), D07 **Option A** (versioned field-registry migrations), D08 **Option A** (ID-free narrator/provisional natural references) and D09 **Option A** (minimal current event provenance/replay). [The B7 review](architecture/Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md) originally recorded an **assessment only**, but **separate user approval was subsequently given and recorded in P-B7-01**. Its current status is `closed-design-only`. The previously accepted [B7-D10 spatial canvas](architecture/decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) still requires saved semantically scaled location coordinates and meaningful route geometry, not a graph auto-layout. No code, integration tests or staging promotion is claimed.



## Latest map architecture: persistent semantic spatial canvas — 2026-10-31

[Accepted B7-D10](architecture/decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) clarifies that **the world map is a coordinate-pinned spatial canvas** with persistent positions and meaningful distance/scale, grouping empires/cities/buildings/rooms within the same zoomable experience. The accepted **travel graph** is a *separate logical connectivity layer*, not the map's auto-layout or its complete spatial model. Player-authored coordinate changes are meaningful saved map edits; pan/zoom is UI-only; proximity does not invent roads or move characters. Concrete canvas/graph libraries, nested transforms and route-distance schema remain unapproved implementation details. All B7-D01–D10 decisions are accepted; **B7 is now formally closed at design level**, with B8 in review.



## Architecture milestones — 2026-10-31

[Formal B6 design closure](architecture/decisions/P-B6-01%20-%20Design%20Closure%20and%20Deferred%20Event%20Representation%20Contracts.md) records all ten accepted narrative-first world-state decisions and preserves their dated provenance, including the feature-conditional anatomy/equipment rule. [B7 event representation and interpretation review](architecture/Pass%20B7%20-%20Event%20Representation%20and%20Narrative%20Interpretation%20Contract%20Review.md) is **formally closed at design level** after a distinct user sign-off, with all D01–D10 decisions accepted; **B8** now holds the new, unapproved spatial canvas and integration questions. B6 design closure does **not** assert a working runtime or approve moving the 52 accepted staged ideas to production; concrete schemas, TypeScript reducer contracts, Go/SQLite integration and tests remain future work.



Open this **planning** directory as an Obsidian vault. All notes remain readable and editable as normal Markdown outside Obsidian. The repository [agent instructions](../AGENTS.md) and [vault rules](AGENTS.md) describe the same workflow for coding agents.

## Promotion flow

```text
brainstorming/         Explore many possibilities in persistent sessions
     |
     | Extract independent candidates (no approval needed)
     v
inbox/                 One note per idea; candidate, not accepted
     |
     | Human explicitly accepts an idea
     v
staging/               Accepted idea, deliberately NOT fully refined
     |
     | Refine + human approves the proposed behaviour
     v
production/            Refined and approved, awaiting implementation
     |
     | Implementation exists and is verified
     +----------------------> specs/archive/   Move the implemented idea here
     +----------------------> specs/*.md        Document current testable requirements
```

**Inbox is not accepted; staging is accepted but unrefined; production is approved but unimplemented; specs describe verified implemented truth.** These stages are not interchangeable.

## Narrator-safe entity references — approved 2026-10-29

[Accepted B6-D04](architecture/decisions/B6-D04%20-%20Narrator%20Safe%20Entity%20References%20and%20Internal%20Identity%20Resolution.md) makes **internal stable IDs engine-owned, not narrative prompt content**. The narrator sees natural-language names, descriptions and facts, while a separate internal interpretation/resolution layer binds them to stable IDs. If a single selected model serves both tasks, the narrator prompt must be isolated from private ID mappings; single-pass prose+events remains supported using natural-language provisional references. Ambiguous same-name referents must not be guessed or used to force rejection of story prose. Later implementation should follow this boundary without requiring extra permanent models or arbitrary ID text in narration.

## Current approved engine principle (2026-10-28)

The accepted architecture now prioritises **narrative-first declarative world state**. [B6-D01](architecture/decisions/B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) supersedes older procedural transfer/strict historic-dependency language: story/player assertions update the tracked world directly using typed ordered Set/Clear, Create/Remove and keyed relation events. A missing original key-acquisition, entity introduction, route or fictional cause does **not** by itself make a later grounded assertion invalid. The tracker exists primarily for narration, context and player editing, not RPG simulation. Technical event interpretability, deterministic replay, coherent single-valued placement, Go/SQLite atomicity and explicit pending manual Commit still apply. Under [B3-D04](architecture/decisions/B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) there are no retained story/event revision archives. **When reading older ADRs or staged ideas, apply these later explicitly approved supersessions while preserving original acceptance history**; staging and architecture decisions are not implemented specs.


## Working with an idea

1. Invoke the `brainstorm` skill or create a note from [[Brainstorm]] in `brainstorming/`. Name it `<Topic> Brainstorm.md`. A session can contain many competing possibilities. Update its Session Log and Resume Here as the discussion develops.
2. Say **"extract these as separate candidate ideas"** or **"split the brainstorm into Inbox ideas"**. The agent creates one `inbox/` note from [[Candidate Idea]] per distinct idea, gives each a unique `IDEA-` ID, links its source brainstorm, and records whether its origin was user, agent or mixed. These candidates are **not approved**, and this step does not require a decision to pursue them. You can also create an Inbox idea directly, without a brainstorm.
3. Discuss or edit individual Inbox ideas to compare them. Explicitly **accept** one for refinement to move the **same idea note** to `staging/`; change `status` to `staging`, record acceptance details and separate selected scope from speculative alternatives. Rejected candidates can remain in Inbox marked `status: rejected`. All other candidates remain unaccepted.
4. Refine the staging idea. Resolve key questions and express acceptance criteria as behaviour that can be checked. When you explicitly approve the resulting plan, **move** that same idea note to `production/`, set `status: production`, and record actual approval information. [[Staging Idea]] and [[Production Idea]] are structural checklists if the moved note needs more sections; do not reset its history.
5. Implement the approved plan and verify it. Move its idea document to `specs/archive/` only when fully implemented; preserve the ID and add implementation/test evidence. Create or update one or more spec notes directly in `specs/` using [[Spec]]. Specs contain stable requirement IDs and how to verify them.
6. For new changes to shipped behaviour, start a separate idea and keep the existing spec truthful until implementation changes. Update the existing spec during verified implementation, not at brainstorm time.

## Obsidian setup

- The `templates/` directory is preconfigured as the built-in Templates folder. Use the command **Templates: Insert template** or create a new note and insert the desired template.
- Enable Obsidian's built-in **Templates** core plugin if your local Obsidian settings do not already enable it.
- Properties at the top are YAML frontmatter. Use `type`, `status`, `created`, `updated`, `tags`, and the stage-specific fields in the templates for search/filtering. Keep dates in `YYYY-MM-DD` form.
- Links such as `[[My Idea]]` are Obsidian wikilinks. When stored in frontmatter, quote them: `["[[My Idea]]"]`.
- Search Obsidian for `[type:idea]`, `[status:candidate]`, `[status:rejected]` or `[status:production]` to find ideas by type or state; use the file explorer for the stage folders. Nothing here requires a community plugin.

## Starting empty

The Inbox, staging, production and spec/archive folders start empty. Existing brainstorm documents may contain several possible ideas, but these are not automatically accepted. Templates are not proposals and no invented Lorebound features are marked as implemented.
