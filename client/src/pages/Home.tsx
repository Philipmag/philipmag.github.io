/*
 * Design: Yeldra-inspired — Deep blue/black with neon green accents, anime illustrations
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/hero-anime_9f6f8c56.png";
const LEARNING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/learning-anime_097893cd.png";
const ANALYZER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/analyzer-anime_00b27eab.png";
const EMERGENCY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/emergency-anime_147a2006.png";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AnalyzerSection />
        <HowItWorksSection />
        <LearningSection />
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
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[oklch(0.6_0.2_290)]/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-8">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <Shield className="w-3 h-3" />
                Nonprofit Organization
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.6_0.2_290)] bg-[oklch(0.6_0.2_290)]/10 px-3 py-1.5 rounded-full border border-[oklch(0.6_0.2_290)]/20">
                <Sparkles className="w-3 h-3" />
                AI-Powered
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.05] mb-6">
              Safe and Savvy{" "}
              <span className="text-gradient-green">Seniors</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-4">
              Your friendly guide to staying safe online. Let's check messages
              together and build your digital confidence.
            </p>

            <p className="text-sm text-muted-foreground/70 mb-10">
              You're doing the right thing by checking — scams are getting harder to spot.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#analyzer">
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 h-13 rounded-xl font-semibold glow-green"
                >
                  <Search className="w-4 h-4" />
                  Check a Message
                </Button>
              </a>
              <Link href="/resources">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 text-base px-8 h-13 rounded-xl font-semibold border-border/60 hover:bg-white/5 hover:border-primary/30"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Resources
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-border/30">
              <div>
                <p className="font-display font-bold text-2xl text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Free to Use</p>
              </div>
              <div className="w-px h-10 bg-border/30" />
              <div>
                <p className="font-display font-bold text-2xl text-foreground">AI</p>
                <p className="text-xs text-muted-foreground">Powered Analysis</p>
              </div>
              <div className="w-px h-10 bg-border/30" />
              <div>
                <p className="font-display font-bold text-2xl text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Anime Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-[oklch(0.6_0.2_290)]/20 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 glow-card">
                <img
                  src={HERO_IMG}
                  alt="Digital Guardians — protecting seniors online"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Scam Analyzer Section ─── */
type AnalysisResult = {
  riskLevel: "safe" | "suspicious" | "dangerous";
  confidence: number;
  summary: string;
  redFlags: string[];
  advice: string;
  scamType: string;
};

function AnalyzerSection() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeMutation = trpc.scamAnalyzer.analyze.useMutation({
    onSuccess: (data) => {
      setResult(data as AnalysisResult);
    },
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setResult(null);
    analyzeMutation.mutate({ message: message.trim() });
  };

  const riskConfig = {
    safe: {
      bg: "bg-emerald-950/50",
      border: "border-emerald-500/30",
      icon: CheckCircle,
      iconColor: "text-emerald-400",
      titleColor: "text-emerald-300",
      textColor: "text-emerald-300/80",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      title: "Likely Safe",
    },
    suspicious: {
      bg: "bg-amber-950/50",
      border: "border-amber-500/30",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      titleColor: "text-amber-300",
      textColor: "text-amber-300/80",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      title: "Suspicious — Be Careful",
    },
    dangerous: {
      bg: "bg-red-950/50",
      border: "border-red-500/30",
      icon: ShieldAlert,
      iconColor: "text-red-400",
      titleColor: "text-red-300",
      textColor: "text-red-300/80",
      badgeBg: "bg-red-500/20 text-red-300 border-red-500/30",
      title: "Likely a Scam — Do Not Engage",
    },
  };

  return (
    <section id="analyzer" className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.15_0.03_270)] to-background" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Form */}
          <AnimatedSection>
            <SectionLabel number="01" label="AI Scam Analyzer" />
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4 text-foreground">
              Check a Message for{" "}
              <span className="text-gradient-green">Scams</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              Copy and paste an email, text, or message below. Our AI will
              analyze it and explain if it's safe.
            </p>

            {/* Privacy notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 mb-8">
              <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Your privacy matters:</strong>{" "}
                Messages you paste are analyzed by AI but never stored. We never share your data.
              </p>
            </div>

            <form onSubmit={handleAnalyze}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Paste the email, text, or message you want to check. Include any links or phone numbers mentioned."
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 resize-none mb-4"
              />
              <p className="text-xs text-muted-foreground mb-6">
                Paste the full message — don't worry about formatting.
              </p>
              <Button
                type="submit"
                size="lg"
                className="gap-2 rounded-xl h-12 px-8 font-semibold glow-green"
                disabled={analyzeMutation.isPending || !message.trim()}
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Scan className="w-4 h-4 animate-spin" />
                    AI is Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Check This Message
                  </>
                )}
              </Button>
            </form>

            {/* Error state */}
            {analyzeMutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 rounded-xl border bg-red-950/50 border-red-500/30"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-display font-semibold text-sm mb-1 text-red-300">
                      Analysis Error
                    </h4>
                    <p className="text-sm leading-relaxed text-red-300/80">
                      We couldn't analyze this message right now. Please try again in a moment.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 rounded-xl border overflow-hidden ${riskConfig[result.riskLevel].bg} ${riskConfig[result.riskLevel].border}`}
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    {(() => {
                      const IconComp = riskConfig[result.riskLevel].icon;
                      return (
                        <IconComp
                          className={`w-5 h-5 mt-0.5 shrink-0 ${riskConfig[result.riskLevel].iconColor}`}
                        />
                      );
                    })()}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4
                          className={`font-display font-semibold text-base ${riskConfig[result.riskLevel].titleColor}`}
                        >
                          {riskConfig[result.riskLevel].title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskConfig[result.riskLevel].badgeBg}`}
                        >
                          {result.confidence}% confident
                        </span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${riskConfig[result.riskLevel].textColor}`}
                      >
                        {result.summary}
                      </p>
                    </div>
                  </div>

                  {/* Scam type */}
                  {result.scamType && result.scamType !== "none" && (
                    <div className="mb-4">
                      <span className="text-xs font-medium text-muted-foreground">
                        Identified type:{" "}
                      </span>
                      <span className="text-xs font-semibold text-foreground capitalize">
                        {result.scamType.replace(/-/g, " ")}
                      </span>
                    </div>
                  )}

                  {/* Red flags */}
                  {result.redFlags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-foreground mb-2">
                        Red Flags Found:
                      </p>
                      <ul className="space-y-1.5">
                        {result.redFlags.map((flag, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-muted-foreground"
                          >
                            <span className="text-red-400 mt-0.5 shrink-0">•</span>
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Advice */}
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-xs font-semibold text-foreground mb-1">
                      What to Do:
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {result.advice}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatedSection>

          {/* Right: Image */}
          <AnimatedSection delay={0.15} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-[oklch(0.6_0.2_290)]/15 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 glow-card">
                <img
                  src={ANALYZER_IMG}
                  alt="AI Scam analysis illustration"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
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
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-300 group h-full glow-card">
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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.15_0.03_270)] to-background" />
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[oklch(0.6_0.2_290)]/15 via-transparent to-primary/15 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 glow-card">
                <img
                  src={LEARNING_IMG}
                  alt="Senior learning on tablet"
                  className="w-full h-auto"
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
          <SectionLabel number="04" label="About Us" />
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
              <div className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-300 h-full glow-card">
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
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: What to do */}
          <AnimatedSection>
            <SectionLabel number="05" label="Emergency" />
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
