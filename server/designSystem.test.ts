import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const root = resolve(import.meta.dirname, "..");
const file = (path: string) =>
  readFileSync(resolve(root, path), "utf8").replace(/\s+/g, " ");
describe("Digital Guardians neighbourly editorial design", () => {
  it("uses warm paper, navy ink and senior-readable defaults", () => {
    const css = file("src/index.css");
    expect(css).toContain("--background: #f7f4ee");
    expect(css).toContain("--foreground: #142f4a");
    expect(css).toContain("--primary: #173653");
    expect(css).toContain("font-size: 18px");
    expect(css).toContain("font-size: 20px");
    expect(css).toContain("font-size: 22px");
    expect(css).toContain('data-contrast-mode="high-contrast"');
    expect(css).toContain("outline: 3px solid var(--primary)");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).not.toMatch(
      /(?:linear|radial)-gradient|text-shadow|shimmer|clay-surface/
    );
  });
  it("preserves a portable crest and exposes mobile reading controls", () => {
    const nav = file("src/components/Navbar.tsx");
    const footer = file("src/components/Footer.tsx");
    expect(nav).toContain("SITE_ASSETS.logo");
    expect(footer).toContain("SITE_ASSETS.logo");
    expect(nav).toContain("<AccessibilityToggle");
    expect(nav).toContain("aria-expanded={mobileOpen}");
    expect(file("src/components/AccessibilityToggle.tsx")).toContain(
      "aria-pressed"
    );
    expect(file("src/App.tsx")).not.toContain("EnhancedNetworkBackground");
  });
  it("keeps section order and limits generated scenes to purposeful moments", () => {
    const home = file("src/pages/Home.tsx");
    const sections = [
      "<HeroSection",
      "<AnalyzerSection",
      "<ScamAlertsSection",
      "<HowItWorksSection",
      "<LearningSection",
      "<TrainingsSection",
      "<AboutSection",
      "<EmergencySection",
    ];
    const positions = sections.map(section => home.indexOf(section));
    expect(positions.every(position => position > -1)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(home).toContain("SITE_ASSETS.hero");
    expect(home).toContain("SITE_ASSETS.learning");
    expect(home).toContain("Illustrative AI-generated scene");
    expect(home).toContain("not a documented participant");
    expect(home).not.toContain("SITE_ASSETS.emergency");
    expect(file("src/index.css")).toContain("aspect-ratio: 3 / 2");
  });
  it("discloses third-party AI processing, redaction limits and local fallbacks", () => {
    const home = file("src/pages/Home.tsx");
    expect(home).toContain("OpenRouter and its AI provider");
    expect(home).toContain("Automatic redaction can miss sensitive details");
    expect(home).toContain("cannot guarantee a message is safe");
    expect(home).toContain("Local safety checklist");
    expect(home).toContain("not an assessment of your message");
    expect(home).toContain("Local quick guide");
    expect(home).toContain(
      "analyzeMutation.mutate({ message: message.trim() })"
    );
    expect(home).toContain(
      "techHelpMutation.mutate({ question: question.trim() })"
    );
    expect(home).toContain('aria-live="polite"');
  });
  it("preserves downloadable training materials and removes auto-advancing photos", () => {
    const resources = file("src/pages/Resources.tsx");
    for (const name of [
      "DigitalGuardians_Cybersecurity_2026_3cfab393.pptx",
      "DigitalSecurity_Seniors_2026_Redesigned_436bfe4d.pptx",
      "Staying_Connected_Seniors_Guide_54b053a8.pptx",
      "AIforSeniors_ChatGPT_Guide_2026_Redesigned_c1ecae50.pptx",
    ])
      expect(resources).toContain(`/media/${name}`);
    expect(resources).toContain("download");
    const gallery = file("src/components/TrainingSlideshow.tsx");
    expect(gallery).not.toContain("setInterval");
    expect(gallery).toContain("Previous workshop photo");
    expect(gallery).not.toMatch(/manus-storage|cloudfront/);
  });
  it("shows genuine contact and calendar errors instead of false success", () => {
    for (const page of ["About", "Contact"]) {
      const source = file(`src/pages/${page}.tsx`);
      expect(source).toContain("setSubmitted(data.success === true)");
      expect(source).toContain("onError");
      expect(source).toContain('role="alert"');
    }
    const calendar = file("src/pages/Calendar.tsx");
    expect(calendar).toContain("We could not load the workshop calendar");
    expect(calendar).toContain("setSubmitted(data.success === true)");
    expect(calendar).not.toContain("Sunday, June 28, 2026");
  });
});

import { parseAccessibilitySettings } from "../src/contexts/AccessibilityContext";

describe("saved accessibility settings", () => {
  it("accepts valid large-text and high-contrast settings", () => {
    expect(
      parseAccessibilitySettings(
        '{"textSize":"large","contrastMode":"high-contrast"}'
      )
    ).toEqual({ textSize: "large", contrastMode: "high-contrast" });
  });
  it("uses readable defaults for missing or malformed storage", () => {
    for (const value of [null, "invalid-json", "{}", "null"])
      expect(parseAccessibilitySettings(value)).toEqual({
        textSize: "normal",
        contrastMode: "normal",
      });
  });
  it("rejects unsupported stored settings", () => {
    expect(
      parseAccessibilitySettings(
        '{"textSize":"tiny","contrastMode":"invisible"}'
      )
    ).toEqual({ textSize: "normal", contrastMode: "normal" });
  });
});
