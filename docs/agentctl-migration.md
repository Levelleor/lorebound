# agentctl migration report

- Authoritative source: `main` at `84f151c8cdee3178cf6fc123eb7ca7614be4a28e`.
- Migration branch: `migration/agentctl`; the source branch was not modified.
- Harness: `agentctl 0.1.0`; generated `AGENTS.md` preserved byte-for-byte. The saved workflow and three agent definitions match `Levelleor/dev-workflow` revision `a16c6ab7d4f4e7864029da3b98dbfe94d5635183`.

## Work reconciliation

| Imported story state | Count |
| --- | ---: |
| Completed, tied to bounded merge evidence | 23 |
| Pending with an explicit block | 11 |
| Pending with unresolved story prerequisites | 3 |
| Proposed, not claimable | 1 |
| In progress | 0 |
| **Total stories** | **38** |

No backlog work was claimed, launched, implemented or newly approved. The 14 pending stories include both kinds of blockers; none can be claimed immediately. The source expresses order but has no numeric priorities. The default priority `3` is retained rather than assigning unsupported priorities; the queued parent stories were allocated in source order and source dependencies remain explicit. For DEV-005 and DEV-008, the scoped interface/safety prerequisites are named blockers and their partial parent stories are related (not whole-parent prerequisites).

| Source identifier | agentctl record | Imported disposition |
| --- | --- | --- |
| Gate 0 / M0 | [STORY-0001](work/items/STORY-0001-prove-the-production-host-and-sqlite-foundation.md) | Completed within evidenced scope |
| DEV-001 | [NOTE-0001](knowledge/inbox/NOTE-0001-dev-001-interrupted-verification-and-traceability-work.md) | Historical; CI delivered in DEV-002A, incremental traceability remains |
| DEV-002 | [STORY-0002](work/items/STORY-0002-first-complete-accepted-story-mode-turn-in-real-host-sqlite.md) | Completed within evidenced scope |
| DEV-003 | [STORY-0003](work/items/STORY-0003-retry-drafts-undo-fork-and-current-history-prose-editing.md) | Partial; blocked on remaining scope/decisions |
| DEV-004 | [STORY-0004](work/items/STORY-0004-direct-browser-cloud-local-models-profiles-streaming-pipelines-a.md) | Partial; first follow-up is scoped audit/selection after separate user launch |
| DEV-005 | [STORY-0005](work/items/STORY-0005-lorebook-author-notes-context-budget-and-derived-memory.md) | Queued; provider-context interface blocker |
| DEV-006 | [STORY-0006](work/items/STORY-0006-universal-characters-playing-as-status-anatomy-items-and-equipme.md) | Queued; supported typed entity event blocker |
| DEV-007 | [STORY-0007](work/items/STORY-0007-locations-containment-routes-discovery-simple-grounded-map.md) | Queued; awaits prerequisites |
| DEV-008 | [STORY-0008](work/items/STORY-0008-adventure-library-operations-templates-starting-world-and-backup.md) | Queued; relevant history/storage safety blocker |
| DEV-009 | [STORY-0009](work/items/STORY-0009-structured-actions-optional-capabilities-full-command-citadel-ui.md) | Queued; awaits prerequisites |
| DEV-010 | [STORY-0010](work/items/STORY-0010-end-to-end-product-verification-platform-release-audit-and-outst.md) | Queued; awaits prerequisites |
| DEV-002A | [STORY-0011](work/items/STORY-0011-production-blank-adventure-creation-and-resume.md) | Completed within evidenced scope |
| DEV-002B | [STORY-0012](work/items/STORY-0012-first-provisional-and-accepted-story-turn.md) | Completed within evidenced scope |
| DEV-002C | [STORY-0013](work/items/STORY-0013-story-loop-integration-and-parent-verification.md) | Completed within evidenced scope |
| DEV-003A | [STORY-0014](work/items/STORY-0014-replace-the-provisional-story-candidate-on-retry.md) | Completed within evidenced scope |
| DEV-003B | [STORY-0015](work/items/STORY-0015-independent-committed-story-prefix-fork.md) | Completed within evidenced scope |
| DEV-003C | [STORY-0016](work/items/STORY-0016-shared-latest-story-composer-draft.md) | Completed within evidenced scope |
| DEV-003D | [STORY-0017](work/items/STORY-0017-temporary-story-input-undo-redo.md) | Completed historical slice; its composer controls were replaced by DEV-003E |
| DEV-003E | [STORY-0018](work/items/STORY-0018-committed-story-turn-undo-and-composer-correction.md) | Completed within evidenced scope |
| DEV-003F | [STORY-0019](work/items/STORY-0019-accepted-generated-passage-editing.md) | Completed within evidenced scope |
| DEV-003G | [STORY-0020](work/items/STORY-0020-accepted-authored-passage-editing.md) | Completed within evidenced scope |
| DEV-003H | [STORY-0021](work/items/STORY-0021-temporary-passage-editor-undo-redo.md) | Completed within evidenced scope |
| DEV-003I | [STORY-0022](work/items/STORY-0022-same-tab-reload-recovery-for-confirmed-story-saves.md) | Completed within evidenced scope |
| DEV-003J | [STORY-0023](work/items/STORY-0023-same-tab-reload-recovery-for-uncertain-fork.md) | Completed within evidenced scope |
| DEV-004A | [STORY-0024](work/items/STORY-0024-direct-browser-local-story-narration.md) | Completed within evidenced scope |
| DEV-004B | [STORY-0025](work/items/STORY-0025-provisional-local-story-streaming.md) | Completed within evidenced scope |
| DEV-004C | [STORY-0026](work/items/STORY-0026-explicit-local-connection-testing.md) | Completed within evidenced scope |
| DEV-004D | [STORY-0027](work/items/STORY-0027-local-generation-diagnostics.md) | Completed within evidenced scope |
| DEV-004E | [STORY-0028](work/items/STORY-0028-native-ollama-story-connections.md) | Completed within evidenced scope |
| DEV-004F | [STORY-0029](work/items/STORY-0029-named-lm-studio-and-vllm-story-connections.md) | Completed within evidenced scope |
| DEV-004G | [STORY-0030](work/items/STORY-0030-current-adventure-narration-settings.md) | Completed within evidenced scope |
| DEV-004H | [STORY-0031](work/items/STORY-0031-fresh-saved-model-selection-for-generate-retry.md) | Completed within evidenced scope |
| INC-001 | [STORY-0032](work/items/STORY-0032-native-ollama-live-server-verification-outstanding.md) | Open gap; blocked |
| INC-002 | [STORY-0033](work/items/STORY-0033-connection-profiles-broader-provider-and-credential-support.md) | Open gap; blocked |
| INC-003 | [STORY-0034](work/items/STORY-0034-story-turns-tracked-world-effects-remain-unsupported.md) | Open gap; blocked |
| INC-004 | [STORY-0035](work/items/STORY-0035-named-lm-studio-vllm-live-server-verification-outstanding.md) | Open gap; blocked |
| INC-005 | [STORY-0036](work/items/STORY-0036-narration-guidance-remaining-context-and-mode-integration.md) | Open gap; blocked |
| INC-006 | [STORY-0037](work/items/STORY-0037-command-citadel-design-alignment-remaining-surfaces.md) | Open gap; blocked |
| IDEA-0069 future request | [STORY-0038](work/items/STORY-0038-evaluate-automatic-acceptance-of-new-turns.md) | Proposed; not approved |
| C-SL-01 through C-SL-05 | [NOTE-0002](knowledge/inbox/NOTE-0002-early-implementation-slice-proposals-and-delivery-crosswalk.md) | Historical proposals, mapped to the later delivery boundaries |
| B9-D12 | [NOTE-0003](knowledge/inbox/NOTE-0003-deferred-spatial-event-and-schema-migrations.md) | Deferred; no spatial migration work authorized |

