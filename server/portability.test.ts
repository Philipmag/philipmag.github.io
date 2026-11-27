import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const root = resolve(import.meta.dirname, "..");
const text = (name: string) => readFileSync(resolve(root, name), "utf8");
describe("standalone runtime and static preview", () => {
  it("has versioned local images, font and original downloads", () => {
    for (const path of ["media/cafe-guidance.webp", "media/library-workshop.webp", "media/digital-guardians-crest.webp", "media/dm-sans-variable.woff2", "media/DM-Sans-OFL.txt"]) expect(existsSync(resolve(root, path))).toBe(true);
    const downloads = readdirSync(resolve(root, "media")).filter(f => f.endsWith(".pptx"));
    expect(downloads).toHaveLength(4);
    for (const name of downloads) expect(readFileSync(resolve(root, "media", name)).subarray(0, 2).toString()).toBe("PK");
  });
  it("does not depend on managed providers, auth or plugins", () => {
    for (const name of ["package.json", "vite.config.ts", "src/main.tsx", "src/lib/siteAssets.ts", "server/_core/llm.ts", "server/app.ts"])
      expect(text(name)).not.toMatch(/vite-plugin-manus|forge\.manus|BUILT_IN_FORGE|NVIDIA_API_KEY|manus-storage|getLoginUrl/);
    expect(text("server/_core/llm.ts")).toContain("https://openrouter.ai/api/v1/chat/completions");
    expect(text("tsconfig.json")).toContain('"src/**/*"');
  });
  it("disables live submissions in the static preview and gives direct alternatives", () => {
    expect(text("package.json")).toContain("VITE_STATIC_PREVIEW=1");
    for (const name of ["Home", "Contact", "About", "Calendar"]) expect(text(`src/pages/${name}.tsx`)).toContain("IS_STATIC_PREVIEW");
    expect(text("src/pages/Home.tsx")).toContain("live AI is not available on GitHub Pages");
    expect(text("src/pages/Calendar.tsx")).toContain("enabled: !IS_STATIC_PREVIEW");
    expect(text("src/pages/Contact.tsx")).toContain("This GitHub Pages design preview cannot send forms");
  });
  it("keeps build artefacts isolated and secrets server-only", () => {
    expect(text("vite.config.ts")).toContain('"dist/public"');
    expect(text("vite.config.ts")).not.toContain("github-pages-copy");
    expect(text("config/env.example")).toContain("OPENROUTER_API_KEY=");
    expect(text(".gitignore")).toContain(".env");
    expect(text("src/main.tsx")).not.toContain("API_KEY");
  });
});
