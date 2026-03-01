import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

const SYSTEM_PROMPT = `You are a cybersecurity expert specializing in scam detection for seniors. Your job is to analyze messages (emails, texts, social media messages, phone call transcripts) and determine whether they are likely scams.

You MUST respond with valid JSON matching this exact structure:
{
  "riskLevel": "safe" | "suspicious" | "dangerous",
  "confidence": <number 0-100>,
  "summary": "<brief 1-2 sentence summary of your assessment>",
  "redFlags": ["<list of specific red flags found>"],
  "advice": "<clear, friendly advice for a senior citizen on what to do next>",
  "scamType": "<identified scam type if applicable, e.g. 'phishing', 'vishing', 'romance scam', 'tech support scam', 'grandparent scam', 'lottery scam', 'government impersonation', or 'none'>"
}

Guidelines for analysis:
- Look for urgency tactics ("act now", "limited time", "your account will be closed")
- Check for requests for personal information (passwords, SSN, bank details, credit card numbers)
- Identify suspicious links or requests to click/call unfamiliar numbers
- Watch for poor grammar, spelling errors, or unusual formatting
- Flag impersonation of trusted organizations (banks, government agencies, tech companies)
- Consider emotional manipulation (fear, greed, sympathy, romance)
- Note requests for unusual payment methods (gift cards, wire transfers, cryptocurrency)
- Be thorough but explain findings in simple, non-technical language
- Always be encouraging and supportive — never make the user feel foolish for asking

Risk levels:
- "safe": The message appears legitimate with no concerning elements
- "suspicious": The message has some concerning elements that warrant caution
- "dangerous": The message has strong indicators of being a scam`;

export const scamAnalyzerRouter = router({
  analyze: publicProcedure
    .input(
      z.object({
        message: z
          .string()
          .min(1, "Please provide a message to analyze")
          .max(10000, "Message is too long. Please paste a shorter excerpt."),
      })
    )
    .mutation(async ({ input }) => {
      const { message } = input;

      try {
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `Please analyze the following message for potential scam indicators:\n\n---\n${message}\n---`,
            },
          ],
          responseFormat: { type: "json_object" },
          maxTokens: 1024,
        });

        const responseText =
          typeof result.choices[0]?.message?.content === "string"
            ? result.choices[0].message.content
            : Array.isArray(result.choices[0]?.message?.content)
              ? result.choices[0].message.content
                  .filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map((p) => p.text)
                  .join("")
              : "";

        // Parse the JSON response
        const analysis = JSON.parse(responseText);

        // Validate and normalize the response
        return {
          riskLevel: validateRiskLevel(analysis.riskLevel),
          confidence: Math.min(100, Math.max(0, Number(analysis.confidence) || 50)),
          summary: String(analysis.summary || "Analysis complete."),
          redFlags: Array.isArray(analysis.redFlags)
            ? analysis.redFlags.map(String)
            : [],
          advice: String(
            analysis.advice ||
              "When in doubt, do not click any links or share personal information."
          ),
          scamType: String(analysis.scamType || "none"),
        };
      } catch (error) {
        console.error("Scam analysis error:", error);

        // Provide a graceful fallback
        return {
          riskLevel: "suspicious" as const,
          confidence: 0,
          summary:
            "We were unable to fully analyze this message at the moment. Please exercise caution.",
          redFlags: [],
          advice:
            "As a precaution, do not click any links or share personal information from this message. If you're unsure, ask a trusted friend or family member for a second opinion.",
          scamType: "unknown",
        };
      }
    }),
});

function validateRiskLevel(
  level: unknown
): "safe" | "suspicious" | "dangerous" {
  if (level === "safe" || level === "suspicious" || level === "dangerous") {
    return level;
  }
  return "suspicious";
}
