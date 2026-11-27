# Digital Guardians: Unslop audit and standalone migration

27 November 2026 · Prepared by Manus AI

Digital Guardians now has a reading-first interface and a portable React/Node application. The redesign preserves its Peterborough, Ontario identity, crest, teaching guides, quizzes, original workshop photographs and four training downloads. OpenRouter is the only AI transport. A recruiter can install and run the project without a Manus account, database, mail service or AI key.

## What the audit changed

The previous hero, analyzer and footer used cobalt gradients, coloured glows, clay surfaces and carved headlines. Shimmering textareas and automatically advancing workshop photographs added motion without helping a visitor complete a task. Small privacy text competed with bright decorative elements. Repeated surreal imagery did not clearly distinguish illustration from actual participants. The first reading-first pass removed those effects and used warm paper and navy; the latest user direction restores the blue identity and explicitly asks for a live web background, without restoring the glow-heavy treatment.

The current revision uses deep navy in the hero and footer, cobalt for primary actions, and ice-tinted neutral reading surfaces. One sparse, hero-bounded SVG network is the exception to Unslop's default against continuous decorative motion. This exception follows the user's explicit request, not a claim that the network is essential, a real-time feed, or evidence of live AI availability.

The source also depended on platform OAuth, storage delivery and model helpers. Some service paths could suggest successful delivery or persistence without a confirmed external operation. Metadata named Barrie rather than Peterborough, and the fraud collection could be mistaken for current reporting. These were corrected or explicitly qualified.

## Direction

**Product:** practical cybersecurity and digital-inclusion education for older adults in Peterborough, Ontario.

**Character:** patient, practical and neighbourly.

**World:** a connected community café or library, expressed through deep navy `#0c2342`, cobalt `#2457c5`, ice `#eaf2ff`, neutral reading surfaces `#f6f8fb` / `#ffffff`, and the existing crest. Body ink `#162b46` and secondary text `#526176` remain readable on light content areas; navy sections use ice and `#c3d2e8` text.

**Moments:** a café guidance illustration in the split hero and a library learning illustration beside the guide list. A sparse, low-contrast web at the hero's edges supplies the requested live background without drawing over copy or changing the images.

**Signature:** simple step numbers and horizontal rules that connect the learning guides, helper instructions and emergency actions.

## The nine design passes

1. **Spacing:** consistent panel padding, generous section spacing and a bounded reading layout replaced uneven decorative stacking.
2. **Colour:** navy hero/footer anchors and cobalt actions restore the blue identity; ice-tinted neutrals keep guides and forms calm. There are no hue gradients, glows, coloured shadows or text effects.
3. **Icons:** quiet Lucide line icons support actions without filling every title or card with decoration.
4. **Copy:** shorter labels, patient explanations and real availability messages replaced hype and unsupported privacy guarantees. Peterborough and the correct email/phone remain consistent.
5. **Type:** self-hosted DM Sans serves the interface; Georgia gives the hero a restrained editorial character. The default body is 18px, with persistent text-size and high-contrast controls.
6. **Layout:** the asymmetric hero gives words and imagery clear space. Mobile stacks in reading order. Existing homepage section order and guide content remain intact.
7. **Details:** keyboard focus, labels, main-content targets, touchable controls and visible errors remain available. Contact and calendar success depend on actual service outcomes.
8. **Visuals:** two optimized WebP illustrations replace repeated surreal scenes. Each is explicitly captioned as AI-generated, not documented participants. The preserved workshop photographs use manual previous/next controls.
9. **Motion:** the latest request restores only a bounded hero network. Fixed nodes/edges stay still; three small traces travel slowly along existing edges using CSS transforms. No WebGL, canvas, additional package, random particle generation, pointer tracking, polling or per-frame React updates were added. Hide-until-scrolled entrances, shimmering fields, breathing glows and photo auto-advance remain absent.

These changes adapt the supplied Unslop method by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), licensed under **CC BY 4.0**, with the user-requested looping-motion exception above. They are not a claim of independently certified accessibility compliance. [1]

## Hero motion and fallback contract

`src/components/HeroNetwork.tsx` is mounted only inside the homepage hero. Its SVG is decorative (`aria-hidden`, not keyboard-focusable); essential copy, images and links remain ordinary HTML. Artwork is clipped to the hero, cannot intercept pointer events, and uses no blur or visual filters. Solid navy behind the text and image caption prevents the background's state from affecting their contrast. A native button with a 44px minimum height provides **Pause background** / **Resume background**, with an explicit accessible action label and visible keyboard focus.

The initial render is static. Motion becomes eligible only after browser capability and visibility checks. Reduced-motion preference, widths at or below 900px, the site's saved high-contrast mode, OS forced colours or increased contrast all prevent animation. Narrow screens and reduced-motion mode retain static network geometry without moving traces; high-contrast/forced-colour modes omit the decorative artwork entirely. Missing media-query change support or IntersectionObserver leaves the same static fallback.

