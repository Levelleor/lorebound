---
name: brainstorm
description: Explore, challenge, resume, and refine persistent Lorebound ideas using repository and Obsidian planning context. Use for generating ideas from scratch, revisiting a brainstorm, exploring an accepted idea, or considering changes to implemented features. Brainstorms do not change project decisions until the user explicitly selects an outcome.
argument-hint: "[topic, note, path, or resume]"
---

# Brainstorm

Run an exploratory, persistent ideation session. Adapted for Lorebound from the [Town Incremental brainstorm skill](https://github.com/rev-lev/town-incremental/blob/main/.agents/skills/brainstorm/SKILL.md). Preserve the original approach: divergent exploration, append-only session memory, explicit human choices, and separation of speculation from project truth.

## 1. Orient to Lorebound

Read `AGENTS.md`, `planning/AGENTS.md` and `planning/Start Here.md` first. Inspect only relevant planning notes, linked specs, production proposals and existing code; the repository may be empty of application code. Do not invent an existing feature, product fact, constraint, problem, or implementation.

Three distinct truths:
- **Implemented truth:** code that actually exists, plus `planning/specs/*.md` describing verified behaviour.
- **Accepted plans:** human-selected staging ideas or human-approved production ideas, neither implemented by virtue of their location.
- **Brainstorm possibilities:** ideas being explored, including agent-generated suggestions that have not been approved.

Never present one as another. Templates and archived history are not evidence of implementation.

## 2. Resolve the topic without making duplicate sessions

Arguments are natural-language topics, note names, paths, or `resume`.

- `brainstorm resume`: search `planning/brainstorming/` for `type: brainstorm` and `status: active`. Resume the sole active session, or offer a compact selection (title, topic, updated, Resume Here) if several match.
- `brainstorm resume <query>`: match active title, topic, source, or Current Threads. If ambiguous, ask one short question.
- `brainstorm <topic or note>`: prefer the uniquely matching active brainstorm; otherwise find a specific planning idea/spec or use the text as a fresh topic. Respect requests for `new`, `fresh`, or `branch`.
- Bare `brainstorm`: inspect the repository, read the current plans and open questions, and offer a few grounded avenues. Since the project may be a blank slate, it is fine to invite the human to choose a product goal without fabricating context.

If branching from a completed or active session, create a distinct descriptive name and add `branch_of: "[[Original Brainstorm]]"` in YAML, leaving the original unchanged. Only reopen a completed session if the user explicitly chooses to do so.

## 3. Facilitation mode

Pick the mode implied by the request; do not force a selection prompt.

- **partner** (default): contribute alternatives, challenge assumptions and invite feedback.
- **facilitator**: use questions, constraints, inversion and reframing, without supplying substantial solutions.
- **autonomous**: explore many directions yourself and present a compact option space.

Store `mode` in frontmatter. In partner/facilitator mode, ordinarily ask one substantive question per response; avoid questionnaires or artificial quotas.

## 4. Create an enduring brainstorm document

When the topic is clear, create `planning/brainstorming/<Descriptive Topic> Brainstorm.md` from `planning/templates/Brainstorm.md`. Use `type: brainstorm`, `status: active`, `created`, `updated`, `topic`, `goal`, `mode`, `sources: []`, `outputs: []`, and tags. Populate real source links, not invented ones.

The file, not chat history, is the session memory:
- **Session Log:** append-only dated, concise entries prefixed **User idea**, **AI possibility**, **Question**, **Insight**, **Decision**, or **Direction**. Preserve prior wording and order; append corrections rather than rewriting history.
- **Current Threads:** edit to represent live possibilities and unresolved questions; remove resolved/rejected ones from this list but leave their history in Session Log.
- **Decisions:** record only directions the human explicitly accepted during this brainstorm. These are not approval to implement.
- **Outputs:** link staging ideas deliberately exported; also maintain `outputs` YAML.
- **Resume Here:** short context snapshot, the current direction and best next question. Update this and `updated` after substantive progress.

If the conversation stops or an idea is exported, leave status `active` unless the user explicitly declares the exploration complete. The only brainstorm statuses are `active` and `complete`.

## 5. Diverge before converging

Do not merely elaborate the first viable solution. Explore useful angles:
- challenge assumptions, invert constraints, remove features, simplify or exaggerate;
- compare alternatives, long-term maintenance, user value and failure modes;
- test interactions with accepted plans or verified current behaviour;
- identify dependencies, contradictions, edge cases and opportunities for a cheaper design;
- split combined ideas or connect complementary ones.

Ground claims in inspected notes/code. If facts are missing, record a Question; do not silently turn guesses into project constraints. Keep exploratory research/facts distinct from inventions.

When the user asks to narrow, choose, preserve, refine, or export, compare live alternatives, discuss trade-offs, and record their explicit direction. Convergence alone is not promotion.

## 6. Source artifacts stay unchanged

A brainstorm may begin from a staging idea, approved production idea, current spec, archive document, code behaviour, or earlier brainstorm. Read the source; link it under `sources`; **do not edit, move, demote, or reopen the source** merely to brainstorm alternatives.

For a change to shipped behaviour, create a new exploratory session and, if accepted, a new staging proposal. Keep current specs truthful until changed behaviour ships.

## 7. Export only on explicit human selection

Possible outcomes:

1. **Keep brainstorming:** save Session Log, Current Threads and Resume Here. No staging note is required. `save this` or `continue later` never implies promotion.
2. **Export an accepted idea:** when the human explicitly chooses a direction to pursue, create `planning/staging/<Idea>.md` from `planning/templates/Staging Idea.md`. Include *only* accepted scope, an unambiguous unused `IDEA-` ID, real `accepted_by`/`accepted_at` where known, and `source_brainstorms: ["[[<Brainstorm Note>]]"]`. Keep unresolved questions explicit; staging is intentionally unrefined. Add reciprocal Outputs link in the brainstorm. Never copy speculative alternatives or entire chat logs as approved content.
3. **Update an existing staging idea:** only if the human explicitly accepts the new content. Keep unaccepted possibilities in the brainstorm. Do not automatically advance its stage.
4. **Split a topic:** if explicitly asked, create separate staging notes with distinct IDs for independently accepted directions and link their relationships.
5. **Refine a selected staging idea:** once it exists, follow `planning/AGENTS.md` to refine it. Do not quietly move it. Production requires testable criteria and explicit human approval.

Only a human-approved staging idea can advance to `planning/production/`. Implementation/verification then moves the original idea to `planning/specs/archive/` and creates or updates testable `planning/specs/*.md`. **The brainstorm skill itself never implements, archives, declares tests passing, or writes new current specs on the strength of speculation.**

## 8. Completing and resuming

To resume, read frontmatter, Current Threads, Decisions, Outputs and Resume Here before older log entries. Inspect further context only when relevant. Mention that a session is being resumed rather than creating a duplicate.

Mark `status: complete` only when the user explicitly finishes exploration. Update the final decision, unresolved threads, outputs and Resume Here. Completion does not mean an idea was exported, approved, implemented or shipped.

## 9. Boundaries and reporting

Never:
- silently promote agent suggestions to accepted ideas;
- infer human approval or a user's identity;
- overwrite historical session log entries;
- claim implementation exists without reading code or verified evidence;
- convert a proposed production feature into a current spec;
- duplicate a matching active session without explicit instruction;
- commit or push as a side effect of running the skill without the user's request.

After edits, inspect YAML syntax, link targets and agreement between status and directory. Report the brainstorm path, active/complete status, context read, staging outputs (if any), and its resume point. If nothing was exported, state that the brainstorm is saved but no accepted idea or current specification changed.
