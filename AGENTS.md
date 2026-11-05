# Lorebound agent instructions

## Personal development style — 2026-11-05

The user explicitly requires the **personal-development-style** skill for this project's implementation, refactoring, architectural work and code review from now on. Read the installed skill at `/home/alex/.codex/skills/personal-development-style/SKILL.md` and its relevant references. If that location changes, discover the skill by name.

**Project-specific priority override:** apply the skill's preferences over existing repository style conventions where necessary. The user expressly authorised this override; the skill's default instruction to prefer existing repository conventions does not take precedence here. Keep correctness, security/reliability, platform constraints, accepted functional/architectural/visual contracts and required verification gates binding. Align conflicting formatter/linter style settings when needed for the authorised change; preserve semantic checks.

Prefer straightforward, readable code, explicit ownership, pragmatic composition, early returns, minimal useful comments and safe concurrency for independent operations. For TypeScript/JavaScript use 2 spaces, Allman block braces, semicolons, single quotes and no optional trailing commas, respecting language/framework syntax. Go remains idiomatic and `gofmt`-formatted. Apply these preferences actively to new and directly affected code; this instruction does not request a repository-wide reformat or authorise subsequent development tasks.

## Development task control and agent handoff — 2026-11-03

**The active development workflow lives in [planning/development/README.md](planning/development/README.md).** Before any code change, read **[planning/development/NOW.md](planning/development/NOW.md)** for the **one next task**, [TASKS](planning/development/TASKS.md) for dependency/acceptance gates, [FEATURES](planning/development/FEATURES.md) for 52 approved ideas and granular evidence, [JOURNAL](planning/development/JOURNAL.md) for ongoing context and [AGENT-RUNBOOK](planning/development/AGENT-RUNBOOK.md) for implementation/reviewer reports. Update those same control files within feature PRs and distinguish unmerged work from independently verified main. The initial DEV-001 plan was explicitly redirected by the user to **DEV-002A: replace Gate 0 with production blank adventure creation/resume**. Read NOW for its current branch, verification and merge status; no later child starts automatically. No new architecture or spatial-migration approval follows from this guidance.

## Current system architecture entry point — 2026-11-03

**Before application development or architectural review, read [Lorebound — System Architecture Overview](planning/architecture/Lorebound%20-%20System%20Architecture%20Overview.md).** It is the self-contained current explanation of all 52 production ideas, twelve subsystem ownership boundaries, browser TypeScript + Wails/Go/SQLite data flow, AI generation and accepted story history, map semantics, approved UI styling and verified-vs-planned status. Use relevant original production IDEA and later accepted B/C ADRs for detailed authority; earlier Consolidated Subsystem Architecture and Pass reviews are dated historical context. The overview is a navigational synthesis, not a new gameplay approval, proof of 52 implemented ideas or authorisation to run B9-D12 spatial migrations.

## Approved visual design direction — 2026-11-03

**User explicitly requested that the Lorebound app look like their uploaded Command Citadel design-only kit.** Treat [planning/design/README.md](planning/design/README.md) and the [binding visual contract](planning/design/Lorebound%20Command%20Citadel%20Visual%20Design%20Contract.md) as the **current UI style reference** when implementing any approved production idea. Source-matched warm charcoal/gold/parchment typography, 48px header, centred 672px reading column, 320px darker desktop rail, docked composer, responsive view switch, blue provisional vs green committed status and appearance presets are intentional. [UI mapping](planning/design/Lorebound%20UI%20Interaction%20and%20State%20Mapping.md) resolves visual demo interactions against later accepted functional contracts. **B1–B9 and Pass C still govern behaviour/authority**, especially the single primary composer Commit/Discard overlay, no map keyboard gestures and deferred B9-D12 migrations. This is documentation/style acceptance, not evidence of implemented UI or permission to start feature code merely by reference to the kit.

## Current idea stages after explicit full promotion — 2026-11-03

The user explicitly authorised **all remaining 50 accepted ideas** to move from staging to production, after IDEA-0051 and IDEA-0053 were already promoted and Gate 0 PR #3 was merged. **Current: 52 production, 0 staging, 0 implemented idea specs.** [Full promotion register](planning/architecture/Pass%20C%20-%20All%20Accepted%20Ideas%20Production%20Promotion%20Register.md). This is broad **implementation-readiness** approval, **not proof of completed features**, permission to implement all simultaneously, or migration authorisation. Keep the accepted incremental Story-mode-first and evidence-gated delivery approach. **B9-D12 spatial migration remains deferred.** Dated earlier summaries below referring to 50/52 staging ideas or pending Gate 0 are chronological history only.

