You are a senior security engineer, AI governance auditor, and full-stack architect.

Project:
⚖️ NyayaBid AI — Explainable Tender Evaluation & Policy Simulation Copilot

Objective:
Transform the current project into a STRICT, AUDIT-SAFE, GOVERNMENT-GRADE prototype suitable for hackathon judging and procurement compliance demos.

CRITICAL REQUIREMENTS:
- NEVER hallucinate procurement data
- NEVER auto-fill missing tender/vendor fields
- NEVER fake extraction from unsupported/irrelevant documents
- NEVER silently continue evaluation when evidence is missing
- ALL evaluation decisions must be evidence-linked
- ALL uncertainty must trigger mandatory human review
- System must be secure against XSS and tampering
- Maintain premium modern UI/UX while fixing architecture

====================================================
PHASE 1 — REMOVE ALL HALLUCINATION / DEMO FALLBACKS
====================================================

STRICTLY REMOVE:
- DEMO_TENDER auto replacement
- DEMO_VENDORS auto replacement
- applyDemoMapping() inferred values
- ANY deterministic/imputed defaults
- ANY hidden fallback logic

IF extraction fails:
- show:
  “Extraction failed — manual review required.”
- set:
  extractionStatus = "UNVERIFIED"
- disable:
  evaluation, ranking, report export, finalize buttons

DO NOT allow:
- fake eligibility
- fake confidence
- fake structured extraction

====================================================
PHASE 2 — EVIDENCE-ANCHORED EXTRACTION
====================================================

FOR EVERY extracted field store:
{
  field,
  extractedValue,
  confidence,
  sourceDocument,
  pageNumber,
  extractionMethod,
  rawEvidenceSnippet,
  startIndex,
  endIndex,
  reviewStatus
}

ALL evaluation decisions MUST reference:
- source evidence
- exact snippet
- page number
- confidence score

If evidence missing:
- mark criterion:
  “Needs Human Review”
- NEVER auto-pass eligibility

====================================================
PHASE 3 — HUMAN-IN-THE-LOOP ENFORCEMENT
====================================================

ADD STRICT REVIEW GATES:

If:
- confidence below threshold
- OCR unreliable
- missing evidence
- conflicting values
- unsupported format
- relevance score low

THEN:
- disable FINALIZE
- disable REPORT EXPORT
- require officer override

Officer override must include:
- reviewer name
- timestamp
- override reason
- criterion reviewed

Store structured review logs.

====================================================
PHASE 4 — DOCUMENT RELEVANCE VALIDATION
====================================================

Before extraction:
Implement procurement relevance classifier.

Check for:
- tender ID patterns
- GST/PAN clauses
- EMD
- turnover
- experience
- bidder terms
- procurement/legal keywords

If relevance < threshold:
- STOP pipeline
- show:
  “Uploaded document does not appear procurement-related.”
- DO NOT evaluate

====================================================
PHASE 5 — SECURITY HARDENING
====================================================

REMOVE ALL unsafe innerHTML usage.

Replace with:
- textContent
- createElement()
- sanitized rendering

Sanitize:
- filenames
- OCR text
- extracted fields
- report content
- localStorage data

Prevent:
- reflected XSS
- stored XSS
- HTML injection

Audit ALL pages:
- evaluate.html
- dashboard.html
- report.html
- simulation.html
- all JS modules

====================================================
PHASE 6 — AUDIT-SAFE CRYPTOGRAPHIC REPORTING
====================================================

Current SHA-256 local hashing is insufficient.

Implement:
- immutable audit chain
- signed report verification
- WebCrypto-based signing
- report verification flow

Generate:
{
  reportHash,
  signedBy,
  timestamp,
  verificationStatus
}

Display:
“Tamper Verification Passed”

Prevent modification after sign-off.

====================================================
PHASE 7 — SINGLE CANONICAL DATA SCHEMA
====================================================

Create ONE unified schema:

TenderSchema
VendorSchema
EvaluationSchema
EvidenceSchema
ReviewSchema

Remove inconsistent mappings across:
- utils.js
- evaluation.js
- simulation modules
- dashboard modules

STRICT TYPE VALIDATION required.

====================================================
PHASE 8 — COLLUSION DETECTION SAFETY
====================================================

Current logic is unsafe.

DO NOT flag collusion using bid similarity alone.

Require corroborating evidence:
- shared directors
- addresses
- GST overlaps
- bank overlaps
- metadata patterns

Otherwise show:
“Insufficient evidence for collusion determination.”

====================================================
PHASE 9 — OCR + EXTRACTION ROBUSTNESS
====================================================

Handle:
- corrupted files
- blank PDFs
- partial tenders
- multilingual docs
- unsupported scans

If unsupported:
- fail safely
- require review
- NEVER fabricate extraction

Add:
- extraction confidence thresholds
- pipeline completion validation
- actual extraction status tracking

====================================================
PHASE 10 — UI/UX TRUST IMPROVEMENTS
====================================================

Maintain premium dark modern UI.

ADD:
- Evidence panels
- Page-linked citations
- Extraction confidence badges
- Human review banners
- Verification states
- Secure workflow indicators

Add visible states:
- VERIFIED
- UNVERIFIED
- REVIEW REQUIRED
- SIGNED
- TAMPER CHECK FAILED

====================================================
PHASE 11 — ACCESSIBILITY + GOV READINESS
====================================================

Implement:
- ARIA labels
- focus traps
- keyboard navigation
- modal accessibility
- screen-reader compatibility

Add:
- CSP recommendations
- SRI hashes for CDN assets
- secure dependency pinning

====================================================
PHASE 12 — FINAL VALIDATION
====================================================

Run COMPLETE SYSTEM AUDIT:

Check:
- no demo fallbacks remain
- no hallucinated fields
- no unsafe innerHTML
- no inconsistent schemas
- no fake confidence
- no unsecured report generation
- no evaluation without evidence
- no finalize without review approval

Then generate:
1. security_audit_report.md
2. hallucination_safety_report.md
3. architecture_changes.md
4. government_readiness_checklist.md

Finally:
- optimize performance
- clean codebase
- remove dead code
- ensure deployment stability
- ensure mobile responsiveness
- ensure zero console errors

IMPORTANT:
DO NOT simplify the system.
DO NOT remove premium UI.
DO NOT replace real logic with placeholders.
DO NOT use fake/demo data unless explicitly in DEMO MODE with visible warnings.

Goal:
Hackathon-winning, audit-safe, explainable procurement intelligence platform.