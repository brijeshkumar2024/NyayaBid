# NyayaBid AI — Hackathon Upgrade TODO

> Goal: Add realistic OCR + PDF intelligence and significantly enhance Fraud & Risk Detection while keeping offline demo flows stable.

## Plan Summary
- Upgrade `pages/evaluate.html` with drag-drop upload UI (Tender + Vendor), animated processing pipeline, extraction panels (confidence + source traceability), and officer workflow.
- Add lightweight browser-side extraction helpers to `scripts/utils.js` (PDF.js text extraction + OCR fallback with Tesseract.js, regex/heuristics for GST/PAN/turnover/EMD/dates).
- Upgrade fraud/risk detection logic and add demo intelligence datasets in `scripts/collusion.js` and `scripts/data.js`.
- Ensure no backend dependency, no API keys, offline demo remains functional.

## Steps
1. [ ] Inspect current evaluate page DOM + script wiring.
2. [ ] Implement upload UI + states + toasts (glassmorphism cards).
3. [ ] Implement animated OCR processing pipeline stepper.
4. [ ] Implement extraction confidence tiers + UI badges.
5. [ ] Implement Source Reference traceability for each extracted field.
6. [ ] Implement extraction engine (PDF.js + Tesseract.js dynamic loading) with regex/heuristics.
7. [ ] Wire extracted data into evaluation flow without breaking demo buttons.
8. [ ] Extend fraud detection: bid collusion, address overlap, rotation pattern, abnormally low bids, tampering simulation, blacklist watchlist simulation.
9. [ ] Implement Risk Scoring Engine (0–100) + severity categories + heatmap-style dashboard.
10. [ ] Add officer review workflow buttons that log actions to audit trail (localStorage).
11. [ ] Update/extend dashboard visuals if necessary; verify charts still render.
12. [ ] Manual validation checklist: OCR upload → parsing → panels → flags/risk → no console errors → responsive layout.

## Progress
- 1. Inspect evaluate page DOM + wiring: 

