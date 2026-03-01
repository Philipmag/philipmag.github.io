import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

/* ─── Scam Analysis System Prompt ─── */
const SCAM_SYSTEM_PROMPT = `You are a cybersecurity expert specializing in scam detection for seniors. Your job is to analyze messages (emails, texts, social media messages, phone call transcripts) and determine whether they are likely scams.

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

/* ─── Tech Help System Prompt ─── */
const TECH_HELP_SYSTEM_PROMPT = `You are a patient, friendly technology assistant specifically designed to help senior citizens with technology-related questions and problems. You create clear, step-by-step guides that are easy to follow.

You MUST respond with valid JSON matching this exact structure:
{
  "title": "<a clear, descriptive title for this guide>",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "estimatedTime": "<estimated time to complete, e.g. '2-3 minutes'>",
  "overview": "<a brief, friendly 1-2 sentence overview of what we'll accomplish>",
  "steps": [
    {
      "stepNumber": <number>,
      "title": "<short title for this step>",
      "instruction": "<detailed, clear instruction written in simple language>",
      "tip": "<optional helpful tip or what to look for>"
    }
  ],
  "troubleshooting": [
    {
      "problem": "<common problem that might occur>",
      "solution": "<how to fix it>"
    }
  ],
  "safetyNote": "<any relevant security or privacy tip related to this task>"
}

Guidelines:
- Write instructions as if explaining to someone who has never used a computer before
- Use specific, concrete language: say "Click the blue button that says 'Join'" not "Click the join button"
- Describe what things look like: colors, positions on screen, icons
- Include what the user should see after each step to confirm they did it right
- Break complex actions into small, individual steps
- Never assume technical knowledge — explain terms like "browser", "URL", "download" when first used
- Be warm, encouraging, and patient in tone
- Include safety tips when relevant (e.g., "Never share your password with anyone who calls you")
- Cover common problems in the troubleshooting section
- For Zoom: cover joining meetings, muting/unmuting, turning camera on/off, screen sharing, chat
- For web browsing: cover using search engines, navigating websites, bookmarks, safe downloading
- For email: cover composing, replying, attachments, recognizing spam
- For phones/tablets: cover basic navigation, apps, settings, accessibility features
- Keep steps to a maximum of 10 for clarity
- Always include at least 1-2 troubleshooting items`;

/* ─── Router ─── */
export const scamAnalyzerRouter = router({
  /* Scam Analysis Endpoint */
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
              content: SCAM_SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `Please analyze the following message for potential scam indicators:\n\n---\n${message}\n---`,
            },
          ],
          responseFormat: { type: "json_object" },
          maxTokens: 1024,
        });

        const responseText = extractTextContent(result);
        const analysis = JSON.parse(responseText);

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

  /* Tech Help Endpoint */
  techHelp: publicProcedure
    .input(
      z.object({
        question: z
          .string()
          .min(1, "Please describe what you need help with")
          .max(5000, "Question is too long. Please keep it brief."),
      })
    )
    .mutation(async ({ input }) => {
      const { question } = input;

      try {
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: TECH_HELP_SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `Please create a step-by-step guide to help me with the following:\n\n${question}`,
            },
          ],
          responseFormat: { type: "json_object" },
          maxTokens: 2048,
        });

        const responseText = extractTextContent(result);
        const guide = JSON.parse(responseText);

        return {
          title: String(guide.title || "How-To Guide"),
          difficulty: validateDifficulty(guide.difficulty),
          estimatedTime: String(guide.estimatedTime || "A few minutes"),
          overview: String(guide.overview || "Here's how to do it."),
          steps: Array.isArray(guide.steps)
            ? guide.steps.map((step: any, i: number) => ({
                stepNumber: Number(step.stepNumber) || i + 1,
                title: String(step.title || `Step ${i + 1}`),
                instruction: String(step.instruction || ""),
                tip: step.tip ? String(step.tip) : null,
              }))
            : [],
          troubleshooting: Array.isArray(guide.troubleshooting)
            ? guide.troubleshooting.map((item: any) => ({
                problem: String(item.problem || ""),
                solution: String(item.solution || ""),
              }))
            : [],
          safetyNote: String(
            guide.safetyNote || "Always be cautious when sharing personal information online."
          ),
        };
      } catch (error) {
        console.error("Tech help error:", error);

        return {
          title: "We're Having Trouble",
          difficulty: "beginner" as const,
          estimatedTime: "N/A",
          overview:
            "We couldn't generate a guide right now. Please try again in a moment.",
          steps: [
            {
              stepNumber: 1,
              title: "Try Again",
              instruction:
                "Please rephrase your question or try again in a few moments. If the problem persists, try describing your question in simpler terms.",
              tip: "You can also browse our Learning Center guides for common topics.",
            },
          ],
          troubleshooting: [],
          safetyNote:
            "If you need immediate help, consider asking a trusted friend or family member.",
        };
      }
    }),
});

/* ─── Helpers ─── */
function extractTextContent(result: any): string {
  const content = result.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((p: any): p is { type: "text"; text: string } => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  return "";
}

function validateRiskLevel(
  level: unknown
): "safe" | "suspicious" | "dangerous" {
  if (level === "safe" || level === "suspicious" || level === "dangerous") {
    return level;
  }
  return "suspicious";
}

function validateDifficulty(
  level: unknown
): "beginner" | "intermediate" | "advanced" {
  if (level === "beginner" || level === "intermediate" || level === "advanced") {
    return level;
  }
  return "beginner";
}
