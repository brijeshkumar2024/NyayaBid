# NyayaBid AI — Audit-safe “STRICT MODE” Implementation TODO

> Goal: remove hallucination/demo fallbacks by default; enforce evidence-linked extraction and human review gates.

## Step 1 — Repo audit & mapping
- [x] Identified demo fallbacks in `pages/evaluate.html` and demo mapping in `scripts/utils.js`.
- [x] Identified unsafe `innerHTML` usage across pages and risk of XSS.
- [x] Identified collusion heuristic using bid similarity.

## Step 2 — Add STRICT MODE as default
- [ ] Introduce `DEMO_MODE` toggle (visible in UI) and set default to STRICT.
- [ ] Block all demo conveniences unless DEMO_MODE is ON.

## Step 3 — Remove hallucination fallbacks (critical)
- [ ] Remove/disable `applyDemoMapping()` imputation.
- [ ] In `handleTenderUpload()` remove `DEMO_TENDER` fallback on extraction failure.
- [ ] In `handleVendorUpload()` remove `DEMO_VENDORS` fallback on extraction failure.
- [ ] If extraction fails: show `Extraction failed — manual review required.`, set `extractionStatus = "UNVERIFIED"`, disable evaluation+export+finalize.

## Step 4 — Rework extraction outputs into evidence schema
- [ ] Replace scalar `fields` in `extractProcurementFields()` with EvidenceSchema per extracted field.
- [ ] Ensure each extracted field stores: evidence snippet, indices, page number (when possible), method, confidence, reviewStatus.

## Step 5 — Human-in-the-loop gates
- [ ] Add reviewStatus per criterion: `AUTO_BLOCKED | NEEDS_HUMAN | APPROVED`.
- [ ] Disable report export/finalize unless all required items are APPROVED.
- [ ] Create officer override log with reviewer name, timestamp, override reason, criterion reviewed.

## Step 6 — Evidence-anchored evaluation
- [ ] Update evaluation logic to reference evidence snippets + page numbers.
- [ ] If evidence missing -> criterion marked `Needs Human Review` and never auto-pass.

## Step 7 — Document relevance classifier
- [ ] Implement procurement relevance classifier before OCR/extraction.
- [ ] If relevance < threshold: show `Uploaded document does not appear procurement-related.` and stop pipeline.

## Step 8 — Security hardening
- [ ] Remove all unsafe `innerHTML` sinks in `evaluate.html`, `report.html`, `dashboard.html`, and rendering helpers.
- [ ] Render with `textContent` / DOM nodes only.
- [ ] Sanitize filenames/OCR text.

## Step 9 — Cryptographic reporting (audit-safe)
- [ ] Replace weak SHA-only with WebCrypto signing.
- [ ] Add immutable audit chain (hashes linked) and verificationStatus gating.
- [ ] Prevent modification after sign-off.

## Step 10 — Canonical schema
- [ ] Create one unified schema module for Tender/Vendor/Evaluation/Evidence/Review.
- [ ] Update mappings across `utils.js`, `evaluation.js`, `collusion.js`, and pages.

## Step 11 — Collusion detection safety
- [ ] Remove bid similarity heuristic.
- [ ] Require corroborating evidence (directors/addresses/GST/bank/metadata patterns).
- [ ] If insufficient evidence: show `Insufficient evidence for collusion determination.`

## Step 12 — OCR/extraction robustness
- [ ] Fail-safe on blank/corrupted/unsupported docs.
- [ ] Implement pipeline completion validation and extraction status tracking.

## Step 13 — UI/UX trust & accessibility
- [ ] Add visible states: VERIFIED / UNVERIFIED / REVIEW REQUIRED / SIGNED / TAMPER CHECK FAILED.
- [ ] Add evidence panels with page-linked citations.
- [ ] Add ARIA labels and focus handling for modals.

## Step 14 — Final validation artifacts
- [ ] Generate: `security_audit_report.md`, `hallucination_safety_report.md`, `architecture_changes.md`, `government_readiness_checklist.md`.
- [ ] Run full smoke test: no demo fallbacks, no unsafe innerHTML, no evaluation without evidence, no finalize without approval.

