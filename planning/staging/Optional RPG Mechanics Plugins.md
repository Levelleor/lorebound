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
- **Common incremental event/state pipeline:** Each module's accepted persistent changes, including custom module state, must be representable through the shared canonical event/history system and [[Snapshots and Incremental State Rebuild]] (IDEA-0042). Any supported historic turn must remain fully reconstructible.
- **Plugin lifecycle must preserve historical state:** Disabling or removing a module must not silently erase or reinterpret historical events or break reconstruction. The exact handling of retained schemas, event versions, migration, missing plugins and replay compatibility needs refinement.
- **Core versus module rules are undecided:** Keep generic identity, capability registration, permissions and state-history infrastructure reusable; do not prematurely commit damage, HP, stats, rolls, spell systems or other rule conventions to core.
- **Leave the content and UX to refinement:** The set of initially shipped modules, rulesets, defaults, configuration UX, module dependencies, lifecycle, versioning and error/recovery behaviour remain open. This acceptance is to staging only, not approval of any mechanics implementation.

## Proposed behaviour
Each optionally enabled rules module declares its domain state schema and typed capabilities via the common registry. For example, an enabled magic module might offer a `magic.cast_spell` operation using stable caster/target references; its validator checks the relevant spell, cost and target rules before any accepted change enters the shared event history. A disabled module neither offers its operations nor imposes its optional validations. Its already recorded historical data remains available and interpretable for reconstruction even if the module is later disabled. Narration and UI controls can use discoverable relevant capabilities, while the deterministic coordinator retains final authority. Exact mechanics and API structures are illustrative, not frozen.

## Alternatives and trade-offs
Hard-wiring combat, dice, experience, magic or survival into the core would make casual freeform adventures subject to unwanted rules and complicate independent configuration. Optional modules improve flexibility but introduce lifecycle, dependencies, version compatibility, cross-module validation and historical-replay challenges. A prose-only approach needs less deterministic configuration but cannot consistently enforce a rules-heavy campaign. The accepted direction uses common lightweight infrastructure with selectively enabled mechanics, not a separate RPG engine or whole-game strictness mode.

## Architecture integration (2026-10-17)
- Optional RPG modules use the **client-side TypeScript capability registry** alongside the Svelte UI and coordinator. Core gameplay effects are not replicated in a Go plugin engine.
- Module-specific persistent records/events are saved into **Go-managed SQLite** through the same atomic history and persistence contracts as built-in mechanics, ensuring complete replay after module upgrades or disablement.
- Client-loadable code must not acquire unrestricted Go/database/filesystem permissions simply by being installed; executable plugin packaging, sandboxing and version migrations remain separate refinement decisions.

## Dependencies and constraints
- [[Native Gameplay Capability Registry]] (IDEA-0047) defines the accepted universal protocol-neutral operations, permissions, stable IDs and state-effects framework. RPG modules extend this registry rather than creating a new executor.
- [[Deterministic Adventure Coordinator]] (IDEA-0044), [[Typed Tool Rejection and Narrative Repair]] (IDEA-0046) and the configurable narrative pipelines (IDEA-0018) continue to govern validation, rejection, narration coherence and atomic finalisation.
- [[Snapshots and Incremental State Rebuild]] (IDEA-0042) requires complete historical reconstruction for every persisted field, including module-owned canonical state, even when plugins are disabled, updated or missing.
- Skipped [[Configurable Simulation Strictness]] (IDEA-0049) records the preference for per-plugin/system toggles instead of universal simulation strictness tiers.
- Accepted [[Structured UI Game Actions]] (IDEA-0050) can expose actions only for relevant, currently enabled capabilities; module UIs do not bypass rules.
- This is a staging planning decision. No particular combat rules, model, stats, plugin framework library or module list has been approved for production.

## Open questions
- Which rules belong in core abstractions rather than optional modules?
- What module state schema, capability registration and mod packaging conventions should RPG mechanics use?
- Which example mechanics, if any, ship as built-ins or first-party modules in the initial release?
- How are plugins enabled/disabled per story, configured, versioned and discovered?
- What happens if a module is disabled while canonical state or outstanding outcomes depend on it?
- How can old histories replay when the original plugin is removed, upgraded or unavailable, without rerunning AI or applying obsolete code incorrectly?
- How do interdependent modules, such as dice and combat or economy and quests, declare requirements and resolve conflicts?
- Which validation, repair, UI-control visibility and error behaviour applies when a module action is invalid or disabled?
- How do migrations preserve accepted incremental history, versioned outcomes and old adventure compatibility?
- How should optional mechanics interact with narrative-only references to combat, hunger, spells or money in an otherwise freeform story?

## Draft acceptance criteria
- [ ] Adventure mechanics such as combat, dice, magic, economy, survival, quests, reputation and progression can be independently enabled where corresponding modules exist.
- [ ] Disabled mechanics do not impose their optional checks or require a global simulation strictness profile; freeform prose remains supported.
- [ ] Enabled modules register operations through the common native capability registry with stable identifiers, typed schemas and appropriate permissions.
- [ ] The deterministic coordinator validates every enabled module operation before committing any authoritative persistent effects.
- [ ] All accepted persistent module state changes participate in complete, incremental and deterministically reconstructible event history.
- [ ] Disabling or removing a module does not erase or make historic accepted state/events irrecoverable; exact compatibility and migration design is refined before production.
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
- 2026-10-17 — **Dependency alignment with accepted IDEA-0053/0051:** Wails v3 desktop/headless delivery, client-side TypeScript coordinator/gameplay plugins and Go-managed filesystem SQLite are selected. The integration section records the impact on this existing staging idea; its remaining behavioural choices are **not** thereby approved for production.
- 2026-10-16 — Extracted from brainstorming as an **unaccepted candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Optional, independently enabled RPG mechanics modules for categories such as combat, dice, magic, economy, survival, quests, reputation and progression. Use the universal native capability registry and deterministic coordinator rather than a separate RPG engine or global strictness modes. Disabled modules impose no optional rules; enabled ones enforce their validations and persist every accepted effect through complete incremental history. Historical reconstruction must remain valid if plugins are disabled or removed. Module catalogue, concrete rules, core-versus-plugin boundaries, configuration and plugin lifecycle remain open. Moved to staging, not production.
