import { TRPCError } from "@trpc/server";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;

type RequestLike = {
  ip?: string;
  socket?: { remoteAddress?: string | undefined };
};

type RequestBucket = {
  startedAt: number;
  count: number;
};

const requestBuckets = new Map<string, RequestBucket>();

function getClientKey(req: RequestLike): string {
  const candidate = req.ip || req.socket?.remoteAddress || "anonymous";
  return candidate.replace(/^::ffff:/, "").slice(0, 128);
}

function pruneExpiredBuckets(now: number): void {
  Array.from(requestBuckets.entries()).forEach(([key, bucket]) => {
    if (now - bucket.startedAt >= WINDOW_MS) requestBuckets.delete(key);
  });
}

/**
 * Prevent a public endpoint from being used to exhaust model capacity. This stores only an
 * ephemeral network identifier and request count, never the submitted content.
 */
export function enforcePublicAiRateLimit(req: RequestLike): void {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const key = getClientKey(req);
  const bucket = requestBuckets.get(key);

  if (!bucket) {
    requestBuckets.set(key, { startedAt: now, count: 1 });
    return;
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((WINDOW_MS - (now - bucket.startedAt)) / 1000)
    );
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `For everyone’s safety, please wait about ${retryAfterSeconds} seconds before another AI check.`,
    });
  }

  bucket.count += 1;
}

/** Test-only reset; do not use in application code. */
export function resetPublicAiRateLimitForTests(): void {
  requestBuckets.clear();
}

export type PrivacyMinimizationResult = {
  value: string;
  redactionCount: number;
};

const REDACTION_RULES: Array<{ pattern: RegExp; replacement: string }> = [
  {
    pattern: /(password\s*(?:is|:|=)\s*)([^\s,;]+)/gi,
    replacement: "$1[REDACTED]",
  },
  {
    pattern:
      /((?:one[- ]?time|verification|security|access)\s*code\s*(?:is|:|=)?\s*)\b\d{4,10}\b/gi,
    replacement: "$1[REDACTED]",
  },
  {
    pattern: /(\bpin\s*(?:is|:|=)?\s*)\b\d{4,8}\b/gi,
    replacement: "$1[REDACTED]",
  },
  {
    pattern: /\b(?:\d[ -]*?){13,19}\b/g,
    replacement: "[CARD NUMBER REDACTED]",
  },
  {
    pattern: /\b\d{3}[ -]?\d{3}[ -]?\d{3}\b/g,
    replacement: "[SIN REDACTED]",
  },
  {
    pattern: /(authorization:\s*bearer\s+)[a-z0-9._-]+/gi,
    replacement: "$1[REDACTED]",
  },
  {
    pattern: /\bsk-[a-z0-9_-]{16,}\b/gi,
    replacement: "[API KEY REDACTED]",
  },
];

/**
 * Keep scam indicators while removing actual credentials and account secrets before the text
 * reaches an external model provider. The page still lets users see their original local text.
 */
export function minimizeSensitiveInput(input: string): PrivacyMinimizationResult {
  let value = input;
  let redactionCount = 0;

  for (const rule of REDACTION_RULES) {
    const matches = value.match(rule.pattern);
    if (matches) redactionCount += matches.length;
    value = value.replace(rule.pattern, rule.replacement);
  }

  return { value, redactionCount };
}
