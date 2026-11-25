# Lorebound project context

Lorebound is a local-first, single-player, account-free interactive-fiction workspace. The player creates the story; AI helps write and remember the accepted fiction. Optional mechanics can shape attempted actions before approval, but established prose is not subject to a retrospective simulation veto.

## Current checkout

The production headless Wails v3 host serves a SvelteKit/TypeScript UI to an ordinary browser and owns the SQLite library in Go. It binds to loopback. The current app supports blank adventure creation/resume, provisional Story generation (explicit Simulation or saved local connection), explicit Accept, Retry, committed-turn Undo, independent prefix Forks, accepted passage editing, latest drafts and bounded same-tab recovery. Local narration covers llama.cpp, Custom compatible, native Ollama, LM Studio and vLLM; saved model selection, narration style and per-adventure author notes are read for each Generate/Retry and pinned for that attempt. Local model requests go directly from the browser to the selected server; there is no Go inference proxy or silent provider fallback.

This is a bounded **Story-only, zero-world-effects** implementation. Nonempty tracked effects, Do/Say/Continue, Lorebook, map, global/scene author-note layers, token-budgeted context measurement, broader library lifecycle, authenticated/cloud providers and full platform packaging are later scope. Live Ollama/LM Studio/vLLM interoperability remains unverified. PRs #3–#28 and the mapped stories preserve precise limits rather than certifying entire features.

## Ownership and architecture

| Area | Owner and boundary |
| --- | --- |
| S01 Host and lifecycle | Wails/Go serves browser assets and narrow technical/OS services; no account or required native WebView. |
| S02 Adventure library and starts | Independent IDs and lifecycles; blank, Quick Start, custom and guided openings have distinct acceptance rules. |
| S03 Narrative interaction | Player input, drafts, explicit approval, history-edit and recovery flows. |
| S04 Presentation | Honest provisional/committed/error states and responsive Command Citadel layout; views do not mutate canon. |
| S05 History | One accepted current structured history, with stable passage identity and deterministic TypeScript replay. No competing persistent browser canon or mandatory superseded-revision archive. |
| S06 Coordination | TypeScript prepares permitted operations and owns their intent and approval; Go does not implement a second gameplay engine. |
| S07 AI workflow | Generation, cancellation, interpretation and optional repair produce proposals, not authoritative changes. Resolve entity IDs internally, and leave unsupported or ambiguous facts as prose instead of guessing. |
| S08 Connections | Browser adapters and captured attempt configuration. Go stores only fixed nonsecret provider metadata today. |
| S09 Lore/context/memory | Descriptive lore and derived retrieval/context are not independent position or inventory truth. Measure actual token budgets when supported. |
| S10 Characters and scene | Stable universal characters; Playing As, physical location and presence are separate. |
| S11 World, travel and inventory | Unique custody, explicit routes and semantically scaled persistent coordinates with nested frames. A route graph never determines the layout. |
| S12 Durability | Narrow versioned service envelopes, atomic Go/SQLite transactions and coherent validated reads. Epoch, expected version and idempotent receipts fence conflicts, restore boundaries and uncertain operations. |

Authoritative changes append or replace accepted structured prose and eligible typed effects together. Expected version is monotonic and independent of turn count; uncertain writes recover the original operation then read current canon. Draft text and provisional generations are not accepted. Unsupported stored effects preserve readable prose but block further writes. Map corrections use the shared composer Commit/Discard control, not a separate local toolbar. **B9-D12 spatial migrations are deferred; do not start them without separate approval.**

## Source and detail

- [Product roadmap](product/PRD-0001-lorebound-product-and-delivery-roadmap.md) and [requirement records](product/README.md) distinguish approval, implementation and evidence.
- [Architectural decisions](decisions/README.md), including [narrative-first outcomes](decisions/ADR-0042-narrative-first-declarative-outcome-events.md), [semantic map](decisions/ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md) and [deferred spatial migration](decisions/ADR-0121-b9-and-pass-b-design-closure-with-deferred-spatial-migration.md), govern specific behavior. Later accepted decisions override the affected earlier clauses only.
- [Command Citadel design](decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) and its [reference palette](design/palette-and-presets.css) govern appearance, not feature approval. The palette file is not a runtime stylesheet.
- [Development setup and current behavior](development.md) documents launch, provider limits and CI parity.
