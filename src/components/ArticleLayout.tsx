/*
 * ArticleLayout — Reusable layout for Learning Center guide articles.
 * Provides hero, breadcrumb, table of contents, and consistent styling.
 */

import { ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

interface TableOfContentsItem {
  id: string;
  label: string;
}

interface ArticleLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tableOfContents: TableOfContentsItem[];
  children: ReactNode;
}

export default function ArticleLayout({
  title,
  subtitle,
  icon: Icon,
  readTime,
  difficulty,
  tableOfContents,
  children,
}: ArticleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[oklch(0.6_0.2_290)]/10 blur-[100px]" />
          </div>

          <div className="container relative z-10">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
            >
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/#learn" className="hover:text-foreground transition-colors">
                Learning Center
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium">{title}</span>
            </motion.nav>

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mb-8"
            >
              <Link
                href="/#learn"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Learning Center
              </Link>
            </motion.div>

            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    <BookOpen className="w-3 h-3" />
                    {difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {readTime}
                  </span>
                </div>
              </div>

              <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.1] mb-4 text-foreground">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content area */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
              {/* Main content */}
              <div className="article-content max-w-none">
                {children}
              </div>

              {/* Sidebar — Table of Contents */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <AnimatedSection delay={0.2}>
                    <div className="p-6 rounded-2xl border border-border/50 bg-card glow-card">
                      <h3 className="font-display font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
                        In This Guide
                      </h3>
                      <nav className="space-y-1">
                        {tableOfContents.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="block text-sm text-muted-foreground hover:text-primary py-1.5 px-3 rounded-lg hover:bg-primary/5 transition-all"
                          >
                            {item.label}
                          </a>
                        ))}
                      </nav>
                    </div>

                    {/* Related guides CTA */}
                    <div className="mt-6 p-6 rounded-2xl border border-primary/20 bg-primary/5">
                      <h3 className="font-display font-bold text-sm text-foreground mb-2">
                        Need Help?
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                        Use our AI Assistant to check suspicious messages or get tech help.
                      </p>
                      <Link
                        href="/#analyzer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        Try AI Assistant
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </AnimatedSection>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ─── Reusable content building blocks ─── */

export function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <AnimatedSection>
      <section id={id} className="mb-12 scroll-mt-28">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mb-6 text-foreground">
          {title}
        </h2>
        {children}
      </section>
    </AnimatedSection>
  );
}

export function ArticleParagraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-muted-foreground leading-relaxed mb-4 text-[15px]">
      {children}
    </p>
  );
}

export function ArticleTip({
  title,
  children,
  variant = "tip",
}: {
  title: string;
  children: ReactNode;
  variant?: "tip" | "warning" | "important";
}) {
  const styles = {
    tip: "bg-primary/5 border-primary/20 text-primary",
    warning: "bg-amber-500/5 border-amber-500/20 text-amber-400",
    important: "bg-[oklch(0.6_0.2_290)]/5 border-[oklch(0.6_0.2_290)]/20 text-[oklch(0.6_0.2_290)]",
  };

  return (
    <div className={`p-5 rounded-xl border ${styles[variant]} mb-6`}>
      <p className="font-display font-bold text-sm mb-2">{title}</p>
      <div className="text-muted-foreground text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function ArticleCard({
  title,
  children,
  icon: CardIcon,
}: {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="p-5 rounded-xl border border-border/50 bg-card mb-4 glow-card">
      <div className="flex items-start gap-3">
        {CardIcon && (
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/15 mt-0.5">
            <CardIcon className="w-4 h-4 text-primary" />
          </div>
        )}
        <div>
          <h4 className="font-display font-bold text-sm text-foreground mb-1.5">
            {title}
          </h4>
          <div className="text-muted-foreground text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleStepList({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  return (
    <div className="space-y-4 mb-6">
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card glow-card"
        >
          <span className="font-mono font-bold text-sm text-primary/60 mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/15">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="font-display font-bold text-sm text-foreground mb-1">
              {step.title}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleQuiz({
  question,
  options,
  correctIndex,
  explanation,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-[oklch(0.6_0.2_290)]/20 bg-[oklch(0.6_0.2_290)]/5 mb-6">
      <p className="font-display font-bold text-sm text-foreground mb-4">
        🧠 Quick Check: {question}
      </p>
      <div className="space-y-2 mb-4">
        {options.map((opt, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border text-sm ${
              i === correctIndex
                ? "border-primary/30 bg-primary/5 text-foreground"
                : "border-border/30 bg-card/50 text-muted-foreground"
            }`}
          >
            <span className="font-mono text-xs mr-2 text-primary/60">
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
            {i === correctIndex && (
              <span className="ml-2 text-primary text-xs font-semibold">✓ Correct</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Why?</strong> {explanation}
      </p>
    </div>
  );
}
