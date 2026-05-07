# Security Audit Report

## Scope
- Full runtime scan across `pages/` and `scripts/`.
- Upload/extraction/report/simulation/evaluation gate checks.

## Fixed This Pass
- Restored missing `showProcessingPipeline()` causing upload flow failures.
- Removed broken orphaned JS fragment in `evaluate.html` that could break runtime script execution.
- Removed duplicate upload listener block that risked double-trigger behavior.
- Added document-type-aware relevance thresholds in extraction pipeline (`tender`, `vendor`, `auto`).
- Added explicit corrupted-PDF messaging: `Unsupported or corrupted PDF`.
- Added strict report sign/export readiness checks (no unresolved review/evidence gaps).
- Removed async sign wrapper race in report verification badge behavior.

## Security Verification
- `rg -n "innerHTML|insertAdjacentHTML|outerHTML" pages scripts -S` => `NO_UNSAFE_RENDER_MATCHES`
- No demo fallback execution path re-enabled in evaluate/report runtime.

## Remaining Risks
- Demo datasets still exist in shared constants for non-critical UI contexts; extraction/evaluation strict paths do not use them.
- CSP/SRI policy hardening remains recommended before production use.
