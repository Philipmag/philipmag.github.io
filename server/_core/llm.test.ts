import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { invokeLLM, safeLLMDiagnostic } from "./llm";
const messages = [{ role: "user" as const, content: "Hello" }];
function completion(content: unknown = "Hello", finish_reason = "stop") {
  return new Response(JSON.stringify({ id: "test", created: 1, model: "test", choices: [{ index: 0, message: { role: "assistant", content }, finish_reason }] }), { status: 200 });
}
const schema = { name: "test", strict: true, schema: { type: "object", properties: { answer: { type: "string", minLength: 2 } }, required: ["answer"], additionalProperties: false } };
describe("OpenRouter-only HTTP client", () => {
  beforeEach(() => {
    vi.stubEnv("OPENROUTER_API_KEY", "fake-test-key");
    vi.stubEnv("OPENROUTER_MODEL", "");
  });
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });
  it("uses the fixed endpoint, default free model, strict schema, and parameter routing", async () => {
    vi.stubEnv("OPENROUTER_API_URL", "https://evil.invalid");
    const fetchMock = vi.fn().mockResolvedValue(completion('{"answer":"yes"}'));
    vi.stubGlobal("fetch", fetchMock);
    await invokeLLM({ messages, outputSchema: schema });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(options.redirect).toBe("error");
    expect(JSON.parse(options.body)).toMatchObject({ model: "openrouter/free", provider: { require_parameters: true }, response_format: { type: "json_schema", json_schema: schema } });
  });
  it("uses the configured model without legacy defaults", async () => {
    vi.stubEnv("OPENROUTER_MODEL", "openai/example");
    const fetchMock = vi.fn().mockResolvedValue(completion()); vi.stubGlobal("fetch", fetchMock);
    await invokeLLM({ messages });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).model).toBe("openai/example");
  });
  it("does not make a network call without OpenRouter credentials", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages })).rejects.toThrow("not_configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("uses only one attempt by default even on transient failures", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("private", { status: 503 })); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages })).rejects.toThrow("HTTP 503");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it.each([408, 429, 502, 503])("allows an explicitly bounded retry on HTTP %s", async status => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("private", { status, headers: { "retry-after": "0" } })).mockResolvedValueOnce(completion("recovered"));
    vi.stubGlobal("fetch", fetchMock);
    expect((await invokeLLM({ messages, maxAttempts: 2 })).choices[0].message.content).toBe("recovered");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("caps attempts at two", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("private", { status: 429, headers: { "retry-after": "0" } })); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages, maxAttempts: 99 })).rejects.toThrow("HTTP 429");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it.each([400, 401, 402, 403])("does not retry HTTP %s or expose upstream diagnostics", async status => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("fake-test-key Password: private", { status })); vi.stubGlobal("fetch", fetchMock);
    try { await invokeLLM({ messages, maxAttempts: 2 }); throw new Error("unexpected success"); }
    catch (error) { expect(safeLLMDiagnostic(error)).toBe(`OpenRouter http (HTTP ${status})`); }
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it("will not retry before Retry-After or exceed the total deadline", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("private", { status: 429, headers: { "retry-after": "60" } })); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages, timeoutMs: 30, maxAttempts: 2 })).rejects.toThrow("HTTP 429");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it("bounds hung fetch and aborts its signal", async () => {
    const fetchMock = vi.fn().mockImplementation(() => new Promise(() => {})); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages, timeoutMs: 20, maxAttempts: 2 })).rejects.toThrow("deadline");
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });
  it("bounds hung response body parsing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: () => new Promise(() => {}) }));
    await expect(invokeLLM({ messages, timeoutMs: 20 })).rejects.toThrow("deadline");
  });
  it("sanitizes network exceptions and retries at most once", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("fake-test-key private prompt")); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages, maxAttempts: 2 })).rejects.toThrow("OpenRouter network");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(safeLLMDiagnostic(new Error("raw secret"))).not.toContain("secret");
  });
  it("recognizes transient errors inside HTTP 200", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ error: { code: 503, message: "private" } }))).mockResolvedValueOnce(completion()); vi.stubGlobal("fetch", fetchMock);
    await invokeLLM({ messages, maxAttempts: 2 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it.each([{}, { choices: [] }, { choices: [{ message: {} }] }, { choices: [{ message: { content: "  " } }] }, { error: { code: 401, message: "private" } }])("rejects missing, empty, or error completion envelopes", async body => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body))); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages, maxAttempts: 2 })).rejects.toThrow("OpenRouter");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it("rejects malformed upstream JSON without retry", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("not json")); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages, maxAttempts: 2 })).rejects.toThrow("invalid_response");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it.each(["{}", "null", "[]", "not json", '{"answer":""}', '{"answer":2}', '{"answer":"yes","extra":true}'])("validates JSON schema output instead of accepting %s", async content => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(completion(content)));
    await expect(invokeLLM({ messages, outputSchema: schema })).rejects.toThrow("invalid_output");
  });
  it("rejects invalid schemas before network access", async () => {
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    await expect(invokeLLM({ messages, outputSchema: { name: "bad", schema: { type: "invalid" } } })).rejects.toThrow("invalid_request");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each(["length", "content_filter", "error"])("rejects truncated or refused output (%s)", async reason => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(completion("some text", reason)));
    await expect(invokeLLM({ messages })).rejects.toThrow("invalid_response");
  });
});
