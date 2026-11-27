import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HeroNetwork, {
  shouldAnimateHero,
  type HeroMotionPolicy,
} from "../src/components/HeroNetwork";
import { AccessibilityProvider } from "../src/contexts/AccessibilityContext";
const root = resolve(import.meta.dirname, "..");
const file = (path: string) =>
  readFileSync(resolve(root, path), "utf8").replace(/\s+/g, " ");
describe("Digital Guardians restrained blue editorial design", () => {
  it("uses navy, cobalt and ice with neutral senior-readable content", () => {
    const css = file("src/index.css");
    expect(css).toContain("--background: #f6f8fb");
    expect(css).toContain("--foreground: #162b46");
    expect(css).toContain("--primary: #2457c5");
    expect(css).toContain("--navy: #0c2342");
    expect(css).toContain("--ice: #eaf2ff");
    expect(css).toMatch(/\.site-footer \{[^}]*background: var\(--navy\)/);
    expect(css).toContain("font-size: 18px");
    expect(css).toContain("font-size: 20px");
    expect(css).toContain("font-size: 22px");
    expect(css).toContain('data-contrast-mode="high-contrast"');
    expect(css).toContain("outline: 3px solid var(--primary)");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).not.toMatch(
      /(?:linear|radial)-gradient|text-shadow|shimmer|clay-surface|backdrop-filter|drop-shadow/
    );
  });
  it("keeps solid token text/action pairs above 4.5:1 contrast", () => {
    const css = file("src/index.css");
    const normalTokens = css.slice(
      css.indexOf(":root {"),
      css.indexOf("html {")
    );
    const token = (name: string) => {
      const match = normalTokens.match(new RegExp(`--${name}: (#[0-9a-f]{6})`));
      expect(match, name).not.toBeNull();
      return match![1];
    };
    const luminance = (hex: string) => {
      const channels = [1, 3, 5].map(
        index => parseInt(hex.slice(index, index + 2), 16) / 255
      );
      const linear = channels.map(value =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      );
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    for (const [text, surface] of [
      ["foreground", "background"],
      ["muted-foreground", "secondary"],
      ["primary-foreground", "primary"],
      ["primary-foreground", "primary-hover"],
      ["ice", "navy"],
      ["on-navy-muted", "navy"],
    ]) {
      const [low, high] = [
        luminance(token(text)),
        luminance(token(surface)),
      ].sort((a, b) => a - b);
      expect(
        (high + 0.05) / (low + 0.05),
        `${text} on ${surface}`
      ).toBeGreaterThanOrEqual(4.5);
    }
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
  it("puts discreet design credit on the site, not on participant photos", () => {
    expect(file("src/components/Footer.tsx")).toContain(
      "Site design · ScaffoldStudioCo"
    );
    expect(file("src/components/TrainingSlideshow.tsx")).not.toContain(
      "ScaffoldStudioCo"
    );
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

describe("bounded hero network motion", () => {
  const eligible: HeroMotionPolicy = {
    ready: true,
    reducedMotion: false,
    narrowScreen: false,
    highContrast: false,
    forcedColors: false,
    documentVisible: true,
    inView: true,
    userPaused: false,
  };
  it("runs only when every environmental and user permission allows it", () => {
    expect(shouldAnimateHero(eligible)).toBe(true);
    const gates: [keyof HeroMotionPolicy, boolean][] = [
      ["ready", false],
      ["reducedMotion", true],
      ["narrowScreen", true],
      ["highContrast", true],
      ["forcedColors", true],
      ["documentVisible", false],
      ["inView", false],
      ["userPaused", true],
    ];
    // Exercise all combinations, including returning from a hidden tab while paused.
    for (let mask = 1; mask < 2 ** gates.length; mask++) {
      const policy = { ...eligible };
      gates.forEach(([key, value], index) => {
        if (mask & (1 << index)) policy[key] = value;
      });
      expect(shouldAnimateHero(policy)).toBe(false);
    }
    expect(shouldAnimateHero({ ...eligible, userPaused: true })).toBe(false);
    expect(shouldAnimateHero({ ...eligible, userPaused: false })).toBe(true);
  });
  it("renders static geometry and useful HTML without running browser effects", () => {
    const markup = renderToStaticMarkup(
      createElement(
        AccessibilityProvider,
        null,
        createElement(
          HeroNetwork,
          null,
          createElement("a", { href: "#analyzer" }, "Check a message")
        )
      )
    );
    expect(markup).toContain('data-running="false"');
    expect(markup).toContain('<a href="#analyzer">Check a message</a>');
    expect(markup).toContain("<line");
    expect(markup).toContain("<circle");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<canvas");
  });
  it("keeps the network in the hero with semantic pause and resume controls", () => {
    const component = file("src/components/HeroNetwork.tsx");
    expect(file("src/pages/Home.tsx")).toContain("<HeroNetwork>");
    expect(file("src/App.tsx")).not.toContain("HeroNetwork");
    expect(component).toContain('aria-hidden="true"');
    expect(component).toContain('focusable="false"');
    expect(component).toContain('type="button"');
    expect(component).toContain("Pause background animation");
    expect(component).toContain("Resume background animation");
    expect(component).toContain("aria-controls={networkId}");
    expect(component).toContain("data-running={running}");
    expect(component).toContain("{children}");
  });
  it("uses event-driven pausing with cleaned-up observers and listeners", () => {
    const component = file("src/components/HeroNetwork.tsx");
    expect(component).toContain(
      'window.matchMedia("(prefers-reduced-motion: reduce)")'
    );
    expect(component).toContain('window.matchMedia("(max-width: 900px)")');
    expect(component).toContain('window.matchMedia("(forced-colors: active)")');
    expect(component).toContain(
      'window.matchMedia("(prefers-contrast: more)")'
    );
    expect(component).toContain('settings.contrastMode === "high-contrast"');
    expect(component).toContain("new IntersectionObserver");
    expect(component).toContain("observer.disconnect()");
    expect(component).toContain(
      'document.addEventListener("visibilitychange", updateEnvironment)'
    );
    expect(component).toContain(
      'document.removeEventListener("visibilitychange", updateEnvironment)'
    );
    expect(component).toContain(
      'query.removeEventListener("change", updateEnvironment)'
    );
    expect(component).not.toMatch(
      /requestAnimationFrame|setInterval|setTimeout|<canvas|WebGL|Math\.random/
    );
  });
  it("starts static and supplies CSS fallbacks independent of JavaScript timing", () => {
    const component = file("src/components/HeroNetwork.tsx");
    const css = file("src/index.css");
    expect(component).toContain("ready: false");
    expect(component).toContain("inView: false");
    expect(css).toContain("contain: paint");
    expect(css).toContain("pointer-events: none");
    expect(css).toContain("animation-play-state: paused");
    expect(css).toContain(
      '.hero-network-frame[data-running="true"] .hero-network-trace { animation-play-state: running; }'
    );
    expect(css).toContain("(prefers-contrast: more), (forced-colors: active)");
    expect(css).toMatch(
      /@media \(max-width: 900px\).*?\.hero-network-trace \{ animation: none; \}/
    );
    expect(css).toMatch(
      /data-contrast-mode="high-contrast"\] \.hero-network-trace \{ animation: none; \}/
    );
    expect(css).toContain("animation: none !important");
    for (const route of ["one", "two", "three"]) {
      expect(css).toContain(`@keyframes network-route-${route}`);
    }
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
