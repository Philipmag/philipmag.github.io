import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const recipe = (name: string) => readFileSync(resolve(root, `config/github-actions/${name}.yml`), "utf8");

describe("review-only GitHub automation recipes", () => {
  it("runs full offline validation on Node 22 without a deployment step", () => {
    const ci = recipe("ci");
    expect(ci).toContain("node-version: '22'");
    expect(ci).toContain("sync/digital-guardians-2026-11-25");
    for (const command of ["pnpm install --frozen-lockfile", "pnpm check", "pnpm test", "pnpm build", "pnpm build:gh-pages"]) expect(ci).toContain(command);
    expect(ci).not.toMatch(/deploy-pages|pages: write|id-token: write|RUN_LIVE_OPENROUTER_TESTS/);
  });

  it("has no automatic Pages publication trigger", () => {
    const pages = recipe("pages");
    const trigger = pages.split("permissions:")[0];
    expect(trigger).toContain("workflow_dispatch:");
    expect(trigger).not.toMatch(/^\s*(?:push|pull_request|schedule|workflow_run):/m);
    expect(trigger).toContain("default: false");
    expect(trigger).toContain("type: boolean");
  });

  it("requires explicit manual publication on main", () => {
    expect(recipe("pages")).toContain("if: ${{ inputs.publish == true && github.ref == 'refs/heads/main' }}");
  });

  it("grants Pages and OIDC writes only to the deploy job", () => {
    const [beforeDeploy, deploy] = recipe("pages").split("  deploy:");
    expect(beforeDeploy).toContain("contents: read");
    expect(beforeDeploy).not.toMatch(/pages: write|id-token: write/);
    expect(deploy).toContain("pages: write");
    expect(deploy).toContain("id-token: write");
    expect(deploy).toContain("needs: build");
    expect(deploy).toContain("name: github-pages");
    expect(deploy).toContain("actions/deploy-pages@v4");
  });

  it("uploads compiled static output without service secrets", () => {
    const pages = recipe("pages");
    expect(pages).toContain("pnpm build:gh-pages");
    expect(pages).toContain("path: dist/public");
    expect(pages).not.toMatch(/secrets\.|OPENROUTER_API_KEY|DATABASE_URL|SMTP_PASSWORD/);
  });
});
