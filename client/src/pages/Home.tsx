/*
 * Design: Nordic Clarity — Scandinavian Trust Design
 * Page: Home — Main landing page with all sections
 * Palette: Off-white canvas, deep slate text, teal-green accent
 * Typography: Plus Jakarta Sans (display), DM Sans (body), JetBrains Mono (stats)
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/hero-banner-Prnk8pyYx6jNa4RYtyz5Sf.webp";
const LEARNING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/learning-section-8bzcLchTvteHyKyJnmnv5E.webp";
const ANALYZER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/scam-analyzer-PR8sdsqCdLCtfptkFHJcir.webp";
const EMERGENCY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/110291972/eUbA5NSXSrUDToa4RxQdTu/emergency-section-ZYJQBkeLaiZXFmmPEquqf5.webp";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
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
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMG}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 px-3 py-1.5 rounded-full border border-primary/10">
              <Shield className="w-3 h-3" />
              Nonprofit Organization
            </span>
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.1] mb-6">
            Safe and Savvy{" "}
            <span className="text-primary">Seniors</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-4">
            Your friendly guide to staying safe online. Let's check messages
            together and build your digital confidence.
          </p>

          <p className="text-sm text-muted-foreground/80 mb-10">
            You're doing the right thing by checking — scams are getting harder to spot.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#analyzer">
              <Button size="lg" className="gap-2 text-base px-8 h-12 rounded-xl">
                <Search className="w-4 h-4" />
                Check a Message
              </Button>
            </a>
            <Link href="/resources">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-base px-8 h-12 rounded-xl"
              >
                <BookOpen className="w-4 h-4" />
                Browse Resources
              </Button>
            </Link>
          </div>
        </motion.div>
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
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-800",
      textColor: "text-emerald-700",
      badgeBg: "bg-emerald-100 text-emerald-800",
      title: "Likely Safe",
    },
    suspicious: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      titleColor: "text-amber-800",
      textColor: "text-amber-700",
      badgeBg: "bg-amber-100 text-amber-800",
      title: "Suspicious — Be Careful",
    },
    dangerous: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: ShieldAlert,
      iconColor: "text-red-600",
      titleColor: "text-red-800",
      textColor: "text-red-700",
      badgeBg: "bg-red-100 text-red-800",
      title: "Likely a Scam — Do Not Engage",
    },
  };

  return (
    <section
      id="analyzer"
      className="py-24 md:py-32 bg-[oklch(0.97_0.003_90)]"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Form */}
          <AnimatedSection>
            <SectionLabel number="01" label="AI Scam Analyzer" />
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4">
              Check a Message for Scams
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              Copy and paste an email, text, or message below. Our AI will
              analyze it and explain if it's safe.
            </p>

            {/* Privacy notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-8">
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
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none mb-4"
              />
              <p className="text-xs text-muted-foreground mb-6">
                Paste the full message — don't worry about formatting.
              </p>
              <Button
                type="submit"
                size="lg"
                className="gap-2 rounded-xl h-12 px-8"
                disabled={analyzeMutation.isPending || !message.trim()}
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Scan className="w-4 h-4 animate-spin" />
                    AI is Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
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
                className="mt-8 p-6 rounded-xl border bg-red-50 border-red-200"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-display font-semibold text-sm mb-1 text-red-800">
                      Analysis Error
                    </h4>
                    <p className="text-sm leading-relaxed text-red-700">
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
                      return <IconComp className={`w-5 h-5 mt-0.5 shrink-0 ${riskConfig[result.riskLevel].iconColor}`} />;
                    })()}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className={`font-display font-semibold text-base ${riskConfig[result.riskLevel].titleColor}`}>
                          {riskConfig[result.riskLevel].title}
                        </h4>
                        {result.scamType && result.scamType !== "none" && (
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${riskConfig[result.riskLevel].badgeBg}`}>
                            {result.scamType}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${riskConfig[result.riskLevel].textColor}`}>
                        {result.summary}
                      </p>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  {result.confidence > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className={riskConfig[result.riskLevel].textColor}>Confidence</span>
                        <span className={`font-mono font-bold ${riskConfig[result.riskLevel].textColor}`}>
                          {result.confidence}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            result.riskLevel === "safe"
                              ? "bg-emerald-500"
                              : result.riskLevel === "suspicious"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Red flags */}
                  {result.redFlags.length > 0 && (
                    <div className="mb-4">
                      <h5 className={`font-display font-semibold text-xs uppercase tracking-wider mb-2 ${riskConfig[result.riskLevel].titleColor}`}>
                        Warning Signs Found
                      </h5>
                      <ul className="space-y-1.5">
                        {result.redFlags.map((flag, i) => (
                          <li key={i} className={`flex items-start gap-2 text-sm ${riskConfig[result.riskLevel].textColor}`}>
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Advice */}
                  <div className={`p-4 rounded-lg bg-white/50 border ${riskConfig[result.riskLevel].border}`}>
                    <h5 className={`font-display font-semibold text-xs uppercase tracking-wider mb-1.5 ${riskConfig[result.riskLevel].titleColor}`}>
                      What You Should Do
                    </h5>
                    <p className={`text-sm leading-relaxed ${riskConfig[result.riskLevel].textColor}`}>
                      {result.advice}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatedSection>

          {/* Right: Image */}
          <AnimatedSection delay={0.15} className="hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-black/5">
              <img
                src={ANALYZER_IMG}
                alt="Scam analysis illustration"
                className="w-full h-auto"
              />
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
      title: "We Analyze It",
      description:
        "Our system checks for common scam tricks using AI trained on the latest threats.",
    },
    {
      icon: MessageSquareText,
      title: "You Get Clear Advice",
      description:
        "We explain what's wrong (or right) in plain language you can understand.",
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <AnimatedSection className="text-center mb-16">
          <SectionLabel number="02" label="How It Works" />
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
            How We Help You
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.1}>
              <div className="relative p-8 rounded-2xl border border-border/60 bg-card hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group h-full">
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-mono font-bold text-3xl text-primary/20 group-hover:text-primary/40 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
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
    { icon: Mail, label: "Email Basics", count: "2 tutorials" },
    { icon: KeyRound, label: "Passwords", count: "3 tutorials" },
    { icon: ShieldAlert, label: "Spotting Scams", count: "4 tutorials" },
    { icon: Globe, label: "Safe Browsing", count: "2 tutorials" },
  ];

  return (
    <section id="learn" className="py-24 md:py-32 bg-[oklch(0.97_0.003_90)]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-black/5">
              <img
                src={LEARNING_IMG}
                alt="Senior learning on tablet"
                className="w-full h-auto"
              />
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection delay={0.1}>
            <SectionLabel number="03" label="Learning Center" />
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4">
              Learn at Your Own Pace
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Not sure if a message is a scam? Want to learn safer habits? Our
              step-by-step tutorials are designed just for you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {topics.map((topic) => (
                <div
                  key={topic.label}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card hover:shadow-md hover:shadow-black/5 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <topic.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">
                      {topic.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{topic.count}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/resources">
              <Button variant="outline" size="lg" className="gap-2 rounded-xl h-12 px-8">
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
    <section id="about" className="py-24 md:py-32">
      <div className="container">
        <AnimatedSection className="max-w-3xl mb-16">
          <SectionLabel number="04" label="About Us" />
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4">
            About Digital Guardians
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We're here to help seniors feel confident and safe online. We believe
            everyone deserves to enjoy technology without fear.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.08}>
              <div className="p-6 rounded-2xl border border-border/60 bg-card hover:shadow-lg hover:shadow-black/5 transition-all duration-300 h-full">
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
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
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: What to do */}
          <AnimatedSection>
            <SectionLabel number="05" label="Emergency" />
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-6">
              Think You've Been Scammed?
            </h2>

            <div className="space-y-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card/80 border border-border/40"
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
                  className="flex items-center justify-between p-5 rounded-xl border border-border/60 bg-card hover:shadow-md hover:shadow-black/5 transition-all group"
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
                  className="flex items-center justify-between p-5 rounded-xl border border-border/60 bg-card hover:shadow-md hover:shadow-black/5 transition-all group"
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

                <div className="flex items-center justify-between p-5 rounded-xl border border-border/60 bg-card">
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
