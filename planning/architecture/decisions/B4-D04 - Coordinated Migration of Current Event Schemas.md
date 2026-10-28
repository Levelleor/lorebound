---
type: architecture-decision
status: accepted
decision_id: "B4-D04"
phase: "B4"
created: "2026-10-27"
updated: "2026-10-27"
approved_at: "2026-10-27"
approved_by: "requesting user (explicit chat approval)"
supersedes_in_part:
  - B2-D06
tags:
  - planning/architecture
  - pass-b
  - current-canon
  - replay-contracts
  - architecture-decision
---

# B4-D04 — Coordinated migration of current event schemas on upgrade

## Approval and provenance

**Explicitly accepted by the requesting user on 2026-10-27:** “Review B4 Batch 2: B4-D04: B; B4-D05: A; B4-D06: A. Record only explicitly accepted decisions as Lorebound GitHub ADRs, preserve approval history and continue the B4 review.”

**This ADR records B4-D04 Option B**, not the recommended Option A from the proposal. [Pass B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md) preserves the offered alternatives and subsequent explicit selection. D05 and D06 have independent approval and ADRs. This is a design choice, not proof that an upgrade, migration or rollback mechanism exists.

## Context and supersession

Under [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), each adventure has **only its current passage bodies and ordered current event records**, not retained immutable event/passage revision archives. Existing [B2-D06](./B2-D06%20-%20Versioned%20Event%20Contracts%20and%20Deterministic%20Compatibility.md) approved versioned event formats, deterministic preservation of accepted meaning, and a default against bulk rewriting *historical immutable* payloads.

The newer user choice **supersedes B2-D06's earlier default of interpreting old versions in-place without rewriting storage during upgrades** where a supported in-place schema migration is possible. It **does not supersede** event type/version metadata, deterministic outcome preservation, explicit incompatible-core error handling, the missing/removed-plugin exception, or the separation between Go persistence and TypeScript gameplay authority.

## Accepted decision — Option B

**On an application/data-format upgrade requiring changes to event schemas, migrate the library's currently stored supported event records into their corresponding latest supported formats in a coordinated atomic migration transaction.**

- **Scope:** Upgrade the **current accepted event records** that need schema conversion, across the affected adventure records in the shared Go/SQLite library, rather than retaining old canonical copies or requiring future normal replay to interpret every older supported version indefinitely.
- **Semantic safety:** Conversions must have explicitly defined, deterministic, testable meaning-preserving rules for each supported source/target event format. Preserve accepted outcome effects, event identity and ordering, relevant entity references and current passage/turn or player-origin provenance. A migration is **not** a new gameplay event, narrative change, AI reroll, automatic manual repair, or license to revalidate previously accepted story outcomes against today's rules.
- **Atomic and fenced:** Go/SQLite coordinates a migration while the established **global library maintenance/write fence** protects against gameplay commits, noncanonical draft saves, concurrent tabs and backup/restore interference. Either all required affected data changes commit successfully as one coherent transaction, or no migrated canonical data becomes visible and the prior intact dataset remains. Define data/transaction granularity and resource limits in later engineering design; do not expose partially migrated canon.
- **Versioning:** Retain explicit event schema/type versions and deterministic conversion definitions. A schema-format upgrade differs from a player's removed story revision. A revised current event payload replaces its old stored payload; **do not create an application-level event history/revision archive**.
- **Invalid/unconvertible required core event:** Do not guess, skip, coerce, silently drop or partially commit incompatible core data. Fail safely with actionable diagnostics and unchanged durable records, applying the [B2-D08](./B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md) required-core safety boundary. The recovery/upgrade flow must not pretend an unsupported event was migrated.
- **Absent/removed plugins:** Keep the accepted exception: removal/unavailability of an optional plugin does not force the application to recreate or migrate its unavailable custom historical state. Preserve safely readable associated data where applicable without claiming conversions that cannot be performed, and do not let an absent optional reducer masquerade as unsupported *core* data.
- **No second gameplay engine:** The deterministic schema conversion contract is not an independent Go narrative/gameplay validator. The approved ownership of Go/SQLite storage and browser TypeScript S05/S06 gameplay/replay remains. Actual orchestration of conversion functions and backend maintenance needs specific engineering design.
- **Compatibility and recovery:** Following successful migration, ordinary replay uses the newly stored current event versions. No app-wide guarantee of indefinite backward compatibility, automatic backups, per-adventure export/import or version downgrades is inferred. Exact restore/epoch, failure-message, crash and status semantics remain open.

## Alternatives and trade-offs

1. **Option A — not selected:** Keep old stored event payloads and upcast in normal replay, without rewriting just for upgrades. Lower migration risk, but increases long-term reader compatibility complexity.
2. **Option B — accepted:** Coordinated in-place upgrade of supported current event records to latest formats. Simplifies the future steady-state reader, but has higher library-migration, failure/rollback and validation costs.
3. **Option C — rejected:** Blindly interpret older event payloads using only current rules without explicit conversions. May silently change formerly accepted outcomes.

## Deferred implementation decisions

Exact data-schema version table, target-version selection, migration eligibility, plugin coexistence behaviour, transactional schema+data ordering, recovery for upgrades that cannot complete atomically within real resource limits, maintenance notifications, compatibility fixtures, and schema upgrade tests remain unapproved. A later B4 question may refine upgrade-time read-only failure and rollback mechanics. No staging-to-production promotion, implementation, backup automation or test pass is claimed.

## Traceability

[B4 review](../Pass%20B4%20-%20Current%20Canon%20Data%20and%20Replay%20Contract%20Review.md); [B2-D06](./B2-D06%20-%20Versioned%20Event%20Contracts%20and%20Deterministic%20Compatibility.md), [B2-D08](./B2-D08%20-%20Fail-Closed%20Unsupported%20Core%20Event%20Replay.md), [B3-D04](./B3-D04%20-%20Single%20Current%20History%20Without%20Revisions.md), [B3-D01](./B3-D01%20-%20Prepared%20Atomic%20Canonical%20Commit%20Envelope.md), [B4-D01](./B4-D01%20-%20Total%20Ordering%20of%20Current%20Outcome%20Events.md). Owners S01, S05, S06, S12.

## Decision history

- **2026-10-26 — Earlier B2-D06 approval:** User selected versioned immutable events and deterministic in-memory compatibility handling rather than bulk historical event rewriting. This was before B3 eliminated retained event revisions.
- **2026-10-27 — B3-D04 acceptance:** User replaced the immutable revision/audit design with a single current ordered event history; B2-D06 format-version and compatibility-safety rules survived.
- **2026-10-27 — B4-D04 alternatives presented, unapproved:** A preserve older stored event schemas with version-aware readers (recommended); B coordinated upgrade-time rewrite of currently stored events; C interpret all using latest rules without explicit conversions.
- **2026-10-27 — Explicit new approval:** User selected **B4-D04: B**. This replaces the migration-on-read default for supported current records, retains deterministic accepted-outcome preservation and removed-plugin exception, and does not claim executable migration code.
