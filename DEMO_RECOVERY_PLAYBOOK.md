# NyayaBid AI Demo Recovery Playbook

## Purpose
Fast recovery guide for live judging if runtime issues occur.

## 1) If OCR fails or extraction confidence is low
- Expected behavior: System shows safe rejection and `Manual review required`.
- Demo line: "NyayaBid blocks unsafe automation and forces officer verification."
- Recovery:
  1. Use a clearer PDF/image sample.
  2. Re-upload via Evaluate page.
  3. Show Review Timeline + Governance Trust Bar pending count.

## 2) If CDN script fails (Chart/OCR/PDF libs)
- Expected behavior: No crash, fallback messaging shown, table/report flow still works.
- Recovery:
  1. Continue with table-based evaluation and report sections.
  2. Use `Reset Session` once and refresh.
  3. Emphasize governance continuity: "Core audit workflow remains available."

## 3) If upload fails
- Expected behavior: Safe rejection messaging, no fake extraction.
- Recovery:
  1. Re-upload supported format (`PDF`, `DOCX`, `JPG`, `PNG`).
  2. Use known-good tender/vendor fixture files.
  3. Show mandatory review gate remains active.

## 4) If charts appear blank
- Recovery:
  1. Hard refresh (`Ctrl+Shift+R`).
  2. Click `Reset Session` and reload dashboard.
  3. Proceed using KPI cards + tables + report evidence (judge-safe fallback).

## 5) Emergency backup demo flow (90-second)
1. Open Evaluate: upload tender + vendor docs.
2. Show extraction evidence + review-required gate.
3. Run evaluation and open "Why This Bidder Lost".
4. Open Simulation and show before-vs-after policy warning delta.
5. Open Report and show sign-off + tamper status.

## Judge framing under failure
- "The platform fails safely, never fabricates eligibility, and always keeps officers in control."
- "Governance resilience is prioritized over cosmetic continuity."
