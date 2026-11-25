/*
 * Design: Championship Night Clay — cobalt depth, raised blue surfaces, surreal editorial illustrations
 * Page: Home — Main landing page with all sections
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  BookOpen,
  CheckCircle,
  ArrowRight,
  ClipboardPaste,
  Scan,
  MessageSquareText,
  Lock,
  Heart,
  Users,
  Gift,
  Phone,
  AlertTriangle,
  ExternalLink,
  Mail,
  KeyRound,
  ShieldAlert,
  Globe,
  Sparkles,
  Zap,
  HelpCircle,
  Lightbulb,
  Clock,
  ChevronRight,
  BarChart3,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import TrainingSlideshow from "@/components/TrainingSlideshow";
import ScamAlertsFeed from "@/components/ScamAlertsFeed";

const HERO_IMG = "/manus-storage/coffee-shop-guidance-web_f03beea5.webp";
const LEARNING_IMG = "/manus-storage/library-circle-web_27968e1f.webp";
const COMMUNITY_IMG = "/manus-storage/garden-bench-confidence-web_de2755d5.webp";
const EMERGENCY_IMG = "/manus-storage/safety-beacon-web_5785753e.webp";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <AnalyzerSection />
        <ScamAlertsSection />
        <HowItWorksSection />
        <LearningSection />
        <TrainingsSection />
        <AboutSection />
        <EmergencySection />
      </main>
      <Footer />
    </div>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_24%,rgba(48,126,255,0.30),transparent_27%),radial-gradient(circle_at_84%_72%,rgba(78,102,255,0.23),transparent_31%),linear-gradient(135deg,rgba(5,16,60,0.78),rgba(10,38,115,0.80)_48%,rgba(5,16,60,0.78))]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
      <div className="absolute left-[8%] top-[28%] -z-10 h-40 w-40 rounded-full border border-primary/15" />
      <div className="absolute bottom-[12%] right-[11%] -z-10 h-56 w-56 rounded-full border border-[rgb(126,166,255)]/16" />

      <div className="container py-28 md:py-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Shield className="h-3.5 w-3.5" />
              Peterborough’s digital safety guide
            </div>
            <h1 className="carved-text max-w-3xl font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] text-foreground md:text-6xl lg:text-7xl">
              Feel safer online, <span className="text-gradient-green">one clear step</span> at a time.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Digital Guardians gives older adults practical, judgment-free support for recognizing scams, protecting accounts, and using everyday technology with confidence.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#analyzer" className="inline-flex">
                <Button size="lg" className="h-14 w-full gap-2 rounded-xl px-7 text-base font-extrabold clay-button shadow-[0_10px_28px_rgba(22,94,211,0.30)] sm:w-auto">
                  <Search className="h-5 w-5" />
                  Check a message
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/calendar">
                <Button variant="outline" size="lg" className="clay-inset h-14 w-full gap-2 rounded-xl border-white/15 px-7 text-base font-bold text-foreground hover:border-primary/40 sm:w-auto">
                  <Users className="h-5 w-5 text-primary" />
                  Find a workshop
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div><p className="text-sm font-bold text-foreground">Free support</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Simple guidance without the jargon.</p></div>
              <div className="border-white/10 sm:border-l sm:pl-5"><p className="text-sm font-bold text-foreground">Private by design</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Never share your passwords or banking details.</p></div>
              <div className="border-white/10 sm:border-l sm:pl-5"><p className="text-sm font-bold text-foreground">Built for seniors</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Patient, practical, and always respectful.</p></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[rgb(79,151,255)]/24 via-transparent to-[rgb(91,112,255)]/25 blur-2xl" />
            <div className="clay-surface relative overflow-hidden rounded-[1.75rem] border p-3">
              <img
                src={HERO_IMG}
                alt="Two women receiving friendly digital guidance together at a café, with luminous blue stars around their tablet"
                className="aspect-[1.15/1] w-full rounded-[1.2rem] object-cover"
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
              <div className="absolute bottom-7 left-7 right-7 clay-inset rounded-2xl border border-white/15 p-4 md:left-8 md:right-auto md:max-w-[19rem]">
                <div className="flex items-start gap-3"><div className="rounded-xl bg-primary/15 p-2"><ShieldAlert className="h-5 w-5 text-primary" /></div><div><p className="text-sm font-extrabold text-foreground">Guidance you can trust</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Pause, ask questions, and take the next safe step at your own pace.</p></div></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── AI Assistant Section (Dual Mode) ─── */
