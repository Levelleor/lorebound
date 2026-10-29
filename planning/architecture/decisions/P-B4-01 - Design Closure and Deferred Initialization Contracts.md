---
type: architecture-decision
status: accepted
decision_id: "P-B4-01"
phase: "B4"
created: "2026-10-28"
updated: "2026-10-28"
approved_at: "2026-10-28"
approved_by: "requesting user (explicit chat approval)"
tags:
  - planning/architecture
  - pass-b
  - architecture-decision
  - design-closure
---

# P-B4-01 — B4 design closure; current-canon data and replay contracts

## Later accepted architectural clarification — 2026-10-28

**Do not use this historical closure record as authority to restore simulation-style event validation or retained event/passage revisions.** [B6-D01 — Narrative-first declarative outcome events](./B6-D01%20-%20Narrative%20First%20Declarative%20Outcome%20Events.md) is the newer **explicitly user-approved** current contract: world-state events record accepted fiction and player corrections as ordered typed Set/Clear, Create/Remove and keyed relation assertions, with stable/sparse IDs and unknown details when earlier introductions disappear. A missing prior holder, route, item introduction or fictional cause **does not invalidate a later grounded fact**. Preserve actual technical format/replay errors, single-valued projections, atomicity, adventure versions, explicit manual Commit and pending overlays. [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md) also superseded earlier immutable revision/audit storage. Original dated approvals and design closures remain **historically true and closed design-only**, not evidence of implementation.



## Authority and scope

**Explicit approval on 2026-10-28.** In response to the B4 closure assessment and the question, “Would you like me to close it at the design level and move on to the next architectural pass, as we did for B2 and B3?”, the requesting user answered **“yes.”**

**Decision:** Formally close **Pass B4 — Current Canon Data and Replay Contract Review** at the **architecture-design level**, and begin the next architectural review with *unapproved* proposals. This is **not** a claim of implementation, integration verification, staging-to-production promotion, release approval, or blanket approval of the next pass.

## Approved B4 decision inventory

| Decision | Explicit approved option | Current rule |
| --- | --- | --- |
| [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md) | **A** | Durable total order of current outcome events, including standalone player corrections between turns. |
| [B4-D02](./B4-D02%20-%20Undo%20and%20Truncation%20Boundaries%20for%20Independent%20Corrections.md) | **A** | Timeline-positioned independent corrections; Undo of a later story turn preserves earlier correction; truncation removes events beyond selected boundary. |
| [B4-D03](./B4-D03%20-%20Consistent%20Version%20Tagged%20Canonical%20Reads.md) | **A** | Coherent version/epoch-tagged Go/SQLite current-story and current-event reads, with matching TypeScript projections. |
| [B4-D04](./B4-D04%20-%20Coordinated%20Migration%20of%20Current%20Event%20Schemas.md) | **B** | Coordinated, meaning-preserving upgrade migration of **currently stored** supported event records; new decision supersedes earlier no-bulk-rewrite preference of B2-D06 for current records. |
| [B4-D05](./B4-D05%20-%20Independent%20Fork%20from%20Current%20Adventure%20Prefix.md) | **A** | Independent atomic Fork of the chosen current story/event prefix, including applicable player corrections. |
| [B4-D06](./B4-D06%20-%20Preflight%20Structural%20Integrity%20of%20Current%20History%20Mutations.md) | **A** | Deterministic structural preflight; reject truly unrepresentable resulting event history without silently repairing accepted events. Fictional contradiction under Keep remains permissible. |
| [B4-D07](./B4-D07%20-%20Fail%20Safe%20Atomic%20Event%20Migration.md) | **A** | Whole coordinated required-core event migration fails safely without partially modifying durable canon. |
| [B4-D08](./B4-D08%20-%20Discard%20Stale%20Pending%20Manual%20Drafts.md) | **B** | Automatically discard *uncommitted manual* drafts proven stale following **external** canonical advancement. Distinguish from uncertain/in-flight Commit outcomes, which must be resolved via idempotency receipts first. |
| [B4-D09](./B4-D09%20-%20Shared%20Latest%20Pending%20Draft%20Without%20Tab%20Locks.md) | **A** | Latest-successful-save shared noncanonical draft per editing context, single-tab-first UX, no exclusive tab lock, preserved canonical safety under accidental multi-tab use. |

