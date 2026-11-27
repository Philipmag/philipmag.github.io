# Security and privacy

[Back to README](../README.md) · [Standalone setup and architecture](STANDALONE.md)

Digital Guardians offers educational guidance, not identity verification, fraud adjudication, or a guarantee that a message is safe. The controls below describe the current application, not a security certification, complete prompt-injection defense, or promise of future availability. A public deployment still needs host-level HTTPS, monitoring, secret management, and an appropriate abuse-control strategy.

## What data goes where

**AI tools:** the browser sends the submitted text to this app's Node server. The server applies best-effort redaction before sending it to OpenRouter, so the original text has already reached the app server when redaction happens. The AI endpoints do not persist messages or questions in MySQL, and their application diagnostics avoid logging submitted text, credentials, upstream bodies, or raw provider errors. Text still exists temporarily in browser and server memory. The rate limiter retains an ephemeral network identifier and request count, not the message.

When live AI is configured, minimized text and the system prompt are processed by **OpenRouter and an upstream model provider**. Their handling is separate from this application's non-persistence behavior. Provider retention and training policies can differ, particularly with automatic routing. Review [OpenRouter's privacy policy](https://openrouter.ai/privacy), [provider logging guidance](https://openrouter.ai/docs/guides/privacy/provider-logging), and the account's privacy settings. The application does not enforce or promise upstream zero retention, a particular processing region, or exclusion from provider training.

**Local no-provider mode:** when no key is configured, the Node endpoints do not call OpenRouter and return explicitly labelled local guidance. That is not an AI assessment and does not make the browser fully offline. If live AI is attempted and later falls back, text may already have been processed upstream; a fallback label is not proof that no external request occurred.

**Contact:** messages and reply addresses are sent through the configured SMTP service and are not stored in the application database. Contact success requires SMTP acceptance, not merely an attempted send. Missing configuration or delivery failure produces an explicit error stating that the message was not delivered or saved. SMTP acceptance does not prove final inbox receipt, and the mail provider or recipient may retain the message.

**Calendar and training:** MySQL stores event signups and training requests, including submitted contact details and optional notes. An optional SMTP notification may also send those details to the configured recipient. Success depends on the database write, not notification delivery. If write acknowledgement is uncertain, the app asks the user to contact the program before resubmitting. Operators need a retention, access, backup, and deletion policy for these records; the AI endpoint's non-persistence claim does not apply to registration data.

**Browser state and hosting:** reading preferences use local storage; quiz answers are held in React memory rather than a user account. Copying or sharing results is user-initiated and can disclose them to another app or recipient. Hosting platforms, reverse proxies, and email/database providers may independently retain access logs or data. Avoid configuring body logging or including sensitive query strings. “No AI messages persisted by the endpoint” is not “no data anywhere.”

Before pasting, remove names, addresses, passwords, account numbers, banking details, government IDs, and verification codes. Do not submit information you would not want a third party to process. Redaction is a fallback safeguard, not a reason to paste secrets.

## AI request and response safeguards

The two public mutations validate input with Zod. Message analysis accepts at most 10,000 characters; technology questions accept at most 5,000. The API accepts JSON with a 64 KB body limit. These bounds reduce accidental oversized submissions but are not complete denial-of-service protection.

The server-only OpenRouter client uses the fixed HTTPS endpoint `https://openrouter.ai/api/v1/chat/completions`; callers cannot supply an arbitrary upstream URL, and redirects are rejected. The browser never receives the OpenRouter key. `OPENROUTER_MODEL` defaults to `openrouter/free`; changing the model changes provider behavior and should be reviewed for compatibility and privacy.

Requests ask for strict structured JSON and set `provider.require_parameters=true`. Ajv checks the requested schema; application-level Zod validation then rejects missing, malformed, empty, or unexpected fields and bounds useful response content. Additional checks reject recognizable secret disclosures, unsafe instructions, unsupported device/account/identity-verification claims, and an AI “safe” verdict that conflicts with strong local scam indicators.

The prompt treats pasted material as untrusted evidence, not instructions. Input minimization recognizes some explicit passwords, verification codes, PINs, card-number patterns, Canadian SIN patterns, bearer tokens, and API-key patterns. It can miss secrets, misidentify ordinary numbers, and fail on alternate wording or formats. Output pattern checks have similar limitations. **Prompt instructions, JSON validation, redaction, and regex checks are defense in depth, not a complete semantic-safety guarantee.** A schema-valid answer may still be wrong, misleading, or unsafe.

Live failures and rejected responses switch to labelled local precautionary guidance or a quick guide; they do not manufacture a successful AI answer. Model-reported confidence is not calibrated accuracy. Even a “safe” label cannot authenticate a sender, account, organization, link, or request for money. Verify independently through a trusted contact method.

The application does not automatically visit, fetch, click, or execute links from a submitted message. Results render as text, not trusted model HTML. The helper does not access accounts, install software, change settings, or perform actions on the user's device. Any copy, share, download, or navigation action should remain an explicit user choice.

## Deadlines, rate limiting, and abuse boundaries

The OpenRouter transport has a total default deadline of 18 seconds, capped at 20 seconds, covering attempts and response parsing. Technology help uses 12 seconds. Public AI calls use one attempt; explicitly configured transport retries are capped at two within the same deadline, and `Retry-After` is respected only when it fits. Failures produce sanitized diagnostic codes rather than retaining upstream bodies or raw exceptions. SMTP has a separate 12-second total bound.

Both AI tools share an **in-memory limit of eight requests per network identifier per ten-minute window, per app process**, with a cap of 10,000 tracked clients. The limit also applies when the tools return local guidance. It reduces casual capacity exhaustion; it is not a distributed quota, user identity check, or protection against changing IP addresses. Shared networks can group unrelated users, restart clears counters, and each replica has its own buckets.

A single app process is a sensible initial deployment. Before multiple instances or workers, add a shared rate limiter and review host-level traffic controls, request concurrency, provider budgets, and SMTP/form spam protection. The existing eight-request AI limiter does **not** cover contact or registration submissions. Origin checks are not authentication and do not stop scripts or bots that make direct HTTP requests.

## Deployment configuration

Keep `OPENROUTER_API_KEY`, `DATABASE_URL`, and SMTP credentials in the server's private environment or secret manager. Never commit `.env`, include keys in examples, expose them through `VITE_*`, bake them into a Docker image, or provide them to a static Pages build. `config/env.example` is a secret-free template. Use limited-budget provider keys and separate development mailboxes/databases; revoke and rotate any exposed credentials promptly.

The full application is same-origin: the Node server serves both UI and `/api/trpc`. Set **`APP_ORIGIN` to the exact public HTTPS origin behind a proxy** so origin validation does not depend on ambiguous forwarded protocol/host information. Cross-site browser requests and mismatched origins are rejected, and POST requests require JSON. These checks limit browser-origin abuse but are not a replacement for authentication or comprehensive CSRF/abuse controls.

`TRUST_PROXY=1` configures a one-hop proxy trust setting. Enable it only behind a known trusted proxy, with network controls that prevent direct untrusted access and with the forwarding chain reviewed. Do not blindly trust `X-Forwarded-For`. Incorrect trust can let an attacker manipulate the network identifier used for rate limiting; leaving it unset behind a proxy can group all visitors under the proxy's address.

The Express app disables `X-Powered-By` and sets content-type sniffing, referrer, framing, and permissions headers. API responses are `no-store`; unknown API paths return JSON 404. The health endpoint returns only `{"ok":true}`, not configuration or credential details. HTTPS termination, database connection encryption, proxy behavior, and any further deployment-specific content-security policy remain operator responsibilities; do not infer them from these application headers.

The public GitHub Pages build is a **static preview** with `VITE_STATIC_PREVIEW=1`. AI and form submissions are disabled with clear explanations and direct email/phone alternatives. Pages does not host Node or conceal API keys, and this project has no `VITE_API_URL` bridge to an independent API. Deploy the full Node application on a suitable independent host for live functionality.

The Render Blueprint and Docker path are unprovisioned options, not deployed infrastructure. The existing `www.digitalguards.ca` site remains on Manus until an explicitly authorized publish or domain migration. Runtime independence in this source does not claim that current hosting has already changed or that development had no Manus involvement.

## Database and mail integrity limits

Drizzle uses the current three-table MySQL schema: `events`, `eventSignups`, and `trainingRequests`. Application procedures validate input and use ORM queries, but the schema alone is not a complete integrity or authorization model. No account or database lookup is needed for AI or guides.

**Known event-capacity race:** the current registration flow reads capacity and signup count before inserting without transactional locking. Two concurrent requests can both pass the check and exceed capacity. Resolve this with transactional locking or another atomic reservation strategy before high-volume registration. Review duplicate-submission and idempotency handling as part of that work.

`pnpm db:push` applies the current schema through `drizzle-kit push`; it must not be run blindly against an existing managed database. Historical migrations contain unused legacy account history, and the app does not assume those historical rows were removed. Back up existing data, review proposed changes and any drop prompts, and obtain the database owner's approval for a non-destructive change plan.

Mail header values are sanitized, SMTP requires TLS, and Nodemailer file/URL access is disabled. These controls do not establish sender reputation, spam prevention, or final inbox delivery. Database writes remain durable independently of optional notification acceptance; operators should monitor stored requests rather than treating an email inbox as the sole registration record.

## Testing and reporting

Run `pnpm check`, `pnpm test`, and `pnpm build` for the checkout being assessed. Default tests mock integrations and require no provider credentials. They cover request/response validation, redaction, output rejection, deadlines, rate limits, local fallback, API boundaries, and honest database/mail failures. They are not a penetration test, load test, privacy audit, or proof that all prompt attacks are blocked.

Live OpenRouter tests require both a private server-side key and explicit opt-in:

```bash
RUN_LIVE_OPENROUTER_TESTS=1 pnpm test:live
```

Do not enable that flag in ordinary CI. Use synthetic input and a limited-budget key; upstream success at one moment does not promise future reliability. No live SMTP delivery or database mutation is authorized merely by running the default suite or the OpenRouter tests.

For a suspected vulnerability, contact [info@digitalguards.ca](mailto:info@digitalguards.ca) with a minimal, sanitized reproduction and the affected commit or route. Do not publish credentials, real scam submissions, participant data, or exploit details in a public issue. If a key may have leaked, revoke it before sharing evidence. No guaranteed response time is asserted.
