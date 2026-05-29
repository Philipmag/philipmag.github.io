import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./components/Toast";
import { ScrollToTop } from "./components/ScrollToTop";
import { SkipToContent } from "./components/SkipToContent";
import { PageProgress } from "./components/PageProgress";
import { EnhancedNetworkBackground } from "./components/EnhancedNetworkBackground";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import EmailBasics from "./pages/guides/EmailBasics";
import Passwords from "./pages/guides/Passwords";
import SpottingScams from "./pages/guides/SpottingScams";
import SafeBrowsing from "./pages/guides/SafeBrowsing";
import Contact from "./pages/Contact";
import About from "./pages/About";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resources" component={Resources} />
      <Route path="/guides/email-basics" component={EmailBasics} />
      <Route path="/guides/passwords" component={Passwords} />
      <Route path="/guides/spotting-scams" component={SpottingScams} />
      <Route path="/guides/safe-browsing" component={SafeBrowsing} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <ToastProvider>
          <TooltipProvider>
            <SkipToContent />
            <PageProgress />
            <EnhancedNetworkBackground />
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
