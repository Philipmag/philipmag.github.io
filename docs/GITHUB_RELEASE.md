# Reviewing and completing the GitHub release

The standalone redesign is prepared for `Philipmag/philipmag.github.io` on the draft review branch `sync/digital-guardians-2026-11-25`. It runs independently of Manus and uses OpenRouter as its only AI transport. Publication is paused until the owner's review; this branch must not be merged or deployed as part of the current revision.

## GitHub authorization status

On 27 November 2026, the connected `manus-connector` GitHub App was verified as enabled and able to read the repository and push ordinary source changes. Its installation permission list includes `administration:write` and `contents:write`, but contains neither `workflows` nor `pages`. GitHub rejected the Pages source update with HTTP 403, `Resource not accessible by integration`; its response identifies `pages:write,administration:write` as required permissions. Earlier workflow-file pushes were also rejected for missing `workflows` permission. Repository-owner status does not override an App token's narrower permissions.

The App is built-in, not an editable custom connector. Enabling it again does not grant new GitHub permissions. A GitHub App's publisher must request extra permissions before an installation owner can approve them. Check [installed Apps](https://github.com/settings/installations) for a pending request; if none is offered, use owner-authorized editing instead. GitHub documents the approval process in [1].

The existing Pages configuration remains legacy `main` root, with the custom domain `digitalguards.ca`, unless the owner separately changes it. Do not merge the raw source into that legacy publishing source. The current `www.digitalguards.ca` production site is unchanged.

## Prepared workflows

`config/github-actions/ci.yml` is the owner-install CI recipe. It uses Node 22 and pnpm's pinned version, installs with a frozen lockfile, checks types, runs the default mocked tests, and builds both the standalone Node application and compiled static preview. It has read-only repository permissions and no deployment step. Live OpenRouter tests are opt-in and are not run in CI.

`config/github-actions/pages.yml` is the owner-install Pages recipe. It has **no push or pull-request trigger**. A manual run defaults `publish` to `false`, so it builds, tests, and uploads the compiled artifact without deploying. The deploy job runs only when `publish` is explicitly selected and the ref is `main`. Only that job receives `pages:write` and `id-token:write`; the build job has `contents:read`. The `github-pages` environment is used for deployment protection, as documented by GitHub [2]. Required reviewers are an additional optional owner setting; their enforcement is not claimed here.

These recipes are ordinary files while workflow-write access is unavailable. The public branch's inherited active CI remains unchanged; its Node 20 install/type/static-build check does not run the new default test suite. Do not mistake prepared workflow files or locally passing tests for active full CI.

## Review locally

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

No service credentials are needed for learning guides and labelled local fallback tools. For live AI, privately configure `OPENROUTER_API_KEY` in the server environment. See [Standalone](STANDALONE.md) for setup, architecture and hosting boundaries.

## Owner setup, without publishing

1. On the **review branch**, replace `.github/workflows/ci.yml` with `config/github-actions/ci.yml` and add `.github/workflows/pages.yml` from `config/github-actions/pages.yml`, using an owner-authorized GitHub editor or Git credential with workflow-write permission. Never add API keys to workflows.
2. In [Settings → Pages](https://github.com/Philipmag/philipmag.github.io/settings/pages), select **GitHub Actions** as the build source. Preserve `digitalguards.ca`; do not change DNS or `www.digitalguards.ca`. Changing the source is configuration, not a command to deploy the reviewed artifact.
3. Leave the PR in draft, leave `main` unchanged, and do not run publication. The default Actions token may stay read-only because the prepared deploy job declares its own narrow permissions. There is no need to enable broad repository-wide write access or PR-approval permission.

## Only after review approval

Review and merge the release PR after the source configuration and workflow files are ready. Check full CI. Then manually run the Pages workflow on `main` with `publish: true`, observe any environment approval gate, wait for success, and verify the compiled homepage, guides and downloads. A merge alone must not publish this workflow.

GitHub Pages is a **static preview**: live AI and contact/registration submissions are disabled. An independent Node host is still required for public live AI. Neither the Pages setting change nor a source merge deploys Express, provisions the optional database/mail services, or migrates the existing `www` production site.

## References

[1]: https://docs.github.com/en/apps/using-github-apps/approving-updated-permissions-for-a-github-app "GitHub: Approving updated permissions for a GitHub App"
[2]: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages "GitHub: Using custom workflows with GitHub Pages"
