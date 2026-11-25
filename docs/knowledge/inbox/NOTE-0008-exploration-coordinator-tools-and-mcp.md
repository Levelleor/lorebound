---
id: NOTE-0008
type: note
status: inbox
source: PRD-0001
related:
- PRD-0029
- PRD-0050
- PRD-0059
- PRD-0049
- PRD-0055
- PRD-0044
- PRD-0037
- PRD-0032
- PRD-0019
- PRD-0036
- PRD-0045
- PRD-0040
- PRD-0046
- PRD-0048
- PRD-0018
- PRD-0056
- PRD-0030
- PRD-0039
- PRD-0051
- PRD-0047
---

# Exploration: Coordinator Tools and MCP

## Discovery

Exploratory history, not project authority. Original session status: **active**. Accepted requirements and decisions take precedence; candidate suggestions remain non-authorizing.

[Pinned source working notes and dated session log](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/brainstorming/Coordinator%20Tools%20and%20MCP%20Brainstorm.md)

## Goal
Coordinate freeform prose with authoritative state and an extensible mod system without requiring narrator models to be tool-trained.

## Context
- Retrospective consolidation of the project-design conversation through 2026-10-16. This records wishes, proposals, trade-offs, and open questions; it is **not** an implementation specification or approval to ship.
- Repository guidance: Start Here (in the planning vault) and the repository AGENTS.md. No application functionality is asserted as implemented.
- Terminology: **User direction** = explicitly expressed preference; **AI possibility** = suggested but not selected; **Open** = requires a design decision.

## The essential contradiction
A narrator can say: “Elara hands you a sword, then leads you to the castle.” The sword may be absent or too heavy, and the castle may not be directly connected. A tool rejecting an operation **after** the prose has been shown creates inconsistent story truth. The interpreter can also omit events or invent ungrounded events. Valid JSON does not imply complete extraction.

## Roles (proposed)
- **Narrator:** freeform RP prose and dialogue, possibly lacking tools support.
- **State Interpreter/Planner:** translates player intent or candidate narration to proposed typed game events; optional separate model but can share narrator model.
- **Adventure Coordinator:** deterministic TypeScript orchestration of generation stages, requested tool operations, retries and commit.
- **World/Rules Engine:** deterministic entity/rule validation; authority over accepted state.
- **Capability Registry:** discoverable, versioned action definitions provided by core modules and plugins.
- **MCP adapter:** expose supported external tools through the registry, not the internal persistence contract.

## Core operation cycle
1. Propose action(s) with stable entity IDs and contextual arguments.
2. Resolve entities and check schemas, authority/permissions and preconditions.
3. **Prepare** a batch of proposed events without mutating live authoritative state.
4. Validate *all* related changes against a consistent snapshot, returning typed errors.
5. Commit accepted story revision and world events atomically where possible.
6. Publish accepted events to all projections (inventory, equipment, map, context, memories).
7. On rejection, provide structured error and current relevant facts to interpretation/narration. Repair draft prose or narrate failed attempt; do not silently commit false state.
8. Bound automatic retries; after repeated failures avoid corrupting state and allow user correction.

## Example
~~~json
{
  "operation": "inventory.transfer",
  "arguments": {"itemId":"silver-dagger","from":"elara","to":"player"}
}
~~~
Rejected:
~~~json
{
  "success": false,
  "code": "ITEM_NOT_OWNED",
  "message": "Elara does not own silver-dagger.",
  "retryable": true
}
~~~
The narrator may revise the draft to a failed search instead of an impossible transfer. **This is a suggested workflow, not proven model behaviour.**

## Capability contract questions
A possible API advertises capability ID, description, JSON schema, side-effect category, required permissions, preconditions, validator, event-producing executor and readable result formatter. Version tool schemas and events so mods can evolve. Use deterministic JS reducers for game-world truth. Model should choose from *relevant* registered tools, not every installed tool indiscriminately.

## MCP and plugin extensions
- Native game capabilities: items, characters, equipment, anatomy, locations, movement, conditions, relationships, world discovery, lore edits.
- Future plugins: combat, magic, health, trading/economy, survival, quests, custom world rules.
- External MCP: read-only search/lookup, external data, and optional side-effecting services.
- Local stdio MCP typically needs a Node/process bridge; browser-reachable HTTP MCP may work where CORS and permission model permit.
- Distinguish **read-only**, **transactional in-world** and **external side-effecting** actions.
- Replay historical **recorded events or tool results**, NEVER automatically rerun external tools (a story rollback must not repeat file writes or network actions).
- Handle timeouts, error codes, retries, approval/permission prompts, plugin unload, unavailable tools and schema conflicts.
- Standard tool feedback concept resembles coding-agent hooks, but story requires coherent prose repair rather than merely rewriting code.

## Approaches under discussion
- Validate explicit player actions before narration; arbitrary natural language usually requires a model to interpret intent.
- Validate narrator-invented events using a draft-extract-validate-repair pass, or constrain narration to planned allowed outcomes.
- Alternative: single generation returns both prose and proposed events, validation before commit.
- Simulation strictness presets (freeform / balanced / strict) may control validation depth and latency.
- Failed tool calls can become *story events* of failure rather than force success; distinguish attempted action from accomplished state.

## Safety and determinism engineering questions
- One batch may contain multiple dependent actions (create item, then transfer); ordering and rollback need clear semantics.
- Inventory capacity, spatial adjacency and anatomy slot compatibility may come from optional modules; engine must know which validators are active.
- A plugin should not directly mutate random application stores; emit events through agreed contracts.
- UI previews during streaming should not become authoritative until validated and committed.
- External MCP operations cannot be covered by SQLite transactions; confirmations, idempotency and compensation may be needed.


## Current Threads
- Pick a minimal internal capability/event API independent of MCP.
- Define stable ordering and error semantics for dependent actions.
- Compare one-call structured narration with two-pass planning or audits against actual RP models.
- Decide what to do when the narrator repeatedly adds unvalidated events.

## Decisions
- The user agreed state-extraction should propose changes rather than overwrite world truth.
- Tool rejection with explanatory feedback and an extensible mod/plugin design are desired directions.
- No final generation/validation strategy has been selected.

## Classification

Historical exploration; related product records contain approval and implementation boundaries.
