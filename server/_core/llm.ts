import Ajv from "ajv";

export type Role = "system" | "user" | "assistant";
export type TextContent = { type: "text"; text: string };
export type Message = { role: Role; content: string | TextContent[] };
export type JsonSchema = { name: string; schema: Record<string, unknown>; strict?: boolean };
export type OutputSchema = JsonSchema;
export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };
export type InvokeParams = {
  model?: string;
  messages: Message[];
  maxTokens?: number;
  max_tokens?: number;
  maxCompletionTokens?: number;
  max_completion_tokens?: number;
  /** Total deadline, including response body parsing and any retry. */
  timeoutMs?: number;
  /** Defaults to one; at most two transient attempts within the total deadline. */
  maxAttempts?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};
export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: Role; content: string | TextContent[] };
    finish_reason: string | null;
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
};

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_TIMEOUT_MS = 18_000;
const MAX_TIMEOUT_MS = 20_000;
const ajv = new Ajv({ strict: false, allErrors: false, validateFormats: false });
export type LLMFailureCode = "not_configured" | "invalid_request" | "deadline" | "network" | "http" | "upstream" | "invalid_response" | "invalid_output";
/** Never retain the upstream error, body, message, request text, or credentials. */
export class LLMError extends Error {
  constructor(readonly code: LLMFailureCode, readonly status?: number) {
    super(`OpenRouter ${code}${status ? ` (HTTP ${status})` : ""}`);
    this.name = "LLMError";
  }
}
export function safeLLMDiagnostic(error: unknown): string {
  return error instanceof LLMError ? error.message : "OpenRouter invalid_output";
}
const transient = (status: number) => [408, 429, 500, 502, 503, 504].includes(status);
const boundedInteger = (value: number | undefined, fallback: number, maximum: number) =>
  Number.isFinite(value) ? Math.min(maximum, Math.max(1, Math.floor(value!))) : fallback;
function textContent(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(part => part?.type === "text" && typeof part.text === "string" ? part.text : "").join("");
  return "";
}
function retryAfterMs(value: string | null): number {
  if (!value) return 200;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : 200;
}
function responseFormat(params: InvokeParams): ResponseFormat | undefined {
  const explicit = params.responseFormat ?? params.response_format;
  const schema = params.outputSchema ?? params.output_schema;
  return explicit ?? (schema ? { type: "json_schema", json_schema: schema } : undefined);
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) throw new LLMError("not_configured");
  const format = responseFormat(params);
  let validate: ReturnType<typeof ajv.compile> | undefined;
  if (format?.type === "json_schema") {
    if (!format.json_schema?.name || !format.json_schema.schema || typeof format.json_schema.schema !== "object") throw new LLMError("invalid_request");
    try { validate = ajv.compile(format.json_schema.schema); } catch { throw new LLMError("invalid_request"); }
  }
  if (!params.messages?.length) throw new LLMError("invalid_request");
  const model = params.model?.trim() || process.env.OPENROUTER_MODEL?.trim() || "openrouter/free";
  const tokens = params.maxCompletionTokens ?? params.max_completion_tokens ?? params.maxTokens ?? params.max_tokens;
  const payload = {
    model,
    messages: params.messages,
    stream: false,
    provider: { require_parameters: true },
    ...(tokens ? { max_tokens: boundedInteger(tokens, 1200, 4096) } : {}),
    ...(format ? { response_format: format } : {}),
  };
  const timeoutMs = boundedInteger(params.timeoutMs, DEFAULT_TIMEOUT_MS, MAX_TIMEOUT_MS);
  const attempts = boundedInteger(params.maxAttempts, 1, 2);
  const controller = new AbortController();
  const deadline = Date.now() + timeoutMs;
  let timer: ReturnType<typeof setTimeout>;
  const expired = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new LLMError("deadline")); }, timeoutMs);
  });
  const execute = async (): Promise<InvokeResult> => {
    for (let attempt = 0; attempt < attempts; attempt++) {
      if (controller.signal.aborted) throw new LLMError("deadline");
      let failure: LLMError | undefined;
      let delay = 200;
      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
          body: JSON.stringify(payload),
          redirect: "error",
          signal: controller.signal,
        });
        if (!response.ok) {
          // Do not read or log error bodies: they may contain private submitted text.
          void response.body?.cancel().catch(() => {});
          failure = new LLMError("http", response.status);
          if (!transient(response.status)) throw failure;
          delay = retryAfterMs(response.headers.get("retry-after"));
        } else {
          let result: any;
          try { result = await response.json(); } catch { throw new LLMError("invalid_response"); }
          if (result?.error) {
            const status = Number(result.error.code);
            failure = new LLMError("upstream", Number.isInteger(status) && status >= 400 && status <= 599 ? status : undefined);
            if (!failure.status || !transient(failure.status)) throw failure;
          } else {
            const choice = result?.choices?.[0];
            const content = textContent(choice?.message?.content);
            if (!content.trim() || !choice?.message || ["error", "content_filter", "length"].includes(choice.finish_reason) || choice.message.refusal) throw new LLMError("invalid_response");
            if (format && format.type !== "text") {
              let output: unknown;
              try { output = JSON.parse(content); } catch { throw new LLMError("invalid_output"); }
              if (validate && !validate(output)) throw new LLMError("invalid_output");
              if (output === null || typeof output !== "object" || Array.isArray(output) || Object.keys(output).length === 0) throw new LLMError("invalid_output");
            }
            return result as InvokeResult;
          }
        }
      } catch (error) {
        if (controller.signal.aborted) throw new LLMError("deadline");
        if (error instanceof LLMError) throw error;
        failure = new LLMError("network");
      }
      if (attempt + 1 >= attempts) throw failure ?? new LLMError("upstream");
      // Honor Retry-After; if it cannot fit, fail rather than retry early.
      if (Date.now() + delay >= deadline) throw failure ?? new LLMError("deadline");
      await new Promise<void>(resolve => setTimeout(resolve, delay));
    }
    throw new LLMError("upstream");
  };
  try { return await Promise.race([execute(), expired]); }
  finally { clearTimeout(timer!); controller.abort(); }
}
