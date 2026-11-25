---
id: NOTE-0003
type: note
status: inbox
source: ADR-0121
related:
- ADR-0121
- STORY-0007
- ADR-0058
---

# Deferred spatial event and schema migrations

## Discovery

The user explicitly deferred spatial event and schema migrations. No D12 option is approved. Do not implement migrations, scripts or migration tests, or treat later nonspatial database upgrades as authorizing this. Separate explicit authority is required to revisit it.

## Classification

Deferred, not a claimable task. The explicit choice is preserved in [ADR-0121](../../decisions/ADR-0121-b9-and-pass-b-design-closure-with-deferred-spatial-migration.md).