## Current Pass C production promotions — 2026-11-01

**Later Gate 0 execution update:** The user separately authorised the minimum production-intended Wails browser/Go and SQLite Gate 0 implementation and real testing. [Gate 0 evidence](planning/architecture/Gate%200%20Execution%20Evidence.md) records the result. Both original IDEA-0053 and IDEA-0051 remain production ideas; 50 others remain staging. No Story mode, spatial migration, full IDEA implementation or current application spec is implied. The paragraph below preserves the earlier promotion-only snapshot.

User separately approved moving the *same original* **IDEA-0053** and **IDEA-0051** from `planning/staging/` to `planning/production/`: [host/runtime](planning/production/Localhost%20Startup%20and%20Offline%20Mode.md), [SQLite persistence](planning/production/Browser-Persistent%20Story%20Database.md). Original ID, history and accepted scope are retained. **50 ideas still staging, 2 production, none implemented.** **No application code or checks have run**. The remaining, unapproved permission is to perform the minimal production-intended [Gate 0 browser/Go/SQLite implementation and real evidence](planning/architecture/Pass%20C%20-%20Gate%200%20Host%20Verification%20Authorisation%20Packet%20%28Proposed%29.md). B9-D12 spatial migration remains deferred with no work. Historical notes below about B9 in review or 52 staged ideas are superseded by later approved records, not current status.

## Current B9 Batch 10 and assessment, NOT closure — 2026-11-01

[**D28 B**](planning/architecture/decisions/B9-D28%20-%20Immediate%20View%20Recenter%20on%20Playing%20As%20Selection.md): immediately recenter an already-open map when the selected **Playing As** character changes, to their known position or map default. Do not continuously follow ordinary movements. [**D29 A**](planning/architecture/decisions/B9-D29%20-%20Stable%20Nearest%20Free%20Pin%20Offset%20Ordering.md): stable ID ordering and deterministic minimal nearest-free offset for totally overlapping pins at minimum zoom, only in accepted spatial transactions; never on zoom or redraw. [**D30 A**](planning/architecture/decisions/B9-D30%20-%20Design%20Only%20Completeness%20Assessment%20Before%20Separate%20Closure%20Approval.md): documentation-only audit, recorded in [B9 assessment](planning/architecture/Pass%20B9%20-%20Design%20Completeness%20Assessment%20%28Not%20Closure%29.md), **not formal closure**. **B9 remains `in-review`** pending separate explicit closure approval; D13 coordinator conflict handling still requires clarification. D12 stays deferred with no spatial migration work; D24 deferred, **no map keyboard interaction**. No implementation, tests, staging promotion or release evidence. Earlier notes below preserve dated history.

## B9 Batch 9 current decisions — 2026-11-01

[D25 A](planning/architecture/decisions/B9-D25%20-%20Disposable%20Map%20Pan%20and%20Zoom%20View%20State.md) keeps pan/zoom temporary. [D26 qualified A](planning/architecture/decisions/B9-D26%20-%20Player%20Location%20First%20Map%20View%20with%20Default%20Coordinate%20Fallback.md) opens the map at the selected Playing As character's known current location, or default map coordinates if unknown/unselected. [D27 qualified C](planning/architecture/decisions/B9-D27%20-%20Minimal%20Canonical%20Pin%20Separation%20at%20Minimum%20Zoom.md) permits only a small deterministic nearest-free-side adjustment when **location pins entirely overlap at the farthest zoom-out**, committed with an accepted spatial update, never on zoom/redraw. This does not move region boundaries, routes, containment or characters. The original D27 broad C wording is not approved. **D12/D13/D24 remain deferred**: no spatial migration work, coordinator conflict presentation awaits clarification, no keyboard map interactions. B9 remains in-review; Batch 10 D28–D30 unapproved, no implementation/tests/promotion.

## B9 Batch 8: no scale UI, simple rendering, no map keyboard interaction — 2026-11-01

User explicitly accepted [B9-D22 C](planning/architecture/decisions/B9-D22%20-%20No%20Visible%20Geographic%20Scale%20Indicator.md): **no visible map scale bar or metres indicator** (internal typed geographic scale remains). [B9-D23 A, qualified](planning/architecture/decisions/B9-D23%20-%20Simple%20Disposable%20Viewport%20Rendering%20Optimisation.md) requires **the simplest adequate disposable viewport drawing**, adding only lightweight offscreen filtering/zoom simplification when needed, **not advanced rendering infrastructure** and never changing canon for performance. **B9-D24 DEFERRED, no ADR:** user expressly said **“No keyboard interaction for the map.”** Record this as current map scope, not acceptance of D24 A/B/C or a change to other chat keyboard controls. **D12 remains deferred with no spatial migration work, D13 remains deferred for coordinator conflict clarification.** Batch 9 D25–D27 remains unapproved, B9 `in-review`, no implementation/tests/promotion. Older sections preserve approval history.

