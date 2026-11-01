# Lorebound agent instructions

## B9 Batch 4 approvals and explicit spatial-migration deferral — 2026-10-31

User explicitly approved [B9-D10 A](planning/architecture/decisions/B9-D10%20-%20Versioned%20Deterministic%20Qualitative%20Distance%20Conversion%20Profiles.md) for versioned deterministic phrase-to-exact-metre conversion profiles, and [B9-D11 A](planning/architecture/decisions/B9-D11%20-%20Multiple%20Keyed%20Entrances%20and%20Cross%20Frame%20Portal%20Anchors.md) for multiple stable keyed grounded entrance/door/portal anchors and route associations. Numeric phrase mappings, actual payloads and implementation remain undecided. **B9-D12 was expressly deferred: “For d12 do nothing. We don't want to do migration yet for these.” Do not begin spatial migration design, scripts or tests, or claim D12 acceptance.** Earlier general B4/B7 event-migration ADRs remain historical design context, not authority to initiate B9 spatial migration. B9 is still `in-review`; **Batch 5 D13–D15 are unapproved proposals**. No implementation, migration, tests or stage promotion.

## Latest B9 Batch 3 approval — 2026-10-31

The user explicitly accepted [B9-D07 B](planning/architecture/decisions/B9-D07%20-%20Automatic%20Numeric%20Metre%20Conversion%20of%20Qualitative%20Geography.md), [B9-D08 A](planning/architecture/decisions/B9-D08%20-%20Event%20Triggered%20Deterministic%20Spatial%20Reconciliation%20and%20Conflict%20Reporting.md), and [B9-D09 A](planning/architecture/decisions/B9-D09%20-%20Valid%20Overlapping%20Mutable%20Region%20Geometry%20Without%20Implicit%20Containment.md). **D07 B expressly overrides earlier B8 advice against inferring exact geographic metres from qualitative statements**: supported relative geography converts to exact metre constraints, with stable typed frame scale; this is an engine-derived measurement, **not** an exact surveyed narrator claim. Route length/time/cost stay separately grounded, not inferred from canvas pixels. D08 A restricts deterministic atomic re-layout to relevant accepted world changes (all pins remain moveable under D04 C), preserving conflicting accepted facts and surfacing nonblocking conflicts. D09 A accepts technically valid region overlaps without implicit containment/routes/ownership updates. **B9-D10–D12 are unapproved proposals**; B9 is still in review. Earlier text below preserves dated decisions even when superseded.

## Current B9 Batch 2 approvals — 2026-10-31

[Accepted B9-D04 C](planning/architecture/decisions/B9-D04%20-%20All%20Coordinates%20Eligible%20for%20Automatic%20Layout.md) **supersedes the earlier B8-D08 protection for intentionally moved pins**: persisted typed coordinates have no player/AI author labels or permanent fixed/auto-adjustable lock; a subsequent valid, deterministic, atomic automatic spatial update may reposition any location. Manual direct map edits still require explicit pending Commit. [B9-D05 A](planning/architecture/decisions/B9-D05%20-%20Validated%20Local%20Frame%20Coordinates%20and%20Mutable%20Region%20Geometry.md) requires validated local-frame geometry and mutable region boundaries. [B9-D06 A](planning/architecture/decisions/B9-D06%20-%20Comprehensive%20Mocked%20Contracts%20and%20Explicit%20Evidence%20Labels.md) requires comprehensive mock-based tests and truthful simulated-evidence labels. **B9-D07–D09 are unapproved Batch 3 proposals**, B9 remains in review; nothing is implemented or tested. Earlier sections below preserve dated superseded approval history.

## Latest world-map approvals and B9 review status — 2026-10-31

[B8 design closure](planning/architecture/decisions/P-B8-01%20-%20Design%20Closure%20and%20Deferred%20Runtime%20Integration%20Contracts.md) records nine accepted architecture decisions; **B8-D06 Option B** requires automatic **persisted generated first map coordinates** for each accepted new location, **B8-D04 Option A** permits dynamic region-border changes, B8-D07 A ensures deterministic scoped placement, B8-D08 A limits generated-placement corrections without overwriting authored pins, and B8-D09 A requires the new-location identity and first position to save **atomically together**. Manual deliberate map correction uses explicit pending Commit. Route topology and containment remain separate from geographic canvas placement; generated map pixels are not evidence of narrative route length. [B9](planning/architecture/Pass%20B9%20-%20Typed%20Spatial%20Data%20and%20Runtime%20Integration%20Contract%20Review.md) is **opened with D01–D03 unapproved proposals**; this is all unimplemented design, not staging promotion or shipped behaviour.



## Accepted world-map architecture

For any map/location planning, [B7-D10](planning/architecture/decisions/B7-D10%20-%20Persistent%20Semantic%20Spatial%20Canvas%20and%20Grouped%20Location%20Coordinates.md) establishes that the world map is **a persistent, coordinate-pinned, semantically scaled canvas with nested geographic groups and meaningful distances**, **not merely an abstract travel graph**. B7-D06 describes route connectivity only; preserve saved spatial layout and separate containment/route relationships. Deliberate map-coordinate corrections follow explicit world-edit Commit, while pan/zoom is presentation-only. Do not infer this feature is implemented or choose unapproved coordinate/canvas/graph libraries.



Lorebound is at an early repository stage. Do not infer an implemented product, tech stack, or feature from the project name; inspect the repository before making claims.

