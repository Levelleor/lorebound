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
brainstorming/         Explore ideas, question assumptions, keep session memory
     |
     | Human selects a worthwhile direction
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

**Production is planned work; Specs is current implemented truth.** They are not interchangeable.

## Working with an idea

1. Invoke the `brainstorm` skill or create a note from [[Brainstorm]] in `brainstorming/`. Name it `<Topic> Brainstorm.md`. Write freely, label AI possibilities, and update its Session Log and Resume Here on each substantive session.
2. To preserve a chosen direction, explicitly accept it for refinement. Create a separate note from [[Staging Idea]] in `staging/`, give it an unused `IDEA-` ID, carry across **only accepted ideas**, and link to the brainstorm. Leaving a brainstorm active is perfectly normal.
3. Refine the staging idea. Resolve key questions and express acceptance criteria as behaviour that can be checked. When you explicitly approve the resulting plan, **move** that same idea note to `production/`, set `status: production`, and record actual approval information. The [[Production Idea]] template is a checklist/reference when preparing it; do not discard the original note's history.
4. Implement the approved plan and verify it. Move its idea document to `specs/archive/` only when fully implemented; preserve the ID and add implementation/test evidence. Create or update one or more spec notes directly in `specs/` using [[Spec]]. Specs contain stable requirement IDs and how to verify them.
5. For new changes to shipped behaviour, start a separate idea and keep the existing spec truthful until implementation changes. Update the existing spec during verified implementation, not at brainstorm time.

## Obsidian setup

- The `templates/` directory is preconfigured as the built-in Templates folder. Use the command **Templates: Insert template** or create a new note and insert the desired template.
- Enable Obsidian's built-in **Templates** core plugin if your local Obsidian settings do not already enable it.
- Properties at the top are YAML frontmatter. Use `type`, `status`, `created`, `updated`, `tags`, and the stage-specific fields in the templates for search/filtering. Keep dates in `YYYY-MM-DD` form.
- Links such as `[[My Idea]]` are Obsidian wikilinks. When stored in frontmatter, quote them: `["[[My Idea]]"]`.
- You can search for `[type:idea]` or for `status:production` using Obsidian's property search, and use the file explorer to see each stage. Nothing here requires a community plugin.

## Starting empty

The stage folders are deliberately empty. Templates are not proposals, and no invented Lorebound features have been approved or marked as implemented.
