---
type: guide
status: current
created: 2026-10-16
updated: 2026-10-31
tags:
  - planning/guide
---
# Start Here

## B8 Batch 1 accepted spatial-map contracts — 2026-10-31

In the [B8 spatial canvas and integration review](architecture/Pass%20B8%20-%20Spatial%20Canvas%20and%20Cross%20Module%20Integration%20Contract%20Review.md), the user explicitly approved [D01 A](architecture/decisions/B8-D01%20-%20Nested%20Local%20Coordinate%20Frames%20on%20One%20Spatial%20Canvas.md) (nested persistent local coordinate frames), [D02 A](architecture/decisions/B8-D02%20-%20Geographic%20Separation%20Distinct%20from%20Route%20Travel%20Geometry.md) (geographic separation distinct from route-specific travel metrics) and [D03 A](architecture/decisions/B8-D03%20-%20Versioned%20Spatial%20Assertions%20and%20Explicit%20Map%20Edit%20Commit.md) (typed map-placement facts and manual pending **Commit** for deliberate edits). The canvas remains semantic, persistent and separate from the logical travel graph. **D04–D06 are only proposals**; B8 remains `in-review`. No code, test evidence or staging promotion follows from these decisions.



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
