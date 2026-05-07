# NyayaBid AI — Submission Description

NyayaBid AI is a working prototype of a browser-based, explainable tender evaluation copilot built for Indian government procurement teams. It is designed for CRPF and similar procurement committees that need speed, transparency, and auditability without relying on opaque scoring or manual spreadsheet checks.

No equivalent tool exists in GeM, CPPP, or CPP Portal today.

---

## WHAT IS REAL TODAY

Every item below can be verified by opening the live demo at https://nyaya-bid.vercel.app.

| Feature | How to verify |
|---|---|
| PDF criteria extraction | Go to Evaluate → upload any tender PDF → turnover, experience, GST, MSME fields populate automatically |
| Rule-based vendor evaluation | Click Run Evaluation → each vendor shows Pass/Fail with a visible reason and confidence score |
| Cross-document fraud flagging | Evaluation results show flag cards for inconsistencies and collusion patterns |
| Reverse simulation engine | Go to Simulate → raise turnover to ₹17 Crore → CAG Risk Warning banner appears in red |
| Manual override justification lock | In Evaluate, attempt an override without a justification → submit is blocked |
| CAG audit report with SHA-256 | Go to Report → SHA-256 hash is visible at the top of the rendered report |
| Officer sign-off and print export | Click Sign Off in Report → name and timestamp lock; use Print to export |

---

## Problem

CRPF evaluation committees spend 3–5 working days per tender manually cross-referencing vendor documents. According to CAG Report 2022, 46% of government tenders receive only 2 bidders, indicating criteria that are accidentally restrictive or manipulated. There is no tool in the current procurement ecosystem — GeM, CPPP, or CPP Portal — that provides explainable, auditable evaluation with real-time competition analysis.

---

## What Is Built (Prototype — Round 1)

The evaluation logic follows GFR Rule 160 for eligibility criteria and GFR Rule 175 for bid evaluation. The override justification lock enforces GFR Rule 175 compliance on every manual decision.

- Real PDF parsing and tender criterion extraction in the browser using PDF.js.
- Rule-based vendor evaluation with clear pass/fail reasons and confidence scores.
- Cross-document fraud flagging and collusion risk detection using pattern matching.
- Reverse simulation engine: adjust eligibility thresholds and see live impact on vendor pool and CAG risk level.
- Manual override justification lock: overrides cannot be submitted without a written reason.
- CAG-ready audit report with SHA-256 verification hash, flag summary, override history, and officer sign-off.
- Static deployment with no server-side dependency — runs entirely in the browser.

---

## Stack

HTML · CSS · Vanilla JS · PDF.js · SubtleCrypto (SHA-256) · Browser Print API · Vercel

---

## Round 2 Roadmap

The following capabilities are planned and not yet built:

- Tesseract OCR v5 for scanned and handwritten government documents.
- LLM-based criteria extraction (GPT-4 or Mistral) with hallucination rejection layer.
- spaCy NER fine-tuned on Indian government certificate formats.
- FastAPI backend with PostgreSQL append-only audit tables for multi-user deployments.
- Access to real CRPF sample tender documents via hackathon organizers to validate extraction accuracy.

---

## Team

Nexora | Theme 3 — AI-Based Tender Evaluation for CRPF Procurement
