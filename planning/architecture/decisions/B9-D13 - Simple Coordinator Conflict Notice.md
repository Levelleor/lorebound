---
type: architecture-decision
status: accepted
decision_id: "B9-D13"
phase: "B9"
created: "2026-11-01"
updated: "2026-11-01"
approved_at: "2026-11-01"
approved_by: "requesting user (explicit later Option B)"
---
# B9-D13 — Coordinator-led best effort with minimal nonblocking conflict notice

**Accepted B (2026-11-01).** The browser TypeScript coordinator attempts the best supported deterministic spatial reconciliation. When accepted geographic facts cannot all be satisfied, preserve those facts and valid canonical geography and present a **simple general nonblocking notification**, not map-specific conflict markers, a detailed inspector or a persistent conflict-resolution queue. No further player intervention is required to continue the story.

Original **defer** (Batch 5): “For d13, more Info. I just want the coordinator to handle that. Whatever it decides happens but we try to make it as good as possible.” The subsequent user selection **B** explicitly resolves the deferred design choice. Both decisions remain in the B9 review history.

The coordinator may choose a technically valid best-effort result but may not falsify established story facts, invent routes, silently ignore required schema errors, or circumvent versioned Go/SQLite atomic commits. B9-D08's nonblocking conflict reporting remains binding. Detailed notification copy and implementation are not selected. A/C unapproved. D12 remains deferred with no spatial migration work.
