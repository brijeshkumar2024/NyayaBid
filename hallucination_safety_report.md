# Hallucination Safety Report

## Current Enforcement
- Extraction failure never auto-fills tender/vendor values.
- Unsupported/corrupted files fail with explicit safe message.
- Non-procurement documents rejected with `No relevant procurement information detected.`
- Low-confidence or unverified states remain blocked from automatic decision flow.

## Regression Fixes
- Upload pipeline runtime break fixed without restoring demo extraction paths.
- Relevance gate adjusted by document type to reduce false rejections of legitimate vendor certificates while preserving strict rejection for irrelevant docs.

## Safety Result
- No fabricated extraction path introduced.
- No silent continuation after extraction failure.
