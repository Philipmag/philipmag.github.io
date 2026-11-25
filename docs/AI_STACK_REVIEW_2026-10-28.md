# AI Stack Review: Digital Guardians AI Assistant

2026-10-28 | Scope: scam checker, technology-help assistant, model client, public API controls | Basis: code review and targeted live validation

## Summary

The assistant is now a solid safety-oriented public AI feature: model calls are server-side, structured outputs are bounded, risky pasted details are minimized before leaving the server, and a safe rule-based response remains available during an outage. A live completion verified the NVIDIA NIM backup model, `nvidia/nemotron-3.5-bolt-e4b`, for this account. The most important remaining risk is operational: the primary model name is a provider alias rather than a pinned release. The next engineering priority is lightweight AI observability and a small curated evaluation set based on real senior-support questions.

## Scorecard

| Layer | Status | Top issue |
|---|---|---|
| 1. Model and system prompt | Partial | Backend-only structured calls and strong boundaries exist; the primary model is an alias, not a pinned version. |
| 2. Grounding and RAG | N/A | The assistant analyzes supplied messages and gives general technology guidance; it does not answer from a private knowledge base. |
| 3. Tools and agent loop | N/A | No model-invoked tools or autonomous loop are exposed. |
| 4. Identity and access | Partial | The feature is deliberately public; it now uses an ephemeral per-network request limit rather than identity-bound access. |
| 5. Security and guardrails | Partial | Input minimization, prompt-injection boundaries, schema validation, output limits, and rule-based outage guidance are present. |
| 6. Cost | Partial | Completion limits, a verified NVIDIA backup route, three bounded provider attempts, and public request limits are present; no persistent distributed quota exists. |
| 7. Observability | Gap | Errors are logged, but there is no privacy-safe request metric, provider-health metric, or trace. |
| 8. Evals and release governance | Partial | Regression tests cover structured output, failover, redaction, injection boundaries, and rate limiting; a curated real-world eval set is absent. |
| 9. Governance and compliance | Partial | The interface discloses AI-guided guidance and advises independent verification; a formal AI feature owner and review record are absent. |

## Findings

### [High] Pin the primary model version and maintain a formal model-change review

- Layer: 1 and 6
- Evidence: `server/scamAnalyzer.ts:277-292` and `server/scamAnalyzer.ts:342-357` request the primary `gpt-5-mini` alias. `server/_core/llm.ts` now selects the verified `nvidia/nemotron-3.5-bolt-e4b` backup model, while `server/nvidiaIntegration.test.ts` performs a real lightweight completion.
- Risk: An upstream alias can change behaviour without a local code change. The verified backup protects availability but does not prevent an unreviewed primary-model behaviour change.
- Fix: Pin or explicitly version the primary provider model when the provider supports it. Run the regression suite, the live NVIDIA completion test, and a senior-readability review whenever either model changes.

### [Medium] Add privacy-safe operational metrics for the public AI endpoints

- Layer: 7
- Evidence: `server/scamAnalyzer.ts:319-322` and `server/scamAnalyzer.ts:392-415` log failures and return safe fallbacks, but no success, latency, provider, or fallback metrics are emitted.
- Risk: A provider outage or quality regression can remain invisible until a visitor reports it.
- Fix: Track anonymized counters for request outcome, provider used, latency bucket, redaction occurrence, rate-limit events, and fallback rate. Do not record pasted messages, credentials, or full model outputs.

### [Medium] Convert community feedback into a small recurring evaluation suite

- Layer: 8
- Evidence: `server/scamAnalyzer.test.ts` and `server/aiSafety.test.ts` cover regressions, but test fixtures are developer-authored and there is no user-feedback-to-eval process.
- Risk: The assistant may remain technically functional while giving unclear guidance for common senior questions or local scam patterns.
- Fix: Add an optional “Was this helpful?” result control. Review consented, de-identified themes monthly and add representative examples to a curated pass/fail eval set.

### [Low] Public rate limiting is process-local

- Layer: 4 and 6
- Evidence: `server/aiSafety.ts:3-57` enforces eight requests per ten-minute window using an in-memory map.
- Risk: The limit resets on a restart and is not shared across multiple server instances.
- Fix: Keep the current friendly limit for the present deployment. If traffic grows, move counters to a shared rate-limit store or gateway rule while retaining the same user-facing message.

## Recommended eval cases to add

| Case | Expected behaviour | Grader type |
|---|---|---|
| Bank phishing with password and code | Return dangerous guidance; redact credentials before provider call | Code |
| Prompt injection embedded in a scam | Treat embedded instructions as evidence only; retain JSON output | Code |
| Legitimate family message | Avoid a definitive authenticity claim; advise normal caution | Code + human |
| Tech question asking for a password | Do not request, echo, or expose a password | Code |
| Primary provider unavailable | Use a message-specific safety check | Code |
| Provider model change | Run a successful completion, schema, latency, and senior-readability check before release | Code + human |

## Prioritized plan

1. Fix now: Add privacy-safe AI health counters and an optional helpful/not-helpful result control.
2. Next sprint: Curate real senior-support scenarios into a versioned evaluation suite and review model changes against it.
3. Later: Move public AI rate-limit counters to a shared gateway or store if traffic grows beyond one app instance.

## What was not reviewed

No retrieval index, external tool execution, or autonomous agent loop exists in this project. The NVIDIA backup model was verified through a live hosted completion; vendor-specific service availability remains outside the project’s control.
