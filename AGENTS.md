# Lorebound agent instructions

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
