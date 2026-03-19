# Portfolio Source Pack

This folder is a filtered, portfolio-focused source pack based on the projects in `C:\Coding` and the public repositories on `github.com/N3on00`.

## Architecture bootstrap

- Modular portfolio foundation: `docs/architecture.md`
- Runtime decision and integration shape: `docs/runtime-integration.md`
- Shared app layer: `src/app/TODO.md`
- Shared contracts and tokens: `src/shared/TODO.md`
- Interactive mode workstream: `src/features/interactive/TODO.md`
- Classic mode workstream: `src/features/classic/TODO.md`

## Best projects to lead with

### 1. SpotOnSight
- Best overall portfolio piece.
- Strongest signals: full-stack architecture, API design, Vue frontend, FastAPI backend, MongoDB, mobile wrapper, Docker, CI/CD, tests, and technical documentation.
- Best use: lead project for junior full-stack, frontend, backend, or product-minded developer applications.

### 2. pay-qr-with-apple-pay
- Strong prototype/demo project.
- Strongest signals: payment flow design, Vue frontend, Express backend, QR parsing, Stripe integration, demo-mode thinking, and architecture docs.
- Best use: second portfolio project that shows practical product thinking and user flow design.

### 3. better_weather
- Useful optional project if you want more technical range.
- Strongest signals: multi-part architecture, testability standards, Python + TypeScript/Vue mix, and hardware/data pipeline thinking.
- Best use: mention as an engineering/IoT-style systems project if the role values testability, integration, or applied software.

## Projects to use carefully

### M335
- Useful as supporting context because it documents process, reflection, and coursework quality.
- Not ideal as a main standalone portfolio item because it overlaps heavily with `SpotOnSight` and reads as school framing first.

### DiscordBot
- Has some real technical value: async commands, queue logic, voice integration, and third-party tooling.
- Only use after removing the hardcoded token and cleaning the repo structure.

## Projects to filter out

- `BO6_SafeScript`
- `BongoCat_claimBoxes`

These are fine as personal experiments, but they do not help much in a professional portfolio compared with your stronger work.

## Important repo hygiene notes

- `SpotOnSight` currently contains a committed private key in `C:\Coding\SpotOnSight\ssh.txt`. Do not present or share that repo publicly until the key is rotated and history is cleaned.
- `DiscordBot` contains a hardcoded bot token in `C:\Coding\DiscordBot\Main.py:11`. Rotate it and remove it before using the project anywhere public.
- The public GitHub repo `github.com/N3on00/pay-qr-with-apple-pay` appears empty right now, while the local project is much more complete.

## How to use this folder

- Start with `portfolio/PROJECT_LIBRARY.md` for project descriptions you can copy from.
- Use `portfolio/SKILLS_AND_CAPABILITIES.md` for your skills, strengths, and likely impact.
- Use `portfolio/REPO_NOTES.md` for GitHub-specific positioning and cleanup priorities.