## Read first

- For planning work, read [planning/AGENTS.md](planning/AGENTS.md), then [planning/Start Here.md](planning/Start%20Here.md).
- For exploratory ideation, follow [the brainstorm skill](.agents/skills/brainstorm/SKILL.md).
- These instructions apply to agents using Codex, Claude Code, or other compatible tools. Root `CLAUDE.md` imports this file.

## Planning is a promotion pipeline

```text
planning/brainstorming/                exploration and session history
          | extract independent possibilities (NOT approval)
          v
planning/inbox/                       separate candidate ideas, NOT accepted
          | explicit human acceptance
          v
planning/staging/                      accepted direction, still unrefined
          | refine + explicit human approval
          v
planning/production/                   approved, implementation-ready, NOT shipped
          | implement + verify real behaviour
          v
planning/specs/archive/                implemented idea document (historical record)
planning/specs/*.md                    current, testable application requirements
```

Never mistake `production/` for shipped behaviour. It is an implementation queue, not the application specification. Only implemented and verified behaviour is documented as current truth in `specs/`.

## Non-negotiable boundaries

1. **Exploration and capture are not approval.** Brainstorm freely; saving one or many individual ideas in Inbox is merely preserving candidates, including agent suggestions. Never present them as accepted decisions.
2. **Stage gates are deliberate.** Creating an Inbox candidate needs no project approval, but moving inbox → staging and staging → production does require explicit human acceptance. Do not infer approval from detail, file creation, or an agent's enthusiasm. Do not invent an approver.
3. **Implementation is a separate gate.** Do not archive a production idea or add it to current specs until the relevant behaviour actually exists and has been checked. Record a code/test reference or human-verified evidence.
4. **One continuing document per individual idea.** Create an Inbox note for each distinct candidate, then move that same note to staging, production and finally specs/archive if approved and implemented. Preserve its stable `id`, history, provenance and links. Brainstorm sessions stay in brainstorming.
5. **Specs describe what is implemented.** Create or update a direct child Markdown file in `planning/specs/` with uniquely identified, objectively testable requirements. Keep planned and unverified requirements out of current specs.
6. **Truth is tiered.** Label information as existing implementation, accepted decision, unaccepted Inbox candidate, or exploratory brainstorm possibility. Check code before claiming implementation; avoid speculative feature claims.
7. **No silent writes.** Before changing project notes, inspect the existing note, related notes/specs, and relevant code. Keep user-authored choices distinct from agent suggestions.

## Creating and advancing ideas

- Start a brainstorm with `/brainstorm [topic]` (or invoke the skill by name). A bare invocation should inspect available project context and propose grounded starting directions.
- Create an active session with [Brainstorm template](planning/templates/Brainstorm.md). Keep an append-only Session Log, live Current Threads, explicit Decisions, Outputs, and Resume Here. Reuse matching active sessions.
- When asked to extract, split or capture potential ideas, make **one unapproved candidate per distinct idea** in `planning/inbox/` using [Candidate Idea template](planning/templates/Candidate%20Idea.md). Link each back to its source brainstorm, attribute user/agent/mixed origin, and assign a unique ID. Capture can happen without anyone accepting the proposal.
- Upon **explicit human acceptance**, move the selected candidate's existing note into `planning/staging/`, change its status to `staging`, and record actual acceptance information. Keep alternative unselected candidates in Inbox. Use [Staging Idea template](planning/templates/Staging%20Idea.md) only as a structural checklist, not as a replacement document.
- Refine staging scope, decisions, alternatives, edge cases, dependencies, measurable acceptance criteria, and questions. Only after explicit readiness approval, move the note to production, preserving its ID and recording approval.
- Implement from an approved production note. When implementation is verified, move the original idea note to `specs/archive/`, add implementation evidence, and create/update [Spec template](planning/templates/Spec.md). Keep the canonical spec aligned with shipped reality.

## Obsidian and note conventions

- Open `planning/` as the Obsidian vault. It is also plain Markdown; do not require Obsidian for repository tooling.
- Frontmatter is YAML. Use `type`, `status`, `created`, `updated`, `tags`, and note-specific fields. Prefer ISO dates (`YYYY-MM-DD`).
- Assign a unique human-readable `id` such as `IDEA-0001` when a candidate enters Inbox. Keep it stable across all later promotions; do not reuse IDs. Specs use separate IDs such as `SPEC-001`.
- Quote `"[[Obsidian Links]]"` in YAML sequences. Use `[[Note Title]]` in note text, or relative Markdown links when tooling outside Obsidian needs navigation.
- Templates are starting points, not feature decisions. Example text must never be assumed to be Lorebound canon.
- For requirements, use stable IDs (for example `REQ-INVENTORY-001`) and record how each is verified. Do not mark tests passed without evidence.

## Code, git, and reporting

- Prefer small, focused changes consistent with the existing codebase. Do not implement from staging or brainstorming alone.
- Do not mutate implementation merely to complete a brainstorm. Ask only substantive unresolved questions; otherwise proceed with clearly labelled assumptions.
- Check links and frontmatter when moving or creating notes. Remember that Git does not track empty directories.
- Commit, push, or open PRs only when requested by the user. Never claim checks ran if they did not.
- Report what was written, the note's stage, evidence inspected, approvals still required, and any remaining uncertainty.
