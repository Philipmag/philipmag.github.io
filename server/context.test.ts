import { describe, expect, it } from "vitest";
import { createContext, type TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

describe("standalone public context", () => {
  it("always uses user:null without any session lookup", async () => {
    const req = { headers: { cookie: "old-session=ignored" } } as TrpcContext["req"];
    const res = {} as TrpcContext["res"];
    const ctx = await createContext({ req, res, info: {} } as any);
    expect(ctx).toEqual({ req, res, user: null });
    const caller = appRouter.createCaller(ctx);
    expect(await caller.auth.me()).toBeNull();
    expect(await caller.auth.logout()).toEqual({ success: true });
    expect(await caller.system.health({ timestamp: 0 })).toEqual({ ok: true });
  });
});
