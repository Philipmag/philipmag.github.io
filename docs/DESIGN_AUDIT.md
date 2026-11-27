# Digital Guardians: Unslop audit and standalone migration

27 November 2026 · Prepared by Manus AI

Digital Guardians now has a reading-first interface and a portable React/Node application. The redesign preserves its Peterborough, Ontario identity, crest, teaching guides, quizzes, original workshop photographs and four training downloads. OpenRouter is the only AI transport. A recruiter can install and run the project without a Manus account, database, mail service or AI key.

## What the audit changed

The previous hero, analyzer and footer used cobalt gradients, coloured glows, clay surfaces and carved headlines. Ambient network animation, shimmering textareas and automatically advancing workshop photographs added motion without helping a visitor complete a task. Small privacy text competed with bright decorative elements. Repeated surreal imagery did not clearly distinguish illustration from actual participants.

The source also depended on platform OAuth, storage delivery and model helpers. Some service paths could suggest successful delivery or persistence without a confirmed external operation. Metadata named Barrie rather than Peterborough, and the fraud collection could be mistaken for current reporting. These were corrected or explicitly qualified.

## Direction

**Product:** practical cybersecurity and digital-inclusion education for older adults in Peterborough, Ontario.

**Character:** patient, practical and neighbourly.

**World:** a community café or library reading table, expressed through warm paper `#f7f4ee`, navy ink `#173653` and `#142f4a`, and the existing crest.

**Moments:** a café guidance illustration in the split hero and a library learning illustration beside the guide list.

**Signature:** simple step numbers and horizontal rules that connect the learning guides, helper instructions and emergency actions.

## The nine design passes

1. **Spacing:** consistent panel padding, generous section spacing and a bounded reading layout replaced uneven decorative stacking.
2. **Colour:** warm paper, off-white surfaces and navy actions replaced hue gradients, glows and coloured shadows.
3. **Icons:** quiet Lucide line icons support actions without filling every title or card with decoration.
4. **Copy:** shorter labels, patient explanations and real availability messages replaced hype and unsupported privacy guarantees. Peterborough and the correct email/phone remain consistent.
5. **Type:** self-hosted DM Sans serves the interface; Georgia gives the hero a restrained editorial character. The default body is 18px, with persistent text-size and high-contrast controls.
6. **Layout:** the asymmetric hero gives words and imagery clear space. Mobile stacks in reading order. Existing homepage section order and guide content remain intact.
7. **Details:** keyboard focus, labels, main-content targets, touchable controls and visible errors remain available. Contact and calendar success depend on actual service outcomes.
8. **Visuals:** two optimized WebP illustrations replace repeated surreal scenes. Each is explicitly captioned as AI-generated, not documented participants. The preserved workshop photographs use manual previous/next controls.
9. **Motion:** ambient animation, hide-until-scrolled entrances and auto-advance were removed. Only direct interaction feedback remains.

These changes implement the supplied Unslop method; they are not a claim of independently certified accessibility compliance. [1]

## Image briefs and portable assets

The café brief called for a natural, documentary-style scene of an older adult and friendly guide sharing a tablet at a café table, with ordinary daylight, believable people and no luminous stars, floating interface or text overlay. The library brief called for older adults learning together around a library table, with a patient facilitator, practical devices and a warm everyday setting. These are creative briefs, not claims that the people or scenes document Digital Guardians events.

The café and library assets are approximately 83 KB and 72 KB respectively. The crest, original workshop photographs, self-hosted font and four unchanged PPTX downloads are served locally under `/media/`. The media folder is approximately 11 MB; training downloads account for most of it. Provenance and font licensing are recorded in [media credits](../media/CREDITS.md).

## Independent engineering

The fixed server-side endpoint is `https://openrouter.ai/api/v1/chat/completions`. The API key never belongs in a browser bundle. Returned JSON is independently checked with Ajv and Zod, followed by bounded output and safety checks. Requests have total deadlines; diagnostics do not retain upstream bodies, submitted text or credentials. Structured output support is provider-dependent, so validation remains necessary. [2]

