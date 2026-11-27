import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { scamAnalyzerRouter } from "./scamAnalyzer";
import { contactRouter } from "./contact";
import { calendarRouter } from "./calendar";

export const appRouter = router({
  system: systemRouter,
  // Public compatibility no-ops: this app has no accounts, cookies, or OAuth.
  auth: router({
    me: publicProcedure.query(() => null),
    logout: publicProcedure.mutation(() => ({ success: true } as const)),
  }),
  scamAnalyzer: scamAnalyzerRouter,
  contact: contactRouter,
  calendar: calendarRouter,
});
export type AppRouter = typeof appRouter;
