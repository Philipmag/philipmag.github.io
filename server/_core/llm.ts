import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4" ;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  model?: string;
  /** Optional model to use only when the primary provider is unavailable. */
  fallbackModel?: string;
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  maxCompletionTokens?: number;
  max_completion_tokens?: number;
  /** Optional per-provider deadline in milliseconds, capped by the global safety limit. */
  timeoutMs?: number;
  /** Optional per-provider attempt count, capped by the global resilience limit. */
  maxAttempts?: number;
  reasoning?: { effort: "minimal" | "low" | "medium" | "high" };
  thinking?: Record<string, unknown>;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

const REQUEST_TIMEOUT_MS = 25_000;
const MAX_REQUEST_ATTEMPTS = 3;

const getForgeApiUrl = () =>
  process.env.BUILT_IN_FORGE_API_URL ?? ENV.forgeApiUrl;

const getForgeApiKey = () =>
  process.env.BUILT_IN_FORGE_API_KEY ?? ENV.forgeApiKey;

const getNvidiaApiKey = () => process.env.NVIDIA_API_KEY?.trim();

const resolveForgeApiUrl = () => {
  const forgeApiUrl = getForgeApiUrl();
  return forgeApiUrl && forgeApiUrl.trim().length > 0
    ? `${forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
    : "https://forge.manus.im/v1/chat/completions";
};

const NVIDIA_CHAT_COMPLETIONS_URL =
  "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_NVIDIA_MODEL = "nvidia/nemotron-3.5-bolt-e4b";

const isRetryableStatus = (status: number) =>
  status === 408 || status === 409 || status === 429 || status >= 500;

const isRetryableProxyError = (error: {
  message?: string;
  code?: string;
}) => {
  const detail = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();
  return /rate.?limit|timeout|temporar|unavailable|overload|try again/.test(detail);
};

const retryDelay = (attempt: number) => 300 * 2 ** attempt;

const wait = (milliseconds: number) =>
  new Promise<void>(resolve => setTimeout(resolve, milliseconds));

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

class LLMProviderError extends Error {
  constructor(
    message: string,
    readonly provider: "manus" | "nvidia",
    readonly retryable: boolean
  ) {
    super(message);
    this.name = "LLMProviderError";
  }
}

type ProviderConfig = {
  name: "manus" | "nvidia";
  apiUrl: string;
  apiKey: string;
  model: string;
  /** NVIDIA's OpenAI-compatible endpoint supports JSON mode but not every strict schema feature. */
  forceJsonObject: boolean;
};

function getProviderConfigs(params: InvokeParams): ProviderConfig[] {
  const providers: ProviderConfig[] = [];
  const forgeApiKey = getForgeApiKey();
  const selectedModel = params.model ?? "gpt-5-mini";

  if (forgeApiKey) {
    providers.push({
      name: "manus",
      apiUrl: resolveForgeApiUrl(),
      apiKey: forgeApiKey,
      model: selectedModel,
      forceJsonObject: false,
    });
  }

  const nvidiaApiKey = getNvidiaApiKey();
  const nvidiaModel =
    params.fallbackModel ??
    process.env.NVIDIA_MODEL?.trim() ??
    DEFAULT_NVIDIA_MODEL;
  if (nvidiaApiKey && nvidiaModel) {
    providers.push({
      name: "nvidia",
      apiUrl: NVIDIA_CHAT_COMPLETIONS_URL,
      apiKey: nvidiaApiKey,
      model: nvidiaModel,
      forceJsonObject: true,
    });
  }

  if (providers.length === 0) {
    throw new Error("No AI provider credentials are configured");
  }

  return providers;
}

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

function buildPayload(
  params: InvokeParams,
  provider: ProviderConfig
): Record<string, unknown> {
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    maxTokens,
    max_tokens,
    maxCompletionTokens,
    max_completion_tokens,
    reasoning,
    thinking,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
  } = params;

  const payload: Record<string, unknown> = {
    model: provider.model,
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  const requestedTokenLimit =
    maxCompletionTokens ??
    max_completion_tokens ??
    maxTokens ??
    max_tokens;

  if (requestedTokenLimit) {
    if (provider.name === "manus" && provider.model.startsWith("gpt-")) {
      payload.max_completion_tokens = requestedTokenLimit;
    } else {
      payload.max_tokens = requestedTokenLimit;
    }
  }

  if (reasoning && provider.name === "manus") {
    payload.reasoning = reasoning;
  }

  if (thinking && provider.name === "manus") {
    payload.thinking = thinking;
  }

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format =
      provider.forceJsonObject && normalizedResponseFormat.type === "json_schema"
        ? { type: "json_object" }
        : normalizedResponseFormat;
  }

  return payload;
}

async function invokeProvider(
  params: InvokeParams,
  provider: ProviderConfig
): Promise<InvokeResult> {
  const payload = buildPayload(params, provider);
  const timeoutMs = Math.min(
    REQUEST_TIMEOUT_MS,
    Math.max(1_000, params.timeoutMs ?? REQUEST_TIMEOUT_MS)
  );
  const maxAttempts = Math.min(
    MAX_REQUEST_ATTEMPTS,
    Math.max(1, params.maxAttempts ?? MAX_REQUEST_ATTEMPTS)
  );

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    let response: Response;

    try {
      response = await fetch(provider.apiUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (attempt < maxAttempts - 1) {
        await wait(retryDelay(attempt));
        continue;
      }
      throw new LLMProviderError(
        `${provider.name} request failed after ${maxAttempts} attempts: ${errorMessage(error)}`,
        provider.name,
        true
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      if (isRetryableStatus(response.status) && attempt < maxAttempts - 1) {
        await wait(retryDelay(attempt));
        continue;
      }
      throw new LLMProviderError(
        `${provider.name} invoke failed: ${response.status} ${response.statusText} – ${errorText}`,
        provider.name,
        isRetryableStatus(response.status)
      );
    }

    let result: InvokeResult & { error?: { message?: string; code?: string } };
    try {
      result = (await response.json()) as InvokeResult & {
        error?: { message?: string; code?: string };
      };
    } catch (error) {
      if (attempt < maxAttempts - 1) {
        await wait(retryDelay(attempt));
        continue;
      }
      throw new LLMProviderError(
        `${provider.name} returned an invalid response: ${errorMessage(error)}`,
        provider.name,
        true
      );
    }

    if (result.error) {
      if (isRetryableProxyError(result.error) && attempt < maxAttempts - 1) {
        await wait(retryDelay(attempt));
        continue;
      }
      throw new LLMProviderError(
        `${provider.name} invoke failed: ${result.error.code ?? "proxy_error"} – ${result.error.message ?? "Unknown proxy error"}`,
        provider.name,
        isRetryableProxyError(result.error)
      );
    }

    return result;
  }

  throw new LLMProviderError(
    `${provider.name} request exhausted without a response`,
    provider.name,
    true
  );
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const providers = getProviderConfigs(params);
  let lastError: unknown;

  for (const provider of providers) {
    try {
      return await invokeProvider(params, provider);
    } catch (error) {
      lastError = error;
      // Never retry a rejected credential on the same provider, but continue to an
      // independently configured provider so public safety guidance remains available.
      if (error instanceof LLMProviderError && !error.retryable) continue;
    }
  }

  throw new Error(
    `All configured AI providers are unavailable: ${errorMessage(lastError)}`
  );
}
