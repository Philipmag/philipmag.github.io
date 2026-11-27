# Completing the GitHub release

The standalone redesign is prepared for the existing repository `Philipmag/philipmag.github.io`. It runs independently of Manus and uses OpenRouter as its only AI transport.

## Why this release uses a branch

The connected GitHub App rejected a push that updated `.github/workflows/ci.yml`, reporting that it lacks `workflows` permission. The API also rejected changing Pages to an artifact workflow with HTTP 403, `Resource not accessible by integration`.

To avoid publishing raw TypeScript through the repository's existing legacy Pages source, the release is placed on `sync/digital-guardians-2026-11-25` for review. The active workflow is unchanged from the existing public history. Updated Node 22 CI and compiled Pages deployment recipes are included as ordinary files under `config/github-actions/`; they are not active workflows yet. Main and the existing live site are not changed by publishing this branch.

## Review and run the standalone project

```bash
git clone --branch sync/digital-guardians-2026-11-25 https://github.com/Philipmag/philipmag.github.io.git
cd philipmag.github.io
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm dev
```

No service credentials are needed for local guides and labelled fallback tools. For live AI, privately configure `OPENROUTER_API_KEY` in the server environment. See [Standalone](STANDALONE.md) for full setup and deployment.

## Finish publication with the repository owner's GitHub access

1. In the release branch, replace `.github/workflows/ci.yml` with the contents of `config/github-actions/ci.yml` and add `.github/workflows/pages.yml` from `config/github-actions/pages.yml`. Use an owner-authorized GitHub editor or Git credential with workflow-write permission. Never publish API keys in workflow files.
2. In the repository's **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. Preserve the existing custom domain `digitalguards.ca`; do not alter DNS or `www.digitalguards.ca` as part of this step.
3. Review and merge the release pull request into `main` only after those settings are ready. Run the CI and Pages workflows, wait for successful completion, and verify the compiled preview and guide/download routes.

The existing inherited CI checks install, types and a static build on Node 20. It does not execute the new full default test suite. The supplied replacement uses Node 22 and validates tests, the full Node build and the static build. Local verification passed TypeScript, 145 default tests with 4 opt-in live tests skipped, and both builds.

GitHub Pages is a static preview: live AI and contact/registration submissions are disabled. An independent Node host is still required for public live AI. Neither the Pages setting change nor merging the source deploys the full Node server or migrates the existing `www` production site.
