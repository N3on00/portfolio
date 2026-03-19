# Patrik Egger Portfolio

This repository contains the source code for `portfolio.pegger.dev`.

It is a Vite + React portfolio with two presentation modes built on one shared content graph:

- `interactive`: currently a detailed concept page for a future room-based experience with real portfolio value
- `classic`: the production-ready direct portfolio view rendered from the shared document model

## Live

- Production: `https://portfolio.pegger.dev`

## Core idea

The homepage deliberately asks the visitor how they want to enter the portfolio:

- direct portfolio view
- future room concept

The repository is structured so content, behavior, rendering, routing, and infrastructure stay separate:

- shared portfolio content is defined once
- both modes project from the same entities, relations, and mode mappings
- feature behavior stays inside the owning feature module
- React is only the runtime adapter, not the domain model

That keeps the portfolio extensible without forcing new sections, scenes, or overlays into the app shell.

## Project structure

```text
src/
|- app/                     shared shell and route contracts
|- features/
|  |- interactive/          scene system, actor-driven interactions, React adapter
|  |- classic/              classic render flow, block rendering, React adapter
|- runtime/react/           Vite/React bootstrapping and runtime composition
|- shared/
|  |- actors/               generic actor contracts, registry, resolver, state store
|  |- content/              shared portfolio entities, relations, and mode mappings
|  |- types/                cross-module contracts
|  |- ui/                   design tokens and reusable React primitives
docs/
|- architecture.md
|- actor-system-architecture.md
|- content-model.md
|- interactive-scene-system.md
|- runtime-integration.md
|- integration-decisions.md
|- deployment.md
scripts/
|- deploy-portfolio.sh
```

## Architecture summary

- `src/shared/content/portfolio-content.ts` is the single source of truth for portfolio content
- `src/shared/actors` defines reusable actor contracts and state handling
- `src/features/interactive` owns scene composition, progression, hotspots, and reaction routing
- `src/features/classic` owns section ordering, scan priority, block composition, and renderer adapters
- `src/runtime/react` mounts mode entrypoints and keeps routing/runtime concerns out of feature logic

Further details live in:

- `docs/architecture.md`
- `docs/integration-decisions.md`
- `docs/deployment.md`
- `docs/interactive-experience-spec.md`

## Development

Prerequisites:

- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Start local development:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Type-check the project:

```bash
npm run typecheck
```

## Routes

- `/` -> interactive mode
- `/interactive` -> interactive mode directly
- `/classic` -> classic mode directly

## Deployment

The production site is deployed as static assets behind Caddy on the target server.

- deployment notes: `docs/deployment.md`
- helper script: `scripts/deploy-portfolio.sh`

The deployment flow is intentionally small:

1. build locally
2. upload `dist/`
3. serve it through the portfolio frontend container
4. expose the domain through the existing reverse proxy

## Documentation conventions

- product and architecture rationale live in `docs/`
- feature-local progress stays in the feature `TODO.md` files
- shared UI boundaries live in `src/shared/ui/README.md`

## Repository hygiene

- this repo should only contain files that directly support the portfolio app
- external project-positioning notes and unrelated career-material docs were intentionally removed from the root
- deployment credentials and private keys must stay outside this repository