## B9 Batch 7 approved, with spatial estimate and default fallback — 2026-10-31

User expressly selected [B9-D19 A](planning/architecture/decisions/B9-D19%20-%20Stable%20Default%20Root%20Frame%20and%20Initial%20Geographic%20Scale.md) (stable root local frame and default scale), [B9-D20 A qualified](planning/architecture/decisions/B9-D20%20-%20Best%20Effort%20Spatial%20Estimates%20with%20Deterministic%20Default%20Fallback.md) (**for unambiguously resolved places, permit a best-effort geographic numeric guess and use a deterministic default if it fails; the player may correct it**) and [B9-D21 A](planning/architecture/decisions/B9-D21%20-%20Basic%20Map%20Hover%20Labels%20and%20Existing%20Location%20Detail%20Selection.md) (minimal known-name hover label, selection focuses existing details). D20 is a later qualification of previous B9-D10 prohibition on guessing unsupported **geographic numeric** values, **not permission to guess ambiguous entity IDs or invent narrative routes**. Keep results typed, atomic, persistent and replayable, not rerolled on map redraw. **B9-D12 remains deferred with no spatial migration work; B9-D13 remains deferred pending coordinator-conflict clarification.** Batch 8 D22–D24 is unapproved; B9 remains `in-review`. No code, tests, stage promotion or chapter closure. Earlier sections are chronological history, not current restrictions where superseded.

## B9 Batch 6 accepted with basic map UX and existing Commit location — 2026-10-31

User explicitly accepted [B9-D16 A, qualified](planning/architecture/decisions/B9-D16%20-%20Basic%20Map%20Navigation%20and%20Shared%20Composer%20Commit%20Controls.md): the initial map interface supports **basic panning (“planning” interpreted as pan), zooming, hovering and simple inspection**, not advanced GIS/cartography/editor toolbars. Any supported deliberate map correction uses the **existing primary chat composer overlay with accessible Commit/Discard controls over the action text input**, preserving [B3-D07](planning/architecture/decisions/B3-D07%20-%20Shared%20Pending%20Commit%20Composer%20Overlay.md) and blocking chat use while pending. The map does not have a new Commit location. [B9-D17 A](planning/architecture/decisions/B9-D17%20-%20Deterministic%20Atomic%20Batch%20Placement%20of%20Multiple%20New%20Locations.md) accepts deterministic batch initial placement and one atomic accepted transaction for multiple grounded new locations. [B9-D18 A](planning/architecture/decisions/B9-D18%20-%20Narrator%20Safe%20Spatial%20Reference%20Binding%20Without%20Invented%20Identities.md) accepts narrator-safe natural spatial references and internal TypeScript identity binding without guessing duplicates. **D12 remains deferred, no spatial migration work; D13 remains deferred pending coordinator-conflict clarification; D19–D21 are unapproved Batch 7 proposals.** B9 remains `in-review`; no implementation or tests. Earlier dated sections below remain approval history.

## Latest B9 Batch 5 disposition — 2026-10-31

The user explicitly accepted [B9-D14 A](planning/architecture/decisions/B9-D14%20-%20Renderer%20Independent%20Spatial%20Projections%20and%20S04%20Canvas%20Adapter.md), keeping canonical typed spatial projections renderer-neutral and using S04 for the map drawing adapter; **no SVG/Canvas/WebGL library selected**. [B9-D15 A](planning/architecture/decisions/B9-D15%20-%20Versioned%20Typed%20Browser%20Go%20Spatial%20Service%20Contracts.md) requires versioned typed browser-to-Go spatial requests/results, structural checks, expected-version/library-epoch/idempotency fencing and typed technical errors; Go remains storage authority, not fiction judge. **B9-D13 remains DEFERRED, no ADR**: user requests more explanation and prefers the coordinator to handle map conflicts as well as possible, accepting its result, but no conflict algorithm/UI choice or override of B9-D08's nonblocking conflict obligations was explicitly approved. **B9-D12 remains DEFERRED: no spatial migration work, ADR, scripts or tests.** B9 stays `in-review`; D16–D18 are new unapproved Batch 6 proposals. Earlier sections below preserve historical snapshots, not current status. No code, tests, implementation, stage promotion or closure.

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
