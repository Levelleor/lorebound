---
id: STORY-0015
type: story
status: completed
parent: PRD-0005
depends_on:
- STORY-0002
priority: 3
related:
- PRD-0012
- PRD-0005
- PRD-0040
- PRD-0052
- STORY-0003
---

# Independent committed Story-prefix Fork

## Outcome

Independent committed Story-prefix Fork.

[Legacy task: DEV-003B](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/TASKS.md#dev-003b)

**Bounded delivery verified and merged:** [PR #12](https://github.com/Levelleor/lorebound/pull/12), confirmed on source main at `8cf1b925dd5b576e8b1c59254134b520264b56c4`. Broader IDEA delivery is not inferred.

## Acceptance criteria

accessible small icon beneath each accepted turn; complete supported prefix/baseline in an independent adventure and separate browser tab/window; default `fork: [source name]`, codepoint-safe to 160; source URL/history/live input preserved. Blocked popup makes no write; lost-response/closed/navigated-target recovery does not recopy; stale rejection requires a new deliberate decision. Atomic copy/rollback, source version/epoch/idempotency guards, isolation and restart apply. No turn/title form, rename, schema migration, source receipts or provisional/draft copy.

## Verification plan and evidence

[Pinned source requirements or delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/requirements/DEV-003B.md)

The user authorised this child and one primary PR on 2026-11-06, then approved finalising/merging PR #12 with “yes finish the task”. **PR #12 is confirmed merged; this child is VERIFIED within its bounded Story-only zero-effects scope.** [Delivery/review/CI record](STORY-0015-independent-committed-story-prefix-fork.md). This inventory does not certify the full IDEA or authorise another child.

## Remaining parent and dependency audit

[DEV-003 audit](STORY-0003-retry-drafts-undo-fork-and-current-history-prose-editing.md) retains Retry completed; shared drafts, temporary editor undo, committed Undo, historical prose editing and reconstruction remain later. Drafts require their own noncanonical persistence/base/epoch lifecycle; Undo and historical editing require changing append-only/version-equals-turn-count assumptions. Fork can independently reuse the current adventure-scoped persistence and replay contract without either change. Full Duplicate/export, world, Lorebook, memory and plugins are not prerequisites for copying the entire currently supported zero-effects Story state; their future Fork coverage remains incomplete.

Read [IDEA-0011](../../product/PRD-0012-manual-generation-branches.md), [IDEA-0004](../../product/PRD-0005-retry-undo-and-alternative-continuations.md), [IDEA-0039](../../product/PRD-0040-event-sourced-world-history.md), [IDEA-0051](../../product/PRD-0052-browser-persistent-story-database.md), [B4-D05](../../decisions/ADR-0028-independent-fork-from-current-adventure-prefix.md), B3-D02/D04/D05, B6-D01 and the visual contract. B4-D05 permits engineering choice of scoped ID reuse: turn/passage IDs remain stable, copied rows receive the new adventure ID; no mutable row is shared. No new schema, checkpoints or model calls are needed.

## Stable IDEA-0011 inventory

This inventories the operative original IDEA with later ADR qualifications. Whole-IDEA implementation remains incomplete. All eight rows have **PASS evidence for the supported Story-only zero-effects portion**, verified/merged in PR #12 within that scope. Broader mixed/later obligations are not certified by this child.

| ID | Accepted behavior / source | Child disposition and evidence target |
| --- | --- | --- |
| IDEA-0011/R01 | Accepted direction: explicit Fork creates separately addressable adventure, source unchanged. | User correction 2026-11-06: small accessible icon below the clicked accepted turn; opens a separate browser tab/window with default `fork: [source name]`; source tab/input intact. No implicit Fork on Retry. |
| IDEA-0011/R02 | Any committed turn: actual current accepted boundary, including one without checkpoint. | First/interior/latest accepted turn; reject baseline, missing/provisional IDs, beyond-head and stale source. |
| IDEA-0011/R03 | Complete prefix through boundary inclusive with Turn-0 baseline and coherent current references; exclude later source. B3-D04 removes old revision lineage. | Exact structured passages/IDs/order and empty events, baseline; full state replay in browser. Nonempty effects, world/Lorebook/memory/plugin data later; unsupported history fails closed. |
| IDEA-0011/R04 | Independent future: no mutable sharing or source truncation/rewrite/regeneration. | Real independent append in both adventures and exact source/fork reads after restart. Rename/edit/delete isolation later with those features. |
| IDEA-0011/R05 | Safe Fork: coherent atomic Go/SQLite copy, validated source version and boundary, technical reference integrity. | Source expected-version/epoch; receipt/payload integrity; injected mid-copy failure rolls back destination and receipt; concurrent write yields exact prefix or stale rejection. |
| IDEA-0011/R06 | Exclude noncanonical drafts, pending edits, unfinished generation, credentials and incomplete operations. | Copy only baseline/current accepted prefix; no source operation receipts copied; UI guards provisional/saving/uncertain states, no input copied. Durable drafts/edit/provider systems later. |
| IDEA-0011/R07 | Separate feature boundaries: own library item, no in-story branch selector/tree, no export/checkpoint prerequisite, Undo/Retry stay distinct. | Direct per-turn Fork action, no selector/title form, and ordinary library resume; existing Retry/accept regressions. |
| IDEA-0011/R08 | Independently usable with supported state and related lifecycle features. | Continued Story generation/accept/read/reopen verified here; broader editing, rename/delete, world/context/plugin lifecycle remains later. |

Technical recovery obligations also use B3-D02/D05 and IDEA-0051: freeze request/IDs while a response is uncertain, retry that exact request, check epoch before receipts, recover a successful receipt even if source subsequently advanced, reject changed payload and stale new requests without automatic rebasing.

## Required gates and exclusions

CI covers build/typecheck, TS lifecycle contracts, real SQLite atomicity/fencing/isolation/concurrency and actual Firefox/Wails/Go acceptance/recovery/restart. UI checks cover relevant Dark/Bright widths, icon/keyboard placement, separate tabs and no overflow; source/coverage and visual review remain applicable. [Delivery record](STORY-0015-independent-committed-story-prefix-fork.md) links the passing checked head and confirmed merge. Wider obligations below remain incomplete.

No full IDEA or additional atomic row certification is inferred from bounded coverage. B9-D12 is **DEFERRED — NO WORK**. Live AI, nonempty effects, persisted checkpoints, Undo/history edits, shared drafts, export/backup, credentials and Windows/macOS packaging are excluded.

## Current UX correction — 2026-11-06

The user rejected the first dialog iteration before giving merge approval. The selected accepted turn is implicit in the icon beneath it; clicking immediately starts its fork and opens a separate browser tab/window. There is no turn selector/title form. The automatic title is lowercase `fork: ` plus source title, truncated by Unicode codepoints to the existing 160-codepoint limit; renaming remains a separate feature. Source URL, accepted history and live input stay intact.

Synchronously reserve the target while the click has browser user activation. A blocked pop-up produces no request/write. Pending/uncertain Fork is single-flight across all turn icons; Recover reuses the immutable request. Closing/navigating the target does not cancel or recopy the durable operation; offer a normal Open fork link after confirmed success. Stale rejection refetches current source and requires a deliberate fresh icon click. The original modal iteration is superseded; [delivery/review evidence](STORY-0015-independent-committed-story-prefix-fork.md) applies to the corrected interaction and confirmed merge.

Atomic requirement evidence is scoped to the source rows; excluded rows and missing verification remain open.

[Pinned source delivery evidence](https://github.com/Levelleor/lorebound/blob/84f151c8cdee3178cf6fc123eb7ca7614be4a28e/planning/development/evidence/DEV-003B.md) · revision-specific checks and limits.
