# NyayaBid AI

## Governance-Aware Procurement Intelligence Platform

NyayaBid AI is a frontend-first GovTech prototype for explainable tender evaluation and policy simulation.
It is designed for procurement teams that need transparent, auditable, human-supervised AI assistance, not blind automation.

**Positioning:** AI-assisted governance for public procurement workflows.

---

## What Is Implemented Today

- OCR-assisted multi-format ingestion (`PDF`, scanned PDF via OCR fallback, `DOCX`, images)
- Structured field extraction with confidence scoring and evidence snippets
- Review-required enforcement before running final evaluation
- Officer review actions (`verify`, `edit`, `reject`) with timeline logging
- Mandatory officer identity for review actions
- Explainable vendor evaluation (criterion checks + confidence)
- **Why This Bidder Lost** cards for rejected vendors
- Rule mapping summary from extracted and officer-verified fields
- Fraud/collusion risk indicators (pattern-based)
- Procurement Fairness Score (PFS)
- Competition Health Indicator (CHI)
- Policy simulation engine with before-vs-after impact reveal
- Governance trust telemetry bar (evidence coverage, pending reviews, overrides, tamper status, confidence, governance state)
- Red-team safe rejection flow for unsupported/irrelevant documents
- Audit timeline + officer override records
- SHA-256 backed sign-off flow and PDF report export
- Runtime safety guards (timeouts, chart fallback messaging, empty-state handling)

---

## Governance and AI Safety Model

NyayaBid AI is built around **human oversight and audit defensibility**:

- No automatic final award decision without officer review gates
- Low-confidence or failed extraction paths force manual review
- Extraction evidence is surfaced with confidence and source context
- Officer overrides are logged with reason and timestamp
- Safe-failure behavior blocks fake extraction and provides explicit rejection messaging
- Trust telemetry exposes governance state in real time

**Principle:** AI-assisted governance, not blind automation.

---

## Technical Architecture (Current)

NyayaBid is a browser-based application with local session state.

| Layer | Current Implementation |
|---|---|
| UI | HTML5 + Vanilla CSS + Vanilla JavaScript |
| Parsing | PDF.js (text layer), Mammoth (DOCX) |
| OCR | Tesseract.js (scanned PDFs / images) |
| Visualization | Chart.js |
| Report Export | jsPDF |
| Integrity | Web Crypto API (SHA-256 hash/signing flow) |
| State | `localStorage` (review/evaluation/audit session state) |

---

## Repository Structure (Current)

```text
nyayabid/
├── index.html
├── pages/
│   ├── dashboard.html
│   ├── evaluate.html
│   ├── simulation.html
│   └── report.html
├── scripts/
│   ├── app.js
│   ├── utils.js
│   ├── data.js
│   ├── evaluation.js
│   └── collusion.js
├── styles/
│   ├── main.css
│   ├── dashboard.css
│   ├── simulation.css
│   └── report.css
└── assets/
```

---

## Demo Flow (Judge-Ready)

1. Open **Dashboard** for KPI and audit context
2. Go to **Evaluate**
3. Upload **Tender Document(s)**
4. Upload **Vendor Document(s)**
5. Show AI extraction + evidence + confidence
6. Complete officer verification/edit/reject actions
7. Run explainable evaluation
8. Show **Why This Bidder Lost** cards
9. Open **Simulation** and show before-vs-after policy impact reveal
10. Highlight live governance trust telemetry
11. Open **Report**, sign, verify hash status, and export PDF

Include at least one red-team moment:
- Upload irrelevant/unsupported/corrupted doc
- Show safe rejection + manual review requirement

---

## Procurement Governance Relevance

NyayaBid’s workflow framing aligns with public procurement governance principles such as:

- explainable eligibility checks
- documented human oversight
- traceable override rationale
- defensible audit reporting
- pre-publication competition risk analysis

This is a prototype and should be validated against department-specific legal/compliance requirements before operational deployment.

---

## Current Limitations (Honest)

- Frontend-first prototype architecture (no multi-user backend workflow yet)
- Session state is browser-local (`localStorage`), not immutable server ledger
- No production RBAC / identity provider integration yet
- No automated end-to-end browser test suite yet
- OCR quality may degrade on low-quality scans/noisy images
- External integrations (GeM/CPPP/live procurement systems) are not yet implemented

---

## Roadmap

- Backend service with role-based workflow and stronger audit persistence
- GeM/CPPP integration pathways for live procurement ingestion
- Multilingual extraction and review support
- Enhanced semantic clause intelligence for tender risk analysis
- Automated E2E validation suite for regression safety
- Expanded procurement analytics and policy benchmarking

---

## Running Locally

Open directly in a modern browser, or run a local static server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## Final Note

NyayaBid AI is not a replacement for procurement officers.
It is a governance-aware decision support layer that improves transparency, consistency, and auditability in tender evaluation.
