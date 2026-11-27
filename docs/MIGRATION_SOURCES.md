# Migration reference sources

Checked on 27 November 2026.

OpenRouter's Chat Completions API uses `response_format.type = json_schema` for structured responses. Endpoint support varies, so the application requires compatible parameters with `provider.require_parameters = true` and independently validates returned data. Strict mode is not a universal guarantee of exact schema compliance. [Structured outputs](https://openrouter.ai/docs/guides/features/structured-outputs)

The default `openrouter/free` router accepts structured-output parameters and selects an available model. Availability, speed, free usage limits and output quality may change. Set `OPENROUTER_MODEL` to a suitable supported model when deploying. All AI requests still use OpenRouter's fixed server-side API endpoint. [Free router](https://openrouter.ai/openrouter/free)

Image search was used for contextual research, not redistribution. The American Senior Communities learning article and licensed stock previews were reference material only; no stock or third-party participant photo was added to this repository. [Contextual reference](https://www.asccare.com/how-lifelong-learning-supports-healthy-aging/)

The supplied Unslop skill is by Damir Sokolovsky, licensed CC BY 4.0. The audit and redesign follow its principle of quiet navigation and deliberate imagery. [Unslop source](https://github.com/heydamir/unslop)

OpenRouter documents that reasoning shares the Chat Completions `max_tokens` budget. Exhausting it can produce `finish_reason: "length"` with an empty visible answer. The analyzer completion budget was increased from 900 to 1800 while retaining its existing total deadline and rejection of incomplete output. Free routing is random within compatible available models, so the project still uses honest local fallbacks rather than promising universal live AI. [Reasoning budgets](https://openrouter.ai/docs/guides/best-practices/reasoning-tokens) · [Free routing behavior](https://openrouter.ai/docs/guides/routing/routers/free-router)
