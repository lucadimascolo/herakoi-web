# Modern Tooling Roadmap

## Objectives
We want to introduce a maintainable frontend toolchain (TypeScript, Vite, Biome, PostCSS) without altering the current user experience. Our north star for today is to stand up the tooling scaffolding, keep the existing HTML demo verifiable, and equip the team with a reproducible developer environment via Dev Containers and Codespaces.

## Baseline & Risk Controls
- Capture the current `herakoi_web_three_channels/html` behavior with screenshots and a short screen recording so we can regression-check MediaPipe interactions after the migration.
- Archive the existing static bundle inside `public/legacy-html` so we can serve it side-by-side while the new Vite build matures.
- Add a lightweight smoke checklist covering image upload, webcam feed, and slider updates; we will use it before and after each major change.

## Tooling Workstream
1. **TypeScript adoption**  
   - Introduce a `/src` workspace with Vite’s vanilla-ts template, then incrementally port the inline script from `index.html`.  
   - Configure strict TypeScript settings but temporarily allow `any` so we unblock MediaPipe prototype code. Track follow-up tasks to tighten types.
2. **Vite build pipeline**  
   - Scaffold Vite in the repo root, mapping `public/assets` for static files.  
   - Adopt `pnpm` for dependency management so we share lockfiles across platforms and benefit from the content-addressable store.  
   - Create parity entry points (`main.ts`, `style.css`) that replicate the current UI while using Vite’s dev server for HMR.
3. **Biome formatting & linting**  
   - Add a project-level `biome.json` mirroring two-space indentation and the narrative comment style from `AGENTS.md`.  
   - Wire Biome into `package.json` scripts (`lint`, `format`) and into the pre-commit hook queue once adopted.
4. **PostCSS pipeline**  
   - Configure PostCSS with autoprefixer and nesting support to simplify responsive tweaks.  
   - Document how legacy CSS lives within the new pipeline, and schedule the migration of inline styles into modular files.
5. **Testing suggestions**  
   - Add Vitest for unit coverage of helper utilities as they emerge.  
   - Keep Playwright on the radar for later regression testing once the TypeScript refactor settles.

## Environment & Dev Experience
- Author a `.devcontainer/devcontainer.json` that installs Node LTS, Biome, and Docker CLI tooling; mount the repo and configure post-create commands to run `pnpm install`.  
- Mirror the configuration in a `devcontainer.json` at the repo root for Codespaces users.  
- Provide workspace recommendations (VS Code extensions, Biome formatter integration) in the Dev Container features.

## Execution Order
1. Baseline capture and legacy archive.  
2. Initialize Vite + TypeScript scaffold.  
3. Layer in PostCSS configuration.  
4. Introduce Biome and align scripts.  
5. Finalize Dev Container + Codespaces setup.  
6. Run regression checklist and update documentation before opening the modernization pull request.