## Product, architecture and knowledge

- 70 PRDs: product roadmap plus all 69 IDEA records. The 52 approved feature scopes remain accepted **as requirements**, not marked delivered. Existing coverage is 17 partial, 35 without merged feature-level evidence, zero fully verified. IDEA-0068 remains approved for refinement only; 16 Inbox candidates remain unaccepted, including IDEA-0069.
- 122 ADRs: all 121 original decision identifiers plus the approved Command Citadel direction. There are 109 accepted records and 13 historical records for retired planning controls or dated design closure/assessment. Partial supersessions are cross-referenced without declaring whole ADRs obsolete. The narrative-first rule and B9-D12 deferral remain operative.
- 67 knowledge notes: tenets and evidence from architecture reviews, historical proposals/decisions, the interrupted DEV-001 work, 11 exploratory sessions and 51 supporting detail records. Long requirements/verification matrices live in supporting notes so the CLI can load every story and its parent within the context size limit. Stories and PRDs retain the source atomic requirement IDs, bounded evidence and links to supplemental detail. Historical excerpts and pinned Git sources are provenance, not a parallel operating protocol.

### Requirement and decision ID crosswalk

| Source identifier | agentctl record |
| --- | --- |
| IDEA-0001 | [PRD-0002](product/PRD-0002-single-player-account-free-experience.md) |
| IDEA-0002 | [PRD-0003](product/PRD-0003-freeform-player-action-modes.md) |
| IDEA-0003 | [PRD-0004](product/PRD-0004-direct-editable-prose-document.md) |
| IDEA-0004 | [PRD-0005](product/PRD-0005-retry-undo-and-alternative-continuations.md) |
| IDEA-0005 | [PRD-0006](product/PRD-0006-adventure-save-and-export-management.md) |
| IDEA-0006 | [PRD-0007](product/PRD-0007-quick-start-and-custom-story-openings.md) |
| IDEA-0007 | [PRD-0008](product/PRD-0008-character-creation-and-starting-choices.md) |
| IDEA-0008 | [PRD-0009](product/PRD-0009-reusable-scenario-templates-and-placeholders.md) |
| IDEA-0009 | [PRD-0010](product/PRD-0010-selection-based-writing-and-rewrite-tools.md) |
| IDEA-0010 | [PRD-0011](product/PRD-0011-narration-style-and-perspective-controls.md) |
| IDEA-0011 | [PRD-0012](product/PRD-0012-manual-generation-branches.md) |
| IDEA-0012 | [PRD-0013](product/PRD-0013-cloud-llm-provider-connectors.md) |
| IDEA-0013 | [PRD-0014](product/PRD-0014-local-llm-server-connections.md) |
| IDEA-0014 | [PRD-0015](product/PRD-0015-provider-connection-profiles-and-discovery.md) |
| IDEA-0015 | [PRD-0016](product/PRD-0016-model-capability-aware-controls.md) |
| IDEA-0016 | [PRD-0017](product/PRD-0017-sampling-presets-and-advanced-parameters.md) |
| IDEA-0017 | [PRD-0018](product/PRD-0018-one-model-task-routing.md) |
| IDEA-0018 | [PRD-0019](product/PRD-0019-configurable-generation-pipeline-strategies.md) |
| IDEA-0019 | [PRD-0020](product/PRD-0020-streaming-cancellation-and-generation-diagnostics.md) |
| IDEA-0020 | [PRD-0021](product/PRD-0021-entity-based-lorebook.md) |
| IDEA-0021 | [PRD-0022](product/PRD-0022-conditional-lorebook-activation.md) |
| IDEA-0022 | [PRD-0023](product/PRD-0023-automatic-long-term-story-summaries.md) |
| IDEA-0023 | [PRD-0024](product/PRD-0024-episodic-memory-retrieval.md) |
| IDEA-0024 | [PRD-0025](product/PRD-0025-token-budgeted-context-builder-and-inspector.md) |
| IDEA-0025 | [PRD-0026](product/PRD-0026-author-notes-and-persistent-story-instructions.md) |
| IDEA-0026 | [PRD-0027](product/PRD-0027-shared-pc-and-npc-character-entities.md) |
| IDEA-0027 | [PRD-0028](product/PRD-0028-customisable-character-status-sheets.md) |
| IDEA-0028 | [PRD-0029](product/PRD-0029-character-state-tracking-modes.md) |
| IDEA-0029 | [PRD-0030](product/PRD-0030-persistent-items-and-inventory-transfers.md) |
| IDEA-0030 | [PRD-0031](product/PRD-0031-slot-based-equipment-and-body-diagram.md) |
| IDEA-0031 | [PRD-0032](product/PRD-0032-configurable-anatomy-and-transformations.md) |
| IDEA-0032 | [PRD-0033](product/PRD-0033-optional-mature-reproductive-anatomy-fields.md) |
| IDEA-0033 | [PRD-0034](product/PRD-0034-hierarchical-world-locations.md) |
| IDEA-0034 | [PRD-0035](product/PRD-0035-character-presence-and-current-scene.md) |
| IDEA-0035 | [PRD-0036](product/PRD-0036-configurable-travel-graph-rules.md) |
| IDEA-0036 | [PRD-0037](product/PRD-0037-ai-world-discovery-and-expansion.md) |
| IDEA-0037 | [PRD-0038](product/PRD-0038-zoomable-node-map-canvas.md) |
| IDEA-0038 | [PRD-0039](product/PRD-0039-persistent-location-state-and-travel-interactions.md) |
| IDEA-0039 | [PRD-0040](product/PRD-0040-event-sourced-world-history.md) |
| IDEA-0040 | [PRD-0041](product/PRD-0041-versioned-text-blocks-and-revision-ids.md) |
| IDEA-0041 | [PRD-0042](product/PRD-0042-historical-edit-confirmation-and-bulk-truncation.md) |
| IDEA-0042 | [PRD-0043](product/PRD-0043-snapshots-and-incremental-state-rebuild.md) |
| IDEA-0043 | [PRD-0044](product/PRD-0044-undo-safe-state-rollback-and-provenance.md) |
| IDEA-0044 | [PRD-0045](product/PRD-0045-deterministic-adventure-coordinator.md) |
| IDEA-0045 | [PRD-0046](product/PRD-0046-llm-state-interpreter-and-proposed-operations.md) |
| IDEA-0046 | [PRD-0047](product/PRD-0047-typed-tool-rejection-and-narrative-repair.md) |
| IDEA-0047 | [PRD-0048](product/PRD-0048-native-gameplay-capability-registry.md) |
| IDEA-0048 | [PRD-0049](product/PRD-0049-mcp-tool-connectivity-and-side-effect-safety.md) |
| IDEA-0049 | [PRD-0050](product/PRD-0050-configurable-simulation-strictness.md) |
| IDEA-0050 | [PRD-0051](product/PRD-0051-structured-ui-game-actions.md) |
| IDEA-0051 | [PRD-0052](product/PRD-0052-browser-persistent-story-database.md) |
| IDEA-0052 | [PRD-0053](product/PRD-0053-backups-export-and-storage-quotas.md) |
| IDEA-0053 | [PRD-0054](product/PRD-0054-localhost-startup-and-offline-mode.md) |
| IDEA-0054 | [PRD-0055](product/PRD-0055-optional-loopback-node-bridge.md) |
| IDEA-0055 | [PRD-0056](product/PRD-0056-optional-rpg-mechanics-plugins.md) |
| IDEA-0056 | [PRD-0057](product/PRD-0057-text-to-speech-story-playback.md) |
| IDEA-0057 | [PRD-0058](product/PRD-0058-optional-story-images-and-equipment-art.md) |
| IDEA-0058 | [PRD-0059](product/PRD-0059-custom-script-hooks-and-rules.md) |
| IDEA-0059 | [PRD-0060](product/PRD-0060-optional-local-model-download-manager.md) |
| IDEA-0060 | [PRD-0061](product/PRD-0061-project-licensing-and-redistribution-policy.md) |
| IDEA-0061 | [PRD-0062](product/PRD-0062-lorebound-branding-and-engine-split.md) |
| IDEA-0062 | [PRD-0063](product/PRD-0063-accessibility-and-customisable-interface.md) |
| IDEA-0063 | [PRD-0064](product/PRD-0064-embedding-based-lore-retrieval-and-rag-context-selection.md) |
| IDEA-0064 | [PRD-0065](product/PRD-0065-automatic-character-sheet-tracking.md) |
| IDEA-0065 | [PRD-0066](product/PRD-0066-optional-docker-distribution.md) |
| IDEA-0066 | [PRD-0067](product/PRD-0067-ai-generated-starting-lorebook-and-world.md) |
| IDEA-0067 | [PRD-0068](product/PRD-0068-ai-assisted-downstream-story-re-evaluation-after-historical-edit.md) |
| IDEA-0068 | [PRD-0069](product/PRD-0069-separate-provider-connection-and-generation-tests.md) |
| IDEA-0069 | [PRD-0070](product/PRD-0070-automatic-acceptance-of-new-turns.md) |
| B1-D01 | [ADR-0001](decisions/ADR-0001-framework-independent-domain-logic.md) |
| B1-D02 | [ADR-0002](decisions/ADR-0002-coordinator-and-service-dependency-direction.md) |
| B1-D03 | [ADR-0003](decisions/ADR-0003-gameplay-and-durable-commit-authority.md) |
| B1-D04 | [ADR-0004](decisions/ADR-0004-cross-tab-invalidation-and-refetch.md) |
| B1-D05 | [ADR-0005](decisions/ADR-0005-narrow-browser-to-go-service-surface.md) |
| B1-D06 | [ADR-0006](decisions/ADR-0006-browser-typescript-event-replay.md) |
| B2-D01 | [ADR-0007](decisions/ADR-0007-immutable-outcome-events-and-atomic-commits.md) |
| B2-D02 | [ADR-0008](decisions/ADR-0008-immutable-history-and-single-active-selection.md) |
| B2-D03 | [ADR-0009](decisions/ADR-0009-turn-0-replay-for-authoritative-reconstruction.md) |
| B2-D04 | [ADR-0010](decisions/ADR-0010-retained-history-and-suspended-unrepresentable-effects.md) |
| B2-D05 | [ADR-0011](decisions/ADR-0011-canonical-structured-passage-documents.md) |
| B2-D06 | [ADR-0012](decisions/ADR-0012-versioned-event-contracts-and-deterministic-compatibility.md) |
| B2-D08 | [ADR-0013](decisions/ADR-0013-fail-closed-unsupported-core-event-replay.md) |
| B3-D01 | [ADR-0014](decisions/ADR-0014-prepared-atomic-canonical-commit-envelope.md) |
| B3-D02 | [ADR-0015](decisions/ADR-0015-idempotent-canonical-commit-attempts.md) |
| B3-D03 | [ADR-0016](decisions/ADR-0016-atomic-historical-selection-and-undo.md) |
| B3-D04 | [ADR-0017](decisions/ADR-0017-single-current-history-without-revisions.md) |
| B3-D05 | [ADR-0018](decisions/ADR-0018-reject-stale-canonical-submissions-and-refetch.md) |
| B3-D06 | [ADR-0019](decisions/ADR-0019-pending-manual-state-corrections-and-explicit-commit.md) |
| B3-D07 | [ADR-0020](decisions/ADR-0020-shared-pending-commit-composer-overlay.md) |
| B3-D08 | [ADR-0021](decisions/ADR-0021-persistent-noncanonical-pending-change-sets.md) |
| B3-D09 | [ADR-0022](decisions/ADR-0022-single-pending-change-set-per-editing-context.md) |
| B3-D10 | [ADR-0023](decisions/ADR-0023-pending-commit-failure-recovery.md) |
| B4-D01 | [ADR-0024](decisions/ADR-0024-total-ordering-of-current-outcome-events.md) |
| B4-D02 | [ADR-0025](decisions/ADR-0025-undo-and-truncation-boundaries-for-independent-corrections.md) |
| B4-D03 | [ADR-0026](decisions/ADR-0026-consistent-version-tagged-canonical-reads.md) |
| B4-D04 | [ADR-0027](decisions/ADR-0027-coordinated-migration-of-current-event-schemas.md) |
| B4-D05 | [ADR-0028](decisions/ADR-0028-independent-fork-from-current-adventure-prefix.md) |
| B4-D06 | [ADR-0029](decisions/ADR-0029-preflight-structural-integrity-of-current-history-mutations.md) |
| B4-D07 | [ADR-0030](decisions/ADR-0030-fail-safe-atomic-event-migration.md) |
| B4-D08 | [ADR-0031](decisions/ADR-0031-discard-stale-pending-manual-drafts.md) |
| B4-D09 | [ADR-0032](decisions/ADR-0032-shared-latest-pending-draft-without-tab-locks.md) |
| B5-D01 | [ADR-0033](decisions/ADR-0033-durable-minimal-turn-0-baseline.md) |
| B5-D02 | [ADR-0034](decisions/ADR-0034-grounded-initial-fact-extraction.md) |
| B5-D03 | [ADR-0035](decisions/ADR-0035-atomic-automatic-quick-start-opening.md) |
| B5-D04 | [ADR-0036](decisions/ADR-0036-approved-optional-ai-starting-lorebook.md) |
| B5-D05 | [ADR-0037](decisions/ADR-0037-preserve-baseline-on-setup-failure-and-cancellation.md) |
| B5-D06 | [ADR-0038](decisions/ADR-0038-explicit-commit-of-player-authored-custom-opening.md) |
| B5-D07 | [ADR-0039](decisions/ADR-0039-persistent-pending-generated-starting-lorebook.md) |
| B5-D08 | [ADR-0040](decisions/ADR-0040-narrative-only-unsupported-opening-facts.md) |
| B5-D09 | [ADR-0041](decisions/ADR-0041-resume-blank-adventures-without-automatic-generation.md) |
| B6-D01 | [ADR-0042](decisions/ADR-0042-narrative-first-declarative-outcome-events.md) |
| B6-D02 | [ADR-0043](decisions/ADR-0043-one-item-identity-and-declarative-equipment-placement.md) |
| B6-D03 | [ADR-0044](decisions/ADR-0044-grounded-declarative-location-and-scene-presence.md) |
| B6-D04 | [ADR-0045](decisions/ADR-0045-narrator-safe-entity-references-and-internal-identity-resolution.md) |
| B6-D05 | [ADR-0046](decisions/ADR-0046-conditional-anatomy-linked-equipment-detachment.md) |
| B6-D06 | [ADR-0047](decisions/ADR-0047-flexible-declarative-character-status-assertions.md) |
| B6-D07 | [ADR-0048](decisions/ADR-0048-declarative-mutable-world-location-and-route-facts.md) |
| B6-D08 | [ADR-0049](decisions/ADR-0049-distinct-unknown-absent-and-known-current-facts.md) |
| B6-D09 | [ADR-0050](decisions/ADR-0050-preserve-ambiguous-story-facts-without-guessing-ids.md) |
| B6-D10 | [ADR-0051](decisions/ADR-0051-entity-removal-distinct-from-property-clearing.md) |
| B7-D01 | [ADR-0052](decisions/ADR-0052-versioned-typed-declarative-event-envelope.md) |
| B7-D02 | [ADR-0053](decisions/ADR-0053-core-and-optional-plugin-event-ownership.md) |
| B7-D03 | [ADR-0054](decisions/ADR-0054-discard-unresolved-extraction-suggestions-without-diagnostics.md) |
| B7-D04 | [ADR-0055](decisions/ADR-0055-typed-unknown-absence-and-clear-semantics.md) |
| B7-D05 | [ADR-0056](decisions/ADR-0056-event-ordered-entity-lifecycle-and-reestablishment.md) |
| B7-D06 | [ADR-0057](decisions/ADR-0057-typed-keyed-relations-and-derived-world-travel-graph.md) |
| B7-D07 | [ADR-0058](decisions/ADR-0058-versioned-field-registry-and-atomic-meaning-preserving-event-mig.md) |
| B7-D08 | [ADR-0059](decisions/ADR-0059-narrator-safe-provisional-references-and-isolated-id-binding.md) |
| B7-D09 | [ADR-0060](decisions/ADR-0060-minimal-event-provenance-and-deterministic-current-replay-verifi.md) |
| B7-D10 | [ADR-0061](decisions/ADR-0061-persistent-semantic-spatial-canvas-and-grouped-location-coordina.md) |
| B8-D01 | [ADR-0062](decisions/ADR-0062-nested-local-coordinate-frames-on-one-spatial-canvas.md) |
| B8-D02 | [ADR-0063](decisions/ADR-0063-geographic-separation-distinct-from-route-travel-geometry.md) |
| B8-D03 | [ADR-0064](decisions/ADR-0064-versioned-spatial-assertions-and-explicit-map-edit-commit.md) |
| B8-D04 | [ADR-0065](decisions/ADR-0065-mutable-spatial-region-footprints-separate-from-containment.md) |
| B8-D05 | [ADR-0066](decisions/ADR-0066-stable-cross-frame-routes-with-grounded-door-and-portal-anchors.md) |
| B8-D06 | [ADR-0067](decisions/ADR-0067-automatic-persistent-location-placement-with-player-overrides.md) |
| B8-D07 | [ADR-0068](decisions/ADR-0068-deterministic-scoped-automatic-map-placement.md) |
| B8-D08 | [ADR-0069](decisions/ADR-0069-provenance-aware-spatial-reconciliation-of-generated-placement.md) |
| B8-D09 | [ADR-0070](decisions/ADR-0070-atomic-canonical-location-creation-and-initial-placement.md) |
| B9-D01 | [ADR-0071](decisions/ADR-0071-typed-spatial-coordinates-without-ai-player-authorship-labels.md) |
| B9-D02 | [ADR-0072](decisions/ADR-0072-typescript-prepared-events-and-go-sqlite-atomic-commit-authority.md) |
| B9-D03 | [ADR-0073](decisions/ADR-0073-mock-based-component-verification-without-live-ai-scenarios.md) |
| B9-D04 | [ADR-0074](decisions/ADR-0074-all-coordinates-eligible-for-automatic-layout.md) |
| B9-D05 | [ADR-0075](decisions/ADR-0075-validated-local-frame-coordinates-and-mutable-region-geometry.md) |
| B9-D06 | [ADR-0076](decisions/ADR-0076-comprehensive-mocked-contracts-and-explicit-evidence-labels.md) |
| B9-D07 | [ADR-0077](decisions/ADR-0077-automatic-numeric-metre-conversion-of-qualitative-geography.md) |
| B9-D08 | [ADR-0078](decisions/ADR-0078-event-triggered-deterministic-spatial-reconciliation-and-conflic.md) |
| B9-D09 | [ADR-0079](decisions/ADR-0079-valid-overlapping-mutable-region-geometry-without-implicit-conta.md) |
| B9-D10 | [ADR-0080](decisions/ADR-0080-versioned-deterministic-qualitative-distance-conversion-profiles.md) |
| B9-D11 | [ADR-0081](decisions/ADR-0081-multiple-keyed-entrances-and-cross-frame-portal-anchors.md) |
| B9-D13 | [ADR-0082](decisions/ADR-0082-simple-coordinator-conflict-notice.md) |
| B9-D14 | [ADR-0083](decisions/ADR-0083-renderer-independent-spatial-projections-and-s04-canvas-adapter.md) |
| B9-D15 | [ADR-0084](decisions/ADR-0084-versioned-typed-browser-go-spatial-service-contracts.md) |
| B9-D16 | [ADR-0085](decisions/ADR-0085-basic-map-navigation-and-shared-composer-commit-controls.md) |
| B9-D17 | [ADR-0086](decisions/ADR-0086-deterministic-atomic-batch-placement-of-multiple-new-locations.md) |
| B9-D18 | [ADR-0087](decisions/ADR-0087-narrator-safe-spatial-reference-binding-without-invented-identit.md) |
| B9-D19 | [ADR-0088](decisions/ADR-0088-stable-default-root-frame-and-initial-geographic-scale.md) |
| B9-D20 | [ADR-0089](decisions/ADR-0089-best-effort-spatial-estimates-with-deterministic-default-fallbac.md) |
| B9-D21 | [ADR-0090](decisions/ADR-0090-basic-map-hover-labels-and-existing-location-detail-selection.md) |
| B9-D22 | [ADR-0091](decisions/ADR-0091-no-visible-geographic-scale-indicator.md) |
| B9-D23 | [ADR-0092](decisions/ADR-0092-simple-disposable-viewport-rendering-optimisation.md) |
| B9-D24 | [ADR-0093](decisions/ADR-0093-basic-map-pointer-interaction-without-keyboard-controls.md) |
| B9-D25 | [ADR-0094](decisions/ADR-0094-disposable-map-pan-and-zoom-view-state.md) |
| B9-D26 | [ADR-0095](decisions/ADR-0095-player-location-first-map-view-with-default-coordinate-fallback.md) |
| B9-D27 | [ADR-0096](decisions/ADR-0096-minimal-canonical-pin-separation-at-minimum-zoom.md) |
| B9-D28 | [ADR-0097](decisions/ADR-0097-immediate-view-recenter-on-playing-as-selection.md) |
| B9-D29 | [ADR-0098](decisions/ADR-0098-stable-nearest-free-pin-offset-ordering.md) |
| B9-D30 | [ADR-0099](decisions/ADR-0099-design-only-completeness-assessment-before-separate-closure-appr.md) |
| C-D01 | [ADR-0100](decisions/ADR-0100-first-mock-driven-end-to-end-story-turn-slice.md) |
| C-D02 | [ADR-0101](decisions/ADR-0101-traceable-slice-register-with-original-idea-identity.md) |
| C-D03 | [ADR-0102](decisions/ADR-0102-mocked-contract-criteria-with-separate-real-host-gates.md) |
| C-D04 | [ADR-0103](decisions/ADR-0103-story-mode-first-complete-turn.md) |
| C-D05 | [ADR-0104](decisions/ADR-0104-real-wails-go-sqlite-integration-prerequisite.md) |
| C-D06 | [ADR-0105](decisions/ADR-0105-minimal-versioned-accepted-story-history-payload.md) |
| C-D07 | [ADR-0106](decisions/ADR-0106-minimal-real-wails-browser-go-host-exchange.md) |
| C-D08 | [ADR-0107](decisions/ADR-0107-real-sqlite-versioned-commit-rollback-and-reopen-proof.md) |
| C-D09 | [ADR-0108](decisions/ADR-0108-evidence-based-host-gate-and-immediate-development-handoff.md) |
| C-D10 | [ADR-0109](decisions/ADR-0109-material-blockers-only-planning-stop-rule.md) |
| C-D11 | [ADR-0110](decisions/ADR-0110-reusable-production-intended-real-host-foundation.md) |
| C-D12 | [ADR-0111](decisions/ADR-0111-concise-go-no-go-approval-and-immediate-development-handoff.md) |
| P-B1-01 | [ADR-0112](decisions/ADR-0112-trusted-locally-installed-plugins.md) |
| P-B1-02 | [ADR-0113](decisions/ADR-0113-design-closure-with-deferred-integration-gates.md) |
| P-B2-01 | [ADR-0114](decisions/ADR-0114-design-closure-and-deferred-transaction-contracts.md) |
| P-B3-01 | [ADR-0115](decisions/ADR-0115-design-closure-and-deferred-data-contracts.md) |
| P-B4-01 | [ADR-0116](decisions/ADR-0116-design-closure-and-deferred-initialization-contracts.md) |
| P-B5-01 | [ADR-0117](decisions/ADR-0117-design-closure-and-deferred-world-integrity-contracts.md) |
| P-B6-01 | [ADR-0118](decisions/ADR-0118-design-closure-and-deferred-event-representation-contracts.md) |
| P-B7-01 | [ADR-0119](decisions/ADR-0119-design-closure-and-deferred-spatial-canvas-integration-contracts.md) |
| P-B8-01 | [ADR-0120](decisions/ADR-0120-design-closure-and-deferred-runtime-integration-contracts.md) |
| P-B9-01 | [ADR-0121](decisions/ADR-0121-b9-and-pass-b-design-closure-with-deferred-spatial-migration.md) |
| Command Citadel design | [ADR-0122](decisions/ADR-0122-command-citadel-visual-and-interaction-direction.md) |

