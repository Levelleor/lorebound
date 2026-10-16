---
name: brainstorm
description: Explore, challenge, resume and refine persistent Lorebound brainstorms; split large sessions into separate unaccepted Inbox candidate ideas. Use for ideation, resumption, extracting alternatives, reviewing candidates and rethinking implemented features. Capturing a candidate is not approval.
argument-hint: "[topic, note, path, or resume]"
---

# Brainstorm

Run an exploratory, persistent ideation session. Adapted for Lorebound from the [Town Incremental brainstorm skill](https://github.com/rev-lev/town-incremental/blob/main/.agents/skills/brainstorm/SKILL.md). Preserve the original approach: divergent exploration, append-only session memory, explicit human choices, and separation of speculation from project truth.

## 1. Orient to Lorebound

Read `AGENTS.md`, `planning/AGENTS.md` and `planning/Start Here.md` first. Inspect only relevant planning notes, linked specs, production proposals and existing code; the repository may be empty of application code. Do not invent an existing feature, product fact, constraint, problem, or implementation.

Four distinct categories:
- **Implemented truth:** code that actually exists, plus `planning/specs/*.md` describing verified behaviour.
- **Accepted plans:** human-selected staging ideas or human-approved production ideas, neither implemented by virtue of their location.
- **Inbox candidates:** individual idea notes under `planning/inbox/`, kept for evaluation but **not accepted**, even if extracted from user suggestions.
- **Brainstorm possibilities:** ideas being explored, including agent-generated suggestions that have not been approved.

Never present one as another. Templates and archived history are not evidence of implementation.

## 2. Resolve the topic without making duplicate sessions

Arguments are natural-language topics, note names, paths, or `resume`.

- `brainstorm resume`: search `planning/brainstorming/` for `type: brainstorm` and `status: active`. Resume the sole active session, or offer a compact selection (title, topic, updated, Resume Here) if several match.
- `brainstorm resume <query>`: match active title, topic, source, or Current Threads. If ambiguous, ask one short question.
- `brainstorm <topic or note>`: prefer the uniquely matching active brainstorm; otherwise find a specific Inbox candidate, staging/production idea, spec or use the text as a fresh topic. Respect requests for `new`, `fresh`, or `branch`.
- Bare `brainstorm`: inspect the repository, current Inbox candidates, active plans and open questions, and offer a few grounded avenues. Since the project may be a blank slate, it is fine to invite the human to choose a product goal without fabricating context.

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
- **Outputs:** link individual Inbox candidates extracted from the brainstorm, even while unaccepted; also maintain `outputs` YAML.
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

A brainstorm may begin from an Inbox candidate, staging idea, approved production idea, current spec, archive document, code behaviour, or earlier brainstorm. Read the source; link it under `sources`; **do not edit, move, demote, or reopen the source** merely to brainstorm alternatives.

For a change to shipped behaviour, create a new exploratory session and, if captured, a new Inbox candidate. Keep current specs truthful until changed behaviour ships.

## 7. Capture independent candidates without accepting them

A brainstorm can contain many related, competing or completely independent directions. Its exploratory history remains in `planning/brainstorming/`, while each candidate worthy of individual tracking may live in a separate `planning/inbox/` note.

Possible outcomes:

1. **Keep brainstorming:** update the session file only. `save this`, `continue later` or a conversation ending does not create Inbox notes or change approval status.
2. **Extract one or many candidates into Inbox:** when the user asks to `extract`, `capture ideas`, `split this brainstorm`, `make separate idea documents`, or otherwise explicitly requests candidate records, identify distinct independently evaluable ideas. Create `planning/inbox/<Descriptive Idea>.md` from `planning/templates/Candidate Idea.md` for each, with an unused immutable `IDEA-` ID, `status: candidate`, `origin: user|agent|mixed`, and `source_brainstorms: ["[[<Brainstorm Note>]]"]`. Preserve the rough claim, why it might be interesting, open questions and alternatives. Identify agent speculation accurately. Do **not** fabricate acceptance, `accepted_at` or `accepted_by`. Add the Inbox links to brainstorm Outputs and frontmatter. **The human has only requested a record, not approved the ideas.**
3. **Update an Inbox candidate:** if asked to develop or compare ideas, improve its working description without declaring it accepted. Avoid duplicate candidates by searching filenames, topics and links first. Keep origin and links truthful. Do not extract every passing thought automatically or create an enormous pile of notes without the user's request.
4. **Accept an Inbox candidate for staging:** only if the human explicitly chooses it for refinement, **move its existing file** to `planning/staging/`, keep its ID and provenance, set `status: staging`, record real `accepted_at` and `accepted_by` if known, and make accepted scope clear. The staging template is a guide for missing sections, not a reason to replace its history. Unchosen alternatives stay in Inbox. If the accepted proposal first appears only in the brainstorm, create it in Inbox and then move the same file to staging.
5. **Reject an Inbox candidate:** on explicit rejection, retain the note in Inbox with `status: rejected` and a factual decision/reason. A rejected note is not a staging proposal, and may be reconsidered only at human direction.
6. **Refine a staging idea:** follow `planning/AGENTS.md`; do not automatically move it to production. Promotion requires testable criteria and explicit human approval.

Splitting a single brainstorm into multiple candidate documents is independent of deciding which to pursue. Captured candidates can remain unresolved indefinitely. Only a human-accepted Inbox idea enters staging; only a human-approved staging idea enters production. Implemented and verified work then moves the original idea to `planning/specs/archive/` and updates current `planning/specs/*.md`. **The brainstorm skill itself never implements, archives, claims tests passed, or writes specs from speculation.**

## 8. Completing and resuming

To resume, read frontmatter, Current Threads, Decisions, Outputs and Resume Here before older log entries. Inspect further context only when relevant. Mention that a session is being resumed rather than creating a duplicate.

Mark `status: complete` only when the user explicitly finishes exploration. Update the final decision, unresolved threads, outputs and Resume Here. Completion does not mean an Inbox candidate was captured, accepted, implemented or shipped.

## 9. Boundaries and reporting

Never:
- mistake extracted Inbox candidates or agent suggestions for accepted ideas;
- infer human approval or a user's identity;
- overwrite historical session log entries;
- claim implementation exists without reading code or verified evidence;
- convert a proposed production feature into a current spec;
- duplicate a matching active session without explicit instruction;
- commit or push as a side effect of running the skill without the user's request.

After edits, inspect YAML syntax, link targets and agreement between status and directory. Report the brainstorm path, active/complete status, context read, Inbox candidates extracted (if any), decisions actually accepted (if any), and resume point. If candidates were extracted, explicitly say they remain unaccepted. If none were extracted, say the brainstorm is saved without changing any project idea or spec.
