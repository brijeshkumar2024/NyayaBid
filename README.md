# NyayaBid AI

NyayaBid AI is a static, browser-based tender evaluation copilot built for explainable public procurement workflows. It helps users extract tender criteria from PDFs, evaluate vendor eligibility, simulate policy changes, and generate a CAG-ready audit report with officer sign-off.

## What It Does

- Reads tender PDFs in the browser and extracts criteria such as turnover, experience, GST, and MSME applicability.
- Evaluates vendors against live criteria and shows pass/fail reasons with confidence scores.
- Detects cross-document inconsistencies and collusion risks.
- Lets users reverse-simulate policy changes to see how competition changes in real time.
- Generates an audit report with SHA-256 verification, flag summaries, override history, and printable sign-off output.

## Project Structure

- `index.html` - landing page and product overview.
- `pages/evaluate.html` - PDF-driven evaluation flow with extraction, scoring, and override logging.
- `pages/simulation.html` - reverse simulation engine for eligibility and competition analysis.
- `pages/report.html` - audit report generator with hash verification and sign-off.
- `scripts/data.js` - tender data, vendor data, and shared utilities.
- `scripts/evaluation.js` - rule-based evaluation logic.
- `scripts/collusion.js` - fraud and collusion flag helpers.
- `styles/` - shared and page-specific styling.
- `assets/logo.svg` - NyayaBid AI brand asset.

## How The Flow Works

1. Evaluate a tender in `pages/evaluate.html`.
2. The page stores the latest evaluation result in `localStorage` under `nyayabid-evaluation-data`.
3. Open `pages/report.html` to render the stored evaluation as a formal audit report.
4. Use `pages/simulation.html` to tune eligibility criteria and observe how the bidder pool changes.

## Running The App

This repository has no build step and no package manager dependency.

Option 1: open `index.html` directly in a browser.

Option 2: serve the folder with any static file server if you prefer a local HTTP origin.

Examples:

```bash
python -m http.server 8000
```

or

```bash
npx serve .
```

Then open the site root in your browser and navigate through the pages.

## Data And Storage

- Evaluation output is persisted in `localStorage` under `nyayabid-evaluation-data`.
- Report sign-off is persisted in `localStorage` under `nyayabid-report-signoff`.
- The report page uses the stored payload when available and falls back to a built-in demo tender when no stored evaluation exists.

## Implementation Notes

- The app is intentionally frontend-only.
- The evaluation and simulation pages are self-contained so they do not rely on a brittle shared bootstrap.
- PDF parsing in the evaluation page uses PDF.js from a CDN.
- The report page computes a SHA-256 digest from the rendered audit payload for verification.

## Hackathon Delivery Status

- Phase 1: Real PDF parsing and criteria extraction - complete.
- Phase 2: Real simulation engine with live eligibility filtering - complete.
- Phase 3: Audit report generation with hash verification and sign-off - complete.
- Phase 4: README - complete.

## Browser Compatibility

The app is designed for modern desktop browsers with JavaScript enabled. For the best experience, use a current Chromium-based browser.
