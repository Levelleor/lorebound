---
id: "IDEA-0055"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-17"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Gameplay Feature Catalogue Brainstorm]]", "[[Coordinator Tools and MCP Brainstorm]]", "[[Characters Inventory Equipment and Anatomy Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Optional RPG Mechanics Plugins

## Idea
Allow optional mods for combat, dice, magic, economy, survival, quests, reputation and progression.

## Why this idea matters
Some stories benefit from deterministic rules, while others should stay freeform.

## Accepted direction
- **Optional, independently enabled RPG mechanics:** Allow gameplay modules or mods for combat, dice rolls, magic, economy, survival, quests, reputation and character progression, without requiring all of them for every story. These are example module categories, not a commitment that each will ship initially.
- **Per-system/player choice:** Enable or disable mechanics independently for an adventure. Do not replace this with a mandatory global Freeform/Balanced/Strict simulation policy; skipped IDEA-0049 did not approve such modes.
- **Freeform stories remain possible:** When a module is disabled, its optional mechanics, checks and rules do not constrain unrelated storytelling or impose a required RPG ruleset. Turning off combat or survival should not mean a player cannot describe conflict or hunger in prose.
- **Reuse the universal native capability registry:** Mechanics register discoverable typed capabilities, schema-checked inputs/outputs, permissions and validation under [[Native Gameplay Capability Registry]] (IDEA-0047). Do not introduce a separate RPG engine, mod executor or parallel canonical state authority.
- **Deterministic coordinator authority:** All module-originated proposed operations flow through [[Deterministic Adventure Coordinator]] (IDEA-0044). If a module is enabled, its authoritative game rules and applicable validations must be enforced before changes are committed; neither an LLM nor a UI action can bypass these checks.
- **Common incremental event/state pipeline while installed:** Accepted persistent module changes, including custom module state, use shared canonical event/history records and [[Snapshots and Incremental State Rebuild]] (IDEA-0042). The normal complete reconstruction guarantee applies while the relevant capability is present and supported. **If the plugin is later removed, its own historical state need not be reinterpreted/migrated**; the story can continue without that plugin, preserving surviving canonical history and basic system integrity.
- **User-selected remove/disable simplicity (2026-10-19):** Removing or disabling a module ends its rules and plugin-specific context injection for subsequent AI turns. **No migration, compatibility shim, old-plugin installation requirement, or guarantee of continued plugin-state reconstruction** is required. Previously accepted story text and records are retained as history without turning the removed plugin into an active mechanic. The player accepts that later story outcomes may be unpredictable without the former rules/context. Core event/identity/SQLite safety remains required.
- **Core versus module rules are undecided:** Keep generic identity, capability registration, permissions and state-history infrastructure reusable; do not prematurely commit damage, HP, stats, rolls, spell systems or other rule conventions to core.
- **Leave the content and UX to refinement:** The set of initially shipped modules, rulesets, defaults, configuration UX, module dependencies, lifecycle, versioning and error/recovery behaviour remain open. This acceptance is to staging only, not approval of any mechanics implementation.

## Proposed behaviour
Each optionally enabled rules module declares its domain state schema and typed capabilities via the common registry. For example, an enabled magic module might offer a `magic.cast_spell` operation using stable caster/target references; its validator checks the relevant spell, cost and target rules before any accepted change enters the shared event history. A disabled or removed module neither offers operations nor imposes optional validations, and no longer supplies plugin-specific generation context. Previous story text and available accepted records remain stored, **but removed-plugin custom state is not guaranteed to stay interpretable or replayable**. No migration or compatibility shim is required. Narration and UI controls can use discoverable relevant capabilities, while the deterministic coordinator retains final authority. Exact mechanics and API structures are illustrative, not frozen.

## Alternatives and trade-offs
Hard-wiring combat, dice, experience, magic or survival into the core would make casual freeform adventures subject to unwanted rules and complicate independent configuration. Optional modules improve flexibility but introduce lifecycle, dependencies, version compatibility, cross-module validation and historical-replay challenges. A prose-only approach needs less deterministic configuration but cannot consistently enforce a rules-heavy campaign. The accepted direction uses common lightweight infrastructure with selectively enabled mechanics, not a separate RPG engine or whole-game strictness mode.

## Architecture integration (2026-10-17)
- Optional RPG modules use the **client-side TypeScript capability registry** alongside the Svelte UI and coordinator. Core gameplay effects are not replicated in a Go plugin engine.
- Module-specific persistent records/events are saved into **Go-managed SQLite** through the same atomic history and persistence contracts as built-in mechanics **while that module remains present/supported**. After a module is disabled/removed, continue the story without its mechanics and model context; old custom state need not be replayed, decoded or migrated to maintain play. Supported upgrades may have their own optional compatibility design, but removal alone creates no migration requirement.
- Client-loadable code must not acquire unrestricted Go/database/filesystem access simply by being installed; executable plugin packaging and practical permission boundaries remain separate refinement decisions. **Do not require migrations to keep removed/disabled plugin-specific past state playable**. Compatibility across intentionally supported upgrades remains optional future refinement.

