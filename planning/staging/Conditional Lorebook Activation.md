---
id: "IDEA-0021"
type: idea
status: staging
origin: agent
created: "2026-10-16"
updated: "2026-10-16"
accepted_at: "2026-10-16"
accepted_by: "requesting user (chat confirmation)"
source_brainstorms: ["[[Memory Lorebook and Context Brainstorm]]"]
related: []
tags:
  - planning/idea
---
# Conditional Lorebook Activation

## Idea
Selectively include entries based on keywords, aliases, location or logical conditions.

## Why this idea matters
Sending all lore every turn wastes context.

## Accepted direction
- **Optional rules-based activation:** Allow Lorebook entries to be selectively included in a generation context based on explicit, inspectable triggers rather than requiring all lore to be sent every turn.
- **Keyword and alias matching:** Match configured words, names and alternative labels relevant to the current action, scene or context.
- **Location and logical conditions:** Support location-related activation and combinations of conditions where applicable, such as an entity's presence or a defined world-state condition.
- **Priority controls:** Let players prioritise eligible entries when too many are triggered for the available model context budget, without silently misrepresenting omissions.
- **Activation inspector:** Explain which entries matched, which rules matched them, what was included and what was omitted or blocked.
- **Explicit manual control takes precedence:** Player-pinned/manual include and manual exclude selections accepted in [[Entity-Based Lorebook]] (IDEA-0020) override automatic triggers. In particular, an explicitly excluded entry must not be reintroduced automatically. A manual inclusion may still be subject to available context limits, with a visible warning if omitted.
- **No mandatory embeddings:** Rules-based activation must work independently of semantic retrieval and without an embedding model.
- **Separate RAG proposal:** Embedding-driven selection and RAG remain the **unaccepted** Inbox idea [[Embedding-Based Lore Retrieval and RAG Context Selection]] (IDEA-0063), and are not approved by this decision.

## Proposed behaviour
On each relevant generation, evaluate enabled Lorebook triggers against the current player input, recent narration, scene/location and validated world-state facts as appropriate. Gather candidate entries and apply player-manual include/exclude choices before calculating priority and context size. Show activation reasons and distinguish eligible entries from material actually included in the effective AI context. Leave exact rule syntax, timing, trigger targets and conflict priority refinable; this feature does not require or silently enable embedding-based RAG.

## Alternatives and trade-offs
Exact keyword and alias matching are easier to explain and debug but can miss conceptually relevant lore; richer logical conditions add power with some configuration complexity. Semantic retrieval could complement this later but is a distinct unaccepted RAG idea (IDEA-0063). Players should be able to use manual Lorebook context selection without enabling rules, and should be able to disable auto-activation when desired.

## Dependencies and constraints
- Depends on accepted [[Entity-Based Lorebook]] (IDEA-0020), including durable entity IDs, manual context inclusion/exclusion and an accurate distinction between persistent lore and authoritative mutable world state.
- The separately **accepted staging** [[Token-Budgeted Context Builder and Inspector]] (IDEA-0024) owns detailed context budgeting, omission reasons and requested/selected/transmitted inspection. Its implementation scope is not implicitly part of IDEA-0021; the two accepted directions are compatible.
- Never allow triggered lore to override authoritative world state or to treat character rumours as unquestioned facts.
- Automatic rules must not defeat a player's explicit exclusions or hide that a requested included entry was omitted due to size limits.
- No semantic embedding model or vector index should be required for this accepted rules-based feature; IDEA-0063 remains unaccepted.
- Avoid unbounded recursive activation or unpredictable chains of triggered entries; design deterministic ordering and explicit limits during refinement.
- Changing trigger rules only affects future context assembly; it does not rewrite historical prose or committed world-state changes.

## Open questions
- How should ambiguous alias matches and common words be handled to avoid false positives?
- Which source text is checked for triggers: latest player action, recent prose, full scene, current entities or a configured mixture?
- What syntax is appropriate for logical conditions, and how are conditions evaluated against validated state?
- How should manual pins/exclusions, priorities and context limits resolve conflicts?
- Should triggered entries recursively activate related lore, and if so, what depth/limits are safe?
- How should the activation inspector present the distinction between a rule match and actual inclusion in the transmitted prompt?
- Are automatic triggers enabled globally, per story or per entry, and what should initial defaults be?

## Draft acceptance criteria
- [ ] An entry can define keyword and alias triggers used to select it for a future generation.
- [ ] Location-based and logical conditions can activate eligible Lorebook entries when their configured criteria are satisfied.
- [ ] Rules-based activation is optional, not a requirement to use the manually controlled Lorebook.
- [ ] A player's explicit exclusion prevents the excluded entry from being injected by automatic matching.
- [ ] A player's manually pinned entry is considered for inclusion regardless of trigger matching, subject to clear context-limit feedback.
- [ ] The activation inspector identifies matched conditions, priorities and whether selected entries were ultimately included or omitted.
- [ ] An entry's inclusion respects context-size limits, avoiding silent dropping or false claims that omitted content was sent.
- [ ] No embedding model or RAG retrieval is required for conditional Lorebook activation.
- [ ] Changing activation rules does not independently modify canonical narrative or world-state history.

## Refinement checklist
- [ ] Behaviour and scope are clear
- [ ] Dependencies, edge cases and failures considered
- [ ] Open blocking questions resolved
- [ ] Acceptance criteria are testable
- [ ] Human approved promotion to production

## Evaluation notes
- Origin: **agent**. Originally assistant-proposed, now explicitly accepted by the user.
- Accepted for **staging/refinement only**; no production approval or implemented feature is claimed.
- IDEA-0063, the user's separately captured semantic embedding/RAG proposal, remains an unaccepted candidate.

## Decisions and review history

- 2026-10-19 — **Pass A reference correction:** IDEA-0024 is already accepted independently in staging. Earlier description of it as unaccepted is obsolete. Automatic Lorebook activation still honours manual exclusions; embedding-based RAG IDEA-0063 remains unaccepted. No new approval.
- 2026-10-16 — Captured from discussion as an **unaccepted Inbox candidate**.
- 2026-10-16 — **Explicitly accepted by the requesting user:** Optional keyword, alias, location and logical-condition Lorebook activation, priorities, activation inspection and precedence for explicit manual inclusion/exclusion. The user replied "Accept this" to the presented IDEA-0021 scope. Embedding-based RAG (IDEA-0063) remains a separate unaccepted Inbox candidate. Moved to staging for refinement only, not production.
