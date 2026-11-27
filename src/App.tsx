import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./components/Toast";
import { ScrollToTop } from "./components/ScrollToTop";
import { SkipToContent } from "./components/SkipToContent";
import { PageProgress } from "./components/PageProgress";
import { lazy, Suspense } from "react";

// ── Eagerly loaded (above-the-fold, always needed) ──────────────────────────
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// ── Lazy loaded (only fetched when user navigates to that route) ─────────────
const Resources = lazy(() => import("./pages/Resources"));
const EmailBasics = lazy(() => import("./pages/guides/EmailBasics"));
const Passwords = lazy(() => import("./pages/guides/Passwords"));
const SpottingScams = lazy(() => import("./pages/guides/SpottingScams"));
const SafeBrowsing = lazy(() => import("./pages/guides/SafeBrowsing"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const CalendarPage = lazy(() => import("./pages/Calendar"));

// Minimal inline fallback — no extra component needed
function PageFallback() {
  return (
    <main
      id="main-content"
      role="status"
      className="min-h-screen flex items-center justify-center bg-background"
    >
      <p>Loading the page…</p>
    </main>
  );
}
function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resources" component={Resources} />
        <Route path="/guides/email-basics" component={EmailBasics} />
        <Route path="/guides/passwords" component={Passwords} />
        <Route path="/guides/spotting-scams" component={SpottingScams} />
        <Route path="/guides/safe-browsing" component={SafeBrowsing} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ToastProvider>
          <TooltipProvider>
            <SkipToContent />
            <PageProgress />
            <Toaster />
            <div className="relative z-10">
              <Router />
            </div>
            <ScrollToTop />
          </TooltipProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
