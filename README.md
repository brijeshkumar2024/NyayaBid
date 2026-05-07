# NyayaBid AI — Explainable Tender Evaluation & Policy Simulation Copilot

## ⚖️ Fairer Procurement through Explainable Intelligence

NyayaBid AI is an enterprise-grade, browser-based procurement intelligence platform designed to transform tender evaluation from a "black box" into an explainable, auditable, and transparent process.

It bridges the gap between raw document extraction and governance-aware decision making, ensuring that every procurement action is **traceable**, **defensible**, and **fair**.

---

## 🌟 High-Impact Hackathon Features

- **⚖️ Why This Bidder Lost (Explainable AI)**: Generates natural-language justifications for every eligibility verdict, backed by extracted evidence. No more "Computer says NO"—NyayaBid says "WHY."
- **📊 Procurement Fairness Score (PFS)**: A real-time governance metric evaluating tender inclusivity, MSME participation, and competition density.
- **📉 Competition Health Indicator (CHI)**: A "What-If" simulation engine that predicts market participation risks *before* a tender is published, preventing restrictive and anti-competitive criteria.
- **🚨 Tender Clause Risk Warnings**: Automatic detection of restrictive or anti-competitive eligibility clauses in uploaded PDF documents.
- **🕰 Officer Override Accountability Timeline**: A unified, tamper-evident audit log that tracks every human-in-the-loop decision, edit, and override.
- **🛡️ CAG-Ready Audit Reports**: Professional multi-page PDF generation including vendor breakdowns, risk flags, and SHA-256 verification hashes for tamper-proof data integrity.

---

## 🏗️ Technical Architecture

NyayaBid AI utilizes a modular, client-side-first architecture to ensure data privacy and high-speed local processing.

| Layer | Technology |
|---|---|
| **Core** | HTML5, Vanilla CSS, Javascript (ES6+) |
| **Parsing** | PDF.js (Text Layer), Mammoth (DOCX) |
| **OCR** | Tesseract.js (Scanned Documents) |
| **Data Visualization** | Chart.js |
| **Report Export** | jsPDF (Multi-page Enterprise Reports) |
| **Security** | Web Crypto API (SHA-256), XSS-Hardened DOM |

---

## 📂 Project Structure

```
NyayaBid/
├── index.html              — Landing Page & Storytelling
├── pages/
│   ├── dashboard.html      — Live KPI Oversight & Shared Audit Trail
│   ├── evaluate.html       — PDF Ingestion, AI Extraction & Review Workflow
│   ├── simulation.html     — Policy "What-If" & Market Health Indicators
│   └── report.html         — Final Audit Report, Sign-off & PDF Export
├── scripts/
│   ├── utils.js            — Shared Governance, Storage & UI Utilities
│   ├── evaluation.js       — Explainable Eligibility Logic
│   └── evaluation_core.js  — Document Extraction & OCR Pipeline
├── styles/
│   └── main.css            — Global Enterprise Design System (Dark Mode)
└── assets/                 — Brand and Demo Assets
```

---

## 🚀 How to Demo

1. **Reset**: Click **↺ Reset Session** in the sidebar for a clean-room start.
2. **Simulate**: Start with **Policy Simulation** to show how adjusting turnover/experience criteria affects market health.
3. **Evaluate**: Upload PDFs (or use Demo Pre-fill). Perform a **Manual Override** to demonstrate the Human-in-the-Loop accountability.
4. **Explain**: Use the **"Explain"** button in the results table to show AI reasoning.
5. **Finalize**: Generate the **Signed Audit Report** to show the SHA-256 hash and the accountability timeline.

---

## 🎯 Value Proposition
NyayaBid AI addresses **GFR 2017 Rules 160/173/175** and **CVC Guidelines**, making it directly applicable to India's $500B+ public procurement market. It reduces bidder litigation, prevents corruption, and empowers MSMEs through fairer, more open competition.

---

> "NyayaBid AI does not just evaluate tenders—it governs the process of evaluation."

## Future Scope

- **Backend Integration** with secure database and role-based access control for multi-user procurement workflows
- **Integration with GeM and CPPP APIs** for real tender and bidder data
- **Advanced AI models** for semantic understanding of tender clauses beyond rule-based extraction
- **Face and document verification** for bidder identity validation
- **Blockchain-backed audit trail** for tamper-proof, immutable logging
- **Multilingual support** for regional language tender documents
- **Mobile-friendly interface** for field officers and on-ground verification
