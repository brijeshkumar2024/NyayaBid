# NyayaBid AI

NyayaBid AI is an explainable, browser-based tender evaluation copilot designed for public procurement systems.

It not only evaluates vendor eligibility but also simulates policy impact before tender publication — helping prevent low-competition and high-risk tenders.

The system generates a tamper-proof audit report with SHA-256 verification and officer sign-off, making procurement decisions transparent, traceable, and defensible.

---

## Why It Matters

Government procurement in India exceeds ₹15 lakh crore annually.
Yet evaluation is still manual, inconsistent, and difficult to audit.

NyayaBid AI solves this by:

- Automating eligibility evaluation
- Providing explainable decisions with confidence scores
- Detecting fraud and collusion signals
- Preventing restrictive tenders using reverse simulation
- Generating audit-ready reports with tamper-proof verification

---

## Key Features

- **Explainable Tender Evaluation** with per-vendor confidence scoring and pass/fail reasons
- **Reverse Simulation Engine** for real-time policy impact analysis before tender publication
- **Cross-document fraud detection** and collusion risk flagging
- **SHA-256 verified audit report** with digital officer sign-off
- **OCR fallback** for scanned documents via Tesseract.js
- **Fully browser-based** — zero backend, zero build step, zero dependencies to install

---

## How It Works

1. Upload a tender PDF
2. Extract eligibility criteria automatically (PDF.js / OCR fallback)
3. Evaluate vendors with the rule-based engine
4. Detect cross-document inconsistencies and collusion risks
5. Generate a CAG-ready audit report with SHA-256 verification hash
6. Simulate policy changes to analyse competition impact before publishing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Document Parsing | PDF.js (CDN) |
| OCR Fallback | Tesseract.js (CDN) |
| Audit Hashing | Web Crypto API (SHA-256) |
| State Management | localStorage |

---

## Project Structure

```
nyayabid/
├── index.html              — Landing page and product overview
├── pages/
│   ├── dashboard.html      — Procurement overview and audit trail
│   ├── evaluate.html       — PDF-driven evaluation flow
│   ├── simulation.html     — Reverse simulation engine
│   └── report.html         — Audit report generator with sign-off
├── scripts/
│   ├── app.js              — Shared boot, settings modal, toast
│   ├── data.js             — Tender data, vendor data, utilities
│   ├── evaluation.js       — Rule-based evaluation engine
│   └── collusion.js        — Fraud and collusion flag helpers
├── styles/
│   ├── main.css            — Global styles and layout
│   ├── dashboard.css       — Dashboard and evaluate page styles
│   ├── simulation.css      — Simulation page styles
│   └── report.css          — Report and print styles
└── assets/
    └── logo.svg            — NyayaBid AI brand asset
```

---

## Running The App

No build step. No package manager. No server required.

**Option 1 — Open directly:**
Open `index.html` in any modern browser.

**Option 2 — Local server (recommended for PDF upload):**

```bash
python -m http.server 8000
```

or

```bash
npx serve .
```

Then open `http://localhost:8000` and navigate through the pages.

---

## Data and Storage

| Key | Contents |
|---|---|
| `nyayabid-evaluation-data` | Full evaluation payload — rows, overrides, criteria, document |
| `nyayabid-report-signoff` | Officer sign-off — name, designation, remarks, timestamp |

The report page loads from stored evaluation when available and falls back to a built-in demo tender automatically.

---

## Delivery Status

| Phase | Feature | Status |
|---|---|---|
| 1 | Real PDF parsing and criteria extraction | ✅ Complete |
| 2 | Rule-based evaluation with confidence scoring | ✅ Complete |
| 3 | Collusion detection and cross-document flags | ✅ Complete |
| 4 | Reverse simulation engine | ✅ Complete |
| 5 | SHA-256 audit report with officer sign-off | ✅ Complete |
| 6 | OCR fallback for scanned documents | ✅ Complete |

---

## Browser Compatibility

Designed for modern desktop browsers with JavaScript enabled. Best experience on a current Chromium-based browser.

---

> NyayaBid AI does not just evaluate tenders — it helps prevent unfair ones before they are published.
