---
id: NOTE-0004
type: note
status: inbox
source: PRD-0001
related:
- STORY-0002
- STORY-0003
- STORY-0004
- STORY-0032
- STORY-0035
- STORY-0037
---

# Development evidence and historical corrections through PR 28

## Discovery

- The blank-adventure milestone replaced the Gate 0 test-record interface (PRs #3–4); the earlier proof does not document how to use the current application.
- DEV-003D shipped a temporary composer-only history. The user rejected that scope as a solution to committed Undo; PR #15 removed those custom controls. PR #18 adds a separate passage-editor-only history, not canonical Redo.
- Local Qwen3/ROCm/Linux Firefox had bounded completed and streamed narration checks. Simulated protocol replies for Ollama, LM Studio and vLLM are not live-model interoperability results. Automated suites used real browser and Go/SQLite boundaries.
- The accepted UI refinement keeps a fixed composer with an independent full-height Story scrollbar; only the oversized input or narration section scrolls as needed. Use the actual pinned Command Citadel source, not demo sample data.
- PR #28 refreshed saved model selection for each attempt (Generate and Retry); its confirmed merge satisfies the scoped closure. The broader DEV-004 selection remains a separate future authorization.

## Classification

Historical implementation discoveries. [Pinned source original journal and approval chronology](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/JOURNAL.md) · [Pinned source source current handoff](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/NOW.md)
