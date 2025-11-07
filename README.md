# Herakoi Image Sonification

Herakoi is a **motion-sensing sonification experiment**: a webcam tracks your hands via machine learning, re-projects the landmarks onto a reference image, and converts the colour/brightness of the “touched” pixels into sound so you can *hear* visuals for artistic, educational, or accessibility purposes. This repository hosts the web implementation of that idea—keeping the original HTML experiments alongside a modern TypeScript + Vite build so we can iterate quickly while remaining faithful to the Python prototype described at [herakoi/herakoi](https://github.com/herakoi/herakoi).

- **Goal:** explore sonification of still images and live camera feeds using real-time hand detection and simple audio synthesis.

## Contribution Guide

### Project Layout
- `src/` – active TypeScript modules
- `legacy_html/` – read-only originals kept for behaviour comparison. 
- `docs/` – roadmaps (`docs/improvement-plan-pr1.md`), ADRs, and design notes.
- `AGENTS.md` – collaboration guidelines (narrative comments, plan updates, confirmation process).
- `public/` static assets served as-is.


### Getting Started
```bash
pnpm install
pnpm dev          # launches Vite dev server
pnpm lint         # biome + tsc
pnpm typecheck    # explicit project + config checks
pnpm test         # vitest (placeholder until specs land)
```
