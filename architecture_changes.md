# Architecture Changes

## Pipeline Corrections
- `evaluate.html` now has a complete active pipeline function (`showProcessingPipeline`) used by both tender and vendor upload handlers.
- Duplicate bottom upload listener block removed to avoid duplicate async execution.
- Broken orphaned code block removed to restore stable parser/runtime behavior.

## Extraction Model Adjustments
- `validateProcurementRelevance(text, documentType)` now uses contextual thresholds:
  - tender: 40
  - vendor: 20
  - auto: 30
- Extraction result now includes `relevanceThreshold` for accurate UI messaging.

## Report Governance
- Added `validateReportReadiness()` in report flow.
- Sign/export now blocked when review/failure/evidence requirements are unmet.
