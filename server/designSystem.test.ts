import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

function projectFile(path: string) {
  return readFileSync(resolve(projectRoot, path), "utf8");
}

describe("championship-night clay design system", () => {
  it("defines accessible cobalt tokens and reusable clay surfaces", () => {
    const css = projectFile("src/index.css");

    expect(css).toContain("--background: rgb(6, 18, 68)");
    expect(css).toContain("--primary: rgb(98, 174, 255)");
    expect(css).toContain(".clay-surface");
    expect(css).toContain(".clay-inset");
    expect(css).toContain(".clay-input");
    expect(css).toContain(".clay-nav");
    expect(css).toContain(".carved-text");
    expect(css).toContain("outline: 3px solid rgb(145, 202, 255)");
    expect(css).toContain("outline: 3px solid rgba(193, 226, 255, 0.9)");
  });

  it("uses the static clay logo and not a continuous logo animation", () => {
    const nav = projectFile("src/components/Navbar.tsx");
    const footer = projectFile("src/components/Footer.tsx");

    expect(nav).toContain("logo-clay-wrapper");
    expect(footer).toContain("logo-clay-wrapper");
    expect(nav).toContain("digital-guardians-logo-restored-web_49a53968.webp");
    expect(footer).toContain("digital-guardians-logo-restored-web_49a53968.webp");
    expect(nav).not.toContain("logo-neon-wrapper");
    expect(footer).not.toContain("logo-neon-wrapper");
  });

  it("keeps the senior-facing analyzer on a clear, tactile input surface", () => {
    const home = projectFile("src/pages/Home.tsx");

    expect(home).toContain("textarea-animated-border clay-input");
    expect(home).toContain("clay-surface overflow-hidden rounded-[1.75rem]");
    expect(home).toContain("clay-inset inline-flex w-full gap-2");
    expect(home).toContain("carved-text max-w-3xl");
  });

  it("uses the three selected people-centered images in their intended roles", () => {
    const home = projectFile("src/pages/Home.tsx");

    expect(home).toContain('const HERO_IMG = "/manus-storage/coffee-shop-guidance-web_f03beea5.webp"');
    expect(home).toContain('const LEARNING_IMG = "/manus-storage/library-circle-web_27968e1f.webp"');
    expect(home).toContain('const COMMUNITY_IMG = "/manus-storage/garden-bench-confidence-web_de2755d5.webp"');
    expect(home).toContain("Guidance you can trust");
  });

  it("keeps the live web decorative, bounded, and mobile-safe", () => {
    const background = projectFile("src/components/EnhancedNetworkBackground.tsx");

    expect(background).toContain("const MAX_PARTICLES = 34");
    expect(background).toContain("if (isMobile) return <MobileBackground />");
    expect(background).toContain("prefers-reduced-motion: reduce");
    expect(background).toContain("document.addEventListener(\"visibilitychange\"");
  });
});
