# Lorebound agent instructions

Lorebound is at an early repository stage. Do not infer an implemented product, tech stack, or feature from the project name; inspect the repository before making claims.

## Read first

- For planning work, read [planning/AGENTS.md](planning/AGENTS.md), then [planning/Start Here.md](planning/Start%20Here.md).
- For exploratory ideation, follow [the brainstorm skill](.agents/skills/brainstorm/SKILL.md).
- These instructions apply to agents using Codex, Claude Code, or other compatible tools. Root `CLAUDE.md` imports this file.

## Planning is a promotion pipeline

```text
planning/brainstorming/                exploration, not accepted
          | explicit human selection
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

1. **Exploration is not approval.** Brainstorm freely, but never turn an AI suggestion into a project decision without explicit human acceptance.
2. **Stage gates are deliberate.** Do not promote or change status simply because a note has grown detailed. Ask for or rely on explicit approval for brainstorming → staging and staging → production. Do not invent an approver.
3. **Implementation is a separate gate.** Do not archive a production idea or add it to current specs until the relevant behaviour actually exists and has been checked. Record a code/test reference or human-verified evidence.
4. **One active idea document per accepted stage.** Move its note from staging to production and, once implemented, to specs/archive. Preserve its stable `id`, decision history, and links. Brainstorm session notes stay in brainstorming as exploration history.
5. **Specs describe what is implemented.** Create or update a direct child Markdown file in `planning/specs/` with uniquely identified, objectively testable requirements. Keep planned and unverified requirements out of current specs.
6. **Truth is tiered.** Label information as existing implementation, accepted decision, or exploratory possibility. Check code before claiming implementation; avoid speculative feature claims.
7. **No silent writes.** Before changing project notes, inspect the existing note, related notes/specs, and relevant code. Keep user-authored choices distinct from agent suggestions.

## Creating and advancing ideas

- Start a brainstorm with `/brainstorm [topic]` (or invoke the skill by name). A bare invocation should inspect available project context and propose grounded starting directions.
- Create an active session with [Brainstorm template](planning/templates/Brainstorm.md). Keep an append-only Session Log, live Current Threads, explicit Decisions, Outputs, and Resume Here. Reuse matching active sessions.
- When the human chooses a direction worth pursuing, create a note in staging from [Staging Idea template](planning/templates/Staging%20Idea.md); record the accepted scope and link the originating brainstorm. Brainstorms do not get relocated.
- Refine scope, decisions, alternatives, edge cases, dependencies, measurable acceptance criteria, and questions. Only after explicit readiness approval, move the note to production, preserving the ID and recording approval.
- Implement from an approved production note. When implementation is verified, move the original idea note to `specs/archive/`, add implementation evidence, and create/update [Spec template](planning/templates/Spec.md). Keep the canonical spec aligned with shipped reality.

## Obsidian and note conventions

- Open `planning/` as the Obsidian vault. It is also plain Markdown; do not require Obsidian for repository tooling.
- Frontmatter is YAML. Use `type`, `status`, `created`, `updated`, `tags`, and note-specific fields. Prefer ISO dates (`YYYY-MM-DD`).
- Keep `id` stable across idea promotions. Fill it with a unique, human-readable value such as `IDEA-0001`; do not reuse IDs. Specs use separate IDs such as `SPEC-001`.
- Quote `"[[Obsidian Links]]"` in YAML sequences. Use `[[Note Title]]` in note text, or relative Markdown links when tooling outside Obsidian needs navigation.
- Templates are starting points, not feature decisions. Example text must never be assumed to be Lorebound canon.
- For requirements, use stable IDs (for example `REQ-INVENTORY-001`) and record how each is verified. Do not mark tests passed without evidence.

## Code, git, and reporting

- Prefer small, focused changes consistent with the existing codebase. Do not implement from staging or brainstorming alone.
- Do not mutate implementation merely to complete a brainstorm. Ask only substantive unresolved questions; otherwise proceed with clearly labelled assumptions.
- Check links and frontmatter when moving or creating notes. Remember that Git does not track empty directories.
- Commit, push, or open PRs only when requested by the user. Never claim checks ran if they did not.
- Report what was written, the note's stage, evidence inspected, approvals still required, and any remaining uncertainty.