**Nine out of nine numbered B4 decisions have explicit approval.** Original A/B/C alternatives and dated approval history remain in the source [B4 review register](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md) and individual ADRs.

## Integration with prior decisions and supersessions

- **B3-D04's later approved revision-free model continues:** one current story body per passage and one current ordered event history; no old passage/event revisions, inactive canonical branches or in-adventure audit history. Architectural ADRs in GitHub retain historical *decision approvals*, not former adventure versions in SQLite.
- **B4-D04 Option B** changes the previously accepted B2-D06 default: supported event-format upgrades rewrite the current stored payloads through a coordinated, deterministic conversion rather than indefinitely preserving old stored schemas. Explicit versions, accepted-outcome semantics, required-core fail-closed handling and the missing/removed-plugin exception survive.
- **B4-D08 Option B** narrowly supersedes B3-D08/B3-D10's general stale-draft preservation **only for uncommitted manual proposals rendered obsolete by a verified external canonical advance**. Validation errors, ordinary current-version pending changes, and genuinely uncertain accepted Commit responses still follow the established preservation/receipt resolution rules.
- **One tab expected, not enforced:** the user explicitly prefers ordinary single-tab use, but accidental extra tabs must not corrupt current canon. Expected adventure versions, library epoch and atomic Go/SQLite writes remain; no collaboration feature or exclusive editor lease is approved.

## Design-level completion assessment

Pass B4 has dispositioned its nine selected questions: ordered replay, manual correction timeline, coherent reads, upgraded event formats and atomic failure, Fork independence, structural preflight, and simple pending draft concurrency. The prior B1/B2/B3 architectural decisions remain in force except where a **later explicit** B3/B4 approval supersedes particular assumptions.

## Deferred implementation and planning gates

- Concrete SQLite table schemas, TypeScript/Go transport shape, migration runner and transaction/backup compatibility, preservation of event effect semantics, valid payload transformations, long-running migration failure handling and regression fixtures.
- Exact boundary cases for Turn-0 and corrections on target turns, repeated Undo, Fork event/entity ID mapping and plugin ownership, structural preflight across enabled modules and consistent projection invalidation.
- Latest-only draft save races, confirmed external staleness detection, pending overlay access and uncertain-Commit status resolution; single-tab-first UX without weakening canonical version checks.
- Previously deferred **real** Wails/Go, browser-provider, backup/restore/epoch, plugin loading, SQLite, and cross-tab race tests remain unexecuted; no release readiness is inferred.
- Some accepted staging idea sources still describe retained revisions/append-only audit. Preserve their original approvals, reconcile obsolete wording through separate planning gates, and do **not** automatically promote ideas to production or claim verified functionality.
- AI-assisted downstream historical prose reevaluation remains unaccepted Inbox IDEA-0067.

## Alternatives and rationale

- **Accepted:** Close B4 design review now, retaining explicit later engineering decisions and feasibility checks for further refinement and implementation.
- **Not chosen:** Hold design closure hostage to executable integration testing; that is a later gate and must be reported accurately.
- **Not chosen:** Treat closure as blanket acceptance of subsequent architectural proposals or reversal of B3-D04's simpler current-only history.

## Decision history

- **2026-10-27:** B4 D01–D03 accepted A/A/A.
- **2026-10-27:** B4 D04–D06 accepted B/A/A, preserving the change from earlier B2-D06 in-place format compatibility default.
- **2026-10-28:** B4 D07–D09 accepted A/B/A; user explicitly clarified single-tab-first orientation while retaining minimal multi-tab safety. B4 closure was **assessed only**.
- **2026-10-28:** Requesting user explicitly replied **“yes”** to formal design-level B4 closure and beginning the next architecture pass. This ADR records that separate sign-off, without authorising code or stage promotion.