IntersectionObserver pauses the CSS animations when the hero is offscreen; the Page Visibility event pauses them when the document is hidden. Neither changes a user's explicit pause preference. Animation play state preserves its current position during these temporary pauses. Observer and preference/visibility listeners are disconnected on unmount. CSS independently disables motion for narrow, reduced-motion and contrast modes, so React timing does not gate those fallbacks. The network is unrelated to the AI backend and also works as a visual enhancement in the static-preview build.

The navy footer includes a discreet **Site design · ScaffoldStudioCo** credit. The crest, natural illustrations, original participant/workshop photographs and downloads were not altered or watermarked.

## Image briefs and portable assets

The café brief called for a natural, documentary-style scene of an older adult and friendly guide sharing a tablet at a café table, with ordinary daylight, believable people and no luminous stars, floating interface or text overlay. The library brief called for older adults learning together around a library table, with a patient facilitator, practical devices and a warm everyday setting. These are creative briefs, not claims that the people or scenes document Digital Guardians events.

The café and library assets are approximately 83 KB and 72 KB respectively. The crest, original workshop photographs, self-hosted font and four unchanged PPTX downloads are served locally under `/media/`. The media folder is approximately 11 MB; training downloads account for most of it. Provenance and font licensing are recorded in [media credits](../media/CREDITS.md).

## Independent engineering

The fixed server-side endpoint is `https://openrouter.ai/api/v1/chat/completions`. The API key never belongs in a browser bundle. Returned JSON is independently checked with Ajv and Zod, followed by bounded output and safety checks. Requests have total deadlines; diagnostics do not retain upstream bodies, submitted text or credentials. Structured output support is provider-dependent, so validation remains necessary. [2]

The default `openrouter/free` router chooses among available compatible free models. Model availability, output quality and latency can vary. [3] During final testing, some provider completions were rejected and the UI correctly showed a local safety checklist or quick guide, not fabricated AI success. The analyzer budget was increased from 900 to 1800 tokens while retaining the same total deadline; reasoning can share this budget with the visible answer. This is a bounded-output improvement, not a guarantee that every free model will respond successfully. [4]

Manus OAuth, runtime plugins, storage proxy, built-in notifications and direct NVIDIA integration were removed. Optional MySQL supports durable registrations and training requests; optional SMTP supports contact and notifications. No live database writes, migrations or SMTP sends were performed. Obsolete seed scripts, including a destructive fixed-date example, were removed without executing them.

## Verification evidence

The release evidence below documents the earlier standalone checkpoint, not a browser or performance measurement of this latest blue/network revision. Final full tests, production/static builds and desktop/mobile screenshots must be rerun for the revised design. The targeted revision checks are recorded separately below.

A fresh export on the public GitHub history installed with `pnpm install --frozen-lockfile`, passed TypeScript and passed **145 default tests**. Production and static-preview builds succeeded. Live checks are excluded from ordinary credential-free CI.

OpenRouter accepted the private credential check. A real structured completion passed. The real application analyzer returned an AI-labelled dangerous assessment for a synthetic gift-card scam in approximately 3 seconds after the budget change. The redesigned browser technology-help flow returned an AI-generated iPhone text-size guide with steps, troubleshooting and a safety reminder. One later free-router technology-help test returned a rejected completion and a labelled fallback; the live suite therefore is an availability check, not a deterministic reliability promise.

Desktop at 1440 × 1000 and mobile at 390 × 844 were visually reviewed. A redundant desktop menu control was corrected. The HTTPS development-preview origin issue was reproduced as HTTP 403 and fixed with an exact-host, development-only exception; strict production and explicit-origin behavior have regression coverage.

A production Node run without AI, database or SMTP credentials served health, guide routes and local media, returned JSON 404 for unknown API paths, and returned correctly labelled no-key safety-check and quick-guide results. The compiled static preview rendered successfully; its analyzer input and submit button were disabled, and browser network entries contained no `/api/` requests. Its hashed assets, four downloads, identical `404.html` fallback and `.nojekyll` marker were checked.

### Latest blue/network revision checks

`pnpm exec vitest run server/designSystem.test.ts` passed **16 tests** and `pnpm check` passed. The design suite checks blue tokens, solid text/action contrast pairs, preserved section order and content, existing accessibility settings, static server rendering, source-level cleanup/fallback guards and the pure animation eligibility policy. The policy test exercises all 255 blocked combinations of its eight gates, plus the eligible state and explicit pause/resume states. These tests do not substitute for browser interaction or observer-lifecycle testing.

WCAG relative-luminance calculations on the declared solid token pairs give body text/background **13.44:1**, secondary text/ice-tinted section **5.60:1**, white/cobalt action **6.47:1**, ice/navy **13.97:1**, and secondary text/navy **10.27:1**. The regression test also checks the primary hover token at or above 4.5:1. These are token calculations, not a comprehensive accessibility assessment of every rendered state.

No browser, Git operation, full build, live AI request or performance profile was run for this revision. No load-time, frame-rate, CPU/GPU, conversion or certification claim is made. Final visual checks should confirm the live background on a wide desktop; keyboard pause/resume; user pause remaining set after scrolling away/back or hiding/showing the tab; static behavior at 900px and below and with reduced motion; and omitted decoration with saved high contrast, increased contrast or forced colours. Production and static-preview builds should both retain the same meaningful hero content and their existing AI availability behavior.

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