## Dependencies and constraints
- [[Native Gameplay Capability Registry]] (IDEA-0047) defines the accepted universal protocol-neutral operations, permissions, stable IDs and state-effects framework. RPG modules extend this registry rather than creating a new executor.
- [[Deterministic Adventure Coordinator]] (IDEA-0044), [[Typed Tool Rejection and Narrative Repair]] (IDEA-0046) and the configurable narrative pipelines (IDEA-0018) continue to govern validation, rejection, narration coherence and atomic finalisation.
- [[Snapshots and Incremental State Rebuild]] (IDEA-0042) requires complete logged/reconstructible state while the relevant module is supported. **Explicit later user choice:** removed/disabled plugin-specific state does not need migration or historical interpretation for the adventure to continue; core persistent identity/history/atomicity rules still apply.
- Skipped [[Configurable Simulation Strictness]] (IDEA-0049) records the preference for per-plugin/system toggles instead of universal simulation strictness tiers.
- Accepted [[Structured UI Game Actions]] (IDEA-0050) can expose actions only for relevant, currently enabled capabilities; module UIs do not bypass rules.
- This is a staging planning decision. No particular combat rules, model, stats, plugin framework library or module list has been approved for production.

## Open questions
- Which rules belong in core abstractions rather than optional modules?
- What module state schema, capability registration and mod packaging conventions should RPG mechanics use?
- Which example mechanics, if any, ship as built-ins or first-party modules in the initial release?
- How are plugins enabled/disabled per story, configured, versioned and discovered?
- What happens if a module is disabled while canonical state or outstanding outcomes depend on it?
- **Resolved removal policy:** No migration or replay compatibility for removed plugin-specific mechanics is required; continue without their context. What minimal non-destructive retention and status indication should be used for inactive plugin data, without promising to recover former behaviour?
- How do interdependent modules, such as dice and combat or economy and quests, declare requirements and resolve conflicts?
- Which validation, repair, UI-control visibility and error behaviour applies when a module action is invalid or disabled?
- **Resolved scope:** Do not build plugin-removal migrations solely to preserve old mechanic behaviour. Safe plugin updates and optional reinstallation behaviour remain future design questions, not requirements for continuing without a removed plugin.
- How should optional mechanics interact with narrative-only references to combat, hunger, spells or money in an otherwise freeform story?

## Draft acceptance criteria
- [ ] Adventure mechanics such as combat, dice, magic, economy, survival, quests, reputation and progression can be independently enabled where corresponding modules exist.
- [ ] Disabled mechanics do not impose their optional checks or require a global simulation strictness profile; freeform prose remains supported.
- [ ] Enabled modules register operations through the common native capability registry with stable identifiers, typed schemas and appropriate permissions.
- [ ] The deterministic coordinator validates every enabled module operation before committing any authoritative persistent effects.
- [ ] All accepted module effects are durably and incrementally recorded while the relevant module is installed/supported, with no dependence on re-running previous AI output.
- [ ] Disabling/removing a module lets the story continue without its mechanics or extra AI context, does not intentionally erase existing narrative history, and **does not require migrations or reconstructing unavailable plugin-specific state**.
- [ ] Structured UI controls, when present, offer only relevant enabled capabilities, while prose interaction remains usable.
- [ ] The initial module catalogue, actual rulesets, boundaries between core and modules, enable/disable UX and lifecycle choices remain open.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Initially assistant-proposed and now **explicitly accepted by the requesting user** with the optional-per-mechanic and common engine/history constraints.
- This is an accepted **unrefined staging** idea, not a production implementation specification or evidence any plugins are built.

## Decisions and review history

- 2026-10-23 — **Pass A final A-30 correction:** Superseded older promise of complete replay after plugin disablement/removal; no migration or unavailable-plugin reconstruction is required per explicit A-10 decision. Historical records and base-world integrity are retained, without implying a new gameplay/plugin engine. Staging only.

- 2026-10-19 — **Explicit user policy for removed plugins:** No migrations. If a plugin is removed, the adventure simply continues without that module; its rules and plugin-supplied AI context stop applying, and resulting story behaviour may be unpredictable. Retain surviving story history and basic system integrity; no guarantee to replay/reconstruct absent plugin's own custom state. This supersedes earlier unconditional plugin historical-replay language. Staging only.
- 2026-10-17 — **Runtime dependency correction:** The approved IDEA-0053 direction is a **single Wails v3 headless localhost Go server**, packaged for Windows/macOS/Linux and used through the normal browser. The earlier combined WebView-desktop plus headless interpretation has been explicitly superseded. Docker is a separate, unaccepted candidate (IDEA-0065); staging status is unchanged.
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Optional, independently enabled RPG mechanics modules for categories such as combat, dice, magic, economy, survival, quests, reputation and progression. Use the universal native capability registry and deterministic coordinator rather than a separate RPG engine or global strictness modes. Disabled modules impose no optional rules; enabled ones enforce their validations and persist every accepted effect through complete incremental history. Historical reconstruction must remain valid if plugins are disabled or removed. Module catalogue, concrete rules, core-versus-plugin boundaries, configuration and plugin lifecycle remain open. Moved to staging, not production.