## Legacy files removed

- Removed the 276 tracked paths under `planning/`: Obsidian settings, agent instructions, stage folders and templates, architecture planning and decision files, brainstorm sessions, development queue/runbook/ledgers, and requirements/evidence. The reusable design palette was relocated unchanged to [docs/design](design/palette-and-presets.css); relevant design content became an ADR. Originals are accessible through the source commit.
- Removed the root `CLAUDE.md`, obsolete `ARCHITECTURE.md` navigation, historical `docs/gate0-development.md`, and both vault-dependent brainstorm skill files. Replaced the old root `AGENTS.md` with the exact `agentctl init` result. Updated README and development docs to remove legacy navigation while retaining build/run and application guidance.
- Application source, tests, lockfiles, CI workflow and application shell scripts are unchanged. The repository link/artifact check still applies and now also guards the canonical record locations; runtime state is Git-ignored.

## Verification

| Check | Result |
| --- | --- |
| `agentctl doctor` | OK, no problems. The CLI warns about the unconfigured built-in `feature`/`release` profiles; no new profiles or aliases were added. |
| `agentctl status --json` | 38 stories, 70 PRDs, 122 ADRs, 67 notes; 14 active stories in the CLI's terminology (pending, including blocked). |
| `agentctl work list`, `agentctl knowledge list`, `agentctl verify list` | Passed; expected records and all seven named gates listed. |
| Record reconciliation | 297 unique IDs, valid PRD parents and note sources, resolved references, acyclic dependencies and all 38 story contexts assembled without claiming a task. |
| `agentctl verify` | **7/7 passed:** repository policy/links, shell syntax, build and Svelte typecheck, TypeScript unit, Go vet, Go SQLite tests, and real Firefox/Chromium host/restart suite. |
| Git and workflow | No application/test/CI changes; migration workflow parsed with installed host-capable Ultracode and matches the pinned source. No workflow was executed. |

## Limits and follow-up

- DEV-004 awaits separate authorization to audit/select a bounded child. DEV-003, broad feature gaps, the proposed auto-accept behavior and deferred spatial migration remain unstarted beyond their recorded evidence.
- Model policy is Sol 6.2 at `high` for escalation and DeepSeek V4.1 Flash at `max` for implementation and review/publishing. Pi inventory was checked, but no live model or publish attempt was made. The upstream publication-capable workflow requires explicit authorization before launch.
- Browser verification exercises simulated provider responses over real browser transport; it does not certify new live-provider configurations or replace hosted CI. Playwright browsers and OS libraries are prerequisites for local verification.