type AIMode = "scam" | "help";

type AnalysisResult = {
  source: "ai" | "safety-check";
  privacyProtected: boolean;
  riskLevel: "safe" | "suspicious" | "dangerous";
  confidence: number;
  summary: string;
  redFlags: string[];
  advice: string;
  scamType: string;
};

type TechHelpResult = {
  source: "ai" | "quick-guide";
  privacyProtected: boolean;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  overview: string;
  steps: { stepNumber: number; title: string; instruction: string; tip: string | null }[];
  troubleshooting: { problem: string; solution: string }[];
  safetyNote: string;
};

function AnalyzerSection() {
  const [mode, setMode] = useState<AIMode>("scam");
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [scamResult, setScamResult] = useState<AnalysisResult | null>(null);
  const [helpResult, setHelpResult] = useState<TechHelpResult | null>(null);
  const [copied, setCopied] = useState(false);

  const analyzeMutation = trpc.scamAnalyzer.analyze.useMutation({
    onSuccess: (data) => setScamResult(data as AnalysisResult),
  });

  const techHelpMutation = trpc.scamAnalyzer.techHelp.useMutation({
    onSuccess: (data) => setHelpResult(data as TechHelpResult),
  });

  const handleAnalyze = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    setScamResult(null);
    analyzeMutation.mutate({ message: message.trim() });
  };

  const handleTechHelp = (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;
    setHelpResult(null);
    techHelpMutation.mutate({ question: question.trim() });
  };

  const switchMode = (newMode: AIMode) => {
    setMode(newMode);
    setScamResult(null);
    setHelpResult(null);
  };

  const riskConfig = {
    safe: {
      badge: "bg-emerald-400/15 text-emerald-200 border-emerald-300/25",
      panel: "border-emerald-300/25 bg-emerald-950/35",
      icon: CheckCircle,
      iconColor: "text-emerald-300",
      title: "No obvious scam signs found",
    },
    suspicious: {
      badge: "bg-amber-300/15 text-amber-100 border-amber-200/25",
      panel: "border-amber-200/25 bg-amber-950/35",
      icon: AlertTriangle,
      iconColor: "text-amber-200",
      title: "Take a closer look",
    },
    dangerous: {
      badge: "bg-red-400/15 text-red-100 border-red-300/25",
      panel: "border-red-300/25 bg-red-950/35",
      icon: ShieldAlert,
      iconColor: "text-red-200",
      title: "Likely a scam — do not engage",
    },
  };

  const difficultyConfig = {
    beginner: "bg-emerald-400/15 text-emerald-200 border-emerald-300/25",
    intermediate: "bg-amber-300/15 text-amber-100 border-amber-200/25",
    advanced: "bg-red-400/15 text-red-100 border-red-300/25",
  };

  const quickQuestions = [
    "How do I mute myself in a Zoom meeting?",
    "How do I search for something on Google?",
    "How do I send a photo by email?",
    "How do I make text bigger on my screen?",
  ];

  const isAnalyzing = analyzeMutation.isPending || techHelpMutation.isPending;

  return (
    <section id="analyzer" className="relative isolate overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(46,125,255,0.25),transparent_27%),radial-gradient(circle_at_88%_88%,rgba(95,111,255,0.23),transparent_31%),linear-gradient(180deg,rgba(5,16,60,0.84),rgba(10,38,115,0.86)_48%,rgba(5,16,60,0.84))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container relative">
        <AnimatedSection className="mb-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Shield className="h-3.5 w-3.5" />
              Guided safety check
            </div>
            <h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Calm answers for moments when something feels <span className="text-gradient-green">off.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Paste a message you are unsure about, or ask a technology question. You will receive clear next steps in plain language — without being rushed or judged.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This is AI-guided safety information, not proof that a message is genuine. When something involves money, an account, or personal information, verify independently using a trusted contact method.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="clay-inset rounded-2xl border border-white/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                <Lock className="h-4 w-4 text-primary" />
                Private by design
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">Your check is processed to answer you; this page does not save your pasted message.</p>
            </div>
            <div className="clay-inset rounded-2xl border border-white/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                <Heart className="h-4 w-4 text-primary" />
                You are in control
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">The tool gives guidance. It never asks for passwords, bank details, or verification codes.</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <div className="clay-surface overflow-hidden rounded-[1.75rem] border">
            <div className="border-b border-white/10 px-4 py-4 sm:px-6">
              <div role="tablist" aria-label="AI helper options" className="clay-inset inline-flex w-full gap-2 rounded-2xl border border-white/10 p-1.5 sm:w-auto">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "scam"}
                  onClick={() => switchMode("scam")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition sm:flex-none sm:px-6 ${mode === "scam" ? "bg-primary text-primary-foreground clay-button shadow-[0_8px_22px_rgba(22,94,211,0.30)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
                >
                  <Shield className="h-4 w-4" />
                  Check a message
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "help"}
                  onClick={() => switchMode("help")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition sm:flex-none sm:px-6 ${mode === "help" ? "bg-[rgb(43,91,209)] text-white clay-button shadow-[0_8px_22px_rgba(23,74,194,0.32)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
                >
                  <HelpCircle className="h-4 w-4" />
                  Ask for help
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
              <div className="border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                {mode === "scam" ? (
                  <form onSubmit={handleAnalyze} className="space-y-5" aria-describedby="scam-helper-description">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Message check</p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-foreground">Does this look suspicious?</h3>
                      <p id="scam-helper-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">Paste the full email, text, or social message. Include links or phone numbers exactly as written, but remove passwords and private account details.</p>
                    </div>
                    <div>
                      <label htmlFor="scam-message" className="mb-2 block text-sm font-bold text-foreground">Message to check</label>
                      <textarea
                        id="scam-message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        rows={7}
                        placeholder="Example: Your account will be closed today. Click here to verify your password..."
                        className="textarea-animated-border clay-input w-full resize-none rounded-2xl border border-border px-4 py-3.5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/65"
                      />
                    </div>
                    <button type="submit" disabled={analyzeMutation.isPending || !message.trim()} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground clay-button shadow-[0_10px_28px_rgba(22,94,211,0.30)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                      {analyzeMutation.isPending ? <><Scan className="h-5 w-5 animate-spin" /> Checking safely...</> : <><Scan className="h-5 w-5 transition-transform group-hover:rotate-12" /> Check this message</>}
                    </button>
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Never paste a password, one-time code, banking number, or government ID.</p>
                  </form>
                ) : (
                  <form onSubmit={handleTechHelp} className="space-y-5" aria-describedby="help-helper-description">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[rgb(177,205,255)]">Step-by-step help</p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-foreground">What would you like to do?</h3>
                      <p id="help-helper-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">Ask one question at a time. We will turn it into clear, manageable steps you can follow at your own pace.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((quickQuestion) => (
                        <button key={quickQuestion} type="button" onClick={() => setQuestion(quickQuestion)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-semibold text-muted-foreground transition hover:border-[rgb(145,202,255)]/50 hover:bg-[rgb(65,115,226)]/22 hover:text-foreground">
                          {quickQuestion}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label htmlFor="help-question" className="mb-2 block text-sm font-bold text-foreground">Your technology question</label>
                      <textarea
                        id="help-question"
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                        rows={6}
                        placeholder="For example: How do I join a Zoom meeting from an email invitation?"
                        className="textarea-animated-border clay-input w-full resize-none rounded-2xl border border-border px-4 py-3.5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/65"
                      />
                    </div>
                    <button type="submit" disabled={techHelpMutation.isPending || !question.trim()} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(43,91,209)] clay-button px-5 py-3.5 text-base font-extrabold text-white shadow-[0_10px_28px_rgba(23,74,194,0.32)] transition hover:bg-[rgb(58,111,233)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                      {techHelpMutation.isPending ? <><Scan className="h-5 w-5 animate-spin" /> Building your guide...</> : <><Lightbulb className="h-5 w-5 transition-transform group-hover:-rotate-12" /> Create my guide</>}
                    </button>
                  </form>
                )}
              </div>

              <div className="min-h-[460px] p-5 sm:p-7" aria-live="polite">
                {mode === "scam" && analyzeMutation.isError && (
                  <div className="rounded-2xl border border-red-300/25 bg-red-950/30 p-5">
                    <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-200" /><div><h4 className="font-display text-lg font-bold text-red-100">We could not complete that check</h4><p className="mt-2 text-sm leading-relaxed text-red-100/80">Please try again. Until you receive an assessment, avoid links and phone numbers in unexpected messages.</p></div></div>
                  </div>
                )}

                {mode === "help" && techHelpMutation.isError && (
                  <div className="rounded-2xl border border-red-300/25 bg-red-950/30 p-5">
                    <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-200" /><div><h4 className="font-display text-lg font-bold text-red-100">We could not create that guide</h4><p className="mt-2 text-sm leading-relaxed text-red-100/80">Please try again with one clear question. You can also browse the learning guides below.</p></div></div>
                  </div>
                )}

                {mode === "scam" && scamResult && (() => {
                  const config = riskConfig[scamResult.riskLevel];
                  const ResultIcon = config.icon;
                  const shareText = `Scam Check from Digital Guardians\n\n${config.title}${scamResult.source === "ai" ? ` (${scamResult.confidence}% confidence)` : ""}\n\n${scamResult.summary}\n\nWhat to do:\n${scamResult.advice}`;
                  return (
                    <div className={`rounded-2xl border ${config.panel} overflow-hidden`}>
                      <div className="border-b border-white/10 bg-black/10 px-5 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-3"><div className="rounded-xl bg-black/20 p-2"><ResultIcon className={`h-5 w-5 ${config.iconColor}`} /></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Your safety check</p><h4 className="mt-1 font-display text-xl font-bold text-foreground">{config.title}</h4></div></div>
                          <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${config.badge}`}>{scamResult.source === "ai" ? `${scamResult.confidence}% AI confidence` : "Safety guidance"}</span>
                        </div>
                      </div>
                      <div className="space-y-5 p-5">
                        {scamResult.source === "safety-check" && <div role="status" className="rounded-xl border border-amber-200/20 bg-amber-300/10 p-3 text-sm leading-relaxed text-amber-100">The live AI check is temporarily unavailable. These are precautionary steps, not an assessment of the message.</div>}
                        {scamResult.privacyProtected && <div role="status" className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm leading-relaxed text-primary"><Lock className="mt-0.5 h-4 w-4 shrink-0" />Private details that looked like credentials or account numbers were hidden before the AI check.</div>}
                        <p className="text-base leading-relaxed text-foreground/90">{scamResult.summary}</p>
                        {scamResult.scamType !== "none" && scamResult.scamType !== "unknown" && <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold text-foreground">Possible type:</span><span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm capitalize text-muted-foreground">{scamResult.scamType.replace(/-/g, " ")}</span></div>}
                        {scamResult.redFlags.length > 0 && <div><p className="mb-3 text-sm font-bold text-foreground">What stood out</p><ul className="space-y-2">{scamResult.redFlags.map((flag) => <li key={flag} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{flag}</li>)}</ul></div>}
                        <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="mb-1 flex items-center gap-2 text-sm font-bold text-foreground"><Shield className="h-4 w-4 text-primary" />What to do next</p><p className="text-sm leading-relaxed text-muted-foreground">{scamResult.advice}</p></div>
                        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4"><button type="button" onClick={() => { navigator.clipboard.writeText(shareText); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-muted-foreground transition hover:bg-white/10 hover:text-foreground"><ClipboardPaste className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy results"}</button><button type="button" onClick={() => { if (navigator.share) { navigator.share({ title: "Digital Guardians safety check", text: shareText }); } else { window.open(`mailto:?subject=Digital Guardians safety check&body=${encodeURIComponent(shareText)}`); } }} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-muted-foreground transition hover:bg-white/10 hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" />Share</button></div>
                      </div>
                    </div>
                  );
                })()}

                {mode === "help" && helpResult && (
                  <div className="overflow-hidden rounded-2xl border border-[rgb(126,166,255)]/28 bg-[rgb(17,53,145)]/55">
                    <div className="border-b border-white/10 bg-black/10 px-5 py-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[rgb(177,205,255)]">{helpResult.source === "ai" ? "Your personal guide" : "Your quick starting guide"}</p><h4 className="mt-1 font-display text-xl font-bold text-foreground">{helpResult.title}</h4></div><div className="flex gap-2"><span className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${difficultyConfig[helpResult.difficulty]}`}>{helpResult.difficulty}</span><span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-muted-foreground"><Clock className="h-3.5 w-3.5" />{helpResult.estimatedTime}</span></div></div></div>
                    <div className="space-y-5 p-5">{helpResult.source === "quick-guide" && <div role="status" className="rounded-xl border border-[rgb(145,202,255)]/25 bg-[rgb(65,115,226)]/15 p-3 text-sm leading-relaxed text-[rgb(213,228,255)]">Here is a safe starting guide for your question. You can follow these steps at your own pace.</div>}{helpResult.privacyProtected && <div role="status" className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm leading-relaxed text-primary"><Lock className="mt-0.5 h-4 w-4 shrink-0" />Private details that looked like credentials or account numbers were hidden before the AI check.</div>}<p className="text-base leading-relaxed text-foreground/90">{helpResult.overview}</p><div className="space-y-4">{helpResult.steps.map((step) => <div key={step.stepNumber} className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgb(43,91,209)] text-sm font-extrabold text-white">{step.stepNumber}</div><div className="min-w-0 pt-1"><p className="font-display text-sm font-bold text-foreground">{step.title}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.instruction}</p>{step.tip && <p className="mt-2 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground"><span className="font-bold text-primary">Helpful tip: </span>{step.tip}</p>}</div></div>)}</div>{helpResult.troubleshooting.length > 0 && <div className="border-t border-white/10 pt-5"><p className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><Wrench className="h-4 w-4 text-amber-200" />If something goes wrong</p><div className="space-y-2">{helpResult.troubleshooting.map((item) => <div key={item.problem} className="rounded-xl border border-white/10 bg-black/15 p-3"><p className="text-sm font-bold text-amber-100">{item.problem}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.solution}</p></div>)}</div></div>}<div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground"><p className="mb-1 flex items-center gap-2 font-bold text-foreground"><Shield className="h-4 w-4 text-primary" />Safety reminder</p>{helpResult.safetyNote}</div></div>
                  </div>
                )}

                {!isAnalyzing && mode === "scam" && !scamResult && !analyzeMutation.isError && <div className="flex h-full min-h-[400px] flex-col justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-6"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10"><Shield className="h-6 w-6 text-primary" /></div><p className="font-display text-2xl font-bold text-foreground">A second set of eyes, without the pressure.</p><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">We will look for urgency, unexpected requests, suspicious links, payment pressure, and impersonation tactics — then explain the result in plain language.</p><div className="mt-7 grid gap-3 sm:grid-cols-3">{[["1", "Paste", "Add the message"], ["2", "Check", "Review the guidance"], ["3", "Pause", "Take the safest next step"]].map(([number, title, detail]) => <div key={title} className="rounded-xl border border-white/10 bg-black/15 p-3"><p className="text-xs font-black text-primary">{number}</p><p className="mt-1 text-sm font-bold text-foreground">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>)}</div></div>}
                {!isAnalyzing && mode === "help" && !helpResult && !techHelpMutation.isError && <div className="flex h-full min-h-[400px] flex-col justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-6"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(43,91,209)]/25"><Lightbulb className="h-6 w-6 text-[rgb(185,170,255)]" /></div><p className="font-display text-2xl font-bold text-foreground">Clear steps, one at a time.</p><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">Ask about email, video calls, passwords, photos, browsing, phone settings, or another everyday technology task.</p><p className="mt-7 rounded-xl border border-white/10 bg-black/15 p-4 text-sm leading-relaxed text-muted-foreground"><span className="font-bold text-foreground">A good question is specific: </span>“How do I join a Zoom meeting from an email invitation?”</p></div>}
                {isAnalyzing && <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10"><Scan className="h-7 w-7 animate-spin text-primary" /></div><p className="font-display text-xl font-bold text-foreground">{mode === "scam" ? "Checking the message carefully" : "Creating your step-by-step guide"}</p><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">This usually takes a few seconds. Please keep this page open while we prepare your answer.</p></div>}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Scam Alerts Section ─── */
function ScamAlertsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <AnimatedSection className="mb-10">
          <SectionLabel number="02" label="Scam Alerts" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-foreground mb-2">
                Latest Fraud Warnings
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Stay informed about the latest scams targeting Canadians. Data sourced from the Canadian Anti-Fraud Centre.
              </p>
            </div>
            <a
              href="https://antifraudcentre-centreantifraude.ca/index-eng.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/60 hover:border-primary/30">
                <ExternalLink className="w-3.5 h-3.5" />
                Visit CAFC
              </Button>
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <ScamAlertsFeed />
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── How It Works Section ─── */
function HowItWorksSection() {
  const steps = [
    {
      icon: ClipboardPaste,
      title: "You Paste the Message",
      description:
        "Simply copy and paste any message you're unsure about. No technical skills needed.",
    },
    {
      icon: Scan,
      title: "AI Analyzes It",
      description:
        "Our AI checks for common scam tricks using models trained on the latest threats.",
    },
    {
      icon: MessageSquareText,
      title: "You Get Clear Advice",
      description:
        "We explain what's wrong (or right) in plain language you can understand.",
    },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="container relative z-10">
        <AnimatedSection className="text-center mb-16">
          <SectionLabel number="02" label="How It Works" />
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-foreground">
            How We <span className="text-gradient-green">Help You</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.1}>
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-200 group h-full glow-card">
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-mono font-bold text-3xl text-primary/20 group-hover:text-primary/40 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors border border-primary/15">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Learning Section ─── */
function LearningSection() {
  const topics = [
    { icon: Mail, label: "Email Basics", count: "8 min read", href: "/guides/email-basics" },
    { icon: KeyRound, label: "Passwords", count: "10 min read", href: "/guides/passwords" },
    { icon: ShieldAlert, label: "Spotting Scams", count: "12 min read", href: "/guides/spotting-scams" },
    { icon: Globe, label: "Safe Browsing", count: "11 min read", href: "/guides/safe-browsing" },
  ];

  return (
    <section id="learn" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[rgb(8,10,26)] to-background" />

      {/* Animated Mantra Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="text-center">
          <h3 className="font-display font-extrabold text-6xl md:text-8xl tracking-tight text-primary/40 animate-pulse">
            Cybersecurity4 Seniors
          </h3>
        </div>
      </div>
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[rgb(100,80,200)]/15 via-transparent to-primary/15 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 glow-card">
                <img
                  src={LEARNING_IMG}
                  alt="Older adults learning together in a welcoming public-library workshop with a soft blue constellation web"
                  className="w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection delay={0.1}>
            <SectionLabel number="03" label="Learning Center" />
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4 text-foreground">
              Learn at <span className="text-gradient-purple">Your Own Pace</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Not sure if a message is a scam? Want to learn safer habits? Our
              step-by-step tutorials are designed just for you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {topics.map((topic) => (
                <Link
                  key={topic.label}
                  href={topic.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all glow-card group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/15 group-hover:bg-primary/15 transition-colors">
                    <topic.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {topic.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{topic.count}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            <Link href="/resources">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-xl h-12 px-8 font-semibold border-border/60 hover:bg-white/5 hover:border-primary/30"
              >
                Browse All Resources
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Community Trainings Section ─── */
function TrainingsSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[rgb(8,10,26)] to-background" />
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Slideshow */}
          <AnimatedSection>
            <TrainingSlideshow />
          </AnimatedSection>

          {/* Right: Content */}
          <AnimatedSection delay={0.1}>
            <SectionLabel number="04" label="Our Impact" />
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4 text-foreground">
              Community <span className="text-gradient-green">Trainings</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              We regularly host in-person cybersecurity training sessions for seniors
              in our community. These hands-on workshops cover everything from
              recognizing scam emails to safely navigating the internet.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/15">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">Hands-On Workshops</p>
                  <p className="text-xs text-muted-foreground">Small group sessions with personalized attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/15">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">Real-World Scenarios</p>
                  <p className="text-xs text-muted-foreground">Practice identifying scams with actual examples</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/15">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">Supportive Environment</p>
                  <p className="text-xs text-muted-foreground">No question is too simple — everyone is welcome</p>
                </div>
              </div>
            </div>

            <Link href="/resources">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-xl h-12 px-8 font-semibold border-border/60 hover:bg-white/5 hover:border-primary/30"
              >
                View Training Materials
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  const values = [
    {
      icon: Heart,
      title: "Patient",
      description: "We take time to explain things clearly.",
    },
    {
      icon: Users,
      title: "Non-judgmental",
      description: "Everyone learns at their own pace.",
    },
    {
      icon: Lock,
      title: "Private",
      description: "Your data stays yours.",
    },
    {
      icon: Gift,
      title: "Free",
      description: "Our services are always free.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="container relative z-10">
        <AnimatedSection className="max-w-3xl mb-16">
          <SectionLabel number="05" label="About Us" />
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4 text-foreground">
            About <span className="text-gradient-green">Digital Guardians</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We're here to help seniors feel confident and safe online. We believe
            everyone deserves to enjoy technology without fear.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.08}>
              <div className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-200 h-full glow-card">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/15">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-base mb-2 text-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-16 grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <AnimatedSection>
            <figure className="relative h-full min-h-[21rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[rgb(10,18,36)] shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
              <img
                src={COMMUNITY_IMG}
                alt="Older couple using a tablet together in a community garden beneath a luminous blue shield constellation"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(5,12,28,0.95)] via-[rgba(5,12,28,0.48)] to-transparent p-6 pt-20">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">A local circle of support</p>
                <figcaption className="mt-2 max-w-sm font-display text-2xl font-bold text-white">Technology is easier when you never have to learn alone.</figcaption>
              </div>
            </figure>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex h-full flex-col justify-center rounded-[1.75rem] border border-white/12 bg-white/[0.045] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)] md:p-8 md:backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[rgb(185,170,255)]">Our promise</p>
              <p className="mt-3 font-display text-2xl font-bold leading-tight text-foreground">Practical support, with room to ask every question.</p>
              <div className="mt-7 space-y-4">
                {[
                  [Users, "Learn together", "Friendly workshops with a comfortable pace and plenty of time for questions."],
                  [Shield, "Build safer habits", "Understand what to do before a suspicious email, call, or link causes stress."],
                  [Heart, "Stay connected", "Use the tools that matter to you while protecting your privacy and independence."],
                ].map(([Icon, title, description]) => {
                  const CardIcon = Icon as typeof Shield;
                  return (
                    <div key={title as string} className="flex gap-3 rounded-xl border border-white/10 bg-black/15 p-3.5">
                      <div className="mt-0.5 rounded-lg bg-primary/10 p-2"><CardIcon className="h-4 w-4 text-primary" /></div>
                      <div><p className="text-sm font-bold text-foreground">{title as string}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description as string}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─── Emergency Section ─── */
function EmergencySection() {
  const steps = [
    { bold: "Don't panic.", rest: "These things happen to smart people." },
    { bold: "Stop all contact", rest: "with the person or website." },
    { bold: "Call your bank", rest: "using the number on the back of your card." },
    { bold: "Change passwords", rest: "for any affected accounts." },
    { bold: "Report it", rest: "to help protect others." },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={EMERGENCY_IMG}
          alt=""
          className="w-full h-full object-cover opacity-15"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: What to do */}
          <AnimatedSection>
            <SectionLabel number="06" label="Emergency" />
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-6 text-foreground">
              Think You've Been{" "}
              <span className="text-red-400">Scammed?</span>
            </h2>

            <div className="space-y-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card/80 border border-border/40 backdrop-blur-sm"
                >
                  <span className="font-mono font-bold text-sm text-primary/50 mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong>{step.bold}</strong> {step.rest}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: Where to report */}
          <AnimatedSection delay={0.1}>
            <div className="lg:mt-16">
              <h3 className="font-display font-bold text-xl mb-6 text-foreground">
                Where to Report
              </h3>

              <div className="space-y-4">
                <a
                  href="https://reportfraud.ftc.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all group glow-card"
                >
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground mb-1">
                      FTC (USA)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      reportfraud.ftc.gov
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>

                <a
                  href="https://www.antifraudcentre.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all group glow-card"
                >
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground mb-1">
                      Canadian Anti-Fraud Centre
                    </p>
                    <p className="text-xs text-muted-foreground">
                      antifraudcentre.ca
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>

                <div className="flex items-center justify-between p-5 rounded-xl border border-border/50 bg-card">
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground mb-1">
                      Local Police
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Non-emergency line
                    </p>
                  </div>
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