The default `openrouter/free` router chooses among available compatible free models. Model availability, output quality and latency can vary. [3] During final testing, some provider completions were rejected and the UI correctly showed a local safety checklist or quick guide, not fabricated AI success. The analyzer budget was increased from 900 to 1800 tokens while retaining the same total deadline; reasoning can share this budget with the visible answer. This is a bounded-output improvement, not a guarantee that every free model will respond successfully. [4]

Manus OAuth, runtime plugins, storage proxy, built-in notifications and direct NVIDIA integration were removed. Optional MySQL supports durable registrations and training requests; optional SMTP supports contact and notifications. No live database writes, migrations or SMTP sends were performed. Obsolete seed scripts, including a destructive fixed-date example, were removed without executing them.

## Verification evidence

A fresh export on the public GitHub history installed with `pnpm install --frozen-lockfile`, passed TypeScript and passed **145 default tests**. Production and static-preview builds succeeded. Live checks are excluded from ordinary credential-free CI.

OpenRouter accepted the private credential check. A real structured completion passed. The real application analyzer returned an AI-labelled dangerous assessment for a synthetic gift-card scam in approximately 3 seconds after the budget change. The redesigned browser technology-help flow returned an AI-generated iPhone text-size guide with steps, troubleshooting and a safety reminder. One later free-router technology-help test returned a rejected completion and a labelled fallback; the live suite therefore is an availability check, not a deterministic reliability promise.

Desktop at 1440 × 1000 and mobile at 390 × 844 were visually reviewed. A redundant desktop menu control was corrected. The HTTPS development-preview origin issue was reproduced as HTTP 403 and fixed with an exact-host, development-only exception; strict production and explicit-origin behavior have regression coverage.

A production Node run without AI, database or SMTP credentials served health, guide routes and local media, returned JSON 404 for unknown API paths, and returned correctly labelled no-key safety-check and quick-guide results. The compiled static preview rendered successfully; its analyzer input and submit button were disabled, and browser network entries contained no `/api/` requests. Its hashed assets, four downloads, identical `404.html` fallback and `.nojekyll` marker were checked.

## Hosting and remaining limits

GitHub Pages hosts a compiled static preview only. It cannot run this Node AI API, so live AI and form submissions are disabled there. The repository's existing Pages custom domain is `digitalguards.ca`; this is not a migration of the existing Manus-hosted `www.digitalguards.ca` site.

The full app needs an independent Node host for public live AI. Docker and Render recipes are included but are not deployed or container-tested. SMTP acceptance is not proof of inbox delivery. The AI limiter is process-local, and event capacity checking is not transactional; both need stronger shared/atomic infrastructure before scaling. No speed SLA, search-ranking improvement, uptime guarantee or formal security certification is claimed.

See [Standalone](STANDALONE.md), [Security](SECURITY.md) and [README](../README.md) for setup, data flow and the recruiter walkthrough. The old October AI review is explicitly marked historical and superseded.

## References

[1]: https://github.com/heydamir/unslop "Unslop by Damir Sokolovsky, CC BY 4.0"
[2]: https://openrouter.ai/docs/guides/features/structured-outputs "OpenRouter structured outputs"
[3]: https://openrouter.ai/docs/guides/routing/routers/free-router "OpenRouter free-model routing"
[4]: https://openrouter.ai/docs/guides/best-practices/reasoning-tokens "OpenRouter reasoning and output-token budgets"

## GitHub release boundary

The GitHub connector lacks workflow-write and Pages-settings permissions. The source release therefore uses the safe `sync/digital-guardians-2026-11-25` branch, with updated workflow recipes under `config/github-actions/` rather than activated by this connector. Main and live Pages publication remain pending owner action. See [GitHub release steps](GITHUB_RELEASE.md); do not mistake source publication for an independent live backend or domain migration.
