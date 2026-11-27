import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/** Public standalone application: no account lookup, cookies, or authentication. */
export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: null;
};
export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  return { req: opts.req, res: opts.res, user: null };
}
