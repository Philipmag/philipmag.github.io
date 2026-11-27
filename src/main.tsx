import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 60_000, refetchOnWindowFocus: false }, mutations: { retry: false } },
});
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider><App /></AccessibilityProvider>
    </QueryClientProvider>
  </trpc.Provider>,
);
