# Digital Guardians — Safe and Savvy Seniors

[![CI](https://github.com/Philipmag/philipmag.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/Philipmag/philipmag.github.io/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Practical online-safety education for older adults in **Peterborough, Ontario**. This project combines readable learning guides, interactive quizzes, a privacy-conscious message helper, and community-training workflows in a portable React and Node.js application.

**[Repository](https://github.com/Philipmag/philipmag.github.io)** · **[Standalone architecture and deployment](docs/STANDALONE.md)** · **[Security and privacy](docs/SECURITY.md)**

**Release status:** this redesign is available on [`sync/digital-guardians-2026-11-25`](https://github.com/Philipmag/philipmag.github.io/tree/sync/digital-guardians-2026-11-25). Main/Pages publication requires the repository owner to install the included workflow recipes and change the Pages build source. The current connector cannot write workflow files or Pages settings. See [GitHub release steps](docs/GITHUB_RELEASE.md).

The standalone application needs no Manus runtime providers, OAuth, or platform account. OpenRouter is its only AI integration, and even that is optional. This describes the source and runtime architecture, not the project's development provenance or current hosting: **the existing [www.digitalguards.ca](https://www.digitalguards.ca) site remains on Manus until a separately authorized publish or domain migration.** No independent production backend or domain switch is claimed here.

## What to explore

- **Message check and technology help:** plain-language, structured OpenRouter responses with validation, bounded requests, and clearly labelled local fallback guidance. Neither mode verifies identities, visits suspicious links, or changes a user's device.
- **Learning guides:** email basics, passwords, spotting scams, and safe browsing, with quizzes and immediate feedback. Guides need neither AI nor a database.
- **Community resources:** original training downloads and a manually controlled workshop slideshow. Calendar registration and personal-training requests use optional MySQL persistence; contact delivery uses optional SMTP.
- **Reading-first design:** restrained navy, cobalt and ice-blue surfaces, the preserved Digital Guardians crest, generous text, numbered steps, keyboard focus, and text-size and contrast controls. A lightweight hero web animation has a pause control and static accessibility/mobile fallbacks; original workshop photos remain manually advanced. These are implementation choices, not a claim of independently certified accessibility compliance.

The café and library scenes are labelled **AI-generated illustrations**, not real participant photographs or evidence of program impact. Original workshop media and training materials were supplied by the program owner and retain their captions and content.

## Quick start

Use **Node.js 22** and **pnpm 10.4.1**, pinned through Corepack.

```bash
git clone --branch sync/digital-guardians-2026-11-25 https://github.com/Philipmag/philipmag.github.io.git
cd philipmag.github.io
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile
cp config/env.example .env
pnpm dev
```

Open `http://localhost:3000` unless you set another `PORT`. The template is secret-free; keep your local `.env` out of Git.

Leave `OPENROUTER_API_KEY` blank to try the no-provider mode. The Node server supplies local precautionary checklists and quick guides without contacting OpenRouter; they are **not live AI assessments**. For live AI, set `OPENROUTER_API_KEY` only in the server environment. `OPENROUTER_MODEL` defaults to `openrouter/free` and can be changed to another compatible OpenRouter model. Never place the key in browser code or a `VITE_*` variable.

No login, database, or SMTP configuration is needed for the guides or AI tools. Without MySQL, calendar/training services report unavailable rather than pretending to save a request. Without SMTP, contact reports that the message was not delivered or saved and offers direct contact alternatives.

## Commands and testing

```bash
pnpm dev              # Full app: Express API and Vite development UI
pnpm check            # TypeScript check
pnpm test             # Default deterministic/mocked test suite
pnpm build            # Production browser assets and Node server
pnpm start            # Serve the production build; run build first
pnpm build:gh-pages   # Static preview; live AI and form submissions disabled
```

Default tests mock external integrations and do not require credentials. Live OpenRouter tests are explicitly opt-in, even when a key is present:

```bash
RUN_LIVE_OPENROUTER_TESTS=1 pnpm test:live
```

Provide a server-side `OPENROUTER_API_KEY` for that command. Live results depend on current provider availability and account limits; they are not a reliability guarantee. See [testing details](docs/STANDALONE.md#testing-and-a-recruiter-walkthrough) for the tested boundaries and a short demo sequence.

## Hosting boundaries

**GitHub Pages is a static preview, not a Node host.** The Pages build compiles `VITE_STATIC_PREVIEW=1` and supports the design, guides, quizzes, and downloads. AI and submission buttons are disabled with clear explanations and email/phone alternatives. This repository's existing Pages custom domain is [digitalguards.ca](https://digitalguards.ca); [philipmag.github.io](https://philipmag.github.io) may redirect there. The artifact workflow publishes the compiled preview, never the raw TypeScript source. This is separate from the existing `www` site and does not deploy a live AI backend.

The prepared Pages workflow is **manual-only** and defaults to build/upload without deployment. Publication requires selecting `publish: true` on `main` after review. Only its deploy job requests Pages/OIDC write permissions. The current revision remains unpublished; see [owner setup and permission status](docs/GITHUB_RELEASE.md).

For live AI and submissions, deploy the full Node application on an independent Node host. The [Render blueprint](render.yaml) and [Docker instructions](docs/STANDALONE.md#docker) are unprovisioned deployment paths, not completed deployments. Railway or another suitable Node host can use the same build/start commands. There is no `VITE_API_URL` bridge from Pages to a separate API.

## Engineering choices

React 19, TypeScript, Vite 7, Tailwind CSS 4, and Wouter handle the UI. Express 4 and tRPC 11 share typed API contracts; Zod and Ajv validate inputs and AI outputs. Drizzle with MySQL and Nodemailer with SMTP are optional adapters.

A single app process is a sensible starting point: the public AI limiter is in-memory, shared across the two tools, and allows eight requests per network identifier per ten minutes. Multi-instance hosting needs a shared limiter. Event capacity is currently checked before insertion without transactional locking, so concurrent signups can exceed capacity. These tradeoffs and the data flow are documented in [Standalone](docs/STANDALONE.md), with the associated limits in [Security](docs/SECURITY.md).

## License, attribution, and contact

The existing source [MIT license](LICENSE), including its copyright notice, is retained. The redesign adapts the **[Unslop](https://github.com/heydamir/unslop)** method by **Damir Sokolovsky ([@heydamir](https://x.com/heydamir))**, shared under **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**. Its audit-and-refinement process informed the warm reading-first interface; this attribution does not replace the application's MIT license or assert rights to third-party media.

**Digital Guardians, Peterborough, Ontario** · [info@digitalguards.ca](mailto:info@digitalguards.ca) · [+1 (705) 772-5140](tel:+17057725140)
