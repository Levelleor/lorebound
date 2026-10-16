---
type: guide
status: current
created: 2026-10-16
updated: 2026-10-16
tags:
  - planning/guide
---
# Start Here

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
