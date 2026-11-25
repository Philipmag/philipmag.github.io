import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { invokeLLM } from "./llm";

const originalForgeUrl = process.env.BUILT_IN_FORGE_API_URL;
const originalForgeKey = process.env.BUILT_IN_FORGE_API_KEY;
const originalNvidiaKey = process.env.NVIDIA_API_KEY;
const originalNvidiaModel = process.env.NVIDIA_MODEL;

function completionResponse(content = "Hello") {
  return new Response(
    JSON.stringify({
      id: "test-response",
      created: Date.now(),
      model: "gpt-5-mini",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content },
          finish_reason: "stop",
        },
      ],
    }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
}

describe("invokeLLM", () => {
  beforeEach(() => {
    process.env.BUILT_IN_FORGE_API_URL = "https://forge.test";
    process.env.BUILT_IN_FORGE_API_KEY = "test-key";
    delete process.env.NVIDIA_API_KEY;
    delete process.env.NVIDIA_MODEL;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalForgeUrl === undefined) {
      delete process.env.BUILT_IN_FORGE_API_URL;
    } else {
      process.env.BUILT_IN_FORGE_API_URL = originalForgeUrl;
    }
    if (originalForgeKey === undefined) {
      delete process.env.BUILT_IN_FORGE_API_KEY;
    } else {
      process.env.BUILT_IN_FORGE_API_KEY = originalForgeKey;
    }
    if (originalNvidiaKey === undefined) {
      delete process.env.NVIDIA_API_KEY;
    } else {
      process.env.NVIDIA_API_KEY = originalNvidiaKey;
    }
    if (originalNvidiaModel === undefined) {
      delete process.env.NVIDIA_MODEL;
    } else {
      process.env.NVIDIA_MODEL = originalNvidiaModel;
    }
  });

  it("retries a transient provider response before returning a completion", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("busy", { status: 503 }))
      .mockResolvedValueOnce(completionResponse("Recovered response"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await invokeLLM({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: "Hello" }],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://forge.test/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ authorization: "Bearer test-key" }),
      })
    );
    expect(result.choices[0].message.content).toBe("Recovered response");
  });

  it("does not retry a non-transient credential error", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ code: 16, message: "there's an issue with your API key" }), {
        status: 401,
        statusText: "Unauthorized",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      invokeLLM({
        model: "gpt-5-mini",
        messages: [{ role: "user", content: "Hello" }],
      })
    ).rejects.toThrow("401 Unauthorized");

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("uses NVIDIA NIM as a server-side fallback when the primary provider is unavailable", async () => {
    process.env.NVIDIA_API_KEY = "nvidia-test-key";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("primary unavailable", {
          status: 503,
          statusText: "Service Unavailable",
        })
      )
      .mockResolvedValueOnce(
        new Response("primary unavailable", {
          status: 503,
          statusText: "Service Unavailable",
        })
      )
      .mockResolvedValueOnce(
        new Response("primary unavailable", {
          status: 503,
          statusText: "Service Unavailable",
        })
      )
      .mockResolvedValueOnce(completionResponse("NVIDIA fallback response"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await invokeLLM({
      model: "gpt-5-mini",
      fallbackModel: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [{ role: "user", content: "Return JSON" }],
      outputSchema: {
        name: "test_response",
        strict: true,
        schema: { type: "object", properties: {}, additionalProperties: false },
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls[3][0]).toBe(
      "https://integrate.api.nvidia.com/v1/chat/completions"
    );
    expect(fetchMock.mock.calls[3][1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({ authorization: "Bearer nvidia-test-key" }),
      })
    );
    expect(JSON.parse(fetchMock.mock.calls[3][1].body).response_format).toEqual({
      type: "json_object",
    });
    expect(result.choices[0].message.content).toBe("NVIDIA fallback response");
  });

  it("can move to the backup provider after one bounded primary attempt", async () => {
    process.env.NVIDIA_API_KEY = "nvidia-test-key";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("busy", { status: 503 }))
      .mockResolvedValueOnce(completionResponse("Fast fallback response"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await invokeLLM({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: "Hello" }],
      maxAttempts: 1,
      timeoutMs: 12_000,
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://integrate.api.nvidia.com/v1/chat/completions"
    );
    expect(result.choices[0].message.content).toBe("Fast fallback response");
  });
});
